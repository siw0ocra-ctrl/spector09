const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const harness=fs.readFileSync('tests/test-client-v3.cjs','utf8').split('const test=s=>')[0];const ctx={require,console,AbortController,structuredClone};vm.createContext(ctx);vm.runInContext(harness,ctx);const test=s=>vm.runInContext('vm.runInContext('+JSON.stringify(s)+',sandbox)',ctx);
for(const difficulty of [0,1,2])for(let level=1;level<=5;level++)for(const aw of [false,...(level===5?[true]:[])]){
test(`assetsReady=true;selected=0;beginLocalRun({id:'gauss',stage:0,difficulty:${difficulty},startWeapon:'gauss'});Math.random=()=>.5;run.weapons.gauss=${level};run.awakened.gauss=${aw};run.chests=[];run.enemies=[{x:200,y:0,hp:1e6,r:20,type:0,speed:0,shot:999}];weaponTick(.01)`);
const count=level>=5?3:level>=3?2:1,scale=count===3?.5:count===2?.65:1;
assert.equal(test('run.bullets.length'),count);assert(Math.abs(test('run.bullets[0].damage/weaponStats("gauss").damage')-scale)<1e-12);assert.equal(test('run.bullets[0].pierce'),aw?5:1);assert.equal(test('run.bullets[0].life'),aw?1.6:1.2);
}
test('run.bullets=run.bullets.slice(1,2);run.spawn=run.next=1e9;run.cooldowns.gauss=999;run.enemies=Array.from({length:6},(_,i)=>({x:65+i*55,y:0,hp:1e6,maxHp:1e6,r:20,type:0,speed:0,shot:999}));for(let i=0;i<90;i++)tick(1/60)');assert.equal(test('run.enemies.filter(e=>e.hp<1e6).length'),5);
test('run.weapons.gauss=2');assert(test('cardGain({id:"w:gauss"},0).includes("2발")'));test('run.weapons.gauss=4');assert(test('cardGain({id:"w:gauss"},0).includes("3발")'));
console.log('PASS: levels 1–5 across all difficulties, per-shot scaling, exact five-target penetration, range and upgrade card descriptions.');
