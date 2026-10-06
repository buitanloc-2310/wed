import { json, requireAdminToken } from '../_auth.js';

const PUBLIC_COLLECTIONS = new Set(['site_config','cms_modules','custom_pages','programs','network_units','news_articles','certificates','people']);
const ALWAYS_PUBLIC = new Set(['site_config','cms_modules']);
const BUNDLE_COLLECTIONS = ['site_config','cms_modules','custom_pages','programs','network_units','news_articles','people'];

async function ensureSchema(context){
  if(!context.env.DB)throw new Error('Missing DB');
  await context.env.DB.prepare('CREATE TABLE IF NOT EXISTS website_cms_deleted(collection_name TEXT NOT NULL,doc_id TEXT NOT NULL,deleted_at TEXT NOT NULL,PRIMARY KEY(collection_name,doc_id))').run();
  await context.env.DB.prepare('CREATE TABLE IF NOT EXISTS website_cms_collections(collection_name TEXT PRIMARY KEY, initialized_at TEXT NOT NULL)').run();
  await context.env.DB.prepare(`CREATE TABLE IF NOT EXISTS website_cms_documents (
    collection_name TEXT NOT NULL,
    doc_id TEXT NOT NULL,
    data_json TEXT NOT NULL,
    is_published INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL,
    updated_by TEXT,
    PRIMARY KEY(collection_name, doc_id)
  )`).run();
  await context.env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_cms_collection_public ON website_cms_documents(collection_name,is_published,updated_at)').run();
}
function safeName(v){ return /^[a-z0-9_\-]{1,80}$/i.test(String(v||'')) ? String(v) : ''; }
function publishedFlag(collection,data){
  if(ALWAYS_PUBLIC.has(collection)) return 1;
  return data?.isPublished === true ? 1 : 0;
}
async function optionalAdmin(context){
  if(!context.request.headers.get('authorization'))return null;
  try { const response=await requireAdminToken(context); return response ? null : context.data.adminUser; } catch { return null; }
}
function safeCertificate(item){
  if(!item || typeof item!=='object') return null;
  const { recipientEmail, recipientPhone, ...publicItem }=item;
  return publicItem;
}

async function publicBundle(context,admin){
  const marks=BUNDLE_COLLECTIONS.map(()=>'?').join(',');
  const rows=await context.env.DB.prepare(`SELECT collection_name,doc_id,data_json,is_published FROM website_cms_documents WHERE collection_name IN (${marks}) ORDER BY collection_name,updated_at DESC`).bind(...BUNDLE_COLLECTIONS).all();
  const deleted=await context.env.DB.prepare(`SELECT collection_name,doc_id FROM website_cms_deleted WHERE collection_name IN (${marks})`).bind(...BUNDLE_COLLECTIONS).all();
  const initialized=await context.env.DB.prepare(`SELECT collection_name FROM website_cms_collections WHERE collection_name IN (${marks})`).bind(...BUNDLE_COLLECTIONS).all();
  const initSet=new Set((initialized.results||[]).map(r=>r.collection_name));
  const deletedMap=new Map();
  for(const row of deleted.results||[]){if(!deletedMap.has(row.collection_name))deletedMap.set(row.collection_name,[]);deletedMap.get(row.collection_name).push(row.doc_id)}
  const collections=Object.fromEntries(BUNDLE_COLLECTIONS.map(name=>[name,{items:[],initialized:initSet.has(name),excludedIds:[...(deletedMap.get(name)||[])]}]));
  for(const row of rows.results||[]){
    const bucket=collections[row.collection_name]; if(!bucket)continue;
    bucket.initialized=true;
    const isVisible=admin || ALWAYS_PUBLIC.has(row.collection_name) || Number(row.is_published)===1;
    if(isVisible) bucket.items.push(JSON.parse(row.data_json));
    else bucket.excludedIds.push(row.doc_id);
  }
  return collections;
}

export async function onRequestGet(context){
  try{
    await ensureSchema(context);
    const u=new URL(context.request.url);
    const admin=await optionalAdmin(context);
    if(u.searchParams.get('bundle')==='public'){
      const collections=await publicBundle(context,admin);
      return json({ok:true,collections},{headers:{'cache-control':admin?'no-store':'public, max-age=30, s-maxage=120, stale-while-revalidate=600'}});
    }
    const collection=safeName(u.searchParams.get('collection')); const id=safeName(u.searchParams.get('id'));
    if(!collection || !PUBLIC_COLLECTIONS.has(collection)) return json({ok:false,error:'Yêu cầu dữ liệu không hợp lệ.'},{status:400});
    if(id){
      const row=await context.env.DB.prepare('SELECT data_json,is_published FROM website_cms_documents WHERE collection_name=? AND doc_id=?').bind(collection,id).first();
      if(!row) return json({ok:true,item:null},{headers:{'cache-control':admin?'no-store':'public, max-age=20, s-maxage=60'}});
      if(!admin && !ALWAYS_PUBLIC.has(collection) && Number(row.is_published)!==1) return json({ok:true,item:null},{headers:{'cache-control':'public, max-age=20, s-maxage=60'}});
      let item=JSON.parse(row.data_json);
      if(!admin && collection==='certificates') item=safeCertificate(item);
      return json({ok:true,item},{headers:{'cache-control':admin?'no-store':'public, max-age=20, s-maxage=60, stale-while-revalidate=300'}});
    }
    if(!admin && collection==='certificates') return json({ok:true,initialized:true,excludedIds:[],items:[]},{headers:{'cache-control':'public, max-age=60, s-maxage=300'}});
    const q=!admin && !ALWAYS_PUBLIC.has(collection)
      ? context.env.DB.prepare('SELECT data_json FROM website_cms_documents WHERE collection_name=? AND is_published=1 ORDER BY updated_at DESC').bind(collection)
      : context.env.DB.prepare('SELECT data_json FROM website_cms_documents WHERE collection_name=? ORDER BY updated_at DESC').bind(collection);
    const rows=await q.all();
    const initialized=Boolean(await context.env.DB.prepare('SELECT collection_name FROM website_cms_collections WHERE collection_name=?').bind(collection).first())||Boolean(await context.env.DB.prepare('SELECT doc_id FROM website_cms_documents WHERE collection_name=? LIMIT 1').bind(collection).first());
    const removed=await context.env.DB.prepare('SELECT doc_id FROM website_cms_deleted WHERE collection_name=?').bind(collection).all();
    const hidden=!admin&&!ALWAYS_PUBLIC.has(collection)?await context.env.DB.prepare('SELECT doc_id FROM website_cms_documents WHERE collection_name=? AND is_published=0').bind(collection).all():{results:[]};
    return json({ok:true,initialized,excludedIds:[...removed.results,...hidden.results].map(row=>row.doc_id),items:(rows.results||[]).map(r=>JSON.parse(r.data_json))},{headers:{'cache-control':admin?'no-store':'public, max-age=30, s-maxage=120, stale-while-revalidate=600'}});
  }catch(e){ return json({ok:false,error:'Không thể tải dữ liệu website.'},{status:500}); }
}
export async function onRequestPut(context){
  const denied=await requireAdminToken(context); if(denied)return denied; const access={admin:{uid:context.data.adminUser.uid}};
  try{
    await ensureSchema(context); const body=await context.request.json(); const collection=safeName(body?.collection); const id=safeName(body?.id); const data=body?.data;
    if(!collection||!id||!PUBLIC_COLLECTIONS.has(collection)||!data||typeof data!=='object'||Array.isArray(data)) return json({ok:false,error:'Dữ liệu lưu không hợp lệ.'},{status:400});
    const now=new Date().toISOString(); const merged={...data,id,_syncedAt:now}; const pub=publishedFlag(collection,merged);
    await context.env.DB.batch([context.env.DB.prepare(`INSERT INTO website_cms_documents(collection_name,doc_id,data_json,is_published,updated_at,updated_by)
      VALUES(?,?,?,?,?,?) ON CONFLICT(collection_name,doc_id) DO UPDATE SET data_json=excluded.data_json,is_published=excluded.is_published,updated_at=excluded.updated_at,updated_by=excluded.updated_by`)
      .bind(collection,id,JSON.stringify(merged),pub,now,access.admin.uid),
    context.env.DB.prepare('INSERT OR IGNORE INTO website_cms_collections(collection_name,initialized_at) VALUES(?,?)').bind(collection,now),
    context.env.DB.prepare('DELETE FROM website_cms_deleted WHERE collection_name=? AND doc_id=?').bind(collection,id)]);
    return json({ok:true,item:merged,published:Boolean(pub)});
  }catch(e){ return json({ok:false,error:'Không thể lưu dữ liệu website.'},{status:500}); }
}
export async function onRequestDelete(context){
  const denied=await requireAdminToken(context); if(denied)return denied; const access={admin:{uid:context.data.adminUser.uid}};
  try{ await ensureSchema(context); const u=new URL(context.request.url); const collection=safeName(u.searchParams.get('collection')); const id=safeName(u.searchParams.get('id'));
    if(!collection||!id||!PUBLIC_COLLECTIONS.has(collection)) return json({ok:false,error:'Yêu cầu xóa không hợp lệ.'},{status:400});
    await context.env.DB.batch([context.env.DB.prepare('INSERT OR REPLACE INTO website_cms_deleted(collection_name,doc_id,deleted_at) VALUES(?,?,?)').bind(collection,id,new Date().toISOString()),context.env.DB.prepare('INSERT OR IGNORE INTO website_cms_collections(collection_name,initialized_at) VALUES(?,?)').bind(collection,new Date().toISOString()),context.env.DB.prepare('DELETE FROM website_cms_documents WHERE collection_name=? AND doc_id=?').bind(collection,id)]); return json({ok:true});
  }catch{return json({ok:false,error:'Không thể xóa dữ liệu.'},{status:500});}
}
