const cosmeticCatalog=[
{id:'suit_ember',category:'suit',name:'잿불 레인저',price:2500,color:'#ff9978',hue:300,desc:'주황빛 전투복과 잿불 식별 링'},
{id:'suit_ice',category:'suit',name:'극지 정찰병',price:5000,color:'#89dfff',hue:100,desc:'푸른 전투복과 냉광 식별 링'},
{id:'suit_royal',category:'suit',name:'황실 원정대',price:9000,color:'#e6bbff',hue:180,desc:'보랏빛 전투복과 자수정 식별 링'},
{id:'drone_arrow',category:'drone',name:'화살촉 드론',price:4000,color:'#89f2ca',desc:'날렵한 삼각 날개형 기체'},
{id:'drone_orbit',category:'drone',name:'궤도 관측자',price:8000,color:'#d5b8ff',desc:'회전하는 고리가 달린 구형 기체'},
{id:'drone_crown',category:'drone',name:'황금 수호기',price:14000,color:'#ffe399',desc:'네 갈래 날개를 펼친 황금 기체'},
{id:'trail_ember',category:'trail',name:'혜성의 꼬리',price:3000,color:'#ffad78',desc:'투사체 뒤로 남는 주황색 잔광'},
{id:'trail_ice',category:'trail',name:'서리 결정',price:6500,color:'#a2ecff',desc:'투사체에 맺히는 푸른 마름모 결정'},
{id:'trail_star',category:'trail',name:'별빛 섬광',price:11000,color:'#f6ceff',desc:'투사체마다 반짝이는 별빛 십자'}
];
function cleanCosmetics(input){
 const out={owned:[],equipped:{suit:'default',drone:'default',trail:'default'}};
 if(input==null)return out;
 if(typeof input!=='object'||!Array.isArray(input.owned)||input.owned.length>cosmeticCatalog.length)throw Error('외형 보유 기록이 올바르지 않습니다.');
 for(const id of input.owned){if(!cosmeticCatalog.some(c=>c.id===id))throw Error('알 수 없는 외형입니다.');if(!out.owned.includes(id))out.owned.push(id)}
 for(const category of ['suit','drone','trail']){
 const id=input.equipped?.[category]??'default';if(id!=='default'&&(!out.owned.includes(id)||!cosmeticCatalog.some(c=>c.id===id&&c.category===category)))throw Error('장착할 수 없는 외형입니다.');out.equipped[category]=id;
 }return out;
}
function equippedCosmetic(category){return cosmeticCatalog.find(c=>c.id===save.cosmetics.equipped[category])}
function buyCosmetic(){}
function equipCosmetic(){}
function renderStore(){
 const names={suit:'캐릭터 색상',drone:'드론 외형',trail:'탄환 효과'};
 const scope={suit:'모든 무기 · 플레이어 전투복과 식별 링',drone:'궤도 드론 · 각성 수호 편대',trail:'가우스 소총 · 유도 미사일 (각성 포함)'};
 $('storeBalance').textContent=save.gold.toLocaleString()+' G';
 $('storeItems').innerHTML=Object.entries(names).map(([category,name])=>'<section class="store-category"><div class="store-category-head"><h2>'+name+'</h2><button data-reset="'+category+'">기본 외형 장착</button></div><div class="store-grid">'+cosmeticCatalog.filter(c=>c.category===category).map(c=>{
 const owned=save.cosmetics.owned.includes(c.id),on=save.cosmetics.equipped[category]===c.id;
 return '<article class="store-card"><canvas data-cosmetic="'+c.id+'" width="360" height="160" aria-label="'+c.name+' 미리보기"></canvas><div class="store-card-body"><small>'+(on?'장착 중':owned?'보유 중':'영구 소장')+'</small><h3>'+c.name+'</h3><p>'+c.desc+'</p><p class="cosmetic-scope"><b>적용 대상</b><br>'+scope[category]+'</p><small class="cosmetic-terms">외형 전용 · 능력치 변화 없음<br>1회 구매로 영구 소장 · 자유롭게 교체</small><button data-cosmetic-buy="'+c.id+'" '+(on||(!owned&&save.gold<c.price)?'disabled':'')+'>'+(on?'장착 완료':owned?'장착하기':'◆ '+c.price.toLocaleString()+' G · 구매 및 장착')+'</button></div></article>'
 }).join('')+'</div></section>').join('');
 $('storeItems').querySelectorAll('[data-cosmetic-buy]').forEach(b=>b.onclick=()=>{try{const c=cosmeticCatalog.find(c=>c.id===b.dataset.cosmeticBuy);if(save.cosmetics.owned.includes(c.id))equipCosmetic(c.category,c.id);else buyCosmetic(c.id)}catch(e){toast(e.message)}});
 $('storeItems').querySelectorAll('[data-reset]').forEach(b=>b.onclick=()=>{try{equipCosmetic(b.dataset.reset,'default')}catch(e){toast(e.message)}});
 $('storeItems').querySelectorAll('canvas').forEach(el=>{const c=cosmeticCatalog.find(c=>c.id===el.dataset.cosmetic),g=el.getContext('2d');g.fillStyle='#0b171e';g.fillRect(0,0,360,160);g.strokeStyle='#254039';g.beginPath();g.ellipse(180,100,86,26,0,0,Math.PI*2);g.stroke();if(c.category==='suit'){g.save();g.filter='hue-rotate('+c.hue+'deg)';sprite(g,'player',180,75,65,-Math.PI/2);g.restore();g.strokeStyle=c.color;g.lineWidth=3;g.beginPath();g.ellipse(180,104,38,12,0,0,Math.PI*2);g.stroke()}else if(c.category==='drone')drawCosmeticDrone(g,c,180,76,0,1.8);else for(let i=0;i<5;i++)drawBulletCosmetic(g,c,90+i*44,80,0,i)});
}
function drawCosmeticDrone(c,item,x,y,a,scale=1){
 c.save();c.translate(x,y);c.rotate(a);c.scale(scale,scale);c.fillStyle=item.color;c.strokeStyle='#10272d';c.lineWidth=2;c.beginPath();
 if(item.id==='drone_arrow'){c.moveTo(25,0);c.lineTo(-16,-18);c.lineTo(-7,0);c.lineTo(-16,18);c.closePath();c.fill();c.stroke()}
 else if(item.id==='drone_orbit'){c.strokeStyle=item.color;c.lineWidth=3;c.ellipse(0,0,22,13,0,0,Math.PI*2);c.stroke();c.beginPath();c.arc(0,0,10,0,Math.PI*2);c.fill()}
 else{for(let i=0;i<8;i++){const a=i*Math.PI/4,r=i%2?9:25;i?c.lineTo(Math.cos(a)*r,Math.sin(a)*r):c.moveTo(r,0)}c.closePath();c.fill();c.stroke()}
 c.fillStyle='#173740';c.beginPath();c.arc(3,0,5,0,Math.PI*2);c.fill();c.restore();
}
function drawBulletCosmetic(c,item,x,y,a,time){
 c.save();c.translate(x,y);c.rotate(a);c.strokeStyle=item.color;c.fillStyle=item.color;c.lineWidth=2;c.beginPath();
 if(item.id==='trail_ember'){c.moveTo(-19,0);c.lineTo(4,0);c.stroke();c.globalAlpha=.3;c.beginPath();c.arc(-8,0,5,0,Math.PI*2);c.fill()}
 else if(item.id==='trail_ice'){c.moveTo(7,0);c.lineTo(0,-5);c.lineTo(-7,0);c.lineTo(0,5);c.closePath();c.stroke()}
 else{c.rotate(time*3);c.moveTo(-7,0);c.lineTo(7,0);c.moveTo(0,-7);c.lineTo(0,7);c.stroke()}
 c.restore();
}
const bossDesigns=[
{color:'#f6a16e',pattern:'직선 돌진',tip:'붉은 직선 밖으로 이동하세요.',kind:'ram'},
{color:'#e4798b',pattern:'부채꼴 포격',tip:'조준 부채꼴의 옆으로 피하세요.',kind:'scorpion'},
{color:'#94e6ff',pattern:'냉기 고리',tip:'푸른 탄환 사이를 통과하세요. 피격 시 잠시 느려집니다.',kind:'crystal'},
{color:'#b7da76',pattern:'포자 둥지',tip:'독 웅덩이를 벗어나 소환체를 처리하세요.',kind:'bloom'},
{color:'#d9a4ff',pattern:'이중 충격파',tip:'시간차로 퍼지는 두 겹 탄막을 피하세요.',kind:'heart'},
{color:'#ffb460',pattern:'십자 레이저',tip:'경고선이 교차하지 않는 대각선으로 이동하세요.',kind:'forge'},
{color:'#91aaff',pattern:'나선 탄막',tip:'회전하는 탄막 사이의 틈을 따라 움직이세요.',kind:'manta'},
{color:'#f59acf',pattern:'궤도 지뢰',tip:'주변의 원형 경고가 터지기 전에 안전한 틈으로 이동하세요.',kind:'eclipse'},
{color:'#7de3c7',pattern:'삼연속 돌진',tip:'세 번의 경고 방향을 확인하며 옆으로 피하세요.',kind:'serpent'},
{color:'#ffe3a0',pattern:'근원 순환',tip:'고리 탄막·소환·집중 포격을 번갈아 사용합니다.',kind:'crown'}
];
function drawBoss(c,stage,x,y,size,a,t=0,hit=false){
 const d=bossDesigns[stage];c.save();c.translate(x,y);c.rotate(a);c.scale(size/48,size/48);c.lineJoin='round';c.lineCap='round';
 const poly=(pts,fill=d.color)=>{c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fillStyle=fill;c.fill();c.strokeStyle='#102229';c.lineWidth=3;c.stroke()};
 const oval=(x,y,rx,ry,fill=d.color)=>{c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=fill;c.fill();c.strokeStyle='#102229';c.lineWidth=3;c.stroke()};
 const line=(pts,color=d.color,width=6)=>{c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.strokeStyle=color;c.lineWidth=width;c.stroke()};
 const pulse=Math.sin(t*3)*3;
 switch(stage){
 case 0:
 for(const s of [-1,1]){poly([[-30,s*18],[-41,s*34],[22,s*30],[36,s*13]],'#936348');poly([[10,s*16],[51,s*31],[42,s*2]])}
 oval(-10,0,34,24,'#ac7450');poly([[-38,0],[-15,-18],[29,-13],[41,0],[29,13],[-15,18]]);break;
 case 1:
 line([[-23,0],[-45,-12],[-50,-41],[-21,-53]],d.color,9);poly([[-27,-57],[-13,-53],[-25,-42]]);
 for(const s of [-1,1]){line([[-12,s*12],[-24,s*34],[5,s*43]],'#9c5369',7);line([[12,s*12],[30,s*31],[46,s*28]],d.color,8);poly([[40,s*18],[60,s*22],[49,s*39],[37,s*29]])}
 oval(0,0,27,20);break;
 case 2:
 for(let i=0;i<6;i++){const a=i*Math.PI/3,px=Math.cos(a),py=Math.sin(a);poly([[px*15-py*8,py*15+px*8],[px*(47+pulse),py*(47+pulse)],[px*15+py*8,py*15-px*8]],i%2?'#5d9daf':d.color)}
 poly([[22,0],[11,19],[-11,19],[-22,0],[-11,-19],[11,-19]],'#d0f4ff');break;
 case 3:
 for(let i=0;i<7;i++){const a=i*Math.PI*2/7;oval(Math.cos(a)*(28+pulse),Math.sin(a)*(28+pulse),17,15,i%2?'#648956':d.color)}
 oval(0,0,22,23,'#4e6b47');for(let i=0;i<3;i++)oval(-6+i*10,-8+i*7,5,5,'#e7f7a5');break;
 case 4:
 for(let s of [-1,1])for(let i=0;i<3;i++)line([[-18+i*12,s*13],[-34+i*12,s*(27+i*4)],[-40+i*17+Math.sin(t*3+i)*4,s*(46+i*3)]],'#9d70b3',5);
 poly([[31,0],[14,-31],[-15,-26],[-33,0],[-15,26],[14,31]]);oval(0,0,13+pulse,19,'#643a7c');break;
 case 5:
 for(let s of [-1,1]){poly([[-29,s*11],[-39,s*29],[-12,s*40],[14,s*35],[34,s*18]],'#9e6945');poly([[20,s*13],[56,s*12],[56,s*23],[23,s*28]])}
 poly([[-31,-24],[17,-24],[32,0],[17,24],[-31,24]],'#d3864d');poly([[-22,-14],[12,-14],[20,0],[12,14],[-22,14]],'#ffcd79');line([[-14,-9],[5,-9]],'#753e2a',4);line([[-14,9],[5,9]],'#753e2a',4);break;
 case 6:
 poly([[37,0],[-6,-50],[-35,-57],[-18,-15],[-44,0],[-18,15],[-35,57],[-6,50]],'#6377b2');poly([[35,0],[-4,-21],[-20,0],[-4,21]]);line([[-30,0],[-50,8],[-66,Math.sin(t*4)*10]],d.color,4);break;
 case 7:
 c.strokeStyle=d.color;c.lineWidth=9;c.beginPath();c.arc(0,0,40,t*.25,t*.25+Math.PI*1.6);c.stroke();
 for(let i=0;i<3;i++){const a=t*.4+i*Math.PI*2/3;oval(Math.cos(a)*51,Math.sin(a)*51,8,8,'#efccfa')}
 oval(0,0,23,28,'#895080');poly([[27,0],[-3,-15],[-17,0],[-3,15]]);break;
 case 8:
 for(let i=4;i>=0;i--){const y=Math.sin(t*3+i*.7)*10;oval(18-i*17,y,15-i,19-i,'#498e80');poly([[18-i*17,y-9],[10-i*17,y-23],[26-i*17,y-9]])}
 poly([[10,-23],[43,-18],[57,0],[43,18],[10,23],[22,0]]);break;
 case 9:
 for(let i=0;i<6;i++){const a=i*Math.PI/3,px=Math.cos(a),py=Math.sin(a);line([[px*15,py*15],[px*32-py*9,py*32+px*9],[px*52,py*52]],'#b09557',7);poly([[px*44-py*7,py*44+px*7],[px*65,py*65],[px*44+py*7,py*44-px*7]])}
 poly([[31,0],[16,28],[-16,28],[-31,0],[-16,-28],[16,-28]],'#dbc487');oval(0,0,16,16,'#796846');break;
 }
 if(stage!==3){oval(stage===8?36:14,-6,4,3,'#faffdb');oval(stage===8?36:14,6,4,3,'#faffdb')}
 if(hit){c.globalAlpha=.5;oval(0,0,23,18,'#ffffff')}c.restore();
}
function bossShot(e,a,speed=170,extra={}){if(run.hostile.length<400)run.hostile.push({x:e.x,y:e.y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,life:6,r:6,color:bossDesigns[run.stage].color,...extra})}
function bossRing(e,count,offset=0,extra={}){for(let i=0;i<count;i++)bossShot(e,offset+i*Math.PI*2/count,155,extra)}
function bossZone(e,options){run.bossZones.push({owner:e,age:0,delay:1,duration:.4,x:e.x,y:e.y,radius:80,damage:22+run.stage*2,color:bossDesigns[run.stage].color,...options})}
function summonBossMinions(e,count){for(let i=0;i<count&&run.enemies.length<180;i++){const a=i*Math.PI*2/count;run.enemies.push({x:e.x+Math.cos(a)*70,y:e.y+Math.sin(a)*70,hp:55+run.stage*12,maxHp:55+run.stage*12,type:0,r:14,speed:75,shot:3,hit:0,angle:a})}}
function prepareBossAction(e){
 const stage=run.stage;e.warn=.95;e.aim=Math.atan2(run.y-e.y,run.x-e.x);e.target={x:run.x,y:run.y};e.action=stage;
 if(stage===0||stage===8){e.dashLeft=e.dashLeft|| (stage===8?3:1);e.warn=.9}
 if(stage===5)for(let k=0;k<2;k++)bossZone(e,{shape:'line',angle:e.aim+k*Math.PI/2,length:1000,width:24,delay:1.15,duration:.35});
 if(stage===7)for(let i=0;i<6;i++){const a=i*Math.PI/3;bossZone(e,{x:run.x+Math.cos(a)*135,y:run.y+Math.sin(a)*135,radius:65,delay:1.2+i*.18})}
 if(stage===3)for(let i=0;i<3;i++)bossZone(e,{x:run.x+(i-1)*105,y:run.y+(i%2)*100,radius:60,delay:1.1,duration:3});
}
function executeBossAction(e){
 const stage=e.action,a=e.aim;e.cycle=(e.cycle||0)+1;
 if(stage===0||stage===8){e.dash=.7;e.dashAngle=a;return}
 if(stage===1){for(let i=-3;i<=3;i++)bossShot(e,a+i*.16,205)}
 if(stage===2)bossRing(e,16,run.t*.1,{chill:true});
 if(stage===3)summonBossMinions(e,3);
 if(stage===4){bossRing(e,12);e.echo=.55}
 if(stage===6){e.spiral=2;e.spiralClock=0}
 if(stage===9){if(e.cycle%3===1)bossRing(e,20,a);else if(e.cycle%3===2)summonBossMinions(e,5);else for(let i=-4;i<=4;i++)bossShot(e,a+i*.12,235)}
 e.cool=[4,3.2,4,5.5,4.5,4.8,5,5,3.8,3.8][stage];
}
function updateBoss(e,dt){
 e.hit=Math.max(0,e.hit-dt);e.cool??=2;e.warn??=0;
 if(e.echo>0){e.echo-=dt;if(e.echo<=0)bossRing(e,12,Math.PI/12)}
 if(e.spiral>0){e.spiral-=dt;e.spiralClock-=dt;if(e.spiralClock<=0){for(let i=0;i<3;i++)bossShot(e,run.t*2+i*Math.PI*2/3,145);e.spiralClock=.16}}
 if(e.dash>0){e.dash-=dt;e.x+=Math.cos(e.dashAngle)*440*dt;e.y+=Math.sin(e.dashAngle)*440*dt;e.angle=e.dashAngle;if(e.dash<=0){e.dashLeft--;if(e.dashLeft>0)prepareBossAction(e);else e.cool=4}}
 else if(e.warn>0){e.warn-=dt;if(e.warn<=0)executeBossAction(e)}
 else{const dx=run.x-e.x,dy=run.y-e.y,d=Math.hypot(dx,dy)||1;e.angle=Math.atan2(dy,dx);if(d>220){const speed=e.speed*(e.slow>run.t?.45:1);e.x+=dx/d*speed*dt;e.y+=dy/d*speed*dt}e.cool-=dt;if(e.cool<=0&&d<650)prepareBossAction(e)}
 if(Math.hypot(e.x-run.x,e.y-run.y)<e.r+13)damagePlayer(26*(1+run.stage*.13));
}
function updateBossZones(dt){
 for(const z of run.bossZones){if(z.owner.dead)continue;z.age+=dt;if(z.age<z.delay||z.age>z.delay+z.duration)continue;const dx=run.x-z.x,dy=run.y-z.y;let inside=Math.hypot(dx,dy)<z.radius;
 if(z.shape==='line')inside=Math.abs(dx*Math.sin(z.angle)-dy*Math.cos(z.angle))<z.width+13&&Math.abs(dx*Math.cos(z.angle)+dy*Math.sin(z.angle))<z.length;
 if(inside)damagePlayer(z.damage)}
 run.bossZones=run.bossZones.filter(z=>!z.owner.dead&&z.age<z.delay+z.duration);
}
function drawBossWarnings(sx,sy){
 for(const z of run.bossZones){ctx.save();ctx.translate(sx(z.x),sy(z.y));ctx.strokeStyle=z.color;ctx.fillStyle=z.color;ctx.globalAlpha=z.age<z.delay?.2:.65;ctx.lineWidth=2;
 if(z.shape==='line'){ctx.rotate(z.angle);ctx.fillRect(-z.length,-z.width,z.length*2,z.width*2);ctx.globalAlpha=.8;ctx.strokeRect(-z.length,-z.width,z.length*2,z.width*2)}
 else{ctx.beginPath();ctx.arc(0,0,z.radius,0,Math.PI*2);ctx.fill();ctx.globalAlpha=.8;ctx.stroke()}
 ctx.restore()}
 for(const e of run.enemies)if(e.type===3&&e.warn>0&&!e.dead){ctx.save();ctx.translate(sx(e.x),sy(e.y));ctx.rotate(e.aim);ctx.strokeStyle=bossDesigns[run.stage].color;ctx.fillStyle=bossDesigns[run.stage].color;ctx.globalAlpha=.35;ctx.lineWidth=2;
 if(run.stage===0||run.stage===8){ctx.fillRect(0,-e.r,360,e.r*2);ctx.globalAlpha=.9;ctx.strokeRect(0,-e.r,360,e.r*2)}
 else if(run.stage===1||run.stage===9){ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,280,-.6,.6);ctx.closePath();ctx.fill()}
 else{ctx.beginPath();ctx.arc(0,0,e.r+18,0,Math.PI*2);ctx.stroke()}
 ctx.restore()}
}
