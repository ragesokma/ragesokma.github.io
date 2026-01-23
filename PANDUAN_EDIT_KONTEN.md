# Panduan Edit Konten (Berita/Artikel) via `posts.json`

## 1) Menambah berita/artikel baru
Buka: `assets/data/posts.json`

Tambahkan 1 objek baru di paling atas (agar dianggap paling terbaru), contoh:

```json
{
  "id": "berita-2026-01-23-001",
  "type": "berita",
  "title": "Judul Berita",
  "date": "2026-01-23",
  "category": "Kegiatan",
  "cover": "/assets/img/berita/contoh.jpg",
  "excerpt": "Ringkasan singkat 1–2 kalimat.",
  "url": "/berita/judul-berita.html"
}
```

**Wajib konsisten:**
- `type`: `berita` atau `artikel`
- `date`: format `YYYY-MM-DD`
- `url`: wajib root-relative (diawali `/`)
- `cover`: wajib root-relative (diawali `/`)

## 2) Menambah file halaman detail
- Buat file HTML baru di:
  - `berita/slug.html` untuk berita
  - `artikel/slug.html` untuk artikel

**Tips slug:** pakai huruf kecil + strip, contoh: `baksos-januari-2026.html`

## 3) Menambah gambar cover
- Simpan gambar di folder yang konsisten, misalnya:
  - `assets/img/berita/` untuk berita
  - `assets/img/artikel/` untuk artikel

Lalu isi field `cover` menunjuk ke file tersebut.

## 4) Checklist cepat sebelum upload
- [ ] Link `url` dan `cover` diawali `/`
- [ ] File HTML detailnya benar-benar ada
- [ ] Gambar cover benar-benar ada
- [ ] JSON valid (tidak ada koma berlebih)

## 5) Publish
Upload (replace) file yang berubah:
- `assets/data/posts.json`
- file HTML detail baru
- gambar cover baru

