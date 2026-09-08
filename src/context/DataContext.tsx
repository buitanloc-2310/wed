import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  db,
  isFirebaseConfigured,
  syncDocumentToFirestore,
  deleteDocumentFromFirestore,
  fetchCollectionFromFirestore,
} from '../lib/firebase';
import { doc, getDoc, onSnapshot, collection } from 'firebase/firestore';
import {
  NetworkUnit,
  Program,
  NewsArticle,
  Certificate,
  TimelineMilestone,
  CorePillar,
  TeamMember,
  FAQItem,
  SiteConfig,
  CustomPage,
  AdminUser,
  AdminUserRole,
  SiteClosedReason
} from '../types';
import {
  NETWORK_UNITS as DEFAULT_NETWORK_UNITS,
  PROGRAMS_DATA as DEFAULT_PROGRAMS,
  NEWS_DATA as DEFAULT_NEWS,
  CERTIFICATES_DATABASE as DEFAULT_CERTIFICATES,
  TIMELINE_DATA as DEFAULT_TIMELINE,
  CORE_PILLARS as DEFAULT_PILLARS,
  TEAM_DATA as DEFAULT_TEAM,
  FAQS_DATA as DEFAULT_FAQS,
  SFN_STATS as DEFAULT_STATS
} from '../data/mockData';

const STORAGE_KEY = 'sfn_website_cms_data_v2';

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  siteName: 'Sky First Network',
  tagline: 'Giáo dục để phát triển – Kết nối để tạo giá trị',
  siteDescription: 'Sky First Network là mạng lưới hướng đến giáo dục, phát triển người trẻ và cộng đồng, tạo môi trường học tập, trải nghiệm, kết nối và cùng nhau phát triển.',
  heroBadge: 'Giáo dục • Người trẻ • Cộng đồng',
  heroHeading: 'Giáo dục để phát triển – Kết nối để tạo giá trị',
  heroSubtext: 'Sky First Network hướng đến xây dựng một hệ sinh thái kết nối giáo dục, người trẻ và cộng đồng thông qua các chương trình, dự án và hoạt động thiết thực.',
  heroImageUrl: '', logoUrl: '/brand/sky-first-network.png', email: 'skyfirst.ec@gmail.com', hotline: '0924 910 210', address: '',
  siteStatus: 'active', closedReason: 'maintenance', closedReasonText: 'Bảo trì website', closedMessage: 'Website Sky First Network đang tạm thời bảo trì và biên tập nội dung.', closedEstimatedReopen: '', closedNoticeType: 'lockscreen',
  stats: { membersCount:'0',membersLabel:'Thành viên',membersSubtext:'Chưa công khai số liệu',provincesCount:'0',provincesLabel:'Địa bàn hoạt động',provincesSubtext:'Chưa công khai số liệu',volunteerHours:'0',hoursLabel:'Giờ hoạt động',hoursSubtext:'Chưa công khai số liệu',communityProjects:'0',projectsLabel:'Chương trình & hoạt động',projectsSubtext:'Chưa công khai số liệu' },
  pillarsHeading:'5 Trụ cột hoạt động', pillarsSubtext:'Giáo dục & Đào tạo • Phát triển Người trẻ • Tình nguyện & Cộng đồng • Kết nối & Hợp tác • Truyền thông & Lan tỏa',
  contact:{mainEmail:'skyfirst.ec@gmail.com',contactEmail:'hotro.sfn@gmail.com',phoneHotline:'0924 910 210',phoneExternal:'',workHoursWeekdays:'',workHoursSaturday:'',facebookUrl:'https://facebook.com/skyfirstnetwork',linkedinUrl:''},
  unitsBannerHeading:'Đơn vị trực thuộc Sky First Network', unitsBannerSubtext:'Các đơn vị trực thuộc có nhận diện và phạm vi hoạt động riêng trong hệ sinh thái Sky First Network.',
  ctaHeading:'Kết nối cùng Sky First Network', ctaSubtext:'Tìm hiểu các hình thức tham gia, tình nguyện, hợp tác và đồng hành cùng các hoạt động phù hợp.', ctaButtonText:'Tham gia',ctaButtonUrl:'/join',ctaSecondaryButtonText:'Liên hệ hợp tác',ctaSecondaryButtonUrl:'/contact',
  heroButton1Text:'Giới thiệu Sky First Network',heroButton1Url:'/about',heroButton2Text:'Tra cứu Giấy chứng nhận',heroButton2Url:'/certificate',heroButton3Text:'Tham gia',heroButton3Url:'/join',
  homeSections:{hero:true,stats:false,pillars:true,programs:true,units:true,news:true,cta:true,footer:true},
  footerSlogan:'Sky is not the limit – it’s just the beginning.', footerAboutText:'Kết nối giáo dục, người trẻ và cộng đồng để cùng học hỏi, phát triển và tạo ra những giá trị thiết thực.', footerCopyright:'© 2026 Sky First Network. Nội dung được quản lý bởi Sky First Network.', footerCertBadgeText:'Tra cứu Giấy chứng nhận',footerUnitsBadgeText:'Đơn vị trực thuộc',footerSocialFacebook:'https://facebook.com/skyfirstnetwork',footerSocialLinkedin:'https://instagram.com/sfn.network',footerSocialYoutube:'https://tiktok.com/@sfn.network',footerSocialZalo:'https://zalo.me/0924910210'
};

export const DEFAULT_ADMIN_USERS: AdminUser[] = [];

export const DEFAULT_CUSTOM_PAGES: CustomPage[] = [
  {
    id: 'page-about',
    slug: 'about',
    title: 'Về Sky First Network',
    summary: 'Tổng quan lịch sử hình thành, sứ mệnh, giá trị cốt lõi và ban điều phối Sky First Network.',
    content: 'Sky First Network là hệ sinh thái kết nối thanh niên, học sinh - sinh viên và các chuyên gia vì mục tiêu phát triển con người toàn diện, phụng sự cộng đồng và ứng dụng công nghệ vì xã hội.',
    contentFormatted: 'Sky First Network là hệ sinh thái kết nối thanh niên, học sinh - sinh viên và các chuyên gia vì mục tiêu phát triển con người toàn diện, phụng sự cộng đồng và ứng dụng công nghệ vì xã hội.\n\n*Khát Vọng Tiên Phong - Phụng Sự Tổ Quốc - Dẫn Lối Tương Lai*.\n\nMạng lưới hướng đến xây dựng thế hệ thanh niên bản lĩnh, có tri thức, tư duy số và tinh thần dấn thân vì sự phát triển bền vững của đất nước.',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80',
    isPublished: true,
    publishedAt: '01/01/2026',
    author: 'Ban Điều phối Sky First Network',
    views: 312,
    type: 'about',
    badge: 'HỆ SINH THÁI GIÁO DỤC SFN 2026',
    showInFooter: true,
    visionBadge: 'Định Hướng Chiến Lược',
    visionTitle: 'Tầm Nhìn 2030',
    visionContent: 'Trở thành mạng lưới thanh niên và giáo dục cộng đồng hàng đầu tại Việt Nam, truyền cảm hứng và trang bị năng lực tự lập, tự cường, hội nhập toàn cầu cho hơn 100.000 bạn trẻ.',
    missionBadge: 'Mục Tiêu Hành Động',
    missionTitle: 'Sứ Mệnh Phụng Sự',
    missionContent: 'Khơi mở tiềm năng bản thân, trao quyền hành động cho thế hệ trẻ qua các mô hình giáo dục thực nghiệm (Service-Learning), giải quyết các thách thức xã hội thiết thực tại địa phương.',
    philosophyBadge: 'Giá Trị Cốt Lõi',
    philosophyTitle: 'Triết Lý Giáo Dục Thực Học',
    philosophyContent: 'Học đi đôi với hành, gắn liền trách nhiệm xã hội. Mỗi chương trình đều gắn kết tri thức học thuật với các dự án thực tế tạo tác động đo lường được.',
    ctaTitle: 'Cùng SFN Đồng Hành Phụng Sự Xã Hội',
    ctaDescription: 'Dù bạn là học viên, tình nguyện viên hay đối tác tổ chức — cánh cửa SFN luôn rộng mở chào đón những trái tim nhiệt huyết.',
    ctaButtonLabel: 'Tham gia ngay',
    ctaButtonUrl: '/join',
    ctaSecondaryButtonLabel: 'Xem chương trình',
    ctaSecondaryButtonUrl: '/programs',
    unitsButtonLabel: 'Xem chi tiết tất cả đơn vị',
    unitsButtonUrl: '/units',
  },
  {
    id: 'page-certificate',
    slug: 'certificate',
    title: 'Tra Cứu Chứng Nhận Điện Tử SFCA',
    badge: 'SFCA DIGITAL VERIFICATION',
    summary: 'Nhập mã định danh trên Giấy chứng nhận để xác thực thông tin thành tích, khóa học hoặc chiến dịch tình nguyện từ Sky First Network.',
    content: 'website xác thực điện tử chính thức của Sky First Network cấp mã số định danh duy nhất cho từng học viên, tình nguyện viên.',
    contentFormatted: 'website xác thực điện tử chính thức của Sky First Network cấp mã số định danh duy nhất cho từng học viên, tình nguyện viên.',
    imageUrl: 'https://images.unsplash.com/photo-1589330694653-dad6ef0140be?w=1200&q=80',
    isPublished: true,
    publishedAt: '01/01/2026',
    author: 'Trung Tâm SFCA',
    views: 890,
    type: 'certificate',
    showInFooter: true,
    certSearchLabel: 'Mã Tra Cứu Chứng Nhận',
    certSearchPlaceholder: 'Nhập mã chứng nhận (Ví dụ: SFN-2026-OK)',
    certGuidanceNote: 'Hệ thống tra cứu tự động đối chiếu mã số với cơ sở dữ liệu số hóa SFCA theo thời gian thực.',
    certSearchButtonLabel: 'Tra Cứu',
    certResetButtonLabel: 'Làm mới',
    certFeature1Title: 'Mã Định Danh Duy Nhất',
    certFeature1Desc: 'Mỗi chứng nhận được cấp một mã số duy nhất theo định dạng SFN-[NĂM]-[MÃ], không trùng lặp.',
    certFeature2Title: 'Lưu Trữ Vĩnh Viễn',
    certFeature2Desc: 'Hồ sơ được lưu trữ trên cơ sở dữ liệu số của SFN phục vụ đối chiếu năng lực và du học.',
    certFeature3Title: 'Hỗ Trợ Nhanh Chóng',
    certFeature3Desc: 'Cần xác minh bổ sung hoặc chỉnh sửa thông tin, vui lòng gửi yêu cầu qua Trang Liên Hệ SFN.',
    certCtaTitle: 'Bạn cần hỗ trợ tra cứu hoặc cấp lại chứng nhận?',
    certCtaDescription: 'Đội ngũ điều phối và kỹ thuật viên SFCA luôn sẵn sàng giải đáp và xử lý yêu cầu xác minh thông tin.',
    certCtaButtonLabel: 'Gửi Yêu Cầu Hỗ Trợ',
    certCtaButtonUrl: '/contact',
  },
  {
    id: 'page-sponsor',
    slug: 'sponsor',
    title: 'Tài Trợ & Đồng Hành Cùng SFN',
    badge: 'TÀI TRỢ & ĐỒNG HÀNH DOANH NGHIỆP',
    summary: 'Mạng lưới SFN trân trọng mọi sự chung tay từ Quý Doanh nghiệp, Tổ chức và Nhà hảo tâm nhằm thắp sáng ước mơ cho thế hệ trẻ Việt Nam.',
    content: 'SFN cam kết tính minh bạch tài chính 100%, kiểm toán độc lập và phát hành Báo cáo tác động xã hội định kỳ cho từng chiến dịch.',
    contentFormatted: 'SFN cam kết tính minh bạch tài chính 100%, kiểm toán độc lập và phát hành Báo cáo tác động xã hội định kỳ cho từng chiến dịch.',
    imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&q=80',
    isPublished: false,
    publishedAt: '01/01/2026',
    author: 'Ban Tài Trợ & Đối Ngoại',
    views: 430,
    type: 'sponsor',
    showInFooter: true,
    sponsorBankName: 'Ngân hàng Quân Đội (MB Bank)',
    sponsorBankAccount: '0337775329',
    sponsorAccountHolder: 'Sky First Network',
    sponsorBankBranch: 'Chi nhánh TP. Hồ Chí Minh',
    sponsorTransferSyntax: 'TAITRO [HọTên/TênDoanhNghiệp] [SốĐiệnThoại]',
    sponsorQrCodeUrl: 'https://img.vietqr.io/image/MB-0337775329-compact2.png?amount=0&addInfo=TAITRO%20SFN&accountName=SKY%20FIRST%20NETWORK',
    sponsorQrCodeTitle: 'VietQR Chuyển Khoản Nhanh',
    sponsorQrCodeSubtitle: 'Quét bằng mọi ứng dụng Ngân hàng & Ví điện tử',
    sponsorHotline: '0337 775 329',
    sponsorEmail: 'sponsor@skyfirst.io.vn',
    sponsorCopyButtonLabel: 'Sao chép số tài khoản',
    sponsorContactLeadTitle: 'Ban Đối Ngoại & Hợp Tác SFN',
    sponsorContactHeading: 'Đồng Hành & Hợp Tác Cùng SFN',
    sponsorContactDescription: 'Quý Doanh nghiệp, Tổ chức và Quý Nhà tài trợ vui lòng liên hệ trực tiếp với Ban Đối Ngoại & Tài Chính SFN để nhận hồ sơ dự án chi tiết, bảng dự toán ngân sách và thỏa thuận bảo trợ quyền lợi.',
    sponsorContactButtonLabel: 'Gửi Đề Xuất Tại Trang Liên Hệ',
    sponsorContactButtonUrl: '/contact',
    sponsorUnitsButtonLabel: 'Xem Chi Tiết 5 Đơn Vị',
    sponsorUnitsButtonUrl: '/units',
    sponsorContactHotline: '0912.838.xxx',
    sponsorContactEmail: 'sponsor@skyfirst.network',
    sponsorCtaTitle: 'Bạn muốn trao đổi trực tiếp cùng Ban Điều hành Sky First Network?',
    sponsorCtaDescription: 'Vui lòng gọi hotline đối ngoại hoặc đặt lịch hẹn gặp trực tiếp tại văn phòng điều phối SFN.',
    buttonLabel: 'Xem các đơn vị',
    buttonUrl: '/units',
    secondaryButtonLabel: 'Tham gia Sky First Network',
    secondaryButtonUrl: '/join',
    sponsorHeroPrimaryButtonLabel: 'Đăng Ký Tài Trợ Ngay',
    sponsorHeroPrimaryButtonUrl: '/contact',
    sponsorHeroSecondaryButtonLabel: 'Thông Tin Chuyển Khoản',
    sponsorHeroSecondaryButtonUrl: '#thong-tin-chuyen-khoan',
    sponsorCommitmentHeading: '4 Cam Kết Minh Bạch Dành Cho Nhà Tài Trợ',
    sponsorCommitmentSubtitle: 'Mọi nguồn lực quý báu được quý đối tác gửi gắm đều được quản lý với tiêu chuẩn trách nhiệm cao nhất.',
    sponsorCommit1Title: '100% Sao Kê Công Khai',
    sponsorCommit1Desc: 'Cập nhật thu - chi rõ ràng theo từng dự án cụ thể, lưu trữ chứng từ hóa đơn đầy đủ và minh bạch.',
    sponsorCommit2Title: 'Chứng Nhận Số SFCA',
    sponsorCommit2Desc: 'Cấp Giấy chứng nhận tri ân điện tử có mã định danh và QR code quét tra cứu trực tuyến toàn quốc.',
    sponsorCommit3Title: 'Báo Cáo Tác Động Thực',
    sponsorCommit3Desc: 'Gửi tận tay nhà tài trợ báo cáo hình ảnh, video và số liệu thụ hưởng thực tế sau khi dự án hoàn thành.',
    sponsorCommit4Title: 'Lan Tỏa Truyền Thông',
    sponsorCommit4Desc: 'Đồng hành cùng Trung tâm Truyền thông SFMC để tôn vinh những nghĩa cử nhân văn đến cộng đồng người trẻ.',
    sponsorPackagesHeading: 'Các Hình Thức Đồng Hành Cùng SFN',
    sponsorPackagesSubtitle: 'Lựa chọn hình thức đóng góp phù hợp với định hướng phát triển và trách nhiệm xã hội của bạn',
    sponsorPkg1Title: 'Học Bổng Tri Thức & Kỹ Năng',
    sponsorPkg1Badge: 'BẢO TRỢ ĐÀO TẠO',
    sponsorPkg1Unit: 'Đồng hành cùng SFEC & SFIR',
    sponsorPkg1Desc: 'Tài trợ học bổng các khóa đào tạo kỹ năng thực chiến, chuyển đổi số và công nghệ cho học sinh, sinh viên có hoàn cảnh khó khăn hoặc tài năng trẻ.',
    sponsorPkg1Impact: '100% học bổng được trao trực tiếp, kèm báo cáo tiến độ học tập của từng học viên.',
    sponsorPkg2Title: 'Chiến Dịch Phụng Sự Cộng Đồng',
    sponsorPkg2Badge: 'TÁC ĐỘNG XÃ HỘI',
    sponsorPkg2Unit: 'Đồng hành cùng SFYC (Tình nguyện)',
    sponsorPkg2Desc: 'Bảo trợ kinh phí tổ chức các chiến dịch thiện nguyện quy mô lớn: Chiến dịch Mùa Hè Xanh, Tình Nguyện Đông Xuân, Xây dựng Tủ sách Vùng cao và Khám bệnh lưu động.',
    sponsorPkg2Impact: 'Trực tiếp mang tri thức, nước sạch và quà tặng thiết thực đến các điểm trường nghèo khó.',
    sponsorPkg3Title: 'Tài Trợ Hiện Vật & Cơ Sở Hạ Tầng',
    sponsorPkg3Badge: 'HỖ TRỢ THIẾT BỊ',
    sponsorPkg3Unit: 'Đồng hành cùng SFMC & SFCA',
    sponsorPkg3Desc: 'Hỗ trợ máy tính, thiết bị âm thanh, phòng hội thảo, tài khoản phần mềm, sách giáo khoa hoặc phương tiện di chuyển phục vụ công tác xã hội.',
    sponsorPkg3Impact: 'Tối ưu hóa nguồn lực vận hành, nâng cao chất lượng trải nghiệm học tập và công tác thiện nguyện.',
    sponsorPkg4Title: 'Đối Tác Chiến Lược Dài Hạn (MOU)',
    sponsorPkg4Badge: 'ĐỒNG HÀNH TOÀN DIỆN',
    sponsorPkg4Unit: 'Đồng hành cùng Ban Điều hành Sky First Network',
    sponsorPkg4Desc: 'Ký kết Biên bản Ghi nhớ (MOU) hợp tác chiến lược theo năm. Đồng tổ chức diễn đàn thanh niên, bảo trợ truyền thông và đặt hàng đề tài nghiên cứu xã hội SFIR.',
    sponsorPkg4Impact: 'Xây dựng giá trị Trách nhiệm Xã hội Doanh nghiệp (CSR) bền vững và dài hạn.',
    sponsorFaqHeading: 'Câu Hỏi Thường Gặp Về Tài Trợ SFN',
    sponsorFaqSubtitle: 'Giải đáp những thắc mắc phổ biến của Quý Doanh nghiệp và Nhà hảo tâm',
    sponsorFaq1Q: 'Cá nhân có thể đóng góp hoặc tài trợ cho SFN không?',
    sponsorFaq1A: 'Hoàn toàn được. SFN trân trọng mọi sự đồng hành từ cá nhân, sinh viên, cựu tình nguyện viên đến các chuyên gia. Bạn có thể ủng hộ theo từng dự án cụ thể hoặc gửi vào Quỹ Phát triển Thanh niên SFN với bất kỳ số tiền nào.',
    sponsorFaq2Q: 'Làm sao tôi có thể kiểm tra tính minh bạch của số tiền đã tài trợ?',
    sponsorFaq2A: 'SFN cam kết 100% minh bạch tài chính. Tất cả khoản đóng góp đều được cập nhật vào Bảng thu chi công khai theo thời gian thực. Sau mỗi dự án, Ban Tài chính gửi Báo cáo quyết toán kèm toàn bộ chứng từ hóa đơn và nghiệm thu hình ảnh trực tiếp qua email của nhà tài trợ.',
    sponsorFaq3Q: 'Nhà tài trợ có được cấp Giấy Chứng Nhận chính thức không?',
    sponsorFaq3A: 'Có. Toàn bộ nhà tài trợ và đối tác đồng hành đều được Ban Quản lý Chứng nhận Số (SFCA) cấp Giấy Chứng Nhận Tri Ân Điện Tử có mã số định danh riêng và mã QR xác thực trực tuyến tại Cổng Tra cứu Giấy chứng nhận của SFN.',
    sponsorFaq4Q: 'Doanh nghiệp có được khấu trừ thuế TNDN cho khoản tài trợ này không?',
    sponsorFaq4A: 'SFN hợp tác với các đơn vị tổ chức xã hội và quỹ hợp pháp được công nhận. Các chương trình tài trợ giáo dục và từ thiện đủ điều kiện theo quy định của pháp luật hiện hành đều có thể xuất biên bản tiếp nhận phục vụ hạch toán chi phí hợp lý.',
  },
  {
    id: 'page-join',
    slug: 'join',
    title: 'Tham Gia Sky First Network',
    badge: 'SFN MEMBERSHIP & PARTNERSHIP',
    summary: 'Dù bạn là học sinh, sinh viên tìm kiếm cơ hội cống hiến, hay tổ chức mong muốn đồng hành phụng sự xã hội — cánh cửa SFN luôn rộng mở đón chào bạn.',
    content: 'Tham gia vào hệ sinh thái SFN để cùng kết nối nguồn lực, phụng sự cộng đồng và phát triển năng lực bản thân.',
    contentFormatted: 'Tham gia vào hệ sinh thái SFN để cùng kết nối nguồn lực, phụng sự cộng đồng và phát triển năng lực bản thân.',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80',
    isPublished: true,
    publishedAt: '01/01/2026',
    author: 'Ban Phát Triển Thành Viên',
    views: 520,
    type: 'join',
    showInFooter: true,
    joinHotline: '0337 775 329',
    joinHotlineTitle: 'Hotline Điều Phối',
    joinEmail: 'tuyendung@skyfirst.io.vn',
    joinEmailTitle: 'Email Tuyển Dụng & Nhân Sự',
    joinAddress: 'Hà Nội & TP. Hồ Chí Minh, Việt Nam',
    joinAddressTitle: 'Văn Phòng Mạng Lưới',
    joinRolesHeading: 'Các Nhóm Đối Tượng Tham Gia Sky First Network',
    joinRolesSubtitle: 'Lựa chọn hình thức đóng góp và đồng hành phù hợp với năng lực và mục tiêu cá nhân',
    joinRole1Title: 'Tình Nguyện Viên Chiến Dịch (SFYC)',
    joinRole1Tag: 'TÌNH NGUYỆN VIÊN',
    joinRole1Description: 'Tham gia trực tiếp các chiến dịch xã hội, mùa hè xanh, tiếp sức mùa thi và các hoạt động cộng đồng vì sự phát triển của thanh thiếu niên.',
    joinRole1Period: 'Linh hoạt theo từng chiến dịch',
    joinRole1ButtonLabel: 'Đăng Ký Tình Nguyện Viên',
    joinRole1ButtonUrl: '/contact',
    joinRole1Highlight1: 'Nhận Giấy chứng nhận số SFCA có mã QR định danh toàn quốc',
    joinRole1Highlight2: 'Linh hoạt đăng ký theo từng sự kiện và quỹ thời gian cá nhân',
    joinRole1Highlight3: 'Được tập huấn kỹ năng điều phối, an toàn và sơ cấp cứu thực tế',
    joinRole1Highlight4: 'Môi trường năng động kết nối bạn bè khắp các trường Đại học/THPT',
    joinRole2Title: 'Thành Viên Ban Điều Hành & Core Team',
    joinRole2Tag: 'CORE TEAM SFN',
    joinRole2Description: 'Trực tiếp tham gia quản trị, xây dựng nội dung giáo dục (SFEC), truyền thông thương hiệu (SFMC), hoặc nghiên cứu chuyển đổi số (SFIR).',
    joinRole2Period: 'Nhiệm kỳ cam kết 06 - 12 tháng',
    joinRole2ButtonLabel: 'Ứng Tuyển Ban Điều Hành',
    joinRole2ButtonUrl: '/contact',
    joinRole2Highlight1: 'Được rèn luyện tư duy lãnh đạo, quản trị dự án chuyên nghiệp',
    joinRole2Highlight2: 'Chứng nhận bổ nhiệm và thư giới thiệu từ Ban Lãnh đạo SFN',
    joinRole2Highlight3: 'Đào tạo nội bộ chuyên sâu cùng các cố vấn và chuyên gia đầu ngành',
    joinRole2Highlight4: 'Cơ hội đại diện SFN tham dự các diễn đàn và hội nghị quốc gia',
    joinRole3Title: 'Tổ Chức Đối Tác & Bảo Trợ Đồng Hành',
    joinRole3Tag: 'ĐỐI TÁC CHIẾN LƯỢC',
    joinRole3Description: 'Dành cho CLB/Đội/Nhóm, Đoàn Thanh niên, các trường THPT, Đại học và Doanh nghiệp mong muốn kết nối nguồn lực cùng phát triển cộng đồng.',
    joinRole3Period: 'Hợp tác thường niên / Theo MOU',
    joinRole3ButtonLabel: 'Gửi Đề Xuất Hợp Tác',
    joinRole3ButtonUrl: '/contact',
    joinRole3Highlight1: 'Đồng tổ chức các sự kiện giáo dục, hướng nghiệp quy mô lớn',
    joinRole3Highlight2: 'Bảo trợ kỹ thuật xác thực chứng nhận số miễn phí qua hệ thống SFCA',
    joinRole3Highlight3: 'Tối ưu hóa nguồn lực truyền thông đa kênh tiếp cận học sinh - sinh viên',
    joinRole3Highlight4: 'Hỗ trợ kết nối chuyên gia, diễn giả và ban giám khảo chất lượng',
    joinCtaHeading: 'Bạn Cần Trao Đổi Chi Tiết Về Cơ Hội Gia Nhập Hoặc Đề Xuất Dự Án?',
    joinCtaDescription: 'Hệ thống tiếp nhận hồ sơ tập trung của Ban Nhân Sự & Đối Ngoại SFN sẵn sàng hỗ trợ phản hồi trong vòng 24 giờ làm việc.',
    joinCtaButtonLabel: 'Đến Trang Liên Hệ SFN',
    joinCtaButtonUrl: '/contact',
    joinFaqHeading: 'Câu Hỏi Thường Gặp Về Gia Nhập SFN',
    joinFaqSubtitle: 'GIẢI ĐÁP THẮC MẮC ỨNG VIÊN & ĐỐI TÁC',
    joinFaq1Q: 'Ai có thể đăng ký làm Tình nguyện viên của SFN?',
    joinFaq1A: 'Mọi bạn trẻ (học sinh THPT, sinh viên, cựu sinh viên và người đi làm) có tinh thần trách nhiệm, yêu thích hoạt động cộng đồng và mong muốn cống hiến đều có thể đăng ký tham gia các chiến dịch SFYC.',
    joinFaq2Q: 'Ứng tuyển vào Ban Điều Hành (Core Team) có yêu cầu kinh nghiệm trước không?',
    joinFaq2A: 'SFN đánh giá cao thái độ học hỏi, sự chủ động và tinh thần cam kết. Dù bạn chưa có nhiều kinh nghiệm, SFN luôn có lộ trình đào tạo nội bộ và cố vấn (mentorship) từ các anh chị đi trước.',
    joinFaq3Q: 'Giấy chứng nhận số SFCA sau mỗi chiến dịch có giá trị như thế nào?',
    joinFaq3A: 'Mỗi GCN cấp qua SFCA đều có mã định danh và QR code tra cứu trực tuyến tại /certificate, ghi nhận chính xác vai trò và số giờ tình nguyện phục vụ việc xét học bổng, du học hoặc CV xin việc.',
    joinFaq4Q: 'Quy trình tiếp nhận và phản hồi hồ sơ đăng ký mất bao lâu?',
    joinFaq4A: 'Sau khi bạn gửi thông tin qua form hoặc email, Ban Nhân sự SFN sẽ gửi thư xác nhận tự động và liên hệ lại trong vòng 24 - 48 giờ làm việc để xếp lịch phỏng vấn/trao đổi trực tiếp.',
  },
  {
    id: 'page-contact',
    slug: 'contact',
    title: 'Liên Hệ Với Chúng Tôi',
    badge: 'KẾT NỐI & HỢP TÁC CÙNG Sky First Network',
    summary: 'Sky First Network luôn sẵn sàng lắng nghe, hỗ trợ và đồng hành cùng các bạn trẻ, nhà hảo tâm, đối tác giáo dục và cộng đồng.',
    content: 'Quý đối tác, phụ huynh và các bạn sinh viên có thể liên hệ trực tiếp với chúng tôi qua các kênh hotline, email hoặc tới văn phòng làm việc.',
    contentFormatted: 'Quý đối tác, phụ huynh và các bạn sinh viên có thể liên hệ trực tiếp với chúng tôi qua các kênh hotline, email hoặc tới văn phòng làm việc.',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
    isPublished: true,
    publishedAt: '01/01/2026',
    author: 'Bộ Phận Hỗ Trợ SFN',
    views: 280,
    type: 'contact',
    showInFooter: true,
    address: 'Tầng 3, Toà nhà SFEC, Khu Đô Thị Đại Học, TP. Hồ Chí Minh',
    hotline: '0337 775 329',
    secondaryHotline: '0912 838 xxx',
    email: 'skyfirst.ec@gmail.com',
    secondaryEmail: 'contact@skyfirst.network',
    workHoursWeekdays: '08:30 - 18:00 (Thứ 2 - Thứ 6)',
    workHoursSaturday: '08:30 - 12:00 (Thứ 7)',
    facebookUrl: 'https://facebook.com/skyfirstnetwork',
    linkedinUrl: 'https://linkedin.com/company/skyfirstnetwork',
    contactFormTitle: 'Gửi Tin Nhắn Đến Ban Điều Hành',
    contactFormDescription: 'Vui lòng điền đầy đủ các thông tin bên dưới. Hệ thống sẽ điều phối thư đến đúng phòng ban và đơn vị liên quan.',
    contactSubmitButtonLabel: 'Gửi Tin Nhắn Đến SFN',
    contactUnitsTitle: 'Đầu Mối 5 Đơn Vị Trực Thuộc',
    contactUnitsSubtitle: 'Liên hệ chuyên biệt theo từng mảng chuyên môn của mạng lưới:',
    contactFaqTitle: 'Câu Hỏi Thường Gặp Về Liên Hệ',
    contactFaq1Q: 'Thời gian Ban Điều hành Sky First Network tiếp nhận và phản hồi email là bao lâu?',
    contactFaq1A: 'Toàn bộ thư từ và yêu cầu kết nối qua hòm thư điện tử hoặc biểu mẫu trực tuyến đều được phân loại và phản hồi chính thức trong vòng 24 - 48 giờ làm việc.',
    contactFaq2Q: 'Tôi muốn đặt lịch làm việc trực tiếp tại văn phòng SFN thì cần làm gì?',
    contactFaq2A: 'Quý đối tác hoặc các bạn trẻ vui lòng gửi thông tin trước qua biểu mẫu bên dưới hoặc gọi tới hotline điều phối (0337 775 329) trước ít nhất 01 ngày làm việc để ban thư ký sắp xếp tiếp đón chu đáo.',
    contactFaq3Q: 'Làm thế nào để liên hệ trực tiếp với người phụ trách từng đơn vị trực thuộc?',
    contactFaq3A: 'Bạn có thể chọn trực tiếp đơn vị mong muốn (SFEC, SFYC, SFIR, SFMC, SFCA) tại mục "Đơn vị muốn kết nối" trong biểu mẫu liên hệ, thông tin sẽ được tự động gửi tới email nội bộ của trưởng đơn vị đó.',
    contactCtaTitle: 'Bạn quan tâm đến các chương trình & dự án cụ thể?',
    contactCtaDescription: 'Khám phá danh sách các khóa học SFEC, chiến dịch tình nguyện và đề tài nghiên cứu đang mở đăng ký.',
    buttonLabel: 'Xem Chương Trình',
    buttonUrl: '/programs',
    secondaryButtonLabel: 'Trang Tài Trợ',
    secondaryButtonUrl: '/sponsor',
  },
  {
    id: 'page-faqs',
    slug: 'cau-hoi-thuong-gap',
    title: 'Hỏi Đáp Thường Gặp (FAQs)',
    badge: 'HỎI ĐÁP & HỖ TRỢ',
    summary: 'Giải đáp các thắc mắc thường gặp về điều kiện tham gia, chứng chỉ SFCA và quyền lợi thành viên.',
    content: 'Tập hợp toàn bộ câu trả lời chi tiết dành cho tình nguyện viên, ứng viên tham gia các đơn vị trực thuộc và quy trình xác thực chứng nhận số.',
    contentFormatted: 'Mọi học sinh, sinh viên và thanh niên có tinh thần học hỏi, nhiệt huyết và mong muốn đóng góp cho cộng đồng đều có thể đăng ký tham gia SFN.\n\nChứng nhận số SFCA được bảo chứng bởi hệ thống xác thực trực tuyến của Sky First Network, ghi nhận chính xác số giờ tình nguyện và thành tích đóng góp thực tế.',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&q=80',
    isPublished: true,
    publishedAt: '05/01/2026',
    author: 'Bộ Phận Hỗ Trợ SFN',
    views: 245,
    type: 'faq',
    buttonLabel: 'Gửi câu hỏi cho chúng tôi',
    buttonUrl: '/contact',
    secondaryButtonLabel: 'Tra cứu chứng nhận',
    secondaryButtonUrl: '/certificate',
  },
  {
    id: 'page-terms',
    slug: 'dieu-khoan-su-dung',
    title: 'Điều Khoản Sử Dụng & Quy Chế Hoạt Động',
    badge: 'QUY CHẾ & PHÁP LÝ',
    summary: 'Quy định pháp lý, quyền và nghĩa vụ của thành viên, tình nguyện viên và đơn vị đối tác.',
    content: 'Quy chế văn hóa hoạt động, tiêu chuẩn ứng xử và cam kết bảo vệ giá trị chung của Sky First Network.',
    contentFormatted: '1. Tôn trọng pháp luật và quy chuẩn đạo đức xã hội trong mọi hoạt động đại diện cho SFN.\n2. Minh bạch trong các hoạt động tình nguyện, chiến dịch cộng đồng và tài chính dự án.\n3. Bảo vệ uy tín thương hiệu và dữ liệu của các đơn vị trực thuộc mạng lưới.',
    imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=1200&q=80',
    isPublished: true,
    publishedAt: '10/01/2026',
    author: 'Ban Pháp Chế SFN',
    views: 178,
    type: 'legal',
    buttonLabel: 'Liên hệ Ban Pháp Chế',
    buttonUrl: '/contact',
  },
  {
    id: 'page-privacy',
    slug: 'chinh-sach-bao-mat',
    title: 'Chính Sách Bảo Mật Thông Tin',
    badge: 'BẢO MẬT DỮ LIỆU',
    summary: 'Cam kết bảo mật dữ liệu cá nhân của tình nguyện viên và người nhận chứng nhận số SFCA.',
    content: 'SFN cam kết không chia sẻ dữ liệu cá nhân cho bên thứ ba vì mục đích thương mại.',
    contentFormatted: 'Dữ liệu cá nhân của thành viên, tình nguyện viên chỉ được sử dụng cho mục đích xác thực chứng chỉ số SFCA và liên lạc nội bộ trong các chương trình hoạt động cộng đồng được bảo trợ bởi Sky First Network.',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80',
    isPublished: true,
    publishedAt: '12/01/2026',
    author: 'Ban Công Nghệ SFN',
    views: 120,
    type: 'legal',
    buttonLabel: 'Hỏi đáp bảo mật',
    buttonUrl: '/contact',
  },
  {id:'content-01',slug:'sky-first-network-la-gi',title:'Sky First Network là gì?',summary:'Giới thiệu bản chất, phạm vi và định hướng hoạt động của Sky First Network.',content:'Sky First Network là mạng lưới hướng đến giáo dục, phát triển người trẻ và cộng đồng, tạo môi trường để học tập, trải nghiệm, kết nối và cùng nhau phát triển thông qua các chương trình, dự án và hoạt động thiết thực.',contentFormatted:'Sky First Network là mạng lưới hướng đến giáo dục, phát triển người trẻ và cộng đồng, tạo môi trường để học tập, trải nghiệm, kết nối và cùng nhau phát triển thông qua các chương trình, dự án và hoạt động thiết thực.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'custom',showInFooter:false},
  {id:'content-02',slug:'hanh-trinh-hinh-thanh',title:'Hành trình hình thành',summary:'Câu chuyện hình thành và quá trình phát triển của Sky First Network.',content:'Sky First Network được hình thành từ quá trình phát triển các hoạt động giáo dục và cộng đồng, sau đó xây dựng một cấp quản trị rộng hơn để kết nối các đơn vị và chương trình. Năm 2026 là giai đoạn tập trung tái cấu trúc, chuẩn hóa bộ máy, quy trình và nền tảng số.',contentFormatted:'Sky First Network được hình thành từ quá trình phát triển các hoạt động giáo dục và cộng đồng, sau đó xây dựng một cấp quản trị rộng hơn để kết nối các đơn vị và chương trình. Năm 2026 là giai đoạn tập trung tái cấu trúc, chuẩn hóa bộ máy, quy trình và nền tảng số.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'custom',showInFooter:false},
  {id:'content-03',slug:'cau-chuyen-sky-first',title:'Câu chuyện Sky First',summary:'Ý nghĩa tên gọi và tinh thần thương hiệu Sky First.',content:'Sky First thể hiện tinh thần hướng lên, học hỏi và phát triển. Thông điệp “Sky is not the limit – it’s just the beginning.” có thể được sử dụng trong câu chuyện thương hiệu như một lời nhắc rằng mỗi cột mốc mới là điểm bắt đầu cho hành trình tiếp theo.',contentFormatted:'Sky First thể hiện tinh thần hướng lên, học hỏi và phát triển. Thông điệp “Sky is not the limit – it’s just the beginning.” có thể được sử dụng trong câu chuyện thương hiệu như một lời nhắc rằng mỗi cột mốc mới là điểm bắt đầu cho hành trình tiếp theo.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'custom',showInFooter:false},
  {id:'content-04',slug:'tam-nhin',title:'Tầm nhìn',summary:'Định hướng dài hạn của Sky First Network.',content:'Sky First Network hướng đến một hệ sinh thái dành cho người trẻ và cộng đồng, ưu tiên những mô hình có thể vận hành thực tế, có người chịu trách nhiệm, có quy trình và có khả năng kế thừa trước khi mở rộng.',contentFormatted:'Sky First Network hướng đến một hệ sinh thái dành cho người trẻ và cộng đồng, ưu tiên những mô hình có thể vận hành thực tế, có người chịu trách nhiệm, có quy trình và có khả năng kế thừa trước khi mở rộng.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'custom',showInFooter:false},
  {id:'content-05',slug:'su-menh',title:'Sứ mệnh',summary:'Mở rộng cơ hội học tập, trải nghiệm và kết nối nguồn lực.',content:'Sứ mệnh của Sky First Network là mở rộng cơ hội học tập và phát triển năng lực; tạo môi trường trải nghiệm cho người trẻ; kết nối con người và nguồn lực; đồng thời khuyến khích người được trao cơ hội hôm nay có thể tạo cơ hội cho người khác trong tương lai.',contentFormatted:'Sứ mệnh của Sky First Network là mở rộng cơ hội học tập và phát triển năng lực; tạo môi trường trải nghiệm cho người trẻ; kết nối con người và nguồn lực; đồng thời khuyến khích người được trao cơ hội hôm nay có thể tạo cơ hội cho người khác trong tương lai.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'custom',showInFooter:false},
  {id:'content-06',slug:'gia-tri-cot-loi',title:'Giá trị cốt lõi',summary:'Sáu giá trị định hướng cách tổ chức hoạt động và làm việc.',content:'Sáu giá trị cốt lõi gồm Giáo dục, Cộng đồng, Trách nhiệm, Chủ động và phát triển, Kết nối và hợp tác, Bền vững.',contentFormatted:'Sáu giá trị cốt lõi gồm Giáo dục, Cộng đồng, Trách nhiệm, Chủ động và phát triển, Kết nối và hợp tác, Bền vững.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'custom',showInFooter:false},
  {id:'content-07',slug:'dinh-huong-phat-trien',title:'Định hướng phát triển',summary:'Định hướng năm 2026 và các giai đoạn tiếp theo.',content:'Năm 2026 tập trung tái cấu trúc, chuẩn hóa hệ thống quản trị, phát triển đội ngũ, hoàn thiện nền tảng số và củng cố các mô hình đang vận hành trước khi xem xét mở rộng.',contentFormatted:'Năm 2026 tập trung tái cấu trúc, chuẩn hóa hệ thống quản trị, phát triển đội ngũ, hoàn thiện nền tảng số và củng cố các mô hình đang vận hành trước khi xem xét mở rộng.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'custom',showInFooter:false},
  {id:'content-08',slug:'linh-vuc-hoat-dong',title:'Lĩnh vực hoạt động',summary:'Năm trụ cột hoạt động của Sky First Network.',content:'Năm trụ cột hoạt động gồm Giáo dục & Đào tạo; Phát triển Người trẻ; Tình nguyện & Cộng đồng; Kết nối & Hợp tác; Truyền thông & Lan tỏa.',contentFormatted:'Năm trụ cột hoạt động gồm Giáo dục & Đào tạo; Phát triển Người trẻ; Tình nguyện & Cộng đồng; Kết nối & Hợp tác; Truyền thông & Lan tỏa.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'custom',showInFooter:false},
  {id:'content-09',slug:'doi-tuong-huong-den',title:'Đối tượng hướng đến',summary:'Những nhóm người và cộng đồng mà hoạt động hướng tới.',content:'Sky First Network hướng đến người học, người trẻ, tình nguyện viên, thành viên, đội ngũ chuyên môn, cộng đồng và các cá nhân hoặc đơn vị có mong muốn kết nối, hợp tác phù hợp.',contentFormatted:'Sky First Network hướng đến người học, người trẻ, tình nguyện viên, thành viên, đội ngũ chuyên môn, cộng đồng và các cá nhân hoặc đơn vị có mong muốn kết nối, hợp tác phù hợp.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'custom',showInFooter:false},
  {id:'content-10',slug:'chuong-trinh-hien-tai',title:'Chương trình, dự án & hoạt động',summary:'Tổng hợp các chương trình, dự án và hoạt động đang triển khai.',content:'Nội dung này được quản lý động từ trang quản trị website. Chỉ các chương trình đã được xác nhận mới được công khai.',contentFormatted:'Nội dung này được quản lý động từ trang quản trị website. Chỉ các chương trình đã được xác nhận mới được công khai.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'custom',showInFooter:false},
  {id:'content-11',slug:'lop-hoc-giao-duc',title:'Lớp học & chương trình giáo dục',summary:'Các lớp học và chương trình giáo dục đang có.',content:'Các lớp học và chương trình giáo dục được cập nhật theo từng đơn vị phụ trách, thời gian triển khai và trạng thái tiếp nhận người tham gia.',contentFormatted:'Các lớp học và chương trình giáo dục được cập nhật theo từng đơn vị phụ trách, thời gian triển khai và trạng thái tiếp nhận người tham gia.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'custom',showInFooter:false},
  {id:'content-12',slug:'dau-moc-noi-bat',title:'Dấu mốc nổi bật',summary:'Các hoạt động và dấu mốc đáng chú ý trong quá trình phát triển.',content:'Timeline được cập nhật bằng dữ liệu có thể xác nhận. Ngày tháng, số lượng và kết quả chỉ công khai khi có căn cứ phù hợp.',contentFormatted:'Timeline được cập nhật bằng dữ liệu có thể xác nhận. Ngày tháng, số lượng và kết quả chỉ công khai khi có căn cứ phù hợp.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'custom',showInFooter:false},
  {id:'content-13',slug:'co-cau-to-chuc',title:'Cơ cấu tổ chức',summary:'Mô hình tổ chức và bộ máy vận hành hiện tại.',content:'Mẫu cơ cấu gồm Ban Chấp hành; Văn phòng Sky First Network; Ban Nhân sự; Ban Truyền thông; Ban Đối ngoại & Sự kiện; Core Team và các đơn vị trực thuộc. Nội dung này có thể chỉnh sửa khi cơ cấu thay đổi.',contentFormatted:'Mẫu cơ cấu gồm Ban Chấp hành; Văn phòng Sky First Network; Ban Nhân sự; Ban Truyền thông; Ban Đối ngoại & Sự kiện; Core Team và các đơn vị trực thuộc. Nội dung này có thể chỉnh sửa khi cơ cấu thay đổi.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'custom',showInFooter:false},
  {id:'content-14',slug:'don-vi-truc-thuoc',title:'Đơn vị trực thuộc',summary:'Các đơn vị hoạt động trong hệ sinh thái Sky First Network.',content:'Hiện website chuẩn bị hồ sơ cho Câu lạc bộ Tiếng Anh The Sky First và Nhà Hán Ngữ. Mỗi đơn vị có logo, giới thiệu, lĩnh vực, hoạt động, liên hệ và trạng thái riêng.',contentFormatted:'Hiện website chuẩn bị hồ sơ cho Câu lạc bộ Tiếng Anh The Sky First và Nhà Hán Ngữ. Mỗi đơn vị có logo, giới thiệu, lĩnh vực, hoạt động, liên hệ và trạng thái riêng.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'custom',showInFooter:false},
  {id:'content-15',slug:'the-sky-first-english-club',title:'Câu lạc bộ Tiếng Anh The Sky First',summary:'Vai trò của Câu lạc bộ Tiếng Anh The Sky First trong hệ sinh thái.',content:'Câu lạc bộ Tiếng Anh The Sky First là đơn vị trực thuộc Sky First Network, tập trung vào tiếng Anh và giáo dục cộng đồng, bao gồm lớp học, học liệu, quản lý học viên và đội ngũ tình nguyện viên dạy học.',contentFormatted:'Câu lạc bộ Tiếng Anh The Sky First là đơn vị trực thuộc Sky First Network, tập trung vào tiếng Anh và giáo dục cộng đồng, bao gồm lớp học, học liệu, quản lý học viên và đội ngũ tình nguyện viên dạy học.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'custom',showInFooter:false},
  {id:'content-16',slug:'doi-ngu-lanh-dao',title:'Đội ngũ lãnh đạo & điều hành',summary:'Thông tin nhân sự được phép công khai.',content:'Chỉ những nhân sự có chức danh, trạng thái và quyền công khai đã được xác nhận mới xuất hiện trên website. Vị trí đang tuyển hoặc chưa xác nhận không được hiển thị như nhân sự chính thức.',contentFormatted:'Chỉ những nhân sự có chức danh, trạng thái và quyền công khai đã được xác nhận mới xuất hiện trên website. Vị trí đang tuyển hoặc chưa xác nhận không được hiển thị như nhân sự chính thức.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'custom',showInFooter:false},
  {id:'content-17',slug:'so-lieu-noi-bat',title:'Số liệu nổi bật',summary:'Các chỉ số thực tế đã được xác nhận.',content:'Khối số liệu mặc định được ẩn cho đến khi có dữ liệu kiểm chứng. Không sử dụng các con số mẫu hoặc số liệu chưa có nguồn xác nhận.',contentFormatted:'Khối số liệu mặc định được ẩn cho đến khi có dữ liệu kiểm chứng. Không sử dụng các con số mẫu hoặc số liệu chưa có nguồn xác nhận.',isPublished:false,publishedAt:'08/09/2026',author:'Sky First Network',type:'custom',showInFooter:false},
  {id:'content-18',slug:'doi-tac-dong-hanh',title:'Đối tác & Đơn vị đồng hành',summary:'Danh sách các mối quan hệ được phép công khai.',content:'Chỉ công khai tên, logo và thông tin đối tác, đơn vị đồng hành, đơn vị phối hợp hoặc nhà tài trợ khi quan hệ đã được xác nhận và có quyền sử dụng thông tin nhận diện.',contentFormatted:'Chỉ công khai tên, logo và thông tin đối tác, đơn vị đồng hành, đơn vị phối hợp hoặc nhà tài trợ khi quan hệ đã được xác nhận và có quyền sử dụng thông tin nhận diện.',isPublished:false,publishedAt:'08/09/2026',author:'Sky First Network',type:'custom',showInFooter:false},
  {id:'content-19',slug:'hinh-thuc-tham-gia',title:'Các hình thức tham gia',summary:'Cách cá nhân có thể tham gia các hoạt động phù hợp.',content:'Người quan tâm có thể tham gia theo các chương trình, đợt tuyển thành viên, tình nguyện viên hoặc hình thức khác được công bố tại từng thời điểm.',contentFormatted:'Người quan tâm có thể tham gia theo các chương trình, đợt tuyển thành viên, tình nguyện viên hoặc hình thức khác được công bố tại từng thời điểm.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'custom',showInFooter:false},
  {id:'content-20',slug:'dang-ky-tham-gia',title:'Đăng ký tham gia & tình nguyện',summary:'Kênh đăng ký tham gia các hoạt động.',content:'Biểu mẫu đăng ký được quản lý tập trung, có trạng thái xử lý và chỉ thu thập những thông tin cần thiết cho mục đích tiếp nhận.',contentFormatted:'Biểu mẫu đăng ký được quản lý tập trung, có trạng thái xử lý và chỉ thu thập những thông tin cần thiết cho mục đích tiếp nhận.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'custom',showInFooter:false},
  {id:'content-21',slug:'hinh-thuc-hop-tac',title:'Các hình thức hợp tác',summary:'Những hướng hợp tác có thể đề xuất.',content:'Cá nhân và đơn vị có thể đề xuất hợp tác về giáo dục, chuyên môn, truyền thông, nguồn lực, sự kiện hoặc các hoạt động cộng đồng phù hợp.',contentFormatted:'Cá nhân và đơn vị có thể đề xuất hợp tác về giáo dục, chuyên môn, truyền thông, nguồn lực, sự kiện hoặc các hoạt động cộng đồng phù hợp.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'custom',showInFooter:false},
  {id:'content-22',slug:'lien-he-hop-tac',title:'Liên hệ hợp tác',summary:'Cách gửi đề xuất hợp tác đến Sky First Network.',content:'Đề xuất hợp tác nên gồm thông tin liên hệ, mục tiêu, hình thức mong muốn, thời gian dự kiến và tài liệu liên quan nếu có. Sky First Network tiếp nhận và phản hồi sau khi xem xét.',contentFormatted:'Đề xuất hợp tác nên gồm thông tin liên hệ, mục tiêu, hình thức mong muốn, thời gian dự kiến và tài liệu liên quan nếu có. Sky First Network tiếp nhận và phản hồi sau khi xem xét.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'custom',showInFooter:false},
  {id:'content-23',slug:'tin-tuc-hoat-dong',title:'Tin tức & Hoạt động',summary:'Nơi cập nhật thông tin hoạt động và bài viết mới.',content:'Tin tức và hoạt động giúp phản ánh quá trình vận hành thực tế. Mỗi bài viết có thể bật hoặc tắt bình luận và được quản lý trạng thái xuất bản.',contentFormatted:'Tin tức và hoạt động giúp phản ánh quá trình vận hành thực tế. Mỗi bài viết có thể bật hoặc tắt bình luận và được quản lý trạng thái xuất bản.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'custom',showInFooter:false},
  {id:'content-24',slug:'thu-vien-hinh-anh',title:'Thư viện hình ảnh',summary:'Hình ảnh hoạt động được phép công khai.',content:'Thư viện chỉ sử dụng hình ảnh có quyền sử dụng phù hợp, có mô tả và có thể gắn với chương trình, đơn vị hoặc bài viết liên quan.',contentFormatted:'Thư viện chỉ sử dụng hình ảnh có quyền sử dụng phù hợp, có mô tả và có thể gắn với chương trình, đơn vị hoặc bài viết liên quan.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'custom',showInFooter:false},
  {id:'content-25',slug:'tai-lieu-cong-khai',title:'Tài liệu công khai',summary:'Tài liệu, báo cáo và tệp được phép chia sẻ.',content:'Tài liệu công khai được quản lý theo tên, loại, phiên bản, ngày cập nhật và trạng thái. Tài liệu nội bộ không được tự động công khai.',contentFormatted:'Tài liệu công khai được quản lý theo tên, loại, phiên bản, ngày cập nhật và trạng thái. Tài liệu nội bộ không được tự động công khai.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'custom',showInFooter:false},
  {id:'content-26',slug:'tra-cuu-giay-chung-nhan',title:'Tra cứu & xác thực Giấy chứng nhận',summary:'Tra cứu tập trung Giấy chứng nhận từ các hệ thống kết nối.',content:'Website Sky First Network là nơi tra cứu tập trung. Giấy chứng nhận được đồng bộ từ hệ thống cấp tương ứng; trung tâm quản lý trạng thái, phát hiện trùng mã và có quyền thu hồi theo phân quyền. Bản ghi thu hồi được giữ lại để bảo toàn lịch sử.',contentFormatted:'Website Sky First Network là nơi tra cứu tập trung. Giấy chứng nhận được đồng bộ từ hệ thống cấp tương ứng; trung tâm quản lý trạng thái, phát hiện trùng mã và có quyền thu hồi theo phân quyền. Bản ghi thu hồi được giữ lại để bảo toàn lịch sử.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'custom',showInFooter:false},
  {id:'content-27',slug:'cac-he-thong',title:'Các hệ thống & website liên kết',summary:'Danh sách các hệ thống số thuộc hệ sinh thái.',content:'Mỗi hệ thống có tên, mô tả, đường dẫn, đơn vị quản lý, trạng thái kết nối và phạm vi sử dụng. Danh sách có thể mở rộng trong trang quản trị.',contentFormatted:'Mỗi hệ thống có tên, mô tả, đường dẫn, đơn vị quản lý, trạng thái kết nối và phạm vi sử dụng. Danh sách có thể mở rộng trong trang quản trị.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'custom',showInFooter:false},
  {id:'content-28',slug:'thong-tin-lien-he',title:'Thông tin liên hệ',summary:'Các kênh liên hệ chính thức của Sky First Network.',content:'Email chung: skyfirst.ec@gmail.com. Nhân sự: nhansu.sfn@gmail.com. Hỗ trợ: hotro.sfn@gmail.com. Hợp tác: hoptac.sfn@gmail.com. Truyền thông: truyenthong.sfn@gmail.com. Zalo/điện thoại: 0924 910 210.',contentFormatted:'Email chung: skyfirst.ec@gmail.com. Nhân sự: nhansu.sfn@gmail.com. Hỗ trợ: hotro.sfn@gmail.com. Hợp tác: hoptac.sfn@gmail.com. Truyền thông: truyenthong.sfn@gmail.com. Zalo/điện thoại: 0924 910 210.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'custom',showInFooter:false},
  {id:'content-29',slug:'nhan-dien-thuong-hieu',title:'Logo & quy chuẩn nhận diện',summary:'Nguyên tắc sử dụng nhận diện Sky First Network và các đơn vị.',content:'Logo chính Sky First được ưu tiên cho website và truyền thông. Giữ nguyên tỷ lệ, màu sắc, đường nét và bố cục; không tự vẽ lại, đổi màu, bóp méo hoặc cắt mất thành phần quan trọng.',contentFormatted:'Logo chính Sky First được ưu tiên cho website và truyền thông. Giữ nguyên tỷ lệ, màu sắc, đường nét và bố cục; không tự vẽ lại, đổi màu, bóp méo hoặc cắt mất thành phần quan trọng.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'custom',showInFooter:false},
  {id:'content-30',slug:'thong-diep-trang-chu',title:'Thông điệp trang chủ',summary:'Headline và thông điệp thương hiệu có thể chỉnh sửa.',content:'Headline mẫu: “Giáo dục để phát triển – Kết nối để tạo giá trị”. Thông điệp “Sky is not the limit – it’s just the beginning.” có thể dùng ở khu vực câu chuyện thương hiệu hoặc vị trí phù hợp.',contentFormatted:'Headline mẫu: “Giáo dục để phát triển – Kết nối để tạo giá trị”. Thông điệp “Sky is not the limit – it’s just the beginning.” có thể dùng ở khu vực câu chuyện thương hiệu hoặc vị trí phù hợp.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'custom',showInFooter:false},
  {id:'content-31',slug:'hanh-dong-chinh',title:'Hành động chính trên trang chủ',summary:'Các nút điều hướng quan trọng dành cho người truy cập.',content:'Các hành động chính có thể gồm Tìm hiểu Sky First Network, Tra cứu Giấy chứng nhận, Tham gia và Liên hệ hợp tác. Nội dung, liên kết và thứ tự đều có thể chỉnh sửa.',contentFormatted:'Các hành động chính có thể gồm Tìm hiểu Sky First Network, Tra cứu Giấy chứng nhận, Tham gia và Liên hệ hợp tác. Nội dung, liên kết và thứ tự đều có thể chỉnh sửa.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'custom',showInFooter:false},
  {id:'content-32',slug:'nguyen-tac-khong-cong-khai',title:'Nội dung không công khai',summary:'Nguyên tắc kiểm soát thông tin trước khi xuất bản.',content:'Không công khai dữ liệu cá nhân không cần thiết, thông tin nội bộ, chức danh chưa xác nhận, số liệu chưa kiểm chứng, đối tác chưa được phép, tài sản không có quyền sử dụng hoặc dữ liệu thử nghiệm như dữ liệu thật.',contentFormatted:'Không công khai dữ liệu cá nhân không cần thiết, thông tin nội bộ, chức danh chưa xác nhận, số liệu chưa kiểm chứng, đối tác chưa được phép, tài sản không có quyền sử dụng hoặc dữ liệu thử nghiệm như dữ liệu thật.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'custom',showInFooter:false},
  {id:'content-33',slug:'minh-bach-tu-cach-phap-ly',title:'Minh bạch & tư cách pháp lý',summary:'Thông tin giúp người đọc hiểu đúng về trạng thái của Sky First Network.',content:'Sky First Network hiện được xây dựng và vận hành như một mạng lưới hoạt động độc lập về tổ chức và định hướng. “Độc lập” không đồng nghĩa với việc có tư cách pháp nhân độc lập; website không được diễn đạt theo cách khiến người đọc hiểu sai về địa vị pháp lý hoặc sự công nhận chính thức.',contentFormatted:'Sky First Network hiện được xây dựng và vận hành như một mạng lưới hoạt động độc lập về tổ chức và định hướng. “Độc lập” không đồng nghĩa với việc có tư cách pháp nhân độc lập; website không được diễn đạt theo cách khiến người đọc hiểu sai về địa vị pháp lý hoặc sự công nhận chính thức.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'custom',showInFooter:false}
];

export interface DataContextType {
  siteConfig: SiteConfig;
  networkUnits: NetworkUnit[];
  programs: Program[];
  newsArticles: NewsArticle[];
  certificates: Record<string, Certificate>;
  timeline: TimelineMilestone[];
  corePillars: CorePillar[];
  teamMembers: TeamMember[];
  faqs: FAQItem[];
  customPages: CustomPage[];
  adminUsers: AdminUser[];

  // Update methods
  updateSiteConfig: (updates: Partial<SiteConfig>) => void;
  
  // Admin Users
  addAdminUser: (user: AdminUser) => void;
  updateAdminUser: (id: string, updates: Partial<AdminUser>) => void;
  deleteAdminUser: (id: string) => void;
  
  // Units
  updateNetworkUnit: (id: string, updates: Partial<NetworkUnit>) => void;
  addNetworkUnit: (unit: NetworkUnit) => void;
  deleteNetworkUnit: (id: string) => void;

  // Programs
  updateProgram: (id: string, updates: Partial<Program>) => void;
  addProgram: (program: Program) => void;
  deleteProgram: (id: string) => void;

  // News
  updateNewsArticle: (id: string, updates: Partial<NewsArticle>) => void;
  addNewsArticle: (article: NewsArticle) => void;
  deleteNewsArticle: (id: string) => void;

  // Certificates
  updateCertificate: (code: string, updates: Partial<Certificate>) => void;
  addCertificate: (certificate: Certificate) => void;
  deleteCertificate: (code: string) => void;

  // Custom Pages
  updateCustomPage: (id: string, updates: Partial<CustomPage>) => void;
  addCustomPage: (page: CustomPage) => void;
  deleteCustomPage: (id: string) => void;

  // Core Pillars
  updateCorePillar: (index: number, updates: Partial<CorePillar>) => void;

  // Team
  updateTeamMember: (index: number, updates: Partial<TeamMember>) => void;
  addTeamMember: (member: TeamMember) => void;
  deleteTeamMember: (index: number) => void;

  // FAQs
  updateFAQ: (index: number, updates: Partial<FAQItem>) => void;
  addFAQ: (faq: FAQItem) => void;
  deleteFAQ: (index: number) => void;

  // Timeline
  updateTimeline: (index: number, updates: Partial<TimelineMilestone>) => void;
  addTimeline: (milestone: TimelineMilestone) => void;
  deleteTimeline: (index: number) => void;

  // Tools
  resetToDefaults: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonString: string) => boolean;

  // Firebase Database Sync
  isFirebaseConfigured: boolean;
  isFirebaseSyncing: boolean;
  firebaseSyncStatus: 'synced' | 'syncing' | 'error' | 'not_configured' | 'idle';
  firebaseSyncMessage: string;
  uploadAllDataToFirestore: () => Promise<{ success: boolean; message: string }>;
  fetchDataFromFirestore: () => Promise<{ success: boolean; message: string }>;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY + '_config');
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_SITE_CONFIG,
          ...parsed,
          homeSections: {
            ...DEFAULT_SITE_CONFIG.homeSections,
            ...(parsed.homeSections || {}),
          },
        };
      }
      return DEFAULT_SITE_CONFIG;
    } catch {
      return DEFAULT_SITE_CONFIG;
    }
  });

  const [networkUnits, setNetworkUnits] = useState<NetworkUnit[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY + '_units');
      return stored ? JSON.parse(stored) : DEFAULT_NETWORK_UNITS;
    } catch {
      return DEFAULT_NETWORK_UNITS;
    }
  });

  const [programs, setPrograms] = useState<Program[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY + '_programs');
      return stored ? JSON.parse(stored) : DEFAULT_PROGRAMS;
    } catch {
      return DEFAULT_PROGRAMS;
    }
  });

  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY + '_news');
      return stored ? JSON.parse(stored) : DEFAULT_NEWS;
    } catch {
      return DEFAULT_NEWS;
    }
  });

  const [certificates, setCertificates] = useState<Record<string, Certificate>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY + '_certs');
      return stored ? JSON.parse(stored) : DEFAULT_CERTIFICATES;
    } catch {
      return DEFAULT_CERTIFICATES;
    }
  });

  const [timeline, setTimeline] = useState<TimelineMilestone[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY + '_timeline');
      return stored ? JSON.parse(stored) : DEFAULT_TIMELINE;
    } catch {
      return DEFAULT_TIMELINE;
    }
  });

  const [corePillars, setCorePillars] = useState<CorePillar[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY + '_pillars');
      return stored ? JSON.parse(stored) : DEFAULT_PILLARS;
    } catch {
      return DEFAULT_PILLARS;
    }
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY + '_team');
      return stored ? JSON.parse(stored) : DEFAULT_TEAM;
    } catch {
      return DEFAULT_TEAM;
    }
  });

  const [faqs, setFaqs] = useState<FAQItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY + '_faqs');
      return stored ? JSON.parse(stored) : DEFAULT_FAQS;
    } catch {
      return DEFAULT_FAQS;
    }
  });

  const [customPages, setCustomPages] = useState<CustomPage[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY + '_pages');
      if (!stored) return DEFAULT_CUSTOM_PAGES;
      const parsed: CustomPage[] = JSON.parse(stored);
      // Ensure all standard system pages exist in customPages and merge missing default fields
      const updated = parsed.map(p => {
        const defaultMatch = DEFAULT_CUSTOM_PAGES.find(dp => dp.id === p.id || dp.slug === p.slug);
        if (defaultMatch) {
          return { ...defaultMatch, ...p, id: defaultMatch.id, slug: defaultMatch.slug };
        }
        return p;
      });

      DEFAULT_CUSTOM_PAGES.forEach((defaultPage) => {
        const exists = updated.some(p => p.id === defaultPage.id || p.slug === defaultPage.slug);
        if (!exists) {
          updated.push(defaultPage);
        }
      });
      // Exclude home, programs, units, news from custom pages as per requirements
      return updated.filter(p => !['home', 'programs', 'units', 'news'].includes(p.slug) && !['page-home', 'page-programs', 'page-units', 'page-news'].includes(p.id));
    } catch {
      return DEFAULT_CUSTOM_PAGES;
    }
  });

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY + '_admin_users');
      if (stored) {
        const parsed: AdminUser[] = JSON.parse(stored);
        const hasTargetDev = parsed.some(
          (u) => u.email.toLowerCase() === 'uni.mtanloi@gmail.com' && u.role === 'developer'
        );
        const hasOldAccounts = parsed.some((u) =>
          ['nguoiditimhoc@gmail.com', 'dev.skyfirst@gmail.com', 'editor.sfn@gmail.com'].includes(
            u.email.toLowerCase()
          )
        );
        if (!hasTargetDev || hasOldAccounts) {
          localStorage.setItem(STORAGE_KEY + '_admin_users', JSON.stringify(DEFAULT_ADMIN_USERS));
          return DEFAULT_ADMIN_USERS;
        }
        return parsed;
      }
      return DEFAULT_ADMIN_USERS;
    } catch {
      return DEFAULT_ADMIN_USERS;
    }
  });

  // Auto-persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + '_admin_users', JSON.stringify(adminUsers));
    } catch (e) {
      console.warn('Could not save adminUsers to localStorage', e);
    }
  }, [adminUsers]);

  // Auto-persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + '_config', JSON.stringify(siteConfig));
    } catch (e) {
      console.warn('Could not save siteConfig to localStorage', e);
    }
  }, [siteConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + '_units', JSON.stringify(networkUnits));
    } catch (e) {
      console.warn('Could not save networkUnits to localStorage', e);
    }
  }, [networkUnits]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + '_programs', JSON.stringify(programs));
    } catch (e) {
      console.warn('Could not save programs to localStorage', e);
    }
  }, [programs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + '_news', JSON.stringify(newsArticles));
    } catch (e) {
      console.warn('Could not save newsArticles to localStorage', e);
    }
  }, [newsArticles]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + '_certs', JSON.stringify(certificates));
    } catch (e) {
      console.warn('Could not save certificates to localStorage', e);
    }
  }, [certificates]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + '_timeline', JSON.stringify(timeline));
    } catch (e) {
      console.warn('Could not save timeline to localStorage', e);
    }
  }, [timeline]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + '_pillars', JSON.stringify(corePillars));
    } catch (e) {
      console.warn('Could not save corePillars to localStorage', e);
    }
  }, [corePillars]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + '_team', JSON.stringify(teamMembers));
    } catch (e) {
      console.warn('Could not save teamMembers to localStorage', e);
    }
  }, [teamMembers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + '_faqs', JSON.stringify(faqs));
    } catch (e) {
      console.warn('Could not save faqs to localStorage', e);
    }
  }, [faqs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + '_pages', JSON.stringify(customPages));
    } catch (e) {
      console.warn('Could not save customPages to localStorage', e);
    }
  }, [customPages]);

  // ==========================================
  // FIREBASE FIRESTORE SYNC STATE & LOGIC
  // ==========================================
  const [isFirebaseSyncing, setIsFirebaseSyncing] = useState(false);
  const [firebaseSyncStatus, setFirebaseSyncStatus] = useState<
    'synced' | 'syncing' | 'error' | 'not_configured' | 'idle'
  >(isFirebaseConfigured ? 'idle' : 'not_configured');
  const [firebaseSyncMessage, setFirebaseSyncMessage] = useState<string>(
    isFirebaseConfigured
      ? 'Đã cấu hình Firebase'
      : 'Chưa cấu hình biến môi trường Firebase (.env)'
  );

  const uploadAllDataToFirestore = async (): Promise<{ success: boolean; message: string }> => {
    if (!isFirebaseConfigured || !db) {
      return {
        success: false,
        message: 'Chưa cấu hình Firebase! Vui lòng điền các khóa VITE_FIREBASE_... trong file .env.',
      };
    }

    setIsFirebaseSyncing(true);
    setFirebaseSyncStatus('syncing');
    setFirebaseSyncMessage('Đang tải toàn bộ dữ liệu lên Firebase Database...');

    try {
      // 1. Site Config
      await syncDocumentToFirestore('site_config', 'current', siteConfig);

      // 2. Custom Pages
      for (const page of customPages) {
        await syncDocumentToFirestore('custom_pages', page.id, page);
      }

      // 3. Programs
      for (const program of programs) {
        await syncDocumentToFirestore('programs', program.id, program);
      }

      // 4. Network Units
      for (const unit of networkUnits) {
        await syncDocumentToFirestore('network_units', unit.id, unit);
      }

      // 5. News Articles
      for (const article of newsArticles) {
        await syncDocumentToFirestore('news_articles', article.id, article);
      }

      // 6. Admin Users
      for (const user of adminUsers) {
        await syncDocumentToFirestore('admin_users', user.id, user);
      }

      setIsFirebaseSyncing(false);
      setFirebaseSyncStatus('synced');
      const msg = `Đã tải lên Firebase thành công: ${customPages.length} trang, ${programs.length} chương trình, ${networkUnits.length} đơn vị, ${newsArticles.length} bài viết!`;
      setFirebaseSyncMessage(msg);
      return { success: true, message: msg };
    } catch (error: any) {
      setIsFirebaseSyncing(false);
      setFirebaseSyncStatus('error');
      const errMsg = `Lỗi tải lên Firebase: ${error?.message || 'Không thể kết nối'}`;
      setFirebaseSyncMessage(errMsg);
      return { success: false, message: errMsg };
    }
  };

  const fetchDataFromFirestore = async (): Promise<{ success: boolean; message: string }> => {
    if (!isFirebaseConfigured || !db) {
      return {
        success: false,
        message: 'Chưa cấu hình Firebase! Vui lòng điền các khóa VITE_FIREBASE_... trong file .env.',
      };
    }

    setIsFirebaseSyncing(true);
    setFirebaseSyncStatus('syncing');
    setFirebaseSyncMessage('Đang đọc dữ liệu từ Firebase Database...');

    try {
      // 1. Site Config
      const configSnap = await getDoc(doc(db, 'site_config', 'current'));
      if (configSnap.exists()) {
        const configData = configSnap.data() as SiteConfig;
        setSiteConfig((prev) => ({
          ...prev,
          ...configData,
          homeSections: { ...prev.homeSections, ...(configData.homeSections || {}) },
        }));
      }

      // 2. Custom Pages
      const pages = await fetchCollectionFromFirestore<CustomPage>('custom_pages');
      if (pages.length > 0) {
        setCustomPages(pages);
      }

      // 3. Programs
      const progs = await fetchCollectionFromFirestore<Program>('programs');
      if (progs.length > 0) {
        setPrograms(progs);
      }

      // 4. Network Units
      const units = await fetchCollectionFromFirestore<NetworkUnit>('network_units');
      if (units.length > 0) {
        setNetworkUnits(units);
      }

      // 5. News Articles
      const news = await fetchCollectionFromFirestore<NewsArticle>('news_articles');
      if (news.length > 0) {
        setNewsArticles(news);
      }

      // 6. Admin Users
      const users = await fetchCollectionFromFirestore<AdminUser>('admin_users');
      if (users.length > 0) {
        setAdminUsers(users);
      }

      setIsFirebaseSyncing(false);
      setFirebaseSyncStatus('synced');
      const msg = 'Đã tải và đồng bộ toàn bộ dữ liệu mới nhất từ Firebase Database!';
      setFirebaseSyncMessage(msg);
      return { success: true, message: msg };
    } catch (error: any) {
      setIsFirebaseSyncing(false);
      setFirebaseSyncStatus('error');
      const errMsg = `Lỗi đọc dữ liệu từ Firebase: ${error?.message || 'Không thể đọc'}`;
      setFirebaseSyncMessage(errMsg);
      return { success: false, message: errMsg };
    }
  };

  // Tự động kết nối và nạp dữ liệu từ Firebase Firestore lúc khởi động
  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;

    let isMounted = true;

    const initFirebaseData = async () => {
      try {
        setIsFirebaseSyncing(true);
        setFirebaseSyncStatus('syncing');
        setFirebaseSyncMessage('Đang kiểm tra kết nối với Firebase Database...');

        // Đọc cấu hình site
        const configDoc = await getDoc(doc(db, 'site_config', 'current'));
        if (configDoc.exists() && isMounted) {
          const remoteConfig = configDoc.data() as SiteConfig;
          setSiteConfig((prev) => ({
            ...prev,
            ...remoteConfig,
            homeSections: { ...prev.homeSections, ...(remoteConfig.homeSections || {}) },
          }));
        }

        // Đọc các bộ sưu tập chính
        const [remotePages, remotePrograms, remoteUnits, remoteNews, remoteUsers] = await Promise.all([
          fetchCollectionFromFirestore<CustomPage>('custom_pages'),
          fetchCollectionFromFirestore<Program>('programs'),
          fetchCollectionFromFirestore<NetworkUnit>('network_units'),
          fetchCollectionFromFirestore<NewsArticle>('news_articles'),
          fetchCollectionFromFirestore<AdminUser>('admin_users'),
        ]);

        if (isMounted) {
          if (remotePages.length > 0) setCustomPages(remotePages);
          if (remotePrograms.length > 0) setPrograms(remotePrograms);
          if (remoteUnits.length > 0) setNetworkUnits(remoteUnits);
          if (remoteNews.length > 0) setNewsArticles(remoteNews);
          if (remoteUsers.length > 0) setAdminUsers(remoteUsers);

          // Nếu Firestore hoàn toàn rỗng (lần đầu triển khai): tự động seed dữ liệu lên Firestore
          if (
            !configDoc.exists() &&
            remotePages.length === 0 &&
            remotePrograms.length === 0 &&
            remoteUnits.length === 0
          ) {
            setFirebaseSyncMessage('Khởi tạo database: Đang nạp dữ liệu ban đầu lên Firebase...');
            await uploadAllDataToFirestore();
          } else {
            setFirebaseSyncStatus('synced');
            setFirebaseSyncMessage('Đã đồng bộ với Firebase Database');
          }
        }
      } catch (err: any) {
        console.warn('Lỗi kết nối / đồng bộ Firestore:', err);
        if (isMounted) {
          setFirebaseSyncStatus('error');
          setFirebaseSyncMessage(
            err?.code === 'permission-denied'
              ? 'Lỗi quyền truy cập Firestore (permission-denied). Vui lòng cập nhật firestore.rules.'
              : `Lỗi kết nối Firebase: ${err?.message || 'Không thể kết nối'}`
          );
        }
      } finally {
        if (isMounted) {
          setIsFirebaseSyncing(false);
        }
      }
    };

    initFirebaseData();

    // Lắng nghe thay đổi real-time từ Firestore
    const unsubConfig = onSnapshot(
      doc(db, 'site_config', 'current'),
      (docSnap) => {
        if (docSnap.exists() && isMounted) {
          setSiteConfig((prev) => ({
            ...prev,
            ...(docSnap.data() as SiteConfig),
          }));
        }
      },
      (err) => console.warn('Lỗi listener site_config:', err)
    );

    const unsubPages = onSnapshot(
      collection(db, 'custom_pages'),
      (colSnap) => {
        if (!colSnap.empty && isMounted) {
          const list: CustomPage[] = [];
          colSnap.forEach((d) => list.push({ id: d.id, ...d.data() } as CustomPage));
          setCustomPages(list);
        }
      },
      (err) => console.warn('Lỗi listener custom_pages:', err)
    );

    const unsubPrograms = onSnapshot(
      collection(db, 'programs'),
      (colSnap) => {
        if (!colSnap.empty && isMounted) {
          const list: Program[] = [];
          colSnap.forEach((d) => list.push({ id: d.id, ...d.data() } as Program));
          setPrograms(list);
        }
      },
      (err) => console.warn('Lỗi listener programs:', err)
    );

    const unsubUnits = onSnapshot(
      collection(db, 'network_units'),
      (colSnap) => {
        if (!colSnap.empty && isMounted) {
          const list: NetworkUnit[] = [];
          colSnap.forEach((d) => list.push({ id: d.id, ...d.data() } as NetworkUnit));
          setNetworkUnits(list);
        }
      },
      (err) => console.warn('Lỗi listener network_units:', err)
    );

    const unsubNews = onSnapshot(
      collection(db, 'news_articles'),
      (colSnap) => {
        if (!colSnap.empty && isMounted) {
          const list: NewsArticle[] = [];
          colSnap.forEach((d) => list.push({ id: d.id, ...d.data() } as NewsArticle));
          setNewsArticles(list);
        }
      },
      (err) => console.warn('Lỗi listener news_articles:', err)
    );

    return () => {
      isMounted = false;
      unsubConfig();
      unsubPages();
      unsubPrograms();
      unsubUnits();
      unsubNews();
    };
  }, []);

  // Methods
  const updateSiteConfig = (updates: Partial<SiteConfig>) => {
    setSiteConfig((prev) => {
      const next = {
        ...prev,
        ...updates,
        stats: updates.stats ? { ...prev.stats, ...updates.stats } : prev.stats,
        contact: updates.contact ? { ...prev.contact, ...updates.contact } : prev.contact,
      };
      if (isFirebaseConfigured && db) {
        syncDocumentToFirestore('site_config', 'current', next);
      }
      return next;
    });
  };

  const updateNetworkUnit = (id: string, updates: Partial<NetworkUnit>) => {
    setNetworkUnits((prev) => {
      const next = prev.map((unit) => (unit.id === id ? { ...unit, ...updates } : unit));
      const target = next.find((u) => u.id === id);
      if (target && isFirebaseConfigured && db) {
        syncDocumentToFirestore('network_units', id, target);
      }
      return next;
    });
  };

  const addNetworkUnit = (unit: NetworkUnit) => {
    setNetworkUnits((prev) => [unit, ...prev]);
    if (isFirebaseConfigured && db) {
      syncDocumentToFirestore('network_units', unit.id, unit);
    }
  };

  const deleteNetworkUnit = (id: string) => {
    setNetworkUnits((prev) => prev.filter((u) => u.id !== id));
    if (isFirebaseConfigured && db) {
      deleteDocumentFromFirestore('network_units', id);
    }
  };

  const updateProgram = (id: string, updates: Partial<Program>) => {
    setPrograms((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, ...updates } : item));
      const target = next.find((p) => p.id === id);
      if (target && isFirebaseConfigured && db) {
        syncDocumentToFirestore('programs', id, target);
      }
      return next;
    });
  };

  const addProgram = (program: Program) => {
    setPrograms((prev) => [program, ...prev]);
    if (isFirebaseConfigured && db) {
      syncDocumentToFirestore('programs', program.id, program);
    }
  };

  const deleteProgram = (id: string) => {
    setPrograms((prev) => prev.filter((p) => p.id !== id));
    if (isFirebaseConfigured && db) {
      deleteDocumentFromFirestore('programs', id);
    }
  };

  const updateNewsArticle = (id: string, updates: Partial<NewsArticle>) => {
    setNewsArticles((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, ...updates } : item));
      const target = next.find((a) => a.id === id);
      if (target && isFirebaseConfigured && db) {
        syncDocumentToFirestore('news_articles', id, target);
      }
      return next;
    });
  };

  const addNewsArticle = (article: NewsArticle) => {
    setNewsArticles((prev) => [article, ...prev]);
    if (isFirebaseConfigured && db) {
      syncDocumentToFirestore('news_articles', article.id, article);
    }
  };

  const deleteNewsArticle = (id: string) => {
    setNewsArticles((prev) => prev.filter((a) => a.id !== id));
    if (isFirebaseConfigured && db) {
      deleteDocumentFromFirestore('news_articles', id);
    }
  };

  const updateCertificate = (code: string, updates: Partial<Certificate>) => {
    setCertificates((prev) => {
      const existing = prev[code];
      if (!existing) return prev;
      return {
        ...prev,
        [code]: { ...existing, ...updates },
      };
    });
  };

  const addCertificate = (certificate: Certificate) => {
    setCertificates((prev) => ({
      ...prev,
      [certificate.code]: certificate,
    }));
  };

  const deleteCertificate = (code: string) => {
    setCertificates((prev) => {
      const next = { ...prev };
      delete next[code];
      return next;
    });
  };

  const updateCorePillar = (index: number, updates: Partial<CorePillar>) => {
    setCorePillars((prev) =>
      prev.map((p, i) => (i === index ? { ...p, ...updates } : p))
    );
  };

  const updateTeamMember = (index: number, updates: Partial<TeamMember>) => {
    setTeamMembers((prev) =>
      prev.map((m, i) => (i === index ? { ...m, ...updates } : m))
    );
  };

  const addTeamMember = (member: TeamMember) => {
    setTeamMembers((prev) => [...prev, member]);
  };

  const deleteTeamMember = (index: number) => {
    setTeamMembers((prev) => prev.filter((_, i) => i !== index));
  };

  const updateFAQ = (index: number, updates: Partial<FAQItem>) => {
    setFaqs((prev) =>
      prev.map((f, i) => (i === index ? { ...f, ...updates } : f))
    );
  };

  const addFAQ = (faq: FAQItem) => {
    setFaqs((prev) => [...prev, faq]);
  };

  const deleteFAQ = (index: number) => {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
  };

  const updateTimeline = (index: number, updates: Partial<TimelineMilestone>) => {
    setTimeline((prev) =>
      prev.map((t, i) => (i === index ? { ...t, ...updates } : t))
    );
  };

  const addTimeline = (milestone: TimelineMilestone) => {
    setTimeline((prev) => [...prev, milestone]);
  };

  const deleteTimeline = (index: number) => {
    setTimeline((prev) => prev.filter((_, i) => i !== index));
  };

  // Custom Page methods
  const updateCustomPage = (id: string, updates: Partial<CustomPage>) => {
    setCustomPages((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
      const target = next.find((p) => p.id === id);
      if (target && isFirebaseConfigured && db) {
        syncDocumentToFirestore('custom_pages', id, target);
      }
      return next;
    });
  };

  const addCustomPage = (page: CustomPage) => {
    setCustomPages((prev) => [page, ...prev]);
    if (isFirebaseConfigured && db) {
      syncDocumentToFirestore('custom_pages', page.id, page);
    }
  };

  const deleteCustomPage = (id: string) => {
    setCustomPages((prev) => prev.filter((p) => p.id !== id));
    if (isFirebaseConfigured && db) {
      deleteDocumentFromFirestore('custom_pages', id);
    }
  };

  // Admin User methods
  const addAdminUser = (user: AdminUser) => {
    setAdminUsers((prev) => [user, ...prev]);
    if (isFirebaseConfigured && db) {
      syncDocumentToFirestore('admin_users', user.id, user);
    }
  };

  const updateAdminUser = (id: string, updates: Partial<AdminUser>) => {
    setAdminUsers((prev) => {
      const next = prev.map((u) => (u.id === id ? { ...u, ...updates } : u));
      const target = next.find((u) => u.id === id);
      if (target && isFirebaseConfigured && db) {
        syncDocumentToFirestore('admin_users', id, target);
      }
      return next;
    });
  };

  const deleteAdminUser = (id: string) => {
    setAdminUsers((prev) => prev.filter((u) => u.id !== id));
    if (isFirebaseConfigured && db) {
      deleteDocumentFromFirestore('admin_users', id);
    }
  };

  const resetToDefaults = () => {
    setSiteConfig(DEFAULT_SITE_CONFIG);
    setNetworkUnits(DEFAULT_NETWORK_UNITS);
    setPrograms(DEFAULT_PROGRAMS);
    setNewsArticles(DEFAULT_NEWS);
    setCertificates(DEFAULT_CERTIFICATES);
    setTimeline(DEFAULT_TIMELINE);
    setCorePillars(DEFAULT_PILLARS);
    setTeamMembers(DEFAULT_TEAM);
    setFaqs(DEFAULT_FAQS);
    setCustomPages(DEFAULT_CUSTOM_PAGES);
    setAdminUsers(DEFAULT_ADMIN_USERS);
    try {
      localStorage.removeItem(STORAGE_KEY + '_config');
      localStorage.removeItem(STORAGE_KEY + '_units');
      localStorage.removeItem(STORAGE_KEY + '_programs');
      localStorage.removeItem(STORAGE_KEY + '_news');
      localStorage.removeItem(STORAGE_KEY + '_certs');
      localStorage.removeItem(STORAGE_KEY + '_timeline');
      localStorage.removeItem(STORAGE_KEY + '_pillars');
      localStorage.removeItem(STORAGE_KEY + '_team');
      localStorage.removeItem(STORAGE_KEY + '_faqs');
      localStorage.removeItem(STORAGE_KEY + '_pages');
      localStorage.removeItem(STORAGE_KEY + '_admin_users');
    } catch (e) {
      console.warn('Error clearing localStorage', e);
    }
  };

  const exportDataJSON = () => {
    const fullData = {
      siteConfig,
      networkUnits,
      programs,
      newsArticles,
      certificates,
      timeline,
      corePillars,
      teamMembers,
      faqs,
      customPages,
      exportedAt: new Date().toISOString(),
      version: '2.0',
    };
    return JSON.stringify(fullData, null, 2);
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.siteConfig) setSiteConfig(data.siteConfig);
      if (data.networkUnits) setNetworkUnits(data.networkUnits);
      if (data.programs) setPrograms(data.programs);
      if (data.newsArticles) setNewsArticles(data.newsArticles);
      if (data.certificates) setCertificates(data.certificates);
      if (data.timeline) setTimeline(data.timeline);
      if (data.corePillars) setCorePillars(data.corePillars);
      if (data.teamMembers) setTeamMembers(data.teamMembers);
      if (data.faqs) setFaqs(data.faqs);
      if (data.customPages) setCustomPages(data.customPages);
      return true;
    } catch (e) {
      console.error('Failed to import JSON', e);
      return false;
    }
  };

  return (
    <DataContext.Provider
      value={{
        siteConfig,
        networkUnits,
        programs,
        newsArticles,
        certificates,
        timeline,
        corePillars,
        teamMembers,
        faqs,
        customPages,
        adminUsers,
        updateSiteConfig,
        addAdminUser,
        updateAdminUser,
        deleteAdminUser,
        updateNetworkUnit,
        addNetworkUnit,
        deleteNetworkUnit,
        updateProgram,
        addProgram,
        deleteProgram,
        updateNewsArticle,
        addNewsArticle,
        deleteNewsArticle,
        updateCertificate,
        addCertificate,
        deleteCertificate,
        updateCustomPage,
        addCustomPage,
        deleteCustomPage,
        updateCorePillar,
        updateTeamMember,
        addTeamMember,
        deleteTeamMember,
        updateFAQ,
        addFAQ,
        deleteFAQ,
        updateTimeline,
        addTimeline,
        deleteTimeline,
        resetToDefaults,
        exportDataJSON,
        importDataJSON,
        isFirebaseConfigured,
        isFirebaseSyncing,
        firebaseSyncStatus,
        firebaseSyncMessage,
        uploadAllDataToFirestore,
        fetchDataFromFirestore,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};
