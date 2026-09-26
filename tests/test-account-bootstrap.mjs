import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const html=fs.readFileSync('dist/index.html','utf8');
const source=html.match(/<script id="account-bootstrap">([\s\S]*?)<\/script>/)[1];
assert(html.indexOf('account-bootstrap')<html.indexOf('rel="stylesheet"'));
for(const pending of [null,'{"id":"pending-operation"}']){
 let calls=0;const response={ok:true};
 const context={window:{},AbortController,setTimeout,clearTimeout,sessionStorage:{getItem:()=>pending},fetch:async(url,options)=>{calls++;assert.equal(url,'/api/v3/session');assert.equal(options.method,'POST');return response}};
 vm.runInNewContext(source,context);
 if(pending){assert.equal(calls,0);assert.equal(context.window.sectorSessionBootstrap,undefined)}else{assert.equal(calls,1);assert.equal(await context.window.sectorSessionBootstrap,response)}
}
// Validate that the ordinary account transport consumes the early response exactly once.
const code=fs.readFileSync('dist/assets/account-ui.js','utf8');
const fetchSource=code.slice(code.indexOf('async function accountFetch'),code.indexOf('function savePending'));
let calls=0;const body={profile:{gold:0}};
const context={window:{sectorSessionBootstrap:Promise.resolve({ok:true,json:async()=>body})},AbortController,setTimeout,clearTimeout,fetch:async()=>{calls++;return {ok:true,json:async()=>body}}};
vm.createContext(context);vm.runInContext(fetchSource,context);
assert.equal(await vm.runInContext("accountFetch('session',{})",context),body);assert.equal(calls,0);assert.equal(context.window.sectorSessionBootstrap,undefined);
await vm.runInContext("accountFetch('session',{})",context);assert.equal(calls,1);
console.log('PASS: early session starts before styles, pending writes suppress it, transport consumes response once and preserves later refreshes.');
