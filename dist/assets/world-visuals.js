'use strict';
// Art-only biome profiles; each index is the existing campaign stage.
const worldArt=[null,
 {floor:'worldDirt',tint:'#ad6845',shade:'#241c1c',route:'#412d29',layout:'canyon',props:['worldCliff','desertRock','worldCliff','worldTower'],core:'#ffc080',enemy:'sand'},
 {floor:'worldIce',tint:'#7bbdd1',shade:'#14232c',route:'#384d5b',layout:'lab',props:['worldLab','worldIceRock','baseSolar','worldRelay'],core:'#a3efff',enemy:'ice'},
 {floor:'worldGrass',tint:'#54784a',shade:'#15251c',route:'#263b30',layout:'garden',props:['worldFungus','worldSpore','worldReactor','desertCactus'],core:'#bcf38d',enemy:'organic'},
 {floor:'worldDirt',tint:'#79608f',shade:'#201c30',route:'#3d294d',layout:'hive',props:['worldCrystal','worldFungus','worldCrystal','worldReactor'],core:'#e8aaff',enemy:'hive'},
 {floor:'sandAlt',tint:'#737578',shade:'#27232a',route:'#49392f',layout:'factory',props:['worldFactory','baseGenerator','worldPipe','worldVault'],core:'#ffb457',enemy:'machine'},
 {floor:'sandTile',tint:'#647aaa',shade:'#101a31',route:'#283750',layout:'citadel',props:['worldVault','worldTower','baseSolar','worldRelay'],core:'#a2bdff',enemy:'void'},
 {floor:'sandAlt',tint:'#98758e',shade:'#261a32',route:'#48304c',layout:'eclipse',props:['worldTower','worldCrystal','worldLab','worldVault'],core:'#f1b0e3',enemy:'hive'},
 {floor:'worldIce',tint:'#549c93',shade:'#102d30',route:'#29504e',layout:'abyss',props:['worldOre','worldIceRock','worldPipe','worldCrystal'],core:'#94f6d8',enemy:'organic'},
 {floor:'worldDirt',tint:'#a58a54',shade:'#30251d',route:'#56432a',layout:'origin',props:['worldReactor','worldVault','worldCrystal','baseGenerator'],core:'#ffe195',enemy:'origin'}
];
const worldTiles=new Map();
function biomeTile(stage,road=false){
 const key=stage+':'+road;if(worldTiles.has(key))return worldTiles.get(key);const b=worldArt[stage],source=assets[b.floor];if(!source?.naturalWidth)return null;
 const tile=document.createElement('canvas');tile.width=tile.height=128;const c=tile.getContext('2d');c.drawImage(source,0,0,128,128);c.globalCompositeOperation='color';c.fillStyle=b.tint;c.fillRect(0,0,128,128);c.globalCompositeOperation='source-over';c.globalAlpha=.58;c.fillStyle=b.shade;c.fillRect(0,0,128,128);c.globalAlpha=1;
 if(road){c.fillStyle=b.route;c.fillRect(0,0,128,128);c.strokeStyle=b.core+'18';c.lineWidth=2;c.strokeRect(5,5,118,118);c.fillStyle='#00000018';c.fillRect(12,12,104,104);}
 if(['lab','factory','citadel','eclipse','origin'].includes(b.layout)){c.strokeStyle='#ffffff0c';c.lineWidth=1;c.strokeRect(0,0,128,128);c.fillStyle=b.core+'33';for(const x of [8,116])for(const y of [8,116])c.fillRect(x,y,3,3);}
 worldTiles.set(key,tile);return tile;
}
function biomeRoad(layout,x,y){
 const mod=(n,m)=>((n%m)+m)%m;
 switch(layout){case 'canyon':return mod(y+Math.floor(Math.sin(x*.4)*2),8)===0;case 'lab':return mod(x,7)===0||mod(y,7)===0;case 'garden':return mod(x+y,9)===0;case 'hive':return mod(x-y,8)===0;case 'factory':return mod(y,5)===0||mod(x,10)===0;case 'citadel':return mod(x,6)===0||mod(y,12)===0;case 'eclipse':return mod(Math.abs(x)+Math.abs(y),8)===0;case 'abyss':return mod(x+Math.floor(Math.sin(y*.5)*2),9)===0;case 'origin':return mod(x,8)===0||mod(y,8)===0;default:return false;}
}
const previousWorldGround=ground;
ground=function(c,w,h,px,py,s,time=0){
 const stage=stages.indexOf(s),b=worldArt[stage],tile=b&&biomeTile(stage),road=b&&biomeTile(stage,true);if(!tile){previousWorldGround(c,w,h,px,py,s,time);return;}
 const left=px-w/2,top=py-h/2;c.save();
 for(let x=Math.floor(left/128);x<=Math.ceil((left+w)/128);x++)for(let y=Math.floor(top/128);y<=Math.ceil((top+h)/128);y++)c.drawImage(biomeRoad(b.layout,x,y)?road:tile,x*128-left,y*128-top,129,129);
 // Stable cells, with different placements in each biome. No gameplay RNG calls.
 const spacing=b.layout==='garden'||b.layout==='hive'?300:370;
 for(let gx=Math.floor(left/spacing)-1;gx<=Math.ceil((left+w)/spacing);gx++)for(let gy=Math.floor(top/spacing)-1;gy<=Math.ceil((top+h)/spacing);gy++){
  const seed=Math.abs((gx*73856093)^(gy*19349663)^(stage*83492791)),x=gx*spacing+65+seed%125-left,y=gy*spacing+40+(seed>>>5)%140-top;
  if(x< -100||y< -100||x>w+100||y>h+100)continue;
  const prop=b.props[(seed>>>9)%b.props.length],size=prop==='worldCliff'?100:prop==='worldCrystal'?58:prop==='worldPipe'?110:78;
  visualStamp(c,'wreckOil',x,y+22,size*1.3,size*.65,0,null,.3);visualStamp(c,prop,x,y,size,size,0,null,.7);
  if(prop==='worldCrystal'||prop==='worldReactor'||prop==='worldTower')visualStamp(c,'fxFlare',x,y-4,25,25,0,b.core,.17+.05*Math.sin(time+gx));
  if(seed%3===0)visualStamp(c,stage===2?'worldIceRock':stage===3?'worldSpore':'worldOre',x+65,y+32,27,27,0,null,.5);
 }
 c.restore();
};

const previousWorldMonster=drawMonster;
drawMonster=function(c,type,x,y,r,angle,time=0,hit=false,variant=0){
 const stage=view==='battle'?run?.stage:selected,b=worldArt[stage];if(!b){previousWorldMonster(c,type,x,y,r,angle,time,hit,variant);return;}
 const mechanical=['ice','machine','void','origin'].includes(b.enemy),size=r*2.6;
 if(mechanical&&(type!==0||variant)){
  const scout=b.enemy==='ice'?'worldScoutBlue':b.enemy==='origin'?'worldScoutSand':b.enemy==='void'?'worldScoutGreen':'scoutHull';
  const hull=type===0?scout:type===1?'worldHullRed':'worldHullDark';
  visualStamp(c,hull,x,y,size,size,angle-Math.PI/2);
  if(type!==0){const offsets=type===2?[-r*.42,r*.42]:[0];for(const side of offsets){const ox=Math.cos(angle+Math.PI/2)*side,oy=Math.sin(angle+Math.PI/2)*side;visualStamp(c,type===1?'worldCannon':'worldTwin',x+ox,y+oy,r*.8,r*1.7,angle+Math.PI/2);}}
  if(hit)visualStamp(c,hull,x,y,size,size,angle-Math.PI/2,'#fff4d2',.5);
 }else{
  monsterBase(c,type,x,y,r,angle,time,hit);
  c.save();c.translate(x,y);c.rotate(angle);
  if(type===2){for(const side of [-1,1])visualStamp(c,stage===1?'desertRock':stage===8?'worldOre':'worldCrystal',-r*.2,side*r*.55,r*.7,r*.85,Math.PI/2,null,.85);}
  else if(type===1)visualStamp(c,b.enemy==='sand'?'worldCannon':'worldSpore',-r*.3,0,r*1.25,r*1.25,Math.PI/2,null,.95);
  else if(variant)visualStamp(c,b.enemy==='sand'?'desertRock':'worldCrystal',-r*.35,0,r*.8,r*1.05,Math.PI/2,null,.85);
  c.restore();
 }
 // Small core color differentiates factions without disguising the body silhouette.
 visualStamp(c,'fxFlare',x-Math.cos(angle)*r*.25,y-Math.sin(angle)*r*.25,r*.7,r*.7,0,b.core,.65);
};

const previousWorldBoss=drawBoss;
// Reuse four animation poses instead of rebuilding every leg and attachment for every enemy.
// A bounded, lazy cache is especially useful for organic swarms on mobile devices.
const worldEnemyFrames=new Map(),uncachedWorldMonster=drawMonster;
drawMonster=function(c,type,x,y,r,angle,time=0,hit=false,variant=0){
 const stage=view==='battle'?run?.stage:selected;
 if(!worldArt[stage]||!assets.worldOre){uncachedWorldMonster(c,type,x,y,r,angle,time,hit,variant);return;}
 const pose=Math.floor(time*10)%4,key=[stage,type,Number(!!variant),pose,Number(!!hit)].join(':');let frame=worldEnemyFrames.get(key);
 if(!frame){frame=document.createElement('canvas');frame.width=frame.height=96;const fc=frame.getContext('2d');fc.imageSmoothingEnabled=false;uncachedWorldMonster(fc,type,48,48,24,0,pose*.17,hit,variant);if(worldEnemyFrames.size>=96)worldEnemyFrames.delete(worldEnemyFrames.keys().next().value);worldEnemyFrames.set(key,frame);}
 c.save();c.translate(x,y);c.rotate(angle);c.drawImage(frame,-r*2,-r*2,r*4,r*4);c.restore();
};
drawBoss=function(c,stage,x,y,size,a,t=0,hit=false){
 previousWorldBoss(c,stage,x,y,size,a,t,hit);const b=worldArt[stage];if(!b)return;
 const mode=view==='battle'?run.difficulty:selectedDifficulty||0,scale=size/48;
 c.save();c.translate(x,y);c.rotate(a);c.scale(scale,scale);
 // Attachments follow each existing boss's anatomy and attack role.
 if(stage===1){for(const side of [-1,1])visualStamp(c,'worldOre',40,side*24,22,24,side*.5);visualStamp(c,'desertRock',-8,0,27,26);}
 if(stage===2){for(let i=0;i<6;i++){const an=i*Math.PI/3;visualStamp(c,'worldIceRock',Math.cos(an)*30,Math.sin(an)*30,17,24,an);}visualStamp(c,'baseSolar',0,0,24,24);}
 if(stage===3){for(let i=0;i<4;i++){const an=i*Math.PI/2+t*.12;visualStamp(c,'worldSpore',Math.cos(an)*25,Math.sin(an)*25,23,23,an);}visualStamp(c,'worldReactor',0,0,26,26);}
 if(stage===4){for(const side of [-1,1])visualStamp(c,'worldCrystal',-7,side*21,18,36,side*Math.PI/3);visualStamp(c,'worldFungus',0,0,26,30);}
 if(stage===5){for(const side of [-1,1])visualStamp(c,'worldCannon',28,side*20,25,55,Math.PI/2);visualStamp(c,'baseGenerator',-8,0,34,34);}
 if(stage===6){for(const side of [-1,1])visualStamp(c,'baseSolar',-20,side*30,25,38,side*.45);visualStamp(c,'worldRelay',10,0,28,28,Math.PI/2);}
 if(stage===7){for(let i=0;i<3;i++){const an=t*.4+i*Math.PI*2/3;visualStamp(c,'worldCrystal',Math.cos(an)*51,Math.sin(an)*51,16,25,an);}visualStamp(c,'worldTower',0,0,26,30);}
 if(stage===8){for(let i=0;i<4;i++)visualStamp(c,'worldOre',12-i*17,Math.sin(t*3+i*.7)*10,17-i,24-i);}
 if(stage===9){for(let i=0;i<6;i++){const an=i*Math.PI/3;visualStamp(c,'worldCannon',Math.cos(an)*38,Math.sin(an)*38,18,30,an+Math.PI/2);}visualStamp(c,'worldReactor',0,0,36,36);}
 const coreX=stage===8?35:stage===5?-8:0;
 visualStamp(c,'fxFlare',coreX,0,24+mode*5,24+mode*5,t*.3,b.core,.55+Math.sin(t*3)*.12);
 if(mode===2)visualStamp(c,'fxRing',coreX,0,38,38,-t*.2,b.core,.4);
 c.restore();
};
