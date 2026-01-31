/**
 * RAGE SOKMA V2 — HERO AUTO (Homepage)
 * - Source: assets/data/posts.json
 * - Rule: include ALL posts (berita + artikel) that have an image
 * - Builds slides dynamically by cloning the template slide.
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
    const picked = posts
      .filter((p) => !!p?.image)
      .sort((a, b) => normDate(b).localeCompare(normDate(a)));

    if (!picked.length) {
      heroResolve?.();
      return;
    }

    // Build enough slides by cloning the first slide as a template
    const slides = Array.from(slider.querySelectorAll('.hero-slide'));
    const template = slides[0];
    if (!template) {
      heroResolve?.();
      return;
    }

    // Ensure number of slides equals picked length
    const need = picked.length;
    const current = slides.length;
    if (need > current) {
      const frag = document.createDocumentFragment();
      for (let i = current; i < need; i++) {
        const clone = template.cloneNode(true);
        clone.classList.remove('is-active');
        clone.style.opacity = '0';
        clone.style.pointerEvents = 'none';
        clone.setAttribute('aria-hidden', 'true');
        // Clear bg to allow lazy-apply via data-bg
        clone.style.backgroundImage = '';
        clone.removeAttribute('data-bg');
        frag.appendChild(clone);
      }
      slider.appendChild(frag);
    } else if (need < current) {
      // Keep at least 1 slide (template)
      for (let i = current - 1; i >= Math.max(need, 1); i--) {
        slides[i]?.remove();
      }
    }

    const finalSlides = Array.from(slider.querySelectorAll('.hero-slide'));
    const useCount = Math.min(finalSlides.length, picked.length);

    for (let i = 0; i < useCount; i++) {
      const p = picked[i];
      const s = finalSlides[i];

      // Background image (performance)
      // - store in data-bg so we can lazy-apply on slide activation
      // - render to .hero-bg (so hover zoom doesn't fight with slide translate)
      // - preload only the first slide to make initial paint fast
      const imgUrl = String(p.image);
      s.dataset.bg = imgUrl;

      const bgLayer = s.querySelector('.hero-bg');

      if (i === 0) {
        if (bgLayer) bgLayer.style.backgroundImage = `url('${imgUrl}')`;

        // Preload first slide image (best effort)
        try {
          const head = document.head || document.getElementsByTagName('head')[0];
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = imgUrl;
          head.appendChild(link);
        } catch (_) {}
      }

      // Kicker / label
      const kicker = s.querySelector("[data-hero-anim='kicker'], [hero-kicker], .hero-kicker");
      if (kicker) {
        // Show category/label if available; fallback to the type (Artikel/Berita)
        const type = String(p?.type || '').toLowerCase().trim();
        const fallback = type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Konten';
        kicker.textContent = pickLabel(p) || fallback;
      }

      // Title
      const title = s.querySelector("[data-hero-anim='title'], .hero-title");
      if (title) {
        // Prefer an inner link if present (index.html wraps titles in <a data-hero-link>)
        const link = title.querySelector('a[data-hero-link]') || (title.matches('a') ? title : null);
        const url = pickUrl(p);
        if (link) {
          link.textContent = p.title || '';
          link.setAttribute('href', url);
          link.setAttribute('aria-label', `Buka: ${p.title || 'berita'}`);
        } else {
          title.textContent = p.title || '';
        }
      }

      // Excerpt
      const desc = s.querySelector("[data-hero-anim='desc'], .hero-desc");
      if (desc) desc.textContent = p.excerpt || p.summary || '';
    }

    // Make sure all used slides are visible
    finalSlides.forEach((s, idx) => {
      s.style.display = idx < useCount ? '' : 'none';
    });

    // Done
    heroResolve?.();
  }

  run().catch(() => heroResolve?.());
})();
