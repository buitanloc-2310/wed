import React, { useState } from 'react';
import { Image as ImageIcon, Link as LinkIcon, Check, X, ExternalLink, Sparkles, AlertCircle } from 'lucide-react';

interface ImageUrlInputProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  placeholder?: string;
  category?: 'education' | 'volunteer' | 'tech' | 'media' | 'team' | 'general';
  helperText?: string;
}

const SAMPLE_PRESETS: Record<string, { label: string; url: string }[]> = {
  general: [
    {
      label: 'Thanh niên & Lãnh đạo',
      url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80',
    },
    {
      label: 'Học tập & Giảng đường',
      url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=80',
    },
    {
      label: 'Chiến dịch Cộng đồng',
      url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200&q=80',
    },
  ],
  education: [
    {
      label: 'Lớp học kỹ năng & Thảo luận',
      url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&q=80',
    },
    {
      label: 'Thuyết trình hội trường',
      url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&q=80',
    },
    {
      label: 'Không gian Mentorship 1-1',
      url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&q=80',
    },
  ],
  volunteer: [
    {
      label: 'Đội hình tình nguyện xanh',
      url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200&q=80',
    },
    {
      label: 'Trao quà & Áo ấm vùng cao',
      url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=80',
    },
    {
      label: 'Hoạt động dọn rác & Môi trường',
      url: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=1200&q=80',
    },
  ],
  tech: [
    {
      label: 'Chuyển đổi số & Lập trình',
      url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80',
    },
    {
      label: 'Bảo mật & Dữ liệu số',
      url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80',
    },
    {
      label: 'Hệ thống Tra cứu Chứng nhận',
      url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80',
    },
  ],
  media: [
    {
      label: 'Sáng tạo nội dung & Podcast',
      url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=1200&q=80',
    },
    {
      label: 'Quay phim & Truyền thông sự kiện',
      url: 'https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?w=1200&q=80',
    },
  ],
  team: [
    {
      label: 'Nam lãnh đạo trẻ',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80',
    },
    {
      label: 'Nữ giảng viên / Cố vấn',
      url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80',
    },
    {
      label: 'Chuyên viên đối ngoại',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    },
  ],
};

export const ImageUrlInput: React.FC<ImageUrlInputProps> = ({
  label = 'Đường dẫn ảnh (URL)',
  value = '',
  onChange,
  placeholder = 'https://images.unsplash.com/... hoặc link ảnh bất kỳ',
  category = 'general',
  helperText,
}) => {
  const [testError, setTestError] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  const presets = SAMPLE_PRESETS[category] || SAMPLE_PRESETS.general;

  const handleInputChange = (newVal: string) => {
    setTestError(false);
    onChange(newVal.trim());
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowPresets(!showPresets)}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0284C7] hover:text-[#0369A1] transition"
        >
          <Sparkles size={12} />
          {showPresets ? 'Ẩn gợi ý' : 'Gợi ý ảnh mẫu nhanh'}
        </button>
      </div>

      {/* Preset Pickers */}
      {showPresets && (
        <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-200/80 space-y-2">
          <p className="text-[11px] font-semibold text-slate-600">
            Chọn một ảnh mẫu có sẵn để áp dụng ngay:
          </p>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  handleInputChange(preset.url);
                  setShowPresets(false);
                }}
                className="px-2.5 py-1 text-xs bg-white hover:bg-sky-100/60 border border-sky-200 text-sky-900 rounded-lg font-medium transition shadow-2xs flex items-center gap-1.5"
              >
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input row */}
      <div className="relative flex items-center">
        <div className="absolute left-3 text-slate-400 pointer-events-none">
          <LinkIcon size={14} />
        </div>
        <input
          type="url"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-9 pr-20 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:border-transparent font-mono placeholder:font-sans transition"
        />
        <div className="absolute right-2 flex items-center gap-1">
          {value && (
            <>
              <button
                type="button"
                onClick={() => handleInputChange('')}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md transition"
                title="Xóa URL"
              >
                <X size={14} />
              </button>
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="p-1 text-[#0284C7] hover:text-[#0369A1] rounded-md transition"
                title="Mở ảnh trong tab mới"
              >
                <ExternalLink size={14} />
              </a>
            </>
          )}
        </div>
      </div>

      {/* Live Preview Box */}
      {value ? (
        <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="w-16 h-12 rounded-lg bg-slate-200 overflow-hidden relative flex-shrink-0 border border-slate-300">
            {!testError ? (
              <img
                src={value}
                alt="Preview"
                referrerPolicy="no-referrer"
                onError={() => setTestError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-rose-50 text-rose-500">
                <AlertCircle size={14} />
              </div>
            )}
          </div>
          <div className="text-[11px] leading-tight flex-1">
            {!testError ? (
              <div className="flex items-center gap-1 text-emerald-600 font-bold">
                <Check size={12} />
                <span>Ảnh hợp lệ & sẵn sàng hiển thị</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-rose-600 font-bold">
                <AlertCircle size={12} />
                <span>URL không tải được ảnh hoặc bị chặn bởi máy chủ</span>
              </div>
            )}
            <p className="text-slate-500 truncate max-w-xs mt-0.5 font-mono text-[10px]">
              {value}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-[11px] text-slate-500">
          {helperText || 'Dán đường dẫn ảnh bất kỳ (https://...). Nếu để trống, hệ thống sẽ hiển thị khung đồ họa mặc định.'}
        </p>
      )}
    </div>
  );
};
