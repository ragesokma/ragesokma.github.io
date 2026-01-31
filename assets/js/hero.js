/**
 * RAGE SOKMA V2 — HERO AUTO (Homepage) — v18
 * Source: assets/data/posts.json
 * HERO rule (as requested):
 *   - include ALL berita
 *   - plus artikel that are marked popular
 * Guarantee:
 *   - title/link/background are always rendered from the SAME post object
 *   - no leftover template background-image can leak into other slides
 */
(function () {
  const slider = document.getElementById('heroSlider');

  // main.js will wait this Promise before initializing dots/autoplay
  let heroResolve;
  window.__heroReady = new Promise((r) => (heroResolve = r));

  if (!slider) return;

  // Keep the first slide visible instantly (so no blank background on load)
  const slides = Array.from(slider.querySelectorAll('.hero-slide'));
  if (slides.length) {
    slides.forEach((s, i) => {
      const isActive = i === 0;
      s.style.opacity = isActive ? '1' : '0';
      s.style.pointerEvents = isActive ? 'auto' : 'none';
      s.style.display = '';
      s.classList.toggle('is-active', isActive);
      s.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    });
  }

  const normDate = (p) => String(p?.date || '0000-00-00');
  const pickLabel = (p) => {
    const raw =
      p?.category ||
      p?.kategori ||
      p?.label ||
      (Array.isArray(p?.categories) ? p.categories[0] : '') ||
      (Array.isArray(p?.tags) ? p.tags[0] : '');
    return raw ? String(raw) : '';
  };

  const pickUrl = (p) => {
    if (p?.url || p?.href || p?.link) return p.url || p.href || p.link;
    const type = String(p?.type || '').toLowerCase().trim();
    if (p?.slug) {
      if (type === 'artikel') return `artikel/${p.slug}.html`;
      if (type === 'berita') return `berita/${p.slug}.html`;
      return `${p.slug}.html`;
    }
    return '#';
  };

  async function run() {
    let data;
    try {
      const res = await fetch('assets/data/posts.json', { cache: 'no-store' });
      data = await res.json();
    } catch (e) {
      console.warn('[hero] posts.json not found/invalid', e);
      heroResolve?.();
      return;
    }

    const posts = Array.isArray(data) ? data : (data.posts || []);
    // Include ALL content types (berita + artikel, etc.) as long as it has an image
    
const isBerita = (p) => String(p?.type || '').toLowerCase().trim() === 'berita';
const isPopular = (p) => p?.popular === true || p?.is_popular === true || p?.featured === true;

// HERO rule (as requested):
// - Include ALL berita
// - Plus artikel that are marked popular
// - If an item has no image, use a safe placeholder (so title and image never drift)
const picked = posts
  .filter((p) => isBerita(p) || isPopular(p))
  .map((p) => ({
    ...p,
    image: p?.image ? String(p.image) : 'assets/images/placeholder.jpg'
  }))
  .sort((a, b) => normDate(b).localeCompare(normDate(a)));

    if (!picked.length) {
      heroResolve?.();
      return;
    }

    // Rebuild slides from scratch to guarantee NO title↔image drift
    // (Old template content/background can never leak through.)
    const existing = Array.from(slider.querySelectorAll('.hero-slide'));
    const template = existing[0];
    if (!template) {
      heroResolve?.();
      return;
    }

    // Capture a clean template clone, then wipe the slider
    const base = template.cloneNode(true);
    slider.innerHTML = '';

    const frag = document.createDocumentFragment();
    const useCount = picked.length;
    for (let i = 0; i < useCount; i++) {
      const p = picked[i];
      const s = base.cloneNode(true);

      // Base visibility/interaction
      const isActive = i === 0;
      s.classList.toggle('is-active', isActive);
      s.style.opacity = isActive ? '1' : '0';
      s.style.pointerEvents = isActive ? 'auto' : 'none';
      s.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      // Clear any stale bg (we always re-apply)
      s.style.backgroundImage = '';
      s.removeAttribute('data-bg');

      // Background image
      const imgUrl = String(p.image || 'assets/images/placeholder.jpg');
      s.dataset.bg = imgUrl;
      const bgLayer = s.querySelector('.hero-bg');
      if (bgLayer) {
        // ensure bg layer actually covers the slide (in case CSS is missing)
        bgLayer.classList.add('absolute','inset-0','bg-center','bg-cover');
        bgLayer.style.backgroundImage = isActive ? `url('${imgUrl}')` : '';
      }

      // Kicker / label
      const kicker = s.querySelector("[data-hero-anim='kicker'], [hero-kicker], .hero-kicker");
      if (kicker) {
        const type = String(p?.type || '').toLowerCase().trim();
        const fallback = type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Konten';
        kicker.textContent = pickLabel(p) || fallback;
      }

      // Title + link
      const title = s.querySelector("[data-hero-anim='title'], .hero-title");
      if (title) {
        const link = title.querySelector('a[data-hero-link]') || (title.matches('a') ? title : null);
        const url = pickUrl(p);
        if (link) {
          link.textContent = p.title || '';
          link.setAttribute('href', url);
          link.setAttribute('aria-label', `Buka: ${p.title || 'konten'}`);
        } else {
          title.textContent = p.title || '';
        }
      }

      // Excerpt
      const desc = s.querySelector("[data-hero-anim='desc'], .hero-desc");
      if (desc) desc.textContent = p.excerpt || p.summary || '';

      frag.appendChild(s);
    }
    slider.appendChild(frag);

    // Preload first slide image (best effort)
    try {
      const firstUrl = slider.querySelector('.hero-slide')?.dataset?.bg;
      if (firstUrl) {
        const head = document.head || document.getElementsByTagName('head')[0];
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = firstUrl;
        head.appendChild(link);
      }
    } catch (_) {}

    const finalSlides = Array.from(slider.querySelectorAll('.hero-slide'));

    // Ensure all slides are visible (they manage opacity themselves)
    finalSlides.forEach((s) => (s.style.display = ''));

    // Done
    heroResolve?.();
  }

  run().catch(() => heroResolve?.());
})();
