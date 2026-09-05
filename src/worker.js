const APP_ORIGIN = 'https://skyfirst.io.vn';
const PUBLIC_PAGE_WINDOW = "status='published' AND is_public=1";

const html = (value, status = 200, headers = {}) => new Response(value, { status, headers: { 'content-type': 'text/html; charset=utf-8', ...headers } });
const json = (value, status = 200, headers = {}) => new Response(JSON.stringify(value), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers } });
const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
const attr = esc;
const sqlOne = (env, query, ...bind) => env.DB.prepare(query).bind(...bind).first();
const sqlAll = async (env, query, ...bind) => (await env.DB.prepare(query).bind(...bind).all()).results;

function parsePath(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  const language = parts[0] === 'en' ? 'en' : 'vi';
  if (language === 'en') parts.shift();
  return { language, path: '/' + parts.join('/') };
}

function localized(path, language) {
  const clean = path === '/' ? '' : path;
  return language === 'en' ? `/en${clean || '/'}` : clean || '/';
}

function apiHeaders() {
  return { 'access-control-allow-origin': APP_ORIGIN, 'access-control-allow-methods': 'GET,POST,OPTIONS', 'access-control-allow-headers': 'content-type' };
}

async function context(env, language) {
  const [settingsRows, menuRows, portals] = await Promise.all([
    sqlAll(env, 'SELECT key,value FROM settings WHERE is_public=1'),
    sqlAll(env, 'SELECT * FROM menu_items WHERE lang=? AND location=\'header\' AND visible=1 ORDER BY sort_order,id', language),
    sqlAll(env, "SELECT * FROM portals WHERE status!='hidden' ORDER BY sort_order,id")
  ]);
  return { language, settings: Object.fromEntries(settingsRows.map(row => [row.key, row.value])), menu: menuRows, portals };
}

function menuTree(rows, language) {
  const roots = rows.filter(row => !row.parent_id);
  return roots.map(root => {
    const children = rows.filter(row => row.parent_id === root.id);
    const href = root.url.startsWith('/') ? localized(root.url, language) : root.url;
    if (!children.length) return `<a href="${attr(href)}">${esc(root.label)}</a>`;
    return `<div class="nav-group"><button class="nav-trigger" type="button" aria-expanded="false">${esc(root.label)} <span aria-hidden="true">⌄</span></button><div class="dropdown">${children.map(child => `<a href="${attr(child.url.startsWith('/') ? localized(child.url, language) : child.url)}"${child.new_tab ? ' target="_blank" rel="noopener"' : ''}>${esc(child.label)}</a>`).join('')}</div></div>`;
  }).join('');
}

function footer(ctx) {
  const s = ctx.settings;
  const quick = [
    [ctx.language === 'en' ? 'About' : 'Giới thiệu', '/gioi-thieu'],
    [ctx.language === 'en' ? 'Activities' : 'Hoạt động', '/hoat-dong'],
    [ctx.language === 'en' ? 'News' : 'Tin tức', '/tin-tuc'],
    [ctx.language === 'en' ? 'Official information' : 'Nội dung chính thức', '/noi-dung'],
    [ctx.language === 'en' ? 'Contact' : 'Liên hệ', '/lien-he']
  ];
  return `<footer class="site-footer"><div class="shell footer-grid"><section><img class="footer-logo" src="/assets/branding/sky-first-main-logo.png" alt="Sky First"><p class="footer-name">${esc(s.organization_name || 'Mạng lưới Giáo dục & Phát triển Cộng đồng Sky First')}</p><p>${esc(s.footer_description || 'Khởi nguồn từ giáo dục miễn phí 2025 · Phát triển từ tri thức, văn hóa và cộng đồng.')}</p></section><section><h2>${ctx.language === 'en' ? 'Explore' : 'Khám phá'}</h2>${quick.map(([label, url]) => `<a href="${localized(url, ctx.language)}">${esc(label)}</a>`).join('')}</section><section><h2>${ctx.language === 'en' ? 'Sky First systems' : 'Hệ thống Sky First'}</h2>${ctx.portals.filter(portal => portal.show_footer).map(portal => `<a href="${attr(portal.url)}" target="_blank" rel="noopener">${esc(portal.name)}${portal.status === 'maintenance' ? ` · ${ctx.language === 'en' ? 'Maintenance' : 'Bảo trì'}` : ''}</a>`).join('')}</section><section><h2>${ctx.language === 'en' ? 'Contact' : 'Liên hệ'}</h2><a href="mailto:${attr(s.email_main || 'skyfirst.ec@gmail.com')}">${esc(s.email_main || 'skyfirst.ec@gmail.com')}</a><a href="mailto:${attr(s.email_support || 'hotro.sfn@gmail.com')}">${esc(s.email_support || 'hotro.sfn@gmail.com')}</a><p>Hotline/Zalo: ${esc(s.hotline || '0924 910 210')}</p><div class="social"><a href="${attr(s.facebook_url || '#')}" target="_blank" rel="noopener">Facebook</a><a href="${attr(s.instagram_url || '#')}" target="_blank" rel="noopener">Instagram</a><a href="${attr(s.tiktok_url || '#')}" target="_blank" rel="noopener">TikTok</a></div></section></div><div class="shell footer-bottom">© ${new Date().getUTCFullYear()} SKY FIRST NETWORK · ${ctx.language === 'en' ? 'Non-profit · Transparent · Community-first' : 'Phi lợi nhuận · Minh bạch · Tôn trọng cộng đồng'}</div></footer>`;
}

function layout(ctx, { title, description, body, path = '/home', status = 200 }) {
  const s = ctx.settings;
  const canonical = `${APP_ORIGIN}${localized(path, ctx.language)}`;
  const english = `${APP_ORIGIN}${localized(path, 'en')}`;
  const vietnamese = `${APP_ORIGIN}${localized(path, 'vi')}`;
  const translateLabel = ctx.language === 'en' ? 'Tiếng Việt' : 'English';
  const translateUrl = ctx.language === 'en' ? localized(path, 'vi') : localized(path, 'en');
  const visual = s.default_og_image || `${APP_ORIGIN}/assets/branding/sky-first-main-logo.png`;
  const content = `<!doctype html><html lang="${ctx.language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} | SKY FIRST NETWORK</title><meta name="description" content="${attr(description)}"><link rel="canonical" href="${attr(canonical)}"><link rel="alternate" hreflang="vi" href="${attr(vietnamese)}"><link rel="alternate" hreflang="en" href="${attr(english)}"><link rel="alternate" hreflang="x-default" href="${attr(vietnamese)}"><meta property="og:site_name" content="SKY FIRST NETWORK"><meta property="og:title" content="${attr(title)}"><meta property="og:description" content="${attr(description)}"><meta property="og:image" content="${attr(visual)}"><link rel="icon" href="/assets/branding/sky-first-main-logo.png"><link rel="stylesheet" href="/assets/css/site.css"><script defer src="/assets/js/site.js"></script></head><body><header class="header"><div class="topline"><div class="shell"><span>${esc(s.organization_name || 'Mạng lưới Giáo dục & Phát triển Cộng đồng Sky First')}</span><span>${esc(s.tagline || 'Giáo dục · Văn hóa · Cộng đồng')}</span></div></div><div class="shell nav"><a class="brand" href="${localized('/home', ctx.language)}"><img src="/assets/branding/sky-first-main-logo.png" alt="Sky First"><strong>SKY FIRST NETWORK</strong></a><nav class="desktop-menu" aria-label="${ctx.language === 'en' ? 'Main navigation' : 'Điều hướng chính'}">${menuTree(ctx.menu, ctx.language)}</nav><div class="nav-actions"><a class="language" href="${translateUrl}">${translateLabel}</a><button class="mobile-toggle" type="button" aria-label="${ctx.language === 'en' ? 'Open menu' : 'Mở menu'}" aria-expanded="false">☰</button></div></div><nav class="mobile-menu" aria-label="${ctx.language === 'en' ? 'Mobile navigation' : 'Điều hướng di động'}">${menuTree(ctx.menu, ctx.language)}</nav></header><main>${body}</main>${footer(ctx)}</body></html>`;
  return html(content, status, { 'content-security-policy': "default-src 'self'; img-src 'self' data: https:; style-src 'self'; script-src 'self'; base-uri 'self'; frame-ancestors 'none'", 'referrer-policy': 'strict-origin-when-cross-origin', 'x-content-type-options': 'nosniff' });
}

function standardPage(page, ctx) {
  return `<section class="page-hero"><div class="shell narrow"><p class="eyebrow">${ctx.language === 'en' ? 'SKY FIRST NETWORK' : 'SKY FIRST NETWORK'}</p><h1>${esc(page.title)}</h1><p class="lead">${esc(page.summary)}</p></div></section><article class="shell narrow prose">${page.body_html}</article>`;
}

function homePage(ctx, page, posts, programmes) {
  const en = ctx.language === 'en';
  return `<section class="hero"><div class="shell hero-grid"><div><p class="eyebrow">SKY FIRST NETWORK</p><h1>${en ? 'Education for growth.<br>Connection for impact.' : 'Giáo dục để phát triển.<br>Kết nối để tạo giá trị.'}</h1><p class="lead">${en ? 'Sky First connects learners, young people, volunteers and social resources to create meaningful opportunities for learning, experience and contribution.' : 'Mạng lưới Giáo dục & Phát triển Cộng đồng Sky First kết nối người học, người trẻ, tình nguyện viên và nguồn lực xã hội để tạo nên cơ hội học tập, trải nghiệm và đóng góp có ý nghĩa.'}</p><div class="actions"><a class="button primary" href="${localized('/gioi-thieu', ctx.language)}">${en ? 'Explore Sky First' : 'Khám phá Sky First'}</a><a class="button secondary" href="${localized('/tham-gia', ctx.language)}">${en ? 'Participate' : 'Tham gia cùng chúng tôi'}</a></div></div><div class="hero-mark"><img src="/assets/branding/sky-first-main-logo.png" alt="Sky First Network"><span>${en ? 'Education · Culture · Community' : 'Giáo dục · Văn hóa · Cộng đồng'}</span></div></div></section><section class="section"><div class="shell"><div class="section-head"><div><p class="eyebrow">${en ? 'ABOUT' : 'GIỚI THIỆU'}</p><h2>${en ? 'A shared place to learn, experience and contribute' : 'Một không gian chung để học tập, trải nghiệm và đóng góp'}</h2></div><a class="text-link" href="${localized('/gioi-thieu', ctx.language)}">${en ? 'Read the full introduction →' : 'Xem giới thiệu đầy đủ →'}</a></div><div class="card-grid three"><a class="card" href="${localized('/gioi-thieu', ctx.language)}"><span>01</span><h3>${en ? 'Who is Sky First?' : 'Sky First Network là gì?'}</h3><p>${en ? 'Identity, origin and the value created for community.' : 'Định danh, câu chuyện hình thành và ý nghĩa của Mạng lưới.'}</p></a><a class="card" href="${localized('/gioi-thieu', ctx.language)}#vision"><span>02</span><h3>${en ? 'Vision & mission' : 'Tầm nhìn & Sứ mệnh'}</h3><p>${en ? 'A direction for education, people and community.' : 'Định hướng phát triển giáo dục, văn hóa và cộng đồng.'}</p></a><a class="card" href="${localized('/gioi-thieu', ctx.language)}#principles"><span>03</span><h3>${en ? 'Five operating principles' : 'Năm nguyên tắc hoạt động'}</h3><p>${en ? 'Voluntary, non-profit, transparent, respectful and responsible.' : 'Tự nguyện, phi lợi nhuận, minh bạch, tôn trọng và trách nhiệm cộng đồng.'}</p></a></div></div></section><section class="section tint"><div class="shell"><div class="section-head"><div><p class="eyebrow">${en ? 'ACTIVITIES' : 'LĨNH VỰC HOẠT ĐỘNG'}</p><h2>${en ? 'Five connected areas' : 'Năm trụ cột kết nối với nhau'}</h2></div></div><div class="card-grid five">${[[en?'Education':'Giáo dục',en?'Classes, learning materials and learner support.':'Lớp học, học liệu, học thuật và hỗ trợ người học.'],[en?'Youth development':'Phát triển người trẻ',en?'Experience, responsibility and practical work.':'Học qua trải nghiệm, trách nhiệm và công việc thực tế.'],[en?'Volunteering & community':'Tình nguyện & Cộng đồng',en?'Connect contribution with real needs.':'Kết nối năng lực đóng góp với nhu cầu phù hợp.'],[en?'Connection & collaboration':'Kết nối & Hợp tác',en?'Coordinate expertise, resources and programmes.':'Phối hợp chuyên môn, nguồn lực và chương trình.'],[en?'Knowledge communication':'Truyền thông',en?'Share knowledge, opportunity and activity stories.':'Lan tỏa tri thức, cơ hội và câu chuyện hoạt động.']].map(([title,text], index) => `<article class="card pillar"><span>0${index + 1}</span><h3>${esc(title)}</h3><p>${esc(text)}</p></article>`).join('')}</div></div></section><section class="section"><div class="shell"><div class="section-head"><div><p class="eyebrow">${en ? 'PROGRAMMES' : 'CHƯƠNG TRÌNH'}</p><h2>${en ? 'Current official information' : 'Thông tin chính thức đang cập nhật'}</h2></div><a class="text-link" href="${localized('/hoat-dong', ctx.language)}">${en ? 'View programmes →' : 'Xem chương trình →'}</a></div>${programmes.length ? `<div class="card-grid three">${programmes.map(programme => `<article class="card"><span class="status ${attr(programme.status)}">${esc(programme.status)}</span><h3>${esc(programme.name)}</h3><p>${esc(programme.summary)}</p>${programme.registration_url && programme.status === 'open' ? `<a class="text-link" href="${attr(programme.registration_url)}" target="_blank" rel="noopener">${en ? 'Register →' : 'Đăng ký →'}</a>` : ''}</article>`).join('')}</div>` : `<div class="notice">${en ? 'Official programmes appear here only after they are approved for publication.' : 'Chương trình chỉ xuất hiện tại đây sau khi được xác nhận và xuất bản chính thức.'}</div>`}</div></section><section class="section deep"><div class="shell systems"><div><p class="eyebrow">${en ? 'VERIFICATION & SYSTEMS' : 'XÁC THỰC & HỆ THỐNG'}</p><h2>${en ? 'One verified Sky First ecosystem' : 'Một hệ sinh thái Sky First được xác thực'}</h2><p>${en ? 'The central lookup verifies achievements and certificates issued by authorised Sky First websites, portals and applications.' : 'Tra cứu trung tâm xác thực thành tích và Giấy chứng nhận do các website, cổng và ứng dụng Sky First được cấp quyền phát hành.'}</p></div><div class="actions"><a class="button light" href="${localized('/tra-cuu', ctx.language)}">${en ? 'Look up a record' : 'Tra cứu tại Sky First Network'}</a><a class="button outline-light" href="${localized('/he-thong', ctx.language)}">${en ? 'Open systems' : 'Xem các cổng hệ thống'}</a></div></div></section><section class="section tint"><div class="shell"><div class="section-head"><div><p class="eyebrow">${en ? 'LATEST NEWS' : 'TIN TỨC & HOẠT ĐỘNG'}</p><h2>${en ? 'Official updates' : 'Kênh thông tin chính thức'}</h2></div><a class="text-link" href="${localized('/tin-tuc', ctx.language)}">${en ? 'View all news →' : 'Xem tất cả bài viết →'}</a></div>${posts.length ? `<div class="card-grid three">${posts.map(post => `<article class="card"><p class="meta">${esc(post.category)} · ${esc((post.published_at || '').slice(0, 10))}</p><h3>${esc(post.title)}</h3><p>${esc(post.excerpt)}</p><a class="text-link" href="${localized(`/tin-tuc/${post.slug}`, ctx.language)}">${en ? 'Read article →' : 'Đọc bài viết →'}</a></article>`).join('')}</div>` : `<div class="notice">${en ? 'No official news has been published yet.' : 'Chưa có bài viết nào được xuất bản công khai.'}</div>`}</div></section>`;
}

function lookupPage(ctx, record, query) {
  const en = ctx.language === 'en';
  let result = '';
  if (query && record) {
    const state = { valid: en ? 'VALID' : 'HỢP LỆ', revoked: en ? 'REVOKED' : 'ĐÃ THU HỒI', expired: en ? 'EXPIRED' : 'HẾT HIỆU LỰC', pending: en ? 'PENDING' : 'CHỜ HOÀN TẤT', test: en ? 'TEST — NOT VALID' : 'BẢN TEST — KHÔNG CÓ GIÁ TRỊ' }[record.status] || record.status;
    result = `<section class="lookup-result"><p class="result-status ${attr(record.status)}">${esc(state)}</p><h2>${esc(record.certificate_title)}</h2><dl><dt>${en ? 'Recipient' : 'Người nhận'}</dt><dd>${esc(record.recipient_name)}</dd><dt>${en ? 'Verification code' : 'Mã xác thực'}</dt><dd>${esc(record.verification_code)}</dd><dt>${en ? 'Issuing unit' : 'Đơn vị cấp'}</dt><dd>${esc(record.issuer_unit || 'Sky First')}</dd><dt>${en ? 'Recognition' : 'Nội dung ghi nhận'}</dt><dd>${esc(record.recognition || '—')}</dd><dt>${en ? 'Issue date' : 'Ngày cấp'}</dt><dd>${esc(record.issued_on)}</dd><dt>${en ? 'Source' : 'Nguồn phát hành'}</dt><dd>${esc(record.issuer_name)}</dd></dl></section>`;
  } else if (query) result = `<p class="notice">${en ? 'No published record matches this code. Check the code or contact the official Sky First channel.' : 'Không tìm thấy dữ liệu công bố phù hợp. Vui lòng kiểm tra lại mã hoặc liên hệ kênh chính thức của Sky First.'}</p>`;
  return `<section class="page-hero lookup-hero"><div class="shell narrow"><p class="eyebrow">${en ? 'SKY FIRST SYSTEM VERIFICATION' : 'XÁC THỰC TOÀN HỆ THỐNG SKY FIRST'}</p><h1>${en ? 'Achievements & certificates lookup' : 'Tra cứu thành tích & Giấy chứng nhận'}</h1><p class="lead">${en ? 'This central service verifies only records published by authorised Sky First websites, portals and applications.' : 'Dịch vụ trung tâm này chỉ xác thực dữ liệu đã được công bố từ các website, cổng và ứng dụng Sky First được cấp quyền.'}</p></div></section><section class="section"><div class="shell narrow"><form class="lookup-form" method="get"><label for="q">${en ? 'Achievement, certificate or verification code' : 'Mã thành tích, GCN hoặc mã xác thực'}</label><div><input id="q" name="q" value="${attr(query)}" placeholder="${en ? 'Enter code issued by Sky First' : 'Nhập mã do hệ thống Sky First cấp'}" required><button class="button primary">${en ? 'Look up' : 'Tra cứu'}</button></div></form>${result}</div></section>`;
}

function sponsorshipPage(ctx, page, details) {
  const en = ctx.language === 'en';
  const allReady = ['donation_bank_name','donation_bank_bin','donation_account_number','donation_account_name'].every(key => String(details[key] || '').trim());
  if (!allReady) return standardPage(page, ctx);
  const note = details.donation_transfer_note || '';
  const qr = `https://img.vietqr.io/image/${encodeURIComponent(details.donation_bank_bin)}-${encodeURIComponent(details.donation_account_number)}-compact2.png?addInfo=${encodeURIComponent(note)}&accountName=${encodeURIComponent(details.donation_account_name)}`;
  return `<section class="page-hero"><div class="shell narrow"><p class="eyebrow">${en ? 'OFFICIAL RECEIVING ACCOUNT' : 'TÀI KHOẢN TIẾP NHẬN CHÍNH THỨC'}</p><h1>${esc(page.title)}</h1><p class="lead">${en ? 'Use only the account information and QR displayed on this official Sky First page.' : 'Chỉ sử dụng thông tin tài khoản và QR hiển thị trên trang chính thức này của Sky First.'}</p></div></section><section class="section"><div class="shell sponsorship-grid"><div class="sponsorship-details"><h2>${en ? 'Sky First contribution channel' : 'Kênh Tiếp nhận Đóng góp Sky First'}</h2><div><span>${en ? 'Beneficiary bank' : 'Ngân hàng thụ hưởng'}</span><strong>${esc(details.donation_bank_name)}</strong></div><div><span>${en ? 'Official account number' : 'Số tài khoản chính thức'}</span><strong class="account-number">${esc(details.donation_account_number)}</strong></div><div><span>${en ? 'Account holder' : 'Tên tài khoản / Chủ thể tiếp nhận'}</span><strong>${esc(details.donation_account_name)}</strong></div><div class="transfer-note"><span>${en ? 'Suggested transfer content' : 'Cú pháp chuyển khoản đề xuất'}</span><strong>${esc(note)}</strong></div></div><aside class="qr-card"><img src="${attr(qr)}" alt="${en ? 'VietQR for Sky First verified account' : 'VietQR tài khoản Sky First đã xác minh'}"><p>${en ? 'Scan with your banking application.' : 'Quét bằng ứng dụng ngân hàng.'}</p><a class="text-link" href="${localized('/lien-he',ctx.language)}">${en ? 'Contact the official focal point →' : 'Liên hệ đầu mối chính thức →'}</a></aside></div></section>`;
}

async function handleForm(request, env) {
  let data;
  try { data = await request.json(); } catch { return json({ error: 'INVALID_JSON' }, 400); }
  const fields = ['form_type', 'name', 'email', 'message'];
  if (!fields.every(field => String(data[field] || '').trim()) || data.consent !== true) return json({ error: 'INVALID_FORM' }, 400);
  if (String(data.message).length > 3000 || String(data.name).length > 120 || String(data.email).length > 160) return json({ error: 'PAYLOAD_TOO_LARGE' }, 413);
  await env.DB.prepare('INSERT INTO submissions(form_type,name,email,phone,organisation,subject,message,consent) VALUES(?,?,?,?,?,?,?,1)').bind(String(data.form_type), String(data.name).trim(), String(data.email).trim(), String(data.phone || '').trim(), String(data.organisation || '').trim(), String(data.subject || '').trim(), String(data.message).trim()).run();
  return json({ ok: true, message: 'RECEIVED' }, 201);
}

const encoder = new TextEncoder();
const hex = bytes => [...new Uint8Array(bytes)].map(x => x.toString(16).padStart(2, '0')).join('');
async function sha256(value) { return hex(await crypto.subtle.digest('SHA-256', encoder.encode(value))); }
function token() { const bytes = crypto.getRandomValues(new Uint8Array(32)); return hex(bytes); }
async function passwordHash(password, salt) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: encoder.encode(salt), iterations: 210000 }, key, 256);
  return hex(bits);
}
function cookies(request) { return Object.fromEntries((request.headers.get('cookie') || '').split(';').map(x => x.trim().split('=').map(decodeURIComponent)).filter(x => x.length === 2)); }
async function adminSession(request, env, requireCsrf = false) {
  const raw = cookies(request).sky_first_admin;
  if (!raw) return null;
  const session = await sqlOne(env, "SELECT s.*,a.name,a.email,a.role,a.active FROM admin_sessions s JOIN admins a ON a.id=s.admin_id WHERE s.token_hash=? AND s.expires_at>CURRENT_TIMESTAMP", await sha256(raw));
  if (!session || !session.active) return null;
  if (requireCsrf && request.headers.get('x-csrf-token') !== session.csrf_token) return null;
  await env.DB.prepare('UPDATE admin_sessions SET last_seen_at=CURRENT_TIMESTAMP WHERE token_hash=?').bind(session.token_hash).run();
  return session;
}
function adminShell() {
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sky First Admin</title><link rel="stylesheet" href="/assets/css/site.css"></head><body><main class="section"><div class="shell narrow"><p class="eyebrow">SKY FIRST NETWORK</p><h1>Quản trị Website</h1><p class="lead">Nội dung, nhận diện và dữ liệu công khai được quản lý tại đây.</p><div id="adminApp" class="public-form">Đang tải…</div></div></main><script src="/assets/js/admin.js"></script></body></html>`;
}
async function adminJson(request, env, url) {
  const path = url.pathname;
  if (path === '/api/admin/session' && request.method === 'GET') {
    const session = await adminSession(request, env);
    const count = await sqlOne(env, 'SELECT COUNT(*) AS count FROM admins');
    return json({ authenticated: !!session, setup_required: !count.count, admin: session ? { name: session.name, email: session.email, role: session.role } : null, csrf: session?.csrf_token || null });
  }
  if (path === '/api/admin/setup' && request.method === 'POST') {
    const count = await sqlOne(env, 'SELECT COUNT(*) AS count FROM admins');
    if (count.count) return json({ error: 'SETUP_COMPLETE' }, 409);
    const data = await request.json().catch(() => null);
    if (!data || !/^\S+@\S+\.\S+$/.test(String(data.email || '')) || String(data.password || '').length < 14 || String(data.name || '').trim().length < 2) return json({ error: 'INVALID_SETUP' }, 400);
    const salt = token();
    await env.DB.prepare('INSERT INTO admins(name,email,role,password_hash,password_salt) VALUES(?,?,?,?,?)').bind(String(data.name).trim(), String(data.email).trim().toLowerCase(), 'SUPER_ADMIN', await passwordHash(String(data.password), salt), salt).run();
    return json({ ok: true }, 201);
  }
  if (path === '/api/admin/login' && request.method === 'POST') {
    const data = await request.json().catch(() => null);
    const admin = data ? await sqlOne(env, 'SELECT * FROM admins WHERE email=? AND active=1', String(data.email || '').trim().toLowerCase()) : null;
    if (!admin || await passwordHash(String(data.password || ''), admin.password_salt) !== admin.password_hash) return json({ error: 'INVALID_CREDENTIALS' }, 401);
    const raw = token(), csrf = token(), expires = new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString();
    await env.DB.prepare('INSERT INTO admin_sessions(token_hash,csrf_token,admin_id,expires_at) VALUES(?,?,?,?)').bind(await sha256(raw), csrf, admin.id, expires).run();
    await env.DB.prepare('UPDATE admins SET last_login_at=CURRENT_TIMESTAMP WHERE id=?').bind(admin.id).run();
    return json({ ok: true, csrf, admin: { name: admin.name, email: admin.email, role: admin.role } }, 200, { 'set-cookie': `sky_first_admin=${raw}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=43200` });
  }
  if (path === '/api/admin/logout' && request.method === 'POST') {
    const session = await adminSession(request, env, true); if (!session) return json({ error: 'UNAUTHORISED' }, 401);
    await env.DB.prepare('DELETE FROM admin_sessions WHERE token_hash=?').bind(session.token_hash).run();
    return json({ ok: true }, 200, { 'set-cookie': 'sky_first_admin=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0' });
  }
  const session = await adminSession(request, env, !['GET','HEAD'].includes(request.method));
  if (!session) return json({ error: 'UNAUTHORISED' }, 401);
  if (path === '/api/admin/settings') {
    if (request.method === 'GET') return json({ results: await sqlAll(env, 'SELECT * FROM settings ORDER BY group_name,key') });
    if (request.method === 'PATCH' && ['SUPER_ADMIN','ADMIN'].includes(session.role)) {
      const data = await request.json().catch(() => null); if (!data || typeof data.key !== 'string' || typeof data.value !== 'string' || data.value.length > 2000) return json({ error: 'INVALID_SETTING' }, 400);
      await env.DB.prepare('UPDATE settings SET value=?,updated_at=CURRENT_TIMESTAMP WHERE key=?').bind(data.value, data.key).run();
      await env.DB.prepare('INSERT INTO audit_log(action,entity_type,entity_id,detail) VALUES(?,?,?,?)').bind('update','settings',data.key,session.email).run();
      return json({ ok: true });
    }
  }
  if (path === '/api/admin/topics') {
    if (request.method === 'GET') return json({ results: await sqlAll(env, 'SELECT * FROM content_topics ORDER BY topic_number') });
    if (request.method === 'PATCH' && ['SUPER_ADMIN','ADMIN','EDITOR'].includes(session.role)) {
      const data = await request.json().catch(() => null); if (!data || !Number.isInteger(data.id) || typeof data.body_vi !== 'string' || typeof data.body_en !== 'string') return json({ error: 'INVALID_TOPIC' }, 400);
      await env.DB.prepare('UPDATE content_topics SET title_vi=?,body_vi=?,title_en=?,body_en=?,is_public=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(String(data.title_vi || '').slice(0,240), data.body_vi.slice(0,12000), String(data.title_en || '').slice(0,240), data.body_en.slice(0,12000), data.is_public ? 1 : 0, data.id).run();
      return json({ ok: true });
    }
  }
  if (path === '/api/admin/pages') {
    if (request.method === 'GET') return json({ results: await sqlAll(env, 'SELECT * FROM pages ORDER BY translation_key,lang') });
    if (request.method === 'PATCH' && ['SUPER_ADMIN','ADMIN','EDITOR'].includes(session.role)) {
      const data = await request.json().catch(() => null);
      if (!data || !Number.isInteger(data.id) || typeof data.title !== 'string' || typeof data.summary !== 'string' || typeof data.body_html !== 'string') return json({ error: 'INVALID_PAGE' }, 400);
      await env.DB.prepare('UPDATE pages SET title=?,summary=?,body_html=?,seo_title=?,seo_description=?,status=?,is_public=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(data.title.slice(0,240),data.summary.slice(0,1000),data.body_html.slice(0,50000),String(data.seo_title || '').slice(0,240),String(data.seo_description || '').slice(0,320),['draft','review','published','hidden','archived'].includes(data.status) ? data.status : 'draft',data.is_public ? 1 : 0,data.id).run();
      return json({ ok: true });
    }
  }
  if (path === '/api/admin/posts') {
    if (request.method === 'GET') return json({ results: await sqlAll(env, 'SELECT * FROM posts ORDER BY published_at DESC,id DESC') });
    if (request.method === 'PATCH' && ['SUPER_ADMIN','ADMIN','EDITOR'].includes(session.role)) {
      const data = await request.json().catch(() => null);
      if (!data || !Number.isInteger(data.id) || typeof data.title !== 'string' || typeof data.body_html !== 'string') return json({ error: 'INVALID_POST' }, 400);
      await env.DB.prepare('UPDATE posts SET title=?,excerpt=?,body_html=?,category=?,status=?,is_public=?,published_at=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(data.title.slice(0,240),String(data.excerpt || '').slice(0,1000),data.body_html.slice(0,50000),String(data.category || 'Tin Sky First').slice(0,100),['draft','review','published','hidden','archived'].includes(data.status) ? data.status : 'draft',data.is_public ? 1 : 0,data.published_at || null,data.id).run();
      return json({ ok: true });
    }
  }
  if (path === '/api/admin/media' && request.method === 'POST' && ['SUPER_ADMIN','ADMIN','EDITOR'].includes(session.role)) {
    const type = request.headers.get('content-type') || '';
    const filename = (request.headers.get('x-filename') || 'asset').replace(/[^a-zA-Z0-9._-]/g, '-').slice(0,120);
    const size = Number(request.headers.get('content-length') || 0);
    if (!/^image\/(png|jpeg|webp|svg\+xml)$|^application\/pdf$/.test(type) || size > 10 * 1024 * 1024) return json({ error: 'UNSUPPORTED_MEDIA' }, 400);
    const id = `${Date.now()}-${token().slice(0,12)}-${filename}`;
    const data = await request.arrayBuffer(); if (!data.byteLength || data.byteLength > 10 * 1024 * 1024) return json({ error: 'INVALID_MEDIA' }, 400);
    const objectKey = `media/${id}`;
    await env.MEDIA.put(objectKey, data, { httpMetadata: { contentType: type } });
    const row = await env.DB.prepare('INSERT INTO media_assets(object_key,alt_text,mime_type,bytes,is_public) VALUES(?,?,?,?,1) RETURNING id').bind(objectKey,request.headers.get('x-alt-text') || '',type,data.byteLength).first();
    return json({ ok: true, id: row.id, url: `/media/${row.id}` }, 201);
  }
  if (path === '/api/admin/issuer-keys' && request.method === 'POST' && ['SUPER_ADMIN','ADMIN'].includes(session.role)) {
    const data = await request.json().catch(() => null);
    if (!data || typeof data.issuer_name !== 'string' || data.issuer_name.trim().length < 3) return json({ error: 'INVALID_ISSUER' }, 400);
    const raw = `skf_${token()}`;
    const row = await env.DB.prepare('INSERT INTO issuer_keys(issuer_name,key_hash) VALUES(?,?) RETURNING id,issuer_name').bind(data.issuer_name.trim().slice(0,240),await sha256(raw)).first();
    return json({ ok: true, issuer: row, key: raw }, 201);
  }
  if (path === '/api/admin/submissions' && request.method === 'GET') return json({ results: await sqlAll(env, 'SELECT * FROM submissions ORDER BY created_at DESC LIMIT 200') });
  return json({ error: 'NOT_FOUND' }, 404);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/assets/')) return env.ASSETS.fetch(request);
    if (url.pathname === '/admin') return html(adminShell(), 200, { 'content-security-policy': "default-src 'self'; style-src 'self'; script-src 'self'; base-uri 'self'; frame-ancestors 'none'", 'referrer-policy': 'same-origin', 'x-content-type-options': 'nosniff' });
    if (url.pathname.startsWith('/api/admin/')) return adminJson(request, env, url);
    if (url.pathname.startsWith('/media/')) {
      const id = Number(url.pathname.slice('/media/'.length));
      if (!Number.isInteger(id)) return new Response('Not found', { status: 404 });
      const media = await sqlOne(env, 'SELECT * FROM media_assets WHERE id=? AND is_public=1', id);
      if (!media) return new Response('Not found', { status: 404 });
      const object = await env.MEDIA.get(media.object_key);
      if (!object) return new Response('Not found', { status: 404 });
      return new Response(object.body, { headers: { 'content-type': media.mime_type, 'cache-control': 'public, max-age=86400', 'x-content-type-options': 'nosniff' } });
    }
    if (url.pathname === '/api/health') return json({ ok: true, service: 'sky-first-network' });
    if (url.pathname === '/api/forms' && request.method === 'OPTIONS') return new Response(null, { status: 204, headers: apiHeaders() });
    if (url.pathname === '/api/forms' && request.method === 'POST') return handleForm(request, env);
    if (url.pathname === '/api/certificates/verify') {
      const code = (url.searchParams.get('q') || '').trim();
      if (!code) return json({ found: false }, 400);
      const record = await sqlOne(env, 'SELECT c.verification_code,c.recipient_name,c.certificate_title,c.recognition,c.programme_name,c.issuer_unit,c.issued_on,c.valid_until,c.status,i.issuer_name FROM certificates c JOIN issuer_keys i ON i.id=c.issuer_key_id WHERE c.verification_code=?', code);
      return json({ found: !!record, certificate: record || null });
    }
    if (url.pathname === '/api/certificates/issue' && request.method === 'POST') {
      const authorization = request.headers.get('authorization') || '';
      const rawKey = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
      const issuer = rawKey ? await sqlOne(env, 'SELECT * FROM issuer_keys WHERE key_hash=? AND active=1', await sha256(rawKey)) : null;
      const data = await request.json().catch(() => null);
      if (!issuer) return json({ error: 'UNAUTHORISED_ISSUER' }, 401);
      if (!data || typeof data.recipient_name !== 'string' || typeof data.certificate_title !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(String(data.issued_on || ''))) return json({ error: 'INVALID_CERTIFICATE' }, 400);
      const verificationCode = typeof data.verification_code === 'string' && /^[A-Za-z0-9-]{8,64}$/.test(data.verification_code) ? data.verification_code : `SKY-${Date.now().toString(36).toUpperCase()}-${token().slice(0,6).toUpperCase()}`;
      await env.DB.prepare('INSERT INTO certificates(issuer_key_id,verification_code,recipient_name,certificate_title,recognition,programme_name,issuer_unit,issued_on,valid_until,status) VALUES(?,?,?,?,?,?,?,?,?,?)').bind(issuer.id,verificationCode,data.recipient_name.trim().slice(0,240),data.certificate_title.trim().slice(0,300),String(data.recognition || '').slice(0,1000),String(data.programme_name || '').slice(0,240),String(data.issuer_unit || issuer.issuer_name).slice(0,240),data.issued_on,data.valid_until || null,['pending','valid','revoked','expired','test'].includes(data.status) ? data.status : 'pending').run();
      return json({ ok: true, verification_code: verificationCode, verify_url: `${APP_ORIGIN}/tra-cuu?q=${encodeURIComponent(verificationCode)}` }, 201);
    }
    const { language, path } = parsePath(url.pathname);
    const ctx = await context(env, language);
    if (path === '/' || path === '/home') {
      const [page, posts, programmes] = await Promise.all([
        sqlOne(env, `SELECT * FROM pages WHERE lang=? AND slug='home' AND ${PUBLIC_PAGE_WINDOW}`, language),
        sqlAll(env, `SELECT * FROM posts WHERE lang=? AND ${PUBLIC_PAGE_WINDOW} ORDER BY published_at DESC LIMIT 3`, language),
        sqlAll(env, "SELECT * FROM programmes WHERE is_public=1 AND status IN ('upcoming','open','running') ORDER BY starts_at LIMIT 3")
      ]);
      return layout(ctx, { title: page?.seo_title || (language === 'en' ? 'Education · Culture · Community' : 'Giáo dục · Văn hóa · Cộng đồng'), description: page?.seo_description || page?.summary || '', body: homePage(ctx, page, posts, programmes), path: '/home' });
    }
    if (path === '/tra-cuu') {
      const query = (url.searchParams.get('q') || '').trim();
      const record = query ? await sqlOne(env, 'SELECT c.*,i.issuer_name FROM certificates c JOIN issuer_keys i ON i.id=c.issuer_key_id WHERE c.verification_code=?', query) : null;
      return layout(ctx, { title: language === 'en' ? 'Verification' : 'Tra cứu', description: language === 'en' ? 'Central Sky First record verification.' : 'Tra cứu trung tâm dữ liệu Sky First.', body: lookupPage(ctx, record, query), path });
    }
    if (path === '/noi-dung' || path.startsWith('/noi-dung/')) {
      const topicSlug = path === '/noi-dung' ? '' : decodeURIComponent(path.slice('/noi-dung/'.length));
      const topics = await sqlAll(env, 'SELECT * FROM content_topics WHERE is_public=1 ORDER BY topic_number');
      if (topicSlug) {
        const topic = topics.find(item => item.slug === topicSlug);
        if (topic) {
          const title = language === 'en' ? topic.title_en : topic.title_vi;
          const body = language === 'en' ? topic.body_en : topic.body_vi;
          return layout(ctx, { title, description: body.slice(0, 155), path, body: `<section class="page-hero"><div class="shell narrow"><p class="eyebrow">${String(topic.topic_number).padStart(2,'0')} · SKY FIRST NETWORK</p><h1>${esc(title)}</h1></div></section><article class="shell narrow prose"><p>${esc(body).replace(/\n/g,'</p><p>')}</p><p><a class="button secondary" href="${localized('/noi-dung',language)}">${language === 'en' ? 'All official content' : 'Toàn bộ nội dung chính thức'}</a></p></article>` });
        }
      } else {
        const title = language === 'en' ? 'Official information' : 'Nội dung chính thức';
        return layout(ctx, { title, description: title, path, body: `<section class="page-hero"><div class="shell"><p class="eyebrow">SKY FIRST NETWORK</p><h1>${title}</h1><p class="lead">${language === 'en' ? 'The official information basis for this website.' : 'Hệ nội dung chính thức được dùng để vận hành website.'}</p></div></section><section class="section"><div class="shell"><div class="card-grid three">${topics.map(topic => { const text = language === 'en' ? topic.title_en : topic.title_vi; const summary = language === 'en' ? topic.body_en : topic.body_vi; return `<a class="card" href="${localized(`/noi-dung/${topic.slug}`,language)}"><span>${String(topic.topic_number).padStart(2,'0')}</span><h2>${esc(text)}</h2><p>${esc(summary).slice(0,180)}${summary.length > 180 ? '…' : ''}</p></a>`; }).join('')}</div></div></section>` });
      }
    }
    if (path.startsWith('/tin-tuc/')) {
      const slug = decodeURIComponent(path.slice('/tin-tuc/'.length));
      const post = await sqlOne(env, `SELECT * FROM posts WHERE lang=? AND slug=? AND ${PUBLIC_PAGE_WINDOW}`, language, slug);
      if (post) return layout(ctx, { title: post.title, description: post.excerpt, body: `<article class="shell narrow prose post"><p class="meta">${esc(post.category)} · ${esc((post.published_at || '').slice(0,10))}</p><h1>${esc(post.title)}</h1><p class="lead">${esc(post.excerpt)}</p>${post.body_html}</article>`, path });
    }
    if (path === '/tin-tuc') {
      const posts = await sqlAll(env, `SELECT * FROM posts WHERE lang=? AND ${PUBLIC_PAGE_WINDOW} ORDER BY published_at DESC`, language);
      const title = language === 'en' ? 'News & activities' : 'Tin tức & Hoạt động';
      return layout(ctx, { title, description: title, path, body: `<section class="page-hero"><div class="shell"><p class="eyebrow">${title}</p><h1>${language === 'en' ? 'Official information channel' : 'Kênh thông tin chính thức'}</h1></div></section><section class="section"><div class="shell"><div class="card-grid three">${posts.length ? posts.map(post => `<article class="card"><p class="meta">${esc(post.category)} · ${esc((post.published_at || '').slice(0,10))}</p><h2>${esc(post.title)}</h2><p>${esc(post.excerpt)}</p><a class="text-link" href="${localized(`/tin-tuc/${post.slug}`, language)}">${language === 'en' ? 'Read article →' : 'Đọc bài viết →'}</a></article>`).join('') : `<p class="notice">${language === 'en' ? 'No approved article has been published yet.' : 'Chưa có bài viết được phê duyệt để công bố.'}</p>`}</div></div></section>` });
    }
    const slug = path.replace(/^\//, '');
    const page = await sqlOne(env, `SELECT * FROM pages WHERE lang=? AND slug=? AND ${PUBLIC_PAGE_WINDOW}`, language, slug);
    if (page) {
      if (slug === 'tai-tro-dong-hanh') {
        const donationRows = await sqlAll(env, "SELECT key,value FROM settings WHERE key IN ('donation_bank_name','donation_bank_bin','donation_account_number','donation_account_name','donation_transfer_note')");
        return layout(ctx, { title: page.seo_title || page.title, description: page.seo_description || page.summary, body: sponsorshipPage(ctx, page, Object.fromEntries(donationRows.map(row => [row.key,row.value]))), path });
      }
      return layout(ctx, { title: page.seo_title || page.title, description: page.seo_description || page.summary, body: standardPage(page, ctx), path });
    }
    return layout(ctx, { title: language === 'en' ? 'Content not found' : 'Không tìm thấy nội dung', description: '', path, status: 404, body: `<section class="page-hero"><div class="shell narrow"><p class="eyebrow">404</p><h1>${language === 'en' ? 'Content not found' : 'Không tìm thấy nội dung'}</h1><p class="lead">${language === 'en' ? 'The page does not exist or is not published.' : 'Trang này không tồn tại hoặc chưa được công khai.'}</p><a class="button primary" href="${localized('/home', language)}">${language === 'en' ? 'Back to home' : 'Về Trang chủ'}</a></div></section>` });
  }
};
