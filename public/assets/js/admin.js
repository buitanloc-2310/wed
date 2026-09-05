const app = document.querySelector('#adminApp');
let csrf = '';

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[char]));
const api = async (path, options = {}) => {
  const response = await fetch(path, { ...options, headers: { ...(options.body ? { 'content-type': 'application/json' } : {}), ...(csrf ? { 'x-csrf-token': csrf } : {}), ...(options.headers || {}) } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'REQUEST_FAILED');
  return data;
};
const formValues = form => Object.fromEntries(new FormData(form));

function authForm(mode) {
  const setup = mode === 'setup';
  app.innerHTML = `<form id="authForm" class="admin-form"><h2>${setup ? 'Thiết lập quản trị đầu tiên' : 'Đăng nhập quản trị'}</h2>${setup ? '<label>Họ tên<input name="name" required minlength="2"></label>' : ''}<label>Email<input name="email" type="email" autocomplete="username" required></label><label>Mật khẩu<input name="password" type="password" autocomplete="current-password" required minlength="14"></label><button class="button primary">${setup ? 'Tạo quản trị viên' : 'Đăng nhập'}</button><p class="form-status" aria-live="polite"></p></form>`;
  document.querySelector('#authForm').addEventListener('submit', async event => {
    event.preventDefault(); const form = event.currentTarget, status = form.querySelector('.form-status');
    try { await api(setup ? '/api/admin/setup' : '/api/admin/login', { method: 'POST', body: JSON.stringify(formValues(form)) }); status.textContent = setup ? 'Đã tạo. Hãy đăng nhập bằng tài khoản vừa tạo.' : 'Đăng nhập thành công.'; if (setup) authForm('login'); else boot(); }
    catch (error) { status.textContent = error.message === 'INVALID_CREDENTIALS' ? 'Email hoặc mật khẩu chưa đúng.' : 'Chưa thể hoàn tất. Mật khẩu cần ít nhất 14 ký tự.'; }
  });
}

function adminLayout(session) {
  csrf = session.csrf;
  app.innerHTML = `<div class="admin-top"><div><strong>${escapeHtml(session.admin.name)}</strong><span>${escapeHtml(session.admin.role)}</span></div><button id="logout" class="button secondary">Đăng xuất</button></div><div class="admin-tabs" role="tablist"><button data-tab="identity" class="active">Nhận diện & liên hệ</button><button data-tab="content">33 nội dung chính thức</button><button data-tab="pages">Các trang</button><button data-tab="submissions">Yêu cầu đã gửi</button></div><section id="adminPanel" aria-live="polite"></section>`;
  document.querySelector('#logout').addEventListener('click', async () => { await api('/api/admin/logout', { method: 'POST' }); csrf = ''; authForm('login'); });
  document.querySelectorAll('[data-tab]').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('[data-tab]').forEach(item => item.classList.toggle('active', item === button)); renderTab(button.dataset.tab); }));
  renderTab('identity');
}

async function renderTab(tab) {
  const panel = document.querySelector('#adminPanel'); panel.innerHTML = '<p>Đang tải dữ liệu…</p>';
  try {
    if (tab === 'identity') {
      const { results } = await api('/api/admin/settings');
      const edit = results.filter(item => ['organization_name','tagline','footer_description','email_main','email_support','hotline','facebook_url','instagram_url','tiktok_url','donation_bank_name','donation_bank_bin','donation_account_number','donation_account_name','donation_transfer_note','default_og_image'].includes(item.key));
      panel.innerHTML = `<form class="admin-form" id="settingsForm"><h2>Nhận diện, chân trang & thông tin liên hệ</h2><p>Thay đổi tại đây được áp dụng cho website sau khi lưu.</p>${edit.map(item => `<label>${escapeHtml(item.key.replaceAll('_',' '))}<input name="${escapeHtml(item.key)}" value="${escapeHtml(item.value)}"></label>`).join('')}<button class="button primary">Lưu thay đổi</button><p class="form-status"></p></form>`;
      document.querySelector('#settingsForm').addEventListener('submit', async event => { event.preventDefault(); const form = event.currentTarget, status = form.querySelector('.form-status'); try { for (const [key,value] of Object.entries(formValues(form))) await api('/api/admin/settings',{method:'PATCH',body:JSON.stringify({key,value})}); status.textContent='Đã lưu thay đổi.'; } catch { status.textContent='Chưa lưu được thay đổi.'; } });
    }
    if (tab === 'content') {
      const { results } = await api('/api/admin/topics');
      panel.innerHTML = `<div class="admin-list"><h2>33 nội dung chính thức</h2><p>Chọn một mục để sửa song ngữ. Nội dung công khai có tại <a href="/noi-dung" target="_blank">/noi-dung</a>.</p>${results.map(item => `<button class="admin-row" data-topic="${item.id}"><span>${String(item.topic_number).padStart(2,'0')}</span><strong>${escapeHtml(item.title_vi)}</strong></button>`).join('')}</div>`;
      panel.querySelectorAll('[data-topic]').forEach(button => button.addEventListener('click', () => topicEditor(results.find(item => item.id === Number(button.dataset.topic)))));
    }
    if (tab === 'pages') {
      const { results } = await api('/api/admin/pages');
      panel.innerHTML = `<div class="admin-list"><h2>Các trang hệ thống</h2><p>Chọn trang để sửa nội dung, SEO và trạng thái xuất bản.</p>${results.map(item => `<button class="admin-row" data-page="${item.id}"><span>${escapeHtml(item.lang.toUpperCase())}</span><strong>${escapeHtml(item.title)}</strong><small>/${escapeHtml(item.slug)} · ${escapeHtml(item.status)}</small></button>`).join('')}</div>`;
      panel.querySelectorAll('[data-page]').forEach(button => button.addEventListener('click', () => pageEditor(results.find(item => item.id === Number(button.dataset.page)))));
    }
    if (tab === 'submissions') {
      const { results } = await api('/api/admin/submissions');
      panel.innerHTML = `<div class="admin-list"><h2>Yêu cầu đã gửi</h2>${results.length ? results.map(item => `<article class="submission"><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.form_type)} · ${escapeHtml(item.created_at)}</span><a href="mailto:${escapeHtml(item.email)}">${escapeHtml(item.email)}</a><p>${escapeHtml(item.subject || '')}</p><p>${escapeHtml(item.message)}</p></article>`).join('') : '<p>Chưa có yêu cầu mới.</p>'}</div>`;
    }
  } catch { panel.innerHTML = '<p class="notice">Không tải được dữ liệu quản trị.</p>'; }
}

function topicEditor(item) {
  const panel = document.querySelector('#adminPanel');
  panel.innerHTML = `<form class="admin-form" id="topicForm"><button type="button" class="text-link" id="back">← Danh sách nội dung</button><h2>${String(item.topic_number).padStart(2,'0')} · Sửa nội dung</h2><label>Tiêu đề Việt<input name="title_vi" value="${escapeHtml(item.title_vi)}"></label><label>Nội dung Việt<textarea name="body_vi">${escapeHtml(item.body_vi)}</textarea></label><label>English title<input name="title_en" value="${escapeHtml(item.title_en)}"></label><label>English content<textarea name="body_en">${escapeHtml(item.body_en)}</textarea></label><label class="check"><input type="checkbox" name="is_public" ${item.is_public ? 'checked' : ''}>Công khai nội dung này</label><button class="button primary">Lưu nội dung</button><p class="form-status"></p></form>`;
  panel.querySelector('#back').addEventListener('click', () => renderTab('content'));
  panel.querySelector('#topicForm').addEventListener('submit', async event => { event.preventDefault(); const form = event.currentTarget, status=form.querySelector('.form-status'), data=formValues(form); data.id=item.id; data.is_public=form.querySelector('[name=is_public]').checked; try { await api('/api/admin/topics',{method:'PATCH',body:JSON.stringify(data)}); status.textContent='Đã lưu nội dung.'; } catch { status.textContent='Chưa lưu được.'; } });
}

function pageEditor(item) {
  const panel = document.querySelector('#adminPanel');
  panel.innerHTML = `<form class="admin-form" id="pageForm"><button type="button" class="text-link" id="back">← Danh sách trang</button><h2>${escapeHtml(item.title)}</h2><label>Tiêu đề<input name="title" value="${escapeHtml(item.title)}"></label><label>Tóm tắt<input name="summary" value="${escapeHtml(item.summary)}"></label><label>Nội dung HTML<textarea name="body_html">${escapeHtml(item.body_html)}</textarea></label><label>SEO title<input name="seo_title" value="${escapeHtml(item.seo_title)}"></label><label>SEO description<input name="seo_description" value="${escapeHtml(item.seo_description)}"></label><label>Trạng thái<select name="status">${['draft','review','published','hidden','archived'].map(status => `<option ${status === item.status ? 'selected' : ''}>${status}</option>`).join('')}</select></label><label class="check"><input type="checkbox" name="is_public" ${item.is_public ? 'checked' : ''}>Cho phép công khai</label><button class="button primary">Lưu trang</button><p class="form-status"></p></form>`;
  panel.querySelector('#back').addEventListener('click', () => renderTab('pages'));
  panel.querySelector('#pageForm').addEventListener('submit', async event => { event.preventDefault(); const form=event.currentTarget,status=form.querySelector('.form-status'),data=formValues(form); data.id=item.id; data.is_public=form.querySelector('[name=is_public]').checked; try { await api('/api/admin/pages',{method:'PATCH',body:JSON.stringify(data)}); status.textContent='Đã lưu trang.'; } catch { status.textContent='Chưa lưu được.'; } });
}

async function boot() { try { const session = await api('/api/admin/session'); if (session.setup_required) authForm('setup'); else if (!session.authenticated) authForm('login'); else adminLayout(session); } catch { app.textContent = 'Không kết nối được khu vực quản trị.'; } }
boot();
