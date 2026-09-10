export function requireAdminToken(context) {
  const expected = context.env.ADMIN_API_TOKEN;
  if (!expected) {
    return new Response(JSON.stringify({ ok: false, error: 'ADMIN_API_TOKEN chưa được cấu hình trên Cloudflare.' }), {
      status: 503,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
  }
  const supplied = context.request.headers.get('x-admin-token') || '';
  if (supplied !== expected) {
    return new Response(JSON.stringify({ ok: false, error: 'Không có quyền thực hiện thao tác này.' }), {
      status: 401,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
  }
  return null;
}

export function json(data, init = {}) {
  const headers = new Headers(init.headers || {});
  headers.set('content-type', 'application/json; charset=utf-8');
  headers.set('cache-control', 'no-store');
  return new Response(JSON.stringify(data), { ...init, headers });
}
