const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const harness=fs.readFileSync('tests/test-client-v3.cjs','utf8').split('const test=s=>')[0];const ctx={require,console,AbortController,structuredClone};vm.createContext(ctx);vm.runInContext(harness,ctx);const test=s=>vm.runInContext('vm.runInContext('+JSON.stringify(s)+',sandbox)',ctx);
for(const difficulty of [0,1,2])for(let level=1;level<=5;level++)for(const aw of [false,...(level===5?[true]:[])]){
test(`assetsReady=true;selected=0;beginLocalRun({id:'gauss',stage:0,difficulty:${difficulty},startWeapon:'gauss'});Math.random=()=>.5;run.weapons.gauss=${level};run.awakened.gauss=${aw};run.chests=[];run.enemies=[{x:200,y:0,hp:1e6,r:20,type:0,speed:0,shot:999}];weaponTick(.01)`);
const count=level>=5?3:level>=3?2:1,scale=count===3?.5:count===2?.65:1;
assert.equal(test('run.bullets.length'),count);assert(Math.abs(test('run.bullets[0].damage/weaponStats("gauss").damage')-scale)<1e-12);assert.equal(test('run.bullets[0].pierce'),1);assert.equal(test('run.bullets[0].life'),1.2);
}
test('run.gaussBursts=[];run.bullets=run.bullets.slice(1,2);run.spawn=run.next=1e9;run.cooldowns.gauss=999;run.enemies=Array.from({length:6},(_,i)=>({x:65+i*55,y:0,hp:1e6,maxHp:1e6,r:20,type:0,speed:0,shot:999}));for(let i=0;i<90;i++)tick(1/60)');assert.equal(test('run.enemies.filter(e=>e.hp<1e6).length'),1);
test('run.weapons.gauss=2');assert(test('cardGain({id:"w:gauss"},0).includes("2발")'));test('run.weapons.gauss=4');assert(test('cardGain({id:"w:gauss"},0).includes("3발")'));
console.log('PASS: levels 1–5 across all difficulties, per-shot scaling, no penetration, range and upgrade card descriptions.');
test(`beginLocalRun({id:'burst',difficulty:0,startWeapon:'gauss'});run.weapons.gauss=5;run.awakened.gauss=true;run.chests=[];run.enemies=[{x:200,y:0,hp:1e6,r:20,type:0,speed:0,shot:999}];weaponTick(.01);run.cooldowns.gauss=999;var firstAngles=run.bullets.map(b=>Math.atan2(b.vy,b.vx));var firstDamage=run.bullets[0].damage;run.paused=true;updateGaussBursts(1)`);
assert.equal(test('run.bullets.length'),3);assert.equal(test('run.gaussBursts.length'),1);
test('run.paused=false;updateGaussBursts(.08)');assert.equal(test('run.bullets.length'),3);
test('run.enemies=[];run.angle=2;updateGaussBursts(.01)');assert.equal(test('run.bullets.length'),6);assert.equal(test('run.gaussBursts.length'),0);
assert(test('run.bullets.slice(3).every((b,i)=>b.followup&&Math.abs(b.damage-firstDamage*.6)<1e-9&&Math.abs(Math.atan2(b.vy,b.vx)-firstAngles[i])<1e-9&&b.pierce===1&&b.life===1.2)'));
test('updateGaussBursts(1)');assert.equal(test('run.bullets.length'),6);
test("run.cooldowns.gauss=0;run.enemies=[{x:200,y:0,hp:1e6,r:20}];weaponTick(.01);run.ended=true;var endCount=run.bullets.length;updateGaussBursts(1)");assert(test('run.bullets.length===endCount'));
test("beginLocalRun({id:'new',difficulty:0,startWeapon:'gauss'})");assert.equal(test('run.gaussBursts.length'),0);
console.log('PASS: 90ms same-angle triple follow-up at 60% damage, pause/ended guards, no retargeting, no duplicate volley, fresh-run reset.');
