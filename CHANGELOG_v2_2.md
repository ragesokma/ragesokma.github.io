# CHANGELOG — V2.2 Ultra-Pro (WebP + Responsive Images)

Tanggal: 2026-01-25

## Fokus
Optimasi performa (khususnya mobile) dengan mengurangi ukuran aset gambar dan mempercepat waktu loading.

## Perubahan Utama
- Semua gambar konten (JPG/PNG) dikonversi ke **WebP**.
- Dibuat **varian responsif** untuk hampir semua gambar (contoh: `.jpg`, `.jpg`, `.jpg`) dan ditambahkan `srcset` + `sizes` pada tag `<img>`.
- Referensi gambar di HTML/CSS/JS/JSON sudah diubah ke `.jpg`.
- File gambar lama (JPG/PNG) **dibersihkan** untuk mengurangi ukuran total paket (kecuali `logo.png` untuk favicon).

## Catatan Kompatibilitas
- Browser modern mendukung WebP secara native.
- `logo.png` tetap disimpan untuk favicon (`rel="icon"` & `apple-touch-icon`).

## Dampak
- Ukuran paket turun signifikan.
- Loading di mobile lebih cepat dan lebih hemat kuota.
