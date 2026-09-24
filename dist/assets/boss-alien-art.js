'use strict';
// Reuse the same CC0 alien anatomy as the ordinary enemies, composed into ten leaders.
// No changes to updateBoss, boss warnings, hit radius or attack patterns.
const alienBossFrames=new Map(),priorAlienBoss=drawBoss;
const alienBossSpecies=[6,0,4,5,1,7,2,8,3,6];
function alienBossFrame(stage,mode,hit){
 const key=[stage,mode,Number(!!hit)].join(':');if(alienBossFrames.has(key))return alienBossFrames.get(key);
 const source=alienFrame(alienBossSpecies[stage],hit);if(!source)return null;
 const frame=document.createElement('canvas');frame.width=192;frame.height=224;const c=frame.getContext('2d');c.translate(96,112);c.imageSmoothingEnabled=true;
 const bug=(id,x,y,w,h,a=0)=>{const im=alienFrame(id,hit);if(!im)return;c.save();c.translate(x,y);c.rotate(a);c.drawImage(im,-w/2,-h/2,w,h);c.restore()};
 // Secondary carapaces use the source sheet's shaded forms, not flat machine blocks.
 if(stage===1)for(const side of [-1,1])bug(2,side*33,24,47,102,side*.45);
 if(stage===2)for(const side of [-1,1])bug(4,side*31,10,52,108,side*.45);
 if(stage===3)for(let i=0;i<3;i++)bug(5,(i-1)*27,43,44,75,(i-1)*.35);
 if(stage===4)for(const side of [-1,1])bug(6,side*34,9,65,103,side*.7);
 if(stage===5)for(const side of [-1,1])bug(7,side*32,31,59,107,side*.35);
 if(stage===6)for(const side of [-1,1])bug(0,side*37,10,48,130,side*.8);
 if(stage===7)for(const side of [-1,1])bug(8,side*31,20,62,116,side*.9);
 if(stage===8){for(let i=3;i>=1;i--)bug(3,Math.sin(i*.8)*9,19+i*16,70-i*9,80-i*8);}
 if(stage===9)for(const side of [-1,1])bug(8,side*35,25,75,115,side*.48);
 bug(alienBossSpecies[stage],0,stage===8?-25:-5,stage===0?135:stage===9?138:112,stage===8?130:170);
 // Difficulty adds anatomical crests, with no animated decorative flashing.
 if(mode)for(const side of [-1,1])bug(stage===9?7:6,side*(31+mode*3),-24,28+mode*6,61+mode*8,side*.35);
 if(mode===2)bug(7,0,-39,42,68);
 alienBossFrames.set(key,frame);return frame;
}
drawBoss=function(c,stage,x,y,size,a,t=0,hit=false){
 const mode=view==='battle'?run?.difficulty||0:selectedDifficulty||0,im=alienBossFrame(stage,mode,hit);
 if(!im){priorAlienBoss(c,stage,x,y,size,a,t,hit);return;}
 c.save();c.translate(x,y);c.rotate(a+Math.PI/2);c.imageSmoothingEnabled=true;
 const breath=1+Math.sin(t*2.1+stage)*.008;c.scale(breath,1/breath);
 c.drawImage(im,-size*1.5,-size*1.75,size*3,size*3.5);c.restore();
};
