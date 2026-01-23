(function () {
  const GRID_ID = "galleryGrid";
  const EMPTY_ID = "galleryEmpty";
  const DATA_URL = "assets/data/posts.json";

  const grid = document.getElementById(GRID_ID);
  if (!grid) return;
  const empty = document.getElementById(EMPTY_ID);

  // Lightbox elements
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightboxImg");
  const lbCap = document.getElementById("lightboxCap");
  const lbClose = document.getElementById("closeLightbox");

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

  function makeCard(post) {
    const title = safeText(post.title) || "Dokumentasi";
    const img = safeText(post.image);
    if (!img) return null;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className =
      "group relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600/40";
    btn.setAttribute("aria-label", "Buka foto: " + title);

    const figure = document.createElement("div");
    figure.className = "aspect-[4/3] bg-slate-100";

    const image = document.createElement("img");
    image.src = img;
    image.alt = title;
    image.loading = "lazy";
    image.className =
      "h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]";
    figure.appendChild(image);

    const overlay = document.createElement("div");
    overlay.className =
      "absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/55 via-black/20 to-transparent";
    const cap = document.createElement("div");
    cap.className = "text-white text-sm font-semibold leading-snug";
    cap.textContent = title;
    overlay.appendChild(cap);

    btn.appendChild(figure);
    btn.appendChild(overlay);

    btn.addEventListener("click", () => openLightbox(img, title));
    return btn;
  }

  async function init() {
    try {
      const res = await fetch(DATA_URL, { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal memuat posts.json: " + res.status);
      const data = await res.json();

      // This project uses Array posts.json, but also support {posts:[...]}
      const posts = Array.isArray(data)
        ? data
        : (data && Array.isArray(data.posts) ? data.posts : []);

      const withImg = posts.filter((p) => p && p.image);

      // Mix: latest berita + latest artikel, unique by image
      const berita = withImg
        .filter((p) => normalizeType(p) === "berita")
        .sort(sortByDateDesc)
        .slice(0, 24);

      const artikel = withImg
        .filter((p) => normalizeType(p) === "artikel")
        .sort(sortByDateDesc)
        .slice(0, 24);

      const seen = new Set();
      const merged = [];
      [...berita, ...artikel].forEach((p) => {
        const key = safeText(p.image) || safeText(p.url) || safeText(p.slug);
        if (!key || seen.has(key)) return;
        seen.add(key);
        merged.push(p);
      });

      grid.innerHTML = "";
      merged.forEach((p) => {
        const card = makeCard(p);
        if (card) grid.appendChild(card);
      });

      if (empty) {
        if (merged.length === 0) empty.classList.remove("hidden");
        else empty.classList.add("hidden");
      }
    } catch (err) {
      console.error(err);
      if (empty) empty.classList.remove("hidden");
    }
  }

  // Lightbox events
  if (lbClose) lbClose.addEventListener("click", closeLightbox);
  if (lb) {
    lb.addEventListener("click", (e) => {
      if (e.target === lb) closeLightbox();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  init();
})();