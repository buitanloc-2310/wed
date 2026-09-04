export async function adminCount(env){return Number((await env.DB.prepare('SELECT COUNT(*) c FROM site_admins').first()).c||0)}
export async function adminByEmail(env,email){return env.DB.prepare('SELECT * FROM site_admins WHERE email=? COLLATE NOCASE AND active=1').bind(email).first()}
