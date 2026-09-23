import fs from 'node:fs';
// Run the existing SQLite API harness in an isolated module, before its scenario tests.
const prefix=fs.readFileSync('tests/test-account-v3.mjs','utf8').split('let r=await call')[0].replace("'../server/api.mjs'",JSON.stringify(new URL('../server/api.mjs',import.meta.url).href));
const cases=`
let r=await call('v3/session');cookie=r.cookie;
let start=await op('start',{difficulty:0,stage:0,combatRules:2});assert.equal(start.status,200);assert.equal(start.json.result.run.combatRules,2);now+=190000;
const data={runId:start.json.result.run.id,outcome:'clear',elapsedMs:185000,kills:101,killTypes:[100,0,0,1],goldChests:2,goldSupplies:0,weapons:{gauss:1,shotgun:5},skills:{wealth:3},level:9,wealthLedger:[{tier:0,killTypes:[5,0,0,0],goldChests:0,goldSupplies:0},{tier:1,killTypes:[15,0,0,0],goldChests:1,goldSupplies:0},{tier:3,killTypes:[30,0,0,0],goldChests:1,goldSupplies:0}]};
for(const mutate of [x=>x.wealthLedger=[],x=>x.wealthLedger[0].tier=4,x=>x.wealthLedger[0].killTypes[0]=0,x=>x.wealthLedger[1].killTypes[0]=4,x=>x.wealthLedger[2].goldChests=3,x=>x.skills.wealth=6]){const bad=structuredClone(data);mutate(bad);assert.equal((await op('finish',bad)).status,400)}
const id=crypto.randomUUID();r=await op('finish',data,id);assert.equal(r.status,200,JSON.stringify(r));
// 10 + 50*1.10 + 30*1.21 + 220*1.345 = 397.2 combat + 180 fixed clear reward.
assert.equal(r.json.result.settlement.paid,577);assert.equal(r.json.result.settlement.weapons.find(w=>w.id==='shotgun').awake,true);
assert.equal((await op('finish',data,id)).json.profile.gold,577);
start=await op('start',{difficulty:0,stage:0});now+=190000;
const legacy={...data,runId:start.json.result.run.id,skills:{power:3},wealthLedger:undefined};r=await op('finish',legacy);assert.equal(r.status,200);assert.equal(r.json.result.settlement.paid,490);assert.equal(r.json.result.settlement.weapons.find(w=>w.id==='shotgun').awake,true);
start=await op('start',{difficulty:0,stage:0,combatRules:2});now+=190000;r=await op('finish',{...legacy,runId:start.json.result.run.id});assert.equal(r.status,200);assert.equal(r.json.result.settlement.weapons.find(w=>w.id==='shotgun').awake,false);
console.log('PASS: server acquisition-segment gold/rarity, fixed reward exclusion, invalid ledger rejection, replay safety and legacy/new awakening compatibility.');
`;
await import('data:text/javascript;base64,'+Buffer.from(prefix+cases).toString('base64'));
