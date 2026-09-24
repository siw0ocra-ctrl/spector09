let simpleEffects=typeof matchMedia==='function'&&matchMedia('(pointer:coarse)').matches;try{const preference=localStorage.getItem('sector09-simple-effects');if(preference!==null)simpleEffects=preference==='1'}catch{}
'use strict';
function start(){}
function end(){}
const $=id=>document.getElementById(id), clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const stages=[
{name:'먼지의 전초기지',code:'DUST OUTPOST',desc:'버려진 광산 너머, 첫 번째 군단이 접근합니다.',color:'#343d2c',accent:'#a4b66c',reward:180,threat:'발톱 추적자',boss:'파괴자',difficulty:1},
{name:'붉은 협곡',code:'RED CANYON',desc:'빠른 기습 개체와 포격 사이로 길을 만드세요.',color:'#48342c',accent:'#caa279',reward:280,threat:'갑각 돌격대',boss:'협곡의 파수꾼',difficulty:1.3},
{name:'빙결 연구소',code:'FROZEN LAB',desc:'얼어붙은 연구 기지에서 원거리 군단을 저지하세요.',color:'#263a43',accent:'#8cbecc',reward:400,threat:'포자 포격수',boss:'프로스트 코어',difficulty:1.65},
{name:'오염된 정원',code:'TOXIC GARDEN',desc:'오염 지대를 피하며 끝없는 증식에 맞서세요.',color:'#2d3631',accent:'#b2ce79',reward:550,threat:'중장갑 갑각체',boss:'증식 군주',difficulty:2},
{name:'군단의 심장',code:'HIVE CORE',desc:'모든 군단이 집결했습니다. 마지막 핵을 파괴하세요.',color:'#342c40',accent:'#b99ccb',reward:800,threat:'혼합 정예 군단',boss:'오메가 코어',difficulty:2.5},
{name:'궤도 용광로',code:'ORBITAL FOUNDRY',desc:'궤도 포격의 붉은 경고 구역을 피하며 기계 군단을 돌파하세요.',color:'#42302a',accent:'#f1ad72',reward:1100,threat:'궤도 포격 · 중장갑',boss:'인페르노 엔진',difficulty:3},
{name:'공허의 성채',code:'VOID CITADEL',desc:'빠른 돌격대와 연속 포격이 성채를 지킵니다.',color:'#252e43',accent:'#9aaff3',reward:1450,threat:'고속 돌격대 · 연속 포격',boss:'공허 감시자',difficulty:3.6},
{name:'최후의 일식',code:'LAST ECLIPSE',desc:'세 갈래 포격과 정예 지휘 개체를 넘어 군단의 심부로 진격하세요.',color:'#39263c',accent:'#e6a2cd',reward:1900,threat:'정예 혼합 군단 · 집중 포격',boss:'이클립스 프라임',difficulty:4.3},
{name:'붕괴의 심연',code:'COLLAPSE ABYSS',desc:'네 갈래 궤도 포격이 쏟아지는 심연에서 중장갑 군단을 돌파하세요.',color:'#213c3c',accent:'#7ce0c7',reward:2400,threat:'4중 포격 · 중장갑 군단',boss:'어비스 타이탄',difficulty:5.1},
{name:'군단의 근원',code:'SWARM ORIGIN',desc:'다섯 갈래 집중 포격을 피해 군단의 근원 오리진을 격파하세요.',color:'#422c25',accent:'#ffd28a',reward:3000,threat:'5중 포격 · 최종 정예 군단',boss:'오리진 오버로드',difficulty:6}
];
const research=[
{id:'crit',name:'치명타 확률',desc:'모든 무기 치명타 확률 +3%p',icon:'CRIT',base:120,step:3},
{id:'damage',name:'가우스 가속기',desc:'기본 공격력 +12%',icon:'ATK',base:80,step:12},
{id:'hp',name:'강화 장갑',desc:'최대 체력 +20',icon:'HP',base:65,step:20},
{id:'speed',name:'기동 부스터',desc:'이동 속도 +5%',icon:'MOV',base:70,step:5},
{id:'regen',name:'나노 복구',desc:'초당 체력 회복 +0.3',icon:'REG',base:95,step:.3},
{id:'gold',name:'자산 증식',desc:'영구 강화 · 처치·상자 골드 +10%',icon:'GOLD',base:85,step:10},
{id:'magnet',name:'자력 수집기',desc:'경험치 수집 범위 +20%',icon:'MAG',base:60,step:20},
{id:'reroll',name:'전술 재선택',desc:'게임 입장마다 공용 리롤 +1회',icon:'ROLL',base:150,step:1}
];

const weapons=[
{id:'gauss',name:'가우스 소총',icon:'AR',desc:'Lv.3 2발 · Lv.5 3발 · 좁은 부채꼴 사격',passive:'rapid',awake:'오버드라이브',effect:'3발 레일 탄환 · 탄환당 최대 5명 관통 · 사거리 증가',base:90,color:'#def49b'},
{id:'shotgun',name:'전술 지뢰',icon:'MN',desc:'발밑 설치 · 적 접근 시 범위 폭발',passive:'wealth',awake:'자기장 지뢰',effect:'자기장 감속 · 강화 폭발',base:100,color:'#f5bf77'},
{id:'laser',name:'레이저',icon:'LA',desc:'직선상의 모든 적을 관통',passive:'area',awake:'궤도 절단기',effect:'3방향 광선 · 사거리 증가',base:120,color:'#70e4e8'},
{id:'missile',name:'유도 미사일',icon:'MS',desc:'적을 추적하는 범위 폭발탄',passive:'power',awake:'아포칼립스',effect:'3연발 유도탄 · 폭발 범위 증가',base:120,color:'#ff9b6a'},
{id:'nova',name:'전기 충격파',icon:'NV',desc:'주변의 모든 적에게 원형 피해',passive:'magnet',awake:'이온 폭풍',effect:'범위 확대 · 적 이동 속도 감소',base:110,color:'#94bfff'},
{id:'drone',name:'궤도 드론',icon:'DR',desc:'주위를 회전하며 주변 적에게 광선 발사',passive:'armor',awake:'수호 편대',effect:'드론 6기 · 적 탄환 소거',base:130,color:'#c4f589'},
{id:'flame',name:'화염방사기',icon:'FL',desc:'전방 부채꼴 범위에 지속 피해',passive:'regen',awake:'태양의 숨결',effect:'전방위 화염 · 범위 확대',base:100,color:'#ff8268'},
{id:'lightning',name:'연쇄 번개',icon:'LT',desc:'가까운 적 사이를 튕기는 번개',passive:'crit',awake:'제우스',effect:'연쇄 대상 2배 · 피해 증가',base:130,color:'#d6acff'}
];
const passives=[
{id:'crit',name:'정밀 조준',desc:'모든 무기 치명타 확률 +5%p · 치명타 피해 2배'},
{id:'rapid',name:'고속 탄창',desc:'모든 무기 재사용 시간 10% 감소'},
{id:'power',name:'철갑 탄두',desc:'모든 무기 피해 +18%'},
{id:'area',name:'증폭 코일',desc:'범위와 사거리 +15%'},
{id:'armor',name:'전술 방어막',desc:'최대 체력 +20, 받는 피해 8% 감소'},
{id:'regen',name:'응급 복구',desc:'체력 35 회복, 초당 회복 +0.4'},
{id:'magnet',name:'자력 증폭',desc:'수집 범위 +35%, 이동 속도 +4%'},
{id:'wealth',name:'자산 증식',desc:'이번 작전 한정 · 획득 이후 전투 골드 +10%'}
];


const rarities=[{name:'노멀',className:'normal',chance:60,mult:1},{name:'희귀',className:'rare',chance:25,mult:1.1},{name:'영웅',className:'epic',chance:12,mult:1.2},{name:'전설',className:'legendary',chance:3,mult:1.35}];
function rollRarity(roll=Math.random()){return roll<.60?0:roll<.85?1:roll<.97?2:3}
function passiveStrength(id){return (run.skills[id]||0)+(run.passiveBonuses[id]||0)}
function cardGain(c,tier){let m=rarities[tier].mult,[kind,id]=c.id.split(':');const fmt=n=>Number(n.toFixed(2));if(kind==='w'&&id==='gauss'){const level=run.weapons[id]||0,next=Math.min(5,level+1),count=next>=5?3:next>=3?2:1,scale=count===3?.5:count===2?.65:1,oldCount=level>=5?3:level>=3?2:1,oldScale=oldCount===3?.5:oldCount===2?.65:1,before=(1+(level-1)*.28+(run.weaponBonuses[id]||0))*oldCount*oldScale,after=(1+(next-1)*.28+(run.weaponBonuses[id]||0)+.28*(m-1))*count*scale;return (level?'전탄 명중 피해 +'+fmt((after/before-1)*100)+'%':'새 무기 획득')+' · '+count+'발 · 발당 기준 피해 '+(scale*100)+'%'}if(kind==='w'){let level=run.weapons[id]||0,current=1+(level-1)*.28+(run.weaponBonuses[id]||0);return level?'피해 +'+fmt(.28*m/current*100)+'% (현재 대비)':'새 무기 획득'+(tier?' · 기본 피해 +'+fmt(.28*(m-1)*100)+'%':'')}if(kind==='p'){return {crit:'치명타 확률 +'+fmt(5*m)+'%p · 치명타 피해 2배',rapid:'재사용 시간 −'+fmt((1-Math.pow(.9,m))*100)+'%',power:'모든 무기 피해 +'+fmt(18*m)+'%',area:'범위와 사거리 +'+fmt(15*m)+'%',armor:'최대 체력 +'+fmt(20*m)+' · 피해 감소 +'+fmt(8*m)+'%',regen:'즉시 회복 +'+Math.ceil(35*m)+' · 초당 회복 +'+fmt(.4*m),wealth:'전투 골드 +'+fmt(10*m)+'% · 획득 이후 적용',magnet:'수집 범위 +'+fmt(35*m)+'% · 이동 속도 +'+fmt(4*m)+'%'}[id]}return c.desc}

const fresh=()=>({version:2,cosmetics:cleanCosmetics(null),weaponResearch:Object.fromEntries(weapons.map(w=>[w.id,0])),gold:0,unlocked:0,clears:[],upgrades:Object.fromEntries(research.map(r=>[r.id,0])),totalKills:0});
let save=fresh(),storageOK=true;
// Progress is exclusively loaded from the version 3 server account.
function persist(){$('gold').textContent=Math.floor(save.gold).toLocaleString()}
let selected=save.unlocked,view='camp',run=null,keys={},joy={x:0,y:0},soundOn=false,audioCtx,assets={},assetsReady=false;
const canvas=$('game'),ctx=canvas.getContext('2d');let W=1000,H=600;
function toast(t){$('toast').textContent=t;$('toast').style.opacity=1;clearTimeout(toast.t);toast.t=setTimeout(()=>$('toast').style.opacity=0,2600)}
function beep(freq=200,time=.06,type='square',vol=.015){if(!soundOn)return;try{audioCtx??=new(window.AudioContext||window.webkitAudioContext)();let o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.setValueAtTime(freq,audioCtx.currentTime);g.gain.setValueAtTime(vol,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+time);o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+time)}catch{}}
function show(v){if(window.marketActive&&v!=='market'){toast('진행 중인 게임이 끝난 뒤 이동할 수 있습니다.');return}view=v;document.body.classList.toggle('combat-view',v==='battle');['camp','shop','battle','market','store'].forEach(id=>$(id).hidden=id!==v);$('campTab').classList.toggle('active',v==='camp');$('shopTab').classList.toggle('active',v==='shop');$('campTab').disabled=v==='battle';$('shopTab').disabled=v==='battle';$('marketTab').disabled=v==='battle';$('marketTab').classList.toggle('active',v==='market');if(v==='camp')renderCamp();if(v==='shop')renderShop();$('storeTab').disabled=v==='battle';$('storeTab').classList.toggle('active',v==='store');if(v==='store')renderStore()}
function renderCamp(){$('stages').innerHTML=stages.map((s,i)=>`<button class="stage ${i===selected?'selected':''}" data-stage="${i}" ${i>save.unlocked?'disabled':''}><span class="number">${String(i+1).padStart(2,'0')}</span><div><b>${s.name}</b><small>${s.code}</small></div><span class="state">${save.clears.includes(i)?'완료 ✓':i>save.unlocked?'잠김':'→'}</span></button>`).join('');$('stages').querySelectorAll('button').forEach(b=>b.onclick=()=>{selected=+b.dataset.stage;renderCamp()});let s=stages[selected];$('missionNo').textContent=`OPERATION ${String(selected+1).padStart(2,'0')}`;$('missionName').textContent=s.name;$('biome').textContent=s.code+' / SECTOR 09';$('missionDesc').textContent=s.desc;$('reward').textContent=s.reward+' G';$('threat').textContent=s.threat;$('bossIntel').textContent=s.boss+' · '+bossDesigns[selected].pattern+' — '+bossDesigns[selected].tip;drawPreview();persist()}
function cost(r){return Math.ceil(r.base*Math.pow(1.48,save.upgrades[r.id]))}
function buy(){}
function renderResearch(){$('upgrades').innerHTML=research.map(r=>{let lv=save.upgrades[r.id];return `<article class="upgrade"><div class="upgrade-top"><span>${r.icon}</span><span>LV. ${lv} / 10</span></div><h3>${r.name}</h3><p>${r.desc}<br>${r.id==='reroll'?'카드별 무료 1회 + 공용 '+lv+'회':'현재 효과: +'+Number((lv*r.step).toFixed(1))+(r.id==='crit'?'%p':['damage','speed','gold','magnet'].includes(r.id)?'%':'')}</p><div class="levels">${Array.from({length:10},(_,i)=>`<i class="${i<lv?'on':''}"></i>`).join('')}</div><button data-upgrade="${r.id}" ${lv>=10||save.gold<cost(r)?'disabled':''}>${lv>=10?'최대 연구 완료':'◆ '+cost(r).toLocaleString()+' G · 연구'}</button></article>`}).join('');$('upgrades').querySelectorAll('button').forEach(b=>b.onclick=()=>{buy(b.dataset.upgrade)});persist()}
function resize(){const rect=canvas.getBoundingClientRect();W=Math.max(1,rect.width);H=Math.max(1,rect.height);canvas.width=W;canvas.height=H;ctx.imageSmoothingEnabled=false;if(run?.paused)draw()}
window.addEventListener('resize',resize);
function drawMonster(c,type,x,y,r,angle,time=0,hit=false){
  c.save();c.translate(x,y);c.rotate(angle);c.scale(r/24,r/24);
  const palettes=[['#a84743','#ee8970','#ffdec3'],['#634584','#ab79c9','#ecb9ff'],['#466353','#88a67a','#d0ed9a'],['#71603b','#c2a56c','#ffe9a4']];
  const [dark,light,glow]=palettes[type],phase=time*(type===2?5:10)+x*.017+y*.013;
  c.lineJoin='round';c.lineCap='round';
  const path=(points,fill,stroke='#172329',width=2)=>{c.beginPath();points.forEach(([a,b],i)=>i?c.lineTo(a,b):c.moveTo(a,b));c.closePath();c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke()}};
  const oval=(a,b,rx,ry,fill,stroke='#172329',width=2)=>{c.beginPath();c.ellipse(a,b,rx,ry,0,0,Math.PI*2);c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke()}};
  // Jointed legs keep each silhouette readable while moving.
  const legs=type===3?4:type===2?3:2;
  for(let side of [-1,1])for(let i=0;i<legs;i++){
    const a=12-i*(type===3?9:13),swing=Math.sin(phase+i*1.8+side)*3;
    path([[a,side*9],[a-8+swing,side*(22+(type===3?3:0))],[a+3+swing,side*30],[a-1+swing,side*21],[a+5,side*12]],dark);
    c.strokeStyle=light;c.lineWidth=1.2;c.beginPath();c.moveTo(a,side*13);c.lineTo(a-5+swing,side*21);c.stroke();
  }
  if(type===0){
    oval(-8,0,16,13,dark);path([[-22,0],[-10,-11],[5,-10],[15,0],[5,10],[-10,11]],light);
    for(let side of [-1,1])path([[8,side*7],[20,side*17],[30,side*9],[23,side*10],[16,side*3]],'#d3a58b');
    oval(12,0,9,8,dark);for(let side of [-1,1])oval(16,side*4,3,1.8,glow,null);
    path([[-19,0],[-9,-4],[3,0],[-9,4]],'#f1ae89',null);
  }else if(type===1){
    path([[-15,-8],[-31,0],[-15,8],[-8,0]],dark);
    oval(-8,0,20,17,dark);oval(-11,0,13,12,light);
    for(let side of [-1,1]){oval(-12,side*8,5,4,glow);path([[0,side*12],[9,side*22],[15,side*16],[6,side*10]],light)}
    oval(9,0,12,10,dark);path([[12,-6],[29,-4],[33,0],[29,4],[12,6]],light);oval(28,0,3,3,'#f9ddff',null);
    oval(-12,0,5+Math.sin(phase*.6),5,'#dfadf8',null);
  }else if(type===2){
    oval(-3,0,24,20,dark);
    for(let a of [-16,-5,6]){path([[a-6,0],[a-3,-17],[a+6,-15],[a+11,0],[a+6,15],[a-3,17]],light);c.strokeStyle='#bdce9c';c.lineWidth=1;c.beginPath();c.moveTo(a-2,-13);c.lineTo(a+4,-11);c.stroke()}
    for(let side of [-1,1])path([[5,side*13],[18,side*25],[19,side*9]],'#b0bf9b');
    oval(19,0,9,11,dark);for(let side of [-1,1])oval(23,side*5,3,2,glow,null);
  }else{
    for(let side of [-1,1])path([[-18,side*11],[-29,side*28],[-10,side*21],[0,side*28],[8,side*17]],dark);
    oval(-7,0,22,19,dark);path([[-29,0],[-17,-13],[0,-16],[13,0],[0,16],[-17,13]],light);
    for(let a of [-17,-7,3])path([[a-5,0],[a,-8],[a+5,0],[a,8]],dark);
    oval(-6,0,5,7,glow,null);oval(13,0,12,12,dark);
    for(let side of [-1,1]){path([[8,side*10],[21,side*24],[34,side*13],[24,side*16],[18,side*5]],'#dcc393');oval(18,side*5,4,2,'#fff0b5',null)}
    path([[18,-3],[29,0],[18,3]],light);
  }
  if(hit){c.globalAlpha*=.45;oval(0,0,22,16,'#fff3d7',null)}
  c.restore();
}

function sprite(c,name,x,y,size,angle=0){let im=assets[name];if(!im||!im.complete||!im.naturalWidth)return;c.save();c.translate(x,y);c.rotate(angle);let ratio=im.naturalHeight/im.naturalWidth;c.drawImage(im,-size/2,-size*ratio/2,size,size*ratio);c.restore()}
function ground(c,w,h,px,py,s,time=0){c.fillStyle=s.color;c.fillRect(0,0,w,h);let cell=96,ox=((px-w/2)%cell+cell)%cell,oy=((py-h/2)%cell+cell)%cell;c.strokeStyle='#ffffff05';c.lineWidth=1;for(let x=-ox;x<w;x+=cell)for(let y=-oy;y<h;y+=cell){c.strokeRect(x,y,cell,cell);let k=Math.sin((x+px)*12.9898+(y+py)*78.233);c.fillStyle=k>.3?'#00000014':'#ffffff04';c.fillRect(x+8,y+6,70,76)}if(assets.ground){let g=assets.ground;c.globalAlpha=.16;for(let x=-ox;x<w;x+=cell)for(let y=-oy;y<h;y+=cell)c.drawImage(g,x,y,cell,cell);c.globalAlpha=1}c.fillStyle='#0000000a';for(let i=0;i<15;i++){let wx=Math.sin(i*19.8)*850,wy=Math.cos(i*7.3)*800,x=wx-px+w/2,y=wy-py+h/2;if(assets.rock)sprite(c,'rock',x,y,50+(i%3)*15,i);else c.fillRect(x,y,3,3)}}
function drawPreview(){let c=$('previewCanvas').getContext('2d');c.imageSmoothingEnabled=false;ground(c,800,400,0,0,stages[selected]);for(let i=0;i<14;i++){let a=i*2.4,x=440+Math.cos(a)*(130+i*10),y=150+Math.sin(a)*(80+i*4);drawMonster(c,i%3,x,y,i%3===2?18:14,Math.atan2(180-y,400-x),0,false,i%2)}drawBoss(c,selected,650,175,50,Math.PI,0);drawPilot(c,350,170,64,-.2,save.cosmetics.equipped.suit);c.strokeStyle='#d4ee8c';c.globalAlpha=.6;c.beginPath();c.moveTo(380,168);c.lineTo(460,156);c.stroke();c.globalAlpha=1}
function beginLocalRun(serverRun){if(!assetsReady){toast('전투 에셋을 불러오는 중입니다. 잠시 후 다시 시작하세요.');return}let u=save.upgrades;run={stage:serverRun.stage??selected,t:0,kills:0,gold:0,level:1,xp:0,next:9,x:0,y:0,hp:100+u.hp*20,maxHp:100+u.hp*20,speed:165*(1+u.speed*.05),damage:19*(1+u.damage*.12),rate:.56,shot:0,spawn:0,enemies:[],bullets:[],hostile:[],orbs:[],fx:[],angle:0,paused:false,ended:false,damageCD:0,stim:0,stimCD:0,bossSpawned:false,bannerTime:3,novaCD:0,missileCD:0,serverId:serverRun.id,difficulty:serverRun.difficulty,startWeapon:serverRun.startWeapon,killTypes:[0,0,0,0],goldChests:0,goldSupplies:0,weapons:{[serverRun.startWeapon]:1},weaponBonuses:{},weaponDamage:{},passiveBonuses:{},cardHistory:[],wealthLedger:[],mines:[],mineSerial:0,choiceRarities:[],awakened:{},cooldowns:{},skills:Object.fromEntries(passives.map(p=>[p.id,0])),cardRerolls:[1,1,1],rerolls:u.reroll,drops:[],chests:[],chestClock:25,chestsOpened:0,lootText:[],bossZones:[],chill:0,hazards:[],hazardClock:5,pickups:0,modalMode:null,choices:[]};keys={};joy={x:0,y:0};show('battle');resize();seedChests();$('battleStage').textContent=stages[selected].name;$('banner').textContent='OPERATION '+String(selected+1).padStart(2,'0')+' · 생존 개시';$('bossBar').hidden=true;updateHUD();canvas.focus();beep(400,.2,'sawtooth')}
function openModal(html){$('modalContent').innerHTML=html;const heading=$('modalContent').querySelector('h2');if(heading){heading.tabIndex=-1;heading.setAttribute('autofocus','')}if(!$('modal').open)$('modal').showModal();if(heading)heading.focus({preventScroll:true});$('modal').scrollTop=0}
function closeModal(){$('modal').close()}
function damageReport(r){const rows=Object.keys(r.weapons).map(id=>({w:weapons.find(w=>w.id===id),damage:r.weaponDamage[id]||0})).sort((a,b)=>b.damage-a.damage),total=rows.reduce((n,row)=>n+row.damage,0);return `<section class="damage-report"><h3>무기별 피해 기여도</h3><p>총 피해 ${Math.round(total).toLocaleString()} · 치명타 포함 / 상자·초과 피해 제외</p>${rows.map(({w,damage})=>{const pct=total?damage/total*100:0;return `<div class="damage-row"><div><b>${r.awakened[w.id]?w.awake:w.name}</b><span>${Math.round(damage).toLocaleString()} <strong>${pct.toFixed(1)}%</strong></span></div><div class="damage-track"><i style="width:${pct}%;background:${w.color}"></i></div></div>`}).join("")}</section>`;}
function stim(){if(!run||run.paused||run.ended||run.stimCD>0)return;run.stim=4;run.stimCD=16;beep(450,.18,'sawtooth');run.fx.push({x:run.x,y:run.y,r:15,max:90,t:.5,life:.5,color:'#c7f268'})}
function spawn(boss=false){let a=Math.random()*Math.PI*2,d=Math.hypot(W,H)/2+60,s=stages[run.stage],type=boss?3:Math.random()<Math.min(.48,.1+run.t/500+run.stage*.05)?(Math.random()<.5?1:2):0;let hp=([32,65,120,1400][type])*(1+(s.difficulty-1)*.7)*(boss?1:1+run.t/260)*(boss?modeRules().bossHp:modeRules().hp);run.enemies.push({x:run.x+Math.cos(a)*d,y:run.y+Math.sin(a)*d,hp,maxHp:hp,type,r:[14,17,23,48][type],speed:[62,48,37,35][type]*(1+run.stage*.06)*(run.stage===6&&type===0?1.35:1)*modeRules().speed,shot:2+Math.random()*2,hit:0,angle:a+Math.PI})}
function criticalChance(){return Math.min(1,(save.upgrades.crit||0)*.03+passiveStrength('crit')*.05)}
function combatGold(base){const units=base*(10000+Math.round(passiveStrength('wealth')*1000))+(run.wealthGoldRemainder||0);run.wealthGoldRemainder=units%10000;return Math.floor(units/10000)}
function hurt(e,damage,weaponId){if(run.ended||e.dead)return;if(e.isChest){breakChest(e);return;}if(Math.random()<criticalChance()){damage*=2;run.fx.push({x:e.x,y:e.y,r:e.r,max:e.r*1.8,t:.18,life:.18,color:'#ffe180'})}if(weaponId&&run.weapons[weaponId])run.weaponDamage[weaponId]=(run.weaponDamage[weaponId]||0)+Math.min(Math.max(0,e.hp),damage);e.hp-=damage;e.hit=.08;if(e.hp<=0&&!e.dead){e.dead=true;run.kills++;run.killTypes[e.type]++;let gold=Math.max(1,Math.floor(([2,4,7,50][e.type])*(1+save.upgrades.gold*.1)*modeRules().gold));run.gold+=combatGold(gold);run.orbs.push({x:e.x,y:e.y,n:[2,4,7,25][e.type]*modeRules().xp});run.fx.push({x:e.x,y:e.y,r:5,max:e.r*2,t:.25,life:.25,color:e.type===3?'#f4b273':'#bcc978'});if(e.type===3)end(true)}}
function damagePlayer(d){if(run.ended||run.damageCD>0)return;run.hp-=d*modeRules().damage*Math.max(.3,1-passiveStrength('armor')*.08);run.damageCD=.55;beep(80,.1,'sawtooth');if(run.hp<=0){run.hp=0;end(false)}}
function tick(dt){let r=run;if(!r||r.paused||r.ended)return;r.t+=dt;r.chill=Math.max(0,r.chill-dt);updateBossZones(dt);updateHazards(dt);if(r.ended)return;r.damageCD=Math.max(0,r.damageCD-dt);r.stimCD=Math.max(0,r.stimCD-dt);r.stim=Math.max(0,r.stim-dt);r.hp=Math.min(r.maxHp,r.hp+(save.upgrades.regen*.3+passiveStrength('regen')*.4)*dt);r.bannerTime-=dt;if(r.bannerTime<=0)$('banner').textContent='';let dx=(keys.d||keys.ArrowRight?1:0)-(keys.a||keys.ArrowLeft?1:0)+joy.x,dy=(keys.s||keys.ArrowDown?1:0)-(keys.w||keys.ArrowUp?1:0)+joy.y,len=Math.hypot(dx,dy);if(len>1){dx/=len;dy/=len}let sp=r.speed*(r.stim>0?1.55:1)*(r.chill>0?.7:1);r.x+=dx*sp*dt;r.y+=dy*sp*dt;if(len>.1)r.angle=Math.atan2(dy,dx);updateChests(dt);
if(r.t>=180&&!r.bossSpawned){r.bossSpawned=true;spawn(true);$('banner').textContent=stages[r.stage].boss+' 접근';r.bannerTime=4;$('bossBar').hidden=false;$('bossBar').querySelector('span').textContent=stages[r.stage].boss;beep(100,.8,'sawtooth')}
r.spawn-=dt;if(r.spawn<=0&&r.enemies.length<180){let count=1+Math.floor(r.t/45)+Math.floor(r.stage/2);for(let i=0;i<count&&r.enemies.length<180;i++)spawn();r.spawn=Math.max(.22,1.1-r.t/260-r.stage*.08)/modeRules().spawn}
weaponTick(dt);if(r.ended)return;
for(let e of r.enemies){if(e.dead)continue;if(e.type===3){updateBoss(e,dt);if(r.ended)return;continue}let dx=r.x-e.x,dy=r.y-e.y,d=Math.hypot(dx,dy)||1;e.angle=Math.atan2(dy,dx);let stop=e.type===1&&d<260;if(!stop){e.x+=dx/d*e.speed*(e.slow>r.t?.45:1)*dt;e.y+=dy/d*e.speed*(e.slow>r.t?.45:1)*dt}e.hit=Math.max(0,e.hit-dt);if(d<e.r+13)damagePlayer((e.type===3?26:11)*(1+r.stage*.13));if(e.type===1||e.type===3){e.shot-=dt;if(e.shot<0&&d<700){let n=e.type===3?9+Math.max(0,r.stage-4)*3:1;for(let i=0;i<n;i++){let a=e.type===3?i*Math.PI*2/n+r.t*.4:e.angle;r.hostile.push({x:e.x,y:e.y,vx:Math.cos(a)*145*modeRules().projectile,vy:Math.sin(a)*145*modeRules().projectile,life:5,r:6})}e.shot=e.type===3?Math.max(1.3,2.3-Math.max(0,r.stage-4)*.25):3.2}}if(d>Math.hypot(W,H)+300&&e.type!==3){let a=Math.random()*Math.PI*2;e.x=r.x+Math.cos(a)*(Math.hypot(W,H)/2+50);e.y=r.y+Math.sin(a)*(Math.hypot(W,H)/2+50)}}
const bulletTargets=combatTargets();for(let b of r.bullets){if(b.homing){let target=nearestTarget(bulletTargets,b.x,b.y);if(target){let a=Math.atan2(target.y-b.y,target.x-b.x);b.vx=Math.cos(a)*320;b.vy=Math.sin(a)*320}}b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;for(let e of bulletTargets){if(!e.dead&&!e.opened&&!b.hit.has(e)&&(b.x-e.x)**2+(b.y-e.y)**2<(e.r+b.r)**2){b.hit.add(e);if(b.blast){ring(b.x,b.y,b.blast,b.color,b.weaponId);for(let target of bulletTargets)if(!target.dead&&!target.opened&&(target.x-b.x)**2+(target.y-b.y)**2<b.blast**2)hurt(target,b.damage,b.weaponId)}else hurt(e,b.damage,b.weaponId);if(--b.pierce<=0){b.life=0;break}}}if(r.ended)return;}
for(let b of r.hostile){b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;if(Math.hypot(b.x-r.x,b.y-r.y)<19){const before=r.hp;damagePlayer(10*(1+r.stage*.15));if(b.chill&&r.hp<before)r.chill=1.2;b.life=0}}
let magnet=75*(1+save.upgrades.magnet*.2+passiveStrength('magnet')*.35);for(let o of r.orbs){let d=Math.hypot(r.x-o.x,r.y-o.y);if(d<magnet||o.attracted){o.x+=(r.x-o.x)*dt*9;o.y+=(r.y-o.y)*dt*9}if(d<18){r.xp+=o.n;o.dead=true}}r.orbs=r.orbs.filter(o=>!o.dead);if(r.orbs.length>500){let o=r.orbs.shift();let target=r.orbs[0];target.n+=o.n}r.enemies=r.enemies.filter(e=>!e.dead);r.bullets=r.bullets.filter(b=>b.life>0);r.hostile=r.hostile.filter(b=>b.life>0);r.fx=r.fx.filter(f=>(f.t-=dt)>0);
if(r.stage===3&&r.t>25&&!r.bossSpawned){let phase=r.t%12;if(phase<4){let hx=Math.sin(Math.floor(r.t/12)*7)*250,hy=Math.cos(Math.floor(r.t/12)*5)*250;if(Math.hypot(r.x-hx,r.y-hy)<75)damagePlayer(7)}}
if(r.xp>=r.next&&!r.ended){r.xp-=r.next;r.level++;r.next=Math.floor(10+r.level*2.2);levelUp()}updateHUD(false)}
function draw(){if(!run||view!=='battle')return;let r=run;ground(ctx,W,H,r.x,r.y,stages[r.stage],r.t);let sx=x=>x-r.x+W/2,sy=y=>y-r.y+H/2;drawMines(sx,sy);drawHazards(sx,sy);drawBossWarnings(sx,sy);drawChests(sx,sy);drawDrops(sx,sy);if(r.stage===3&&r.t>25&&!r.bossSpawned&&r.t%12<4){ctx.fillStyle='#a4d13e38';ctx.beginPath();ctx.arc(sx(Math.sin(Math.floor(r.t/12)*7)*250),sy(Math.cos(Math.floor(r.t/12)*5)*250),75,0,7);ctx.fill()}
ctx.fillStyle='#75c2d2';ctx.beginPath();for(let o of r.orbs){let x=sx(o.x),y=sy(o.y);if(x< -6||y< -6||x>W+6||y>H+6)continue;ctx.moveTo(x,y-5);ctx.lineTo(x+4,y);ctx.lineTo(x,y+5);ctx.lineTo(x-4,y);ctx.closePath()}ctx.fill();
for(let e of r.enemies){let x=sx(e.x),y=sy(e.y);if(x< -100||x>W+100||y< -100||y>H+100)continue;ctx.fillStyle='#00000030';ctx.beginPath();ctx.ellipse(x,y+e.r*.7,e.r*.8,e.r*.35,0,0,7);ctx.fill();if(e.type===3)drawBoss(ctx,r.stage,x,y,e.r,e.angle,r.t,e.hit);else drawMonster(ctx,e.type,x,y,e.r,e.angle,r.t,e.hit,e.visualVariant);if(e.hp<e.maxHp){ctx.fillStyle='#342f29';ctx.fillRect(x-e.r,y-e.r-13,e.r*2,3);ctx.fillStyle='#ed956d';ctx.fillRect(x-e.r,y-e.r-13,e.r*2*Math.max(0,e.hp/e.maxHp),3)}}
for(let b of r.bullets)drawCombatProjectile(b,sx(b.x),sy(b.y));
for(let b of r.hostile){if(b.x<r.x-W/2-8||b.x>r.x+W/2+8||b.y<r.y-H/2-8||b.y>r.y+H/2+8)continue;ctx.fillStyle=b.color||'#ed956d';ctx.beginPath();ctx.arc(sx(b.x),sy(b.y),5,0,7);ctx.fill()}
ctx.strokeStyle=r.stim>0?'#d7ff85':equippedCosmetic('suit')?.color||'#c7f26850';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(W/2,H/2+13,22,10,0,0,7);ctx.stroke();if(r.damageCD>0)ctx.globalAlpha=.78;const pv=r.pilotVisual;drawPilot(ctx,W/2,H/2,52,pv?.angle??r.angle,save.cosmetics.equipped.suit,pv?.walk||0,pv?.moveAngle??r.angle,!!pv?.moving);ctx.globalAlpha=1;
drawLootText(sx,sy);drawWeaponEffects(sx,sy);for(let f of r.fx)if(!f.line)drawCombatRing(f,sx,sy);drawCombatVfx(sx,sy);if(r.damageCD>.4){ctx.fillStyle='#d14e2517';ctx.fillRect(0,0,W,H)}}
function updateHUD(force=true){let r=run;if(!force&&r.t<(r.nextHUDUpdate||0))return;r.nextHUDUpdate=r.t+.1;$('timer').textContent=String(Math.floor(r.t/60)).padStart(2,'0')+':'+String(Math.floor(r.t%60)).padStart(2,'0');$('hp').max=r.maxHp;$('hp').value=r.hp;$('hpText').textContent=Math.ceil(r.hp)+' / '+r.maxHp;$('xp').max=r.next;$('xp').value=r.xp;$('level').textContent='LV.'+r.level;$('kills').textContent=r.kills+' 처치';$('runGold').textContent='예상 ◆ '+r.gold+' G';$('stim').innerHTML=r.stim>0?'가속 중 <b>'+r.stim.toFixed(1)+'s</b>':r.stimCD>0?'재충전 <b>'+Math.ceil(r.stimCD)+'s</b>':'SPACE <b>스팀팩</b>';$('stim').disabled=r.stimCD>0;let boss=r.enemies.find(e=>e.type===3);if(boss){$('bossHp').max=boss.maxHp;$('bossHp').value=Math.max(0,boss.hp)}renderLoadout()}

let last=0;function frame(t){let dt=Math.min(.035,(t-last)/1000||.016);last=t;tick(dt);if(!run?.paused&&!document.hidden)draw();requestAnimationFrame(frame)}requestAnimationFrame(frame);
window.addEventListener('keydown',e=>{if(view!=='battle'||($('dataModal').open||$('rankModal').open))return;let k=e.key.length===1?e.key.toLowerCase():e.key;if([' ','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(k))e.preventDefault();keys[k]=true;if(k===' '&&!e.repeat)stim();if(k==='Escape'){e.preventDefault();if(run?.paused&&run.modalMode==='pause')resume();else pause()}});window.addEventListener('keyup',e=>keys[e.key.length===1?e.key.toLowerCase():e.key]=false);window.addEventListener('blur',()=>{keys={};joy={x:0,y:0};pause()});document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});$('modal').addEventListener('cancel',e=>{e.preventDefault();if(run?.modalMode==='pause')resume()});$('stim').onclick=stim;$('pause').onclick=pause;$('start').onclick=start;$('campTab').onclick=()=>show('camp');$('shopTab').onclick=()=>show('shop');$('back').onclick=()=>show('camp');$('sound').onclick=()=>{soundOn=!soundOn;$('sound').textContent='소리 '+(soundOn?'ON':'OFF');$('sound').setAttribute('aria-label',soundOn?'소리 끄기':'소리 켜기');beep()};
let stick=$('stick');function moveStick(e){let rect=stick.getBoundingClientRect(),dx=e.clientX-rect.left-rect.width/2,dy=e.clientY-rect.top-rect.height/2,d=Math.hypot(dx,dy),m=Math.min(d,40);joy={x:d?dx/d*m/40:0,y:d?dy/d*m/40:0};stick.firstElementChild.style.transform=`translate(${joy.x*32}px,${joy.y*32}px)`}stick.onpointerdown=e=>{stick.setPointerCapture(e.pointerId);moveStick(e)};stick.onpointermove=e=>{if(stick.hasPointerCapture(e.pointerId))moveStick(e)};function stopStick(){joy={x:0,y:0};stick.firstElementChild.style.transform=''}stick.onpointerup=stopStick;stick.onpointercancel=stopStick;
$('creditsBtn').onclick=()=>{if(view==='battle')pause();else{openModal('<div class="eyebrow">ASSET CREDITS</div><h2>함께 만든 우주.</h2><p>캐릭터: fightswithbears · 2D Topdown Survival Character · CC0 / SECTOR 09 장갑·동작 연출<br>몬스터: <a href="https://whiteknightstudios.itch.io/top-down-bug-sprites" target="_blank" rel="noopener">W_K_Studio · Top-down Alien Bug Sprites</a> · CC0<br>무기 아이콘: Zintoki PIXWEP · CC0 / Kenney · CC0 / 자체 도형<br>전장·전투 효과: Kenney Sci-Fi RTS / Tanks Remastered / Particle Pack · CC0<br>게임 그래픽: <a href="https://kenney.nl/assets" target="_blank" rel="noopener">Kenney</a> · CC0<br>드론: <a href="https://kenney.nl/assets/space-shooter-remastered" target="_blank" rel="noopener">Space Shooter Remastered</a> · CC0<br>효과음: 브라우저 합성 오디오<br>게임 디자인 및 코드: SECTOR 09</p><p>영구 강화와 골드는 서버에 저장됩니다. 다른 브라우저에서 이어 하려면 내 데이터의 복구 코드를 보관하세요.</p><button id="closeCredits">닫기</button>');$('closeCredits').onclick=closeModal}};
async function loadAssets(){try{let manifest=await fetch('assets/manifest.json').then(r=>{if(!r.ok)throw Error('asset manifest');return r.json()});await Promise.all(Object.entries(manifest).map(([key,url])=>new Promise((resolve,reject)=>{let im=new Image();im.onload=()=>{assets[key]=im;resolve()};im.onerror=reject;im.src=url})));assetsReady=true;drawPreview()}catch{toast('에셋을 불러오지 못했습니다. 새로고침해 주세요.')}}
if(document.modelContext?.registerTool){for(let tool of [{name:'read_campaign_progress',description:'현재 골드, 해금 지역, 영구 연구 상태를 읽습니다.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>({gold:save.gold,unlocked:save.unlocked+1,cleared:save.clears.map(i=>i+1),upgrades:{...save.upgrades}})},{name:'purchase_permanent_upgrade',description:'획득한 골드를 소비해 영구 연구를 한 단계 구매합니다. 전투 중에는 불가합니다.',inputSchema:{type:'object',properties:{id:{type:'string',enum:research.map(r=>r.id)}},required:['id'],additionalProperties:false},annotations:{readOnlyHint:false},execute:({id})=>buy(id)}]){try{Promise.resolve(document.modelContext.registerTool(tool)).catch(()=>{})}catch{}}}
let armoryTab='research';
function weaponCost(w){return Math.ceil(w.base*Math.pow(1.45,save.weaponResearch[w.id]))}
function buyWeapon(){}
function renderShop(){for(const [id,on] of [['researchTab',armoryTab==='research'],['weaponsTab',armoryTab==='weapons']])$(id).setAttribute('aria-selected',String(on));if(armoryTab==='research'){renderResearch();return}$('upgrades').innerHTML=weapons.map(w=>{let lv=save.weaponResearch[w.id],p=passives.find(p=>p.id===w.passive);return `<article class="upgrade weapon-research"><div class="upgrade-top"><span><img class="armory-weapon-icon" src="assets/weapon-icon-${w.id}.svg" alt="" width="40" height="40"></span><span>연구 ${lv} / 10</span></div><h3>${w.name}</h3><p>${w.desc}<br>현재 피해 +${lv*8}% · 재사용 시간 −${lv*2}%</p><div class="recipe"><b>✦ ${w.awake}</b><small>${w.name} Lv.5 + ${p.name} Lv.3</small><small>${w.effect}</small></div><p class="research-note">연구 1단계: 피해 +8%, 재사용 시간 −2%<br>전투 레벨은 매 작전 1부터 성장합니다.</p><button data-weapon="${w.id}" ${lv===10||save.gold<weaponCost(w)?'disabled':''}>${lv===10?'최대 연구 완료':'◆ '+weaponCost(w)+' G · 연구'}</button></article>`}).join('');$('upgrades').querySelectorAll('button').forEach(b=>b.onclick=()=>{buyWeapon(b.dataset.weapon)})}
function pool(){let count=Object.keys(run.weapons).length;return [...weapons.filter(w=>run.difficulty!==2&&(run.weapons[w.id]||0)<5&&(run.weapons[w.id]||count<modeRules().slots)).map(w=>({id:'w:'+w.id,name:w.name,desc:w.desc,kind:'무기',level:run.weapons[w.id]||0,max:5,recipe:passives.find(p=>p.id===w.passive).name+' Lv.3 → '+w.awake})),...passives.filter(p=>run.skills[p.id]<5).map(p=>({id:'p:'+p.id,name:p.name,desc:p.desc,kind:'패시브',level:run.skills[p.id],max:5,recipe:weapons.filter(w=>w.passive===p.id).map(w=>w.name).join(' · ')+' 각성'}))]}
function levelUp(){if(run.difficulty===2){run.weapons[run.startWeapon]=Math.min(5,1+Math.floor((run.level-1)/2));checkAwakenings()}run.paused=true;run.modalMode='choice';keys={};joy={x:0,y:0};drawChoices();beep(730,.2,'sine')}
function drawChoices(){let all=pool(),choices=[];while(all.length&&choices.length<3)choices.push(all.splice(Math.floor(Math.random()*all.length),1)[0]);run.choices=choices.length?choices.map(c=>c.id):[ 'heal','gold'];run.choiceRarities=run.choices.map(id=>(id==='heal'||id==='gold')?0:rollRarity());renderChoices()}
function renderChoices(){let all=pool(),canReplace=all.some(c=>!run.choices.includes(c.id));let choices=run.choices.map(id=>all.find(c=>c.id===id)||(id==='gold'?{id:'gold',name:'골드 보급',desc:'정산 예정 골드 +25 G',kind:'보급',level:0,max:0,recipe:'최대 성장 이후 보급 선택'}:{id:'heal',name:'전장 보급',desc:'체력 50 회복',kind:'보급',level:0,max:0,recipe:'모든 무기와 패시브 최대 강화 완료'}));openModal(`<div class="eyebrow">LEVEL ${run.level} / FIELD UPGRADE</div><h2>무기와 능력을 선택하세요.</h2><p>무기 ${Object.keys(run.weapons).length}/${modeRules().slots} · 무기 Lv.5 + 연결 패시브 Lv.3이면 자동 각성</p><div class="choices">${choices.map((c,i)=>`<div class="choice-column"><button class="choice rarity-${rarities[run.choiceRarities[i]].className}" data-skill="${c.id}"><span class="rarity-label">${(c.id==='heal'||c.id==='gold')?'보급':rarities[run.choiceRarities[i]].name+' · '+rarities[run.choiceRarities[i]].chance+'%'}</span><small>${c.kind} ${c.max?'· '+c.level+'/'+c.max:''}</small><b>${c.name}</b><p>${c.kind==='패시브'?'이번 작전 동안 적용되는 능력 강화':c.desc}</p><p class="card-gain">${cardGain(c,run.choiceRarities[i])}</p><p>${c.recipe}</p></button><button class="card-reroll" data-reroll="${i}" ${canReplace&&(run.cardRerolls[i]>0||run.rerolls>0)?'':'disabled'} aria-label="${i+1}번 카드 리롤">↻ ${run.cardRerolls[i]>0?'무료 1회':run.rerolls>0?'공용 사용':'사용 완료'}</button></div>`).join('')}</div><p class="rarity-odds">카드별 독립 추첨 · 노멀 60% / 희귀 25% / 영웅 12% / 전설 3%<br>등급은 이번 강화량에 적용됩니다. 무기 5레벨 · 패시브 3레벨 각성 조건은 동일합니다.</p><div class="reroll-row"><b>공용 리롤 · ${run.rerolls}회 남음</b><small>입장 시 카드 3칸에 무료 1회씩 지급 · 레벨업 시 충전되지 않음<br>각 칸의 무료 횟수부터 사용한 뒤 공용 횟수를 차감합니다.${!canReplace?'<br>새로운 선택지가 없어 리롤할 수 없습니다.':''}</small></div>`);$('modalContent').querySelectorAll('[data-skill]').forEach(b=>b.onclick=()=>choose(b.dataset.skill));$('modalContent').querySelectorAll('[data-reroll]').forEach(b=>b.onclick=()=>{try{rerollCard(Number(b.dataset.reroll))}catch(e){toast(e.message)}})}
function rerollCard(index){if(!run||run.ended||!run.paused||run.modalMode!=='choice')throw Error('레벨업 선택 화면에서만 리롤할 수 있습니다.');if(!Number.isInteger(index)||index<0||index>=run.choices.length)throw Error('잘못된 카드 위치입니다.');if(run.cardRerolls[index]<=0&&run.rerolls<=0)throw Error('이 카드에서 사용할 리롤이 없습니다.');const available=pool().filter(c=>!run.choices.includes(c.id));if(!available.length)throw Error('새로운 선택지가 없습니다.');const next=available[Math.floor(Math.random()*available.length)];if(run.cardRerolls[index]>0)run.cardRerolls[index]--;else run.rerolls--;run.choices[index]=next.id;run.choiceRarities[index]=rollRarity();renderChoices();beep(480,.08,'sine');return {free:[...run.cardRerolls],shared:run.rerolls,choices:[...run.choices]}}
function checkAwakenings(){for(const w of weapons)if(run.weapons[w.id]===5&&run.skills[w.passive]>=3&&!run.awakened[w.id]){run.awakened[w.id]=true;toast('✦ 각성 · '+w.awake);$('banner').textContent='✦ '+w.awake+' 각성';run.bannerTime=3.5;beep(900,.4,'sine')}}
function choose(id){if(!run||run.ended||run.modalMode!=='choice'||!run.choices.includes(id))throw Error('현재 선택할 수 없는 강화입니다.');const tier=run.choiceRarities[run.choices.indexOf(id)]??0,m=rarities[tier].mult;if(id==='gold'){run.gold+=combatGold(25);run.goldSupplies++}else if(id==='heal')run.hp=Math.min(run.maxHp,run.hp+50);else{const [kind,key]=id.split(':');if(kind==='w'){if(!run.weapons[key]&&Object.keys(run.weapons).length>=modeRules().slots)throw Error('무기 슬롯이 가득 찼습니다.');run.weaponBonuses[key]=(run.weaponBonuses[key]||0)+.28*(m-1);run.weapons[key]=(run.weapons[key]||0)+1}else{if(key==='wealth')run.wealthLedger.push({tier,killTypes:[...run.killTypes],goldChests:run.goldChests,goldSupplies:run.goldSupplies});run.passiveBonuses[key]=(run.passiveBonuses[key]||0)+(m-1);run.skills[key]++;if(key==='regen')run.hp=Math.min(run.maxHp,run.hp+Math.ceil(35*m));if(key==='armor'){run.maxHp+=20*m;run.hp+=20*m}if(key==='magnet')run.speed*=1+.04*m}run.cardHistory.push({id,tier})}checkAwakenings();run.paused=false;run.modalMode=null;run.choices=[];closeModal();updateHUD();canvas.focus()}
function weaponStats(id){const w=weapons.find(w=>w.id===id),lv=run.weapons[id]||0,aw=!!run.awakened[id],research=save.weaponResearch[id];return {level:lv,aw,damage:run.damage*(1+(lv-1)*.28+(run.weaponBonuses[id]||0))*(1+passiveStrength('power')*.18)*(1+research*.08)*(aw?1.65:1),area:(1+passiveStrength('area')*.15),cooldown:Math.pow(.9,passiveStrength('rapid'))*(1-research*.02)/(run.stim>0?1.5:1)}}
function statsHTML(){let r=run,rows=[['치명타 확률',Number((criticalChance()*100).toFixed(2))+'%'],['치명타 피해','200%'],['체력',Math.ceil(r.hp)+' / '+r.maxHp],['공격력 증가','+'+Math.round(((1+save.upgrades.damage*.12)*(1+passiveStrength('power')*.18)-1)*100)+'%'],['이동 속도',(r.speed*(r.stim>0?1.55:1)).toFixed(0)],['피해 감소',Number((passiveStrength('armor')*8).toFixed(2))+'%'],['초당 회복',(save.upgrades.regen*.3+passiveStrength('regen')*.4).toFixed(2)],['범위 증가','+'+Number((passiveStrength('area')*15).toFixed(2))+'%'],['수집 범위',Math.round(75*(1+save.upgrades.magnet*.2+passiveStrength('magnet')*.35))],['영구 골드 증가','+'+(save.upgrades.gold*10)+'%'],['자산 증식 · 작전 한정','+'+Number((passiveStrength('wealth')*10).toFixed(2))+'%'],['공통 재사용 시간','−'+Math.round((1-Math.pow(.9,passiveStrength('rapid')))*100)+'%'],['레벨 / 처치',r.level+' / '+r.kills],['카드별 무료 리롤',r.cardRerolls.join(' / ')+'회'],['공용 리롤',r.rerolls+' / '+save.upgrades.reroll+'회'],['보급 상자',r.chestsOpened+'개 개봉']];return `<div class="stat-grid">${rows.map(([k,v])=>`<div><small>${k}</small><b>${v}</b></div>`).join('')}</div><p>보급 상자를 한 번 공격하면 아이템이 떨어집니다. 떨어진 아이템에 다가가면 획득합니다. 골드 80% · 자석 10% · 회복 10%. 자석은 맵의 경험치를 회수하고, 회복은 최대 체력의 30%를 채웁니다.</p><h3>장착 무기 · 각성 조건</h3><div class="pause-weapons">${Object.keys(r.weapons).map(id=>{let w=weapons.find(w=>w.id===id),p=passives.find(p=>p.id===w.passive),st=weaponStats(id);return `<div><b>${st.aw?'✦ '+w.awake:w.name} · Lv.${st.level}/5</b><small>${p.name} ${r.skills[p.id]}/5 · 각성 조건 3 · ${st.aw?'각성 완료':w.awake+' 각성 대기'}</small><small>${weaponDetails(id)}</small><small>기준 무기 피해 ${st.damage.toFixed(1)} · 연구 ${save.weaponResearch[id]}/10 · ${w.desc}${id==='gauss'?' · 발당 '+(st.level>=5?50:st.level>=3?65:100)+'% · '+(st.aw?'최대 5명 관통 / 사거리 880':'관통 없음 / 사거리 660'):''}</small><small>획득 카드: ${run.cardHistory.filter(c=>c.id==='w:'+id).map(c=>rarities[c.tier].name).join(' / ')||'시작 무기'}</small></div>`}).join('')}</div><div class="passive-history">${passives.filter(p=>run.skills[p.id]).map(p=>`<p>${p.name} Lv.${run.skills[p.id]}/5 · ${run.cardHistory.filter(c=>c.id==='p:'+p.id).map(c=>rarities[c.tier].name).join(' / ')}</p>`).join('')}</div><p>영구 자산 증식은 처치·상자 골드에 적용됩니다. 작전 한정 자산 증식은 획득 이후 처치·상자·보급 골드에 추가 적용되며, 클리어 고정 보상과 오락실 보상은 제외됩니다. 소수점 골드는 작전 중 누적됩니다.</p><p>무기별 피해 배율·발사 수는 공격 방식에 따라 적용됩니다. 무기 연구와 스팀팩의 재사용 시간 효과는 추가 적용됩니다.</p>`}
function resume(){if(run?.ended||run?.modalMode!=='pause')return;run.paused=false;run.modalMode=null;closeModal();canvas.focus()}
function pause(){if(!run||run.ended||run.paused)return;run.paused=true;run.modalMode='pause';keys={};joy={x:0,y:0};openModal(`<div class="eyebrow">PAUSED / CURRENT STATS</div><h2>현재 능력치</h2>${statsHTML()}<button id="simpleEffects" aria-pressed="${simpleEffects}">이펙트 간소화 ${simpleEffects?'ON':'OFF'}</button><p>불꽃·타격 장식을 줄입니다. 적 공격 경고와 실제 공격 판정은 동일합니다.</p><div class="modal-actions"><button id="resume" class="primary">전투 복귀 · ESC</button><button id="retreat">골드 챙기고 귀환</button></div>`);$('simpleEffects').onclick=()=>{simpleEffects=!simpleEffects;try{localStorage.setItem('sector09-simple-effects',simpleEffects?'1':'0')}catch{}$('simpleEffects').textContent='이펙트 간소화 '+(simpleEffects?'ON':'OFF');$('simpleEffects').setAttribute('aria-pressed',String(simpleEffects));draw()};$('resume').onclick=resume;$('retreat').onclick=()=>end(false,true)}
function renderLoadout(){const key=JSON.stringify([run.weapons,run.skills,run.awakened,modeRules().slots]);if(run.loadoutKey===key)return;run.loadoutKey=key;let ids=Object.keys(run.weapons);let html=Array.from({length:modeRules().slots},(_,i)=>{let w=weapons.find(w=>w.id===ids[i]);if(!w)return `<div class="weapon-slot empty" role="img" aria-label="빈 무기 슬롯 ${i+1}"></div>`;let aw=run.awakened[w.id],p=passives.find(p=>p.id===w.passive),label=`${aw?w.awake:w.name} · 무기 ${run.weapons[w.id]}/5 · ${p.name} ${run.skills[p.id]}/5 (각성 3)${aw?' · 각성 완료':''} · 능력치 보기`;return `<button class="weapon-slot ${aw?'awakened':''}" aria-label="${label}" title="${label}"><span aria-hidden="true"><img class="weapon-icon" src="assets/weapon-icon-${w.id}.svg" alt="" width="32" height="32" draggable="false"></span></button>`}).join('');if($('loadout').innerHTML!==html){$('loadout').innerHTML=html;$('loadout').querySelectorAll('button').forEach(b=>b.onclick=pause)}}
function updateHazards(dt){let r=run;if(r.stage<5)return;r.hazardClock-=dt;if(r.hazardClock<=0){let count=r.stage-4;for(let i=0;i<count;i++)r.hazards.push({x:r.x+Math.cos(i*2.1)*i*115,y:r.y+Math.sin(i*2.1)*i*115,age:0,radius:65+i*8,hit:false});r.hazardClock=7-(r.stage-5)*.8}for(let h of r.hazards){h.age+=dt;if(h.age>=1.8&&!h.hit){h.hit=true;ring(h.x,h.y,h.radius,'#ff9867');if(Math.hypot(r.x-h.x,r.y-h.y)<h.radius)damagePlayer(18+(r.stage-5)*5)}}r.hazards=r.hazards.filter(h=>h.age<2.4)}
function drawHazards(sx,sy){for(let h of run.hazards){ctx.fillStyle=h.hit?'#ff996688':'#ff715522';ctx.strokeStyle='#ffab7f';ctx.lineWidth=2;ctx.beginPath();ctx.arc(sx(h.x),sy(h.y),h.radius,0,Math.PI*2);ctx.fill();ctx.stroke();if(!h.hit){ctx.beginPath();ctx.arc(sx(h.x),sy(h.y),h.radius*(1-h.age/1.8),0,Math.PI*2);ctx.stroke()}}}
function ring(x,y,r,color){run.fx.push({x,y,r:5,max:r,t:.3,life:.3,color})}
function beam(x,y,x2,y2,color,width=3){run.fx.push({line:true,x,y,x2,y2,color,width,t:.18,life:.18})}
function fire(a,damage,color,options={}){run.bullets.push({x:run.x+Math.cos(a)*18,y:run.y+Math.sin(a)*18,vx:Math.cos(a)*550,vy:Math.sin(a)*550,life:1.2,damage,color,r:4,type:0,hit:new Set(),pierce:1,...options})}
function weaponTick(dt){updateMines(dt);updateDrones(dt);let r=run,targets=()=>combatTargets(),nearest=nearestTarget(targets(),r.x,r.y);r.visualAim=nearest?Math.atan2(nearest.y-r.y,nearest.x-r.x):null;for(const id of Object.keys(r.weapons)){if(id==='drone')continue;if(r.ended)return;r.cooldowns[id]=(r.cooldowns[id]||0)-dt;if(r.cooldowns[id]>0)continue;if(id==='shotgun'){const st=weaponStats(id);plantMine(st);r.cooldowns[id]=(1.9-st.level*.12)*st.cooldown;continue}if(!nearest)continue;let w=weapons.find(w=>w.id===id),st=weaponStats(id),a=Math.atan2(nearest.y-r.y,nearest.x-r.x),d=st.damage,L=st.level,A=st.aw,area=st.area,cd=1;r.angle=a;
if(id==='gauss'){const count=L>=5?3:L>=3?2:1,scale=count===3?.5:count===2?.65:1;for(let i=0;i<count;i++)fire(a+(i-(count-1)/2)*.07,d*scale,w.color,{weaponId:id,pierce:A?5:1,life:A?1.6:1.2});cd=.56/(1+(L-1)*.08);beep(200,.03)}

if(id==='missile'){for(let i=0;i<(A?3:1);i++)fire(a+(i-1)*.3,d*2,w.color,{weaponId:id,homing:true,type:1,life:3,r:7,blast:(55+L*6)*(A?1.5:1)*area});cd=2.8-L*.15}
if(id==='nova'){let rad=(90+L*15)*(A?1.6:1)*area;ring(r.x,r.y,rad,w.color,id);for(let e of targets())if(Math.hypot(e.x-r.x,e.y-r.y)<rad){hurt(e,d*1.8,id);if(A)e.slow=r.t+2}cd=3.2-L*.2}
if(id==='laser'){for(let k=0;k<(A?3:1);k++){let ang=a+(A?(k-1)*.3:0),range=550*area*(A?1.3:1);beam(r.x,r.y,r.x+Math.cos(ang)*range,r.y+Math.sin(ang)*range,w.color,4+L,id);for(let e of targets()){let dx=e.x-r.x,dy=e.y-r.y,along=dx*Math.cos(ang)+dy*Math.sin(ang),cross=Math.abs(dx*Math.sin(ang)-dy*Math.cos(ang));if(along>0&&along<range&&cross<e.r+8)hurt(e,d*1.4,id)}}cd=1.7-L*.12}
if(id==='flame'){let range=(105+L*12)*area*(A?1.3:1);for(let k=0;k<(A?16:7);k++){let ang=A?k*Math.PI/8:a+(k-3)*.13;beam(r.x,r.y,r.x+Math.cos(ang)*range,r.y+Math.sin(ang)*range,w.color,8,id)}for(let e of targets()){let ang=Math.atan2(e.y-r.y,e.x-r.x),delta=Math.atan2(Math.sin(ang-a),Math.cos(ang-a));if(Math.hypot(e.x-r.x,e.y-r.y)<range&&(A||Math.abs(delta)<.55))hurt(e,d*.42,id)}cd=.23}
if(id==='lightning'){let last={x:r.x,y:r.y},remaining=targets(),count=(2+L)*(A?2:1);for(let i=0;i<count&&remaining.length;i++){let e=nearestTarget(remaining,last.x,last.y);if(!e)break;remaining.splice(remaining.indexOf(e),1);if(Math.hypot(e.x-last.x,e.y-last.y)>(i===0?500:190)*area)break;beam(last.x,last.y,e.x,e.y,w.color,3,id);hurt(e,d*(i===0?2.4:.9),id);last=e}cd=2.4-L*.12}
r.cooldowns[id]=cd*st.cooldown;}}

function weaponDetails(id){
 const st=weaponStats(id),L=st.level,A=st.aw,area=st.area,damage=n=>(st.damage*n).toFixed(1),seconds=n=>(n*st.cooldown).toFixed(2),distance=n=>Math.round(n*area);
 if(id==='gauss'){const n=L>=5?3:L>=3?2:1;return `${n}발 · 발당 ${damage(n===3?.5:n===2?.65:1)} 피해 · ${seconds(.56/(1+(L-1)*.08))}초 간격 · 탄환당 ${A?5:1}명 적중`}
 if(id==='shotgun')return `폭발 ${damage(3)} 피해 · ${seconds(1.9-L*.12)}초마다 발밑 설치 · ${run.mines.length}/${6+L+(A?3:0)}개 설치됨 · 감지 ${distance(50+L*3)} / 폭발 반경 ${distance((78+L*7)*(A?1.4:1))} · 준비 0.4초 / 유지 12초${A?' · 일반 적 감속 1.5초':''} · 원거리 적에게는 접근해서 설치하세요`;
 if(id==='laser')return `${A?3:1}줄 · 타격 ${damage(1.4)} 피해 · ${seconds(1.7-L*.12)}초 간격 · 사거리 ${distance(550*(A?1.3:1))} · 경로 내 모든 적 관통`;
 if(id==='missile')return `${A?3:1}발 유도 · 폭발 ${damage(2)} 피해 · ${seconds(2.8-L*.15)}초 간격 · 폭발 반경 ${distance((55+L*6)*(A?1.5:1))}`;
 if(id==='nova')return `파동 ${damage(1.8)} 피해 · ${seconds(3.2-L*.2)}초 간격 · 반경 ${distance((90+L*15)*(A?1.6:1))}`;
 if(id==='drone')return `${A?6:Math.min(4,1+Math.floor(L/2))}기 · 기당 ${damage(.8)} 피해 · ${seconds(.65)}초 간격 · 드론 기준 사거리 ${distance(220)}${A?' · 근처 적 탄환 요격':''}`;
 if(id==='flame')return `${A?'전방위':'전방 부채꼴'} · 타격 ${damage(.42)} 피해 · ${seconds(.23)}초 간격 · 사거리 ${distance((105+L*12)*(A?1.3:1))}`;
 return `최대 ${(2+L)*(A?2:1)}명 연쇄 · 첫 적 ${damage(2.4)} / 이후 ${damage(.9)} 피해 · ${seconds(2.4-L*.12)}초 간격 · 첫 사거리 ${distance(500)} / 연결 거리 ${distance(190)}`;
}
function dronePositions(){let st=weaponStats('drone'),n=st.aw?6:Math.min(4,1+Math.floor(st.level/2));return Array.from({length:n},(_,i)=>{let angle=run.t*2+i*Math.PI*2/n;return {x:run.x+Math.cos(angle)*85*st.area,y:run.y+Math.sin(angle)*85*st.area,angle}})}
function plantMine(st){
 const r=run;let x=r.x,y=r.y;const n=r.mineSerial++;
 if(r.mines.some(m=>Math.hypot(m.x-x,m.y-y)<24)){const angle=n*2.399963;const offset=32+(n%3)*12;x+=Math.cos(angle)*offset;y+=Math.sin(angle)*offset}
 if(r.mines.length>=6+st.level+(st.aw?3:0))r.mines.shift();
 r.mines.push({x,y,age:0,armed:.4,life:12,trigger:(50+st.level*3)*st.area,radius:(78+st.level*7)*st.area*(st.aw?1.4:1),damage:st.damage*3,aw:st.aw,fuse:null});
}
function updateMines(dt){
 if(!run||run.ended||run.paused)return;const r=run;
 for(const m of r.mines){
  m.age+=dt;if(m.age>=m.life){m.dead=true;continue}if(m.age<m.armed)continue;
  const targets=combatTargets();
  if(m.fuse===null&&targets.some(e=>Math.hypot(e.x-m.x,e.y-m.y)<=m.trigger+e.r))m.fuse=m.aw?.32:0;
  if(m.fuse===null)continue;
  if(m.aw)for(const e of targets)if(!e.isChest&&e.type!==3&&Math.hypot(e.x-m.x,e.y-m.y)<=m.radius+e.r)e.slow=Math.max(e.slow||0,r.t+1.5);
  m.fuse-=dt;if(m.fuse>0)continue;m.dead=true;
  ring(m.x,m.y,m.radius,m.aw?'#8de9d2':'#f5bf77','shotgun');beep(m.aw?100:130,.1,'triangle',.012);
  for(const e of targets)if(Math.hypot(e.x-m.x,e.y-m.y)<=m.radius+e.r){hurt(e,m.damage,'shotgun');if(r.ended)break}
  if(r.ended)break;
 }
 r.mines=r.mines.filter(m=>!m.dead);
}
function drawMines(sx,sy){
 for(const m of run.mines){const x=sx(m.x),y=sy(m.y);if(x< -160||x>W+160||y< -160||y>H+160)continue;
  ctx.save();ctx.globalAlpha=Math.min(1,(m.life-m.age)*2);const armed=m.age>=m.armed,color=m.aw?'#8de9d2':'#f5bf77';
  ctx.strokeStyle=armed?color:'#63767a';ctx.fillStyle='#102f35';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,18,0,Math.PI*2);ctx.fill();ctx.stroke();
  if(assets.tacticalMine)ctx.drawImage(assets.tacticalMine,x-14,y-14,28,28);
  ctx.fillStyle=armed?color:'#63767a';ctx.fillRect(x-3,y-3,6,6);
  if(m.fuse!==null&&m.aw){ctx.globalAlpha*=.2;ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,m.radius*(1-m.fuse/.32),0,Math.PI*2);ctx.fill()}
  ctx.restore();
 }
}
// Preserve enemy-before-chest priority and stable distance ties without sorting.
function nearestDroneTarget(targets,x,y,range){let best=null,bestDistance=Infinity,bestChest=2;for(const e of targets){const dx=e.x-x,dy=e.y-y,d2=dx*dx+dy*dy,chest=Number(!!e.isChest);if(d2>(range+e.r)**2)continue;if(chest<bestChest||(chest===bestChest&&d2<bestDistance)){best=e;bestDistance=d2;bestChest=chest}}return best}
function updateDrones(dt){if(!run.weapons.drone||run.ended)return;let r=run,st=weaponStats('drone'),drones=dronePositions();if(st.aw)r.hostile=r.hostile.filter(b=>!drones.some(d=>Math.hypot(b.x-d.x,b.y-d.y)<45));r.cooldowns.drone=(r.cooldowns.drone||0)-dt;if(r.cooldowns.drone>0)return;let fired=false;for(let d of drones){let target=nearestDroneTarget(combatTargets(),d.x,d.y,220*st.area);if(!target)continue;beam(d.x,d.y,target.x,target.y,st.aw?'#ffe29a':'#75e9eb',st.aw?4:2,'drone');hurt(target,st.damage*.8,"drone");fired=true;if(r.ended)break}if(fired){r.cooldowns.drone=.65*st.cooldown;beep(680,.025,'sine',.006)}}

function drawFriendlyDrone(x,y,angle,awakened){ctx.save();ctx.strokeStyle=awakened?'#ffe29a':'#75e9eb';ctx.globalAlpha=.65;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(x,y,18,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;ctx.shadowColor=awakened?'#e6bd69':'#42dbe4';ctx.shadowBlur=7;const skin=equippedCosmetic('drone');if(skin)drawCosmeticDrone(ctx,skin,x,y,angle,.65);else sprite(ctx,'drone',x,y,29,angle+Math.PI/2);ctx.restore()}
function drawWeaponEffects(sx,sy){let r=run;for(let f of r.fx)if(f.line){ctx.globalAlpha=f.t/f.life;ctx.strokeStyle=f.color;ctx.lineWidth=f.width;ctx.beginPath();ctx.moveTo(sx(f.x),sy(f.y));ctx.lineTo(sx(f.x2),sy(f.y2));ctx.stroke();ctx.globalAlpha=1}if(r.weapons.drone)for(const drone of dronePositions())drawFriendlyDrone(sx(drone.x),sy(drone.y),drone.angle,run.awakened.drone)}


function createChest(x,y){return {x,y,opened:false,isChest:true,r:22,hp:1}}
function seedChests(){for(let i=0;i<8;i++){let angle=i*Math.PI*2/8+.25,d=240+Math.floor(i/2)*185;run.chests.push(createChest(Math.cos(angle)*d,Math.sin(angle)*d))}}
function spawnChest(){let a=Math.random()*Math.PI*2,d=280+Math.random()*420;run.chests.push(createChest(run.x+Math.cos(a)*d,run.y+Math.sin(a)*d))}
function chestReward(roll=Math.random()){return roll<.8?'gold':roll<.9?'magnet':'heal'}
function collectDrop(chest){if(!run||run.ended||run.paused||chest.collected||!run.drops.includes(chest)||run.t<chest.readyAt||Math.hypot(chest.x-run.x,chest.y-run.y)>38)return false;chest.collected=true;let kind=chest.kind,text,color;if(kind==='gold'){run.goldChests++;let gold=Math.floor((30+run.stage*5)*(1+save.upgrades.gold*.1)*modeRules().gold);gold=combatGold(gold);run.gold+=gold;text='골드 +'+gold+' G';color='#ffe093'}else if(kind==='magnet'){for(const orb of run.orbs)orb.attracted=true;text='자석 · 경험치 전체 회수';color='#92d9f2'}else{let hp=Math.min(run.maxHp-run.hp,Math.ceil(run.maxHp*.3));run.hp+=hp;text=hp>0?'회복 +'+hp:'회복 · 체력 가득 참';color='#a7efaa'}run.lootText.push({x:chest.x,y:chest.y-30,text,color,life:2.4});ring(chest.x,chest.y,65,color);beep(kind==='gold'?580:850,.15,'sine');return kind}
function updateChests(dt){let r=run;r.chestClock-=dt;if(r.chestClock<=0){if(r.chests.filter(c=>!c.opened).length<10)spawnChest();r.chestClock=25}for(const chest of r.chests){if(chest.opened)continue;if(Math.hypot(chest.x-r.x,chest.y-r.y)>1800){let a=Math.random()*Math.PI*2,d=450+Math.random()*350;chest.x=r.x+Math.cos(a)*d;chest.y=r.y+Math.sin(a)*d} }for(const drop of r.drops)collectDrop(drop);r.drops=r.drops.filter(d=>!d.collected);r.chests=r.chests.filter(c=>!c.opened||r.t-c.openedAt<1);r.lootText=r.lootText.filter(t=>(t.life-=dt)>0)}
function drawChests(sx,sy){for(const chest of run.chests){let x=sx(chest.x),y=sy(chest.y);if(x< -60||x>W+60||y< -60||y>H+60)continue;ctx.save();ctx.globalAlpha=chest.opened?Math.max(0,1-(run.t-chest.openedAt)):.95;ctx.strokeStyle='#edce7b';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(x,y+16,25,10,0,0,Math.PI*2);ctx.stroke();if(assets.props)ctx.drawImage(assets.props,1280,256,64,64,x-24,y-24,48,48);if(!chest.opened&&Math.hypot(chest.x-run.x,chest.y-run.y)<120){ctx.font='12px sans-serif';ctx.textAlign='center';ctx.fillStyle='#ffe3a6';ctx.fillText('보급 상자',x,y-31)}ctx.restore()}}
function drawLootText(sx,sy){ctx.save();ctx.font='bold 14px sans-serif';ctx.textAlign='center';for(const t of run.lootText){ctx.globalAlpha=Math.min(1,t.life);ctx.fillStyle=t.color;ctx.strokeStyle='#14201e';ctx.lineWidth=3;let x=sx(t.x),y=sy(t.y)-(2.4-t.life)*18;ctx.strokeText(t.text,x,y);ctx.fillText(t.text,x,y)}ctx.restore()}

async function apiPost(path,data){let controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),15000);try{let response=await fetch(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:controller.signal});let json=await response.json();if(!response.ok)throw Error(json.error||'서버 요청에 실패했습니다.');return json}catch(e){if(e.name==='AbortError')throw Error('서버 연결 시간이 초과되었습니다. 다시 시도하세요.');throw e}finally{clearTimeout(timeout)}}
function nearestTarget(targets,x,y){let nearest,best=Infinity;for(const e of targets){if(e.dead||e.opened)continue;const distance=(e.x-x)**2+(e.y-y)**2;if(distance<best){best=distance;nearest=e}}return nearest}
function combatTargets(){return [...run.enemies.filter(e=>!e.dead),...run.chests.filter(c=>!c.opened)]}
function breakChest(chest){if(!run||run.ended||run.paused||chest.opened||!run.chests.includes(chest))return false;chest.opened=true;chest.dead=true;chest.openedAt=run.t;run.chestsOpened++;run.drops.push({x:chest.x,y:chest.y,kind:chestReward(),readyAt:run.t+.5,collected:false});ring(chest.x,chest.y,35,'#d8be7a');return true}
function drawDrops(sx,sy){for(let d of run.drops){let x=sx(d.x),y=sy(d.y);if(x< -30||y< -30||x>W+30||y>H+30)continue;ctx.save();ctx.fillStyle='#112023d9';ctx.strokeStyle=d.kind==='gold'?'#ffe093':d.kind==='magnet'?'#92d9f2':'#a7efaa';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,15,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='18px sans-serif';ctx.fillStyle=d.kind==='gold'?'#ffe093':d.kind==='magnet'?'#92d9f2':'#a7efaa';ctx.fillText(d.kind==='gold'?'◆':d.kind==='magnet'?'🧲':'✚',x,y);ctx.restore()}}
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const timeLabel=ms=>Math.floor(ms/60000)+':'+(ms%60000/1000).toFixed(2).padStart(5,'0');
const rankingCache=new Map(),rankingRequests=new Map();
function rankingRowsHTML(){}
function requestRanking(){}
function loadRanking(){}
function preloadRankings(){}
function clearRanking(){}
// Account startup is installed by account-ui.js after all game declarations.

const rocket={state:'idle',bet:0,mult:1,crash:1,started:0,history:[],lastPaint:0};
function rocketNow(){return performance.now()}
function rocketLock(active){window.marketActive=active;for(const id of ['campTab','shopTab','marketTab','storeTab','dataBtn','rankingBtn','rocketGameTab','plinkoGameTab','plinkoDrop'])$(id).disabled=active;$('rocketBet').disabled=active;document.querySelectorAll('[data-bet]').forEach(b=>b.disabled=active);$('rocketLaunch').disabled=active;$('rocketCashout').disabled=!active}
function renderMarket(){ $('marketGold').textContent=save.gold.toLocaleString()+' G';if(rocket.state!=='flying')$('rocketLaunch').disabled=window.marketActive||save.gold<100||save.gold>=1e9;paintRocket(rocketNow())}
function rocketLaunch(){}
function rocketFinish(){}
function rocketUpdate(){}
function rocketCashout(){}
function paintRocket(now){
 if(view!=='market')return;
 const c=$('rocketCanvas').getContext('2d'),w=900,h=520,t=now/1000;
 c.clearRect(0,0,w,h);c.fillStyle='#09171e';c.fillRect(0,0,w,h);
 c.strokeStyle='#23363b';c.lineWidth=1;for(let i=0;i<9;i++){c.beginPath();c.moveTo(i*112,0);c.lineTo(i*112,h);c.stroke()}for(let i=0;i<6;i++){c.beginPath();c.moveTo(0,i*104);c.lineTo(w,i*104);c.stroke()}
 for(let i=0;i<65;i++){const x=(i*137.7)%w,y=(i*83.3+(rocket.state==='flying'?t*18:0))%h;c.fillStyle=i%3?'#68848a':'#cce8d6';c.fillRect(x,y,i%3?1:2,i%3?1:2)}
 const progress=Math.min(1,Math.log(Math.max(1,rocket.mult))/Math.log(100)),x=140+progress*620,y=430-progress*340;
 c.strokeStyle=rocket.state==='crashed'?'#ff8169':'#b7e977';c.lineWidth=3;c.beginPath();c.moveTo(90,470);c.quadraticCurveTo(x*.8,480,x,y);c.stroke();
 c.save();c.translate(x,y);
 if(rocket.state==='crashed'){for(let i=0;i<12;i++){const a=i*Math.PI/6;c.fillStyle=i%2?'#ffb465':'#f26753';c.beginPath();c.arc(Math.cos(a)*38,Math.sin(a)*38,6+i%4,0,Math.PI*2);c.fill()}c.fillStyle='#ffedba';c.beginPath();c.arc(0,0,20,0,Math.PI*2);c.fill()}
 else{c.rotate(.5);if(rocket.state==='flying'){c.fillStyle='#ffb660';c.beginPath();c.moveTo(-9,24);c.lineTo(0,65+Math.sin(t*30)*10);c.lineTo(9,24);c.fill();c.fillStyle='#fff3be';c.fillRect(-4,22,8,25)}
 c.fillStyle='#cceddb';c.beginPath();c.moveTo(0,-39);c.quadraticCurveTo(22,-12,13,26);c.lineTo(-13,26);c.quadraticCurveTo(-22,-12,0,-39);c.fill();c.fillStyle='#71bfae';c.beginPath();c.moveTo(-12,6);c.lineTo(-27,30);c.lineTo(-10,25);c.moveTo(12,6);c.lineTo(27,30);c.lineTo(10,25);c.fill();c.fillStyle='#112a3b';c.beginPath();c.arc(0,-9,8,0,Math.PI*2);c.fill();c.strokeStyle='#9fdaca';c.lineWidth=3;c.stroke()}
 c.restore();
}
function rocketFrame(now){if(rocket.state==='flying')rocketUpdate(now);if(view==='market'&&marketGame==='rocket'&&now-rocket.lastPaint>16){paintRocket(now);rocket.lastPaint=now}requestAnimationFrame(rocketFrame)}
$('marketTab').onclick=()=>{show('market');renderMarket()};$('rocketLaunch').onclick=rocketLaunch;$('rocketCashout').onclick=rocketCashout;
document.querySelectorAll('[data-bet]').forEach(b=>b.onclick=()=>{if(rocket.state!=='flying')$('rocketBet').value=b.dataset.bet});
requestAnimationFrame(rocketFrame);

const plinko={state:'idle',bet:0,started:0,steps:[],slot:-1,history:[]};
const plinkoMultipliers=[1000,100,20,5,2,1,.5,.3,.2,.3,.5,1,2,5,20,100,1000];
let marketGame='rocket';
function plinkoColor(i){return ['#ff815f','#ffa571','#e8ba74','#bfa1e2','#94b8c7','#83c6b6','#84a88e','#789386','#748d83'][Math.min(i,16-i)]}
function selectMarketGame(id){
 if(window.marketActive)return;
 marketGame=id;$('rocketGame').hidden=id!=='rocket';$('rocketHistoryPanel').hidden=id!=='rocket';$('plinkoGame').hidden=id!=='plinko';$('plinkoHistoryPanel').hidden=id!=='plinko';
 $('rocketGameTab').setAttribute('aria-selected',String(id==='rocket'));$('plinkoGameTab').setAttribute('aria-selected',String(id==='plinko'));
 $('marketTitle').textContent=id==='rocket'?'오락실 · 드론 탐사':'오락실 · 플린코';
 $('marketDescription').textContent=id==='rocket'?'안전하게 귀환할까, 다음 구역에 도전할까? 결정은 천천히.':'핀 사이로 튕기는 공. 마지막 착지가 보상을 결정합니다.';
 renderMarket();paintPlinko(rocketNow());
}
function plinkoControls(active){
 rocketLock(active);$('rocketCashout').disabled=true;
 $('plinkoBet').disabled=active;$('plinkoDrop').disabled=active;
 document.querySelectorAll('[data-plinko-bet]').forEach(b=>b.disabled=active);
}
function dropPlinko(){}
function finishPlinko(){}
function updatePlinko(){}
function drawPlinkoSlots(){$('plinkoSlots').innerHTML=plinkoMultipliers.map((m,i)=>'<span class="'+(plinko.slot===i?'landed':'')+'" style="--slot-color:'+plinkoColor(i)+'" aria-label="'+(i+1)+'번 구역 '+m+'배">'+m+'<small>×</small></span>').join('')}
function paintPlinko(now){
 if(view!=='market'||marketGame!=='plinko')return;
 const c=$('plinkoCanvas').getContext('2d');c.clearRect(0,0,900,690);c.fillStyle='#0b1820';c.fillRect(0,0,900,690);
 for(let i=0;i<65;i++){c.fillStyle=i%3?'#213b43':'#506c71';c.fillRect((i*139)%900,(i*83)%660,2,2)}
 for(let row=0;row<16;row++)for(let col=0;col<=row;col++){
 const x=450+(col-row/2)*48,y=60+row*36;
 c.fillStyle='#233e46';c.beginPath();c.arc(x,y+2,6,0,Math.PI*2);c.fill();c.fillStyle='#a3c2bd';c.beginPath();c.arc(x,y,3.4,0,Math.PI*2);c.fill();
 }
 c.strokeStyle='#3d615b';c.lineWidth=2;c.beginPath();c.moveTo(426,40);c.lineTo(42,640);c.moveTo(474,40);c.lineTo(858,640);c.stroke();
 if(plinko.state==='idle'){c.fillStyle='#c7f268';c.beginPath();c.arc(450,25,9,0,Math.PI*2);c.fill();return}
 const elapsed=Math.max(0,now-plinko.started),progress=Math.min(17,elapsed/200),segment=Math.min(16,Math.floor(progress)),f=progress-segment;
 const points=[{x:450,y:20},{x:450,y:60}];let x=450;for(let i=0;i<16;i++){x+=(plinko.steps[i]?24:-24);points.push({x,y:96+i*36})}
 c.strokeStyle='#c7f26833';c.lineWidth=3;c.beginPath();c.moveTo(450,20);for(let i=1;i<=segment;i++)c.lineTo(points[i].x,points[i].y);c.stroke();
 const a=points[segment],b=points[segment+1],done=plinko.state==='landed',bx=done?points[17].x:a.x+(b.x-a.x)*f,by=done?636:a.y+(b.y-a.y)*f-Math.sin(f*Math.PI)*9;
 c.fillStyle='#c7f26822';c.beginPath();c.arc(bx,by,18,0,Math.PI*2);c.fill();c.fillStyle='#d7fa95';c.beginPath();c.arc(bx,by,8,0,Math.PI*2);c.fill();c.fillStyle='#fffbe7';c.beginPath();c.arc(bx-2,by-3,2.5,0,Math.PI*2);c.fill();
}
function plinkoFrame(now){updatePlinko(now);if(marketGame==='plinko')paintPlinko(now);requestAnimationFrame(plinkoFrame)}
$('rocketGameTab').onclick=()=>selectMarketGame('rocket');$('plinkoGameTab').onclick=()=>selectMarketGame('plinko');$('plinkoDrop').onclick=dropPlinko;
document.querySelectorAll('[data-plinko-bet]').forEach(b=>b.onclick=()=>{if(!window.marketActive)$('plinkoBet').value=b.dataset.plinkoBet});
drawPlinkoSlots();requestAnimationFrame(plinkoFrame);

$('storeTab').onclick=()=>show('store');
