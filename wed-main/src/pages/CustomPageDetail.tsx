import { sanitizeHtml } from '../utils/sanitizeHtml';
import React from 'react';
import { useDataContext } from '../context/DataContext';
import { PageRoute, PageBlock } from '../types';
import { ArrowLeft, Calendar, FileText, Sparkles, ExternalLink, ArrowRight, Clock, Play, Quote } from 'lucide-react';

interface CustomPageDetailProps {
  slug: string;
  onNavigate: (route: PageRoute) => void;
}

const blockBackground=(bg?:PageBlock['background'])=>bg==='navy'?'bg-[#071B3A] text-white':bg==='sky'?'bg-sky-50 text-slate-900':bg==='soft'?'bg-slate-50 text-slate-900':'bg-white text-slate-900';
const safeExternal=(url:string)=>/^https?:\/\//i.test(url);
const youtubeEmbed=(value?:string)=>{
  const raw=String(value||'').trim(); if(!raw)return '';
  try{const u=new URL(raw); if(!['youtube.com','www.youtube.com','youtu.be'].includes(u.hostname))return ''; let id=''; if(u.hostname==='youtu.be')id=u.pathname.slice(1); else id=u.searchParams.get('v')||u.pathname.split('/').filter(Boolean).pop()||''; return id?`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`:'';}catch{return ''}
};

export const CustomPageDetail: React.FC<CustomPageDetailProps> = ({ slug, onNavigate }) => {
  const { customPages, isPublicDataReady } = useDataContext();

  const page = customPages.find((p) => p.slug === slug || p.id === slug || p.slug === decodeURIComponent(slug));

  if (!isPublicDataReady) {
    return <div className="min-h-[65vh] bg-white"><div className="max-w-4xl mx-auto px-4 py-14 animate-pulse"><div className="h-5 w-32 bg-slate-100 rounded"/><div className="mt-8 h-10 w-4/5 bg-slate-100 rounded-xl"/><div className="mt-4 h-5 w-3/5 bg-slate-100 rounded"/><div className="mt-10 h-80 rounded-[28px] bg-slate-100"/></div></div>;
  }

  if (!page) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <FileText size={48} className="text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Không tìm thấy trang yêu cầu</h2>
        <p className="text-sm text-slate-500 mt-2 max-w-md">Trang bạn tìm kiếm có thể đã bị xóa hoặc đường dẫn chưa chính xác.</p>
        <button type="button" onClick={() => onNavigate('home')} className="mt-6 px-5 py-2.5 bg-[#0284C7] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#0369A1] transition">Trở Về Trang Chủ</button>
      </div>
    );
  }

  if (page.isPublished === false) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-4 shadow-2xs"><Clock size={28} /></div>
        <h2 className="text-xl font-bold text-slate-800">Trang đang ở trạng thái bản nháp</h2>
        <p className="text-sm text-slate-500 mt-2 max-w-md">Trang thông tin này hiện đang được quản trị viên biên tập ở chế độ Bản nháp và chưa được xuất bản công khai.</p>
        <button type="button" onClick={() => onNavigate('home')} className="mt-6 px-5 py-2.5 bg-[#0284C7] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#0369A1] transition">Trở Về Trang Chủ</button>
      </div>
    );
  }

  const handleButtonClick = (url?: string) => {
    if (!url) return;
    if (safeExternal(url)) window.open(url, '_blank', 'noopener,noreferrer');
    else if (url.startsWith('/')) onNavigate(url.replace(/^\//, '') as PageRoute);
    else onNavigate(url as PageRoute);
  };

  const renderBlock=(block:PageBlock)=>{
    if(block.hidden)return null;
    const bg=blockBackground(block.background);
    if(block.type==='divider')return <div key={block.id} className="py-4"><hr className="border-slate-200"/></div>;
    if(block.type==='image')return <section key={block.id} className={`rounded-[28px] p-4 sm:p-6 ${bg}`}><figure className="article-media"><img src={block.imageUrl} alt={block.alt||block.title||page.title} className="max-h-[760px] w-auto max-w-full mx-auto rounded-2xl object-contain"/>{(block.caption||block.credit)&&<figcaption className="mt-3 text-center text-sm opacity-75">{block.caption&&<span>{block.caption}</span>}{block.caption&&block.credit&&<br/>}{block.credit&&<span className="text-[11px] font-bold uppercase tracking-wide">ẢNH/NGUỒN: {block.credit}</span>}</figcaption>}</figure></section>;
    if(block.type==='video'){
      const embed=youtubeEmbed(block.videoUrl);
      return <section key={block.id} className={`rounded-[28px] p-5 sm:p-7 ${bg}`}>{block.title&&<h2 className="text-2xl font-black mb-5">{block.title}</h2>}{embed?<div className="aspect-video overflow-hidden rounded-2xl bg-black"><iframe src={embed} title={block.title||'Video'} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/></div>:block.videoUrl?<video controls preload="metadata" poster={block.posterUrl} className="w-full max-h-[720px] rounded-2xl bg-black"><source src={block.videoUrl}/></video>:<div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center opacity-60"><Play className="mx-auto"/>Chưa cấu hình video.</div>}</section>;
    }
    if(block.type==='stats')return <section key={block.id} className={`rounded-[28px] p-6 sm:p-8 ${bg}`}>{block.title&&<h2 className="text-2xl font-black mb-6">{block.title}</h2>}<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{(block.stats||[]).map((stat,i)=><div key={i} className="rounded-2xl border border-current/10 bg-white/8 p-5"><div className="text-3xl font-black tracking-tight">{stat.value}</div><div className="mt-1 text-sm font-bold opacity-80">{stat.label}</div>{stat.note&&<div className="mt-1 text-xs opacity-60">{stat.note}</div>}</div>)}</div></section>;
    if(block.type==='cta')return <section key={block.id} className={`rounded-[30px] p-7 sm:p-10 ${bg}`}><h2 className="text-3xl font-black tracking-tight">{block.title||'Cùng đồng hành'}</h2>{block.body&&<p className="mt-3 max-w-3xl leading-7 opacity-75">{block.body}</p>}<div className="mt-6 flex flex-wrap gap-3">{block.buttonLabel&&<button onClick={()=>handleButtonClick(block.buttonUrl)} className="rounded-xl bg-[#0B66C3] px-5 py-3 text-sm font-black text-white">{block.buttonLabel}<ArrowRight size={15} className="inline ml-2"/></button>}{block.secondaryButtonLabel&&<button onClick={()=>handleButtonClick(block.secondaryButtonUrl)} className="rounded-xl border border-current/20 px-5 py-3 text-sm font-black">{block.secondaryButtonLabel}</button>}</div></section>;
    if(block.type==='quote')return <section key={block.id} className={`rounded-[28px] p-7 sm:p-9 ${bg}`}><Quote size={26} className="text-sky-500"/>{block.title&&<h2 className="mt-4 text-xl font-black">{block.title}</h2>}<blockquote className="mt-3 text-lg leading-8 font-medium opacity-80">{block.body}</blockquote></section>;
    if(block.type==='html')return <section key={block.id} className={`rounded-[28px] p-6 sm:p-8 ${bg}`}>{block.title&&<h2 className="text-2xl font-black mb-4">{block.title}</h2>}<div className="formatted-content prose prose-slate max-w-none" dangerouslySetInnerHTML={{__html:sanitizeHtml(block.body||'')}}/></section>;
    return <section key={block.id} className={`rounded-[28px] p-6 sm:p-8 ${bg}`}>{block.title&&<h2 className="text-2xl font-black tracking-tight">{block.title}</h2>}{block.body&&<div className="formatted-content prose prose-slate max-w-none mt-4 leading-8" dangerouslySetInnerHTML={{__html:sanitizeHtml(block.body.includes('<')?block.body:block.body.replace(/\n/g,'<br/>'))}}/>}</section>;
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="bg-white border-b border-slate-200/80 pt-8 pb-10"><div className="max-w-5xl mx-auto px-4 sm:px-6">
        <button type="button" onClick={() => onNavigate('home')} className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-6 group transition"><ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform"/><span>Trang chủ</span></button>
        {page.badge&&<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-black text-[#0284C7] mb-3"><Sparkles size={13}/><span>{page.badge}</span></div>}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-[-.035em] leading-tight">{page.title}</h1>
        {page.summary&&<p className="mt-4 text-base sm:text-lg text-slate-600 leading-8 max-w-4xl">{page.summary}</p>}
        <div className="flex items-center gap-4 mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 flex-wrap"><span className="flex items-center gap-1.5"><Calendar size={14}/><span>{page.publishedAt||'Năm 2026'}</span></span></div>
      </div></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-8 space-y-5">
        {(page.imageUrl || page.contentFormatted || page.content || page.secondaryImageUrl) && <article className="bg-white rounded-[30px] border border-slate-200/80 shadow-xs p-6 sm:p-10 space-y-8">
          {page.imageUrl&&<div className="w-full aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-slate-100"><img src={page.imageUrl} alt={page.title} referrerPolicy="no-referrer" className="w-full h-full object-cover"/></div>}
          {page.contentFormatted&&page.contentFormatted.includes('<')?<div className="formatted-content prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed" dangerouslySetInnerHTML={{__html:sanitizeHtml(page.contentFormatted)}}/>:<div className="formatted-content prose prose-slate max-w-none space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{page.contentFormatted||page.content}</div>}
          {page.secondaryImageUrl&&<div className="w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100"><img src={page.secondaryImageUrl} alt="Ảnh minh họa đính kèm" referrerPolicy="no-referrer" className="w-full h-auto object-contain"/></div>}
        </article>}

        {(page.pageBlocks||[]).map(renderBlock)}

        {(page.buttonLabel||page.secondaryButtonLabel)&&<div className="rounded-[26px] border border-slate-200 bg-white p-6 flex flex-wrap items-center gap-3">{page.buttonLabel&&<button type="button" onClick={()=>handleButtonClick(page.buttonUrl)} className="px-6 py-3 bg-[#0284C7] hover:bg-[#0369A1] text-white font-extrabold text-xs sm:text-sm rounded-xl transition flex items-center gap-2"><span>{page.buttonLabel}</span>{page.buttonUrl?.startsWith('http')?<ExternalLink size={15}/>:<ArrowRight size={15}/>}</button>}{page.secondaryButtonLabel&&<button type="button" onClick={()=>handleButtonClick(page.secondaryButtonUrl)} className="px-5 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs sm:text-sm rounded-xl transition flex items-center gap-2"><span>{page.secondaryButtonLabel}</span>{page.secondaryButtonUrl?.startsWith('http')?<ExternalLink size={15}/>:<ArrowRight size={15}/>}</button>}</div>}
      </div>
    </div>
  );
};
