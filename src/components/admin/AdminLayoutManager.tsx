import React, { useState } from 'react';
import {
  Layout,
  Eye,
  EyeOff,
  Edit3,
  Layers,
  Building2,
  PenTool,
  CheckCircle2,
  Sparkles,
  Info,
  Award,
  ArrowRight,
  Shield,
  FileText,
  Save,
  X,
  BarChart3,
  Globe,
  GraduationCap,
  HeartHandshake,
  Network,
  Megaphone,
  Mail,
  Phone,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { useDataContext } from '../../context/DataContext';
import { SiteConfig, PageRoute, CorePillar } from '../../types';

interface AdminLayoutManagerProps {
  onNavigate?: (page: PageRoute) => void;
  onShowToast?: (msg: string) => void;
  onSwitchTab?: (tabId: string) => void;
}

type EditModalType = 'hero' | 'stats' | 'pillars' | 'cta' | 'footer' | 'info-only' | null;

export const AdminLayoutManager: React.FC<AdminLayoutManagerProps> = ({
  onNavigate,
  onShowToast,
  onSwitchTab,
}) => {
  const { siteConfig, updateSiteConfig, corePillars, updateCorePillar } = useDataContext();

  // Active dialog modal
  const [activeModal, setActiveModal] = useState<EditModalType>(null);
  const [infoTarget, setInfoTarget] = useState<{
    id: 'programs' | 'units' | 'news';
    title: string;
    description: string;
    tabTarget: string;
    icon: React.ReactNode;
  } | null>(null);

  // Selected Pillar Tab inside Pillars modal
  const [selectedPillarIndex, setSelectedPillarIndex] = useState<number>(0);

  // Draft form states for Hero
  const [heroDraft, setHeroDraft] = useState({
    heroBadge: siteConfig.heroBadge || '',
    heroHeading: siteConfig.heroHeading || '',
    heroSubtext: siteConfig.heroSubtext || '',
    heroImageUrl: siteConfig.heroImageUrl || '',
    heroButton1Text: siteConfig.heroButton1Text || 'Giới thiệu Sky First Network',
    heroButton1Url: siteConfig.heroButton1Url || '/about',
    heroButton2Text: siteConfig.heroButton2Text || 'Tra cứu Giấy chứng nhận',
    heroButton2Url: siteConfig.heroButton2Url || '/certificate',
    heroButton3Text: siteConfig.heroButton3Text || 'Tham gia Sky First Network Ngay',
    heroButton3Url: siteConfig.heroButton3Url || '/join',
  });

  // Draft form states for Stats
  const [statsDraft, setStatsDraft] = useState({
    membersCount: siteConfig.stats?.membersCount || '0',
    membersLabel: siteConfig.stats?.membersLabel || 'Thành viên & Tình nguyện viên',
    membersSubtext: siteConfig.stats?.membersSubtext || 'Đang mở đơn kết nối thành viên',
    provincesCount: siteConfig.stats?.provincesCount || '0',
    provincesLabel: siteConfig.stats?.provincesLabel || 'Điểm trường kết nối',
    provincesSubtext: siteConfig.stats?.provincesSubtext || 'Sẵn sàng khởi động năm 2026',
    volunteerHours: siteConfig.stats?.volunteerHours || '0',
    hoursLabel: siteConfig.stats?.hoursLabel || 'Giờ tình nguyện cống hiến',
    hoursSubtext: siteConfig.stats?.hoursSubtext || 'Kế hoạch khảo sát địa bàn',
    communityProjects: siteConfig.stats?.communityProjects || '0',
    projectsLabel: siteConfig.stats?.projectsLabel || 'Dự án & Chiến dịch',
    projectsSubtext: siteConfig.stats?.projectsSubtext || 'Bắt đầu ghi nhận giờ hoạt động',
  });

  // Draft form states for Pillars
  const [pillarsConfigDraft, setPillarsConfigDraft] = useState({
    pillarsHeading: siteConfig.pillarsHeading || 'Lĩnh Vực Trọng Tâm',
    pillarsSubtext: siteConfig.pillarsSubtext || 'Các trụ cột chiến lược định hướng toàn bộ chương trình và dự án phụng sự của SFN',
  });
  const [pillarsItemsDraft, setPillarsItemsDraft] = useState<CorePillar[]>(() => {
    return corePillars && corePillars.length > 0 ? JSON.parse(JSON.stringify(corePillars)) : [];
  });

  // Draft form states for CTA
  const [ctaDraft, setCtaDraft] = useState({
    ctaHeading: siteConfig.ctaHeading || '',
    ctaSubtext: siteConfig.ctaSubtext || '',
    ctaButtonText: siteConfig.ctaButtonText || 'Đăng ký Tham gia Ngay',
    ctaButtonUrl: siteConfig.ctaButtonUrl || '/join',
    ctaSecondaryButtonText: siteConfig.ctaSecondaryButtonText || 'Tìm hiểu Trung tâm SFEC',
    ctaSecondaryButtonUrl: siteConfig.ctaSecondaryButtonUrl || '/units',
  });

  // Draft form states for Footer (chuẩn hóa đầy đủ các trường khớp Footer.tsx)
  const [footerDraft, setFooterDraft] = useState({
    siteName: siteConfig.siteName || 'Sky First Network',
    footerSlogan: siteConfig.footerSlogan || '',
    footerAboutText: siteConfig.footerAboutText || '',
    footerCertBadgeText: siteConfig.footerCertBadgeText || 'Tra cứu Giấy chứng nhận',
    footerUnitsBadgeText: siteConfig.footerUnitsBadgeText || 'Đơn vị trực thuộc',
    email: siteConfig.email || 'skyfirst.ec@gmail.com',
    hotline: siteConfig.hotline || '0337 775 329',
    address: siteConfig.address || 'Hà Nội & TP. Hồ Chí Minh, Việt Nam',
    footerCopyright: siteConfig.footerCopyright || '',
    footerSocialFacebook: siteConfig.footerSocialFacebook || '',
    footerSocialLinkedin: siteConfig.footerSocialLinkedin || '',
    footerSocialYoutube: siteConfig.footerSocialYoutube || '',
    footerSocialZalo: siteConfig.footerSocialZalo || '',
  });

  const homeSections = siteConfig.homeSections || {
    hero: true,
    stats: true,
    pillars: true,
    programs: true,
    units: true,
    news: true,
    cta: true,
    footer: true,
  };

  // Toggle section visibility
  const toggleSection = (sectionKey: keyof NonNullable<SiteConfig['homeSections']>, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const currentStatus = homeSections[sectionKey] !== false;
    const newStatus = !currentStatus;

    const updatedSections = {
      ...homeSections,
      [sectionKey]: newStatus,
    };

    updateSiteConfig({
      homeSections: updatedSections,
    });

    const sectionLabels: Record<string, string> = {
      hero: 'Đầu trang (Hero)',
      stats: 'Khối Thống Kê Tác Động',
      pillars: 'Khối 5 Trụ Cột / Lĩnh Vực Trọng Tâm',
      programs: 'Chương trình',
      units: 'Đơn vị',
      news: 'Tin tức',
      cta: 'Khối hành động',
      footer: 'Chân trang',
    };

    onShowToast?.(
      newStatus
        ? `Đã hiện "${sectionLabels[sectionKey]}" trên trang chủ`
        : `Đã ẩn "${sectionLabels[sectionKey]}" khỏi trang chủ`
    );
  };

  // Open Hero Modal
  const openHeroModal = () => {
    setHeroDraft({
      heroBadge: siteConfig.heroBadge || '',
      heroHeading: siteConfig.heroHeading || '',
      heroSubtext: siteConfig.heroSubtext || '',
      heroImageUrl: siteConfig.heroImageUrl || '',
      heroButton1Text: siteConfig.heroButton1Text || 'Giới thiệu Sky First Network',
      heroButton1Url: siteConfig.heroButton1Url || '/about',
      heroButton2Text: siteConfig.heroButton2Text || 'Tra cứu Giấy chứng nhận',
      heroButton2Url: siteConfig.heroButton2Url || '/certificate',
      heroButton3Text: siteConfig.heroButton3Text || 'Tham gia Sky First Network Ngay',
      heroButton3Url: siteConfig.heroButton3Url || '/join',
    });
    setActiveModal('hero');
  };

  // Open Stats Modal
  const openStatsModal = () => {
    setStatsDraft({
      membersCount: siteConfig.stats?.membersCount || '0',
      membersLabel: siteConfig.stats?.membersLabel || 'Thành viên & Tình nguyện viên',
      membersSubtext: siteConfig.stats?.membersSubtext || 'Đang mở đơn kết nối thành viên',
      provincesCount: siteConfig.stats?.provincesCount || '0',
      provincesLabel: siteConfig.stats?.provincesLabel || 'Điểm trường kết nối',
      provincesSubtext: siteConfig.stats?.provincesSubtext || 'Sẵn sàng khởi động năm 2026',
      volunteerHours: siteConfig.stats?.volunteerHours || '0',
      hoursLabel: siteConfig.stats?.hoursLabel || 'Giờ tình nguyện cống hiến',
      hoursSubtext: siteConfig.stats?.hoursSubtext || 'Kế hoạch khảo sát địa bàn',
      communityProjects: siteConfig.stats?.communityProjects || '0',
      projectsLabel: siteConfig.stats?.projectsLabel || 'Dự án & Chiến dịch',
      projectsSubtext: siteConfig.stats?.projectsSubtext || 'Bắt đầu ghi nhận giờ hoạt động',
    });
    setActiveModal('stats');
  };

  // Open Pillars Modal
  const openPillarsModal = () => {
    setPillarsConfigDraft({
      pillarsHeading: siteConfig.pillarsHeading || 'Lĩnh Vực Trọng Tâm',
      pillarsSubtext: siteConfig.pillarsSubtext || 'Các trụ cột chiến lược định hướng toàn bộ chương trình và dự án phụng sự của SFN',
    });
    setPillarsItemsDraft(corePillars && corePillars.length > 0 ? JSON.parse(JSON.stringify(corePillars)) : []);
    setSelectedPillarIndex(0);
    setActiveModal('pillars');
  };

  // Open CTA Modal
  const openCtaModal = () => {
    setCtaDraft({
      ctaHeading: siteConfig.ctaHeading || '',
      ctaSubtext: siteConfig.ctaSubtext || '',
      ctaButtonText: siteConfig.ctaButtonText || 'Đăng ký Tham gia Ngay',
      ctaButtonUrl: siteConfig.ctaButtonUrl || '/join',
      ctaSecondaryButtonText: siteConfig.ctaSecondaryButtonText || 'Tìm hiểu Trung tâm SFEC',
      ctaSecondaryButtonUrl: siteConfig.ctaSecondaryButtonUrl || '/units',
    });
    setActiveModal('cta');
  };

  // Open Footer Modal
  const openFooterModal = () => {
    setFooterDraft({
      siteName: siteConfig.siteName || 'Sky First Network',
      footerSlogan: siteConfig.footerSlogan || '',
      footerAboutText: siteConfig.footerAboutText || '',
      footerCertBadgeText: siteConfig.footerCertBadgeText || 'Tra cứu Giấy chứng nhận',
      footerUnitsBadgeText: siteConfig.footerUnitsBadgeText || 'Đơn vị trực thuộc',
      email: siteConfig.email || 'skyfirst.ec@gmail.com',
      hotline: siteConfig.hotline || '0337 775 329',
      address: siteConfig.address || 'Hà Nội & TP. Hồ Chí Minh, Việt Nam',
      footerCopyright: siteConfig.footerCopyright || '',
      footerSocialFacebook: siteConfig.footerSocialFacebook || '',
      footerSocialLinkedin: siteConfig.footerSocialLinkedin || '',
      footerSocialYoutube: siteConfig.footerSocialYoutube || '',
      footerSocialZalo: siteConfig.footerSocialZalo || '',
    });
    setActiveModal('footer');
  };

  // Open Info modal for Programs, Units, News
  const openInfoModal = (type: 'programs' | 'units' | 'news') => {
    const configMap = {
      programs: {
        id: 'programs' as const,
        title: 'Mục: Chương trình',
        description: 'Mục này chỉ quản lý trạng thái Ẩn hoặc Hiện trên trang chủ. Nội dung các chương trình, hoạt động đào tạo và tuyển tình nguyện viên được tạo và chỉnh sửa độc lập tại mục "Chương trình" trên thanh menu bên trái.',
        tabTarget: 'programs',
        icon: <Layers className="text-emerald-600" size={24} />,
      },
      units: {
        id: 'units' as const,
        title: 'Mục: Đơn vị trực thuộc',
        description: 'Mục này chỉ quản lý trạng thái Ẩn hoặc Hiện trên trang chủ. Thông tin các trung tâm chuyên môn (SFEC, SFYC, SFIR, SFMC, SFCA) được thiết lập và quản lý độc lập tại mục "Đơn vị" trên thanh menu bên trái.',
        tabTarget: 'units',
        icon: <Building2 className="text-sky-600" size={24} />,
      },
      news: {
        id: 'news' as const,
        title: 'Mục: Tin tức & Bài viết',
        description: 'Mục này chỉ quản lý trạng thái Ẩn hoặc Hiện trên trang chủ. Toàn bộ nội dung tin tức, bài viết, thông báo và phóng sự được đăng tải và quản lý độc lập tại mục "Bài đăng" trên thanh menu bên trái.',
        tabTarget: 'posts',
        icon: <PenTool className="text-amber-600" size={24} />,
      },
    };

    setInfoTarget(configMap[type]);
    setActiveModal('info-only');
  };

  // Save Hero
  const handleSaveHero = () => {
    updateSiteConfig(heroDraft);
    setActiveModal(null);
    onShowToast?.('Đã lưu nội dung Đầu trang thành công!');
  };

  // Save Stats
  const handleSaveStats = () => {
    updateSiteConfig({
      stats: statsDraft,
    });
    setActiveModal(null);
    onShowToast?.('Đã lưu 4 chỉ số Thống kê tác động thành công!');
  };

  // Save Pillars
  const handleSavePillars = () => {
    updateSiteConfig({
      pillarsHeading: pillarsConfigDraft.pillarsHeading,
      pillarsSubtext: pillarsConfigDraft.pillarsSubtext,
    });
    // Update each pillar item
    pillarsItemsDraft.forEach((p, idx) => {
      updateCorePillar(idx, p);
    });
    setActiveModal(null);
    onShowToast?.('Đã lưu cấu hình Khối 5 Trụ Cột thành công!');
  };

  // Save CTA
  const handleSaveCta = () => {
    updateSiteConfig(ctaDraft);
    setActiveModal(null);
    onShowToast?.('Đã lưu nội dung Khối hành động thành công!');
  };

  // Save Footer
  const handleSaveFooter = () => {
    updateSiteConfig(footerDraft);
    setActiveModal(null);
    onShowToast?.('Đã lưu nội dung Chân trang thành công!');
  };

  // Helper for pillar icons
  const pillarIcons: Record<string, React.ReactNode> = {
    GraduationCap: <GraduationCap size={20} className="text-[#0284C7]" />,
    HeartHandshake: <HeartHandshake size={20} className="text-emerald-600" />,
    Network: <Network size={20} className="text-amber-600" />,
    Megaphone: <Megaphone size={20} className="text-rose-600" />,
    CheckCircle2: <CheckCircle2 size={20} className="text-indigo-600" />,
  };

  const pillarColorClasses: Record<string, { border: string; bg: string; badge: string; text: string }> = {
    '01': { border: 'border-sky-300', bg: 'bg-sky-50/50', badge: 'bg-[#0284C7]', text: 'text-[#0284C7]' },
    '02': { border: 'border-emerald-300', bg: 'bg-emerald-50/50', badge: 'bg-emerald-600', text: 'text-emerald-700' },
    '03': { border: 'border-amber-300', bg: 'bg-amber-50/50', badge: 'bg-amber-600', text: 'text-amber-700' },
    '04': { border: 'border-rose-300', bg: 'bg-rose-50/50', badge: 'bg-rose-600', text: 'text-rose-700' },
    '05': { border: 'border-indigo-300', bg: 'bg-indigo-50/50', badge: 'bg-indigo-600', text: 'text-indigo-700' },
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* SIMULATED HOMEPAGE CANVAS (Wireframe & Visual Mockup) */}
      <div className="space-y-7">
        
        {/* ========================================================
            KHỐI 1: ĐẦU TRANG (HERO SECTION)
        ======================================================== */}
        <div
          id="layout-block-hero"
          onClick={openHeroModal}
          className={`group relative rounded-3xl border-2 transition-all duration-200 cursor-pointer overflow-hidden ${
            homeSections.hero !== false
              ? 'bg-gradient-to-b from-sky-50/80 via-white to-slate-50/30 border-sky-300 hover:border-sky-500 hover:shadow-lg'
              : 'bg-slate-50/70 border-dashed border-slate-300 opacity-60'
          }`}
        >
          {/* Header Bar */}
          <div className="bg-sky-100/70 border-b border-sky-200 px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-[#0284C7] text-white flex items-center justify-center font-black text-xs">
                1
              </span>
              <div>
                <span className="text-xs font-black text-[#0284C7] uppercase tracking-wider block">
                  Đầu Trang (Hero Section)
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Biểu ngữ chào mừng, tiêu đề chính, thông điệp mở đầu & nút kêu gọi
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                id="toggle-hero-visibility"
                onClick={(e) => toggleSection('hero', e)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border shadow-2xs ${
                  homeSections.hero !== false
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                    : 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'
                }`}
              >
                {homeSections.hero !== false ? (
                  <>
                    <Eye size={14} className="text-emerald-600" />
                    <span>Đang hiện</span>
                  </>
                ) : (
                  <>
                    <EyeOff size={14} className="text-slate-400" />
                    <span>Đang ẩn</span>
                  </>
                )}
              </button>

              <button
                type="button"
                id="btn-edit-hero"
                onClick={openHeroModal}
                className="px-3 py-1.5 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-extrabold rounded-xl transition flex items-center gap-1.5 shadow-2xs"
              >
                <Edit3 size={13} />
                <span>Chỉnh sửa nội dung</span>
              </button>
            </div>
          </div>

          {/* Hero Mock Content */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-sky-200 text-xs font-extrabold text-[#0284C7] shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>{siteConfig.heroBadge || 'Mạng Lưới Giáo Dục & Phát Triển Cộng Đồng Hàng Đầu'}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  {siteConfig.heroHeading || 'Kiến Tạo Tương Lai - Khơi Nguồn Tri Thức & Sức Trẻ Cống Hiến'}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl line-clamp-2 leading-relaxed">
                  {siteConfig.heroSubtext || 'Sky First Network là hệ sinh thái kết nối thanh niên, học sinh - sinh viên và các chuyên gia...'}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="px-3.5 py-1.5 rounded-lg bg-[#0284C7] text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs">
                    <Info size={13} />
                    {siteConfig.heroButton1Text || 'Giới thiệu Sky First Network'}
                  </span>
                  <span className="px-3.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-xs flex items-center gap-1.5">
                    <Award size={13} />
                    {siteConfig.heroButton2Text || 'Tra cứu Giấy chứng nhận'}
                  </span>
                  <span className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs">
                    <span>{siteConfig.heroButton3Text || 'Tham gia Sky First Network Ngay'}</span>
                    <ArrowRight size={13} />
                  </span>
                </div>
              </div>

              <div className="lg:col-span-4">
                <div className="p-3 bg-white rounded-2xl border border-sky-200 shadow-2xs text-center space-y-2">
                  <div className="h-28 bg-gradient-to-br from-sky-100 to-blue-200/60 rounded-xl flex items-center justify-center text-sky-700 font-semibold text-xs border border-sky-200/60 overflow-hidden">
                    {siteConfig.heroImageUrl ? (
                      <img src={siteConfig.heroImageUrl} alt="Banner" className="w-full h-full object-cover" />
                    ) : (
                      <span className="px-3 text-center">Khung ảnh Banner Hoạt động Tổng quan (16:9)</span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">
                    Nhấn vào đây để tải ảnh đại diện hoặc sửa tiêu đề
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            KHỐI 2: KHỐI THỐNG KÊ TÁC ĐỘNG (IMPACT STATS)
            Hiển thị đầy đủ 4 thẻ đa màu sắc y như trên trang chủ
        ======================================================== */}
        <div
          id="layout-block-stats"
          onClick={openStatsModal}
          className={`group relative rounded-3xl border-2 transition-all duration-200 cursor-pointer overflow-hidden ${
            homeSections.stats !== false
              ? 'bg-white border-sky-300 hover:border-sky-500 hover:shadow-lg'
              : 'bg-slate-50/70 border-dashed border-slate-300 opacity-60'
          }`}
        >
          {/* Header Bar */}
          <div className="bg-sky-50/80 border-b border-sky-100 px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-sky-600 text-white flex items-center justify-center font-black text-xs">
                2
              </span>
              <div>
                <span className="text-xs font-black text-sky-900 uppercase tracking-wider block">
                  Khối Thống Kê Tác Động (Multi-Color Impact Stats)
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  4 chỉ số đo lường quy mô và đóng góp của mạng lưới SFN cho cộng đồng
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                id="toggle-stats-visibility"
                onClick={(e) => toggleSection('stats', e)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border shadow-2xs ${
                  homeSections.stats !== false
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                    : 'bg-slate-100 text-slate-500 border-slate-300'
                }`}
              >
                {homeSections.stats !== false ? (
                  <>
                    <Eye size={14} className="text-emerald-600" />
                    <span>Đang hiện</span>
                  </>
                ) : (
                  <>
                    <EyeOff size={14} className="text-slate-400" />
                    <span>Đang ẩn</span>
                  </>
                )}
              </button>

              <button
                type="button"
                id="btn-edit-stats"
                onClick={openStatsModal}
                className="px-3 py-1.5 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-extrabold rounded-xl transition flex items-center gap-1.5 shadow-2xs"
              >
                <Edit3 size={13} />
                <span>Chỉnh sửa 4 chỉ số</span>
              </button>
            </div>
          </div>

          {/* Stats Full Grid (Giống trên trang chủ) */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              
              {/* Stat 1: Sky */}
              <div className="p-5 sm:p-6 rounded-3xl border border-sky-200 bg-gradient-to-br from-sky-50 to-blue-100/60 shadow-2xs group-hover:shadow-xs transition">
                <div className="text-3xl sm:text-4xl font-black mb-1 tracking-tight text-[#0284C7]">
                  {siteConfig.stats?.membersCount || '0'}
                </div>
                <div className="font-extrabold text-xs sm:text-sm text-slate-800 mb-0.5">
                  {siteConfig.stats?.membersLabel || 'Thành viên & Tình nguyện viên'}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium leading-relaxed">
                  {siteConfig.stats?.membersSubtext || 'Đang mở đơn kết nối thành viên'}
                </div>
              </div>

              {/* Stat 2: Emerald */}
              <div className="p-5 sm:p-6 rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-100/60 shadow-2xs group-hover:shadow-xs transition">
                <div className="text-3xl sm:text-4xl font-black mb-1 tracking-tight text-emerald-600">
                  {siteConfig.stats?.provincesCount || '0'}
                </div>
                <div className="font-extrabold text-xs sm:text-sm text-slate-800 mb-0.5">
                  {siteConfig.stats?.provincesLabel || 'Điểm trường kết nối'}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium leading-relaxed">
                  {siteConfig.stats?.provincesSubtext || 'Sẵn sàng khởi động năm 2026'}
                </div>
              </div>

              {/* Stat 3: Amber */}
              <div className="p-5 sm:p-6 rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-100/60 shadow-2xs group-hover:shadow-xs transition">
                <div className="text-3xl sm:text-4xl font-black mb-1 tracking-tight text-amber-600">
                  {siteConfig.stats?.volunteerHours || '0'}
                </div>
                <div className="font-extrabold text-xs sm:text-sm text-slate-800 mb-0.5">
                  {siteConfig.stats?.hoursLabel || 'Giờ tình nguyện cống hiến'}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium leading-relaxed">
                  {siteConfig.stats?.hoursSubtext || 'Kế hoạch khảo sát địa bàn'}
                </div>
              </div>

              {/* Stat 4: Rose */}
              <div className="p-5 sm:p-6 rounded-3xl border border-rose-200 bg-gradient-to-br from-rose-50 to-pink-100/60 shadow-2xs group-hover:shadow-xs transition">
                <div className="text-3xl sm:text-4xl font-black mb-1 tracking-tight text-rose-600">
                  {siteConfig.stats?.communityProjects || '0'}
                </div>
                <div className="font-extrabold text-xs sm:text-sm text-slate-800 mb-0.5">
                  {siteConfig.stats?.projectsLabel || 'Dự án & Chiến dịch'}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium leading-relaxed">
                  {siteConfig.stats?.projectsSubtext || 'Bắt đầu ghi nhận giờ hoạt động'}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ========================================================
            KHỐI 3: KHỐI 5 TRỤ CỘT / LĨNH VỰC TRỌNG TÂM (5 CORE PILLARS)
            Hiển thị đầy đủ 5 trụ cột y như trên trang chủ
        ======================================================== */}
        <div
          id="layout-block-pillars"
          onClick={openPillarsModal}
          className={`group relative rounded-3xl border-2 transition-all duration-200 cursor-pointer overflow-hidden ${
            homeSections.pillars !== false
              ? 'bg-white border-indigo-300 hover:border-indigo-500 hover:shadow-lg'
              : 'bg-slate-50/70 border-dashed border-slate-300 opacity-60'
          }`}
        >
          {/* Header Bar */}
          <div className="bg-indigo-50/80 border-b border-indigo-100 px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-xs">
                3
              </span>
              <div>
                <span className="text-xs font-black text-indigo-950 uppercase tracking-wider block">
                  Khối 5 Trụ Cột / Lĩnh Vực Trọng Tâm (5 Core Pillars)
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  5 trụ cột chiến lược định hướng toàn bộ chương trình và dự án phụng sự của SFN
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                id="toggle-pillars-visibility"
                onClick={(e) => toggleSection('pillars', e)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border shadow-2xs ${
                  homeSections.pillars !== false
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                    : 'bg-slate-100 text-slate-500 border-slate-300'
                }`}
              >
                {homeSections.pillars !== false ? (
                  <>
                    <Eye size={14} className="text-emerald-600" />
                    <span>Đang hiện</span>
                  </>
                ) : (
                  <>
                    <EyeOff size={14} className="text-slate-400" />
                    <span>Đang ẩn</span>
                  </>
                )}
              </button>

              <button
                type="button"
                id="btn-edit-pillars"
                onClick={openPillarsModal}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl transition flex items-center gap-1.5 shadow-2xs"
              >
                <Edit3 size={13} />
                <span>Chỉnh sửa các trụ cột</span>
              </button>
            </div>
          </div>

          {/* Pillars Full Mock Content (Giống trên trang chủ) */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Section Heading Row */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]"></span>
                  <h3 className="text-xl sm:text-2xl font-black text-[#0284C7] tracking-tight">
                    {siteConfig.pillarsHeading || 'Lĩnh Vực Trọng Tâm'}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                  {siteConfig.pillarsSubtext || 'Các trụ cột chiến lược định hướng toàn bộ chương trình và dự án phụng sự của SFN'}
                </p>
              </div>
              <div className="text-xs font-bold text-[#0284C7] flex items-center gap-1 flex-shrink-0">
                <span>Xem chi tiết các chương trình</span>
                <ArrowRight size={14} />
              </div>
            </div>

            {/* 5 Pillars Grid + 1 Join Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {corePillars.map((pillar) => {
                const colors = pillarColorClasses[pillar.number] || pillarColorClasses['01'];
                return (
                  <div
                    key={pillar.number}
                    className={`p-5 sm:p-6 rounded-3xl border ${colors.border} ${colors.bg} flex flex-col justify-between space-y-4 shadow-2xs`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`w-8 h-8 rounded-xl ${colors.badge} text-white font-black text-xs flex items-center justify-center shadow-2xs`}>
                          {pillar.number}
                        </span>
                        <div className="p-2 rounded-xl bg-white shadow-2xs">
                          {pillarIcons[pillar.iconName] || <Shield size={18} className={colors.text} />}
                        </div>
                      </div>

                      <h4 className={`text-base sm:text-lg font-black ${colors.text} leading-snug`}>
                        {pillar.title}
                      </h4>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                        {pillar.shortDesc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-[#0284C7]">
                      <span>Khám phá hoạt động</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                );
              })}

              {/* 6th Call-out Box */}
              <div className="p-5 sm:p-6 rounded-3xl border border-sky-300 bg-gradient-to-br from-[#00A3FF] to-[#0284C7] text-white flex flex-col justify-between space-y-4 shadow-md">
                <div className="space-y-2.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-[11px] font-bold">
                    <Sparkles size={13} />
                    <span>Cùng kiến tạo</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-white leading-snug">
                    Tham gia Sky First Network
                  </h4>
                  <p className="text-xs text-sky-100 leading-relaxed font-normal">
                    Trở thành mảnh ghép nhiệt huyết trong các chương trình và đơn vị trực thuộc.
                  </p>
                </div>
                <div className="pt-3 border-t border-white/20 flex items-center justify-between text-xs font-bold text-white">
                  <span>Ứng tuyển ngay</span>
                  <ArrowRight size={14} />
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* ========================================================
            KHỐI 4: CÁC MỤC ĐANG CÓ (PROGRAMS, UNITS, NEWS)
            Quy tắc: Chỉ có Ẩn / Hiện, không có trình chỉnh sửa
        ======================================================== */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
              4
            </span>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
              Các Mục Đang Có (Chương trình - Đơn vị - Tin tức)
            </h3>
            <span className="text-xs text-slate-500 font-normal">
              (Chỉ quản lý Ẩn/Hiện trên trang chủ, nội dung sửa tại menu tương ứng)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* 4.1: CHƯƠNG TRÌNH */}
            <div
              id="layout-block-programs"
              onClick={() => openInfoModal('programs')}
              className={`rounded-3xl border-2 transition-all duration-200 cursor-pointer overflow-hidden group flex flex-col justify-between ${
                homeSections.programs !== false
                  ? 'bg-white border-emerald-300 hover:border-emerald-500 hover:shadow-md'
                  : 'bg-slate-50 border-dashed border-slate-300 opacity-60'
              }`}
            >
              <div>
                <div className="bg-emerald-50/80 border-b border-emerald-100 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-600 text-white">
                      <Layers size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-emerald-900 uppercase">
                        Chương Trình
                      </h4>
                      <span className="text-[10px] text-emerald-700 font-medium">
                        Khóa đào tạo & Tình nguyện
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    id="toggle-programs-visibility"
                    onClick={(e) => toggleSection('programs', e)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 border shadow-2xs ${
                      homeSections.programs !== false
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-slate-500 border-slate-300'
                    }`}
                  >
                    {homeSections.programs !== false ? (
                      <>
                        <Eye size={13} />
                        <span>Hiện</span>
                      </>
                    ) : (
                      <>
                        <EyeOff size={13} />
                        <span>Ẩn</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-5 space-y-3">
                  <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                        Giáo dục & Kỹ năng
                      </span>
                      <span className="text-slate-400">01/03/2026</span>
                    </div>
                    <div className="text-xs font-bold text-slate-800 line-clamp-1">
                      Chiến dịch Tình nguyện & Khóa rèn luyện Kỹ năng SFN
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-sky-700 bg-white px-2 py-0.5 rounded border border-sky-200">
                        Tuyển dụng TV
                      </span>
                      <span className="text-slate-400">15/03/2026</span>
                    </div>
                    <div className="text-xs font-bold text-slate-800 line-clamp-1">
                      Đợt tiếp nhận thành viên & tình nguyện viên SFN đợt 1
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 flex items-center gap-1 font-medium">
                  <AlertCircle size={13} className="text-emerald-600" />
                  Chỉ ẩn/hiện, không sửa ở đây
                </span>
                <span className="font-bold text-emerald-700 group-hover:underline flex items-center gap-1">
                  Xem chi tiết
                  <ArrowRight size={12} />
                </span>
              </div>
            </div>

            {/* 4.2: ĐƠN VỊ */}
            <div
              id="layout-block-units"
              onClick={() => openInfoModal('units')}
              className={`rounded-3xl border-2 transition-all duration-200 cursor-pointer overflow-hidden group flex flex-col justify-between ${
                homeSections.units !== false
                  ? 'bg-white border-sky-300 hover:border-sky-500 hover:shadow-md'
                  : 'bg-slate-50 border-dashed border-slate-300 opacity-60'
              }`}
            >
              <div>
                <div className="bg-sky-50/80 border-b border-sky-100 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#0284C7] text-white">
                      <Building2 size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-sky-950 uppercase">
                        Đơn Vị Trực Thuộc
                      </h4>
                      <span className="text-[10px] text-sky-700 font-medium">
                        5 trung tâm chuyên môn
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    id="toggle-units-visibility"
                    onClick={(e) => toggleSection('units', e)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 border shadow-2xs ${
                      homeSections.units !== false
                        ? 'bg-[#0284C7] text-white border-[#0284C7]'
                        : 'bg-white text-slate-500 border-slate-300'
                    }`}
                  >
                    {homeSections.units !== false ? (
                      <>
                        <Eye size={13} />
                        <span>Hiện</span>
                      </>
                    ) : (
                      <>
                        <EyeOff size={13} />
                        <span>Ẩn</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-5 space-y-2.5">
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="p-2 rounded-xl bg-sky-50 border border-sky-100 font-bold text-[#0284C7]">
                      SFEC (Kỹ năng)
                    </div>
                    <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100 font-bold text-emerald-700">
                      SFYC (Tình nguyện)
                    </div>
                    <div className="p-2 rounded-xl bg-amber-50 border border-amber-100 font-bold text-amber-700">
                      SFIR (Nghiên cứu)
                    </div>
                    <div className="p-2 rounded-xl bg-purple-50 border border-purple-100 font-bold text-purple-700">
                      SFMC & SFCA
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                    Banner tóm tắt hệ thống 5 đơn vị chuyên trách của SFN
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 flex items-center gap-1 font-medium">
                  <AlertCircle size={13} className="text-[#0284C7]" />
                  Chỉ ẩn/hiện, không sửa ở đây
                </span>
                <span className="font-bold text-[#0284C7] group-hover:underline flex items-center gap-1">
                  Xem chi tiết
                  <ArrowRight size={12} />
                </span>
              </div>
            </div>

            {/* 4.3: TIN TỨC */}
            <div
              id="layout-block-news"
              onClick={() => openInfoModal('news')}
              className={`rounded-3xl border-2 transition-all duration-200 cursor-pointer overflow-hidden group flex flex-col justify-between ${
                homeSections.news !== false
                  ? 'bg-white border-amber-300 hover:border-amber-500 hover:shadow-md'
                  : 'bg-slate-50 border-dashed border-slate-300 opacity-60'
              }`}
            >
              <div>
                <div className="bg-amber-50/80 border-b border-amber-100 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-600 text-white">
                      <PenTool size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-amber-950 uppercase">
                        Tin Tức & Bài Viết
                      </h4>
                      <span className="text-[10px] text-amber-700 font-medium">
                        3 bài viết mới nhất
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    id="toggle-news-visibility"
                    onClick={(e) => toggleSection('news', e)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 border shadow-2xs ${
                      homeSections.news !== false
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-white text-slate-500 border-slate-300'
                    }`}
                  >
                    {homeSections.news !== false ? (
                      <>
                        <Eye size={13} />
                        <span>Hiện</span>
                      </>
                    ) : (
                      <>
                        <EyeOff size={13} />
                        <span>Ẩn</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-5 space-y-3">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-bold text-sky-700">Thông báo SFN</span>
                      <span>Hôm nay</span>
                    </div>
                    <div className="text-xs font-bold text-slate-800 line-clamp-1">
                      Lễ công bố và khởi động mạng lưới thanh niên SFN 2026
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-bold text-emerald-700">Phóng sự</span>
                      <span>Hôm qua</span>
                    </div>
                    <div className="text-xs font-bold text-slate-800 line-clamp-1">
                      Hành trình kiến tạo giá trị cho cộng đồng học sinh sinh viên
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 flex items-center gap-1 font-medium">
                  <AlertCircle size={13} className="text-amber-600" />
                  Chỉ ẩn/hiện, không sửa ở đây
                </span>
                <span className="font-bold text-amber-700 group-hover:underline flex items-center gap-1">
                  Xem chi tiết
                  <ArrowRight size={12} />
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================
            KHỐI 5: KHỐI HÀNH ĐỘNG (CALL TO ACTION - CTA)
        ======================================================== */}
        <div
          id="layout-block-cta"
          onClick={openCtaModal}
          className={`group relative rounded-3xl border-2 transition-all duration-200 cursor-pointer overflow-hidden ${
            homeSections.cta !== false
              ? 'bg-gradient-to-r from-[#00A3FF] via-[#0284C7] to-emerald-600 text-white border-sky-400 hover:border-sky-200 hover:shadow-lg'
              : 'bg-slate-50 border-dashed border-slate-300 opacity-60 text-slate-600'
          }`}
        >
          {/* Header */}
          <div className="bg-black/15 border-b border-white/20 px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-white text-[#0284C7] flex items-center justify-center font-black text-xs">
                5
              </span>
              <div>
                <span className="text-xs font-black uppercase tracking-wider block text-white">
                  Khối Hành Động (Call to Action - CTA)
                </span>
                <span className="text-[11px] text-sky-100 font-medium">
                  Biểu ngữ nổi bật kêu gọi thanh niên, học viên & đối tác cùng đồng hành
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                id="toggle-cta-visibility"
                onClick={(e) => toggleSection('cta', e)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border shadow-2xs ${
                  homeSections.cta !== false
                    ? 'bg-white text-[#0284C7] border-white hover:bg-sky-50'
                    : 'bg-slate-100 text-slate-500 border-slate-300'
                }`}
              >
                {homeSections.cta !== false ? (
                  <>
                    <Eye size={14} />
                    <span>Đang hiện</span>
                  </>
                ) : (
                  <>
                    <EyeOff size={14} />
                    <span>Đang ẩn</span>
                  </>
                )}
              </button>

              <button
                type="button"
                id="btn-edit-cta"
                onClick={openCtaModal}
                className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-extrabold rounded-xl transition flex items-center gap-1.5 border border-white/30"
              >
                <Edit3 size={13} />
                <span>Chỉnh sửa nội dung</span>
              </button>
            </div>
          </div>

          {/* CTA Mock Content */}
          <div className="p-6 sm:p-8">
            <div className="max-w-2xl space-y-3">
              <h4 className="text-xl sm:text-2xl font-black leading-tight text-white">
                {siteConfig.ctaHeading || 'Đồng Hành Cùng SFN'}
              </h4>
              <p className="text-xs sm:text-sm text-sky-100 leading-relaxed font-normal">
                {siteConfig.ctaSubtext || 'Dù bạn là sinh viên tìm kiếm môi trường rèn luyện, tình nguyện viên đam mê cống hiến, hay đơn vị đối tác mong muốn hợp tác bền vững — SFN luôn chào đón bạn!'}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <span className="px-5 py-2.5 bg-white text-[#0284C7] font-black text-xs rounded-xl shadow-md flex items-center gap-1.5">
                  <span>{siteConfig.ctaButtonText || 'Đăng ký Tham gia Ngay'}</span>
                  <ArrowRight size={13} />
                </span>
                <span className="px-5 py-2.5 bg-white/20 text-white font-bold text-xs rounded-xl border border-white/30">
                  {siteConfig.ctaSecondaryButtonText || 'Tìm hiểu Trung tâm SFEC'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            KHỐI 6: CHÂN TRANG (FOOTER SECTION)
            Rà soát đầy đủ và chính xác với cấu trúc Footer.tsx
        ======================================================== */}
        <div
          id="layout-block-footer"
          onClick={openFooterModal}
          className="group relative rounded-3xl border-2 bg-gradient-to-b from-[#0A2558] via-[#081F4B] to-[#051433] text-white border-sky-900 hover:border-sky-600 hover:shadow-xl transition-all duration-200 cursor-pointer overflow-hidden"
        >
          {/* Header */}
          <div className="bg-black/30 border-b border-sky-800/60 px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-sky-500 text-white flex items-center justify-center font-black text-xs">
                6
              </span>
              <div>
                <span className="text-xs font-black uppercase tracking-wider block text-sky-300">
                  Chân Trang (Footer)
                </span>
                <span className="text-[11px] text-slate-300 font-medium">
                  Cấu trúc 3 cột: Thương hiệu/Giới thiệu • Điều hướng • Thông tin liên hệ, Mạng xã hội & Bản quyền
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                id="btn-edit-footer"
                onClick={openFooterModal}
                className="px-3.5 py-1.5 bg-sky-500 hover:bg-sky-400 text-white text-xs font-extrabold rounded-xl transition flex items-center gap-1.5 shadow-2xs"
              >
                <Edit3 size={13} />
                <span>Chỉnh sửa chân trang</span>
              </button>
            </div>
          </div>

          {/* Footer Full Mock Content (Chuẩn xác theo Footer.tsx) */}
          <div className="p-6 sm:p-8 space-y-7">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-start">
              
              {/* Col 1: Brand & About (5 cols) */}
              <div className="lg:col-span-5 space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00A3FF] to-[#2563EB] flex items-center justify-center font-black text-xl text-white shadow-md shadow-sky-500/25">
                    S
                  </div>
                  <div>
                    <span className="font-extrabold text-base tracking-tight block text-white">
                      {siteConfig.siteName || 'Sky First Network'}
                    </span>
                    <span className="text-[11px] text-sky-300 font-medium block">
                      {siteConfig.footerSlogan || 'Mạng lưới Giáo dục & Phát triển Cộng đồng'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-normal max-w-md">
                  {siteConfig.footerAboutText || 'Hệ sinh thái phi lợi nhuận kết nối tri thức, đào tạo kỹ năng thực hành và kiến tạo các giải pháp phụng sự cộng đồng bền vững cho thế hệ trẻ Việt Nam.'}
                </p>

                <div className="flex flex-wrap gap-2 pt-1 text-xs">
                  <span className="px-3 py-1.5 rounded-xl bg-sky-500/20 text-sky-200 border border-sky-400/30 font-bold">
                    {siteConfig.footerCertBadgeText || 'Tra cứu Giấy chứng nhận'}
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                    {siteConfig.footerUnitsBadgeText || 'Đơn vị trực thuộc'}
                  </span>
                </div>
              </div>

              {/* Col 2: Navigation Links (3 cols) */}
              <div className="lg:col-span-3 space-y-2.5">
                <div className="text-xs font-black text-sky-400 uppercase tracking-wider">
                  Chuyên Mục
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  <li>• Trang chủ</li>
                  <li>• Giới thiệu Sky First Network</li>
                  <li>• Chương trình hoạt động</li>
                  <li>• Các đơn vị trực thuộc</li>
                  <li>• Tin tức & Hoạt động</li>
                  <li>• Tra cứu Giấy chứng nhận điện tử</li>
                  <li>• Tài trợ & Đồng hành</li>
                </ul>
              </div>

              {/* Col 3: Contact Info & Socials (4 cols) */}
              <div className="lg:col-span-4 space-y-3">
                <div className="text-xs font-black text-sky-400 uppercase tracking-wider">
                  Liên Hệ & Trụ Sở
                </div>
                
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-[#38BDF8]" />
                    <span><strong>Email:</strong> {siteConfig.email || 'skyfirst.ec@gmail.com'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-emerald-400" />
                    <span><strong>Hotline:</strong> {siteConfig.hotline || '0337 775 329'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-rose-400" />
                    <span><strong>Văn phòng:</strong> {siteConfig.address || 'Hà Nội & TP. Hồ Chí Minh, Việt Nam'}</span>
                  </div>
                </div>

                {/* Social media previews */}
                <div className="flex items-center gap-2 pt-1 text-[11px]">
                  <span className="px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-200 border border-sky-400/30 font-bold">
                    Facebook
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-sky-600/20 text-sky-200 border border-sky-500/30 font-bold">
                    LinkedIn
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-200 border border-rose-400/30 font-bold">
                    YouTube
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 font-bold">
                    Zalo
                  </span>
                </div>
              </div>

            </div>

            {/* Bottom bar */}
            <div className="pt-4 border-t border-sky-900/60 text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div>
                {siteConfig.footerCopyright || '© 2026 Sky First Network. Bản quyền nội dung thuộc về SFN Việt Nam. 100% Phi lợi nhuận & Vì cộng đồng.'}
              </div>
              <div className="flex items-center gap-3 text-sky-300">
                <span>Chính sách bảo mật</span>
                <span>•</span>
                <span>Quy chế hoạt động</span>
                <span>•</span>
                <span>Quản trị</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================
          HỘP THOẠI 1: CHỈNH SỬA ĐẦU TRANG (HERO SECTION)
      ======================================================== */}
      {activeModal === 'hero' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center font-bold">
                  <Layout size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Chỉnh Sửa Phần Đầu Trang (Hero)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Cập nhật các thông tin văn bản, liên kết và ảnh banner xuất hiện đầu tiên trên trang chủ
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 py-5 max-h-[65vh] overflow-y-auto pr-1">
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700">
                  Huy hiệu đầu trang (Badge nhỏ trên cùng)
                </label>
                <input
                  type="text"
                  value={heroDraft.heroBadge}
                  onChange={(e) => setHeroDraft({ ...heroDraft, heroBadge: e.target.value })}
                  placeholder="Ví dụ: Mạng Lưới Giáo Dục & Phát Triển Cộng Đồng Hàng Đầu"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700">
                  Tiêu đề chính (Heading H1) *
                </label>
                <textarea
                  rows={2}
                  value={heroDraft.heroHeading}
                  onChange={(e) => setHeroDraft({ ...heroDraft, heroHeading: e.target.value })}
                  placeholder="Nhập tiêu đề lớn gây ấn tượng..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700">
                  Đoạn mô tả ngắn (Subtext)
                </label>
                <textarea
                  rows={3}
                  value={heroDraft.heroSubtext}
                  onChange={(e) => setHeroDraft({ ...heroDraft, heroSubtext: e.target.value })}
                  placeholder="Mô tả tầm nhìn, sứ mệnh của mạng lưới SFN..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700">
                  URL Hình ảnh Banner Hoạt động (Tỉ lệ 16:9)
                </label>
                <input
                  type="text"
                  value={heroDraft.heroImageUrl}
                  onChange={(e) => setHeroDraft({ ...heroDraft, heroImageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                {heroDraft.heroImageUrl && (
                  <div className="mt-2 h-24 w-44 rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                    <img
                      src={heroDraft.heroImageUrl}
                      alt="Hero Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  Cấu hình các nút bấm hành động
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">Tên Nút 1 (Chính)</label>
                    <input
                      type="text"
                      value={heroDraft.heroButton1Text}
                      onChange={(e) => setHeroDraft({ ...heroDraft, heroButton1Text: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">Liên kết Nút 1</label>
                    <input
                      type="text"
                      value={heroDraft.heroButton1Url}
                      onChange={(e) => setHeroDraft({ ...heroDraft, heroButton1Url: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">Tên Nút 2 (Tra cứu)</label>
                    <input
                      type="text"
                      value={heroDraft.heroButton2Text}
                      onChange={(e) => setHeroDraft({ ...heroDraft, heroButton2Text: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">Liên kết Nút 2</label>
                    <input
                      type="text"
                      value={heroDraft.heroButton2Url}
                      onChange={(e) => setHeroDraft({ ...heroDraft, heroButton2Url: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">Tên Nút 3 (Tham gia)</label>
                    <input
                      type="text"
                      value={heroDraft.heroButton3Text}
                      onChange={(e) => setHeroDraft({ ...heroDraft, heroButton3Text: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">Liên kết Nút 3</label>
                    <input
                      type="text"
                      value={heroDraft.heroButton3Url}
                      onChange={(e) => setHeroDraft({ ...heroDraft, heroButton3Url: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                id="btn-save-hero-modal"
                onClick={handleSaveHero}
                className="px-5 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-black rounded-xl transition flex items-center gap-1.5 shadow-md shadow-sky-500/25"
              >
                <Save size={14} />
                <span>Lưu thay đổi Đầu trang</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          HỘP THOẠI 2: CHỈNH SỬA 4 CHỈ SỐ THỐNG KÊ (STATS)
      ======================================================== */}
      {activeModal === 'stats' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center font-bold">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Chỉnh Sửa 4 Chỉ Số Thống Kê Tác Động
                  </h3>
                  <p className="text-xs text-slate-500">
                    Chỉnh sửa giá trị số, nhãn tiêu đề và mô tả phụ của 4 thẻ thống kê hiển thị trên trang chủ
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-6 py-5 max-h-[65vh] overflow-y-auto pr-1">
              
              {/* Stat 1: Members (Sky) */}
              <div className="p-4 rounded-2xl border border-sky-200 bg-sky-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#0284C7] uppercase">
                    1. Thẻ Xanh Dương (Thành Viên / TNV)
                  </span>
                  <span className="text-[11px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-lg">
                    Sky Theme
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Giá trị số lớn *</label>
                    <input
                      type="text"
                      value={statsDraft.membersCount}
                      onChange={(e) => setStatsDraft({ ...statsDraft, membersCount: e.target.value })}
                      placeholder="0"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Nhãn tiêu đề</label>
                    <input
                      type="text"
                      value={statsDraft.membersLabel}
                      onChange={(e) => setStatsDraft({ ...statsDraft, membersLabel: e.target.value })}
                      placeholder="Thành viên & Tình nguyện viên"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Đoạn mô tả phụ</label>
                    <input
                      type="text"
                      value={statsDraft.membersSubtext}
                      onChange={(e) => setStatsDraft({ ...statsDraft, membersSubtext: e.target.value })}
                      placeholder="Đang mở đơn kết nối thành viên"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Stat 2: Provinces (Emerald) */}
              <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-800 uppercase">
                    2. Thẻ Xanh Lục (Điểm Trường / Tỉnh Thành)
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg">
                    Emerald Theme
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Giá trị số lớn *</label>
                    <input
                      type="text"
                      value={statsDraft.provincesCount}
                      onChange={(e) => setStatsDraft({ ...statsDraft, provincesCount: e.target.value })}
                      placeholder="0"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Nhãn tiêu đề</label>
                    <input
                      type="text"
                      value={statsDraft.provincesLabel}
                      onChange={(e) => setStatsDraft({ ...statsDraft, provincesLabel: e.target.value })}
                      placeholder="Điểm trường kết nối"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Đoạn mô tả phụ</label>
                    <input
                      type="text"
                      value={statsDraft.provincesSubtext}
                      onChange={(e) => setStatsDraft({ ...statsDraft, provincesSubtext: e.target.value })}
                      placeholder="Sẵn sàng khởi động năm 2026"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Stat 3: Hours (Amber) */}
              <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-800 uppercase">
                    3. Thẻ Vàng Cam (Giờ Tình Nguyện)
                  </span>
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-lg">
                    Amber Theme
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Giá trị số lớn *</label>
                    <input
                      type="text"
                      value={statsDraft.volunteerHours}
                      onChange={(e) => setStatsDraft({ ...statsDraft, volunteerHours: e.target.value })}
                      placeholder="0"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Nhãn tiêu đề</label>
                    <input
                      type="text"
                      value={statsDraft.hoursLabel}
                      onChange={(e) => setStatsDraft({ ...statsDraft, hoursLabel: e.target.value })}
                      placeholder="Giờ tình nguyện cống hiến"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Đoạn mô tả phụ</label>
                    <input
                      type="text"
                      value={statsDraft.hoursSubtext}
                      onChange={(e) => setStatsDraft({ ...statsDraft, hoursSubtext: e.target.value })}
                      placeholder="Kế hoạch khảo sát địa bàn"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Stat 4: Projects (Rose) */}
              <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-rose-800 uppercase">
                    4. Thẻ Đỏ Hồng (Dự Án & Chiến Dịch)
                  </span>
                  <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-lg">
                    Rose Theme
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Giá trị số lớn *</label>
                    <input
                      type="text"
                      value={statsDraft.communityProjects}
                      onChange={(e) => setStatsDraft({ ...statsDraft, communityProjects: e.target.value })}
                      placeholder="0"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Nhãn tiêu đề</label>
                    <input
                      type="text"
                      value={statsDraft.projectsLabel}
                      onChange={(e) => setStatsDraft({ ...statsDraft, projectsLabel: e.target.value })}
                      placeholder="Dự án & Chiến dịch"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Đoạn mô tả phụ</label>
                    <input
                      type="text"
                      value={statsDraft.projectsSubtext}
                      onChange={(e) => setStatsDraft({ ...statsDraft, projectsSubtext: e.target.value })}
                      placeholder="Bắt đầu ghi nhận giờ hoạt động"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              </div>

            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                id="btn-save-stats-modal"
                onClick={handleSaveStats}
                className="px-5 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-black rounded-xl transition flex items-center gap-1.5 shadow-md shadow-sky-500/25"
              >
                <Save size={14} />
                <span>Lưu 4 chỉ số thống kê</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          HỘP THOẠI 3: CHỈNH SỬA KHỐI 5 TRỤ CỘT (PILLARS)
      ======================================================== */}
      {activeModal === 'pillars' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Chỉnh Sửa Khối 5 Trụ Cột / Lĩnh Vực Trọng Tâm
                  </h3>
                  <p className="text-xs text-slate-500">
                    Cập nhật tiêu đề khối và nội dung của từng trụ cột chiến lược của mạng lưới SFN
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5 py-5 max-h-[65vh] overflow-y-auto pr-1">
              
              {/* Section Header Settings */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  Tiêu đề & Giới thiệu chung của khối
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Tiêu đề khối *</label>
                    <input
                      type="text"
                      value={pillarsConfigDraft.pillarsHeading}
                      onChange={(e) => setPillarsConfigDraft({ ...pillarsConfigDraft, pillarsHeading: e.target.value })}
                      placeholder="Lĩnh Vực Trọng Tâm"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Mô tả ngắn</label>
                    <input
                      type="text"
                      value={pillarsConfigDraft.pillarsSubtext}
                      onChange={(e) => setPillarsConfigDraft({ ...pillarsConfigDraft, pillarsSubtext: e.target.value })}
                      placeholder="Các trụ cột chiến lược định hướng toàn bộ chương trình..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Pillars Tab Selector */}
              <div>
                <label className="text-xs font-black text-slate-800 uppercase tracking-wider block mb-2">
                  Chọn Trụ Cột Để Chỉnh Sửa Chi Tiết (01 - 05)
                </label>
                <div className="flex flex-wrap gap-2">
                  {pillarsItemsDraft.map((p, idx) => (
                    <button
                      key={p.number || idx}
                      type="button"
                      onClick={() => setSelectedPillarIndex(idx)}
                      className={`px-3 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 border ${
                        selectedPillarIndex === idx
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center text-[10px]">
                        {p.number}
                      </span>
                      <span>{p.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Pillar Editor */}
              {pillarsItemsDraft[selectedPillarIndex] && (
                <div className="p-5 rounded-2xl border border-indigo-200 bg-indigo-50/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-black text-xs">
                        Trụ cột {pillarsItemsDraft[selectedPillarIndex].number}
                      </span>
                      <h4 className="text-sm font-black text-indigo-950">
                        {pillarsItemsDraft[selectedPillarIndex].title}
                      </h4>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-700">
                      Tên / Tiêu đề trụ cột *
                    </label>
                    <input
                      type="text"
                      value={pillarsItemsDraft[selectedPillarIndex].title}
                      onChange={(e) => {
                        const next = [...pillarsItemsDraft];
                        next[selectedPillarIndex] = { ...next[selectedPillarIndex], title: e.target.value };
                        setPillarsItemsDraft(next);
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-700">
                      Mô tả ngắn (Hiển thị trực tiếp trên thẻ trang chủ) *
                    </label>
                    <textarea
                      rows={3}
                      value={pillarsItemsDraft[selectedPillarIndex].shortDesc}
                      onChange={(e) => {
                        const next = [...pillarsItemsDraft];
                        next[selectedPillarIndex] = { ...next[selectedPillarIndex], shortDesc: e.target.value };
                        setPillarsItemsDraft(next);
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs leading-relaxed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-700">
                      Mô tả đầy đủ (Full Description)
                    </label>
                    <textarea
                      rows={3}
                      value={pillarsItemsDraft[selectedPillarIndex].fullDesc || ''}
                      onChange={(e) => {
                        const next = [...pillarsItemsDraft];
                        next[selectedPillarIndex] = { ...next[selectedPillarIndex], fullDesc: e.target.value };
                        setPillarsItemsDraft(next);
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs leading-relaxed"
                    />
                  </div>
                </div>
              )}

            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                id="btn-save-pillars-modal"
                onClick={handleSavePillars}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl transition flex items-center gap-1.5 shadow-md shadow-indigo-600/25"
              >
                <Save size={14} />
                <span>Lưu cấu hình 5 Trụ cột</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          HỘP THOẠI 4: CHỈNH SỬA KHỐI HÀNH ĐỘNG (CTA)
      ======================================================== */}
      {activeModal === 'cta' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00A3FF] to-emerald-500 text-white flex items-center justify-center font-bold">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Chỉnh Sửa Khối Hành Động (CTA)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Cập nhật thông điệp kêu gọi tham gia & nút liên kết trên dải banner trang chủ
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 py-5 max-h-[65vh] overflow-y-auto pr-1">
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700">
                  Tiêu đề kêu gọi hành động *
                </label>
                <input
                  type="text"
                  value={ctaDraft.ctaHeading}
                  onChange={(e) => setCtaDraft({ ...ctaDraft, ctaHeading: e.target.value })}
                  placeholder="Ví dụ: Đồng Hành Cùng SFN"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700">
                  Lời kêu gọi chi tiết
                </label>
                <textarea
                  rows={3}
                  value={ctaDraft.ctaSubtext}
                  onChange={(e) => setCtaDraft({ ...ctaDraft, ctaSubtext: e.target.value })}
                  placeholder="Dù bạn là sinh viên tìm kiếm môi trường rèn luyện..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  Nút hành động
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">Tên Nút chính</label>
                    <input
                      type="text"
                      value={ctaDraft.ctaButtonText}
                      onChange={(e) => setCtaDraft({ ...ctaDraft, ctaButtonText: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">Đường dẫn Nút chính</label>
                    <input
                      type="text"
                      value={ctaDraft.ctaButtonUrl}
                      onChange={(e) => setCtaDraft({ ...ctaDraft, ctaButtonUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">Tên Nút phụ</label>
                    <input
                      type="text"
                      value={ctaDraft.ctaSecondaryButtonText}
                      onChange={(e) => setCtaDraft({ ...ctaDraft, ctaSecondaryButtonText: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">Đường dẫn Nút phụ</label>
                    <input
                      type="text"
                      value={ctaDraft.ctaSecondaryButtonUrl}
                      onChange={(e) => setCtaDraft({ ...ctaDraft, ctaSecondaryButtonUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                id="btn-save-cta-modal"
                onClick={handleSaveCta}
                className="px-5 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-black rounded-xl transition flex items-center gap-1.5 shadow-md shadow-sky-500/25"
              >
                <Save size={14} />
                <span>Lưu khối hành động</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          HỘP THOẠI 5: CHỈNH SỬA CHÂN TRANG (FOOTER)
          Được rà soát đầy đủ và chuẩn xác theo cấu trúc Footer.tsx
      ======================================================== */}
      {activeModal === 'footer' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                  <Globe size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Chỉnh Sửa Chân Trang (Footer)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Cập nhật đầy đủ thông tin thương hiệu, liên hệ, mạng xã hội và bản quyền
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 py-5 max-h-[65vh] overflow-y-auto pr-1">
              
              {/* Tên & Slogan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-700">Tên Mạng Lưới (Site Name)</label>
                  <input
                    type="text"
                    value={footerDraft.siteName}
                    onChange={(e) => setFooterDraft({ ...footerDraft, siteName: e.target.value })}
                    placeholder="Sky First Network"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-700">Khẩu hiệu chân trang (Slogan)</label>
                  <input
                    type="text"
                    value={footerDraft.footerSlogan}
                    onChange={(e) => setFooterDraft({ ...footerDraft, footerSlogan: e.target.value })}
                    placeholder="Mạng lưới Giáo dục & Phát triển Cộng đồng"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              {/* Giới thiệu ngắn */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700">
                  Đoạn giới thiệu ngắn ở chân trang (About Text)
                </label>
                <textarea
                  rows={3}
                  value={footerDraft.footerAboutText}
                  onChange={(e) => setFooterDraft({ ...footerDraft, footerAboutText: e.target.value })}
                  placeholder="Hệ sinh thái phi lợi nhuận kết nối tri thức..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs leading-relaxed"
                />
              </div>

              {/* 2 Nút Huy hiệu */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Nhãn nút Chứng nhận</label>
                  <input
                    type="text"
                    value={footerDraft.footerCertBadgeText}
                    onChange={(e) => setFooterDraft({ ...footerDraft, footerCertBadgeText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Nhãn nút Đơn vị</label>
                  <input
                    type="text"
                    value={footerDraft.footerUnitsBadgeText}
                    onChange={(e) => setFooterDraft({ ...footerDraft, footerUnitsBadgeText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              {/* Thông tin liên hệ trực tiếp ở cột 3 của Chân trang */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  Thông Tin Liên Hệ Ở Chân Trang
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">Email chính thức</label>
                    <input
                      type="text"
                      value={footerDraft.email}
                      onChange={(e) => setFooterDraft({ ...footerDraft, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">Hotline</label>
                    <input
                      type="text"
                      value={footerDraft.hotline}
                      onChange={(e) => setFooterDraft({ ...footerDraft, hotline: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Địa chỉ / Văn phòng</label>
                  <input
                    type="text"
                    value={footerDraft.address}
                    onChange={(e) => setFooterDraft({ ...footerDraft, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              {/* Mạng xã hội */}
              <div className="pt-3 border-t border-slate-100 space-y-2.5">
                <div className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  Liên kết Mạng xã hội ở Chân trang
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">Facebook URL</label>
                    <input
                      type="text"
                      value={footerDraft.footerSocialFacebook}
                      onChange={(e) => setFooterDraft({ ...footerDraft, footerSocialFacebook: e.target.value })}
                      placeholder="https://facebook.com/..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">LinkedIn URL</label>
                    <input
                      type="text"
                      value={footerDraft.footerSocialLinkedin}
                      onChange={(e) => setFooterDraft({ ...footerDraft, footerSocialLinkedin: e.target.value })}
                      placeholder="https://linkedin.com/..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">YouTube URL</label>
                    <input
                      type="text"
                      value={footerDraft.footerSocialYoutube}
                      onChange={(e) => setFooterDraft({ ...footerDraft, footerSocialYoutube: e.target.value })}
                      placeholder="https://youtube.com/..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">Zalo Hotline URL</label>
                    <input
                      type="text"
                      value={footerDraft.footerSocialZalo}
                      onChange={(e) => setFooterDraft({ ...footerDraft, footerSocialZalo: e.target.value })}
                      placeholder="https://zalo.me/..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Bản quyền */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-extrabold text-slate-700">
                  Dòng chữ bản quyền (Copyright dòng cuối cùng)
                </label>
                <input
                  type="text"
                  value={footerDraft.footerCopyright}
                  onChange={(e) => setFooterDraft({ ...footerDraft, footerCopyright: e.target.value })}
                  placeholder="© 2026 Sky First Network. Bản quyền nội dung thuộc về SFN Việt Nam."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                />
              </div>

            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                id="btn-save-footer-modal"
                onClick={handleSaveFooter}
                className="px-5 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-black rounded-xl transition flex items-center gap-1.5 shadow-md shadow-sky-500/25"
              >
                <Save size={14} />
                <span>Lưu thay đổi Chân trang</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          HỘP THOẠI 6: THÔNG BÁO QUẢN LÝ ẨN/HIỆN (INFO ONLY DIALOG)
          Tuân thủ quy tắc 3: Chương trình, Đơn vị, Tin tức
          chỉ có ẩn/hiện, không có trình chỉnh sửa tại đây.
      ======================================================== */}
      {activeModal === 'info-only' && infoTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              {infoTarget.icon}
            </div>

            <h3 className="text-base font-black text-slate-900 mb-1.5">
              {infoTarget.title}
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed mb-5">
              {infoTarget.description}
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 mb-5 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-800">
                  Trạng thái trên trang chủ
                </div>
                <div className="text-[11px] text-slate-500">
                  {homeSections[infoTarget.id] !== false
                    ? 'Đang bật hiển thị'
                    : 'Đang tạm ẩn'}
                </div>
              </div>

              <button
                type="button"
                id={`modal-toggle-${infoTarget.id}`}
                onClick={() => toggleSection(infoTarget.id)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 shadow-2xs ${
                  homeSections[infoTarget.id] !== false
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                }`}
              >
                {homeSections[infoTarget.id] !== false ? (
                  <>
                    <Eye size={14} />
                    <span>Đang hiện</span>
                  </>
                ) : (
                  <>
                    <EyeOff size={14} />
                    <span>Đang ẩn</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setActiveModal(null);
                  setInfoTarget(null);
                }}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Đóng
              </button>

              {onSwitchTab && (
                <button
                  type="button"
                  id={`btn-go-to-${infoTarget.tabTarget}`}
                  onClick={() => {
                    setActiveModal(null);
                    onSwitchTab(infoTarget.tabTarget);
                  }}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl transition flex items-center gap-1.5 shadow-xs"
                >
                  <span>Mở mục "{infoTarget.title.replace('Mục: ', '')}"</span>
                  <ArrowRight size={13} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
