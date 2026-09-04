(() => {
  const q = (s, r = document) => r.querySelector(s);
  const all = (s, r = document) => [...r.querySelectorAll(s)];

  const toggle = q('.menu-toggle');
  const mobile = q('.mobile-nav');
  if (toggle && mobile) {
    toggle.addEventListener('click', () => {
      const open = mobile.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  const closeDrops = (except = null) => all('.navdrop.open').forEach(drop => {
    if (drop !== except) {
      drop.classList.remove('open');
      q('button', drop)?.setAttribute('aria-expanded', 'false');
    }
  });

  all('.navdrop > button').forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault();
      const parent = button.closest('.navdrop');
      if (!parent) return;
      const willOpen = !parent.classList.contains('open');
      closeDrops(parent);
      parent.classList.toggle('open', willOpen);
      button.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });
  });

  document.addEventListener('click', event => {
    if (!event.target.closest('.navdrop')) closeDrops();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeDrops();
  });

  const lang = q('#languageSelect');
  if (lang) {
    lang.addEventListener('change', () => {
      const known = [...lang.options].map(o => o.value);
      const defaultLanguage = lang.dataset.defaultLanguage || 'vi';
      const parts = location.pathname.split('/').filter(Boolean);
      if (parts.length && known.includes(parts[0])) parts.shift();
      const rest = '/' + parts.join('/');
      location.href = lang.value === defaultLanguage
        ? (rest === '/' ? '/' : rest)
        : `/${lang.value}${rest === '/' ? '/' : rest}`;
      try { localStorage.setItem('skyfirst_language', lang.value); } catch {}
    });
  }

  all('.ajax-form').forEach(form => form.addEventListener('submit', async e => {
    e.preventDefault();
    const status = q('.form-status', form);
    status.textContent = 'Đang gửi…';
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());
    data.form_type = form.dataset.formType;
    data.consent = fd.has('consent');
    try {
      const r = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data)
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Không thể gửi');
      status.textContent = 'Đã gửi thành công. Sky First đã tiếp nhận thông tin.';
      form.reset();
    } catch (err) {
      status.textContent = 'Chưa thể gửi: ' + err.message;
    }
  }));
})();
