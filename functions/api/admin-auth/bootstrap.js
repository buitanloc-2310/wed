import { json, verifyFirebaseUser, ensureAdminSchema } from '../../_auth.js';
export async function onRequestGet(context){
  try { await ensureAdminSchema(context); const r=await context.env.DB.prepare('SELECT COUNT(*) AS n FROM website_admin_users').first(); return json({ok:true,completed:Number(r?.n||0)>0}); }
  catch { return json({ok:false,error:'Không thể kiểm tra trạng thái quản trị.'},{status:503}); }
}
export async function onRequestPost(context){
  try { await ensureAdminSchema(context); } catch { return json({ok:false,error:'Dịch vụ quản trị chưa sẵn sàng.'},{status:503}); }
  const user=await verifyFirebaseUser(context); if(!user)return json({ok:false,error:'Phiên tài khoản không hợp lệ.'},{status:401});
  try{
    const existing=await context.env.DB.prepare('SELECT uid FROM website_admin_users LIMIT 1').first();
    if(existing)return json({ok:false,error:'Hệ thống đã có tài khoản quản trị.'},{status:409});
    const body=await context.request.json().catch(()=>({})); const now=new Date().toISOString();
    const name=String(body?.name||user.email.split('@')[0]||'Quản trị viên').trim().slice(0,120);
    await context.env.DB.prepare("INSERT INTO website_admin_users(uid,email,name,role,status,created_at,last_login) VALUES(?,?,?,?,?,?,?)")
      .bind(user.uid,user.email,name,'developer','active',now,now).run();
    return json({ok:true,user:{id:user.uid,email:user.email,name,role:'developer',status:'active',createdAt:now,lastLogin:now}});
  }catch(e){return json({ok:false,error:'Không thể hoàn tất khởi tạo quản trị.'},{status:500});}
}
