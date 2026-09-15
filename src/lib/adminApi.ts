import { auth } from './firebase';
export async function adminApi(url:string, init:RequestInit={}) {
  const user=auth?.currentUser; if(!user) throw new Error('Phiên quản trị đã hết hạn. Vui lòng đăng nhập lại.');
  const token=await user.getIdToken(); const headers=new Headers(init.headers||{}); headers.set('authorization',`Bearer ${token}`);
  const r=await fetch(url,{...init,headers,cache:'no-store'}); const data=await r.json().catch(()=>({}));
  if(!r.ok||data?.ok===false) throw new Error(data?.error||'Yêu cầu không thành công.'); return data;
}
