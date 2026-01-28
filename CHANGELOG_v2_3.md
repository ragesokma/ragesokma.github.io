# RAGE SOKMA V2.3

Tanggal: 2026-01-28

## UI / Micro-interaction
- Hero: cross-fade lebih halus + subtle zoom (easing) untuk transisi slide.
- Hero title: hover lebih "hidup" (lift + glow + underline animasi), tetap aksesibel via focus-visible.

## Design system
- Tambah token ringan (radius + shadow + border) via CSS variables untuk konsistensi.
- Glass panel menggunakan token shadow + radius.

## Performance
- Hero: lazy-apply background image (pakai `data-bg`) dan preload image untuk slide pertama.
- Hero: prefetch ringan untuk image slide berikutnya saat slide aktif.
