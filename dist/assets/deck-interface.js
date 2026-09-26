'use strict';
// UI adapters preserve the original handlers, prices and authoritative account flow.
(() => {
 const moduleArt={crit:'combat-baseRadar',damage:'worldCannon',power:'worldCannon',hp:'worldVault',armor:'worldVault',speed:'drone',regen:'worldLab',gold:'worldOre',wealth:'worldOre',magnet:'worldRelay',reroll:'combat-baseRadar',rapid:'combat-baseGenerator',area:'worldReactor'};
 const moduleSrc=id=>'assets/'+(moduleArt[id]||'combat-baseSolar')+'.png';
 const image=(src,className)=>{const el=document.createElement('img');el.src=src;el.alt='';el.className=className;return el};
 const modalBase=openModal;
 openModal=function(html){modalBase(html);const root=$('modalContent');$('modal').dataset.deck=root.querySelector('.choices')?'choices':root.querySelector('.result-stats')?'result':root.querySelector('.stat-grid')?'stats':'general';
  root.querySelectorAll('.pause-weapons>div').forEach((el,i)=>{const id=Object.keys(run?.weapons||{})[i];if(id)el.prepend(image('assets/weapon-icon-'+id+'.svg','deck-pause-icon'))});
 };
 const choicesBase=renderChoices;
 renderChoices=function(...args){const result=choicesBase(...args);$('modalContent').querySelectorAll('[data-skill]').forEach(button=>{const [kind,id]=button.dataset.skill.split(':');const src=kind==='w'?'assets/weapon-icon-'+id+'.svg':moduleSrc(id);const art=document.createElement('span');art.className='deck-card-art';art.append(image(src,'deck-choice-icon'));button.querySelector('.rarity-label').after(art)});return result};
 const damageBase=damageReport;
 damageReport=function(r){const root=document.createElement('div');root.innerHTML=damageBase(r);const ids=Object.keys(r.weapons).sort((a,b)=>(r.weaponDamage[b]||0)-(r.weaponDamage[a]||0));root.querySelectorAll('.damage-row').forEach((row,i)=>row.prepend(image('assets/weapon-icon-'+ids[i]+'.svg','deck-damage-icon')));return root.innerHTML};
 const shopBase=renderShop;
 renderShop=function(...args){const result=shopBase(...args);$('upgrades').dataset.deck=armoryTab;document.querySelectorAll('#upgrades .upgrade').forEach((card,i)=>{if(armoryTab==='research'){card.querySelector('.upgrade-top>span').replaceChildren(image(moduleSrc(research[i].id),'deck-module-icon'))}else{const w=weapons[i],level=save.weaponResearch[w.id],bar=document.createElement('div');bar.className='levels deck-research-levels';bar.setAttribute('aria-label','연구 '+level+' / 10');for(let n=0;n<10;n++){const cell=document.createElement('i');if(n<level)cell.className='on';bar.append(cell)}card.querySelector('button').before(bar)}});return result};
 // Research tab handlers were bound to older function references at boot.
 $('researchTab').onclick=()=>{armoryTab='research';renderShop()};$('weaponsTab').onclick=()=>{armoryTab='weapons';renderShop()};
 let category='suit',previewSkin=null;
 function paintFitting(id){const canvas=$('deckFittingCanvas');if(!canvas)return;previewSkin=id;const item=cosmeticCatalog.find(c=>c.id===id),g=canvas.getContext('2d');g.clearRect(0,0,480,280);g.fillStyle='#152119';g.fillRect(0,0,480,280);g.strokeStyle='#334b36';g.lineWidth=1;for(let x=0;x<480;x+=40){g.beginPath();g.moveTo(x,0);g.lineTo(x,280);g.stroke()}for(let y=0;y<280;y+=40){g.beginPath();g.moveTo(0,y);g.lineTo(480,y);g.stroke()}g.strokeStyle='#a9b785';g.beginPath();g.ellipse(240,200,100,30,0,0,Math.PI*2);g.stroke();drawPilot(g,240,130,155,-Math.PI/2,id);$('deckFittingName').textContent=item?.name||'기본 전투 슈트';$('deckFittingDesc').textContent=item?.desc||'원정 보병 표준 장비';$('deckFittingState').textContent=save.cosmetics.equipped.suit===id?'현재 장착 중':save.cosmetics.owned.includes(id)?'보유한 외형 · 아래에서 장착할 수 있습니다.':'미보유 외형 · 미리보기에는 골드가 들지 않습니다.';canvas.setAttribute('aria-label',(item?.name||'기본 전투 슈트')+' 확대 미리보기');document.querySelectorAll('[data-fitting]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.fitting===id)))}
 const storeBase=renderStore;
 renderStore=function(...args){const result=storeBase(...args);if(storeSection!=='appearance')return result;const root=$('storeItems');
  const tabs=document.createElement('div');tabs.className='deck-category-tabs';tabs.setAttribute('role','group');tabs.setAttribute('aria-label','외형 종류');
  for(const [id,label]of [['suit','전투 슈트'],['drone','드론'],['trail','공격 효과']]){const button=document.createElement('button');button.textContent=label;button.dataset.deckCategory=id;button.setAttribute('aria-pressed',String(id===category));button.onclick=()=>{category=id;renderStore();document.querySelector('[data-deck-category="'+id+'"]').focus({preventScroll:true})};tabs.append(button)}root.prepend(tabs);
  root.querySelectorAll('.store-category').forEach(section=>{const id=cosmeticCatalog.find(c=>c.id===section.querySelector('canvas').dataset.cosmetic).category;section.hidden=id!==category;section.dataset.category=id});
  root.querySelectorAll('.store-card').forEach(card=>{const item=cosmeticCatalog.find(c=>c.id===card.querySelector('canvas').dataset.cosmetic);card.classList.toggle('deck-equipped',save.cosmetics.equipped[item.category]===item.id);if(item.category==='suit'){const button=document.createElement('button');button.className='deck-fitting-button';button.dataset.fitting=item.id;button.textContent='슈트 크게 보기';button.onclick=()=>{paintFitting(item.id);$('deckFitting').scrollIntoView({block:'nearest',behavior:'instant'})};card.querySelector('canvas').after(button)}});
  if(category==='suit'){const fitting=document.createElement('section');fitting.id='deckFitting';fitting.className='deck-fitting';fitting.innerHTML='<canvas id="deckFittingCanvas" width="480" height="280"></canvas><div><div class="eyebrow">FITTING ROOM / 외형 미리보기</div><h2 id="deckFittingName"></h2><p id="deckFittingDesc"></p><b id="deckFittingState"></b><p>아래 슈트의 ‘크게 보기’를 눌러 비교하세요.<br>장착과 구매는 각 상품 버튼에서 진행합니다.</p></div>';tabs.after(fitting);paintFitting(previewSkin||save.cosmetics.equipped.suit||'default')}
  return result;
 };
 // Existing handlers resolve these functions dynamically when entering each screen.
 for(const [selector,src]of [['#shop .shop-heading','combat-baseHangar'],['#store .shop-heading','worldVault'],['#market .market-heading','drone']]){const el=document.querySelector(selector);el.prepend(image('assets/'+src+'.png','deck-heading-art'))}
 document.querySelector('#shop .shop-heading h1').textContent='원정대 정비소';document.querySelector('#store .shop-heading h1').textContent='보급품 거래소';
})();
