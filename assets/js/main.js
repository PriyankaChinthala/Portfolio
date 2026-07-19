/* Shared behaviour: theme toggle, mobile nav, scroll reveal, active link */
(function () {
  const root = document.documentElement;

  /* ---- Theme ---- */
  const saved = localStorage.getItem('theme');
  if (saved) root.setAttribute('data-theme', saved);
  const themeBtn = document.getElementById('theme-toggle');
  function syncIcon() {
    if (!themeBtn) return;
    const dark = root.getAttribute('data-theme') !== 'light';
    themeBtn.textContent = dark ? '☾' : '☀';
    themeBtn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  }
  syncIcon();
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const dark = root.getAttribute('data-theme') !== 'light';
      root.setAttribute('data-theme', dark ? 'light' : 'dark');
      localStorage.setItem('theme', dark ? 'light' : 'dark');
      syncIcon();
      document.dispatchEvent(new Event('themechange'));
    });
  }

  /* ---- Mobile nav ---- */
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
  }

  /* ---- Active link highlight ---- */
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#nav-links a').forEach(a => {
    const target = a.getAttribute('href');
    if (target === here || (here === 'index.html' && target === 'index.html')) a.classList.add('active');
  });

  /* ---- Scroll reveal ---- */
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && items.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    items.forEach(el => io.observe(el));
  } else {
    items.forEach(el => el.classList.add('in'));
  }

  /* ---- Footer year ---- */
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
