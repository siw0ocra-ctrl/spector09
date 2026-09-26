import assert from 'node:assert/strict';
import fs from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import {api} from '../server/api.mjs';
const db=new DatabaseSync(':memory:');
for(const f of fs.readdirSync('drizzle').filter(f=>f.endsWith('.sql')).sort())db.exec(fs.readFileSync('drizzle/'+f,'utf8'));
let trips=0,failSession=false;
function prepare(sql,args=[]){const execute=()=>{if(failSession&&sql.startsWith('INSERT INTO sessions_v3'))throw Error('Injected session write failure');const s=db.prepare(sql);return /^SELECT/i.test(sql)?{results:s.all(...args)}:{results:[],meta:s.run(...args)}};return {bind(...v){return prepare(sql,v)},execute,first:async()=>{trips++;return execute().results[0]||null},all:async()=>{trips++;return execute()},run:async()=>{trips++;return execute()}}}
const env={DB:{prepare,async batch(list){trips++;db.exec('BEGIN');try{const r=list.map(s=>s.execute());db.exec('COMMIT');return r}catch(e){db.exec('ROLLBACK');throw e}}}};
async function call(cookie=''){const r=await api(new Request('https://test.invalid/api/v3/session',{method:'POST',headers:{cookie,'Content-Type':'application/json'},body:'{}'}),env);return {status:r.status,cookie:r.headers.get('set-cookie'),timing:r.headers.get('server-timing'),body:await r.json()}}
const created=await call();assert.equal(created.status,200);assert.equal(trips,1);assert.match(created.timing,/transaction;dur=/);assert(!created.timing.includes('titles;'));
const p=created.body.profile;assert.equal(p.gold,0);assert.equal(p.rank,0);assert.deepEqual(p.titles,{owned:[],eligible:[],best:{},equipped:null});assert.equal(p.active,null);
assert.match(created.cookie,/HttpOnly; Secure; SameSite=Strict/);
const loaded=await call(created.cookie.split(';')[0]);assert.equal(loaded.status,200);const normalized=p=>{const {titleCheckedAt,...rest}=p;return rest};assert.deepEqual(normalized(loaded.body.profile),normalized(p));assert.equal(loaded.cookie,null);
const counts=()=>[db.prepare('SELECT COUNT(*) n FROM players_v3').get().n,db.prepare('SELECT COUNT(*) n FROM sessions_v3').get().n];
const before=counts();failSession=true;const failed=await call();assert.equal(failed.status,503);assert.equal(failed.cookie,null);assert.deepEqual(counts(),before);
failSession=false;const retry=await call();assert.equal(retry.status,200);assert.deepEqual(counts(),before.map(n=>n+1));
const parallel=await Promise.all(Array.from({length:4},()=>call()));assert(parallel.every(r=>r.status===200));assert.equal(new Set(parallel.map(r=>r.body.profile.id)).size,4);assert.deepEqual(counts(),before.map(n=>n+5));
console.log('PASS: signup uses one atomic DB trip, complete initial profile, valid session, rollback without cookie/orphan player, retry and independent concurrent signups.');
