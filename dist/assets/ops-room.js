'use strict';
// Presentation only: existing stage handlers, account gates and start logic remain authoritative.
(() => {
 const art=['combat-baseRadar','worldTower','worldLab','worldFungus','worldReactor','worldFactory','worldVault','worldTwin','worldCrystal','worldSpore'];
 const points=[[10,28],[30,38],[50,25],[70,35],[90,26],[90,72],[70,80],[50,68],[30,79],[10,69]];
 const aside=$('camp').querySelector('.camp-grid>aside');
 aside.querySelector('.eyebrow').textContent='CAMPAIGN / 01—10';
 aside.querySelector('h1').innerHTML='작전 지도 <span>OPERATIONS</span>';
 aside.querySelector('.intro').textContent='지역을 선택하고 원정대를 출정시키세요.';
 const legend=document.createElement('div');legend.className='ops-map-legend';legend.innerHTML='<span>◆ 선택 지역</span><span>✓ 작전 완료</span><span>잠김 · 이전 지역 클리어 필요</span>';$('stages').after(legend);
 for(const [id,img]of [['campTab','combat-baseRadar'],['shopTab','weapon-icon-gauss'],['storeTab','title-rank-2'],['marketTab','drone']]){const icon=document.createElement('img');icon.src='assets/'+img+(img.startsWith('weapon-icon')?'.svg':'.png');icon.alt='';icon.className='ops-nav-icon';$(id).prepend(icon)}
 const detail=document.createElement('span');detail.className='ops-detail-label';detail.textContent='MISSION BRIEF / 작전 브리핑';$('camp').querySelector('.mission-top').before(detail);
 const base=renderCamp;
 renderCamp=function(...args){const result=base(...args),panel=$('difficultyPanel');
  if(panel){aside.querySelector('.intro').after(panel);const badge=panel.querySelector('.commander-row');if(badge&&!badge.querySelector('img')){const img=document.createElement('img');img.src='assets/title-rank-'+(accountProfile?.rank||0)+'.png';img.alt='';img.className='ops-rank';badge.prepend(img)}}
  const map=$('stages');map.setAttribute('aria-label','작전 지도 · 지역 선택');
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 100 100');svg.setAttribute('preserveAspectRatio','none');svg.classList.add('ops-route');svg.setAttribute('aria-hidden','true');
  const route=document.createElementNS('http://www.w3.org/2000/svg','polyline');route.setAttribute('points',points.map(p=>p.join(',')).join(' '));svg.append(route);map.prepend(svg);
  map.querySelectorAll('button').forEach((button,i)=>{button.style.setProperty('--map-x',points[i][0]+'%');button.style.setProperty('--map-y',points[i][1]+'%');button.classList.toggle('completed',save.clears.includes(i));button.setAttribute('aria-pressed',String(i===selected));button.setAttribute('aria-label',`${i+1}. ${stages[i].name}${i>save.unlocked?' · 잠김':save.clears.includes(i)?' · 완료':''}`);const img=document.createElement('img');img.src='assets/'+art[i]+'.png';img.alt='';img.className='ops-base';button.prepend(img)});
  return result;
 };
 renderCamp();
})();
