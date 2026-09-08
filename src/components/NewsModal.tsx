import React from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Share2, 
  Tag, 
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { NewsArticle } from '../types';
import { ImagePlaceholder } from './ImagePlaceholder';

interface NewsModalProps {
  article: NewsArticle | null;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const NewsModal: React.FC<NewsModalProps> = ({
  article,
  onClose,
  onShowToast,
}) => {
  if (!article) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    onShowToast('Đã sao chép liên kết bài viết vào bộ nhớ tạm!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-900/40 hover:bg-slate-900/70 text-white flex items-center justify-center transition"
          aria-label="Đóng"
        >
          <X size={18} />
        </button>

        {/* Embedded Image Placeholder */}
        <div className="p-4 bg-slate-50 border-b border-slate-100">
          <ImagePlaceholder
            sizeText={article.imageSizeText}
            description={article.imageDescription}
            aspectRatio="video"
            theme={article.theme}
            imageUrl={article.imageUrl}
          />
        </div>

        <div className="p-6 sm:p-10 space-y-6">
          
          {/* Metadata */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500">
              <span className="bg-sky-50 text-[#0284C7] font-extrabold px-3 py-1 rounded-full border border-sky-200">
                {article.categoryLabel}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {article.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {article.readTime}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <User size={14} />
                {article.author}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
              {article.title}
            </h1>
          </div>

          {/* Lead Summary */}
          <div className="p-4 sm:p-5 bg-sky-50/70 rounded-2xl border-l-4 border-[#0284C7] text-xs sm:text-sm text-slate-700 font-medium italic leading-relaxed">
            "{article.summary}"
          </div>

          {/* Body Content */}
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-4 font-normal">
            <p>
              {article.content}
            </p>
            <p>
              Trong thời gian tới, Sky First Network sẽ tiếp tục mở rộng các đợt tập huấn và tạo điều kiện tối đa cho các bạn trẻ đóng góp năng lực, phát triển toàn diện bản thân và xây dựng các dự án có ý nghĩa xã hội sâu sắc.
            </p>
          </div>

          {/* Tags */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((t, idx) => (
                <span key={idx} className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-lg">
                  #{t}
                </span>
              ))}
            </div>

            <button
              onClick={handleShare}
              className="px-4 py-2 rounded-xl bg-sky-50 text-[#0284C7] hover:bg-sky-100 text-xs font-bold transition flex items-center gap-2"
            >
              <Share2 size={15} />
              <span>Chia sẻ bài viết</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
