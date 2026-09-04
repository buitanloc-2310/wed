import { escapeAttr, escapeHtml } from '../utils/escape.js';

function vietQr(settings) {
  const bin = String(settings.donation_bank_bin || '').trim();
  const account = String(settings.donation_account_number || '').trim();
  if (!/^\d{6}$/.test(bin) || !/^\d{6,24}$/.test(account)) return '';
  const info = encodeURIComponent(settings.donation_transfer_note || 'Dong hanh Sky First Network');
  const name = encodeURIComponent(settings.donation_account_name || '');
  return `https://img.vietqr.io/image/${bin}-${account}-compact2.png?addInfo=${info}&accountName=${name}`;
}

export function sponsorshipPage(ctx) {
  const s = ctx.settings;
  const qr = vietQr(s);
  const published = Boolean(qr && s.donation_account_name);
  return `<section class="page-hero"><div class="container"><div class="eyebrow">TÀI TRỢ &amp; ĐỒNG HÀNH</div><h1>Kết nối nguồn lực để cùng tạo giá trị</h1><p class="lead">Thông tin tiếp nhận chỉ được công bố tại kênh chính thức của Sky First Network.</p></div></section><section class="page-body"><div class="container"><div class="contribution-card"><div><div class="eyebrow">KÊNH TIẾP NHẬN CHÍNH THỨC</div><h2>Kênh Tiếp Nhận Đóng Góp Sky First Network</h2>${published ? `<div class="bank-row"><small>Ngân hàng thụ hưởng</small><b>${escapeHtml(s.donation_bank_name || s.donation_bank_bin)}</b></div><div class="bank-row"><small>Số tài khoản</small><b>${escapeHtml(s.donation_account_number)}</b></div><div class="bank-row"><small>Tên tài khoản / chủ thể tiếp nhận</small><b>${escapeHtml(s.donation_account_name)}</b></div>` : `<p>Thông tin tài khoản và mã QR sẽ được công bố sau khi hoàn tất xác minh chính thức.</p>`}<div class="bank-row"><small>Cú pháp chuyển khoản đề xuất</small><b>${escapeHtml(s.donation_transfer_note || '')}</b></div><p class="contribution-contact">Đầu mối chính thức: <a href="mailto:${escapeAttr(s.donation_contact || s.email_main || '')}">${escapeHtml(s.donation_contact || s.email_main || '')}</a></p></div><aside class="qr-panel">${published ? `<img src="${escapeAttr(qr)}" alt="Mã QR chuyển khoản Sky First Network"><p>Quét bằng ứng dụng ngân hàng để tạo lệnh chuyển khoản.</p>` : `<div class="qr-pending">QR<br>ĐANG CẬP NHẬT</div><p>Mã QR chỉ hiển thị sau khi tài khoản được xác minh.</p>`}</aside></div></div></section>`;
}
