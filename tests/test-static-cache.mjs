import assert from 'node:assert/strict';
import fs from 'node:fs';
const source=fs.readFileSync('dist/server/index.js','utf8');
const worker=(await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'))).default;
for(const file of ['/','/game.js','/assets/drone.png']){
 const first=await worker.fetch(new Request('https://test.invalid'+file),{});assert.equal(first.status,200);const etag=first.headers.get('etag');assert(etag);assert((await first.arrayBuffer()).byteLength>0);
 const cached=await worker.fetch(new Request('https://test.invalid'+file,{headers:{'If-None-Match':etag}}),{});assert.equal(cached.status,304);assert.equal((await cached.arrayBuffer()).byteLength,0);
 const stale=await worker.fetch(new Request('https://test.invalid'+file,{headers:{'If-None-Match':'"old"'}}),{});assert.equal(stale.status,200);
}
console.log('PASS: HTML, script and image ETags return bodyless 304, stale versions return fresh content.');
