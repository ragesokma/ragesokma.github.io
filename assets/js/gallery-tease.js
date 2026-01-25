// Home page: pick 3 random items (berita/artikel) that have images, using the same data source as gallery.html
(function () {
  const grid = document.getElementById("galleryTeaseGrid");
  if (!grid) return;

  const DATA_URL = "assets/data/posts.json";

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function safeText(s) {
    return (s ?? "").toString().trim();
  }

  function prettyType(t) {
    t = safeText(t).toLowerCase();
    if (t === "berita") return "Berita";
    if (t === "artikel") return "Artikel";
    return "Update";
  }

  function makeCard(item, idx) {
    const title = safeText(item.title) || "Dokumentasi";
    const img = safeText(item.image);
    const href = safeText(item.url) || "gallery.html";

    const a = document.createElement("a");
    a.className = "gallery-tease-card";
    a.href = href;
    a.setAttribute("aria-label", `Buka ${prettyType(item.type)}: ${title}`);

    const image = document.createElement("img");
    image.alt = title;
    image.decoding = "async";
    image.loading = idx === 0 ? "eager" : "lazy";
    image.fetchPriority = idx === 0 ? "high" : "auto";
    image.src = img;

    // Reserve space to reduce CLS (ratio roughly like banner)
    image.width = 1920;
    image.height = 800;

    const overlay = document.createElement("div");
    overlay.className = "gallery-tease-overlay";

    const badge = document.createElement("span");
    badge.className = "gallery-tease-badge";
    badge.textContent = prettyType(item.type);

    const t = document.createElement("span");
    t.className = "gallery-tease-title";
    t.textContent = title;

    overlay.appendChild(badge);
    overlay.appendChild(t);

    a.appendChild(image);
    a.appendChild(overlay);
    return a;
  }

  fetch(DATA_URL, { cache: "force-cache" })
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Failed to load posts"))))
    .then((items) => {
      const list = Array.isArray(items) ? items : [];
      const withImages = list.filter((x) => safeText(x && x.image));
      if (!withImages.length) return;

      const picked = shuffle(withImages.slice()).slice(0, 3);

      // Clear existing
      grid.innerHTML = "";
      picked.forEach((item, idx) => grid.appendChild(makeCard(item, idx)));
    })
    .catch(() => {
      // If data fails to load, keep grid empty (no broken UI).
      grid.innerHTML = "";
    });
})();
