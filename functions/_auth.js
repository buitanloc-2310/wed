export async function requireAdminToken(context) {
  const header = context.request.headers.get('authorization') || '';
  const idToken = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  if (!idToken) return json({ ok:false, error:'Phiên quản trị không hợp lệ.' }, { status:401 });
  try {
    const payload = JSON.parse(atob(idToken.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));
    const uid = payload.user_id || payload.sub;
    if (!uid) throw new Error('missing uid');
    const projectId = context.env.FIREBASE_PROJECT_ID || 'skyfirstnetwork';
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/admin_users/${encodeURIComponent(uid)}`;
    const r = await fetch(url, { headers:{ authorization:`Bearer ${idToken}` } });
    if (!r.ok) return json({ ok:false, error:'Tài khoản không có quyền quản trị.' }, { status:403 });
    const doc = await r.json(); const fields = doc.fields || {};
    const status = fields.status?.stringValue; const role = fields.role?.stringValue;
    if (status !== 'active' || !['developer','admin','editor'].includes(role)) return json({ok:false,error:'Tài khoản không có quyền quản trị.'},{status:403});
    return null;
  } catch { return json({ ok:false, error:'Không thể xác minh phiên quản trị.' }, { status:401 }); }
}
export function json(data, init = {}) { const headers=new Headers(init.headers||{});headers.set('content-type','application/json; charset=utf-8');headers.set('cache-control','no-store');return new Response(JSON.stringify(data),{...init,headers}); }
