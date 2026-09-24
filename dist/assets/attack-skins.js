'use strict';
const cosmeticWeapons=['gauss','shotgun','laser','missile','nova','flame','lightning'];
function attackSkinMark(c,item,x,y,size,angle=0){
 c.save();c.translate(x,y);c.rotate(angle);c.strokeStyle=item.color;c.fillStyle=item.color;c.lineWidth=1.5;c.beginPath();
 if(item.id==='trail_ice'){c.moveTo(0,-size);c.lineTo(size*.55,0);c.lineTo(0,size);c.lineTo(-size*.55,0);c.closePath();}
 else if(item.id==='trail_star'){for(let i=0;i<8;i++){const a=i*Math.PI/4,r=i%2?size*.26:size;i?c.lineTo(Math.cos(a)*r,Math.sin(a)*r):c.moveTo(r,0)}c.closePath();}
 else if(item.id==='trail_plasma'){c.arc(-size*.25,0,size*.65,-1.2,1.2);c.moveTo(size*.25+Math.cos(2)*size*.65,Math.sin(2)*size*.65);c.arc(size*.25,0,size*.65,2,4.3);}
 else{c.moveTo(-size*.7,size*.5);c.lineTo(0,-size);c.lineTo(size*.7,size*.5);c.moveTo(-size*.4,size);c.lineTo(0,size*.2);c.lineTo(size*.4,size);}
 c.stroke();c.restore();
}
function attackSkinLine(c,item,x,y,x2,y2,alpha=1){
 const dx=x2-x,dy=y2-y,len=Math.hypot(dx,dy),a=Math.atan2(dy,dx),n=simpleEffects?3:5;
 c.save();c.globalAlpha*=alpha*.7;for(let i=1;i<=n;i++){const p=i/(n+1);attackSkinMark(c,item,x+dx*p,y+dy*p,Math.min(7,len/18),a+Math.PI/2)}c.restore();
}
function attackSkinRing(c,item,x,y,r,alpha=1){
 c.save();c.globalAlpha*=alpha*.65;const n=simpleEffects?6:10;
 for(let i=0;i<n;i++){const a=i*Math.PI*2/n;attackSkinMark(c,item,x+Math.cos(a)*r*.82,y+Math.sin(a)*r*.82,Math.min(9,r*.1),a+Math.PI/2)}c.restore();
}
const skinLineBase=combatLine;
combatLine=function(f,sx,sy){skinLineBase(f,sx,sy);const skin=equippedCosmetic('trail');if(!skin||!['laser','lightning'].includes(f.weaponId))return;
 const x=sx(f.x),y=sy(f.y),x2=sx(f.x2),y2=sy(f.y2);if(Math.max(x,x2)<-30||Math.min(x,x2)>W+30||Math.max(y,y2)<-30||Math.min(y,y2)>H+30)return;
 attackSkinLine(ctx,skin,x,y,x2,y2,f.t/f.life);
};
const skinRingBase=drawCombatRing;
drawCombatRing=function(f,sx,sy){skinRingBase(f,sx,sy);const skin=equippedCosmetic('trail');if(!skin||!['nova','missile','shotgun'].includes(f.weaponId))return;
 const p=1-f.t/f.life,r=f.r+(f.max-f.r)*p,x=sx(f.x),y=sy(f.y);if(x+r<0||y+r<0||x-r>W||y-r>H)return;attackSkinRing(ctx,skin,x,y,r,1-p);
};
const skinMineBase=drawMines;
drawMines=function(sx,sy){skinMineBase(sx,sy);const skin=equippedCosmetic('trail');if(!skin)return;for(const m of run.mines){const x=sx(m.x),y=sy(m.y);if(x< -30||y< -30||x>W+30||y>H+30)continue;attackSkinMark(ctx,skin,x,y,9)}};
const skinFlameBase=drawContinuousFlame;
drawContinuousFlame=function(sx,sy){skinFlameBase(sx,sy);const skin=equippedCosmetic('trail'),f=combatVisuals.flame;if(!skin||!f||f.run!==run||f.opacity<.01)return;
 ctx.save();ctx.globalAlpha=f.opacity*.42;const count=f.aw?8:3;for(let i=0;i<count;i++){const a=f.aw?i*Math.PI*2/count:f.angle+(i-1)*.24,r=f.range*.64;attackSkinMark(ctx,skin,sx(run.x)+Math.cos(a)*r,sy(run.y)+Math.sin(a)*r,10,a+Math.PI/2)}ctx.restore();
};
function paintAttackPreview(canvas,item,id){
 const c=canvas.getContext('2d');c.clearRect(0,0,360,160);c.fillStyle='#0b171e';c.fillRect(0,0,360,160);c.strokeStyle='#526a75';c.lineWidth=3;
 if(id==='laser'||id==='lightning'){c.beginPath();c.moveTo(50,80);for(let i=1;i<=8;i++)c.lineTo(50+i*32,80+(id==='lightning'&&i<8?(i%2?9:-9):0));c.stroke();attackSkinLine(c,item,50,80,306,80);}
 else if(id==='nova'||id==='shotgun'){c.beginPath();c.ellipse(180,80,65,55,0,0,Math.PI*2);c.stroke();attackSkinRing(c,item,180,80,55);if(id==='shotgun')visualStamp(c,'tacticalMine',180,80,32,32);}
 else if(id==='flame'){for(let i=0;i<6;i++){const a=(i-2.5)*.15;visualStamp(c,'fxFire',140+Math.cos(a)*70,80+Math.sin(a)*70,55,40,a,'#d88b52',.45)}for(let i=0;i<3;i++)attackSkinMark(c,item,205,55+i*25,11,Math.PI/2);}
 else for(let i=0;i<4;i++){const x=75+i*70;if(id==='missile')visualStamp(c,'rocketShell',x,80,12,28,Math.PI/2);else{c.beginPath();c.moveTo(x-10,80);c.lineTo(x+10,80);c.stroke()}drawBulletCosmetic(c,item,x,80,0,0)}
}
