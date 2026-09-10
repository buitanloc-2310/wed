import React, { useState, useRef } from 'react';
import {
  FileText,
  PenTool,
  Building2,
  Layout,
  MessageSquare,
  Settings,
  Globe,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  ExternalLink,
  Layers,
  UserCheck,
  Mail,
  LogOut,
  Cloud,
  RefreshCw,
  AlertCircle, Award, Handshake, Image, Menu, History, HeartHandshake,
} from 'lucide-react';
import { useDataContext } from '../context/DataContext';
import { PageRoute, CustomPage, AdminManagerActionRef, AdminUser } from '../types';
import { AdminLogin } from '../components/admin/AdminLogin';
import { logoutFirebase } from '../lib/firebaseAuth';
import { StandalonePageEditor } from '../components/admin/StandalonePageEditor';
import { AdminLayoutManager } from '../components/admin/AdminLayoutManager';
import { AdminSettings } from '../components/admin/AdminSettings';
import { AdminProgramsManager } from '../components/admin/AdminProgramsManager';
import { AdminUnitsManager } from '../components/admin/AdminUnitsManager';
import { AdminNewsManager } from '../components/admin/AdminNewsManager';
import { generateSlug } from '../utils/slug';
import { AdminRecordsManager } from '../components/admin/AdminRecordsManager';
import { AdminGlobalContentManager } from '../components/admin/AdminGlobalContentManager';

interface AdminPageProps {
  onNavigate: (route: PageRoute) => void;
  onShowToast: (message: string) => void;
  initialTab?: string;
  initialSlug?: string;
}

export type AdminTab =
  | 'layout'        // Bố cục
  | 'programs'      // Chương trình
  | 'units'         // Đơn vị
  | 'posts'         // Bài đăng
  | 'pages'         // Trang
  | 'comments'      // Bình luận
  | 'registrations' // Đăng ký
  | 'contacts'
  | 'certificates'
  | 'partners'
  | 'contributions'
  | 'media'
  | 'menus'
  | 'logs'
  | 'settings';     // Cài đặt

interface MenuItemConfig {
  id: AdminTab;
  label: string;
  icon: React.ReactNode;
  largeIcon: React.ReactNode;
}

// Danh sách các mục menu theo đúng thứ tự yêu cầu:
// Bố cục - Chương trình - Đơn vị - Bài đăng - Trang - Bình luận - Đăng ký - Liên hệ - Cài đặt
const MENU_ITEMS: MenuItemConfig[] = [
  {
    id: 'layout',
    label: 'Quản lý Trang chủ',
    icon: <Layout size={18} />,
    largeIcon: <Layout size={24} />,
  },
  {
    id: 'programs',
    label: 'Chương trình',
    icon: <Layers size={18} />,
    largeIcon: <Layers size={24} />,
  },
  {
    id: 'units',
    label: 'Đơn vị',
    icon: <Building2 size={18} />,
    largeIcon: <Building2 size={24} />,
  },
  {
    id: 'posts',
    label: 'Bài đăng',
    icon: <PenTool size={18} />,
    largeIcon: <PenTool size={24} />,
  },
  {
    id: 'pages',
    label: 'Trang',
    icon: <FileText size={18} />,
    largeIcon: <FileText size={24} />,
  },
  {
    id: 'comments',
    label: 'Bình luận',
    icon: <MessageSquare size={18} />,
    largeIcon: <MessageSquare size={24} />,
  },
  {
    id: 'registrations',
    label: 'Đăng ký',
    icon: <UserCheck size={18} />,
    largeIcon: <UserCheck size={24} />,
  },
  {
    id: 'contacts',
    label: 'Liên hệ',
    icon: <Mail size={18} />,
    largeIcon: <Mail size={24} />,
  },
  { id:'certificates', label:'Giấy chứng nhận', icon:<Award size={18}/>, largeIcon:<Award size={24}/> },
  { id:'partners', label:'Đối tác & Đồng hành', icon:<Handshake size={18}/>, largeIcon:<Handshake size={24}/> },
  { id:'contributions', label:'Tài trợ & Đóng góp', icon:<HeartHandshake size={18}/>, largeIcon:<HeartHandshake size={24}/> },
  { id:'media', label:'Media', icon:<Image size={18}/>, largeIcon:<Image size={24}/> },
  { id:'menus', label:'Nội dung toàn cục', icon:<Menu size={18}/>, largeIcon:<Menu size={24}/> },
  { id:'logs', label:'Nhật ký', icon:<History size={18}/>, largeIcon:<History size={24}/> },
  {
    id: 'settings',
    label: 'Cài đặt',
    icon: <Settings size={18} />,
    largeIcon: <Settings size={24} />,
  },
];

export const AdminPage: React.FC<AdminPageProps> = ({
  onNavigate,
  onShowToast,
  initialTab,
  initialSlug,
}) => {
  const {
    adminUsers,
    addAdminUser,
    customPages,
    updateCustomPage,
    addCustomPage,
    deleteCustomPage,
    siteConfig,
    updateSiteConfig,
    programs,
    updateProgram,
    addProgram,
    deleteProgram,
    networkUnits,
    updateNetworkUnit,
    addNetworkUnit,
    deleteNetworkUnit,
    newsArticles,
    updateNewsArticle,
    addNewsArticle,
    deleteNewsArticle,
    isFirebaseConfigured,
    isFirebaseSyncing,
    firebaseSyncStatus,
  } = useDataContext();

  // Phiên đăng nhập của Quản trị viên
  const [currentAdminUser, setCurrentAdminUser] = useState<AdminUser | null>(() => {
    try {
      const stored = localStorage.getItem('sfn_admin_session');
      if (stored) {
        const parsed: AdminUser = JSON.parse(stored);
        const match = adminUsers.find(
          (u) => u.email.toLowerCase() === parsed.email.toLowerCase() && u.status === 'active'
        );
        return match || parsed;
      }
    } catch {}
    return null;
  });

  const handleLogout = async () => {
    try {
      await logoutFirebase();
    } catch (e) {
      console.warn('Firebase logout error:', e);
    }
    try {
      localStorage.removeItem('sfn_admin_session');
    } catch {}
    setCurrentAdminUser(null);
    onShowToast('Đã đăng xuất khỏi trang quản trị website Sky First Network.');
  };

  // State: Active tab in sidebar (nếu có initialTab hợp lệ thì dùng, ngược lại mặc định 'pages')
  const [activeTab, setActiveTab] = useState<AdminTab>(() => {
    if (initialTab && MENU_ITEMS.some((m) => m.id === initialTab)) {
      return initialTab as AdminTab;
    }
    return 'pages';
  });

  // State: Sidebar collapsed or expanded
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Refs for manager action buttons
  const programsActionRef = useRef<AdminManagerActionRef | null>(null);
  const unitsActionRef = useRef<AdminManagerActionRef | null>(null);
  const newsActionRef = useRef<AdminManagerActionRef | null>(null);

  // View modes for managers to toggle header buttons
  const [programsViewMode, setProgramsViewMode] = useState<'list' | 'edit'>('list');
  const [unitsViewMode, setUnitsViewMode] = useState<'list' | 'edit'>('list');
  const [newsViewMode, setNewsViewMode] = useState<'list' | 'edit'>('list');

  // State: Standalone editing page (When not null, renders 100% independent editor without admin frame)
  const [editingPage, setEditingPage] = useState<CustomPage | null>(() => {
    if (initialSlug) {
      const found = customPages.find((p) => p.slug === initialSlug || p.id === initialSlug);
      return found || null;
    }
    return null;
  });

  // State: Delete confirmation modal
  const [pageToDelete, setPageToDelete] = useState<CustomPage | null>(null);

  // Current active menu item configuration
  const currentMenuItem = MENU_ITEMS.find((m) => m.id === activeTab) || MENU_ITEMS[0];

  // Filter out home, programs, units, news as specifically requested:
  // "ngoại trừ trang chủ, đơn vị, tin tức, chương trình"
  const displayPages = customPages.filter(
    (p) =>
      !['home', 'programs', 'units', 'news'].includes(p.slug) &&
      !['page-home', 'page-programs', 'page-units', 'page-news'].includes(p.id)
  );

  // Helper for matching web display URLs
  const getDisplayUrl = (page: CustomPage) => {
    if (page.slug === 'about') return '/about';
    if (page.slug === 'contact') return '/contact';
    if (['certificate', 'sponsor', 'join'].includes(page.slug)) {
      return `/${page.slug}`;
    }
    return `/trang/${page.slug}`;
  };

  // Handlers for Page operations
  const handleStartCreatePage = () => {
    const newId = `page-${Date.now()}`;
    const newPage: CustomPage = {
      id: newId,
      slug: `trang-moi-${Date.now().toString().slice(-4)}`,
      title: 'Trang thông tin mới',
      summary: '',
      content: '',
      contentFormatted: '',
      imageUrl: '',
      isPublished: false, // Mặc định ở trạng thái bản nháp theo yêu cầu
      publishedAt: new Date().toLocaleDateString('vi-VN'),
      author: 'Ban Quản trị Sky First Network',
      views: 0,
      type: 'custom',
      showInFooter: false,
    };

    addCustomPage(newPage);
    setEditingPage(newPage);
    onShowToast('Đã khởi tạo trang mới ở trạng thái Bản nháp. Nhấn "Lưu chỉnh sửa" để lưu và "Đăng bài" để xuất bản!');
  };

  const handleStartEditPage = (page: CustomPage) => {
    setEditingPage(page);
  };

  const handleTogglePublishStatus = (page: CustomPage, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent row click
    const newStatus = page.isPublished === false;
    updateCustomPage(page.id, { isPublished: newStatus });
    onShowToast(
      newStatus
        ? `Đã xuất bản trang "${page.title}"!`
        : `Đã chuyển trang "${page.title}" về Bản nháp!`
    );
  };

  const handleDeletePage = (page: CustomPage, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent row click
    setPageToDelete(page);
  };

  const handleConfirmDelete = () => {
    if (!pageToDelete) return;
    deleteCustomPage(pageToDelete.id);
    onShowToast(`Đã xóa trang "${pageToDelete.title}"!`);
    setPageToDelete(null);
  };

  // =========================================================================
  // NẾU CHƯA ĐĂNG NHẬP: HIỂN THỊ KHỞI TẠO TÀI KHOẢN ĐẦU TIÊN / ĐĂNG NHẬP
  // =========================================================================
  if (!currentAdminUser) {
    return (
      <AdminLogin
        adminUsers={adminUsers}
        addAdminUser={addAdminUser}
        onLoginSuccess={(user) => setCurrentAdminUser(user)}
        onNavigateHome={() => onNavigate('home')}
        onShowToast={onShowToast}
      />
    );
  }

  // =========================================================================
  // 3. NẾU ĐANG Ở CHẾ ĐỘ CHỈNH SỬA: MỞ HẲN 1 TRANG MỚI ĐỘC LẬP HOÀN TOÀN
  // (Không có thanh điều hướng, menu, logo hay bất kỳ thành phần nào của /admin)
  // =========================================================================
  if (editingPage) {
    return (
      <StandalonePageEditor
        page={editingPage}
        onSave={(updates) => {
          updateCustomPage(editingPage.id, updates);
          setEditingPage((prev) => (prev ? { ...prev, ...updates } : null));
        }}
        onClose={() => setEditingPage(null)}
        onShowToast={onShowToast}
      />
    );
  }

  // =========================================================================
  // GIAO DIỆN QUẢN TRỊ /ADMIN
  // 1. Thanh menu bên trái (Logo, Nút ẩn/hiện, Trang, Bài đăng, Bố cục, Bình luận, Cài đặt, Xem website)
  // 2. Khu vực hiển thị mục "Trang" dạng danh sách
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex font-sans">
      {/* ------------------------------------------------------------- */}
      {/* 1. THANH MENU BÊN TRÁI                                       */}
      {/* ------------------------------------------------------------- */}
      <aside
        className={`bg-white border-r border-slate-200 transition-all duration-200 flex flex-col shrink-0 sticky top-0 h-screen z-20 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Header của Sidebar: Logo & Nút ẩn hiện thanh menu */}
        <div className="h-16 border-b border-slate-200 px-4 flex items-center justify-between gap-2">
          {!isSidebarCollapsed ? (
            <div className="flex items-center gap-2.5 min-w-0 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 p-0.5 shrink-0 shadow-xs"><img src="/favicon.png" alt="Sky First Network" className="w-full h-full object-contain" /></div>
              <div className="truncate">
                <span className="font-extrabold text-sm text-slate-900 tracking-tight block truncate">
                  Quản trị Sky First Network
                </span>
                <span className="text-[11px] text-slate-400 block truncate">
                  Quản trị hệ thống
                </span>
              </div>
            </div>
          ) : (
            <div className="mx-auto">
              <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 p-0.5 shadow-xs"><img src="/favicon.png" alt="Sky First Network" className="w-full h-full object-contain" /></div>
            </div>
          )}

          {/* Nút ẩn hiện thanh menu */}
          <button
            type="button"
            id="admin-btn-toggle-sidebar"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition shrink-0"
            title={isSidebarCollapsed ? 'Mở rộng thanh menu' : 'Thu gọn thanh menu'}
          >
            {isSidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        {/* Danh sách các mục menu theo đúng thứ tự yêu cầu:
            Bố cục - Chương trình - Đơn vị - Bài đăng - Trang - Bình luận - Đăng ký - Liên hệ - Cài đặt */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {MENU_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                id={`menu-item-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 border border-sky-200/80 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                } ${isSidebarCollapsed ? 'justify-center px-0' : 'justify-start'}`}
                title={item.label}
              >
                <span className={`shrink-0 ${isActive ? 'text-sky-600' : 'text-slate-400'}`}>
                  {item.icon}
                </span>
                {!isSidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Nút Xem website & Đăng xuất (Chân Sidebar) */}
        <div className="p-3 border-t border-slate-200">
          <div className="flex items-center gap-1">
            <button
              type="button"
              id="menu-item-view-site"
              onClick={() => onNavigate('home')}
              className={`flex-1 flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-sky-600 hover:bg-sky-50 transition border border-transparent hover:border-sky-200 cursor-pointer ${
                isSidebarCollapsed ? 'justify-center px-0' : ''
              }`}
              title="Xem website"
            >
              <Globe size={16} className="text-slate-400 group-hover:text-sky-600 shrink-0" />
              {!isSidebarCollapsed && <span>Xem website</span>}
            </button>

            <button
              type="button"
              id="menu-item-logout-sidebar"
              onClick={handleLogout}
              className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition border border-transparent hover:border-rose-200 shrink-0 cursor-pointer"
              title="Đăng xuất khỏi trang quản trị"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* 2. KHU VỰC NỘI DUNG CHÍNH                                    */}
      {/* ------------------------------------------------------------- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top bar tối giản của vùng làm việc */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-base font-extrabold text-slate-900">
              {activeTab === 'pages'
                ? 'Quản lý Trang'
                : activeTab === 'programs'
                ? 'Chương Trình & Dự Án'
                : activeTab === 'units'
                ? 'Đơn Vị Trực Thuộc'
                : activeTab === 'posts'
                ? 'Bài Đăng & Tin Tức'
                : activeTab === 'layout'
                ? 'Quản lý Trang chủ'
                : activeTab === 'settings'
                ? 'Cài đặt Hệ Thống'
                : `Mục ${currentMenuItem.label}`}
            </h1>
            <p className="text-xs text-slate-500">
              {activeTab === 'pages'
                ? `Tổng số ${displayPages.length} trang trong hệ thống`
                : activeTab === 'programs'
                ? `Quản lý ${programs.length} chương trình & dự án cộng đồng`
                : activeTab === 'units'
                ? `Hệ thống ${networkUnits.length} đơn vị trực thuộc chuyên trách`
                : activeTab === 'posts'
                ? `Tổng số ${newsArticles.length} bài đăng và thông báo tin tức`
                : activeTab === 'layout'
                ? 'Chỉnh sửa nội dung, ẩn/hiện và sắp xếp các khối đang hiển thị trên Trang chủ Sky First Network'
                : activeTab === 'settings'
                ? 'Thiết lập nhận diện thương hiệu, tài khoản quản trị và đóng/mở website'
                : 'Khu vực này hiện đang được để trống'}
            </p>
          </div>

          {/* Khu vực bên phải của Header: Nút hành động + Thông tin người dùng đăng nhập */}
          <div className="flex items-center gap-3">
            {activeTab === 'pages' && (
              <button
                type="button"
                id="admin-btn-create-page"
                onClick={handleStartCreatePage}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Plus size={15} />
                <span>Thêm mới</span>
              </button>
            )}

            {activeTab === 'programs' && programsViewMode === 'list' && (
              <button
                type="button"
                id="admin-btn-create-program"
                onClick={() => programsActionRef.current?.handleCreateNew()}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Plus size={15} />
                <span>Thêm mới</span>
              </button>
            )}

            {activeTab === 'units' && unitsViewMode === 'list' && (
              <button
                type="button"
                id="admin-btn-create-unit"
                onClick={() => unitsActionRef.current?.handleCreateNew()}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Plus size={15} />
                <span>Thêm mới</span>
              </button>
            )}

            {activeTab === 'posts' && newsViewMode === 'list' && (
              <button
                type="button"
                id="admin-btn-create-news"
                onClick={() => newsActionRef.current?.handleCreateNew()}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Plus size={15} />
                <span>Thêm mới</span>
              </button>
            )}

            {/* Trạng thái kết nối & đồng bộ Firebase Database */}
            <div className="flex items-center">
              {isFirebaseConfigured ? (
                firebaseSyncStatus === 'synced' ? (
                  <button
                    type="button"
                    onClick={() => setActiveTab('settings')}
                    className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-100 transition cursor-pointer"
                    title="Đang đồng bộ trực tiếp với Firebase Firestore"
                  >
                    <CheckCircle2 size={13} className="text-emerald-600" />
                    <span>Firebase: Đã đồng bộ</span>
                  </button>
                ) : firebaseSyncStatus === 'syncing' ? (
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200/80">
                    <RefreshCw size={13} className="text-sky-600 animate-spin" />
                    <span>Đang đồng bộ...</span>
                  </span>
                ) : firebaseSyncStatus === 'error' ? (
                  <button
                    type="button"
                    onClick={() => setActiveTab('settings')}
                    className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/80 hover:bg-rose-100 transition cursor-pointer"
                    title="Lỗi đồng bộ Firebase. Nhấn để kiểm tra"
                  >
                    <AlertCircle size={13} className="text-rose-600" />
                    <span>Lỗi Firebase</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveTab('settings')}
                    className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 transition cursor-pointer"
                    title="Firebase sẵn sàng kết nối"
                  >
                    <Cloud size={13} className="text-slate-500" />
                    <span>Firebase Sẵn Sàng</span>
                  </button>
                )
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveTab('settings')}
                  className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition cursor-pointer"
                  title="Cần nạp khóa Firebase vào file .env"
                >
                  <Cloud size={13} className="text-amber-600" />
                  <span>Cần cấu hình .env</span>
                </button>
              )}
            </div>

            {/* Nút Đăng xuất */}
            <div className="pl-2 border-l border-slate-200">
              <button
                type="button"
                id="btn-admin-header-logout"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition border border-slate-200 hover:border-rose-200 cursor-pointer shadow-2xs"
                title="Đăng xuất khỏi trang quản trị"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            </div>
          </div>
        </header>

        {/* Nội dung theo từng tab */}
        <div className="p-6 max-w-6xl w-full mx-auto">
          {/* Thông báo trạng thái đóng website cho admin */}
          {siteConfig.siteStatus === 'closed' && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping shrink-0" />
                <div>
                  <span className="text-xs font-black block">
                    Website Hiện Đang Ở Chế Độ Đóng ({siteConfig.closedReasonText || 'Bảo trì / Biên tập'})
                  </span>
                  <span className="text-[11px] text-amber-800 block mt-0.5">
                    Khách truy cập công khai sẽ thấy thông báo trạng thái. Trang quản trị /admin vẫn hoạt động bình thường cho bạn.
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  id="btn-admin-reopen-site"
                  onClick={() => {
                    updateSiteConfig({ siteStatus: 'active' });
                    onShowToast('Đã mở lại website công khai thành công!');
                  }}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-2xs"
                >
                  Mở lại Website ngay
                </button>
                {activeTab !== 'settings' && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('settings')}
                    className="px-3 py-1.5 bg-white hover:bg-amber-100 text-amber-900 text-xs font-bold rounded-xl border border-amber-300 transition"
                  >
                    Cấu hình
                  </button>
                )}
              </div>
            </div>
          )}
          {/* ========================================================= */}
          {/* TAB 1: MỤC "TRANG"                                        */}
          {/* - Sắp xếp theo dạng danh sách                             */}
          {/* - Tên trang, ngày tháng năm xuất bản, người xuất bản       */}
          {/* - Khi rê chuột đến: icon Chỉnh sửa, Nháp/Đăng, Xóa        */}
          {/* - Nhấn vào bài: mặc định là Chỉnh sửa                      */}
          {/* ========================================================= */}
          {activeTab === 'pages' && (
            <div className="space-y-4">
              {displayPages.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                  <FileText size={40} className="mx-auto text-slate-300 mb-3" />
                  <h3 className="text-base font-bold text-slate-800 mb-1">
                    Chưa có trang thông tin nào
                  </h3>
                  <p className="text-xs text-slate-500 mb-5">
                    Bắt đầu tạo trang đầu tiên để bổ sung thông tin cho website.
                  </p>
                  <button
                    type="button"
                    onClick={handleStartCreatePage}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition shadow-xs inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Plus size={15} />
                    <span>Thêm mới</span>
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                  {/* Tiêu đề các cột trong danh sách */}
                  <div className="grid grid-cols-12 gap-4 px-5 py-3.5 bg-slate-50/80 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <div className="col-span-12 sm:col-span-5">Tên trang</div>
                    <div className="hidden sm:block sm:col-span-2">Nhãn</div>
                    <div className="hidden sm:block sm:col-span-2">Người xuất bản</div>
                    <div className="hidden sm:block sm:col-span-3 text-right">Ngày xuất bản</div>
                  </div>

                  {/* Danh sách các trang */}
                  <div className="divide-y divide-slate-100">
                    {displayPages.map((page) => (
                      <div
                        key={page.id}
                        id={`page-row-${page.id}`}
                        onClick={() => handleStartEditPage(page)}
                        className="group grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-sky-50/40 cursor-pointer transition relative"
                      >
                        {/* Cột 1: Tên trang & Đường dẫn slug */}
                        <div className="col-span-12 sm:col-span-5 pr-2">
                          <div className="flex items-center gap-2.5">
                            {/* Trạng thái Nháp / Đăng */}
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${
                                page.isPublished !== false ? 'bg-emerald-500' : 'bg-amber-500'
                              }`}
                              title={page.isPublished !== false ? 'Đã xuất bản' : 'Bản nháp'}
                            />

                            <div className="min-w-0">
                              <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-600 transition truncate">
                                {page.title || 'Trang chưa đặt tên'}
                              </h3>
                              <p className="text-[11px] text-slate-500 font-mono truncate mt-0.5">
                                {getDisplayUrl(page)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Cột 2: Nhãn (Tách riêng biệt thành một cột - chỉ hiển thị Chân trang) */}
                        <div className="hidden sm:flex sm:col-span-2 items-center flex-wrap gap-1">
                          {page.showInFooter !== false ? (
                            <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200 shrink-0">
                              Chân trang
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </div>

                        {/* Cột 3: Người xuất bản */}
                        <div className="hidden sm:block sm:col-span-2 text-xs text-slate-600 truncate">
                          {page.author || 'Ban Quản trị Sky First Network'}
                        </div>

                        {/* Cột 3: Ngày tháng năm xuất bản & Cụm Action Icons khi rê chuột */}
                        <div className="hidden sm:flex sm:col-span-3 items-center justify-end">
                          {/* Trạng thái bình thường: hiển thị ngày xuất bản */}
                          <div className="group-hover:hidden text-right">
                            <span className="text-xs text-slate-500 block">
                              {page.publishedAt || 'Hôm nay'}
                            </span>
                            <span
                              className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                page.isPublished !== false
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-amber-50 text-amber-700'
                              }`}
                            >
                              {page.isPublished !== false ? 'Đã xuất bản' : 'Bản nháp'}
                            </span>
                          </div>

                          {/* KHI RÊ CHUỘT ĐẾN (group-hover): HIỆN CÁC ICON CHỈNH SỬA / NHÁP HOẶC ĐĂNG / XÓA */}
                          <div className="hidden group-hover:flex items-center gap-1">
                            {/* 1. Icon Chỉnh sửa */}
                            <button
                              type="button"
                              id={`btn-edit-${page.id}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartEditPage(page);
                              }}
                              className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-white rounded-lg transition shadow-2xs border border-slate-200"
                              title="Chỉnh sửa trang"
                            >
                              <Edit2 size={15} />
                            </button>

                            {/* 2. Icon Nháp hoặc Đăng */}
                            <button
                              type="button"
                              id={`btn-toggle-publish-${page.id}`}
                              onClick={(e) => handleTogglePublishStatus(page, e)}
                              className={`p-1.5 rounded-lg transition shadow-2xs border ${
                                page.isPublished !== false
                                  ? 'text-amber-600 hover:bg-amber-50 border-amber-200 bg-white'
                                  : 'text-emerald-600 hover:bg-emerald-50 border-emerald-200 bg-white'
                              }`}
                              title={
                                page.isPublished !== false
                                  ? 'Chuyển về Bản nháp'
                                  : 'Xuất bản trang công khai'
                              }
                            >
                              {page.isPublished !== false ? (
                                <Clock size={15} />
                              ) : (
                                <CheckCircle2 size={15} />
                              )}
                            </button>

                            {/* 3. Icon Xóa */}
                            <button
                              type="button"
                              id={`btn-delete-${page.id}`}
                              onClick={(e) => handleDeletePage(page, e)}
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-white rounded-lg transition shadow-2xs border border-slate-200"
                              title="Xóa trang"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>

                        {/* Mobile Action Buttons */}
                        <div className="col-span-12 sm:hidden flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                          <span>
                            {page.author} • {page.publishedAt}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartEditPage(page);
                              }}
                              className="p-1 text-slate-600 hover:text-sky-600"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleTogglePublishStatus(page, e)}
                              className="p-1 text-slate-600 hover:text-emerald-600"
                            >
                              {page.isPublished !== false ? (
                                <Clock size={14} />
                              ) : (
                                <CheckCircle2 size={14} />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDeletePage(page, e)}
                              className="p-1 text-slate-500 hover:text-rose-600"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB CHƯƠNG TRÌNH (PROGRAMS) */}
          {activeTab === 'programs' && (
            <AdminProgramsManager
              programs={programs}
              onUpdateProgram={updateProgram}
              onAddProgram={addProgram}
              onDeleteProgram={deleteProgram}
              onNavigate={onNavigate}
              onShowToast={onShowToast}
              actionRef={programsActionRef}
              onViewModeChange={setProgramsViewMode}
            />
          )}

          {/* TAB ĐƠN VỊ (UNITS) */}
          {activeTab === 'units' && (
            <AdminUnitsManager
              units={networkUnits}
              onUpdateUnit={updateNetworkUnit}
              onAddUnit={addNetworkUnit}
              onDeleteUnit={deleteNetworkUnit}
              onNavigate={onNavigate}
              onShowToast={onShowToast}
              actionRef={unitsActionRef}
              onViewModeChange={setUnitsViewMode}
            />
          )}

          {/* TAB BÀI ĐĂNG (POSTS / NEWS) */}
          {activeTab === 'posts' && (
            <AdminNewsManager
              articles={newsArticles}
              onUpdateArticle={updateNewsArticle}
              onAddArticle={addNewsArticle}
              onDeleteArticle={deleteNewsArticle}
              onNavigate={onNavigate}
              onShowToast={onShowToast}
              initialSlug={initialSlug}
              actionRef={newsActionRef}
              onViewModeChange={setNewsViewMode}
            />
          )}

          {/* TAB BỐ CỤC (LAYOUT MANAGER) */}
          {activeTab === 'layout' && (
            <AdminLayoutManager
              onNavigate={onNavigate}
              onShowToast={onShowToast}
              onSwitchTab={(tab) => setActiveTab(tab as AdminTab)}
            />
          )}

          {(['comments','registrations','contacts','certificates','partners','contributions','media','logs'] as AdminTab[]).includes(activeTab) && (
            <AdminRecordsManager kind={activeTab} onShowToast={onShowToast} />
          )}
          {activeTab === 'menus' && <AdminGlobalContentManager onShowToast={onShowToast} />}

          {/* TAB CÀI ĐẶT (SETTINGS) */}
          {activeTab === 'settings' && (
            <AdminSettings
              onShowToast={onShowToast}
              onNavigate={onNavigate}
            />
          )}

          {/* ========================================================= */}
          {/* CÁC MỤC ĐƯỢC ĐỂ TRỐNG NHƯ CÁC MỤC CHƯA ĐƯỢC THIẾT LẬP   */}
          {/* Đối với các mục được thêm mới trên menu thì cũng để trống   */}
          {/* như các mục chưa được thiết lập                           */}
          {/* ========================================================= */}
          {false && (
            <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center max-w-xl mx-auto mt-8 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-4 border border-sky-100">
                {currentMenuItem.largeIcon}
              </div>

              <h3 className="text-base font-bold text-slate-800 mb-2">
                Mục "{currentMenuItem.label}"
              </h3>

              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                Khu vực này hiện đang được để trống theo đúng yêu cầu của bạn.
              </p>

              <button
                type="button"
                id="btn-back-to-pages"
                onClick={() => setActiveTab('pages')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold rounded-xl transition inline-flex items-center gap-2"
              >
                Quay lại mục Trang
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Confirmation Modal: Xóa trang */}
      {pageToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-2xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <Trash2 size={20} />
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              Xác nhận xóa trang?
            </h3>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              Bạn có chắc chắn muốn xóa trang <strong>"{pageToDelete.title}"</strong>? Thao tác này sẽ xóa vĩnh viễn trang khỏi danh sách.
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setPageToDelete(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
