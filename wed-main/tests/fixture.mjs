import {readFile} from 'node:fs/promises';
import {DatabaseSync} from 'node:sqlite';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url)).replace(/\/$/,'');
export async function createFixture(){
const sqlite=new DatabaseSync(':memory:');for(const name of ['0010_website_media_comments_contacts.sql','0011_admin_records.sql','0012_d1_admin_auth.sql','0013_cms_media_metadata.sql'])sqlite.exec(await readFile(root+'/migrations/'+name,'utf8'));
const DB={prepare(sql){let args=[];return {bind(...a){args=a;return this},async run(){return {success:true,meta:sqlite.prepare(sql).run(...args)}},async first(){return sqlite.prepare(sql).get(...args)||null},async all(){return {results:sqlite.prepare(sql).all(...args)}}}},async batch(qs){sqlite.exec('BEGIN');try{const out=[];for(const q of qs)out.push(await q.run());sqlite.exec('COMMIT');return out}catch(e){sqlite.exec('ROLLBACK');throw e}}};
const objects=new Map();const MEDIA={async put(key,body,options){const bytes=body instanceof Uint8Array?body:new Uint8Array(await new Response(body).arrayBuffer());objects.set(key,{key,bytes,...options,uploaded:new Date(),size:bytes.length,httpEtag:'"'+key+'"'})},async list({cursor,limit}){const all=[...objects.values()].sort((a,b)=>a.key.localeCompare(b.key));const index=Number(cursor||0);const slice=all.slice(index,index+limit);return {objects:slice,truncated:all.length>index+limit,cursor:String(index+limit)}},async get(key){const o=objects.get(key);return o?{...o,body:o.bytes,writeHttpMetadata(headers){headers.set('content-type',o.httpMetadata.contentType)}}:null},async head(key){return objects.get(key)||null},async delete(key){objects.delete(key)}};
const nativeFetch=globalThis.fetch;globalThis.fetch=async(url,init)=>String(url).includes('identitytoolkit.googleapis.com')?(JSON.parse(init?.body||'{}').idToken==='qa-owner-token'?Response.json({users:[{localId:'qa-owner',email:'skyfirst.ec@gmail.com'}]}):Response.json({error:{message:'INVALID_ID_TOKEN'}},{status:400})):nativeFetch(url,init);
sqlite.prepare("INSERT INTO website_admin_users(uid,email,name,role,status,is_root_owner,note) VALUES('qa-owner','skyfirst.ec@gmail.com','QA Owner','developer','active',1,'test fixture')").run();
return {env:{DB,MEDIA},objects,sqlite,close(){globalThis.fetch=nativeFetch;sqlite.close()}};
}
