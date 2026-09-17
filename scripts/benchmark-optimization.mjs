import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
import {performance} from 'node:perf_hooks';
import {DatabaseSync} from 'node:sqlite';
const root=path.resolve(process.argv[2]||'.'),require=createRequire(import.meta.url);
const {api}=await import(pathToFileURL(path.join(root,'server/api.mjs')));
const db=new DatabaseSync(':memory:');for(const f of fs.readdirSync(path.join(root,'drizzle')).filter(f=>f.endsWith('.sql')).sort())db.exec(fs.readFileSync(path.join(root,'drizzle',f),'utf8'));
let queries=0;
function prepare(sql,args=[]){return {bind(...v){return prepare(sql,v)},first:async()=>{queries++;return db.prepare(sql).get(...args)||null},all:async()=>{queries++;return {results:db.prepare(sql).all(...args)}},run:async()=>{queries++;return (/^SELECT/i.test(sql)?{results:db.prepare(sql).all(...args)}:{results:[],meta:db.prepare(sql).run(...args)})}}}
const env={DB:{prepare,async batch(list){db.exec('BEGIN');try{const results=[];for(const s of list)results.push(await s.run());db.exec('COMMIT');return results}catch(e){db.exec('ROLLBACK');throw e}}}};
let cookie='';async function call(endpoint,data){const r=await api(new Request('https://bench.test/api/v3/'+endpoint,{method:data?'POST':'GET',headers:{cookie,origin:'https://bench.test','Content-Type':'application/json'},body:data?JSON.stringify(data):undefined}),env);if(r.headers.get('set-cookie'))cookie=r.headers.get('set-cookie').split(';')[0];const body=await r.text();if(!r.ok)throw Error(body);return {body,json:JSON.parse(body)}}
const player=(await call('session',{})).json.profile.id;
const ins=db.prepare('INSERT INTO rankings_v3 VALUES(?,?,?,?,?,?,?,?,?,?,?)');db.exec('BEGIN');for(let i=0;i<10000;i++)ins.run('r'+i,'p'+Math.floor(i/10),i%3,i%10,'all','Pilot',0,'[]',180000+i,100,1000+i);db.exec('COMMIT');
const median=a=>[...a].sort((x,y)=>x-y)[Math.floor(a.length/2)];
const measurements={};for(const kind of ['status','cashout','rankings']){const times=[],counts=[],bytes=[];for(let i=0;i<35;i++){const state=JSON.parse(db.prepare('SELECT state FROM players_v3 WHERE id=?').get(player).state);state.gold=10000;state.active={id:'bench-round',kind:'rocket',bet:100,started:Date.now()-100,crash:100,autoCashout:100};db.prepare('UPDATE players_v3 SET state=? WHERE id=?').run(JSON.stringify(state),player);queries=0;const t=performance.now();const r=await call(kind==='rankings'?'rankings?difficulty=0&stage=0&weapon=all':kind==='status'?'status?compact=1':'operation?compact=1',kind==='rankings'?undefined:kind==='status'?{}:{id:crypto.randomUUID(),action:'cashout',activeId:'bench-round'});if(i>=5){times.push(performance.now()-t);counts.push(queries);bytes.push(Buffer.byteLength(r.body))}}measurements[kind]={medianMs:median(times),sqlStatements:median(counts),responseBytes:median(bytes)}}
const prefix=fs.readFileSync(path.join(root,'tests/test-client-v3.cjs'),'utf8').split('const test=')[0].replace("fs.readFileSync(path,'utf8')","fs.readFileSync(require('path').join(root,path),'utf8')");
const harness=new Function('require','root',prefix+';return {run:s=>vm.runInContext(s,sandbox)}')(require,root);
const run=harness.run;run('assetsReady=true');
const samples=[];for(let sample=0;sample<12;sample++){run(`selected=0;beginLocalRun({id:'bench',difficulty:0,startWeapon:'gauss'});run.weapons={};run.chests=[];run.spawn=999;run.damageCD=999;run.hp=1e9;run.maxHp=1e9;run.enemies=Array.from({length:180},(_,i)=>({x:Math.cos(i*2.4)*(100+i*2),y:Math.sin(i*2.4)*(100+i*2),r:18,hp:1e12,maxHp:1e12,type:0,speed:0,shot:999,angle:0}));run.bullets=Array.from({length:200},(_,i)=>({x:Math.cos(i)*200,y:Math.sin(i)*200,vx:0,vy:0,life:1e9,homing:true,hit:new Set(),pierce:1e6,damage:1,r:4,weaponId:'gauss'}));`);const t=performance.now();run('for(let i=0;i<60;i++)tick(1/60)');if(sample>=2)samples.push((performance.now()-t)/60)}measurements.combat={medianMsPerTick:median(samples),enemies:180,homingBullets:200,framesPerSample:60};
console.log(JSON.stringify(measurements,null,2));if(process.argv[3])fs.writeFileSync(process.argv[3],JSON.stringify(measurements,null,2));
