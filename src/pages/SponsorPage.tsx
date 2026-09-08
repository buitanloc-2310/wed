import React, { useState } from 'react';
import { 
  HeartHandshake, 
  ShieldCheck, 
  Award, 
  FileText, 
  Sparkles, 
  Copy, 
  Check, 
  ArrowRight, 
  Building, 
  GraduationCap, 
  Users, 
  TrendingUp, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  Phone, 
  Mail, 
  Gift, 
  CheckCircle2,
  Download,
  QrCode
} from 'lucide-react';
import { motion } from 'motion/react';
import { PageRoute } from '../types';
import { useDataContext } from '../context/DataContext';

interface SponsorPageProps {
  onNavigate: (page: PageRoute) => void;
  onShowToast: (msg: string) => void;
}

export const SponsorPage: React.FC<SponsorPageProps> = ({ onNavigate, onShowToast }) => {
  const { customPages } = useDataContext();
  const pageData = customPages.find(p => p.slug === 'sponsor' || p.id === 'page-sponsor');
  const badgeText = pageData?.badge || 'TÀI TRỢ & ĐỒNG HÀNH DOANH NGHIỆP';
  const titleText = pageData?.title || 'Tài TrỢ & Đồng Hành Cùng SFN';
  const subtitleText = pageData?.summary || 'Mạng lưới SFN trân trọng mọi sự chung tay từ Quý Doanh nghiệp, Tổ chức và Nhà hảo tâm nhằm thắp sáng ước mơ cho thế hệ trẻ Việt Nam.';

  // Hero Buttons
  const heroPrimaryButtonLabel = pageData?.sponsorHeroPrimaryButtonLabel || 'Đăng Ký Tài Trợ Ngay';
  const heroPrimaryButtonUrl = pageData?.sponsorHeroPrimaryButtonUrl || '/contact';
  const heroSecondaryButtonLabel = pageData?.sponsorHeroSecondaryButtonLabel || 'Thông Tin Chuyển Khoản';
  const heroSecondaryButtonUrl = pageData?.sponsorHeroSecondaryButtonUrl || '#thong-tin-chuyen-khoan';

  // 2. Commitments
  const commitmentHeading = pageData?.sponsorCommitmentHeading || '4 Cam Kết Minh Bạch Dành Cho Nhà Tài Trợ';
  const commitmentSubtitle = pageData?.sponsorCommitmentSubtitle || 'Mọi nguồn lực quý báu được quý đối tác gửi gắm đều được quản lý với tiêu chuẩn trách nhiệm cao nhất.';
  const commit1Title = pageData?.sponsorCommit1Title || '100% Sao Kê Công Khai';
  const commit1Desc = pageData?.sponsorCommit1Desc || 'Cập nhật thu - chi rõ ràng theo từng dự án cụ thể, lưu trữ chứng từ hóa đơn đầy đủ và minh bạch.';
  const commit2Title = pageData?.sponsorCommit2Title || 'Chứng Nhận Số SFCA';
  const commit2Desc = pageData?.sponsorCommit2Desc || 'Cấp Giấy chứng nhận tri ân điện tử có mã định danh và QR code quét tra cứu trực tuyến toàn quốc.';
  const commit3Title = pageData?.sponsorCommit3Title || 'Báo Cáo Tác Động Thực';
  const commit3Desc = pageData?.sponsorCommit3Desc || 'Gửi tận tay nhà tài trợ báo cáo hình ảnh, video và số liệu thụ hưởng thực tế sau khi dự án hoàn thành.';
  const commit4Title = pageData?.sponsorCommit4Title || 'Lan Tỏa Truyền Thông';
  const commit4Desc = pageData?.sponsorCommit4Desc || 'Đồng hành cùng Trung tâm Truyền thông SFMC để tôn vinh những nghĩa cử nhân văn đến cộng đồng người trẻ.';

  // 3. Packages
  const packagesHeading = pageData?.sponsorPackagesHeading || 'Các Hình Thức Đồng Hành Cùng SFN';
  const packagesSubtitle = pageData?.sponsorPackagesSubtitle || 'Lựa chọn hình thức đóng góp phù hợp với định hướng phát triển và trách nhiệm xã hội của bạn';

  // 4. Bank details & lead
  const bankName = pageData?.sponsorBankName || 'Ngân hàng Quân Đội (MB Bank)';
  const bankAccount = pageData?.sponsorBankAccount || '0337775329';
  const accountHolder = pageData?.sponsorAccountHolder || 'Sky First Network';
  const bankBranch = pageData?.sponsorBankBranch || 'Chi nhánh TP. Hồ Chí Minh';
  const transferSyntax = pageData?.sponsorTransferSyntax || 'TAITRO [HọTên/TênDoanhNghiệp] [SốĐiệnThoại]';
  const copyButtonLabel = pageData?.sponsorCopyButtonLabel || 'Sao chép';
  const hotline = pageData?.sponsorHotline || '0337 775 329';
  const email = pageData?.sponsorEmail || 'sponsor@skyfirst.io.vn';
  const sponsorContactLeadTitle = pageData?.sponsorContactLeadTitle || 'Ban Đối Ngoại & Hợp Tác SFN';

  // QR Code Chuyển Khoản
  const sponsorQrCodeUrl = pageData?.sponsorQrCodeUrl ?? 'https://img.vietqr.io/image/MB-0337775329-compact2.png?amount=0&addInfo=TAITRO%20SFN&accountName=SKY%20FIRST%20NETWORK';
  const sponsorQrCodeTitle = pageData?.sponsorQrCodeTitle || 'VietQR Chuyển Khoản Nhanh';
  const sponsorQrCodeSubtitle = pageData?.sponsorQrCodeSubtitle || 'Quét bằng mọi ứng dụng Ngân hàng & Ví điện tử';

  // 5. Contact Section
  const sponsorContactHeading = pageData?.sponsorContactHeading || 'Đồng Hành & Hợp Tác Cùng SFN';
  const sponsorContactDescription = pageData?.sponsorContactDescription || 'Quý Doanh nghiệp, Tổ chức và Quý Nhà tài trợ vui lòng liên hệ trực tiếp với Ban Đối Ngoại & Tài Chính SFN để nhận hồ sơ dự án chi tiết, bảng dự toán ngân sách và thỏa thuận bảo trợ quyền lợi.';
  const sponsorContactButtonLabel = pageData?.sponsorContactButtonLabel || 'Gửi Đề Xuất Tại Trang Liên Hệ';
  const sponsorContactButtonUrl = pageData?.sponsorContactButtonUrl || '/contact';
  const sponsorUnitsButtonLabel = pageData?.sponsorUnitsButtonLabel || 'Xem Chi Tiết 5 Đơn Vị';
  const sponsorUnitsButtonUrl = pageData?.sponsorUnitsButtonUrl || '/units';
  const sponsorContactHotline = pageData?.sponsorContactHotline || '0912.838.xxx';
  const sponsorContactEmail = pageData?.sponsorContactEmail || 'sponsor@skyfirst.network';

  // 6. FAQs
  const faqHeading = pageData?.sponsorFaqHeading || 'Câu Hỏi Thường Gặp Về Tài Trợ SFN';
  const faqSubtitle = pageData?.sponsorFaqSubtitle || 'GIẢI ĐÁP THẮC MẮC';

  // 7. Quick CTA
  const sponsorCtaTitle = pageData?.sponsorCtaTitle || 'Bạn muốn trao đổi trực tiếp cùng Ban Điều hành Sky First Network?';
  const sponsorCtaDescription = pageData?.sponsorCtaDescription || 'Vui lòng gọi hotline đối ngoại hoặc đặt lịch hẹn gặp trực tiếp tại văn phòng điều phối SFN.';
  const buttonLabel = pageData?.buttonLabel || 'Xem các đơn vị';
  const buttonUrl = pageData?.buttonUrl || '/units';
  const secondaryButtonLabel = pageData?.secondaryButtonLabel || 'Tham gia Sky First Network';
  const secondaryButtonUrl = pageData?.secondaryButtonUrl || '/join';

  // Bank Copy State
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // FAQ Expand state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    onShowToast(`Đã sao chép ${fieldName} vào bộ nhớ tạm!`);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const sponsorPackages = [
    {
      id: 'scholarship',
      title: pageData?.sponsorPkg1Title || 'Học Bổng Tri Thức & Kỹ Năng',
      badge: pageData?.sponsorPkg1Badge || 'BẢO TRỢ ĐÀO TẠO',
      badgeColor: 'bg-sky-100 text-[#0284C7] border-sky-200',
      icon: GraduationCap,
      unit: pageData?.sponsorPkg1Unit || 'Đồng hành cùng SFEC & SFIR',
      description: pageData?.sponsorPkg1Desc || 'Tài trợ học bổng các khóa đào tạo kỹ năng thực chiến, chuyển đổi số và công nghệ cho học sinh, sinh viên có hoàn cảnh khó khăn hoặc tài năng trẻ.',
      impact: pageData?.sponsorPkg1Impact || '100% học bổng được trao trực tiếp, kèm báo cáo tiến độ học tập của từng học viên.',
      benefits: [
        'Đặt tên học bổng theo thương hiệu Doanh nghiệp / Nhà tài trợ',
        'Cấp Giấy chứng nhận tri ân số SFCA có xác thực điện tử',
        'Tham gia lễ trao học bổng và giao lưu trực tiếp cùng học viên',
        'Ưu tiên tiếp cận hồ sơ tài năng trẻ tốt nghiệp loại giỏi'
      ]
    },
    {
      id: 'volunteer-project',
      title: pageData?.sponsorPkg2Title || 'Chiến Dịch Phụng Sự Cộng Đồng',
      badge: pageData?.sponsorPkg2Badge || 'TÁC ĐỘNG XÃ HỘI',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: Users,
      unit: pageData?.sponsorPkg2Unit || 'Đồng hành cùng SFYC (Tình nguyện)',
      description: pageData?.sponsorPkg2Desc || 'Bảo trợ kinh phí tổ chức các chiến dịch thiện nguyện quy mô lớn: Chiến dịch Mùa Hè Xanh, Tình Nguyện Đông Xuân, Xây dựng Tủ sách Vùng cao và Khám bệnh lưu động.',
      impact: pageData?.sponsorPkg2Impact || 'Trực tiếp mang tri thức, nước sạch và quà tặng thiết thực đến các điểm trường nghèo khó.',
      benefits: [
        'Logo & tên thương hiệu xuất hiện trên toàn bộ đồng phục, áo tình nguyện và băng rôn',
        'Báo cáo kiểm toán & hình ảnh nghiệm thu thực tế sau khi kết thúc chiến dịch',
        'Bài viết tri ân trên các kênh truyền thông chính thức của Trung tâm SFMC',
        'Cơ hội cử nhân sự của quý đơn vị cùng tham gia trải nghiệm thực tế'
      ]
    },
    {
      id: 'in-kind',
      title: pageData?.sponsorPkg3Title || 'Tài Trợ Hiện Vật & Cơ Sở Hạ Tầng',
      badge: pageData?.sponsorPkg3Badge || 'HỖ TRỢ THIẾT BỊ',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: Gift,
      unit: pageData?.sponsorPkg3Unit || 'Đồng hành cùng SFMC & SFCA',
      description: pageData?.sponsorPkg3Desc || 'Hỗ trợ máy tính, thiết bị âm thanh, phòng hội thảo, tài khoản phần mềm, sách giáo khoa hoặc phương tiện di chuyển phục vụ công tác xã hội.',
      impact: pageData?.sponsorPkg3Impact || 'Tối ưu hóa nguồn lực vận hành, nâng cao chất lượng trải nghiệm học tập và công tác thiện nguyện.',
      benefits: [
        'Định giá và quy đổi tương đương thành mức tài trợ chính thức',
        'Ghi nhận hiện vật minh bạch trong Báo cáo thường niên SFN',
        'Đặt banner đối tác tại khu vực diễn ra hội thảo / phòng thực hành',
        'Chứng nhận Hiện vật Đóng góp từ Ban Điều Hành Mạng lưới'
      ]
    },
    {
      id: 'strategic',
      title: pageData?.sponsorPkg4Title || 'Đối Tác Chiến Lược Dài Hạn (MOU)',
      badge: pageData?.sponsorPkg4Badge || 'ĐỒNG HÀNH TOÀN DIỆN',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: TrendingUp,
      unit: pageData?.sponsorPkg4Unit || 'Đồng hành cùng Ban Điều hành Sky First Network',
      description: pageData?.sponsorPkg4Desc || 'Ký kết Biên bản Ghi nhớ (MOU) hợp tác chiến lược theo năm. Đồng tổ chức diễn đàn thanh niên, bảo trợ truyền thông và đặt hàng đề tài nghiên cứu xã hội SFIR.',
      impact: pageData?.sponsorPkg4Impact || 'Xây dựng giá trị Trách nhiệm Xã hội Doanh nghiệp (CSR) bền vững và dài hạn.',
      benefits: [
        'Vị trí Đồng Trưởng Ban Tổ Chức tại các sự kiện cấp Mạng lưới',
        'Quyền ưu tiên tuyển dụng nguồn nhân sự trẻ xuất sắc của SFN',
        'Phối hợp sản xuất phóng sự truyền thông CSR phát sóng đa nền tảng',
        'Đại diện doanh nghiệp phát biểu khai mạc tại các diễn đàn lớn'
      ]
    }
  ];

  const faqs = [
    {
      q: pageData?.sponsorFaq1Q || 'Cá nhân có thể đóng góp hoặc tài trợ cho SFN không?',
      a: pageData?.sponsorFaq1A || 'Hoàn toàn được. SFN trân trọng mọi sự đồng hành từ cá nhân, sinh viên, cựu tình nguyện viên đến các chuyên gia. Bạn có thể ủng hộ theo từng dự án cụ thể hoặc gửi vào Quỹ Phát triển Thanh niên SFN với bất kỳ số tiền nào.'
    },
    {
      q: pageData?.sponsorFaq2Q || 'Làm sao tôi có thể kiểm tra tính minh bạch của số tiền đã tài trợ?',
      a: pageData?.sponsorFaq2A || 'SFN cam kết 100% minh bạch tài chính. Tất cả khoản đóng góp đều được cập nhật vào Bảng thu chi công khai theo thời gian thực. Sau mỗi dự án, Ban Tài chính gửi Báo cáo quyết toán kèm toàn bộ chứng từ hóa đơn và nghiệm thu hình ảnh trực tiếp qua email của nhà tài trợ.'
    },
    {
      q: pageData?.sponsorFaq3Q || 'Nhà tài trợ có được cấp Giấy Chứng Nhận chính thức không?',
      a: pageData?.sponsorFaq3A || 'Có. Toàn bộ nhà tài trợ và đối tác đồng hành đều được Ban Quản lý Chứng nhận Số (SFCA) cấp Giấy Chứng Nhận Tri Ân Điện Tử có mã số định danh riêng và mã QR xác thực trực tuyến tại Cổng Tra cứu Giấy chứng nhận của SFN.'
    },
    {
      q: pageData?.sponsorFaq4Q || 'Doanh nghiệp có được khấu trừ thuế TNDN cho khoản tài trợ này không?',
      a: pageData?.sponsorFaq4A || 'SFN hợp tác với các đơn vị tổ chức xã hội và quỹ hợp pháp được công nhận. Các chương trình tài trợ giáo dục và từ thiện đủ điều kiện theo quy định của pháp luật hiện hành đều có thể xuất biên bản tiếp nhận phục vụ hạch toán chi phí hợp lý.'
    }
  ];

  return (
    <div className="space-y-12 sm:space-y-16 py-6 sm:py-10 overflow-hidden">
      
      {/* 1. Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-xs font-black text-[#0284C7] shadow-2xs">
            <HeartHandshake size={15} className="text-[#0284C7]" />
            <span>{badgeText}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {titleText}
          </h1>

          <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed font-normal">
            {subtitleText}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                if (heroPrimaryButtonUrl.startsWith('http')) {
                  window.open(heroPrimaryButtonUrl, '_blank', 'noopener,noreferrer');
                } else if (heroPrimaryButtonUrl.startsWith('#')) {
                  const el = document.querySelector(heroPrimaryButtonUrl);
                  el?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  onNavigate((heroPrimaryButtonUrl.replace(/^\//, '') || 'contact') as PageRoute);
                }
              }}
              className="px-6 py-3 bg-gradient-to-r from-[#00A3FF] via-[#0284C7] to-[#2563EB] hover:from-[#0284C7] hover:to-[#1D4ED8] text-white font-extrabold text-xs sm:text-sm rounded-xl transition shadow-md shadow-sky-400/25 flex items-center gap-2 hover:scale-[1.02] cursor-pointer"
            >
              <Send size={15} />
              <span>{heroPrimaryButtonLabel}</span>
            </motion.button>
            <a
              href={heroSecondaryButtonUrl}
              className="px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition flex items-center gap-2 shadow-2xs cursor-pointer"
            >
              <FileText size={15} className="text-[#0284C7]" />
              <span>{heroSecondaryButtonLabel}</span>
            </a>
          </div>
        </motion.div>
      </section>

      {/* 2. 4 Cam Kết Minh Bạch Cốt Lõi */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 bg-gradient-to-br from-sky-50/70 via-blue-50/40 to-slate-50 rounded-3xl border border-sky-100 shadow-sm space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {commitmentHeading}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              {commitmentSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 bg-white rounded-2xl border border-sky-100 shadow-2xs space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center font-black">
                <FileText size={20} />
              </div>
              <h3 className="text-sm font-black text-slate-900">{commit1Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {commit1Desc}
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-emerald-100 shadow-2xs space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                <Award size={20} />
              </div>
              <h3 className="text-sm font-black text-slate-900">{commit2Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {commit2Desc}
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-amber-100 shadow-2xs space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
                <TrendingUp size={20} />
              </div>
              <h3 className="text-sm font-black text-slate-900">{commit3Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {commit3Desc}
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-indigo-100 shadow-2xs space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                <Sparkles size={20} />
              </div>
              <h3 className="text-sm font-black text-slate-900">{commit4Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {commit4Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Các Gói & Hình Thức Tài Trợ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {packagesHeading}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {packagesSubtitle}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {sponsorPackages.map((pkg) => {
            const Icon = pkg.icon;
            return (
              <motion.div
                key={pkg.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${pkg.badgeColor}`}>
                      <Icon size={13} />
                      <span>{pkg.badge}</span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                      {pkg.unit}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-slate-900">
                      {pkg.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                      {pkg.description}
                    </p>
                  </div>

                  <div className="p-3.5 bg-sky-50/60 rounded-2xl border border-sky-100/80 text-xs text-[#0284C7] font-medium leading-relaxed flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-[#0284C7] flex-shrink-0 mt-0.5" />
                    <span><strong>Hiệu quả cam kết:</strong> {pkg.impact}</span>
                  </div>

                  <div className="space-y-2 pt-1">
                    <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                      Quyền lợi nhà tài trợ:
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {pkg.benefits.map((b, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onNavigate('contact')}
                    className="w-full py-2.5 px-4 bg-slate-100 hover:bg-[#0284C7] hover:text-white text-slate-700 font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-2"
                  >
                    <span>Liên Hệ Đồng Hành Gói Này</span>
                    <ArrowRight size={14} />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 4. Thông Tin Chuyển Khoản & Tiếp Nhận Tài Trợ Minh Bạch */}
      <section id="thong-tin-chuyen-khoan" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#0A2540] via-[#0F365E] to-[#13406D] text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-8 relative overflow-hidden">
          
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-sky-300">
              <ShieldCheck size={14} />
              <span>TÀI KHOẢN TIẾP NHẬN CHÍNH THỨC</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Kênh Tiếp Nhận Đóng Góp SFN
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Để bảo đảm an toàn và bảo mật thông tin, Ban Điều hành Sky First Network chỉ sử dụng duy nhất tài khoản tiếp nhận trực tiếp được xác nhận chính thức dưới đây.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Account Details */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Ngân hàng */}
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/15 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-sky-200 font-bold uppercase">Ngân hàng thụ hưởng</div>
                  <div className="text-sm sm:text-base font-extrabold text-white">
                    {bankName} {bankBranch ? `- ${bankBranch}` : ''}
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(bankName, 'Ngân hàng')}
                  className="p-2 hover:bg-white/20 rounded-xl transition text-slate-300 hover:text-white"
                  title="Sao chép"
                >
                  {copiedField === 'Ngân hàng' ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                </button>
              </div>

              {/* Số tài khoản */}
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/15 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-sky-200 font-bold uppercase">Số tài khoản chính thức</div>
                  <div className="text-lg sm:text-2xl font-black text-amber-300 font-mono tracking-wider">
                    {bankAccount}
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(bankAccount, 'Số tài khoản')}
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedField === 'Số tài khoản' ? (
                    <>
                      <Check size={13} />
                      <span>Đã sao chép</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>{copyButtonLabel}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Tên chủ tài khoản */}
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/15 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-sky-200 font-bold uppercase">Tên tài khoản (Chủ sở hữu)</div>
                  <div className="text-sm sm:text-base font-black text-white uppercase">
                    {accountHolder}
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(accountHolder, 'Tên tài khoản')}
                  className="p-2 hover:bg-white/20 rounded-xl transition text-slate-300 hover:text-white"
                >
                  {copiedField === 'Tên tài khoản' ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                </button>
              </div>

              {/* Cú pháp chuyển khoản */}
              <div className="p-4 bg-sky-950/60 rounded-2xl border border-sky-400/30 space-y-1">
                <div className="text-[11px] text-sky-300 font-extrabold uppercase">Cú pháp chuyển khoản đề xuất</div>
                <div className="text-xs sm:text-sm font-mono text-white font-bold">
                  {transferSyntax}
                </div>
                <div className="text-[11px] text-slate-400 pt-1">
                  *Hotline hỗ trợ tài trợ: <span className="text-amber-200 font-mono">{hotline}</span> | Email: <span className="text-sky-200 font-mono">{email}</span>
                </div>
              </div>

            </div>

            {/* Right Side: QR Code & Hotline */}
            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center space-y-4">
              <div className="w-48 bg-white p-3.5 rounded-2xl mx-auto shadow-xl flex flex-col items-center justify-center text-slate-900 border-2 border-sky-400 space-y-1.5">
                <div className="text-[10px] font-black text-[#0284C7] uppercase tracking-wide">
                  {sponsorQrCodeTitle}
                </div>
                <div className="w-36 h-36 my-0.5 bg-white rounded-xl border border-slate-100 flex items-center justify-center p-1 shadow-2xs overflow-hidden">
                  {sponsorQrCodeUrl ? (
                    <img 
                      src={sponsorQrCodeUrl} 
                      alt="VietQR Chuyển Khoản Tiếp Nhận Tài Trợ SFN" 
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-300">
                      <QrCode size={40} className="stroke-[1.5]" />
                      <span className="text-[9px] text-slate-400 mt-1 font-semibold">Chưa có mã QR</span>
                    </div>
                  )}
                </div>
                <div className="text-[9px] text-slate-500 font-medium leading-tight">
                  {sponsorQrCodeSubtitle}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-bold text-sky-200">Đầu mối phụ trách tiếp nhận tài trợ:</div>
                <div className="text-sm font-black text-white">{sponsorContactLeadTitle}</div>
                <div className="text-xs text-slate-300 flex items-center justify-center gap-3 pt-1">
                  <span className="flex items-center gap-1 font-mono">
                    <Phone size={12} className="text-sky-300" />
                    {sponsorContactHotline}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail size={12} className="text-sky-300" />
                    {sponsorContactEmail}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Kết Nối & Đăng Ký Tài Trợ */}
      <section id="form-tai-tro" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-sky-50 via-white to-blue-50/70 rounded-3xl p-8 sm:p-12 border border-sky-200 shadow-sm text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-[#0284C7] text-white flex items-center justify-center mx-auto shadow-md shadow-sky-400/30">
            <HeartHandshake size={28} />
          </div>

          <div className="max-w-2xl mx-auto space-y-2.5">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {sponsorContactHeading}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {sponsorContactDescription}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                if (sponsorContactButtonUrl.startsWith('http')) {
                  window.open(sponsorContactButtonUrl, '_blank', 'noopener,noreferrer');
                } else {
                  onNavigate((sponsorContactButtonUrl.replace(/^\//, '') || 'contact') as PageRoute);
                }
              }}
              className="px-7 py-3.5 bg-gradient-to-r from-[#00A3FF] via-[#0284C7] to-[#2563EB] hover:from-[#0284C7] hover:to-[#1D4ED8] text-white font-extrabold text-xs sm:text-sm rounded-xl transition shadow-md shadow-sky-400/30 flex items-center gap-2 hover:scale-[1.02] cursor-pointer"
            >
              <span>{sponsorContactButtonLabel}</span>
              <ArrowRight size={16} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                if (sponsorUnitsButtonUrl.startsWith('http')) {
                  window.open(sponsorUnitsButtonUrl, '_blank', 'noopener,noreferrer');
                } else {
                  onNavigate((sponsorUnitsButtonUrl.replace(/^\//, '') || 'units') as PageRoute);
                }
              }}
              className="px-6 py-3.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition shadow-2xs cursor-pointer"
            >
              {sponsorUnitsButtonLabel}
            </motion.button>
          </div>

          <div className="pt-4 border-t border-sky-100 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-mono">
              <Phone size={14} className="text-[#0284C7]" />
              <strong>Hotline Đối Ngoại:</strong> {sponsorContactHotline}
            </span>
            <span className="flex items-center gap-1.5 font-mono">
              <Mail size={14} className="text-[#0284C7]" />
              <strong>Email:</strong> {sponsorContactEmail}
            </span>
          </div>
        </div>
      </section>

      {/* 6. Câu hỏi thường gặp (FAQs) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-xs font-bold text-slate-600">
            <HelpCircle size={14} />
            <span>{faqSubtitle}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            {faqHeading}
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isExpanded = expandedFaq === index;
            return (
              <div 
                key={index}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition"
              >
                <button
                  onClick={() => setExpandedFaq(isExpanded ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition"
                >
                  <span className="font-extrabold text-xs sm:text-sm text-slate-900">
                    {faq.q}
                  </span>
                  {isExpanded ? (
                    <ChevronUp size={18} className="text-[#0284C7] flex-shrink-0" />
                  ) : (
                    <ChevronDown size={18} className="text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {isExpanded && (
                  <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Quick CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 bg-gradient-to-r from-sky-50 to-blue-50 rounded-3xl border border-sky-200 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1 max-w-xl">
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              {sponsorCtaTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              {sponsorCtaDescription}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (buttonUrl.startsWith('http')) {
                  window.open(buttonUrl, '_blank', 'noopener,noreferrer');
                } else {
                  onNavigate((buttonUrl.replace(/^\//, '') || 'units') as PageRoute);
                }
              }}
              className="px-5 py-2.5 bg-white hover:bg-sky-50 text-[#0284C7] border border-sky-300 font-extrabold text-xs rounded-xl transition cursor-pointer"
            >
              {buttonLabel}
            </button>
            <button
              onClick={() => {
                if (secondaryButtonUrl.startsWith('http')) {
                  window.open(secondaryButtonUrl, '_blank', 'noopener,noreferrer');
                } else {
                  onNavigate((secondaryButtonUrl.replace(/^\//, '') || 'join') as PageRoute);
                }
              }}
              className="px-5 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white font-extrabold text-xs rounded-xl transition shadow-sm cursor-pointer"
            >
              {secondaryButtonLabel}
            </button>
          </div>
        </div>
      </section>

      {/* 8. Nội Dung Thư Ngỏ / Quy Chế Chi Tiết (nếu có cấu hình) */}
      {(pageData?.contentFormatted || pageData?.content) && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div
              className="text-xs sm:text-sm text-slate-700 leading-relaxed formatted-content prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: pageData.contentFormatted || pageData.content || '' }}
            />
          </div>
        </section>
      )}

    </div>
  );
};
