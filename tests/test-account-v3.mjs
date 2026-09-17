import assert from 'node:assert/strict';import fs from 'node:fs';import {DatabaseSync} from 'node:sqlite';import {api} from '../server/api.mjs';
const db=new DatabaseSync(':memory:');for(const file of fs.readdirSync('drizzle').filter(x=>x.endsWith('.sql')).sort())db.exec(fs.readFileSync('drizzle/'+file,'utf8'));
function prepare(sql,args=[]){return {bind(...values){return prepare(sql,values)},first:async()=>db.prepare(sql).get(...args)||null,all:async()=>({results:db.prepare(sql).all(...args)}),run:async()=>db.prepare(sql).run(...args)}}
const env={SAVE_KEY:Buffer.alloc(32,7).toString('base64'),DB:{prepare,async batch(statements){db.exec('BEGIN');try{const result=[];for(const s of statements)result.push(await s.run());db.exec('COMMIT');return result}catch(e){db.exec('ROLLBACK');throw e}}}};
let cookie='',now=Date.now();Date.now=()=>now;
async function call(path,data={},ck=cookie){const r=await api(new Request('https://game.test/api/'+path,{method:path.includes('?')?'GET':'POST',headers:{'Content-Type':'application/json',cookie:ck,origin:'https://game.test'},body:path.includes('?')?undefined:JSON.stringify(data)}),env);return {status:r.status,json:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]}}
const op=(action,fields={},id=crypto.randomUUID())=>call('v3/operation',{id,action,...fields});
async function compactCall(path,data={}){const response=await api(new Request('https://game.test/api/v3/'+path+'?compact=1',{method:'POST',headers:{'Content-Type':'application/json',cookie,origin:'https://game.test'},body:JSON.stringify(data)}),env);assert.equal(response.status,200);return response.json()}
let r=await call('v3/session');assert.equal(r.status,200);cookie=r.cookie;const player=r.json.profile.id;assert.equal(r.json.profile.gold,0);assert.equal(r.json.profile.rank,0);assert(!r.json.profile.recovery_hash);
assert.equal((await call('run/start',{stage:0})).status,410);assert.equal((await op('buy',{category:'research',item:'hp'})).status,400);assert.equal((await op('start',{difficulty:1,stage:0,weapon:'gauss'})).status,400);
let start=await op('start',{difficulty:0,stage:0});assert.equal(start.status,200);const run=start.json.result.run;assert.equal((await op('start',{difficulty:0,stage:0})).status,409);assert.equal((await op('buy',{category:'research',item:'hp'})).status,409);
now+=190000;const finishId=crypto.randomUUID(),finishData={runId:run.id,outcome:'clear',elapsedMs:185000,kills:101,killTypes:[100,0,0,1],goldChests:2,goldSupplies:0,weapons:{gauss:5},skills:{rapid:3},level:9};r=await op('finish',finishData,finishId);assert.equal(r.status,200,JSON.stringify(r));assert.equal(r.json.profile.gold,490);assert.equal(r.json.result.settlement.finishId,finishId);r=await op('finish',finishData,finishId);assert.equal(r.json.profile.gold,490);
const buyId=crypto.randomUUID();r=await op('buy',{category:'research',item:'hp'},buyId);assert.equal(r.json.profile.gold,425);r=await op('buy',{category:'research',item:'hp'},buyId);assert.equal(r.json.profile.upgrades.hp,1);assert.equal((await op('buy',{category:'research',item:'damage'},buyId)).status,409);
r=await op('rank',{finishId,nickname:'테스트'});assert.equal(r.status,200,JSON.stringify(r));r=await call('v3/rankings?difficulty=0&stage=0&weapon=all');assert.equal(r.json.rows.length,1);assert.equal(r.json.rows[0].weapons[0].awake,true);
const recoveryId=crypto.randomUUID();r=await op('recovery',{},recoveryId);assert.equal(r.status,200);const code=r.json.result.code;assert.match(code,/^S09-[a-f0-9]{64}$/);assert(!db.prepare('SELECT result FROM operations_v3 WHERE id=?').get(recoveryId).result.includes(code));assert.equal((await op('recovery',{},recoveryId)).json.result.code,code);r=await call('v3/recover',{code},'');assert.equal(r.json.profile.id,player);assert(r.cookie);const code2=(await op('recovery')).json.result.code;assert.notEqual(code2,code);assert.equal((await call('v3/recover',{code},'')).status,400);assert.equal((await call('v3/recover',{code:code2},'')).status,200);
r=await op('plinko',{bet:100});assert.equal(r.status,200);assert.equal(r.json.profile.gold,325);const active=r.json.profile.active;now+=4000;r=await op('sync');const balance=r.json.profile.gold;assert.equal(r.json.profile.active,null);assert(r.json.profile.lastSettlement.paid>=20);r=await op('sync');assert.equal(r.json.profile.gold,balance);
r=await op('rocket',{bet:100});assert.equal(r.status,200);assert(!('crash' in r.json.profile.active));const rid=r.json.profile.active.id;now+=100000;r=await op('cashout',{activeId:rid});assert.equal(r.status,200);const settled=r.json.profile.gold;r=await op('sync');assert.equal(r.json.profile.gold,settled);
// Fresh migration removed only the old ranking table; it cannot be cleared on startup.
assert(!db.prepare("SELECT name FROM sqlite_master WHERE name='scores'").get());assert.equal(db.prepare('SELECT count(*) AS n FROM rankings_v3').get().n,1);
console.log('PASS: fresh accounts, old API rejection, gating, single active run, settlement replay, price authority, receipt collision, rankings, hashed/reissued recovery, server plinko/rocket, one-time ranking migration.');
// Upgrade an existing v3 account in place; purchases remain server-priced and idempotent.
let legacy=JSON.parse(db.prepare('SELECT state FROM players_v3 WHERE id=?').get(player).state);delete legacy.titles;legacy.gold=50000;db.prepare('UPDATE players_v3 SET state=? WHERE id=?').run(JSON.stringify(legacy),player);
const titleRequest=crypto.randomUUID();r=await op('buy',{category:'title',item:'void',price:1},titleRequest);assert.equal(r.status,200);assert.equal(r.json.profile.gold,35000);assert.equal(r.json.profile.titles.equipped,'void');r=await op('buy',{category:'title',item:'void',price:1},titleRequest);assert.equal(r.json.profile.gold,35000);assert.equal(r.json.profile.titles.owned.length,1);
assert.equal((await op('buy',{category:'title',item:'rank1'})).status,400);assert.equal((await op('equipTitle',{item:'guardian'})).status,400);
r=await call('v3/rankings?difficulty=0&stage=0&weapon=all');assert.equal(r.json.rows[0].title,'void');
r=await op('claimTitles');assert.equal(r.status,200);assert.equal(r.json.result.best[0],1);assert.deepEqual(r.json.result.eligible,['normal25','normal10','normal3','normal1']);assert.deepEqual(r.json.profile.titles.owned,['void']);
assert.equal((await op('equipTitle',{item:'hard1'})).status,400);
await op('equipTitle',{item:'normal1'});r=await call('v3/rankings?difficulty=0&stage=0&weapon=all');assert.equal(r.json.rows[0].title,'normal1');
for(let i=0;i<25;i++)db.prepare('INSERT INTO rankings_v3 VALUES(?,?,?,?,?,?,?,?,?,?,?)').run('rival'+i,'rival'+i,0,0,'all','Rival',0,'[]',180000+i,1,now);
r=await call('v3/titles');assert.equal(r.json.profile.titles.equipped,null);assert.deepEqual(r.json.profile.titles.eligible,[]);assert.equal((await op('equipTitle',{item:'normal1'})).status,400);
legacy=JSON.parse(db.prepare('SELECT state FROM players_v3 WHERE id=?').get(player).state);legacy.titles={owned:['void','rank1','rank25'],equipped:'rank1'};db.prepare('UPDATE players_v3 SET state=? WHERE id=?').run(JSON.stringify(legacy),player);
r=await op('claimTitles');assert.deepEqual(r.json.profile.titles.owned,['void']);assert.equal(r.json.profile.titles.equipped,null);assert.equal(r.json.profile.gold,35000);
await op('equipTitle',{item:'void'});r=await call('v3/titles');assert.equal(r.json.profile.titles.equipped,'void');
console.log('PASS: purchased titles permanent, live eligibility, difficulty isolation, rank loss revokes equip/display, legacy awards removed without wallet changes.');
// Auto cashout resolves the first event even when polling resumes after both events.
const setRocket=(crash,target,age)=>{const row=db.prepare('SELECT state FROM players_v3 WHERE id=?').get(player),s=JSON.parse(row.state);s.gold=1000;s.active={id:'auto-test',kind:'rocket',bet:100,started:now-age,crash,autoCashout:target};db.prepare('UPDATE players_v3 SET state=? WHERE id=?').run(JSON.stringify(s),player)};
setRocket(3,2,100000);r=await op('sync');assert.equal(r.json.result.settlement.paid,200);assert.equal(r.json.result.settlement.multiplier,2);assert.equal(r.json.profile.gold,1200);r=await op('sync');assert.equal(r.json.profile.gold,1200);
setRocket(1.5,2,100000);r=await op('sync');assert.equal(r.json.result.settlement.paid,0);assert.equal(r.json.result.settlement.multiplier,1.5);
setRocket(2,2,100000);r=await op('sync');assert.equal(r.json.result.settlement.paid,0);
setRocket(3,2,1000);r=await op('cashout',{activeId:'auto-test'});assert(r.json.result.settlement.paid>=100&&r.json.result.settlement.paid<200);
for(const autoCashout of [1,101,1.001,'invalid']){r=await op('rocket',{bet:100,autoCashout});assert.equal(r.status,400)}
// Authentication/database processing time must not move the arrival-time cashout.
setRocket(1.5,2,1000);const oldPrepare=env.DB.prepare;let delayed=false;env.DB.prepare=(sql,...args)=>{if(!delayed&&sql.includes('FROM sessions_v3')){delayed=true;now+=10000}return oldPrepare(sql,...args)};r=await op('cashout',{activeId:'auto-test'});env.DB.prepare=oldPrepare;assert(r.json.result.settlement.paid>0);
console.log('PASS: exact auto target after delayed polling, earlier crash/tie loss, manual early exit, target validation, cashout arrival time excludes auth delay.');
setRocket(3,2,1000);let sqlCount=0;env.DB.prepare=(...args)=>{sqlCount++;return oldPrepare(...args)};
let lean=await compactCall('status');assert.equal(sqlCount,1);assert.equal(lean.profile.titlesUnchanged,true);assert(!('titles' in lean.profile));assert(!('crash' in lean.profile.active));assert(!('seed' in lean.profile.active));
const leanCashout={id:crypto.randomUUID(),action:'cashout',activeId:'auto-test'};
lean=await compactCall('operation',leanCashout);const leanBalance=lean.profile.gold;
assert(lean.result.settlement.paid>0);assert.equal((await compactCall('operation',leanCashout)).profile.gold,leanBalance);
assert.equal((await call('v3/operation',leanCashout)).json.profile.gold,leanBalance);
assert((await compactCall('operation',{id:crypto.randomUUID(),action:'equipTitle',item:null})).profile.titles);
env.DB.prepare=oldPrepare;
console.log('PASS: compact status uses one query, omits hidden outcome, cashout replays across full/compact responses without double credit, title actions always return full eligibility.');
