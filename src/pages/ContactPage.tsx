import React,{useState} from 'react';
import {Mail,Phone,Send,Loader2,ShieldCheck} from 'lucide-react';
import {PageRoute} from '../types';
import {useDataContext} from '../context/DataContext';
import {RichTextRenderer} from '../components/RichTextRenderer';

interface ContactPageProps{onNavigate:(page:PageRoute)=>void;onShowToast:(msg:string)=>void;}

export const ContactPage:React.FC<ContactPageProps>=({onShowToast})=>{
  const {siteConfig,customPages}=useDataContext();
  const p=customPages.find(x=>x.slug==='contact'||x.id==='page-contact');
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [topic,setTopic]=useState('Liên hệ chung');
  const [message,setMessage]=useState('');
  const [sending,setSending]=useState(false);
  const contacts=siteConfig.footerContacts||[];

  const submit=async(e:React.FormEvent)=>{
    e.preventDefault(); setSending(true);
    try{
      const r=await fetch('/api/contact',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name,email,topic,message})});
      const d=await r.json().catch(()=>({}));
      if(!r.ok||!d?.ok) throw new Error(d?.error||'Không thể gửi thông tin.');
      setName('');setEmail('');setTopic('Liên hệ chung');setMessage('');
      onShowToast(d?.message||'Thông tin của bạn đã được tiếp nhận.');
    }catch(err:any){onShowToast(err?.message||'Không thể gửi thông tin. Vui lòng dùng email hỗ trợ.');}
    finally{setSending(false);}
  };

  return <main className="bg-white">
    <section className="bg-[#071B3A] text-white py-14 sm:py-20"><div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"><div className="text-xs uppercase tracking-[.18em] text-sky-200 font-black">{p?.badge||'Liên hệ'}</div><h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-.045em]">{p?.title||'Liên hệ'}</h1><p className="mt-5 max-w-3xl text-slate-300 leading-7 sm:leading-8">{p?.summary||''}</p></div></section>
    <section className="py-12 lg:py-20"><div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">{(p?.contentFormatted||p?.content)&&<div className="mb-10"><RichTextRenderer content={p?.contentFormatted||p?.content||''}/></div>}<div className="grid lg:grid-cols-[.9fr_1.1fr] gap-8"><div className="space-y-4">{contacts.filter((x:any)=>x.url?.startsWith('mailto:')||x.url?.startsWith('tel:')).map((x:any)=>{const Icon=x.url.startsWith('tel:')?Phone:Mail;return <a key={x.label+x.url} href={x.url} className="flex items-center gap-4 rounded-2xl border border-slate-200 p-5 hover:border-sky-300 hover:bg-sky-50/40 transition"><div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0B5FB4] grid place-items-center"><Icon size={19}/></div><div className="min-w-0"><div className="text-xs text-slate-400">{x.label}</div><div className="font-bold mt-1 break-all">{x.value}</div></div></a>})}<div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs leading-5 text-emerald-800 flex gap-2"><ShieldCheck size={17} className="shrink-0 mt-0.5"/><span>Sky First Network không yêu cầu mật khẩu, mã OTP hoặc thông tin nhạy cảm qua email/tin nhắn.</span></div></div>
      <form onSubmit={submit} className="rounded-[28px] border border-slate-200 p-5 sm:p-7 space-y-5 shadow-sm"><div><h2 className="text-2xl sm:text-3xl font-black">{p?.contactFormTitle||'Gửi thông tin liên hệ'}</h2><p className="mt-2 text-sm text-slate-500">{p?.contactFormDescription||'Chọn nhu cầu phù hợp để thông tin được tiếp nhận đúng hướng.'}</p></div><label className="block text-sm font-bold">Họ và tên<input value={name} onChange={e=>setName(e.target.value)} required maxLength={100} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-500"/></label><label className="block text-sm font-bold">Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required maxLength={180} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-500"/></label><label className="block text-sm font-bold">Nhu cầu<select value={topic} onChange={e=>setTopic(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-500"><option>Liên hệ chung</option><option>Hỗ trợ</option><option>Tham gia</option><option>Hợp tác & Đồng hành</option><option>Vấn đề kỹ thuật</option><option>Giấy chứng nhận</option></select></label><label className="block text-sm font-bold">Nội dung<textarea value={message} onChange={e=>setMessage(e.target.value)} required maxLength={4000} rows={6} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-500"/></label><button disabled={sending} className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#0B5FB4] text-white px-5 py-3 font-bold disabled:opacity-60">{sending?<Loader2 size={17} className="animate-spin"/>:<Send size={17}/>} {sending?'Đang gửi...':(p?.contactSubmitButtonLabel||'Gửi thông tin')}</button></form>
    </div></div></section>
  </main>;
};
