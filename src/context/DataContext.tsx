import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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
import { OFFICIAL_CONTENT_PAGES_2026 } from '../data/officialContent2026';
import {
  NETWORK_UNITS as DEFAULT_NETWORK_UNITS,
  PROGRAMS_DATA as DEFAULT_PROGRAMS,
  NEWS_DATA as DEFAULT_NEWS,
  CERTIFICATES_DATABASE as DEFAULT_CERTIFICATES,
  TIMELINE_DATA as DEFAULT_TIMELINE,
  CORE_PILLARS as DEFAULT_PILLARS,
  TEAM_DATA as DEFAULT_TEAM,
  FAQS_DATA as DEFAULT_FAQS,
  SFN_STATS as DEFAULT_STATS,
  CORE_VALUES as DEFAULT_CORE_VALUES
} from '../data/mockData';

const OFFICIAL_MANAGED_SLUGS = new Set<string>([
  ...OFFICIAL_CONTENT_PAGES_2026.map((p) => p.slug).filter((slug) => slug !== 'nha-han-ngu'),
  'about',
  'phap-ly-minh-bach',
]);

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  siteName: 'Sky First Network',
  tagline: 'Mạng lưới Giáo dục & Phát triển Cộng đồng',
  siteDescription: 'Sky First Network được xây dựng như một không gian kết nối các hoạt động giáo dục, phát triển người trẻ, tình nguyện, hợp tác và truyền thông cộng đồng.',
  heroBadge: 'Mạng lưới Giáo dục & Phát triển Cộng đồng',
  heroHeading: 'Kết nối tri thức. Phát triển người trẻ. Lan tỏa giá trị cộng đồng.',
  heroSubtext: 'Sky First Network được xây dựng như một không gian kết nối các hoạt động giáo dục, phát triển người trẻ, tình nguyện, hợp tác và truyền thông cộng đồng.',
  heroImageUrl: '', logoUrl: '/brand/sky-first-network-web.png', email: 'skyfirst.ec@gmail.com', hotline: '0924 910 210', address: '',
  siteStatus: 'active', closedReason: 'maintenance', closedReasonText: 'Bảo trì website', closedMessage: 'Website Sky First Network đang tạm thời bảo trì và biên tập nội dung.', closedEstimatedReopen: '', closedNoticeType: 'lockscreen',
  stats: { membersCount:'0',membersLabel:'Thành viên',membersSubtext:'Chưa công khai số liệu',provincesCount:'0',provincesLabel:'Địa bàn hoạt động',provincesSubtext:'Chưa công khai số liệu',volunteerHours:'0',hoursLabel:'Giờ hoạt động',hoursSubtext:'Chưa công khai số liệu',communityProjects:'0',projectsLabel:'Chương trình & hoạt động',projectsSubtext:'Chưa công khai số liệu' },
  pillarsHeading:'05 trụ cột hoạt động',
  pillarsSubtext:'Năm hướng hoạt động, cùng phục vụ một mục tiêu phát triển con người và cộng đồng.',
  directionLabel:'Định hướng 2026',

  directionPillarsCount:'05', directionPillarsLabel:'Trụ cột hoạt động', directionValuesCount:'06', directionValuesLabel:'Giá trị cốt lõi',
  coreValues: DEFAULT_CORE_VALUES.map(v => ({name:v.name, desc:v.desc})),
  navigationGroups:[
    {label:'Giới thiệu',items:[{label:'Về Sky First Network',page:'custom-page',slug:'sky-first-network-la-gi'},{label:'Lịch sử hình thành',page:'custom-page',slug:'hanh-trinh-hinh-thanh'},{label:'Tầm nhìn & Sứ mệnh',page:'custom-page',slug:'tam-nhin-su-menh'},{label:'Giá trị cốt lõi',page:'custom-page',slug:'gia-tri-cot-loi'},{label:'Cơ cấu tổ chức',page:'custom-page',slug:'co-cau-to-chuc'}]},
    {label:'Hoạt động',items:[{label:'Giáo dục & Đào tạo',page:'custom-page',slug:'giao-duc-dao-tao'},{label:'Phát triển Người trẻ',page:'custom-page',slug:'phat-trien-nguoi-tre'},{label:'Tình nguyện & Cộng đồng',page:'custom-page',slug:'tinh-nguyen-cong-dong'},{label:'Kết nối & Hợp tác',page:'custom-page',slug:'ket-noi-hop-tac'},{label:'Truyền thông & Lan tỏa',page:'custom-page',slug:'truyen-thong-lan-toa'}]},
    {label:'Đơn vị trực thuộc',items:[{label:'Câu lạc bộ Tiếng Anh The Sky First',page:'custom-page',slug:'cau-lac-bo-tieng-anh-the-sky-first'}]},
    {label:'Tra cứu',items:[{label:'Tra cứu Giấy chứng nhận',page:'certificate'},{label:'Tài liệu công khai',page:'custom-page',slug:'tai-lieu-cong-khai'}]},
    {label:'Tham gia',items:[{label:'Core Team',page:'custom-page',slug:'core-team'},{label:'Tình nguyện viên',page:'custom-page',slug:'tinh-nguyen-vien'},{label:'Hợp tác & Đồng hành',page:'contact'},{label:'Liên hệ',page:'contact'}]}
  ],
  footerQuickLinks:[{label:'Giới thiệu Sky First Network',url:'/page/sky-first-network-la-gi'},{label:'Tầm nhìn & Sứ mệnh',url:'/page/tam-nhin-su-menh'},{label:'Giá trị cốt lõi',url:'/page/gia-tri-cot-loi'},{label:'Cơ cấu tổ chức',url:'/page/co-cau-to-chuc'},{label:'Lĩnh vực hoạt động',url:'/page/linh-vuc-hoat-dong'},{label:'Hợp tác & Đồng hành',url:'/contact'},{label:'Đơn vị trực thuộc',url:'/units'},{label:'Tin tức & Hoạt động',url:'/news'},{label:'Tra cứu Giấy chứng nhận',url:'/certificate'},{label:'Tham gia Sky First Network',url:'/join'}],
  footerContacts:[{label:'Email liên hệ chính',value:'skyfirst.ec@gmail.com',url:'mailto:skyfirst.ec@gmail.com',icon:'mail'},{label:'Email Nhân sự',value:'nhansu.sfn@gmail.com',url:'mailto:nhansu.sfn@gmail.com',icon:'mail'},{label:'Email Hỗ trợ',value:'hotro.sfn@gmail.com',url:'mailto:hotro.sfn@gmail.com',icon:'mail'},{label:'Email Hợp tác',value:'hoptac.sfn@gmail.com',url:'mailto:hoptac.sfn@gmail.com',icon:'mail'},{label:'Email Truyền thông',value:'truyenthong.sfn@gmail.com',url:'mailto:truyenthong.sfn@gmail.com',icon:'mail'},{label:'Điện thoại/Zalo',value:'0924 910 210',url:'tel:0924910210',icon:'phone'}],
  footerPortals:[{label:'Website Sky First Network',domain:'skyfirst.io.vn',url:'https://skyfirst.io.vn/',icon:'globe'},{label:'Cổng Thông tin',domain:'ctt.skyfirst.io.vn',url:'https://ctt.skyfirst.io.vn/',icon:'globe'},{label:'Cổng Tình nguyện viên',domain:'tnv.skyfirst.io.vn',url:'https://tnv.skyfirst.io.vn/',icon:'heart'},{label:'Cổng SFEC',domain:'sfec.skyfirst.io.vn',url:'https://sfec.skyfirst.io.vn/',icon:'graduation'},{label:'Nhà Hán Ngữ',domain:'app.nhahanngu.io.vn',url:'https://app.nhahanngu.io.vn/',icon:'graduation'}],
  footerLegalLinks:[{label:'Pháp lý & Minh bạch',url:'/phap-ly-minh-bach'},{label:'Chính sách bảo mật',url:'/page/chinh-sach-bao-mat'},{label:'Điều khoản sử dụng',url:'/page/dieu-khoan-su-dung'},{label:'Liên hệ',url:'/contact'},{label:'Đăng nhập quản trị',url:'/admin'}],
  directionText:'Tập trung tái cấu trúc, chuẩn hóa hệ thống quản trị, phát triển Core Team và củng cố nền tảng số.',
  programsLabel:'Chương trình & hoạt động', programsHeading:'Những hoạt động đang được cập nhật',
  unitsLabel:'Đơn vị trực thuộc', unitsHeading:'Hệ sinh thái hoạt động chuyên môn', unitsIntro:'Các đơn vị trực thuộc được giới thiệu bằng tên, logo, lĩnh vực, hoạt động và thông tin liên hệ riêng.',
  certificateLabel:'Xác thực thông tin', certificateHeading:'Tra cứu Giấy chứng nhận', certificateText:'Kiểm tra thông tin giấy chứng nhận được ghi nhận trong hệ thống Sky First Network.', certificateButtonText:'Mở trang tra cứu', certificateButtonUrl:'/certificate',
  valuesLabel:'06 giá trị cốt lõi', valuesHeading:'Nguyên tắc định hướng cách mạng lưới vận hành.',
  newsLabel:'Tin tức & hoạt động', newsHeading:'Cập nhật từ mạng lưới',
  transparencyHeading:'Thông tin minh bạch', transparencyText:'Sky First Network hiện được vận hành như một mạng lưới độc lập về tổ chức và định hướng hoạt động, nhưng hiện chưa có tư cách pháp lý độc lập.', transparencyButtonText:'Tìm hiểu thêm', transparencyButtonUrl:'/phap-ly-minh-bach',
  contact:{mainEmail:'skyfirst.ec@gmail.com',contactEmail:'hotro.sfn@gmail.com',phoneHotline:'0924 910 210',phoneExternal:'',workHoursWeekdays:'',workHoursSaturday:'',facebookUrl:'',linkedinUrl:''},
  unitsBannerHeading:'Đơn vị trực thuộc Sky First Network', unitsBannerSubtext:'Các đơn vị trực thuộc có nhận diện và phạm vi hoạt động riêng trong hệ sinh thái Sky First Network.',
  ctaHeading:'Kết nối cùng Sky First Network', ctaSubtext:'Tìm hiểu các hình thức tham gia, tình nguyện, hợp tác và đồng hành cùng các hoạt động phù hợp.', ctaButtonText:'Tham gia',ctaButtonUrl:'/join',ctaSecondaryButtonText:'Liên hệ hợp tác',ctaSecondaryButtonUrl:'/contact',
  heroButton1Text:'Khám phá mạng lưới',heroButton1Url:'/about',heroButton2Text:'Tham gia cùng chúng tôi',heroButton2Url:'/join',heroButton3Text:'',heroButton3Url:'',
  homeSections:{hero:true,direction:true,pillars:true,programs:true,units:true,certificate:true,values:true,news:true,transparency:true},
  homeSectionOrder:['hero','direction','pillars','programs','units','certificate','values','news','transparency'],
  footerSlogan:'', footerAboutText:'', footerCopyright:'© 2026. Mạng lưới Giáo dục & Phát triển Cộng đồng Sky First.', footerCertBadgeText:'Tra cứu Giấy chứng nhận',footerUnitsBadgeText:'Đơn vị trực thuộc',footerSocialFacebook:'',footerSocialInstagram:'',footerSocialTiktok:'',footerSocialLinkedin:'',footerSocialYoutube:'',footerSocialZalo:''
};

export const DEFAULT_ADMIN_USERS: AdminUser[] = [];

const BASE_CUSTOM_PAGES: CustomPage[] = [
  {id:'page-about',slug:'about',title:'Về Sky First Network',summary:'Tổng quan về Mạng lưới Giáo dục & Phát triển Cộng đồng Sky First.',content:'Sky First Network là một mạng lưới hoạt động theo định hướng giáo dục, phát triển con người và kết nối cộng đồng.',contentFormatted:'Sky First Network là một mạng lưới hoạt động theo định hướng giáo dục, phát triển con người và kết nối cộng đồng.\n\nMạng lưới được xây dựng như một không gian chung để người trẻ học tập, phát triển năng lực, tham gia hoạt động xã hội, thử sức trong các vai trò tổ chức và sử dụng kiến thức, kỹ năng của mình để tạo ra giá trị tích cực cho cộng đồng.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'about',showInFooter:true,visionBadge:'Tầm nhìn',visionTitle:'Tầm nhìn',visionContent:'Nội dung tầm nhìn được cập nhật theo tài liệu chính thức của Sky First Network.',missionBadge:'Sứ mệnh',missionTitle:'Sứ mệnh',missionContent:'Nội dung sứ mệnh được cập nhật theo tài liệu chính thức của Sky First Network.',philosophyBadge:'Giá trị cốt lõi',philosophyTitle:'06 giá trị cốt lõi',philosophyContent:'Giáo dục; Cộng đồng; Trách nhiệm; Chủ động và phát triển; Kết nối và hợp tác; Bền vững.'},
  {id:'page-certificate',slug:'certificate',title:'Tra cứu Giấy chứng nhận',badge:'XÁC THỰC THÔNG TIN',summary:'Nhập mã Giấy chứng nhận để kiểm tra thông tin đã được ghi nhận trong hệ thống Sky First Network.',content:'Trang tra cứu giúp đối chiếu thông tin Giấy chứng nhận đã được ghi nhận trong hệ thống.',contentFormatted:'Trang tra cứu giúp đối chiếu thông tin Giấy chứng nhận đã được ghi nhận trong hệ thống Sky First Network.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'certificate',showInFooter:true,certSearchLabel:'Mã Giấy chứng nhận',certSearchPlaceholder:'Nhập mã Giấy chứng nhận',certGuidanceNote:'Thông tin hiển thị dựa trên dữ liệu đã được ghi nhận trong hệ thống.',certSearchButtonLabel:'Tra cứu',certResetButtonLabel:'Làm mới',certFeature1Title:'Mã định danh',certFeature1Desc:'Mỗi bản ghi sử dụng một mã để phục vụ việc đối chiếu thông tin.',certFeature2Title:'Thông tin đã ghi nhận',certFeature2Desc:'Kết quả tra cứu phản ánh dữ liệu đang được lưu trong hệ thống.',certFeature3Title:'Hỗ trợ',certFeature3Desc:'Nếu cần hỗ trợ hoặc phát hiện thông tin chưa chính xác, vui lòng liên hệ Sky First Network.',certCtaTitle:'Bạn cần hỗ trợ về Giấy chứng nhận?',certCtaDescription:'Gửi yêu cầu qua kênh hỗ trợ để được tiếp nhận và kiểm tra.',certCtaButtonLabel:'Liên hệ hỗ trợ',certCtaButtonUrl:'/contact'},
  {id:'page-join',slug:'join',title:'Tham gia Sky First Network',summary:'Tìm hiểu các hình thức tham gia phù hợp.',content:'Sky First Network mở các hình thức tham gia theo từng chương trình, hoạt động và nhu cầu nhân sự được công bố.',contentFormatted:'Sky First Network mở các hình thức tham gia theo từng chương trình, hoạt động và nhu cầu nhân sự được công bố.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'join',showInFooter:true},
  {id:'page-contact',slug:'contact',title:'Liên hệ',summary:'Các kênh liên hệ chính thức của Sky First Network.',content:'Email liên hệ chính: skyfirst.ec@gmail.com\nEmail Nhân sự: nhansu.sfn@gmail.com\nEmail Hỗ trợ: hotro.sfn@gmail.com\nEmail Hợp tác: hoptac.sfn@gmail.com\nEmail Truyền thông: truyenthong.sfn@gmail.com\nĐiện thoại/Zalo: 0924 910 210',contentFormatted:'Email liên hệ chính: skyfirst.ec@gmail.com\nEmail Nhân sự: nhansu.sfn@gmail.com\nEmail Hỗ trợ: hotro.sfn@gmail.com\nEmail Hợp tác: hoptac.sfn@gmail.com\nEmail Truyền thông: truyenthong.sfn@gmail.com\nĐiện thoại/Zalo: 0924 910 210',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'contact',showInFooter:true},
  {id:'page-transparency',slug:'phap-ly-minh-bach',title:'Pháp lý & Minh bạch',summary:'Thông tin về cách Sky First Network được tổ chức và vận hành.',content:'Sky First Network hiện được vận hành như một mạng lưới độc lập về tổ chức và định hướng hoạt động, nhưng hiện chưa có tư cách pháp lý độc lập.',contentFormatted:'Sky First Network hiện được vận hành như một mạng lưới độc lập về tổ chức và định hướng hoạt động, nhưng hiện chưa có tư cách pháp lý độc lập.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'legal',showInFooter:true},
  {id:'page-privacy',slug:'chinh-sach-bao-mat',title:'Chính sách bảo mật',summary:'Nguyên tắc tiếp nhận và bảo vệ thông tin người dùng trên website Sky First Network.',content:'Sky First Network chỉ tiếp nhận thông tin cần thiết cho mục đích người dùng chủ động gửi, như liên hệ, đăng ký hoặc bình luận. Website không yêu cầu người dùng cung cấp mật khẩu, mã OTP hay thông tin định danh nhạy cảm qua biểu mẫu công khai.\n\nThông tin liên hệ được sử dụng để tiếp nhận và xử lý yêu cầu phù hợp. Email dùng khi gửi bình luận chỉ phục vụ quản lý và phản hồi khi cần, không hiển thị công khai.\n\nCác dữ liệu nội bộ, hồ sơ cá nhân và thông tin chưa được phép công khai không được đưa lên website. Khi cần hỗ trợ về dữ liệu hoặc nội dung đã gửi, vui lòng liên hệ hotro.sfn@gmail.com.',contentFormatted:'Sky First Network chỉ tiếp nhận thông tin cần thiết cho mục đích người dùng chủ động gửi, như liên hệ, đăng ký hoặc bình luận. Website không yêu cầu người dùng cung cấp mật khẩu, mã OTP hay thông tin định danh nhạy cảm qua biểu mẫu công khai.\n\nThông tin liên hệ được sử dụng để tiếp nhận và xử lý yêu cầu phù hợp. Email dùng khi gửi bình luận chỉ phục vụ quản lý và phản hồi khi cần, không hiển thị công khai.\n\nCác dữ liệu nội bộ, hồ sơ cá nhân và thông tin chưa được phép công khai không được đưa lên website. Khi cần hỗ trợ về dữ liệu hoặc nội dung đã gửi, vui lòng liên hệ hotro.sfn@gmail.com.',isPublished:true,publishedAt:'11/09/2026',author:'Sky First Network',type:'legal',showInFooter:true},
  {id:'page-terms',slug:'dieu-khoan-su-dung',title:'Điều khoản sử dụng',summary:'Nguyên tắc sử dụng nội dung và các chức năng công khai của website Sky First Network.',content:'Website Sky First Network cung cấp thông tin về Mạng lưới, chương trình, hoạt động, đơn vị trực thuộc và các tiện ích công khai theo dữ liệu được cập nhật tại từng thời điểm. Người dùng cần sử dụng các chức năng website đúng mục đích và không gửi nội dung giả mạo, xâm phạm quyền riêng tư hoặc gây ảnh hưởng đến hoạt động của hệ thống.\n\nThông tin về chương trình, tuyển chọn, hợp tác và giấy chứng nhận chỉ có giá trị theo trạng thái hiển thị và dữ liệu được ghi nhận trên hệ thống chính thức. Nội dung cũ có thể được cập nhật khi hoạt động thay đổi.\n\nSky First Network hiện chưa phải là một pháp nhân độc lập; các nội dung và chức danh trên website phục vụ nhận diện, quản trị và vận hành Mạng lưới, không phải bằng chứng về tư cách pháp nhân. Nếu cần làm rõ thông tin, vui lòng liên hệ kênh chính thức của SFN.',contentFormatted:'Website Sky First Network cung cấp thông tin về Mạng lưới, chương trình, hoạt động, đơn vị trực thuộc và các tiện ích công khai theo dữ liệu được cập nhật tại từng thời điểm. Người dùng cần sử dụng các chức năng website đúng mục đích và không gửi nội dung giả mạo, xâm phạm quyền riêng tư hoặc gây ảnh hưởng đến hoạt động của hệ thống.\n\nThông tin về chương trình, tuyển chọn, hợp tác và giấy chứng nhận chỉ có giá trị theo trạng thái hiển thị và dữ liệu được ghi nhận trên hệ thống chính thức. Nội dung cũ có thể được cập nhật khi hoạt động thay đổi.\n\nSky First Network hiện chưa phải là một pháp nhân độc lập; các nội dung và chức danh trên website phục vụ nhận diện, quản trị và vận hành Mạng lưới, không phải bằng chứng về tư cách pháp nhân. Nếu cần làm rõ thông tin, vui lòng liên hệ kênh chính thức của SFN.',isPublished:true,publishedAt:'11/09/2026',author:'Sky First Network',type:'legal',showInFooter:true},
  {id:'content-04',slug:'tam-nhin',title:'Tầm nhìn',summary:'Định hướng dài hạn của Sky First Network.',content:'Nội dung được cập nhật theo tài liệu chính thức của Sky First Network.',contentFormatted:'Nội dung được cập nhật theo tài liệu chính thức của Sky First Network.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'custom',showInFooter:false},
  {id:'content-05',slug:'su-menh',title:'Sứ mệnh',summary:'Sứ mệnh của Sky First Network.',content:'Nội dung được cập nhật theo tài liệu chính thức của Sky First Network.',contentFormatted:'Nội dung được cập nhật theo tài liệu chính thức của Sky First Network.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'custom',showInFooter:false},
  {id:'content-06',slug:'gia-tri-cot-loi',title:'Giá trị cốt lõi',summary:'Sáu giá trị định hướng cách mạng lưới vận hành.',content:'Giáo dục; Cộng đồng; Trách nhiệm; Chủ động và phát triển; Kết nối và hợp tác; Bền vững.',contentFormatted:'Giáo dục; Cộng đồng; Trách nhiệm; Chủ động và phát triển; Kết nối và hợp tác; Bền vững.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'custom',showInFooter:false},
  {id:'content-08',slug:'linh-vuc-hoat-dong',title:'Lĩnh vực hoạt động',summary:'Năm trụ cột hoạt động của Sky First Network.',content:'Giáo dục & Đào tạo; Phát triển Người trẻ; Tình nguyện & Cộng đồng; Kết nối & Hợp tác; Truyền thông & Lan tỏa.',contentFormatted:'Giáo dục & Đào tạo; Phát triển Người trẻ; Tình nguyện & Cộng đồng; Kết nối & Hợp tác; Truyền thông & Lan tỏa.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'custom',showInFooter:false},
  {id:'content-13',slug:'co-cau-to-chuc',title:'Cơ cấu tổ chức',summary:'Mô hình tổ chức và bộ máy vận hành hiện tại.',content:'Ban Chấp hành; Ban Nhân sự; Ban Truyền thông; Ban Đối ngoại & Sự kiện; Văn phòng; cùng các đơn vị trực thuộc.',contentFormatted:'Ban Chấp hành; Ban Nhân sự; Ban Truyền thông; Ban Đối ngoại & Sự kiện; Văn phòng; cùng các đơn vị trực thuộc.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'custom',showInFooter:false},
  {id:'content-14',slug:'don-vi-truc-thuoc',title:'Đơn vị trực thuộc',summary:'Các đơn vị trực thuộc Sky First Network.',content:'Trong giai đoạn hiện tại, đơn vị trực thuộc được xác định rõ và có nền tảng hoạt động là Câu lạc bộ Tiếng Anh The Sky First (SFEC).',contentFormatted:'Trong giai đoạn hiện tại, đơn vị trực thuộc được xác định rõ và có nền tảng hoạt động là Câu lạc bộ Tiếng Anh The Sky First (SFEC).',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'custom',showInFooter:false},
  {id:'content-19',slug:'tham-gia-mang-luoi',title:'Tham gia Sky First Network',summary:'Các hình thức tham gia được công bố theo từng thời điểm.',content:'Người quan tâm có thể tham gia theo các chương trình, đợt tuyển thành viên, tình nguyện viên hoặc hình thức khác được công bố tại từng thời điểm.',contentFormatted:'Người quan tâm có thể tham gia theo các chương trình, đợt tuyển thành viên, tình nguyện viên hoặc hình thức khác được công bố tại từng thời điểm.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'custom',showInFooter:false},
  {id:'content-21',slug:'hinh-thuc-hop-tac',title:'Các hình thức hợp tác',summary:'Những hướng hợp tác có thể đề xuất.',content:'Cá nhân và đơn vị có thể đề xuất hợp tác về giáo dục, chuyên môn, truyền thông, nguồn lực, sự kiện hoặc các hoạt động cộng đồng phù hợp.',contentFormatted:'Cá nhân và đơn vị có thể đề xuất hợp tác về giáo dục, chuyên môn, truyền thông, nguồn lực, sự kiện hoặc các hoạt động cộng đồng phù hợp.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'custom',showInFooter:false},
  {id:'content-25',slug:'tai-lieu-cong-khai',title:'Tài liệu công khai',summary:'Tài liệu được phép chia sẻ công khai.',content:'Tài liệu công khai được quản lý theo trạng thái xuất bản. Tài liệu nội bộ không được tự động công khai.',contentFormatted:'Tài liệu công khai được quản lý theo trạng thái xuất bản. Tài liệu nội bộ không được tự động công khai.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'custom',showInFooter:false},
  {id:'content-29',slug:'nhan-dien-thuong-hieu',title:'Logo & quy chuẩn nhận diện',summary:'Nguyên tắc sử dụng nhận diện Sky First Network và các đơn vị.',content:'Giữ nguyên tỷ lệ, màu sắc, đường nét và bố cục logo chính thức; không tự vẽ lại, đổi màu, bóp méo hoặc cắt mất thành phần quan trọng.',contentFormatted:'Giữ nguyên tỷ lệ, màu sắc, đường nét và bố cục logo chính thức; không tự vẽ lại, đổi màu, bóp méo hoặc cắt mất thành phần quan trọng.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'custom',showInFooter:false},
  {id:'content-32',slug:'nguyen-tac-khong-cong-khai',title:'Nội dung không công khai',summary:'Nguyên tắc kiểm soát thông tin trước khi xuất bản.',content:'Không công khai dữ liệu cá nhân không cần thiết, thông tin nội bộ, chức danh chưa xác nhận, số liệu chưa kiểm chứng, đối tác chưa được phép hoặc dữ liệu thử nghiệm như dữ liệu thật.',contentFormatted:'Không công khai dữ liệu cá nhân không cần thiết, thông tin nội bộ, chức danh chưa xác nhận, số liệu chưa kiểm chứng, đối tác chưa được phép hoặc dữ liệu thử nghiệm như dữ liệu thật.',isPublished:true,publishedAt:'08/09/2026',author:'Sky First Network',type:'custom',showInFooter:false}
];

const mergedOfficialPages = [...BASE_CUSTOM_PAGES];
for (const official of OFFICIAL_CONTENT_PAGES_2026) {
  const index = mergedOfficialPages.findIndex((p) => p.slug === official.slug);
  if (index >= 0) mergedOfficialPages[index] = { ...mergedOfficialPages[index], ...official, id: mergedOfficialPages[index].id };
  else mergedOfficialPages.push(official);
}
const officialBySlug = (slug: string) => OFFICIAL_CONTENT_PAGES_2026.find((p) => p.slug === slug);
const aboutPage = mergedOfficialPages.find((p) => p.slug === 'about');
if (aboutPage) {
  const intro = officialBySlug('sky-first-network-la-gi');
  const vision = officialBySlug('tam-nhin');
  const mission = officialBySlug('su-menh');
  const values = officialBySlug('gia-tri-cot-loi');
  aboutPage.content = intro?.content || aboutPage.content;
  aboutPage.contentFormatted = intro?.contentFormatted || aboutPage.contentFormatted;
  aboutPage.summary = intro?.summary || aboutPage.summary;
  aboutPage.visionContent = vision?.content || aboutPage.visionContent;
  aboutPage.missionContent = mission?.content || aboutPage.missionContent;
  aboutPage.philosophyContent = values?.content || aboutPage.philosophyContent;
}
export const DEFAULT_CUSTOM_PAGES: CustomPage[] = mergedOfficialPages;

const mergeOfficialPages = (incoming: CustomPage[]): CustomPage[] => {
  const bySlug = new Map<string, CustomPage>();
  for (const page of incoming) bySlug.set(page.slug, page);

  for (const baseline of DEFAULT_CUSTOM_PAGES) {
    const existing = bySlug.get(baseline.slug);
    if (!existing) {
      bySlug.set(baseline.slug, baseline);
      continue;
    }
    if (OFFICIAL_MANAGED_SLUGS.has(baseline.slug)) {
      bySlug.set(baseline.slug, { ...baseline, ...existing, id: existing.id || baseline.id });
    }
  }

  return Array.from(bySlug.values());
};

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
  updateSiteConfig: (updates: Partial<SiteConfig>) => Promise<boolean>;
  
  // Admin Users
  addAdminUser: (user: AdminUser) => void;
  updateAdminUser: (id: string, updates: Partial<AdminUser>) => void;
  deleteAdminUser: (id: string) => void;
  
  // Units
  updateNetworkUnit: (id: string, updates: Partial<NetworkUnit>) => Promise<boolean>;
  addNetworkUnit: (unit: NetworkUnit) => Promise<boolean>;
  deleteNetworkUnit: (id: string) => Promise<boolean>;

  // Programs
  updateProgram: (id: string, updates: Partial<Program>) => Promise<boolean>;
  addProgram: (program: Program) => Promise<boolean>;
  deleteProgram: (id: string) => Promise<boolean>;

  // News
  updateNewsArticle: (id: string, updates: Partial<NewsArticle>) => Promise<boolean>;
  addNewsArticle: (article: NewsArticle) => Promise<boolean>;
  deleteNewsArticle: (id: string) => Promise<boolean>;

  // Certificates
  updateCertificate: (code: string, updates: Partial<Certificate>) => void;
  addCertificate: (certificate: Certificate) => void;
  deleteCertificate: (code: string) => void;

  // Custom Pages
  updateCustomPage: (id: string, updates: Partial<CustomPage>) => Promise<boolean>;
  addCustomPage: (page: CustomPage) => Promise<boolean>;
  deleteCustomPage: (id: string) => Promise<boolean>;

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
  // Cloud data is authoritative. Bundled defaults are only the initial render/fallback;
  // browser storage is deliberately not used as a second CMS database.
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const siteConfigRef = useRef<SiteConfig>(DEFAULT_SITE_CONFIG);
  useEffect(() => { siteConfigRef.current = siteConfig; }, [siteConfig]);
  const [networkUnits, setNetworkUnits] = useState<NetworkUnit[]>(DEFAULT_NETWORK_UNITS);
  const [programs, setPrograms] = useState<Program[]>(DEFAULT_PROGRAMS);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>(DEFAULT_NEWS);
  const [certificates, setCertificates] = useState<Record<string, Certificate>>(DEFAULT_CERTIFICATES);
  const [timeline, setTimeline] = useState<TimelineMilestone[]>(DEFAULT_TIMELINE);
  const [corePillars, setCorePillars] = useState<CorePillar[]>(DEFAULT_PILLARS);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(DEFAULT_TEAM);
  const [faqs, setFaqs] = useState<FAQItem[]>(DEFAULT_FAQS);
  const [customPages, setCustomPages] = useState<CustomPage[]>(DEFAULT_CUSTOM_PAGES);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(DEFAULT_ADMIN_USERS);

  // ==========================================
  // FIREBASE FIRESTORE SYNC STATE & LOGIC
  // ==========================================
  // Coalesce rapid editor keystrokes into one cloud write per document.
  // Publish/delete actions bypass this queue and await the server before reporting success.
  const pendingCloudWrites = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const scheduleCloudSync = (collectionName: string, docId: string, data: unknown) => {
    if (!isFirebaseConfigured || !db) return;
    const key = `${collectionName}/${docId}`;
    const previous = pendingCloudWrites.current.get(key);
    if (previous) clearTimeout(previous);
    const timer = setTimeout(() => {
      pendingCloudWrites.current.delete(key);
      void syncDocumentToFirestore(collectionName, docId, data);
    }, 700);
    pendingCloudWrites.current.set(key, timer);
  };
  const cancelPendingCloudSync = (collectionName: string, docId: string) => {
    const key = `${collectionName}/${docId}`;
    const timer = pendingCloudWrites.current.get(key);
    if (timer) clearTimeout(timer);
    pendingCloudWrites.current.delete(key);
  };

  const [isFirebaseSyncing, setIsFirebaseSyncing] = useState(false);
  const [firebaseSyncStatus, setFirebaseSyncStatus] = useState<
    'synced' | 'syncing' | 'error' | 'not_configured' | 'idle'
  >(isFirebaseConfigured ? 'idle' : 'not_configured');
  const [firebaseSyncMessage, setFirebaseSyncMessage] = useState<string>(
    isFirebaseConfigured
      ? 'Dịch vụ dữ liệu sẵn sàng'
      : 'Dịch vụ dữ liệu chưa sẵn sàng'
  );

  const uploadAllDataToFirestore = async (): Promise<{ success: boolean; message: string }> => {
    if (!isFirebaseConfigured || !db) {
      return {
        success: false,
        message: 'Dịch vụ đồng bộ dữ liệu chưa được cấu hình.',
      };
    }

    setIsFirebaseSyncing(true);
    setFirebaseSyncStatus('syncing');
    setFirebaseSyncMessage('Đang đồng bộ dữ liệu lên máy chủ...');

    try {
      // 1. Site Config
      if (!(await syncDocumentToFirestore('site_config', 'current', siteConfig))) throw new Error('SYNC_FAILED');

      // 2. Core pillars
      if (!(await syncDocumentToFirestore('cms_modules', 'core_pillars', { items: corePillars }))) throw new Error('SYNC_FAILED');

      // 3. Custom Pages
      for (const page of customPages) {
        if (!(await syncDocumentToFirestore('custom_pages', page.id, page))) throw new Error('SYNC_FAILED');
      }

      // 4. Programs
      for (const program of programs) {
        if (!(await syncDocumentToFirestore('programs', program.id, program))) throw new Error('SYNC_FAILED');
      }

      // 5. Network Units
      for (const unit of networkUnits) {
        if (!(await syncDocumentToFirestore('network_units', unit.id, unit))) throw new Error('SYNC_FAILED');
      }

      // 6. News Articles
      for (const article of newsArticles) {
        if (!(await syncDocumentToFirestore('news_articles', article.id, article))) throw new Error('SYNC_FAILED');
      }

      // 7. Remaining public CMS modules
      if (!(await syncDocumentToFirestore('cms_modules', 'timeline', { items: timeline }))) throw new Error('SYNC_FAILED');
      if (!(await syncDocumentToFirestore('cms_modules', 'team_members', { items: teamMembers }))) throw new Error('SYNC_FAILED');
      if (!(await syncDocumentToFirestore('cms_modules', 'faqs', { items: faqs }))) throw new Error('SYNC_FAILED');
      for (const certificate of Object.values(certificates) as Certificate[]) {
        if (!(await syncDocumentToFirestore('certificates', certificate.code, certificate))) throw new Error('SYNC_FAILED');
      }

      // 8. Admin Users
      for (const user of adminUsers) {
        if (user.id.startsWith('invite:')) {
          const email = user.email.trim().toLowerCase();
          if (!(await syncDocumentToFirestore('admin_invites', email, { email, name:user.name, role:user.role, status:user.status, note:user.note || '', createdAt:user.createdAt }))) throw new Error('SYNC_FAILED');
        } else {
          if (!(await syncDocumentToFirestore('admin_users', user.id, user))) throw new Error('SYNC_FAILED');
        }
      }

      setIsFirebaseSyncing(false);
      setFirebaseSyncStatus('synced');
      const msg = `Đã tải lên Firebase thành công: ${customPages.length} trang, ${programs.length} chương trình, ${networkUnits.length} đơn vị, ${newsArticles.length} bài viết!`;
      setFirebaseSyncMessage(msg);
      return { success: true, message: msg };
    } catch (error: any) {
      setIsFirebaseSyncing(false);
      setFirebaseSyncStatus('error');
      const errMsg = 'Không thể lưu dữ liệu lên máy chủ. Vui lòng thử lại.';
      setFirebaseSyncMessage(errMsg);
      return { success: false, message: errMsg };
    }
  };

  const fetchDataFromFirestore = async (): Promise<{ success: boolean; message: string }> => {
    if (!isFirebaseConfigured || !db) {
      return {
        success: false,
        message: 'Dịch vụ đồng bộ dữ liệu chưa được cấu hình.',
      };
    }

    setIsFirebaseSyncing(true);
    setFirebaseSyncStatus('syncing');
    setFirebaseSyncMessage('Đang tải dữ liệu mới nhất...');

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

      // 2. Core pillars: read from the server; never overwrite remote data during a fetch
      const pillarsSnap = await getDoc(doc(db, 'cms_modules', 'core_pillars'));
      if (pillarsSnap.exists()) {
        const items = pillarsSnap.data()?.items;
        if (Array.isArray(items)) setCorePillars(items as CorePillar[]);
      }

      // 3. Custom Pages
      const pages = await fetchCollectionFromFirestore<CustomPage>('custom_pages');
      if (pages.length > 0) {
        setCustomPages(mergeOfficialPages(pages));
      }

      // 4. Programs
      const progs = await fetchCollectionFromFirestore<Program>('programs');
      if (progs.length > 0) {
        setPrograms(progs);
      }

      // 5. Network Units
      const units = await fetchCollectionFromFirestore<NetworkUnit>('network_units');
      if (units.length > 0) {
        setNetworkUnits(units);
      }

      // 6. News Articles
      const news = await fetchCollectionFromFirestore<NewsArticle>('news_articles');
      if (news.length > 0) {
        setNewsArticles(news);
      }

      // 7. Admin directory is only readable after an authenticated administrator calls this method.
      const users = await fetchCollectionFromFirestore<AdminUser>('admin_users');
      const invites = await fetchCollectionFromFirestore<any>('admin_invites');
      setAdminUsers([
        ...users,
        ...invites.map((invite:any) => ({ ...invite, id: `invite:${String(invite.id || invite.email || '').toLowerCase()}`, email: String(invite.email || invite.id || '').toLowerCase(), pendingInvite: true } as AdminUser)),
      ]);

      setIsFirebaseSyncing(false);
      setFirebaseSyncStatus('synced');
      const msg = 'Đã tải dữ liệu mới nhất.';
      setFirebaseSyncMessage(msg);
      return { success: true, message: msg };
    } catch (error: any) {
      setIsFirebaseSyncing(false);
      setFirebaseSyncStatus('error');
      const errMsg = 'Không thể tải dữ liệu từ máy chủ. Vui lòng thử lại.';
      setFirebaseSyncMessage(errMsg);
      return { success: false, message: errMsg };
    }
  };

  // Realtime snapshots are ignored until the initial server read finishes.
  // This prevents a cached/stale first snapshot from replacing newer initial state.
  const remoteReadyRef = useRef(false);

  // Tự động kết nối và nạp dữ liệu từ Firebase Firestore lúc khởi động
  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;

    let isMounted = true;

    const initFirebaseData = async () => {
      try {
        setIsFirebaseSyncing(true);
        setFirebaseSyncStatus('syncing');
        setFirebaseSyncMessage('Đang kết nối dịch vụ dữ liệu...');

        // Đọc cấu hình site
        const configDoc = await getDoc(doc(db, 'site_config', 'current'));
        const [pillarsDoc, timelineDoc, teamDoc, faqsDoc] = await Promise.all([
          getDoc(doc(db, 'cms_modules', 'core_pillars')),
          getDoc(doc(db, 'cms_modules', 'timeline')),
          getDoc(doc(db, 'cms_modules', 'team_members')),
          getDoc(doc(db, 'cms_modules', 'faqs')),
        ]);
        if (configDoc.exists() && isMounted) {
          const remoteConfig = configDoc.data() as SiteConfig;
          setSiteConfig((prev) => ({
            ...prev,
            ...remoteConfig,
            homeSections: { ...prev.homeSections, ...(remoteConfig.homeSections || {}) },
          }));
        }

        if (pillarsDoc.exists() && isMounted) { const items = pillarsDoc.data()?.items; if (Array.isArray(items)) setCorePillars(items as CorePillar[]); }
        if (timelineDoc.exists() && isMounted) { const items = timelineDoc.data()?.items; if (Array.isArray(items)) setTimeline(items as TimelineMilestone[]); }
        if (teamDoc.exists() && isMounted) { const items = teamDoc.data()?.items; if (Array.isArray(items)) setTeamMembers(items as TeamMember[]); }
        if (faqsDoc.exists() && isMounted) { const items = faqsDoc.data()?.items; if (Array.isArray(items)) setFaqs(items as FAQItem[]); }

        // Đọc các bộ sưu tập chính
        const [remotePages, remotePrograms, remoteUnits, remoteNews, remoteCertificates] = await Promise.all([
          fetchCollectionFromFirestore<CustomPage>('custom_pages'),
          fetchCollectionFromFirestore<Program>('programs'),
          fetchCollectionFromFirestore<NetworkUnit>('network_units'),
          fetchCollectionFromFirestore<NewsArticle>('news_articles'),
          fetchCollectionFromFirestore<Certificate>('certificates'),
        ]);

        if (isMounted) {
          if (remotePages.length > 0) setCustomPages(mergeOfficialPages(remotePages));
          if (remotePrograms.length > 0) setPrograms(remotePrograms);
          if (remoteUnits.length > 0) setNetworkUnits(remoteUnits);
          if (remoteNews.length > 0) setNewsArticles(remoteNews);
          if (remoteCertificates.length > 0) setCertificates(Object.fromEntries(remoteCertificates.map((c) => [c.code, c])));

          // Public clients are read-only. Initial seeding is an explicit administrator action,
          // so an empty remote database can never overwrite or publish local defaults by accident.
          remoteReadyRef.current = true;
          setFirebaseSyncStatus('synced');
          setFirebaseSyncMessage('Đã đồng bộ dữ liệu.');
        }
      } catch (err: any) {
        console.warn('Lỗi kết nối / đồng bộ Firestore:', err);
        if (isMounted) {
          setFirebaseSyncStatus('error');
          setFirebaseSyncMessage(
            err?.code === 'permission-denied'
              ? 'Không có quyền truy cập dữ liệu này.'
              : 'Không thể kết nối dịch vụ dữ liệu. Vui lòng thử lại.'
          );
        }
      } finally {
        if (isMounted) {
          remoteReadyRef.current = true;
          setIsFirebaseSyncing(false);
        }
      }
    };

    initFirebaseData();

    // Lắng nghe thay đổi real-time từ Firestore
    const unsubConfig = onSnapshot(
      doc(db, 'site_config', 'current'),
      (docSnap) => {
        if (docSnap.exists() && isMounted && remoteReadyRef.current) {
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
        if (isMounted && remoteReadyRef.current) {
          const list: CustomPage[] = [];
          colSnap.forEach((d) => list.push({ id: d.id, ...d.data() } as CustomPage));
          setCustomPages(mergeOfficialPages(list));
        }
      },
      (err) => console.warn('Lỗi listener custom_pages:', err)
    );

    const unsubPrograms = onSnapshot(
      collection(db, 'programs'),
      (colSnap) => {
        if (isMounted && remoteReadyRef.current) {
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
        if (isMounted && remoteReadyRef.current) {
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
        if (isMounted && remoteReadyRef.current) {
          const list: NewsArticle[] = [];
          colSnap.forEach((d) => list.push({ id: d.id, ...d.data() } as NewsArticle));
          setNewsArticles(list);
        }
      },
      (err) => console.warn('Lỗi listener news_articles:', err)
    );

    const unsubPillars = onSnapshot(
      doc(db, 'cms_modules', 'core_pillars'),
      (docSnap) => {
        if (docSnap.exists() && isMounted && remoteReadyRef.current) {
          const items = docSnap.data()?.items;
          if (Array.isArray(items)) setCorePillars(items as CorePillar[]);
        }
      },
      (err) => console.warn('Lỗi listener core_pillars:', err)
    );

    const subscribeModule = <T,>(id: string, setter: React.Dispatch<React.SetStateAction<T[]>>) => onSnapshot(
      doc(db, 'cms_modules', id),
      (snap) => { if (snap.exists() && isMounted && remoteReadyRef.current && Array.isArray(snap.data()?.items)) setter(snap.data().items as T[]); },
      (err) => console.warn(`Lỗi listener ${id}:`, err)
    );
    const unsubTimeline = subscribeModule<TimelineMilestone>('timeline', setTimeline);
    const unsubTeam = subscribeModule<TeamMember>('team_members', setTeamMembers);
    const unsubFaqs = subscribeModule<FAQItem>('faqs', setFaqs);
    const unsubCertificates = onSnapshot(collection(db, 'certificates'), (snap) => {
      if (!isMounted || !remoteReadyRef.current) return;
      const entries: [string, Certificate][] = [];
      snap.forEach((d) => { const c = { ...d.data(), code: d.data().code || d.id } as Certificate; entries.push([c.code, c]); });
      setCertificates(Object.fromEntries(entries));
    }, (err) => console.warn('Lỗi listener certificates:', err));

    return () => {
      isMounted = false;
      unsubConfig();
      unsubPages();
      unsubPrograms();
      unsubUnits();
      unsubNews();
      unsubPillars();
      unsubTimeline();
      unsubTeam();
      unsubFaqs();
      unsubCertificates();
    };
  }, []);

  // Methods
  const updateSiteConfig = async (updates: Partial<SiteConfig>): Promise<boolean> => {
    const prev = siteConfigRef.current;
    const next: SiteConfig = {
      ...prev,
      ...updates,
      stats: updates.stats ? { ...prev.stats, ...updates.stats } : prev.stats,
      contact: updates.contact ? { ...prev.contact, ...updates.contact } : prev.contact,
    };
    if (isFirebaseConfigured && db) {
      const ok = await syncDocumentToFirestore('site_config', 'current', next);
      if (!ok) return false;
    }
    siteConfigRef.current = next;
    setSiteConfig(next);
    return true;
  };

  const updateNetworkUnit = async (id: string, updates: Partial<NetworkUnit>): Promise<boolean> => {
    const current = networkUnits.find((u) => u.id === id); if (!current) return false;
    const target = { ...current, ...updates };
    setNetworkUnits(prev => prev.map(u => u.id === id ? target : u));
    if (Object.prototype.hasOwnProperty.call(updates, 'isPublished') && isFirebaseConfigured && db) {
      cancelPendingCloudSync('network_units', id);
      return await syncDocumentToFirestore('network_units', id, target);
    }
    scheduleCloudSync('network_units', id, target);
    return true;
  };
  const addNetworkUnit = async (unit: NetworkUnit): Promise<boolean> => {
    if (isFirebaseConfigured && db && !(await syncDocumentToFirestore('network_units', unit.id, unit))) return false;
    setNetworkUnits(prev => [unit, ...prev]); return true;
  };
  const deleteNetworkUnit = async (id: string): Promise<boolean> => {
    cancelPendingCloudSync('network_units', id);
    if (isFirebaseConfigured && db && !(await deleteDocumentFromFirestore('network_units', id))) return false;
    setNetworkUnits(prev => prev.filter(u => u.id !== id)); return true;
  };

  const updateProgram = async (id: string, updates: Partial<Program>): Promise<boolean> => {
    const current = programs.find(p => p.id === id); if (!current) return false;
    const target={...current,...updates};
    setPrograms(prev=>prev.map(p=>p.id===id?target:p));
    if (Object.prototype.hasOwnProperty.call(updates, 'isPublished') && isFirebaseConfigured && db) {
      cancelPendingCloudSync('programs', id);
      return await syncDocumentToFirestore('programs', id, target);
    }
    scheduleCloudSync('programs', id, target);
    return true;
  };
  const addProgram = async (program: Program): Promise<boolean> => {
    if (isFirebaseConfigured && db && !(await syncDocumentToFirestore('programs', program.id, program))) return false;
    setPrograms(prev=>[program,...prev]); return true;
  };
  const deleteProgram = async (id: string): Promise<boolean> => {
    cancelPendingCloudSync('programs', id);
    if (isFirebaseConfigured && db && !(await deleteDocumentFromFirestore('programs', id))) return false;
    setPrograms(prev=>prev.filter(p=>p.id!==id)); return true;
  };

  const updateNewsArticle = async (id: string, updates: Partial<NewsArticle>): Promise<boolean> => {
    const current = newsArticles.find((item) => item.id === id);
    if (!current) return false;
    const target = { ...current, ...updates };
    setNewsArticles((prev) => prev.map((item) => (item.id === id ? target : item)));
    if (Object.prototype.hasOwnProperty.call(updates, 'isPublished') && isFirebaseConfigured && db) {
      cancelPendingCloudSync('news_articles', id);
      return await syncDocumentToFirestore('news_articles', id, target);
    }
    scheduleCloudSync('news_articles', id, target);
    return true;
  };

  const addNewsArticle = async (article: NewsArticle): Promise<boolean> => {
    if (isFirebaseConfigured && db && !(await syncDocumentToFirestore('news_articles', article.id, article))) return false;
    setNewsArticles(prev=>[article,...prev]); return true;
  };
  const deleteNewsArticle = async (id: string): Promise<boolean> => {
    cancelPendingCloudSync('news_articles', id);
    if (isFirebaseConfigured && db && !(await deleteDocumentFromFirestore('news_articles', id))) return false;
    setNewsArticles(prev=>prev.filter(a=>a.id!==id)); return true;
  };

  const updateCertificate = (code: string, updates: Partial<Certificate>) => {
    setCertificates((prev) => {
      const existing = prev[code]; if (!existing) return prev;
      const target = { ...existing, ...updates };
      if (isFirebaseConfigured && db) void syncDocumentToFirestore('certificates', code, target);
      return { ...prev, [code]: target };
    });
  };

  const addCertificate = (certificate: Certificate) => {
    setCertificates((prev) => ({ ...prev, [certificate.code]: certificate }));
    if (isFirebaseConfigured && db) void syncDocumentToFirestore('certificates', certificate.code, certificate);
  };

  const deleteCertificate = (code: string) => {
    setCertificates((prev) => {
      const next = { ...prev };
      delete next[code];
      if (isFirebaseConfigured && db) void deleteDocumentFromFirestore('certificates', code);
      return next;
    });
  };

  const updateCorePillar = (index: number, updates: Partial<CorePillar>) => {
    setCorePillars((prev) => {
      const next = prev.map((p, i) => (i === index ? { ...p, ...updates } : p));
      if (isFirebaseConfigured && db) {
        syncDocumentToFirestore('cms_modules', 'core_pillars', { items: next });
      }
      return next;
    });
  };

  const persistModule = (id: string, items: unknown[]) => { if (isFirebaseConfigured && db) void syncDocumentToFirestore('cms_modules', id, { items }); };
  const updateTeamMember = (index: number, updates: Partial<TeamMember>) => setTeamMembers(prev => { const next=prev.map((m,i)=>i===index?{...m,...updates}:m); persistModule('team_members',next); return next; });
  const addTeamMember = (member: TeamMember) => setTeamMembers(prev => { const next=[...prev,member]; persistModule('team_members',next); return next; });
  const deleteTeamMember = (index: number) => setTeamMembers(prev => { const next=prev.filter((_,i)=>i!==index); persistModule('team_members',next); return next; });
  const updateFAQ = (index: number, updates: Partial<FAQItem>) => setFaqs(prev => { const next=prev.map((f,i)=>i===index?{...f,...updates}:f); persistModule('faqs',next); return next; });
  const addFAQ = (faq: FAQItem) => setFaqs(prev => { const next=[...prev,faq]; persistModule('faqs',next); return next; });
  const deleteFAQ = (index: number) => setFaqs(prev => { const next=prev.filter((_,i)=>i!==index); persistModule('faqs',next); return next; });
  const updateTimeline = (index: number, updates: Partial<TimelineMilestone>) => setTimeline(prev => { const next=prev.map((t,i)=>i===index?{...t,...updates}:t); persistModule('timeline',next); return next; });
  const addTimeline = (milestone: TimelineMilestone) => setTimeline(prev => { const next=[...prev,milestone]; persistModule('timeline',next); return next; });
  const deleteTimeline = (index: number) => setTimeline(prev => { const next=prev.filter((_,i)=>i!==index); persistModule('timeline',next); return next; });

  // Custom Page methods
  const updateCustomPage = async (id: string, updates: Partial<CustomPage>): Promise<boolean> => {
    const current = customPages.find((item) => item.id === id);
    if (!current) return false;
    const target = { ...current, ...updates };
    setCustomPages((prev) => prev.map((item) => (item.id === id ? target : item)));
    if (Object.prototype.hasOwnProperty.call(updates, 'isPublished') && isFirebaseConfigured && db) {
      cancelPendingCloudSync('custom_pages', id);
      return await syncDocumentToFirestore('custom_pages', id, target);
    }
    scheduleCloudSync('custom_pages', id, target);
    return true;
  };

  const addCustomPage = async (page: CustomPage): Promise<boolean> => {
    if (isFirebaseConfigured && db && !(await syncDocumentToFirestore('custom_pages', page.id, page))) return false;
    setCustomPages(prev=>[page,...prev]); return true;
  };
  const deleteCustomPage = async (id: string): Promise<boolean> => {
    cancelPendingCloudSync('custom_pages', id);
    if (isFirebaseConfigured && db && !(await deleteDocumentFromFirestore('custom_pages', id))) return false;
    setCustomPages(prev=>prev.filter(p=>p.id!==id)); return true;
  };

  // Admin User methods
  const addAdminUser = (user: AdminUser) => {
    const email = user.email.trim().toLowerCase();
    const pending = user.id.startsWith('invite:');
    const normalized = pending ? { ...user, id: `invite:${email}`, email } : { ...user, email };
    setAdminUsers((prev) => [normalized, ...prev.filter((u) => u.id !== normalized.id)]);
    if (isFirebaseConfigured && db) {
      if (pending) syncDocumentToFirestore('admin_invites', email, { email, name:user.name, role:user.role, status:user.status, note:user.note || '', createdAt:user.createdAt });
      else syncDocumentToFirestore('admin_users', user.id, normalized);
    }
  };

  const updateAdminUser = (id: string, updates: Partial<AdminUser>) => {
    setAdminUsers((prev) => {
      const next = prev.map((u) => (u.id === id ? { ...u, ...updates } : u));
      const target = next.find((u) => u.id === id);
      if (target && isFirebaseConfigured && db) {
        if (id.startsWith('invite:')) {
          const email = target.email.trim().toLowerCase();
          syncDocumentToFirestore('admin_invites', email, { email, name:target.name, role:target.role, status:target.status, note:target.note || '', createdAt:target.createdAt });
        } else syncDocumentToFirestore('admin_users', id, target);
      }
      return next;
    });
  };

  const deleteAdminUser = (id: string) => {
    setAdminUsers((prev) => {
      const target = prev.find((u) => u.id === id);
      if (isFirebaseConfigured && db) {
        if (id.startsWith('invite:') && target) deleteDocumentFromFirestore('admin_invites', target.email.trim().toLowerCase());
        else deleteDocumentFromFirestore('admin_users', id);
      }
      return prev.filter((u) => u.id !== id);
    });
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
