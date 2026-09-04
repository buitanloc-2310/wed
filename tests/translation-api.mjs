import assert from 'node:assert/strict';
import { translateApi } from '../src/routes/translate-api.js';
const originalFetch=globalThis.fetch, originalCaches=globalThis.caches;
globalThis.caches={default:{async match(){return null;},async put(){}}};
try{
  globalThis.fetch=async url=>{assert.match(String(url),/^https:\/\/translate\.googleapis\.com\//);return new Response(JSON.stringify([[['Hello','Xin chào',null,null]]]),{status:200,headers:{'content-type':'application/json'}})};
  let request=new Request('https://skyfirst.io.vn/api/translate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({target:'en',texts:['Xin chào']})});
  let response=await translateApi(request,{},new URL(request.url));assert.equal(response.status,200);assert.deepEqual((await response.json()).translations,['Hello']);
  globalThis.fetch=async url=>String(url).includes('translate.googleapis.com')?new Response('no',{status:503}):new Response(JSON.stringify({responseData:{translatedText:'Hello fallback'}}),{status:200,headers:{'content-type':'application/json'}});
  request=new Request('https://skyfirst.io.vn/api/translate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({target:'en',texts:['Xin chào']})});response=await translateApi(request,{},new URL(request.url));assert.equal(response.status,200);assert.deepEqual((await response.json()).translations,['Hello fallback']);
  console.log('TRANSLATION API PASS: primary provider, fallback provider, validation and parsing.');
}finally{globalThis.fetch=originalFetch;globalThis.caches=originalCaches;}
