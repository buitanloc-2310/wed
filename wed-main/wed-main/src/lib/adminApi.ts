import { auth } from './firebase';
export async function adminApi(url:string, init:RequestInit={}) {
  const user=auth?.currentUser; if(!user) throw new Error('Phiên quản trị đã hết hạn. Vui lòng đăng nhập lại.');
  const token=await user.getIdToken(); const headers=new Headers(init.headers||{}); headers.set('authorization',`Bearer ${token}`);
  const r=await fetch(url,{...init,headers,cache:'no-store'});
  const text=await r.text(); let data:any={}; try{data=text?JSON.parse(text):{}}catch{}
  if(!r.ok||data?.ok===false){
    const known=String(data?.error||'').trim();
    if(known) throw new Error(known);
    if(r.status===404) throw new Error('Chức năng này chưa được máy chủ triển khai đúng. Vui lòng cập nhật bản website mới nhất.');
    if(r.status===401) throw new Error('Phiên quản trị đã hết hạn. Vui lòng đăng nhập lại.');
    if(r.status===403) throw new Error('Tài khoản hiện tại không có quyền thực hiện thao tác này.');
    throw new Error(`Máy chủ chưa xử lý được yêu cầu (mã ${r.status}).`);
  }
  return data;
}
