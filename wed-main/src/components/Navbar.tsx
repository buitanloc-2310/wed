import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronDown,
  FlaskConical,
  FolderKanban,
  GraduationCap,
  Handshake,
  HeartHandshake,
  Leaf,
  Menu,
  Megaphone,
  Search,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { PageRoute } from '../types';
import { useDataContext } from '../context/DataContext';
import { getProgramSlug, getArticleSlug } from '../utils/slug';

interface NavbarProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute, slug?: string) => void;
}

type MenuItem = { label: string; page: PageRoute; slug?: string; description?: string };
type MenuGroup = { label: string; items: MenuItem[] };

const activityIcons = [GraduationCap, Users, HeartHandshake, Leaf, FlaskConical, FolderKanban, CalendarDays, Handshake, Megaphone];

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { siteConfig, programs, newsArticles, customPages } = useDataContext();
  const groups: MenuGroup[] = (siteConfig.navigationGroups || []) as MenuGroup[];
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMobileGroup, setOpenMobileGroup] = useState<string | null>(null);
  const [openDesktopGroup, setOpenDesktopGroup] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activityGroup = useMemo(() => groups.find((g) => g.label === 'Hoạt động'), [groups]);
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLocaleLowerCase('vi');
    if (q.length < 2) return [] as {label:string;meta:string;page:PageRoute;slug?:string}[];
    const normalize=(v:unknown)=>String(v||'').toLocaleLowerCase('vi');
    const rows:[string,string,PageRoute,string?][]=[];
    for(const p of programs.filter((x)=>x.isPublished!==false)) if([p.title,p.summary,p.categoryLabel].some((v)=>normalize(v).includes(q))) rows.push([p.title,p.categoryLabel||'Chương trình','program-detail',getProgramSlug(p)]);
    for(const n of newsArticles.filter((x)=>x.isPublished!==false)) if([n.title,n.summary,n.categoryLabel].some((v)=>normalize(v).includes(q))) rows.push([n.title,n.categoryLabel||'Tin tức','news-detail',getArticleSlug(n)]);
    for(const p of customPages.filter((x)=>x.isPublished!==false)) if([p.title,p.summary,p.badge].some((v)=>normalize(v).includes(q))) rows.push([p.title,p.badge||'Trang thông tin','custom-page',p.slug]);
    return rows.slice(0,10).map(([label,meta,page,slug])=>({label,meta,page,slug}));
  },[searchQuery,programs,newsArticles,customPages]);

  const go = (page: PageRoute, slug?: string) => {
    onNavigate(page, slug);
    setMobileOpen(false);
    setOpenDesktopGroup(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderStandardDropdown = (group: MenuGroup) => {
    const open = openDesktopGroup === group.label;
    return (
      <div key={group.label} className="relative" onMouseEnter={() => setOpenDesktopGroup(group.label)}>
        <button
          onClick={() => setOpenDesktopGroup(open ? null : group.label)}
          aria-expanded={open}
          className="px-4 py-2.5 rounded-2xl text-[15px] font-semibold text-slate-700 hover:text-[#0B66C3] hover:bg-sky-50 transition flex items-center gap-1.5"
        >
          {group.label}<ChevronDown size={15} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-[80]">
            <div className="w-[390px] rounded-[24px] border border-slate-200/80 bg-white shadow-[0_28px_70px_rgba(15,23,42,.18)] p-2.5">
              {group.items.map((item) => (
                <button
                  key={`${item.label}-${item.slug || item.page}`}
                  onClick={() => go(item.page, item.slug)}
                  className="w-full px-4 py-3.5 rounded-2xl text-left hover:bg-sky-50 transition group"
                >
                  <span className="block font-extrabold text-slate-900 group-hover:text-[#0B66C3]">{item.label}</span>
                  {item.description && <span className="mt-1 block text-[12px] leading-5 font-medium text-slate-500">{item.description}</span>}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/80">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-[88px] flex items-center justify-between gap-5">
          <button onClick={() => go('home')} className="flex items-center min-w-0 text-left" aria-label={`${siteConfig.siteName || 'Sky First Network'} - Trang chủ`}>
            {siteConfig.logoUrl ? (
              <img src={siteConfig.logoUrl} alt={siteConfig.siteName || 'Sky First Network'} className="h-12 sm:h-[58px] w-auto object-contain" />
            ) : (
              <span className="font-black text-slate-900">{siteConfig.siteName || 'Sky First Network'}</span>
            )}
          </button>

          <nav className="hidden lg:flex flex-1 items-center justify-center gap-5 xl:gap-9 px-5" onMouseLeave={() => setOpenDesktopGroup(null)}>
            <button onClick={() => go('home')} className={`px-4 py-2.5 rounded-2xl text-[15px] font-semibold transition ${currentPage === 'home' ? 'text-[#0B66C3] bg-sky-50' : 'text-slate-700 hover:text-[#0B66C3] hover:bg-sky-50'}`}>Trang chủ</button>
            {groups.filter((g) => g.label !== 'Đơn vị trực thuộc').map((group) => {
              if (group.label !== 'Hoạt động') return renderStandardDropdown(group);
              const open = openDesktopGroup === group.label;
              const items = activityGroup?.items || [];
              const first = items.slice(0, 5);
              const second = items.slice(5);
              return (
                <div key={group.label} className="relative" onMouseEnter={() => setOpenDesktopGroup(group.label)}>
                  <button onClick={() => setOpenDesktopGroup(open ? null : group.label)} aria-expanded={open} className="px-4 py-2.5 rounded-2xl text-[15px] font-semibold text-slate-700 hover:text-[#0B66C3] hover:bg-sky-50 transition flex items-center gap-1.5">
                    {group.label}<ChevronDown size={15} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
                  </button>
                  {open && (
                    <div className="fixed left-1/2 -translate-x-1/2 top-[76px] pt-3 z-[80] w-[min(1120px,calc(100vw-48px))]">
                      <div className="grid grid-cols-[1fr_1fr_.72fr] gap-0 overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_34px_90px_rgba(15,23,42,.20)]">
                        <section className="p-6 border-r border-slate-100">
                          <div className="mb-4 flex items-start gap-3">
                            <div className="grid h-10 w-10 place-items-center rounded-xl bg-sky-50 text-[#0B66C3]"><Sparkles size={19}/></div>
                            <div><p className="font-black text-slate-950">Lĩnh vực hoạt động</p><p className="text-xs text-slate-500 mt-0.5">Các mảng trọng tâm đang được triển khai</p></div>
                          </div>
                          <div className="space-y-1.5">
                            {first.map((item, i) => {
                              const Icon = activityIcons[i] || BookOpen;
                              return <button key={item.label} onClick={() => go(item.page, item.slug)} className="w-full flex items-start gap-3 rounded-2xl p-3 text-left hover:bg-sky-50 transition group"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-50 text-[#0B66C3] group-hover:bg-white"><Icon size={18}/></span><span><span className="block font-extrabold text-slate-900 group-hover:text-[#0B66C3]">{item.label}</span><span className="mt-0.5 block text-[11px] leading-4 text-slate-500">{item.description || 'Khám phá nội dung, chương trình và hoạt động liên quan.'}</span></span></button>;
                            })}
                          </div>
                        </section>
                        <section className="p-6 border-r border-slate-100">
                          <div className="mb-4 flex items-start gap-3">
                            <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-50 text-cyan-700"><FolderKanban size={19}/></div>
                            <div><p className="font-black text-slate-950">Khám phá hoạt động</p><p className="text-xs text-slate-500 mt-0.5">Chương trình, sự kiện và cơ hội kết nối</p></div>
                          </div>
                          <div className="space-y-1.5">
                            {second.map((item, idx) => {
                              const Icon = activityIcons[idx + 5] || ArrowRight;
                              return <button key={item.label} onClick={() => go(item.page, item.slug)} className="w-full flex items-start gap-3 rounded-2xl p-3 text-left hover:bg-sky-50 transition group"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-50 text-[#0B66C3] group-hover:bg-white"><Icon size={18}/></span><span><span className="block font-extrabold text-slate-900 group-hover:text-[#0B66C3]">{item.label}</span><span className="mt-0.5 block text-[11px] leading-4 text-slate-500">{item.description || 'Xem nội dung đang được công bố trên hệ thống.'}</span></span></button>;
                            })}
                          </div>
                          <button onClick={() => go('programs')} className="mt-4 w-full rounded-2xl bg-sky-50 px-4 py-3 text-sm font-extrabold text-[#0B66C3] hover:bg-sky-100 transition">Xem tất cả hoạt động <ArrowRight size={15} className="inline ml-1"/></button>
                        </section>
                        <aside className="p-6 bg-gradient-to-b from-[#F7FBFF] to-white">
                          <p className="text-[11px] uppercase tracking-[.15em] font-black text-[#0B66C3]">Điểm đến nhanh</p>
                          <div className="mt-4 rounded-[22px] bg-gradient-to-br from-[#071B3A] via-[#0B4D96] to-[#0796E6] p-5 text-white overflow-hidden relative">
                            <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full border-[18px] border-white/10" />
                            <div className="relative"><HeartHandshake size={26} className="text-cyan-200"/><h3 className="mt-4 text-xl font-black">Cùng tạo giá trị cho cộng đồng</h3><p className="mt-2 text-xs leading-5 text-sky-100">Khám phá các chương trình, dự án và cơ hội đang mở của Sky First Network.</p><button onClick={() => go('join')} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-black text-[#0B4D96]">Tham gia <ArrowRight size={14}/></button></div>
                          </div>
                        </aside>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <button onClick={() => {setSearchOpen(true);setOpenDesktopGroup(null)}} className="p-3 rounded-2xl border border-slate-200 text-slate-600 hover:text-[#0B66C3] hover:bg-sky-50" aria-label="Tìm kiếm toàn website"><Search size={19}/></button>
            <button onClick={() => go('sponsor')} className="hidden xl:inline-flex items-center gap-2 rounded-2xl bg-[#0B66C3] px-5 py-3 text-sm font-extrabold text-white shadow-sm hover:bg-[#084F99] transition"><HeartHandshake size={17}/>Đồng hành<ArrowRight size={15}/></button>
          </div>

          <button onClick={() => setMobileOpen((v) => !v)} className="lg:hidden p-2.5 rounded-xl border border-slate-200 text-slate-700" aria-label="Mở menu">{mobileOpen ? <X size={22}/> : <Menu size={22}/>}</button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white max-h-[calc(100vh-88px)] overflow-y-auto">
          <div className="px-4 py-4 space-y-2">
            <button onClick={() => go('home')} className="w-full text-left px-4 py-3 rounded-xl font-bold bg-slate-50">Trang chủ</button>
            {groups.filter((g) => g.label !== 'Đơn vị trực thuộc').map((group) => (
              <div key={group.label} className="border border-slate-200 rounded-2xl overflow-hidden">
                <button onClick={() => setOpenMobileGroup(openMobileGroup === group.label ? null : group.label)} className="w-full flex items-center justify-between px-4 py-3.5 font-bold text-slate-800">{group.label}<ChevronDown size={17} className={`transition ${openMobileGroup === group.label ? 'rotate-180' : ''}`}/></button>
                {openMobileGroup === group.label && <div className="border-t border-slate-100 bg-slate-50 p-2">{group.items.map((item) => <button key={`${item.label}-${item.slug || item.page}`} onClick={() => go(item.page, item.slug)} className="w-full px-3 py-3 rounded-xl text-left hover:bg-white"><span className="block text-sm font-bold text-slate-900">{item.label}</span>{item.description && <span className="block mt-1 text-[11px] leading-4 text-slate-500">{item.description}</span>}</button>)}</div>}
              </div>
            ))}
            <button onClick={() => go('sponsor')} className="w-full px-4 py-3 rounded-xl bg-[#0B66C3] text-white text-sm font-black">Đồng hành cùng Sky First</button>
            <button onClick={() => go('admin')} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-600">Đăng nhập quản trị</button>
          </div>
        </div>
      )}

      {searchOpen && (
        <div className="fixed inset-0 z-[120] bg-slate-950/45 backdrop-blur-sm p-4 sm:p-8" onMouseDown={(e)=>{if(e.target===e.currentTarget)setSearchOpen(false)}}>
          <div className="mx-auto mt-[7vh] max-w-2xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_35px_100px_rgba(15,23,42,.35)]">
            <div className="flex items-center gap-3 border-b border-slate-100 p-4 sm:p-5"><Search className="text-[#0B66C3]" size={20}/><input autoFocus value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} placeholder="Tìm bài viết, dự án, trang thông tin..." className="min-w-0 flex-1 bg-transparent text-base font-semibold outline-none placeholder:text-slate-400"/><button onClick={()=>setSearchOpen(false)} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"><X size={19}/></button></div>
            <div className="max-h-[58vh] overflow-y-auto p-3">
              {searchQuery.trim().length<2?<div className="p-8 text-center text-sm text-slate-500">Nhập ít nhất 2 ký tự. Tìm kiếm dùng dữ liệu public đã tải sẵn nên không phát sinh truy vấn D1 cho từng lần gõ.</div>:searchResults.length===0?<div className="p-8 text-center text-sm text-slate-500">Chưa tìm thấy nội dung phù hợp.</div>:searchResults.map((r,i)=><button key={`${r.page}-${r.slug}-${i}`} onClick={()=>{setSearchOpen(false);setSearchQuery('');go(r.page,r.slug)}} className="w-full rounded-2xl p-4 text-left hover:bg-sky-50 transition"><span className="block text-[11px] font-black uppercase tracking-wider text-[#0B66C3]">{r.meta}</span><span className="mt-1 block font-extrabold text-slate-900">{r.label}</span></button>)}
            </div>
            <div className="border-t border-slate-100 bg-slate-50 px-5 py-3 text-[11px] text-slate-500">Tìm kiếm trong nội dung đang được công khai trên website.</div>
          </div>
        </div>
      )}
    </header>
  );
};
