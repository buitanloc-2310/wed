import React from 'react';
import { Mail, Phone, Facebook, Instagram, ExternalLink, Users, Globe2, GraduationCap, HeartHandshake, MessageCircle, Link as LinkIcon, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { PageRoute } from '../types';
import { useDataContext } from '../context/DataContext';

interface FooterProps { onNavigate: (page: PageRoute, slug?: string) => void; }
const iconMap:Record<string,any>={mail:Mail,phone:Phone,facebook:Facebook,instagram:Instagram,message:MessageCircle,users:Users,heart:HeartHandshake,globe:Globe2,graduation:GraduationCap,link:LinkIcon};

function resolveInternal(url:string):{page:PageRoute;slug?:string}|null{
  if(!url.startsWith('/')) return null;
  if(url==='/') return {page:'home'};
  const parts=url.replace(/^\/+|\/+$/g,'').split('/');
  if((parts[0]==='page'||parts[0]==='trang')&&parts[1]) return {page:'custom-page',slug:decodeURIComponent(parts.slice(1).join('/'))};
  if(parts.length===1&&!['home','about','programs','units','news','certificate','sponsor','join','contact','admin'].includes(parts[0])) return {page:'custom-page',slug:decodeURIComponent(parts[0])};
  if(parts[0]==='phap-ly-minh-bach') return {page:'custom-page',slug:'phap-ly-minh-bach'};
  const direct:Record<string,PageRoute>={home:'home',about:'about',programs:'programs',units:'units',news:'news',certificate:'certificate',sponsor:'sponsor',join:'join',contact:'contact',admin:'admin'};
  return direct[parts[0]]?{page:direct[parts[0]]}:null;
}

export const Footer: React.FC<FooterProps> = ({onNavigate}) => {
  const {siteConfig}=useDataContext();
  const quickLinks=siteConfig.footerQuickLinks||[];
  const contacts=siteConfig.footerContacts||[];
  const portals=siteConfig.footerPortals||[];
  const legalLinks=siteConfig.footerLegalLinks||[];
  const organization=(siteConfig.organizationInfo||[]).filter((x:any)=>x.visible!==false&&String(x.value||'').trim());
  const groups=siteConfig.navigationGroups||[];
  const intro=groups.find((g:any)=>g.label==='Giới thiệu')?.items?.slice(0,5)||[];
  const join=groups.find((g:any)=>g.label==='Tham gia')?.items?.slice(0,5)||[];

  const goUrl=(url:string,e?:React.MouseEvent)=>{const target=resolveInternal(url||'');if(!target)return;if(e)e.preventDefault();onNavigate(target.page,target.slug);window.scrollTo({top:0,behavior:'smooth'});};
  const LinkRow=({label,url}:{label:string,url:string})=>{const target=resolveInternal(url||'');return target?<a href={url} onClick={e=>goUrl(url,e)} className="text-sm text-slate-400 hover:text-white transition">{label}</a>:<a href={url} target={/^https?:/i.test(url)?'_blank':undefined} rel={/^https?:/i.test(url)?'noopener noreferrer':undefined} className="text-sm text-slate-400 hover:text-white transition">{label}</a>};

  return <footer className="bg-[#06152F] text-slate-300">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
      {organization.length>0&&<section className="mb-10 rounded-[26px] border border-white/10 bg-white/[.035] p-5 sm:p-6"><div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between"><div className="max-w-sm"><div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[.16em] text-sky-300"><ShieldCheck size={15}/>Thông tin Mạng lưới</div><h3 className="mt-2 text-xl font-black text-white">Thông tin tổ chức & minh bạch</h3><p className="mt-2 text-xs leading-6 text-slate-400">Các trường hiển thị được quản lý trong CMS và có thể ẩn/hiện riêng lẻ.</p></div><div className="grid flex-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:max-w-3xl">{organization.map((x:any,i:number)=><div key={`${x.label}-${i}`} className="text-sm"><span className="font-bold text-slate-200">{x.label}: </span>{x.url?<a href={x.url} className="text-sky-300 hover:text-white break-words">{x.value}</a>:<span className="text-slate-400 break-words">{x.value}</span>}</div>)}</div></div></section>}

      <div className="grid gap-9 md:grid-cols-2 xl:grid-cols-4">
        <div><img src={siteConfig.logoUrl||'/brand/sky-first-network-web.png'} alt={siteConfig.siteName||'Sky First Network'} className="h-16 w-auto max-w-[220px] object-contain object-left"/><p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">{siteConfig.footerAboutText||siteConfig.siteDescription}</p></div>
        <div><h4 className="mb-4 text-sm font-black uppercase tracking-[.12em] text-white">Khám phá</h4><div className="grid gap-2.5">{intro.map((x:any)=><LinkRow key={x.label} label={x.label} url={x.slug?`/${x.slug}`:`/${x.page}`}/>)}</div></div>
        <div><h4 className="mb-4 text-sm font-black uppercase tracking-[.12em] text-white">Tham gia & Tra cứu</h4><div className="grid gap-2.5">{join.slice(0,3).map((x:any)=><LinkRow key={x.label} label={x.label} url={x.slug?`/${x.slug}`:`/${x.page}`}/>)}<LinkRow label="Tra cứu Giấy chứng nhận" url="/certificate"/><LinkRow label="Tài liệu công khai" url="/tai-lieu-cong-khai"/></div></div>
        <div><h4 className="mb-4 text-sm font-black uppercase tracking-[.12em] text-white">Liên hệ</h4><div className="grid gap-2.5">{contacts.slice(0,5).map((x:any)=>{const Icon=iconMap[x.icon||'link']||LinkIcon;return <a key={x.label+x.url} href={x.url} className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-white"><span className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-sky-300"><Icon size={15}/></span><span className="min-w-0"><b className="block text-xs text-slate-200">{x.label}</b><span className="break-all text-xs">{x.value}</span></span></a>})}</div></div>
      </div>

      {portals.length>0&&<div className="mt-10 border-t border-white/10 pt-7"><div className="mb-4 flex items-center justify-between"><h4 className="text-sm font-black uppercase tracking-[.12em] text-white">Hệ sinh thái số Sky First</h4><span className="text-[11px] text-slate-500">Cuộn ngang để xem thêm</span></div><div className="flex gap-3 overflow-x-auto pb-2 snap-x">{portals.map((x:any)=>{const Icon=iconMap[x.icon||'link']||LinkIcon;return <a key={x.label+x.url} href={x.url} target="_blank" rel="noopener noreferrer" className="group flex min-w-[220px] snap-start items-center gap-3 rounded-2xl border border-white/10 bg-white/[.035] p-3 hover:border-sky-400/30 hover:bg-white/[.07]"><span className="grid h-10 w-10 place-items-center rounded-xl bg-sky-400/10 text-sky-300"><Icon size={18}/></span><span className="min-w-0 flex-1"><b className="block truncate text-xs text-white">{x.label}</b><span className="block truncate text-[11px] text-slate-500">{x.domain}</span></span><ArrowUpRight size={14} className="text-slate-600 group-hover:text-sky-300"/></a>})}</div></div>}

      <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-slate-500 lg:flex-row lg:items-center lg:justify-between"><div className="flex flex-wrap gap-x-5 gap-y-2">{legalLinks.map((x:any)=><LinkRow key={x.label+x.url} label={x.label} url={x.url}/>)}</div><p>{siteConfig.footerCopyright||'© 2026. Mạng lưới Giáo dục & Phát triển Cộng đồng Sky First.'}</p></div>
    </div>
  </footer>;
};
