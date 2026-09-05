const closeMenus = except => document.querySelectorAll('.nav-group.open').forEach(group => { if (group !== except) { group.classList.remove('open'); group.querySelector('.nav-trigger')?.setAttribute('aria-expanded', 'false'); } });

document.addEventListener('click', event => {
  const trigger = event.target.closest('.nav-trigger');
  if (trigger) {
    const group = trigger.closest('.nav-group');
    const opening = !group.classList.contains('open');
    closeMenus(group);
    group.classList.toggle('open', opening);
    trigger.setAttribute('aria-expanded', String(opening));
    return;
  }
  if (!event.target.closest('.nav-group')) closeMenus();
});

document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenus(); });

const mobileToggle = document.querySelector('.mobile-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
mobileToggle?.addEventListener('click', () => {
  const opening = !mobileMenu.classList.contains('open');
  mobileMenu.classList.toggle('open', opening);
  mobileToggle.setAttribute('aria-expanded', String(opening));
  if (!opening) closeMenus();
});

document.querySelectorAll('.public-form').forEach(form => form.addEventListener('submit', async event => {
  event.preventDefault();
  const button = form.querySelector('button[type="submit"],button');
  const status = form.querySelector('.form-status');
  const values = Object.fromEntries(new FormData(form));
  const payload = { ...values, consent: form.querySelector('[name="consent"]')?.checked === true, form_type: form.dataset.formType || 'contact' };
  button.disabled = true;
  const english = document.documentElement.lang === 'en';
  status.textContent = english ? 'Sending…' : 'Đang gửi…';
  try {
    const response = await fetch('/api/forms', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
    if (!response.ok) throw new Error('FORM_ERROR');
    form.reset();
    status.textContent = english ? 'Your information has been received. Sky First will respond through the appropriate contact point.' : 'Thông tin đã được tiếp nhận. Sky First sẽ phản hồi qua đầu mối phù hợp.';
  } catch {
    status.textContent = english ? 'It cannot be sent right now. Please try again or contact skyfirst.ec@gmail.com.' : 'Chưa thể gửi lúc này. Vui lòng thử lại hoặc liên hệ skyfirst.ec@gmail.com.';
  } finally { button.disabled = false; }
}));
