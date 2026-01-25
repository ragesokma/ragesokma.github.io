# Arsitektur Paling Ringan (Statis Murni)

Website ini **100% statis**: cukup upload folder ke hosting (cPanel/File Manager), GitHub Pages, Netlify, atau Vercel static.
Tidak perlu database, tidak perlu backend, dan **tidak wajib** proses build.

## Struktur folder (disarankan tetap)
- `index.html` — beranda
- `program.html` — landing program
- `semua-berita.html` — listing berita
- `gallery.html` — galeri
- `daftar.html`, `donasi.html`, `kontak.html`, `daftar-relawan.html` — halaman aksi
- `tentang/` — halaman tentang
- `program/` — halaman detail program
- `berita/` — halaman detail berita
- `artikel/` — halaman detail artikel
- `assets/`
  - `assets/css/` — CSS
  - `assets/js/` — JS
  - `assets/img/` — gambar
  - `assets/data/posts.json` — **pusat data konten** (berita/artikel)
  - `assets/data/impact.json` — data dampak/statistik

## Prinsip utama
1) **Link root-relative**
   - Gunakan format: `href="/program/santunan-yatim.html"`.
   - Ini membuat link aman dari error dobel folder saat halaman berada di subfolder.

2) **Data konten terpusat**
   - Konten berita/artikel disimpan di `assets/data/posts.json`.
   - Halaman listing/hero mengambil data dari JSON (via JS).

3) **Tidak ada build step wajib**
   - Semua perubahan bisa dilakukan langsung di file HTML/CSS/JS dan `posts.json`.
   - Kalau Anda mau fitur tambahan (mis. sitemap otomatis), itu **opsional** (lihat catatan di bawah).

## Catatan opsional (tanpa mengubah arsitektur)
- `sitemap.xml` dan `robots.txt` tetap bisa diedit manual.
- Kalau suatu saat ingin otomatis, Anda bisa jalankan script generator di laptop (sekali) lalu upload hasilnya.

