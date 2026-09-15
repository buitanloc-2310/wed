export function json(data, init = {}) { const headers=new Headers(init.headers||{});headers.set('content-type','application/json; charset=utf-8');headers.set('cache-control','no-store');return new Response(JSON.stringify(data),{...init,headers}); }

export const ROOT_OWNER_EMAIL = 'skyfirst.ec@gmail.com';

export async function ensureAdminSchema(context) {
  if (!context.env.DB) throw new Error('D1 binding DB is missing');
  await context.env.DB.prepare(`CREATE TABLE IF NOT EXISTS website_admin_users (
    uid TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'editor', status TEXT NOT NULL DEFAULT 'active',
    is_root_owner INTEGER NOT NULL DEFAULT 0, note TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, last_login TEXT
  )`).run();
  const cols = await context.env.DB.prepare('PRAGMA table_info(website_admin_users)').all();
  const names=new Set((cols.results||[]).map(x=>x.name));
  if(!names.has('is_root_owner')) await context.env.DB.prepare('ALTER TABLE website_admin_users ADD COLUMN is_root_owner INTEGER NOT NULL DEFAULT 0').run();
  if(!names.has('note')) await context.env.DB.prepare("ALTER TABLE website_admin_users ADD COLUMN note TEXT NOT NULL DEFAULT ''").run();
  await context.env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_website_admin_users_email ON website_admin_users(email)').run();
  await context.env.DB.prepare(`CREATE TABLE IF NOT EXISTS website_admin_audit(
    id INTEGER PRIMARY KEY AUTOINCREMENT, actor_uid TEXT NOT NULL, target_uid TEXT,
    action TEXT NOT NULL, detail TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`).run();
  // Root ownership is anchored server-side and cannot be delegated by client input.
  await context.env.DB.prepare("UPDATE website_admin_users SET is_root_owner=1, role='developer', status='active' WHERE lower(email)=?").bind(ROOT_OWNER_EMAIL).run();
  await context.env.DB.prepare("UPDATE website_admin_users SET is_root_owner=0 WHERE lower(email)<>? AND is_root_owner<>0").bind(ROOT_OWNER_EMAIL).run();
}

export async function verifyFirebaseUser(context) {
  const header=context.request.headers.get('authorization')||'';
  const idToken=header.startsWith('Bearer ')?header.slice(7).trim():'';
  if(!idToken)return null;
  const apiKey=context.env.FIREBASE_API_KEY||'AIzaSyCnsxTv6kDiIp_5KIUlnPcJznnZxYFvN9U';
  try{
    const r=await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({idToken})});
    if(!r.ok)return null; const d=await r.json(); const u=d?.users?.[0]; if(!u?.localId)return null;
    return {uid:u.localId,email:String(u.email||'').trim().toLowerCase(),idToken};
  }catch{return null}
}

async function resolveAdmin(context,user){
  let row=await context.env.DB.prepare('SELECT uid,email,name,role,status,is_root_owner,note,created_at,last_login FROM website_admin_users WHERE uid=? LIMIT 1').bind(user.uid).first();
  // The established Root Owner can recover its D1 profile from a valid Firebase login.
  // This avoids lockout if an earlier deployment created Auth successfully but failed to persist D1.
  if(user.email===ROOT_OWNER_EMAIL){
    if(!row){
      const byEmail=await context.env.DB.prepare('SELECT uid FROM website_admin_users WHERE lower(email)=? LIMIT 1').bind(ROOT_OWNER_EMAIL).first();
      if(byEmail && byEmail.uid!==user.uid){
        await context.env.DB.prepare('DELETE FROM website_admin_users WHERE uid=?').bind(byEmail.uid).run();
      }
      await context.env.DB.prepare(`INSERT INTO website_admin_users(uid,email,name,role,status,is_root_owner,note,created_at,last_login)
        VALUES(?,?,?,'developer','active',1,'',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`)
        .bind(user.uid,ROOT_OWNER_EMAIL,'Sky First System Owner').run();
    }else{
      await context.env.DB.prepare("UPDATE website_admin_users SET email=?,role='developer',status='active',is_root_owner=1,last_login=CURRENT_TIMESTAMP WHERE uid=?").bind(ROOT_OWNER_EMAIL,user.uid).run();
    }
    await context.env.DB.prepare('UPDATE website_admin_users SET is_root_owner=0 WHERE uid<>? AND is_root_owner<>0').bind(user.uid).run();
    row=await context.env.DB.prepare('SELECT uid,email,name,role,status,is_root_owner,note,created_at,last_login FROM website_admin_users WHERE uid=? LIMIT 1').bind(user.uid).first();
  }
  return row;
}

export async function requireAdminToken(context) {
  try{await ensureAdminSchema(context)}catch(e){return json({ok:false,error:'Cơ sở dữ liệu quản trị chưa sẵn sàng.',code:'ADMIN_DB_UNAVAILABLE'},{status:503})}
  const user=await verifyFirebaseUser(context); if(!user)return json({ok:false,error:'Phiên quản trị không hợp lệ.',code:'AUTH_INVALID'},{status:401});
  try{
    const row=await resolveAdmin(context,user);
    if(!row||!['developer','admin','editor'].includes(row.role)||row.status!=='active')return json({ok:false,error:'Tài khoản không có quyền quản trị.',code:'ADMIN_FORBIDDEN'},{status:403});
    context.data=context.data||{}; context.data.adminUser=row; context.data.firebaseUser=user; return null;
  }catch(e){return json({ok:false,error:'Không thể xác minh quyền quản trị.',code:'ADMIN_LOOKUP_FAILED'},{status:503})}
}
