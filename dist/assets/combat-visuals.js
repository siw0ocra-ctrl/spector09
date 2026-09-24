'use strict';
// Presentation only: no random-number consumption, damage, timing or collision changes.
const combatVisuals={run:null,events:[],serial:0,audioAt:0,tints:new Map(),tiles:null};
const visualPalette={gauss:'#dfff84',shotgun:'#ffc16a',missile:'#ff8956',laser:'#63e9ff',nova:'#75aaff',drone:'#91ffe3',flame:'#ff852e',lightning:'#d6a0ff'};
function visualStamp(c,key,x,y,w,h=w,angle=0,color=null,alpha=1){
 let im=assets[key];if(!im?.complete||!im.naturalWidth)return;
 if(color){const cacheKey=key+color;let tinted=combatVisuals.tints.get(cacheKey);if(!tinted){tinted=document.createElement('canvas');tinted.width=im.naturalWidth;tinted.height=im.naturalHeight;const tc=tinted.getContext('2d');tc.drawImage(im,0,0);tc.globalCompositeOperation='source-in';tc.fillStyle=color;tc.fillRect(0,0,tinted.width,tinted.height);combatVisuals.tints.set(cacheKey,tinted)}im=tinted;}
 c.save();c.globalAlpha*=alpha;c.translate(x,y);c.rotate(angle);c.drawImage(im,-w/2,-h/2,w,h);c.restore();
}
function visualEvent(kind,x,y,id,extra={}){
 if(!run)return;if(simpleEffects&&(kind==='impact'||kind==='muzzle'))return;if(combatVisuals.run!==run){combatVisuals.run=run;combatVisuals.events=[];combatVisuals.audioAt=0;}
 const events=combatVisuals.events,limit=simpleEffects?24:96;if(events.length>=limit)events.splice(0,events.length-limit+1);
 events.push({kind,x,y,id,age:0,life:kind==='impact'?.24:kind==='blast'?.48:.13,seed:++combatVisuals.serial,color:visualPalette[id]||'#ffd58e',...extra});
}
const visualTickBase=tick;
tick=function(dt){const advancing=run&&!run.paused&&!run.ended;if(advancing){if(combatVisuals.run!==run){combatVisuals.run=run;combatVisuals.events=[];combatVisuals.flame=null}for(const e of combatVisuals.events)e.age+=dt;combatVisuals.events=combatVisuals.events.filter(e=>e.age<e.life)}visualTickBase(dt);if(advancing)updateFlameVisual(dt)};
const visualFireBase=fire;
fire=function(a,damage,color,options={}){visualFireBase(a,damage,color,options);const id=options.weaponId;if(!id)return;const recent=combatVisuals.events[combatVisuals.events.length-1];if(recent?.kind==='muzzle'&&recent.id===id&&recent.age===0)return;visualEvent('muzzle',run.x+Math.cos(a)*23,run.y+Math.sin(a)*23,id,{angle:a,aw:!!run.awakened[id]});if(id==='shotgun')beep(90,.11,'triangle',.018);if(id==='missile')beep(120,.16,'sawtooth',.009);};
const visualHurtBase=hurt;
hurt=function(e,damage,id){const alive=!e.dead&&!e.opened,wasChest=e.isChest,oldHp=e.hp,oldHit=e.hit,fxStart=run.fx.length;visualHurtBase(e,damage,id);if(!alive||!id||(!wasChest&&e.hp===oldHp))return;
 if(id==='flame'){e.hit=oldHit;for(let i=fxStart;i<run.fx.length;i++)run.fx[i].visualMuted=true;}
 if((e.lastVisualHit??-1)<=run.t){e.lastVisualHit=run.t+.07;visualEvent('impact',e.x,e.y,id,{angle:Math.atan2(e.y-run.y,e.x-run.x),size:e.r,dead:e.dead});}
 if(e.dead||wasChest)visualEvent('blast',e.x,e.y,id,{size:Math.min(56,e.r*1.7),life:.42});
 if(soundOn&&run.t>=combatVisuals.audioAt){combatVisuals.audioAt=run.t+.065;beep(id==='missile'?65:id==='laser'?740:id==='lightning'?980:180,.055,id==='laser'||id==='nova'?'sine':'triangle',.009)}
};
const visualBeamBase=beam;
beam=function(x,y,x2,y2,color,width=3,weaponId){
 if(weaponId==='flame'){
  // One continuous emitter spans damage ticks, instead of flashing a new set of rays.
  let f=combatVisuals.flame;if(!f||f.run!==run)f=combatVisuals.flame={run,opacity:0,angle:run.angle};
  Object.assign(f,{targetAngle:run.angle,range:Math.hypot(x2-x,y2-y),aw:!!run.awakened.flame,until:run.t+.23*weaponStats('flame').cooldown+.08});return;
 }
 visualBeamBase(x,y,x2,y2,color,width);const f=run.fx[run.fx.length-1];f.weaponId=weaponId;f.aw=!!run.awakened[weaponId];f.seed=++combatVisuals.serial;
};
function updateFlameVisual(dt){const f=combatVisuals.flame;if(!f||f.run!==run)return;const target=run.t<=f.until?1:0;f.opacity+=(target-f.opacity)*(1-Math.exp(-dt*(target?9:6)));const delta=Math.atan2(Math.sin(f.targetAngle-f.angle),Math.cos(f.targetAngle-f.angle));f.angle+=delta*(1-Math.exp(-dt*12));if(!target&&f.opacity<.01)combatVisuals.flame=null;}
function drawContinuousFlame(sx,sy){
 const f=combatVisuals.flame;if(!f||f.run!==run||f.opacity<.01)return;
 const count=simpleEffects?(f.aw?16:10):(f.aw?56:32);ctx.save();ctx.globalAlpha=f.opacity;const x=sx(run.x),y=sy(run.y);
 for(let i=0;i<count;i++){
  const phase=(run.t*.8+i*.61803398875)%1,spread=f.aw?i*Math.PI*2/count:f.angle+((i*13%31)/30-.5)*.92;
  const distance=12+phase*(f.range-20),size=(f.aw?22:18)+phase*22,fade=Math.sin(phase*Math.PI)*.36;
  const px=x+Math.cos(spread)*distance,py=y+Math.sin(spread)*distance;
  visualStamp(ctx,'fxMuzzle',px,py,size*.85,size*1.5,spread+Math.PI/2,phase<.4?'#efaa43':'#e77830',fade);
  visualStamp(ctx,'fxFire',px,py,size*1.3,size*1.3,spread+phase*.4,'#d65e2b',fade*.8);
 }
 ctx.restore();
}
const visualRingBase=ring;
ring=function(x,y,r,color,weaponId){visualRingBase(x,y,r,color);const f=run.fx[run.fx.length-1];f.weaponId=weaponId;if(weaponId==='missile'||weaponId==='shotgun')visualEvent('blast',x,y,weaponId,{size:r,life:.48});};

function drawCombatProjectile(b,x,y){
 const id=b.weaponId||'gauss',a=Math.atan2(b.vy,b.vx),aw=!!run.awakened[id],color=visualPalette[id];
 if(x< -90||x>W+90||y< -90||y>H+90)return;
 ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.lineCap='round';
 if(id==='missile'){
  visualStamp(ctx,'fxSmoke',-24,0,55,23,0,'#a99583',.3);
  visualStamp(ctx,'fxMuzzle',-12,0,18,aw?44:30,-Math.PI/2,'#ff8a37',.9);
  visualStamp(ctx,'rocketShell',0,0,aw?13:10,aw?29:23,Math.PI/2);
 }else if(id==='shotgun'){
  ctx.strokeStyle='#edaa57';ctx.lineWidth=aw?5:3;ctx.beginPath();ctx.moveTo(-14,0);ctx.lineTo(0,0);ctx.stroke();
  visualStamp(ctx,'shell',0,0,6,11,Math.PI/2);if(aw)visualStamp(ctx,'fxFire',-6,0,17,12,0,'#ff8339',.7);
 }else if(aw&&id==='gauss'){
  // A narrow, long rail slug reads differently from the short shotgun pellet fan.
  for(const [length,width,tint] of [[96,15,'#8bcf6928'],[78,7,'#c3f77880'],[48,3,'#f0ffc1']]){ctx.strokeStyle=tint;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(-length,0);ctx.lineTo(9,0);ctx.stroke();}
  ctx.strokeStyle='#b5ea76';ctx.lineWidth=1;for(const side of [-1,1]){ctx.beginPath();ctx.moveTo(-64,side*5);ctx.lineTo(-12,side*5);ctx.lineTo(6,0);ctx.stroke();}
  visualStamp(ctx,'fxTrace',3,0,15,34,Math.PI/2,'#d9ff97',.8);
 }else{
  ctx.strokeStyle='#93c65455';ctx.lineWidth=aw?8:5;ctx.beginPath();ctx.moveTo(-29,0);ctx.lineTo(5,0);ctx.stroke();
  ctx.strokeStyle=color;ctx.lineWidth=aw?3:2;ctx.beginPath();ctx.moveTo(-25,0);ctx.lineTo(7,0);ctx.stroke();
  ctx.strokeStyle='#fffbd7';ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(-10,0);ctx.lineTo(8,0);ctx.stroke();
 }
 ctx.restore();const skin=equippedCosmetic('trail');if(skin)drawBulletCosmetic(ctx,skin,x,y,a,run.t);
}
function combatLine(f,sx,sy){
 const x=sx(f.x),y=sy(f.y),dx=f.x2-f.x,dy=f.y2-f.y,len=Math.hypot(dx,dy),a=Math.atan2(dy,dx),fade=f.t/f.life,id=f.weaponId;
 if(Math.max(x,sx(f.x2))< -40||Math.min(x,sx(f.x2))>W+40||Math.max(y,sy(f.y2))< -40||Math.min(y,sy(f.y2))>H+40)return;
 ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.globalAlpha=fade;ctx.lineCap='round';
 if(id==='flame'){
  // Every flame ray stays inside the existing cone/range; particles never apply damage.
  visualStamp(ctx,'fxMuzzle',len*.42,0,28,len*.85,Math.PI/2,'#ffab35',.65);
  for(let i=1;i<=6;i++){const p=i/6,j=Math.sin(f.seed*2.1+i*4.7)*6*p,size=12+p*24;visualStamp(ctx,'fxMuzzle',len*p,j,size*.7,size*1.7,Math.PI/2,p<.4?'#fff2a2':p<.75?'#ffc34b':'#ff6935',.6);visualStamp(ctx,'fxFire',len*p,j,size*1.45,size,run.t*3+i,'#ff7935',.6);}
 }else if(id==='lightning'){
  const steps=Math.max(3,Math.min(18,Math.ceil(len/18))),points=[[0,0]];
  for(let i=1;i<steps;i++)points.push([len*i/steps,Math.sin(i*7.1+f.seed)*12]);points.push([len,0]);
  for(const [width,color] of [[f.aw?8:6,'#a35cff44'],[2.5,'#cc98ff'],[1,'#fff2ff']]){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();points.forEach(([px,py],i)=>i?ctx.lineTo(px,py):ctx.moveTo(px,py));ctx.stroke()}
  if(f.aw){ctx.strokeStyle='#c798ff';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(len*.45,0);ctx.lineTo(len*.56,20);ctx.lineTo(len*.64,13);ctx.stroke()}
  visualStamp(ctx,'fxSpark',len,0,30,30,run.t,'#ebd6ff');
 }else{
  const drone=id==='drone',color=drone?'#91ffe3':f.color,width=drone?(f.aw?4:2):f.width;
  for(const [w,col] of [[width*2.3,color+'33'],[width,color],[Math.max(1,width*.25),'#efffff']]){ctx.strokeStyle=col;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(len,0);ctx.stroke()}
  visualStamp(ctx,'fxFlare',0,0,drone?18:34,drone?18:34,0,color);
  if(!drone){ctx.strokeStyle=color;ctx.lineWidth=1;for(let i=45;i<len;i+=52){ctx.beginPath();ctx.moveTo(i,-width);ctx.lineTo(i+9,width);ctx.stroke()}}
 }
 ctx.restore();
}
drawWeaponEffects=function(sx,sy){drawContinuousFlame(sx,sy);for(const f of run.fx)if(f.line)combatLine(f,sx,sy);if(run.weapons.drone)for(const d of dronePositions())drawFriendlyDrone(sx(d.x),sy(d.y),d.angle,run.awakened.drone)};
function drawCombatRing(f,sx,sy){
 const progress=1-f.t/f.life,r=f.r+(f.max-f.r)*progress,x=sx(f.x),y=sy(f.y);if(x+r+24<0||y+r+24<0||x-r-24>W||y-r-24>H)return;ctx.save();ctx.globalAlpha=(1-progress)*(f.visualMuted?.16:1);ctx.strokeStyle=f.visualMuted?'#cc813e':f.color;ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke();
 if(f.weaponId==='nova'&&!simpleEffects){visualStamp(ctx,'fxRing',x,y,r*2,r*2,0,'#81b6ff',.55);ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,r*.78,0,Math.PI*2);ctx.stroke();for(let i=0;i<12;i++){const a=i*Math.PI/6+progress*.3;visualStamp(ctx,'fxSpark',x+Math.cos(a)*r,y+Math.sin(a)*r,20,20,a,'#b5d9ff',.8)}}ctx.restore();
}
function drawCombatVfx(sx,sy){
 if(combatVisuals.run!==run)return;ctx.save();
 for(const e of combatVisuals.events){if(simpleEffects&&e.kind!=='blast')continue;const x=sx(e.x),y=sy(e.y);if(x< -120||y< -120||x>W+120||y>H+120)continue;const p=e.age/e.life;ctx.globalAlpha=1-p;
  if(e.id==='flame'){visualStamp(ctx,'fxFire',x,y,18+p*12,18+p*12,e.seed,'#ce7e37',.28);continue;}
  if(e.kind==='muzzle'){visualStamp(ctx,'fxMuzzle',x,y,e.id==='shotgun'?38:e.aw?30:23,e.id==='shotgun'?44:e.aw?48:32,e.angle+Math.PI/2,e.color);if(e.id==='gauss'&&e.aw)visualStamp(ctx,'fxRing',x,y,18,32,e.angle,'#c8f78d',.5);}
  else if(e.kind==='blast'){const size=e.size*(.45+p*1.4);if(simpleEffects){ctx.strokeStyle=e.color;ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,size*.7,0,Math.PI*2);ctx.stroke();continue;}visualStamp(ctx,'fxSmoke',x,y,size*2,size*2,e.seed,'#a89079',.35);visualStamp(ctx,'fxFire',x,y,size*1.7,size*1.7,e.seed,e.color,p<.6?.7:.2);visualStamp(ctx,'fxFlare',x,y,size*.6,size*.6,0,'#fff2c1',Math.max(0,1-p*3));}
  else{visualStamp(ctx,e.id==='lightning'||e.id==='nova'?'fxSpark':'fxFlare',x,y,22+18*p,22+18*p,e.seed,e.color);ctx.strokeStyle=e.color;ctx.lineWidth=e.dead?2:1.4;for(let i=0;i<5;i++){const a=e.angle+(i-2)*.65+Math.sin(e.seed)*.5,d=5+p*(e.dead?30:20);ctx.beginPath();ctx.moveTo(x+Math.cos(a)*d,y+Math.sin(a)*d);ctx.lineTo(x+Math.cos(a)*(d+6),y+Math.sin(a)*(d+6));ctx.stroke()}}
 }ctx.restore();
}

const terrainBase=ground;
ground=function(c,w,h,px,py,s,time=0){
 if(s!==stages[0]||!assets.sandTile){terrainBase(c,w,h,px,py,s,time);return;}
 // World-anchored terrain: fixed positions never shimmer or slide with the camera.
 const cell=128,left=px-w/2,top=py-h/2;
 c.save();c.fillStyle='#3b3a2b';c.fillRect(0,0,w,h);
 for(let gx=Math.floor(left/cell);gx<=Math.ceil((left+w)/cell);gx++)for(let gy=Math.floor(top/cell);gy<=Math.ceil((top+h)/cell);gy++){const x=gx*cell-left,y=gy*cell-top,key=gy===-2?'sandRoad':((gx*17+gy*31)%5===0?'sandAlt':'sandTile');c.drawImage(assets[key],x,y,cell+1,cell+1);}
 c.fillStyle='#17231eaa';c.fillRect(0,0,w,h);
 for(let gx=Math.floor(left/390)-1;gx<=Math.ceil((left+w)/390);gx++)for(let gy=Math.floor(top/390)-1;gy<=Math.ceil((top+h)/390);gy++){
  const k=Math.abs((gx*73856093)^(gy*19349663)),x=gx*390+60+(k%90)-left,y=gy*390+70+(k%115)-top;
  const key=['baseHangar','baseRadar','baseSolar','baseGenerator','desertRock','desertCactus'][k%6],size=key.startsWith('base')?92:52;
  if(x< -110||y< -110||x>w+110||y>h+110)continue;
  visualStamp(c,'wreckOil',x,y+18,size*1.25,size*.7,0,null,.3);visualStamp(c,key,x,y,size,size,0,null,.62);
  visualStamp(c,'sandBags',x+60,y+32,42,25,0,null,.5);
 }
 c.restore();
};
const monsterBase=drawMonster;
drawMonster=function(c,type,x,y,r,angle,time=0,hit=false,variant=0){
 const first=(view==='battle'?run?.stage:selected)===0;
 if(!first||(type===0&&!variant)){monsterBase(c,type,x,y,r,angle,time,hit);return;}
 const key=type===0?'scoutHull':type===1?'artilleryHull':'heavyHull',size=r*2.65;
 visualStamp(c,key,x,y,size,size,angle-Math.PI/2);
 if(hit)visualStamp(c,key,x,y,size,size,angle-Math.PI/2,'#fff3d2',.6);
};
const spawnVisualBase=spawn;
spawn=function(boss=false){spawnVisualBase(boss);const e=run.enemies[run.enemies.length-1];e.visualVariant=e.type===0?(Math.floor(Math.abs(e.x+e.y))%2):0;};
const bossVisualBase=drawBoss;
drawBoss=function(c,stage,x,y,size,a,t=0,hit=false){
 if(stage!==0||!assets.bossHull){bossVisualBase(c,stage,x,y,size,a,t,hit);return;}
 const mode=view==='battle'?run.difficulty:selectedDifficulty||0;
 c.save();c.translate(x,y);c.rotate(a+Math.PI/2);const scale=size/48;
 visualStamp(c,'bossHull',0,0,98*scale,112*scale);
 for(const side of [-1,1])visualStamp(c,'bossGun',side*25*scale,-12*scale,28*scale,(63+mode*5)*scale);
 if(mode)for(const side of [-1,1])visualStamp(c,'metalCrate',side*38*scale,15*scale,24*scale,32*scale);
 if(mode===2)visualStamp(c,'bossGun',0,-14*scale,24*scale,70*scale);
 visualStamp(c,'fxFlare',0,4*scale,22*scale,22*scale,t*.3,mode===2?'#e4a1ff':'#ffab61',.65+Math.sin(t*3)*.15);
 if(hit)visualStamp(c,'bossHull',0,0,98*scale,112*scale,0,'#fff2d5',.5);c.restore();
};
const droneVisualBase=drawFriendlyDrone;
drawFriendlyDrone=function(x,y,angle,awakened){
 ctx.save();visualStamp(ctx,'fxMuzzle',x-Math.cos(angle)*13,y-Math.sin(angle)*13,11,21,angle-Math.PI/2,awakened?'#ffe79d':'#80efff',.6);ctx.restore();droneVisualBase(x,y,angle,awakened);
};
