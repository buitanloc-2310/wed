import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Navbar, Footer } from './components/SiteChrome';
import { HomePage } from './pages/HomePage';
const AboutPage = React.lazy(() => import('./pages/AboutPage').then(module => ({ default: module.AboutPage })));
const ProgramsPage = React.lazy(() => import('./pages/ProgramsPage').then(module => ({ default: module.ProgramsPage })));
const UnitsPage = React.lazy(() => import('./pages/CustomPageDetail').then(module => ({ default: module.UnitsPage })));
const NewsPage = React.lazy(() => import('./pages/NewsPage').then(module => ({ default: module.NewsPage })));
const CertificatePage = React.lazy(() => import('./pages/CustomPageDetail').then(module => ({ default: module.CertificatePage })));
const JoinPage = React.lazy(() => import('./pages/CustomPageDetail').then(module => ({ default: module.JoinPage })));
const SponsorPage = React.lazy(() => import('./pages/CustomPageDetail').then(module => ({ default: module.SponsorPage })));
const ContactPage = React.lazy(() => import('./pages/CustomPageDetail').then(module => ({ default: module.ContactPage })));
const AdminPage = React.lazy(() => import('./pages/AdminPage').then(module => ({ default: module.AdminPage })));
const ProgramDetailPage = React.lazy(() => import('./pages/ProgramDetailPage').then(module => ({ default: module.ProgramDetailPage })));
const NewsDetailPage = React.lazy(() => import('./pages/NewsDetailPage').then(module => ({ default: module.NewsDetailPage })));
const CustomPageDetail = React.lazy(() => import('./pages/CustomPageDetail').then(module => ({ default: module.CustomPageDetail })));
import { Toast, HomepageIntroOverlay } from './components/UIPrimitives';
import { PageRoute } from './types';
import { useDataContext, DataProvider } from './context/DataContext';
import { SiteClosedTopBanner, SiteClosedNotice } from './components/SiteChrome';
import { getProgramSlug, getArticleSlug, normalizeStoredSlug } from './utils/contentUtils';

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

const DEFAULT_WEBSITE_NAME = 'Trang Thông Tin Điện Tử Sky First';

const PAGE_TITLES: Partial<Record<PageRoute, string>> = {
  home: 'Trang Chủ | Trang Thông Tin Điện Tử Sky First',
  about: 'Giới Thiệu | Trang Thông Tin Điện Tử Sky First',
  programs: 'Chương Trình & Dự Án | Trang Thông Tin Điện Tử Sky First',
  units: 'Đơn Vị Trực Thuộc | Trang Thông Tin Điện Tử Sky First',
  news: 'Tin Tức & Hoạt Động | Trang Thông Tin Điện Tử Sky First',
  certificate: 'Trung tâm Xác thực Sky First | Trang Thông Tin Điện Tử Sky First',
  sponsor: 'Tài Trợ & Đồng Hành | Trang Thông Tin Điện Tử Sky First',
  join: 'Tham Gia Sky First Network | Trang Thông Tin Điện Tử Sky First',
  contact: 'Liên Hệ & Hợp Tác | Trang Thông Tin Điện Tử Sky First',
  admin: 'Quản trị website | Trang Thông Tin Điện Tử Sky First',
  'custom-page': 'Trang Thông Tin | Trang Thông Tin Điện Tử Sky First',
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

  if (segments[0] === 'admin') {
    if ((segments[1] === 'tin-tuc' || segments[1] === 'bai-dang') && segments[2]) {
      return { page: 'admin', adminTab: 'posts', adminSlug: decodeURIComponent(segments[2]) };
    }
    if (segments[1] === 'trang' && segments[2]) {
      return { page: 'admin', adminTab: 'pages', adminSlug: decodeURIComponent(segments[2]) };
    }
    if (segments[1] === 'chinh-sua-website') return { page: 'admin', adminTab: 'visual-editor' };
    if (segments[1] === 'tinh-trang-he-thong') return { page: 'admin', adminTab: 'system-health' };
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
    if (segments[1] === 'su-kien') return { page: 'admin', adminTab: 'events' };
    if (segments[1] === 'co-hoi') return { page: 'admin', adminTab: 'opportunities' };
    if (segments[1] === 'tai-lieu') return { page: 'admin', adminTab: 'documents' };
    if (segments[1] === 'con-nguoi') return { page: 'admin', adminTab: 'people' };
    if (segments[1] === 'tac-dong') return { page: 'admin', adminTab: 'impact' };
    if (segments[1] === 'cong-khai') return { page: 'admin', adminTab: 'transparency' };
    if (segments[1] === 'thong-bao') return { page: 'admin', adminTab: 'notifications' };
    if (segments[1] === 'redirect') return { page: 'admin', adminTab: 'redirects' };
    if (segments[1] === 'mau-email') return { page: 'admin', adminTab: 'email-templates' };
    if (segments[1] === 'tich-hop') return { page: 'admin', adminTab: 'integrations' };
    if (segments[1] === 'media') return { page: 'admin', adminTab: 'media' };
    if (segments[1] === 'menu') return { page: 'admin', adminTab: 'menus' };
    if (segments[1] === 'nhat-ky') return { page: 'admin', adminTab: 'logs' };
    if (segments[1] === 'cai-dat') return { page: 'admin', adminTab: 'settings' };
    return { page: 'admin' };
  }

  if (segments[0] === 'du-an' && segments[1]) {
    return { page: 'program-detail', slug: normalizeStoredSlug(decodeURIComponent(segments[1])) };
  }
  if (segments[0] === 'du-an' && !segments[1]) {
    return { page: 'programs' };
  }

  if (segments[0] === 'tin-tuc' && segments[1]) {
    return { page: 'news-detail', slug: normalizeStoredSlug(decodeURIComponent(segments[1])) };
  }
  if (segments[0] === 'tin-tuc' && !segments[1]) {
    return { page: 'news' };
  }

  if (segments[0] === 'phap-ly-minh-bach') {
    return { page: 'custom-page', slug: 'phap-ly-minh-bach' };
  }

  if ((segments[0] === 'trang' || segments[0] === 'page') && segments[1]) {
    return { page: 'custom-page', slug: decodeURIComponent(segments[1]) };
  }

  if (segments[0] && VALID_ROUTES.includes(segments[0] as PageRoute)) {
    return { page: segments[0] as PageRoute };
  }

  if (segments.length === 1 && segments[0]) {
    return { page: 'custom-page', slug: decodeURIComponent(segments[0]) };
  }

  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  const hashSegments = hash.split('/').filter(Boolean);
  if (hashSegments[0] === 'admin') {
    if ((hashSegments[1] === 'tin-tuc' || hashSegments[1] === 'bai-dang') && hashSegments[2]) {
      return { page: 'admin', adminTab: 'posts', adminSlug: decodeURIComponent(hashSegments[2]) };
    }
    if (hashSegments[1] === 'trang' && hashSegments[2]) {
      return { page: 'admin', adminTab: 'pages', adminSlug: decodeURIComponent(hashSegments[2]) };
    }
    if (hashSegments[1] === 'chinh-sua-website') return { page: 'admin', adminTab: 'visual-editor' };
    if (hashSegments[1] === 'tinh-trang-he-thong') return { page: 'admin', adminTab: 'system-health' };
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
    return { page: 'program-detail', slug: normalizeStoredSlug(decodeURIComponent(hashSegments[1])) };
  }
  if (hashSegments[0] === 'tin-tuc' && hashSegments[1]) {
    return { page: 'news-detail', slug: normalizeStoredSlug(decodeURIComponent(hashSegments[1])) };
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
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastGuardRef = useRef<{ message: string; at: number }>({ message: '', at: 0 });
  const toastTimerRef = useRef<number | null>(null);

  const effectiveSiteName =
    siteConfig.siteName && siteConfig.siteName !== 'Sky First Network'
      ? siteConfig.siteName
      : DEFAULT_WEBSITE_NAME;

  // Video Intro state: chỉ kích hoạt khi mở hoặc tải lại trực tiếp Trang chủ (/ hoặc /home)
  // Không phát lại khi chuyển giữa các trang con SPA, không chặn URL trực tiếp của bài viết/trang con
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    // Không hiện intro bên trong iframe xem trước của Admin
    if (window.self !== window.top) return false;
    const rawPath = window.location.pathname.replace(/^\/+|\/+$/g, '');
    const isDirectHomepage = rawPath === '' || rawPath === 'home';
    return isDirectHomepage;
  });

  useEffect(() => {
    if (siteConfig.intro?.enabled === false || siteConfig.intro?.playMode === 'disabled') {
      setShowIntro(false);
      return;
    }
    if (siteConfig.intro?.playMode === 'once_per_session' && typeof window !== 'undefined') {
      try {
        if (window.sessionStorage.getItem('sfn_intro_seen') === '1') {
          setShowIntro(false);
        }
      } catch {}
    }
  }, [siteConfig.intro?.enabled, siteConfig.intro?.playMode]);

  // Normalize old /page/:slug and /trang/:slug links without adding a second history entry.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const parts = window.location.pathname.split('/').filter(Boolean);
    if ((parts[0] === 'page' || parts[0] === 'trang') && parts[1] && parts.length === 2) {
      const cleanPath = `/${encodeURIComponent(decodeURIComponent(parts[1]))}`;
      window.history.replaceState({ page: 'custom-page', slug: decodeURIComponent(parts[1]) }, '', cleanPath);
    }
  }, []);

  // SEO metadata, Structured Data (BreadcrumbList) & privacy-safe Pageview tracking
  useEffect(() => {
    const rawTitle = PAGE_TITLES[currentPage] || effectiveSiteName;
    const title = rawTitle.replace(DEFAULT_WEBSITE_NAME, effectiveSiteName);
    document.title = title;
    const description =
      siteConfig.siteDescription ||
      siteConfig.tagline ||
      'Trang Thông Tin Điện Tử Sky First — Mạng lưới Giáo dục & Phát triển Cộng đồng Sky First.';
    const upsert = (selector: string, attr: string, value: string) => {
      let el = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
      if (!el) {
        el = document.createElement(selector.startsWith('link') ? 'link' : 'meta') as any;
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };
    upsert('meta[name="description"]', 'content', description);
    upsert('meta[property="og:title"]', 'content', title);
    upsert('meta[property="og:description"]', 'content', description);
    upsert('meta[property="og:site_name"]', 'content', effectiveSiteName);
    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.origin + window.location.pathname;

    // Cập nhật JSON-LD BreadcrumbList cho trang hiện tại
    if (typeof document !== 'undefined' && currentPage !== 'admin') {
      let breadcrumbEl = document.head.querySelector('#sfn-jsonld-breadcrumb') as HTMLScriptElement | null;
      if (!breadcrumbEl) {
        breadcrumbEl = document.createElement('script');
        breadcrumbEl.id = 'sfn-jsonld-breadcrumb';
        breadcrumbEl.type = 'application/ld+json';
        document.head.appendChild(breadcrumbEl);
      }
      const origin = window.location.origin || 'https://skyfirst.io.vn';
      const items: { '@type': string; position: number; name: string; item: string }[] = [
        { '@type': 'ListItem', position: 1, name: effectiveSiteName, item: `${origin}/home` },
      ];
      if (currentPage !== 'home') {
        const cleanLabel = title.split('|')[0]?.trim() || currentPage;
        items.push({
          '@type': 'ListItem',
          position: 2,
          name: cleanLabel,
          item: `${origin}${window.location.pathname}`,
        });
      }
      breadcrumbEl.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items,
      });
    }

    // Ghi nhận pageview tự động (không theo dõi trang quản trị /admin)
    if (currentPage !== 'admin' && typeof window !== 'undefined') {
      const currentPath = window.location.pathname || '/';
      let isNewSession = false;
      try {
        if (!sessionStorage.getItem('sfn_session_counted')) {
          sessionStorage.setItem('sfn_session_counted', '1');
          isNewSession = true;
        }
      } catch {}
      fetch('/api/system?action=pageview', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          path: currentPath,
          title: document.title,
          entityType: currentPage,
          entityId: currentSlug || currentPage,
          newSession: isNewSession,
        }),
      }).catch(() => {});
    }
  }, [currentPage, currentSlug, effectiveSiteName, siteConfig.siteDescription, siteConfig.tagline]);

  useEffect(() => {
    const root = document.documentElement;
    const ds = siteConfig.designSystem || {};
    const clamp = (val: unknown, fb: number, min: number, max: number) => {
      const n = Number(val);
      return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fb;
    };
    root.style.setProperty('--sfn-primary', ds.primary || '#0B66C3');
    root.style.setProperty('--sfn-navy', ds.navy || '#071B3A');
    root.style.setProperty('--sfn-accent', ds.accent || '#22D3EE');
    root.style.setProperty('--sfn-radius', ds.radius || '24px');
    const maxW = clamp(ds.containerMaxWidthPx, 1280, 1024, 1440);
    root.style.setProperty('--sfn-container', `${maxW}px`);
    root.style.setProperty('--sfn-logo-h-desktop', `${clamp(ds.logoHeightDesktopPx, 48, 32, 84)}px`);
    root.style.setProperty('--sfn-logo-h-mobile', `${clamp(ds.logoHeightMobilePx, 38, 28, 56)}px`);
    root.style.setProperty('--sfn-header-h', `${clamp(ds.headerHeightPx, 80, 64, 112)}px`);
    root.style.setProperty('--sfn-nav-gap', `${clamp(ds.navItemGapPx, 6, 2, 20)}px`);
    root.style.setProperty('--sfn-grid-gap', `${clamp(ds.gridGapPx, 24, 12, 40)}px`);
    root.style.setProperty('--sfn-heading-scale', String(clamp(ds.headingScale, 1.0, 0.85, 1.25)));
    root.style.setProperty('--sfn-lead-font-size', `${clamp(ds.leadFontSizePx, 18, 15, 22)}px`);
    root.style.setProperty('--sfn-body-font-size', `${clamp(ds.bodyFontSizePx, 16, 14, 19)}px`);
    root.style.setProperty('--sfn-caption-font-size', `${clamp(ds.captionFontSizePx, 13, 11, 15)}px`);
    root.style.setProperty('--sfn-line-height', String(clamp(ds.lineHeight, 1.65, 1.4, 1.95)));
    root.style.setProperty('--sfn-paragraph-gap', `${clamp(ds.paragraphGapPx, 16, 8, 32)}px`);
    root.style.setProperty('--sfn-section-gap', `${clamp(ds.sectionGapPx, 64, 32, 112)}px`);
    root.style.setProperty('--sfn-image-radius', `${clamp(ds.imageBorderRadiusPx, 20, 8, 32)}px`);
    root.style.setProperty('--sfn-form-max-w', `${clamp(ds.formMaxWidthPx, 768, 520, 980)}px`);
    root.style.setProperty('--sfn-form-field-gap', `${clamp(ds.formFieldGapPx, 16, 10, 28)}px`);
    root.style.setProperty('--sfn-form-input-h', `${clamp(ds.formInputHeightPx, 46, 40, 56)}px`);
    root.style.setProperty('--sfn-form-label-size', `${clamp(ds.formLabelSizePx, 13, 11, 16)}px`);
    root.dataset.motion = ds.motion || 'balanced';
  }, [siteConfig.designSystem]);

  const announcement = siteConfig.announcement;
  const announcementNow = Date.now();
  const announcementActive = Boolean(
    announcement?.enabled &&
      announcement?.text &&
      (!announcement.startAt || announcementNow >= new Date(announcement.startAt).getTime()) &&
      (!announcement.endAt || announcementNow <= new Date(announcement.endAt).getTime())
  );

  const showToast = (msg: string) => {
    const clean = String(msg || '').trim();
    if (!clean) return;
    const now = Date.now();
    if (toastGuardRef.current.message === clean && now - toastGuardRef.current.at < 2500) return;
    toastGuardRef.current = { message: clean, at: now };
    setToastMessage(clean);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToastMessage(null), 4000);
  };

  // URL synchronization handler — chuyển trang nội bộ SPA không bao giờ kích hoạt lại Intro
  const handleNavigate = useCallback(
    (page: PageRoute, slug?: string, updateHistory = true) => {
      setShowIntro(false);
      setCurrentPage(page);
      setCurrentSlug(slug);

      let targetPath = `/${page}`;
      const brandName = effectiveSiteName;
      let pageTitle = (PAGE_TITLES[page] || DEFAULT_WEBSITE_NAME).replace(DEFAULT_WEBSITE_NAME, brandName);

      if (page === 'program-detail' && slug) {
        const cleanSlug = normalizeStoredSlug(slug);
        targetPath = `/du-an/${cleanSlug}`;
        setCurrentSlug(cleanSlug);
        pageTitle = `Chi Tiết Dự Án | ${brandName}`;
      } else if (page === 'news-detail' && slug) {
        const cleanSlug = normalizeStoredSlug(slug);
        targetPath = `/tin-tuc/${cleanSlug}`;
        setCurrentSlug(cleanSlug);
        pageTitle = `Chi Tiết Bản Tin | ${brandName}`;
      } else if (page === 'custom-page' && slug) {
        targetPath = `/${slug}`;
        pageTitle = `Trang Thông Tin | ${brandName}`;
      }

      document.title = pageTitle;

      if (updateHistory && typeof window !== 'undefined') {
        if (window.location.pathname !== targetPath) {
          window.history.pushState({ page, slug }, '', targetPath);
        }
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [effectiveSiteName]
  );

  useEffect(() => {
    const handleLocationChange = () => {
      const route = parseUrlRoute();
      setShowIntro(false);
      setCurrentPage(route.page);
      setCurrentSlug(route.slug);
      setAdminTab(route.adminTab);
      setAdminSlug(route.adminSlug);
      document.title = (PAGE_TITLES[route.page] || DEFAULT_WEBSITE_NAME).replace(
        DEFAULT_WEBSITE_NAME,
        effectiveSiteName
      );
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    const currentPath = window.location.pathname;
    if (currentPath === '/' || currentPath === '') {
      window.history.replaceState({ page: 'home' }, '', '/home');
    }

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, [effectiveSiteName]);

  const isSiteClosed = siteConfig.siteStatus === 'closed';
  const showLockscreen = isSiteClosed && currentPage !== 'admin' && siteConfig.closedNoticeType !== 'banner';

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-[#0284C7] selection:text-white">
      {/* Luồng Intro thương hiệu 6 giai đoạn khi mở hoặc tải lại Trang chủ */}
      {showIntro && currentPage === 'home' && siteConfig.intro?.enabled !== false && (
        <HomepageIntroOverlay
          config={siteConfig.intro}
          siteName={effectiveSiteName}
          defaultLogoUrl={siteConfig.logoUrl || '/brand/sky-first-network-web.png'}
          onFinish={() => {
            try {
              window.sessionStorage.setItem('sfn_intro_seen', '1');
            } catch {}
            setShowIntro(false);
          }}
        />
      )}

      {announcementActive && (
        <div
          className={`relative z-[95] px-4 py-2.5 text-center text-xs sm:text-sm font-bold ${
            announcement?.tone === 'warning'
              ? 'bg-amber-400 text-slate-950'
              : announcement?.tone === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-[#0B66C3] text-white'
          }`}
        >
          <span>{announcement?.text}</span>
          {announcement?.buttonLabel && announcement?.buttonUrl && (
            <a href={announcement.buttonUrl} className="ml-3 underline underline-offset-2">
              {announcement.buttonLabel}
            </a>
          )}
        </div>
      )}

      {isSiteClosed && <SiteClosedTopBanner siteConfig={siteConfig} onNavigateToAdmin={() => handleNavigate('admin')} />}

      {showLockscreen ? (
        <main className="flex-grow">
          <SiteClosedNotice siteConfig={siteConfig} onNavigateToAdmin={() => handleNavigate('admin')} />
        </main>
      ) : (
        <>
          {currentPage !== 'admin' && <Navbar currentPage={currentPage} onNavigate={(p, slug) => handleNavigate(p, slug)} />}

          <main className="flex-grow">
            <React.Suspense fallback={<div className="min-h-[60vh] grid place-items-center text-slate-500">Đang tải trang…</div>}>
              {currentPage === 'home' && (
                <HomePage
                  onNavigate={(p, slug) => handleNavigate(p, slug)}
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

              {currentPage === 'about' && <AboutPage onNavigate={(p) => handleNavigate(p)} />}

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

              {currentPage === 'units' && <UnitsPage onNavigate={(p) => handleNavigate(p)} />}

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

              {currentPage === 'certificate' && <CertificatePage onShowToast={showToast} />}

              {currentPage === 'sponsor' && <SponsorPage onNavigate={(p) => handleNavigate(p)} onShowToast={showToast} />}

              {currentPage === 'join' && <JoinPage onShowToast={showToast} onNavigate={(p) => handleNavigate(p)} />}

              {currentPage === 'contact' && <ContactPage onNavigate={(p) => handleNavigate(p)} onShowToast={showToast} />}

              {currentPage === 'custom-page' && <CustomPageDetail slug={currentSlug || ''} onNavigate={(p) => handleNavigate(p)} />}

              {currentPage === 'admin' && (
                <React.Suspense fallback={<div className="min-h-[60vh] grid place-items-center text-slate-500">Đang mở trang quản trị…</div>}>
                  <AdminPage
                    onNavigate={(p) => handleNavigate(p)}
                    onShowToast={showToast}
                    initialTab={adminTab as any}
                    initialSlug={adminSlug}
                  />
                </React.Suspense>
              )}
            </React.Suspense>
          </main>

          {currentPage !== 'admin' && <Footer onNavigate={(p, slug) => handleNavigate(p, slug)} />}
        </>
      )}

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
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
