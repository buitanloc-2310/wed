import React, { useEffect, useMemo, useState } from 'react';
import {
  Image as ImageIcon,
  Users,
  Power,
  CheckCircle2,
  Mail,
  Shield,
  Code2,
  PenTool,
  Plus,
  Trash2,
  Edit2,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  KeyRound,
  RefreshCw,
  ShieldCheck,
  Search,
  Database,
  CloudUpload,
  CloudDownload,
  Play,
  BarChart3,
  Send,
  Archive,
  Sparkles,
  Sliders,
  Video,
  Monitor,
  Smartphone,
  Layout,
  UploadCloud,
  Check,
  Film,
  Layers,
} from 'lucide-react';
import { ImageUrlInput, HomepageIntroOverlay } from '../../components/UIPrimitives';
import { useDataContext, DEFAULT_SITE_CONFIG } from '../../context/DataContext';
import {
  AdminUser,
  AdminUserRole,
  SiteClosedReason,
  PageRoute,
  IntroSettings,
  IntroLibraryItem,
  IntroVisualDesignConfig,
  LayoutDesignSystemConfig,
  EmailSystemSettings,
  AutomationSystemSettings,
  SeoSystemSettings,
  AdminCapability,
} from '../../types';
import {
  uploadMedia,
  listMedia,
  updateMediaMetadata,
  deleteMediaItem,
  listAdminAccounts,
  createAdminAccount,
  updateAdminAccount,
  deleteAdminAccount,
  resetAdminPassword,
  adminApi,
  ALL_CAPABILITIES,
  ROLE_CAPABILITIES,
} from '../../lib/firebase';

interface AdminSettingsProps {
  onShowToast: (msg: string) => void;
  onNavigate?: (page: PageRoute) => void;
}

const CONFIG_GROUPS_18 = [
  { id: '2.1', code: 'brand_identity', title: 'Nhận diện & Thông tin chung', desc: 'Tên website, mô tả, logo sáng/tối, favicon, thông tin liên hệ và bản quyền chân trang', scope: 'public' },
  { id: '2.2', code: 'design_tokens', title: 'Tùy chỉnh Kích thước, Bố cục & Giao diện (10 Nhóm)', desc: 'Kích thước logo, header, vùng nội dung, cỡ chữ, khoảng cách dòng/khối, tỷ lệ ảnh, số cột trang chủ và bố cục biểu mẫu', scope: 'public' },
  { id: '2.3', code: 'intro_motion', title: 'Hệ thống Thiết kế, Tải lên & Quản lý Video Intro 10s', desc: '3 phương thức tạo Intro (Thiết kế trực quan, Tải video MP4/WebM, Kết hợp), thư viện phiên bản và bộ điều khiển 10 giây không giọng đọc AI', scope: 'public' },
  { id: '2.4', code: 'navigation', title: 'Điều hướng, Header, Footer & Menu', desc: 'Cấu trúc menu đa cấp, thanh Cổng thông tin chính thống, liên kết chân trang', scope: 'public' },
  { id: '2.5', code: 'pages_builder', title: 'Trang & Bố cục (Visual Builder)', desc: 'Thư viện khối chuẩn, bố cục trang chủ, lịch sử phiên bản và khôi phục trang', scope: 'public' },
  { id: '2.6', code: 'editorial_cms', title: 'Tin tức, Bài viết & Biên tập Gutenberg', desc: 'Chuyên mục, bài nổi bật, hẹn giờ xuất bản, lưu nháp tự động và mặc định hiển thị ảnh nguyên bản', scope: 'public' },
  { id: '2.7', code: 'programs_activities', title: 'Chương trình & Hoạt động', desc: 'Trạng thái chương trình, gắn biểu mẫu độc lập (formId), hiển thị hạn đăng ký', scope: 'public' },
  { id: '2.8', code: 'forms_registrations', title: 'Biểu mẫu & Đăng ký (Form Builder)', desc: 'Cấu hình trường, điều kiện hiển thị, snapshot lịch sử đơn, chống gửi trùng và xuất CSV', scope: 'public' },
  { id: '2.9', code: 'email_notifications', title: 'Resend API, Mẫu Email HTML & Hàng đợi Outbox', desc: 'Kiểm tra kết nối Resend API phía máy chủ, xác minh tên miền, chế độ thử nghiệm an toàn và chống gửi trùng (Idempotency-Key)', scope: 'secret' },
  { id: '2.10', code: 'automation_rules', title: 'Tự động hóa & Quy tắc vận hành', desc: 'Tự động xuất bản đúng giờ, tự động đóng form hết hạn, tự tạo redirect 301 khi đổi slug', scope: 'admin' },
  { id: '2.11', code: 'media_images', title: 'Media & Hình ảnh nguyên bản', desc: 'Hiển thị đầy đủ tỷ lệ gốc (original/contain), không tự cắt ảnh dọc/A4, hỗ trợ Lightbox phóng to', scope: 'public' },
  { id: '2.12', code: 'seo_sharing', title: 'SEO, Chia sẻ mạng xã hội & Sitemap', desc: 'Mẫu tiêu đề SEO, ảnh OG mặc định, tự động loại trang nháp/noIndex khỏi sitemap.xml', scope: 'public' },
  { id: '2.13', code: 'analytics_metrics', title: 'Thống kê truy cập & Số liệu thủ công', desc: 'Tách bạch bộ đếm lượt xem tự động (lọc bot & /admin) và số liệu nhập thủ công có nguồn/ghi chú', scope: 'admin' },
  { id: '2.14', code: 'security_antispam', title: 'Bảo mật, Chống spam & Kiểm soát truy cập', desc: 'Honeypot chống bot, giới hạn tần suất gửi đơn, bảo vệ tài khoản Chủ sở hữu hệ thống', scope: 'admin' },
  { id: '2.15', code: 'rbac_permissions', title: 'Người dùng, Vai trò & Phân quyền chi tiết', desc: 'Phân quyền theo vai trò kết hợp bảng quyền chi tiết (Capabilities) kiểm tra tại máy chủ', scope: 'admin' },
  { id: '2.16', code: 'backup_recovery', title: 'Sao lưu, Phiên bản & Khôi phục (SHA-256)', desc: 'Tạo bản sao lưu toàn diện có mã băm SHA-256, kiểm tra tính toàn vẹn và khôi phục an toàn', scope: 'admin' },
  { id: '2.17', code: 'integrations', title: 'Tích hợp dịch vụ ngoài', desc: 'Kết nối Cloudflare D1, R2 Media, Firebase Authentication và dịch vụ gửi thư Resend', scope: 'secret' },
  { id: '2.18', code: 'maintenance_diagnostics', title: 'Bảo trì, Chẩn đoán & Sức khỏe hệ thống', desc: 'Chế độ bảo trì trang công khai (giữ /admin hoạt động 100%) và kiểm tra 4 mức trạng thái', scope: 'admin' },
];

const DEFAULT_DESIGN_CONFIG: IntroVisualDesignConfig = {
  bgPrimary: '#061A3A',
  bgSecondary: '#0B3B78',
  accentGlow: '#22D3EE',
  pedestalStyle: 'pearl_white',
  logoScalePercent: 100,
  logoOffsetYPercent: 0,
  logoAppearDelaySec: 0.15,
  motionPreset: 'refined_scale',
  headlineText: 'MẠNG LƯỚI GIÁO DỤC VÀ PHÁT TRIỂN CỘNG ĐỒNG SKY FIRST',
  subtitleText: 'SKY FIRST NETWORK (SFN) • CỔNG THÔNG TIN CHÍNH THỨC',
  showSloganPillars: true,
  sloganClauses: [
    'TIÊN PHONG SÁNG TẠO',
    'KẾT NỐI TRI THỨC',
    'KIẾN TẠO TƯƠNG LAI',
    'VÌ MỘT CỘNG ĐỒNG BỀN VỮNG',
  ],
  holdStartSec: 7.5,
  exitStartSec: 9.4,
};

const DEFAULT_LAYOUT_SYSTEM: LayoutDesignSystemConfig = {
  primary: '#0B66C3',
  navy: '#071B3A',
  accent: '#22D3EE',
  radius: '24px',
  container: '1280px',
  fontFamily: 'Be Vietnam Pro',
  spacing: 'normal',
  motion: 'balanced',
  defaultImageDisplay: 'original',
  logoHeightDesktopPx: 48,
  logoHeightMobilePx: 38,
  headerHeightPx: 80,
  navItemGapPx: 6,
  containerMaxWidthPx: 1280,
  gridGapPx: 24,
  headingScale: 1.0,
  leadFontSizePx: 18,
  bodyFontSizePx: 16,
  captionFontSizePx: 13,
  lineHeight: 1.65,
  paragraphGapPx: 16,
  sectionGapPx: 64,
  cardImageAspectRatio: 'auto',
  imageBorderRadiusPx: 20,
  homeNewsColumns: 3,
  homeProgramsColumns: 3,
  homePillarsColumns: 5,
  homeValuesColumns: 3,
  showOfficialPortalBar: true,
  formMaxWidthPx: 768,
  formFieldGapPx: 16,
  formInputHeightPx: 46,
  formLabelSizePx: 13,
  formLayoutMode: 'single',
};

function formatBytes(bytes?: number): string {
  const n = Number(bytes || 0);
  if (!n || n <= 0) return '—';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  onShowToast,
}) => {
  const {
    siteConfig,
    updateSiteConfig,
    adminUsers: contextAdminUsers,
    isFirebaseSyncing,
    firebaseSyncMessage,
    uploadAllDataToFirestore,
    fetchDataFromFirestore,
  } = useDataContext();

  const [configSearch, setConfigSearch] = useState('');
  const [activeCenterTab, setActiveCenterTab] = useState<
    | 'overview'
    | 'brand-intro'
    | 'layout-sizing'
    | 'email-outbox'
    | 'automation-seo'
    | 'analytics'
    | 'backup'
    | 'users'
    | 'maintenance'
  >('overview');

  // ==========================================
  // 1. NHẬN DIỆN & HỆ THỐNG VIDEO INTRO 10S STATE
  // ==========================================
  const [logoUrl, setLogoUrl] = useState(siteConfig.logoUrl || '/brand/sky-first-network-web.png');
  const [siteName, setSiteName] = useState(siteConfig.siteName || 'Trang Thông Tin Điện Tử Sky First');
  const [siteDescription, setSiteDescription] = useState(
    siteConfig.siteDescription || siteConfig.tagline || ''
  );
  const [tagline, setTagline] = useState(siteConfig.tagline || '');

  const [introStudioMethod, setIntroStudioMethod] = useState<'method1_design' | 'method2_upload' | 'method3_hybrid'>('method2_upload');
  const [introPreviewDevice, setIntroPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [introPreviewKey, setIntroPreviewKey] = useState(0);
  const [introUploading, setIntroUploading] = useState(false);
  const [introUploadProgress, setIntroUploadProgress] = useState<string>('');
  const [inspectedVideoMeta, setInspectedVideoMeta] = useState<{
    file?: File;
    name: string;
    type: string;
    sizeBytes: number;
    durationSeconds: number;
    width: number;
    height: number;
    previewObjectUrl?: string;
    valid: boolean;
    warning?: string;
  } | null>(null);
  const [exportingCanvasVideo, setExportingCanvasVideo] = useState(false);
  const canRecordCanvasVideo = useMemo(
    () =>
      typeof window !== 'undefined' &&
      typeof HTMLCanvasElement !== 'undefined' &&
      typeof (HTMLCanvasElement.prototype as any).captureStream === 'function' &&
      typeof (window as any).MediaRecorder !== 'undefined',
    []
  );

  const [introConfig, setIntroConfig] = useState<IntroSettings>(() => ({
    enabled: siteConfig.intro?.enabled !== false,
    activeMode: siteConfig.intro?.activeMode || 'video',
    videoUrl: siteConfig.intro?.videoUrl || '/brand/sky-first-intro.mp4',
    posterUrl:
      siteConfig.intro?.posterUrl && siteConfig.intro.posterUrl !== '/brand/sky-first-network-logo.png'
        ? siteConfig.intro.posterUrl
        : '/brand/sky-first-network-web.png',
    logoUrl: siteConfig.intro?.logoUrl || '/brand/sky-first-network-web.png',
    durationSeconds: Number(siteConfig.intro?.durationSeconds ?? 10) || 10,
    videoFileDurationSeconds: Number(siteConfig.intro?.videoFileDurationSeconds ?? 10) || 10,
    logoRevealDurationMs: siteConfig.intro?.logoRevealDurationMs || 1400,
    maxWaitDurationMs: siteConfig.intro?.maxWaitDurationMs || 3500,
    allowSkip: siteConfig.intro?.allowSkip !== false,
    skipLabel: siteConfig.intro?.skipLabel || 'Bỏ qua Intro',
    transitionStyle: siteConfig.intro?.transitionStyle || 'fade',
    desktopDisplayMode: siteConfig.intro?.desktopDisplayMode || 'contain',
    mobileDisplayMode: siteConfig.intro?.mobileDisplayMode || 'contain',
    mutedByDefault: true,
    playMode: siteConfig.intro?.playMode || 'every_home_load',
    respectReducedMotion: siteConfig.intro?.respectReducedMotion !== false,
    fallbackMode: siteConfig.intro?.fallbackMode || 'logo_fade',
    designConfig: {
      ...DEFAULT_DESIGN_CONFIG,
      ...(siteConfig.intro?.designConfig || {}),
    },
    library:
      Array.isArray(siteConfig.intro?.library) && siteConfig.intro!.library!.length > 0
        ? siteConfig.intro!.library!
        : DEFAULT_SITE_CONFIG.intro?.library || [],
  }));

  // ==========================================
  // 1B. TÙY CHỈNH KÍCH THƯỚC & BỐ CỤC 10 NHÓM (MỤC VI)
  // ==========================================
  const [designSystem, setDesignSystem] = useState<LayoutDesignSystemConfig>(() => ({
    ...DEFAULT_LAYOUT_SYSTEM,
    ...(siteConfig.designSystem || {}),
  }));
  const [homeSections, setHomeSections] = useState<Record<string, boolean>>(() => ({
    hero: true,
    pillars: true,
    news: true,
    programs: true,
    values: true,
    certificate: false,
    transparency: true,
    units: true,
    cta: true,
    ...(siteConfig.homeSections || {}),
  }));
  const [homeSectionOrder, setHomeSectionOrder] = useState<string[]>(() =>
    Array.isArray(siteConfig.homeSectionOrder) && siteConfig.homeSectionOrder.length > 0
      ? siteConfig.homeSectionOrder
      : ['hero', 'pillars', 'news', 'programs', 'values', 'certificate', 'transparency', 'units', 'cta']
  );
  const [layoutPreviewDevice, setLayoutPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // ==========================================
  // 2. EMAIL RESEND API & OUTBOX QUEUE STATE
  // ==========================================
  const [emailSettings, setEmailSettings] = useState<EmailSystemSettings>(() => ({
    enabled: Boolean(siteConfig.emailSettings?.enabled),
    provider: siteConfig.emailSettings?.provider || 'resend',
    mode: siteConfig.emailSettings?.mode || 'live',
    testSafeRecipient: siteConfig.emailSettings?.testSafeRecipient || 'delivered@resend.dev',
    verifiedDomain: siteConfig.emailSettings?.verifiedDomain || 'skyfirst.io.vn',
    senderName: siteConfig.emailSettings?.senderName || 'Trang Thông Tin Điện Tử Sky First',
    senderEmail: siteConfig.emailSettings?.senderEmail || 'support@skyfirst.io.vn',
    replyToEmail: siteConfig.emailSettings?.replyToEmail || 'lienhe@skyfirst.io.vn',
    adminRecipientEmails: siteConfig.emailSettings?.adminRecipientEmails || 'lienhe@skyfirst.io.vn',
    sendOnProgramRegistration: siteConfig.emailSettings?.sendOnProgramRegistration !== false,
    sendAdminAlertOnRegistration: siteConfig.emailSettings?.sendAdminAlertOnRegistration !== false,
    sendOnContactSubmission: siteConfig.emailSettings?.sendOnContactSubmission !== false,
    sendOnStatusChange: Boolean(siteConfig.emailSettings?.sendOnStatusChange),
    retryMaxAttempts: siteConfig.emailSettings?.retryMaxAttempts || 3,
  }));
  const [serverSecretsStatus, setServerSecretsStatus] = useState<{
    resendConfigured: boolean;
    mailFromValue: string;
    domainStatus?: string;
    domainDetail?: string;
  }>({
    resendConfigured: false,
    mailFromValue: 'Trang Thông Tin Điện Tử Sky First <support@skyfirst.io.vn>',
  });
  const [domainCheckBusy, setDomainCheckBusy] = useState(false);
  const [outboxItems, setOutboxItems] = useState<any[]>([]);
  const [outboxSummary, setOutboxSummary] = useState<Record<string, number>>({});
  const [outboxLoading, setOutboxLoading] = useState(false);
  const [testEmailRecipient, setTestEmailRecipient] = useState('delivered@resend.dev');
  const [previewSubject, setPreviewSubject] = useState(
    '[{{site_name}}] Xác nhận tiếp nhận hồ sơ {{program_title}} - Mã {{submission_id}}'
  );
  const [previewBody, setPreviewBody] = useState(
    'Xin chào {{applicant_name}},\n\nBan Tổ chức {{site_name}} đã tiếp nhận hồ sơ đăng ký của bạn cho chương trình "{{program_title}}" (Mã tra cứu: {{submission_id}}) vào lúc {{submitted_at}}.\n\nMọi thắc mắc vui lòng phản hồi về: {{contact_email}}.'
  );
  const [previewResult, setPreviewResult] = useState<{
    subject: string;
    body: string;
    htmlBody?: string;
    allowedVariables: string[];
  } | null>(null);

  // ==========================================
  // 3. TỰ ĐỘNG HÓA & SEO STATE
  // ==========================================
  const [automationSettings, setAutomationSettings] = useState<AutomationSystemSettings>(() => ({
    enableScheduledPublishing: siteConfig.automationSettings?.enableScheduledPublishing !== false,
    enableAutoCloseExpiredForms: siteConfig.automationSettings?.enableAutoCloseExpiredForms !== false,
    enableAutoRedirectOnSlugChange: siteConfig.automationSettings?.enableAutoRedirectOnSlugChange !== false,
    enableAutoSitemapUpdate: siteConfig.automationSettings?.enableAutoSitemapUpdate !== false,
    enableAutoEndedProgramBadge: siteConfig.automationSettings?.enableAutoEndedProgramBadge !== false,
    autoArchiveOldDraftDays: siteConfig.automationSettings?.autoArchiveOldDraftDays || 0,
  }));

  const [seoSettings, setSeoSettings] = useState<SeoSystemSettings>(() => ({
    titleTemplate: siteConfig.seoSettings?.titleTemplate || '%s | Trang Thông Tin Điện Tử Sky First',
    defaultTitle:
      siteConfig.seoSettings?.defaultTitle ||
      'Trang Thông Tin Điện Tử Sky First — Mạng lưới Giáo dục & Phát triển Cộng đồng Sky First',
    defaultDescription:
      siteConfig.seoSettings?.defaultDescription ||
      'Sky First Network kết nối các hoạt động giáo dục, phát triển người trẻ, tình nguyện và truyền thông cộng đồng.',
    defaultOgImage:
      siteConfig.seoSettings?.defaultOgImage && siteConfig.seoSettings.defaultOgImage !== '/brand/sky-first-network-logo.png'
        ? siteConfig.seoSettings.defaultOgImage
        : '/brand/sky-first-network-web.png',
    canonicalDomain: siteConfig.seoSettings?.canonicalDomain || 'https://skyfirst.io.vn',
    allowIndexing: siteConfig.seoSettings?.allowIndexing !== false,
  }));

  // ==========================================
  // 4. THỐNG KÊ TRUY CẬP (TỰ ĐỘNG VS THỦ CÔNG)
  // ==========================================
  const [analyticsData, setAnalyticsData] = useState<{
    totalAutoViews: number;
    byPage: any[];
    byDay: any[];
    manualEntries: any[];
  }>({ totalAutoViews: 0, byPage: [], byDay: [], manualEntries: [] });
  const [manualLabel, setManualLabel] = useState('');
  const [manualValue, setManualValue] = useState('');
  const [manualSource, setManualSource] = useState('');
  const [manualDate, setManualDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [manualNote, setManualNote] = useState('');

  // ==========================================
  // 5. SAO LƯU & KHÔI PHỤC (SHA-256)
  // ==========================================
  const [backups, setBackups] = useState<any[]>([]);
  const [backupLabel, setBackupLabel] = useState('');
  const [restoreConfirmId, setRestoreConfirmId] = useState<string | null>(null);
  const [restoreConfirmText, setRestoreConfirmText] = useState('');
  const [backupBusy, setBackupBusy] = useState(false);

  // ==========================================
  // 6. TÀI KHOẢN & PHÂN QUYỀN CHI TIẾT
  // ==========================================
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(contextAdminUsers);
  const [adminUsersLoading, setAdminUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | AdminUserRole>('all');
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<AdminUser | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState<AdminUserRole>('admin');
  const [userPermissions, setUserPermissions] = useState<AdminCapability[]>(ROLE_CAPABILITIES.admin);
  const [userStatus, setUserStatus] = useState<'active' | 'inactive'>('active');
  const [userNote, setUserNote] = useState('');
  const [emailError, setEmailError] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userPasswordConfirm, setUserPasswordConfirm] = useState('');
  const [showUserPassword, setShowUserPassword] = useState(false);
  const [showUserPasswordConfirm, setShowUserPasswordConfirm] = useState(false);
  const [userSaving, setUserSaving] = useState(false);

  // ==========================================
  // 7. TRẠNG THÁI ĐÓNG / MỞ WEBSITE
  // ==========================================
  const [siteStatus, setSiteStatus] = useState<'active' | 'closed'>(siteConfig.siteStatus || 'active');
  const [closedReason, setClosedReason] = useState<SiteClosedReason>(siteConfig.closedReason || 'maintenance');
  const [closedReasonText, setClosedReasonText] = useState(
    siteConfig.closedReasonText || 'Bảo trì & Nâng cấp hệ thống định kỳ'
  );
  const [closedMessage, setClosedMessage] = useState(
    siteConfig.closedMessage ||
      'Trang Thông Tin Điện Tử Sky First đang tạm thời đóng để nâng cấp và biên tập nội dung mới. Chúng tôi sẽ sớm quay trở lại!'
  );
  const [closedEstimatedReopen, setClosedEstimatedReopen] = useState(
    siteConfig.closedEstimatedReopen || 'Dự kiến hoàn tất trong ngày'
  );
  const [closedNoticeType, setClosedNoticeType] = useState<'banner' | 'lockscreen'>(
    siteConfig.closedNoticeType || 'lockscreen'
  );

  const refreshAdminUsers = async () => {
    setAdminUsersLoading(true);
    try {
      const rows = await listAdminAccounts();
      setAdminUsers(rows as AdminUser[]);
    } catch (e: any) {
      onShowToast(e?.message || 'Không tải được danh sách quản trị.');
    } finally {
      setAdminUsersLoading(false);
    }
  };

  const syncIntroLibraryFromR2 = async () => {
    try {
      const res = await listMedia(undefined, 'intro');
      if (!Array.isArray(res?.items) || res.items.length === 0) return;
      setIntroConfig((prev) => {
        const existingByIdOrUrl = new Map<string, IntroLibraryItem>();
        for (const item of prev.library || []) {
          existingByIdOrUrl.set(item.url, item);
        }
        for (const m of res.items) {
          const isVideo = m.type?.startsWith('video/') || m.url.endsWith('.mp4') || m.url.endsWith('.webm');
          const prevEntry = existingByIdOrUrl.get(m.url);
          existingByIdOrUrl.set(m.url, {
            id: prevEntry?.id || m.key,
            key: m.key,
            name: m.name || prevEntry?.name || m.key.split('/').pop() || 'Video Intro',
            kind: isVideo ? 'video' : 'poster',
            url: m.url,
            posterUrl: m.posterUrl || prevEntry?.posterUrl || prev.posterUrl,
            format: m.type || prevEntry?.format || (isVideo ? 'video/mp4' : 'image/png'),
            sizeBytes: m.size || prevEntry?.sizeBytes || 0,
            durationSeconds: m.durationSeconds || prevEntry?.durationSeconds || 10,
            width: m.width || prevEntry?.width || 1280,
            height: m.height || prevEntry?.height || 720,
            uploadedAt: m.uploaded || prevEntry?.uploadedAt || new Date().toISOString(),
            status:
              m.url === prev.videoUrl || m.url === prev.posterUrl
                ? 'active'
                : (m.versionStatus as any) || prevEntry?.status || 'archived',
            note: m.caption || prevEntry?.note || '',
          });
        }
        return {
          ...prev,
          library: Array.from(existingByIdOrUrl.values()),
        };
      });
    } catch {}
  };

  const loadOutbox = async () => {
    setOutboxLoading(true);
    try {
      const res: any = await adminApi('/api/system?action=email-outbox');
      setOutboxItems(Array.isArray(res?.items) ? res.items : []);
      setOutboxSummary(res?.summary && typeof res.summary === 'object' ? res.summary : {});
      setServerSecretsStatus({
        resendConfigured: Boolean(res?.secretsStatus?.resendApiKey?.configured),
        mailFromValue:
          res?.secretsStatus?.mailFrom?.value ||
          'Trang Thông Tin Điện Tử Sky First <support@skyfirst.io.vn>',
        domainStatus: res?.domainVerification?.status,
        domainDetail: res?.domainVerification?.detail,
      });
    } catch {
      setOutboxItems([]);
    } finally {
      setOutboxLoading(false);
    }
  };

  const handleCheckResendDomain = async () => {
    setDomainCheckBusy(true);
    try {
      const res: any = await adminApi('/api/system?action=email-domain-check', {
        method: 'POST',
        body: JSON.stringify({ domain: emailSettings.verifiedDomain || 'skyfirst.io.vn' }),
      });
      setServerSecretsStatus((prev) => ({
        ...prev,
        domainStatus: res?.domainStatus || 'unverified',
        domainDetail: res?.message || '',
      }));
      onShowToast(res?.message || 'Đã kiểm tra trạng thái tên miền gửi thư trên Resend.');
    } catch (e: any) {
      onShowToast(e?.message || 'Không thể kiểm tra tên miền gửi thư.');
    } finally {
      setDomainCheckBusy(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const res: any = await adminApi('/api/system?action=analytics');
      if (res?.ok) {
        setAnalyticsData({
          totalAutoViews: Number(res.totalAutoViews || 0),
          byPage: Array.isArray(res.byPage) ? res.byPage : [],
          byDay: Array.isArray(res.byDay) ? res.byDay : [],
          manualEntries: Array.isArray(res.manualEntries) ? res.manualEntries : [],
        });
      }
    } catch {}
  };

  const loadBackups = async () => {
    try {
      const res: any = await adminApi('/api/system?action=backups');
      setBackups(Array.isArray(res?.items) ? res.items : []);
    } catch {}
  };

  useEffect(() => {
    refreshAdminUsers();
    loadOutbox();
    loadAnalytics();
    loadBackups();
    syncIntroLibraryFromR2();
  }, []);

  const filteredGroups = useMemo(() => {
    const q = configSearch.trim().toLowerCase();
    if (!q) return CONFIG_GROUPS_18;
    return CONFIG_GROUPS_18.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.desc.toLowerCase().includes(q) ||
        g.code.toLowerCase().includes(q) ||
        g.id.includes(q)
    );
  }, [configSearch]);

  // ==========================================
  // HANDLERS: INTRO STUDIO (3 PHƯƠNG THỨC & THƯ VIỆN)
  // ==========================================
  const handleSaveBrandAndIntro = async (publishStatus: 'draft' | 'published' = 'published') => {
    const sanitizedIntro: IntroSettings = {
      ...introConfig,
      durationSeconds: Math.max(3, Math.min(20, Number(introConfig.durationSeconds ?? 10) || 10)),
      maxWaitDurationMs: Math.max(1500, Math.min(8000, Number(introConfig.maxWaitDurationMs ?? 3500) || 3500)),
      mutedByDefault: true,
    };
    setIntroConfig(sanitizedIntro);
    const ok = await updateSiteConfig({
      logoUrl: logoUrl.trim(),
      siteName: siteName.trim(),
      siteDescription: siteDescription.trim(),
      tagline: tagline.trim() || siteDescription.trim(),
      intro: sanitizedIntro,
    });
    onShowToast(
      ok
        ? publishStatus === 'draft'
          ? 'Đã lưu bản nháp cấu hình Intro vào hệ thống.'
          : 'Đã xuất bản Nhận diện thương hiệu & Hệ thống Video Intro 10 giây!'
        : 'Chưa lưu được cấu hình. Hãy kiểm tra quyền hoặc kết nối.'
    );
  };

  const handleRestoreDefaultIntro = async () => {
    const defIntro = DEFAULT_SITE_CONFIG.intro!;
    setIntroConfig(defIntro);
    const ok = await updateSiteConfig({ intro: defIntro });
    setIntroPreviewKey((k) => k + 1);
    onShowToast(
      ok
        ? 'Đã khôi phục cấu hình Video Intro 10 giây mặc định an toàn.'
        : 'Đã đặt lại trên trình duyệt, bấm Xuất bản để đồng bộ lên máy chủ.'
    );
  };

  const handleSaveVisualDesignToLibrary = (activateImmediately: boolean) => {
    const newItem: IntroLibraryItem = {
      id: `design-${Date.now()}`,
      name: `Bản thiết kế Intro (${new Date().toLocaleString('vi-VN')})`,
      kind: 'design',
      url: introConfig.logoUrl || '/brand/sky-first-network-web.png',
      posterUrl: introConfig.posterUrl || '/brand/sky-first-network-web.png',
      format: 'visual-preset/json',
      durationSeconds: Number(introConfig.durationSeconds || 10),
      width: 1280,
      height: 720,
      uploadedAt: new Date().toISOString(),
      status: activateImmediately ? 'active' : 'draft',
      note: `Nền ${introConfig.designConfig?.bgPrimary || '#061A3A'} • Tỷ lệ logo ${introConfig.designConfig?.logoScalePercent || 100}%`,
      designConfig: { ...(introConfig.designConfig || DEFAULT_DESIGN_CONFIG) },
    };
    setIntroConfig((prev) => {
      const prevLib = (prev.library || []).map((item) =>
        activateImmediately && item.status === 'active'
          ? { ...item, status: 'archived' as const }
          : item
      );
      return {
        ...prev,
        activeMode: activateImmediately ? 'designed' : prev.activeMode,
        library: [newItem, ...prevLib],
      };
    });
    setIntroPreviewKey((k) => k + 1);
    onShowToast(
      activateImmediately
        ? 'Đã lưu bản thiết kế vào Thư viện và kích hoạt hiển thị trên Website (bấm Xuất bản để lưu lên D1).'
        : 'Đã lưu bản nháp thiết kế vào Thư viện phiên bản Intro.'
    );
  };

  // Kiểm tra thông số kỹ thuật thực tế của tệp Video bằng HTML5 Video Element trước khi tải lên
  const handleInspectVideoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['video/mp4', 'video/webm'].includes(file.type)) {
      onShowToast('Chỉ hỗ trợ định dạng video chuẩn web MP4 (H.264) hoặc WebM.');
      e.target.value = '';
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      onShowToast('Dung lượng tệp video vượt quá giới hạn 50 MB.');
      e.target.value = '';
      return;
    }
    const objUrl = URL.createObjectURL(file);
    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    tempVideo.muted = true;
    tempVideo.onloadedmetadata = () => {
      const dur = Number.isFinite(tempVideo.duration) ? Number(tempVideo.duration.toFixed(2)) : 10;
      const w = tempVideo.videoWidth || 1280;
      const h = tempVideo.videoHeight || 720;
      const diffFrom10 = Math.abs(dur - 10);
      const warning =
        diffFrom10 > 2
          ? `Lưu ý: Thời lượng tệp video là ${dur}s (khác mục tiêu chuẩn 10s). Bộ điều khiển Intro vẫn sẽ đảm bảo thời gian hiển thị mục tiêu ${introConfig.durationSeconds || 10}s.`
          : undefined;
      setInspectedVideoMeta({
        file,
        name: file.name,
        type: file.type,
        sizeBytes: file.size,
        durationSeconds: dur,
        width: w,
        height: h,
        previewObjectUrl: objUrl,
        valid: w > 0 && h > 0 && dur > 0,
        warning,
      });
    };
    tempVideo.onerror = () => {
      URL.revokeObjectURL(objUrl);
      setInspectedVideoMeta(null);
      onShowToast('Tệp video bị hỏng hoặc codec không được trình duyệt hỗ trợ. Vui lòng chọn tệp MP4 (H.264) hoặc WebM hợp lệ.');
    };
    tempVideo.src = objUrl;
    e.target.value = '';
  };

  const handleUploadInspectedVideo = async (activateAfterUpload: boolean) => {
    if (!inspectedVideoMeta?.file || !inspectedVideoMeta.valid) {
      onShowToast('Vui lòng chọn và kiểm tra tệp video hợp lệ trước khi tải lên.');
      return;
    }
    setIntroUploading(true);
    setIntroUploadProgress('Đang tải tệp video lên kho lưu trữ R2 (1/2)...');
    try {
      const statusToSet: 'active' | 'draft' = activateAfterUpload ? 'active' : 'draft';
      const uploaded = await uploadMedia(inspectedVideoMeta.file, false, {
        category: 'intro_video',
        versionStatus: statusToSet,
        durationSeconds: inspectedVideoMeta.durationSeconds,
        width: inspectedVideoMeta.width,
        height: inspectedVideoMeta.height,
        posterUrl: introConfig.posterUrl || '/brand/sky-first-network-web.png',
        caption: `Video Intro (${inspectedVideoMeta.width}x${inspectedVideoMeta.height}, ${inspectedVideoMeta.durationSeconds}s)`,
      });
      setIntroUploadProgress('Đang cập nhật thư viện phiên bản Intro (2/2)...');
      const libEntry: IntroLibraryItem = {
        id: uploaded.key,
        key: uploaded.key,
        name: inspectedVideoMeta.name,
        kind: 'video',
        url: uploaded.url,
        posterUrl: introConfig.posterUrl || '/brand/sky-first-network-web.png',
        format: inspectedVideoMeta.type,
        sizeBytes: inspectedVideoMeta.sizeBytes,
        durationSeconds: inspectedVideoMeta.durationSeconds,
        width: inspectedVideoMeta.width,
        height: inspectedVideoMeta.height,
        uploadedAt: uploaded.uploaded || new Date().toISOString(),
        status: statusToSet,
        note: `${inspectedVideoMeta.width}×${inspectedVideoMeta.height} • ${inspectedVideoMeta.durationSeconds}s`,
      };

      const nextIntro: IntroSettings = {
        ...introConfig,
        activeMode: activateAfterUpload ? 'video' : introConfig.activeMode,
        videoUrl: activateAfterUpload ? uploaded.url : introConfig.videoUrl,
        videoFileDurationSeconds: activateAfterUpload
          ? inspectedVideoMeta.durationSeconds
          : introConfig.videoFileDurationSeconds,
        library: [
          libEntry,
          ...(introConfig.library || []).map((item) =>
            activateAfterUpload && item.kind === 'video' && item.status === 'active'
              ? { ...item, status: 'archived' as const }
              : item
          ),
        ],
      };
      setIntroConfig(nextIntro);
      await updateSiteConfig({ intro: nextIntro });
      setIntroPreviewKey((k) => k + 1);
      onShowToast(
        activateAfterUpload
          ? `Đã tải lên và kích hoạt video Intro mới (${inspectedVideoMeta.name}) thành công!`
          : `Đã tải video (${inspectedVideoMeta.name}) vào Thư viện ở chế độ Bản nháp.`
      );
      setInspectedVideoMeta(null);
    } catch (err: any) {
      onShowToast(err?.message || 'Không thể tải video lên R2.');
    } finally {
      setIntroUploading(false);
      setIntroUploadProgress('');
    }
  };

  const handlePosterFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIntroUploading(true);
    setIntroUploadProgress('Đang tải ảnh Poster dự phòng lên R2...');
    try {
      const item = await uploadMedia(file, true, {
        category: 'intro_poster',
        versionStatus: 'active',
        caption: 'Poster dự phòng màn hình Intro',
      });
      const posterEntry: IntroLibraryItem = {
        id: item.key,
        key: item.key,
        name: file.name,
        kind: 'poster',
        url: item.url,
        format: file.type,
        sizeBytes: file.size,
        uploadedAt: item.uploaded || new Date().toISOString(),
        status: 'active',
        note: 'Poster dự phòng khi trình duyệt chặn video hoặc mạng chậm',
      };
      const nextIntro: IntroSettings = {
        ...introConfig,
        posterUrl: item.url,
        library: [
          posterEntry,
          ...(introConfig.library || []).map((x) =>
            x.kind === 'poster' && x.status === 'active' ? { ...x, status: 'archived' as const } : x
          ),
        ],
      };
      setIntroConfig(nextIntro);
      await updateSiteConfig({ intro: nextIntro });
      onShowToast('Đã tải lên và áp dụng ảnh Poster dự phòng cho Video Intro.');
    } catch (err: any) {
      onShowToast(err?.message || 'Không thể tải ảnh Poster.');
    } finally {
      setIntroUploading(false);
      setIntroUploadProgress('');
      e.target.value = '';
    }
  };

  // Phương thức 3: Kết xuất trực tiếp bản thiết kế thành tệp Video WebM 10 giây ngay trong trình duyệt (nếu hỗ trợ MediaRecorder)
  const handleExportDesignToWebmAndUpload = async () => {
    if (!canRecordCanvasVideo) {
      onShowToast('Trình duyệt hiện tại không hỗ trợ MediaRecorder trên Canvas. Vui lòng tải tệp MP4 đã dựng sẵn lên ở khung bên cạnh.');
      return;
    }
    setExportingCanvasVideo(true);
    setIntroUploadProgress('Đang dựng và ghi hình chuẩn 10 giây từ bản thiết kế trực quan...');
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1280;
      canvas.height = 720;
      const ctx = canvas.getContext('2d')!;
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        logoImg.onload = () => resolve();
        logoImg.onerror = () => reject(new Error('Không thể tải ảnh logo để kết xuất video.'));
        logoImg.src = introConfig.logoUrl || '/brand/sky-first-network-web.png';
      });

      const stream = (canvas as any).captureStream(30);
      const mimeType = (window as any).MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';
      const recorder = new (window as any).MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 2500000,
      });
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (ev: any) => {
        if (ev.data && ev.data.size > 0) chunks.push(ev.data);
      };

      const dCfg = introConfig.designConfig || DEFAULT_DESIGN_CONFIG;
      const durationMs = 10000;
      recorder.start(200);
      const startTime = performance.now();

      await new Promise<void>((resolve) => {
        const drawFrame = () => {
          const elapsed = performance.now() - startTime;
          const t = Math.min(10, elapsed / 1000);
          const grad = ctx.createRadialGradient(640, 245, 40, 640, 360, 720);
          grad.addColorStop(0, dCfg.bgSecondary || '#0B3B78');
          grad.addColorStop(1, dCfg.bgPrimary || '#061A3A');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 1280, 720);

          const scale = (Number(dCfg.logoScalePercent || 100) / 100) * Math.min(1, 0.92 + 0.08 * (t / 1.5));
          const cardW = 516 * scale;
          const cardH = 260 * scale;
          const cx = (1280 - cardW) / 2;
          const cy = 96 + (Number(dCfg.logoOffsetYPercent || 0) / 100) * 120;
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.roundRect(cx, cy, cardW, cardH, 26);
          ctx.fill();

          const ratio = logoImg.width / Math.max(1, logoImg.height);
          const lh = 200 * scale;
          const lw = lh * ratio;
          ctx.drawImage(logoImg, (1280 - lw) / 2, cy + (cardH - lh) / 2, lw, lh);

          if (t >= 1.5) {
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 25px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(dCfg.headlineText || DEFAULT_DESIGN_CONFIG.headlineText!, 640, 412);
            ctx.fillStyle = '#7DD3FC';
            ctx.font = 'bold 13px sans-serif';
            ctx.fillText(dCfg.subtitleText || DEFAULT_DESIGN_CONFIG.subtitleText!, 640, 446);
          }

          if (elapsed < durationMs) {
            requestAnimationFrame(drawFrame);
          } else {
            recorder.stop();
            resolve();
          }
        };
        requestAnimationFrame(drawFrame);
      });

      await new Promise<void>((resolve) => {
        recorder.onstop = () => resolve();
      });

      const blob = new Blob(chunks, { type: 'video/webm' });
      const file = new File([blob], `sky-first-intro-designed-10s-${Date.now()}.webm`, {
        type: 'video/webm',
      });
      setIntroUploadProgress('Đang tải tệp video WebM 10s vừa kết xuất lên kho R2...');
      const uploaded = await uploadMedia(file, false, {
        category: 'intro_video',
        versionStatus: 'active',
        durationSeconds: 10,
        width: 1280,
        height: 720,
        posterUrl: introConfig.posterUrl || '/brand/sky-first-network-web.png',
        caption: 'Video Intro 10s kết xuất từ Trình thiết kế Admin',
      });
      const newEntry: IntroLibraryItem = {
        id: uploaded.key,
        key: uploaded.key,
        name: file.name,
        kind: 'video',
        url: uploaded.url,
        posterUrl: introConfig.posterUrl || '/brand/sky-first-network-web.png',
        format: 'video/webm',
        sizeBytes: file.size,
        durationSeconds: 10,
        width: 1280,
        height: 720,
        uploadedAt: new Date().toISOString(),
        status: 'active',
        note: 'Kết xuất trực tiếp từ Trình thiết kế Intro trong Admin',
      };
      const nextIntro: IntroSettings = {
        ...introConfig,
        activeMode: 'video',
        videoUrl: uploaded.url,
        videoFileDurationSeconds: 10,
        library: [
          newEntry,
          ...(introConfig.library || []).map((x) =>
            x.kind === 'video' && x.status === 'active' ? { ...x, status: 'archived' as const } : x
          ),
        ],
      };
      setIntroConfig(nextIntro);
      await updateSiteConfig({ intro: nextIntro });
      onShowToast('Đã kết xuất bản thiết kế thành tệp Video 10s và kích hoạt trên Website!');
    } catch (err: any) {
      onShowToast(err?.message || 'Không thể kết xuất video trực tiếp.');
    } finally {
      setExportingCanvasVideo(false);
      setIntroUploadProgress('');
    }
  };

  const handleActivateLibraryItem = async (item: IntroLibraryItem) => {
    const nextIntro: IntroSettings = { ...introConfig };
    if (item.kind === 'video') {
      nextIntro.activeMode = 'video';
      nextIntro.videoUrl = item.url;
      nextIntro.videoFileDurationSeconds = item.durationSeconds || 10;
      if (item.posterUrl) nextIntro.posterUrl = item.posterUrl;
    } else if (item.kind === 'poster') {
      nextIntro.posterUrl = item.url;
    } else if (item.kind === 'design' && item.designConfig) {
      nextIntro.activeMode = 'designed';
      nextIntro.designConfig = { ...item.designConfig };
    }
    nextIntro.library = (introConfig.library || []).map((entry) => {
      if (entry.id === item.id || entry.url === item.url) {
        return { ...entry, status: 'active' as const };
      }
      if (entry.kind === item.kind && entry.status === 'active') {
        return { ...entry, status: 'archived' as const };
      }
      return entry;
    });
    setIntroConfig(nextIntro);
    if (item.key) {
      try {
        await updateMediaMetadata({
          key: item.key,
          category: item.kind === 'poster' ? 'intro_poster' : 'intro_video',
          versionStatus: 'active',
        });
      } catch {}
    }
    const ok = await updateSiteConfig({ intro: nextIntro });
    setIntroPreviewKey((k) => k + 1);
    onShowToast(
      ok
        ? `Đã kích hoạt phiên bản "${item.name}" làm Intro chính thức của website.`
        : `Đã chọn "${item.name}". Bấm Xuất bản cấu hình để lưu lên máy chủ.`
    );
  };

  const handleArchiveLibraryItem = async (item: IntroLibraryItem) => {
    const nextLib = (introConfig.library || []).map((entry) =>
      entry.id === item.id ? { ...entry, status: 'archived' as const } : entry
    );
    const nextIntro = { ...introConfig, library: nextLib };
    setIntroConfig(nextIntro);
    if (item.key) {
      try {
        await updateMediaMetadata({
          key: item.key,
          category: item.kind === 'poster' ? 'intro_poster' : 'intro_video',
          versionStatus: 'archived',
        });
      } catch {}
    }
    await updateSiteConfig({ intro: nextIntro });
    onShowToast(`Đã chuyển "${item.name}" sang trạng thái Bản lưu trữ.`);
  };

  const handleDeleteLibraryItem = async (item: IntroLibraryItem) => {
    if (
      item.status === 'active' ||
      item.url === introConfig.videoUrl ||
      item.url === introConfig.posterUrl
    ) {
      onShowToast('Không thể xóa phiên bản đang hoạt động! Hãy kích hoạt một phiên bản khác trước khi xóa.');
      return;
    }
    if (item.id.startsWith('builtin-')) {
      onShowToast('Phiên bản mặc định gốc của hệ thống được bảo vệ để luôn có phương án khôi phục an toàn.');
      return;
    }
    if (item.key) {
      try {
        await deleteMediaItem(item.key);
      } catch (err: any) {
        onShowToast(err?.message || 'Không thể xóa tệp trên R2.');
        return;
      }
    }
    const nextLib = (introConfig.library || []).filter((x) => x.id !== item.id);
    const nextIntro = { ...introConfig, library: nextLib };
    setIntroConfig(nextIntro);
    await updateSiteConfig({ intro: nextIntro });
    onShowToast(`Đã xóa phiên bản "${item.name}" khỏi thư viện.`);
  };

  // ==========================================
  // HANDLERS: TÙY CHỈNH KÍCH THƯỚC & BỐ CỤC 10 NHÓM (MỤC VI)
  // ==========================================
  const handleSaveLayoutAndDesignSystem = async () => {
    const ok = await updateSiteConfig({
      designSystem,
      homeSections,
      homeSectionOrder,
    });
    onShowToast(
      ok
        ? 'Đã áp dụng cấu hình Kích thước, Bố cục & Giao diện trên toàn website (tương thích Desktop & Mobile)!'
        : 'Không thể lưu cấu hình giao diện. Vui lòng thử lại.'
    );
  };

  const handleRestoreDefaultLayout = async () => {
    setDesignSystem(DEFAULT_LAYOUT_SYSTEM);
    const defSections = DEFAULT_SITE_CONFIG.homeSections || {};
    const defOrder = DEFAULT_SITE_CONFIG.homeSectionOrder || [
      'hero',
      'pillars',
      'news',
      'programs',
      'values',
      'certificate',
      'transparency',
      'units',
      'cta',
    ];
    setHomeSections(defSections as Record<string, boolean>);
    setHomeSectionOrder(defOrder);
    const ok = await updateSiteConfig({
      designSystem: DEFAULT_LAYOUT_SYSTEM,
      homeSections: defSections,
      homeSectionOrder: defOrder,
    });
    onShowToast(
      ok
        ? 'Đã khôi phục toàn bộ kích thước và bố cục về cấu hình chuẩn mặc định.'
        : 'Đã đặt lại giá trị mặc định trên trình duyệt.'
    );
  };

  const moveHomeSection = (key: string, dir: -1 | 1) => {
    const idx = homeSectionOrder.indexOf(key);
    const target = idx + dir;
    if (idx < 0 || target < 0 || target >= homeSectionOrder.length) return;
    const next = [...homeSectionOrder];
    [next[idx], next[target]] = [next[target], next[idx]];
    setHomeSectionOrder(next);
  };

  // ==========================================
  // HANDLERS: EMAIL RESEND API & OUTBOX (MỤC IV)
  // ==========================================
  const handleSaveEmailConfig = async () => {
    const nextEmail: EmailSystemSettings = {
      ...emailSettings,
      apiKeyMasked: undefined,
    };
    setEmailSettings(nextEmail);
    const ok = await updateSiteConfig({ emailSettings: nextEmail });
    onShowToast(
      ok
        ? 'Đã lưu cấu hình Email & Resend API (Khóa bí mật chỉ đọc từ biến môi trường Secrets của máy chủ).'
        : 'Không thể lưu cấu hình Email.'
    );
  };

  const handlePreviewEmail = async () => {
    try {
      const res: any = await adminApi('/api/system?action=email-preview', {
        method: 'POST',
        body: JSON.stringify({
          subjectTemplate: previewSubject,
          bodyTemplate: previewBody,
        }),
      });
      if (res?.ok) {
        setPreviewResult({
          subject: res.renderedSubject,
          body: res.renderedBody,
          htmlBody: res.renderedHtml,
          allowedVariables: Array.isArray(res.allowedVariables) ? res.allowedVariables : [],
        });
        onShowToast('Đã tạo bản xem trước mẫu Email (An toàn, không gửi email thật).');
      }
    } catch (e: any) {
      onShowToast(e?.message || 'Không thể xem trước mẫu email.');
    }
  };

  const handleSendTestEmail = async () => {
    try {
      const res: any = await adminApi('/api/system?action=email-test', {
        method: 'POST',
        body: JSON.stringify({
          recipientEmail: testEmailRecipient.trim(),
          subject: previewSubject,
          body: previewBody,
          fromName: emailSettings.senderName || 'Trang Thông Tin Điện Tử Sky First',
          replyTo: emailSettings.replyToEmail || 'lienhe@skyfirst.io.vn',
        }),
      });
      await loadOutbox();
      onShowToast(res?.message || `Kết quả kiểm thử gửi thư: ${res?.deliveryStatus || 'queued'}`);
    } catch (e: any) {
      onShowToast(e?.message || 'Lỗi khi kiểm thử gửi email.');
    }
  };

  const handleRetryOutboxItem = async (id: string) => {
    try {
      const res: any = await adminApi('/api/system?action=email-retry', {
        method: 'POST',
        body: JSON.stringify({ id }),
      });
      await loadOutbox();
      onShowToast(res?.message || `Đã thực hiện thử gửi lại (Trạng thái: ${res?.status || 'updated'}).`);
    } catch (e: any) {
      onShowToast(e?.message || 'Không thể thử gửi lại bản ghi này.');
    }
  };

  const handleSaveAutomationAndSeo = async () => {
    const ok = await updateSiteConfig({
      automationSettings,
      seoSettings,
    });
    onShowToast(
      ok ? 'Đã lưu quy tắc Tự động hóa & Cấu hình SEO.' : 'Không thể lưu cấu hình Tự động hóa & SEO.'
    );
  };

  const handleRunAutomationsNow = async () => {
    try {
      const res: any = await adminApi('/api/system?action=run-automations', {
        method: 'POST',
      });
      onShowToast(
        `Đã chạy tác vụ tự động: Xuất bản ${res?.publishedScheduledCount || 0} mục đến hẹn, đóng ${res?.autoClosedFormsCount || 0} biểu mẫu hết hạn.`
      );
      await fetchDataFromFirestore();
    } catch (e: any) {
      onShowToast(e?.message || 'Không thể chạy kiểm tra tự động hóa.');
    }
  };

  const handleAddManualAnalytics = async () => {
    if (!manualLabel.trim() || !manualValue.trim()) {
      onShowToast('Vui lòng nhập tên chỉ số và giá trị thống kê.');
      return;
    }
    try {
      await adminApi('/api/system?action=analytics-manual', {
        method: 'POST',
        body: JSON.stringify({
          metricLabel: manualLabel.trim(),
          metricValue: Number(manualValue),
          source: manualSource.trim() || 'Báo cáo nội bộ',
          metricDate: manualDate,
          note: manualNote.trim(),
        }),
      });
      setManualLabel('');
      setManualValue('');
      setManualSource('');
      setManualNote('');
      onShowToast('Đã lưu bản ghi thống kê thủ công (có ghi rõ nguồn & ngày).');
      await loadAnalytics();
    } catch (e: any) {
      onShowToast(e?.message || 'Không thể thêm số liệu thủ công.');
    }
  };

  const handleDeleteManualAnalytics = async (id: string) => {
    try {
      await adminApi(`/api/system?action=analytics-manual&id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      onShowToast('Đã xóa bản ghi số liệu thủ công.');
      await loadAnalytics();
    } catch (e: any) {
      onShowToast(e?.message || 'Không thể xóa bản ghi.');
    }
  };

  const handleCreateBackup = async () => {
    setBackupBusy(true);
    try {
      const res: any = await adminApi('/api/system?action=backup-create', {
        method: 'POST',
        body: JSON.stringify({
          label: backupLabel.trim() || `Sao lưu hệ thống ${new Date().toLocaleString('vi-VN')}`,
        }),
      });
      setBackupLabel('');
      onShowToast(`Đã tạo bản sao lưu thành công (SHA-256: ${String(res?.sha256 || '').slice(0, 12)}...).`);
      await loadBackups();
    } catch (e: any) {
      onShowToast(e?.message || 'Không thể tạo bản sao lưu.');
    } finally {
      setBackupBusy(false);
    }
  };

  const handleConfirmRestoreBackup = async () => {
    if (!restoreConfirmId) return;
    setBackupBusy(true);
    try {
      await adminApi('/api/system?action=backup-restore', {
        method: 'POST',
        body: JSON.stringify({
          id: restoreConfirmId,
          confirmText: restoreConfirmText.trim(),
        }),
      });
      onShowToast('Đã khôi phục dữ liệu từ bản sao lưu và tự động tạo điểm lưu dự phòng trước khi ghi đè!');
      setRestoreConfirmId(null);
      setRestoreConfirmText('');
      await fetchDataFromFirestore();
      await loadBackups();
    } catch (e: any) {
      onShowToast(e?.message || 'Khôi phục thất bại.');
    } finally {
      setBackupBusy(false);
    }
  };

  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const item = await uploadMedia(file, true);
      setLogoUrl(item.url);
      setIntroConfig((p) => ({ ...p, logoUrl: item.url }));
      onShowToast('Đã tải logo vào thư viện R2. Bấm Xuất bản cấu hình để áp dụng.');
    } catch (error) {
      onShowToast(error instanceof Error ? error.message : 'Không tải được logo.');
    } finally {
      e.target.value = '';
    }
  };

  const generateAdminPassword = () => {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%_-';
    const bytes = new Uint32Array(18);
    crypto.getRandomValues(bytes);
    const generated = Array.from(bytes, (n) => alphabet[n % alphabet.length]).join('');
    setUserPassword(generated);
    setUserPasswordConfirm(generated);
    setShowUserPassword(true);
    setShowUserPasswordConfirm(true);
    setEmailError('');
  };
  const passwordChecks = {
    length: userPassword.length >= 10,
    upper: /[A-Z]/.test(userPassword),
    lower: /[a-z]/.test(userPassword),
    digit: /[0-9]/.test(userPassword),
  };
  const passwordStrong =
    passwordChecks.length && passwordChecks.upper && passwordChecks.lower && passwordChecks.digit;

  const handleOpenAddUser = () => {
    setEditingUser(null);
    setUserEmail('');
    setUserName('');
    setUserRole('admin');
    setUserPermissions(ROLE_CAPABILITIES.admin);
    setUserStatus('active');
    setUserNote('');
    setEmailError('');
    setUserPassword('');
    setUserPasswordConfirm('');
    setShowUserPassword(false);
    setShowUserPasswordConfirm(false);
    setUserModalOpen(true);
  };

  const handleOpenEditUser = (user: AdminUser) => {
    setEditingUser(user);
    setUserEmail(user.email);
    setUserName(user.name);
    setUserRole(user.role);
    setUserPermissions(
      Array.isArray(user.permissions) && user.permissions.length > 0
        ? user.permissions
        : ROLE_CAPABILITIES[user.role] || ROLE_CAPABILITIES.editor
    );
    setUserStatus(user.status);
    setUserNote(user.note || '');
    setEmailError('');
    setUserPassword('');
    setUserPasswordConfirm('');
    setShowUserPassword(false);
    setShowUserPasswordConfirm(false);
    setUserModalOpen(true);
  };

  const handleSaveUser = async () => {
    if (userSaving) return;
    const trimmedEmail = userEmail.trim().toLowerCase();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setEmailError('Địa chỉ email không hợp lệ');
      return;
    }
    if (!editingUser && !passwordStrong) {
      setEmailError('Mật khẩu cần ít nhất 10 ký tự, có chữ hoa, chữ thường và số.');
      return;
    }
    if (editingUser && userPassword && !passwordStrong) {
      setEmailError('Mật khẩu mới cần ít nhất 10 ký tự, có chữ hoa, chữ thường và số.');
      return;
    }
    if (userPassword && userPassword !== userPasswordConfirm) {
      setEmailError('Xác nhận mật khẩu chưa trùng khớp.');
      return;
    }
    setUserSaving(true);
    setEmailError('');
    try {
      if (editingUser) {
        await updateAdminAccount(editingUser.id, {
          name: userName.trim() || trimmedEmail.split('@')[0],
          role: userRole,
          status: userStatus,
          note: userNote.trim(),
          permissions: userPermissions,
        });
        if (userPassword) await resetAdminPassword(editingUser.id, userPassword);
        onShowToast(
          userPassword
            ? `Đã cập nhật tài khoản, quyền hạn và đặt lại mật khẩu ${trimmedEmail}.`
            : `Đã cập nhật tài khoản và quyền hạn ${trimmedEmail}.`
        );
      } else {
        await createAdminAccount({
          email: trimmedEmail,
          password: userPassword,
          name: userName.trim() || trimmedEmail.split('@')[0],
          role: userRole,
          status: userStatus,
          note: userNote.trim(),
          permissions: userPermissions,
        });
        onShowToast(`Đã tạo tài khoản quản trị ${trimmedEmail}.`);
      }
      await refreshAdminUsers();
      setUserModalOpen(false);
      setUserPassword('');
      setUserPasswordConfirm('');
    } catch (e: any) {
      setEmailError(e?.message || 'Không thể lưu tài khoản quản trị.');
    } finally {
      setUserSaving(false);
    }
  };

  const handleConfirmDeleteUser = async () => {
    if (!deleteConfirmUser) return;
    try {
      await deleteAdminAccount(deleteConfirmUser.id);
      onShowToast(`Đã xóa tài khoản ${deleteConfirmUser.email}`);
      await refreshAdminUsers();
      setDeleteConfirmUser(null);
    } catch (e: any) {
      onShowToast(e?.message || 'Không thể xóa tài khoản quản trị.');
    }
  };

  const handleSaveSiteStatus = async () => {
    const ok = await updateSiteConfig({
      siteStatus,
      closedReason,
      closedReasonText: closedReasonText.trim(),
      closedMessage: closedMessage.trim(),
      closedEstimatedReopen: closedEstimatedReopen.trim(),
      closedNoticeType,
    });
    if (!ok) {
      onShowToast('Thay đổi chưa ghi được lên máy chủ.');
      return;
    }
    onShowToast(
      siteStatus === 'closed'
        ? 'Đã chuyển website sang chế độ Bảo trì (Trang /admin vẫn hoạt động 100%).'
        : 'Đã mở website công khai hoạt động bình thường.'
    );
  };

  const filteredUsers = adminUsers.filter((u) => {
    const matchSearch =
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.name.toLowerCase().includes(userSearch.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const getRoleBadge = (role: AdminUserRole) => {
    switch (role) {
      case 'developer':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Code2 size={13} />
            <span>Lập trình viên</span>
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Shield size={13} />
            <span>Quản trị viên</span>
          </span>
        );
      case 'editor':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
            <PenTool size={13} />
            <span>Biên tập viên</span>
          </span>
        );
    }
  };

  const toggleCapability = (cap: AdminCapability) => {
    setUserPermissions((prev) =>
      prev.includes(cap) ? prev.filter((c) => c !== cap) : [...prev, cap]
    );
  };

  const SECTION_LABELS: Record<string, string> = {
    hero: 'Đầu trang (Hero Banner)',
    pillars: '05 Trụ cột hoạt động',
    news: 'Tin tức, Thông báo & Điều hành',
    programs: 'Chương trình & Dự án',
    values: '06 Giá trị cốt lõi',
    certificate: 'Trung tâm Xác thực GCN',
    transparency: 'Công khai & Văn bản chính thức',
    units: 'Đơn vị trực thuộc',
    cta: 'Kêu gọi tham gia (CTA)',
  };

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* THANH ĐIỀU HƯỚNG TRUNG TÂM CẤU HÌNH TOÀN DIỆN (18 NHÓM)                    */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Sliders className="text-sky-600" size={20} />
              <span>Trung Tâm Cấu Hình Hệ Thống, Video Intro 10s, Giao Diện & Resend API</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Quản trị tập trung Video Intro 10 giây (3 phương thức + thư viện phiên bản), tùy chỉnh kích thước/bố cục 10 nhóm, Resend API Outbox, SEO, thống kê truy cập và sao lưu SHA-256.
            </p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              value={configSearch}
              onChange={(e) => setConfigSearch(e.target.value)}
              placeholder="Tìm nhanh cài đặt (vd: intro, kích thước, resend)..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
          {[
            { id: 'overview', label: 'Tổng Quan 18 Nhóm' },
            { id: 'brand-intro', label: 'Studio Video Intro 10s' },
            { id: 'layout-sizing', label: 'Kích Thước & Bố Cục (10 Nhóm)' },
            { id: 'email-outbox', label: 'Resend API & Email Outbox' },
            { id: 'automation-seo', label: 'Tự Động Hóa & SEO' },
            { id: 'analytics', label: 'Thống Kê Truy Cập' },
            { id: 'backup', label: 'Sao Lưu SHA-256' },
            { id: 'users', label: 'Tài Khoản & Phân Quyền' },
            { id: 'maintenance', label: 'Bảo Trì & Đồng Bộ D1' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCenterTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeCenterTab === tab.id
                  ? 'bg-[#071B3A] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 0: BẢNG ĐIỀU KHIỂN 18 NHÓM CẤU HÌNH                                    */}
      {/* ========================================================================= */}
      {activeCenterTab === 'overview' && (
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Danh mục 18 nhóm cấu hình chuẩn hóa ({filteredGroups.length}/18 nhóm)
            </h3>
            <span className="text-[11px] text-slate-500">
              Phân tách rõ: <b className="text-emerald-700">public</b> • <b className="text-sky-700">admin</b> • <b className="text-rose-700">secret</b>
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredGroups.map((g) => (
              <div
                key={g.id}
                className="rounded-xl border border-slate-200 p-4 hover:border-sky-300 transition bg-slate-50/40 flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11px] font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                      Nhóm {g.id} • {g.code}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        g.scope === 'secret'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : g.scope === 'admin'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {g.scope}
                    </span>
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-900">{g.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{g.desc}</p>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (['2.1', '2.3'].includes(g.id)) setActiveCenterTab('brand-intro');
                      else if (['2.2', '2.4', '2.5', '2.11'].includes(g.id)) setActiveCenterTab('layout-sizing');
                      else if (g.id === '2.9') setActiveCenterTab('email-outbox');
                      else if (['2.10', '2.12'].includes(g.id)) setActiveCenterTab('automation-seo');
                      else if (g.id === '2.13') setActiveCenterTab('analytics');
                      else if (g.id === '2.15') setActiveCenterTab('users');
                      else if (g.id === '2.16') setActiveCenterTab('backup');
                      else setActiveCenterTab('maintenance');
                    }}
                    className="text-[11px] font-bold text-[#0B66C3] hover:underline"
                  >
                    Mở cấu hình →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: STUDIO THIẾT KẾ, TẢI LÊN & QUẢN LÝ VIDEO INTRO 10 GIÂY (PHỤ LỤC)  */}
      {/* ========================================================================= */}
      {(activeCenterTab === 'brand-intro' || activeCenterTab === 'overview') && (
        <section
          id="section-brand"
          className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-200 px-3 py-1 text-[11px] font-extrabold text-sky-700 mb-2">
                <Video size={13} />
                <span>PHỤ LỤC QUẢN TRỊ VIDEO INTRO 10 GIÂY • KHÔNG GIỌNG ĐỌC AI</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Nhóm 2.1 & 2.3 — Hệ Thống Thiết Kế, Tải Lên & Quản Lý Video Intro Trong Admin
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Tích hợp đầy đủ 3 phương thức tạo Intro, Bộ điều khiển 10 giây (tách biệt thời lượng tệp video với thời gian hiển thị) và Thư viện phiên bản R2/D1 an toàn.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleRestoreDefaultIntro}
                className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 inline-flex items-center gap-1.5"
              >
                <RotateCcw size={14} />
                <span>Khôi phục mặc định 10s</span>
              </button>
              <button
                type="button"
                onClick={() => handleSaveBrandAndIntro('draft')}
                className="px-4 py-2 rounded-xl border border-sky-300 bg-sky-50 hover:bg-sky-100 text-xs font-bold text-sky-900 inline-flex items-center gap-1.5"
              >
                <Save size={14} />
                <span>Lưu bản nháp</span>
              </button>
              <button
                type="button"
                onClick={() => handleSaveBrandAndIntro('published')}
                className="px-5 py-2 rounded-xl bg-[#0B66C3] hover:bg-sky-700 text-white text-xs font-extrabold shadow-xs inline-flex items-center gap-1.5"
              >
                <CheckCircle2 size={15} />
                <span>Xuất bản cấu hình Intro</span>
              </button>
            </div>
          </div>

          {/* Hàng 1: Nhận diện thương hiệu cơ bản & Bộ điều khiển Intro 10 giây */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-5">
              {/* Khối Nhận diện chung */}
              <div className="rounded-2xl border border-slate-200 p-5 space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <ImageIcon size={15} className="text-sky-600" />
                  <span>1. Nhận Diện Thương Hiệu Gốc (Bảo Toàn Tỷ Lệ Logo 1945×1171)</span>
                </h4>
                <ImageUrlInput
                  label="Đường dẫn Logo Sky First đang sử dụng"
                  value={logoUrl}
                  onChange={(val) => {
                    setLogoUrl(val);
                    setIntroConfig((p) => ({ ...p, logoUrl: val }));
                  }}
                  helperText="Giữ nguyên 100% hình dạng, tỷ lệ và nhận diện gốc của logo Sky First."
                />
                <div className="flex flex-wrap items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition">
                    <UploadCloud size={14} />
                    <span>Tải logo mới lên R2</span>
                    <input type="file" accept="image/*" onChange={handleLogoFileUpload} className="hidden" />
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Tên Hiển Thị Website <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      className="w-full text-xs px-3 py-2 font-bold rounded-xl border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Khẩu Hiệu / Mô Tả Ngắn
                    </label>
                    <input
                      type="text"
                      value={siteDescription}
                      onChange={(e) => setSiteDescription(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>
                </div>
              </div>

              {/* Khối Bộ điều khiển Intro (Mục 3 Phụ lục bổ sung) */}
              <div className="rounded-2xl border border-sky-200 bg-sky-50/40 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      2. Bộ Điều Khiển Màn Hình Intro (Mục Tiêu 10 Giây)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Tự động chạy chế độ không âm thanh (muted autoplay), không đọc giọng AI, không khóa màn hình khi mạng chậm.
                    </p>
                  </div>
                  <label className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-sky-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={introConfig.enabled !== false}
                      onChange={(e) => setIntroConfig((p) => ({ ...p, enabled: e.target.checked }))}
                    />
                    <span>{introConfig.enabled !== false ? 'Đang Bật Intro' : 'Đang Tắt Intro'}</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Nguồn phát Intro đang kích hoạt
                    </label>
                    <select
                      value={introConfig.activeMode || 'video'}
                      onChange={(e) =>
                        setIntroConfig((p) => ({ ...p, activeMode: e.target.value as any }))
                      }
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold"
                    >
                      <option value="video">Phát tệp Video Intro (MP4/WebM) + Dự phòng Logo</option>
                      <option value="designed">Phát trực tiếp Bản thiết kế Intro trong Admin</option>
                      <option value="hybrid">Kết hợp Video & Bản thiết kế</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Tần suất hiển thị theo phiên truy cập
                    </label>
                    <select
                      value={introConfig.playMode || 'every_home_load'}
                      onChange={(e) =>
                        setIntroConfig((p) => ({ ...p, playMode: e.target.value as any }))
                      }
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold"
                    >
                      <option value="every_home_load">Khi mở / tải lại trực tiếp Trang chủ (/)</option>
                      <option value="once_per_session">Một lần duy nhất mỗi phiên truy cập (Session)</option>
                      <option value="disabled">Tắt hiển thị Intro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Thời gian hiển thị Intro mục tiêu (giây)
                    </label>
                    <input
                      type="number"
                      min={3}
                      max={20}
                      step={1}
                      value={introConfig.durationSeconds ?? 10}
                      onChange={(e) =>
                        setIntroConfig((p) => ({
                          ...p,
                          durationSeconds: Math.max(3, Math.min(20, Number(e.target.value || 10))),
                        }))
                      }
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold"
                    />
                    <span className="text-[10px] text-slate-500">
                      Chuẩn yêu cầu: 10 giây (Tệp video hiện tại: {introConfig.videoFileDurationSeconds || 10}s)
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Thời gian chờ tải Video tối đa (ms)
                    </label>
                    <input
                      type="number"
                      min={1500}
                      max={8000}
                      step={500}
                      value={introConfig.maxWaitDurationMs ?? 3500}
                      onChange={(e) =>
                        setIntroConfig((p) => ({
                          ...p,
                          maxWaitDurationMs: Math.max(1500, Math.min(8000, Number(e.target.value || 3500))),
                        }))
                      }
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    />
                    <span className="text-[10px] text-slate-500">
                      Quá thời gian này sẽ chuyển sang phương án dự phòng, không chặn website.
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Hiệu ứng chuyển từ Intro vào Trang chủ
                    </label>
                    <select
                      value={introConfig.transitionStyle || 'fade'}
                      onChange={(e) =>
                        setIntroConfig((p) => ({ ...p, transitionStyle: e.target.value as any }))
                      }
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="fade">Mờ dần mượt mà (Smooth Fade)</option>
                      <option value="zoom">Phóng nhẹ tinh tế (Subtle Scale)</option>
                      <option value="slide_up">Trượt lên thanh lịch (Slide Up)</option>
                      <option value="minimal">Chuyển tức thì (Minimal)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Phương án dự phòng khi Video lỗi/chậm
                    </label>
                    <select
                      value={introConfig.fallbackMode || 'logo_fade'}
                      onChange={(e) =>
                        setIntroConfig((p) => ({ ...p, fallbackMode: e.target.value as any }))
                      }
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="logo_fade">Hiển thị khung nhận diện Logo & Poster dự phòng</option>
                      <option value="skip_immediately">Vào thẳng Trang chủ ngay lập tức</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Cách hiển thị trên Máy tính (Desktop)
                    </label>
                    <select
                      value={introConfig.desktopDisplayMode || 'contain'}
                      onChange={(e) =>
                        setIntroConfig((p) => ({ ...p, desktopDisplayMode: e.target.value as any }))
                      }
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="contain">Giữ trọn khung hình 16:9 chuẩn (Contain)</option>
                      <option value="theater">Khung rộng điện ảnh (Theater 82vh)</option>
                      <option value="cover">Phủ đầy khung hình (Cover)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Cách hiển thị trên Điện thoại (Mobile)
                    </label>
                    <select
                      value={introConfig.mobileDisplayMode || 'contain'}
                      onChange={(e) =>
                        setIntroConfig((p) => ({ ...p, mobileDisplayMode: e.target.value as any }))
                      }
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="contain">Tối ưu tỷ lệ vừa màn hình dọc (Contain)</option>
                      <option value="compact">Thu gọn tiết kiệm không gian (Compact)</option>
                      <option value="skip_on_slow">Tự động bỏ qua khi bật tiết kiệm dữ liệu / 2G</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Đường dẫn Video đang kích hoạt
                    </label>
                    <input
                      type="text"
                      value={introConfig.videoUrl || ''}
                      onChange={(e) => setIntroConfig((p) => ({ ...p, videoUrl: e.target.value }))}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Đường dẫn Poster dự phòng
                    </label>
                    <input
                      type="text"
                      value={introConfig.posterUrl || ''}
                      onChange={(e) => setIntroConfig((p) => ({ ...p, posterUrl: e.target.value }))}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-1 text-xs">
                  <label className="inline-flex items-center gap-1.5 font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={introConfig.allowSkip !== false}
                      onChange={(e) => setIntroConfig((p) => ({ ...p, allowSkip: e.target.checked }))}
                    />
                    <span>Cho phép nút "{introConfig.skipLabel || 'Bỏ qua Intro'}"</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={introConfig.respectReducedMotion !== false}
                      onChange={(e) =>
                        setIntroConfig((p) => ({ ...p, respectReducedMotion: e.target.checked }))
                      }
                    />
                    <span>Tôn trọng giảm chuyển động (prefers-reduced-motion)</span>
                  </label>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <Check size={12} /> Mặc định tắt tiếng (Muted) & Không dùng giọng đọc AI
                  </span>
                </div>
              </div>
            </div>

            {/* Cột Phải: Màn hình Xem trước trực tiếp Intro (Desktop / Mobile) */}
            <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 flex flex-col justify-between space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Eye size={15} className="text-sky-600" />
                    <span>Màn Hình Xem Trước Trực Tiếp Intro (10 Giây)</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Kiểm tra thực tế chuyển động, tỷ lệ khung hình và nút bỏ qua trước khi xuất bản.
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIntroPreviewDevice('desktop')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1 ${
                      introPreviewDevice === 'desktop'
                        ? 'bg-[#071B3A] text-white'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    <Monitor size={13} /> Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setIntroPreviewDevice('mobile')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1 ${
                      introPreviewDevice === 'mobile'
                        ? 'bg-[#071B3A] text-white'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    <Smartphone size={13} /> Mobile (390px)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIntroPreviewKey((k) => k + 1)}
                    className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold inline-flex items-center gap-1"
                  >
                    <Play size={12} /> Phát lại 10s
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center bg-slate-900/95 rounded-2xl p-3 min-h-[440px]">
                <div
                  className={
                    introPreviewDevice === 'mobile'
                      ? 'w-[360px] max-w-full h-[430px] rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl'
                      : 'w-full h-[430px] rounded-2xl overflow-hidden border border-slate-700 shadow-xl'
                  }
                >
                  <HomepageIntroOverlay
                    key={introPreviewKey}
                    config={introConfig}
                    siteName={siteName}
                    defaultLogoUrl={logoUrl}
                    previewMode={true}
                    onFinish={() => {}}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div className="rounded-xl bg-white border border-slate-200 p-2.5">
                  <span className="text-slate-400 block">Chế độ phát</span>
                  <b className="text-slate-800">
                    {introConfig.activeMode === 'designed' ? 'Thiết kế trực quan' : 'Video MP4/H.264'}
                  </b>
                </div>
                <div className="rounded-xl bg-white border border-slate-200 p-2.5">
                  <span className="text-slate-400 block">Thời lượng mục tiêu</span>
                  <b className="text-sky-700">{introConfig.durationSeconds || 10}.0 giây</b>
                </div>
                <div className="rounded-xl bg-white border border-slate-200 p-2.5">
                  <span className="text-slate-400 block">Âm thanh / Giọng AI</span>
                  <b className="text-emerald-700">Tắt 100% (Muted)</b>
                </div>
                <div className="rounded-xl bg-white border border-slate-200 p-2.5">
                  <span className="text-slate-400 block">Chờ tải tối đa</span>
                  <b className="text-slate-800">{introConfig.maxWaitDurationMs || 3500} ms</b>
                </div>
              </div>
            </div>
          </div>

          {/* Hàng 2: 3 Phương thức tạo Intro (Mục 2 Phụ lục bổ sung) */}
          <div className="rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Film size={16} className="text-sky-600" />
                  <span>3. Ba Phương Thức Tạo & Tải Lên Video Intro</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chủ động tự thiết kế trong Admin, tải video MP4/WebM dựng sẵn lên R2, hoặc kết hợp cả hai phương thức.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'method1_design', label: 'Phương thức 1: Tự thiết kế trong Admin' },
                  { id: 'method2_upload', label: 'Phương thức 2: Tải video có sẵn lên' },
                  { id: 'method3_hybrid', label: 'Phương thức 3: Kết hợp thiết kế & tải lên' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setIntroStudioMethod(m.id as any)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                      introStudioMethod === m.id
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {introUploadProgress && (
              <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-xs font-bold text-sky-900 flex items-center gap-2">
                <RefreshCw size={14} className="animate-spin text-sky-600" />
                <span>{introUploadProgress}</span>
              </div>
            )}

            {/* PHƯƠNG THỨC 1: TỰ THIẾT KẾ TRỰC QUAN TRONG ADMIN */}
            {introStudioMethod === 'method1_design' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Màu nền chính (Navy)</label>
                    <input
                      type="text"
                      value={introConfig.designConfig?.bgPrimary || '#061A3A'}
                      onChange={(e) =>
                        setIntroConfig((p) => ({
                          ...p,
                          designConfig: { ...(p.designConfig || DEFAULT_DESIGN_CONFIG), bgPrimary: e.target.value },
                        }))
                      }
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Màu ánh sáng tâm (Royal Blue)</label>
                    <input
                      type="text"
                      value={introConfig.designConfig?.bgSecondary || '#0B3B78'}
                      onChange={(e) =>
                        setIntroConfig((p) => ({
                          ...p,
                          designConfig: { ...(p.designConfig || DEFAULT_DESIGN_CONFIG), bgSecondary: e.target.value },
                        }))
                      }
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Kiểu bệ sáng đỡ Logo</label>
                    <select
                      value={introConfig.designConfig?.pedestalStyle || 'pearl_white'}
                      onChange={(e) =>
                        setIntroConfig((p) => ({
                          ...p,
                          designConfig: { ...(p.designConfig || DEFAULT_DESIGN_CONFIG), pedestalStyle: e.target.value as any },
                        }))
                      }
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="pearl_white">Trắng ngọc trai viền Cyan (Tương phản tối đa)</option>
                      <option value="frosted_glass">Kính mờ Frosted Glass</option>
                      <option value="minimal_clear">Tối giản thanh lịch</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Kích thước / Tỷ lệ Logo ({introConfig.designConfig?.logoScalePercent ?? 100}%)
                    </label>
                    <input
                      type="range"
                      min={70}
                      max={130}
                      value={introConfig.designConfig?.logoScalePercent ?? 100}
                      onChange={(e) =>
                        setIntroConfig((p) => ({
                          ...p,
                          designConfig: {
                            ...(p.designConfig || DEFAULT_DESIGN_CONFIG),
                            logoScalePercent: Number(e.target.value),
                          },
                        }))
                      }
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Vị trí dọc của khối Logo ({introConfig.designConfig?.logoOffsetYPercent ?? 0}%)
                    </label>
                    <input
                      type="range"
                      min={-15}
                      max={15}
                      value={introConfig.designConfig?.logoOffsetYPercent ?? 0}
                      onChange={(e) =>
                        setIntroConfig((p) => ({
                          ...p,
                          designConfig: {
                            ...(p.designConfig || DEFAULT_DESIGN_CONFIG),
                            logoOffsetYPercent: Number(e.target.value),
                          },
                        }))
                      }
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Hiệu ứng chuyển động chủ đạo
                    </label>
                    <select
                      value={introConfig.designConfig?.motionPreset || 'refined_scale'}
                      onChange={(e) =>
                        setIntroConfig((p) => ({
                          ...p,
                          designConfig: { ...(p.designConfig || DEFAULT_DESIGN_CONFIG), motionPreset: e.target.value as any },
                        }))
                      }
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="refined_scale">Hội tụ mượt tinh tế (Refined Scale)</option>
                      <option value="gentle_rise">Nâng nhẹ trang trọng (Gentle Rise)</option>
                      <option value="luminous_reveal">Tỏa sáng tuần tự (Luminous Reveal)</option>
                      <option value="minimal_still">Tĩnh tại tối giản (Minimal Still)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Tiêu đề nhận diện chính
                    </label>
                    <input
                      type="text"
                      value={introConfig.designConfig?.headlineText || ''}
                      onChange={(e) =>
                        setIntroConfig((p) => ({
                          ...p,
                          designConfig: { ...(p.designConfig || DEFAULT_DESIGN_CONFIG), headlineText: e.target.value },
                        }))
                      }
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Dòng chữ nhận diện phụ
                    </label>
                    <input
                      type="text"
                      value={introConfig.designConfig?.subtitleText || ''}
                      onChange={(e) =>
                        setIntroConfig((p) => ({
                          ...p,
                          designConfig: { ...(p.designConfig || DEFAULT_DESIGN_CONFIG), subtitleText: e.target.value },
                        }))
                      }
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handleSaveVisualDesignToLibrary(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700"
                  >
                    + Lưu thành Bản nháp trong Thư viện
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveVisualDesignToLibrary(true)}
                    className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold"
                  >
                    Kích hoạt Bản thiết kế này cho Intro
                  </button>
                </div>
              </div>
            )}

            {/* PHƯƠNG THỨC 2: TẢI VIDEO CÓ SẴN LÊN */}
            {introStudioMethod === 'method2_upload' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
                  <div className="text-xs font-extrabold text-slate-900">
                    Bước 1: Chọn tệp Video Intro (MP4/H.264 hoặc WebM, tối đa 50 MB)
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Hệ thống tự động đọc định dạng, thời lượng, độ phân giải và dung lượng thực tế trước khi cho phép kích hoạt.
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#071B3A] hover:bg-slate-800 text-white text-xs font-bold transition">
                      <UploadCloud size={15} />
                      <span>Chọn tệp Video (.mp4 / .webm)</span>
                      <input
                        type="file"
                        accept="video/mp4,video/webm"
                        onChange={handleInspectVideoFile}
                        className="hidden"
                      />
                    </label>
                    <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition">
                      <ImageIcon size={14} />
                      <span>Tải ảnh Poster dự phòng</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handlePosterFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {inspectedVideoMeta && (
                    <div className="rounded-xl border border-sky-200 bg-white p-3.5 space-y-2.5 text-xs">
                      <div className="font-extrabold text-slate-900 flex items-center justify-between">
                        <span className="truncate">{inspectedVideoMeta.name}</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                          Hợp lệ
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                        <div>
                          <span className="text-slate-400 block">Định dạng</span>
                          <b>{inspectedVideoMeta.type}</b>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Thời lượng tệp</span>
                          <b className="text-sky-700">{inspectedVideoMeta.durationSeconds}s</b>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Độ phân giải</span>
                          <b>
                            {inspectedVideoMeta.width}×{inspectedVideoMeta.height}
                          </b>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Dung lượng</span>
                          <b>{formatBytes(inspectedVideoMeta.sizeBytes)}</b>
                        </div>
                      </div>
                      {inspectedVideoMeta.warning && (
                        <div className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-2">
                          {inspectedVideoMeta.warning}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 pt-1">
                        <button
                          type="button"
                          disabled={introUploading}
                          onClick={() => handleUploadInspectedVideo(false)}
                          className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700"
                        >
                          Tải lên làm Bản nháp
                        </button>
                        <button
                          type="button"
                          disabled={introUploading}
                          onClick={() => handleUploadInspectedVideo(true)}
                          className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold"
                        >
                          Tải lên & Kích hoạt ngay
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-900 p-4 flex flex-col items-center justify-center min-h-[220px]">
                  {inspectedVideoMeta?.previewObjectUrl ? (
                    <video
                      src={inspectedVideoMeta.previewObjectUrl}
                      controls
                      muted
                      playsInline
                      className="max-h-52 w-auto rounded-xl border border-slate-700"
                    />
                  ) : (
                    <div className="text-center text-slate-400 text-xs space-y-1">
                      <Video size={28} className="mx-auto text-slate-500 mb-1" />
                      <div className="font-bold text-slate-300">Khung kiểm tra tệp Video trước khi kích hoạt</div>
                      <p className="text-[11px]">
                        Chọn một tệp MP4/WebM ở cột trái để xem trước và đối chiếu thông số kỹ thuật.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PHƯƠNG THỨC 3: KẾT HỢP THIẾT KẾ VÀ TẢI LÊN */}
            {introStudioMethod === 'method3_hybrid' && (
              <div className="rounded-xl border border-sky-200 bg-sky-50/40 p-5 space-y-3">
                <div className="text-xs font-extrabold text-slate-900">
                  Kết hợp Trình thiết kế trực quan trong Admin và Tải lên Video thành phẩm
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Bạn có thể dựng bố cục mẫu ở <strong>Phương thức 1</strong>, sau đó kết xuất trực tiếp thành tệp video chuẩn <code>.webm</code> 10 giây ngay trong trình duyệt (nếu trình duyệt hỗ trợ <code>MediaRecorder</code>) để lưu vào R2; hoặc tải tệp <code>.mp4 (H.264)</code> đã dựng từ phần mềm chuyên dụng bên ngoài lên ở <strong>Phương thức 2</strong>.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  {canRecordCanvasVideo ? (
                    <button
                      type="button"
                      disabled={exportingCanvasVideo || introUploading}
                      onClick={handleExportDesignToWebmAndUpload}
                      className="px-4 py-2.5 rounded-xl bg-[#071B3A] hover:bg-slate-800 text-white text-xs font-bold inline-flex items-center gap-2 disabled:opacity-50"
                    >
                      <Film size={15} />
                      <span>
                        {exportingCanvasVideo
                          ? 'Đang ghi hình 10 giây...'
                          : 'Kết xuất Bản thiết kế thành Video 10s (.webm) & Lưu vào R2'}
                      </span>
                    </button>
                  ) : (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs text-amber-900">
                      Trình duyệt hiện tại không hỗ trợ xuất video trực tiếp qua <code>MediaRecorder</code>. Vui lòng sử dụng <b>Phương thức 2</b> để tải tệp video MP4/H.264 thành phẩm lên.
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setIntroStudioMethod('method2_upload')}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700"
                  >
                    Chuyển sang tải tệp MP4/H.264 thành phẩm →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Hàng 3: Quản lý Thư viện & Phiên bản Intro (Mục 4 Phụ lục bổ sung) */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  4. Thư Viện Video Intro, Poster & Quản Lý Phiên Bản ({(introConfig.library || []).length} phiên bản)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Phân biệt rõ <b>Đang hoạt động (Active)</b>, <b>Bản nháp (Draft)</b> và <b>Bản lưu trữ (Archived)</b>. Không tự động xóa tệp cũ khi thay video mới; khóa xóa an toàn đối với video đang sử dụng.
                </p>
              </div>
              <button
                type="button"
                onClick={syncIntroLibraryFromR2}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 self-start"
              >
                <RefreshCw size={13} />
                <span>Đồng bộ từ kho R2</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                    <th className="py-2.5 px-3">Tên phiên bản / Đường dẫn</th>
                    <th className="py-2.5 px-3">Loại & Định dạng</th>
                    <th className="py-2.5 px-3">Thông số kỹ thuật</th>
                    <th className="py-2.5 px-3">Ngày cập nhật</th>
                    <th className="py-2.5 px-3">Trạng thái</th>
                    <th className="py-2.5 px-3 text-right">Thao tác phiên bản</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(introConfig.library || []).map((item) => {
                    const isActive =
                      item.status === 'active' ||
                      item.url === introConfig.videoUrl ||
                      item.url === introConfig.posterUrl;
                    return (
                      <tr key={item.id} className="hover:bg-sky-50/30">
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{item.name}</div>
                          <div className="font-mono text-[10px] text-slate-400 truncate max-w-xs">{item.url}</div>
                          {item.note && <div className="text-[10px] text-slate-500 mt-0.5">{item.note}</div>}
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-semibold text-slate-700 uppercase text-[11px]">
                            {item.kind === 'video' ? 'Video Intro' : item.kind === 'poster' ? 'Poster' : 'Thiết kế'}
                          </span>
                          <div className="text-[10px] text-slate-400 font-mono">{item.format || '—'}</div>
                        </td>
                        <td className="py-3 px-3 text-[11px] text-slate-600">
                          {item.durationSeconds ? `${item.durationSeconds}s • ` : ''}
                          {item.width && item.height ? `${item.width}×${item.height} • ` : ''}
                          {formatBytes(item.sizeBytes)}
                        </td>
                        <td className="py-3 px-3 text-[11px] text-slate-500">
                          {item.uploadedAt ? new Date(item.uploadedAt).toLocaleDateString('vi-VN') : '—'}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              isActive
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : item.status === 'draft'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {isActive ? 'Đang hoạt động' : item.status === 'draft' ? 'Bản nháp' : 'Lưu trữ'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {!isActive && (
                              <button
                                type="button"
                                onClick={() => handleActivateLibraryItem(item)}
                                className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-[11px] font-bold"
                              >
                                Kích hoạt / Khôi phục
                              </button>
                            )}
                            {isActive && item.kind !== 'poster' && (
                              <button
                                type="button"
                                onClick={() => handleArchiveLibraryItem(item)}
                                className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-[11px] font-semibold"
                              >
                                Lưu trữ
                              </button>
                            )}
                            <button
                              type="button"
                              disabled={isActive || item.id.startsWith('builtin-')}
                              onClick={() => handleDeleteLibraryItem(item)}
                              title={
                                isActive
                                  ? 'Không thể xóa phiên bản đang hoạt động'
                                  : item.id.startsWith('builtin-')
                                  ? 'Bản mặc định hệ thống được bảo vệ'
                                  : 'Xóa phiên bản'
                              }
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 1B: TÙY CHỈNH KÍCH THƯỚC, BỐ CỤC & GIAO DIỆN 10 NHÓM (MỤC VI & VII)   */}
      {/* ========================================================================= */}
      {(activeCenterTab === 'layout-sizing' || activeCenterTab === 'overview') && (
        <section
          id="section-layout-sizing"
          className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-[11px] font-extrabold text-indigo-700 mb-2">
                <Layout size={13} />
                <span>TÙY CHỈNH KÍCH THƯỚC & BỐ CỤC TRONG ADMIN • TƯƠNG THÍCH DESKTOP & MOBILE</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Nhóm 2.2 — Điều Chỉnh Kích Thước, Cỡ Chữ, Khoảng Cách, Số Cột & Bố Cục Biểu Mẫu
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Mọi thông số đều có ngưỡng giới hạn an toàn (Safe Clamping) và tự động co giãn trên màn hình điện thoại để một thay đổi trên Desktop không bao giờ làm vỡ giao diện Mobile.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleRestoreDefaultLayout}
                className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 inline-flex items-center gap-1.5"
              >
                <RotateCcw size={14} />
                <span>Khôi phục cấu hình mặc định</span>
              </button>
              <button
                type="button"
                onClick={handleSaveLayoutAndDesignSystem}
                className="px-5 py-2 rounded-xl bg-[#0B66C3] hover:bg-sky-700 text-white text-xs font-extrabold shadow-xs inline-flex items-center gap-1.5"
              >
                <Save size={15} />
                <span>Áp dụng Kích thước & Bố cục</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-5">
              {/* 1. Logo, Header & Khoảng cách điều hướng */}
              <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  1. Kích thước Logo, Chiều cao Header & Khoảng cách Menu
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Cao Logo Desktop ({designSystem.logoHeightDesktopPx ?? 48}px)
                    </label>
                    <input
                      type="number"
                      min={32}
                      max={84}
                      value={designSystem.logoHeightDesktopPx ?? 48}
                      onChange={(e) =>
                        setDesignSystem((p) => ({ ...p, logoHeightDesktopPx: Number(e.target.value || 48) }))
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Cao Logo Mobile ({designSystem.logoHeightMobilePx ?? 38}px)
                    </label>
                    <input
                      type="number"
                      min={28}
                      max={56}
                      value={designSystem.logoHeightMobilePx ?? 38}
                      onChange={(e) =>
                        setDesignSystem((p) => ({ ...p, logoHeightMobilePx: Number(e.target.value || 38) }))
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Chiều cao Header ({designSystem.headerHeightPx ?? 80}px)
                    </label>
                    <input
                      type="number"
                      min={64}
                      max={112}
                      value={designSystem.headerHeightPx ?? 80}
                      onChange={(e) =>
                        setDesignSystem((p) => ({ ...p, headerHeightPx: Number(e.target.value || 80) }))
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Khoảng cách mục Menu ({designSystem.navItemGapPx ?? 6}px)
                    </label>
                    <input
                      type="number"
                      min={2}
                      max={20}
                      value={designSystem.navItemGapPx ?? 6}
                      onChange={(e) =>
                        setDesignSystem((p) => ({ ...p, navItemGapPx: Number(e.target.value || 6) }))
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>
              </div>

              {/* 2 & 3. Vùng nội dung, Cỡ chữ & Khoảng cách dòng/khối */}
              <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  2. Chiều rộng Nội dung, Cỡ chữ (Tiêu đề, Sapo, Nội dung) & Khoảng cách Dòng/Khối
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Rộng tối đa Container (px)
                    </label>
                    <input
                      type="number"
                      min={1024}
                      max={1440}
                      step={16}
                      value={designSystem.containerMaxWidthPx ?? 1280}
                      onChange={(e) =>
                        setDesignSystem((p) => ({
                          ...p,
                          containerMaxWidthPx: Number(e.target.value || 1280),
                          container: `${Number(e.target.value || 1280)}px`,
                        }))
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Tỷ lệ chữ Tiêu đề ({Math.round((designSystem.headingScale ?? 1) * 100)}%)
                    </label>
                    <input
                      type="number"
                      min={0.85}
                      max={1.25}
                      step={0.05}
                      value={designSystem.headingScale ?? 1.0}
                      onChange={(e) =>
                        setDesignSystem((p) => ({ ...p, headingScale: Number(e.target.value || 1.0) }))
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Cỡ chữ Đoạn dẫn Sapo ({designSystem.leadFontSizePx ?? 18}px)
                    </label>
                    <input
                      type="number"
                      min={15}
                      max={22}
                      value={designSystem.leadFontSizePx ?? 18}
                      onChange={(e) =>
                        setDesignSystem((p) => ({ ...p, leadFontSizePx: Number(e.target.value || 18) }))
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Cỡ chữ Nội dung ({designSystem.bodyFontSizePx ?? 16}px)
                    </label>
                    <input
                      type="number"
                      min={14}
                      max={19}
                      value={designSystem.bodyFontSizePx ?? 16}
                      onChange={(e) =>
                        setDesignSystem((p) => ({ ...p, bodyFontSizePx: Number(e.target.value || 16) }))
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Cỡ chữ Chú thích ({designSystem.captionFontSizePx ?? 13}px)
                    </label>
                    <input
                      type="number"
                      min={11}
                      max={15}
                      value={designSystem.captionFontSizePx ?? 13}
                      onChange={(e) =>
                        setDesignSystem((p) => ({ ...p, captionFontSizePx: Number(e.target.value || 13) }))
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Khoảng cách dòng ({designSystem.lineHeight ?? 1.65})
                    </label>
                    <input
                      type="number"
                      min={1.4}
                      max={1.95}
                      step={0.05}
                      value={designSystem.lineHeight ?? 1.65}
                      onChange={(e) =>
                        setDesignSystem((p) => ({ ...p, lineHeight: Number(e.target.value || 1.65) }))
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Khoảng cách đoạn ({designSystem.paragraphGapPx ?? 16}px)
                    </label>
                    <input
                      type="number"
                      min={8}
                      max={32}
                      value={designSystem.paragraphGapPx ?? 16}
                      onChange={(e) =>
                        setDesignSystem((p) => ({ ...p, paragraphGapPx: Number(e.target.value || 16) }))
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Khoảng cách khối ({designSystem.sectionGapPx ?? 64}px)
                    </label>
                    <input
                      type="number"
                      min={32}
                      max={112}
                      step={4}
                      value={designSystem.sectionGapPx ?? 64}
                      onChange={(e) =>
                        setDesignSystem((p) => ({ ...p, sectionGapPx: Number(e.target.value || 64) }))
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Hình ảnh, Số cột Trang chủ & Biểu mẫu (Forms) */}
              <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  3. Tỷ lệ Hình ảnh, Số cột Trang chủ & Kích thước Biểu mẫu (Forms)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Cách hiển thị ảnh mặc định</label>
                    <select
                      value={designSystem.defaultImageDisplay || 'original'}
                      onChange={(e) =>
                        setDesignSystem((p) => ({ ...p, defaultImageDisplay: e.target.value as any }))
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="original">Nguyên bản (Không cắt ảnh)</option>
                      <option value="contain">Vừa khung (Contain)</option>
                      <option value="cover">Phủ khung (Cover)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Số cột Tin tức (Desktop)</label>
                    <select
                      value={designSystem.homeNewsColumns ?? 3}
                      onChange={(e) =>
                        setDesignSystem((p) => ({ ...p, homeNewsColumns: Number(e.target.value) as 2 | 3 }))
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value={3}>3 cột chuẩn báo chí</option>
                      <option value={2}>2 cột rộng</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Số cột Chương trình</label>
                    <select
                      value={designSystem.homeProgramsColumns ?? 3}
                      onChange={(e) =>
                        setDesignSystem((p) => ({ ...p, homeProgramsColumns: Number(e.target.value) as 2 | 3 }))
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value={3}>3 cột</option>
                      <option value={2}>2 cột rộng</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Số cột Trụ cột hoạt động</label>
                    <select
                      value={designSystem.homePillarsColumns ?? 5}
                      onChange={(e) =>
                        setDesignSystem((p) => ({ ...p, homePillarsColumns: Number(e.target.value) as 3 | 5 }))
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value={5}>5 cột ngang</option>
                      <option value={3}>3 cột lớn</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Rộng tối đa Form ({designSystem.formMaxWidthPx ?? 768}px)
                    </label>
                    <input
                      type="number"
                      min={520}
                      max={980}
                      step={16}
                      value={designSystem.formMaxWidthPx ?? 768}
                      onChange={(e) =>
                        setDesignSystem((p) => ({ ...p, formMaxWidthPx: Number(e.target.value || 768) }))
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Cao ô nhập Form ({designSystem.formInputHeightPx ?? 46}px)
                    </label>
                    <input
                      type="number"
                      min={40}
                      max={56}
                      value={designSystem.formInputHeightPx ?? 46}
                      onChange={(e) =>
                        setDesignSystem((p) => ({ ...p, formInputHeightPx: Number(e.target.value || 46) }))
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Khoảng cách trường Form ({designSystem.formFieldGapPx ?? 16}px)
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={28}
                      value={designSystem.formFieldGapPx ?? 16}
                      onChange={(e) =>
                        setDesignSystem((p) => ({ ...p, formFieldGapPx: Number(e.target.value || 16) }))
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Bố cục trường Form</label>
                    <select
                      value={designSystem.formLayoutMode || 'single'}
                      onChange={(e) =>
                        setDesignSystem((p) => ({ ...p, formLayoutMode: e.target.value as any }))
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="single">1 cột chuẩn (Tương thích cao)</option>
                      <option value="two_column">2 cột cho trường ngắn trên Desktop</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={designSystem.showOfficialPortalBar !== false}
                      onChange={(e) =>
                        setDesignSystem((p) => ({ ...p, showOfficialPortalBar: e.target.checked }))
                      }
                    />
                    <span>
                      Hiển thị Thanh Cổng Thông Tin Chính Thống trên đỉnh Header (Ngày tháng, Tra cứu văn bản, Thông báo chính thức — chuẩn Cổng TTĐT)
                    </span>
                  </label>
                </div>
              </div>

              {/* 5. Thứ tự & Hiển thị các khối Module trên Trang chủ */}
              <div className="rounded-2xl border border-slate-200 p-4 space-y-2.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  4. Thứ tự, Vị trí & Trạng thái hiển thị các Module Trang chủ
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {homeSectionOrder.map((key, idx) => (
                    <div
                      key={key}
                      className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs"
                    >
                      <label className="inline-flex items-center gap-2 font-bold text-slate-800 cursor-pointer truncate">
                        <input
                          type="checkbox"
                          checked={homeSections[key] !== false}
                          onChange={(e) =>
                            setHomeSections((prev) => ({ ...prev, [key]: e.target.checked }))
                          }
                        />
                        <span className="truncate">
                          {idx + 1}. {SECTION_LABELS[key] || key}
                        </span>
                      </label>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveHomeSection(key, -1)}
                          className="px-1.5 py-0.5 rounded border border-slate-300 bg-white text-[10px] font-bold disabled:opacity-30"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          disabled={idx === homeSectionOrder.length - 1}
                          onClick={() => moveHomeSection(key, 1)}
                          className="px-1.5 py-0.5 rounded border border-slate-300 bg-white text-[10px] font-bold disabled:opacity-30"
                        >
                          ↓
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Khung xem trước trực tiếp Tùy chỉnh Kích thước & Bố cục */}
            <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Layers size={15} className="text-sky-600" />
                  <span>Xem Trước Tỷ Lệ Giao Diện & Biểu Mẫu</span>
                </h4>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setLayoutPreviewDevice('desktop')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                      layoutPreviewDevice === 'desktop'
                        ? 'bg-[#071B3A] text-white'
                        : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                  >
                    Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setLayoutPreviewDevice('mobile')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                      layoutPreviewDevice === 'mobile'
                        ? 'bg-[#071B3A] text-white'
                        : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                  >
                    Mobile (390px)
                  </button>
                </div>
              </div>

              <div className="flex justify-center bg-slate-200/70 rounded-2xl p-3">
                <div
                  className={`bg-white rounded-2xl border border-slate-300 shadow-md overflow-hidden transition-all ${
                    layoutPreviewDevice === 'mobile' ? 'w-[350px]' : 'w-full'
                  }`}
                >
                  {/* Preview Header */}
                  <div
                    style={{
                      minHeight:
                        layoutPreviewDevice === 'mobile'
                          ? 60
                          : Math.min(96, designSystem.headerHeightPx || 80),
                    }}
                    className="px-4 py-2.5 border-b border-slate-200 flex items-center justify-between bg-white"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={logoUrl || '/brand/sky-first-network-web.png'}
                        alt="Logo"
                        style={{
                          height:
                            layoutPreviewDevice === 'mobile'
                              ? designSystem.logoHeightMobilePx || 38
                              : Math.min(64, designSystem.logoHeightDesktopPx || 48),
                        }}
                        className="w-auto object-contain"
                      />
                      <span className="font-black text-xs text-slate-900 truncate max-w-[160px]">
                        {siteName}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                      Menu ({designSystem.navItemGapPx ?? 6}px)
                    </span>
                  </div>

                  {/* Preview Typography & Content Card */}
                  <div className="p-4 space-y-3">
                    <div
                      style={{
                        fontSize: `${Math.round(18 * (designSystem.headingScale || 1))}px`,
                      }}
                      className="font-black text-slate-900 leading-snug"
                    >
                      Tiêu đề mẫu theo tỷ lệ {Math.round((designSystem.headingScale || 1) * 100)}%
                    </div>
                    <p
                      style={{
                        fontSize: `${Math.min(16, designSystem.leadFontSizePx || 18)}px`,
                        lineHeight: designSystem.lineHeight || 1.65,
                      }}
                      className="font-semibold text-slate-700"
                    >
                      (SkyFirst.io.vn) - Đoạn dẫn Sapo cỡ {designSystem.leadFontSizePx || 18}px, giãn dòng {designSystem.lineHeight || 1.65}.
                    </p>
                    <div
                      className={`grid gap-2 ${
                        layoutPreviewDevice === 'mobile'
                          ? 'grid-cols-1'
                          : (designSystem.homeNewsColumns || 3) === 2
                          ? 'grid-cols-2'
                          : 'grid-cols-3'
                      }`}
                    >
                      {[1, 2, 3].slice(0, layoutPreviewDevice === 'mobile' ? 2 : designSystem.homeNewsColumns || 3).map((n) => (
                        <div key={n} className="rounded-xl border border-slate-200 p-2.5 bg-slate-50">
                          <div className="text-[10px] font-bold text-sky-700">Cột {n}</div>
                          <div className="text-[11px] font-semibold text-slate-800">Thẻ nội dung</div>
                        </div>
                      ))}
                    </div>

                    {/* Preview Form */}
                    <div
                      style={{ gap: `${Math.min(20, designSystem.formFieldGapPx || 16)}px` }}
                      className="rounded-xl border border-sky-200 bg-sky-50/40 p-3 flex flex-col"
                    >
                      <div className="text-[11px] font-extrabold text-slate-900">
                        Xem trước Biểu mẫu ({designSystem.formMaxWidthPx || 768}px • Cao ô {designSystem.formInputHeightPx || 46}px)
                      </div>
                      <input
                        type="text"
                        readOnly
                        value="Trường nhập liệu không bao giờ bị cắt chữ"
                        style={{ height: `${designSystem.formInputHeightPx || 46}px` }}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-700"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-[11px] text-emerald-900">
                <b>Bảo vệ giao diện Mobile tự động:</b> Trên màn hình <code>&lt; 768px</code>, hệ thống tự động chuyển lưới nhiều cột về 1 cột dọc, giới hạn chiều rộng <code>100%</code> và giữ nút bấm tối thiểu <code>44px</code>.
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: RESEND API, MẪU EMAIL HTML & HÀNG ĐỢI OUTBOX (MỤC IV)               */}
      {/* ========================================================================= */}
      {(activeCenterTab === 'email-outbox' || activeCenterTab === 'overview') && (
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Mail className="text-sky-600" size={18} />
                <span>Nhóm 2.9 — Tích Hợp Resend API, Kiểm Thử An Toàn & Hàng Đợi Outbox</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Khóa bí mật <code>RESEND_API_KEY</code> chỉ lưu trong Secrets môi trường máy chủ (không bao giờ nhập hoặc hiển thị khóa trên trình duyệt). Hỗ trợ gửi HTML + Text kèm <code>Idempotency-Key</code> chống gửi trùng.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={domainCheckBusy}
                onClick={handleCheckResendDomain}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sky-200 bg-sky-50 text-xs font-bold text-sky-800 hover:bg-sky-100"
              >
                <ShieldCheck size={14} />
                <span>{domainCheckBusy ? 'Đang kiểm tra...' : 'Kiểm tra tên miền Resend'}</span>
              </button>
              <button
                type="button"
                onClick={loadOutbox}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                <RefreshCw size={13} className={outboxLoading ? 'animate-spin' : ''} />
                <span>Làm mới Outbox ({outboxItems.length})</span>
              </button>
            </div>
          </div>

          {/* Thanh trạng thái cấu hình Resend API từ phía máy chủ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-xs space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Biến môi trường RESEND_API_KEY</span>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    serverSecretsStatus.resendConfigured ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
                <b className="text-slate-900">
                  {serverSecretsStatus.resendConfigured
                    ? 'Đã cấu hình trong Secrets máy chủ'
                    : 'Chưa cấu hình trên máy chủ (Chế độ Outbox an toàn)'}
                </b>
              </div>
              <p className="text-[10px] text-slate-500">
                Cài đặt qua lệnh: <code>wrangler pages secret put RESEND_API_KEY</code>
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-xs space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Địa chỉ gửi (MAIL_FROM) & Tên miền</span>
              <div className="font-mono font-bold text-slate-900 truncate">
                {serverSecretsStatus.mailFromValue}
              </div>
              <p className="text-[10px] text-slate-500">
                {serverSecretsStatus.domainDetail ||
                  'Tên miền skyfirst.io.vn cần xác minh bản ghi SPF/DKIM trong Resend Dashboard.'}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-xs space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Thống kê Hàng đợi Outbox</span>
              <div className="flex flex-wrap gap-2 font-bold">
                <span className="text-emerald-700">
                  Đã gửi: {(outboxSummary.accepted_by_provider || 0) + (outboxSummary.sent || 0)}
                </span>
                <span className="text-amber-700">
                  Chờ/Thử lại: {(outboxSummary.queued || 0) + (outboxSummary.retry_scheduled || 0) + (outboxSummary.unconfigured || 0)}
                </span>
                <span className="text-rose-700">
                  Lỗi: {(outboxSummary.perm_failed || 0) + (outboxSummary.rejected || 0) + (outboxSummary.invalid_config || 0)}
                </span>
              </div>
              <p className="text-[10px] text-slate-500">
                Lỗi gửi email không bao giờ làm mất đơn đăng ký hoặc báo thành công giả.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cấu hình dịch vụ & người gửi */}
            <div className="space-y-4 rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  1. Cấu hình Người gửi, Luồng thông báo & Chế độ Thử nghiệm
                </h4>
                <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailSettings.enabled !== false}
                    onChange={(e) => setEmailSettings((p) => ({ ...p, enabled: e.target.checked }))}
                  />
                  <span>Bật luồng gửi Email</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Nhà cung cấp dịch vụ</label>
                  <select
                    value={emailSettings.provider || 'resend'}
                    onChange={(e) => setEmailSettings((p) => ({ ...p, provider: e.target.value as any }))}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold"
                  >
                    <option value="resend">Resend API (Khuyến nghị)</option>
                    <option value="none">Tạm dừng gửi ra ngoài (Chỉ lưu Outbox)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Chế độ vận hành (Chống gửi nhầm người thật)
                  </label>
                  <select
                    value={emailSettings.mode || 'live'}
                    onChange={(e) => setEmailSettings((p) => ({ ...p, mode: e.target.value as any }))}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold"
                  >
                    <option value="live">Chế độ Thật (Live — Gửi tới người nhận thực tế)</option>
                    <option value="test">Chế độ Thử nghiệm an toàn (Chuyển hướng về hộp thư test)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Tên người gửi (Sender Name)</label>
                  <input
                    type="text"
                    value={emailSettings.senderName || ''}
                    onChange={(e) => setEmailSettings((p) => ({ ...p, senderName: e.target.value }))}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Email gửi đi (Sender Email)</label>
                  <input
                    type="email"
                    value={emailSettings.senderEmail || ''}
                    onChange={(e) => setEmailSettings((p) => ({ ...p, senderEmail: e.target.value }))}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Địa chỉ Reply-To</label>
                  <input
                    type="email"
                    value={emailSettings.replyToEmail || ''}
                    onChange={(e) => setEmailSettings((p) => ({ ...p, replyToEmail: e.target.value }))}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Email nhận thông báo quản trị</label>
                  <input
                    type="text"
                    value={emailSettings.adminRecipientEmails || ''}
                    onChange={(e) => setEmailSettings((p) => ({ ...p, adminRecipientEmails: e.target.value }))}
                    placeholder="lienhe@skyfirst.io.vn, nhansu@skyfirst.io.vn"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailSettings.sendOnProgramRegistration !== false}
                    onChange={(e) =>
                      setEmailSettings((p) => ({ ...p, sendOnProgramRegistration: e.target.checked }))
                    }
                  />
                  <span>Gửi email xác nhận cho ứng viên đăng ký</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailSettings.sendAdminAlertOnRegistration !== false}
                    onChange={(e) =>
                      setEmailSettings((p) => ({ ...p, sendAdminAlertOnRegistration: e.target.checked }))
                    }
                  />
                  <span>Báo cho Admin khi có hồ sơ đăng ký mới</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailSettings.sendOnContactSubmission !== false}
                    onChange={(e) =>
                      setEmailSettings((p) => ({ ...p, sendOnContactSubmission: e.target.checked }))
                    }
                  />
                  <span>Gửi thông báo khi có liên hệ mới tại /contact</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(emailSettings.sendOnStatusChange)}
                    onChange={(e) =>
                      setEmailSettings((p) => ({ ...p, sendOnStatusChange: e.target.checked }))
                    }
                  />
                  <span>Gửi email khi duyệt hồ sơ ứng viên</span>
                </label>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSaveEmailConfig}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5"
                >
                  <Save size={14} />
                  <span>Lưu cấu hình Email</span>
                </button>
                <div className="flex items-center gap-1.5">
                  <input
                    type="email"
                    value={testEmailRecipient}
                    onChange={(e) => setTestEmailRecipient(e.target.value)}
                    placeholder="delivered@resend.dev"
                    className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono w-48"
                  />
                  <button
                    type="button"
                    onClick={handleSendTestEmail}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg inline-flex items-center gap-1"
                  >
                    <Send size={12} />
                    <span>Gửi email thử</span>
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                Mẹo kiểm thử an toàn: Sử dụng địa chỉ <code>delivered@resend.dev</code> của Resend để kiểm tra luồng gửi thực tế mà không gửi nhầm tới hộp thư người dùng thật.
              </p>
            </div>

            {/* Xem trước mẫu Email với danh sách biến an toàn */}
            <div className="space-y-3 rounded-2xl border border-slate-200 p-5 bg-slate-50/50">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                2. Kiểm tra & Xem trước Mẫu Email HTML + Text (Không gửi thật)
              </h4>
              <p className="text-[11px] text-slate-500">
                Chỉ chấp nhận các biến an toàn: <code>{'{{site_name}}'}</code>,{' '}
                <code>{'{{program_title}}'}</code>, <code>{'{{applicant_name}}'}</code>,{' '}
                <code>{'{{applicant_email}}'}</code>, <code>{'{{submission_id}}'}</code>,{' '}
                <code>{'{{submitted_at}}'}</code>, <code>{'{{contact_email}}'}</code>.
              </p>
              <input
                type="text"
                value={previewSubject}
                onChange={(e) => setPreviewSubject(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold"
              />
              <textarea
                rows={4}
                value={previewBody}
                onChange={(e) => setPreviewBody(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white"
              />
              <button
                type="button"
                onClick={handlePreviewEmail}
                className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-xs font-bold rounded-xl"
              >
                Xem trước nội dung kết xuất (HTML & Text)
              </button>
              {previewResult && (
                <div className="rounded-xl border border-sky-200 bg-white p-3.5 text-xs space-y-1.5">
                  <div className="font-bold text-slate-900">Tiêu đề: {previewResult.subject}</div>
                  <pre className="whitespace-pre-wrap font-sans text-slate-700 text-[11px] leading-relaxed">
                    {previewResult.body}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Bảng Hàng Đợi Email Outbox */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
              3. Hàng đợi Email & Nhật ký trạng thái (website_email_outbox)
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                    <th className="py-2.5 px-3">Sự kiện / Idempotency</th>
                    <th className="py-2.5 px-3">Người nhận</th>
                    <th className="py-2.5 px-3">Tiêu đề</th>
                    <th className="py-2.5 px-3">Trạng thái</th>
                    <th className="py-2.5 px-3">Chi tiết / Mã Resend</th>
                    <th className="py-2.5 px-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {outboxItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-400">
                        Chưa có bản ghi nào trong hàng đợi Email Outbox.
                      </td>
                    </tr>
                  ) : (
                    outboxItems.slice(0, 15).map((item) => (
                      <tr key={item.id}>
                        <td className="py-2.5 px-3">
                          <div className="font-mono text-[11px] font-semibold">{item.event_type}</div>
                          <div className="font-mono text-[10px] text-slate-400 truncate max-w-[150px]">
                            {item.idempotency_key || item.id}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 font-mono">{item.recipient_email}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">{item.subject}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              item.status === 'sent' || item.status === 'accepted_by_provider'
                                ? 'bg-emerald-50 text-emerald-700'
                                : item.status === 'perm_failed' || item.status === 'rejected' || item.status === 'invalid_config'
                                ? 'bg-rose-50 text-rose-700'
                                : 'bg-amber-50 text-amber-800'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-[11px] text-slate-500">
                          {item.last_error || (item.provider_id ? `Resend ID: ${item.provider_id}` : '—')}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleRetryOutboxItem(item.id)}
                            className="text-[11px] font-bold text-sky-600 hover:underline"
                          >
                            Thử lại ({item.attempts || 0}/{item.max_attempts || 3})
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: TỰ ĐỘNG HÓA & SEO / SITEMAP                                         */}
      {/* ========================================================================= */}
      {(activeCenterTab === 'automation-seo' || activeCenterTab === 'overview') && (
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="text-sky-600" size={18} />
                <span>Nhóm 2.10 & 2.12 — Tự Động Hóa Vận Hành & Cấu Hình SEO / Sitemap</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Hẹn giờ xuất bản bài viết/chương trình, tự động đóng form khi qua hạn `closeAt`, tự tạo Redirect 301 khi đổi slug và đồng bộ `sitemap.xml`.
              </p>
            </div>
            <button
              type="button"
              onClick={handleRunAutomationsNow}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#071B3A] text-white text-xs font-bold hover:bg-slate-800"
            >
              <Play size={14} />
              <span>Chạy kiểm tra tự động hóa ngay</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-200 p-5 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                Quy tắc Tự động hóa (Idempotent & Ghi nhật ký)
              </h4>
              {[
                {
                  key: 'enableScheduledPublishing',
                  label: 'Tự động xuất bản bài viết, trang, chương trình khi đến giờ hẹn (scheduledAt)',
                },
                {
                  key: 'enableAutoCloseExpiredForms',
                  label: 'Tự động đóng biểu mẫu đăng ký khi qua hạn đóng đơn (closeAt)',
                },
                {
                  key: 'enableAutoRedirectOnSlugChange',
                  label: 'Tự động tạo bản ghi Redirect 301 khi đổi đường dẫn (slug) nội dung đã xuất bản',
                },
                {
                  key: 'enableAutoSitemapUpdate',
                  label: 'Tự động cập nhật sitemap.xml (chỉ gồm trang công khai, loại trừ bản nháp & noIndex)',
                },
                {
                  key: 'enableAutoEndedProgramBadge',
                  label: 'Tự động hiển thị trạng thái Đã kết thúc khi chương trình qua hạn kết thúc',
                },
              ].map((rule) => (
                <label key={rule.key} className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean((automationSettings as any)[rule.key])}
                    onChange={(e) =>
                      setAutomationSettings((p) => ({ ...p, [rule.key]: e.target.checked }))
                    }
                    className="mt-0.5"
                  />
                  <span className="font-medium">{rule.label}</span>
                </label>
              ))}
            </div>

            <div className="rounded-2xl border border-slate-200 p-5 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                Cấu hình SEO Mặc định & Chia sẻ Mạng xã hội
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Mẫu tiêu đề (Title Template)</label>
                  <input
                    type="text"
                    value={seoSettings.titleTemplate || ''}
                    onChange={(e) => setSeoSettings((p) => ({ ...p, titleTemplate: e.target.value }))}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Canonical Domain</label>
                  <input
                    type="text"
                    value={seoSettings.canonicalDomain || ''}
                    onChange={(e) => setSeoSettings((p) => ({ ...p, canonicalDomain: e.target.value }))}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Mô tả Meta mặc định</label>
                <textarea
                  rows={2}
                  value={seoSettings.defaultDescription || ''}
                  onChange={(e) => setSeoSettings((p) => ({ ...p, defaultDescription: e.target.value }))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                />
              </div>
              <button
                type="button"
                onClick={handleSaveAutomationAndSeo}
                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5"
              >
                <Save size={14} />
                <span>Lưu Tự Động Hóa & SEO</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: THỐNG KÊ TRUY CẬP TỰ ĐỘNG & SỐ LIỆU THỦ CÔNG                        */}
      {/* ========================================================================= */}
      {(activeCenterTab === 'analytics' || activeCenterTab === 'overview') && (
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="text-sky-600" size={18} />
                <span>Nhóm 2.13 — Thống Kê Truy Cập Tự Động & Số Liệu Nhập Thủ Công</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Tách bạch minh bạch giữa <strong>Số đếm tự động</strong> (loại trừ bot và <code>/admin</code>) và <strong>Số liệu nhập thủ công</strong> (có nguồn, ngày, ghi chú và người nhập).
              </p>
            </div>
            <button
              type="button"
              onClick={loadAnalytics}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              <RefreshCw size={13} />
              <span>Cập nhật số liệu</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 rounded-2xl border border-sky-200 bg-sky-50/30 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-sky-900">
                  1. Lượt xem ghi nhận tự động (Auto Pageviews)
                </span>
                <span className="px-3 py-1 rounded-full bg-sky-600 text-white text-xs font-black">
                  Tổng: {analyticsData.totalAutoViews} lượt xem
                </span>
              </div>
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-600">Trang / Bài viết được xem nhiều nhất:</div>
                {analyticsData.byPage.length === 0 ? (
                  <p className="text-xs text-slate-400">Chưa có lượt truy cập tự động nào được ghi nhận.</p>
                ) : (
                  <div className="divide-y divide-slate-200/70 rounded-xl border border-slate-200 bg-white">
                    {analyticsData.byPage.slice(0, 6).map((row, idx) => (
                      <div key={idx} className="flex items-center justify-between px-3.5 py-2 text-xs">
                        <span className="font-mono text-slate-700 truncate">{row.path}</span>
                        <span className="font-black text-sky-700">{row.views} lượt</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-6 rounded-2xl border border-slate-200 p-5 space-y-4">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 block">
                2. Bổ sung số liệu thống kê thủ công (Có kiểm chứng nguồn)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input
                  type="text"
                  value={manualLabel}
                  onChange={(e) => setManualLabel(e.target.value)}
                  placeholder="Tên chỉ số (vd: Người tham dự sự kiện Offline)"
                  className="text-xs px-3 py-2 rounded-xl border border-slate-300"
                />
                <input
                  type="number"
                  value={manualValue}
                  onChange={(e) => setManualValue(e.target.value)}
                  placeholder="Giá trị số (vd: 450)"
                  className="text-xs px-3 py-2 rounded-xl border border-slate-300"
                />
                <input
                  type="text"
                  value={manualSource}
                  onChange={(e) => setManualSource(e.target.value)}
                  placeholder="Nguồn đối chiếu (vd: Danh sách điểm danh BTC)"
                  className="text-xs px-3 py-2 rounded-xl border border-slate-300"
                />
                <input
                  type="date"
                  value={manualDate}
                  onChange={(e) => setManualDate(e.target.value)}
                  className="text-xs px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualNote}
                  onChange={(e) => setManualNote(e.target.value)}
                  placeholder="Ghi chú minh bạch..."
                  className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-300"
                />
                <button
                  type="button"
                  onClick={handleAddManualAnalytics}
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl shrink-0"
                >
                  + Lưu số liệu
                </button>
              </div>

              {analyticsData.manualEntries.length > 0 && (
                <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 max-h-44 overflow-y-auto">
                  {analyticsData.manualEntries.map((m) => (
                    <div key={m.id} className="p-2.5 text-xs flex items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-slate-900">
                          {m.metric_label}: <span className="text-emerald-700">{m.metric_value}</span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Nguồn: {m.source || '—'} • Ngày: {m.recorded_date} • Nhập bởi: {m.created_by}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteManualAnalytics(m.id)}
                        className="text-rose-600 hover:underline text-[11px] font-bold"
                      >
                        Xóa
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: SAO LƯU & KHÔI PHỤC DỮ LIỆU SHA-256                                 */}
      {/* ========================================================================= */}
      {(activeCenterTab === 'backup' || activeCenterTab === 'overview') && (
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Archive className="text-sky-600" size={18} />
                <span>Nhóm 2.16 — Sao Lưu Toàn Diện (SHA-256) & Khôi Phục An Toàn</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Mỗi bản sao lưu bao gồm cấu hình, trang, bài viết, chương trình, đơn vị và biểu mẫu kèm mã kiểm tra toàn vẹn SHA-256.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={backupLabel}
                onChange={(e) => setBackupLabel(e.target.value)}
                placeholder="Nhãn bản sao lưu (tùy chọn)..."
                className="text-xs px-3 py-2 rounded-xl border border-slate-300 w-56"
              />
              <button
                type="button"
                disabled={backupBusy}
                onClick={handleCreateBackup}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shrink-0"
              >
                + Tạo bản sao lưu ngay
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                  <th className="py-2.5 px-4">Tên bản sao lưu</th>
                  <th className="py-2.5 px-4">Mã toàn vẹn SHA-256</th>
                  <th className="py-2.5 px-4">Dung lượng</th>
                  <th className="py-2.5 px-4">Người tạo / Thời gian</th>
                  <th className="py-2.5 px-4 text-right">Khôi phục</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {backups.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400">
                      Chưa có bản sao lưu nào. Hãy bấm "+ Tạo bản sao lưu ngay" để lưu điểm khôi phục đầu tiên.
                    </td>
                  </tr>
                ) : (
                  backups.map((b) => (
                    <tr key={b.id}>
                      <td className="py-3 px-4 font-bold text-slate-900">{b.label}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                        {String(b.sha256 || '').slice(0, 18)}…
                      </td>
                      <td className="py-3 px-4">{Math.round(Number(b.size_bytes || 0) / 1024)} KB</td>
                      <td className="py-3 px-4 text-[11px] text-slate-500">
                        {b.created_by} • {new Date(b.created_at).toLocaleString('vi-VN')}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setRestoreConfirmId(b.id);
                            setRestoreConfirmText('');
                          }}
                          className="px-3 py-1 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 font-bold text-[11px] hover:bg-amber-100"
                        >
                          Khôi phục bản này
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {restoreConfirmId && (
            <div className="rounded-2xl border border-rose-300 bg-rose-50/70 p-4 space-y-3">
              <div className="text-xs font-bold text-rose-900">
                Xác nhận khôi phục bản sao lưu <code>{restoreConfirmId}</code>: Vui lòng nhập chính xác cụm từ{' '}
                <code className="bg-white px-1.5 py-0.5 rounded border border-rose-300">KHOI_PHUC_DU_LIEU</code> để xác nhận.
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={restoreConfirmText}
                  onChange={(e) => setRestoreConfirmText(e.target.value)}
                  placeholder="Nhập KHOI_PHUC_DU_LIEU"
                  className="text-xs px-3 py-2 rounded-xl border border-rose-300 bg-white font-mono"
                />
                <button
                  type="button"
                  disabled={backupBusy || restoreConfirmText.trim() !== 'KHOI_PHUC_DU_LIEU'}
                  onClick={handleConfirmRestoreBackup}
                  className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl disabled:opacity-50"
                >
                  Xác nhận khôi phục
                </button>
                <button
                  type="button"
                  onClick={() => setRestoreConfirmId(null)}
                  className="px-3 py-2 text-xs font-bold text-slate-600"
                >
                  Hủy
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: TÀI KHOẢN & PHÂN QUYỀN CHI TIẾT (NHÓM 2.15)                        */}
      {/* ========================================================================= */}
      {(activeCenterTab === 'users' || activeCenterTab === 'overview') && (
        <section
          id="section-users"
          className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="text-sky-600" size={18} />
                <span>Nhóm 2.15 — Tài Khoản Quản Trị & Phân Quyền Chi Tiết (RBAC + Capabilities)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Quản lý tài khoản theo phân cấp <strong>Chủ sở hữu hệ thống → Lập trình viên → Quản trị viên → Biên tập viên</strong> kèm quyền chi tiết kiểm tra ở cả Giao diện và API Máy chủ.
              </p>
            </div>

            <button
              type="button"
              id="btn-add-admin-user"
              onClick={handleOpenAddUser}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition shrink-0"
            >
              <Plus size={16} />
              <span>Thêm tài khoản quản trị</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Tìm theo email hoặc Họ tên..."
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {(['all', 'admin', 'developer', 'editor'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRoleFilter(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                    roleFilter === r
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                  }`}
                >
                  {r === 'all'
                    ? `Tất cả (${adminUsers.length})`
                    : r === 'admin'
                    ? 'Quản trị viên'
                    : r === 'developer'
                    ? 'Lập trình viên'
                    : 'Biên tập viên'}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 shadow-2xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Email quản trị</th>
                  <th className="py-3 px-4">Họ tên / Nhiệm vụ</th>
                  <th className="py-3 px-4">Vai trò & Quyền chi tiết</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      {adminUsersLoading ? 'Đang tải danh sách tài khoản...' : 'Không tìm thấy tài khoản quản trị phù hợp.'}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-sky-50/30 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{user.email}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{user.name}</div>
                        {user.note && <div className="text-[10px] text-slate-400">{user.note}</div>}
                      </td>
                      <td className="py-3.5 px-4">
                        {user.is_root_owner ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-violet-50 text-violet-800 border border-violet-200">
                            <ShieldCheck size={13} />
                            <span>Chủ sở hữu hệ thống (Toàn quyền)</span>
                          </span>
                        ) : (
                          <div className="space-y-1">
                            {getRoleBadge(user.role)}
                            {Array.isArray(user.permissions) && user.permissions.length > 0 && (
                              <div className="text-[10px] text-slate-500">
                                {user.permissions.length} quyền chi tiết được cấp
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {user.status === 'active' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>Hoạt động</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            <span>Tạm khóa</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditUser(user)}
                            className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition"
                            title="Chỉnh sửa quyền & mật khẩu"
                          >
                            <Edit2 size={14} />
                          </button>
                          {!user.is_root_owner && (
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmUser(user)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="Xóa tài khoản"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: ĐÓNG / MỞ WEBSITE BẢO TRÌ & ĐỒNG BỘ DỮ LIỆU D1                    */}
      {/* ========================================================================= */}
      {(activeCenterTab === 'maintenance' || activeCenterTab === 'overview') && (
        <>
          <section
            id="section-status"
            className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6"
          >
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Power className="text-sky-600" size={18} />
                <span>Nhóm 2.18 — Chế Độ Bảo Trì Website & Banner Thông Báo</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Khi đóng website, khách truy cập công khai sẽ thấy Banner hoặc Màn hình thông báo trạng thái. <strong>Ngay cả khi website đóng, trang /admin vẫn hoạt động bình thường 100%.</strong>
              </p>
            </div>

            <div
              className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                siteStatus === 'closed'
                  ? 'bg-rose-50/60 border-rose-300'
                  : 'bg-emerald-50/60 border-emerald-300'
              }`}
            >
              <div>
                <div className="text-sm font-black text-slate-900">
                  Trạng thái hiện tại: {siteStatus === 'closed' ? 'ĐANG ĐÓNG BẢO TRÌ' : 'ĐANG MỞ CÔNG KHAI'}
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  {siteStatus === 'closed'
                    ? 'Chỉ quản trị viên truy cập /admin mới làm việc được; khách công khai thấy màn hình thông báo.'
                    : 'Mọi trang công khai hoạt động bình thường.'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSiteStatus('active')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold ${
                    siteStatus === 'active'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-slate-700 border border-slate-300'
                  }`}
                >
                  Mở Website
                </button>
                <button
                  type="button"
                  onClick={() => setSiteStatus('closed')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold ${
                    siteStatus === 'closed'
                      ? 'bg-rose-600 text-white'
                      : 'bg-white text-slate-700 border border-slate-300'
                  }`}
                >
                  Đóng Bảo Trì
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tiêu đề thông báo bảo trì</label>
                <input
                  type="text"
                  value={closedReasonText}
                  onChange={(e) => setClosedReasonText(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Thời gian dự kiến mở lại</label>
                <input
                  type="text"
                  value={closedEstimatedReopen}
                  onChange={(e) => setClosedEstimatedReopen(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Thông điệp chi tiết</label>
              <textarea
                rows={2}
                value={closedMessage}
                onChange={(e) => setClosedMessage(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-300"
              />
            </div>

            <button
              type="button"
              onClick={handleSaveSiteStatus}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl inline-flex items-center gap-2"
            >
              <Save size={15} />
              <span>Lưu Trạng Thái Bảo Trì</span>
            </button>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Database className="text-amber-500" size={18} />
                  <span>Nhóm 2.17 — Đồng Bộ Cơ Sở Dữ Liệu Cloudflare D1</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{firebaseSyncMessage}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    const res = await uploadAllDataToFirestore();
                    onShowToast(res.message);
                  }}
                  disabled={isFirebaseSyncing}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5"
                >
                  <CloudUpload size={14} />
                  <span>Đồng bộ lên D1</span>
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const res = await fetchDataFromFirestore();
                    onShowToast(res.message);
                  }}
                  disabled={isFirebaseSyncing}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl inline-flex items-center gap-1.5"
                >
                  <CloudDownload size={14} />
                  <span>Tải lại từ D1</span>
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      {/* ========================================================================= */}
      {/* MODAL THÊM / SỬA TÀI KHOẢN QUẢN TRỊ & BẢNG QUYỀN CHI TIẾT                  */}
      {/* ========================================================================= */}
      {userModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-2xs z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full my-4 max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {editingUser ? 'Chỉnh sửa tài khoản & Phân quyền chi tiết' : 'Thêm tài khoản quản trị mới'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={userEmail}
                  readOnly={!!editingUser}
                  onChange={(e) => {
                    if (!editingUser) setUserEmail(e.target.value);
                    setEmailError('');
                  }}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Họ tên hiển thị</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            {emailError && <div className="text-xs font-bold text-rose-600">{emailError}</div>}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  {editingUser ? 'Đặt lại mật khẩu (để trống nếu giữ nguyên)' : 'Mật khẩu ban đầu *'}
                </label>
                <button
                  type="button"
                  onClick={generateAdminPassword}
                  className="text-[11px] font-bold text-sky-700 inline-flex items-center gap-1"
                >
                  <KeyRound size={12} /> Tạo mật khẩu mạnh
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="relative">
                  <input
                    type={showUserPassword ? 'text' : 'password'}
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    placeholder="Tối thiểu 10 ký tự"
                    className="w-full text-xs px-3 py-2 pr-9 rounded-xl border border-slate-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowUserPassword((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showUserPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showUserPasswordConfirm ? 'text' : 'password'}
                    value={userPasswordConfirm}
                    onChange={(e) => setUserPasswordConfirm(e.target.value)}
                    placeholder="Xác nhận mật khẩu"
                    className="w-full text-xs px-3 py-2 pr-9 rounded-xl border border-slate-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowUserPasswordConfirm((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showUserPasswordConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Vai trò chính</label>
                <select
                  value={userRole}
                  disabled={Boolean(editingUser?.is_root_owner)}
                  onChange={(e) => {
                    const nextRole = e.target.value as AdminUserRole;
                    setUserRole(nextRole);
                    setUserPermissions(ROLE_CAPABILITIES[nextRole] || ROLE_CAPABILITIES.editor);
                  }}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="admin">Quản trị viên (Admin)</option>
                  <option value="developer">Lập trình viên (Developer)</option>
                  <option value="editor">Biên tập viên (Editor)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Trạng thái</label>
                <select
                  value={userStatus}
                  disabled={Boolean(editingUser?.is_root_owner)}
                  onChange={(e) => setUserStatus(e.target.value as 'active' | 'inactive')}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="active">Đang hoạt động</option>
                  <option value="inactive">Tạm khóa</option>
                </select>
              </div>
            </div>

            {/* Bảng quyền chi tiết (Capabilities) */}
            <div className="rounded-xl border border-slate-200 p-3.5 bg-slate-50 space-y-2">
              <div className="text-xs font-bold text-slate-800">
                Bảng phân quyền chi tiết (Capabilities kiểm tra tại API máy chủ):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ALL_CAPABILITIES.map((cap) => (
                  <label key={cap.id} className="flex items-start gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      disabled={Boolean(editingUser?.is_root_owner)}
                      checked={Boolean(editingUser?.is_root_owner) || userPermissions.includes(cap.id)}
                      onChange={() => toggleCapability(cap.id)}
                      className="mt-0.5"
                    />
                    <span>
                      <b className="text-slate-800">{cap.label}</b>
                      <span className="block text-[10px] text-slate-500">{cap.desc}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ghi chú phân công</label>
              <input
                type="text"
                value={userNote}
                onChange={(e) => setUserNote(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setUserModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={userSaving}
                onClick={handleSaveUser}
                className="px-5 py-2 bg-sky-600 text-white text-xs font-bold rounded-xl"
              >
                {userSaving ? 'Đang lưu...' : 'Lưu tài khoản'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Xác nhận xóa tài khoản?</h3>
            <p className="text-xs text-slate-600">
              Bạn có chắc chắn muốn xóa quyền truy cập của <strong>{deleteConfirmUser.email}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmUser(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteUser}
                className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl"
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
