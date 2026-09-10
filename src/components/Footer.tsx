import React from 'react';
import { Mail, Phone, Facebook, Instagram, ExternalLink, Users, Globe2, GraduationCap, HeartHandshake, MessageCircle, Link as LinkIcon } from 'lucide-react';
import { PageRoute } from '../types';
import { useDataContext } from '../context/DataContext';

interface FooterProps { onNavigate: (page: PageRoute, slug?: string) => void; }
const iconMap:Record<string,any>={mail:Mail,phone:Phone,facebook:Facebook,instagram:Instagram,message:MessageCircle,users:Users,heart:HeartHandshake,globe:Globe2,graduation:GraduationCap,link:LinkIcon};
export const Footer: React.FC<FooterProps> = () => {
  const {siteConfig}=useDataContext();
  const quickLinks=siteConfig.footerQuickLinks||[];
  const contacts=siteConfig.footerContacts||[];
  const portals=siteConfig.footerPortals||[];
  const legalLinks=siteConfig.footerLegalLinks||[];
  return <footer className="bg-[#06152F] text-slate-300">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="grid xl:grid-cols-[.8fr_1.05fr_1.35fr] gap-10 xl:gap-14">
        <div><img src={siteConfig.logoUrl||'/brand/sky-first-network.png'} alt={siteConfig.siteName||'Sky First Network'} className="h-20 w-auto object-contain object-left" />{siteConfig.footerAboutText&&<p className="mt-4 text-sm leading-6 text-slate-400">{siteConfig.footerAboutText}</p>}</div>
        <div><h4 className="text-white text-lg font-extrabold mb-5">Liên kết nhanh</h4><div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">{quickLinks.map((x:any)=><a key={x.label+x.url} href={x.url} target="_blank" rel="noopener noreferrer" className="hover:text-sky-300 transition">{x.label}</a>)}</div></div>
        <div><h4 className="text-white text-lg font-extrabold mb-5">Liên hệ & Kết nối</h4><div className="grid md:grid-cols-2 gap-3">{contacts.map((x:any)=>{const Icon=iconMap[x.icon||'link']||LinkIcon;return <a key={x.label+x.url} href={x.url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.035] px-3 py-2.5 hover:bg-white/[.075] hover:border-sky-400/30 transition"><span className="w-9 h-9 shrink-0 rounded-lg border border-sky-300/20 bg-sky-400/10 text-sky-300 grid place-items-center"><Icon size={17}/></span><span className="min-w-0"><span className="block text-sm font-bold text-white group-hover:text-sky-200">{x.label}</span><span className="block text-xs text-slate-400 truncate">{x.value}</span></span></a>})}</div></div>
      </div>
      <div className="mt-10 pt-8 border-t border-white/10"><h4 className="text-white text-lg font-extrabold mb-5">Các cổng Sky First</h4><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">{portals.map((x:any)=>{const Icon=iconMap[x.icon||'link']||LinkIcon;return <a key={x.label+x.url} href={x.url} target="_blank" rel="noopener noreferrer" className="group rounded-2xl border border-white/10 bg-white/[.04] p-4 hover:bg-white/[.08] hover:border-sky-400/40 transition"><div className="flex items-center justify-between"><span className="w-10 h-10 rounded-xl bg-sky-400/10 text-sky-300 grid place-items-center"><Icon size={19}/></span><ExternalLink size={15} className="text-slate-500 group-hover:text-sky-300"/></div><div className="mt-3 text-sm font-bold text-white">{x.label}</div><div className="mt-1 text-xs text-slate-400">{x.domain}</div></a>})}</div></div>
      <div className="mt-8 pt-6 border-t border-white/10 flex flex-col lg:flex-row gap-5 lg:items-center lg:justify-between text-xs text-slate-400"><div className="flex flex-wrap gap-x-5 gap-y-2">{legalLinks.map((x:any)=><a key={x.label+x.url} href={x.url} target="_blank" rel="noopener noreferrer" className="hover:text-white">{x.label}</a>)}</div><p>{siteConfig.footerCopyright||'© 2026. Bản quyền nội dung thuộc Mạng lưới Giáo dục & Phát triển Cộng đồng Sky First.'}</p></div>
    </div>
  </footer>;
};
