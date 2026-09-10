import React, { useState } from 'react';
import {
  HelpCircle,
  Plus,
  Trash2,
  Edit,
  Save,
  Search,
  X,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { FAQItem, PageRoute } from '../../types';

interface AdminFaqsManagerProps {
  faqs: FAQItem[];
  onUpdateFAQ: (index: number, updates: Partial<FAQItem>) => void;
  onAddFAQ: (faq: FAQItem) => void;
  onDeleteFAQ: (index: number) => void;
  onNavigate: (route: PageRoute) => void;
  onShowToast: (msg: string) => void;
}

const CATEGORY_MAP: Record<string, { label: string; color: string }> = {
  general: { label: 'Chung', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  volunteer: { label: 'Tình nguyện', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  education: { label: 'Giáo dục', color: 'bg-sky-50 text-[#0284C7] border-sky-200' },
  cert: { label: 'Chứng nhận hệ thống Giấy chứng nhận', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' }
};

export const AdminFaqsManager: React.FC<AdminFaqsManagerProps> = ({
  faqs,
  onUpdateFAQ,
  onAddFAQ,
  onDeleteFAQ,
  onNavigate,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [faqToDelete, setFaqToDelete] = useState<{ index: number; question: string } | null>(null);

  const filteredFaqs = faqs
    .map((item, idx) => ({ ...item, originalIndex: idx }))
    .filter((f) => {
      const matchSearch =
        f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === 'all' || f.category === selectedCategory;
      return matchSearch && matchCat;
    });

  const handleCreate = () => {
    onAddFAQ({
      question: 'Câu hỏi thắc mắc mới cần giải đáp?',
      answer: 'Nội dung trả lời chi tiết, hướng dẫn quy trình đăng ký hoặc tham gia hệ sinh thái.',
      category: selectedCategory !== 'all' ? (selectedCategory as any) : 'general'
    });
    setExpandedIndex(faqs.length);
    onShowToast('Đã thêm câu hỏi FAQ mới!');
  };

  const handleConfirmDelete = () => {
    if (faqToDelete !== null) {
      onDeleteFAQ(faqToDelete.index);
      onShowToast(`Đã xóa câu hỏi FAQ!`);
      setFaqToDelete(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <HelpCircle size={20} className="text-[#0284C7]" />
            Quản Lý Câu Hỏi Thường Gặp (FAQs - {faqs.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Giải đáp thắc mắc của tình nguyện viên, đối tác và người tra cứu chứng chỉ.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              onNavigate('about');
              window.history.pushState({}, '', '/about');
            }}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
          >
            <ExternalLink size={14} />
            <span>Xem Trên Web</span>
          </button>

          <button
            type="button"
            onClick={handleCreate}
            className="px-4 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <Plus size={15} />
            <span>Thêm Câu Hỏi</span>
          </button>
        </div>
      </div>

      {/* Filter Category Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất cả ({faqs.length})
          </button>

          {Object.entries(CATEGORY_MAP).map(([catKey, catMeta]) => {
            const count = faqs.filter((f) => f.category === catKey).length;
            const isSelected = selectedCategory === catKey;
            return (
              <button
                key={catKey}
                type="button"
                onClick={() => setSelectedCategory(catKey)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#0284C7] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {catMeta.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm câu hỏi hoặc nội dung giải đáp..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-sky-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* FAQs List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            Không tìm thấy câu hỏi nào phù hợp với bộ lọc hiện tại.
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const idx = faq.originalIndex;
            const isExpanded = expandedIndex === idx;
            const catMeta = CATEGORY_MAP[faq.category] || CATEGORY_MAP.general;

            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-sky-300 p-4 shadow-xs transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${catMeta.color}`}>
                        {catMeta.label}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        #FAQ-{idx + 1}
                      </span>
                    </div>

                    <h3 className="text-sm font-black text-slate-900 leading-snug">
                      {faq.question}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                      className="px-2.5 py-1 text-xs font-bold text-[#0284C7] hover:bg-sky-50 rounded-lg transition flex items-center gap-1"
                    >
                      <span>{isExpanded ? 'Thu gọn' : 'Chỉnh sửa'}</span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setFaqToDelete({ index: idx, question: faq.question })}
                      className="p-1 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition"
                      title="Xóa câu hỏi này"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Expanded Edit Form */}
                {isExpanded && (
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                          Tiêu đề câu hỏi
                        </label>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => onUpdateFAQ(idx, { question: e.target.value })}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                          Nhóm chủ đề
                        </label>
                        <select
                          value={faq.category}
                          onChange={(e) => onUpdateFAQ(idx, { category: e.target.value as any })}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                        >
                          <option value="general">Chung</option>
                          <option value="volunteer">Tình nguyện</option>
                          <option value="education">Giáo dục</option>
                          <option value="cert">Chứng chỉ hệ thống Giấy chứng nhận</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Nội dung trả lời chi tiết
                      </label>
                      <textarea
                        rows={3}
                        value={faq.answer}
                        onChange={(e) => onUpdateFAQ(idx, { answer: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed"
                        placeholder="Nội dung giải đáp thắc mắc..."
                      />
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setExpandedIndex(null);
                          onShowToast('Đã cập nhật câu hỏi FAQ thành công!');
                        }}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1"
                      >
                        <Save size={13} />
                        <span>Xác Nhận Xong</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {faqToDelete !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle size={26} />
            </div>
            <h3 className="text-lg font-black text-slate-900">
              Xác Nhận Xóa Câu Hỏi FAQ?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Bạn có chắc muốn xóa câu hỏi <strong>"{faqToDelete.question}"</strong>? Hành động này không thể hoàn tác.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setFaqToDelete(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                Xóa câu hỏi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
