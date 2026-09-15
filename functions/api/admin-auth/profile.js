import { json, verifyFirebaseUser, ensureAdminSchema } from '../../_auth.js';
export async function onRequestGet(context){
 try { await ensureAdminSchema(context); } catch { return json({ok:false,error:'Dịch vụ quản trị chưa sẵn sàng.'},{status:503}); }
 const user=await verifyFirebaseUser(context); if(!user)return json({ok:false,error:'Phiên tài khoản không hợp lệ.'},{status:401});
 try{const r=await context.env.DB.prepare('SELECT uid,email,name,role,status,created_at,last_login FROM website_admin_users WHERE uid=? LIMIT 1').bind(user.uid).first();
 if(!r)return json({ok:true,user:null});
 await context.env.DB.prepare('UPDATE website_admin_users SET last_login=CURRENT_TIMESTAMP WHERE uid=?').bind(user.uid).run();
 return json({ok:true,user:{id:r.uid,email:r.email,name:r.name,role:r.role,status:r.status,createdAt:r.created_at,lastLogin:r.last_login}});
 }catch{return json({ok:false,error:'Không thể đọc quyền quản trị.'},{status:503});}
}
