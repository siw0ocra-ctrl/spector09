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
 const poly=(points,color=style.plate)=>{c.fillStyle=color;c.strokeStyle=style.dark;c.lineWidth=2;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();c.stroke()};
 if(style.kind==='royal')poly([[30,47],[63,47],[71,83],[51,74],[30,85],[34,64]],style.dark);
 if(style.kind==='shadow')poly([[31,39],[57,47],[61,78],[47,68],[27,73]],style.dark);
 if(style.kind==='ice')poly([[31,42],[63,42],[65,72],[49,66],[31,73]],'#d1e4e9');
 c.drawImage(assets.pilotBase,16,8,64,64);
 const panel=(x,y,w,h)=>{c.fillStyle=style.dark;c.fillRect(x-1,y-1,w+2,h+2);c.fillStyle=style.plate;c.fillRect(x,y,w,h);c.fillStyle=style.edge;c.fillRect(x+1,y,w-2,2)};
 // Each suit has a different helmet and major silhouette, not just a palette swap.
 if(style.kind==='ember'){
  panel(25,37,13,26);panel(61,39,12,25);panel(37,35,23,24);panel(42,31,13,6);
  c.fillStyle=style.visor;c.fillRect(40,39,17,4);c.fillStyle=style.dark;for(let i=0;i<4;i++)c.fillRect(40+i*5,49,2,8);
  c.fillStyle=style.edge;for(let i=0;i<3;i++){c.fillRect(27,43+i*5,9,2);c.fillRect(63,45+i*5,8,2)}
 }else if(style.kind==='ice'){
  poly([[47,28],[60,35],[64,51],[55,62],[38,59],[32,45],[37,33]],'#e1eff1');
  poly([[39,36],[56,36],[59,51],[50,55],[38,49]],style.dark);c.fillStyle=style.visor;c.fillRect(40,39,15,8);
  panel(27,46,7,12);panel(62,48,7,12);c.fillStyle=style.visor;c.fillRect(63,50,5,2);
 }else if(style.kind==='royal'){
  poly([[26,39],[36,35],[39,52],[23,55]]);poly([[58,37],[72,42],[76,59],[58,53]]);
  poly([[48,26],[59,35],[57,52],[48,60],[37,48],[38,34]]);
  poly([[39,39],[48,44],[57,38],[53,48],[47,50]],style.visor);c.fillStyle=style.edge;c.fillRect(47,27,3,11);
 }else if(style.kind==='shadow'){
  poly([[48,25],[62,48],[56,62],[36,56],[32,45]],style.dark);
  poly([[47,33],[56,43],[52,51],[38,45]],style.plate);c.fillStyle=style.visor;c.fillRect(42,42,12,2);
  poly([[26,45],[32,41],[36,56],[25,59]]);panel(61,44,5,15);
 }else if(style.kind==='solar'){
  c.fillStyle=style.dark;c.beginPath();c.ellipse(27,51,15,22,-.15,0,Math.PI*2);c.fill();c.strokeStyle=style.edge;c.lineWidth=3;c.beginPath();c.ellipse(27,51,11,18,-.15,0,Math.PI*2);c.stroke();
  poly([[40,30],[57,30],[62,42],[58,58],[39,58],[35,43]]);panel(60,39,14,17);
  c.fillStyle=style.visor;c.fillRect(39,40,18,3);c.fillRect(47,41,3,13);c.fillStyle=style.edge;c.fillRect(25,42,4,19);c.fillRect(19,49,16,4);
 }else if(style.kind==='warden'){
  poly([[25,30],[34,37],[34,63],[23,73],[23,44]]);poly([[63,37],[74,29],[75,71],[62,63]]);
  panel(37,34,22,24);panel(41,29,14,5);panel(37,59,22,8);c.fillStyle=style.visor;c.fillRect(40,39,6,6);c.fillRect(50,39,6,6);
  c.fillRect(25,49,5,14);c.fillRect(67,49,5,14);c.fillStyle=style.dark;c.fillRect(44,51,8,3);
 }else{
  panel(31,37,9,16);panel(56,43,9,14);panel(39,57,17,8);
  c.fillStyle=style.dark;c.beginPath();c.ellipse(48,45,12,13,0,0,Math.PI*2);c.fill();
  c.fillStyle=style.plate;c.beginPath();c.ellipse(48,44,10,11,0,0,Math.PI*2);c.fill();c.fillStyle=style.visor;c.fillRect(41,42,14,3);
 }
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
