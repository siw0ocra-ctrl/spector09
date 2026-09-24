const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
// Reuse the DOM harness; compare the actual simulation with/without the presentation hooks.
const harness=fs.readFileSync('tests/test-client-v3.cjs','utf8').split('const test=s=>')[0];
function simulation(visual){const context={require,console,AbortController,structuredClone};vm.createContext(context);vm.runInContext(harness.replace(",'dist/assets/combat-visuals.js'",visual?",'dist/assets/combat-visuals.js'":'').replace(",'dist/assets/attack-skins.js'",visual?",'dist/assets/attack-skins.js'":''),context);return code=>vm.runInContext('vm.runInContext('+JSON.stringify(code)+',sandbox)',context);}
const baseline=simulation(false),visual=simulation(true);
for(const id of ['gauss','shotgun','laser','missile','nova','drone','flame','lightning'])for(const aw of [false,true]){
 const setup=`letSeed=7;Math.random=()=>{letSeed=(letSeed*16807)%2147483647;return letSeed/2147483647};assetsReady=true;selected=0;beginLocalRun({id:'test',stage:0,difficulty:0,startWeapon:'${id}'});run.weapons['${id}']=5;run.awakened['${id}']=${aw};run.spawn=999;run.chests=[];run.hp=run.maxHp=1e9;run.next=1e9;run.enemies=Array.from({length:8},(_,i)=>({x:65+i*22,y:(i%3-1)*35,hp:1e7,maxHp:1e7,r:20,type:i%3,speed:0,shot:99,angle:0}));for(let i=0;i<160;i++)tick(.02);JSON.stringify({enemies:run.enemies.map(e=>[e.hp,e.x,e.y,e.slow]),damage:run.weaponDamage,bullets:run.bullets.map(b=>[b.x,b.y,b.life,b.damage,b.pierce]),cooldowns:run.cooldowns,gold:run.gold,t:run.t,seed:letSeed})`;
 assert.equal(visual(setup),baseline(setup),id+' '+aw+' changed simulation');
}
visual(`for(let i=0;i<500;i++)visualEvent('impact',0,0,'gauss')`);assert.equal(visual('combatVisuals.events.length'),96);
const before=visual('combatVisuals.events[0].age');visual('run.paused=true;tick(.1)');assert.equal(visual('combatVisuals.events[0].age'),before);
visual('beginLocalRun({id:"next",stage:0,difficulty:0,startWeapon:"gauss"});run.paused=false;tick(.01)');assert(visual('combatVisuals.events.length')<96);
console.log('PASS: all 8 normal/awakened weapons preserve damage, projectile motion, cooldowns and RNG; effects capped, pause-safe and reset between runs.');
for(const aw of [false,true]){
 visual(`beginLocalRun({id:'flame',stage:0,difficulty:0,startWeapon:'flame'});run.spawn=999;run.chests=[];run.awakened.flame=${aw};run.enemies=[{x:65,y:0,hp:1e8,maxHp:1e8,r:20,type:0,speed:0,shot:99,angle:0,hit:0}];for(let i=0;i<60;i++)tick(1/60);`);
 for(let i=0;i<120;i++){visual('tick(1/60)');assert(visual('combatVisuals.flame.opacity')>.98,'Flame should stay visible between damage ticks');}
 assert.equal(visual('run.fx.filter(f=>f.line&&f.weaponId==="flame").length'),0);
 visual('run.enemies=[];for(let i=0;i<150;i++)tick(1/60)');assert.equal(visual('combatVisuals.flame'),null);
}
console.log('PASS: normal and awakened flames remain continuous between attacks and fade out after firing stops.');
