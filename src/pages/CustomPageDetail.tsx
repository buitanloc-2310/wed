import React from 'react';
import { useDataContext } from '../context/DataContext';
import { PageRoute, CustomPage } from '../types';
import { ArrowLeft, Calendar, FileText, Sparkles, ExternalLink, ArrowRight, Clock } from 'lucide-react';

interface CustomPageDetailProps {
  slug: string;
  onNavigate: (route: PageRoute) => void;
}

export const CustomPageDetail: React.FC<CustomPageDetailProps> = ({ slug, onNavigate }) => {
  const { customPages } = useDataContext();

  const page = customPages.find(
    (p) => p.slug === slug || p.id === slug || p.slug === decodeURIComponent(slug)
  );

  if (!page) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <FileText size={48} className="text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Không tìm thấy trang yêu cầu</h2>
        <p className="text-sm text-slate-500 mt-2 max-w-md">
          Trang bạn tìm kiếm có thể đã bị xóa hoặc đường dẫn chưa chính xác.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="mt-6 px-5 py-2.5 bg-[#0284C7] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#0369A1] transition cursor-pointer"
        >
          Trở Về Trang Chủ
        </button>
      </div>
    );
  }

  // Nếu trang đang ở trạng thái bản nháp (chưa xuất bản)
  if (page.isPublished === false) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-4 shadow-2xs">
          <Clock size={28} />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Trang đang ở trạng thái bản nháp</h2>
        <p className="text-sm text-slate-500 mt-2 max-w-md">
          Trang thông tin này hiện đang được quản trị viên biên tập ở chế độ Bản nháp và chưa được xuất bản công khai.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="mt-6 px-5 py-2.5 bg-[#0284C7] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#0369A1] transition cursor-pointer"
        >
          Trở Về Trang Chủ
        </button>
      </div>
    );
  }

  const handleButtonClick = (url?: string) => {
    if (!url) return;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else if (url.startsWith('/')) {
      const cleanRoute = url.replace(/^\//, '') as PageRoute;
      onNavigate(cleanRoute);
    } else {
      onNavigate(url as PageRoute);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200/80 pt-8 pb-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-6 group transition"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Trang chủ</span>
          </button>

          {/* Badge */}
          {page.badge && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-black text-[#0284C7] mb-3 shadow-2xs">
              <Sparkles size={13} className="text-[#0284C7]" />
              <span>{page.badge}</span>
            </div>
          )}

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-snug">
            {page.title}
          </h1>

          {page.summary && (
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
              {page.summary}
            </p>
          )}

          <div className="flex items-center gap-4 mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 flex-wrap">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-slate-400" />
              <span>{page.publishedAt || 'Năm 2026'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Paper Canvas */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8">
        <article className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-10 space-y-8">
          {/* Main Image */}
          {page.imageUrl && (
            <div className="w-full h-64 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
              <img
                src={page.imageUrl}
                alt={page.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Text */}
          {page.contentFormatted && page.contentFormatted.includes('<') ? (
            <div
              className="formatted-content prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: page.contentFormatted }}
            />
          ) : (
            <div className="formatted-content prose prose-slate max-w-none space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
              {page.contentFormatted || page.content}
            </div>
          )}

          {/* Secondary Image if provided */}
          {page.secondaryImageUrl && (
            <div className="w-full h-60 sm:h-80 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
              <img
                src={page.secondaryImageUrl}
                alt="Ảnh minh họa đính kèm"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Action Buttons if configured */}
          {(page.buttonLabel || page.secondaryButtonLabel) && (
            <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-3">
              {page.buttonLabel && (
                <button
                  type="button"
                  onClick={() => handleButtonClick(page.buttonUrl)}
                  className="px-6 py-3 bg-[#0284C7] hover:bg-[#0369A1] text-white font-extrabold text-xs sm:text-sm rounded-xl transition shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <span>{page.buttonLabel}</span>
                  {page.buttonUrl?.startsWith('http') ? <ExternalLink size={15} /> : <ArrowRight size={15} />}
                </button>
              )}

              {page.secondaryButtonLabel && (
                <button
                  type="button"
                  onClick={() => handleButtonClick(page.secondaryButtonUrl)}
                  className="px-5 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer flex items-center gap-2"
                >
                  <span>{page.secondaryButtonLabel}</span>
                  {page.secondaryButtonUrl?.startsWith('http') ? <ExternalLink size={15} /> : <ArrowRight size={15} />}
                </button>
              )}
            </div>
          )}
        </article>
      </div>
    </div>
  );
};
