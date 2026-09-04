-- Production baseline: only confirmed public content and admin-managed settings.
DELETE FROM site_languages WHERE code NOT IN ('vi','en');
UPDATE site_languages SET enabled=1, is_default=CASE WHEN code='vi' THEN 1 ELSE 0 END, sort_order=CASE WHEN code='vi' THEN 1 ELSE 2 END;

INSERT OR REPLACE INTO site_settings(key,value,group_name,value_type,is_public) VALUES
('site_name','SKY FIRST NETWORK','general','text',1),
('organization_name','Mạng lưới Giáo dục & Phát triển Cộng đồng Sky First','general','text',1),
('tagline','Giáo dục · Văn hóa · Cộng đồng','general','text',1),
('footer_description','Khởi nguồn từ giáo dục miễn phí 2025 · Phát triển từ tri thức, văn hóa và cộng đồng.','general','text',1),
('instagram_url','https://www.instagram.com/sfn.network','contact','text',1),
('brand_primary','#159BFF','appearance','color',1),
('brand_navy','#062A67','appearance','color',1),
('surface_color','#FFFFFF','appearance','color',1),
('page_background','#F7FBFF','appearance','color',1),
('text_color','#172033','appearance','color',1),
('border_radius','18','appearance','number',1),
('header_logo_url','/assets/branding/sky-first-main-logo.png','appearance','media',1),
('favicon_url','/assets/branding/sky-first-main-logo.png','appearance','media',1),
('donation_bank_bin','','sponsorship','text',0),
('donation_account_number','','sponsorship','text',0),
('donation_account_name','','sponsorship','text',0),
('donation_transfer_note','[Họ tên / Tên đơn vị] + [Số điện thoại] + [Nội dung đồng hành]','sponsorship','text',1),
('donation_contact','skyfirst.ec@gmail.com','sponsorship','text',1);

DELETE FROM site_units WHERE code='NHN';
DELETE FROM pages WHERE slug='nhn';
DELETE FROM site_menus WHERE id=117;
UPDATE site_menus SET visible=0 WHERE id IN (6,8);

UPDATE pages SET title='Trang chủ',excerpt='Cổng thông tin chính thức của Sky First Network.',body_html='<section class="hero"><div class="container hero-grid"><div><span class="kicker">SKY FIRST NETWORK</span><h1>Giáo dục để phát triển.<br/>Kết nối để tạo giá trị.</h1><p class="lead">Mạng lưới Giáo dục &amp; Phát triển Cộng đồng Sky First kết nối người học, người trẻ, tình nguyện viên và nguồn lực xã hội để tạo nên cơ hội học tập, trải nghiệm và đóng góp có ý nghĩa.</p><div class="actions"><a class="btn primary" href="/gioi-thieu">Khám phá Sky First</a><a class="btn" href="/tham-gia">Tham gia cùng Sky First</a></div></div><div class="hero-card"><img alt="Sky First Network" src="/assets/branding/sky-first-main-logo.png"/><div class="hero-note"><b>SKY FIRST NETWORK</b><span>Education &amp; Community Development</span></div></div></div></section><section class="section"><div class="container"><div class="eyebrow">GIỚI THIỆU</div><h2>Một không gian chung để học tập, trải nghiệm và đóng góp</h2><div class="cards three"><a class="card linkcard" href="/gioi-thieu"><span>01</span><h3>Tổng quan Sky First Network</h3><p>Tìm hiểu định danh, câu chuyện hình thành và giá trị tạo ra cho cộng đồng.</p></a><a class="card linkcard" href="/tam-nhin-su-menh"><span>02</span><h3>Tầm nhìn &amp; Sứ mệnh</h3><p>Định hướng phát triển con người, giáo dục và kết nối cộng đồng.</p></a><a class="card linkcard" href="/nguyen-tac"><span>03</span><h3>Năm nguyên tắc hoạt động</h3><p>Tự nguyện, phi lợi nhuận, minh bạch, tôn trọng và trách nhiệm cộng đồng.</p></a></div></div></section>',seo_title='Sky First Network | Giáo dục · Văn hóa · Cộng đồng',seo_description='Cổng thông tin chính thức của Sky First Network.' WHERE slug='' AND lang='vi';

UPDATE pages SET body_html='<div class="eyebrow">ĐƠN VỊ TRỰC THUỘC</div><h1>Không gian chuyên môn của Sky First Network</h1><p class="lead">Đơn vị trực thuộc hoạt động theo phạm vi chuyên môn riêng, dưới định hướng chung của Sky First Network.</p><div class="cards two"><a class="unit" href="/sfec"><img src="/assets/branding/sfec-logo.png" alt="Câu lạc bộ Tiếng Anh The Sky First"><div><small>ĐƠN VỊ TRỰC THUỘC</small><h3>Câu lạc bộ Tiếng Anh The Sky First</h3><p>Tiếng Anh, giáo dục cộng đồng, lớp học, học liệu và hỗ trợ người học.</p><b>Xem hồ sơ đơn vị →</b></div></a></div><p class="note">Đơn vị mới chỉ được công bố sau khi có xác nhận về tên, phạm vi, đầu mối phụ trách và khả năng vận hành.</p>' WHERE slug='don-vi' AND lang='vi';

UPDATE pages SET body_html='<div class="eyebrow">CƠ CẤU &amp; VẬN HÀNH</div><h1>Cơ cấu tinh gọn, trách nhiệm rõ ràng</h1><p>Sky First Network vận hành theo định hướng có đầu mối phụ trách, quy trình phối hợp, khả năng bàn giao và kế thừa. Chỉ công bố cơ cấu, vai trò và nhân sự đã được xác nhận phù hợp để công khai.</p><div class="org"><div class="org-top">SKY FIRST NETWORK</div><div class="org-row"><div>Văn phòng &amp; Điều hành</div><div>Nội dung &amp; Đào tạo</div><div>Đối ngoại &amp; Sự kiện</div></div><div class="org-row two"><div>Câu lạc bộ Tiếng Anh The Sky First</div></div></div>' WHERE slug='co-cau' AND lang='vi';
