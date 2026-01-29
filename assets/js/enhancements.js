/* Enhancements: sticky CTA + form handling + lightweight validation */
(function () {
  const cfg = (window.RAGE_SITE_CONFIG || {});
  const formsCfg = (cfg.forms || {});
  const qs = (sel, el=document) => el.querySelector(sel);
  const qsa = (sel, el=document) => Array.from(el.querySelectorAll(sel));

  function isPlaceholder(url) {
    return !url || /REPLACE_ME/i.test(url);
  }

  function createToast(type, title, desc) {
    const wrap = document.createElement('div');
    wrap.className = 'rage-toast rage-toast--' + (type || 'info');
    wrap.setAttribute('role', 'status');
    wrap.innerHTML = `
      <div class="rage-toast__inner">
        <div class="rage-toast__title">${title || ''}</div>
        ${desc ? `<div class="rage-toast__desc">${desc}</div>` : ''}
        <button class="rage-toast__close" type="button" aria-label="Tutup">×</button>
      </div>
    `;
    wrap.querySelector('.rage-toast__close')?.addEventListener('click', () => wrap.remove());
    document.body.appendChild(wrap);
    setTimeout(() => { if (wrap.isConnected) wrap.remove(); }, 6500);
  }

  function ensureToastStyles() {
    if (qs('#rage-toast-style')) return;
    const s = document.createElement('style');
    s.id = 'rage-toast-style';
    s.textContent = `
      .rage-toast{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;display:flex;justify-content:center;pointer-events:none}
      .rage-toast__inner{pointer-events:auto;max-width:720px;width:100%;background:#0b1220;color:#fff;border-radius:16px;padding:14px 16px;box-shadow:0 16px 36px rgba(0,0,0,.25);border:1px solid rgba(255,255,255,.12);display:flex;gap:12px;align-items:flex-start}
      .rage-toast__title{font-weight:900;line-height:1.2}
      .rage-toast__desc{margin-top:4px;font-size:13px;line-height:1.35;color:rgba(255,255,255,.85)}
      .rage-toast__close{margin-left:auto;background:transparent;border:0;color:#fff;font-size:20px;line-height:1;padding:0 4px;cursor:pointer}
      .rage-toast--success .rage-toast__inner{background:#0b2a16}
      .rage-toast--error .rage-toast__inner{background:#2a0b0b}
      .rage-toast--warn .rage-toast__inner{background:#2a220b}
    `;
    document.head.appendChild(s);
  }

  function injectStickyBar() {
    const mode = document.body?.dataset?.donationCta;
    if (!mode) return;

    const makeBtn = (href, label, primary) => (
      `<a class="rage-stickybar__btn ${primary ? 'rage-stickybar__btn--primary' : ''}" href="${href}">${label}</a>`
    );

    let btns = '';
    if (mode === 'confirm') {
      btns = makeBtn('konfirmasi-donasi.html','Konfirmasi Donasi', true) + makeBtn('donasi.html','Lihat Cara Donasi', false);
    } else { // default: donate + confirm
      btns = makeBtn('donasi.html','Donasi Sekarang', true) + makeBtn('konfirmasi-donasi.html','Konfirmasi Donasi', false);
    }

    const bar = document.createElement('div');
    bar.className = 'rage-stickybar';
    bar.innerHTML = `<div class="rage-stickybar__inner">${btns}</div>`;

    const style = document.createElement('style');
    style.textContent = `
      .rage-stickybar{position:fixed;left:0;right:0;bottom:0;z-index:9990;padding:10px 12px;background:rgba(255,255,255,.86);backdrop-filter:saturate(140%) blur(10px);border-top:1px solid rgba(15,23,42,.12)}
      .rage-stickybar__inner{max-width:980px;margin:0 auto;display:flex;gap:10px}
      .rage-stickybar__btn{flex:1;display:inline-flex;align-items:center;justify-content:center;border-radius:14px;padding:12px 14px;font-weight:900;border:1px solid rgba(15,23,42,.15);background:#fff;color:#0f172a;text-decoration:none}
      .rage-stickybar__btn--primary{background:#1d4ed8;color:#fff;border-color:rgba(29,78,216,.4)}
      @media (min-width: 1024px){.rage-stickybar{display:none}}
      body{padding-bottom: env(safe-area-inset-bottom)}
      @media (max-width: 1023px){ body{ padding-bottom: 78px; } }
    `;
    document.head.appendChild(style);
    document.body.appendChild(bar);
  }

  function validateWA(v) {
    const s = (v || '').trim();
    if (!s) return false;
    // allow +62, 62, 08
    return /^(\+?62|62|0)8[1-9][0-9]{6,12}$/.test(s);
  }

  function setFieldError(input, msg) {
    input.setAttribute('aria-invalid', 'true');
    input.classList.add('ring-2','ring-red-200','border-red-300');
    let help = input.parentElement?.querySelector('.field-error');
    if (!help) {
      help = document.createElement('div');
      help.className = 'field-error text-xs text-red-700 mt-2 font-semibold';
      input.parentElement?.appendChild(help);
    }
    help.textContent = msg || 'Wajib diisi.';
  }

  function clearFieldError(input) {
    input.removeAttribute('aria-invalid');
    input.classList.remove('ring-2','ring-red-200','border-red-300');
    const help = input.parentElement?.querySelector('.field-error');
    if (help) help.remove();
  }

  async function submitToFormspree(form, endpoint) {
    const fd = new FormData(form);
    // add page context
    fd.append('_source', window.location.href);
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: fd
    });
    return res;
  }

  function enhanceForms() {
    ensureToastStyles();

    qsa('form[data-form-key]').forEach((form) => {
      const key = form.getAttribute('data-form-key');
      const endpoint = formsCfg[key];

      const requiredSelectors = '[data-required="1"], input[required], textarea[required], select[required]';
      const inputs = qsa('input, textarea, select', form);

      inputs.forEach((el) => {
        el.addEventListener('input', () => clearFieldError(el));
        el.addEventListener('change', () => clearFieldError(el));
      });

      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // validation
        let ok = true;
        qsa(requiredSelectors, form).forEach((el) => {
          const v = (el.value || '').trim();
          if (!v) { ok = false; setFieldError(el, 'Wajib diisi.'); }
          else clearFieldError(el);
        });

        // WA validation if any
        const wa = form.querySelector('input[name="wa"], input[name="whatsapp"], input[data-validate="wa"]');
        if (wa) {
          const wv = (wa.value || '').trim();
          if (wv && !validateWA(wv)) { ok = false; setFieldError(wa, 'Format WA tidak valid. Contoh: 08xxxxxxxxxx'); }
        }

        if (!ok) {
          createToast('warn', 'Periksa kembali isian.', 'Ada kolom yang belum sesuai. Silakan lengkapi dulu.');
          return;
        }

        if (isPlaceholder(endpoint)) {
          createToast('error', 'Form belum tersambung.', 'Admin perlu mengisi endpoint Formspree di file assets/js/site-config.js (bagian forms).' );
          return;
        }

        const btn = form.querySelector('button[type="submit"], input[type="submit"]');
        const oldText = btn ? btn.textContent : '';
        if (btn) { btn.disabled = true; btn.textContent = 'Mengirim...'; }

        try {
          const res = await submitToFormspree(form, endpoint);
          if (res.ok) {
            form.reset();
            createToast('success', 'Terkirim.', 'Terima kasih! Data Anda sudah kami terima.');

            // optional redirect
            const redirect = form.getAttribute('data-success-redirect');
            if (redirect) setTimeout(() => { window.location.href = redirect; }, 800);
          } else {
            createToast('error', 'Gagal mengirim.', 'Silakan coba lagi. Jika tetap gagal, hubungi admin via WhatsApp.');
          }
        } catch (err) {
          createToast('error', 'Gagal mengirim.', 'Koneksi bermasalah. Silakan coba lagi.');
        } finally {
          if (btn) { btn.disabled = false; btn.textContent = oldText || 'Kirim'; }
        }
      });
    });
  }

  function init() {
    injectStickyBar();
    enhanceForms();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
