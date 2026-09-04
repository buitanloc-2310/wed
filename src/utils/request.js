export async function bodyJson(request){try{return await request.json()}catch{return {}}}
export function clientIp(request){return request.headers.get('CF-Connecting-IP')||'unknown'}
export function bearer(request){const h=request.headers.get('authorization')||'';return h.toLowerCase().startsWith('bearer ')?h.slice(7).trim():''}
