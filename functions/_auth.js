export function json(data, init = {}) { const headers=new Headers(init.headers||{});headers.set('content-type','application/json; charset=utf-8');headers.set('cache-control','no-store');return new Response(JSON.stringify(data),{...init,headers}); }

export async function ensureAdminSchema(context) {
  await context.env.DB.prepare(`CREATE TABLE IF NOT EXISTS website_admin_users (
    uid TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'editor', status TEXT NOT NULL DEFAULT 'active',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, last_login TEXT
  )`).run();
  await context.env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_website_admin_users_email ON website_admin_users(email)').run();
}

export async function verifyFirebaseUser(context) {
  const header = context.request.headers.get('authorization') || '';
  const idToken = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  if (!idToken) return null;
  const apiKey = context.env.FIREBASE_API_KEY || 'AIzaSyCnsxTv6kDiIp_5KIUlnPcJznnZxYFvN9U';
  try {
    const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`, {
      method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({idToken})
    });
    if (!r.ok) return null;
    const data = await r.json(); const u = data?.users?.[0];
    if (!u?.localId) return null;
    return { uid:u.localId, email:String(u.email||'').toLowerCase(), idToken };
  } catch { return null; }
}

export async function requireAdminToken(context) {
  try { await ensureAdminSchema(context); } catch { return json({ok:false,error:'Dịch vụ quản trị chưa sẵn sàng.'},{status:503}); }
  const user = await verifyFirebaseUser(context);
  if (!user) return json({ok:false,error:'Phiên quản trị không hợp lệ.'},{status:401});
  try {
    const row = await context.env.DB.prepare("SELECT uid,email,name,role,status,created_at,last_login FROM website_admin_users WHERE uid=? AND status='active' LIMIT 1").bind(user.uid).first();
    if (!row || !['developer','admin','editor'].includes(row.role)) return json({ok:false,error:'Tài khoản không có quyền quản trị.'},{status:403});
    context.data.adminUser = row;
    return null;
  } catch { return json({ok:false,error:'Không thể xác minh quyền quản trị.'},{status:503}); }
}
