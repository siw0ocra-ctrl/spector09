'use strict';
// W_K_Studio, Top-down Alien Bug Sprites (CC0). Original sheet is unmodified.
// Only drawing changes: enemy roles, radii, movement and damage stay in game.js.
const alienSpriteRects=[
 [36,12,110,183],[184,8,138,187],[351,24,139,175],
 [16,199,145,193],[181,195,150,210],[375,209,126,193],
 [19,392,150,200],[187,403,144,188],[355,399,146,189]
];
// Each stage selects a distinct scout / ranged / armored composition.
const alienStageSpecies=[
 [2,5,1],[3,0,6],[2,4,8],[3,5,1],[2,7,6],
 [3,0,8],[2,4,1],[3,7,8],[2,5,6],[3,7,8]
];
const alienRoleColors=['#b3d8b0','#ffcb80','#ed9990'];
const alienFrames=new Map(),preAlienMonster=drawMonster;
function alienFrame(species,hit){
 const key=species+':'+Number(!!hit);if(alienFrames.has(key))return alienFrames.get(key);
 if(!assets.alienBugs?.naturalWidth)return null;
 const [sx,sy,sw,sh]=alienSpriteRects[species],frame=document.createElement('canvas');
 frame.width=128;frame.height=160;const c=frame.getContext('2d');
 const scale=Math.min(116/sw,148/sh),w=sw*scale,h=sh*scale;
 // Brightness is baked once, not filtered for every enemy on every frame.
 c.filter=hit?'brightness(2.1) saturate(.55)':'brightness(1.65) saturate(.82)';
 c.drawImage(assets.alienBugs,sx,sy,sw,sh,(128-w)/2,(160-h)/2,w,h);
 alienFrames.set(key,frame);return frame;
}
drawMonster=function(c,type,x,y,r,angle,time=0,hit=false,variant=0){
 if(type<0||type>2){preAlienMonster(c,type,x,y,r,angle,time,hit,variant);return;}
 const stage=(view==='battle'?run?.stage:selected)||0;
 const species=alienStageSpecies[stage]?.[type]??alienStageSpecies[0][type],img=alienFrame(species,hit);
 if(!img){preAlienMonster(c,type,x,y,r,angle,time,hit,variant);return;}
 // A slight independent gait keeps a swarm from pulsing in unison.
 const phase=time*(type===2?5:9)+variant*2+species,step=Math.sin(phase);
 c.save();c.translate(x,y);c.rotate(angle+Math.PI/2+step*.022);
 const h=r*(type===2?3.3:3.15),w=h*.8;
 c.scale(1+step*.018,1-step*.012);c.imageSmoothingEnabled=true;
 c.drawImage(img,-w/2,-h/2,w,h);
 // A quiet dorsal marker makes shooters and armor readable at mobile scale.
 c.fillStyle=alienRoleColors[type];c.globalAlpha=.8;
 if(type===1){c.beginPath();c.ellipse(0,r*.16,r*.16,r*.3,0,0,Math.PI*2);c.fill();}
 if(type===2){c.strokeStyle=alienRoleColors[type];c.lineWidth=Math.max(1,r*.065);c.beginPath();c.moveTo(-r*.28,-r*.06);c.lineTo(0,r*.13);c.lineTo(r*.28,-r*.06);c.stroke();}
 c.restore();
};
