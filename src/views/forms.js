import { escapeHtml } from '../utils/escape.js';

const CONFIG = {
  core_team: {
    eyebrow: 'THAM GIA · CORE TEAM',
    title: 'Gửi thông tin quan tâm Core Team',
    lead: 'Thông tin này giúp Sky First tiếp nhận nhu cầu và liên hệ khi có vị trí hoặc đợt tuyển phù hợp.'
  },
  volunteer: {
    eyebrow: 'THAM GIA · TÌNH NGUYỆN VIÊN',
    title: 'Gửi thông tin tình nguyện',
    lead: 'Mỗi chương trình có yêu cầu riêng. Sky First sẽ sử dụng thông tin này để phân luồng tới hoạt động phù hợp.'
  },
  learner: {
    eyebrow: 'THAM GIA · NGƯỜI HỌC',
    title: 'Gửi nhu cầu học tập',
    lead: 'Bạn có thể cho biết lớp học, kỹ năng hoặc chương trình đang quan tâm.'
  },
  cooperation: {
    eyebrow: 'HỢP TÁC',
    title: 'Gửi đề nghị hợp tác',
    lead: 'Đề xuất sẽ được xem xét theo định hướng, nguồn lực và phạm vi hoạt động phù hợp.'
  }
};

export function participationForm(type) {
  const c = CONFIG[type];
  if (!c) return '';
  const organization = type === 'cooperation'
    ? '<label>Tổ chức/Đơn vị<input name="organization" maxlength="180"></label>'
    : '';
  return `<section class="section tint"><div class="container narrow"><div class="eyebrow">${escapeHtml(c.eyebrow)}</div><h2>${escapeHtml(c.title)}</h2><p class="lead">${escapeHtml(c.lead)}</p><form class="ajax-form" data-form-type="${type}"><div class="form-grid"><label>Họ và tên<input name="name" required maxlength="120"></label><label>Email<input name="email" type="email" maxlength="160"></label><label>Số điện thoại<input name="phone" maxlength="40"></label>${organization}</div><label>Nội dung/Thông tin bổ sung<textarea name="message" maxlength="3000" rows="6"></textarea></label><div class="hp-field" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div><label class="check"><input name="consent" type="checkbox" required> Tôi đồng ý để Sky First sử dụng thông tin này nhằm liên hệ và xử lý đăng ký/đề nghị.</label><button class="btn primary" type="submit">Gửi thông tin</button><div class="form-status" aria-live="polite"></div></form></div></section>`;
}
