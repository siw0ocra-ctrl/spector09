import assert from 'node:assert/strict';import fs from 'node:fs';import {DatabaseSync} from 'node:sqlite';import {api,authorizeRealtime,attachRealtime} from '../server/api.mjs';
const db=new DatabaseSync(':memory:');for(const file of fs.readdirSync('drizzle').filter(x=>x.endsWith('.sql')).sort())db.exec(fs.readFileSync('drizzle/'+file,'utf8'));
function prepare(sql,args=[]){return {bind(...values){return prepare(sql,values)},first:async()=>db.prepare(sql).get(...args)||null,all:async()=>({results:db.prepare(sql).all(...args)}),run:async()=>db.prepare(sql).run(...args)}}
const env={SAVE_KEY:Buffer.alloc(32,7).toString('base64'),DB:{prepare,async batch(statements){db.exec('BEGIN');try{const result=[];for(const s of statements)result.push(await s.run());db.exec('COMMIT');return result}catch(e){db.exec('ROLLBACK');throw e}}}};
let cookie='',now=Date.now();Date.now=()=>now;
async function call(path,data={},ck=cookie){const r=await api(new Request('https://game.test/api/'+path,{method:path.includes('?')?'GET':'POST',headers:{'Content-Type':'application/json',cookie:ck,origin:'https://game.test'},body:path.includes('?')?undefined:JSON.stringify(data)}),env);return {status:r.status,json:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]}}
const op=(action,fields={},id=crypto.randomUUID())=>call('v3/operation',{id,action,...fields});

let session=await call('v3/session');cookie=session.cookie;const player=session.json.profile.id;
const makeRequest=(origin='https://game.test',ck=cookie)=>new Request('https://game.test/api/v3/live',{headers:{origin,cookie:ck,upgrade:'websocket'}});
await assert.rejects(()=>authorizeRealtime(makeRequest('https://attacker.test'),env),e=>e.status===403);await assert.rejects(()=>authorizeRealtime(makeRequest('https://game.test',''),env),e=>e.status===401);
const req=makeRequest(),row=await authorizeRealtime(req,env),handlers={},messages=[];const socket={send:s=>messages.push(JSON.parse(s)),close(){},addEventListener:(name,fn)=>handlers[name]=fn};const cleanup=attachRealtime(socket,req,env,row);assert.equal(messages[0].type,'ready');
await handlers.message({data:JSON.stringify({id:'status-test',path:'status',data:{}})});const response=messages.find(m=>m.id==='status-test');assert.equal(response.status,200);assert.equal(response.profile.id,player);assert(!response.profile.recovery_hash);
await handlers.message({data:JSON.stringify({id:'recovery-test',path:'operation',data:{id:crypto.randomUUID(),action:'recovery'}})});assert.equal(messages.find(m=>m.id==='recovery-test').status,400);
await handlers.message({data:JSON.stringify({id:'unauthorized-path',path:'recover',data:{}})});assert(messages.find(m=>m.id==='unauthorized-path').status>=400);cleanup();
console.log('PASS: WebSocket origin/session authorization, bound player profile, path allowlist, recovery restriction, clean disconnect.');
