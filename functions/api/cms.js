import { json, requireAdminToken } from '../_auth.js';

const PUBLIC_COLLECTIONS = new Set(['site_config','cms_modules','custom_pages','programs','network_units','news_articles','certificates']);
const ALWAYS_PUBLIC = new Set(['site_config','cms_modules','certificates']);

async function ensureSchema(context){
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
  try { const response=await requireAdminToken(context); return response ? null : context.data.adminUser; } catch { return null; }
}
export async function onRequestGet(context){
  try{
    await ensureSchema(context);
    const u=new URL(context.request.url); const collection=safeName(u.searchParams.get('collection')); const id=safeName(u.searchParams.get('id'));
    if(!collection || !PUBLIC_COLLECTIONS.has(collection)) return json({ok:false,error:'Yêu cầu dữ liệu không hợp lệ.'},{status:400});
    const admin=await optionalAdmin(context);
    if(id){
      const row=await context.env.DB.prepare('SELECT data_json,is_published FROM website_cms_documents WHERE collection_name=? AND doc_id=?').bind(collection,id).first();
      if(!row) return json({ok:true,item:null});
      if(!admin && !ALWAYS_PUBLIC.has(collection) && Number(row.is_published)!==1) return json({ok:true,item:null});
      return json({ok:true,item:JSON.parse(row.data_json)});
    }
    const q=!admin && !ALWAYS_PUBLIC.has(collection)
      ? context.env.DB.prepare('SELECT data_json FROM website_cms_documents WHERE collection_name=? AND is_published=1 ORDER BY updated_at DESC').bind(collection)
      : context.env.DB.prepare('SELECT data_json FROM website_cms_documents WHERE collection_name=? ORDER BY updated_at DESC').bind(collection);
    const rows=await q.all();
    return json({ok:true,items:(rows.results||[]).map(r=>JSON.parse(r.data_json))});
  }catch(e){ return json({ok:false,error:'Không thể tải dữ liệu website.'},{status:500}); }
}
export async function onRequestPut(context){
  const denied=await requireAdminToken(context); if(denied)return denied; const access={admin:{uid:context.data.adminUser.uid}};
  try{
    await ensureSchema(context); const body=await context.request.json(); const collection=safeName(body?.collection); const id=safeName(body?.id); const data=body?.data;
    if(!collection||!id||!PUBLIC_COLLECTIONS.has(collection)||!data||typeof data!=='object') return json({ok:false,error:'Dữ liệu lưu không hợp lệ.'},{status:400});
    const now=new Date().toISOString(); const merged={...data,id:data.id||id,_syncedAt:now}; const pub=publishedFlag(collection,merged);
    await context.env.DB.prepare(`INSERT INTO website_cms_documents(collection_name,doc_id,data_json,is_published,updated_at,updated_by)
      VALUES(?,?,?,?,?,?) ON CONFLICT(collection_name,doc_id) DO UPDATE SET data_json=excluded.data_json,is_published=excluded.is_published,updated_at=excluded.updated_at,updated_by=excluded.updated_by`)
      .bind(collection,id,JSON.stringify(merged),pub,now,access.admin.uid).run();
    return json({ok:true,item:merged,published:Boolean(pub)});
  }catch(e){ return json({ok:false,error:'Không thể lưu dữ liệu website.'},{status:500}); }
}
export async function onRequestDelete(context){
  const denied=await requireAdminToken(context); if(denied)return denied; const access={admin:{uid:context.data.adminUser.uid}};
  try{ await ensureSchema(context); const u=new URL(context.request.url); const collection=safeName(u.searchParams.get('collection')); const id=safeName(u.searchParams.get('id'));
    if(!collection||!id||!PUBLIC_COLLECTIONS.has(collection)) return json({ok:false,error:'Yêu cầu xóa không hợp lệ.'},{status:400});
    await context.env.DB.prepare('DELETE FROM website_cms_documents WHERE collection_name=? AND doc_id=?').bind(collection,id).run(); return json({ok:true});
  }catch{return json({ok:false,error:'Không thể xóa dữ liệu.'},{status:500});}
}
