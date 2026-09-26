import assert from 'node:assert/strict';
import fs from 'node:fs';
const source=fs.readFileSync('dist/server/index.js','utf8');
const worker=(await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'))).default;
for(const file of ['/','/game.js','/assets/drone.png','/assets/weapon-icon-gauss.svg']){
 const first=await worker.fetch(new Request('https://test.invalid'+file),{});assert.equal(first.status,200);if(file.endsWith('.svg'))assert.equal(first.headers.get('content-type'),'image/svg+xml');const etag=first.headers.get('etag');assert(etag);assert((await first.arrayBuffer()).byteLength>0);
 const cached=await worker.fetch(new Request('https://test.invalid'+file,{headers:{'If-None-Match':etag}}),{});assert.equal(cached.status,304);assert.equal((await cached.arrayBuffer()).byteLength,0);
 const stale=await worker.fetch(new Request('https://test.invalid'+file,{headers:{'If-None-Match':'"old"'}}),{});assert.equal(stale.status,200);
}
console.log('PASS: HTML, script and image ETags return bodyless 304, stale versions return fresh content.');

const htmlResponse=await worker.fetch(new Request('https://test.invalid/'),{}),html=await htmlResponse.text();assert.equal(htmlResponse.headers.get('cache-control'),'no-cache');
const urls=[...html.matchAll(/(?:src|href)=["']([^"']+[?]v=[a-f0-9]{64})["']/g)].map(m=>m[1]);assert(urls.length>=20);
for(const url of urls){const r=await worker.fetch(new Request('https://test.invalid/'+url),{});assert.equal(r.status,200);assert.equal(r.headers.get('cache-control'),'public, max-age=31536000, immutable');assert.equal(r.headers.get('etag').slice(1,-1),new URL('https://test.invalid/'+url).searchParams.get('v'));}
const gameUrl=urls.find(u=>u.startsWith('game.js?'));const game=await (await worker.fetch(new Request('https://test.invalid/'+gameUrl),{})).text();
const manifestUrl=game.match(/assets\/manifest.json[?]v=[a-f0-9]{64}/)[0];const manifestResponse=await worker.fetch(new Request('https://test.invalid/'+manifestUrl),{});assert.match(manifestResponse.headers.get('cache-control'),/immutable/);
for(const url of Object.values(await manifestResponse.json())){assert.match(url,/[?]v=[a-f0-9]{64}$/);const r=await worker.fetch(new Request('https://test.invalid/'+url),{});assert.equal(r.status,200);assert.equal(r.headers.get('etag').slice(1,-1),new URL('https://test.invalid/'+url).searchParams.get('v'));assert.match(r.headers.get('cache-control'),/immutable/)}
assert.equal((await worker.fetch(new Request('https://test.invalid/game.js?v=obsolete'),{})).headers.get('cache-control'),'no-cache');
const api=await worker.fetch(new Request('https://test.invalid/api/v3/status',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'}),{});assert.equal(api.status,401);assert.equal(api.headers.get('cache-control'),'no-store');
console.log('PASS: versioned scripts/styles/manifest/images immutable; HTML and unversioned or stale URLs revalidate; account API never cached.');
