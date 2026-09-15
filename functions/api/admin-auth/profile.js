import { json, requireAdminToken } from '../../_auth.js';

// Profile uses the exact same server-side authorization path as every protected API.
// This is important for the Root Owner recovery path: a valid Firebase login for
// skyfirst.ec@gmail.com recreates/repairs its D1 profile before the UI is admitted.
export async function onRequestGet(context){
  const denied=await requireAdminToken(context);
  if(denied)return denied;
  const r=context.data.adminUser;
  try{await context.env.DB.prepare('UPDATE website_admin_users SET last_login=CURRENT_TIMESTAMP WHERE uid=?').bind(r.uid).run()}catch{}
  return json({ok:true,user:{
    id:r.uid,email:r.email,name:r.name,role:r.role,status:r.status,
    is_root_owner:Number(r.is_root_owner||0),note:r.note||'',
    createdAt:r.created_at,lastLogin:new Date().toISOString()
  }});
}
