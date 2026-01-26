# CHANGELOG (Scalable v2)
Tanggal: 2026-01-25

## Fokus
Merapikan proyek agar lebih scalable, tanpa membongkar HTML (tetap kompatibel dengan utility class Tailwind yang sudah dipakai di markup).

## Yang diubah
- Menghapus file internal/dev dari paket produksi:
  - _apply_header_icons.py, _update_header.py
  - ARSITEKTUR_RINGAN.md, PANDUAN_EDIT_KONTEN.md, README_SEO.txt
- Menambahkan **Design Tokens** (CSS variables) untuk warna, radius, shadow, ring:
  - diletakkan di `assets/css/app.css`
- Membuat `assets/css/app.css` sebagai stylesheet utama:
  - berisi tokens + legacy style (untuk menjaga layout tetap stabil)
  - sebagian warna di-normalisasi ke variable (mis. primary, ink, muted)
- Mengalihkan seluruh HTML dari `style.css` → `app.css`
- Membersihkan duplikasi CSS yang identik (aman):
  - .gallery-tease-grid
  - .quick-follow__icon svg

## Catatan kompatibilitas
- `assets/tailwind.css` **tetap dipakai** di halaman artikel/berita karena banyak utility class sudah tertanam di HTML.
- `assets/css/style.css` masih disertakan sebagai legacy/rollback, namun tidak lagi dipanggil dari HTML.

## Next-step opsional (kalau mau lebih “v2 beneran”)
- Migrasi utility Tailwind ke class komponen sendiri (butuh rewrite HTML).
- Build pipeline (PostCSS/Tailwind) agar CSS utilitas bisa dipangkas otomatis.
