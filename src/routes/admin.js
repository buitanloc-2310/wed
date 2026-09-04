import { html } from '../utils/response.js';import { adminShell } from '../views/admin.js';
export async function adminRoute(request,env,url){if(url.pathname==='/admin'||url.pathname==='/admin/')return html(adminShell(),200,{'cache-control':'no-store'});return null}
