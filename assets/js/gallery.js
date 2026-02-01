(function () {
  const VERSION = "2026020121";
  const DATA_URL = "assets/data/posts.json?v=" + VERSION;

  // 3D gallery elements
  const stage = document.getElementById("galleryStage");
  const label = document.getElementById("galleryLabel");
  const btnPrev = document.getElementById("galleryPrev");
  const btnNext = document.getElementById("galleryNext");
  const btnToggle = document.getElementById("galleryToggle");
  const btnShuffle = document.getElementById("galleryShuffle");

  if (!stage) return;

  // Lightbox elements (reuse existing)
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightboxImg");
  const lbCap = document.getElementById("lightboxCap");
  const lbClose = document.getElementById("closeLightbox");
  // Preload cache (biar zoom langsung tajam)
  const preloadCache = new Map();
  function preloadImage(src) {
    const s = (src || "").toString().trim();
    if (!s || preloadCache.has(s)) return;
    const img = new Image();
    // Hint: decode asynchronously so it doesn't block UI
    img.decoding = "async";
    img.loading = "eager";
    img.src = s;
    preloadCache.set(s, img);
  }
  function preloadAround(centerIdx, radius = 2) {
    const n = slides.length;
    if (!n) return;
    for (let d = -radius; d <= radius; d++) {
      const i = mod(centerIdx + d, n);
      const src = slides[i] && slides[i].image;
      if (src) preloadImage(src);
    }
  }


  function safeText(v) {
    return (v == null ? "" : String(v)).trim();
  }

  function normalizeType(p) {
    return safeText(p.type).toLowerCase();
  }

  function normalizeDate(p) {
    const d = safeText(p.date);
    const t = Date.parse(d);
    return Number.isFinite(t) ? t : 0;
  }

  function sortByDateDesc(a, b) {
    return normalizeDate(b) - normalizeDate(a);
  }

  function openLightbox(src, title) {
    if (!lb || !lbImg) return;
    preloadImage(src);
    lbImg.src = src;
    lbImg.alt = title || "";
    if (lbCap) lbCap.textContent = title || "";
    lb.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lb) return;
    lb.classList.add("hidden");
    document.body.style.overflow = "";
  }

  // helper mod (loop)
  function mod(n, m) {
    return ((n % m) + m) % m;
  }

  let slides = [];
  let cards = [];
  let index = 0;

  function buildCards() {
    stage.innerHTML = "";
    cards = slides.map((s, idx) => {
      const el = document.createElement("div");
      el.className = "rg-card rg-off";
      el.dataset.idx = String(idx);

      const img = document.createElement("div");
      img.className = "rg-img";
      // background image + overlay gradient
      img.style.backgroundImage = `linear-gradient(180deg, rgba(2,6,23,.20), rgba(2,6,23,.60)), url('${s.image}')`;

      const badge = document.createElement("span");
      badge.className = "rg-badge";
      badge.innerHTML = `<span class="rg-dot"></span>${safeText(s.badge) || "DOKUMENTASI"}`;

      const title = document.createElement("span");
      title.className = "rg-title";
      title.textContent = safeText(s.title) || "Dokumentasi";

      const meta = document.createElement("div");
      meta.className = "rg-meta";
      const zoom = document.createElement("button");
      zoom.className = "rg-zoom";
      zoom.type = "button";
      zoom.setAttribute("aria-label", "Perbesar foto");
      zoom.textContent = "🔍";
      zoom.addEventListener("click", (e) => {
        e.stopPropagation();
        openLightbox(s.image, s.title);
      });

      meta.append(badge, title, zoom);

      img.appendChild(meta);
      el.appendChild(img);

      el.addEventListener("click", () => {
        if (idx !== index) {
          index = idx;
          render();
        } else {
          // default: open the post page
          if (s.url) {
            window.location.href = s.url;
          } else {
            openLightbox(s.image, s.title);
          }
        }
      });

      stage.appendChild(el);
      return el;
    });
  }

  function applySlot(i, cls) {
    if (!cards[i]) return;
    cards[i].className = "rg-card " + cls;
  }

  function render() {
    const n = cards.length;
    if (!n) return;

    // reset
    cards.forEach((c) => (c.className = "rg-card rg-off"));

    // slot mapping: 2 kiri + center + 2 kanan (fallback kalau jumlah sedikit)
    if (n === 1) {
      applySlot(0, "rg-center");
    } else if (n === 2) {
      applySlot(mod(index, n), "rg-center");
      applySlot(mod(index + 1, n), "rg-right1");
    } else if (n === 3) {
      applySlot(mod(index - 1, n), "rg-left1");
      applySlot(mod(index, n), "rg-center");
      applySlot(mod(index + 1, n), "rg-right1");
    } else if (n === 4) {
      applySlot(mod(index - 1, n), "rg-left1");
      applySlot(mod(index, n), "rg-center");
      applySlot(mod(index + 1, n), "rg-right1");
      applySlot(mod(index + 2, n), "rg-right2");
    } else {
      applySlot(mod(index - 2, n), "rg-left2");
      applySlot(mod(index - 1, n), "rg-left1");
      applySlot(mod(index, n), "rg-center");
      applySlot(mod(index + 1, n), "rg-right1");
      applySlot(mod(index + 2, n), "rg-right2");
    }

    if (label) label.textContent = `Slide ${index + 1} / ${n}`;

    // Preload active + neighbors so lightbox opens crisp
    preloadAround(index, 2);
  }

  function goPrev() {
    const n = cards.length;
    if (!n) return;
    index = mod(index - 1, n);
    render();
  }
  function goNext() {
    const n = cards.length;
    if (!n) return;
    index = mod(index + 1, n);
    render();
  }

  // autoplay
  let autoplay = true;
  let timer = null;

  function startTimer() {
    stopTimer();
    timer = window.setInterval(() => {
      if (!autoplay) return;
      // on mobile (<=768px) autoplay off by default to avoid "melawan swipe"
      if (window.matchMedia && window.matchMedia("(max-width: 768px)").matches) return;
      goNext();
    }, 4200);
  }
  function stopTimer() {
    if (timer) window.clearInterval(timer);
    timer = null;
  }

  function toggleAutoplay() {
    autoplay = !autoplay;
    if (btnToggle) btnToggle.textContent = `Autoplay: ${autoplay ? "ON" : "OFF"}`;
  }

  function shuffleSlides() {
    // Fisher–Yates
    for (let i = slides.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [slides[i], slides[j]] = [slides[j], slides[i]];
    }
    index = 0;
    buildCards();
    render();
  }

  async function init() {
    try {
      const res = await fetch(DATA_URL, { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal memuat posts.json: " + res.status);
      const data = await res.json();
      const posts = Array.isArray(data) ? data : (data && Array.isArray(data.posts) ? data.posts : []);

      const withImg = posts.filter((p) => p && p.image);

      // Prefer latest berita+artikel, unique by image; cap 14 so it stays snappy
      const berita = withImg.filter((p) => normalizeType(p) === "berita").sort(sortByDateDesc).slice(0, 24);
      const artikel = withImg.filter((p) => normalizeType(p) === "artikel").sort(sortByDateDesc).slice(0, 24);

      const seen = new Set();
      const merged = [];
      [...berita, ...artikel].forEach((p) => {
        const key = safeText(p.image) || safeText(p.url) || safeText(p.slug);
        if (!key || seen.has(key)) return;
        seen.add(key);
        merged.push(p);
      });

      // fallback: kalau tidak ada berita/artikel bergambar, ambil apapun yang bergambar
      const base = merged.length ? merged : withImg.sort(sortByDateDesc);

      slides = base.slice(0, 14).map((p) => ({
        title: safeText(p.title) || "Dokumentasi",
        image: safeText(p.image),
        url: safeText(p.url) || (safeText(p.type) ? (safeText(p.type).toLowerCase()+"/"+safeText(p.slug)+".html") : ""),
        badge:
          (safeText(p.category) || safeText(p.type) || "Dokumentasi")
            .toUpperCase()
            .replace(/[_-]+/g, " ")
            .slice(0, 16),
      })).filter(s => s.image);

      if (!slides.length) {
        if (label) label.textContent = "Tidak ada gambar";
        return;
      }

      buildCards();
      render();
      preloadAround(index, 2);
      startTimer();
    } catch (err) {
      console.error(err);
      if (label) label.textContent = "Gagal memuat galeri";
    }
  }

  // events
  if (btnPrev) btnPrev.addEventListener("click", goPrev);
  if (btnNext) btnNext.addEventListener("click", goNext);
  if (btnToggle) btnToggle.addEventListener("click", toggleAutoplay);
  if (btnShuffle) btnShuffle.addEventListener("click", shuffleSlides);

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") goPrev();
    if (e.key === "ArrowRight") goNext();
    if (e.key === "Escape") closeLightbox();
  });

  // Lightbox events
  if (lbClose) lbClose.addEventListener("click", closeLightbox);
  if (lb) {
    lb.addEventListener("click", (e) => {
      if (e.target === lb) closeLightbox();
    });
  }

  // keep timer stable when tab hidden
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopTimer();
    else startTimer();
  });

  init();
})();