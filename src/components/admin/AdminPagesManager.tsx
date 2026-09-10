import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Edit,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  ExternalLink,
  Search,
  Calendar,
  User,
  Clock,
  Tag,
  Copy,
  Save,
  Send,
  Link as LinkIcon,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Check,
  RotateCcw,
  Sparkles,
  Users,
  HelpCircle,
  Folder,
  Layers,
  MessageSquare
} from 'lucide-react';
import { TeamMember, CorePillar, TimelineMilestone, FAQItem, CustomPage, PageRoute } from '../../types';
import { generateSlug } from '../../utils/slug';
import { ImageUrlInput } from '../ImageUrlInput';
import { AdminAboutManager } from './AdminAboutManager';
import { AdminFaqsManager } from './AdminFaqsManager';

interface AdminPagesManagerProps {
  customPages: CustomPage[];
  onUpdateCustomPage: (id: string, updates: Partial<CustomPage>) => void;
  onAddCustomPage: (page: CustomPage) => void;
  onDeleteCustomPage: (id: string) => void;
  teamMembers: TeamMember[];
  corePillars: CorePillar[];
  timeline: TimelineMilestone[];
  faqs: FAQItem[];
  onUpdateTeamMember: (index: number, updates: Partial<TeamMember>) => void;
  onAddTeamMember: (member: TeamMember) => void;
  onDeleteTeamMember: (index: number) => void;
  onUpdateCorePillar: (index: number, updates: Partial<CorePillar>) => void;
  onUpdateFAQ: (index: number, updates: Partial<FAQItem>) => void;
  onAddFAQ: (faq: FAQItem) => void;
  onDeleteFAQ: (index: number) => void;
  onNavigate: (route: PageRoute, slug?: string) => void;
  onShowToast: (msg: string) => void;
  initialSlug?: string;
}

interface SystemFixedPage {
  id: string;
  slug: string;
  title: string;
  summary: string;
  author: string;
  date: string;
  type: 'fixed-about' | 'fixed-faqs';
  publicRoute: PageRoute;
  views: number;
}

const SYSTEM_PAGES: SystemFixedPage[] = [
  {
    id: 'fixed-about',
    slug: 'gioi-thieu',
    title: 'Giới thiệu & Ban Chấp hành Sky First Network',
    summary: 'Cấu trúc thông tin trang giới thiệu, thành viên Ban Chấp hành, trụ cột sứ mệnh và lộ trình phát triển mạng lưới.',
    author: 'Ban Chấp hành Sky First Network',
    date: '2026',
    type: 'fixed-about',
    publicRoute: 'about',
    views: 1240,
  },
  {
    id: 'fixed-faqs',
    slug: 'hoi-dap',
    title: 'Hỏi đáp thường gặp (FAQs)',
    summary: 'Danh mục các câu hỏi và giải đáp chính thức về mạng lưới Sky First Network, cấp Giấy chứng nhận và cơ chế đồng hành.',
    author: 'Ban Chấp hành Sky First Network',
    date: '2026',
    type: 'fixed-faqs',
    publicRoute: 'home',
    views: 890,
  },
];

export const AdminPagesManager: React.FC<AdminPagesManagerProps> = ({
  customPages,
  onUpdateCustomPage,
  onAddCustomPage,
  onDeleteCustomPage,
  teamMembers,
  corePillars,
  timeline,
  faqs,
  onUpdateTeamMember,
  onAddTeamMember,
  onDeleteTeamMember,
  onUpdateCorePillar,
  onUpdateFAQ,
  onAddFAQ,
  onDeleteFAQ,
  onNavigate,
  onShowToast,
  initialSlug,
}) => {
  // View states: 'list' | 'edit-custom' | 'edit-about' | 'edit-faqs'
  const [viewMode, setViewMode] = useState<'list' | 'edit-custom' | 'edit-about' | 'edit-faqs'>('list');
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'system'>('all');
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [isManageMode, setIsManageMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pageToDelete, setPageToDelete] = useState<CustomPage | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Accordion states in Inspector sidebar (matching Blogger)
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    permalink: true,
    options: true,
    featuredImage: true,
    searchDesc: true,
    author: false,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Synchronize initialSlug from URL (/admin/trang/:slug)
  useEffect(() => {
    if (initialSlug) {
      if (initialSlug === 'gioi-thieu') {
        setViewMode('edit-about');
      } else if (initialSlug === 'hoi-dap') {
        setViewMode('edit-faqs');
      } else {
        const found = customPages.find(
          (p) => p.slug === initialSlug || p.id === initialSlug
        );
        if (found) {
          setSelectedPageId(found.id);
          setViewMode('edit-custom');
        }
      }
    }
  }, [initialSlug, customPages]);

  const activeCustomPage = customPages.find((p) => p.id === selectedPageId) || customPages[0];

  const publishedCount = customPages.filter((p) => p.isPublished !== false).length;
  const draftCount = customPages.filter((p) => p.isPublished === false).length;
  const totalCount = customPages.length + SYSTEM_PAGES.length;

  // Handlers for Navigation & URL Sync
  const handleBackToList = () => {
    setViewMode('list');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/admin/trang');
    }
  };

  const handleCreateNewPage = () => {
    const newId = `page-${Date.now()}`;
    const initialTitle = 'Trang thông tin mới';
    const slug = `trang-moi-${Date.now().toString().slice(-4)}`;

    const newPage: CustomPage = {
      id: newId,
      slug,
      title: initialTitle,
      summary: 'Tóm tắt nội dung giới thiệu trang...',
      content: 'Nội dung chi tiết của trang bắt đầu tại đây...',
      contentFormatted: '<p>Nội dung chi tiết của trang bắt đầu tại đây...</p>',
      imageUrl: '',
      isPublished: false,
      publishedAt: new Date().toLocaleDateString('vi-VN'),
      author: 'Ban Chấp hành Sky First Network',
      views: 0,
      type: 'custom',
    };

    onAddCustomPage(newPage);
    setSelectedPageId(newId);
    setViewMode('edit-custom');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `/admin/trang/${slug}`);
    }
    onShowToast('Đã khởi tạo trang mới! Bắt đầu chỉnh sửa nội dung.');
  };

  const handleEditCustomPage = (page: CustomPage) => {
    setSelectedPageId(page.id);
    setViewMode('edit-custom');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `/admin/trang/${page.slug}`);
    }
  };

  const handleEditFixedPage = (slug: 'gioi-thieu' | 'hoi-dap') => {
    if (slug === 'gioi-thieu') {
      setViewMode('edit-about');
    } else {
      setViewMode('edit-faqs');
    }
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `/admin/trang/${slug}`);
    }
  };

  // Toggle selection for batch actions
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBatchPublish = () => {
    selectedIds.forEach((id) => onUpdateCustomPage(id, { isPublished: true }));
    onShowToast(`Đã xuất bản ${selectedIds.length} trang được chọn!`);
    setSelectedIds([]);
    setIsManageMode(false);
  };

  const handleBatchDraft = () => {
    selectedIds.forEach((id) => onUpdateCustomPage(id, { isPublished: false }));
    onShowToast(`Đã chuyển ${selectedIds.length} trang về bản nháp!`);
    setSelectedIds([]);
    setIsManageMode(false);
  };

  const handleBatchDelete = () => {
    if (confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} trang đã chọn?`)) {
      selectedIds.forEach((id) => onDeleteCustomPage(id));
      onShowToast(`Đã xóa ${selectedIds.length} trang!`);
      setSelectedIds([]);
      setIsManageMode(false);
    }
  };

  const handleConfirmDelete = () => {
    if (!pageToDelete) return;
    onDeleteCustomPage(pageToDelete.id);
    onShowToast(`Đã xóa trang: ${pageToDelete.title}`);
    setPageToDelete(null);
    if (selectedPageId === pageToDelete.id) {
      setSelectedPageId(null);
      setViewMode('list');
    }
  };

  // Filter items for list display
  const filteredCustomPages = customPages.filter((p) => {
    // Status filter
    if (statusFilter === 'published' && p.isPublished === false) return false;
    if (statusFilter === 'draft' && p.isPublished !== false) return false;
    if (statusFilter === 'system') return false;

    // Search query
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      (p.author && p.author.toLowerCase().includes(q)) ||
      p.summary.toLowerCase().includes(q)
    );
  });

  const filteredSystemPages = (statusFilter === 'published' || statusFilter === 'system' || statusFilter === 'all')
    ? SYSTEM_PAGES.filter((p) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q)
        );
      })
    : [];

  // ==========================================
  // VIEW 1: FIXED ABOUT PAGE EDITOR (/admin/trang/gioi-thieu)
  // ==========================================
  if (viewMode === 'edit-about') {
    return (
      <div className="flex flex-col min-h-screen bg-[#F8F9FA] -m-4 sm:-m-6">
        {/* Editor Top Bar */}
        <div className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={handleBackToList}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition shrink-0"
              title="Quay lại danh sách trang"
            >
              <ArrowLeft size={20} />
            </button>

            <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#0284C7] flex items-center justify-center shrink-0">
              <Users size={18} />
            </div>

            <div className="truncate">
              <span className="text-[11px] font-bold text-[#0284C7] uppercase tracking-wider block">
                Trang Cố Định Hệ Thống
              </span>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                Giới Thiệu & Ban Chấp hành Sky First Network
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('about')}
              className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-[#0284C7] hover:bg-slate-100 rounded-lg transition flex items-center gap-1.5"
            >
              <ExternalLink size={14} />
              <span className="hidden sm:inline">Xem Trang Công Khai</span>
            </button>
            <button
              type="button"
              onClick={handleBackToList}
              className="px-4 py-2 bg-[#E37400] hover:bg-[#D36300] text-white text-xs font-bold rounded-lg transition shadow-xs flex items-center gap-1.5"
            >
              <Check size={14} />
              <span>HOÀN TẤT & QUAY LẠI</span>
            </button>
          </div>
        </div>

        {/* Embedded Structured Form for About */}
        <div className="p-4 sm:p-6 max-w-6xl mx-auto w-full">
          <div className="mb-4 bg-sky-50/80 border border-sky-200/80 rounded-xl p-4 text-xs text-sky-900 flex items-start gap-3">
            <Sparkles size={18} className="text-[#0284C7] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm text-[#0284C7]">Trang Giới thiệu & Cơ cấu tổ chức</p>
              <p className="mt-0.5 text-slate-600 leading-relaxed">
                Biểu mẫu có sẵn bên dưới cho phép bạn cập nhật danh sách Ban Chấp hành, trụ cột sứ mệnh và lộ trình phát triển. Mọi thay đổi được lưu tự động theo thời gian thực.
              </p>
            </div>
          </div>

          <AdminAboutManager
            teamMembers={teamMembers}
            corePillars={corePillars}
            timeline={timeline}
            onUpdateTeamMember={onUpdateTeamMember}
            onAddTeamMember={onAddTeamMember}
            onDeleteTeamMember={onDeleteTeamMember}
            onUpdateCorePillar={onUpdateCorePillar}
            onNavigate={onNavigate}
            onShowToast={onShowToast}
          />
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: FIXED FAQS PAGE EDITOR (/admin/trang/hoi-dap)
  // ==========================================
  if (viewMode === 'edit-faqs') {
    return (
      <div className="flex flex-col min-h-screen bg-[#F8F9FA] -m-4 sm:-m-6">
        {/* Editor Top Bar */}
        <div className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={handleBackToList}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition shrink-0"
              title="Quay lại danh sách trang"
            >
              <ArrowLeft size={20} />
            </button>

            <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#E37400] flex items-center justify-center shrink-0">
              <HelpCircle size={18} />
            </div>

            <div className="truncate">
              <span className="text-[11px] font-bold text-[#E37400] uppercase tracking-wider block">
                Trang Cố Định Hệ Thống
              </span>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                Hỏi Đáp Thường Gặp (FAQs)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-[#0284C7] hover:bg-slate-100 rounded-lg transition flex items-center gap-1.5"
            >
              <ExternalLink size={14} />
              <span className="hidden sm:inline">Xem Trên Trang Chủ</span>
            </button>
            <button
              type="button"
              onClick={handleBackToList}
              className="px-4 py-2 bg-[#E37400] hover:bg-[#D36300] text-white text-xs font-bold rounded-lg transition shadow-xs flex items-center gap-1.5"
            >
              <Check size={14} />
              <span>HOÀN TẤT & QUAY LẠI</span>
            </button>
          </div>
        </div>

        {/* Embedded Structured Form for FAQs */}
        <div className="p-4 sm:p-6 max-w-6xl mx-auto w-full">
          <div className="mb-4 bg-amber-50/80 border border-amber-200/80 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3">
            <Sparkles size={18} className="text-[#E37400] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm text-[#E37400]">Trang Hỏi Đáp Thường Gặp (FAQs)</p>
              <p className="mt-0.5 text-slate-600 leading-relaxed">
                Biểu mẫu bên dưới cho phép bạn chỉnh sửa các câu hỏi thường gặp, câu trả lời chi tiết và nhóm phân loại.
              </p>
            </div>
          </div>

          <AdminFaqsManager
            faqs={faqs}
            onUpdateFAQ={onUpdateFAQ}
            onAddFAQ={onAddFAQ}
            onDeleteFAQ={onDeleteFAQ}
            onNavigate={onNavigate}
            onShowToast={onShowToast}
          />
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 3: CUSTOM PAGE EDITOR (MATCHING BLOGGER POST EDITOR WITH HTML SUPPORT)
  // ==========================================
  if (viewMode === 'edit-custom' && activeCustomPage) {
    const rawContentHtml = activeCustomPage.contentFormatted || activeCustomPage.content || '';

    return (
      <div className="flex flex-col min-h-screen bg-[#F8F9FA] -m-4 sm:-m-6">
        {/* Editor Top Bar (trình biên tập nội dung Header) */}
        <div className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
          {/* Left: Back button + Page Title Input */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              type="button"
              onClick={handleBackToList}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition shrink-0"
              title="Quay lại danh sách trang"
            >
              <ArrowLeft size={20} />
            </button>

            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
              <FileText size={18} />
            </div>

            <input
              type="text"
              value={activeCustomPage.title}
              onChange={(e) => onUpdateCustomPage(activeCustomPage.id, { title: e.target.value })}
              placeholder="Tiêu đề trang..."
              className="text-base sm:text-lg font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#E37400] focus:outline-hidden px-1 py-0.5 w-full max-w-xl transition"
            />
          </div>

          {/* Right: Preview & Publish Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setPreviewModalOpen(true)}
              className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg transition flex items-center gap-1.5"
            >
              <Eye size={15} />
              <span className="hidden sm:inline">Xem trước</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onUpdateCustomPage(activeCustomPage.id, { isPublished: true });
                onShowToast(`Đã xuất bản trang: ${activeCustomPage.title}`);
                handleBackToList();
              }}
              className="px-4 py-2 bg-[#E37400] hover:bg-[#D36300] text-white text-xs font-bold rounded-lg transition shadow-xs flex items-center gap-1.5"
            >
              <Check size={15} />
              <span>{activeCustomPage.isPublished ? 'CẬP NHẬT' : 'XUẤT BẢN'}</span>
            </button>
          </div>
        </div>

        {/* 2-Column Editor Workspace */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Writing Canvas (Center Paper Sheet) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-[#F1F3F4]">
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col min-h-[820px]">
              {/* Optional Hero Image Banner */}
              {activeCustomPage.imageUrl && (
                <div className="relative h-56 sm:h-72 w-full overflow-hidden rounded-t-lg bg-slate-100 border-b border-slate-200 group">
                  <img
                    src={activeCustomPage.imageUrl}
                    alt={activeCustomPage.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => onUpdateCustomPage(activeCustomPage.id, { imageUrl: '' })}
                      className="px-3 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-rose-700"
                    >
                      Xóa ảnh bìa
                    </button>
                  </div>
                </div>
              )}

              {/* Title & Meta Header in Paper Canvas */}
              <div className="p-6 sm:p-10 pb-4 border-b border-slate-100">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {activeCustomPage.title || 'Tiêu đề trang'}
                </h1>
                <div className="mt-2.5 flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <User size={13} className="text-slate-400" />
                    {activeCustomPage.author || 'Ban Chấp hành Sky First Network'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={13} className="text-slate-400" />
                    {activeCustomPage.publishedAt || 'Hôm nay'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                    /trang/{activeCustomPage.slug}
                  </span>
                </div>
              </div>

              {/* Clean structured content textarea */}
              <div className="p-4 sm:p-8 flex-1">
                <textarea
                  value={rawContentHtml}
                  onChange={(e) => {
                    const val = e.target.value;
                    onUpdateCustomPage(activeCustomPage.id, {
                      contentFormatted: val,
                      content: val,
                    });
                  }}
                  rows={16}
                  placeholder="Nhập nội dung văn bản của trang..."
                  className="w-full p-4 border border-slate-200 rounded-xl text-sm leading-relaxed text-slate-800 outline-none focus:border-sky-500 transition resize-y min-h-[400px]"
                />
              </div>
            </div>
          </div>

          {/* Right Inspector Sidebar ("Cài đặt trang" - matching cài đặt bài viết) */}
          <div className="w-80 border-l border-slate-200 bg-white overflow-y-auto hidden lg:block shrink-0 shadow-xs">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Cài Đặt Trang
              </h3>
              <span className="text-[11px] text-slate-500">Hệ thống quản trị nội dung Sky First</span>
            </div>

            <div className="divide-y divide-slate-100">
              {/* 1. Permalink / Đường dẫn cố định */}
              <div className="p-4">
                <button
                  type="button"
                  onClick={() => toggleAccordion('permalink')}
                  className="w-full flex items-center justify-between text-xs font-bold text-slate-800 hover:text-[#E37400] transition"
                >
                  <span className="flex items-center gap-2">
                    <LinkIcon size={14} className="text-[#E37400]" />
                    Đường dẫn cố định (Permalink)
                  </span>
                  {openAccordions.permalink ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {openAccordions.permalink && (
                  <div className="mt-3 space-y-2 text-xs">
                    <label className="text-[11px] text-slate-500 font-semibold block">
                      Đường dẫn URL công khai:
                    </label>
                    <div className="flex items-center gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 font-mono text-[11px] break-all">
                      <span>/trang/{activeCustomPage.slug}</span>
                    </div>
                    <div className="pt-1">
                      <label className="text-[11px] text-slate-500 font-semibold block mb-1">
                        Tùy chỉnh Slug:
                      </label>
                      <input
                        type="text"
                        value={activeCustomPage.slug}
                        onChange={(e) =>
                          onUpdateCustomPage(activeCustomPage.id, {
                            slug: generateSlug(e.target.value),
                          })
                        }
                        className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#E37400]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Tác giả & Tóm tắt */}
              <div className="p-4">
                <button
                  type="button"
                  onClick={() => toggleAccordion('author')}
                  className="w-full flex items-center justify-between text-xs font-bold text-slate-800 hover:text-[#E37400] transition"
                >
                  <span className="flex items-center gap-2">
                    <User size={14} className="text-[#E37400]" />
                    Tác giả & Tóm tắt
                  </span>
                  {openAccordions.author ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {openAccordions.author && (
                  <div className="mt-3 space-y-3 text-xs">
                    <div>
                      <label className="text-[11px] text-slate-500 font-semibold block mb-1">
                        Tên tác giả / Đơn vị phụ trách:
                      </label>
                      <input
                        type="text"
                        value={activeCustomPage.author || ''}
                        onChange={(e) =>
                          onUpdateCustomPage(activeCustomPage.id, { author: e.target.value })
                        }
                        className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#E37400]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 font-semibold block mb-1">
                        Tóm tắt trang (Meta Description):
                      </label>
                      <textarea
                        rows={3}
                        value={activeCustomPage.summary || ''}
                        onChange={(e) =>
                          onUpdateCustomPage(activeCustomPage.id, { summary: e.target.value })
                        }
                        placeholder="Tóm tắt ngắn gọn hiển thị trên thẻ chia sẻ và tìm kiếm..."
                        className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#E37400]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Featured Image */}
              <div className="p-4">
                <button
                  type="button"
                  onClick={() => toggleAccordion('featuredImage')}
                  className="w-full flex items-center justify-between text-xs font-bold text-slate-800 hover:text-[#E37400] transition"
                >
                  <span className="flex items-center gap-2">
                    <ImageIcon size={14} className="text-[#E37400]" />
                    Ảnh minh họa trang
                  </span>
                  {openAccordions.featuredImage ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {openAccordions.featuredImage && (
                  <div className="mt-3">
                    <ImageUrlInput
                      value={activeCustomPage.imageUrl || ''}
                      onChange={(url) => onUpdateCustomPage(activeCustomPage.id, { imageUrl: url })}
                      label="Ảnh bìa hoặc logo trang"
                      placeholder="Dán URL ảnh hoặc chọn từ kho ảnh..."
                      category="general"
                    />
                  </div>
                )}
              </div>

              {/* 4. Options */}
              <div className="p-4">
                <button
                  type="button"
                  onClick={() => toggleAccordion('options')}
                  className="w-full flex items-center justify-between text-xs font-bold text-slate-800 hover:text-[#E37400] transition"
                >
                  <span className="flex items-center gap-2">
                    <Folder size={14} className="text-[#E37400]" />
                    Tùy chọn trang
                  </span>
                  {openAccordions.options ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {openAccordions.options && (
                  <div className="mt-3 space-y-3 text-xs text-slate-600">
                    <div className="flex items-center justify-between py-1">
                      <span className="font-semibold text-slate-700">Trạng thái xuất bản</span>
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateCustomPage(activeCustomPage.id, {
                            isPublished: !activeCustomPage.isPublished,
                          })
                        }
                        className={`px-3 py-1 rounded-full text-[11px] font-bold transition ${
                          activeCustomPage.isPublished
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {activeCustomPage.isPublished ? 'Đã xuất bản' : 'Bản nháp'}
                      </button>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <label className="text-[11px] text-slate-500 font-semibold block mb-1.5">
                        Nhận xét của độc giả:
                      </label>
                      <div className="space-y-1.5">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="page_comments"
                            defaultChecked
                            className="text-[#E37400] focus:ring-[#E37400]"
                          />
                          <span>Cho phép nhận xét</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="page_comments"
                            className="text-[#E37400] focus:ring-[#E37400]"
                          />
                          <span>Không cho phép</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal: Interactive Preview */}
        {previewModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
                  <Eye size={15} className="text-[#0284C7]" />
                  Xem trước trang: /trang/{activeCustomPage.slug}
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700 font-bold text-sm"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
                {activeCustomPage.imageUrl && (
                  <img
                    src={activeCustomPage.imageUrl}
                    alt={activeCustomPage.title}
                    className="w-full h-56 object-cover rounded-xl border border-slate-200"
                  />
                )}
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {activeCustomPage.title}
                </h1>
                <div className="flex items-center gap-4 text-xs text-slate-500 pb-4 border-b border-slate-100">
                  <span>Tác giả: {activeCustomPage.author || 'Ban Chấp hành Sky First Network'}</span>
                  <span>Ngày: {activeCustomPage.publishedAt || 'Hôm nay'}</span>
                </div>
                <div
                  className="text-sm text-slate-700 leading-relaxed prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: rawContentHtml }}
                />
              </div>

              <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-end">
                <button
                  type="button"
                  onClick={() => setPreviewModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-900 transition"
                >
                  Đóng xem trước
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW 4: MAIN LIST VIEW (GIAO DIỆN QUẢN TRỊ NỘI DUNG)
  // ==========================================
  return (
    <div className="space-y-4">
      {/* 1. Top Action Toolbar: "TRANG MỚI" + Filter + Search + Manage */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
        {/* Left: Button "TRANG MỚI" (Orange giao diện quản trị) + Status Filter */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleCreateNewPage}
            className="px-4 py-2 bg-[#E37400] hover:bg-[#D36300] text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-xs"
          >
            <Plus size={16} />
            <span>TRANG MỚI</span>
          </button>

          {/* Status Filter Pill Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-2"
            >
              <span>
                {statusFilter === 'all' && `Tất cả các trang (${totalCount})`}
                {statusFilter === 'published' && `Đã xuất bản (${publishedCount + SYSTEM_PAGES.length})`}
                {statusFilter === 'draft' && `Bản nháp (${draftCount})`}
                {statusFilter === 'system' && `Trang hệ thống (${SYSTEM_PAGES.length})`}
              </span>
              <ChevronDown size={14} className="text-slate-500" />
            </button>

            {showStatusMenu && (
              <div className="absolute left-0 mt-1.5 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-1 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter('all');
                    setShowStatusMenu(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 flex items-center justify-between hover:bg-slate-50 ${
                    statusFilter === 'all' ? 'text-[#E37400] font-bold' : 'text-slate-700'
                  }`}
                >
                  <span>Tất cả các trang</span>
                  <span className="text-slate-400 font-mono text-[11px]">{totalCount}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter('published');
                    setShowStatusMenu(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 flex items-center justify-between hover:bg-slate-50 ${
                    statusFilter === 'published' ? 'text-[#E37400] font-bold' : 'text-slate-700'
                  }`}
                >
                  <span>Đã xuất bản</span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {publishedCount + SYSTEM_PAGES.length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter('draft');
                    setShowStatusMenu(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 flex items-center justify-between hover:bg-slate-50 ${
                    statusFilter === 'draft' ? 'text-[#E37400] font-bold' : 'text-slate-700'
                  }`}
                >
                  <span>Bản nháp</span>
                  <span className="text-slate-400 font-mono text-[11px]">{draftCount}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter('system');
                    setShowStatusMenu(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 flex items-center justify-between hover:bg-slate-50 border-t border-slate-100 ${
                    statusFilter === 'system' ? 'text-[#0284C7] font-bold' : 'text-slate-700'
                  }`}
                >
                  <span>Trang cố định hệ thống</span>
                  <span className="text-slate-400 font-mono text-[11px]">{SYSTEM_PAGES.length}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Search Input + Manage Mode Button */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm trang..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#E37400]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setIsManageMode(!isManageMode);
              setSelectedIds([]);
            }}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition ${
              isManageMode
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
            }`}
          >
            {isManageMode ? 'Hủy chọn' : 'Quản lý'}
          </button>
        </div>
      </div>

      {/* 2. Batch Operations Bar (When items are selected in Manage Mode) */}
      {isManageMode && (
        <div className="bg-slate-900 text-white px-4 py-2.5 rounded-xl flex items-center justify-between gap-3 text-xs shadow-md animate-fade-in">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer font-bold">
              <input
                type="checkbox"
                checked={selectedIds.length > 0 && selectedIds.length === customPages.length}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedIds(customPages.map((p) => p.id));
                  } else {
                    setSelectedIds([]);
                  }
                }}
                className="rounded text-[#E37400] focus:ring-[#E37400]"
              />
              <span>Đã chọn ({selectedIds.length})</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={selectedIds.length === 0}
              onClick={handleBatchPublish}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-lg font-bold transition flex items-center gap-1.5"
            >
              <CheckCircle2 size={14} />
              <span>Xuất bản</span>
            </button>
            <button
              type="button"
              disabled={selectedIds.length === 0}
              onClick={handleBatchDraft}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white rounded-lg font-bold transition flex items-center gap-1.5"
            >
              <Clock size={14} />
              <span>Hạ nháp</span>
            </button>
            <button
              type="button"
              disabled={selectedIds.length === 0}
              onClick={handleBatchDelete}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white rounded-lg font-bold transition flex items-center gap-1.5"
            >
              <Trash2 size={14} />
              <span>Xóa</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Blogger-Style Item List */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs divide-y divide-slate-100 overflow-hidden">
        {/* Render Fixed System Pages (Giới thiệu & FAQs) */}
        {filteredSystemPages.map((sysPage) => (
          <div
            key={sysPage.id}
            className="p-4 sm:p-5 hover:bg-slate-50/80 transition flex items-center justify-between gap-4 group"
          >
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center shrink-0 border border-sky-100">
                {sysPage.type === 'fixed-about' ? <Users size={18} /> : <HelpCircle size={18} />}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-[#0284C7] border border-sky-200">
                    Cố định - Hệ thống
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    /{sysPage.slug}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleEditFixedPage(sysPage.slug as any)}
                  className="text-left font-bold text-sm text-slate-900 hover:text-[#0284C7] transition block truncate"
                >
                  {sysPage.title}
                </button>

                <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                  {sysPage.summary}
                </p>

                {/* Sub row: Author, Date, Views */}
                <div className="mt-1.5 flex items-center gap-3 text-xs text-slate-400">
                  <span>{sysPage.author}</span>
                  <span>•</span>
                  <span>{sysPage.views} lượt xem</span>
                </div>
              </div>
            </div>

            {/* Actions on hover */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => handleEditFixedPage(sysPage.slug as any)}
                className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-[#0284C7] font-bold text-xs rounded-lg transition flex items-center gap-1.5"
                title="Chỉnh sửa trang cố định này"
              >
                <Edit size={14} />
                <span>Chỉnh sửa</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate(sysPage.publicRoute)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                title="Xem trang công khai"
              >
                <ExternalLink size={15} />
              </button>
            </div>
          </div>
        ))}

        {/* Render Custom Pages */}
        {filteredCustomPages.map((page) => {
          const isSelected = selectedIds.includes(page.id);

          return (
            <div
              key={page.id}
              className={`p-4 sm:p-5 hover:bg-slate-50/80 transition flex items-center justify-between gap-4 group ${
                isSelected ? 'bg-orange-50/40' : ''
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                {/* Checkbox (visible in manage mode or on row hover) */}
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleToggleSelect(page.id)}
                  className={`rounded text-[#E37400] focus:ring-[#E37400] transition ${
                    isManageMode ? 'block' : 'hidden group-hover:block'
                  }`}
                />

                {/* Page Icon / Thumbnail */}
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 border border-slate-200 overflow-hidden">
                  {page.imageUrl ? (
                    <img
                      src={page.imageUrl}
                      alt={page.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FileText size={18} />
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        page.isPublished !== false
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {page.isPublished !== false ? 'Đã xuất bản' : 'Bản nháp'}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      /trang/{page.slug}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleEditCustomPage(page)}
                    className="text-left font-bold text-sm text-slate-900 hover:text-[#E37400] transition block truncate"
                  >
                    {page.title}
                  </button>

                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {page.summary || 'Chưa có tóm tắt...'}
                  </p>

                  <div className="mt-1.5 flex items-center gap-3 text-xs text-slate-400">
                    <span>{page.author || 'Ban Chấp hành Sky First Network'}</span>
                    <span>•</span>
                    <span>{page.publishedAt || '2026'}</span>
                    <span>•</span>
                    <span>{page.views || 0} lượt xem</span>
                  </div>
                </div>
              </div>

              {/* Row Action Buttons on Hover */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleEditCustomPage(page)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-[#E37400] hover:text-white text-slate-700 font-bold text-xs rounded-lg transition flex items-center gap-1.5"
                  title="Chỉnh sửa nội dung & giao diện trực quan"
                >
                  <Edit size={14} />
                  <span>Chỉnh sửa</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onUpdateCustomPage(page.id, { isPublished: !page.isPublished })
                  }
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                  title={page.isPublished ? 'Chuyển về bản nháp' : 'Xuất bản trang'}
                >
                  {page.isPublished ? <Clock size={15} /> : <CheckCircle2 size={15} />}
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('custom-page', page.slug)}
                  className="p-2 text-slate-400 hover:text-[#0284C7] hover:bg-slate-100 rounded-lg transition"
                  title="Xem trang công khai"
                >
                  <ExternalLink size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => setPageToDelete(page)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Xóa trang này"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          );
        })}

        {/* Empty state if nothing matches */}
        {filteredCustomPages.length === 0 && filteredSystemPages.length === 0 && (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FileText size={24} />
            </div>
            <p className="text-sm font-semibold">Không tìm thấy trang nào phù hợp</p>
            <button
              type="button"
              onClick={handleCreateNewPage}
              className="px-4 py-2 bg-[#E37400] text-white text-xs font-bold rounded-xl hover:bg-[#D36300] transition inline-flex items-center gap-1.5"
            >
              <Plus size={15} />
              <span>Tạo Trang Mới Ngay</span>
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Delete */}
      {pageToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle size={22} />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Xóa Trang Thông Tin?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bạn có chắc chắn muốn xóa vĩnh viễn trang{' '}
              <strong>"{pageToDelete.title}"</strong> (đường dẫn: /trang/{pageToDelete.slug})? Thao tác này không thể hoàn tác.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPageToDelete(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                Xác Nhận Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
