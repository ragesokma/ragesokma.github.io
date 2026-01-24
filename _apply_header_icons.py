import re, pathlib

ROOT = pathlib.Path('/mnt/data/rage_site')

# Simple inline SVG icons (stroke), sized via class .nav-ico
ICONS = {
  'home': '<svg class="nav-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></svg>',
  'info': '<svg class="nav-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  'spark': '<svg class="nav-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2l1.2 5.2L18 9l-4.8 1.8L12 16l-1.2-5.2L6 9l4.8-1.8L12 2z"/><path d="M19 14l.7 3 2.3 1-.0 0-2.3 1-.7 3-.7-3-2.3-1 2.3-1 .7-3z"/></svg>',
  'help': '<svg class="nav-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 1 1 5.8 1c0 2-3 2-3 4"/><path d="M12 17h.01"/></svg>',
  'chart': '<svg class="nav-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3v18h18"/><path d="M7 14l3-3 3 3 5-6"/></svg>',
  'phone': '<svg class="nav-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1A19.5 19.5 0 0 1 3.2 12.8 19.8 19.8 0 0 1 .1 4.2 2 2 0 0 1 2.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .6 3a2 2 0 0 1-.5 2.1L6 10a16 16 0 0 0 8 8l1.2-1.2a2 2 0 0 1 2.1-.5c1 .3 2 .5 3 .6a2 2 0 0 1 1.7 2z"/></svg>',
  'heart': '<svg class="nav-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.6z"/></svg>',
  'users': '<svg class="nav-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  'login': '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="8" r="4"/></svg>'
}


def header(prefix: str) -> str:
    p = prefix
    # Keep absolute paths for in-site sections that are already used.
    return f"""<header class=\"site-header sticky top-0 z-50\" id=\"siteHeader\">
<div class=\"max-w-7xl mx-auto px-6\">
  <div class=\"site-header__inner flex items-center justify-between h-16 lg:h-20 transition-all duration-300\">

    <!-- LOGO -->
    <a class=\"site-brand flex items-center gap-2 order-2 lg:order-none mx-auto lg:mx-0\" href=\"{p}index.html\">
      <img alt=\"Logo RAGE SOKMA\" class=\"site-logo h-9 lg:h-11 w-auto transition-all duration-300\" src=\"{p}assets/images/logo.png\"/>
      <span class=\"site-title\">RAGE SOKMA</span>
    </a>

    <!-- NAV DESKTOP -->
    <nav aria-label=\"Navigasi utama\" class=\"items-center text-gray-800 font-medium desktop-nav\">
      <a class=\"nav-link nav-item\" data-nav=\"\" href=\"{p}index.html\">{ICONS['home']}<span>Beranda</span></a>

      <!-- Tentang (dropdown) -->
      <div class=\"relative\">
        <button aria-haspopup=\"true\" aria-label=\"Menu Tentang\" class=\"nav-link nav-parent nav-item peer\" data-nav-parent=\"tentang\" type=\"button\">{ICONS['info']}<span>Tentang</span></button>
        <div class=\"absolute left-0 top-full pt-3 hidden peer-hover:block peer-focus:block hover:block\">
          <div class=\"w-56 glass-panel rounded-xl\">
            <a class=\"block px-4 py-3 hover:bg-white/20 rounded-t-xl\" data-nav=\"\" href=\"/tentang/sejarah.html\">Sejarah</a>
            <a class=\"block px-4 py-3 hover:bg-white/20\" data-nav=\"\" href=\"/tentang/visi-misi.html\">Visi &amp; Misi</a>
            <a class=\"block px-4 py-3 hover:bg-white/20\" data-nav=\"\" href=\"/tentang/pengurus.html\">Pengurus</a>
            <a class=\"block px-4 py-3 hover:bg-white/20 rounded-b-xl\" data-nav=\"\" href=\"/tentang/program-kerja.html\">Program Kerja</a>
          </div>
        </div>
      </div>

      <!-- Program (dropdown) -->
      <div class=\"relative\">
        <button aria-haspopup=\"true\" aria-label=\"Menu Program\" class=\"nav-link nav-parent nav-item peer\" data-nav-parent=\"program\" type=\"button\">{ICONS['spark']}<span>Program</span></button>
        <div class=\"absolute left-0 top-full pt-3 hidden peer-hover:block peer-focus:block hover:block\">
          <div class=\"w-72 glass-panel rounded-xl\">
            <a class=\"block px-4 py-3 hover:bg-white/20 rounded-t-xl\" data-nav=\"\" href=\"/program/santunan-yatim.html\">Santunan Anak Yatim</a>
            <a class=\"block px-4 py-3 hover:bg-white/20\" data-nav=\"\" href=\"/program/peduli-dhuafa.html\">Peduli Dhu’afa</a>
            <a class=\"block px-4 py-3 hover:bg-white/20\" data-nav=\"\" href=\"/program/sosial-keagamaan.html\">Sosial Keagamaan</a>
            <a class=\"block px-4 py-3 hover:bg-white/20 rounded-b-xl font-semibold\" data-nav=\"\" href=\"{p}program.html\">Semua Program →</a>
          </div>
        </div>
      </div>

      <a class=\"nav-link nav-item\" data-nav=\"\" href=\"{p}faq.html\">{ICONS['help']}<span>FAQ</span></a>
      <a class=\"nav-link nav-item\" data-nav=\"\" href=\"{p}transparansi.html\">{ICONS['chart']}<span>Transparansi</span></a>
      <a class=\"nav-link nav-item\" data-nav=\"\" href=\"{p}kontak.html\">{ICONS['phone']}<span>Kontak</span></a>
      <a class=\"nav-link nav-item font-semibold\" data-nav=\"\" href=\"{p}donasi.html\">{ICONS['heart']}<span>Donasi</span></a>
      <a class=\"nav-link nav-item\" data-nav=\"\" href=\"{p}relawan.html\">{ICONS['users']}<span>Relawan</span></a>
    </nav>

    <!-- LOGIN ICON -->
    <div class=\"desktop-login\">
      <a aria-label=\"Login\" class=\"login-icon\" href=\"{p}login.html\" title=\"Login / Daftar\">{ICONS['login']}</a>
    </div>

    <!-- MOBILE BUTTON -->
    <button aria-expanded=\"false\" aria-label=\"Buka menu\" class=\"lg:hidden text-3xl text-blue-700 mobile-btn order-3\" id=\"menuBtn\" type=\"button\">☰</button>

    <!-- QUICK BUTTON -->
    <button aria-expanded=\"false\" aria-label=\"Aksi cepat\" class=\"lg:hidden text-blue-700 mobile-btn order-1\" id=\"quickBtn\" type=\"button\">
      <svg aria-hidden=\"true\" class=\"w-7 h-7\" fill=\"currentColor\" viewBox=\"0 0 24 24\">
        <circle cx=\"6\" cy=\"6\" r=\"1.7\"></circle>
        <circle cx=\"12\" cy=\"6\" r=\"1.7\"></circle>
        <circle cx=\"18\" cy=\"6\" r=\"1.7\"></circle>
        <circle cx=\"6\" cy=\"12\" r=\"1.7\"></circle>
        <circle cx=\"12\" cy=\"12\" r=\"1.7\"></circle>
        <circle cx=\"18\" cy=\"12\" r=\"1.7\"></circle>
        <circle cx=\"6\" cy=\"18\" r=\"1.7\"></circle>
        <circle cx=\"12\" cy=\"18\" r=\"1.7\"></circle>
        <circle cx=\"18\" cy=\"18\" r=\"1.7\"></circle>
      </svg>
    </button>

  </div>
</div>

<!-- MOBILE MENU -->
<div class=\"hidden lg:hidden mobile-drawer\" id=\"mobileMenu\">
  <div class=\"mobile-panel px-6 py-6 space-y-4 text-gray-800\">

    <div class=\"mobile-drawer-head\">
      <div class=\"mobile-drawer-brand\">
        <img alt=\"Logo RAGE SOKMA\" class=\"mobile-drawer-logo\" src=\"{p}assets/images/logo.png\"/>
        <span class=\"mobile-drawer-title\">RAGE SOKMA</span>
      </div>
      <button aria-label=\"Tutup menu\" class=\"mobile-drawer-close\" id=\"mobileClose\" type=\"button\">
        <svg class=\"w-6 h-6\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.5\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M18 6 6 18\"></path><path d=\"M6 6l12 12\"></path></svg>
      </button>
    </div>

    <a class=\"block nav-link nav-item\" data-nav=\"\" href=\"{p}index.html\">{ICONS['home']}<span>Beranda</span></a>

    <details>
      <summary class=\"mobile-summary\">{ICONS['info']}<span>Tentang</span></summary>
      <div class=\"pl-4 mt-2 space-y-2\">
        <a class=\"mobile-sub\" data-nav=\"\" href=\"/tentang/sejarah.html\">Sejarah</a>
        <a class=\"mobile-sub\" data-nav=\"\" href=\"/tentang/visi-misi.html\">Visi &amp; Misi</a>
        <a class=\"mobile-sub\" data-nav=\"\" href=\"/tentang/pengurus.html\">Pengurus</a>
        <a class=\"mobile-sub\" data-nav=\"\" href=\"/tentang/program-kerja.html\">Program Kerja</a>
      </div>
    </details>

    <details>
      <summary class=\"mobile-summary\">{ICONS['spark']}<span>Program</span></summary>
      <div class=\"pl-4 mt-2 space-y-2\">
        <a class=\"mobile-sub\" data-nav=\"\" href=\"/program/santunan-yatim.html\">Santunan Anak Yatim</a>
        <a class=\"mobile-sub\" data-nav=\"\" href=\"/program/peduli-dhuafa.html\">Peduli Dhu’afa</a>
        <a class=\"mobile-sub\" data-nav=\"\" href=\"/program/sosial-keagamaan.html\">Sosial Keagamaan</a>
        <a class=\"mobile-sub font-semibold\" data-nav=\"\" href=\"{p}program.html\">Semua Program →</a>
      </div>
    </details>

    <a class=\"block nav-link nav-item\" data-nav=\"\" href=\"{p}transparansi.html\">{ICONS['chart']}<span>Transparansi</span></a>
    <a class=\"block nav-link nav-item font-semibold\" data-nav=\"\" href=\"{p}donasi.html\">{ICONS['heart']}<span>Donasi</span></a>
    <a class=\"block nav-link nav-item\" data-nav=\"\" href=\"{p}relawan.html\">{ICONS['users']}<span>Relawan</span></a>
    <a class=\"block nav-link nav-item\" data-nav=\"\" href=\"{p}kontak.html\">{ICONS['phone']}<span>Kontak</span></a>
    <a class=\"block nav-link nav-item\" data-nav=\"\" href=\"{p}faq.html\">{ICONS['help']}<span>FAQ</span></a>

    <a aria-label=\"Login\" class=\"mobile-login\" href=\"{p}login.html\">{ICONS['login']}<span class=\"ml-2\">Login</span></a>
  </div>
</div>

<!-- QUICK ACTION MENU (MOBILE) -->
<div class=\"hidden lg:hidden mobile-drawer mobile-drawer--right\" id=\"quickMenu\">
  <div class=\"mobile-panel px-6 py-6 text-gray-800\">
    <div class=\"mobile-drawer-head\">
      <div class=\"mobile-drawer-brand\">
        <img alt=\"Logo RAGE SOKMA\" class=\"mobile-drawer-logo\" src=\"{p}assets/images/logo.png\"/><span class=\"mobile-drawer-title\">AKSI CEPAT</span>
      </div>
      <button aria-label=\"Tutup aksi cepat\" class=\"mobile-drawer-close\" id=\"quickClose\" type=\"button\">
        <svg class=\"w-6 h-6\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.5\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M18 6 6 18\"></path><path d=\"M6 6l12 12\"></path></svg>
      </button>
    </div>

    <div class=\"quick-grid\">
      <a class=\"quick-item quick-item--donasi\" href=\"{p}donasi.html\"><span aria-hidden=\"true\" class=\"quick-emoji\">❤️</span><span class=\"quick-text\">Donasi</span></a>
      <a class=\"quick-item\" href=\"{p}relawan.html\"><span aria-hidden=\"true\" class=\"quick-emoji\">🤝</span><span class=\"quick-text\">Relawan</span></a>
      <a class=\"quick-item\" href=\"{p}program.html\"><span aria-hidden=\"true\" class=\"quick-emoji\">⭐</span><span class=\"quick-text\">Program Unggulan</span></a>
      <a class=\"quick-item\" href=\"{p}transparansi.html\"><span aria-hidden=\"true\" class=\"quick-emoji\">📊</span><span class=\"quick-text\">Transparansi</span></a>
      <a class=\"quick-item\" href=\"{p}transparansi.html#dokumen\"><span aria-hidden=\"true\" class=\"quick-emoji\">📄</span><span class=\"quick-text\">Laporan &amp; Dokumen</span></a>
      <a class=\"quick-item\" href=\"{p}semua-berita.html\"><span aria-hidden=\"true\" class=\"quick-emoji\">📰</span><span class=\"quick-text\">Berita</span></a>
      <a class=\"quick-item\" href=\"{p}gallery.html\"><span aria-hidden=\"true\" class=\"quick-emoji\">🖼️</span><span class=\"quick-text\">Galeri</span></a>
      <a class=\"quick-item\" href=\"{p}kontak.html#wa\"><span aria-hidden=\"true\" class=\"quick-emoji\">💬</span><span class=\"quick-text\">Hubungi (WA)</span></a>
    </div>
  </div>
</div>
</header>"""


def update_file(path: pathlib.Path) -> bool:
    text = path.read_text(encoding='utf-8')
    m = re.search(r"<header[\s\S]*?</header>", text, flags=re.IGNORECASE)
    if not m:
        return False
    depth = len(path.relative_to(ROOT).parts) - 1
    prefix = '../' if depth >= 1 else ''
    new_header = header(prefix)
    out = text[:m.start()] + new_header + text[m.end():]
    path.write_text(out, encoding='utf-8')
    return True

changed = 0
for p in ROOT.rglob('*.html'):
    if update_file(p):
        changed += 1
print('updated', changed, 'files')
