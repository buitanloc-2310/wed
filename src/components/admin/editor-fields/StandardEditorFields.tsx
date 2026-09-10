import React from 'react';
import { FileText, Image as ImageIcon, Link as LinkIcon, Sparkles } from 'lucide-react';
import { RichTextEditor } from '../RichTextEditor';

interface StandardEditorFieldsProps {
  badge: string;
  setBadge: (val: string) => void;
  title: string;
  setTitle: (val: string) => void;
  summary: string;
  setSummary: (val: string) => void;
  imageUrl: string;
  setImageUrl: (val: string) => void;
  contentFormatted: string;
  setContentFormatted: (val: string) => void;
  secondaryImageUrl: string;
  setSecondaryImageUrl: (val: string) => void;
  buttonLabel: string;
  setButtonLabel: (val: string) => void;
  buttonUrl: string;
  setButtonUrl: (val: string) => void;
  secondaryButtonLabel: string;
  setSecondaryButtonLabel: (val: string) => void;
  secondaryButtonUrl: string;
  setSecondaryButtonUrl: (val: string) => void;
}

export const StandardEditorFields: React.FC<StandardEditorFieldsProps> = ({
  badge,
  setBadge,
  title,
  setTitle,
  summary,
  setSummary,
  imageUrl,
  setImageUrl,
  contentFormatted,
  setContentFormatted,
  secondaryImageUrl,
  setSecondaryImageUrl,
  buttonLabel,
  setButtonLabel,
  buttonUrl,
  setButtonUrl,
  secondaryButtonLabel,
  setSecondaryButtonLabel,
  secondaryButtonUrl,
  setSecondaryButtonUrl,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Khối Đầu Trang */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              1. Khối Đầu Trang (Tiêu Đề & Giới Thiệu)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Hiển thị ở phần đầu trang bài viết / thông tin
          </span>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Huy hiệu nổi bật (Badge)
          </label>
          <input
            type="text"
            value={badge}
            onChange={(e) => setBadge(e.target.value)}
            placeholder="VD: HỎI ĐÁP & HỖ TRỢ hoặc QUY CHẾ HOẠT ĐỘNG"
            className="w-full text-xs font-bold text-[#0284C7] px-3 py-2 bg-sky-50/50 border border-sky-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Tiêu đề trang <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tiêu đề trang..."
            className="w-full text-xl sm:text-2xl font-black text-slate-900 border border-slate-200 rounded-xl px-4 py-3 focus:border-[#0284C7] focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Đoạn tóm tắt / Mở đầu trang
          </label>
          <textarea
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Nhập đoạn văn tóm tắt nội dung chính của trang..."
            className="w-full text-xs sm:text-sm text-slate-700 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden leading-relaxed"
          />
        </div>
      </div>

      {/* 2. Hình Ảnh Đại Diện / Banner Đầu Trang */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ImageIcon size={16} className="text-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              2. Hình Ảnh Đại Diện (Banner Đầu Trang)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Chèn ảnh bằng liên kết URL
          </span>
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
            <LinkIcon size={14} className="text-[#0284C7]" />
            Đường dẫn liên kết hình ảnh (URL)
          </label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="/media/... hoặc https://..."
            className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden font-mono"
          />
          {imageUrl && (
            <div className="mt-3 h-48 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
              <img
                src={imageUrl}
                alt="Banner preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* 3. Nội Dung Văn Bản Chi Tiết */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              3. Nội Dung Văn Bản Chi Tiết
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            Tự động giữ nguyên định dạng khi dán từ Word, Docs hoặc Website khác
          </span>
        </div>

        <div>
          <RichTextEditor
            id="editor-standard-content"
            value={contentFormatted}
            onChange={setContentFormatted}
            placeholder="Soạn thảo nội dung bài viết chi tiết hoặc dán trực tiếp từ nơi khác..."
            minHeight="320px"
          />
        </div>
      </div>

      {/* 4. Hình Ảnh Minh Họa Bổ Sung */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ImageIcon size={16} className="text-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              4. Hình Ảnh Minh Họa Bổ Sung (Dưới Bài Viết)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Chèn ảnh bằng liên kết URL (tùy chọn)
          </span>
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
            <LinkIcon size={14} className="text-[#0284C7]" />
            Đường dẫn liên kết hình ảnh phụ (URL)
          </label>
          <input
            type="text"
            value={secondaryImageUrl}
            onChange={(e) => setSecondaryImageUrl(e.target.value)}
            placeholder="/media/... hoặc https://..."
            className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0284C7] focus:outline-hidden font-mono"
          />
          {secondaryImageUrl && (
            <div className="mt-3 h-48 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
              <img
                src={secondaryImageUrl}
                alt="Secondary preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* 5. Các Nút Bấm Hành Động Trên Trang */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <LinkIcon size={16} className="text-[#0284C7]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              5. Các Nút Bấm Hành Động Trên Trang
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Các nút điều hướng ở cuối nội dung trang
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nút 1 */}
          <div className="p-3.5 rounded-xl bg-sky-50/50 border border-sky-100 space-y-2.5">
            <span className="text-xs font-extrabold text-[#0284C7] block">
              Nút hành động chính 1
            </span>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Tên nút
              </label>
              <input
                type="text"
                value={buttonLabel}
                onChange={(e) => setButtonLabel(e.target.value)}
                placeholder="VD: Gửi câu hỏi cho chúng tôi"
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Liên kết trỏ đến
              </label>
              <input
                type="text"
                value={buttonUrl}
                onChange={(e) => setButtonUrl(e.target.value)}
                placeholder="/contact"
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono"
              />
            </div>
          </div>

          {/* Nút 2 */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <span className="text-xs font-extrabold text-slate-700 block">
              Nút hành động phụ 2
            </span>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Tên nút
              </label>
              <input
                type="text"
                value={secondaryButtonLabel}
                onChange={(e) => setSecondaryButtonLabel(e.target.value)}
                placeholder="VD: Tra cứu chứng nhận"
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Liên kết trỏ đến
              </label>
              <input
                type="text"
                value={secondaryButtonUrl}
                onChange={(e) => setSecondaryButtonUrl(e.target.value)}
                placeholder="/certificate"
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
