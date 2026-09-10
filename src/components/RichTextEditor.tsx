import React, { useRef, useState } from 'react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Quote,
  List,
  ListOrdered,
  Link as LinkIcon,
  Minus,
  Eye,
  Edit3
} from 'lucide-react';
import { RichTextRenderer } from './RichTextRenderer';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minHeight?: string;
  label?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Nhập nội dung bài viết...',
  minHeight = '320px',
  label = 'Nội dung chi tiết (Hỗ trợ định dạng rich text)'
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  const insertFormatting = (prefix: string, suffix: string = '', defaultPlaceholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;

    const selectedText = currentText.substring(start, end) || defaultPlaceholder;
    const newText =
      currentText.substring(0, start) +
      prefix +
      selectedText +
      suffix +
      currentText.substring(end);

    onChange(newText);

    // Reposition cursor
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 10);
  };

  const insertLinePrefix = (linePrefix: string, defaultPlaceholder: string = 'Tiêu đề') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const currentText = textarea.value;

    // Find the start of the current line
    const lastNewline = currentText.lastIndexOf('\n', start - 1);
    const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;

    const newText =
      currentText.substring(0, lineStart) +
      linePrefix +
      (start === lineStart ? defaultPlaceholder : '') +
      currentText.substring(lineStart);

    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      const newPos = lineStart + linePrefix.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 10);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
          <span>{label}</span>
          <span className="text-[11px] font-normal text-slate-500">
            ({value ? value.length : 0} ký tự)
          </span>
        </label>

        {/* Edit / Preview Tabs */}
        <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition ${
              activeTab === 'edit'
                ? 'bg-white text-[#0284C7] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Edit3 size={13} />
            <span>Soạn thảo</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition ${
              activeTab === 'preview'
                ? 'bg-white text-[#0284C7] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye size={13} />
            <span>Xem trước</span>
          </button>
        </div>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-100 transition-all">
        {/* Formatting Toolbar */}
        {activeTab === 'edit' && (
          <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50/90 border-b border-slate-200 text-slate-700">
            {/* Bold */}
            <button
              type="button"
              onClick={() => insertFormatting('**', '**', 'văn bản in đậm')}
              className="p-1.5 hover:bg-white hover:text-[#0284C7] hover:shadow-2xs rounded-lg transition"
              title="In đậm (Bold - Ctrl+B)"
            >
              <Bold size={15} />
            </button>

            {/* Italic */}
            <button
              type="button"
              onClick={() => insertFormatting('*', '*', 'văn bản in nghiêng')}
              className="p-1.5 hover:bg-white hover:text-[#0284C7] hover:shadow-2xs rounded-lg transition"
              title="In nghiêng (Italic - Ctrl+I)"
            >
              <Italic size={15} />
            </button>

            {/* Underline */}
            <button
              type="button"
              onClick={() => insertFormatting('<u>', '</u>', 'văn bản gạch chân')}
              className="p-1.5 hover:bg-white hover:text-[#0284C7] hover:shadow-2xs rounded-lg transition"
              title="Gạch chân (Underline)"
            >
              <UnderlineIcon size={15} />
            </button>

            <span className="w-px h-5 bg-slate-300 mx-1" />

            {/* Headings */}
            <button
              type="button"
              onClick={() => insertLinePrefix('# ', 'Tiêu Đề Lớn H1')}
              className="px-2 py-1 hover:bg-white hover:text-[#0284C7] hover:shadow-2xs rounded-lg text-xs font-black transition flex items-center gap-0.5"
              title="Tiêu đề H1"
            >
              <Heading1 size={15} />
            </button>

            <button
              type="button"
              onClick={() => insertLinePrefix('## ', 'Tiêu Đề Mục H2')}
              className="px-2 py-1 hover:bg-white hover:text-[#0284C7] hover:shadow-2xs rounded-lg text-xs font-extrabold transition flex items-center gap-0.5"
              title="Tiêu đề H2"
            >
              <Heading2 size={15} />
            </button>

            <button
              type="button"
              onClick={() => insertLinePrefix('### ', 'Tiêu Đề Phụ H3')}
              className="px-2 py-1 hover:bg-white hover:text-[#0284C7] hover:shadow-2xs rounded-lg text-xs font-bold transition flex items-center gap-0.5"
              title="Tiêu đề H3"
            >
              <Heading3 size={15} />
            </button>

            <button
              type="button"
              onClick={() => insertLinePrefix('#### ', 'Tiểu Mục H4')}
              className="px-2 py-1 hover:bg-white hover:text-[#0284C7] hover:shadow-2xs rounded-lg text-xs font-semibold transition flex items-center gap-0.5"
              title="Tiêu đề H4"
            >
              <Heading4 size={15} />
            </button>

            <span className="w-px h-5 bg-slate-300 mx-1" />

            {/* Quote */}
            <button
              type="button"
              onClick={() => insertLinePrefix('> ', 'Đoạn trích dẫn thông điệp quan trọng...')}
              className="p-1.5 hover:bg-white hover:text-[#0284C7] hover:shadow-2xs rounded-lg transition"
              title="Khối trích dẫn (Quote)"
            >
              <Quote size={15} />
            </button>

            {/* Bullet List */}
            <button
              type="button"
              onClick={() => insertLinePrefix('- ', 'Nội dung mục danh sách')}
              className="p-1.5 hover:bg-white hover:text-[#0284C7] hover:shadow-2xs rounded-lg transition"
              title="Danh sách gạch đầu dòng"
            >
              <List size={15} />
            </button>

            {/* Ordered List */}
            <button
              type="button"
              onClick={() => insertLinePrefix('1. ', 'Bước thực hiện')}
              className="p-1.5 hover:bg-white hover:text-[#0284C7] hover:shadow-2xs rounded-lg transition"
              title="Danh sách đánh số"
            >
              <ListOrdered size={15} />
            </button>

            {/* Link */}
            <button
              type="button"
              onClick={() => insertFormatting('[', '](https://skyfirst.network)', 'Tên liên kết')}
              className="p-1.5 hover:bg-white hover:text-[#0284C7] hover:shadow-2xs rounded-lg transition"
              title="Chèn liên kết (Link)"
            >
              <LinkIcon size={15} />
            </button>

            {/* Divider */}
            <button
              type="button"
              onClick={() => insertLinePrefix('---\n', '')}
              className="p-1.5 hover:bg-white hover:text-[#0284C7] hover:shadow-2xs rounded-lg transition"
              title="Chèn đường phân cách"
            >
              <Minus size={15} />
            </button>
          </div>
        )}

        {/* Editor or Preview Pane */}
        {activeTab === 'edit' ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            style={{ minHeight }}
            className="w-full p-4 text-sm text-slate-800 leading-relaxed font-normal focus:outline-hidden resize-y font-sans"
          />
        ) : (
          <div style={{ minHeight }} className="p-5 bg-slate-50/50 overflow-y-auto max-h-[500px]">
            {value ? (
              <RichTextRenderer content={value} />
            ) : (
              <p className="text-xs text-slate-400 italic">Chưa có nội dung để xem trước.</p>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
        <span>Mẹo: Bạn có thể bôi đen văn bản rồi nhấn B, I, U hoặc các nút tiêu đề để định dạng tức thì.</span>
        <span>Hỗ trợ chuẩn Markdown & HTML</span>
      </div>
    </div>
  );
};
