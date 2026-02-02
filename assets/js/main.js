// --- HERO mobile fit: keep image centered & not cropped (desktop unchanged)
function applyHeroBgFit(root){
  try{
    var isMobile = window.matchMedia && window.matchMedia("(max-width: 640px)").matches;
    var scope = root || document;
    var els = scope.querySelectorAll(".hero-bg, .hero-slide, .hero-card, #hero .slide, .hero .slide");
    els.forEach(function(el){
      if(!el) return;
      var cs = window.getComputedStyle(el);
      var hasBg = (cs && cs.backgroundImage && cs.backgroundImage !== "none") || (el.style && el.style.backgroundImage);
      if(!hasBg) return;
      if(isMobile){
        el.style.backgroundSize = "contain";
        el.style.backgroundPosition = "center center";
        el.style.backgroundRepeat = "no-repeat";
        if(!el.style.backgroundColor) el.style.backgroundColor = "#f3f4f6";
      }else{
        // do not force desktop; clear only what we forced
        el.style.backgroundSize = "";
        el.style.backgroundPosition = "";
        el.style.backgroundRepeat = "";
      }
    });
  }catch(e){}
}

/* eslint-disable no-unused-vars */

// =============================================================
// RAGE SOKMA V2 (code cleanup)
// =============================================================
const SITE_VERSION = "V2";



// Resolve correct /assets/ base even when this script is loaded from subfolders (../assets/js/main.js)
const ASSETS_BASE = new URL('..', document.currentScript && document.currentScript.src ? document.currentScript.src : window.location.href); // => .../assets/
const assetUrl = (p) => new URL(p, ASSETS_BASE).toString();
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

/** ------------------------------------------------------------
 * Share buttons (Detail Berita / Artikel)
 * - Auto-inject share bar on pages that contain <article.prose>
 * - Uses current URL + document title
 * ------------------------------------------------------------ */
function initShareBar() {
  try {
    // Only inject once
    if (document.querySelector('.share-wrapper')) return;

    // Detect detail pages by presence of article content
    const article = document.querySelector('article.prose');
    if (!article) return;

    // Prefer placing after hero image (if any), otherwise before article
    const heroImg = document.querySelector('.article-hero-img');
    const anchor = heroImg ? heroImg : article;
    const parent = anchor && anchor.parentElement;
    if (!parent) return;

    const pageUrl = (window.location.href || '').split('#')[0];
    const cleanTitleText = (document.title || '').replace(/\s+\|\s+RAGE SOKMA\s*$/i, '').trim();

    // Pull narasi singkat untuk preview (OG description / meta description)
    const metaOgDesc = document.querySelector('meta[property="og:description"]');
    const metaDesc = document.querySelector('meta[name="description"]');
    const shortDesc = (metaOgDesc?.getAttribute('content') || metaDesc?.getAttribute('content') || '').trim();

    // Determine context: berita vs artikel
    const path = (window.location.pathname || '').toLowerCase();
    const isBerita = path.includes('/berita/');
    const isArtikel = path.includes('/artikel/');

    // Try to read publish date from meta (for WhatsApp message formatting on berita)
    const publishedMeta = document.querySelector('meta[property="article:published_time"]');
    const publishedRaw = (publishedMeta?.getAttribute('content') || '').trim();

    const formatDateId = (isoDate) => {
      try {
        if (!isoDate) return '';
        const d = new Date(isoDate);
        if (Number.isNaN(d.getTime())) return '';
        return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
      } catch { return ''; }
    };

    const publishedPretty = formatDateId(publishedRaw);

    // Share payloads
    const url = encodeURIComponent(pageUrl);
    const title = encodeURIComponent(cleanTitleText);
    const media = encodeURIComponent((heroImg && heroImg.src) ? heroImg.src : '');

    // Helper: build WhatsApp message (title + optional date + newline + URL)
    const buildWhatsAppText = () => {
      // Requested format: judul (with context) + newline + link
      let head = cleanTitleText;
      if (isBerita && publishedPretty) {
        head = `${cleanTitleText} — ${publishedPretty}`;
      }
      return `${head}\n${pageUrl}`.trim();
    };

    // Helper: simple share analytics (localStorage only)
    const trackShare = (platform) => {
      try {
        const key = 'rage_share_counts_v1';
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        const slug = (window.location.pathname || '').split('/').pop() || 'unknown';
        data.total = data.total || {};
        data.bySlug = data.bySlug || {};
        data.total[platform] = (data.total[platform] || 0) + 1;
        data.bySlug[slug] = data.bySlug[slug] || {};
        data.bySlug[slug][platform] = (data.bySlug[slug][platform] || 0) + 1;
        data.last = { platform, slug, ts: Date.now() };
        localStorage.setItem(key, JSON.stringify(data));
      } catch (e) {}
    };

    // Helper: generate Story image (1080x1920) from hero + title
    const makeStoryImage = async () => {
      const w = 1080, h = 1920;
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('no-canvas');

      // Background
      ctx.fillStyle = '#0b1220';
      ctx.fillRect(0, 0, w, h);

      // Draw hero image if exists
      if (heroImg && heroImg.src) {
        await new Promise((resolve) => {
          const im = new Image();
          im.crossOrigin = 'anonymous';
          im.onload = () => {
            // cover fit
            const scale = Math.max(w / im.width, (h * 0.56) / im.height);
            const dw = im.width * scale;
            const dh = im.height * scale;
            const dx = (w - dw) / 2;
            const dy = 0;
            ctx.drawImage(im, dx, dy, dw, dh);
            // gradient overlay for text readability
            const g = ctx.createLinearGradient(0, h * 0.35, 0, h * 0.8);
            g.addColorStop(0, 'rgba(11,18,32,0)');
            g.addColorStop(1, 'rgba(11,18,32,0.85)');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, w, h);
            resolve();
          };
          im.onerror = () => resolve();
          im.src = heroImg.src;
        });
      } else {
        // Subtle pattern fallback
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        for (let y = 0; y < h; y += 48) {
          ctx.fillRect(0, y, w, 1);
        }
      }

      // Title
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 64px system-ui, -apple-system, Segoe UI, Roboto, Arial';
      const pad = 80;
      const maxWidth = w - pad * 2;
      const lines = [];
      const words = cleanTitleText.split(/\s+/).filter(Boolean);
      let line = '';
      for (const word of words) {
        const test = line ? `${line} ${word}` : word;
        if (ctx.measureText(test).width <= maxWidth) {
          line = test;
        } else {
          if (line) lines.push(line);
          line = word;
        }
      }
      if (line) lines.push(line);
      const maxLines = 4;
      const clipped = lines.slice(0, maxLines);
      let ty = Math.round(h * 0.62);
      clipped.forEach((ln) => {
        ctx.fillText(ln, pad, ty);
        ty += 76;
      });

      // Description (optional)
      if (shortDesc) {
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.font = '500 36px system-ui, -apple-system, Segoe UI, Roboto, Arial';
        const d = shortDesc.length > 140 ? shortDesc.slice(0, 137) + '…' : shortDesc;
        const dl = [];
        let dlLine = '';
        for (const word of d.split(/\s+/)) {
          const test = dlLine ? `${dlLine} ${word}` : word;
          if (ctx.measureText(test).width <= maxWidth) dlLine = test;
          else { dl.push(dlLine); dlLine = word; }
        }
        if (dlLine) dl.push(dlLine);
        const shown = dl.slice(0, 3);
        let dy = ty + 8;
        shown.forEach((ln) => {
          ctx.fillText(ln, pad, dy);
          dy += 46;
        });
      }

      // Footer: site + URL
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.font = '700 34px system-ui, -apple-system, Segoe UI, Roboto, Arial';
      ctx.fillText('RAGE SOKMA', pad, h - 140);
      ctx.fillStyle = 'rgba(255,255,255,0.75)';
      ctx.font = '500 30px system-ui, -apple-system, Segoe UI, Roboto, Arial';
      const urlShort = pageUrl.replace(/^https?:\/\//i, '');
      ctx.fillText(urlShort, pad, h - 96);

      return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), 'image/png', 0.92);
      });
    };

    // Build WhatsApp text once (judul enter baru link)
    const waMessageText = buildWhatsAppText();

    const wrap = document.createElement('div');
    wrap.className = 'share-wrapper';
    wrap.setAttribute('aria-label', 'Bagikan');

    // Inline SVG icons (no external dependency)
    const iconShare = `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M18 16a3 3 0 0 0-2.4 1.2l-6.1-3.1a3.2 3.2 0 0 0 0-2.2l6.1-3.1A3 3 0 1 0 15 6a3 3 0 0 0 .1.7L9 9.8a3 3 0 1 0 0 4.4l6.1 3.1A3 3 0 1 0 18 16Z"/>
      </svg>`;

    const iconFacebook = `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.2-1.5 1.6-1.5h1.7V5c-.3 0-1.4-.1-2.7-.1-2.7 0-4.6 1.6-4.6 4.6V11H7v3h2.8v8h3.7Z"/>
      </svg>`;

    const iconX = `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M18.9 3H21l-6.9 7.9L22 21h-6.2l-4.8-6.1L5.6 21H3l7.4-8.5L2 3h6.3l4.3 5.6L18.9 3Zm-1.1 16h1.2L7.2 4.9H5.9L17.8 19Z"/>
      </svg>`;

    const iconPinterest = `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M12 2C6.5 2 2 6.3 2 11.9c0 4.1 2.6 7.7 6.3 9.1-.1-.8-.2-2 0-2.9l1.4-5.9s-.4-.9-.4-2.1c0-2 1.1-3.5 2.5-3.5 1.2 0 1.8.9 1.8 2 0 1.2-.8 3.1-1.2 4.8-.3 1.4.7 2.5 2.1 2.5 2.5 0 4.2-3.2 4.2-7.1 0-2.9-2-5-5.5-5-4 0-6.4 3-6.4 6.2 0 1.2.4 2.1 1 2.8.1.2.2.3.1.6l-.3 1.1c-.1.4-.3.5-.6.3-1.5-.7-2.4-2.6-2.4-4.7 0-3.5 2.9-7.6 8.7-7.6 4.6 0 7.6 3.3 7.6 6.9 0 4.7-2.6 8.2-6.4 8.2-1.3 0-2.5-.7-2.9-1.5l-.8 3.1c-.3 1-.9 2.1-1.3 2.9.9.3 1.9.4 2.9.4 5.5 0 10-4.4 10-9.9C22 6.4 17.5 2 12 2Z"/>
      </svg>`;

    const iconInstagram = `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Zm-5 4.5A5.5 5.5 0 1 1 6.5 14 5.5 5.5 0 0 1 12 8.5Zm0 2A3.5 3.5 0 1 0 15.5 14 3.5 3.5 0 0 0 12 10.5ZM18 6.7a1.1 1.1 0 1 1-1.1-1.1A1.1 1.1 0 0 1 18 6.7Z"/>
      </svg>`;

    const iconWhatsApp = `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M20.5 3.5A11 11 0 0 0 3.2 16.7L2 22l5.5-1.2A11 11 0 1 0 20.5 3.5Zm-8.5 18a9 9 0 0 1-4.6-1.3l-.3-.2-3.2.7.7-3.1-.2-.3A9 9 0 1 1 12 21.5Zm5-6.7c-.3-.1-1.7-.8-2-.9s-.5-.1-.7.2-.8.9-1 1.1-.4.2-.7.1a7.4 7.4 0 0 1-2.2-1.4 8.4 8.4 0 0 1-1.6-2c-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6s-.7-1.7-1-2.4c-.3-.6-.6-.6-.7-.6h-.6c-.2 0-.6.1-.9.4s-1.2 1.1-1.2 2.8 1.2 3.2 1.4 3.4c.2.2 2.4 3.7 5.8 5.1.8.3 1.4.5 1.9.6.8.3 1.6.2 2.2.1.7-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4s-.3-.2-.6-.3Z"/>
      </svg>`;

    const iconLink = `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M10.59 13.41a1 1 0 0 1 0-1.41l2.83-2.83a3 3 0 1 1 4.24 4.24l-1.41 1.41a1 1 0 0 1-1.42-1.41l1.42-1.42a1 1 0 0 0-1.42-1.41l-2.83 2.83a1 1 0 0 1-1.41 0ZM13.41 10.59a1 1 0 0 1 0 1.41l-2.83 2.83a3 3 0 0 1-4.24-4.24l1.41-1.41a1 1 0 1 1 1.42 1.41L7.76 12a1 1 0 0 0 1.41 1.41l2.83-2.83a1 1 0 0 1 1.41 0Z"/>
      </svg>`;


    wrap.innerHTML = `
      <span class="share-label" aria-hidden="true">${iconShare}<span>SHARE</span></span>
      <a class="share-btn share-btn--facebook" target="_blank" rel="noopener" aria-label="Bagikan ke Facebook" href="https://www.facebook.com/sharer/sharer.php?u=${url}">${iconFacebook}<span>Facebook</span></a>
      <a class="share-btn share-btn--twitter" target="_blank" rel="noopener" aria-label="Bagikan ke X" href="https://twitter.com/intent/tweet?url=${url}&text=${title}">${iconX}<span>Twitter</span></a>
      <a class="share-btn share-btn--pinterest" target="_blank" rel="noopener" aria-label="Bagikan ke Pinterest" href="https://pinterest.com/pin/create/button/?url=${url}&media=${media}&description=${title}">${iconPinterest}<span>Pinterest</span></a>
      <a class="share-btn share-btn--whatsapp" target="_blank" rel="noopener" aria-label="Bagikan ke WhatsApp" href="#">${iconWhatsApp}<span>WhatsApp</span></a>
      <button class="share-btn share-btn--copy" type="button" aria-label="Salin tautan">${iconLink}<span>Salin tautan</span></button>
      <a class="share-btn share-btn--igstory" href="#" aria-label="Bagikan ke Instagram Story">${iconInstagram}<span>IG Story</span></a>
      <a class="share-btn share-btn--fbstory" href="#" aria-label="Bagikan ke Facebook Story">${iconFacebook}<span>FB Story</span></a>
    `.trim();

    // Insert right after hero image if exists, else before article
    if (heroImg) {
      heroImg.insertAdjacentElement('afterend', wrap);
    } else {
      parent.insertBefore(wrap, article);
    }

    // Track clicks for common platforms (FB, X, Pinterest)
    try {
      wrap.querySelector('.share-btn--facebook')?.addEventListener('click', () => trackShare('facebook'));
      wrap.querySelector('.share-btn--twitter')?.addEventListener('click', () => trackShare('twitter'));
      wrap.querySelector('.share-btn--pinterest')?.addEventListener('click', () => trackShare('pinterest'));
    } catch (e) {}

    // WhatsApp: open WhatsApp directly (no generic share sheet)
    // Message format requested: Judul + (tanggal jika berita) + newline + URL
    try {
      const wa = wrap.querySelector('.share-btn--whatsapp');
      if (wa) {
        const waText = encodeURIComponent(waMessageText);
        const waWeb = `https://wa.me/?text=${waText}`;
        const waApi = `https://api.whatsapp.com/send?text=${waText}`;
        const waScheme = `whatsapp://send?text=${waText}`;

        wa.href = waWeb;

        wa.addEventListener('click', (ev) => {
          trackShare('whatsapp');

          const ua = navigator.userAgent || '';
          const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);
          const isAndroid = /Android/i.test(ua);

          // Desktop: open WhatsApp Web (or wa.me)
          if (!isMobile) {
            // Keep default behavior
            wa.href = waWeb;
            return;
          }

          ev.preventDefault();

          // Mobile: try to jump straight into the WhatsApp app
          // Android: intent is the most reliable
          if (isAndroid) {
            const intent = `intent://send?text=${waText}#Intent;scheme=whatsapp;package=com.whatsapp;end`;
            window.location.href = intent;
            // Fallback to web API if intent is blocked
            setTimeout(() => {
              window.location.href = waApi;
            }, 600);
            return;
          }

          // iOS: scheme first, fallback to wa.me
          window.location.href = waScheme;
          setTimeout(() => {
            window.location.href = waWeb;
          }, 600);
        });
      }
    } catch (e) {
      // ignore
    }


    // Copy link
    try {
      const btn = wrap.querySelector('.share-btn--copy');
      if (btn) {
        const originalLabel = btn.querySelector('span')?.textContent || 'Salin tautan';

        const setCopied = () => {
          btn.classList.add('is-copied');
          const sp = btn.querySelector('span');
          if (sp) sp.textContent = 'Tersalin!';
          window.setTimeout(() => {
            btn.classList.remove('is-copied');
            const sp2 = btn.querySelector('span');
            if (sp2) sp2.textContent = originalLabel;
          }, 1400);
        };

        btn.addEventListener('click', async () => {
          trackShare('copy_link');
          const toCopy = pageUrl;

          // Preferred: Clipboard API (works on https + localhost)
          try {
            if (navigator.clipboard) {
              await navigator.clipboard.writeText(toCopy);
              setCopied();
              return;
            }
          } catch (e) {}

          // Fallback: execCommand
          try {
            const ta = document.createElement('textarea');
            ta.value = toCopy;
            ta.setAttribute('readonly', '');
            ta.style.position = 'fixed';
            ta.style.left = '-9999px';
            ta.style.top = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            setCopied();
          } catch (e) {}
        });
      }
    } catch (e) {
      // ignore
    }

    // IG Story / FB Story
    // Catatan: browser tidak bisa "langsung" lempar file ke Story tanpa interaksi share OS.
    // Implementasi terbaik: generate gambar story → gunakan Web Share API (files) kalau tersedia.
    const shareStory = async (platform) => {
      try {
        const blob = await makeStoryImage();
        if (!blob) throw new Error('no-blob');
        const file = new File([blob], 'rage-sokma-story.png', { type: 'image/png' });
        const can = navigator.canShare && navigator.canShare({ files: [file] });

        trackShare(platform);

        if (navigator.share && can) {
          await navigator.share({
            files: [file],
            title: cleanTitleText,
            text: shortDesc || cleanTitleText,
            url: pageUrl,
          });
          return;
        }

        // Fallback: download image so user can upload to story manually
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'rage-sokma-story.png';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          URL.revokeObjectURL(a.href);
          a.remove();
        }, 4000);
      } catch (e) {}
    };

    try {
      wrap.querySelector('.share-btn--igstory')?.addEventListener('click', (ev) => {
        ev.preventDefault();
        shareStory('instagram_story');
      });
      wrap.querySelector('.share-btn--fbstory')?.addEventListener('click', (ev) => {
        ev.preventDefault();
        shareStory('facebook_story');
      });
    } catch (e) {}
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
  const updateBodyLock = () => {};

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
    });

  const quickCloseBtn = document.getElementById('quickClose');
  if (quickCloseBtn) {
    quickCloseBtn.addEventListener('click', () => {
      quickMenu.classList.add('hidden');
      collapseQuickHelp();
      setQuickExpanded(false);
      });
  }

  // Close when tapping outside the panel (transparent left side)
  quickMenu.addEventListener('click', (e) => {
    const panel = quickMenu.querySelector('.mobile-panel');
    if (panel && !panel.contains(e.target)) {
      quickMenu.classList.add('hidden');
      collapseQuickHelp();
      setQuickExpanded(false);
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
      }
  });


// =========================
// Quick Drawer Footer (sticky accordion sections)
// =========================
const initQuickDrawerFooter = () => {
  if (!quickMenu) return;
  const accButtons = quickMenu.querySelectorAll('.drawer-acc-btn');
  if (!accButtons || accButtons.length === 0) return;

  accButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const nextExpanded = !expanded;
      btn.setAttribute('aria-expanded', String(nextExpanded));

      const wrap = btn.closest('.drawer-acc');
      const panel = wrap ? wrap.querySelector('.drawer-acc-panel') : null;
      if (panel) {
        if (nextExpanded) panel.removeAttribute('hidden');
        else panel.setAttribute('hidden', '');
      }
    });
  });
};

initQuickDrawerFooter();

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
    const intervalMs = 6500;
    let pausedByHover = false;
    let pausedByVisibility = false;

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
          restartAutoplay();
        });
        dotsWrap.appendChild(btn);
        return btn;
      });
    }

    const syncDots = (index) => {
      if (!dots || dots.length === 0) return;
      dots.forEach((d, i) => d.setAttribute('aria-selected', i === index ? 'true' : 'false'));
    };

    const ensureBg = (idx) => {
      const s = slides[idx];
      if (!s) return;
      const url = s.dataset.bg;
      if (!url) return;
      const bg = s.querySelector('.hero-bg');
      if (bg) {
        bg.style.backgroundImage = `url('${url}')`;
      applyHeroBgFit(document);
        // also clear any inline bg on the slide itself
        s.style.backgroundImage = '';
      } else {
        // Fallback (older markup)
        s.style.backgroundImage = `url('${url}')`;
      }
    };

    const preloadAround = (idx) => {
      // Preload next slide image (best effort)
      const nextIdx = (idx + 1) % slides.length;
      const url = slides[nextIdx]?.dataset?.bg;
      if (!url) return;
      const img = new Image();
      img.decoding = 'async';
      img.src = url;
    };

    // Slide animation: right->left (next) and left->right (prev)
    // dir = 1 means incoming from right, outgoing to left
    // dir = -1 means incoming from left, outgoing to right
    let transitionTimer = null;
    const showSlide = (index, dir = 1) => {
      if (index === currentSlide) return;
      ensureBg(index);

      const from = slides[currentSlide];
      const to = slides[index];
      if (!from || !to) return;

      // Clear any pending cleanup
      if (transitionTimer) {
        clearTimeout(transitionTimer);
        transitionTimer = null;
      }

      // Ensure only these two slides are interactable during transition
      slides.forEach((s, i) => {
        const active = i === currentSlide;
        s.style.pointerEvents = active ? 'auto' : 'none';
        s.setAttribute('aria-hidden', active ? 'false' : 'true');
        s.classList.toggle('is-active', active);
        // keep others hidden visually
        if (i !== currentSlide && i !== index) {
          s.style.opacity = '0';
          s.style.transform = 'translateX(0)';
          s.style.zIndex = '0';
          s.classList.add('opacity-0');
          s.classList.remove('opacity-100');
        }
      });

      // Prepare incoming slide (no transition first)
      to.style.transition = 'none';
      to.style.opacity = '1';
      // Start slightly off-canvas so the motion feels clear but not harsh
      to.style.transform = `translateX(${dir * 110}%)`;
      to.style.zIndex = '2';
      to.classList.add('opacity-100');
      to.classList.remove('opacity-0');
      to.style.pointerEvents = 'none';
      to.setAttribute('aria-hidden', 'true');
      to.classList.remove('is-active');

      // Outgoing slide
      from.style.zIndex = '1';
      from.style.opacity = '1';
      from.style.transform = 'translateX(0)';
      from.classList.add('opacity-100');
      from.classList.remove('opacity-0');
      from.style.pointerEvents = 'none';
      from.setAttribute('aria-hidden', 'true');
      from.classList.remove('is-active');

      // Force reflow then animate
      // eslint-disable-next-line no-unused-expressions
      to.offsetHeight;

      // Smoother, more premium motion
      const dur = 820;
      const easing = 'cubic-bezier(.16,1,.3,1)';
      to.style.transition = `transform ${dur}ms ${easing}, opacity ${dur}ms ${easing}`;
      from.style.transition = `transform ${dur}ms ${easing}, opacity ${dur}ms ${easing}`;

      requestAnimationFrame(() => {
        to.style.transform = 'translateX(0)';
        to.style.opacity = '1';
        from.style.transform = `translateX(${-dir * 12}%)`;
        from.style.opacity = '0';
      });

      transitionTimer = setTimeout(() => {
        // Finalize: set new active slide and reset others
        slides.forEach((s, i) => {
          const isActive = i === index;
          s.style.zIndex = isActive ? '1' : '0';
          s.style.opacity = isActive ? '1' : '0';
          s.style.transform = 'translateX(0)';
          s.style.pointerEvents = isActive ? 'auto' : 'none';
          s.setAttribute('aria-hidden', isActive ? 'false' : 'true');
          s.classList.toggle('is-active', isActive);
          s.classList.toggle('opacity-100', isActive);
          s.classList.toggle('opacity-0', !isActive);
          // restore default transitions (from CSS) after we override inline
          s.style.transition = '';
        });

        currentSlide = index;
        syncDots(index);
        preloadAround(index);

        if (heroSlider) {
          const active = slides[index];
          const accent = getComputedStyle(active).getPropertyValue('--hero-accent').trim();
          if (accent) heroSlider.style.setProperty('--hero-accent', accent);
        }
      }, dur + 40);
    };

    const stopAutoplay = () => {
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
    };

    const startAutoplay = () => {
      if (timerId) return;
      if (pausedByHover || pausedByVisibility) return;
      timerId = setInterval(nextSlide, intervalMs);
    };

    const restartAutoplay = () => {
      stopAutoplay();
      startAutoplay();
    };

    const nextSlide = () => {
      const next = (currentSlide + 1) % slides.length;
      showSlide(next, 1);
    };

    const prevSlide = () => {
      const prev = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(prev, -1);
    };

    nextBtn.addEventListener('click', () => {
      nextSlide();
      restartAutoplay();
    });

    prevBtn.addEventListener('click', () => {
      prevSlide();
      restartAutoplay();
    });

    // V2.4: Pause on hover (desktop) + pause on touch hold (mobile friendly)
    if (heroSlider) {
      heroSlider.addEventListener('mouseenter', () => {
        pausedByHover = true;
        stopAutoplay();
      });
      heroSlider.addEventListener('mouseleave', () => {
        pausedByHover = false;
        startAutoplay();
      });

      // Mobile: pause while user is touching/dragging inside hero
      heroSlider.addEventListener('touchstart', () => {
        pausedByHover = true;
        stopAutoplay();
      }, { passive: true });
      heroSlider.addEventListener('touchend', () => {
        pausedByHover = false;
        startAutoplay();
      });
      heroSlider.addEventListener('touchcancel', () => {
        pausedByHover = false;
        startAutoplay();
      });
    }

    // V2.4: UX polish — auto pause when tab is not active
    document.addEventListener('visibilitychange', () => {
      pausedByVisibility = document.hidden;
      if (pausedByVisibility) stopAutoplay();
      else startAutoplay();
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
    startAutoplay();
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
    safeFetchJSON(assetUrl('data/impact.json')).then((data) => {
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

  // Share bar on detail pages (Berita / Artikel)
  initShareBar();

  // Share bar (detail berita/artikel)
  initShareBar();

  initImpactStats();
};

// Run safely whether the script loads before or after DOMContentLoaded.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSite);
} else {
  initSite();
}

/* v41 accordion standard handler (single-open + smooth height) */
(function(){
  function closePanel(btn, panel){
    if (!btn || !panel) return;
    panel.setAttribute('hidden','');
    btn.setAttribute('aria-expanded','false');
    panel.style.maxHeight = '';
  }

  function openPanel(btn, panel){
    if (!btn || !panel) return;
    panel.removeAttribute('hidden');
    btn.setAttribute('aria-expanded','true');
    panel.style.maxHeight = panel.scrollHeight + 'px';
  }

  function initAccordions(scope){
    var root = scope || document;
    var buttons = Array.from(root.querySelectorAll('.drawer-acc-btn[data-acc]'));

    buttons.forEach(function(btn){
      if (btn.__accBound) return;
      btn.__accBound = true;

      var key = btn.getAttribute('data-acc');
      var panel = root.querySelector('.drawer-acc-panel[data-acc-panel="'+key+'"]') || document.getElementById('acc-panel-'+key);

      if (panel){
        if (!panel.id) panel.id = 'acc-panel-'+key;
        btn.setAttribute('aria-controls', panel.id);

        var expanded = panel.hasAttribute('hidden') ? 'false' : 'true';
        btn.setAttribute('aria-expanded', expanded);

        if (expanded === 'true') {
          panel.style.maxHeight = panel.scrollHeight + 'px';
        } else {
          panel.style.maxHeight = '';
        }
      } else {
        if (!btn.getAttribute('aria-expanded')) btn.setAttribute('aria-expanded', 'false');
      }

      btn.addEventListener('click', function(){
        var k = btn.getAttribute('data-acc');
        var p = root.querySelector('.drawer-acc-panel[data-acc-panel="'+k+'"]') || document.getElementById('acc-panel-'+k);
        if (!p) return;

        var isOpen = !p.hasAttribute('hidden');

        // SINGLE-OPEN within the same container
        var container = btn.closest('.mobile-panel') || btn.closest('#quickMenu') || root;
        var otherBtns = Array.from(container.querySelectorAll('.drawer-acc-btn[data-acc]'));
        otherBtns.forEach(function(ob){
          if (ob === btn) return;
          var ok = ob.getAttribute('data-acc');
          var op = container.querySelector('.drawer-acc-panel[data-acc-panel="'+ok+'"]') || document.getElementById('acc-panel-'+ok);
          if (op && !op.hasAttribute('hidden')) closePanel(ob, op);
        });

        if (isOpen){
          closePanel(btn, p);
        } else {
          openPanel(btn, p);
        }
      });
    });

    window.addEventListener('resize', function(){
      buttons.forEach(function(btn){
        var key = btn.getAttribute('data-acc');
        var panel = root.querySelector('.drawer-acc-panel[data-acc-panel="'+key+'"]') || document.getElementById('acc-panel-'+key);
        if (panel && !panel.hasAttribute('hidden')) {
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      });
    }, { passive: true });
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){ initAccordions(document); });
  } else {
    initAccordions(document);
  }

  // =========================
    // =========================
  // Mobile search + site search (berita & artikel)
  // =========================
  (function initSiteSearchModal(){
    if (window.__RAGE_SITE_SEARCH_INIT__) return;
    window.__RAGE_SITE_SEARCH_INIT__ = true;

    const base = window.__RAGE_BASEPATH__ || '';
    const searchBtn = document.getElementById('searchBtn');

    // Only run if search button exists (it is mobile-only in markup)
    if (!searchBtn) return;

    let postsCache = null;

    const escHtml = (s) => (s || '').replace(/[&<>"']/g, (m) => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[m]));

    const ensureModal = () => {
      let modal = document.getElementById('searchModal');
      if (modal) return modal;

      modal = document.createElement('div');
      modal.id = 'searchModal';
      modal.setAttribute('hidden', '');
      modal.innerHTML = `
        <div class="search-modal__backdrop" data-search-close></div>
        <div class="search-modal__dialog" role="dialog" aria-modal="true" aria-label="Pencarian">
          <div class="search-modal__head">
            <div class="search-modal__title">Cari Berita / Artikel</div>
            <button class="search-modal__close" type="button" aria-label="Tutup" data-search-close>×</button>
          </div>

          <div class="search-modal__bar">
            <input id="searchModalInput" type="search" aria-label="Kata kunci pencarian" placeholder="Ketik keyword…" autocomplete="off" />
            <button id="searchModalGo" type="button">Cari</button>
          </div>

          <div class="search-modal__hint" id="searchModalHint">Masukkan keyword untuk mencari berita atau artikel.</div>

          <div class="search-modal__results" id="searchModalResults"></div>
        </div>
      `;
      document.body.appendChild(modal);

      // Close handlers
      modal.addEventListener('click', (e) => {
        if (e.target && e.target.hasAttribute('data-search-close')) closeModal();
      });

      document.addEventListener('keydown', (e) => {
        if (modal.hasAttribute('hidden')) return;
        if (e.key === 'Escape') closeModal();
      });

      return modal;
    };

    const openModal = () => {
      const modal = ensureModal();
      modal.removeAttribute('hidden');
      document.documentElement.classList.add('no-scroll');
      const input = document.getElementById('searchModalInput');
      if (input) {
        input.value = '';
        setTimeout(() => input.focus(), 0);
      }
      const results = document.getElementById('searchModalResults');
      const hint = document.getElementById('searchModalHint');
      if (results) results.innerHTML = '';
      if (hint) hint.textContent = 'Masukkan keyword untuk mencari berita atau artikel.';
    };

    const closeModal = () => {
      const modal = document.getElementById('searchModal');
      if (!modal) return;
      modal.setAttribute('hidden', '');
      document.documentElement.classList.remove('no-scroll');
    };

    const scorePost = (p, q) => {
      const hay = `${p.title||''} ${p.excerpt||''} ${p.category||''}`.toLowerCase();
      const qq = q.toLowerCase().trim();
      if (!qq) return 0;
      let score = 0;
      if ((p.title||'').toLowerCase().includes(qq)) score += 5;
      if ((p.category||'').toLowerCase().includes(qq)) score += 2;
      if ((p.excerpt||'').toLowerCase().includes(qq)) score += 1;
      // token scoring
      qq.split(/\s+/).filter(Boolean).forEach(t=>{
        if (t.length < 2) return;
        if (hay.includes(t)) score += 1;
      });
      return score;
    };

    const fetchPosts = async () => {
      if (postsCache) return postsCache;
      const url = base + 'assets/data/posts.json';
      const res = await fetch(url, { cache: 'no-store' });
      postsCache = await res.json();
      return postsCache;
    };

    const renderResults = (query, items) => {
      const resultsEl = document.getElementById('searchModalResults');
      const hint = document.getElementById('searchModalHint');
      if (!resultsEl) return;

      const q = query.trim();
      if (!q){
        resultsEl.innerHTML = '';
        if (hint) hint.textContent = 'Masukkan keyword untuk mencari berita atau artikel.';
        return;
      }

      const head = `<div class="search-modal__query">Hasil untuk: <span>"${escHtml(q)}"</span></div>`;
      if (!items.length){
        resultsEl.innerHTML = head + `<div class="search-modal__empty">Tidak ada hasil untuk keyword tersebut.</div>`;
        if (hint) hint.textContent = '';
        return;
      }

      const list = items.slice(0, 10).map(p => {
        const href = p.url || (p.type === 'artikel' ? `artikel/${p.slug}.html` : `berita/${p.slug}.html`);
        const meta = `${escHtml(p.category || (p.type || '').toUpperCase())}${p.date ? ' • ' + escHtml(p.date) : ''}`;
        return `
          <a class="search-modal__item" href="${escHtml(href)}">
            <div class="search-modal__itemTitle">${escHtml(p.title)}</div>
            <div class="search-modal__itemMeta">${meta}</div>
            <div class="search-modal__itemExcerpt">${escHtml(p.excerpt || '')}</div>
          </a>
        `;
      }).join('');

      resultsEl.innerHTML = head + `<div class="search-modal__list">${list}</div>`;
      if (hint) hint.textContent = '';
    };

    const doSearch = async (q) => {
      const query = (q || '').trim();
      try{
        const posts = await fetchPosts();
        const ranked = (posts || [])
          .map(p => ({ p, s: scorePost(p, query) }))
          .filter(x => x.s > 0)
          .sort((a,b)=> b.s - a.s)
          .map(x => x.p);
        renderResults(query, ranked);
      } catch (err){
        const resultsEl = document.getElementById('searchModalResults');
        if (resultsEl) resultsEl.innerHTML = `<div class="search-modal__empty">Gagal memuat data pencarian.</div>`;
      }
    };

    // Wire events
    searchBtn.addEventListener('click', openModal);

    document.addEventListener('click', (e) => {
      const go = e.target && e.target.id === 'searchModalGo';
      if (!go) return;
      const input = document.getElementById('searchModalInput');
      if (input) doSearch(input.value);
    });

    document.addEventListener('input', (e) => {
      if (!e.target || e.target.id !== 'searchModalInput') return;
      const v = e.target.value || '';
      // live search after 2 chars
      if (v.trim().length < 2){
        renderResults(v, []);
        return;
      }
      doSearch(v);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      const modal = document.getElementById('searchModal');
      if (!modal || modal.hasAttribute('hidden')) return;
      const input = document.getElementById('searchModalInput');
      if (!input) return;
      if (document.activeElement !== input) return;
      doSearch(input.value);
    });
  })();;})();

/* v41 active state (drawer + quick) */
(function(){
  function normalize(p){
    if (!p) return '';
    try { p = p.split('#')[0].split('?')[0]; } catch(e){}
    if (p === '/') return '/index.html';
    return p.replace(/\/+$/,'');
  }
  var current = normalize(window.location.pathname);
  var currentFile = (current.split('/').pop() || '').toLowerCase();

  var links = Array.from(document.querySelectorAll('.mobile-panel a, #quickMenu a, .quick-grid a, footer a'));
  links.forEach(function(a){
    var href = a.getAttribute('href');
    if (!href) return;
    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

    var target = normalize(href);
    var targetFile = (target.split('/').pop() || '').toLowerCase();

    var match = (target && target === current) || (targetFile && targetFile === currentFile);
    if (match){
      a.classList.add('is-active');
      a.setAttribute('aria-current','page');
    }
  });

  var tBtn = document.querySelector('.drawer-acc-btn[data-acc="tentang"]');
  var pBtn = document.querySelector('.drawer-acc-btn[data-acc="program"]');
  if (tBtn && current.indexOf('/tentang/') !== -1) tBtn.classList.add('is-active');
  if (pBtn && current.indexOf('/program/') !== -1) pBtn.classList.add('is-active');

  // =========================
  })();



window.addEventListener("resize", function(){ applyHeroBgFit(document); });
