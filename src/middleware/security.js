export const securityHeaders={
  'x-content-type-options':'nosniff','x-frame-options':'DENY','referrer-policy':'strict-origin-when-cross-origin',
  'permissions-policy':'camera=(), microphone=(), geolocation=()',
  'cross-origin-opener-policy':'same-origin',
  'content-security-policy':"default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
};
export function withSecurity(response){const h=new Headers(response.headers);for(const [k,v] of Object.entries(securityHeaders))if(!h.has(k))h.set(k,v);return new Response(response.body,{status:response.status,statusText:response.statusText,headers:h})}
