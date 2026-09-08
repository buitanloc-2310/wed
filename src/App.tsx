import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProgramsPage } from './pages/ProgramsPage';
import { UnitsPage } from './pages/UnitsPage';
import { NewsPage } from './pages/NewsPage';
import { CertificatePage } from './pages/CertificatePage';
import { JoinPage } from './pages/JoinPage';
import { SponsorPage } from './pages/SponsorPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';
import { ProgramDetailPage } from './pages/ProgramDetailPage';
import { NewsDetailPage } from './pages/NewsDetailPage';
import { CustomPageDetail } from './pages/CustomPageDetail';
import { ProgramModal } from './components/ProgramModal';
import { NewsModal } from './components/NewsModal';
import { Toast } from './components/Toast';
import { PageRoute, Program, NewsArticle } from './types';
import { useDataContext, DataProvider } from './context/DataContext';
import { SiteClosedTopBanner } from './components/SiteClosedTopBanner';
import { SiteClosedNotice } from './components/SiteClosedNotice';
import { getProgramSlug, getArticleSlug } from './utils/slug';

const VALID_ROUTES: PageRoute[] = [
  'home',
  'about',
  'programs',
  'units',
  'news',
  'certificate',
  'sponsor',
  'join',
  'contact',
  'admin',
  'program-detail',
  'news-detail',
  'custom-page',
];

const PAGE_TITLES: Partial<Record<PageRoute, string>> = {
  home: 'Trang Chủ | Sky First Network',
  about: 'Giới Thiệu | Sky First Network',
  programs: 'Chương Trình & Dự Án | Sky First Network',
  units: 'Đơn Vị Trực Thuộc | Sky First Network',
  news: 'Tin Tức & Hoạt Động | Sky First Network',
  certificate: 'Tra Cứu Chứng Nhận Số SFCA | SFN',
  sponsor: 'Tài Trợ & Đồng Hành | Sky First Network',
  join: 'Tham Gia Sky First Network | Sky First Network',
  contact: 'Liên Hệ & Hợp Tác | Sky First Network',
  admin: 'Trung Tâm Quản Trị Hệ Thống (CMS) | Sky First Network',
  'custom-page': 'Trang Thông Tin | Sky First Network',
};

interface ParsedRoute {
  page: PageRoute;
  slug?: string;
  adminTab?: string;
  adminSlug?: string;
}

const parseUrlRoute = (): ParsedRoute => {
  if (typeof window === 'undefined') return { page: 'home' };

  const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '');
  const segments = pathname.split('/').filter(Boolean);

  // Match /admin/...
  if (segments[0] === 'admin') {
    if ((segments[1] === 'tin-tuc' || segments[1] === 'bai-dang') && segments[2]) {
      return { page: 'admin', adminTab: 'posts', adminSlug: decodeURIComponent(segments[2]) };
    }
    if (segments[1] === 'trang' && segments[2]) {
      return { page: 'admin', adminTab: 'pages', adminSlug: decodeURIComponent(segments[2]) };
    }
    if (segments[1] === 'bo-cuc') return { page: 'admin', adminTab: 'layout' };
    if (segments[1] === 'chuong-trinh') return { page: 'admin', adminTab: 'programs' };
    if (segments[1] === 'don-vi') return { page: 'admin', adminTab: 'units' };
    if (segments[1] === 'bai-dang' || segments[1] === 'tin-tuc') return { page: 'admin', adminTab: 'posts' };
    if (segments[1] === 'trang') return { page: 'admin', adminTab: 'pages' };
    if (segments[1] === 'binh-luan') return { page: 'admin', adminTab: 'comments' };
    if (segments[1] === 'dang-ky') return { page: 'admin', adminTab: 'registrations' };
    if (segments[1] === 'lien-he') return { page: 'admin', adminTab: 'contacts' };
    if (segments[1] === 'giay-chung-nhan') return { page: 'admin', adminTab: 'certificates' };
    if (segments[1] === 'doi-tac') return { page: 'admin', adminTab: 'partners' };
    if (segments[1] === 'tai-tro-dong-gop') return { page: 'admin', adminTab: 'contributions' };
    if (segments[1] === 'media') return { page: 'admin', adminTab: 'media' };
    if (segments[1] === 'menu') return { page: 'admin', adminTab: 'menus' };
    if (segments[1] === 'nhat-ky') return { page: 'admin', adminTab: 'logs' };
    if (segments[1] === 'cai-dat') return { page: 'admin', adminTab: 'settings' };
    return { page: 'admin' };
  }

  // Match /du-an/:slug
  if (segments[0] === 'du-an' && segments[1]) {
    return { page: 'program-detail', slug: decodeURIComponent(segments[1]) };
  }
  if (segments[0] === 'du-an' && !segments[1]) {
    return { page: 'programs' };
  }

  // Match /tin-tuc/:slug
  if (segments[0] === 'tin-tuc' && segments[1]) {
    return { page: 'news-detail', slug: decodeURIComponent(segments[1]) };
  }
  if (segments[0] === 'tin-tuc' && !segments[1]) {
    return { page: 'news' };
  }

  // Match /trang/:slug or /page/:slug
  if ((segments[0] === 'trang' || segments[0] === 'page') && segments[1]) {
    return { page: 'custom-page', slug: decodeURIComponent(segments[1]) };
  }

  // Exact standard routes
  if (segments[0] && VALID_ROUTES.includes(segments[0] as PageRoute)) {
    return { page: segments[0] as PageRoute };
  }

  // Hash fallback (e.g. #/du-an/tien-phong-so or #/admin/tin-tuc/abc)
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  const hashSegments = hash.split('/').filter(Boolean);
  if (hashSegments[0] === 'admin') {
    if ((hashSegments[1] === 'tin-tuc' || hashSegments[1] === 'bai-dang') && hashSegments[2]) {
      return { page: 'admin', adminTab: 'posts', adminSlug: decodeURIComponent(hashSegments[2]) };
    }
    if (hashSegments[1] === 'trang' && hashSegments[2]) {
      return { page: 'admin', adminTab: 'pages', adminSlug: decodeURIComponent(hashSegments[2]) };
    }
    if (hashSegments[1] === 'bo-cuc') return { page: 'admin', adminTab: 'layout' };
    if (hashSegments[1] === 'chuong-trinh') return { page: 'admin', adminTab: 'programs' };
    if (hashSegments[1] === 'don-vi') return { page: 'admin', adminTab: 'units' };
    if (hashSegments[1] === 'bai-dang' || hashSegments[1] === 'tin-tuc') return { page: 'admin', adminTab: 'posts' };
    if (hashSegments[1] === 'trang') return { page: 'admin', adminTab: 'pages' };
    if (hashSegments[1] === 'binh-luan') return { page: 'admin', adminTab: 'comments' };
    if (hashSegments[1] === 'dang-ky') return { page: 'admin', adminTab: 'registrations' };
    if (hashSegments[1] === 'lien-he') return { page: 'admin', adminTab: 'contacts' };
    if (hashSegments[1] === 'cai-dat') return { page: 'admin', adminTab: 'settings' };
    return { page: 'admin' };
  }
  if (hashSegments[0] === 'du-an' && hashSegments[1]) {
    return { page: 'program-detail', slug: decodeURIComponent(hashSegments[1]) };
  }
  if (hashSegments[0] === 'tin-tuc' && hashSegments[1]) {
    return { page: 'news-detail', slug: decodeURIComponent(hashSegments[1]) };
  }
  if ((hashSegments[0] === 'trang' || hashSegments[0] === 'page') && hashSegments[1]) {
    return { page: 'custom-page', slug: decodeURIComponent(hashSegments[1]) };
  }
  if (hashSegments[0] && VALID_ROUTES.includes(hashSegments[0] as PageRoute)) {
    return { page: hashSegments[0] as PageRoute };
  }

  return { page: 'home' };
};

function AppMainContent() {
  const { siteConfig } = useDataContext();
  const initialRoute = parseUrlRoute();
  const [currentPage, setCurrentPage] = useState<PageRoute>(initialRoute.page);
  const [currentSlug, setCurrentSlug] = useState<string | undefined>(initialRoute.slug);
  const [adminTab, setAdminTab] = useState<string | undefined>(initialRoute.adminTab);
  const [adminSlug, setAdminSlug] = useState<string | undefined>(initialRoute.adminSlug);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // URL synchronization handler
  const handleNavigate = useCallback((page: PageRoute, slug?: string, updateHistory = true) => {
    setCurrentPage(page);
    setCurrentSlug(slug);

    let targetPath = `/${page}`;
    let pageTitle = PAGE_TITLES[page] || 'Sky First Network';

    if (page === 'program-detail' && slug) {
      targetPath = `/du-an/${slug}`;
      pageTitle = 'Chi Tiết Dự Án | Sky First Network';
    } else if (page === 'news-detail' && slug) {
      targetPath = `/tin-tuc/${slug}`;
      pageTitle = 'Chi Tiết Bản Tin | Sky First Network';
    } else if (page === 'custom-page' && slug) {
      targetPath = `/page/${slug}`;
      pageTitle = 'Trang Thông Tin | Sky First Network';
    }

    document.title = pageTitle;

    if (updateHistory && typeof window !== 'undefined') {
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ page, slug }, '', targetPath);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Listen to browser Back/Forward (popstate) & hash changes
  useEffect(() => {
    const handleLocationChange = () => {
      const route = parseUrlRoute();
      setCurrentPage(route.page);
      setCurrentSlug(route.slug);
      setAdminTab(route.adminTab);
      setAdminSlug(route.adminSlug);
      document.title = PAGE_TITLES[route.page] || 'Sky First Network';
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    // Initial sync
    const route = parseUrlRoute();
    const currentPath = window.location.pathname;
    if (currentPath === '/' || currentPath === '') {
      window.history.replaceState({ page: 'home' }, '', '/home');
    }

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const isSiteClosed = siteConfig.siteStatus === 'closed';
  const showLockscreen = isSiteClosed && currentPage !== 'admin' && siteConfig.closedNoticeType !== 'banner';

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-[#0284C7] selection:text-white">
      {/* Banner thông báo trên đầu trang khi đóng website */}
      {isSiteClosed && (
        <SiteClosedTopBanner
          siteConfig={siteConfig}
          onNavigateToAdmin={() => handleNavigate('admin')}
        />
      )}

      {/* Màn hình khóa khi đóng website chế độ Lockscreen (trừ trang /admin) */}
      {showLockscreen ? (
        <main className="flex-grow">
          <SiteClosedNotice
            siteConfig={siteConfig}
            onNavigateToAdmin={() => handleNavigate('admin')}
          />
        </main>
      ) : (
        <>
          {/* Navbar (hidden on admin for clean workspace) */}
          {currentPage !== 'admin' && (
            <Navbar
              currentPage={currentPage}
              onNavigate={(p) => handleNavigate(p)}
              onSelectProgram={(p) => {
                const slug = getProgramSlug(p);
                handleNavigate('program-detail', slug);
              }}
              onSelectArticle={(a) => {
                const slug = getArticleSlug(a);
                handleNavigate('news-detail', slug);
              }}
            />
          )}

        {/* Main Multi-Page Body Content with Explicit URL Routes */}
        <main className="flex-grow">
          {currentPage === 'home' && (
            <HomePage
              onNavigate={(p) => handleNavigate(p)}
              onSelectProgram={(p) => {
                const slug = getProgramSlug(p);
                handleNavigate('program-detail', slug);
              }}
              onSelectArticle={(a) => {
                const slug = getArticleSlug(a);
                handleNavigate('news-detail', slug);
              }}
            />
          )}

          {currentPage === 'about' && (
            <AboutPage
              onNavigate={(p) => handleNavigate(p)}
            />
          )}

          {currentPage === 'programs' && (
            <ProgramsPage
              onSelectProgram={(p) => {
                const slug = getProgramSlug(p);
                handleNavigate('program-detail', slug);
              }}
              onNavigate={(p) => handleNavigate(p)}
            />
          )}

          {currentPage === 'program-detail' && (
            <ProgramDetailPage
              programSlugOrId={currentSlug || ''}
              onNavigate={(p) => handleNavigate(p)}
              onShowToast={showToast}
              onSelectProgram={(p) => {
                const slug = getProgramSlug(p);
                handleNavigate('program-detail', slug);
              }}
            />
          )}

          {currentPage === 'units' && (
            <UnitsPage
              onNavigate={(p) => handleNavigate(p)}
              onShowToast={showToast}
            />
          )}

          {currentPage === 'news' && (
            <NewsPage
              onSelectArticle={(a) => {
                const slug = getArticleSlug(a);
                handleNavigate('news-detail', slug);
              }}
              onNavigate={(p) => handleNavigate(p)}
            />
          )}

          {currentPage === 'news-detail' && (
            <NewsDetailPage
              newsSlugOrId={currentSlug || ''}
              onNavigate={(p) => handleNavigate(p)}
              onShowToast={showToast}
              onSelectArticle={(a) => {
                const slug = getArticleSlug(a);
                handleNavigate('news-detail', slug);
              }}
            />
          )}

          {currentPage === 'certificate' && (
            <CertificatePage
              onShowToast={showToast}
            />
          )}

          {currentPage === 'sponsor' && (
            <SponsorPage
              onNavigate={(p) => handleNavigate(p)}
              onShowToast={showToast}
            />
          )}

          {currentPage === 'join' && (
            <JoinPage
              onShowToast={showToast}
              onNavigate={(p) => handleNavigate(p)}
            />
          )}

          {currentPage === 'contact' && (
            <ContactPage
              onNavigate={(p) => handleNavigate(p)}
              onShowToast={showToast}
            />
          )}

          {currentPage === 'custom-page' && (
            <CustomPageDetail
              slug={currentSlug || ''}
              onNavigate={(p) => handleNavigate(p)}
            />
          )}

          {currentPage === 'admin' && (
            <AdminPage
              onNavigate={(p) => handleNavigate(p)}
              onShowToast={showToast}
              initialTab={adminTab as any}
              initialSlug={adminSlug}
            />
          )}
        </main>

        {/* Footer (hidden on admin page for focused CMS experience) */}
        {currentPage !== 'admin' && <Footer onNavigate={(p) => handleNavigate(p)} />}
        </>
      )}

      {/* Interactive Detail Modals */}
      <ProgramModal
        program={selectedProgram}
        onClose={() => setSelectedProgram(null)}
        onShowToast={showToast}
      />

      <NewsModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
        onShowToast={showToast}
      />

      {/* Toast Feedback Notification */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <AppMainContent />
    </DataProvider>
  );
}
