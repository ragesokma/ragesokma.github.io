(function(){
  const HEADER_HTML = "<header class=\"site-header sticky top-0 z-50\" id=\"siteHeader\">\n<div class=\"max-w-7xl mx-auto px-6\">\n<div class=\"site-header__inner flex items-center justify-between h-16 lg:h-20 transition-all duration-300\">\n<!-- LOGO -->\n<a class=\"site-brand site-brand--desktop flex items-center gap-2\" href=\"index.html\">\n<img alt=\"Logo RAGE SOKMA\" class=\"site-logo h-9 lg:h-11 w-auto transition-all duration-300\" decoding=\"async\" height=\"516\" loading=\"lazy\" src=\"assets/images/logo.webp\" width=\"484\"/>\n<span class=\"site-title\">RAGE SOKMA</span>\n</a>\n<!-- NAV DESKTOP -->\n<nav aria-label=\"Navigasi utama\" class=\"items-center text-gray-800 font-medium desktop-nav\">\n<a class=\"nav-link nav-item\" data-nav=\"\" href=\"index.html\"><svg aria-hidden=\"true\" class=\"nav-ico\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><path d=\"M3 11l9-8 9 8\"></path><path d=\"M5 10v10h14V10\"></path><path d=\"M9 20v-6h6v6\"></path></svg><span>Beranda</span></a>\n<!-- Tentang (dropdown) -->\n<div class=\"relative\">\n<button aria-haspopup=\"true\" aria-label=\"Menu Tentang\" class=\"nav-link nav-parent nav-item peer\" data-nav-parent=\"tentang\" type=\"button\"><svg aria-hidden=\"true\" class=\"nav-ico\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"M12 16v-4\"></path><path d=\"M12 8h.01\"></path></svg><span>Tentang</span> </button>\n<div class=\"absolute left-0 top-full pt-3 hidden peer-hover:block peer-focus:block hover:block\">\n<div class=\"w-56 glass-panel rounded-xl\">\n<a class=\"block px-4 py-3 hover:bg-white/20 rounded-t-xl\" data-nav=\"\" href=\"tentang/sejarah.html\">Sejarah</a>\n<a class=\"block px-4 py-3 hover:bg-white/20\" data-nav=\"\" href=\"tentang/visi-misi.html\">Visi &amp; Misi</a>\n<a class=\"block px-4 py-3 hover:bg-white/20\" data-nav=\"\" href=\"tentang/pengurus.html\">Pengurus</a>\n<a class=\"block px-4 py-3 hover:bg-white/20 rounded-b-xl\" data-nav=\"\" href=\"tentang/program-kerja.html\">Program Kerja</a>\n</div>\n</div>\n</div>\n<!-- Program (dropdown) -->\n<div class=\"relative\">\n<button aria-haspopup=\"true\" aria-label=\"Menu Program\" class=\"nav-link nav-parent nav-item peer\" data-nav-parent=\"program\" type=\"button\"><svg aria-hidden=\"true\" class=\"nav-ico\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><path d=\"M12 2l1.2 5.2L18 9l-4.8 1.8L12 16l-1.2-5.2L6 9l4.8-1.8L12 2z\"></path><path d=\"M19 14l.7 3 2.3 1-.0 0-2.3 1-.7 3-.7-3-2.3-1 2.3-1 .7-3z\"></path></svg><span>Program</span> </button>\n<div class=\"absolute left-0 top-full pt-3 hidden peer-hover:block peer-focus:block hover:block\">\n<div class=\"w-72 glass-panel rounded-xl\">\n<a class=\"block px-4 py-3 hover:bg-white/20 rounded-t-xl\" data-nav=\"\" href=\"program/santunan-yatim.html\">Santunan Anak Yatim</a>\n<a class=\"block px-4 py-3 hover:bg-white/20\" data-nav=\"\" href=\"program/peduli-dhuafa.html\">Peduli Dhu\u2019afa</a>\n<a class=\"block px-4 py-3 hover:bg-white/20\" data-nav=\"\" href=\"program/sosial-keagamaan.html\">Sosial Keagamaan</a>\n<a class=\"block px-4 py-3 hover:bg-white/20 rounded-b-xl font-semibold\" data-nav=\"\" href=\"program.html\">Semua Program \u2192</a>\n</div>\n</div>\n</div>\n<a class=\"nav-link nav-item\" data-nav=\"\" href=\"faq.html\"><svg aria-hidden=\"true\" class=\"nav-ico\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"M9.1 9a3 3 0 1 1 5.8 1c0 2-3 2-3 4\"></path><path d=\"M12 17h.01\"></path></svg><span>FAQ</span></a>\n<a class=\"nav-link nav-item\" data-nav=\"\" href=\"transparansi.html\"><svg aria-hidden=\"true\" class=\"nav-ico\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><path d=\"M3 3v18h18\"></path><path d=\"M7 14l3-3 3 3 5-6\"></path></svg><span>Transparansi</span></a>\n<a class=\"nav-link nav-item\" data-nav=\"\" href=\"kontak.html\"><svg aria-hidden=\"true\" class=\"nav-ico\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><path d=\"M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1A19.5 19.5 0 0 1 3.2 12.8 19.8 19.8 0 0 1 .1 4.2 2 2 0 0 1 2.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .6 3a2 2 0 0 1-.5 2.1L6 10a16 16 0 0 0 8 8l1.2-1.2a2 2 0 0 1 2.1-.5c1 .3 2 .5 3 .6a2 2 0 0 1 1.7 2z\"></path></svg><span>Kontak</span></a>\n<a class=\"nav-link nav-item font-semibold\" data-nav=\"\" href=\"donasi.html\"><svg aria-hidden=\"true\" class=\"nav-ico\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><path d=\"M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.6z\"></path></svg><span>Donasi</span></a>\n<a class=\"nav-link nav-item\" data-nav=\"\" href=\"relawan.html\"><svg aria-hidden=\"true\" class=\"nav-ico\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><path d=\"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\"></path><circle cx=\"9\" cy=\"7\" r=\"4\"></circle><path d=\"M23 21v-2a4 4 0 0 0-3-3.87\"></path><path d=\"M16 3.13a4 4 0 0 1 0 7.75\"></path></svg><span>Relawan</span></a>\n</nav>\n<!-- DESKTOP LOGIN -->\n<div class=\"desktop-login\">\n<button id=\"searchBtnDesktop\" class=\"rs-search-btn rs-search-btn--desktop\" type=\"button\" aria-label=\"Cari berita\" title=\"Cari berita\"><svg aria-hidden=\"true\" width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"11\" cy=\"11\" r=\"7\"></circle><path d=\"M21 21l-4.3-4.3\"></path></svg></button>\n<a aria-label=\"Login\" class=\"login-icon\" href=\"login.html\" title=\"Login / Daftar\"><svg aria-hidden=\"true\" fill=\"none\" height=\"24\" width=\"24\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.2\"><circle cx=\"12\" cy=\"12\" r=\"10\"></circle><circle cx=\"12\" cy=\"10\" r=\"3\"></circle><path d=\"M6.5 20a6.5 6.5 0 0 1 11 0\"></path></svg></a>\n</div>\n\n<!-- MOBILE LEFT CONTROLS -->\n<div class=\"lg:hidden mobile-left\">\n  \n<button aria-expanded=\"false\" aria-label=\"Aksi cepat\" class=\"lg:hidden text-blue-700 mobile-btn\" id=\"quickBtn\" type=\"button\">\n<svg aria-hidden=\"true\" class=\"w-7 h-7\" fill=\"currentColor\" viewbox=\"0 0 24 24\">\n<circle cx=\"6\" cy=\"6\" r=\"1.7\"></circle>\n<circle cx=\"12\" cy=\"6\" r=\"1.7\"></circle>\n<circle cx=\"18\" cy=\"6\" r=\"1.7\"></circle>\n<circle cx=\"6\" cy=\"12\" r=\"1.7\"></circle>\n<circle cx=\"12\" cy=\"12\" r=\"1.7\"></circle>\n<circle cx=\"18\" cy=\"12\" r=\"1.7\"></circle>\n<circle cx=\"6\" cy=\"18\" r=\"1.7\"></circle>\n<circle cx=\"12\" cy=\"18\" r=\"1.7\"></circle>\n<circle cx=\"18\" cy=\"18\" r=\"1.7\"></circle>\n</svg>\n</button>\n<a class=\"site-brand site-brand--mobile flex items-center gap-2\" href=\"index.html\">\n    <img alt=\"Logo RAGE SOKMA\" class=\"site-logo h-9 lg:h-11 w-auto transition-all duration-300\" decoding=\"async\" height=\"516\" loading=\"eager\" src=\"assets/images/logo.webp\" width=\"484\"/>\n    <span class=\"site-title\">RAGE SOKMA</span>\n  </a>\n</div>\n<!-- MOBILE RIGHT CONTROLS -->\n<div class=\"lg:hidden mobile-right\">\n\n  <button id=\"searchBtn\" class=\"rs-search-btn\" type=\"button\" aria-label=\"Cari berita\" title=\"Cari berita\"><svg aria-hidden=\"true\" width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"11\" cy=\"11\" r=\"7\"></circle><path d=\"M21 21l-4.3-4.3\"></path></svg></button>\n  <button aria-expanded=\"false\" aria-label=\"Buka menu\" class=\"lg:hidden text-3xl text-blue-700 mobile-btn\" id=\"menuBtn\" type=\"button\">\u2630</button>\n</div>\n</div>\n</div>\n<!-- MOBILE MENU -->\n<div class=\"hidden lg:hidden mobile-drawer\" id=\"mobileMenu\">\n<div class=\"mobile-panel px-6 py-6 space-y-4 text-gray-800\">\n<div class=\"mobile-drawer-head\">\n<div class=\"mobile-drawer-brand\">\n<img alt=\"Logo RAGE SOKMA\" class=\"mobile-drawer-logo\" decoding=\"async\" height=\"516\" loading=\"lazy\" src=\"assets/images/logo.webp\" width=\"484\"/>\n<span class=\"mobile-drawer-title\">Menu</span>\n</div>\n<button aria-label=\"Tutup menu\" class=\"mobile-drawer-close\" id=\"mobileClose\" type=\"button\">\n<svg class=\"w-6 h-6\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.5\" viewbox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M18 6 6 18\"></path><path d=\"M6 6l12 12\"></path></svg>\n</button>\n</div>\n<a class=\"drawer-item\" data-nav=\"\" href=\"index.html\"><svg aria-hidden=\"true\" class=\"nav-ico\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><path d=\"M3 11l9-8 9 8\"></path><path d=\"M5 10v10h14V10\"></path><path d=\"M9 20v-6h6v6\"></path></svg><span>Beranda</span></a>\n<button aria-controls=\"acc-panel-tentang\" aria-expanded=\"false\" class=\"drawer-acc-btn drawer-item\" data-acc=\"tentang\" type=\"button\">\n<span class=\"drawer-acc-left\"><svg aria-hidden=\"true\" class=\"nav-ico\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"M12 16v-4\"></path><path d=\"M12 8h.01\"></path></svg><span class=\"drawer-acc-title\">Tentang</span></span>\n<svg aria-hidden=\"true\" class=\"drawer-chevron\" fill=\"none\" viewbox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M6 9l6 6 6-6\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"></path>\n</svg>\n</button>\n<div class=\"drawer-acc-panel\" data-acc-panel=\"tentang\" hidden=\"\" id=\"acc-panel-tentang\">\n<a class=\"drawer-sub-link\" data-nav=\"\" href=\"tentang/sejarah.html\">Sejarah</a>\n<a class=\"drawer-sub-link\" data-nav=\"\" href=\"tentang/visi-misi.html\">Visi &amp; Misi</a>\n<a class=\"drawer-sub-link\" data-nav=\"\" href=\"tentang/pengurus.html\">Pengurus</a>\n<a class=\"drawer-sub-link\" data-nav=\"\" href=\"tentang/program-kerja.html\">Program Kerja</a>\n</div>\n<button aria-controls=\"acc-panel-program\" aria-expanded=\"false\" class=\"drawer-acc-btn drawer-item\" data-acc=\"program\" type=\"button\">\n<span class=\"drawer-acc-left\"><svg aria-hidden=\"true\" class=\"nav-ico\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><path d=\"M12 2l1.2 5.2L18 9l-4.8 1.8L12 16l-1.2-5.2L6 9l4.8-1.8L12 2z\"></path><path d=\"M19 14l.7 3 2.3 1-.0 0-2.3 1-.7 3-.7-3-2.3-1 2.3-1 .7-3z\"></path></svg><span class=\"drawer-acc-title\">Program</span></span>\n<svg aria-hidden=\"true\" class=\"drawer-chevron\" fill=\"none\" viewbox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M6 9l6 6 6-6\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"></path>\n</svg>\n</button>\n<div class=\"drawer-acc-panel\" data-acc-panel=\"program\" hidden=\"\" id=\"acc-panel-program\">\n<a class=\"drawer-sub-link\" data-nav=\"\" href=\"program/santunan-yatim.html\">Santunan Anak Yatim</a>\n<a class=\"drawer-sub-link\" data-nav=\"\" href=\"program/peduli-dhuafa.html\">Peduli Dhu\u2019afa</a>\n<a class=\"drawer-sub-link\" data-nav=\"\" href=\"program/sosial-keagamaan.html\">Sosial Keagamaan</a>\n<a class=\"drawer-sub-link\" data-nav=\"\" href=\"program.html\">Semua Program \u2192</a>\n</div>\n<a class=\"drawer-item\" data-nav=\"\" href=\"transparansi.html\"><svg aria-hidden=\"true\" class=\"nav-ico\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><path d=\"M3 3v18h18\"></path><path d=\"M7 14l3-3 3 3 5-6\"></path></svg><span>Transparansi</span></a>\n<a class=\"drawer-item font-semibold\" data-nav=\"\" href=\"donasi.html\"><svg aria-hidden=\"true\" class=\"nav-ico\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><path d=\"M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.6z\"></path></svg><span>Donasi</span></a>\n<a class=\"drawer-item\" data-nav=\"\" href=\"relawan.html\"><svg aria-hidden=\"true\" class=\"nav-ico\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><path d=\"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\"></path><circle cx=\"9\" cy=\"7\" r=\"4\"></circle><path d=\"M23 21v-2a4 4 0 0 0-3-3.87\"></path><path d=\"M16 3.13a4 4 0 0 1 0 7.75\"></path></svg><span>Relawan</span></a>\n<a class=\"drawer-item\" data-nav=\"\" href=\"kontak.html\"><svg aria-hidden=\"true\" class=\"nav-ico\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><path d=\"M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1A19.5 19.5 0 0 1 3.2 12.8 19.8 19.8 0 0 1 .1 4.2 2 2 0 0 1 2.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .6 3a2 2 0 0 1-.5 2.1L6 10a16 16 0 0 0 8 8l1.2-1.2a2 2 0 0 1 2.1-.5c1 .3 2 .5 3 .6a2 2 0 0 1 1.7 2z\"></path></svg><span>Kontak</span></a>\n<a class=\"drawer-item\" data-nav=\"\" href=\"faq.html\"><svg aria-hidden=\"true\" class=\"nav-ico\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"M9.1 9a3 3 0 1 1 5.8 1c0 2-3 2-3 4\"></path><path d=\"M12 17h.01\"></path></svg><span>FAQ</span></a>\n<a class=\"drawer-item\" data-nav=\"\" href=\"login.html\"><svg aria-hidden=\"true\" class=\"nav-ico\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><path d=\"M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4\"></path><polyline points=\"10 17 15 12 10 7\"></polyline><line x1=\"15\" x2=\"3\" y1=\"12\" y2=\"12\"></line></svg><span>Login</span></a>\n</div>\n</div>\n<!-- QUICK ACTION MENU (MOBILE) -->\n<div class=\"hidden lg:hidden mobile-drawer mobile-drawer--right\" id=\"quickMenu\">\n<div class=\"mobile-panel px-6 py-6 text-gray-800\">\n<div class=\"mobile-drawer-head\">\n<div class=\"mobile-drawer-brand\">\n<img alt=\"Logo RAGE SOKMA\" class=\"mobile-drawer-logo\" decoding=\"async\" height=\"516\" loading=\"lazy\" src=\"assets/images/logo.webp\" width=\"484\"/><span class=\"mobile-drawer-title\">APLIKASI</span>\n</div>\n<button aria-label=\"Tutup aksi cepat\" class=\"mobile-drawer-close\" id=\"quickClose\" type=\"button\">\n<svg class=\"w-6 h-6\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.5\" viewbox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M18 6 6 18\"></path><path d=\"M6 6l12 12\"></path></svg>\n</button>\n</div>\n<div class=\"quick-grid\">\n<a class=\"quick-item quick-item--donasi\" href=\"donasi.html\"><span aria-hidden=\"true\" class=\"quick-emoji\">\u2764\ufe0f</span><span class=\"quick-text\">Donasi</span></a>\n<a class=\"quick-item\" href=\"relawan.html\"><span aria-hidden=\"true\" class=\"quick-emoji\">\ud83e\udd1d</span><span class=\"quick-text\">Relawan</span></a>\n<a class=\"quick-item\" href=\"program.html\"><span aria-hidden=\"true\" class=\"quick-emoji\">\u2b50</span><span class=\"quick-text\">Program Unggulan</span></a>\n<a class=\"quick-item\" href=\"transparansi.html\"><span aria-hidden=\"true\" class=\"quick-emoji\">\ud83d\udcca</span><span class=\"quick-text\">Transparansi</span></a>\n<a class=\"quick-item\" href=\"transparansi.html#dokumen\"><span aria-hidden=\"true\" class=\"quick-emoji\">\ud83d\udcc4</span><span class=\"quick-text\">Laporan &amp; Dokumen</span></a>\n<a class=\"quick-item\" href=\"semua-berita.html\"><span aria-hidden=\"true\" class=\"quick-emoji\">\ud83d\udcf0</span><span class=\"quick-text\">Berita</span></a>\n<a class=\"quick-item\" href=\"gallery.html\"><span aria-hidden=\"true\" class=\"quick-emoji\">\ud83d\uddbc\ufe0f</span><span class=\"quick-text\">Galeri</span></a>\n<a class=\"quick-item\" href=\"kontak.html#wa\"><span aria-hidden=\"true\" class=\"quick-emoji\">\ud83d\udcac</span><span class=\"quick-text\">Hubungi (WA)</span></a>\n</div>\n<div class=\"drawer-footer\" id=\"quickDrawerFooter\">\n<div class=\"drawer-acc\" data-acc=\"lainnya\">\n<button aria-expanded=\"false\" class=\"drawer-acc-btn\" type=\"button\">\n<span class=\"drawer-acc-label\"><svg aria-hidden=\"true\" class=\"drawer-acc-ico\" fill=\"none\" viewbox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"5\" cy=\"12\" fill=\"currentColor\" r=\"1.8\"></circle><circle cx=\"12\" cy=\"12\" fill=\"currentColor\" r=\"1.8\"></circle><circle cx=\"19\" cy=\"12\" fill=\"currentColor\" r=\"1.8\"></circle></svg><span class=\"drawer-acc-title\">Lainnya</span></span>\n<svg aria-hidden=\"true\" class=\"drawer-chevron\" fill=\"none\" viewbox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M6 9l6 6 6-6\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"></path>\n</svg>\n</button>\n<div class=\"drawer-acc-panel\" hidden=\"\">\n<a class=\"drawer-footer-link\" href=\"faq.html\"><svg aria-hidden=\"true\" class=\"drawer-footer-ico\" fill=\"none\" viewbox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"12\" cy=\"12\" r=\"10\" stroke=\"currentColor\" stroke-width=\"2\"></circle><path d=\"M9.1 9a3 3 0 1 1 5.8 1c0 2-3 2-3 4\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"></path><path d=\"M12 17h.01\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"></path></svg><span>FAQ</span></a>\n<a class=\"drawer-footer-link\" href=\"privacy-policy.html\"><svg aria-hidden=\"true\" class=\"drawer-footer-ico\" fill=\"none\" viewbox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M12 2l8 4v6c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V6l8-4z\" stroke=\"currentColor\" stroke-linejoin=\"round\" stroke-width=\"2\"></path><path d=\"M9.5 12a2.5 2.5 0 0 1 5 0v2.5H9.5V12z\" stroke=\"currentColor\" stroke-linejoin=\"round\" stroke-width=\"2\"></path><path d=\"M12 14.5v2\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-width=\"2\"></path></svg><span>Kebijakan Privasi</span></a>\n</div>\n</div>\n<div class=\"drawer-acc\" data-acc=\"ikuti\">\n<button aria-expanded=\"false\" class=\"drawer-acc-btn\" type=\"button\">\n<span class=\"drawer-acc-label\"><svg aria-hidden=\"true\" class=\"drawer-acc-ico\" fill=\"none\" viewbox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"18\" cy=\"5\" r=\"3\" stroke=\"currentColor\" stroke-width=\"2\"></circle><circle cx=\"6\" cy=\"12\" r=\"3\" stroke=\"currentColor\" stroke-width=\"2\"></circle><circle cx=\"18\" cy=\"19\" r=\"3\" stroke=\"currentColor\" stroke-width=\"2\"></circle><path d=\"M8.6 10.9l6.8-3.9\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"></path><path d=\"M8.6 13.1l6.8 3.9\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"></path></svg><span class=\"drawer-acc-title\">Ikuti kami</span></span>\n<svg aria-hidden=\"true\" class=\"drawer-chevron\" fill=\"none\" viewbox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M6 9l6 6 6-6\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"></path>\n</svg>\n</button>\n<div class=\"drawer-acc-panel\" hidden=\"\">\n<a class=\"drawer-footer-link\" href=\"https://www.facebook.com/profile.php?id=61552373463791\" rel=\"noopener\" target=\"_blank\"><svg aria-hidden=\"true\" class=\"drawer-footer-ico\" fill=\"none\" viewbox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M14 8h3V5h-3c-2.2 0-4 1.8-4 4v3H7v3h3v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1z\" fill=\"currentColor\"></path></svg><span>Facebook</span></a>\n<a class=\"drawer-footer-link\" href=\"https://www.instagram.com/paguyuban_ragesokma/\" rel=\"noopener\" target=\"_blank\"><svg aria-hidden=\"true\" class=\"drawer-footer-ico\" fill=\"none\" viewbox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><rect height=\"18\" rx=\"5\" stroke=\"currentColor\" stroke-width=\"2\" width=\"18\" x=\"3\" y=\"3\"></rect><circle cx=\"12\" cy=\"12\" r=\"4\" stroke=\"currentColor\" stroke-width=\"2\"></circle><circle cx=\"17.5\" cy=\"6.5\" fill=\"currentColor\" r=\"1\"></circle></svg><span>Instagram</span></a>\n</div>\n</div>\n</div>\n</div>\n</div>\n</header>";

  const HEADER_MOUNT_ID = 'headerMount';

  function unhide() {
    try { document.documentElement.style.visibility = 'visible'; } catch (e) {}
  }
  // Safety: never keep the page hidden
  setTimeout(unhide, 200);

  function getBasePrefix() {
    const path = location.pathname.replace(/\/+/, '/');
    const parts = path.split('/').filter(Boolean);
    if (parts.length === 0) return '';
    // remove filename
    parts.pop();
    return '../'.repeat(parts.length);
  }

  function rewritePaths(scope, base) {
    const skip = (v) =>
      !v || v.startsWith('http') || v.startsWith('//') || v.startsWith('#') ||
      v.startsWith('mailto:') || v.startsWith('tel:');

    scope.querySelectorAll('[href]').forEach((el) => {
      const v = el.getAttribute('href');
      if (skip(v)) return;
      el.setAttribute('href', base + v.replace(/^\/+/, ''));
    });

    scope.querySelectorAll('[src]').forEach((el) => {
      const v = el.getAttribute('src');
      if (!v || v.startsWith('http') || v.startsWith('//')) return;
      el.setAttribute('src', base + v.replace(/^\/+/, ''));
    });
  }

  function initShrinkShadow() {
    const header = document.getElementById('siteHeader');
    if (!header) return;

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        if (y > 40) header.classList.add('shrink');
        else header.classList.remove('shrink');
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initMobileToggles() {
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileClose = document.getElementById('mobileClose');

    const quickBtn = document.getElementById('quickBtn');
    const quickMenu = document.getElementById('quickMenu');
    const quickClose = document.getElementById('quickClose');

    const lock = () => document.documentElement.classList.add('no-scroll');
    const unlock = () => document.documentElement.classList.remove('no-scroll');

    function open(el, btn) {
      if (!el) return;
      el.classList.remove('hidden');
      if (btn) btn.setAttribute('aria-expanded', 'true');
      lock();
    }
    function close(el, btn) {
      if (!el) return;
      el.classList.add('hidden');
      if (btn) btn.setAttribute('aria-expanded', 'false');
      const anyOpen =
        (mobileMenu && !mobileMenu.classList.contains('hidden')) ||
        (quickMenu && !quickMenu.classList.contains('hidden'));
      if (!anyOpen) unlock();
    }
    function toggle(el, btn) {
      if (!el) return;
      el.classList.contains('hidden') ? open(el, btn) : close(el, btn);
    }

    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener('click', () => toggle(mobileMenu, menuBtn));
      if (mobileClose) mobileClose.addEventListener('click', () => close(mobileMenu, menuBtn));
      mobileMenu.querySelectorAll('a').forEach((a) =>
        a.addEventListener('click', () => close(mobileMenu, menuBtn))
      );
    }

    if (quickBtn && quickMenu) {
      quickBtn.addEventListener('click', () => toggle(quickMenu, quickBtn));
      if (quickClose) quickClose.addEventListener('click', () => close(quickMenu, quickBtn));
      quickMenu.querySelectorAll('a').forEach((a) =>
        a.addEventListener('click', () => close(quickMenu, quickBtn))
      );
    }
  }

  function mountHeader() {
    const mount = document.getElementById(HEADER_MOUNT_ID);
    if (!mount) { unhide(); return; }

    // Normalize mobile visibility classes
    const html = HEADER_HTML.replace(/\blg:hidden\b/g, 'ss-lg-hidden');
    mount.innerHTML = html;

    rewritePaths(mount, getBasePrefix());

    initMobileToggles();
    initShrinkShadow();

    unhide();
  }

  try {
    mountHeader();
  } catch (e) {
    unhide();
  }
})();
