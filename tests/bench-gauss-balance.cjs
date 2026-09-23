const fs=require('fs'),vm=require('vm');
const harness=fs.readFileSync('tests/test-client-v3.cjs','utf8').split('const test=s=>')[0];
const context={require,console,AbortController,structuredClone};vm.createContext(context);vm.runInContext(harness,context);
const test=s=>vm.runInContext('vm.runInContext('+JSON.stringify(s)+',sandbox)',context);
const rows=[];
for(const aw of [false,true])for(const id of ['gauss','shotgun','laser','missile','nova','drone','flame','lightning']){
const row={id,aw};for(const scenario of ['boss','line','surround'])row[scenario]=test(`assetsReady=true;selected=0;beginLocalRun({id:'bench',stage:0,difficulty:0,startWeapon:'${id}'});Math.random=()=>.5;run.weapons['${id}']=5;run.awakened['${id}']=${aw};run.skills.rapid=3;run.spawn=1e9;run.next=1e9;run.hp=run.maxHp=1e9;run.chests=[];run.enemies=Array.from({length:${scenario==='boss'?1:24}},(_,i)=>({x:${scenario==='boss'?'90':scenario==='line'?'65+(i%8)*45':'Math.cos(i*Math.PI/12)*110'},y:${scenario==='line'?'(Math.floor(i/8)-1)*28':scenario==='surround'?'Math.sin(i*Math.PI/12)*110':'0'},r:${scenario==='boss'?45:18},hp:1e9,maxHp:1e9,type:0,speed:0,shot:1e9,angle:0}));for(let i=0;i<1800;i++)tick(1/60);Math.round((run.weaponDamage['${id}']||0)/30)`);rows.push(row)}
console.log(JSON.stringify(rows,null,2));
