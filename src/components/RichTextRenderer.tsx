import React from 'react';

interface RichTextRendererProps {
  content: string | string[];
  className?: string;
}

export const RichTextRenderer: React.FC<RichTextRendererProps> = ({ content, className = '' }) => {
  const text = Array.isArray(content) ? content.join('\n\n') : content;
  if (!text) return null;

  const lines = text.split('\n');
  const renderedElements: React.ReactNode[] = [];
  let listBuffer: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flushList = (key: string) => {
    if (!listBuffer) return null;
    const { type, items } = listBuffer;
    listBuffer = null;

    if (type === 'ul') {
      return (
        <ul key={key} className="space-y-2 my-4 pl-5 list-disc text-slate-700">
          {items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInlineFormatted(item)}
            </li>
          ))}
        </ul>
      );
    } else {
      return (
        <ol key={key} className="space-y-2 my-4 pl-5 list-decimal text-slate-700">
          {items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInlineFormatted(item)}
            </li>
          ))}
        </ol>
      );
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Check list item
    if (/^[-*•]\s+/.test(trimmed)) {
      const itemText = trimmed.replace(/^[-*•]\s+/, '');
      if (listBuffer && listBuffer.type === 'ul') {
        listBuffer.items.push(itemText);
      } else {
        if (listBuffer) renderedElements.push(flushList(`list-before-${idx}`));
        listBuffer = { type: 'ul', items: [itemText] };
      }
      return;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const itemText = trimmed.replace(/^\d+\.\s+/, '');
      if (listBuffer && listBuffer.type === 'ol') {
        listBuffer.items.push(itemText);
      } else {
        if (listBuffer) renderedElements.push(flushList(`list-before-${idx}`));
        listBuffer = { type: 'ol', items: [itemText] };
      }
      return;
    }

    // Flush any pending list before rendering other block elements
    if (listBuffer) {
      renderedElements.push(flushList(`list-${idx}`));
    }

    // Empty line
    if (!trimmed) {
      return;
    }

    // Horizontal rule
    if (/^---|\*\*\*|___$/.test(trimmed)) {
      renderedElements.push(<hr key={idx} className="my-6 border-slate-200" />);
      return;
    }

    // Headings
    if (trimmed.startsWith('#### ')) {
      renderedElements.push(
        <h4 key={idx} className="text-base sm:text-lg font-bold text-slate-900 mt-5 mb-2 tracking-tight">
          {renderInlineFormatted(trimmed.slice(5))}
        </h4>
      );
      return;
    }

    if (trimmed.startsWith('### ')) {
      renderedElements.push(
        <h3 key={idx} className="text-lg sm:text-xl font-bold text-slate-900 mt-6 mb-2.5 tracking-tight">
          {renderInlineFormatted(trimmed.slice(4))}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith('## ')) {
      renderedElements.push(
        <h2 key={idx} className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-7 mb-3 tracking-tight border-b border-slate-100 pb-1.5">
          {renderInlineFormatted(trimmed.slice(3))}
        </h2>
      );
      return;
    }

    if (trimmed.startsWith('# ')) {
      renderedElements.push(
        <h1 key={idx} className="text-2xl sm:text-3xl font-black text-slate-900 mt-8 mb-4 tracking-tight">
          {renderInlineFormatted(trimmed.slice(2))}
        </h1>
      );
      return;
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      renderedElements.push(
        <blockquote
          key={idx}
          className="border-l-4 border-[#0284C7] bg-sky-50/60 pl-4 py-3 my-4 rounded-r-xl text-slate-700 italic font-medium"
        >
          {renderInlineFormatted(trimmed.slice(2))}
        </blockquote>
      );
      return;
    }

    // Regular paragraph
    renderedElements.push(
      <p key={idx} className="my-3 text-slate-700 leading-relaxed text-sm sm:text-base">
        {renderInlineFormatted(trimmed)}
      </p>
    );
  });

  if (listBuffer) {
    renderedElements.push(flushList('list-end'));
  }

  return <div className={`prose-slate max-w-none ${className}`}>{renderedElements}</div>;
};

/**
 * Parses inline formatting:
 * **bold** or <b>bold</b>
 * *italic* or <i>italic</i>
 * <u>underline</u>
 * [text](url)
 */
function renderInlineFormatted(str: string): React.ReactNode {
  // Convert HTML <b>, <i>, <u> tags to normalized markdown tags first
  let text = str
    .replace(/<b>(.*?)<\/b>/gi, '**$1**')
    .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<i>(.*?)<\/i>/gi, '*$1*')
    .replace(/<em>(.*?)<\/em>/gi, '*$1*');

  // Regex tokenizer to split tokens
  // Matches: **bold**, *italic*, <u>underline</u>, [label](url)
  const regex = /(\*\*.*?\*\*|\*.*?\*|<u>.*?<\/u>|\[.*?\]\(.*?\))/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Bold **text**
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={index} className="font-bold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Italic *text*
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return (
        <em key={index} className="italic text-slate-800">
          {part.slice(1, -1)}
        </em>
      );
    }

    // Underline <u>text</u>
    if (part.startsWith('<u>') && part.endsWith('</u>') && part.length >= 7) {
      return (
        <u key={index} className="underline decoration-[#0284C7] decoration-1 underline-offset-2">
          {part.slice(3, -4)}
        </u>
      );
    }

    // Link [label](url)
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      return (
        <a
          key={index}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0284C7] hover:underline font-semibold inline-flex items-center gap-0.5"
        >
          {linkMatch[1]}
        </a>
      );
    }

    return part;
  });
}
