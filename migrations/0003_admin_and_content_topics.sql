CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'EDITOR' CHECK(role IN ('SUPER_ADMIN','ADMIN','EDITOR','REVIEWER')),
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1 CHECK(active IN (0,1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login_at TEXT
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  token_hash TEXT PRIMARY KEY,
  csrf_token TEXT NOT NULL,
  admin_id INTEGER NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS content_topics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic_number INTEGER NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  title_vi TEXT NOT NULL,
  body_vi TEXT NOT NULL,
  title_en TEXT NOT NULL,
  body_en TEXT NOT NULL,
  page_slug TEXT NOT NULL,
  is_public INTEGER NOT NULL DEFAULT 1 CHECK(is_public IN (0,1)),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS sessions_expiry_idx ON admin_sessions(expires_at);
CREATE INDEX IF NOT EXISTS topics_public_idx ON content_topics(is_public,topic_number);

INSERT INTO content_topics(topic_number,slug,title_vi,body_vi,title_en,body_en,page_slug,is_public) VALUES
(1,'sky-first-la-gi','Sky First Network là gì?','Sky First là mạng lưới hoạt động theo định hướng giáo dục, phát triển con người và kết nối cộng đồng; tạo không gian để người trẻ học tập, trải nghiệm và đóng góp giá trị tích cực.','What is Sky First Network?','Sky First is a network for education, human development and community connection, creating room for young people to learn, experience and contribute positive value.','gioi-thieu',1),
(2,'cau-chuyen-hinh-thanh','Sky First được hình thành như thế nào?','Mạng lưới phát triển từ các hoạt động giáo dục cộng đồng của Sky First; khi nhu cầu điều phối, truyền thông, đối ngoại và dữ liệu mở rộng, một cấp mạng lưới chung trở nên cần thiết.','How was Sky First formed?','The Network developed from community education activities. As coordination, communications, external relations and data needs grew, a shared network level became necessary.','gioi-thieu',1),
(3,'y-nghia-sky-first','Ý nghĩa tên Sky First','Sky First thể hiện tinh thần không tự giới hạn khả năng phát triển: dám bắt đầu, chủ động học hỏi và dùng sự trưởng thành để tạo thêm cơ hội cho cộng đồng.','The meaning of Sky First','Sky First expresses the idea of not limiting human potential: begin, learn proactively and use growth to create opportunities for community.','gioi-thieu',1),
(4,'tam-nhin','Tầm nhìn của Sky First','Xây dựng hệ sinh thái giáo dục và phát triển cộng đồng có khả năng kết nối người trẻ, người học, tình nguyện viên, đội ngũ chuyên môn và nguồn lực xã hội.','Vision','Build an education and community-development ecosystem connecting young people, learners, volunteers, specialists and social resources.','gioi-thieu',1),
(5,'su-menh','Sứ mệnh của Sky First','Mở rộng cơ hội học tập, tạo môi trường trải nghiệm cho người trẻ, kết nối con người và nguồn lực, đồng thời tạo vòng tuần hoàn cơ hội cho cộng đồng.','Mission','Expand learning opportunities, create practical environments for young people, connect people and resources, and build a positive cycle of opportunity.','gioi-thieu',1),
(6,'gia-tri-cot-loi','Giá trị cốt lõi','Giáo dục; cộng đồng; trách nhiệm; chủ động và phát triển; kết nối và hợp tác; bền vững.','Core values','Education; community; responsibility; initiative and growth; connection and collaboration; sustainability.','gioi-thieu',1),
(7,'dinh-huong-2026','Định hướng phát triển 2026 và các năm tiếp theo','Ưu tiên xây nền: cơ cấu, trách nhiệm, Core Team, biểu mẫu, dữ liệu, quy trình và hoạt động giáo dục có nền tảng; mở rộng có chọn lọc khi đủ nhu cầu, nguồn lực và người phụ trách.','Direction for 2026 and beyond','Prioritise the foundation: structure, responsibility, Core Team, forms, data, processes and established education activity; expand selectively only with need, resources and accountable leadership.','gioi-thieu',1),
(8,'linh-vuc-hoat-dong','Năm lĩnh vực hoạt động','Giáo dục và học tập cộng đồng; phát triển người trẻ; tình nguyện và phát triển cộng đồng; kết nối và hợp tác; truyền thông giáo dục và cộng đồng.','Five areas of activity','Education and community learning; youth development; volunteering and community development; connection and collaboration; education and community communication.','hoat-dong',1),
(9,'doi-tuong','Đối tượng hướng đến','Người trẻ là trung tâm; mỗi chương trình có đối tượng phù hợp như người học, tình nguyện viên, người làm chuyên môn, đơn vị và đối tác.','Who we serve','Young people are central; each programme has an appropriate audience such as learners, volunteers, specialists, organisations and partners.','hoat-dong',1),
(10,'chuong-trinh-hien-tai','Chương trình, dự án và hoạt động hiện tại','Website chỉ công bố hoạt động đã có thông tin xác nhận, đầu mối phụ trách và trạng thái rõ ràng; không biến kế hoạch hoặc thử nghiệm thành thành tích đã có.','Current programmes, projects and activities','The website publishes only activities with confirmed information, an accountable contact and a clear status; plans and tests are not presented as completed achievements.','hoat-dong',1),
(11,'lop-hoc','Lớp học và chương trình giáo dục','Các hoạt động giáo dục hiện có được phát triển qua Câu lạc bộ Tiếng Anh The Sky First; thông tin mở lớp và đăng ký cần theo trạng thái từng đợt.','Classes and education programmes','Current education activity is developed through The Sky First English Club; opening and registration information must follow each programme status.','hoat-dong',1),
(12,'dau-moc','Dấu mốc nổi bật','Dấu mốc được kể theo hành trình phát triển từ giáo dục cộng đồng đến xây nền mạng lưới; không tự tạo lịch sử hoặc số liệu không xác nhận.','Milestones','Milestones are told through the journey from community education to building the Network; no unconfirmed history or figures are invented.','hoat-dong',1),
(13,'co-cau','Cơ cấu tổ chức','Cơ cấu theo hướng tinh gọn, trách nhiệm rõ và có khả năng mở rộng; chỉ công bố bộ phận, vai trò và nhân sự phù hợp để công khai.','Organisation','The structure is lean, accountable and scalable; only appropriate units, roles and people are published.','gioi-thieu',1),
(14,'don-vi-truc-thuoc','Đơn vị trực thuộc','Đơn vị được xác nhận là Câu lạc bộ Tiếng Anh The Sky First; đơn vị mới chỉ công bố khi tên, phạm vi, đầu mối và khả năng vận hành đã rõ.','Affiliated unit','The confirmed affiliated unit is The Sky First English Club; a new unit is published only when name, scope, contact point and operating capacity are clear.','don-vi',1),
(15,'english-club','Câu lạc bộ Tiếng Anh The Sky First','Câu lạc bộ tập trung vào tiếng Anh, giáo dục cộng đồng, lớp học, học liệu và hỗ trợ người học trong vai trò đơn vị trực thuộc.','The Sky First English Club','The Club focuses on English, community education, classes, learning materials and learner support as an affiliated unit.','don-vi',1),
(16,'doi-ngu-cong-khai','Đội ngũ công khai','Chỉ công khai đội ngũ ở mức cần thiết cho minh bạch và liên hệ; không đưa dữ liệu cá nhân hay đánh giá nội bộ không phù hợp.','Public team','The team is published only as needed for transparency and contact; unnecessary personal data and internal evaluations are not public.','gioi-thieu',1),
(17,'so-lieu','Số liệu công khai','Chỉ dùng số liệu có nguồn dữ liệu rõ và kiểm tra lại được; không dùng số ước tính hoặc số liệu để làm lớn quy mô.','Public data','Use only figures with a clear, verifiable source; do not use estimates or figures to inflate scale.','gioi-thieu',1),
(18,'doi-tac','Đối tác công khai','Tên và logo đối tác chỉ công bố khi có xác nhận về quan hệ và phạm vi sử dụng; không lấy logo để tạo cảm giác hợp tác chưa có.','Public partners','Partner names and logos are published only with confirmation of the relationship and scope of use; logos are never used to imply an unconfirmed partnership.','hop-tac',1),
(19,'hinh-thuc-tham-gia','Các hình thức tham gia','Người tham gia có thể là Core Team, tình nguyện viên, người học hoặc người đồng hành chuyên môn; từng hướng có luồng riêng.','Ways to participate','People can join as Core Team, volunteer, learner or professional collaborator; each route has its own flow.','tham-gia',1),
(20,'dang-ky','Đăng ký tham gia','Trang Tham gia phân luồng theo nhu cầu; biểu mẫu từng chương trình chỉ thu dữ liệu cần thiết và cần có xác nhận sau khi gửi.','Registration','The Participate page routes users by need; each programme form collects only necessary data and confirms receipt after submission.','tham-gia',1),
(21,'hinh-thuc-hop-tac','Hình thức hợp tác','Có thể đồng tổ chức chương trình, đồng hành chuyên môn, truyền thông/kết nối cộng đồng và hỗ trợ nguồn lực hợp pháp phù hợp.','Forms of collaboration','Possible forms include co-organised programmes, professional support, communication/community connection and appropriate lawful resource support.','hop-tac',1),
(22,'lien-he-hop-tac','Liên hệ hợp tác','Đối tác gửi thông tin qua biểu mẫu hoặc email chính thức, nêu mục tiêu, hình thức, thời gian và tài liệu liên quan; đề xuất được chuyển đúng đầu mối xem xét.','Contact for collaboration','Partners use the official form or email with goal, desired form, timing and relevant material; proposals are routed to the appropriate contact point.','hop-tac',1),
(23,'tin-tuc','Tin tức và hoạt động','Mục Tin tức phản ánh hoạt động thực tế bằng bài đã duyệt: tiêu đề, ngày, ảnh, mô tả, đơn vị phụ trách, trạng thái và hạn đăng ký nếu có.','News and activities','The News section reflects real activity through approved articles with title, date, image, description, responsible unit, status and closing date where relevant.','tin-tuc',1),
(24,'thu-vien-hinh-anh','Thư viện hình ảnh','Ảnh tổ chức theo lớp học, đội ngũ, chương trình/cộng đồng, sự kiện, ấn phẩm; chỉ dùng ảnh được phép công khai và có mô tả phù hợp.','Image library','Images are organised by learning, team, programmes/community, events and communications; only images approved for public use with appropriate descriptions are used.','thu-vien',1),
(25,'tai-lieu-cong-khai','Tài liệu công khai','Chỉ công bố tài liệu đã xác định dành cho bên ngoài; không công khai hồ sơ ứng viên, dữ liệu học viên, đánh giá nội bộ hoặc tài liệu có dữ liệu cá nhân.','Public documents','Only externally approved documents are published; applicant records, learner data, internal evaluations and documents with personal data are not public.','thu-vien',1),
(26,'tra-cuu-gcn','Tra cứu và xác thực GCN','Người dùng tra cứu mã hoặc QR; chỉ hiển thị thông tin tối thiểu để xác thực. Trạng thái gồm hợp lệ, thu hồi, hết hiệu lực, không tìm thấy hoặc bản test gắn nhãn rõ.','Certificate verification','Users look up a code or QR; only minimum verification data is shown. Statuses include valid, revoked, expired, not found or clearly marked test.','tra-cuu',1),
(27,'cong-he-thong','Các cổng hệ thống','Website chính liên kết cổng thông tin, thành viên, tình nguyện viên, học thuật và tra cứu khi sẵn sàng; không trình bày đường dẫn chưa hoạt động như tính năng hoàn thiện.','System portals','The main website links information, member, volunteer, academic and verification portals when ready; unavailable links are not shown as complete features.','he-thong',1),
(28,'lien-he-chinh-thuc','Thông tin liên hệ chính thức','Dùng website skyfirst.io.vn, email chung skyfirst.ec@gmail.com và Hotline/Zalo 0924 910 210; ưu tiên đầu mối chung thay vì thông tin cá nhân.','Official contacts','Use skyfirst.io.vn, the common email skyfirst.ec@gmail.com and Hotline/Zalo 0924 910 210; shared contact points take priority over personal contact details.','lien-he',1),
(29,'quy-chuan-logo','Logo và quy chuẩn nhận diện','Logo Sky First là nhận diện chính của website; logo thương hiệu/chứng nhận dùng đúng ngữ cảnh xác thực. Không tự vẽ lại, bóp méo, đổi màu hoặc tạo biến thể chưa duyệt.','Logo and brand rules','The Sky First logo is the main website identity; the brand/certificate logo is used only in its verification context. Never redraw, distort, recolour or create unapproved variants.','gioi-thieu',1),
(30,'thong-diep-trang-chu','Thông điệp Trang chủ','Thông điệp chính giải thích ba trụ cột giáo dục, phát triển con người và cộng đồng; ngôn ngữ tích cực nhưng không phóng đại quy mô hoặc thành tích.','Homepage message','The main message explains education, human development and community; language is positive without exaggerating scale or achievements.','home',1),
(31,'hanh-dong-chinh','Hành động chính trên Trang chủ','Trang chủ giúp người dùng đi đúng hướng: tìm hiểu, tham gia, xem chương trình, tình nguyện, hợp tác hoặc tra cứu thay vì dồn vào một form.','Primary homepage actions','The homepage directs users to learn, participate, view programmes, volunteer, collaborate or verify instead of forcing everyone into one form.','home',1),
(32,'khong-cong-khai','Nội dung tuyệt đối không công khai','Không công khai secret, token, cấu hình, dữ liệu cá nhân, thông tin chưa xác nhận, tài sản không có quyền dùng hoặc dữ liệu test trình bày như thật.','Content that is never public','Never publish secrets, tokens, configuration, personal data, unconfirmed information, unlicensed assets or test data presented as real.','gioi-thieu',1),
(33,'tu-cach-phap-ly','Tư cách tổ chức và pháp lý','Sky First có hệ thống tổ chức và vận hành riêng nhưng hiện chưa phải pháp nhân độc lập. Khi cần chủ thể pháp lý phù hợp, mạng lưới không dùng danh nghĩa của mình để thay thế tư cách chưa có.','Organisational and legal status','Sky First has its own organisation and operations but is not currently an independent legal entity. When an appropriate legal party is needed, the Network does not substitute a status it does not hold.','gioi-thieu',1);
