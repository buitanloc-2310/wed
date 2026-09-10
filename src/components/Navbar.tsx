import React, { useState } from 'react';
import { Menu, X, ChevronDown, Search } from 'lucide-react';
import { PageRoute } from '../types';
import { useDataContext } from '../context/DataContext';

interface NavbarProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute, slug?: string) => void;
}

type MenuItem = { label: string; page: PageRoute; slug?: string };
type MenuGroup = { label: string; items: MenuItem[] };

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { siteConfig } = useDataContext();
  const groups: MenuGroup[] = (siteConfig.navigationGroups || []) as MenuGroup[];
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMobileGroup, setOpenMobileGroup] = useState<string | null>(null);
  const [openDesktopGroup, setOpenDesktopGroup] = useState<string | null>(null);

  const go = (page: PageRoute, slug?: string) => {
    onNavigate(page, slug);
    setMobileOpen(false);
    setOpenDesktopGroup(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-[78px] flex items-center justify-between gap-5">
          <button onClick={() => go('home')} className="flex items-center min-w-0 text-left" aria-label={`${siteConfig.siteName || 'Sky First Network'} - Trang chủ`}>
            {siteConfig.logoUrl ? (
              <img src={siteConfig.logoUrl} alt={siteConfig.siteName || 'Sky First Network'} className="h-12 sm:h-14 w-auto object-contain" />
            ) : (
              <span className="font-black text-slate-900">{siteConfig.siteName || 'Sky First Network'}</span>
            )}
          </button>

          <nav className="hidden lg:flex items-center gap-1" onMouseLeave={() => setOpenDesktopGroup(null)}>
            <button onClick={() => go('home')} className={`px-3 py-2 rounded-xl text-sm font-bold transition ${currentPage==='home'?'text-[#0B5FB4] bg-sky-50':'text-slate-700 hover:text-[#0B5FB4] hover:bg-slate-50'}`}>Trang chủ</button>
            {groups.map(group => {
              const open = openDesktopGroup === group.label;
              return (
                <div key={group.label} className="relative" onMouseEnter={() => setOpenDesktopGroup(group.label)}>
                  <button onClick={() => setOpenDesktopGroup(open ? null : group.label)} aria-expanded={open} className="px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:text-[#0B5FB4] hover:bg-slate-50 transition flex items-center gap-1.5">
                    {group.label}<ChevronDown size={15} className={`transition-transform ${open?'rotate-180':''}`} />
                  </button>
                  {open && (
                    <div className="absolute top-full left-0 pt-2 z-[70]">
                      <div className="w-[310px] rounded-2xl border border-slate-200 bg-white shadow-2xl p-2">
                        {group.items.map(item => (
                          <button key={`${item.label}-${item.slug || item.page}`} onClick={() => go(item.page, item.slug)} className="w-full px-4 py-3 rounded-xl text-left text-sm font-semibold text-slate-800 hover:text-[#0B5FB4] hover:bg-sky-50 transition">
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <button onClick={() => go('certificate')} className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-[#0B5FB4] hover:bg-sky-50" aria-label="Tra cứu Giấy chứng nhận"><Search size={18}/></button>
          </div>

          <button onClick={() => setMobileOpen(v=>!v)} className="lg:hidden p-2.5 rounded-xl border border-slate-200 text-slate-700" aria-label="Mở menu">{mobileOpen?<X size={22}/>:<Menu size={22}/>}</button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white max-h-[calc(100vh-78px)] overflow-y-auto">
          <div className="px-4 py-4 space-y-2">
            <button onClick={() => go('home')} className="w-full text-left px-4 py-3 rounded-xl font-bold bg-slate-50">Trang chủ</button>
            {groups.map(group => (
              <div key={group.label} className="border border-slate-200 rounded-2xl overflow-hidden">
                <button onClick={() => setOpenMobileGroup(openMobileGroup===group.label?null:group.label)} className="w-full flex items-center justify-between px-4 py-3.5 font-bold text-slate-800">
                  {group.label}<ChevronDown size={17} className={`transition ${openMobileGroup===group.label?'rotate-180':''}`}/>
                </button>
                {openMobileGroup===group.label && <div className="border-t border-slate-100 bg-slate-50 p-2">{group.items.map(item => <button key={`${item.label}-${item.slug || item.page}`} onClick={() => go(item.page, item.slug)} className="w-full px-3 py-3 rounded-xl text-left text-sm font-semibold hover:bg-white hover:text-[#0B5FB4]">{item.label}</button>)}</div>}
              </div>
            ))}
            <button onClick={() => go('admin')} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-600">Đăng nhập quản trị</button>
          </div>
        </div>
      )}
    </header>
  );
};
