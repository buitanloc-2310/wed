import React from 'react';
import { 
  UserPlus, 
  HeartHandshake, 
  Building2, 
  CheckCircle2, 
  Sparkles, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight,
  ChevronRight,
  FileText
} from 'lucide-react';
import { motion } from 'motion/react';
import { PageRoute } from '../types';
import { useDataContext } from '../context/DataContext';

interface JoinPageProps {
  onShowToast: (msg: string) => void;
  onNavigate: (page: PageRoute) => void;
}

export const JoinPage: React.FC<JoinPageProps> = ({ onShowToast, onNavigate }) => {
  const { customPages } = useDataContext();
  const pageData = customPages.find(p => p.slug === 'join' || p.id === 'page-join');

  const badgeText = pageData?.badge || 'SFN MEMBERSHIP & PARTNERSHIP';
  const titleText = pageData?.title || 'Gia Nhập Mạng Lưới Sky First';
  const subtitleText = pageData?.summary || 'Dù bạn muốn cống hiến với vai trò Tình nguyện viên, rèn luyện kỹ năng cùng Ban Điều Hành Core Team, hay kết nối đối tác tổ chức — SFN luôn mở rộng vòng tay chào đón.';
  
  const rolesHeading = pageData?.joinRolesHeading || 'Các Nhóm Đối Tượng Tham Gia Sky First Network';
  const rolesSubtitle = pageData?.joinRolesSubtitle || 'Lựa chọn hình thức đóng góp và đồng hành phù hợp với năng lực và mục tiêu cá nhân';

  const hotline = pageData?.joinHotline || '0337 775 329';
  const hotlineTitle = pageData?.joinHotlineTitle || 'Hotline Điều Phối';
  const email = pageData?.joinEmail || 'tuyendung@skyfirst.io.vn';
  const emailTitle = pageData?.joinEmailTitle || 'Email Tuyển Dụng & Nhân Sự';
  const address = pageData?.joinAddress || 'Hà Nội & TP. Hồ Chí Minh, Việt Nam';
  const addressTitle = pageData?.joinAddressTitle || 'Văn Phòng Mạng Lưới';

  const ctaHeading = pageData?.joinCtaHeading || 'Bạn Cần Trao Đổi Chi Tiết Về Cơ Hội Gia Nhập Hoặc Đề Xuất Dự Án?';
  const ctaDescription = pageData?.joinCtaDescription || 'Hệ thống tiếp nhận hồ sơ tập trung của Ban Nhân Sự & Đối Ngoại SFN sẵn sàng hỗ trợ phản hồi trong vòng 24 giờ làm việc.';
  const ctaButtonLabel = pageData?.joinCtaButtonLabel || 'Đến Trang Liên Hệ SFN';
  const ctaButtonUrl = pageData?.joinCtaButtonUrl || '/contact';

  const handleRouteClick = (url?: string) => {
    if (!url) {
      onNavigate('contact');
      return;
    }
    if (url.startsWith('http')) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      const clean = url.replace(/^\//, '') as PageRoute;
      onNavigate(clean || 'contact');
    }
  };

  const roleGroups = [
    {
      id: 'volunteer',
      title: pageData?.joinRole1Title || 'Tình Nguyện Viên Chiến Dịch (SFYC)',
      tag: pageData?.joinRole1Tag || 'TÌNH NGUYỆN VIÊN',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      iconColor: 'bg-emerald-100 text-emerald-700',
      borderColor: 'border-emerald-200 hover:border-emerald-400',
      btnColor: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20',
      icon: HeartHandshake,
      description: pageData?.joinRole1Description || 'Tham gia trực tiếp các chiến dịch xã hội, mùa hè xanh, tiếp sức mùa thi và các hoạt động cộng đồng vì sự phát triển của thanh thiếu niên.',
      highlights: [
        pageData?.joinRole1Highlight1 || 'Nhận Giấy chứng nhận số SFCA có mã QR định danh toàn quốc',
        pageData?.joinRole1Highlight2 || 'Linh hoạt đăng ký theo từng sự kiện và quỹ thời gian cá nhân',
        pageData?.joinRole1Highlight3 || 'Được tập huấn kỹ năng điều phối, an toàn và sơ cấp cứu thực tế',
        pageData?.joinRole1Highlight4 || 'Môi trường năng động kết nối bạn bè khắp các trường Đại học/THPT'
      ].filter(Boolean),
      period: pageData?.joinRole1Period || 'Linh hoạt theo từng chiến dịch',
      ctaText: pageData?.joinRole1ButtonLabel || 'Đăng Ký Tình Nguyện Viên',
      ctaUrl: pageData?.joinRole1ButtonUrl || '/contact'
    },
    {
      id: 'core_team',
      title: pageData?.joinRole2Title || 'Thành Viên Ban Điều Hành & Core Team',
      tag: pageData?.joinRole2Tag || 'CORE TEAM SFN',
      badgeColor: 'bg-sky-100 text-[#0284C7] border-sky-200',
      iconColor: 'bg-sky-100 text-[#0284C7]',
      borderColor: 'border-sky-200 hover:border-[#0284C7]',
      btnColor: 'bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-sky-500/20',
      icon: UserPlus,
      description: pageData?.joinRole2Description || 'Trực tiếp tham gia quản trị, xây dựng nội dung giáo dục (SFEC), truyền thông thương hiệu (SFMC), hoặc nghiên cứu chuyển đổi số (SFIR).',
      highlights: [
        pageData?.joinRole2Highlight1 || 'Được rèn luyện tư duy lãnh đạo, quản trị dự án chuyên nghiệp',
        pageData?.joinRole2Highlight2 || 'Chứng nhận bổ nhiệm và thư giới thiệu từ Ban Lãnh đạo SFN',
        pageData?.joinRole2Highlight3 || 'Đào tạo nội bộ chuyên sâu cùng các cố vấn và chuyên gia đầu ngành',
        pageData?.joinRole2Highlight4 || 'Cơ hội đại diện SFN tham dự các diễn đàn và hội nghị quốc gia'
      ].filter(Boolean),
      period: pageData?.joinRole2Period || 'Nhiệm kỳ cam kết 06 - 12 tháng',
      ctaText: pageData?.joinRole2ButtonLabel || 'Ứng Tuyển Ban Điều Hành',
      ctaUrl: pageData?.joinRole2ButtonUrl || '/contact'
    },
    {
      id: 'partner',
      title: pageData?.joinRole3Title || 'Tổ Chức Đối Tác & Bảo Trợ Đồng Hành',
      tag: pageData?.joinRole3Tag || 'ĐỐI TÁC CHIẾN LƯỢC',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      iconColor: 'bg-amber-100 text-amber-700',
      borderColor: 'border-amber-200 hover:border-amber-400',
      btnColor: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/20',
      icon: Building2,
      description: pageData?.joinRole3Description || 'Dành cho CLB/Đội/Nhóm, Đoàn Thanh niên, các trường THPT, Đại học và Doanh nghiệp mong muốn kết nối nguồn lực cùng phát triển cộng đồng.',
      highlights: [
        pageData?.joinRole3Highlight1 || 'Đồng tổ chức các sự kiện giáo dục, hướng nghiệp quy mô lớn',
        pageData?.joinRole3Highlight2 || 'Bảo trợ kỹ thuật xác thực chứng nhận số miễn phí qua hệ thống SFCA',
        pageData?.joinRole3Highlight3 || 'Tối ưu hóa nguồn lực truyền thông đa kênh tiếp cận học sinh - sinh viên',
        pageData?.joinRole3Highlight4 || 'Hỗ trợ kết nối chuyên gia, diễn giả và ban giám khảo chất lượng'
      ].filter(Boolean),
      period: pageData?.joinRole3Period || 'Hợp tác thường niên / Theo MOU',
      ctaText: pageData?.joinRole3ButtonLabel || 'Gửi Đề Xuất Hợp Tác',
      ctaUrl: pageData?.joinRole3ButtonUrl || '/contact'
    }
  ];

  return (
    <div className="space-y-12 py-6 sm:py-10">
      {/* 1. Header Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-xs font-black text-[#0284C7] shadow-2xs">
            <Sparkles size={14} className="text-[#0284C7]" />
            <span>{badgeText}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            {titleText}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
            {subtitleText}
          </p>
        </div>
      </section>

      {/* 2. 3 NHÓM ĐỐI TƯỢNG GIA NHẬP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Heading & Subtitle */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {rolesHeading}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            {rolesSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {roleGroups.map((group) => {
            const GroupIcon = group.icon;
            return (
              <motion.div
                key={group.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className={`flex flex-col justify-between bg-white rounded-3xl p-6 sm:p-8 border shadow-xs transition-all duration-200 ${group.borderColor}`}
              >
                <div className="space-y-5">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${group.iconColor}`}>
                      <GroupIcon size={24} />
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${group.badgeColor}`}>
                      {group.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                      {group.title}
                    </h3>
                    <div className="text-xs text-slate-500 font-semibold mt-1">
                      Thời gian: {group.period}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {group.description}
                  </p>

                  {/* Highlights */}
                  {group.highlights.length > 0 && (
                    <div className="space-y-2.5 pt-3 border-t border-slate-100">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Quyền lợi & Điểm nổi bật:
                      </h4>
                      <div className="space-y-2">
                        {group.highlights.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                            <CheckCircle2 size={15} className="text-[#0284C7] flex-shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card CTA */}
                <div className="pt-6 mt-6 border-t border-slate-100">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleRouteClick(group.ctaUrl)}
                    className={`w-full py-3 px-4 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-xs cursor-pointer ${group.btnColor}`}
                  >
                    <span>{group.ctaText}</span>
                    <ArrowRight size={15} />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. Quy Chế / Hướng Dẫn Bổ Sung (Nếu có nội dung format) */}
      {pageData?.contentFormatted && pageData.contentFormatted.trim().length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900">
              <FileText size={18} className="text-[#0284C7]" />
              <h3 className="text-base sm:text-lg font-black">
                Quy Chế & Hướng Dẫn Gia Nhập Chi Tiết
              </h3>
            </div>
            {pageData.contentFormatted.includes('<') ? (
              <div
                className="formatted-content prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: pageData.contentFormatted }}
              />
            ) : (
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 whitespace-pre-line">
                {pageData.contentFormatted}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 4. THÔNG TIN KẾT NỐI TẬP TRUNG (CTA Banner) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 border border-sky-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              {ctaHeading}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              {ctaDescription}
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => handleRouteClick(ctaButtonUrl)}
            className="flex-shrink-0 px-6 py-3.5 bg-[#0284C7] hover:bg-[#0369A1] text-white font-extrabold text-xs sm:text-sm rounded-xl transition shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <span>{ctaButtonLabel}</span>
            <ChevronRight size={16} />
          </motion.button>
        </div>
      </section>

      {/* 5. CONTACT INFO (3 Thẻ Liên Hệ Tiếp Nhận) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-center">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1.5 shadow-2xs">
            <Mail size={20} className="mx-auto text-[#0284C7]" />
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">{emailTitle}</h4>
            <p className="text-xs text-slate-600 font-mono">{email}</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1.5 shadow-2xs">
            <Phone size={20} className="mx-auto text-emerald-600" />
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">{hotlineTitle}</h4>
            <p className="text-xs text-slate-600 font-mono">{hotline}</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1.5 shadow-2xs">
            <MapPin size={20} className="mx-auto text-rose-500" />
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">{addressTitle}</h4>
            <p className="text-xs text-slate-600">{address}</p>
          </div>
        </div>
      </section>
    </div>
  );
};
