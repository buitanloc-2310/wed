import React, { useState } from 'react';
import { Mail, Phone, Send, Facebook, Instagram, MessageCircle } from 'lucide-react';
import { PageRoute } from '../types';
import { useDataContext } from '../context/DataContext';

interface ContactPageProps { onNavigate: (page: PageRoute) => void; onShowToast: (msg: string) => void; }

export const ContactPage: React.FC<ContactPageProps> = ({ onShowToast }) => {
  const { siteConfig } = useDataContext();
  const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [message,setMessage]=useState('');
  const submit=(e:React.FormEvent)=>{e.preventDefault();onShowToast('Thông tin đã được ghi nhận trên giao diện. Vui lòng sử dụng email hoặc số điện thoại chính thức để liên hệ.');};
  const contacts=[
    ['Email liên hệ chính','skyfirst.ec@gmail.com'],
    ['Email Nhân sự','nhansu.sfn@gmail.com'],
    ['Email Hỗ trợ','hotro.sfn@gmail.com'],
    ['Email Hợp tác','hoptac.sfn@gmail.com'],
    ['Email Truyền thông','truyenthong.sfn@gmail.com'],
  ];
  return <main className="bg-white">
    <section className="bg-[#071B3A] text-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"><div className="text-xs uppercase tracking-[.18em] text-sky-200 font-black">Liên hệ</div><h1 className="mt-4 text-5xl lg:text-6xl font-black tracking-[-.045em]">Kết nối với Sky First Network</h1><p className="mt-5 max-w-3xl text-slate-300 leading-8">Sử dụng các kênh chính thức dưới đây cho nhu cầu liên hệ chung, nhân sự, hỗ trợ, hợp tác hoặc truyền thông.</p></div>
    </section>
    <section className="py-16 lg:py-20"><div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[.9fr_1.1fr] gap-8">
      <div className="space-y-4">
        {contacts.map(([label,value])=><a key={label} href={`mailto:${value}`} className="flex items-center gap-4 rounded-2xl border border-slate-200 p-5 hover:border-sky-300"><div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0B5FB4] grid place-items-center"><Mail size={19}/></div><div><div className="text-xs text-slate-400">{label}</div><div className="font-bold mt-1">{value}</div></div></a>)}
        <a href="tel:0924910210" className="flex items-center gap-4 rounded-2xl border border-slate-200 p-5"><div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0B5FB4] grid place-items-center"><Phone size={19}/></div><div><div className="text-xs text-slate-400">Điện thoại liên hệ / Zalo</div><div className="font-bold mt-1">0924 910 210</div></div></a>
        <div className="flex gap-3 pt-2">
          <a aria-label="Facebook" href="https://facebook.com/skyfirstnetwork" target="_blank" rel="noreferrer" className="w-11 h-11 rounded-xl border border-slate-200 grid place-items-center"><Facebook size={19}/></a>
          <a aria-label="Instagram" href="https://instagram.com/sfn.network" target="_blank" rel="noreferrer" className="w-11 h-11 rounded-xl border border-slate-200 grid place-items-center"><Instagram size={19}/></a>
          <a aria-label="Zalo" href="https://zalo.me/0924910210" target="_blank" rel="noreferrer" className="w-11 h-11 rounded-xl border border-slate-200 grid place-items-center"><MessageCircle size={19}/></a>
        </div>
      </div>
      <form onSubmit={submit} className="rounded-[28px] border border-slate-200 p-7 space-y-5">
        <div><h2 className="text-3xl font-black">Gửi thông tin liên hệ</h2><p className="mt-2 text-sm text-slate-500">Biểu mẫu này không tự cam kết thời gian phản hồi. Bạn có thể gửi trực tiếp tới email phù hợp ở bên cạnh.</p></div>
        <label className="block text-sm font-bold">Họ và tên<input value={name} onChange={e=>setName(e.target.value)} required className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"/></label>
        <label className="block text-sm font-bold">Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"/></label>
        <label className="block text-sm font-bold">Nội dung<textarea value={message} onChange={e=>setMessage(e.target.value)} required rows={6} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"/></label>
        <button className="inline-flex items-center gap-2 rounded-xl bg-[#0B5FB4] text-white px-5 py-3 font-bold"><Send size={17}/> Gửi thông tin</button>
      </form>
    </div></section>
  </main>;
};
