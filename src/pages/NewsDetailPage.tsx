import React from 'react';
import {
  Calendar,
  Clock,
  Tag,
  ArrowLeft,
  Share2,
  Copy,
  ChevronRight,
  AlertTriangle,
  BookOpen
} from 'lucide-react';
import { useDataContext } from '../context/DataContext';
import { PageRoute, NewsArticle } from '../types';
import { getArticleSlug } from '../utils/slug';
import { ImagePlaceholder } from '../components/ImagePlaceholder';
import { RichTextRenderer } from '../components/RichTextRenderer';
import { NewsComments } from '../components/NewsComments';

interface NewsDetailPageProps {
  newsSlugOrId: string;
  onNavigate: (route: PageRoute) => void;
  onShowToast: (message: string) => void;
  onSelectArticle?: (article: NewsArticle) => void;
}

export const NewsDetailPage: React.FC<NewsDetailPageProps> = ({
  newsSlugOrId,
  onNavigate,
  onShowToast,
  onSelectArticle
}) => {
  const { newsArticles } = useDataContext();

  const article = newsArticles.find(
    (a) =>
      getArticleSlug(a) === newsSlugOrId ||
      a.id === newsSlugOrId ||
      (a.slug && a.slug === newsSlugOrId)
  );

  if (!article || article.isPublished === false) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-4 shadow-sm">
          <AlertTriangle size={32} />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
          Không Tìm Thấy Bài Viết
        </h1>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Bài viết tin tức hoặc thông báo này có thể đã được gỡ bỏ hoặc chuyển sang địa chỉ mới.
        </p>
        <button
          type="button"
          onClick={() => {
            onNavigate('news');
            window.history.pushState({}, '', '/news');
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-sm rounded-xl shadow-sm transition"
        >
          <ArrowLeft size={16} />
          <span>Xem Danh Sách Tin Tức</span>
        </button>
      </div>
    );
  }

  const currentSlug = getArticleSlug(article);
  const fullPublicUrl = typeof window !== 'undefined' ? `${window.location.origin}/tin-tuc/${currentSlug}` : `/tin-tuc/${currentSlug}`;

  const handleCopyUrl = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullPublicUrl);
      onShowToast(`Đã sao chép liên kết bài viết: /tin-tuc/${currentSlug}`);
    }
  };

  const rawContent = article.contentFormatted || (Array.isArray(article.content) ? article.content.join('\n\n') : article.content);

  return (
    <div className="bg-slate-50/50 min-h-screen pb-20">

      {/* Top Header / Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200/80 sticky top-16 sm:top-20 z-20 backdrop-blur-md bg-white/95">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 truncate">
            <button
              onClick={() => {
                onNavigate('home');
                window.history.pushState({}, '', '/home');
              }}
              className="hover:text-[#0284C7] font-medium"
            >
              Trang chủ
            </button>
            <ChevronRight size={12} className="text-slate-400 shrink-0" />
            <button
              onClick={() => {
                onNavigate('news');
                window.history.pushState({}, '', '/news');
              }}
              className="hover:text-[#0284C7] font-medium"
            >
              Tin tức & Hoạt động
            </button>
            <ChevronRight size={12} className="text-slate-400 shrink-0" />
            <span className="text-slate-900 font-bold truncate max-w-[200px] sm:max-w-xs">
              {article.title}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyUrl}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition"
              title="Sao chép URL bài viết"
            >
              <Copy size={13} />
              <span className="hidden sm:inline">Sao chép URL</span>
            </button>
          </div>
        </div>
      </div>

      {/* Article Content Container */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-6">
          {/* Category & Meta */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-sky-50 text-[#0284C7] border border-sky-200 rounded-full font-extrabold uppercase tracking-wider text-[11px]">
                {article.categoryLabel}
              </span>
              <span className="text-slate-400 font-mono bg-slate-50 px-2 py-0.5 rounded-md text-[11px]">
                /tin-tuc/{currentSlug}
              </span>
            </div>

            <div className="flex items-center gap-4 text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar size={13} className="text-[#0284C7]" />
                {article.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={13} className="text-amber-500" />
                {article.readTime}
              </span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            {article.title}
          </h1>

          {/* Summary Quote / Lede */}
          {article.summary && (
            <div className="p-4 sm:p-5 bg-sky-50/60 rounded-2xl border-l-4 border-[#0284C7] text-slate-700 font-medium text-sm sm:text-base leading-relaxed">
              {article.summary}
            </div>
          )}

          {/* Feature Cover Image */}
          <div className="pt-2">
            <ImagePlaceholder
              imageUrl={article.imageUrl}
              sizeText="16:9 (1200x675px)"
              description={`Hình ảnh bản tin: ${article.title}`}
              aspectRatio="video"
              theme={article.theme || 'sky'}
              className="rounded-2xl overflow-hidden shadow-xs"
            />
          </div>

          {/* Main Body with Rich Text Rendering (B, I, U, H1, H2, H3, H4, Quotes, Lists, Links) */}
          <div className="pt-4 text-slate-800 leading-relaxed space-y-4">
            <RichTextRenderer content={rawContent} />
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <Tag size={14} className="text-slate-400 mr-1" />
              {article.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold hover:bg-slate-200 transition"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-600">
            <span>Thông tin được đăng tải trên website Sky First Network.</span>
            <div className="flex items-center gap-2">
              <a href="#binh-luan" className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-100 transition">Bình luận</a>
              <button type="button" onClick={handleCopyUrl} className="px-3 py-1.5 bg-white border border-slate-200 text-[#0284C7] font-bold rounded-lg hover:bg-sky-50 transition">Chia sẻ bài viết</button>
            </div>
          </div>
        </div>

        <NewsComments articleId={article.id} enabled={article.allowComments !== false} />

        {/* Other articles */}
        <div className="mt-10 space-y-4">
          <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen size={20} className="text-[#0284C7]" />
            Tin Tức Khác Từ Mạng Lưới
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {newsArticles
              .filter((n) => n.id !== article.id && n.isPublished !== false)
              .slice(0, 3)
              .map((other) => {
                const otherSlug = getArticleSlug(other);
                return (
                  <div
                    key={other.id}
                    onClick={() => {
                      window.history.pushState({}, '', `/tin-tuc/${otherSlug}`);
                      if (onSelectArticle) onSelectArticle(other);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-sky-300 hover:shadow-xs transition cursor-pointer group space-y-2"
                  >
                    <span className="text-[11px] font-bold text-[#0284C7]">{other.categoryLabel}</span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#0284C7] transition line-clamp-2 leading-snug">
                      {other.title}
                    </h4>
                    <span className="text-[11px] text-slate-400 block">{other.date}</span>
                  </div>
                );
              })}
          </div>
        </div>
      </article>
    </div>
  );
};
