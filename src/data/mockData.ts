import { Program, NewsArticle, Certificate, TimelineMilestone, CorePillar, TeamMember, FAQItem, NetworkUnit } from '../types';

export const NETWORK_UNITS: NetworkUnit[] = [
  {id:'unit-sfec',code:'SFEC',name:'Câu lạc bộ Tiếng Anh The Sky First',tagline:'Đơn vị trực thuộc tập trung vào tiếng Anh và giáo dục cộng đồng.',slug:'the-sky-first-english-club',isPublished:true,category:'education',categoryLabel:'Giáo dục & Đào tạo',leader:{name:'',title:'Người phụ trách'},description:'Câu lạc bộ Tiếng Anh The Sky First (SFEC) là đơn vị trực thuộc Mạng lưới Giáo dục & Phát triển Cộng đồng Sky First (SFN), tập trung vào lĩnh vực tiếng Anh và giáo dục cộng đồng.',mission:'Triển khai các hoạt động tiếng Anh, lớp học, học liệu, quản lý học viên và kết nối tình nguyện viên dạy học theo phạm vi của SFEC.',functions:['Lớp học và hoạt động tiếng Anh','Nội dung và học liệu giáo dục','Hỗ trợ người học và kết nối tình nguyện viên dạy học'],keyProjects:[],contact:{address:'',email:'',phone:'',portal:'https://ctt.sfec.skyfirst.io.vn/'},theme:'sky',imageDescription:'Logo Câu lạc bộ Tiếng Anh The Sky First',imageSizeText:'Logo chính thức',imageUrl:'/brand/the-sky-first-english-club-web.png',isFlagship:true}
];

// Chưa có số liệu được xác minh để công khai. Khối thống kê mặc định không dùng trên trang chủ.
export const SFN_STATS = [];

export const CORE_PILLARS: CorePillar[] = [
 {number:'01',title:'Giáo dục & Đào tạo',shortDesc:'Phát triển các hoạt động học tập, ngoại ngữ, kỹ năng và trải nghiệm giáo dục phù hợp với người trẻ.',fullDesc:'Phát triển các hoạt động học tập, ngoại ngữ, kỹ năng và trải nghiệm giáo dục phù hợp với người trẻ.',iconName:'GraduationCap',activities:[]},
 {number:'02',title:'Phát triển Người trẻ',shortDesc:'Tạo môi trường để người trẻ chủ động trải nghiệm, rèn luyện và phát triển năng lực.',fullDesc:'Tạo môi trường để người trẻ chủ động trải nghiệm, rèn luyện và phát triển năng lực.',iconName:'Users',activities:[]},
 {number:'03',title:'Tình nguyện & Cộng đồng',shortDesc:'Thực hiện các hoạt động cộng đồng thiết thực, có định hướng và giá trị xã hội rõ ràng.',fullDesc:'Thực hiện các hoạt động cộng đồng thiết thực, có định hướng và giá trị xã hội rõ ràng.',iconName:'HeartHandshake',activities:[]},
 {number:'04',title:'Kết nối & Hợp tác',shortDesc:'Mở rộng kết nối giữa cá nhân, nhóm, đơn vị và các sáng kiến phù hợp.',fullDesc:'Mở rộng kết nối giữa cá nhân, nhóm, đơn vị và các sáng kiến phù hợp.',iconName:'Network',activities:[]},
 {number:'05',title:'Truyền thông & Lan tỏa',shortDesc:'Lan tỏa tri thức, câu chuyện tích cực và các hoạt động có giá trị cho cộng đồng.',fullDesc:'Lan tỏa tri thức, câu chuyện tích cực và các hoạt động có giá trị cho cộng đồng.',iconName:'Megaphone',activities:[]}
];

export const CORE_VALUES = [
 {name:'Giáo dục',desc:'Coi tri thức, kỹ năng, khả năng tự học và học từ trải nghiệm là nền tảng cho sự phát triển.',theme:'sky'},
 {name:'Cộng đồng',desc:'Hướng hoạt động đến giá trị thực tế cho con người và những nhu cầu phù hợp của cộng đồng.',theme:'emerald'},
 {name:'Trách nhiệm',desc:'Đề cao trách nhiệm với nhiệm vụ, thời hạn, dữ liệu, nguồn lực và việc bàn giao công việc.',theme:'amber'},
 {name:'Chủ động và phát triển',desc:'Khuyến khích người trẻ đề xuất, thử sức trong phạm vi phù hợp, học hỏi và tiến bộ.',theme:'indigo'},
 {name:'Kết nối và hợp tác',desc:'Tạo điều kiện cho con người, tri thức và nguồn lực được kết nối đúng cách để cùng tạo giá trị.',theme:'sky'},
 {name:'Bền vững',desc:'Ưu tiên những mô hình có thể vận hành thực tế, có trách nhiệm, có quy trình và khả năng kế thừa.',theme:'emerald'}
];

// Không seed chương trình, tin tức, giấy chứng nhận, nhân sự hoặc thành tích giả định.
export const PROGRAMS_DATA: Program[] = [];
export const NEWS_DATA: NewsArticle[] = [];
export const CERTIFICATES_DATABASE: Record<string, Certificate> = {};
export const TIMELINE_DATA: TimelineMilestone[] = [];
export const TEAM_DATA: TeamMember[] = [];

export const FAQS_DATA: FAQItem[] = [
 {category:'general',question:'Sky First Network là gì?',answer:'Sky First Network là Mạng lưới Giáo dục & Phát triển Cộng đồng, được xây dựng như một không gian chung để kết nối các hoạt động giáo dục, phát triển người trẻ, tình nguyện, hợp tác và truyền thông cộng đồng.'},
 {category:'volunteer',question:'Làm thế nào để đăng ký tham gia hoạt động tình nguyện?',answer:'Bạn có thể sử dụng mục “Tham gia” trên website. Thông tin cụ thể về từng đợt hoạt động chỉ được công bố khi có kế hoạch chính thức.'},
 {category:'cert',question:'Tra cứu Giấy chứng nhận như thế nào?',answer:'Nhập mã Giấy chứng nhận tại trang Tra cứu Giấy chứng nhận để kiểm tra thông tin đã được ghi nhận trong hệ thống Sky First Network.'}
];
