import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, UserRound, X } from 'lucide-react';
import { AdminUser } from '../../types';
import { createInitialAdminAccount, signInWithEmailPasswordReal, logoutFirebase } from '../../lib/firebaseAuth';

interface Props { adminUsers: AdminUser[]; addAdminUser:(u:AdminUser)=>void; onLoginSuccess:(u:AdminUser)=>void; onNavigateHome:()=>void; onShowToast:(m:string)=>void; }
export const AdminLogin: React.FC<Props> = ({adminUsers,addAdminUser,onLoginSuccess,onNavigateHome,onShowToast}) => {
 const firstSetup=adminUsers.length===0;
 const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [confirmPassword,setConfirmPassword]=useState(''); const [loading,setLoading]=useState(false); const [error,setError]=useState(''); const [forgot,setForgot]=useState(false);
 const startSession=(u:AdminUser)=>{localStorage.setItem('sfn_admin_session',JSON.stringify(u));onLoginSuccess(u)};
 const submit=async(e:React.FormEvent)=>{e.preventDefault();setLoading(true);setError('');try{
   if(firstSetup){
     if(password.length<6) throw new Error('Mật khẩu phải có ít nhất 6 ký tự.');
     if(password!==confirmPassword) throw new Error('Mật khẩu xác nhận không khớp.');
     const fb=await createInitialAdminAccount(email,password,name);
     const u:AdminUser={id:fb.uid,name:name.trim()||email.split('@')[0],email:(fb.email||email).toLowerCase().trim(),role:'developer',status:'active',createdAt:new Date().toISOString(),lastLogin:new Date().toISOString()};
     addAdminUser(u); startSession(u); onShowToast('Đã khởi tạo tài khoản quản trị đầu tiên.');
   } else {
     const fb=await signInWithEmailPasswordReal(email,password); const em=(fb.email||'').toLowerCase().trim(); const matched=adminUsers.find(u=>u.email.toLowerCase().trim()===em&&u.status==='active');
     if(!matched){await logoutFirebase();throw new Error('Tài khoản này chưa được cấp quyền quản trị website Sky First Network.');}
     const u={...matched,lastLogin:new Date().toISOString()}; startSession(u); onShowToast('Đăng nhập quản trị thành công.');
   }
 }catch(err:any){const code=err?.code||'';setError(code==='auth/invalid-credential'?'Email hoặc mật khẩu không chính xác.':code==='auth/email-already-in-use'?'Email này đã có tài khoản Firebase.':err.message||'Không thể thực hiện yêu cầu.');}finally{setLoading(false)}};
 return <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4"><div className="w-full max-w-md"><div className="bg-white border border-slate-200 rounded-3xl shadow-xl p-8">
  <div className="flex justify-center mb-5"><img src="/brand/sky-first-network-web.png" className="h-20 w-auto object-contain" alt="Sky First Network"/></div>
  <h1 className="text-2xl font-black text-center text-slate-900">{firstSetup?'Khởi tạo tài khoản quản trị':'Đăng nhập quản trị'}</h1><p className="text-sm text-slate-500 text-center mt-2 mb-6">{firstSetup?'Thiết lập tài khoản đầu tiên cho website Sky First Network':'Sky First Network'}</p>
  {error&&<div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}
  <form onSubmit={submit} className="space-y-4">{firstSetup&&<label className="block text-sm font-semibold">Họ và tên<div className="mt-1 flex items-center border rounded-xl px-3"><UserRound size={17} className="text-slate-400"/><input value={name} onChange={e=>setName(e.target.value)} required className="w-full p-3 outline-none" placeholder="Tên quản trị viên"/></div></label>}<label className="block text-sm font-semibold">Email<div className="mt-1 flex items-center border rounded-xl px-3"><Mail size={17} className="text-slate-400"/><input value={email} onChange={e=>setEmail(e.target.value)} type="email" required className="w-full p-3 outline-none" placeholder="email@example.com"/></div></label><label className="block text-sm font-semibold">Mật khẩu<div className="mt-1 flex items-center border rounded-xl px-3"><Lock size={17} className="text-slate-400"/><input value={password} onChange={e=>setPassword(e.target.value)} type="password" required className="w-full p-3 outline-none"/></div></label>{firstSetup&&<label className="block text-sm font-semibold">Xác nhận mật khẩu<div className="mt-1 flex items-center border rounded-xl px-3"><Lock size={17} className="text-slate-400"/><input value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} type="password" required className="w-full p-3 outline-none"/></div></label>}<button disabled={loading} className="w-full rounded-xl bg-[#0F2B5B] text-white py-3 font-bold">{loading?'Đang xử lý...':firstSetup?'Khởi tạo tài khoản':'Đăng nhập'}</button></form>
  {!firstSetup&&<button onClick={()=>setForgot(true)} className="w-full mt-3 text-sm font-semibold text-sky-700">Quên mật khẩu?</button>}
 </div><button onClick={onNavigateHome} className="mx-auto mt-5 flex items-center gap-2 text-sm text-slate-500"><ArrowLeft size={15}/>Quay lại website</button>
 {forgot&&<div className="fixed inset-0 bg-slate-950/50 flex items-center justify-center p-4 z-50"><div className="bg-white max-w-md rounded-2xl p-6 relative"><button onClick={()=>setForgot(false)} className="absolute right-4 top-4"><X size={18}/></button><h2 className="text-xl font-black mb-3">Quên mật khẩu?</h2><p className="text-sm text-slate-600 leading-6">Vui lòng liên hệ Sky First Network để được xác minh và hỗ trợ tài khoản quản trị.</p><div className="mt-4 text-sm"><b>Email hỗ trợ:</b> hotro.sfn@gmail.com<br/><b>Zalo:</b> 0924 910 210</div><button onClick={()=>setForgot(false)} className="mt-5 w-full rounded-xl bg-[#0F2B5B] text-white py-2.5 font-bold">Đóng</button></div></div>}
 </div></div>
}
