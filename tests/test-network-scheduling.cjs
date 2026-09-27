const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const prefix=fs.readFileSync('tests/test-client-v3.cjs','utf8').split('const test=s=>')[0];
const sandbox=new Function('require',prefix+';return sandbox;')(require),test=s=>vm.runInContext(s,sandbox);
(async()=>{
 test(`accountBusy=false;pendingOperation=null;accountReady=true;view='camp';serverOffset=0;accountProfile={id:'a',revision:0,titleCheckedAt:Date.now(),titles:{eligible:[]}};renderCamp=()=>{};applyProfile=p=>accountProfile=p;`);
 let calls=0,resolve;sandbox.transport=async()=>{calls++;return {profile:{id:'a',revision:0,titleCheckedAt:Date.now(),titles:{eligible:[]}}}};test('accountFetch=transport');
 await test('refreshLiveTitles()');await test('refreshLiveTitles()');assert.equal(calls,0,'fresh profile must suppress background calls');
 await test('claimRankingTitles(false)');assert.equal(calls,1,'manual check must issue exactly one read');
 test('accountProfile.titleCheckedAt=0;document.hidden=true');await test('refreshLiveTitles()');assert.equal(calls,1);
 test('document.hidden=false;pendingOperation={action:"finish"}');await test('refreshLiveTitles()');assert.equal(calls,1);
 test('pendingOperation=null');sandbox.transport=()=>{calls++;return new Promise(r=>resolve=r)};test('accountFetch=transport');const pending=test('refreshLiveTitles()');await test('refreshLiveTitles(true)');assert.equal(calls,2,'overlapping title requests coalesce');resolve({profile:{id:'a',revision:0,titleCheckedAt:Date.now()}});await pending;
 let fetched=0,complete;sandbox.fetch=()=>{fetched++;return new Promise(r=>complete=r)};
 const first=test('requestRanking(0,true,0)');const second=test('requestRanking(0,true,0)');assert.equal(first,second);assert.equal(fetched,1);complete({ok:true,json:async()=>({rows:[]})});await first;
 test('pendingOperation={action:"finish"};updateAccountControls()');assert.equal(test(`$('walletStatus').textContent`),'정산 중…');test('accountReady=false;updateAccountControls()');assert.equal(test(`$('walletStatus').textContent`),'정산 확인 필요');test('pendingOperation=null;updateAccountControls()');assert.equal(test(`$('walletStatus').hidden`),true);
 const src=fs.readFileSync('dist/assets/account-ui.js','utf8');assert(!src.includes('await claimRankingTitles(false)'));
 console.log('PASS: fresh/hidden/busy title suppression, read-only manual refresh, overlap deduplication, pending wallet feedback, no extra rank claim.');
})().catch(e=>{console.error(e);process.exitCode=1});
