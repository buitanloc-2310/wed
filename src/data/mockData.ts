import { Program, NewsArticle, Certificate, TimelineMilestone, CorePillar, TeamMember, FAQItem, NetworkUnit } from '../types';

export const NETWORK_UNITS: NetworkUnit[] = [
 {id:'unit-sfec',code:'SFEC',name:'Câu lạc bộ Tiếng Anh The Sky First',tagline:'Đơn vị trực thuộc tập trung vào tiếng Anh và giáo dục cộng đồng.',slug:'the-sky-first-english-club',isPublished:true,category:'education',categoryLabel:'Giáo dục & Đào tạo',leader:{name:'[Cập nhật]',title:'Người phụ trách'},description:'Câu lạc bộ Tiếng Anh The Sky First là đơn vị trực thuộc Sky First Network, tập trung triển khai các hoạt động tiếng Anh, lớp học, học liệu và hoạt động giáo dục cộng đồng.',mission:'Tạo môi trường học tập, thực hành và phát triển năng lực tiếng Anh phù hợp cho người học.',functions:['Lớp học và hoạt động tiếng Anh','Học liệu và nội dung giáo dục','Hoạt động cộng đồng liên quan đến ngoại ngữ'],keyProjects:[],contact:{address:'',email:'',phone:'',portal:''},theme:'sky',imageDescription:'Logo Câu lạc bộ Tiếng Anh The Sky First',imageSizeText:'Logo chính thức',imageUrl:'/brand/the-sky-first-english-club.png',isFlagship:true},
 {id:'unit-nhn',code:'NHN',name:'Nhà Hán Ngữ',tagline:'Kết nối tri thức • Mở lối tương lai',slug:'nha-han-ngu',isPublished:true,category:'education',categoryLabel:'Giáo dục & Đào tạo',leader:{name:'[Cập nhật]',title:'Người phụ trách'},description:'Nhà Hán Ngữ là đơn vị trực thuộc Sky First Network. Nội dung giới thiệu chi tiết, hoạt động và thông tin liên hệ có thể cập nhật trực tiếp trong trang quản trị website.',mission:'Phát triển môi trường học tập và kết nối tri thức về Hán ngữ theo định hướng của đơn vị.',functions:['Hoạt động học tập Hán ngữ','Nội dung và tài liệu học tập','Hoạt động kết nối người học'],keyProjects:[],contact:{address:'',email:'',phone:'',portal:''},theme:'amber',imageDescription:'Logo Nhà Hán Ngữ',imageSizeText:'Logo chính thức',imageUrl:'/brand/nha-han-ngu.jpg'}
];

export const SFN_STATS = [
  {
    label: 'Thành viên & TNV',
    value: '0',
    subtext: 'Đang mở đơn kết nối thành viên',
    color: 'sky',
    gradient: 'from-[#0EA5E9] to-[#2563EB]'
  },
  {
    label: 'Dự án & Chiến dịch',
    value: '0',
    subtext: 'Sẵn sàng khởi động năm 2026',
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-600'
  },
  {
    label: 'Điểm trường kết nối',
    value: '0',
    subtext: 'Kế hoạch khảo sát địa bàn',
    color: 'amber',
    gradient: 'from-amber-500 to-orange-500'
  },
  {
    label: 'Giờ tình nguyện cống hiến',
    value: '0',
    subtext: 'Bắt đầu ghi nhận giờ hoạt động',
    color: 'rose',
    gradient: 'from-rose-500 to-pink-600'
  },
];

export const CORE_PILLARS: CorePillar[] = [
  {
    number: '01',
    title: 'Giáo dục & Đào tạo',
    shortDesc: 'Tổ chức các khóa học, hội thảo, chuyên đề đào tạo kỹ năng thực hành và nâng cao tri thức cho thế hệ trẻ.',
    fullDesc: 'SFN xây dựng các chương trình đào tạo ứng dụng cao, tập trung vào kỹ năng thế kỷ 21: tư duy phản biện, kỹ năng lãnh đạo, giải quyết vấn đề xã hội, quản lý thời gian và ứng dụng công nghệ.',
    iconName: 'GraduationCap',
    activities: [
      'Khóa rèn luyện Kỹ năng Lãnh đạo Trẻ (Youth Leadership)',
      'Chuỗi Workshop Kỹ năng mềm & Ứng dụng Công nghệ',
      'Chương trình bồi dưỡng năng lực giảng dạy cộng đồng',
      'Học bổng và tài trợ khóa học cho thanh niên vượt khó'
    ]
  },
  {
    number: '02',
    title: 'Phát triển Người trẻ',
    shortDesc: 'Tạo lập môi trường rèn luyện thực tế, mentor đồng hành giúp phát huy tối đa năng lực tiềm ẩn của thanh niên.',
    fullDesc: 'Mô hình phát triển toàn diện kết hợp giữa học tập lý thuyết, thử thách thực địa và mạng lưới cố vấn (mentorship) giàu kinh nghiệm từ các cựu thành viên và chuyên gia.',
    iconName: 'Sparkles',
    activities: [
      'Chương trình Cố vấn 1-on-1 (SFN Mentorship Hub)',
      'Thử thách Sáng kiến Xã hội dành cho Người trẻ',
      'Diễn đàn kết nối định hướng nghề nghiệp và du học',
      'Không gian sáng tạo và CLB kỹ năng thanh niên'
    ]
  },
  {
    number: '03',
    title: 'Tình nguyện & Cộng đồng',
    shortDesc: 'Thực hiện các chiến dịch tình nguyện thiết thực, đóng góp tích cực cho sự phát triển xã hội và địa phương.',
    fullDesc: 'Triển khai các hoạt động thiện nguyện có chiều sâu và tính bền vững, tập trung vào giáo dục trẻ em vùng sâu vùng xa, bảo vệ môi trường và hỗ trợ đồng bào có hoàn cảnh khó khăn.',
    iconName: 'HeartHandshake',
    activities: [
      'Chiến dịch Mùa Hè Xanh & Tình Nguyện Mùa Đông',
      'Dự án "Tủ Sách Tri Thức Vùng Cao" cho học sinh tiểu học',
      'Ngày hội Tình nguyện viên Xanh vì Môi trường',
      'Các đợt quyên góp hỗ trợ khẩn cấp sau thiên tai'
    ]
  },
  {
    number: '04',
    title: 'Kết nối & Hợp tác',
    shortDesc: 'Xây dựng mạng lưới đối tác với các tổ chức giáo dục, doanh nghiệp và cộng đồng nhằm mở rộng nguồn lực.',
    fullDesc: 'Liên kết chặt chẽ với các trường Đại học, Trung học, các doanh nghiệp trách nhiệm xã hội (CSR) và các tổ chức phi chính phủ (NGOs) để kiến tạo giá trị cộng hưởng.',
    iconName: 'Network',
    activities: [
      'Ký kết hợp tác đồng hành cùng các Đoàn trường ĐH/THPT',
      'Liên kết tài trợ nguồn lực từ doanh nghiệp có trách nhiệm xã hội',
      'Mạng lưới cựu thành viên SFN Alumni toàn quốc',
      'Hợp tác giao lưu thanh niên khu vực và quốc tế'
    ]
  },
  {
    number: '05',
    title: 'Truyền thông & Lan tỏa',
    shortDesc: 'Lan tỏa các giá trị tích cực, thông điệp giáo dục và thông tin hoạt động cộng đồng đến rộng rãi xã hội.',
    fullDesc: 'Sử dụng các nền tảng số đa kênh để truyền tải những câu chuyện truyền cảm hứng, bài học kỹ năng hữu ích và tạo động lực sống đẹp, sống có trách nhiệm cho giới trẻ.',
    iconName: 'Megaphone',
    activities: [
      'Chiến dịch truyền thông số lan tỏa lối sống tử tế',
      'Chuyên mục "Gương mặt trẻ SFN" và câu chuyện cống hiến',
      'Hệ thống Bản tin Tri thức & Podcast Giáo dục',
      'Sản xuất tài liệu và cẩm nang kỹ năng miễn phí'
    ]
  }
];

export const CORE_VALUES = [
 {name:'Giáo dục',desc:'Coi tri thức, kỹ năng, khả năng tự học và học từ trải nghiệm là nền tảng cho sự phát triển.',theme:'sky'},
 {name:'Cộng đồng',desc:'Hướng hoạt động đến giá trị thực tế cho con người và những nhu cầu phù hợp của cộng đồng.',theme:'emerald'},
 {name:'Trách nhiệm',desc:'Đề cao trách nhiệm với nhiệm vụ, thời hạn, dữ liệu, nguồn lực và việc bàn giao công việc.',theme:'amber'},
 {name:'Chủ động và phát triển',desc:'Khuyến khích người trẻ đề xuất, thử sức trong phạm vi phù hợp, học hỏi và tiến bộ.',theme:'indigo'},
 {name:'Kết nối và hợp tác',desc:'Tạo điều kiện cho con người, tri thức và nguồn lực được kết nối đúng cách để cùng tạo giá trị.',theme:'sky'},
 {name:'Bền vững',desc:'Ưu tiên những mô hình có thể vận hành thực tế, có trách nhiệm, có quy trình và khả năng kế thừa.',theme:'emerald'}
]

export const PROGRAMS_DATA: Program[] = [
  {
    id: 'prog-01',
    title: 'Khóa rèn luyện Kỹ năng Lãnh đạo Trẻ 2026 (SFN Leadership Bootcamp)',
    category: 'education',
    categoryLabel: 'Giáo dục',
    status: 'open',
    statusLabel: 'Đang nhận đăng ký',
    summary: 'Chương trình đào tạo chuyên sâu về tư duy quản lý, điều phối dự án và kỹ năng mềm dành cho Core Team tương lai.',
    description: 'Khóa rèn luyện Kỹ năng Lãnh đạo Trẻ 2026 là chương trình thường niên trọng điểm của SFN và SFEC, được thiết kế thực tế thông qua các bài tập tình huống thực địa, quản trị nhân sự tình nguyện, truyền thông dự án và kỹ năng giải quyết khủng hoảng.',
    imageSizeText: '16:9 (800x450px)',
    imageDescription: 'Ảnh lớp học Leadership Bootcamp & Thảo luận nhóm',
    theme: 'sky',
    date: '15/09/2026 - 30/10/2026 (6 tuần)',
    location: 'Hybrid (Online Zoom + Offline tại Hà Nội & TP.HCM)',
    targetAudience: 'Sinh viên năm 1-4, học sinh THPT có tinh thần nhiệt huyết và mong muốn nâng cao năng lực lãnh đạo',
    spotsLeft: 18,
    timeline: [
      '15/09: Khai mạc & Module 01 - Tư duy Lãnh đạo phục vụ (Servant Leadership)',
      '22/09: Module 02 - Quản trị và lập kế hoạch Dự án Cộng đồng chuẩn quốc tế',
      '29/09: Module 03 - Kỹ năng Giao tiếp thấu cảm và Đàm phán đối tác',
      '06/10: Module 04 - Xử lý khủng hoảng truyền thông & Điều phối rủi ro',
      '15/10: Thực hành triển khai Dự án Giả định (Mini Project Hackathon)',
      '30/10: Lễ Tổng kết, Thuyết trình Dự án & Trao Giấy chứng nhận SFN'
    ],
    benefits: [
      'Giấy chứng nhận (GCN) chính thức có mã tra cứu trên hệ thống SFN',
      'Cơ hội được đề bạt trực tiếp vào Ban Điều Hành (Core Team) của SFN & SFEC',
      'Được đồng hành 1-on-1 cùng các Mentor là cựu thủ lĩnh sinh viên xuất sắc',
      'Mở rộng vòng quan hệ với hàng trăm bạn trẻ tài năng trên toàn quốc'
    ],
    requirements: [
      'Cam kết tham gia tối thiểu 85% thời lượng các buổi học',
      'Tinh thần trách nhiệm, chủ động, làm việc nhóm tích cực',
      'Có máy tính kết nối Internet để tham gia các buổi học Online'
    ]
  },
  {
    id: 'prog-02',
    title: 'Chiến dịch Tình nguyện Mùa Hè Xanh SFN 2026: "Ánh Sáng Tri Thức"',
    category: 'volunteer',
    categoryLabel: 'Tình nguyện',
    status: 'open',
    statusLabel: 'Đang nhận đăng ký',
    summary: 'Hành trình mang tri thức và sức trẻ đến các điểm trường vùng cao khó khăn, trao tặng tủ sách và hoạt động sinh hoạt hè.',
    description: 'Chiến dịch Tình nguyện thường niên kéo dài 10 ngày tại các xã vùng cao tỉnh Hà Giang và Lào Cai. Đoàn tình nguyện SFN sẽ sửa chữa phòng học, lắp đặt 04 tủ sách tri thức với hơn 2,000 đầu sách, tổ chức lớp dạy kỹ năng sống và ngày hội thiếu nhi cho các em học sinh dân tộc thiểu số.',
    imageSizeText: '16:9 (800x450px)',
    imageDescription: 'Ảnh đội hình tình nguyện viên SFN tại điểm trường vùng cao',
    theme: 'emerald',
    date: '10/07/2026 - 20/07/2026',
    location: 'Huyện Hoàng Su Phì, Tỉnh Hà Giang',
    targetAudience: 'Thanh niên, sinh viên từ 18 tuổi trở lên có sức khỏe tốt và tinh thần cống hiến',
    spotsLeft: 25,
    timeline: [
      '15/06: Hạn chót nhận đơn đăng ký tình nguyện viên',
      '20/06: Phỏng vấn tuyển chọn và phân công đội hình',
      '25/06 - 05/07: Tập huấn kỹ năng sinh tồn, sơ cấp cứu và quy tắc an toàn',
      '10/07: Lễ Xuất quân và di chuyển đến địa bàn đóng quân',
      '11/07 - 19/07: Triển khai các công trình thanh niên và lớp học trải nghiệm',
      '20/07: Lễ Bàn giao công trình và Tổng kết chiến dịch'
    ],
    benefits: [
      'Cấp Giấy chứng nhận hoàn thành Chiến dịch Tình nguyện SFN',
      'Được cấp đồng phục, áo SFN, nón và thẻ tình nguyện viên chính thức',
      'Được hỗ trợ chi phí ăn ở, đi lại trong suốt hành trình chiến dịch',
      'Được tập huấn đầy đủ về an toàn và kỹ năng tiền trạm'
    ],
    requirements: [
      'Đủ 18 tuổi, có sức khỏe tốt, không mắc bệnh tim mạch/truyền nhiễm',
      'Tuân thủ 100% kỷ luật của Ban Chỉ huy Chiến dịch',
      'Có tinh thần đồng đội cao, hòa đồng, không ngại khó khăn'
    ]
  },
  {
    id: 'prog-03',
    title: 'Đợt tuyển Ban Điều Hành (Core Team) SFN Khóa 05',
    category: 'recruitment',
    categoryLabel: 'Tuyển dụng',
    status: 'upcoming',
    statusLabel: 'Sắp mở tuyển',
    summary: 'Tìm kiếm các nhân tố nhiệt huyết cho các Ban: Truyền thông, Nội dung & Đào tạo, Đối ngoại và Quản trị Nhân sự SFN.',
    description: 'Core Team là bộ não vận hành mọi hoạt động của Sky First Network. Khi gia nhập Core Team, bạn sẽ trực tiếp tham gia xây dựng chiến lược, quản trị ngân sách dự án, làm việc cùng đối tác lớn và dẫn dắt hàng ngàn tình nguyện viên.',
    imageSizeText: '16:9 (800x450px)',
    imageDescription: 'Ảnh tập thể Core Team SFN trong buổi họp chiến lược',
    theme: 'amber',
    date: 'Mở đăng ký: 01/10/2026 - 20/10/2026',
    location: 'Toàn quốc (Làm việc linh hoạt Hybrid)',
    targetAudience: 'Sinh viên năng động, có kinh nghiệm hoạt động CLB/Đội/Nhóm hoặc mong muốn bứt phá bản thân',
    spotsLeft: 12,
    timeline: [
      'Vòng 1 (01/10 - 20/10): Nộp hồ sơ Application Form Online',
      'Vòng 2 (24/10 - 26/10): Test năng lực chuyên môn và xử lý tình huống',
      'Vòng 3 (30/10 - 02/11): Phỏng vấn chuyên sâu cùng Ban Cố vấn SFN',
      'Vòng 4 (05/11 - 05/12): 1 tháng Onboarding & Thử thách dự án thực tế'
    ],
    benefits: [
      'Phát triển kỹ năng quản lý dự án cấp mạng lưới đa tỉnh thành',
      'Thư giới thiệu (Letter of Recommendation) có dấu đỏ từ Chủ tịch SFN',
      'Tham gia các buổi đào tạo nội bộ độc quyền từ chuyên gia hàng đầu',
      'Được vinh danh và nhận phụ cấp trách nhiệm theo từng dự án'
    ],
    requirements: [
      'Dành được tối thiểu 8 - 12 giờ/tuần cho công việc của SFN',
      'Có tinh thần tự chủ, kỹ năng giao tiếp tốt và tư duy giải quyết vấn đề',
      'Ưu tiên ứng viên có kinh nghiệm viết content, design, dựng video hoặc đối ngoại'
    ]
  },
  {
    id: 'prog-04',
    title: 'Workshop: Ứng dụng AI & Công cụ số trong Quản lý Dự án Xã hội',
    category: 'workshop',
    categoryLabel: 'Workshop',
    status: 'open',
    statusLabel: 'Đang nhận đăng ký',
    summary: 'Chương trình hướng dẫn thực chiến cách ứng dụng ChatGPT, Notion, Canva và công cụ tự động hóa để tối ưu hóa công tác tình nguyện.',
    description: 'Buổi chia sẻ thực tế nhằm trang bị cho các bạn trẻ cách mạng hóa phương thức quản trị dự án phi lợi nhuận: tự động hóa gửi email chứng nhận, tạo kế hoạch truyền thông bằng AI, và quản lý ngân sách minh bạch trên nền tảng số.',
    imageSizeText: '16:9 (800x450px)',
    imageDescription: 'Ảnh diễn giả trình bày tại hội trường Workshop SFN',
    theme: 'rose',
    date: '20:00 - 22:00, Thứ Bảy 26/09/2026',
    location: 'Trực tuyến qua Google Meet & Livestream SFN Fanpage',
    targetAudience: 'Tất cả các bạn trẻ, cán bộ Đoàn - Hội, thủ lĩnh CLB/Đội/Nhóm thanh niên',
    spotsLeft: 150,
    timeline: [
      '20:00: Check-in & Khởi động workshop',
      '20:15: Phần 1 - Tư duy chuyển đổi số trong hoạt động cộng đồng',
      '20:45: Phần 2 - Thực hành Prompt Engineering cho kế hoạch truyền thông',
      '21:15: Phần 3 - Xây dựng Dashboard quản lý công việc và tình nguyện viên trên Notion',
      '21:45: Q&A hỏi đáp trực tiếp cùng diễn giả & Tặng tài liệu'
    ],
    benefits: [
      'Nhận trọn bộ Template Notion Quản lý Dự án do SFN thiết kế trị giá 500k',
      'E-Certificate tham dự workshop từ Sky First Network',
      'Hỏi đáp trực tiếp và giải quyết khó khăn của CLB bạn đang quản lý'
    ],
    requirements: [
      'Đăng ký trước biểu mẫu tham gia để nhận link phòng họp',
      'Chuẩn bị sổ tay ghi chú hoặc máy tính để thực hành'
    ]
  }
];

export const NEWS_DATA: NewsArticle[] = [
  {
    id: 'news-01',
    title: 'SFN chính thức công bố Bộ Quy chuẩn Giao diện & Vận hành Website 2026',
    category: 'announcement',
    categoryLabel: 'Thông báo',
    date: '28/08/2026',
    author: 'Ban Truyền thông SFN',
    readTime: '3 phút đọc',
    summary: 'Tài liệu quy định chi tiết về nhận diện thương hiệu, bố cục các cổng thông tin và quy trình cập nhật nội dung chuẩn hóa.',
    imageSizeText: '16:9 (800x450px)',
    imageDescription: 'Ảnh bìa công bố Bộ Quy chuẩn Thương hiệu & Website SFN 2026',
    theme: 'sky',
    tags: ['Quy chuẩn', 'Công nghệ số', 'SFN 2026'],
    content: [
      'Nhằm nâng cao tính chuyên nghiệp, tính đồng bộ và trải nghiệm người dùng trên các nền tảng trực tuyến, Mạng lưới Giáo dục & Phát triển Cộng đồng Sky First (SFN) chính thức ban hành Bộ Quy chuẩn Giao diện & Vận hành Website phiên bản 2026.',
      'Bộ quy chuẩn bao gồm các hướng dẫn cụ thể về bảng màu thương hiệu (Sky Blue #159BFF, Deep Blue #0648B8, Navy #062A67), hệ thống phông chữ Be Vietnam Pro, cấu trúc lưới giao diện, và chuẩn hóa hệ thống Tra cứu Giấy chứng nhận (GCN) trực tuyến.',
      'Toàn bộ các đơn vị trực thuộc như Trung tâm SFEC và các Ban chuyên môn sẽ áp dụng bộ quy chuẩn này trong toàn bộ các chiến dịch và cổng thông tin điện tử bắt đầu từ quý III/2026.'
    ]
  },
  {
    id: 'news-02',
    title: 'Tổng kết chiến dịch Tình nguyện Tri thức trẻ quý II năm 2026',
    category: 'community',
    categoryLabel: 'Cộng đồng',
    date: '20/08/2026',
    author: 'Ban Tình nguyện SFN',
    readTime: '4 phút đọc',
    summary: 'Hơn 500 giờ tình nguyện đã được trao đi cùng hàng trăm phần quà ý nghĩa cho các học sinh vượt khó tại điểm trường bản cao.',
    imageSizeText: '16:9 (800x450px)',
    imageDescription: 'Ảnh trao quà và tủ sách tri thức tại điểm trường vùng cao',
    theme: 'emerald',
    tags: ['Tri thức trẻ', 'Tình nguyện', 'Tổng kết'],
    content: [
      'Chiến dịch Tình nguyện Tri thức trẻ Quý II/2026 do SFN và SFEC phối hợp tổ chức đã chính thức khép lại với nhiều kết quả đáng tự hào.',
      'Hơn 85 tình nguyện viên xuất sắc đã trực tiếp tham gia 4 đợt hoạt động tại các địa phương vùng sâu. Tổng kết đợt công tác, đoàn đã trao tặng 2 tủ sách cộng đồng với hơn 1.200 đầu sách thiếu nhi, sơn sửa lại 6 phòng học và trao 30 suất học bổng "Thắp Sáng Ước Mơ".',
      'Đại diện chính quyền địa phương và Ban Giám hiệu nhà trường đã gửi lời cảm ơn sâu sắc đến tinh thần xung kích, trách nhiệm và tính kỷ luật mẫu mực của đội ngũ thanh niên SFN.'
    ]
  },
  {
    id: 'news-03',
    title: 'Khai giảng lớp tập huấn kỹ năng quản lý dự án cộng đồng cho TNV',
    category: 'training',
    categoryLabel: 'Đào tạo',
    date: '12/08/2026',
    author: 'Trung tâm SFEC',
    readTime: '3 phút đọc',
    summary: 'Chương trình giúp các bạn tình nguyện viên nắm vững quy trình lập kế hoạch, quản lý tiến độ và kiểm soát rủi ro dự án.',
    imageSizeText: '16:9 (800x450px)',
    imageDescription: 'Ảnh khai giảng khóa đào tạo kỹ năng quản lý dự án SFEC',
    theme: 'amber',
    tags: ['SFEC', 'Đào tạo TNV', 'Kỹ năng'],
    content: [
      'Sáng ngày 12/08/2026, Trung tâm Giáo dục & Cộng đồng Sky First (SFEC) đã chính thức khai giảng khóa tập huấn chuyên sâu "Quản lý Dự án Cộng đồng Thực chiến" với sự tham gia của 120 học viên là thành viên và TNV nòng cốt.',
      'Khóa học tập trung giải quyết các bài toán thực tiễn: lập bảng phân công công việc (WBS), dự trù ngân sách minh bạch, đàm phán xin tài trợ và kỹ năng quản lý cảm xúc trong đội nhóm.',
      'Các học viên hoàn thành khóa học và vượt qua bài kiểm tra cuối khóa sẽ được cấp Chứng chỉ Kỹ năng do SFEC và SFN công nhận.'
    ]
  }
];

export const CERTIFICATES_DATABASE: Record<string, Certificate> = {
  'SFN-2026-OK': {
    code: 'SFN-2026-OK',
    recipientName: 'Nguyễn Văn Phát Triển',
    recipientEmail: 'phattrien.nguyen@gmail.com',
    programTitle: 'Khóa Đào tạo Kỹ năng Lãnh đạo Trẻ 2026 (Leadership Bootcamp)',
    programType: 'Khóa Đào Tạo',
    issuer: 'Mạng lưới Giáo dục & Phát triển Cộng đồng Sky First (SFN)',
    issueDate: '15/06/2026',
    status: 'valid',
    grade: 'Xuất Sắc (Top 5%)',
    hoursCompleted: 48,
    verificationUrl: 'https://skyfirst.io.vn/verify?code=SFN-2026-OK',
    signatory: {
      name: 'Ban Điều Hành SFN',
      title: 'Chủ tịch Hội đồng Quản trị Mạng lưới'
    }
  },
  'SFN-2026-TNV01': {
    code: 'SFN-2026-TNV01',
    recipientName: 'Trần Thị Mỹ Linh',
    recipientEmail: 'mylinh.tran@gmail.com',
    programTitle: 'Chiến dịch Tình nguyện Tri thức trẻ Mùa Hè 2026',
    programType: 'Chiến Dịch Tình Nguyện',
    issuer: 'Ban Tình nguyện SFN & Trung tâm SFEC',
    issueDate: '20/07/2026',
    status: 'valid',
    grade: 'Tình nguyện viên Cống hiến Tiêu biểu',
    hoursCompleted: 120,
    verificationUrl: 'https://skyfirst.io.vn/verify?code=SFN-2026-TNV01',
    signatory: {
      name: 'Nguyễn Minh Tân Lợi',
      title: 'Trưởng Ban Chỉ huy Chiến dịch Tình nguyện'
    }
  },
  'SFN-2025-SFEC09': {
    code: 'SFN-2025-SFEC09',
    recipientName: 'Lê Hoàng Anh',
    recipientEmail: 'hoanganh.le@gmail.com',
    programTitle: 'Khóa Rèn luyện Kỹ năng Thuyết trình & Đàm phán Chuyên sâu',
    programType: 'Khóa Đào Tạo',
    issuer: 'Trung tâm Giáo dục & Cộng đồng Sky First (SFEC)',
    issueDate: '10/11/2025',
    status: 'valid',
    grade: 'Giỏi',
    hoursCompleted: 36,
    verificationUrl: 'https://skyfirst.io.vn/verify?code=SFN-2025-SFEC09',
    signatory: {
      name: 'Ban Giám đốc SFEC',
      title: 'Giám đốc Trung tâm Giáo dục SFEC'
    }
  },
  'SFN-TEST': {
    code: 'SFN-TEST',
    recipientName: 'Người dùng Thử nghiệm (Test User)',
    recipientEmail: 'test@skyfirst.io.vn',
    programTitle: 'Chương trình Thử nghiệm Mẫu Xác thực Hệ thống Số SFN',
    programType: 'Chứng Nhận Cống Hiến',
    issuer: 'Ban Công nghệ & Chuyển đổi số SFN',
    issueDate: '01/01/2026',
    status: 'test',
    grade: 'Dữ liệu Thử nghiệm',
    hoursCompleted: 10,
    verificationUrl: 'https://skyfirst.io.vn/verify?code=SFN-TEST',
    signatory: {
      name: 'Hệ thống Kiểm thử SFN',
      title: 'Bộ phận Kỹ thuật & Hạ tầng số'
    }
  }
};

export const TIMELINE_DATA: TimelineMilestone[] = [
  {
    year: '2024',
    title: 'Khởi xướng Mạng lưới SFN',
    description: 'Đặt nền móng cho mô hình kết nối giáo dục cộng đồng và định hình các giá trị cốt lõi.',
    highlights: [
      'Thành lập nhóm sáng lập với 15 thành viên ban đầu',
      'Tổ chức 3 chiến dịch tình nguyện tặng sách tại vùng sâu',
      'Định hình 5 trụ cột phát triển dài hạn'
    ]
  },
  {
    year: '2025',
    title: 'Thành lập Trung tâm SFEC & Mở rộng',
    description: 'Chính thức ra mắt Trung tâm SFEC và mở rộng chuỗi chương trình đào tạo kỹ năng cho học sinh, sinh viên.',
    highlights: [
      'Thành lập pháp nhân Trung tâm Giáo dục & Cộng đồng Sky First (SFEC)',
      'Đào tạo hơn 1.200 học viên qua các khóa kỹ năng thực tiễn',
      'Mở rộng chi nhánh hoạt động tại 3 cụm trường Đại học lớn'
    ]
  },
  {
    year: '2026',
    title: 'Chuẩn hóa & Vận hành Hệ thống số SFN',
    description: 'Ban hành Bộ quy chuẩn Website, ra mắt Cổng thông tin, Cổng TNV và hệ thống Tra cứu GCN trực tuyến.',
    highlights: [
      'Ban hành Quy chuẩn Giao diện & Thương hiệu SFN 2026',
      'Ra mắt Cổng Thông Tin (ctt.skyfirst.io.vn) và Cổng TNV (tnv.skyfirst.io.vn)',
      'Số hóa 100% quy trình cấp và tra cứu Giấy chứng nhận trực tuyến',
      'Đạt mốc hơn 3.500 thành viên và tình nguyện viên đăng ký hoạt động'
    ],
    isCurrent: true
  }
];

export const TEAM_DATA: TeamMember[] = [
  {
    name: 'Nguyễn Minh Tân Lợi',
    role: 'Sáng lập & Chủ tịch Mạng lưới SFN',
    bio: 'Nhiều năm kinh nghiệm điều hành các dự án giáo dục cộng đồng, khởi xướng chuỗi sáng kiến hỗ trợ thanh niên Việt Nam.',
    imageSizeText: '1:1 (400x400px)',
    imageDescription: 'Ảnh chân dung Nguyễn Minh Tân Lợi',
    theme: 'sky'
  },
  {
    name: 'Trần Thảo Nguyên',
    role: 'Giám đốc Trung tâm SFEC',
    bio: 'Chuyên gia thiết kế chương trình đào tạo kỹ năng mềm và phát triển năng lực lãnh đạo trẻ cho học sinh, sinh viên.',
    imageSizeText: '1:1 (400x400px)',
    imageDescription: 'Ảnh chân dung Trần Thảo Nguyên',
    theme: 'emerald'
  },
  {
    name: 'Lê Quốc Hưng',
    role: 'Trưởng Ban Đối ngoại & Hợp tác',
    bio: 'Phụ trách mở rộng quan hệ đối tác chiến lược cùng các trường Đại học, doanh nghiệp CSR và các tổ chức phi chính phủ.',
    imageSizeText: '1:1 (400x400px)',
    imageDescription: 'Ảnh chân dung Lê Quốc Hưng',
    theme: 'amber'
  },
  {
    name: 'Phạm Thuỳ Dương',
    role: 'Trưởng Ban Truyền thông & Thương hiệu',
    bio: 'Sáng tạo nội dung số, dẫn dắt các chiến dịch truyền thông lan tỏa giá trị tích cực đến hàng trăm ngàn bạn trẻ.',
    imageSizeText: '1:1 (400x400px)',
    imageDescription: 'Ảnh chân dung Phạm Thuỳ Dương',
    theme: 'rose'
  }
];

export const FAQS_DATA: FAQItem[] = [
  {
    category: 'general',
    question: 'Sky First Network (SFN) là tổ chức như thế nào?',
    answer: 'Sky First Network (SFN) là Mạng lưới Giáo dục & Phát triển Cộng đồng, hoạt động với tôn chỉ kết nối, giáo dục và phát triển kỹ năng cho người trẻ thông qua các hoạt động thực tế, dự án xã hội và chương trình cống hiến bền vững.'
  },
  {
    category: 'education',
    question: 'Trung tâm SFEC có vai trò gì trong mạng lưới SFN?',
    answer: 'Trung tâm Giáo dục & Cộng đồng Sky First (SFEC) là đơn vị trực thuộc SFN, chịu trách nhiệm nghiên cứu, thiết kế và trực tiếp triển khai các khóa học kỹ năng, workshop đào tạo và các dự án giáo dục thực nghiệm.'
  },
  {
    category: 'volunteer',
    question: 'Làm thế nào để trở thành Tình nguyện viên chính thức của SFN?',
    answer: 'Bạn chỉ cần chọn mục "Tham gia" trên thanh menu để điền biểu mẫu đăng ký. Sau khi tiếp nhận, Ban Nhân sự SFN sẽ liên hệ và xếp bạn vào đợt tập huấn phù hợp.'
  },
  {
    category: 'cert',
    question: 'Giấy chứng nhận (GCN) do SFN cấp có những quyền lợi gì và tra cứu ra sao?',
    answer: 'Mỗi GCN cấp bởi SFN hoặc SFEC đều có Mã định danh duy nhất (Unique Code). Bạn có thể nhập mã này vào trang "Tra cứu GCN" để kiểm tra tính xác thực, số giờ cống hiến và xếp loại chính thức.'
  }
];
