/**
 * RAGE SOKMA V2 — HERO AUTO (Homepage)
 * - Source: assets/data/posts.json
 * - Rule: take up to 6 latest posts where type === "berita" and image exists
 * - Updates existing #heroSlider slides (no DOM rebuild) to avoid flashes.
 */
(function () {
  const slider = document.getElementById('heroSlider');

  // main.js can initialize immediately using existing slides (prevents blank/flash)
  window.__heroReady = Promise.resolve();

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

  const normType = (p) => String(p?.type || '').toLowerCase().trim();
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

  async function run() {
    let data;
    try {
      const res = await fetch('assets/data/posts.json', { cache: 'no-store' });
      data = await res.json();
    } catch (e) {
      console.warn('[hero] posts.json not found/invalid', e);
      return;
    }

    const posts = Array.isArray(data) ? data : (data.posts || []);
    const picked = posts
      .filter((p) => normType(p) === 'berita' && p?.image)
      .sort((a, b) => normDate(b).localeCompare(normDate(a)));

    if (!picked.length) return;

    const slides = Array.from(slider.querySelectorAll('.hero-slide'));
    const maxSlides = 6;
    const useCount = Math.min(maxSlides, slides.length, picked.length);

    for (let i = 0; i < useCount; i++) {
      const p = picked[i];
      const s = slides[i];

      // Background image
      s.style.backgroundImage = `url('${p.image}')`;

      // Kicker / label
      const kicker = s.querySelector("[data-hero-anim='kicker'], [hero-kicker], .hero-kicker");
      if (kicker) kicker.textContent = pickLabel(p) || 'Berita';

      // Title
      const title = s.querySelector("[data-hero-anim='title'], .hero-title");
      if (title) title.textContent = p.title || '';

      // Excerpt
      const desc = s.querySelector("[data-hero-anim='desc'], .hero-desc");
      if (desc) desc.textContent = p.excerpt || p.summary || '';
    }

    // Hide extra slides (if template has more than we use)
    slides.forEach((s, idx) => {
      s.style.display = idx < useCount ? '' : 'none';
    });
  }

  run();
})();
