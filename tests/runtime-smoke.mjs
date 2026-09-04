import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import worker from '../src/index.js';

const root=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..');
const db=new DatabaseSync(':memory:');
for(const file of fs.readdirSync(path.join(root,'migrations')).filter(x=>x.endsWith('.sql')).sort()) db.exec(fs.readFileSync(path.join(root,'migrations',file),'utf8'));
class StmtWrap{
  constructor(stmt){this.stmt=stmt;this.args=[]}
  bind(...args){this.args=args;return this}
  async first(){return this.stmt.get(...this.args)??null}
  async all(){return {results:this.stmt.all(...this.args)}}
  async run(){const r=this.stmt.run(...this.args);return {success:true,meta:{last_row_id:Number(r.lastInsertRowid||0),changes:Number(r.changes||0)}}}
}
const DB={
  prepare(sql){return new StmtWrap(db.prepare(sql))},
  async batch(items){const out=[];db.exec('BEGIN');try{for(const x of items)out.push(await x.run());db.exec('COMMIT');return out}catch(e){db.exec('ROLLBACK');throw e}}
};
const ASSETS={async fetch(request){const u=new URL(request.url);const rel=u.pathname.replace(/^\/assets\//,'assets/');const f=path.join(root,'public',rel);if(!f.startsWith(path.join(root,'public'))||!fs.existsSync(f))return new Response('Not found',{status:404});const ext=path.extname(f);const type=ext==='.css'?'text/css':ext==='.js'?'text/javascript':ext==='.png'?'image/png':ext==='.jpg'?'image/jpeg':'application/octet-stream';return new Response(fs.readFileSync(f),{headers:{'content-type':type}})}};
const MEDIA={async get(){return null},async put(){}};
const env={DB,ASSETS,MEDIA,APP_NAME:'Sky First Network',APP_URL:'https://skyfirst.io.vn',DEFAULT_LANGUAGE:'vi'};
async function hit(pathname,opt={}){return worker.fetch(new Request('https://skyfirst.io.vn'+pathname,opt),env)}
function assert(cond,msg){if(!cond)throw new Error(msg)}

let r=await hit('/');assert(r.status===200,'home status');let t=await r.text();assert(t.includes('SKY FIRST NETWORK'),'home brand');assert(!t.includes('ERR_TOO_MANY_REDIRECTS'),'home loop marker');
r=await hit('/gioi-thieu');assert(r.status===200,'page status');t=await r.text();assert(t.includes('Sky First Network là gì?'),'page content');
for(const row of db.prepare("SELECT slug FROM pages WHERE lang='vi' AND status='published' ORDER BY id").all()){const route=row.slug?'/'+row.slug:'/';const rr=await hit(route);assert(rr.status===200,`public CMS route ${route}`)}
r=await hit('/admin');assert(r.status===200,'admin shell status');t=await r.text();assert(t.includes('Sky First Admin'),'admin shell');
r=await hit('/api/health');assert(r.status===200,'health status');assert((await r.json()).ok===true,'health body');
r=await hit('/api/admin/session');let j=await r.json();assert(j.setup_required===true&&j.authenticated===false,'first-run session');
r=await hit('/api/admin/setup',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name:'QA Admin',email:'qa@example.com',password:'QA-Strong-Password-2026!'})});assert(r.status===201,'setup status');
r=await hit('/api/admin/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email:'qa@example.com',password:'QA-Strong-Password-2026!'})});assert(r.status===200,'login status');j=await r.json();const setCookie=r.headers.get('set-cookie');assert(setCookie&&j.csrf,'login cookie/csrf');const cookie=setCookie.split(';')[0];
r=await hit('/api/admin/dashboard',{headers:{cookie}});assert(r.status===200,'dashboard status');j=await r.json();assert(j.counts.pages===42,'dashboard page count');
r=await hit('/api/forms',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({form_type:'contact',name:'QA Contact',email:'qa@example.com',message:'Test',consent:true})});assert(r.status===201,'form submit');
r=await hit('/tra-cuu');assert(r.status===200,'certificate search status');t=await r.text();assert(t.includes('Tra cứu Giấy chứng nhận'),'certificate page');
r=await hit('/assets/css/site.css');assert(r.status===200,'asset status');assert((await r.text()).includes('--blue'),'asset body');
r=await hit('/robots.txt');assert(r.status===200,'robots status');
console.log('RUNTIME SMOKE PASS: production CMS routes, admin first-run, login, dashboard, form API, certificate page, assets and robots.');
