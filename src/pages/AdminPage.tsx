import React, { useRef, useState } from 'react';
import {
  AlertCircle,
  Award,
  Building2,
  CheckCircle2,
  Clock,
  Cloud,
  Edit2,
  ExternalLink,
  FileText,
  Globe,
  Handshake,
  HeartHandshake,
  History,
  Image,
  Layers,
  Layout,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  PenTool,
  Plus,
  RefreshCw,
  Settings,
  Trash2,
  UserCheck,
} from 'lucide-react';

import { useDataContext } from '../context/DataContext';
import {
  AdminManagerActionRef,
  AdminUser,
  CustomPage,
  PageRoute,
} from '../types';

import { AdminLogin } from '../components/admin/AdminLogin';
import { StandalonePageEditor } from '../components/admin/StandalonePageEditor';
import { AdminLayoutManager } from '../components/admin/AdminLayoutManager';
import { AdminSettings } from '../components/admin/AdminSettings';
import { AdminProgramsManager } from '../components/admin/AdminProgramsManager';
import { AdminUnitsManager } from '../components/admin/AdminUnitsManager';
import { AdminNewsManager } from '../components/admin/AdminNewsManager';
import { AdminRecordsManager } from '../components/admin/AdminRecordsManager';
import { AdminGlobalContentManager } from '../components/admin/AdminGlobalContentManager';
import { AdminRemoteDataManager } from '../components/admin/AdminRemoteDataManager';
import { AdminAboutManager } from '../components/admin/AdminAboutManager';

import { logoutFirebase } from '../lib/firebaseAuth';

interface AdminPageProps {
  onNavigate: (route: PageRoute) => void;
  onShowToast: (message: string) => void;
  initialTab?: string;
  initialSlug?: string;
}

export type AdminTab =
  | 'layout'
  | 'programs'
  | 'units'
  | 'posts'
  | 'pages'
  | 'comments'
  | 'registrations'
  | 'contacts'
  | 'certificates'
  | 'partners'
  | 'contributions'
  | 'media'
  | 'menus'
  | 'logs'
  | 'settings';

interface MenuItemConfig {
  id: AdminTab;
  label: string;
  icon: React.ReactNode;
  largeIcon: React.ReactNode;
}

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
  {
    id: 'certificates',
    label: 'Giấy chứng nhận',
    icon: <Award size={18} />,
    largeIcon: <Award size={24} />,
  },
  {
    id: 'partners',
    label: 'Đối tác & Đồng hành',
    icon: <Handshake size={18} />,
    largeIcon: <Handshake size={24} />,
  },
  {
    id: 'contributions',
    label: 'Tài trợ & Đóng góp',
    icon: <HeartHandshake size={18} />,
    largeIcon: <HeartHandshake size={24} />,
  },
  {
    id: 'media',
    label: 'Media',
    icon: <Image size={18} />,
    largeIcon: <Image size={24} />,
  },
  {
    id: 'menus',
    label: 'Nội dung toàn cục',
    icon: <Menu size={18} />,
    largeIcon: <Menu size={24} />,
  },
  {
    id: 'logs',
    label: 'Nhật ký',
    icon: <History size={18} />,
    largeIcon: <History size={24} />,
  },
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

    teamMembers,
    corePillars,
    timeline,

    isFirebaseConfigured,
    firebaseSyncStatus,
  } = useDataContext();

  const [currentAdminUser, setCurrentAdminUser] =
    useState<AdminUser | null>(() => {
      try {
        const stored = localStorage.getItem('sfn_admin_session');

        if (stored) {
          const parsed: AdminUser = JSON.parse(stored);

          const match = adminUsers.find(
            (user) =>
              user.email.toLowerCase() === parsed.email.toLowerCase() &&
              user.status === 'active'
          );

          return match || parsed;
        }
      } catch {}

      return null;
    });

  const handleLogout = async () => {
    try {
      await logoutFirebase();
    } catch (error) {
      console.warn('Firebase logout error:', error);
    }

    try {
      localStorage.removeItem('sfn_admin_session');
    } catch {}

    setCurrentAdminUser(null);

    onShowToast(
      'Đã đăng xuất khỏi trang quản trị website Sky First Network.'
    );
  };

  const [activeTab, setActiveTab] = useState<AdminTab>(() => {
    if (
      initialTab &&
      MENU_ITEMS.some((menuItem) => menuItem.id === initialTab)
    ) {
      return initialTab as AdminTab;
    }

    return 'pages';
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] =
    useState(false);

  const programsActionRef =
    useRef<AdminManagerActionRef | null>(null);

  const unitsActionRef =
    useRef<AdminManagerActionRef | null>(null);

  const newsActionRef =
    useRef<AdminManagerActionRef | null>(null);

  const [programsViewMode, setProgramsViewMode] =
    useState<'list' | 'edit'>('list');

  const [unitsViewMode, setUnitsViewMode] =
    useState<'list' | 'edit'>('list');

  const [newsViewMode, setNewsViewMode] =
    useState<'list' | 'edit'>('list');

  const [editingPage, setEditingPage] =
    useState<CustomPage | null>(() => {
      if (initialSlug) {
        const found = customPages.find(
          (page) =>
            page.slug === initialSlug ||
            page.id === initialSlug
        );

        return found || null;
      }

      return null;
    });

  const [pageToDelete, setPageToDelete] =
    useState<CustomPage | null>(null);

  const currentMenuItem =
    MENU_ITEMS.find((item) => item.id === activeTab) ||
    MENU_ITEMS[0];

  const displayPages = customPages.filter(
    (page) =>
      !['home', 'programs', 'units', 'news'].includes(
        page.slug
      ) &&
      ![
        'page-home',
        'page-programs',
        'page-units',
        'page-news',
      ].includes(page.id)
  );

  const getDisplayUrl = (page: CustomPage) => {
    if (page.slug === 'about') return '/about';
    if (page.slug === 'contact') return '/contact';

    if (
      ['certificate', 'sponsor', 'join'].includes(page.slug)
    ) {
      return `/${page.slug}`;
    }

    return `/trang/${page.slug}`;
  };

  const handleStartCreatePage = () => {
    const newId = `page-${Date.now()}`;

    const newPage: CustomPage = {
      id: newId,
      slug: `trang-moi-${Date.now()
        .toString()
        .slice(-4)}`,
      title: 'Trang thông tin mới',
      summary: '',
      content: '',
      contentFormatted: '',
      imageUrl: '',
      isPublished: false,
      publishedAt: new Date().toLocaleDateString('vi-VN'),
      author: 'Ban Quản trị Sky First Network',
      views: 0,
      type: 'custom',
      showInFooter: false,
    };

    addCustomPage(newPage);
    setEditingPage(newPage);

    onShowToast(
      'Đã khởi tạo trang mới ở trạng thái Bản nháp.'
    );
  };

  const handleStartEditPage = (page: CustomPage) => {
    setEditingPage(page);
  };

  const handleTogglePublishStatus = (
    page: CustomPage,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();

    const newStatus = page.isPublished === false;

    updateCustomPage(page.id, {
      isPublished: newStatus,
    });

    onShowToast(
      newStatus
        ? `Đã xuất bản trang "${page.title}"!`
        : `Đã chuyển trang "${page.title}" về Bản nháp!`
    );
  };

  const handleDeletePage = (
    page: CustomPage,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    setPageToDelete(page);
  };

  const handleConfirmDelete = () => {
    if (!pageToDelete) return;

    deleteCustomPage(pageToDelete.id);

    onShowToast(
      `Đã xóa trang "${pageToDelete.title}"!`
    );

    setPageToDelete(null);
  };

  if (!currentAdminUser) {
    return (
      <AdminLogin
        adminUsers={adminUsers}
        addAdminUser={addAdminUser}
        onLoginSuccess={(user) =>
          setCurrentAdminUser(user)
        }
        onNavigateHome={() => onNavigate('home')}
        onShowToast={onShowToast}
      />
    );
  }

  /*
   * ==========================================================
   * TRANG ABOUT
   * ==========================================================
   *
   * Riêng /about mở AdminAboutManager.
   *
   * Không dùng các handler team cũ ở đây vì AdminAboutManager
   * đã ghi trực tiếp customTeam/customTimeline/customPillars
   * vào CustomPage "about".
   *
   * Các callback fallback bên dưới chỉ được dùng nếu bản ghi
   * about không tồn tại.
   */
  if (
    editingPage &&
    (editingPage.slug === 'about' ||
      editingPage.id === 'page-about')
  ) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
          <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setEditingPage(null)}
                className="inline-flex shrink-0 items-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
              >
                ← Quay lại
              </button>

              <div className="min-w-0">
                <h1 className="truncate text-sm font-black text-slate-900 sm:text-base">
                  Quản lý Trang Giới thiệu
                </h1>

                <p className="hidden text-[11px] text-slate-500 sm:block">
                  Nội dung, hành trình, đội ngũ, trụ cột
                  và giá trị cốt lõi
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('about')}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-sky-600 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-sky-700"
            >
              <ExternalLink size={14} />
              <span className="hidden sm:inline">
                Xem trang công khai
              </span>
              <span className="sm:hidden">Xem trang</span>
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl p-4 sm:p-6">
          <AdminAboutManager
            teamMembers={teamMembers}
            corePillars={corePillars}
            timeline={timeline}
            onUpdateTeamMember={() => {}}
            onAddTeamMember={() => {}}
            onDeleteTeamMember={() => {}}
            onUpdateCorePillar={() => {}}
            onNavigate={onNavigate}
            onShowToast={onShowToast}
          />
        </main>
      </div>
    );
  }

  /*
   * Các trang còn lại vẫn dùng editor cũ.
   */
  if (editingPage) {
    return (
      <StandalonePageEditor
        page={editingPage}
        onSave={(updates) => {
          updateCustomPage(editingPage.id, updates);

          setEditingPage((previous) =>
            previous
              ? {
                  ...previous,
                  ...updates,
                }
              : null
          );
        }}
        onClose={() => setEditingPage(null)}
        onShowToast={onShowToast}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <aside
        className={`sticky top-0 z-20 flex h-screen shrink-0 flex-col border-r border-slate-200 bg-white transition-all duration-200 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="flex h-16 items-center justify-between gap-2 border-b border-slate-200 px-4">
          {!isSidebarCollapsed ? (
            <div className="flex min-w-0 items-center gap-2.5 overflow-hidden">
              <div className="h-8 w-8 shrink-0 rounded-xl border border-slate-200 bg-white p-0.5 shadow-xs">
                <img
                  src="/brand/sky-first-network-web.png"
                  alt="Sky First Network"
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="truncate">
                <span className="block truncate text-sm font-extrabold tracking-tight text-slate-900">
                  Quản trị Sky First Network
                </span>

                <span className="block truncate text-[11px] text-slate-400">
                  Quản trị hệ thống
                </span>
              </div>
            </div>
          ) : (
            <div className="mx-auto">
              <div className="h-8 w-8 rounded-xl border border-slate-200 bg-white p-0.5 shadow-xs">
                <img
                  src="/brand/sky-first-network-web.png"
                  alt="Sky First Network"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          )}

          <button
            type="button"
            id="admin-btn-toggle-sidebar"
            onClick={() =>
              setIsSidebarCollapsed(
                !isSidebarCollapsed
              )
            }
            className="shrink-0 rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-800"
            title={
              isSidebarCollapsed
                ? 'Mở rộng thanh menu'
                : 'Thu gọn thanh menu'
            }
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen size={18} />
            ) : (
              <PanelLeftClose size={18} />
            )}
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto p-3">
          {MENU_ITEMS.map((item) => {
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                id={`menu-item-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition ${
                  isActive
                    ? 'border border-sky-200/80 bg-sky-50 text-sky-700 shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                } ${
                  isSidebarCollapsed
                    ? 'justify-center px-0'
                    : 'justify-start'
                }`}
                title={item.label}
              >
                <span
                  className={`shrink-0 ${
                    isActive
                      ? 'text-sky-600'
                      : 'text-slate-400'
                  }`}
                >
                  {item.icon}
                </span>

                {!isSidebarCollapsed && (
                  <span>{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-3">
          <div className="flex items-center gap-1">
            <button
              type="button"
              id="menu-item-view-site"
              onClick={() => onNavigate('home')}
              className={`flex flex-1 items-center gap-2.5 rounded-xl border border-transparent px-3 py-2.5 text-xs font-bold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-600 ${
                isSidebarCollapsed
                  ? 'justify-center px-0'
                  : ''
              }`}
              title="Xem website"
            >
              <Globe
                size={16}
                className="shrink-0 text-slate-400"
              />

              {!isSidebarCollapsed && (
                <span>Xem website</span>
              )}
            </button>

            <button
              type="button"
              id="menu-item-logout-sidebar"
              onClick={handleLogout}
              className="shrink-0 rounded-xl border border-transparent p-2.5 text-slate-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
              title="Đăng xuất khỏi trang quản trị"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <header className="sticky top-0 z-10 flex min-h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-3">
          <div className="min-w-0">
            <h1 className="truncate text-base font-extrabold text-slate-900">
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

            <p className="truncate text-xs text-slate-500">
              {activeTab === 'pages'
                ? `Tổng số ${displayPages.length} trang trong hệ thống`
                : activeTab === 'programs'
                ? `Quản lý ${programs.length} chương trình & dự án cộng đồng`
                : activeTab === 'units'
                ? `Hệ thống ${networkUnits.length} đơn vị trực thuộc`
                : activeTab === 'posts'
                ? `Tổng số ${newsArticles.length} bài đăng và thông báo`
                : activeTab === 'layout'
                ? 'Chỉnh sửa nội dung, ẩn/hiện và sắp xếp Trang chủ'
                : activeTab === 'settings'
                ? 'Thiết lập website và tài khoản quản trị'
                : 'Khu vực quản trị dữ liệu website'}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            {activeTab === 'pages' && (
              <button
                type="button"
                id="admin-btn-create-page"
                onClick={handleStartCreatePage}
                className="flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-sky-700"
              >
                <Plus size={15} />
                <span>Thêm mới</span>
              </button>
            )}

            {activeTab === 'programs' &&
              programsViewMode === 'list' && (
                <button
                  type="button"
                  id="admin-btn-create-program"
                  onClick={() =>
                    programsActionRef.current?.handleCreateNew()
                  }
                  className="flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-sky-700"
                >
                  <Plus size={15} />
                  <span>Thêm mới</span>
                </button>
              )}

            {activeTab === 'units' &&
              unitsViewMode === 'list' && (
                <button
                  type="button"
                  id="admin-btn-create-unit"
                  onClick={() =>
                    unitsActionRef.current?.handleCreateNew()
                  }
                  className="flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-sky-700"
                >
                  <Plus size={15} />
                  <span>Thêm mới</span>
                </button>
              )}

            {activeTab === 'posts' &&
              newsViewMode === 'list' && (
                <button
                  type="button"
                  id="admin-btn-create-news"
                  onClick={() =>
                    newsActionRef.current?.handleCreateNew()
                  }
                  className="flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-sky-700"
                >
                  <Plus size={15} />
                  <span>Thêm mới</span>
                </button>
              )}

            <div className="hidden items-center md:flex">
              {isFirebaseConfigured ? (
                firebaseSyncStatus === 'synced' ? (
                  <button
                    type="button"
                    onClick={() =>
                      setActiveTab('settings')
                    }
                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200/80 bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
                  >
                    <CheckCircle2
                      size={13}
                      className="text-emerald-600"
                    />
                    <span>Firebase: Đã đồng bộ</span>
                  </button>
                ) : firebaseSyncStatus ===
                  'syncing' ? (
                  <span className="inline-flex items-center gap-1.5 rounded-xl border border-sky-200/80 bg-sky-50 px-2.5 py-1.5 text-xs font-bold text-sky-700">
                    <RefreshCw
                      size={13}
                      className="animate-spin text-sky-600"
                    />
                    <span>Đang đồng bộ...</span>
                  </span>
                ) : firebaseSyncStatus === 'error' ? (
                  <button
                    type="button"
                    onClick={() =>
                      setActiveTab('settings')
                    }
                    className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200/80 bg-rose-50 px-2.5 py-1.5 text-xs font-bold text-rose-700 transition hover:bg-rose-100"
                  >
                    <AlertCircle
                      size={13}
                      className="text-rose-600"
                    />
                    <span>Lỗi Firebase</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      setActiveTab('settings')
                    }
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
                  >
                    <Cloud
                      size={13}
                      className="text-slate-500"
                    />
                    <span>Firebase Sẵn Sàng</span>
                  </button>
                )
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    setActiveTab('settings')
                  }
                  className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs font-medium text-amber-800 transition hover:bg-amber-100"
                >
                  <Cloud
                    size={13}
                    className="text-amber-600"
                  />
                  <span>Cần cấu hình .env</span>
                </button>
              )}
            </div>

            <div className="border-l border-slate-200 pl-2">
              <button
                type="button"
                id="btn-admin-header-logout"
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 shadow-2xs transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
              >
                <LogOut size={14} />

                <span className="hidden sm:inline">
                  Đăng xuất
                </span>
              </button>
            </div>
          </div>
        </header>

        <div className="mx-auto w-full max-w-6xl p-6">
          {siteConfig.siteStatus === 'closed' && (
            <div className="mb-6 flex flex-col items-center justify-between gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-950 shadow-xs sm:flex-row">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 shrink-0 animate-ping rounded-full bg-amber-500" />

                <div>
                  <span className="block text-xs font-black">
                    Website Hiện Đang Ở Chế Độ Đóng (
                    {siteConfig.closedReasonText ||
                      'Bảo trì / Biên tập'}
                    )
                  </span>

                  <span className="mt-0.5 block text-[11px] text-amber-800">
                    Trang quản trị vẫn hoạt động bình
                    thường.
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  id="btn-admin-reopen-site"
                  onClick={() => {
                    updateSiteConfig({
                      siteStatus: 'active',
                    });

                    onShowToast(
                      'Đã mở lại website công khai thành công!'
                    );
                  }}
                  className="rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs transition hover:bg-emerald-700"
                >
                  Mở lại Website
                </button>

                {activeTab !== 'settings' && (
                  <button
                    type="button"
                    onClick={() =>
                      setActiveTab('settings')
                    }
                    className="rounded-xl border border-amber-300 bg-white px-3 py-1.5 text-xs font-bold text-amber-900 transition hover:bg-amber-100"
                  >
                    Cấu hình
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'pages' && (
            <div className="space-y-4">
              {displayPages.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                  <FileText
                    size={40}
                    className="mx-auto mb-3 text-slate-300"
                  />

                  <h3 className="mb-1 text-base font-bold text-slate-800">
                    Chưa có trang thông tin nào
                  </h3>

                  <p className="mb-5 text-xs text-slate-500">
                    Bắt đầu tạo trang đầu tiên để bổ
                    sung thông tin cho website.
                  </p>

                  <button
                    type="button"
                    onClick={handleStartCreatePage}
                    className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-sky-700"
                  >
                    <Plus size={15} />
                    <span>Thêm mới</span>
                  </button>
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
                  <div className="grid grid-cols-12 gap-4 border-b border-slate-200 bg-slate-50/80 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <div className="col-span-12 sm:col-span-5">
                      Tên trang
                    </div>

                    <div className="hidden sm:col-span-2 sm:block">
                      Nhãn
                    </div>

                    <div className="hidden sm:col-span-2 sm:block">
                      Người xuất bản
                    </div>

                    <div className="hidden text-right sm:col-span-3 sm:block">
                      Ngày xuất bản
                    </div>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {displayPages.map((page) => (
                      <div
                        key={page.id}
                        id={`page-row-${page.id}`}
                        onClick={() =>
                          handleStartEditPage(page)
                        }
                        className="group relative grid cursor-pointer grid-cols-12 items-center gap-4 px-5 py-4 transition hover:bg-sky-50/40"
                      >
                        <div className="col-span-12 pr-2 sm:col-span-5">
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`h-2 w-2 shrink-0 rounded-full ${
                                page.isPublished !==
                                false
                                  ? 'bg-emerald-500'
                                  : 'bg-amber-500'
                              }`}
                            />

                            <div className="min-w-0">
                              <h3 className="truncate text-sm font-bold text-slate-900 transition group-hover:text-sky-600">
                                {page.title ||
                                  'Trang chưa đặt tên'}
                              </h3>

                              <p className="mt-0.5 truncate font-mono text-[11px] text-slate-500">
                                {getDisplayUrl(page)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="hidden flex-wrap items-center gap-1 sm:col-span-2 sm:flex">
                          {page.showInFooter !==
                          false ? (
                            <span className="shrink-0 rounded-md border border-sky-200 bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700">
                              Chân trang
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">
                              —
                            </span>
                          )}
                        </div>

                        <div className="hidden truncate text-xs text-slate-600 sm:col-span-2 sm:block">
                          {page.author ||
                            'Ban Quản trị Sky First Network'}
                        </div>

                        <div className="hidden items-center justify-end sm:col-span-3 sm:flex">
                          <div className="text-right group-hover:hidden">
                            <span className="block text-xs text-slate-500">
                              {page.publishedAt ||
                                'Hôm nay'}
                            </span>

                            <span
                              className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                page.isPublished !==
                                false
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-amber-50 text-amber-700'
                              }`}
                            >
                              {page.isPublished !==
                              false
                                ? 'Đã xuất bản'
                                : 'Bản nháp'}
                            </span>
                          </div>

                          <div className="hidden items-center gap-1 group-hover:flex">
                            <button
                              type="button"
                              id={`btn-edit-${page.id}`}
                              onClick={(event) => {
                                event.stopPropagation();
                                handleStartEditPage(
                                  page
                                );
                              }}
                              className="rounded-lg border border-slate-200 p-1.5 text-slate-600 shadow-2xs transition hover:bg-white hover:text-sky-600"
                              title="Chỉnh sửa trang"
                            >
                              <Edit2 size={15} />
                            </button>

                            <button
                              type="button"
                              id={`btn-toggle-publish-${page.id}`}
                              onClick={(event) =>
                                handleTogglePublishStatus(
                                  page,
                                  event
                                )
                              }
                              className={`rounded-lg border bg-white p-1.5 shadow-2xs transition ${
                                page.isPublished !==
                                false
                                  ? 'border-amber-200 text-amber-600 hover:bg-amber-50'
                                  : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                              }`}
                            >
                              {page.isPublished !==
                              false ? (
                                <Clock size={15} />
                              ) : (
                                <CheckCircle2
                                  size={15}
                                />
                              )}
                            </button>

                            <button
                              type="button"
                              id={`btn-delete-${page.id}`}
                              onClick={(event) =>
                                handleDeletePage(
                                  page,
                                  event
                                )
                              }
                              className="rounded-lg border border-slate-200 p-1.5 text-slate-500 shadow-2xs transition hover:bg-white hover:text-rose-600"
                              title="Xóa trang"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>

                        <div className="col-span-12 flex items-center justify-between border-t border-slate-100 pt-2 text-xs text-slate-500 sm:hidden">
                          <span>
                            {page.author} •{' '}
                            {page.publishedAt}
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleStartEditPage(
                                  page
                                );
                              }}
                              className="p-1 text-slate-600 hover:text-sky-600"
                            >
                              <Edit2 size={14} />
                            </button>

                            <button
                              type="button"
                              onClick={(event) =>
                                handleTogglePublishStatus(
                                  page,
                                  event
                                )
                              }
                              className="p-1 text-slate-600 hover:text-emerald-600"
                            >
                              {page.isPublished !==
                              false ? (
                                <Clock size={14} />
                              ) : (
                                <CheckCircle2
                                  size={14}
                                />
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={(event) =>
                                handleDeletePage(
                                  page,
                                  event
                                )
                              }
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

          {activeTab === 'layout' && (
            <AdminLayoutManager
              onNavigate={onNavigate}
              onShowToast={onShowToast}
              onSwitchTab={(tab) =>
                setActiveTab(tab as AdminTab)
              }
            />
          )}

          {(
            [
              'comments',
              'contacts',
              'media',
              'registrations',
            ] as AdminTab[]
          ).includes(activeTab) && (
            <AdminRemoteDataManager
              kind={
                activeTab as
                  | 'comments'
                  | 'contacts'
                  | 'media'
                  | 'registrations'
              }
              onShowToast={onShowToast}
            />
          )}

          {(
            [
              'certificates',
              'partners',
              'contributions',
              'logs',
            ] as AdminTab[]
          ).includes(activeTab) && (
            <AdminRecordsManager
              kind={activeTab}
              onShowToast={onShowToast}
            />
          )}

          {activeTab === 'menus' && (
            <AdminGlobalContentManager
              onShowToast={onShowToast}
            />
          )}

          {activeTab === 'settings' && (
            <AdminSettings
              onShowToast={onShowToast}
              onNavigate={onNavigate}
            />
          )}
        </div>
      </main>

      {pageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-2xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <Trash2 size={20} />
            </div>

            <h3 className="mb-1 text-base font-bold text-slate-900">
              Xác nhận xóa trang?
            </h3>

            <p className="mb-6 text-xs leading-relaxed text-slate-600">
              Bạn có chắc chắn muốn xóa trang{' '}
              <strong>
                "{pageToDelete.title}"
              </strong>
              ? Thao tác này sẽ xóa trang khỏi danh
              sách.
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() =>
                  setPageToDelete(null)
                }
                className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-100"
              >
                Hủy bỏ
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-rose-700"
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
