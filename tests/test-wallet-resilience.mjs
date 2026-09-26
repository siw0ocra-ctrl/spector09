import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {DatabaseSync} from 'node:sqlite';
import {api} from '../server/api.mjs';

// Real API and SQLite transactions; transport faults are injected after commit.
const db=new DatabaseSync(':memory:');
for(const file of fs.readdirSync('drizzle').filter(x=>x.endsWith('.sql')).sort())db.exec(fs.readFileSync('drizzle/'+file,'utf8'));
let failAfterWrite=false;
function prepare(sql,args=[]){return {bind(...v){return prepare(sql,v)},first:async()=>db.prepare(sql).get(...args)||null,all:async()=>({results:db.prepare(sql).all(...args)}),run:async()=>/^SELECT/i.test(sql)?{results:db.prepare(sql).all(...args)}:{results:[],meta:db.prepare(sql).run(...args)}}}
const env={SAVE_KEY:Buffer.alloc(32,9).toString('base64'),DB:{prepare,async batch(list){db.exec('BEGIN');try{const out=[];for(let i=0;i<list.length;i++){out.push(await list[i].run());if(failAfterWrite&&i===0){failAfterWrite=false;throw Error('Injected storage failure')}}db.exec('COMMIT');return out}catch(e){db.exec('ROLLBACK');throw e}}}};
let cookie='';
async function request(path,data={},ck=cookie){const response=await api(new Request('https://wallet.test/api/v3/'+path,{method:'POST',headers:{origin:'https://wallet.test',cookie:ck,'Content-Type':'application/json'},body:JSON.stringify(data)}),env);return {status:response.status,body:await response.json(),cookie:response.headers.get('set-cookie')?.split(';')[0]}}
let session=await request('session');cookie=session.cookie;const player=session.body.profile.id;
const state=()=>JSON.parse(db.prepare('SELECT state FROM players_v3 WHERE id=?').get(player).state);
function seed(gold){const s=state();s.gold=gold;db.prepare('UPDATE players_v3 SET state=? WHERE id=?').run(JSON.stringify(s),player)}
const op=(action,fields={},id=crypto.randomUUID())=>request('operation',{id,action,...fields});
seed(1000);
const prefix=fs.readFileSync('tests/test-client-v3.cjs','utf8').split('const test=s=>')[0];
const sandbox=new Function('require',prefix+';return sandbox;')(createRequire(import.meta.url));
const evaluate=s=>vm.runInContext(s,sandbox),stored=new Map();
sandbox.sessionStorage={getItem:k=>stored.get(k)||null,setItem:(k,v)=>stored.set(k,v),removeItem:k=>stored.delete(k)};
let loseResponse=false,holdResolve=null,hold=false,requests=[];
sandbox.walletTransport=async(path,data)=>{requests.push(structuredClone(data));if(hold)await new Promise(resolve=>holdResolve=resolve);const r=await request(path,data);if(loseResponse){loseResponse=false;throw Error('Response lost after server commit')}if(r.status>=400)throw Object.assign(Error(r.body.error),{status:r.status});return r.body};
evaluate('accountFetch=walletTransport;accountBusy=false;accountSyncing=false;pendingOperation=null');
sandbox.profile=(await request('session')).body.profile;evaluate('applyProfile(profile)');
loseResponse=true;
await evaluate("transact('buy',{category:'research',item:'damage'})");
assert.equal(state().gold,920);assert.equal(evaluate('save.gold'),1000);assert(stored.has('sector09-v3-pending'));
const pending=JSON.parse(stored.get('sector09-v3-pending'));assert.equal(evaluate('accountReady'),false);
// Reload restores the durable operation ID; a repeated request must not charge twice.
evaluate("pendingOperation=JSON.parse(sessionStorage.getItem('sector09-v3-pending'))");
await evaluate('sendPending()');assert.equal(state().gold,920);assert.equal(evaluate('save.gold'),920);assert.equal(evaluate("$('gold').textContent"),'920');assert.equal(requests[0].id,requests[1].id);assert.equal(stored.has('sector09-v3-pending'),false);
hold=true;const first=evaluate("transact('buy',{category:'research',item:'hp'})");const count=requests.length;
assert.equal(await evaluate("transact('buy',{category:'research',item:'hp'})"),null);assert.equal(requests.length,count);hold=false;holdResolve();await first;assert.equal(state().upgrades.hp,1);
// The first SQL write must roll back together with its receipt on storage failure.
const before=state().gold,id=crypto.randomUUID();failAfterWrite=true;let r=await op('buy',{category:'research',item:'damage'},id);assert.equal(r.status,503);assert.equal(state().gold,before);assert.equal(db.prepare('SELECT count(*) n FROM operations_v3 WHERE id=?').get(id).n,0);r=await op('buy',{category:'research',item:'damage'},id);assert.equal(r.status,200);const charged=state().gold;await op('buy',{category:'research',item:'damage'},id);assert.equal(state().gold,charged);
// Separate tab IDs compete for the final affordable upgrade; no negative balance.
seed(100);const results=await Promise.all([op('buy',{category:'research',item:'regen'}),op('buy',{category:'research',item:'regen'})]);assert.equal(results.filter(r=>r.status===200).length,1);assert(state().gold>=0);
const recovery=await op('recovery');const restored=await request('recover',{code:recovery.body.result.code},'');assert.equal(restored.body.profile.id,player);assert.equal(restored.body.profile.gold,state().gold);assert.deepEqual(restored.body.profile.upgrades,state().upgrades);
assert.equal((await request('session',{},restored.cookie)).body.profile.id,player);
console.log('PASS: post-commit response loss, durable retry ID after reload, header balance reconciliation, rapid-click exclusion, transaction rollback, same-ID replay, last-balance cross-tab contention, recovery into a separate session.');
seed(10000);sandbox.profile=(await request('session')).body.profile;evaluate('applyProfile(profile);accountSyncing=false');
requests=[];await evaluate('syncAccount()');assert.equal(requests.length,1);assert.equal(requests[0].action,'sync');
loseResponse=true;await evaluate("transact('buy',{category:'research',item:'hp'})");const confirmed=state().gold;requests=[];
await evaluate('syncAccount()');assert.equal(requests.length,1);assert.equal(requests[0].action,'buy');assert.equal(state().gold,confirmed);assert.equal(evaluate('save.gold'),confirmed);
console.log('PASS: connected refresh uses one sync; uncertain purchase recovery reuses its response without redundant session/sync requests.');
