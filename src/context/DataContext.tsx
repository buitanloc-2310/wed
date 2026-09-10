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

const STORAGE_KEY = 'sfn_website_cms_data_v2';

const CONTENT_SOURCE_VERSION = 'sfn-word-33q-2026-09-11-v1';
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
  footerPortals:[{label:'Website Sky First Network',domain:'skyfirst.io.vn',url:'https://skyfirst.io.vn/',icon:'globe'},{label:'Cổng Thông tin',domain:'ctt.skyfirst.io.vn',url:'https://ctt.skyfirst.io.vn/',icon:'globe'},{label:'Cổng Tình nguyện viên',domain:'tnv.skyfirst.io.vn',url:'https://tnv.skyfirst.io.vn/',icon:'heart'},{label:'Cổng SFEC',domain:'ctt.sfec.skyfirst.io.vn',url:'https://ctt.sfec.skyfirst.io.vn/',icon:'graduation'},{label:'Nhà Hán Ngữ',domain:'ctt.nhahanngu.io.vn',url:'https://ctt.nhahanngu.io.vn/',icon:'graduation'}],
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
      bySlug.set(baseline.slug, { ...existing, ...baseline, id: existing.id || baseline.id });
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

  const siteConfigRef = useRef<SiteConfig>(siteConfig);
  useEffect(() => { siteConfigRef.current = siteConfig; }, [siteConfig]);

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
      const migrationKey = STORAGE_KEY + '_official_content_version';
      const needsOfficialContentRefresh = localStorage.getItem(migrationKey) !== CONTENT_SOURCE_VERSION;

      // Preserve user-created pages and ordinary CMS edits. Only the official Word-managed
      // slugs are refreshed once when the bundled content source version changes.
      const updated = parsed.map(p => {
        const defaultMatch = DEFAULT_CUSTOM_PAGES.find(dp => dp.id === p.id || dp.slug === p.slug);
        if (!defaultMatch) return p;
        const refreshFromOfficialSource = needsOfficialContentRefresh && OFFICIAL_MANAGED_SLUGS.has(defaultMatch.slug);
        return refreshFromOfficialSource
          ? { ...p, ...defaultMatch, id: defaultMatch.id, slug: defaultMatch.slug }
          : { ...defaultMatch, ...p, id: defaultMatch.id, slug: defaultMatch.slug };
      });

      DEFAULT_CUSTOM_PAGES.forEach((defaultPage) => {
        const exists = updated.some(p => p.id === defaultPage.id || p.slug === defaultPage.slug);
        if (!exists) updated.push(defaultPage);
      });
      if (needsOfficialContentRefresh) localStorage.setItem(migrationKey, CONTENT_SOURCE_VERSION);

      return updated.filter(p => !['home', 'programs', 'units', 'news'].includes(p.slug) && !['page-home', 'page-programs', 'page-units', 'page-news'].includes(p.id));
    } catch {
      return DEFAULT_CUSTOM_PAGES;
    }
  });

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY + '_admin_users');
      return stored ? JSON.parse(stored) as AdminUser[] : DEFAULT_ADMIN_USERS;
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

      // 2. Core pillars used directly by the public homepage
      await syncDocumentToFirestore('cms_modules', 'core_pillars', { items: corePillars });

      // 3. Custom Pages
      for (const page of customPages) {
        await syncDocumentToFirestore('custom_pages', page.id, page);
      }

      // 4. Programs
      for (const program of programs) {
        await syncDocumentToFirestore('programs', program.id, program);
      }

      // 5. Network Units
      for (const unit of networkUnits) {
        await syncDocumentToFirestore('network_units', unit.id, unit);
      }

      // 6. News Articles
      for (const article of newsArticles) {
        await syncDocumentToFirestore('news_articles', article.id, article);
      }

      // 7. Admin Users
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

      // 2. Core pillars used directly by the public homepage
      await syncDocumentToFirestore('cms_modules', 'core_pillars', { items: corePillars });

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

      // 7. Admin Users
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
        const pillarsDoc = await getDoc(doc(db, 'cms_modules', 'core_pillars'));
        if (configDoc.exists() && isMounted) {
          const remoteConfig = configDoc.data() as SiteConfig;
          setSiteConfig((prev) => ({
            ...prev,
            ...remoteConfig,
            homeSections: { ...prev.homeSections, ...(remoteConfig.homeSections || {}) },
          }));
        }

        if (pillarsDoc.exists() && isMounted) {
          const items = pillarsDoc.data()?.items;
          if (Array.isArray(items)) setCorePillars(items as CorePillar[]);
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
          if (remotePages.length > 0) setCustomPages(mergeOfficialPages(remotePages));
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
          setCustomPages(mergeOfficialPages(list));
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

    const unsubPillars = onSnapshot(
      doc(db, 'cms_modules', 'core_pillars'),
      (docSnap) => {
        if (docSnap.exists() && isMounted) {
          const items = docSnap.data()?.items;
          if (Array.isArray(items)) setCorePillars(items as CorePillar[]);
        }
      },
      (err) => console.warn('Lỗi listener core_pillars:', err)
    );

    return () => {
      isMounted = false;
      unsubConfig();
      unsubPages();
      unsubPrograms();
      unsubUnits();
      unsubNews();
      unsubPillars();
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
    siteConfigRef.current = next;
    setSiteConfig(next);
    if (isFirebaseConfigured && db) {
      return await syncDocumentToFirestore('site_config', 'current', next);
    }
    return true;
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
    setCorePillars((prev) => {
      const next = prev.map((p, i) => (i === index ? { ...p, ...updates } : p));
      if (isFirebaseConfigured && db) {
        syncDocumentToFirestore('cms_modules', 'core_pillars', { items: next });
      }
      return next;
    });
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
