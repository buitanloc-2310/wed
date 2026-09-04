import { securityHeaders } from '../middleware/security.js';
export function json(data,status=200,extra={}) { return new Response(JSON.stringify(data),{status,headers:{...securityHeaders,'content-type':'application/json; charset=utf-8',...extra}}); }
export function html(body,status=200,extra={}) { return new Response(body,{status,headers:{...securityHeaders,'content-type':'text/html; charset=utf-8',...extra}}); }
export function text(body,status=200,extra={}) { return new Response(body,{status,headers:{...securityHeaders,'content-type':'text/plain; charset=utf-8',...extra}}); }
