# Data Management & Responsive Tables

Dokumen ini mendefinisikan desain antarmuka pengelolaan data administratif pada fitur **Kelola Pengguna**, **Bank Soal**, **Jadwal Ujian**, dan **Lihat Nilai** mengikuti tema **Neo-Brutalism Amber**.

---

## 1. Transformasi Responsif: Tabel ke Kartu Bertumpuk (Table-to-Card Pattern)

Tabel multi-kolom tradisional sangat sulit dibaca di layar ponsel sempit (< 640px) dan memaksa pengguna melakukan geser horizontal yang melelahkan. Sistem CBT ini menerapkan **Transformasi Responsif Otomatis**:

- **Layar Desktop (≥ 768px / md)**: Ditampilkan sebagai **Tabel Data Neo-Brutalist** dengan garis grid tebal dan kolom lengkap.
- **Layar Ponsel (< 768px)**: Secara otomatis berubah menjadi **Tumpukan Kartu Interaktif (Stacked Card List)** di mana setiap baris data diubah menjadi kartu mandiri yang rapi.

---

## 2. Tabel Data Desktop (Desktop Data Table)

Tabel desktop mengusung gaya _high-contrast tabular grid_:

```text
+-----------------------------------------------------------------------------------------------+
| [Cari data...] [Filter: Semua Peran ▼] [Status: Aktif ▼]                 [+ Tambah Pengguna]  |
+-----------------------------------------------------------------------------------------------+
| [ ] | NAMA MAHASISWA            | EMAIL                  | KELAS     | STATUS   | AKSI        |
+-----+---------------------------+------------------------+-----------+----------+-------------+
| [✓] | Ahmad Fauzan              | fauzan@kampus.ac.id    | IF-301    | [AKTIF]  | [✎] [🗑] [⋮] |
| [ ] | Siti Nurhaliza            | siti@kampus.ac.id      | IF-302    | [AKTIF]  | [✎] [🗑] [⋮] |
| [ ] | Budi Santoso              | budi@kampus.ac.id      | IF-301    | [NONAKTIF]| [✎] [🗑] [⋮] |
+-----------------------------------------------------------------------------------------------+
| Menampilkan 1 - 10 dari 145 data                       [ < ] [ 1 ] [ 2 ] [ 3 ] ... [ 15 ] [ > ] |
+-----------------------------------------------------------------------------------------------+
```

### Spesifikasi Visual Tabel Desktop

- **Bilah Header Tabel**: Latar belakang `var(--main)` (`hsl(45, 100%, 50%)`), border bawah `3px solid var(--border)`, teks huruf kapital bobot `800` dengan ikon penanda arah pengurutan (_sort ascending/descending_).
- **Garis Pembatas Baris & Kolom**: Garis padat `2px solid var(--border)`.
- **Hover Baris**: Saat kursor melayang di atas baris, latar baris berubah menjadi `var(--muted)`.
- **Kolom Aksi**: Berisi tombol-tombol ikon ringkas berbingkai `2px solid var(--border)` dengan bayangan `2px 2px 0px var(--border)` (Edit, Hapus, Detail, Duplikat).

---

## 3. Tumpukan Kartu Mobile (Mobile Card Stack View)

Pada layar ponsel (< 768px), data ditampilkan dalam bentuk kartu-kartu mandiri bertumpuk secara vertikal:

```text
+---------------------------------------------------+
| Ahmad Fauzan                        [AKTIF - HIJAU]|
| fauzan@kampus.ac.id                                |
| ------------------------------------------------- |
| Kelas: IF-301 • Terdaftar: 12 Jan 2026            |
|                                                   |
| [ ✎ Ubah Data ]               [ 🗑 Nonaktifkan ]   |
| (Tombol Lebar 48px)           (Tombol Lebar 48px) |
+---------------------------------------------------+
```

### Spesifikasi Kartu Mobile

- Latar belakang: `var(--secondary-background)` (`#FFFFFF`), border `2.5px solid var(--border)`, bayangan `var(--shadow)`, sudut `var(--radius-base)`.
- Bagian atas kartu memuat judul utama (nama mahasiswa, judul soal, atau nama ujian) dan badge status di pojok kanan atas.
- Bagian tengah memuat data pelengkap (email, kode kelas, durasi, atau perolehan nilai).
- Bagian bawah memuat bilah tombol aksi berukuran sentuh minimal 44px–48px agar mudah ditekan satu jempol.

---

## 4. Bilah Pencarian & Penyaringan (Search & Filter Bar)

Bilah alat di atas tabel dirancang modular:

- **Kotak Pencarian**: Input teks dengan ikon kaca pembesar di sisi kiri dan tombol silang `(X)` untuk membersihkan kata kunci. Menggunakan mekanisme debounce 300ms agar query tidak membebani server.
- **Pill Filter Cepat**: Sekumpulan tombol pill berbingkai hitam untuk filter status instan: `[Semua]`, `[Aktif]`, `[Nonaktif]`. Filter yang aktif terisi warna `var(--main)`.
- **Tombol Tambah Data**: Tombol Primary CTA kuning amber di sisi kanan atas: `[+ Tambah Soal / Pengguna]` (`var(--main)`).

---

## 5. Paginasi Taktil (Tactile Pagination Controls)

Paginasi di bawah tabel atau daftar kartu menggunakan serangkaian kotak nomor tombol bergaya Neo-Brutalis:

- Kotak berukuran 40px × 40px (desktop) atau 44px × 44px (mobile), border `2px solid var(--border)`.
- **Halaman Tidak Aktif**: Latar belakang `var(--secondary-background)` (`#FFFFFF`), bayangan `2px 2px 0px var(--border)`.
- **Halaman Sedang Aktif**: Latar belakang terisi `var(--main)`, teks bobot `800`, bayangan `1px 1px 0px var(--border)`.
- Tombol navigasi sebelumnya (`<`) dan berikutnya (`>`) dapat dinonaktifkan dengan opasitas `50%` saat berada di halaman awal/akhir.

---

## 6. Antarmuka Khusus: Penyusunan Paket Soal (Drag & Reorder)

Pada sub-fitur **Paket Soal (Fase 2)**, dosen dapat mengatur urutan soal di dalam satu paket ujian:

- Setiap butir soal ditampilkan sebagai kartu bilah horizontal berlatar `var(--secondary-background)`.
- Di sisi kiri terdapat pegangan seret (_drag handle_) berpola 6 titik timbul.
- Terdapat badge nomor urut soal `[01]`, `[02]`, `[03]` dalam font `JetBrains Mono`.
- Saat kartu diseret (_dragging_), kartu terangkat dengan bayangan lebih besar (`8px 8px 0px var(--border)`) dan berotasi halus -1.5 derajat untuk memberikan sensasi fisik kertas yang sedang diangkat.
- Tersedia tombol cepat "Lepas dari Paket" di ujung kanan kartu.
