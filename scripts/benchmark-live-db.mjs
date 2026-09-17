// Explicit live diagnostic: creates one anonymous account, starts/aborts stage 1.
// Never submits rankings, fabricates combat rewards, or spends player gold.
import fs from 'node:fs';
const output=process.argv[2];if(!output)throw Error('Provide output JSON path');
const origin='https://xn--9t4b29x4xb.xn--yq5b.xn--3e0b707e';const cookies=new Map();
async function call(path,data={}){const t=performance.now(),r=await fetch(origin+'/api/v3/'+path,{method:'POST',headers:{'Content-Type':'application/json',origin,cookie:[...cookies].map(([k,v])=>k+'='+v).join('; ')},body:JSON.stringify(data),signal:AbortSignal.timeout(15000)});const json=await r.json();if(!r.ok)throw Error(r.status+': '+json.error);for(const header of r.headers.getSetCookie()){const entry=header.split(';')[0],split=entry.indexOf('=');cookies.set(entry.slice(0,split),entry.slice(split+1))}return {ms:performance.now()-t,json}}
await call('session');const samples=[];let active;
try{for(let i=0;i<23;i++){const status=await call('status?compact=1');const start=await call('operation',{id:crypto.randomUUID(),action:'start',difficulty:0,stage:0});active=start.json.result.run.id;const stop=await call('operation',{id:crypto.randomUUID(),action:'abort',activeId:active});active=null;if(stop.json.profile.gold!==0||stop.json.profile.active)throw Error('Diagnostic state mismatch');if(i>=3)samples.push({statusMs:status.ms,mutationMs:stop.ms});}}
finally{if(active)await call('operation',{id:crypto.randomUUID(),action:'abort',activeId:active})}
const summary={at:new Date().toISOString(),samples:samples.length};for(const key of ['statusMs','mutationMs']){const values=samples.map(s=>s[key]).sort((a,b)=>a-b);summary[key]={median:values[Math.floor(values.length/2)],p95:values[Math.ceil(values.length*.95)-1]}}
fs.writeFileSync(output,JSON.stringify({summary,samples},null,2));console.log(JSON.stringify(summary,null,2));
