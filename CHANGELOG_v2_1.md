# CHANGELOG — RAGE SOKMA v2.1 (No Tailwind Dependency)

Tanggal: 2026-01-25

## Tujuan
Menghapus dependency Tailwind CSS tanpa merombak HTML besar-besaran dan tanpa mengubah tampilan secara signifikan.

## Perubahan Utama
- Menghapus file: `assets/tailwind.css`
- Menambahkan file: `assets/css/utilities.css`
  - Ini adalah stylesheet utilitas internal (subset) yang berisi rule yang dipakai oleh website.
  - File ini menggantikan peran Tailwind untuk class-class utilitas yang sudah terlanjur dipakai di HTML.

## Update HTML
- Semua halaman `.html` yang sebelumnya memuat `assets/tailwind.css` kini memuat `assets/css/utilities.css`.

## Catatan
- Nama class utilitas di HTML masih sama (mis. `mx-auto`, `max-w-7xl`, `bg-white/20`, dll.) agar perubahan aman.
- Jika ingin benar-benar menghilangkan utility-class dari HTML (menjadi class semantik seperti `.container`, `.btn`, `.card`), itu tahap refactor lanjutan (v2.2) karena membutuhkan rewrite markup dan testing visual per halaman.
