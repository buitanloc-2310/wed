export const json = (data, status = 200, extra = {}) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...extra } });
export const redirect = (to, status = 303) => new Response(null, { status, headers: { location: to } });
export const html = (content, status = 200, headers = {}) => new Response(content, { status, headers: { 'content-type': 'text/html; charset=utf-8', 'x-content-type-options': 'nosniff', 'referrer-policy': 'strict-origin-when-cross-origin', 'permissions-policy': 'camera=(), microphone=(), geolocation=()', ...headers } });
export const text = (content, status = 200) => new Response(content, { status, headers: { 'content-type': 'text/plain; charset=utf-8' } });
export const parseForm = async request => Object.fromEntries((await request.formData()).entries());
export const readCookie = (request, name) => Object.fromEntries((request.headers.get('cookie') || '').split(';').map(x => x.trim().split('=').map(decodeURIComponent)).filter(x => x.length === 2))[name] || '';
export const cookie = (name, value, maxAge = 0) => `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Secure${maxAge ? `; Max-Age=${maxAge}` : ''}`;
export const origin = request => new URL(request.url).origin;
