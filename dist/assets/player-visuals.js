'use strict';
// CC0 survivor base by fightswithbears; SECTOR 09 armor is drawn once per suit.
const pilotStyles={
 default:{plate:'#526a78',edge:'#adc7d0',visor:'#8bf0e7',dark:'#23303d',kind:'scout'},
 suit_ember:{plate:'#914938',edge:'#ffb47c',visor:'#ffe6a0',dark:'#382b2d',kind:'ember'},
 suit_ice:{plate:'#9bbfcb',edge:'#e0f7ff',visor:'#6bedff',dark:'#314c61',kind:'ice'},
 suit_royal:{plate:'#715383',edge:'#d5acd8',visor:'#fff2b3',dark:'#362b4a',kind:'royal'},
 suit_shadow:{plate:'#303d4d',edge:'#8095ad',visor:'#94ffca',dark:'#18212d',kind:'shadow'},
 suit_solar:{plate:'#ceac68',edge:'#fff0b7',visor:'#f6faff',dark:'#4e4035',kind:'solar'},
 suit_warden:{plate:'#638ba8',edge:'#c8e6f5',visor:'#79eeff',dark:'#283749',kind:'warden'}
};
const pilotFrames=new Map();
function pilotFrame(id='default'){
 if(pilotFrames.has(id))return pilotFrames.get(id);if(!assets.pilotBase?.naturalWidth)return null;
 const style=pilotStyles[id]||pilotStyles.default,cvs=document.createElement('canvas');cvs.width=cvs.height=96;
 const c=cvs.getContext('2d');c.imageSmoothingEnabled=false;
 c.drawImage(assets.pilotBase,16,8,64,64);
 const panel=(x,y,w,h)=>{c.fillStyle=style.dark;c.fillRect(x-1,y-1,w+2,h+2);c.fillStyle=style.plate;c.fillRect(x,y,w,h);c.fillStyle=style.edge;c.fillRect(x+1,y,w-2,2)};
 panel(31,37,9,16);panel(56,43,9,14);panel(39,57,17,8);
 // Helmet, segmented visor and shoulder identity are visible at combat scale.
 c.fillStyle=style.dark;c.beginPath();c.ellipse(48,45,12,13,0,0,Math.PI*2);c.fill();
 c.fillStyle=style.plate;c.beginPath();c.ellipse(48,44,10,11,0,0,Math.PI*2);c.fill();
 c.fillStyle=style.edge;c.fillRect(43,35,10,2);c.fillStyle='#14232d';c.fillRect(40,41,16,7);
 c.fillStyle=style.visor;c.fillRect(41,42,14,3);c.fillStyle='#efffff';c.fillRect(43,42,5,1);
 if(style.kind==='shadow'){panel(30,32,4,13);c.fillStyle=style.visor;c.fillRect(30,29,3,3);c.fillRect(57,48,6,2)}
 if(style.kind==='solar'||style.kind==='royal'){panel(27,38,8,9);panel(62,43,8,9);c.fillStyle=style.edge;c.fillRect(46,49,4,5)}
 if(style.kind==='warden'){panel(28,52,9,17);panel(61,54,9,17);c.fillStyle=style.visor;c.fillRect(30,61,5,5);c.fillRect(63,63,5,5)}
 if(style.kind==='ember'){c.fillStyle=style.visor;for(let i=0;i<3;i++)c.fillRect(32,41+i*3,6,1)}
 if(style.kind==='ice'){c.fillStyle=style.visor;c.fillRect(59,45,3,8);c.fillRect(57,48,7,2)}
 pilotFrames.set(id,cvs);return cvs;
}
function drawPilot(c,x,y,size,angle,id='default',walk=0,moveAngle=angle,moving=false){
 const frame=pilotFrame(id);if(!frame){sprite(c,'player',x,y,size,angle);return;}
 const style=pilotStyles[id]||pilotStyles.default,scale=size/64;
 c.save();c.translate(x,y);c.scale(scale,scale);c.imageSmoothingEnabled=true;
 // Legs follow travel direction independently of the upper body's aim.
 c.save();c.rotate(moveAngle+Math.PI/2);c.fillStyle=style.dark;c.strokeStyle=style.edge;c.lineWidth=1;
 for(const side of [-1,1]){const stride=moving?Math.sin(walk)*side*4:0;c.fillRect(side*8-4,13+stride,8,13);c.strokeRect(side*8-3,17+stride,6,6)}c.restore();
 c.rotate(angle+Math.PI/2);c.drawImage(frame,-48,-48);c.restore();
}
const pilotTickBase=tick;
tick=function(dt){
 const active=run&&!run.paused&&!run.ended,oldX=run?.x,oldY=run?.y;pilotTickBase(dt);if(!active||!run)return;
 const dx=run.x-oldX,dy=run.y-oldY,distance=Math.hypot(dx,dy);
 const v=run.pilotVisual||(run.pilotVisual={angle:run.visualAim??run.angle,moveAngle:run.angle,walk:0,moving:false});
 const target=run.visualAim??run.angle,delta=Math.atan2(Math.sin(target-v.angle),Math.cos(target-v.angle));
 v.angle+=delta*(1-Math.exp(-18*dt));v.moving=distance>.01;
 if(v.moving){v.moveAngle=Math.atan2(dy,dx);v.walk=(v.walk+distance*.19)%(Math.PI*2)}
};
