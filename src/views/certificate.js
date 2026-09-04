import { escapeHtml, escapeAttr } from '../utils/escape.js';
import { localizedPath, tr } from '../services/i18n.js';

export function certificateSearch(q = '', c = null, ctx = null) {
  let result = '';
  if (q && c) {
    const status = c.status === 'valid' ? 'HỢP LỆ' : c.status === 'revoked' ? 'ĐÃ THU HỒI' : c.status === 'expired' ? 'HẾT HIỆU LỰC' : 'CHỜ HOÀN TẤT QR';
    result = `<div class="verify-result"><div class="statusline ${c.status === 'valid' ? 'ok' : c.status === 'revoked' ? 'bad' : 'warn'}">${status}</div><h2>${escapeHtml(c.title)}</h2><dl><dt>Người nhận</dt><dd>${escapeHtml(c.recipient_name)}</dd><dt>Mã GCN</dt><dd>${escapeHtml(c.certificate_code)}</dd><dt>Đơn vị cấp</dt><dd>${escapeHtml(c.issuer_unit || 'Sky First')}</dd><dt>Chương trình</dt><dd>${escapeHtml(c.program_name || '—')}</dd><dt>Nội dung ghi nhận</dt><dd>${escapeHtml(c.role_recognition || '—')}</dd><dt>Ngày cấp</dt><dd>${escapeHtml(c.issue_date)}</dd><dt>Hiệu lực đến</dt><dd>${escapeHtml(c.valid_until || 'Không quy định')}</dd><dt>Nguồn phát hành</dt><dd>${escapeHtml(c.issuing_system)}</dd></dl>${c.qr_url ? `<img class="qr" src="${escapeAttr(c.qr_url)}" alt="QR xác thực">` : ''}${c.public_pdf_url ? `<a class="btn secondary" href="${escapeAttr(c.public_pdf_url)}" target="_blank" rel="noopener">Xem PDF công khai</a>` : ''}</div>`;
  } else if (q) {
    result = `<div class="note">${escapeHtml(tr(ctx,'certificate.not_found','Không tìm thấy Giấy chứng nhận phù hợp. Kiểm tra lại mã đã nhập.'))}</div>`;
  }
  const action = ctx ? localizedPath('/tra-cuu', ctx.lang, ctx.defaultLanguage) : '/tra-cuu';
  return `<section class="page-hero"><div class="container"><div class="eyebrow">${escapeHtml(tr(ctx,'certificate.eyebrow','Xác thực toàn hệ thống Sky First'))}</div><h1>${escapeHtml(tr(ctx,'certificate.title','Tra cứu thành tích & Giấy chứng nhận'))}</h1><p class="lead">${escapeHtml(tr(ctx,'certificate.lead','Cổng tra cứu trung tâm tại skyfirst.io.vn cho các thành tích và Giấy chứng nhận đã được công bố từ mọi website, cổng và ứng dụng thuộc Sky First.'))}</p></div></section><section class="page-body"><div class="container narrow"><form class="verify-form" action="${escapeAttr(action)}" method="get"><label for="q">${escapeHtml(tr(ctx,'certificate.query_label','Mã tra cứu thành tích, GCN hoặc mã xác thực'))}</label><div class="searchrow"><input id="q" name="q" value="${escapeAttr(q)}" autocomplete="off" placeholder="${escapeAttr(tr(ctx,'certificate.query_placeholder','Nhập mã do hệ thống Sky First cấp'))}"><button class="btn primary" type="submit">${escapeHtml(tr(ctx,'certificate.search','Tra cứu'))}</button></div></form>${result}</div></section>`;
}
