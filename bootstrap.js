import { json, ensureAdminSchema } from '../../_auth.js';

// Bootstrap creation is intentionally disabled from the website. The Root Owner
// is created in Firebase Authentication by the project owner. On first login,
// requireAdminToken() repairs/creates the protected D1 Root Owner profile.
export async function onRequestGet(context){
  try{await ensureAdminSchema(context);const r=await context.env.DB.prepare('SELECT COUNT(*) AS n FROM website_admin_users').first();return json({ok:true,completed:Number(r?.n||0)>0});}
  catch{return json({ok:false,error:'Không thể kiểm tra trạng thái quản trị.'},{status:503});}
}
export async function onRequestPost(){
  return json({ok:false,error:'Khởi tạo tài khoản từ website đã được vô hiệu hóa.'},{status:410});
}
