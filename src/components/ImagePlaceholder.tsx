import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, AlertCircle } from 'lucide-react';

interface ImagePlaceholderProps {
  sizeText?: string;
  description?: string;
  aspectRatio?: 'video' | 'square' | '4/3' | '21/9' | '3/2' | 'auto';
  className?: string;
  theme?: 'sky' | 'emerald' | 'amber' | 'rose' | 'navy' | 'indigo' | 'purple' | 'neutral' | string;
  imageUrl?: string;
}

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  sizeText = '16:9 (800x450px)',
  description = 'Hình ảnh hoạt động Sky First Network',
  aspectRatio = 'video',
  className = '',
  theme = 'sky',
  imageUrl,
}) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [imageUrl]);

  const activeSrc = !imageError && imageUrl ? imageUrl : null;

  const aspectClass = {
    video: 'aspect-[16/9]',
    square: 'aspect-square',
    '4/3': 'aspect-[4/3]',
    '21/9': 'aspect-[21/9]',
    '3/2': 'aspect-[3/2]',
    auto: 'min-h-[180px]',
  }[aspectRatio] || 'aspect-[16/9]';

  const themeMap: Record<string, { bg: string; border: string; iconBg: string; tagBg: string; text: string }> = {
    sky: {
      bg: 'bg-gradient-to-br from-sky-50 via-blue-50/60 to-indigo-50/40',
      border: 'border-sky-300/80 hover:border-sky-400',
      iconBg: 'bg-sky-500/10 text-sky-600',
      tagBg: 'bg-sky-100/90 text-sky-800 border-sky-200',
      text: 'text-sky-950',
    },
    emerald: {
      bg: 'bg-gradient-to-br from-emerald-50 via-teal-50/60 to-green-50/40',
      border: 'border-emerald-300/80 hover:border-emerald-400',
      iconBg: 'bg-emerald-500/10 text-emerald-600',
      tagBg: 'bg-emerald-100/90 text-emerald-800 border-emerald-200',
      text: 'text-emerald-950',
    },
    amber: {
      bg: 'bg-gradient-to-br from-amber-50 via-orange-50/60 to-yellow-50/40',
      border: 'border-amber-300/80 hover:border-amber-400',
      iconBg: 'bg-amber-500/10 text-amber-600',
      tagBg: 'bg-amber-100/90 text-amber-800 border-amber-200',
      text: 'text-amber-950',
    },
    rose: {
      bg: 'bg-gradient-to-br from-rose-50 via-pink-50/60 to-red-50/40',
      border: 'border-rose-300/80 hover:border-rose-400',
      iconBg: 'bg-rose-500/10 text-rose-600',
      tagBg: 'bg-rose-100/90 text-rose-800 border-rose-200',
      text: 'text-rose-950',
    },
    indigo: {
      bg: 'bg-gradient-to-br from-indigo-50 via-blue-50/60 to-purple-50/40',
      border: 'border-indigo-300/80 hover:border-indigo-400',
      iconBg: 'bg-indigo-500/10 text-indigo-600',
      tagBg: 'bg-indigo-100/90 text-indigo-800 border-indigo-200',
      text: 'text-indigo-950',
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-50 via-indigo-50/60 to-pink-50/40',
      border: 'border-purple-300/80 hover:border-purple-400',
      iconBg: 'bg-purple-500/10 text-purple-600',
      tagBg: 'bg-purple-100/90 text-purple-800 border-purple-200',
      text: 'text-purple-950',
    },
    navy: {
      bg: 'bg-gradient-to-br from-[#062A67]/90 via-[#0648B8]/85 to-[#0b387e]',
      border: 'border-sky-400/40 hover:border-sky-400',
      iconBg: 'bg-white/10 text-sky-300',
      tagBg: 'bg-white/15 text-white border-white/20',
      text: 'text-white',
    },
    neutral: {
      bg: 'bg-gradient-to-br from-slate-50 via-slate-100/70 to-slate-200/40',
      border: 'border-slate-300 hover:border-slate-400',
      iconBg: 'bg-slate-200 text-slate-700',
      tagBg: 'bg-white text-slate-700 border-slate-200',
      text: 'text-slate-800',
    },
  };

  const themeStyles = themeMap[theme] || themeMap.sky;

  if (activeSrc) {
    return (
      <div className={`relative ${aspectClass} rounded-2xl overflow-hidden group ${className} shadow-inner bg-slate-900/5`}>
        <img
          src={activeSrc}
          alt={description}
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative ${aspectClass} rounded-2xl border-2 border-dashed ${themeStyles.border} ${themeStyles.bg} flex flex-col items-center justify-center p-4 text-center select-none ${className}`}
    >
      <div className="flex flex-col items-center justify-center space-y-2 max-w-[90%]">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${themeStyles.iconBg} flex items-center justify-center shadow-xs`}>
          {imageError ? <AlertCircle size={22} className="text-amber-600" /> : <ImageIcon size={22} className="opacity-90" />}
        </div>

        <div className="space-y-1">
          <div className={`inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full border shadow-2xs ${themeStyles.tagBg}`}>
            <span>{imageError ? 'Lỗi tải ảnh' : `Hình ảnh SFN [${sizeText}]`}</span>
          </div>
          <p className={`text-xs font-semibold ${themeStyles.text} line-clamp-2 leading-snug`}>
            {imageError ? 'Không thể nạp ảnh từ đường dẫn URL. Hiển thị khung mặc định.' : description}
          </p>
        </div>
      </div>
    </div>
  );
};
