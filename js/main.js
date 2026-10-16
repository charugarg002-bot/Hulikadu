(() => {
  'use strict';

  /* ------------------------------------------------------------------
     CONFIG - set the WhatsApp number here (country code + number, digits
     only, e.g. 919876543210). Every WhatsApp button reads from this.
     ------------------------------------------------------------------ */
  const WHATSAPP_NUMBER = '919901062058';
  const WHATSAPP_MESSAGE = 'Hello Hulikadu FPC, I would like to know more about your organic produce.';

  /* Paste a WhatsApp Community / Channel invite link here once created
     (e.g. https://chat.whatsapp.com/XXXX). Until then "Join on WhatsApp"
     opens a chat pre-filled with the word HULI. */
  const WHATSAPP_COMMUNITY_URL = '';

  const waLink = text => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  const waUrl = waLink(WHATSAPP_MESSAGE);
  document.querySelectorAll('[data-whatsapp]').forEach(a => { a.href = waUrl; });

  const waJoin = document.getElementById('waJoin');
  if (waJoin) waJoin.href = WHATSAPP_COMMUNITY_URL || waLink('HULI');

  /* ---------- Seasons wheel ----------
     Harvest months per crop (0 = Jan ... 11 = Dec). Provisional - update
     these as the farmers confirm. */
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];
  const SEASONS = {
    kharif: { name: 'Kharif', kn: 'ಮುಂಗಾರು', months: [5, 6, 7, 8, 9] },
    rabi:   { name: 'Rabi',   kn: 'ಹಿಂಗಾರು', months: [10, 11, 0, 1] },
    summer: { name: 'Summer', kn: 'ಬೇಸಿಗೆ',  months: [2, 3, 4] }
  };
  const ALL_YEAR = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const CROPS = [
    { en: 'Nati tomato',          kn: 'ನಾಟಿ ಟೊಮೆಟೊ',   icon: 'fa-carrot',      months: [6, 7, 8, 9, 10, 11] },
    { en: 'Hybrid tomato',        kn: 'ಹೈಬ್ರಿಡ್ ಟೊಮೆಟೊ', icon: 'fa-carrot',      months: [9, 10, 11, 0, 1, 2] },
    { en: 'Sambar cucumber',      kn: 'ಮಂಗಳೂರು ಸೌತೆ',   icon: 'fa-carrot',      months: [7, 8, 9, 10] },
    { en: 'Pumpkin',              kn: 'ಕುಂಬಳಕಾಯಿ',     icon: 'fa-carrot',      months: [8, 9, 10, 11, 0] },
    { en: 'Ash gourd',            kn: 'ಬೂದುಕುಂಬಳ',      icon: 'fa-carrot',      months: [8, 9, 10, 11] },
    { en: 'Colocasia (kesu)',     kn: 'ಕೆಸು',           icon: 'fa-carrot',      months: [8, 9, 10, 11] },
    { en: 'Tapioca',              kn: 'ಮರಗೆಣಸು',        icon: 'fa-carrot',      months: [11, 0, 1, 2, 3] },
    { en: 'Elephant foot yam',    kn: 'ಸುವರ್ಣಗೆಡ್ಡೆ',     icon: 'fa-carrot',      months: [11, 0, 1, 2] },
    { en: 'Finger millet (ragi)', kn: 'ರಾಗಿ',           icon: 'fa-wheat-awn',   months: [9, 10, 11] },
    { en: 'Horsegram',            kn: 'ಹುರುಳಿ',          icon: 'fa-wheat-awn',   months: [11, 0, 1] },
    { en: 'Ginger',               kn: 'ಶುಂಠಿ',           icon: 'fa-leaf',        months: [11, 0, 1, 2] },
    { en: 'Mango ginger',         kn: 'ಮಾವಿನ ಶುಂಠಿ',     icon: 'fa-leaf',        months: [11, 0, 1] },
    { en: 'Tender jackfruit',     kn: 'ಎಳೆ ಹಲಸು',       icon: 'fa-apple-whole', months: [1, 2, 3, 4] },
    { en: 'Watermelon',           kn: 'ಕಲ್ಲಂಗಡಿ',        icon: 'fa-apple-whole', months: [1, 2, 3, 4] },
    { en: 'Musk melon',           kn: 'ಕರಬೂಜ',          icon: 'fa-apple-whole', months: [2, 3, 4] },
    { en: 'Elakki banana',        kn: 'ಏಲಕ್ಕಿ ಬಾಳೆ',      icon: 'fa-apple-whole', months: ALL_YEAR },
    { en: 'Tender coconut',       kn: 'ಎಳನೀರು',         icon: 'fa-apple-whole', months: ALL_YEAR }
  ];
  const seasonOf = m => Object.keys(SEASONS).find(k => SEASONS[k].months.includes(m));
  const cropsIn = m => CROPS.filter(c => c.months.includes(m));
  const thisMonth = new Date().getMonth();

  const wheel = document.getElementById('seasonWheel');
  if (wheel) {
    const NS = 'http://www.w3.org/2000/svg';
    const el = (tag, attrs, parent) => {
      const n = document.createElementNS(NS, tag);
      Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
      return parent.appendChild(n);
    };
    const pt = (r, deg) => {
      const a = deg * Math.PI / 180;
      return `${(r * Math.cos(a)).toFixed(2)} ${(r * Math.sin(a)).toFixed(2)}`;
    };
    const monthAngle = m => -90 + m * 30;           // Jan starts at 12 o'clock
    const sector = (r0, r1, a0, a1) =>
      `M${pt(r1, a0)} A${r1} ${r1} 0 0 1 ${pt(r1, a1)} L${pt(r0, a1)} A${r0} ${r0} 0 0 0 ${pt(r0, a0)}Z`;

    // Outer season arcs
    Object.entries(SEASONS).forEach(([key, s]) => {
      const a0 = monthAngle(s.months[0]) + 2;
      const a1 = monthAngle(s.months[0]) + s.months.length * 30 - 2;
      el('path', { class: `s-arc ${key}`, d: `M${pt(186, a0)} A186 186 0 0 1 ${pt(186, a1)}` }, wheel);
    });

    // Month segments
    const segs = MONTHS.map((name, m) => {
      const g = el('g', {
        class: 'wm', tabindex: '0', role: 'button', 'data-m': m,
        'aria-label': `${name}, ${SEASONS[seasonOf(m)].name} - ${cropsIn(m).length} crops`
      }, wheel);
      const a = monthAngle(m);
      el('path', { d: sector(96, 172, a + .8, a + 29.2) }, g);
      const t = el('text', { x: pt(136, a + 15).split(' ')[0], y: pt(136, a + 15).split(' ')[1] }, g);
      t.textContent = name.slice(0, 3);
      return g;
    });

    // Centre hub
    el('circle', { class: 'hub', r: 88 }, wheel);
    const hubName = el('text', { class: 'hub-name', y: -22 }, wheel);
    const hubKn = el('text', { class: 'hub-kn', y: 8 }, wheel);
    const hubCount = el('text', { class: 'hub-count', y: 40 }, wheel);

    const label = document.getElementById('seasonLabel');
    const list = document.getElementById('seasonCrops');
    let current = -1;

    const select = m => {
      if (m === current) return;
      current = m;
      const key = seasonOf(m), s = SEASONS[key], crops = cropsIn(m);
      wheel.dataset.season = key;
      segs.forEach((g, i) => g.classList.toggle('active', i === m));
      hubName.textContent = s.name;
      hubKn.textContent = s.kn;
      hubCount.textContent = `${crops.length} crops`;
      label.innerHTML = `${MONTHS[m]} &middot; ${s.name} <span lang="kn">${s.kn}</span>`;
      list.innerHTML = crops.map(c =>
        `<li><i class="fa-solid ${c.icon}" aria-hidden="true"></i><span>${c.en}<small lang="kn">${c.kn}</small></span></li>`
      ).join('');
    };

    const monthFrom = e => { const g = e.target.closest('.wm'); return g ? Number(g.dataset.m) : null; };
    ['pointerover', 'click', 'focusin'].forEach(type => wheel.addEventListener(type, e => {
      const m = monthFrom(e);
      if (m !== null) select(m);
    }));
    wheel.addEventListener('keydown', e => {
      const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (step === undefined || monthFrom(e) === null) return;
      e.preventDefault();
      segs[(current + step + 12) % 12].focus();
    });

    select(thisMonth);
  }

  /* ---------- WhatsApp community preview: this month's crops ---------- */
  const waPreview = document.getElementById('waPreview');
  if (waPreview) {
    const fresh = cropsIn(thisMonth).slice(0, 5).map(c => `<li>${c.en}</li>`).join('');
    waPreview.innerHTML = `<p><strong>Fresh this week from Hulikadu</strong></p><ul>${fresh}</ul>` +
      `<p>Reply with what you need and we will confirm rates.</p><time>${MONTHS[thisMonth]}</time>`;
  }

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
