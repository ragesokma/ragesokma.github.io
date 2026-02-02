/**
 * Semi-otomatis konten (Berita/Artikel/Galeri)
 * - Sumber data: /assets/data/posts.json
 * - Fitur: filter kategori, badge kategori, default kategori per type, galeri otomatis
 */
(function () {
  const VERSION = "2026020212";
  const DATA_URL = "assets/data/posts.json?v=" + VERSION;
  const FALLBACK_IMG = "assets/images/placeholder.jpg";

  const DEFAULT_CATEGORY_BY_TYPE = {
    berita: "Sosial Keagamaan",
    artikel: "Sosial Keagamaan",
    program: "Sosial Keagamaan",
    transparansi: "Sosial Keagamaan",
    relawan: "Sosial Keagamaan"
  };

  const CATEGORY_ORDER = ["Santunan Anak Yatim", "Peduli Dhu’afa", "Sosial Keagamaan"];

  function safeText(s) {
    return (s || "").toString();
  }

  function parseISODate(iso) {
    if (!iso) return null;
    const d = new Date(iso);
    return isNaN(d.getTime()) ? null : d;
  }

  function formatDateID(iso) {
    const d = parseISODate(iso);
    if (!d) return "";
    return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(d);
  }

  function normalizeCategory(post) {
    if (post.category && post.category.trim()) return post.category.trim();
    const t = (post.type || "").toLowerCase();
    return DEFAULT_CATEGORY_BY_TYPE[t] || "Sosial Keagamaan";
  }

  function getAllCategories(posts) {
    const set = new Set();
    posts.forEach(p => set.add(normalizeCategory(p)));
    // keep nice order but include any custom categories at end
    const ordered = [];
    CATEGORY_ORDER.forEach(c => { if (set.has(c)) ordered.push(c); set.delete(c); });
    Array.from(set).sort().forEach(c => ordered.push(c));
    return ordered;
  }

  function renderBadge(category) {
    const cat = safeText(category);
    const cls = "badge badge--" + cat.toLowerCase().replace(/\s+/g, "-");
    return `<span class="${cls}">${cat}</span>`;
  }

  function renderCard(post) {
    const cat = normalizeCategory(post);
    const img = safeText(post.image);
    const href = safeText(post.url);
    const title = safeText(post.title);
    const excerpt = safeText(post.excerpt);
    const date = formatDateID(post.date);

    return `
<article class="post-card">
  <a class="post-card__media" href="${href}">
    ${img ? `<img loading="lazy" decoding="async" alt="${title}" src="${img}" onerror="this.onerror=null;this.src=\'${FALLBACK_IMG}\';" />` : ``}
  </a>
  <div class="post-card__body">
    <div class="post-card__meta">
      ${renderBadge(cat)}
      ${date ? `<time class="post-card__date" datetime="${safeText(post.date)}">${date}</time>` : ``}
    </div>
    <h3 class="post-card__title"><a href="${href}">${title}</a></h3>
    <p class="post-card__excerpt">${excerpt}</p>
  </div>
</article>`.trim();
  }

  // Compact item khusus "Artikel Populer" (thumbnail kecil + teks)
  function renderPopularItem(post) {
    const cat = normalizeCategory(post);
    const img = safeText(post.image);
    const href = safeText(post.url);
    const title = safeText(post.title);
    const excerpt = safeText(post.excerpt);
    const date = formatDateID(post.date);

    return `
<article class="popular-item">
  <a class="popular-item__thumb" href="${href}" aria-label="Buka: ${title}">
    ${img ? `<img loading="lazy" decoding="async" alt="${title}" src="${img}" onerror="this.onerror=null;this.src=\'${FALLBACK_IMG}\';" />` : ``}
  </a>
  <div class="popular-item__body">
    <div class="popular-item__meta">
      ${renderBadge(cat)}
      ${date ? `<time class="popular-item__date" datetime="${safeText(post.date)}">${date}</time>` : ``}
    </div>
    <h3 class="popular-item__title"><a href="${href}">${title}</a></h3>
    <p class="popular-item__excerpt">${excerpt}</p>
  </div>
</article>`.trim();
  }

  function sortByDateDesc(a, b) {
    const da = parseISODate(a.date);
    const db = parseISODate(b.date);
    const ta = da ? da.getTime() : 0;
    const tb = db ? db.getTime() : 0;
    return tb - ta;
  }

  function sortPopularThenDateDesc(a, b) {
    // Soft-prioritize items manually marked as popular, but ALL artikel are treated as populer.
    const ap = a && a.popular === true ? 1 : 0;
    const bp = b && b.popular === true ? 1 : 0;
    if (ap !== bp) return bp - ap;
    return sortByDateDesc(a, b);
  }

  async function loadPosts() {
    try {
      const res = await fetch(DATA_URL, { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal memuat data konten");
      const posts = await res.json();
      return Array.isArray(posts) ? posts : [];
    } catch (e) {
      return [];
    }
  }

  // ===== Semua Berita page =====
  function mountSemuaBerita(posts) {
    const root = document.getElementById("postsApp");
    if (!root) return;

    // Semua post (diurutkan terbaru) + kategori dinormalisasi
    const all = [...posts]
      .map(p => ({ ...p, category: normalizeCategory(p) }))
      .sort(sortByDateDesc);

    const categories = getAllCategories(all);

    // UI: hanya filter kategori + grid 4 kolom
    root.innerHTML = `
      <div class="posts-toolbar">
        <div class="posts-toolbar__left">
          <label class="posts-label" for="categoryFilter">Filter Kategori</label>
          <select id="categoryFilter" class="posts-select">
            <option value="__all">Semua</option>
            ${categories.map(c => `<option value="${c}">${c}</option>`).join("")}
          </select>
        </div>
        <div class="posts-toolbar__right">
          <div class="posts-chips" aria-label="Filter cepat kategori">
            <button class="chip is-active" data-chip="__all" type="button">Semua</button>
            ${categories.map(c => `<button class="chip" data-chip="${c}" type="button">${c}</button>`).join("")}
          </div>
        </div>
      </div>

      <div class="posts-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" id="gridAll"></div>
    `;

    const gridA = document.getElementById("gridAll");

    function renderFiltered(category) {
      const cat = category === "__all" ? null : category;
      const filtered = cat ? all.filter(p => normalizeCategory(p) === cat) : all;

      gridA.innerHTML = filtered.map(renderCard).join("") || `<p class="posts-empty">Belum ada konten.</p>`;

      // chips active state
      document.querySelectorAll(".chip").forEach(btn => {
        btn.classList.toggle("is-active", btn.getAttribute("data-chip") === (category || "__all"));
      });
    }

    const select = document.getElementById("categoryFilter");
    select.addEventListener("change", () => renderFiltered(select.value));

    document.querySelectorAll(".chip").forEach(btn => {
      btn.addEventListener("click", () => {
        const v = btn.getAttribute("data-chip");
        select.value = v;
        renderFiltered(v);
      });
    });

    renderFiltered("__all");
  }

  // ===== Index page (semi-otomatis) =====
  function mountIndex(posts) {
    const root = document.getElementById("homeNewsGrid");
    if (!root) return;

    const beritaAll = posts.filter(p => (p.type || "").toLowerCase() === "berita").sort(sortByDateDesc);
    const artikelAll = posts.filter(p => (p.type || "").toLowerCase() === "artikel").sort(sortByDateDesc);

    // Berita Terkini: paginate (6 per halaman) agar bisa ditambahkan pagination seperti contoh.
    const pageSize = 6;
    let currentPage = 1;
    const totalPages = Math.max(1, Math.ceil(beritaAll.length / pageSize));

    // Artikel populer: SEMUA artikel otomatis masuk Populer.
    // Flag popular:true tetap dipakai sebagai prioritas urutan (bukan filter).
    const populerList = artikelAll.sort(sortPopularThenDateDesc);

    // Root (#homeNewsGrid) sudah grid lg:grid-cols-4.
    // Mobile: pakai tabs (Berita/Populer) dan tampil standar kebawah.
    root.innerHTML = `
      <div id="beritaPanel" class="lg:col-span-3 lg:block">
        <div class="posts-grid" id="homeNewsCards"></div>

        <nav class="posts-pagination" id="homeNewsPagination" aria-label="Navigasi halaman berita" data-single="${totalPages <= 1 ? '1' : '0'}">
          <button class="pg-btn" type="button" data-pg="prev" aria-label="Sebelumnya">&#8249;</button>
          <div class="pg-numbers" id="homeNewsPageNums" aria-label="Nomor halaman"></div>
          <button class="pg-btn" type="button" data-pg="next" aria-label="Berikutnya">&#8250;</button>
        </nav>
      </div>

      <aside id="populerPanel" class="hidden lg:block lg:col-span-1">
        <div class="popular-aside">
          <div class="posts-stack" id="homePopularScroll" role="region" aria-label="Daftar artikel populer">
            ${populerList.map(renderPopularItem).join("")}
          </div>
        </div>
      </aside>
    `.trim();

    const newsCards = document.getElementById('homeNewsCards');
    const pg = document.getElementById('homeNewsPagination');
    const pgNums = document.getElementById('homeNewsPageNums');

    function clampPage(p){
      return Math.min(totalPages, Math.max(1, p));
    }

    function renderPagination(){
      if (!pg || !pgNums) return;
      pgNums.innerHTML = Array.from({length: totalPages}).map((_, i) => {
        const n = i + 1;
        const active = n === currentPage ? ' is-active' : '';
        return `<button class="pg-num${active}" type="button" data-page="${n}" aria-label="Halaman ${n}">${n}</button>`;
      }).join('');

      const prev = pg.querySelector('[data-pg="prev"]');
      const next = pg.querySelector('[data-pg="next"]');
      if (prev) prev.disabled = currentPage <= 1;
      if (next) next.disabled = currentPage >= totalPages;
    }

    function renderNewsPage(){
      if (!newsCards) return;
      const start = (currentPage - 1) * pageSize;
      const slice = beritaAll.slice(start, start + pageSize);
      newsCards.innerHTML = slice.map(renderCard).join('') || `<p class="posts-empty">Belum ada berita.</p>`;
      renderPagination();
    }

    // pagination events
    if (pg){
      pg.addEventListener('click', (e) => {
        const t = e.target;
        if (!(t instanceof HTMLElement)) return;

        const go = t.getAttribute('data-pg');
        const pageAttr = t.getAttribute('data-page');

        if (go === 'prev') currentPage = clampPage(currentPage - 1);
        else if (go === 'next') currentPage = clampPage(currentPage + 1);
        else if (pageAttr) currentPage = clampPage(parseInt(pageAttr, 10) || 1);
        else return;

        renderNewsPage();
        // keep berita section centered in view when changing pages
        const section = document.getElementById('berita');
        if (section) section.scrollIntoView({behavior:'smooth', block:'start'});
      });
    }

    // initial
    renderNewsPage();

    // ===== Desktop: samakan tinggi populer dengan tinggi grid berita (2 baris), sisanya via scroll + panah =====
    const popularScroll = document.getElementById('homePopularScroll');
    const btnUp = null;
    const btnDown = null;
function syncPopularHeight() {
      // Scroll populer dinonaktifkan (menampilkan semua item tanpa batas tinggi)
      if (!popularScroll) return;
      popularScroll.style.maxHeight = "";
      popularScroll.style.overflow = "";
    }

    // Scroll controls removed for Artikel Populer (no internal scrolling)

    // ===== Mobile tabs behavior =====
    const tabWrap = document.querySelector('[data-berita-tab]') ? document.querySelectorAll('[data-berita-tab]') : [];
    const beritaPanel = document.getElementById('beritaPanel');
    const populerPanel = document.getElementById('populerPanel');

    function setTab(which) {
      tabWrap.forEach(btn => {
        const active = btn.getAttribute('data-berita-tab') === which;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      // Only affect mobile (tabs only exist on mobile anyway)
      if (which === 'popular') {
        if (beritaPanel) beritaPanel.classList.add('hidden');
        if (populerPanel) populerPanel.classList.remove('hidden');
      } else {
        if (beritaPanel) beritaPanel.classList.remove('hidden');
        if (populerPanel) populerPanel.classList.add('hidden');
      }
    }

    tabWrap.forEach(btn => {
      btn.addEventListener('click', () => {
        const which = btn.getAttribute('data-berita-tab');
        setTab(which);
      });
    });

    // default state
    setTab('news');
  }


  // ===== Gallery page =====
  function mountGallery(posts) {
    const galRoot = document.getElementById("galleryAutoGrid");
    if (!galRoot) return;

    const withImg = posts.filter(p => p.image).sort(sortByDateDesc);

    // combine: prioritize latest berita + SEMUA artikel (auto populer), but show more items
    const latestBerita = withImg.filter(p => (p.type || "").toLowerCase() === "berita").slice(0, 12);
    const popularArtikel = withImg.filter(p => (p.type || "").toLowerCase() === "artikel").slice(0, 12);

    // merge unique by url
    const map = new Map();
    [...latestBerita, ...popularArtikel].forEach(p => map.set(p.url, p));
    const merged = Array.from(map.values());

    galRoot.innerHTML = merged.map(p => {
      const title = safeText(p.title);
      const href = safeText(p.url);
      const img = safeText(p.image);
      const cat = normalizeCategory(p);
      return `
        <a class="gallery-card" href="${href}">
          <div class="gallery-card__img">
            <img loading="lazy" alt="${title}" src="${img}">
          </div>
          <div class="gallery-card__meta">
            ${renderBadge(cat)}
            <span class="gallery-card__title">${title}</span>
          </div>
        </a>
      `.trim();
    }).join("") || `<p class="posts-empty">Belum ada dokumentasi untuk ditampilkan.</p>`;
  }

  // Boot
  document.addEventListener("DOMContentLoaded", async () => {
    const posts = await loadPosts();
    if (!posts.length) return;

    mountSemuaBerita(posts);
    mountIndex(posts);
    mountGallery(posts);
  });
})();
