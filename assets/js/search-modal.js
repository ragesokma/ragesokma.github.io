/* RAGE SOKMA — Mobile Search Modal (Berita/Artikel)
   Static-friendly (GitHub Pages). Uses /assets/data/search-index.json.
*/

(function () {
  // Bind to both mobile + desktop triggers
  const SEARCH_BTN_IDS = ['searchBtn', 'searchBtnDesktop'];

  function getSiteBase() {
    const me = Array.from(document.scripts || []).find(s => (s.src || '').match(/\/assets\/js\/search-modal\.js(\?|$)/));
    if (!me || !me.src) return '';
    const src = me.src;
    const i = src.indexOf('/assets/js/');
    if (i === -1) return '';
    return src.slice(0, i + 1); // include trailing slash
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function ensureModal() {
    if (document.getElementById('searchModal')) return;

    const modal = document.createElement('div');
    modal.id = 'searchModal';
    modal.className = 'rs-search-modal hidden';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'searchModalTitle');

    modal.innerHTML = `
      <div class="rs-search-backdrop" data-search-close></div>
      <div class="rs-search-card" role="document">
        <div class="rs-search-head">
          <div>
            <div class="rs-search-eyebrow">Pencarian</div>
            <h3 id="searchModalTitle" class="rs-search-title">Cari berita & artikel</h3>
          </div>
          <button class="rs-search-close" type="button" aria-label="Tutup" data-search-close>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="rs-search-inputWrap">
          <span class="rs-search-ico" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
          </span>
          <input id="searchInput" class="rs-search-input" type="search" placeholder="Ketik kata kunci…" autocomplete="off" />
        </div>

        <div class="rs-search-meta" id="searchMeta">Ketik untuk mulai mencari.</div>
        <div class="rs-search-results" id="searchResults" aria-live="polite"></div>

        <div class="rs-search-foot">
          <span class="rs-search-hint">Tips: coba “ramadhan”, “dhuafa”, “santunan”.</span>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  let indexCache = null;

  async function loadIndex() {
    if (indexCache) return indexCache;
    const base = getSiteBase();
    const url = `${base}assets/data/search-index.json`;
    const res = await fetch(url, { cache: 'force-cache' });
    if (!res.ok) throw new Error('Gagal memuat data pencarian');
    indexCache = await res.json();
    return indexCache;
  }

  function openModal() {
    ensureModal();
    const modal = document.getElementById('searchModal');
    modal.classList.remove('hidden');
    document.documentElement.classList.add('rs-modal-open');

    const input = document.getElementById('searchInput');
    const results = document.getElementById('searchResults');
    const meta = document.getElementById('searchMeta');

    results.innerHTML = '';
    meta.textContent = 'Memuat…';
    input.value = '';

    // focus
    setTimeout(() => input.focus(), 50);

    loadIndex()
      .then((data) => {
        meta.textContent = `Siap. Total ${data.length} konten.`;
      })
      .catch(() => {
        meta.textContent = 'Data pencarian belum tersedia.';
      });
  }

  function closeModal() {
    const modal = document.getElementById('searchModal');
    if (!modal) return;
    modal.classList.add('hidden');
    document.documentElement.classList.remove('rs-modal-open');
  }

  function renderResults(items, q) {
    const results = document.getElementById('searchResults');
    const meta = document.getElementById('searchMeta');

    if (!q) {
      results.innerHTML = '';
      meta.textContent = 'Ketik untuk mulai mencari.';
      return;
    }

    if (!items.length) {
      results.innerHTML = `
        <div class="rs-search-empty">
          <div class="rs-search-emptyTitle">Tidak ada hasil</div>
          <div class="rs-search-emptyDesc">Coba kata kunci lain.</div>
        </div>`;
      meta.textContent = `0 hasil untuk “${q}”.`;
      return;
    }

    meta.textContent = `${items.length} hasil untuk “${q}”.`;

    results.innerHTML = items
      .slice(0, 20)
      .map((it) => {
        const badge = it.category === 'Berita' ? 'rs-badge rs-badge--news' : 'rs-badge rs-badge--article';
        return `
          <a class="rs-search-item" href="${escapeHtml(it.url)}">
            <div class="rs-search-itemTop">
              <span class="${badge}">${escapeHtml(it.category)}</span>
              ${it.date ? `<span class="rs-search-date">${escapeHtml(it.date)}</span>` : ''}
            </div>
            <div class="rs-search-itemTitle">${escapeHtml(it.title)}</div>
            ${it.desc ? `<div class="rs-search-itemDesc">${escapeHtml(it.desc)}</div>` : ''}
          </a>`;
      })
      .join('');
  }

  function setupEvents() {
    const triggers = [];
    for (const id of SEARCH_BTN_IDS) {
      const el = document.getElementById(id);
      if (el) triggers.push(el);
    }
    // Also support data attribute hooks
    document.querySelectorAll('[data-search-open]').forEach(el => triggers.push(el));
    if (!triggers.length) return;

    triggers.forEach((el) => el.addEventListener('click', () => openModal()));

    document.addEventListener('click', (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (t.closest('[data-search-close]')) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });

    document.addEventListener('input', async (e) => {
      const input = e.target;
      if (!(input instanceof HTMLInputElement)) return;
      if (input.id !== 'searchInput') return;

      const q = input.value.trim();
      try {
        const data = await loadIndex();
        const ql = q.toLowerCase();
        const hits = q
          ? data.filter((it) =>
              (it.title || '').toLowerCase().includes(ql) ||
              (it.desc || '').toLowerCase().includes(ql)
            )
          : [];
        renderResults(hits, q);
      } catch {
        renderResults([], q);
      }
    });

    // close modal after choosing result (SPA-like feel)
    document.addEventListener('click', (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const item = t.closest('.rs-search-item');
      if (item) closeModal();
    });
  }

  document.addEventListener('DOMContentLoaded', setupEvents);
})();
