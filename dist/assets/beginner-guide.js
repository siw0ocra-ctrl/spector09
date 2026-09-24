'use strict';
// Help is browser-local and never changes account balances or upgrade choices.
(() => {
 const storageKey='sector09-guide-v1';
 let seen={};try{const saved=JSON.parse(localStorage.getItem(storageKey)||'{}');if(saved&&typeof saved==='object'&&!Array.isArray(saved))seen=saved}catch{}
 const mark=(...names)=>{for(const name of names)seen[name]=true;try{localStorage.setItem(storageKey,JSON.stringify(seen))}catch{}};
 const dialog=document.createElement('dialog');dialog.id='guideModal';dialog.setAttribute('aria-labelledby','guideHeading');document.body.append(dialog);
 let ownedRun=null,returnFocus=null;
 const clearInput=()=>{keys={};resetMobileStick()};
 function closeGuide(skip=false){
  if(!dialog.open)return;
  if(skip)mark('battle','choice','combo');else mark('battle');
  dialog.close();clearInput();
  if(ownedRun&&run===ownedRun&&!run.ended&&run.modalMode==='guide'){
   run.modalMode=null;run.paused=false;canvas.focus();
  }else if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});
  ownedRun=null;
 }
 function showGuide(first=false){
  if(dialog.open)return;returnFocus=document.activeElement;
  if(view==='battle'&&run&&!run.ended&&!run.paused){ownedRun=run;run.paused=true;run.modalMode='guide';clearInput();draw()}
  dialog.innerHTML=`<div class="eyebrow">FIELD MANUAL / 초보자 안내</div><h2 id="guideHeading" tabindex="-1">이동부터, 천천히 익히세요.</h2><p>전투 중 안내를 보는 동안에는 게임이 멈춥니다.</p><div class="guide-steps"><article><span>01 / 조작</span><h3>공격은 자동입니다</h3><p>PC에서는 WASD·방향키, 모바일에서는 왼쪽 조이스틱으로 이동하세요. 적과 바닥의 공격 예고를 피하는 데 집중하세요.</p><p>SPACE 또는 스팀팩 버튼으로 잠시 기동력을 높이세요. 다시 사용하려면 재사용 시간을 기다려야 합니다.</p></article><article><span>02 / 성장</span><h3>경험치를 모아 강화하세요</h3><p>경험치를 줍고 레벨업하면 카드 하나를 고릅니다. 무기는 공격을 추가·강화하고, 패시브는 이번 작전의 공통 능력을 강화합니다.</p><p>무기는 NORMAL 5종 · HARD 3종 · EXTREME 1종까지. EXTREME에서는 시작 무기가 자동 성장하고 패시브를 선택합니다.</p></article><article><span>03 / 각성</span><h3>무기 5 + 연결 패시브 3</h3><p>같은 작전에서 무기 Lv.5와 그 무기에 연결된 패시브 Lv.3을 갖추면 자동 각성합니다. 패시브는 Lv.5까지 더 강화할 수 있습니다.</p><p>ESC 또는 일시정지에서 현재 능력치와 각성 진행도를 확인하세요. 상자는 한 번 공격한 뒤 떨어진 아이템을 주우세요.</p></article></div><p class="guide-note">골드로 무기고에서 영구 강화할 수 있습니다. 안내는 이 브라우저에 기억되며, 작전실과 일시정지의 ‘초보자 안내’에서 다시 볼 수 있습니다.</p><div class="modal-actions"><button class="primary" id="guideContinue">${first?'확인 · 전투 시작':'닫기'}</button>${first?'<button id="guideSkip">안내 건너뛰기</button>':''}</div>`;
  dialog.showModal();dialog.scrollTop=0;dialog.querySelector('h2').focus();
  $('guideContinue').onclick=()=>closeGuide();if($('guideSkip'))$('guideSkip').onclick=()=>closeGuide(true);
 }
 dialog.addEventListener('cancel',e=>{e.preventDefault();closeGuide()});
 window.addEventListener('keydown',e=>{if(dialog.open&&e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();closeGuide()}},true);
 const help=document.createElement('button');help.id='beginnerHelp';help.textContent='초보자 안내';help.onclick=()=>showGuide();$('camp').querySelector('.briefing').before(help);
 const beginBase=beginLocalRun;
 beginLocalRun=function(...args){const previous=run;const result=beginBase(...args);if(run&&run!==previous&&!seen.battle)showGuide(true);return result};
 const pauseBase=pause;
 pause=function(...args){const result=pauseBase(...args);if(run?.modalMode==='pause'&&!$('pauseGuide')){const button=document.createElement('button');button.id='pauseGuide';button.textContent='초보자 안내';button.onclick=()=>showGuide();$('modalContent').querySelector('.modal-actions').before(button)}return result};$('pause').onclick=pause;
 const choicesBase=renderChoices;
 renderChoices=function(...args){const result=choicesBase(...args);if(!seen.choice){const panel=document.createElement('aside');panel.className='guide-choice';panel.innerHTML='<b>첫 강화 안내</b><p>무기 카드는 공격을 얻거나 무기 레벨을 올립니다. 패시브 카드는 이번 작전의 능력을 강화합니다. 카드에 표시된 연결 패시브를 함께 올리면 각성에 가까워집니다.</p><p>각 칸의 무료 리롤은 입장당 1회이며, 사용한 뒤에는 공용 리롤을 차감합니다.</p><button type="button">알겠어요</button>';panel.querySelector('button').onclick=()=>{mark('choice');panel.remove()};$('modalContent').querySelector('.choices').before(panel)}return result};
 const chooseBase=choose;
 choose=function(...args){const wasChoice=run?.modalMode==='choice';const result=chooseBase(...args);if(wasChoice&&run?.modalMode!=='choice')mark('choice');return result};
 const awakeningBase=checkAwakenings;
 checkAwakenings=function(...args){const result=awakeningBase(...args);if(!seen.combo&&run){const match=weapons.find(w=>run.weapons[w.id]&&run.skills[w.passive]>0&&!run.awakened[w.id]);if(match){mark('combo');toast(`${match.name} 각성 조합 확보! 무기 Lv.5 + ${passives.find(p=>p.id===match.passive).name} Lv.3을 목표로 하세요.`)}}return result};
 const statsBase=statsHTML;
 statsHTML=function(...args){return `<section class="guide-progress"><h3>각성 진행도</h3>${weapons.filter(w=>run.weapons[w.id]).map(w=>{const p=passives.find(p=>p.id===w.passive),wl=run.weapons[w.id],pl=run.skills[p.id]||0;return `<div><b>${run.awakened[w.id]?w.awake+' · 각성 완료':w.name+' → '+w.awake}</b><label>무기 ${wl}/5<progress value="${wl}" max="5"></progress></label><label>${p.name} ${Math.min(pl,3)}/3${pl>3?' · 현재 Lv.'+pl:''}<progress value="${Math.min(pl,3)}" max="3"></progress></label></div>`}).join('')}</section>`+statsBase(...args)};
})();
