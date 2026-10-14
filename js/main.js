(() => {
  'use strict';

  /* ------------------------------------------------------------------
     CONFIG - set the WhatsApp number here (country code + number, digits
     only, e.g. 919876543210). Every WhatsApp button reads from this.
     ------------------------------------------------------------------ */
  const WHATSAPP_NUMBER = '910000000000'; // TODO: replace with the FPC's real number
  const WHATSAPP_MESSAGE = 'Hello Hulikadu FPC, I would like to know more about your organic produce.';

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
  document.querySelectorAll('[data-whatsapp]').forEach(a => { a.href = waUrl; });

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav ---------- */
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('primaryNav');
  const setNav = open => {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.firstElementChild.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
  };
  toggle.addEventListener('click', () => setNav(!nav.classList.contains('open')));
  nav.addEventListener('click', e => { if (e.target.closest('a')) setNav(false); });

  /* ---------- Reveal on scroll ---------- */
  const revealTargets = document.querySelectorAll('.card, .product-card, .about-cards li, .g-item, .section-head, .about-text, .contact-card');
  revealTargets.forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('visible'); obs.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(el => io.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('visible'));
  }

  /* ---------- Count-up numbers ---------- */
  const fmt = (n, indian) => indian ? n.toLocaleString('en-IN') : String(n);
  const countUp = el => {
    const target = Number(el.dataset.count);
    const indian = el.dataset.indian === 'true';
    const start = performance.now(), dur = 1400;
    const tick = now => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = fmt(Math.round(target * (1 - Math.pow(1 - p, 3))), indian);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const cio = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => { if (en.isIntersecting) { countUp(en.target); obs.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach(c => cio.observe(c));
  }

  /* ---------- Gallery: fallback for remote placeholder photos ---------- */
  const PLACEHOLDER = 'images/meal-placeholder.svg';
  document.querySelectorAll('img[data-fallback]').forEach(img => {
    img.addEventListener('error', () => { img.src = PLACEHOLDER; }, { once: true });
  });

  /* ---------- Gallery lightbox ---------- */
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCap = document.getElementById('lbCap');
  const closeLb = () => { lb.hidden = true; document.body.style.overflow = ''; };

  document.getElementById('gallery-grid').addEventListener('click', e => {
    const fig = e.target.closest('.g-item');
    if (!fig) return;
    const img = fig.querySelector('img');
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = fig.querySelector('figcaption').textContent;
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    document.getElementById('lbClose').focus();
  });
  lb.addEventListener('click', e => { if (e.target === lb || e.target.closest('#lbClose')) closeLb(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !lb.hidden) closeLb(); });
})();
