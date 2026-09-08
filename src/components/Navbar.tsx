import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  X, 
  UserPlus, 
  Search, 
  ArrowRight, 
  BookOpen, 
  Newspaper, 
  Building, 
  Award,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PageRoute, Program, NewsArticle, NetworkUnit } from '../types';
import { useDataContext } from '../context/DataContext';

interface NavbarProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  onSelectProgram?: (program: Program) => void;
  onSelectArticle?: (article: NewsArticle) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onSelectProgram,
  onSelectArticle,
}) => {
  const { siteConfig, programs, networkUnits, newsArticles } = useDataContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const navLinks: { id: PageRoute; label: string }[] = [
    { id: 'home', label: 'Trang chủ' },
    { id: 'programs', label: 'Chương trình' },
    { id: 'units', label: 'Đơn vị' },
    { id: 'news', label: 'Tin tức' },
    { id: 'contact', label: 'Liên hệ' },
  ];

  // Shortcut key (Ctrl+K or Cmd+K) to expand search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchExpanded(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
      if (e.key === 'Escape') {
        setIsSearchExpanded(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to collapse search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchExpanded(false);
      }
    };
    if (isSearchExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchExpanded]);

  const handleNavClick = (page: PageRoute) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    setIsSearchExpanded(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExpandSearch = () => {
    setIsSearchExpanded(true);
    setTimeout(() => searchInputRef.current?.focus(), 50);
  };

  const handleCloseSearch = () => {
    setIsSearchExpanded(false);
    setSearchQuery('');
  };

  // Search Results
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const matchedPrograms = normalizedQuery
    ? programs.filter(
        (p) =>
          p.title.toLowerCase().includes(normalizedQuery) ||
          p.summary.toLowerCase().includes(normalizedQuery) ||
          p.location.toLowerCase().includes(normalizedQuery)
      ).slice(0, 3)
    : [];

  const matchedUnits = normalizedQuery
    ? networkUnits.filter(
        (u) =>
          u.code.toLowerCase().includes(normalizedQuery) ||
          u.name.toLowerCase().includes(normalizedQuery) ||
          u.tagline.toLowerCase().includes(normalizedQuery)
      ).slice(0, 3)
    : [];

  const matchedNews = normalizedQuery
    ? newsArticles.filter(
        (n) =>
          n.title.toLowerCase().includes(normalizedQuery) ||
          n.summary.toLowerCase().includes(normalizedQuery)
      ).slice(0, 3)
    : [];

  const hasAnyResults = matchedPrograms.length > 0 || matchedUnits.length > 0 || matchedNews.length > 0;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100/80 shadow-2xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-3">
          
          {/* Logo Brand */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 sm:gap-3 text-left group focus:outline-hidden py-1 flex-shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#00A3FF] via-[#0284C7] to-[#2563EB] p-0.5 shadow-md shadow-sky-400/25 group-hover:scale-105 transition-transform duration-200 overflow-hidden">
              {siteConfig.logoUrl ? (
                <img
                  src={siteConfig.logoUrl}
                  alt={siteConfig.siteName}
                  className="w-full h-full object-cover rounded-[10px]"
                />
              ) : (
                <div className="w-full h-full bg-white/10 backdrop-blur-xs rounded-[10px] flex items-center justify-center text-white font-black text-lg">
                  S
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight group-hover:text-[#0284C7] transition-colors leading-tight">
                {siteConfig.siteName || 'Sky First Network'}
              </span>
              <span className="hidden sm:inline text-[11px] text-slate-500 font-medium tracking-normal mt-0.5">
                {siteConfig.siteDescription || siteConfig.tagline || 'Mạng lưới Giáo dục & Phát triển Cộng đồng'}
              </span>
            </div>
          </motion.button>

          {/* If Search is NOT active: Show Navigation Menu & Search Trigger Button */}
          {!isSearchExpanded ? (
            <>
              {/* Desktop Navigation Links (Gọn gàng với 5 mục chính) */}
              <nav className="hidden lg:flex items-center space-x-1.5 xl:space-x-2">
                {navLinks.map((item) => {
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all relative ${
                        isActive
                          ? 'text-[#0284C7] bg-sky-50 shadow-2xs font-extrabold'
                          : 'text-slate-600 hover:text-[#0284C7] hover:bg-sky-50/50'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isActive && (
                        <motion.span 
                          layoutId="activeNavIndicator"
                          className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-[#00A3FF] to-emerald-400 rounded-full" 
                        />
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Desktop Search Button */}
              <div className="hidden lg:flex items-center">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleExpandSearch}
                  className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100/90 hover:bg-sky-50 hover:text-[#0284C7] border border-slate-200/80 transition shadow-2xs group cursor-pointer"
                  title="Tìm kiếm"
                >
                  <Search size={15} className="text-slate-500 group-hover:text-[#0284C7] transition-colors" />
                  <span className="text-slate-600 group-hover:text-[#0284C7]">Tìm kiếm</span>
                </motion.button>
              </div>

              {/* Mobile Right Controls: Search Icon & Hamburger Menu Only */}
              <div className="lg:hidden flex items-center gap-2">
                <button
                  onClick={handleExpandSearch}
                  className="p-2 rounded-xl text-slate-700 bg-slate-50 border border-slate-200 hover:bg-sky-50 hover:text-[#0284C7] transition"
                  aria-label="Tìm kiếm"
                >
                  <Search size={19} />
                </button>

                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
                  aria-label="Menu"
                >
                  {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              </div>
            </>
          ) : (
            /* When Search IS active: Hide menu and show WIDE search bar! */
            <div ref={searchContainerRef} className="flex-1 max-w-3xl ml-2 sm:ml-6 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="w-full flex items-center bg-sky-50/90 border-2 border-[#0284C7] rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2 shadow-lg shadow-sky-500/10"
              >
                <Search size={18} className="text-[#0284C7] flex-shrink-0 mr-2.5" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm chương trình, đơn vị trực thuộc, tin tức, hoạt động..."
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-md transition"
                    title="Xóa nội dung tìm kiếm"
                  >
                    <X size={14} />
                  </button>
                )}
                <button
                  onClick={handleCloseSearch}
                  className="ml-2 px-2.5 sm:px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition flex items-center gap-1.5 flex-shrink-0 shadow-2xs cursor-pointer"
                  title="Đóng tìm kiếm (Esc)"
                >
                  <X size={14} className="text-slate-500" />
                  <span className="hidden sm:inline text-xs">Đóng</span>
                  <kbd className="hidden sm:inline-block text-[10px] font-mono text-slate-400 bg-slate-100 px-1 py-0.5 rounded">
                    ESC
                  </kbd>
                </button>
              </motion.div>

              {/* LIVE DROPDOWN RESULTS (Spanning full width of the wide search bar) */}
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-sky-100 overflow-hidden z-50 text-left animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="max-h-[75vh] overflow-y-auto divide-y divide-slate-100">
                  
                  {/* If query has results */}
                  {normalizedQuery && (
                    <div className="p-3 space-y-3">
                      
                      {/* Programs Matches */}
                      {matchedPrograms.length > 0 && (
                        <div className="space-y-1">
                          <div className="px-2.5 pt-1 text-[10px] font-black text-[#0284C7] uppercase tracking-wider flex items-center gap-1.5">
                            <BookOpen size={11} />
                            <span>Chương trình hoạt động</span>
                          </div>
                          {matchedPrograms.map((p) => (
                            <div
                              key={p.id}
                              onClick={() => {
                                if (onSelectProgram) {
                                  onSelectProgram(p);
                                } else {
                                  handleNavClick('programs');
                                }
                                handleCloseSearch();
                              }}
                              className="p-2.5 rounded-xl hover:bg-sky-50 cursor-pointer transition flex items-center justify-between group"
                            >
                              <div className="space-y-0.5 pr-2">
                                <div className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#0284C7] line-clamp-1">
                                  {p.title}
                                </div>
                                <div className="text-[11px] text-slate-500 line-clamp-1">
                                  {p.summary}
                                </div>
                              </div>
                              <ChevronRight size={14} className="text-slate-300 group-hover:text-[#0284C7] flex-shrink-0" />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Units Matches */}
                      {matchedUnits.length > 0 && (
                        <div className="space-y-1">
                          <div className="px-2.5 pt-1 text-[10px] font-black text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
                            <Building size={11} />
                            <span>Đơn vị trực thuộc</span>
                          </div>
                          {matchedUnits.map((u) => (
                            <div
                              key={u.id}
                              onClick={() => {
                                handleNavClick('units');
                                handleCloseSearch();
                              }}
                              className="p-2.5 rounded-xl hover:bg-indigo-50/50 cursor-pointer transition flex items-center justify-between group"
                            >
                              <div className="space-y-0.5 pr-2">
                                <div className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-indigo-600 flex items-center gap-1.5">
                                  <span className="px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700 text-[10px] font-black">
                                    {u.code}
                                  </span>
                                  <span className="line-clamp-1">{u.name}</span>
                                </div>
                                <div className="text-[11px] text-slate-500 line-clamp-1">
                                  {u.tagline}
                                </div>
                              </div>
                              <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-600 flex-shrink-0" />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* News Matches */}
                      {matchedNews.length > 0 && (
                        <div className="space-y-1">
                          <div className="px-2.5 pt-1 text-[10px] font-black text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                            <Newspaper size={11} />
                            <span>Tin tức & Sự kiện</span>
                          </div>
                          {matchedNews.map((n) => (
                            <div
                              key={n.id}
                              onClick={() => {
                                if (onSelectArticle) {
                                  onSelectArticle(n);
                                } else {
                                  handleNavClick('news');
                                }
                                handleCloseSearch();
                              }}
                              className="p-2.5 rounded-xl hover:bg-emerald-50/50 cursor-pointer transition flex items-center justify-between group"
                            >
                              <div className="space-y-0.5 pr-2">
                                <div className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-emerald-700 line-clamp-1">
                                  {n.title}
                                </div>
                                <div className="text-[11px] text-slate-500 line-clamp-1">
                                  {n.summary}
                                </div>
                              </div>
                              <ChevronRight size={14} className="text-slate-300 group-hover:text-emerald-600 flex-shrink-0" />
                            </div>
                          ))}
                        </div>
                      )}

                      {!hasAnyResults && (
                        <div className="py-8 text-center text-xs text-slate-500 space-y-1">
                          <p className="font-bold text-slate-700 text-sm">Không tìm thấy kết quả phù hợp</p>
                          <p className="text-xs text-slate-400">Thử tìm theo từ khóa "kỹ năng", "tình nguyện", "SFEC", "chứng nhận"...</p>
                        </div>
                      )}

                    </div>
                  )}

                  {/* Quick recommendations when search input is empty */}
                  {!normalizedQuery && (
                    <div className="p-4 space-y-2.5">
                      <div className="text-[11px] font-extrabold text-slate-400 px-2 uppercase tracking-wider">
                        Gợi ý truy cập nhanh:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        <button
                          onClick={() => {
                            handleNavClick('about');
                            handleCloseSearch();
                          }}
                          className="w-full text-left p-2.5 rounded-xl hover:bg-sky-50 text-xs font-bold text-slate-800 flex items-center gap-2 transition"
                        >
                          <Sparkles size={15} className="text-[#0284C7] flex-shrink-0" />
                          <span>Giới thiệu Sky First Network & Tầm nhìn 2030</span>
                        </button>
                        <button
                          onClick={() => {
                            handleNavClick('units');
                            handleCloseSearch();
                          }}
                          className="w-full text-left p-2.5 rounded-xl hover:bg-sky-50 text-xs font-bold text-slate-800 flex items-center gap-2 transition"
                        >
                          <Building size={15} className="text-[#0284C7] flex-shrink-0" />
                          <span>5 Đơn vị trực thuộc mạng lưới SFN</span>
                        </button>
                        <button
                          onClick={() => {
                            handleNavClick('certificate');
                            handleCloseSearch();
                          }}
                          className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-50 text-xs font-bold text-emerald-800 flex items-center gap-2 transition"
                        >
                          <Award size={15} className="text-emerald-600 flex-shrink-0" />
                          <span>Cổng Tra cứu Giấy chứng nhận (GCN) Số</span>
                        </button>
                        <button
                          onClick={() => {
                            handleNavClick('sponsor');
                            handleCloseSearch();
                          }}
                          className="w-full text-left p-2.5 rounded-xl hover:bg-amber-50 text-xs font-bold text-amber-800 flex items-center gap-2 transition"
                        >
                          <Sparkles size={15} className="text-amber-600 flex-shrink-0" />
                          <span>Chương trình Tài trợ & Đồng hành</span>
                        </button>
                        <button
                          onClick={() => {
                            handleNavClick('join');
                            handleCloseSearch();
                          }}
                          className="w-full text-left p-2.5 rounded-xl hover:bg-sky-50 text-xs font-bold text-[#0284C7] flex items-center gap-2 transition"
                        >
                          <UserPlus size={15} className="text-[#0284C7] flex-shrink-0" />
                          <span>Gia nhập Mạng lưới (TNV / Core Team / Đối tác)</span>
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Mobile Drawer Menu (Gọn gàng, chỉ chứa các trang điều hướng cần thiết) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-sky-100 px-4 pt-3 pb-5 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-150">
          <div className="space-y-1">
            {navLinks.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition text-left ${
                    isActive
                      ? 'bg-sky-50 text-[#0284C7] border-l-4 border-[#0284C7]'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronRight size={16} className={isActive ? 'text-[#0284C7]' : 'text-slate-300'} />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
