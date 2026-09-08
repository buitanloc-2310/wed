import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Link2,
  Minus,
  Eraser,
  Code,
  Eye,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  id?: string;
}

/**
 * Intelligent HTML sanitizer for text pasted from Word, Google Docs, or Websites
 * Keeps text structure, headings, bold, italic, underline, lists, tables, links, quotes,
 * while stripping intrusive Microsoft Office junk, scripts, stylesheets, and bloated margins.
 */
export function cleanPastedHtml(rawHtml: string): string {
  if (!rawHtml) return '';

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawHtml, 'text/html');

    // 1. Remove dangerous or intrusive elements
    const bannedTags = ['script', 'style', 'meta', 'link', 'xml', 'object', 'embed'];
    bannedTags.forEach((tag) => {
      const elements = doc.querySelectorAll(tag);
      elements.forEach((el) => el.remove());
    });

    // 2. Remove HTML comments (frequently added by Microsoft Word, e.g. <!--[if ...]> )
    const removeComments = (node: Node) => {
      for (let i = node.childNodes.length - 1; i >= 0; i--) {
        const child = node.childNodes[i];
        if (child.nodeType === Node.COMMENT_NODE) {
          node.removeChild(child);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          removeComments(child);
        }
      }
    };
    removeComments(doc.body);

    // 3. Clean elements and attributes
    const allElements = doc.body.querySelectorAll('*');
    allElements.forEach((element) => {
      const el = element as HTMLElement;
      const tagName = el.tagName.toLowerCase();

      // Remove Word specific elements like <o:p>
      if (tagName.startsWith('o:') || tagName.startsWith('w:')) {
        const span = doc.createElement('span');
        span.innerHTML = el.innerHTML;
        el.replaceWith(span);
        return;
      }

      // Keep only useful attributes
      const allowedAttrs = ['href', 'target', 'title', 'src', 'alt', 'colspan', 'rowspan'];
      const currentAttrs = Array.from(el.attributes);
      currentAttrs.forEach((attr) => {
        if (!allowedAttrs.includes(attr.name.toLowerCase())) {
          el.removeAttribute(attr.name);
        }
      });

      // Standardize links
      if (tagName === 'a') {
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener noreferrer');
      }

      // Convert spans with font-weight: bold into strong, italic into em
      if (tagName === 'span') {
        const style = el.getAttribute('style') || '';
        if (style.includes('font-weight: bold') || style.includes('font-weight: 700') || style.includes('font-weight:bold')) {
          const strong = doc.createElement('strong');
          strong.innerHTML = el.innerHTML;
          el.replaceWith(strong);
        } else if (style.includes('font-style: italic') || style.includes('font-style:italic')) {
          const em = doc.createElement('em');
          em.innerHTML = el.innerHTML;
          el.replaceWith(em);
        }
      }
    });

    // Return cleaned body HTML, trimming empty ends
    let clean = doc.body.innerHTML.trim();
    // Replace duplicate blank paragraphs from Word
    clean = clean.replace(/(<p[^>]*>(&nbsp;|\s)*<\/p>\s*){3,}/gi, '<p><br></p>');
    return clean;
  } catch {
    return rawHtml;
  }
}

/**
 * Escapes plain text into safe HTML string
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Normalizes initial text or HTML value for contentEditable
 */
function formatInitialContent(val: string): string {
  if (!val || val.trim().length === 0) {
    return '<p><br></p>';
  }
  // If it already contains HTML tags, return as is
  if (/<[a-z][\s\S]*>/i.test(val)) {
    return val;
  }
  // If plain text with line breaks, convert to paragraphs
  return val
    .split(/\r\n\r\n|\n\n/)
    .map((para) => {
      const line = para.trim();
      return line ? `<p>${escapeHtml(line).replace(/\r\n|\n/g, '<br/>')}</p>` : '<p><br></p>';
    })
    .join('');
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Nhập nội dung chi tiết hoặc dán trực tiếp từ Word, Google Docs, Website...',
  minHeight = '280px',
  id = 'rich-text-editor',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isCodeView, setIsCodeView] = useState(false);
  const [codeValue, setCodeValue] = useState(value || '');
  const [showPasteToast, setShowPasteToast] = useState(false);
  const isInternalChangeRef = useRef(false);

  // Sync internal editor HTML with prop value when updated externally
  useEffect(() => {
    if (isInternalChangeRef.current) {
      isInternalChangeRef.current = false;
      return;
    }
    setCodeValue(value || '');
    if (editorRef.current) {
      const currentHtml = editorRef.current.innerHTML;
      const targetHtml = formatInitialContent(value);
      if (currentHtml !== targetHtml && (!currentHtml || currentHtml === '<p><br></p>')) {
        editorRef.current.innerHTML = targetHtml;
      }
    }
  }, [value]);

  // Initial load
  useEffect(() => {
    if (editorRef.current && (!editorRef.current.innerHTML || editorRef.current.innerHTML === '<p><br></p>')) {
      editorRef.current.innerHTML = formatInitialContent(value);
    }
  }, []);

  const triggerChange = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      isInternalChangeRef.current = true;
      setCodeValue(html);
      onChange(html);
    }
  }, [onChange]);

  // Handle format actions using document.execCommand
  const applyFormat = (command: string, arg: string | undefined = undefined) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, arg);
      triggerChange();
    }
  };

  const handleHeadingChange = (tag: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      if (tag === 'p') {
        document.execCommand('formatBlock', false, '<p>');
      } else {
        document.execCommand('formatBlock', false, `<${tag}>`);
      }
      triggerChange();
    }
  };

  const handleInsertLink = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString() || '';
    const url = prompt('Nhập địa chỉ liên kết (URL):', 'https://');
    if (url && url !== 'https://') {
      if (selectedText.length > 0) {
        applyFormat('createLink', url);
      } else {
        const linkHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
        applyFormat('insertHTML', linkHtml);
      }
    }
  };

  /**
   * CRITICAL FEATURE: Preserve all formatting when pasting from Word, Docs, Web
   */
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();

    const clipboardData = e.clipboardData;
    const htmlData = clipboardData.getData('text/html');
    const textData = clipboardData.getData('text/plain');

    let contentToInsert = '';

    if (htmlData && htmlData.trim().length > 0) {
      // 1. Paste from rich text source (Word, Google Docs, Website)
      contentToInsert = cleanPastedHtml(htmlData);
    } else if (textData && textData.trim().length > 0) {
      // 2. Paste from plain text source (Notepad, code editor)
      contentToInsert = textData
        .split(/\r\n\r\n|\n\n/)
        .map((para) => {
          const trimmed = para.trim();
          return trimmed ? `<p>${escapeHtml(trimmed).replace(/\r\n|\n/g, '<br/>')}</p>` : '<p><br></p>';
        })
        .join('');
    }

    if (contentToInsert) {
      // Insert cleaned HTML into current cursor selection
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        if (editorRef.current) {
          editorRef.current.innerHTML += contentToInsert;
          triggerChange();
        }
      } else {
        const range = selection.getRangeAt(0);
        range.deleteContents();

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = contentToInsert;

        const fragment = document.createDocumentFragment();
        let node: Node | null;
        let lastNode: Node | null = null;
        while ((node = tempDiv.firstChild)) {
          lastNode = fragment.appendChild(node);
        }

        range.insertNode(fragment);
        if (lastNode) {
          range.setStartAfter(lastNode);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }
        triggerChange();
      }

      // Show temporary badge acknowledging formatted paste
      setShowPasteToast(true);
      setTimeout(() => {
        setShowPasteToast(false);
      }, 3000);
    }
  };

  const handleToggleCodeView = () => {
    if (!isCodeView) {
      // Switching to code view: pull current HTML from editor
      if (editorRef.current) {
        setCodeValue(editorRef.current.innerHTML);
      }
      setIsCodeView(true);
    } else {
      // Switching back to visual editor: set innerHTML from codeValue
      setIsCodeView(false);
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = codeValue;
          triggerChange();
        }
      }, 50);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setCodeValue(val);
    isInternalChangeRef.current = true;
    onChange(val);
  };

  return (
    <div id={id} className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs transition-all focus-within:border-[#0284C7] focus-within:ring-2 focus-within:ring-sky-100">
      {/* 1. Rich Text Format Toolbar */}
      <div className="bg-slate-50/90 border-b border-slate-200 px-3 py-2 flex flex-wrap items-center justify-between gap-1.5 select-none">
        <div className="flex flex-wrap items-center gap-1">
          {/* Heading selector */}
          <select
            title="Định dạng tiêu đề hoặc đoạn văn"
            onChange={(e) => handleHeadingChange(e.target.value)}
            disabled={isCodeView}
            className="text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-hidden focus:border-[#0284C7] cursor-pointer disabled:opacity-50"
            defaultValue="p"
          >
            <option value="p">Đoạn văn (Normal)</option>
            <option value="h2">Tiêu đề lớn (H2)</option>
            <option value="h3">Tiêu đề vừa (H3)</option>
            <option value="h4">Tiêu đề nhỏ (H4)</option>
          </select>

          <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Bold */}
          <button
            type="button"
            onClick={() => applyFormat('bold')}
            disabled={isCodeView}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition disabled:opacity-40"
            title="In đậm (Ctrl+B)"
          >
            <Bold size={15} />
          </button>

          {/* Italic */}
          <button
            type="button"
            onClick={() => applyFormat('italic')}
            disabled={isCodeView}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition disabled:opacity-40"
            title="In nghiêng (Ctrl+I)"
          >
            <Italic size={15} />
          </button>

          {/* Underline */}
          <button
            type="button"
            onClick={() => applyFormat('underline')}
            disabled={isCodeView}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition disabled:opacity-40"
            title="Gạch chân (Ctrl+U)"
          >
            <Underline size={15} />
          </button>

          {/* Strikethrough */}
          <button
            type="button"
            onClick={() => applyFormat('strikeThrough')}
            disabled={isCodeView}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition disabled:opacity-40"
            title="Gạch ngang chữ"
          >
            <Strikethrough size={15} />
          </button>

          <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Bullet list */}
          <button
            type="button"
            onClick={() => applyFormat('insertUnorderedList')}
            disabled={isCodeView}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition disabled:opacity-40"
            title="Danh sách dấu đầu dòng"
          >
            <List size={15} />
          </button>

          {/* Numbered list */}
          <button
            type="button"
            onClick={() => applyFormat('insertOrderedList')}
            disabled={isCodeView}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition disabled:opacity-40"
            title="Danh sách có số thứ tự"
          >
            <ListOrdered size={15} />
          </button>

          {/* Blockquote */}
          <button
            type="button"
            onClick={() => applyFormat('formatBlock', '<blockquote>')}
            disabled={isCodeView}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition disabled:opacity-40"
            title="Khối trích dẫn"
          >
            <Quote size={15} />
          </button>

          {/* Link */}
          <button
            type="button"
            onClick={handleInsertLink}
            disabled={isCodeView}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition disabled:opacity-40"
            title="Chèn liên kết đường dẫn"
          >
            <Link2 size={15} />
          </button>

          {/* Divider */}
          <button
            type="button"
            onClick={() => applyFormat('insertHorizontalRule')}
            disabled={isCodeView}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition disabled:opacity-40"
            title="Đường phân cách ngang"
          >
            <Minus size={15} />
          </button>

          {/* Clear Format */}
          <button
            type="button"
            onClick={() => applyFormat('removeFormat')}
            disabled={isCodeView}
            className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition disabled:opacity-40"
            title="Xóa định dạng đang chọn"
          >
            <Eraser size={15} />
          </button>
        </div>

        {/* Right side: Paste Format Indicator & Code Toggle */}
        <div className="flex items-center gap-2">
          {/* Format Preservation Badge */}
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-50 text-[#0284C7] border border-sky-200"
            title="Hệ thống tự động giữ nguyên chữ in đậm, in nghiêng, gạch chân, tiêu đề, danh sách, liên kết khi dán văn bản"
          >
            <Sparkles size={12} className="text-sky-600" />
            <span className="hidden sm:inline">Tự động giữ định dạng khi dán</span>
            <span className="sm:hidden">Giữ định dạng</span>
          </span>

          {/* Toggle HTML Code view */}
          <button
            type="button"
            onClick={handleToggleCodeView}
            className={`p-1.5 rounded-lg border text-xs font-bold transition flex items-center gap-1 ${
              isCodeView
                ? 'bg-slate-800 text-white border-slate-700'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
            title={isCodeView ? 'Quay về chế độ soạn thảo trực quan' : 'Xem và chỉnh sửa mã nguồn HTML'}
          >
            {isCodeView ? <Eye size={14} /> : <Code size={14} />}
            <span className="text-[11px] hidden md:inline">{isCodeView ? 'Trực quan' : 'Mã HTML'}</span>
          </button>
        </div>
      </div>

      {/* 2. Format Paste Feedback Banner */}
      {showPasteToast && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-1.5 flex items-center justify-between text-xs font-bold text-emerald-800 animate-in fade-in duration-200">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-emerald-600" />
            <span>Đã giữ nguyên vẹn định dạng văn bản (tiêu đề, in đậm, danh sách, liên kết...) từ clipboard!</span>
          </div>
          <span className="text-[10px] text-emerald-600 uppercase">Hoàn tất</span>
        </div>
      )}

      {/* 3. Editor Body */}
      {isCodeView ? (
        <textarea
          value={codeValue}
          onChange={handleCodeChange}
          placeholder="Mã HTML của nội dung bài viết..."
          style={{ minHeight }}
          className="w-full p-4 font-mono text-xs text-slate-800 bg-slate-900 text-slate-100 focus:outline-hidden resize-y leading-relaxed"
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={triggerChange}
          onPaste={handlePaste}
          data-placeholder={placeholder}
          style={{ minHeight }}
          className="formatted-content prose prose-slate max-w-none p-4 sm:p-5 text-sm sm:text-base text-slate-800 focus:outline-hidden overflow-y-auto leading-relaxed empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none"
        />
      )}
    </div>
  );
};
