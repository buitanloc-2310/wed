import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Edit2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  Calendar,
  User,
  Clock,
  Tag,
  Save,
  Send,
  Link as LinkIcon,
  Sparkles,
  Image as ImageIcon,
  Check,
  Bold,
  Italic,
  Quote,
  List,
  ListOrdered,
  Minus,
  MessageSquare
} from 'lucide-react';
import { NewsArticle, PageRoute, AdminManagerActionRef } from '../../types';
import { ImageUrlInput } from '../ImageUrlInput';
import { generateSlug, getArticleSlug } from '../../utils/slug';

interface AdminNewsManagerProps {
  articles: NewsArticle[];
  onUpdateArticle: (id: string, updates: Partial<NewsArticle>) => void;
  onAddArticle: (article: NewsArticle) => void;
  onDeleteArticle: (id: string) => void;
  onNavigate: (route: PageRoute) => void;
  onShowToast: (msg: string) => void;
  initialSlug?: string;
  actionRef?: React.MutableRefObject<AdminManagerActionRef | null>;
  onViewModeChange?: (mode: 'list' | 'edit') => void;
}

export const AdminNewsManager: React.FC<AdminNewsManagerProps> = ({
  articles,
  onUpdateArticle,
  onAddArticle,
  onDeleteArticle,
  onNavigate,
  onShowToast,
  initialSlug,
  actionRef,
  onViewModeChange,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'edit'>('list');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [articleToDelete, setArticleToDelete] = useState<NewsArticle | null>(null);

  // Sync initialSlug from props if provided
  React.useEffect(() => {
    if (initialSlug) {
      const target = articles.find((a) => a.slug === initialSlug || a.id === initialSlug);
      if (target) {
        setSelectedArticleId(target.id);
        setViewMode('edit');
      }
    }
  }, [initialSlug, articles]);

  const activeArticle = articles.find((a) => a.id === selectedArticleId) || articles[0];

  const publishedCount = articles.filter((a) => a.isPublished !== false).length;
  const draftCount = articles.filter((a) => a.isPublished === false).length;

  const handleCreateNew = () => {
    const newId = `news-${Date.now()}`;
    const initialTitle = 'Tiêu Đề Bài Viết Tin Tức Mới';
    const initialSlug = generateSlug(initialTitle);

    const newArticle: NewsArticle = {
      id: newId,
      slug: initialSlug,
      title: initialTitle,
      category: 'announcement',
      categoryLabel: 'Thông Báo',
      date: new Date().toLocaleDateString('vi-VN'),
      summary: 'Đoạn tóm tắt mở đầu (Sapo) giới thiệu ngắn gọn các điểm cốt lõi của bài viết.',
      content: 'Nội dung chi tiết của bài viết được trình bày ở đây với đầy đủ thông tin, luận điểm và hình ảnh minh họa.',
      contentFormatted: '## Tiêu đề phần 1\nNội dung chi tiết của bài viết được trình bày ở đây với đầy đủ thông tin, luận điểm và hình ảnh minh họa.\n\n## Tiêu đề phần 2\nTiếp tục triển khai các nội dung quan trọng tiếp theo.',
      author: 'Sky First Network',
      publishedAt: new Date().toISOString().split('T')[0],
      readTime: '3 phút đọc',
      imageUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&q=80',
      imageDescription: 'Ảnh minh họa bài viết tin tức',
      tags: [],
      isPublished: true,
      allowComments: true,
      source: ''
    };

    onAddArticle(newArticle);
    setSelectedArticleId(newId);
    setViewMode('edit');
    onShowToast('Đã tạo bài viết mới! Đang mở trình chỉnh sửa chi tiết.');
  };

  // Expose handleCreateNew via actionRef
  React.useEffect(() => {
    if (actionRef) {
      actionRef.current = {
        handleCreateNew,
      };
    }
    return () => {
      if (actionRef) actionRef.current = null;
    };
  }, [actionRef, articles]);

  // Notify parent of viewMode changes
  React.useEffect(() => {
    onViewModeChange?.(viewMode);
  }, [viewMode, onViewModeChange]);

  const handleEditClick = (article: NewsArticle) => {
    setSelectedArticleId(article.id);
    setViewMode('edit');
  };

  const handleTogglePublish = (article: NewsArticle, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = article.isPublished === false;
    onUpdateArticle(article.id, { isPublished: nextState });
    onShowToast(
      nextState
        ? `Đã xuất bản bài viết "${article.title}" lên website chính!`
        : `Đã chuyển bài viết "${article.title}" về Bản nháp!`
    );
  };

  const handleConfirmDelete = () => {
    if (!articleToDelete) return;
    onDeleteArticle(articleToDelete.id);
    onShowToast(`Đã xóa bài viết: ${articleToDelete.title}`);
    setArticleToDelete(null);
    if (selectedArticleId === articleToDelete.id) {
      setSelectedArticleId(null);
      setViewMode('list');
    }
  };

  const filteredArticles = articles.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.slug && a.slug.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (statusFilter === 'published') return a.isPublished !== false;
    if (statusFilter === 'draft') return a.isPublished === false;
    return true;
  });

  // Helper formatting for rich text textarea
  const insertFormatting = (prefix: string, suffix: string = '') => {
    if (!activeArticle) return;
    const textarea = document.getElementById('news-content-textarea') as HTMLTextAreaElement | null;
    const currentText = activeArticle.contentFormatted || (Array.isArray(activeArticle.content) ? activeArticle.content.join('\n\n') : activeArticle.content);
    
    if (!textarea) {
      const updated = currentText + `\n${prefix}Văn bản mẫu${suffix}`;
      onUpdateArticle(activeArticle.id, { contentFormatted: updated, content: updated });
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = currentText.substring(start, end) || 'Văn bản mẫu';
    const newText = currentText.substring(0, start) + prefix + selectedText + suffix + currentText.substring(end);

    onUpdateArticle(activeArticle.id, { contentFormatted: newText, content: newText });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 50);
  };

  // =========================================================================
  // 1. CHẾ ĐỘ DANH SÁCH (LIST VIEW) - ĐỒNG BỘ CHUẨN XÁC VỚI MỤC TRANG
  // =========================================================================
  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {/* Bảng danh sách các bài đăng */}
        {filteredArticles.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
            <FileText size={40} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">
              Chưa có bài đăng nào
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Bắt đầu tạo bài viết tin tức hoặc thông báo đầu tiên cho website SFN.
            </p>
            <button
              type="button"
              id="news-btn-create-first"
              onClick={handleCreateNew}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition shadow-xs inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus size={15} />
              <span>Thêm mới</span>
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Tiêu đề các cột trong bảng danh sách */}
            <div className="grid grid-cols-12 gap-4 px-5 py-3.5 bg-slate-50/80 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
              <div className="col-span-12 sm:col-span-5">Tiêu đề bài đăng</div>
              <div className="hidden sm:block sm:col-span-2">Nhãn</div>
              <div className="hidden sm:block sm:col-span-2">Tác giả & Thời gian đọc</div>
              <div className="hidden sm:block sm:col-span-3 text-right">Trạng thái & Hành động</div>
            </div>

            {/* Các hàng dữ liệu bài viết */}
            <div className="divide-y divide-slate-100">
              {filteredArticles.map((article) => {
                const isDraft = article.isPublished === false;
                const slug = getArticleSlug(article);
                const displayUrl = `/tin-tuc/${slug}`;

                return (
                  <div
                    key={article.id}
                    id={`news-row-${article.id}`}
                    onClick={() => handleEditClick(article)}
                    className="group grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-sky-50/40 cursor-pointer transition relative"
                  >
                    {/* Cột 1: Tiêu đề bài viết & Đường dẫn slug */}
                    <div className="col-span-12 sm:col-span-5 pr-2">
                      <div className="flex items-center gap-2.5">
                        {/* Trạng thái Nháp / Đăng */}
                        <span
                          className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                            !isDraft ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                          title={!isDraft ? 'Đã xuất bản' : 'Bản nháp'}
                        />

                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-600 transition truncate">
                            {article.title || 'Bài viết chưa đặt tên'}
                          </h3>
                          <p className="text-[11px] text-slate-500 font-mono truncate mt-0.5">
                            {displayUrl}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Cột 2: Nhãn (Tách riêng biệt thành một cột) */}
                    <div className="hidden sm:flex sm:col-span-2 items-center flex-wrap gap-1">
                      <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200 shrink-0">
                        {article.category || 'Tin tức'}
                      </span>
                    </div>

                    {/* Cột 3: Tác giả & Thời gian đọc */}
                    <div className="hidden sm:block sm:col-span-2 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5 text-slate-700 font-medium truncate">
                        <User size={12} className="text-[#0284C7] shrink-0" />
                        <span className="truncate">{article.author || 'Ban Truyền thông Sky First Network'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mt-0.5 truncate">
                        <Clock size={12} className="shrink-0" />
                        <span className="truncate">{article.readTime || '3 phút đọc'}</span>
                      </div>
                    </div>

                    {/* Cột 3: Trạng thái xuất bản & Cụm Action Icons khi hover */}
                    <div className="hidden sm:flex sm:col-span-3 items-center justify-end">
                      {/* Trạng thái bình thường */}
                      <div className="group-hover:hidden text-right">
                        <span
                          className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            !isDraft
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {!isDraft ? 'Đã xuất bản' : 'Bản nháp'}
                        </span>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          {article.publishedAt || 'Hôm nay'}
                        </span>
                      </div>

                      {/* Khi rê chuột đến (group-hover): Hiện các icon thao tác */}
                      <div className="hidden group-hover:flex items-center gap-1">
                        {/* 1. Icon Chỉnh sửa */}
                        <button
                          type="button"
                          id={`btn-edit-news-${article.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(article);
                          }}
                          className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-white rounded-lg transition shadow-2xs border border-slate-200 cursor-pointer"
                          title="Chỉnh sửa chi tiết bài viết"
                        >
                          <Edit2 size={15} />
                        </button>

                        {/* 2. Icon Nháp hoặc Đăng */}
                        <button
                          type="button"
                          id={`btn-toggle-publish-news-${article.id}`}
                          onClick={(e) => handleTogglePublish(article, e)}
                          className={`p-1.5 rounded-lg transition shadow-2xs border cursor-pointer ${
                            !isDraft
                              ? 'text-amber-600 hover:bg-amber-50 border-amber-200 bg-white'
                              : 'text-emerald-600 hover:bg-emerald-50 border-emerald-200 bg-white'
                          }`}
                          title={!isDraft ? 'Chuyển về Bản nháp' : 'Xuất bản bài viết công khai'}
                        >
                          {!isDraft ? <Clock size={15} /> : <CheckCircle2 size={15} />}
                        </button>

                        {/* 3. Icon Xem trang công khai */}
                        <button
                          type="button"
                          id={`btn-view-public-news-${article.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            window.history.pushState({}, '', displayUrl);
                            onNavigate('news-detail');
                          }}
                          className="p-1.5 text-slate-600 hover:text-[#0284C7] hover:bg-white rounded-lg transition shadow-2xs border border-slate-200 cursor-pointer"
                          title="Xem bài viết trên website"
                        >
                          <Eye size={15} />
                        </button>

                        {/* 4. Icon Xóa */}
                        <button
                          type="button"
                          id={`btn-delete-news-${article.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setArticleToDelete(article);
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition shadow-2xs border border-slate-200 bg-white cursor-pointer"
                          title="Xóa bài viết"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal xác nhận xóa */}
        {articleToDelete && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertCircle size={26} />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                Xác Nhận Xóa Bài Đăng?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Bạn có chắc chắn muốn xóa bài viết <strong>{articleToDelete.title}</strong>? Bài viết này sẽ bị gỡ bỏ khỏi website chính.
              </p>
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setArticleToDelete(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
                >
                  Xóa vĩnh viễn
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // 2. CHẾ ĐỘ CHỈNH SỬA CHI TIẾT (EDIT VIEW) - ĐỘC LẬP THEO CẤU TRÚC TRANG CHÍNH
  // =========================================================================
  if (!activeArticle) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-sm text-slate-500">Không tìm thấy dữ liệu bài đăng.</p>
        <button
          type="button"
          onClick={() => setViewMode('list')}
          className="mt-4 px-4 py-2 bg-sky-600 text-white text-xs font-bold rounded-xl"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const isDraft = activeArticle.isPublished === false;
  const currentSlug = getArticleSlug(activeArticle);
  const displayUrl = `/tin-tuc/${currentSlug}`;

  const handleSave = (publishState?: boolean) => {
    const finalPublishState = publishState !== undefined ? publishState : !isDraft;
    onUpdateArticle(activeArticle.id, { isPublished: finalPublishState });
    if (finalPublishState) {
      onShowToast(`Đã lưu và xuất bản bài viết "${activeArticle.title}" lên website chính!`);
    } else {
      onShowToast(`Đã lưu các chỉnh sửa của bài viết "${activeArticle.title}" (Bản nháp)!`);
    }
  };

  const rawContent = activeArticle.contentFormatted || (Array.isArray(activeArticle.content) ? activeArticle.content.join('\n\n') : activeArticle.content);

  return (
    <div className="fixed inset-0 z-50 bg-[#F8FAFC] text-slate-900 flex flex-col font-sans overflow-y-auto">
      {/* 1. THANH TIÊU ĐỀ ĐỘC LẬP (STICKY HEADER) */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            id="editor-btn-back-news"
            onClick={() => setViewMode('list')}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition flex items-center gap-2 text-xs font-bold cursor-pointer"
            title="Quay lại danh sách bài đăng"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Quay lại danh sách</span>
          </button>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition ${
                !isDraft
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {!isDraft ? (
                <>
                  <CheckCircle2 size={13} className="text-emerald-600" />
                  <span>Đã xuất bản</span>
                </>
              ) : (
                <>
                  <Clock size={13} className="text-amber-600" />
                  <span>Bản nháp</span>
                </>
              )}
            </span>

            <span className="text-xs text-sky-700 font-mono bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200 font-bold hidden sm:inline">
              {displayUrl}
            </span>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Nút xem trang công khai */}
          <button
            type="button"
            id="editor-btn-view-news"
            onClick={() => {
              window.history.pushState({}, '', displayUrl);
              onNavigate('news-detail');
            }}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            title="Xem bài viết trên website"
          >
            <Eye size={14} />
            <span className="hidden sm:inline">Xem Trên Website</span>
          </button>

          {isDraft ? (
            <>
              {/* Đang ở trạng thái Bản nháp: Lưu chỉnh sửa hoặc Đăng bài */}
              <button
                type="button"
                id="editor-btn-save-draft-news"
                onClick={() => handleSave(false)}
                className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold rounded-xl transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
                title="Lưu lại các chỉnh sửa (giữ ở trạng thái Bản nháp)"
              >
                <Save size={15} className="text-[#0284C7]" />
                <span>LƯU CHỈNH SỬA</span>
              </button>

              <button
                type="button"
                id="editor-btn-publish-news"
                onClick={() => handleSave(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                title="Xuất bản bài viết để hiển thị chính thức trên website"
              >
                <CheckCircle2 size={15} />
                <span>ĐĂNG BÀI</span>
              </button>
            </>
          ) : (
            <>
              {/* Đã xuất bản: Có thể chuyển về Bản nháp hoặc Lưu các thay đổi */}
              <button
                type="button"
                id="editor-btn-unpublish-news"
                onClick={() => handleSave(false)}
                className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
                title="Chuyển bài viết về trạng thái Bản nháp"
              >
                <Clock size={14} className="text-amber-600" />
                <span>Chuyển về Nháp</span>
              </button>

              <button
                type="button"
                id="editor-btn-save-news"
                onClick={() => handleSave(true)}
                className="px-4 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-extrabold rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                title="Lưu các thay đổi và áp dụng trực tiếp lên website chính"
              >
                <Save size={15} />
                <span>LƯU THAY ĐỔI</span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* 2. THÂN SOẠN THẢO VỚI CÁC KHỐI, CÁC Ô NHƯ CẤU TRÚC TRANG CHÍNH */}
      <main className="max-w-4xl w-full mx-auto p-4 sm:p-8 space-y-6 flex-1">
        {/* KHỐI 1: CÀI ĐẶT ĐƯỜNG DẪN & THÔNG TIN BÀI VIẾT */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <LinkIcon size={15} className="text-[#0284C7]" />
              Khối 1: Cài Đặt Đường Dẫn & Thông Tin Bài Viết
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">/tin-tuc/:slug</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Tiêu Đề Bài Viết / Bản Tin <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={activeArticle.title}
                onChange={(e) => {
                  const title = e.target.value;
                  onUpdateArticle(activeArticle.id, {
                    title,
                    slug: activeArticle.slug ? activeArticle.slug : generateSlug(title)
                  });
                }}
                placeholder="Ví dụ: Lễ Phát Động Chiến Dịch Tình Nguyện Mùa Hè Xanh 2026..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:border-sky-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                  <LinkIcon size={13} className="text-[#0284C7]" />
                  Đường Dẫn Tĩnh (Slug)
                </label>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2.5 py-2 rounded-xl border border-slate-200 shrink-0">
                    /tin-tuc/
                  </span>
                  <input
                    type="text"
                    value={activeArticle.slug || generateSlug(activeArticle.title)}
                    onChange={(e) =>
                      onUpdateArticle(activeArticle.id, { slug: generateSlug(e.target.value) })
                    }
                    placeholder="duong-dan-tinh"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-[#0284C7] focus:outline-hidden focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Chuyên Mục Bài Viết
                </label>
                <select
                  value={activeArticle.category}
                  onChange={(e) => onUpdateArticle(activeArticle.id, { category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:border-sky-500"
                >
                  <option value="Thông Báo">Thông Báo Chính Thức</option>
                  <option value="Hoạt Động">Hoạt Động & Sự Kiện</option>
                  <option value="Gương Sáng">Gương Sáng & Nhân Vật</option>
                  <option value="Đào Tạo">Đào Tạo & Kỹ Năng</option>
                  <option value="Báo Chí">Báo Chí & Truyền Thông</option>
                </select>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                <Tag size={13} className="text-[#0284C7]" />
                Thẻ Nhãn (Tags - Phân cách bằng dấu phẩy)
              </label>
              <input
                type="text"
                value={activeArticle.tags?.join(', ') || ''}
                onChange={(e) => {
                  const tagsArr = e.target.value
                    .split(',')
                    .map((t) => t.trim())
                    .filter(Boolean);
                  onUpdateArticle(activeArticle.id, { tags: tagsArr });
                }}
                placeholder="Ví dụ: Thông Báo, Mùa Hè Xanh, Sky First Network 2026"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:border-sky-500"
              />
            </div>
          </div>
        </div>

        {/* KHỐI 2: TÁC GIẢ, THỜI GIAN & THỜI LƯỢNG ĐỌC */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <User size={15} className="text-[#0284C7]" />
              Khối 2: Tác Giả, Thời Gian & Thời Lượng Đọc
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                <User size={13} className="text-[#0284C7]" />
                Tác Giả / Người Đăng
              </label>
              <input
                type="text"
                value={activeArticle.author}
                onChange={(e) => onUpdateArticle(activeArticle.id, { author: e.target.value })}
                placeholder="Ban Truyền thông Sky First Network"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:border-sky-500"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                <Calendar size={13} className="text-[#0284C7]" />
                Ngày Xuất Bản
              </label>
              <input
                type="date"
                value={activeArticle.publishedAt || ''}
                onChange={(e) => onUpdateArticle(activeArticle.id, { publishedAt: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:border-sky-500"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                <Clock size={13} className="text-[#0284C7]" />
                Thời Gian Đọc (Ước lượng)
              </label>
              <input
                type="text"
                value={activeArticle.readTime}
                onChange={(e) => onUpdateArticle(activeArticle.id, { readTime: e.target.value })}
                placeholder="3 phút đọc"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:border-sky-500"
              />
            </div>
          </div>
        </div>

        {/* KHỐI 3: HÌNH ẢNH ĐẠI DIỆN BÀI VIẾT (16:9) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <ImageIcon size={15} className="text-[#0284C7]" />
              Khối 3: Hình Ảnh Đại Diện Bài Viết (Tỉ lệ 16:9)
            </h2>
            <span className="text-[11px] text-slate-400">1200x675px</span>
          </div>

          <div className="space-y-3">
            <ImageUrlInput
              label="Ảnh Bìa Bài Viết (URL hoặc Tải ảnh lên)"
              value={activeArticle.imageUrl || ''}
              onChange={(url) => onUpdateArticle(activeArticle.id, { imageUrl: url })}
              helperText="1200x675px (Tỉ lệ 16:9)"
              category="media"
              placeholder="https://images.unsplash.com/photo-..."
            />

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Chú Thích Hình Ảnh
              </label>
              <input
                type="text"
                value={activeArticle.imageDescription || ''}
                onChange={(e) => onUpdateArticle(activeArticle.id, { imageDescription: e.target.value })}
                placeholder="Hình ảnh tại hội nghị phát động chiến dịch thường niên"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-sky-500"
              />
            </div>
          </div>
        </div>

        {/* KHỐI 4: ĐOẠN SAPO / TÓM TẮT MỞ ĐẦU */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Sparkles size={15} className="text-[#0284C7]" />
              Khối 4: Đoạn Sapo / Tóm Tắt Mở Đầu (In Đậm Đầu Trang)
            </h2>
          </div>

          <div>
            <textarea
              rows={3}
              value={activeArticle.summary}
              onChange={(e) => onUpdateArticle(activeArticle.id, { summary: e.target.value })}
              placeholder="Nhập đoạn sapo tóm tắt mở đầu bài viết. Phần này sẽ được định dạng chữ lớn, in đậm nổi bật ngay dưới tiêu đề bài viết..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-sky-500 leading-relaxed"
            />
          </div>
        </div>

        {/* KHỐI 5: NỘI DUNG CHI TIẾT BÀI ĐĂNG */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <FileText size={15} className="text-[#0284C7]" />
              Khối 5: Nội Dung Chi Tiết Bài Đăng
            </h2>
            <span className="text-[11px] text-slate-400">Hỗ trợ tiêu đề H2, H3, in đậm, trích dẫn, danh sách</span>
          </div>

          {/* Thanh công cụ định dạng nhanh */}
          <div className="flex items-center gap-1.5 p-2 bg-slate-100/80 rounded-xl border border-slate-200 flex-wrap">
            <button
              type="button"
              onClick={() => insertFormatting('## ')}
              className="px-2 py-1 bg-white hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 shadow-2xs border border-slate-200 cursor-pointer"
              title="Tiêu đề mục lớn H2"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('### ')}
              className="px-2 py-1 bg-white hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 shadow-2xs border border-slate-200 cursor-pointer"
              title="Tiêu đề mục con H3"
            >
              H3
            </button>
            <div className="h-4 w-px bg-slate-300 mx-1" />
            <button
              type="button"
              onClick={() => insertFormatting('**', '**')}
              className="p-1.5 bg-white hover:bg-slate-200 rounded-lg text-slate-700 shadow-2xs border border-slate-200 cursor-pointer"
              title="In đậm"
            >
              <Bold size={14} />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('*', '*')}
              className="p-1.5 bg-white hover:bg-slate-200 rounded-lg text-slate-700 shadow-2xs border border-slate-200 cursor-pointer"
              title="In nghiêng"
            >
              <Italic size={14} />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('> ')}
              className="p-1.5 bg-white hover:bg-slate-200 rounded-lg text-slate-700 shadow-2xs border border-slate-200 cursor-pointer"
              title="Trích dẫn"
            >
              <Quote size={14} />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('- ')}
              className="p-1.5 bg-white hover:bg-slate-200 rounded-lg text-slate-700 shadow-2xs border border-slate-200 cursor-pointer"
              title="Danh sách gạch đầu dòng"
            >
              <List size={14} />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('1. ')}
              className="p-1.5 bg-white hover:bg-slate-200 rounded-lg text-slate-700 shadow-2xs border border-slate-200 cursor-pointer"
              title="Danh sách số thứ tự"
            >
              <ListOrdered size={14} />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('\n---\n')}
              className="p-1.5 bg-white hover:bg-slate-200 rounded-lg text-slate-700 shadow-2xs border border-slate-200 cursor-pointer"
              title="Đường phân cách ngang"
            >
              <Minus size={14} />
            </button>
          </div>

          <div>
            <textarea
              id="news-content-textarea"
              rows={12}
              value={rawContent}
              onChange={(e) => {
                const text = e.target.value;
                onUpdateArticle(activeArticle.id, {
                  contentFormatted: text,
                  content: text
                });
              }}
              placeholder="Soạn thảo toàn bộ nội dung bài viết..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-sky-500 leading-relaxed font-mono"
            />
          </div>
        </div>

        {/* KHỐI 6: NGUỒN TIN & THIẾT LẬP TƯƠNG TÁC */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <MessageSquare size={15} className="text-[#0284C7]" />
              Khối 6: Nguồn Tin & Thiết Lập Tương Tác
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Nguồn Trích Dẫn / Đơn Vị Phát Hành
              </label>
              <input
                type="text"
                value={activeArticle.source || ''}
                onChange={(e) => onUpdateArticle(activeArticle.id, { source: e.target.value })}
                placeholder="Ví dụ: Sky First Network / Ban Truyền Thông"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:border-sky-500"
              />
            </div>

            <div className="flex items-center gap-3 pt-6">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeArticle.allowComments ?? true}
                  onChange={(e) => onUpdateArticle(activeArticle.id, { allowComments: e.target.checked })}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
                />
                <span>Cho phép độc giả gửi phản hồi & bình luận</span>
              </label>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
