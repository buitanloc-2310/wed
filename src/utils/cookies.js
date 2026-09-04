export function parseCookies(request){const raw=request.headers.get('cookie')||'';const out={};for(const part of raw.split(';')){const i=part.indexOf('=');if(i>0)out[part.slice(0,i).trim()]=decodeURIComponent(part.slice(i+1).trim())}return out}
export function sessionCookie(name,value,maxAge){return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`}
export function clearCookie(name){return `${name}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`}
