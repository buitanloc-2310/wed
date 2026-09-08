import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  BookOpen, 
  Award, 
  Sparkles,
  Compass,
  GraduationCap,
  Users
} from 'lucide-react';
import { PROGRAMS_DATA, NEWS_DATA } from '../data/mockData';
import { PageRoute, Program, NewsArticle } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: PageRoute) => void;
  onSelectProgram: (program: Program) => void;
  onSelectArticle: (article: NewsArticle) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSelectProgram,
  onSelectArticle,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const matchedPrograms = trimmed
    ? PROGRAMS_DATA.filter(
        (p) =>
          p.title.toLowerCase().includes(trimmed) ||
          p.summary.toLowerCase().includes(trimmed) ||
          p.location.toLowerCase().includes(trimmed) ||
          p.categoryLabel.toLowerCase().includes(trimmed)
      )
    : [];

  const matchedNews = trimmed
    ? NEWS_DATA.filter(
        (n) =>
          n.title.toLowerCase().includes(trimmed) ||
          n.summary.toLowerCase().includes(trimmed) ||
          n.categoryLabel.toLowerCase().includes(trimmed)
      )
    : [];

  const sfecMatches = trimmed && (
    'trung tâm sfec đào tạo kỹ năng lãnh đạo ai công nghệ mentorship cố vấn'.includes(trimmed) ||
    'sfec'.includes(trimmed)
  );

  const hasResults = matchedPrograms.length > 0 || matchedNews.length > 0 || sfecMatches;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 sm:pt-20 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-sky-200 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/70">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center flex-shrink-0 border border-sky-100 shadow-2xs">
            <Search size={20} />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm chương trình, bài viết, khóa học SFEC..."
            className="flex-1 bg-transparent text-sm sm:text-base font-semibold text-slate-900 placeholder-slate-400 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
            >
              <X size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition shadow-2xs"
          >
            Đóng
          </button>
        </div>

        {/* Results / Suggestions Container */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 divide-y divide-slate-100">
          
          {/* If no search input yet, show quick navigations */}
          {!trimmed && (
            <div className="space-y-4">
              <div className="text-xs font-extrabold text-[#0284C7] uppercase tracking-wider">
                Truy Cập Nhanh
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    onNavigate('programs');
                    onClose();
                  }}
                  className="p-3.5 rounded-2xl bg-sky-50/70 hover:bg-sky-100/70 border border-sky-200 text-left transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <Compass size={18} className="text-[#0284C7]" />
                    <span className="text-xs sm:text-sm font-bold text-slate-800">Chương Trình Hoạt Động</span>
                  </div>
                  <ArrowRight size={14} className="text-[#0284C7] opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                <button
                  onClick={() => {
                    onNavigate('units');
                    onClose();
                  }}
                  className="p-3.5 rounded-2xl bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200 text-left transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <GraduationCap size={18} className="text-amber-600" />
                    <span className="text-xs sm:text-sm font-bold text-slate-800">Khóa Học SFEC</span>
                  </div>
                  <ArrowRight size={14} className="text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                <button
                  onClick={() => {
                    onNavigate('news');
                    onClose();
                  }}
                  className="p-3.5 rounded-2xl bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200 text-left transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen size={18} className="text-emerald-600" />
                    <span className="text-xs sm:text-sm font-bold text-slate-800">Bản Tin SFN</span>
                  </div>
                  <ArrowRight size={14} className="text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                <button
                  onClick={() => {
                    onNavigate('certificate');
                    onClose();
                  }}
                  className="p-3.5 rounded-2xl bg-indigo-50/70 hover:bg-indigo-100/70 border border-indigo-200 text-left transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <Award size={18} className="text-indigo-600" />
                    <span className="text-xs sm:text-sm font-bold text-slate-800">Tra Cứu GCN</span>
                  </div>
                  <ArrowRight size={14} className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </div>
          )}

          {/* If Searching and Results Found */}
          {trimmed && hasResults && (
            <div className="space-y-5">
              
              {/* Programs Matches */}
              {matchedPrograms.length > 0 && (
                <div className="space-y-2.5">
                  <div className="text-xs font-extrabold text-[#0284C7] uppercase tracking-wider flex items-center gap-1.5">
                    <Compass size={14} />
                    <span>Chương Trình & Dự Án ({matchedPrograms.length})</span>
                  </div>
                  <div className="space-y-2">
                    {matchedPrograms.map((prog) => (
                      <button
                        key={prog.id}
                        onClick={() => {
                          onSelectProgram(prog);
                          onClose();
                        }}
                        className="w-full p-3 rounded-2xl bg-white hover:bg-sky-50/80 border border-slate-200 text-left transition flex items-center justify-between gap-3 group"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-sky-100 text-[#0284C7]">
                              {prog.categoryLabel}
                            </span>
                            <span className="text-xs font-bold text-slate-900 group-hover:text-[#0284C7] transition">
                              {prog.title}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-1">
                            {prog.summary}
                          </p>
                        </div>
                        <ArrowRight size={14} className="text-[#0284C7] flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* SFEC Matches */}
              {sfecMatches && (
                <div className="space-y-2.5 pt-4">
                  <div className="text-xs font-extrabold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
                    <GraduationCap size={14} />
                    <span>Trung Tâm Đào Tạo SFEC</span>
                  </div>
                  <button
                    onClick={() => {
                      onNavigate('units');
                      onClose();
                    }}
                    className="w-full p-3 rounded-2xl bg-amber-50/60 hover:bg-amber-100/60 border border-amber-200 text-left transition flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        Khóa Đào Tạo Kỹ Năng & Mentorship Hub SFEC
                      </div>
                      <p className="text-xs text-slate-500">
                        Chương trình Leadership, Ứng dụng AI và Cố vấn nghề nghiệp 1-on-1
                      </p>
                    </div>
                    <ArrowRight size={14} className="text-amber-600 flex-shrink-0" />
                  </button>
                </div>
              )}

              {/* News Matches */}
              {matchedNews.length > 0 && (
                <div className="space-y-2.5 pt-4">
                  <div className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen size={14} />
                    <span>Bản Tin & Sự Kiện ({matchedNews.length})</span>
                  </div>
                  <div className="space-y-2">
                    {matchedNews.map((news) => (
                      <button
                        key={news.id}
                        onClick={() => {
                          onSelectArticle(news);
                          onClose();
                        }}
                        className="w-full p-3 rounded-2xl bg-white hover:bg-emerald-50/80 border border-slate-200 text-left transition flex items-center justify-between gap-3 group"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700">
                              {news.categoryLabel}
                            </span>
                            <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition">
                              {news.title}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-1">
                            {news.summary}
                          </p>
                        </div>
                        <ArrowRight size={14} className="text-emerald-600 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* No results */}
          {trimmed && !hasResults && (
            <div className="text-center py-8 space-y-2">
              <p className="text-sm font-bold text-slate-700">
                Không tìm thấy nội dung phù hợp với "{query}"
              </p>
              <p className="text-xs text-slate-500">
                Vui lòng thử tìm kiếm bằng từ khóa khác như "lãnh đạo", "tình nguyện", "SFEC", "AI"...
              </p>
            </div>
          )}

        </div>

        {/* Footer hint */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 px-5 flex items-center justify-between text-[11px] text-slate-400">
          <span>Nhấn <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px] text-slate-600">ESC</kbd> để đóng</span>
          <span>Tìm kiếm thông minh trên toàn mạng lưới SFN</span>
        </div>
      </div>
    </div>
  );
};
