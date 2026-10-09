# Exam Workstation (Kerjakan Ujian)

Dokumen ini mendefinisikan arsitektur tata letak dan interaksi untuk fitur utama **Kerjakan Ujian (Fase 2)** pada perangkat mobile maupun desktop mengikuti tema **Neo-Brutalism Amber**.

---

## 1. Tata Letak Mobile (Mobile Workstation Architecture)

Layar ujian mobile memanfaatkan unit `100dvh` dengan struktur 3 zona vertikal di atas kanvas `var(--background)`:

```text
+-------------------------------------------------------+
| [Header] Nama Ujian • Token Mahasiswa  | ⏱ 01:24:50  | -> Sticky Top Header (54px)
+-------------------------------------------------------+
| [Beacon] ● Online • Jawaban Tersimpan Otomatis        | -> Status Sync Bar (28px)
+-------------------------------------------------------+
|                                                       |
|  [Soal No. 12]  [Tingkat: Sedang]                     |
|                                                       |
|  Teks pertanyaan utama dengan tipografi tegas...     |
|  +-------------------------------------------------+  | -> Scrollable Question Canvas
|  | [Gambar Soal - MediaResponsiveImage]           |  |
|  +-------------------------------------------------+  |
|                                                       |
|  (A) Opsi pilihan jawaban pertama                     |
|  (B) Opsi pilihan kedua [TERPILIH - AMBER]            |
|  (C) Opsi pilihan ketiga                              |
|  (D) Opsi pilihan keempat                             |
|                                                       |
+-------------------------------------------------------+
| [Pill Palet: Soal 12 / 50 • 35 Dijawab  ▲ Buka Palet] | -> Quick Jump Trigger (36px)
+-------------------------------------------------------+
| [ < Sebelumnya ]    [ ? Ragu-Ragu ]    [ Selanjutnya > ]| -> Persistent Bottom Dock
+-------------------------------------------------------+
```

### A. Sticky Top Header (Mobile)

- Tinggi tetap: `54px` + `env(safe-area-inset-top)`.
- Latar belakang: `var(--secondary-background)` (`#FFFFFF`), border bawah `2.5px solid var(--border)`.
- Kiri: Nama ujian (singkat, truncate) dan token pengerjaan dalam font `JetBrains Mono`.
- Kanan: Chip Timer hitung mundur dengan border `2px solid var(--border)` dan angka besar monospasi.

### B. Canvas Pertanyaan & Media

- Area scroll mandiri dengan padding horizontal `16px`.
- **Nomor Soal**: Badge besar bertuliskan `"SOAL NO. 12"` di sudut kiri atas berlatar `var(--main)` (`hsl(45, 100%, 50%)`).
- **Penampil Gambar Soal**: Menggunakan komponen `MediaResponsiveImage` berbingkai border `2px solid var(--border)` dengan sudut `var(--radius-base)` (`5px`). Gambar dapat diklik untuk membuka modal tampilan penuh (_lightbox zoom_).
- **Daftar Pilihan Jawaban**: Disusun vertikal dengan jarak celah (_gap_) `12px` antar opsi. Tiap opsi memiliki tinggi sentuh minimal `52px`.

### C. Persistent Bottom Action Dock (Mobile)

- Selalu menempel di bagian bawah layar (`bottom: 0`) dengan padding bawah `calc(8px + env(safe-area-inset-bottom))`.
- Latar belakang: `var(--secondary-background)` (`#FFFFFF`), border atas `3px solid var(--border)`, bayangan atas `0px -4px 0px rgba(0,0,0,0.1)`.
- Berisi 3 tombol aksi utama:
    1. Tombol **"Sebelumnya"** (Secondary CTA).
    2. Tombol **"Ragu-Ragu"** (Warning CTA berlatar `#D97706` dengan ikon bendera).
    3. Tombol **"Selanjutnya"** (Primary CTA berlatar `var(--main)`).

### D. Interactive Bottom Sheet (Palet Nomor Soal Mobile)

- Dipicu melalui tombol pill mengambang: `[Soal 12 / 50 • 35 Dijawab ▲]`.
- Muncul dari bawah layar dengan animasi pegas mekanis:
    - _Drag Handle Bar_ tebal di bagian atas.
    - Ringkasan statistik cepat: `[35 Terjawab]`, `[3 Ragu]`, `[12 Kosong]`.
    - Grid nomor soal berukuran 44px × 44px dengan susunan 5 atau 6 kolom.
    - Tombol besar **"Kumpulkan Jawaban Ujian"** di bagian paling bawah sheet berlatar `var(--main)`.

---

## 2. Tata Letak Desktop (Desktop Workstation Architecture)

Pada layar desktop (≥ 1024px), antarmuka terbagi menjadi dua kolom kerja tetap (_split workstation_):

```text
+-----------------------------------------------------------------------------------------------+
| [CBT LOGO]  Ujian Tengah Semester - Algoritma Pemrograman  | Peserta: Fauzan (202401) | ⏱ 01:24:50 |
+-------------------------------------------------------------------+---------------------------+
|                                                                   |  PALET NAVIGASI SOAL      |
|  [SOAL NO. 12]  [Bobot: 1 Poin]                                   |  +---------------------+  |
|                                                                   |  | [01] [02] [03] [04] |  |
|  Teks pertanyaan utama ditampilkan dengan lebar baca optimal...   |  | [05] [06] [07] [08] |  |
|                                                                   |  | [09] [10] [11] [12] |  |
|  +-------------------------------------------------------------+  |  +---------------------+  |
|  | Gambar Stimulus / Kode Program                              |  |  LEGENDA:                 |
|  +-------------------------------------------------------------+  |  ● Hijau : Terjawab (35)  |
|                                                                   |  ● Amber : Ragu-ragu (3)  |
|  [ A ] Pilihan jawaban A                                          |  ● Putih : Kosong (12)    |
|  [ B ] Pilihan jawaban B [TERPILIH]                              |  -----------------------  |
|  [ C ] Pilihan jawaban C                                          |  [ KUMPULKAN JAWABAN ]    |
|  [ D ] Pilihan jawaban D                                          |  (Tombol Utama Amber)     |
|                                                                   |                           |
+-------------------------------------------------------------------+---------------------------+
| [ < Soal Sebelumnya ]         [ ? Tandai Ragu-Ragu ]                  [ Soal Selanjutnya > ]  |
+-----------------------------------------------------------------------------------------------+
```

- **Kolom Kiri (~72% Lebar)**: _Question Canvas_ yang luas dan nyaman untuk membaca stimulus soal panjang, kode program monospasi, dan opsi pilihan bergambar.
- **Kolom Kanan (~28% Lebar, min 320px)**: _Fixed Side Rail_ berbatas garis `3px solid var(--border)` yang memuat grid seluruh nomor soal, legenda warna, dan tombol penyerahan ujian.

---

## 3. Alur Status Khusus & Edge Cases

### A. Peringatan 5 Menit Terakhir (Time Expiration Alert)

- Saat sisa waktu mencapai `05:00`, timer di header berubah warna menjadi merah pekat `#DC2626` dan memicu getaran haptic singkat di perangkat mobile.
- Muncul dialog modal peringatan singkat berbingkai tebal: `"WAKTU TERSISA 5 MENIT — Segera periksa jawaban ragu-ragu dan bersiap mengumpulkan."`

### B. Dialog Konfirmasi Penyerahan Ujian (Submit Dialog)

- Ketika peserta menekan tombol "Kumpulkan Jawaban", muncul modal konfirmasi dengan rincian ringkasan:
    - Total Soal: `50`
    - Terjawab: `45` (Badge hijau `#16A34A`)
    - Ragu-ragu: `2` (Badge amber `#D97706`)
    - Belum Terjawab: `3` (Badge merah pekat `#DC2626` dengan teks peringatan)
- Jika masih ada soal ragu-ragu atau belum terjawab, sistem meminta konfirmasi ganda sebelum tombol "Ya, Selesaikan Ujian" dapat ditekan.

### C. Pemutusan Koneksi (Network Disconnection Flow)

- Jika koneksi terputus saat pengerjaan, banner peringatan merah pekat langsung muncul di bagian atas layar: `"Koneksi internet terputus. Jawaban Anda tetap tersimpan aman di peramban."`
- Timer tetap berjalan normal di sisi klien berdasarkan sinkronisasi awal waktu server.
- Begitu koneksi pulih, sistem secara otomatis mensinkronkan jawaban yang tertunda (_background auto-sync_) dan menampilkan toast sukses `"Jawaban berhasil disinkronkan ke server"`.
