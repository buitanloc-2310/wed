import { requireAdminToken, json } from '../../_auth.js';
async function ensure(context){
  await context.env.DB.prepare(`CREATE TABLE IF NOT EXISTS website_admin_records(
    id TEXT PRIMARY KEY, kind TEXT NOT NULL, title TEXT NOT NULL,
    payload TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`).run();
  await context.env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_website_admin_records_kind ON website_admin_records(kind,updated_at DESC)').run();
}
function parsePayload(v){try{return JSON.parse(v||'{}')}catch{return {}}}
export async function onRequestGet(context){try{const denied=await requireAdminToken(context);if(denied)return denied;await ensure(context);const kind=new URL(context.request.url).searchParams.get('kind')||'';const r=await context.env.DB.prepare('SELECT id,kind,title,payload,created_at,updated_at FROM website_admin_records WHERE kind=? ORDER BY updated_at DESC').bind(kind).all();return json({ok:true,items:(r.results||[]).map(x=>({...x,...parsePayload(x.payload)}))})}catch(e){return json({ok:false,error:'Không thể tải dữ liệu quản trị.',code:'ADMIN_RECORDS_READ_FAILED'},{status:500})}}
export async function onRequestPost(context){try{const denied=await requireAdminToken(context);if(denied)return denied;await ensure(context);const b=await context.request.json().catch(()=>({}));if(!b?.id||!b?.kind||!b?.title)return json({ok:false,error:'Thiếu dữ liệu bắt buộc.'},{status:400});const {id,kind,title,...payload}=b;await context.env.DB.prepare("INSERT INTO website_admin_records(id,kind,title,payload,updated_at) VALUES(?,?,?,?,CURRENT_TIMESTAMP) ON CONFLICT(id) DO UPDATE SET kind=excluded.kind,title=excluded.title,payload=excluded.payload,updated_at=CURRENT_TIMESTAMP").bind(id,kind,title,JSON.stringify(payload)).run();return json({ok:true})}catch(e){return json({ok:false,error:'Không thể lưu dữ liệu quản trị.',code:'ADMIN_RECORDS_WRITE_FAILED'},{status:500})}}
export async function onRequestDelete(context){try{const denied=await requireAdminToken(context);if(denied)return denied;await ensure(context);const b=await context.request.json().catch(()=>({}));await context.env.DB.prepare('DELETE FROM website_admin_records WHERE id=?').bind(b?.id||'').run();return json({ok:true})}catch(e){return json({ok:false,error:'Không thể xóa dữ liệu quản trị.',code:'ADMIN_RECORDS_DELETE_FAILED'},{status:500})}}
