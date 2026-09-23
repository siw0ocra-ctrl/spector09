const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const harness=fs.readFileSync('tests/test-client-v3.cjs','utf8').split('const test=s=>')[0];
const context={require,console,AbortController,structuredClone};vm.createContext(context);vm.runInContext(harness,context);
const test=code=>vm.runInContext('vm.runInContext('+JSON.stringify(code)+',sandbox)',context);
const fresh=()=>test("assetsReady=true;selected=0;beginLocalRun({id:'mine',stage:0,difficulty:0,startWeapon:'shotgun'});run.chests=[];run.enemies=[];");
fresh();test('weaponTick(.01)');assert.equal(test('run.mines.length'),1);assert.equal(test('run.bullets.length'),0);
test('run.enemies=[{x:40,y:0,hp:1000,maxHp:1000,r:20,type:0}];updateMines(.2)');assert.equal(test('run.enemies[0].hp'),1000);
test('updateMines(.21)');assert(test('run.enemies[0].hp<1000'));assert(test('run.weaponDamage.shotgun>0'));assert.equal(test('run.mines.length'),0);
fresh();test('for(let i=0;i<30;i++)plantMine(weaponStats("shotgun"))');assert.equal(test('run.mines.length'),7);assert(test('new Set(run.mines.map(m=>m.x+":"+m.y)).size>1'));
test('run.paused=true;updateMines(20)');assert.equal(test('run.mines[0].age'),0);test('run.paused=false;updateMines(13)');assert.equal(test('run.mines.length'),0);
fresh();for(let i=0;i<2;i++){test('run.chests=[createChest(30,0)];plantMine(weaponStats("shotgun"));updateMines(.5)');assert(test('run.chests[0].opened'));}assert.equal(test('run.drops.length'),2);
fresh();test('run.weapons.shotgun=5;run.skills.power=5;checkAwakenings()');assert(!test('run.awakened.shotgun'));test('run.skills.wealth=3;checkAwakenings();run.enemies=[{x:40,y:0,hp:10000,maxHp:10000,r:20,type:0}];plantMine(weaponStats("shotgun"));updateMines(.41)');
// Use actual short frames: the first .41 above consumes the warning, so start another mine.
test('run.mines=[];plantMine(weaponStats("shotgun"));for(let i=0;i<21;i++)updateMines(.02)');assert(test('run.enemies[0].slow>run.t'));assert.equal(test('run.mines.length'),1);test('updateMines(.32)');assert.equal(test('run.mines.length'),0);
fresh();test('run.weapons={gauss:1};run.killTypes=[10,0,0,0];run.kills=10;run.gold=20;run.paused=true;run.modalMode="choice";run.choices=["p:wealth"];run.choiceRarities=[3];choose("p:wealth")');assert.equal(test('run.skills.wealth'),1);assert.equal(test('run.wealthLedger[0].killTypes[0]'),10);assert.equal(test('run.wealthLedger[0].tier'),3);assert.equal(test('run.gold'),20);
assert.equal(test('Array.from({length:100},()=>combatGold(2)).reduce((a,b)=>a+b,0)'),227);
assert(test('statsHTML().includes("13.5%")'));assert(test('pool().some(c=>c.id==="p:wealth")'));test('run.skills.wealth=5');assert(!test('pool().some(c=>c.id==="p:wealth")'));
console.log('PASS: mine arming, no-target placement, cap/spread/expiry/pause, respawned chests, awakening/slow, universal wealth, rarity and fractional gold accumulation.');
