'use strict';
// One pointer owns movement; a second finger can use the stim button independently.
let stickPointer=null,stickBounds=null;
function resetMobileStick(){
 const id=stickPointer;stickPointer=null;stickBounds=null;stopStick();
 if(id!==null&&stick.hasPointerCapture(id))stick.releasePointerCapture(id);
}
function updateMobileStick(e){
 if(stickPointer!==e.pointerId||!stickBounds)return;
 if(!run||run.paused||run.ended){resetMobileStick();return;}
 const {x,y,radius}=stickBounds,dx=e.clientX-x,dy=e.clientY-y,d=Math.hypot(dx,dy);
 const strength=Math.min(1,Math.max(0,d-5)/(radius-5));
 joy={x:d?dx/d*strength:0,y:d?dy/d*strength:0};
 stick.firstElementChild.style.transform=`translate(${joy.x*radius*.8}px,${joy.y*radius*.8}px)`;
}
stick.onpointerdown=e=>{
 if(stickPointer!==null||!run||run.paused||run.ended||(e.pointerType==='mouse'&&e.button!==0))return;
 e.preventDefault();const rect=stick.getBoundingClientRect();
 stickPointer=e.pointerId;stickBounds={x:rect.left+rect.width/2,y:rect.top+rect.height/2,radius:Math.min(rect.width,rect.height)*.4};
 stick.setPointerCapture(e.pointerId);updateMobileStick(e);
};
stick.onpointermove=updateMobileStick;
stick.onpointerup=stick.onpointercancel=stick.onlostpointercapture=e=>{if(e.pointerId===stickPointer)resetMobileStick()};
for(const event of ['blur','resize'])window.addEventListener(event,resetMobileStick);
document.addEventListener('visibilitychange',()=>{if(document.hidden)resetMobileStick()});
const mobilePauseBase=pause,mobileLevelBase=levelUp;
pause=function(){resetMobileStick();mobilePauseBase()};
levelUp=function(){resetMobileStick();mobileLevelBase()};
$('pause').onclick=pause;
$('stim').onpointerdown=e=>{if(e.button===0){e.preventDefault();stim()}};
// Keyboard / assistive activation still uses click; pointer activation occurs on press.
$('stim').onclick=e=>{if(e.detail===0)stim()};
