import React from 'react';
import { Mail, Phone, Facebook, Instagram, ExternalLink, Users, Globe2, GraduationCap, HeartHandshake, MessageCircle, Link as LinkIcon } from 'lucide-react';
import { PageRoute } from '../types';
import { useDataContext } from '../context/DataContext';

interface FooterProps { onNavigate: (page: PageRoute, slug?: string) => void; }
const iconMap:Record<string,any>={mail:Mail,phone:Phone,facebook:Facebook,instagram:Instagram,message:MessageCircle,users:Users,heart:HeartHandshake,globe:Globe2,graduation:GraduationCap,link:LinkIcon};

function resolveInternal(url:string):{page:PageRoute;slug?:string}|null{
  if(!url.startsWith('/')) return null;
  if(url==='/') return {page:'home'};
  const parts=url.replace(/^\/+|\/+$/g,'').split('/');
  if(parts[0]==='page'&&parts[1]) return {page:'custom-page',slug:decodeURIComponent(parts.slice(1).join('/'))};
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

  const internalLink=(x:any,className:string)=>{
    const target=resolveInternal(x.url||'');
    if(!target) return <a key={x.label+x.url} href={x.url} className={className}>{x.label}</a>;
    return <a key={x.label+x.url} href={x.url} onClick={(e)=>{e.preventDefault();onNavigate(target.page,target.slug);window.scrollTo({top:0,behavior:'smooth'})}} className={className}>{x.label}</a>;
  };

  return <footer className="bg-[#06152F] text-slate-300">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
      <div className="grid xl:grid-cols-[.8fr_1.05fr_1.35fr] gap-10 xl:gap-14">
        <div><img src={siteConfig.logoUrl||'/brand/sky-first-network-web.png'} alt={siteConfig.siteName||'Sky First Network'} className="h-16 sm:h-20 max-w-[260px] w-auto object-contain object-left" />{siteConfig.footerAboutText&&<p className="mt-4 text-sm leading-6 text-slate-400">{siteConfig.footerAboutText}</p>}</div>
        <div><h4 className="text-white text-lg font-extrabold mb-5">Liên kết nhanh</h4><div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">{quickLinks.map((x:any)=>internalLink(x,'hover:text-sky-300 transition break-words'))}</div></div>
        <div><h4 className="text-white text-lg font-extrabold mb-5">Liên hệ & Kết nối</h4><div className="grid md:grid-cols-2 gap-3">{contacts.map((x:any)=>{const Icon=iconMap[x.icon||'link']||LinkIcon;const external=/^https?:/i.test(x.url||'');return <a key={x.label+x.url} href={x.url} target={external?'_blank':undefined} rel={external?'noopener noreferrer':undefined} className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.035] px-3 py-2.5 hover:bg-white/[.075] hover:border-sky-400/30 transition"><span className="w-9 h-9 shrink-0 rounded-lg border border-sky-300/20 bg-sky-400/10 text-sky-300 grid place-items-center"><Icon size={17}/></span><span className="min-w-0"><span className="block text-sm font-bold text-white group-hover:text-sky-200">{x.label}</span><span className="block text-xs text-slate-400 break-all">{x.value}</span></span></a>})}</div></div>
      </div>
      {portals.length>0&&<div className="mt-10 pt-8 border-t border-white/10"><h4 className="text-white text-lg font-extrabold mb-5">Các cổng Sky First</h4><div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">{portals.map((x:any)=>{const Icon=iconMap[x.icon||'link']||LinkIcon;return <a key={x.label+x.url} href={x.url} target="_blank" rel="noopener noreferrer" className="group rounded-2xl border border-white/10 bg-white/[.04] p-4 hover:bg-white/[.08] hover:border-sky-400/40 transition"><div className="flex items-center justify-between"><span className="w-10 h-10 rounded-xl bg-sky-400/10 text-sky-300 grid place-items-center"><Icon size={19}/></span><ExternalLink size={15} className="text-slate-500 group-hover:text-sky-300"/></div><div className="mt-3 text-sm font-bold text-white break-words">{x.label}</div><div className="mt-1 text-xs text-slate-400 break-all">{x.domain}</div></a>})}</div></div>}
      <div className="mt-8 pt-6 border-t border-white/10 flex flex-col lg:flex-row gap-5 lg:items-center lg:justify-between text-xs text-slate-400"><div className="flex flex-wrap gap-x-5 gap-y-2">{legalLinks.map((x:any)=>internalLink(x,'hover:text-white transition'))}</div><p>{siteConfig.footerCopyright||'© 2026. Mạng lưới Giáo dục & Phát triển Cộng đồng Sky First.'}</p></div>
    </div>
  </footer>;
};
