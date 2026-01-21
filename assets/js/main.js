/* eslint-disable no-unused-vars */
// Main JavaScript for RAGE SOKMA static site.
// - Hero slider (only if elements exist)
// - Mobile menu toggle

const initSite = () => {
  // =========================
  // Sticky header: glass + shrink on scroll
  // =========================
  const header = document.getElementById('siteHeader');
  if (header) {
    const applyHeaderState = () => {
      const y = window.scrollY || 0;
      const isTop = y < 8;
      const isShrink = y > 24;

      header.classList.toggle('is-top', isTop);
      header.classList.toggle('is-scrolled', !isTop);
      header.classList.toggle('is-shrink', isShrink);
    };

    // Init + listeners (passive for performance)
    applyHeaderState();
    window.addEventListener('scroll', applyHeaderState, { passive: true });
  }

  // =========================
  // Active nav indicator
  // =========================
  const normalize = (p) => (p || '').replace(/\/+/g, '/');
  const path = normalize(window.location.pathname);
  const current = path.endsWith('/') ? path + 'index.html' : path;
  const currentFile = current.split('/').filter(Boolean).pop() || 'index.html';

  const navLinks = Array.from(document.querySelectorAll('a[data-nav]'));
  const markActive = (el) => {
    el.classList.add('active');
  };

  // Exact match by filename (works for relative links)
  for (const a of navLinks) {
    const href = a.getAttribute('href') || '';
    const hrefFile = href.split('/').filter(Boolean).pop();
    if (hrefFile && hrefFile === currentFile) {
      markActive(a);
    }
  }

  // If we're inside /tentang/ or /program/, highlight dropdown parent
  const parentTentang = document.querySelector('[data-nav-parent="tentang"]');
  const parentProgram = document.querySelector('[data-nav-parent="program"]');
  if (parentTentang && /\/tentang\//.test(path)) parentTentang.classList.add('active');
  if (parentProgram && (/\/program\//.test(path) || /\/program\.html$/.test(path))) parentProgram.classList.add('active');

  // =========================
  // Mobile menu toggle
  // =========================
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  // Ensure mobile drawer is attached to <body> so `position: fixed` works even when header uses transforms
  if (mobileMenu && mobileMenu.parentElement !== document.body) {
    document.body.appendChild(mobileMenu);
  }

  if (menuBtn && mobileMenu) {
    const setExpanded = (isExpanded) => {
      menuBtn.setAttribute('aria-expanded', String(isExpanded));
    };

    setExpanded(false);

    menuBtn.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden', !isHidden);
      setExpanded(isHidden);
    });

    
    // Close button (X) on mobile drawer
    const mobileCloseBtn = document.getElementById('mobileClose');
    if (mobileCloseBtn) {
      mobileCloseBtn.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        setExpanded(false);
      });
    }

    // Close when tapping outside the drawer panel (transparent right side)
    mobileMenu.addEventListener('click', (e) => {
      const panel = mobileMenu.querySelector('.mobile-panel');
      if (panel && !panel.contains(e.target)) {
        mobileMenu.classList.add('hidden');
        setExpanded(false);
      }
    });

    // Close mobile menu when clicking any link inside it
    mobileMenu.addEventListener('click', (e) => {
      const target = e.target;
      if (target && target.tagName === 'A') {
        mobileMenu.classList.add('hidden');
        setExpanded(false);
      }
    });
  }

  // =========================
  // Hero slider
  // =========================
  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const nextBtn = document.getElementById('nextSlide');
  const prevBtn = document.getElementById('prevSlide');

  if (slides.length > 0 && nextBtn && prevBtn) {
    let currentSlide = 0;
    let timerId = null;

    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        slide.classList.toggle('opacity-100', i === index);
        slide.classList.toggle('opacity-0', i !== index);
      });
    };

    const nextSlide = () => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    };

    const prevSlide = () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
    };

    nextBtn.addEventListener('click', () => {
      nextSlide();
      if (timerId) {
        clearInterval(timerId);
        timerId = setInterval(nextSlide, 6000);
      }
    });

    prevBtn.addEventListener('click', () => {
      prevSlide();
      if (timerId) {
        clearInterval(timerId);
        timerId = setInterval(nextSlide, 6000);
      }
    });

    // Init
    showSlide(currentSlide);
    timerId = setInterval(nextSlide, 6000);
  }

  // =========================
  // Program badge (index): judul bergantian + jumlah program + animasi teks badge
  // =========================
  const programBadge = document.getElementById('programBadge');
  if (programBadge) {
    const badgeTextEl = programBadge.querySelector('.badge-text') || programBadge;
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const cards = Array.from(document.querySelectorAll('[data-program-card]'));
    const count = cards.length;

    if (count === 0) {
      programBadge.style.display = 'none';
    } else {
      // Ambil judul program dari setiap card (prioritas <h3>)
      const titles = cards
        .map((card) => {
          const h3 = card.querySelector('h3');
          const t = (h3 && h3.textContent) ? h3.textContent : (card.dataset.title || '');
          return String(t || '').trim().replace(/\s+/g, ' ');
        })
        .filter(Boolean);

      // Animasi bergantian: Wipe -> Peek In -> Random Bars
      const animClasses = ['anim-wipe', 'anim-peek', 'anim-bars'];
      let animIndex = 0;

      const applyAnim = () => {
        if (reduceMotion) return;
        // reset anim agar selalu “main” saat teks berubah
        badgeTextEl.classList.remove(...animClasses);
        // force reflow
        void badgeTextEl.offsetWidth;
        badgeTextEl.classList.add(animClasses[animIndex]);
        animIndex = (animIndex + 1) % animClasses.length;
      };

      if (titles.length === 0) {
        // tanpa angka
        badgeTextEl.textContent = `PROGRAM`;
        applyAnim();
      } else {
        let i = 0;

        const render = () => {
          const title = (titles[i] || 'PROGRAM').toUpperCase();
          // tanpa angka
          badgeTextEl.textContent = `${title}`;
          applyAnim();
        };

        render();
        if (!reduceMotion) {
          window.setInterval(() => {
            i = (i + 1) % titles.length;
            render();
          }, 2400);
        }
      }
    }
  }

  // =========================
  // Impact Stats (index): data-driven + animasi + tooltip + mobile emphasis
  // =========================
  const initImpactStats = () => {
    const grid = document.querySelector('[data-impact-grid]');
    if (!grid) return;

    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ICONS = {
      users: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M16 11c1.66 0 3-1.57 3-3.5S17.66 4 16 4s-3 1.57-3 3.5S14.34 11 16 11ZM8 11c1.66 0 3-1.57 3-3.5S9.66 4 8 4 5 5.57 5 7.5 6.34 11 8 11Zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13Zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.95 1.97 3.45V19h6v-2.5C23 14.17 18.33 13 16 13Z"/>
        </svg>
      `,
      calendar: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 16H5V10h14v10Zm0-12H5V6h14v2Z"/>
        </svg>
      `,
      volunteer: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1.01 4.22 2.53C11.54 5.01 13.21 4 14.95 4 17.5 4 19.5 6 19.5 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      `
    };

    const cards = Array.from(grid.querySelectorAll('.impact-card[data-impact-key]'));
    const byKey = new Map(cards.map((c) => [c.dataset.impactKey, c]));

    const setCard = (card, item, periodFallback) => {
      if (!card || !item) return;

      const iconWrap = card.querySelector('.impact-icon');
      const titleEl = card.querySelector('.impact-title');
      const valueEl = card.querySelector('[data-impact-value]');
      const periodEl = card.querySelector('[data-impact-period]');
      const noteEl = card.querySelector('[data-impact-note]');
      const infoBtn = card.querySelector('.impact-info');

      const suffix = (item.suffix != null) ? String(item.suffix) : '';

      if (iconWrap) {
        const svg = ICONS[item.icon] || ICONS.users;
        iconWrap.innerHTML = svg;
      }
      if (titleEl && item.title) titleEl.textContent = item.title;
      if (noteEl && item.note) noteEl.textContent = item.note;

      if (periodEl) {
        const p = item.period || periodFallback || '';
        periodEl.textContent = p;
      }

      if (infoBtn) {
        infoBtn.setAttribute('data-tooltip', item.tooltip || '');
      }

      // Value: hydrate target number for count-up
      const n = Number(item.value);
      if (valueEl) {
        valueEl.setAttribute('data-target', String(Number.isFinite(n) ? n : 0));
        valueEl.setAttribute('data-suffix', suffix);
        // Initial render
        valueEl.innerHTML = `0<span class="impact-plus" aria-hidden="true">${suffix}</span>`;
      }
    };

    const safeFetchJSON = async (url) => {
      try {
        const res = await fetch(url, { cache: 'no-cache' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (e) {
        return null;
      }
    };

    const animateCount = (el, to, suffix) => {
      if (reduceMotion) {
        el.innerHTML = `${to}<span class="impact-plus" aria-hidden="true">${suffix || ''}</span>`;
        return;
      }
      const from = 0;
      const duration = 900 + Math.min(900, to * 6);
      const start = performance.now();

      const step = (t) => {
        const p = Math.min(1, (t - start) / duration);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - p, 3);
        const v = Math.round(from + (to - from) * eased);
        el.innerHTML = `${v}<span class="impact-plus" aria-hidden="true">${suffix || ''}</span>`;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const initTooltips = () => {
      // Click-to-toggle (mobile friendly), click outside to close
      const btns = Array.from(grid.querySelectorAll('.impact-info'));
      if (btns.length === 0) return;

      const closeAll = () => btns.forEach((b) => b.setAttribute('data-open', 'false'));

      btns.forEach((btn) => {
        btn.setAttribute('data-open', 'false');
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const isOpen = btn.getAttribute('data-open') === 'true';
          closeAll();
          btn.setAttribute('data-open', isOpen ? 'false' : 'true');
        });
      });

      document.addEventListener('click', () => closeAll());
      window.addEventListener('scroll', () => closeAll(), { passive: true });
    };

    const initEmphasisRotation = () => {
      // Recommended: mainly for mobile/coarse pointers
      const mq = window.matchMedia('(max-width: 640px), (pointer: coarse)');
      const isMobile = mq && mq.matches;
      if (!isMobile || reduceMotion) return;

      let i = 0;
      const setActive = (idx) => {
        cards.forEach((c, j) => c.classList.toggle('is-active', j === idx));
      };
      setActive(0);

      window.setInterval(() => {
        i = (i + 1) % cards.length;
        setActive(i);
      }, 3000);
    };

    const initCountOnView = () => {
      const valueEls = Array.from(grid.querySelectorAll('[data-impact-value][data-target]'));
      if (valueEls.length === 0) return;

      const runOnce = new WeakSet();
      const run = (el) => {
        if (runOnce.has(el)) return;
        runOnce.add(el);
        const to = Number(el.getAttribute('data-target') || 0);
        const suffix = String(el.getAttribute('data-suffix') || '');
        animateCount(el, Number.isFinite(to) ? to : 0, suffix);
      };

      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) run(entry.target);
          });
        }, { threshold: 0.35 });
        valueEls.forEach((el) => io.observe(el));
      } else {
        // Fallback: animate immediately
        valueEls.forEach((el) => run(el));
      }
    };

    // 1) Hydrate from JSON
    safeFetchJSON('assets/data/impact.json').then((data) => {
      const periodFallback = data && data.period ? String(data.period) : '';
      if (data && Array.isArray(data.items)) {
        data.items.forEach((item) => {
          const card = byKey.get(item.key);
          setCard(card, item, periodFallback);
        });
      }

      // 2) Enhance UI behaviors
      initTooltips();
      initEmphasisRotation();
      initCountOnView();
    });
  };

  initImpactStats();
};

// Run safely whether the script loads before or after DOMContentLoaded.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSite);
} else {
  initSite();
}
