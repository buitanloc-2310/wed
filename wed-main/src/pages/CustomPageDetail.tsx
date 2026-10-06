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


const blockWidth=(w?:PageBlock['width'])=>w==='full'?'max-w-none':w==='wide'?'max-w-7xl':'max-w-5xl';
const blockAnim=(a?:PageBlock['animation'])=>a&&a!=='none'?`cms-anim cms-anim-${a}`:'';
let publicRecordsBundlePromise:Promise<any>|null=null;
const fetchPublicRecordsBundle=()=>publicRecordsBundlePromise||(publicRecordsBundlePromise=fetch('/api/admin-records?publicBundle=1').then(async r=>{const d=await r.json().catch(()=>({}));if(!r.ok||d?.ok!==true)throw new Error(d?.error||'Không tải được dữ liệu công khai.');return d.collections||{}}).catch(e=>{publicRecordsBundlePromise=null;throw e}));
const PublicRecords:React.FC<{kind:string,title:string}>=({kind,title})=>{const[items,setItems]=React.useState<any[]>([]),[loading,setLoading]=React.useState(true);React.useEffect(()=>{let live=true;fetchPublicRecordsBundle().then(d=>{if(live)setItems(Array.isArray(d?.[kind])?d[kind]:[])}).catch(()=>{}).finally(()=>{if(live)setLoading(false)});return()=>{live=false}},[kind]);if(loading)return <div className="rounded-2xl border border-slate-200 bg-white p-6 animate-pulse"><div className="h-4 w-36 bg-slate-100 rounded"/><div className="mt-4 h-20 bg-slate-100 rounded-xl"/></div>;if(!items.length)return null;return <section className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8"><div className="flex items-center justify-between gap-3"><h2 className="text-2xl font-black">{title}</h2><span className="text-xs font-bold text-slate-400">{items.length} mục</span></div><div className="mt-5 grid gap-3 md:grid-cols-2">{items.map(x=><article key={x.id} className="rounded-2xl border border-slate-200 p-5"><div className="flex flex-wrap gap-2 items-center"><h3 className="font-extrabold text-slate-900">{x.title}</h3>{x.status&&<span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">{x.status}</span>}</div>{x.subtitle&&<p className="mt-2 text-sm text-slate-600 leading-6">{x.subtitle}</p>}<div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">{x.date&&<span>{x.date}</span>}{x.year&&<span>{x.year}</span>}{x.value&&<span className="font-bold text-[#0B66C3]">{x.value} {x.unit||''}</span>}{x.amount&&<span className="font-bold text-[#0B66C3]">{x.amount}</span>}</div>{(x.fileUrl||x.sourceUrl||x.website)&&<a href={x.fileUrl||x.sourceUrl||x.website} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-xs font-black text-[#0B66C3]">Xem thông tin <ExternalLink size={13}/></a>}</article>)}</div></section>}

export const CustomPageDetail: React.FC<CustomPageDetailProps> = ({ slug, onNavigate }) => {
  const { customPages, isPublicDataReady } = useDataContext();

  const page = customPages.find((p) => p.slug === slug || p.id === slug || p.slug === decodeURIComponent(slug));
  const [redirectChecking,setRedirectChecking]=React.useState(false);
  const [redirectChecked,setRedirectChecked]=React.useState(false);
  React.useEffect(()=>{
    if(!isPublicDataReady||page||redirectChecked)return;
    let live=true;setRedirectChecking(true);
    fetch('/api/admin-records?kind=redirects&public=1').then(r=>r.json()).then(d=>{
      if(!live)return;const path=window.location.pathname.replace(/\/+$/,'')||'/';
      const item=(Array.isArray(d?.items)?d.items:[]).find((x:any)=>String(x.fromPath||'').replace(/\/+$/,'')===path);
      if(item?.toPath&&String(item.toPath).startsWith('/')){window.location.replace(String(item.toPath));return;}
    }).catch(()=>{}).finally(()=>{if(live){setRedirectChecking(false);setRedirectChecked(true)}});
    return()=>{live=false};
  },[isPublicDataReady,page,redirectChecked]);

  if (!isPublicDataReady || (!page && redirectChecking)) {
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
    if(['gallery','timeline','logos','accordion','tabs','table','documents','people','campaign','funding','transparency','marquee'].includes(block.type))return <section key={block.id} className={`${block.mobileHidden?'hidden sm:block':''} ${blockWidth(block.width)} ${blockAnim(block.animation)} mx-auto rounded-[28px] p-6 sm:p-8 ${bg}`}><h2 className="text-2xl font-black">{block.title||({gallery:'Thư viện',timeline:'Dòng thời gian',logos:'Đơn vị đồng hành',accordion:'Thông tin',tabs:'Nội dung',documents:'Tài liệu',people:'Con người',campaign:'Chiến dịch',funding:'Nguồn lực',transparency:'Công khai & Minh bạch',marquee:'Cập nhật'} as any)[block.type]||''}</h2>{block.body&&<p className="mt-2 opacity-70 leading-7">{block.body}</p>}<div className={block.type==='marquee'?'mt-5 flex gap-6 overflow-x-auto whitespace-nowrap':'mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4'} style={block.type==='marquee'?undefined:{gridTemplateColumns:`repeat(${Math.min(4,Math.max(1,block.columns||2))},minmax(0,1fr))`}}>{(block.items||[]).map((item,i)=><article key={i} className={`${block.type==='logos'?'flex items-center justify-center min-h-28':'rounded-2xl border border-current/10 bg-white/70 p-4'} text-slate-900`}>{item.imageUrl&&<img src={item.imageUrl} alt={item.title||''} className={`${block.type==='logos'?'max-h-14 max-w-[160px] object-contain':'mb-3 aspect-video w-full rounded-xl object-cover'}`}/>}<div className="font-extrabold">{item.title||item.label}</div>{item.body&&<div className="mt-1 text-sm text-slate-600 whitespace-normal">{item.body}</div>}{item.url&&<a href={item.url} target={safeExternal(item.url)?'_blank':undefined} rel={safeExternal(item.url)?'noreferrer':undefined} className="mt-3 inline-flex text-xs font-black text-[#0B66C3]">Xem thêm →</a>}</article>)}</div></section>;
    if(block.type==='map'||block.type==='embed'){const src=block.sourceUrl||block.videoUrl||'';return <section key={block.id} className={`${block.mobileHidden?'hidden sm:block':''} ${blockWidth(block.width)} ${blockAnim(block.animation)} mx-auto rounded-[28px] p-5 sm:p-7 ${bg}`}>{block.title&&<h2 className="text-2xl font-black mb-4">{block.title}</h2>}{src&&/^https:\/\//i.test(src)?<div className="aspect-video overflow-hidden rounded-2xl border bg-white"><iframe src={src} title={block.title||block.type} className="h-full w-full" loading="lazy" referrerPolicy="no-referrer" sandbox="allow-scripts allow-same-origin allow-popups"/></div>:<div className="rounded-xl border border-dashed p-8 text-center text-sm opacity-60">Chưa cấu hình URL an toàn.</div>}</section>}
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

        {slug==='cong-khai'&&<><PublicRecords kind="transparency" title="Hồ sơ công khai"/><PublicRecords kind="impact" title="Số liệu & tác động"/><PublicRecords kind="documents" title="Tài liệu & báo cáo"/><PublicRecords kind="partners" title="Đơn vị đồng hành"/></>}
        {slug==='tai-lieu-cong-khai'&&<PublicRecords kind="documents" title="Tài liệu công khai"/>}

        {slug==='su-kien'&&<PublicRecords kind="events" title="Sự kiện đang được công bố"/>}
        {slug==='co-hoi'&&<PublicRecords kind="opportunities" title="Cơ hội đang mở"/>}
        {slug==='con-nguoi'&&<PublicRecords kind="people" title="Con người Sky First"/>}

        {(page.buttonLabel||page.secondaryButtonLabel)&&<div className="rounded-[26px] border border-slate-200 bg-white p-6 flex flex-wrap items-center gap-3">{page.buttonLabel&&<button type="button" onClick={()=>handleButtonClick(page.buttonUrl)} className="px-6 py-3 bg-[#0284C7] hover:bg-[#0369A1] text-white font-extrabold text-xs sm:text-sm rounded-xl transition flex items-center gap-2"><span>{page.buttonLabel}</span>{page.buttonUrl?.startsWith('http')?<ExternalLink size={15}/>:<ArrowRight size={15}/>}</button>}{page.secondaryButtonLabel&&<button type="button" onClick={()=>handleButtonClick(page.secondaryButtonUrl)} className="px-5 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs sm:text-sm rounded-xl transition flex items-center gap-2"><span>{page.secondaryButtonLabel}</span>{page.secondaryButtonUrl?.startsWith('http')?<ExternalLink size={15}/>:<ArrowRight size={15}/>}</button>}</div>}
      </div>
    </div>
  );
};
