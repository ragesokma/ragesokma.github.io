/* eslint-disable no-unused-vars */
// Main JavaScript for RAGE SOKMA static site.
// - Hero slider (only if elements exist)
// - Mobile menu toggle


/** ------------------------------------------------------------
 * UX helpers: one-time Quick Action hint + active nav indicator
 * ------------------------------------------------------------ */
function setupQuickActionHint() {
  try {
    // Only on mobile widths
    const isMobile = window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
    if (!isMobile) return;

    const quickBtn = document.getElementById('quickBtn');
    if (!quickBtn) return;

    const key = 'rage_quick_hint_seen_v1';
    if (localStorage.getItem(key) === '1') return;

    // Build tooltip
    const tip = document.createElement('div');
    tip.className = 'ux-hint ux-hint--quick';
    tip.setAttribute('role', 'dialog');
    tip.setAttribute('aria-label', 'Petunjuk Aksi Cepat');

    tip.innerHTML = `
      <div class="ux-hint__inner">
        <div class="ux-hint__title">AKSI CEPAT</div>
        <div class="ux-hint__text">Akses Donasi, Relawan, Laporan &amp; lainnya di sini.</div>
        <button class="ux-hint__close" type="button" aria-label="Tutup">×</button>
      </div>
      <div class="ux-hint__arrow" aria-hidden="true"></div>
    `;

    document.body.appendChild(tip);

    const place = () => {
      const r = quickBtn.getBoundingClientRect();
      // Place below the header button, near left
      const top = Math.min(window.innerHeight - 120, r.bottom + 10);
      const left = Math.max(12, r.left - 6);
      tip.style.top = `${top}px`;
      tip.style.left = `${left}px`;
    };

    const dismiss = () => {
      if (!tip.isConnected) return;
      tip.classList.add('is-hiding');
      localStorage.setItem(key, '1');
      setTimeout(() => {
        tip.remove();
      }, 250);
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };

    tip.querySelector('.ux-hint__close')?.addEventListener('click', dismiss);

    // Dismiss when user uses quick action
    quickBtn.addEventListener('click', () => {
      localStorage.setItem(key, '1');
      // allow open, but hide tip immediately
      dismiss();
    }, { once: true });

    // Auto dismiss after a few seconds
    setTimeout(dismiss, 6000);

    // Position now and on changes
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
  } catch (e) {
    // fail silently
  }
}

function setupActiveNavIndicator() {
  try {
    const normalize = (href) => {
      if (!href) return '';
      // Strip protocol/domain if present
      try {
        const u = new URL(href, window.location.origin);
        let p = u.pathname || '';
        // Handle directory index
        if (p.endsWith('/')) p += 'index.html';
        return p.replace(/\/+$/, '');
      } catch {
        return href.split('#')[0].split('?')[0];
      }
    };

    const currentPath = normalize(window.location.pathname);

    // Collect candidate links in desktop + mobile
    const links = Array.from(document.querySelectorAll('a.nav-link, .mobile-panel a.nav-link, .mobile-panel a.mobile-sub, .quick-grid a.quick-item, footer a'));
    links.forEach((a) => {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

      const targetPath = normalize(href);

      // direct match
      const isMatch = targetPath === currentPath
        // also allow matching by filename when relative paths differ
        || (targetPath && currentPath.endsWith(targetPath.split('/').pop()));

      if (isMatch) {
        a.classList.add('is-active');
        a.setAttribute('aria-current', 'page');
      }
    });

    // Highlight parent buttons for sections (Tentang/Program) on desktop
    const parentTentang = document.querySelector('[data-dd-btn="tentang"], [data-nav-parent="tentang"]');
    const parentProgram = document.querySelector('[data-dd-btn="program"], [data-nav-parent="program"]');

    if (parentTentang && currentPath.includes('/tentang/')) parentTentang.classList.add('is-active');
    if (parentProgram && currentPath.includes('/program/')) parentProgram.classList.add('is-active');
  } catch (e) {
    // fail silently
  }
}

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
  const updateBodyLock = () => {
    const mm = document.getElementById('mobileMenu');
    const qm = document.getElementById('quickMenu');
    const anyOpen = (mm && !mm.classList.contains('hidden')) || (qm && !qm.classList.contains('hidden'));
    document.body.classList.toggle('no-scroll', anyOpen);
  };

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
      updateBodyLock();
    });

    
    // Close button (X) on mobile drawer
    const mobileCloseBtn = document.getElementById('mobileClose');
    if (mobileCloseBtn) {
      mobileCloseBtn.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        setExpanded(false);
        updateBodyLock();
      });
    }

    // Close when tapping outside the drawer panel (transparent right side)
    mobileMenu.addEventListener('click', (e) => {
      const panel = mobileMenu.querySelector('.mobile-panel');
      if (panel && !panel.contains(e.target)) {
        mobileMenu.classList.add('hidden');
        setExpanded(false);
        updateBodyLock();
      }
    });

    // Close mobile menu when clicking any link inside it
    mobileMenu.addEventListener('click', (e) => {
      const target = e.target;
      if (target && target.tagName === 'A') {
        mobileMenu.classList.add('hidden');
        setExpanded(false);
        updateBodyLock();
      }
    });
  }

// =========================
// Quick Actions (right drawer) toggle
// =========================
const quickBtn = document.getElementById('quickBtn');
const quickMenu = document.getElementById('quickMenu');

// Ensure quick drawer is attached to <body>
if (quickMenu && quickMenu.parentElement !== document.body) {
  document.body.appendChild(quickMenu);
}

if (quickBtn && quickMenu) {
  const setQuickExpanded = (isExpanded) => {
    quickBtn.setAttribute('aria-expanded', String(isExpanded));
  };

  setQuickExpanded(false);

  quickBtn.addEventListener('click', () => {
    // Close left drawer if open
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
      if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
    }

    const isHidden = quickMenu.classList.contains('hidden');
    quickMenu.classList.toggle('hidden', !isHidden);
    setQuickExpanded(isHidden);
    updateBodyLock();
  });

  const quickCloseBtn = document.getElementById('quickClose');
  if (quickCloseBtn) {
    quickCloseBtn.addEventListener('click', () => {
      quickMenu.classList.add('hidden');
      collapseQuickHelp();
      setQuickExpanded(false);
      updateBodyLock();
    });
  }

  // Close when tapping outside the panel (transparent left side)
  quickMenu.addEventListener('click', (e) => {
    const panel = quickMenu.querySelector('.mobile-panel');
    if (panel && !panel.contains(e.target)) {
      quickMenu.classList.add('hidden');
      collapseQuickHelp();
      setQuickExpanded(false);
      updateBodyLock();
    }
  });

  // Close quick menu when clicking any link inside it
  quickMenu.addEventListener('click', (e) => {
    const target = e.target;
    const a = target && target.closest ? target.closest('a') : null;
    if (a) {
      quickMenu.classList.add('hidden');
      collapseQuickHelp();
      setQuickExpanded(false);
      updateBodyLock();
    }
  });

// =========================
// Quick Help (inside Quick Actions drawer)
// =========================
const quickHelpToggle = document.getElementById('quickHelpToggle');
const quickHelpLinks = document.getElementById('quickHelpLinks');

const collapseQuickHelp = () => {
  if (quickHelpLinks) quickHelpLinks.classList.add('hidden');
  if (quickHelpToggle) quickHelpToggle.setAttribute('aria-expanded', 'false');
};

if (quickHelpToggle && quickHelpLinks) {
  // Ensure default collapsed
  collapseQuickHelp();

  quickHelpToggle.addEventListener('click', () => {
    const willOpen = quickHelpLinks.classList.contains('hidden');
    quickHelpLinks.classList.toggle('hidden', !willOpen);
    quickHelpToggle.setAttribute('aria-expanded', String(willOpen));
  });
}

}

  // =========================
  // Hero slider (enhanced): dots + synced text animations + safer pointer events
  // =========================
  const nextBtn = document.getElementById('nextSlide');
  const prevBtn = document.getElementById('prevSlide');
  const dotsWrap = document.getElementById('heroDots');
  const heroSlider = document.getElementById('heroSlider');

  const initHeroSlider = async () => {
    // Wait hero.js to populate slides (max ~1200ms)
    if (window.__heroReady) {
      try {
        await window.__heroReady;
      } catch (_) {}
    }

    const slides = Array.from(document.querySelectorAll('.hero-slide'));

  if (slides.length > 0 && nextBtn && prevBtn) {
    let currentSlide = 0;
    let timerId = null;

    // Build dots indicator (optional container)
    let dots = [];
    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      dots = slides.map((_, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'hero-dot';
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-label', `Slide ${i + 1}`);
        btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        btn.dataset.index = String(i);
        btn.addEventListener('click', () => {
          showSlide(i);
          if (timerId) {
            clearInterval(timerId);
            timerId = setInterval(nextSlide, 6000);
          }
        });
        dotsWrap.appendChild(btn);
        return btn;
      });
    }

    const syncDots = (index) => {
      if (!dots || dots.length === 0) return;
      dots.forEach((d, i) => d.setAttribute('aria-selected', i === index ? 'true' : 'false'));
    };

    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        const isActive = i === index;

        slide.classList.toggle('opacity-100', isActive);
        slide.classList.toggle('opacity-0', !isActive);

        // trigger synced animations via class
        slide.classList.toggle('is-active', isActive);

        // prevent hidden slides from capturing clicks/focus
        slide.style.pointerEvents = isActive ? 'auto' : 'none';
        slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      });

      currentSlide = index;
      syncDots(index);

      // Optional: keep an accent variable on wrapper (useful for future global accents)
      if (heroSlider) {
        const active = slides[index];
        const accent = getComputedStyle(active).getPropertyValue('--hero-accent').trim();
        if (accent) heroSlider.style.setProperty('--hero-accent', accent);
      }
    };

    const nextSlide = () => {
      const next = (currentSlide + 1) % slides.length;
      showSlide(next);
    };

    const prevSlide = () => {
      const prev = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(prev);
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

    // Keyboard: left/right arrows when focus is inside hero
    if (heroSlider) {
      heroSlider.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          nextSlide();
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          prevSlide();
        }
      });
      heroSlider.setAttribute('tabindex', '0');
    }

    // Init
    showSlide(0);
    timerId = setInterval(nextSlide, 6000);
  }
  }

  initHeroSlider();


  // =========================
  // Hero expressive: parallax blobs + smoother feel (desktop & mobile)
  // =========================
  {
    const hero = document.getElementById('beranda');
    if (hero) {
      const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!reduceMotion) {
        let rafId = null;
        let targetX = 0;
        let targetY = 0;
        const apply = () => {
          hero.style.setProperty('--hx', `${targetX}px`);
          hero.style.setProperty('--hy', `${targetY}px`);
          rafId = null;
        };
        const schedule = () => {
          if (rafId) return;
          rafId = requestAnimationFrame(apply);
        };

        // Pointer parallax (desktop)
        hero.addEventListener('mousemove', (e) => {
          const r = hero.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          const ny = (e.clientY - r.top) / r.height - 0.5;
          targetX = Math.round(nx * 18);
          targetY = Math.round(ny * 14);
          schedule();
        });

        hero.addEventListener('mouseleave', () => {
          targetX = 0;
          targetY = 0;
          schedule();
        });

        // Scroll parallax (mobile friendly)
        window.addEventListener('scroll', () => {
          const y = window.scrollY || 0;
          // small drift so terasa hidup, tapi aman
          targetY = Math.max(-18, Math.min(18, Math.round(-y * 0.02)));
          schedule();
        }, { passive: true });
      }
    }
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
      const animClasses = ['anim-wipe', 'anim-peek', 'anim-shine'];
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
      const btns = Array.from(grid.querySelectorAll('.impact-info[data-tooltip]'));
      if (btns.length === 0) return;

      const isDesktopHover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

      const DELAY_MS = 120;
      const OFFSET_X = 14;
      const OFFSET_Y = 14;

      let tip;
      let tipText;
      let tipClose;
      let activeBtn = null;
      let showTimer = null;
      let locked = false;
      let lastMouse = { x: 0, y: 0 };

      const ensureTip = () => {
        if (tip) return;
        tip = document.createElement('div');
        tip.className = 'impact-tooltip-floating';
        tip.innerHTML = `
          <div class="impact-tooltip-content" data-tip-content></div>
          <button class="impact-tooltip-close" type="button" aria-label="Tutup" data-tip-close>×</button>
        `;
        document.body.appendChild(tip);
        tipText = tip.querySelector('[data-tip-content]');
        tipClose = tip.querySelector('[data-tip-close]');
        tipClose.addEventListener('click', (e) => {
          e.stopPropagation();
          hideTip();
        });
      };

      const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

      const placeTipNear = (x, y) => {
        if (!tip) return;
        const pad = 10;
        const r = tip.getBoundingClientRect();
        let left = x;
        let top = y;

        left = clamp(left, pad, window.innerWidth - r.width - pad);
        top = clamp(top, pad, window.innerHeight - r.height - pad);

        tip.style.left = `${left}px`;
        tip.style.top = `${top}px`;
      };

      const placeTipForButton = (btn) => {
        const br = btn.getBoundingClientRect();
        // default: below the button, centered
        const x = br.left + br.width / 2;
        const y = br.bottom + 12;

        // after render, position with width known
        requestAnimationFrame(() => {
          const r = tip.getBoundingClientRect();
          let left = x - r.width / 2;
          let top = y;

          // if overflow bottom, flip to top
          if (top + r.height + 10 > window.innerHeight) {
            top = br.top - r.height - 12;
          }

          placeTipNear(left, top);
        });
      };

      const showTip = (btn, opts = {}) => {
        ensureTip();
        const text = (btn.getAttribute('data-tooltip') || '').trim();
        if (!text) return;

        activeBtn = btn;
        locked = !!opts.locked;

        tipText.textContent = text;
        tip.classList.add('show');
        tip.classList.toggle('is-locked', locked);

        if (locked) {
          placeTipForButton(btn);
        } else if (isDesktopHover) {
          placeTipNear(lastMouse.x + OFFSET_X, lastMouse.y + OFFSET_Y);
        } else {
          // fallback for non-hover devices: place near button
          placeTipForButton(btn);
        }
      };

      const hideTip = () => {
        if (showTimer) {
          clearTimeout(showTimer);
          showTimer = null;
        }
        if (!tip) return;
        tip.classList.remove('show');
        tip.classList.remove('is-locked');
        activeBtn = null;
        locked = false;
      };

      // Desktop: follow cursor + delay
      if (isDesktopHover) {
        btns.forEach((btn) => {
          btn.addEventListener('mouseenter', () => {
            if (showTimer) clearTimeout(showTimer);
            showTimer = setTimeout(() => showTip(btn, { locked: false }), DELAY_MS);
          });

          btn.addEventListener('mouseleave', () => {
            hideTip();
          });

          btn.addEventListener('mousemove', (e) => {
            lastMouse = { x: e.clientX, y: e.clientY };
            if (tip && tip.classList.contains('show') && !locked) {
              placeTipNear(e.clientX + OFFSET_X, e.clientY + OFFSET_Y);
            }
          });
        });

        // keep tooltip pinned during scroll/resize
        window.addEventListener('scroll', () => hideTip(), { passive: true });
        window.addEventListener('resize', () => hideTip(), { passive: true });
      } else {
        // Mobile: tap-lock + close + click outside
        btns.forEach((btn) => {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // toggle
            if (activeBtn === btn && tip && tip.classList.contains('show')) {
              hideTip();
              return;
            }
            showTip(btn, { locked: true });
          });
        });

        // tap outside closes
        document.addEventListener('click', () => hideTip());
        window.addEventListener('scroll', () => hideTip(), { passive: true });
        window.addEventListener('resize', () => hideTip(), { passive: true });
      }
    };

    const initPointerGlow = () => {
      // pointer-follow highlight (desktop + touch)
      cards.forEach((card) => {
        const setVars = (clientX, clientY) => {
          const r = card.getBoundingClientRect();
          const x = ((clientX - r.left) / r.width) * 100;
          const y = ((clientY - r.top) / r.height) * 100;
          const clamp = (v) => Math.max(0, Math.min(100, v));
          card.style.setProperty('--mx', `${clamp(x).toFixed(2)}%`);
          card.style.setProperty('--my', `${clamp(y).toFixed(2)}%`);
        };

        card.addEventListener('pointermove', (e) => {
          if (reduceMotion) return;
          setVars(e.clientX, e.clientY);
        });
        card.addEventListener('pointerleave', () => {
          card.style.removeProperty('--mx');
          card.style.removeProperty('--my');
        });
      });
    };

    const initStoryMode = (items) => {
      const timeline = document.querySelector('[data-impact-timeline]');
      if (!timeline || cards.length === 0) return;

      const DEFAULT_STORIES = {
        beneficiaries: 'Setiap angka mewakili manusia nyata yang terbantu.',
        activities: 'Gerakan kecil yang konsisten melahirkan dampak besar.',
        volunteers: 'Kolaborasi relawan adalah mesin kebaikan yang terus tumbuh.'
      };

      const ordered = (Array.isArray(items) && items.length) ? items : cards.map((c) => ({ key: c.dataset.impactKey }));
      const stories = ordered.map((it) => ({
        key: it.key,
        text: (it.story || DEFAULT_STORIES[it.key] || 'Dampak ini terus bertambah seiring berjalannya program.')
      }));

      const isCoarse = window.matchMedia && window.matchMedia('(max-width: 640px), (pointer: coarse)').matches;
      const intervalMs = reduceMotion ? 9999999 : (isCoarse ? 2800 : 4200);

      let idx = 0;
      let timer = null;
      let paused = false;

      const setActive = (i) => {
        idx = i;
        cards.forEach((c, j) => c.classList.toggle('is-active', j === i));
        const st = stories[i] ? stories[i].text : 'Dampak ini terus bertambah seiring berjalannya program.';
        timeline.textContent = st;
      };

      const start = () => {
        if (timer || reduceMotion) return;
        timer = window.setInterval(() => {
          if (paused) return;
          setActive((idx + 1) % cards.length);
        }, intervalMs);
      };

      const stop = () => {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      };

      // Init
      setActive(0);
      start();

      // Desktop: hover/focus to take over
      cards.forEach((c, i) => {
        const onEnter = () => {
          paused = true;
          setActive(i);
        };
        const onLeave = () => {
          paused = false;
        };
        c.addEventListener('mouseenter', onEnter);
        c.addEventListener('mouseleave', onLeave);
        c.addEventListener('focusin', onEnter);
        c.addEventListener('focusout', onLeave);

        // Mobile: tap to focus
        c.addEventListener('click', () => {
          setActive(i);
        });
      });

      // Pause rotation when user scrolls away (small perf)
      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) stop();
            else start();
          });
        }, { threshold: 0.15 });
        io.observe(timeline);
      }
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
      initPointerGlow();
      initCountOnView();
      initStoryMode(data && data.items ? data.items : null);
    });
  };

  
  // =========================
  // Mobile UX: Berita tabs (Berita / Populer)
  // =========================
  const tabBtns = Array.from(document.querySelectorAll('[data-berita-tab]'));
  const beritaPanel = document.getElementById('beritaPanel');
  const populerPanel = document.getElementById('populerPanel');

  const applyBeritaTab = (key) => {
    const isMobile = window.matchMedia('(max-width: 1023px)').matches; // < lg
    if (!beritaPanel || !populerPanel) return;

    if (!isMobile) {
      // Desktop: show both in grid layout
      beritaPanel.classList.remove('hidden');
      populerPanel.classList.remove('hidden');
      populerPanel.classList.add('lg:block');
      return;
    }

    if (key === 'popular') {
      beritaPanel.classList.add('hidden');
      populerPanel.classList.remove('hidden');
    } else {
      populerPanel.classList.add('hidden');
      beritaPanel.classList.remove('hidden');
    }

    tabBtns.forEach((b) => {
      const active = b.getAttribute('data-berita-tab') === key;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  };

  if (tabBtns.length && beritaPanel && populerPanel) {
    // Default: berita
    applyBeritaTab('news');

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => applyBeritaTab(btn.getAttribute('data-berita-tab')));
    });

    window.addEventListener('resize', () => {
      // keep current state; infer from active button
      const active = tabBtns.find((b) => b.classList.contains('is-active'))?.getAttribute('data-berita-tab') || 'news';
      applyBeritaTab(active);
    });
  }


  // First-time hint (one-time) for Quick Action (mobile)
  setupQuickActionHint();

  // Active menu indicator (desktop + mobile)
  setupActiveNavIndicator();

  initImpactStats();
};

// Run safely whether the script loads before or after DOMContentLoaded.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSite);
} else {
  initSite();
}
