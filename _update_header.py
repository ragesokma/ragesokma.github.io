import os, re, pathlib

ROOT = pathlib.Path('/mnt/data/rage_v4')

SVG_LOGIN = """
<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"w-5 h-5\">
  <path d=\"M10 17l5-5-5-5\"/>
  <path d=\"M15 12H3\"/>
  <path d=\"M21 3v18\"/>
</svg>
""".strip()

def header(prefix: str):
    # Prefix should be '' for root pages, '../' for depth1
    p = prefix
    # Use data-nav for active matching
    return f"""<header id=\"siteHeader\" class=\"site-header sticky top-0 z-50\">
  <div class=\"max-w-7xl mx-auto px-6\">
    <div class=\"site-header__inner flex items-center justify-between h-20 transition-all duration-300\">

      <!-- LOGO -->
      <a href=\"{p}index.html\" class=\"flex items-center gap-3\">
        <img src=\"{p}assets/images/logo.png\" alt=\"Logo RAGE SOKMA\" class=\"site-logo h-12 w-auto transition-all duration-300\">
        <span class=\"font-bold text-blue-800 text-lg\">RAGE SOKMA</span>
      </a>

      <!-- NAV DESKTOP -->
      <nav class=\"hidden lg:flex items-center gap-8 text-gray-800 font-medium\" aria-label=\"Navigasi utama\">
        <a data-nav href=\"{p}index.html\" class=\"nav-link\">Beranda</a>

        <!-- Tentang (dropdown) -->
        <div class=\"relative group\">
          <button type=\"button\" class=\"nav-link nav-parent\" data-nav-parent=\"tentang\" aria-haspopup=\"true\" aria-label=\"Menu Tentang\">Tentang</button>
          <div class=\"absolute left-0 top-full pt-3\">
            <div class=\"w-56 glass-panel rounded-xl opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition\">
              <a data-nav href=\"{p}tentang/sejarah.html\" class=\"block px-4 py-3 hover:bg-white/20 rounded-t-xl\">Sejarah</a>
              <a data-nav href=\"{p}tentang/visi-misi.html\" class=\"block px-4 py-3 hover:bg-white/20\">Visi &amp; Misi</a>
              <a data-nav href=\"{p}tentang/pengurus.html\" class=\"block px-4 py-3 hover:bg-white/20\">Pengurus</a>
              <a data-nav href=\"{p}tentang/program-kerja.html\" class=\"block px-4 py-3 hover:bg-white/20 rounded-b-xl\">Program Kerja</a>
            </div>
          </div>
        </div>

        <!-- Program (dropdown) -->
        <div class=\"relative group\">
          <button type=\"button\" class=\"nav-link nav-parent\" data-nav-parent=\"kegiatan\" aria-haspopup=\"true\" aria-label=\"Menu Kegiatan\">Kegiatan</button>
          <div class=\"absolute left-0 top-full pt-3\">
            <div class=\"w-56 glass-panel rounded-xl opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition\">
              <a data-nav href=\"{p}program/santunan-yatim.html\" class=\"block px-4 py-3 hover:bg-white/20 rounded-t-xl\">Santunan Anak Yatim</a>
              <a data-nav href=\"{p}program/peduli-dhuafa.html\" class=\"block px-4 py-3 hover:bg-white/20\">Peduli Dhu'afa</a>
              <a data-nav href=\"{p}program/sosial-keagamaan.html\" class=\"block px-4 py-3 hover:bg-white/20 rounded-b-xl\">Sosial Keagamaan</a>
            </div>
          </div>
        </div>

        <a data-nav href=\"{p}gallery.html\" class=\"nav-link\">Galeri</a>
        <a data-nav href=\"{p}faq.html\" class=\"nav-link\">FAQ</a>
        <a data-nav href=\"{p}transparansi.html\" class=\"nav-link\">Transparansi</a>
        <a data-nav href=\"{p}kontak.html\" class=\"nav-link\">Kontak</a>
        <a data-nav href=\"{p}donasi.html\" class=\"nav-link font-semibold\">Donasi</a>
        <a data-nav href=\"{p}relawan.html\" class=\"nav-link\">Relawan</a>
      </nav>

      <!-- LOGIN ICON -->
      <div class=\"hidden lg:flex\">
        <a href=\"{p}login.html\" class=\"login-icon\" aria-label=\"Login\" title=\"Login / Daftar\">{SVG_LOGIN}</a>
      </div>

      <!-- MOBILE BUTTON -->
      <button id=\"menuBtn\" type=\"button\" aria-label=\"Buka menu\" aria-expanded=\"false\" class=\"lg:hidden text-3xl text-blue-700\">☰</button>
    </div>
  </div>

  <!-- MOBILE MENU -->
  <div id=\"mobileMenu\" class=\"hidden lg:hidden\">
    <div class=\"mobile-panel px-6 py-6 space-y-4 text-gray-800\">
      <a data-nav href=\"{p}index.html\" class=\"block nav-link\">Beranda</a>

      <details>
        <summary class=\"cursor-pointer font-semibold\">Tentang</summary>
        <div class=\"pl-4 mt-2 space-y-2\">
          <a data-nav href=\"{p}tentang/sejarah.html\">Sejarah</a><br>
          <a data-nav href=\"{p}tentang/visi-misi.html\">Visi &amp; Misi</a><br>
          <a data-nav href=\"{p}tentang/pengurus.html\">Pengurus</a><br>
          <a data-nav href=\"{p}tentang/program-kerja.html\">Program Kerja</a>
        </div>
      </details>

      <details>
        <summary class=\"cursor-pointer font-semibold\">Kegiatan</summary>
        <div class=\"pl-4 mt-2 space-y-2\">
          <a data-nav href=\"{p}program/santunan-yatim.html\">Santunan Anak Yatim</a><br>
          <a data-nav href=\"{p}program/peduli-dhuafa.html\">Peduli Dhu'afa</a><br>
          <a data-nav href=\"{p}program/sosial-keagamaan.html\">Sosial Keagamaan</a>
        </div>
      </details>

      <a data-nav href=\"{p}gallery.html\" class=\"block nav-link\">Galeri</a>
      <a data-nav href=\"{p}faq.html\" class=\"block nav-link\">FAQ</a>
      <a data-nav href=\"{p}transparansi.html\" class=\"block nav-link\">Transparansi</a>
      <a data-nav href=\"{p}kontak.html\" class=\"block nav-link\">Kontak</a>
      <a data-nav href=\"{p}donasi.html\" class=\"block nav-link font-semibold\">Donasi</a>
      <a data-nav href=\"{p}relawan.html\" class=\"block nav-link\">Relawan</a>

      <a href=\"{p}login.html\" class=\"mobile-login\" aria-label=\"Login\">{SVG_LOGIN}<span class=\"ml-2\">Login</span></a>
    </div>
  </div>
</header>"""


def update_file(path: pathlib.Path):
    text = path.read_text(encoding='utf-8')
    # find header block
    m = re.search(r"<header[\s\S]*?</header>", text, flags=re.IGNORECASE)
    if not m:
        return False
    depth = len(path.relative_to(ROOT).parts) - 1
    prefix = '../' if depth >= 1 else ''
    new = header(prefix)
    out = text[:m.start()] + new + text[m.end():]
    path.write_text(out, encoding='utf-8')
    return True

changed = 0
for p in ROOT.rglob('*.html'):
    if update_file(p):
        changed += 1

print('updated', changed, 'files')
