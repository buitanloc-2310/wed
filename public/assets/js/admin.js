const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const h = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
const state = { session: null, meta: null, resource: null, csrf: null };

const labels = {
  dashboard:'Dashboard', pages:'Trang', posts:'Bài viết', categories:'Chuyên mục', programs:'Chương trình/Dự án',
  classes:'Lớp học', activities:'Hoạt động', units:'Đơn vị trực thuộc', team_members:'Nhân sự công khai',
  partners:'Đối tác', albums:'Thư viện hình ảnh', documents:'Tài liệu', media:'Media', certificates:'GCN/Tra cứu',
  forms:'Biểu mẫu/Đăng ký', menus:'Menu', portals:'Hệ thống Sky First', languages:'Ngôn ngữ',
  admins:'Tài khoản quản trị', settings:'Cài đặt, Giao diện, Footer & SEO', ui_strings:'Chuỗi giao diện đa ngôn ngữ', issuer_keys:'Khóa cấp GCN toàn hệ thống', audit_log:'Nhật ký/Audit'
};

const fieldLabels = {
  translation_group:'Nhóm bản dịch', lang:'Ngôn ngữ', slug:'Slug/Đường dẫn', title:'Tiêu đề', excerpt:'Mô tả ngắn',
  body_html:'Nội dung HTML', status:'Trạng thái', public:'Công khai', seo_title:'SEO title', seo_description:'SEO description',
  og_image:'Ảnh Open Graph', published_at:'Thời điểm xuất bản', scheduled_at:'Lịch xuất bản', featured_image:'Ảnh đại diện',
  category_id:'ID chuyên mục', unit_id:'ID đơn vị', author_name:'Tác giả', name:'Tên', description:'Mô tả', sort_order:'Thứ tự',
  registration_url:'Liên kết đăng ký', start_date:'Ngày bắt đầu', end_date:'Ngày kết thúc', audience:'Đối tượng', objective:'Mục tiêu',
  format:'Hình thức', schedule_text:'Lịch', duration_text:'Thời lượng', program_id:'ID chương trình', location_text:'Địa điểm',
  start_at:'Bắt đầu', end_at:'Kết thúc', code:'Mã', official_name:'Tên chính thức', english_name:'Tên tiếng Anh', logo_url:'Logo URL',
  website_url:'Website', contact_email:'Email liên hệ', photo_url:'Ảnh', bio:'Giới thiệu', relationship_status:'Trạng thái quan hệ',
  activity_id:'ID hoạt động', cover_url:'Ảnh bìa', media_id:'ID media', category:'Phân loại', certificate_code:'Mã GCN',
  verification_token:'Mã xác thực', recipient_name:'Người nhận', issuer_unit:'Đơn vị cấp', program_name:'Chương trình',
  role_recognition:'Nội dung ghi nhận', issue_date:'Ngày cấp', valid_until:'Hiệu lực đến', issuing_system:'Hệ thống phát hành',
  public_pdf_url:'PDF công khai', qr_url:'QR URL', revocation_note:'Lý do thu hồi', form_type:'Loại biểu mẫu', email:'Email', phone:'Điện thoại',
  organization:'Tổ chức', message:'Nội dung', consent:'Đồng ý xử lý dữ liệu', location:'Vị trí menu', label:'Nhãn hiển thị', url:'Liên kết',
  parent_id:'Menu cha', visible:'Hiển thị', new_tab:'Mở tab mới', subtitle:'Tên phụ', show_footer:'Hiện ở Footer', native_name:'Tên bản địa',
  direction:'Hướng chữ', enabled:'Bật', is_default:'Mặc định', filename:'Tên file', alt_text:'Alt text', caption:'Chú thích', album_id:'ID album',
  key:'Khóa cài đặt', value:'Giá trị', group_name:'Nhóm', value_type:'Kiểu dữ liệu', is_public:'Cho phép public API', role:'Vai trò', active:'Hoạt động'
};

async function api(url, opt = {}) {
  opt.headers = { ...(opt.headers || {}) };
  if (state.csrf && !['GET','HEAD'].includes(opt.method || 'GET')) opt.headers['x-csrf-token'] = state.csrf;
  const r = await fetch(url, opt);
  let j = {};
  try { j = await r.json(); } catch {}
  if (!r.ok) throw new Error(j.detail || j.error || `HTTP ${r.status}`);
  return j;
}

async function boot() {
  state.session = await api('/api/admin/session');
  state.csrf = state.session.csrf;
  if (state.session.setup_required) return renderSetup();
  if (!state.session.authenticated) return renderLogin();
  state.meta = await api('/api/admin/meta');
  renderShell();
  await dashboard();
}

function authCard(title, sub, fields, button, onSubmit) {
  $('#adminApp').innerHTML = `<div class="auth-shell"><form class="auth-card"><img src="/assets/branding/sky-first-main-logo.png" alt="Sky First"><h1>${h(title)}</h1><p>${h(sub)}</p>${fields.map(f => `<label class="field">${h(f.label)}<input name="${f.name}" type="${f.type || 'text'}" ${f.required ? 'required' : ''} ${f.autocomplete ? `autocomplete="${f.autocomplete}"` : ''}></label>`).join('')}<button class="btn primary" type="submit">${h(button)}</button><p class="status"></p></form></div>`;
  $('.auth-card').addEventListener('submit', onSubmit);
}

function renderSetup() {
  authCard('Khởi tạo Sky First Admin', 'Chỉ xuất hiện khi hệ thống chưa có quản trị viên. Tài khoản đầu tiên sẽ là SUPER ADMIN.', [
    { label:'Họ và tên', name:'name', required:true },
    { label:'Email', name:'email', type:'email', required:true, autocomplete:'email' },
    { label:'Mật khẩu (ít nhất 12 ký tự)', name:'password', type:'password', required:true, autocomplete:'new-password' }
  ], 'Tạo SUPER ADMIN', async e => {
    e.preventDefault();
    const status = $('.status');
    try {
      await api('/api/admin/setup', { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify(Object.fromEntries(new FormData(e.target))) });
      location.reload();
    } catch (err) { status.textContent = err.message; status.className = 'status err'; }
  });
}

function renderLogin() {
  authCard('Đăng nhập Sky First Admin', 'Khu vực quản trị nội dung và vận hành website.', [
    { label:'Email', name:'email', type:'email', required:true, autocomplete:'username' },
    { label:'Mật khẩu', name:'password', type:'password', required:true, autocomplete:'current-password' }
  ], 'Đăng nhập', async e => {
    e.preventDefault();
    const status = $('.status');
    try {
      const j = await api('/api/admin/login', { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify(Object.fromEntries(new FormData(e.target))) });
      state.csrf = j.csrf;
      location.reload();
    } catch (err) { status.textContent = err.message; status.className = 'status err'; }
  });
}

function renderShell() {
  const resources = Object.entries(state.meta.resources).filter(([, meta]) => meta.capabilities?.read).map(([name]) => name);
  const nav = ['dashboard', ...resources];
  $('#adminApp').innerHTML = `<div class="admin"><aside class="sidebar"><div class="admin-brand"><img src="/assets/branding/sky-first-main-logo.png" alt="Sky First"><span>SKY FIRST ADMIN</span></div>${nav.map(n => `<button class="navbtn" data-nav="${n}">${h(labels[n] || state.meta.resources[n]?.label || n)}</button>`).join('')}</aside><div class="main"><header class="admin-top"><div><b>Sky First Admin</b><div class="hint">${h(state.session.admin.name)} · ${h(state.session.admin.role)}</div></div><div class="top-actions"><a class="btn light" href="/" target="_blank" rel="noopener">Xem website</a><button id="changePassword" class="btn light">Đổi mật khẩu</button><button id="logout" class="btn light">Đăng xuất</button></div></header><div id="content" class="content"></div></div></div>`;
  $$('[data-nav]').forEach(b => b.onclick = () => navigate(b.dataset.nav));
  $('#changePassword').onclick = passwordModal;
  $('#logout').onclick = async () => { await api('/api/admin/logout', { method:'POST' }); location.reload(); };
}

function setActive(name) { $$('.navbtn').forEach(x => x.classList.toggle('active', x.dataset.nav === name)); }
async function navigate(name) { setActive(name); if (name === 'dashboard') return dashboard(); state.resource = name; await resourceList(name); }

async function dashboard() {
  setActive('dashboard');
  const d = await api('/api/admin/dashboard');
  $('#content').innerHTML = `<div class="panel"><h1>Dashboard</h1><p>Quản trị nội dung, hệ thống, biểu mẫu, media và xác thực tập trung của Sky First.</p></div><div class="grid4">${Object.entries(d.counts).map(([k,v]) => `<div class="stat"><span>${h(labels[k] || k)}</span><br><b>${v}</b></div>`).join('')}</div><div class="panel" style="margin-top:18px"><h2>Quy trình xuất bản</h2><p>Nháp → Chờ duyệt → Đã xuất bản → Ẩn/Lưu trữ. Nội dung đặt lịch chỉ xuất hiện khi đến thời điểm đã cấu hình.</p><p class="hint">EDITOR soạn nội dung; REVIEWER có thể rà soát/xuất bản; ADMIN và SUPER ADMIN quản trị hệ thống. Quyền thực tế được kiểm tra lại ở API, không phụ thuộc giao diện.</p></div>`;
}

function rowId(row, meta) { return row?.[meta.idField || 'id']; }

async function resourceList(name) {
  const meta = state.meta.resources[name];
  const data = await api(`/api/admin/resources/${name}`);
  const rows = data.results || [];
  const cols = rows.length ? Object.keys(rows[0]).slice(0, 8) : [meta.idField || 'id', ...(meta.fields || []).slice(0, 7)];
  const createButton = meta.capabilities.create && name !== 'issuer_keys' ? '<button class="btn primary" data-new>Tạo mới</button>' : '';
  const uploadButton = meta.capabilities.upload ? '<button class="btn primary" data-upload>Tải file lên</button>' : '';
  const adminButton = name === 'admins' && meta.capabilities.create ? '<button class="btn primary" data-admin-new>Tạo tài khoản</button>' : '';
  const issuerButton = name === 'issuer_keys' && meta.capabilities.create ? '<button class="btn primary" data-issuer-new>Tạo khóa cấp</button>' : '';

  $('#content').innerHTML = `<div class="panel"><div class="panel-head"><div><h1>${h(meta.label)}</h1><div class="hint">${rows.length} bản ghi</div></div><div class="panel-actions">${createButton}${uploadButton}${adminButton}${issuerButton}</div></div><div class="table-wrap"><table class="table"><thead><tr>${cols.map(c => `<th>${h(fieldLabels[c] || c)}</th>`).join('')}<th>Thao tác</th></tr></thead><tbody>${rows.map(r => `<tr>${cols.map(c => `<td title="${h(r[c])}">${h(r[c])}</td>`).join('')}<td><div class="row-actions">${meta.capabilities.update ? `<button class="btn light" data-edit="${h(rowId(r,meta))}">Sửa</button>` : ''}${meta.capabilities.delete ? `<button class="btn danger" data-del="${h(rowId(r,meta))}">Xóa/Lưu trữ</button>` : ''}</div></td></tr>`).join('')}</tbody></table></div></div>`;

  const create = $('[data-new]'); if (create) create.onclick = () => editor(name, null, meta);
  $$('[data-edit]').forEach(b => b.onclick = async () => editor(name, await api(`/api/admin/resources/${name}/${encodeURIComponent(b.dataset.edit)}`), meta));
  $$('[data-del]').forEach(b => b.onclick = async () => {
    if (!confirm('Xác nhận xóa/lưu trữ bản ghi này?')) return;
    try { await api(`/api/admin/resources/${name}/${encodeURIComponent(b.dataset.del)}`, { method:'DELETE' }); await resourceList(name); }
    catch (e) { alert(e.message); }
  });
  const upload = $('[data-upload]'); if (upload) upload.onclick = uploadModal;
  const adminNew = $('[data-admin-new]'); if (adminNew) adminNew.onclick = adminModal;
  const issuerNew = $('[data-issuer-new]'); if (issuerNew) issuerNew.onclick = issuerModal;
}

const bools = new Set(['public','visible','new_tab','enabled','is_default','show_footer','active','consent','is_public']);
const longFields = new Set(['body_html','description','summary','excerpt','message','bio','objective','role_recognition','revocation_note','seo_description','value']);
const datetimeFields = new Set(['published_at','scheduled_at','start_at','end_at']);
const dateFields = new Set(['start_date','end_date','issue_date','valid_until']);

function statusOptions(name) {
  if (name === 'pages' || name === 'posts') return ['draft','pending','published','hidden','archived'];
  if (name === 'programs' || name === 'classes') return ['upcoming','open','running','closed','ended','archived'];
  if (name === 'activities') return ['upcoming','running','ended','archived'];
  if (name === 'albums' || name === 'documents' || name === 'ui_strings') return ['draft','published','hidden','archived'];
  if (name === 'certificates') return ['pending_qr','valid','expired','revoked'];
  if (name === 'forms') return ['new','reviewing','contacted','resolved','archived'];
  if (name === 'units' || name === 'team_members') return ['active','inactive','archived'];
  if (name === 'portals') return ['active','maintenance','hidden','retired'];
  return null;
}

function fieldControl(name, field, value, row) {
  const label = fieldLabels[field] || field;
  const val = value ?? '';
  if (field === 'status' && statusOptions(name)) {
    return `<label class="field"><span>${h(label)}</span><select name="${field}">${statusOptions(name).map(x => `<option value="${x}"${x === val ? ' selected' : ''}>${h(x)}</option>`).join('')}</select></label>`;
  }
  if (field === 'role') {
    return `<label class="field"><span>${h(label)}</span><select name="role">${['SUPER_ADMIN','ADMIN','EDITOR','REVIEWER'].map(x => `<option${x === val ? ' selected' : ''}>${x}</option>`).join('')}</select></label>`;
  }
  if (field === 'direction') {
    return `<label class="field"><span>${h(label)}</span><select name="direction"><option value="ltr"${val === 'ltr' ? ' selected' : ''}>ltr</option><option value="rtl"${val === 'rtl' ? ' selected' : ''}>rtl</option></select></label>`;
  }
  if (bools.has(field)) {
    return `<label class="field"><span>${h(label)}</span><select name="${field}"><option value="1"${Number(val) === 1 ? ' selected' : ''}>Có</option><option value="0"${Number(val) !== 1 ? ' selected' : ''}>Không</option></select></label>`;
  }
  if (longFields.has(field)) {
    return `<label class="field wide"><span>${h(label)}</span><textarea name="${field}" rows="${field === 'body_html' ? 16 : 5}">${h(val)}</textarea></label>`;
  }
  if (datetimeFields.has(field)) {
    const local = val ? String(val).replace('Z','').slice(0,16) : '';
    return `<label class="field"><span>${h(label)}</span><input name="${field}" type="datetime-local" value="${h(local)}"></label>`;
  }
  if (dateFields.has(field)) return `<label class="field"><span>${h(label)}</span><input name="${field}" type="date" value="${h(String(val).slice(0,10))}"></label>`;
  const readonly = row && (field === 'key' || field === 'certificate_code' || field === 'verification_token') ? ' readonly' : '';
  return `<label class="field"><span>${h(label)}</span><input name="${field}" value="${h(val)}"${readonly}></label>`;
}

function editor(name, row, meta) {
  const id = row ? row[meta.idField || 'id'] : null;
  const fields = meta.fields || [];
  const controls = fields.map(f => fieldControl(name, f, row?.[f], row)).join('');
  document.body.insertAdjacentHTML('beforeend', `<div class="modal"><form class="modal-card"><div class="panel-head"><div><h2>${row ? 'Sửa' : 'Tạo'} ${h(meta.label)}</h2>${(name === 'pages' || name === 'posts') && !meta.capabilities.publish ? '<div class="hint">Tài khoản này không có quyền xuất bản trực tiếp.</div>' : ''}</div><button class="btn light" type="button" data-close>Đóng</button></div><div class="form-grid">${controls}</div><button class="btn primary" type="submit">Lưu</button> <span class="status"></span></form></div>`);
  const modal = $('.modal'); const form = $('.modal-card', modal);
  $('[data-close]', modal).onclick = () => modal.remove();
  form.onsubmit = async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    for (const k of bools) if (k in data) data[k] = data[k] === '1';
    for (const k of datetimeFields) if (data[k]) data[k] = new Date(data[k]).toISOString();
    const status = $('.status', modal);
    try {
      await api(row ? `/api/admin/resources/${name}/${encodeURIComponent(id)}` : `/api/admin/resources/${name}`, {
        method: row ? 'PATCH' : 'POST', headers:{'content-type':'application/json'}, body:JSON.stringify(data)
      });
      modal.remove(); await resourceList(name);
    } catch (err) { status.textContent = err.message; status.className = 'status err'; }
  };
}

function uploadModal() {
  document.body.insertAdjacentHTML('beforeend', `<div class="modal"><form class="modal-card"><div class="panel-head"><h2>Tải media lên R2</h2><button class="btn light" type="button" data-close>Đóng</button></div><label class="field">File JPG/PNG/WebP/PDF tối đa 15 MB<input type="file" name="file" required accept="image/jpeg,image/png,image/webp,application/pdf"></label><button class="btn primary">Tải lên</button> <span class="status"></span></form></div>`);
  const modal = $('.modal'); const form = $('.modal-card', modal); $('[data-close]', modal).onclick = () => modal.remove();
  form.onsubmit = async e => {
    e.preventDefault(); const file = form.file.files[0]; const status = $('.status', modal);
    try { await api('/api/admin/media/upload', { method:'POST', headers:{'content-type':file.type,'x-filename':file.name}, body:file }); modal.remove(); await resourceList('media'); }
    catch (err) { status.textContent = err.message; status.className = 'status err'; }
  };
}

function adminModal() {
  document.body.insertAdjacentHTML('beforeend', `<div class="modal"><form class="modal-card"><div class="panel-head"><h2>Tạo tài khoản quản trị</h2><button class="btn light" type="button" data-close>Đóng</button></div><div class="form-grid"><label class="field">Họ tên<input name="name" required></label><label class="field">Email<input name="email" type="email" required></label><label class="field">Vai trò<select name="role"><option>ADMIN</option><option>EDITOR</option><option>REVIEWER</option><option>SUPER_ADMIN</option></select></label><label class="field">Mật khẩu ≥ 12 ký tự<input name="password" type="password" required minlength="12"></label></div><button class="btn primary">Tạo</button> <span class="status"></span></form></div>`);
  const modal = $('.modal'); const form = $('.modal-card', modal); $('[data-close]', modal).onclick = () => modal.remove();
  form.onsubmit = async e => { e.preventDefault(); const status = $('.status', modal); try { await api('/api/admin/admins', { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify(Object.fromEntries(new FormData(form))) }); modal.remove(); await resourceList('admins'); } catch (err) { status.textContent = err.message; status.className = 'status err'; } };
}

function issuerModal() {
  document.body.insertAdjacentHTML('beforeend', `<div class="modal"><form class="modal-card"><div class="panel-head"><h2>Tạo khóa cấp GCN toàn hệ thống</h2><button class="btn light" type="button" data-close>Đóng</button></div><p class="hint">Mỗi website/cổng/app Sky First dùng một khóa riêng. Khóa bí mật chỉ hiển thị đúng một lần sau khi tạo.</p><label class="field">Tên website, cổng hoặc đơn vị phát hành<input name="issuer_name" required maxlength="160"></label><button class="btn primary">Tạo khóa</button> <span class="status"></span><div class="key-result"></div></form></div>`);
  const modal = $('.modal'); const form = $('.modal-card', modal); $('[data-close]', modal).onclick = () => modal.remove();
  form.onsubmit = async e => {
    e.preventDefault(); const status = $('.status', modal);
    try {
      const j = await api('/api/admin/issuer-keys', { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify(Object.fromEntries(new FormData(form))) });
      status.textContent = 'Đã tạo. Sao chép khóa ngay.'; status.className = 'status ok';
      $('.key-result', modal).innerHTML = `<div class="codebox">${h(j.key)}</div><p class="hint">${h(j.warning)}</p>`;
      form.querySelector('button.primary').disabled = true;
    } catch (err) { status.textContent = err.message; status.className = 'status err'; }
  };
}

function passwordModal() {
  document.body.insertAdjacentHTML('beforeend', `<div class="modal"><form class="modal-card small"><div class="panel-head"><h2>Đổi mật khẩu</h2><button class="btn light" type="button" data-close>Đóng</button></div><label class="field">Mật khẩu hiện tại<input name="current_password" type="password" required autocomplete="current-password"></label><label class="field">Mật khẩu mới ≥ 12 ký tự<input name="new_password" type="password" required minlength="12" autocomplete="new-password"></label><button class="btn primary">Cập nhật</button> <span class="status"></span></form></div>`);
  const modal = $('.modal'); const form = $('.modal-card', modal); $('[data-close]', modal).onclick = () => modal.remove();
  form.onsubmit = async e => { e.preventDefault(); const status = $('.status', modal); try { await api('/api/admin/change-password', { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify(Object.fromEntries(new FormData(form))) }); status.textContent = 'Đã đổi mật khẩu.'; status.className = 'status ok'; form.reset(); } catch (err) { status.textContent = err.message; status.className = 'status err'; } };
}

boot().catch(e => {
  $('#adminApp').innerHTML = `<div class="auth-shell"><div class="auth-card"><h1>Không thể tải Sky First Admin</h1><p>${h(e.message)}</p><button class="btn primary" onclick="location.reload()">Thử lại</button></div></div>`;
});
