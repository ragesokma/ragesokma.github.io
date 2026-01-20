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
};

// Run safely whether the script loads before or after DOMContentLoaded.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSite);
} else {
  initSite();
}
