import React, { useEffect, useMemo, useState } from 'react';
import { MessageCircle, Send, Loader2, ShieldCheck } from 'lucide-react';

interface Props { articleId: string; enabled?: boolean; }
interface CommentRow { id:string; name:string; content:string; created_at:string; }

export const NewsComments: React.FC<Props> = ({ articleId, enabled = true }) => {
  const [items,setItems]=useState<CommentRow[]>([]);
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [content,setContent]=useState('');
  const [loading,setLoading]=useState(true);
  const [sending,setSending]=useState(false);
  const [notice,setNotice]=useState('');

  const load = async () => {
    setLoading(true);
    try {
      const r=await fetch(`/api/comments?articleId=${encodeURIComponent(articleId)}`,{cache:'no-store'});
      const d=await r.json().catch(()=>({}));
      setItems(Array.isArray(d?.items)?d.items:[]);
    } catch { setItems([]); }
    finally { setLoading(false); }
  };
  useEffect(()=>{ if(enabled) void load(); },[articleId,enabled]);
  const count=useMemo(()=>items.length,[items]);

  if(!enabled) return null;
  const submit=async(e:React.FormEvent)=>{
    e.preventDefault(); setSending(true); setNotice('');
    try{
      const r=await fetch('/api/comments',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({articleId,name,email,content})});
      const d=await r.json().catch(()=>({}));
      if(!r.ok||!d?.ok) throw new Error(d?.error||'Không thể gửi bình luận.');
      setContent(''); setNotice(d?.message||'Bình luận đã được gửi và đang chờ duyệt.');
    }catch(err:any){setNotice(err?.message||'Không thể gửi bình luận.');}
    finally{setSending(false);}
  };

  return <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 sm:p-7" id="binh-luan">
    <div className="flex items-center justify-between gap-3 mb-5"><div><div className="flex items-center gap-2 text-slate-900 font-black text-lg"><MessageCircle size={20} className="text-sky-600"/>Bình luận</div><p className="text-xs text-slate-500 mt-1">{count} bình luận đã được duyệt</p></div><ShieldCheck size={20} className="text-emerald-600"/></div>
    {loading?<div className="py-6 text-sm text-slate-500 flex items-center gap-2"><Loader2 size={16} className="animate-spin"/>Đang tải bình luận...</div>:items.length===0?<p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">Chưa có bình luận được duyệt.</p>:<div className="space-y-3 mb-6">{items.map(x=><div key={x.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><strong className="text-sm text-slate-900">{x.name}</strong><span className="text-[11px] text-slate-400">{x.created_at?new Date(x.created_at+'Z').toLocaleString('vi-VN'):''}</span></div><p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">{x.content}</p></div>)}</div>}
    <form onSubmit={submit} className="space-y-3 border-t border-slate-100 pt-5"><div className="grid sm:grid-cols-2 gap-3"><input required maxLength={80} value={name} onChange={e=>setName(e.target.value)} placeholder="Họ và tên" className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500"/><input type="email" maxLength={160} value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email (không hiển thị công khai)" className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500"/></div><textarea required maxLength={2000} rows={4} value={content} onChange={e=>setContent(e.target.value)} placeholder="Viết bình luận..." className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500"/><div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"><p className="text-[11px] text-slate-500">Bình luận sẽ được hiển thị sau khi quản trị viên duyệt.</p><button disabled={sending} className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-sky-700 disabled:opacity-60">{sending?<Loader2 size={15} className="animate-spin"/>:<Send size={15}/>}Gửi bình luận</button></div>{notice&&<p className="text-xs font-semibold text-sky-700">{notice}</p>}</form>
  </section>;
};
