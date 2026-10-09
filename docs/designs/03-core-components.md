# Core Components (Neo-Brutalist Catalog)

Seluruh komponen antarmuka dirancang mengikuti kaidah **Neo-Brutalism Amber**, terintegrasi dengan komponen basis **shadcn/ui** dan utilitas **Tailwind CSS v4**.

---

## 1. Tombol (Buttons)

Tombol menggunakan border tebal `2px` hingga `2.5px solid var(--border)`, bayangan blok `var(--shadow)` (`4px 4px 0px 0px var(--border)`), sudut lengkung `var(--radius-base)` (`5px`), tipografi `Inter` dengan bobot `800` (`--font-weight-heading`), dan efek interaksi mekanis:
- **Hover**: `hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none` (bergeser 4px ke arah bayangan).
- **Active / Tap**: `active:translate(3px, 3px) active:shadow-[1px_1px_0px_var(--border)]`.

### Varian Tombol

| Varian | Latar Belakang | Teks / Ikon | Border & Shadow | Penggunaan |
| :--- | :---: | :---: | :---: | :--- |
| **Primary CTA** | `var(--main)` (`hsl(45, 100%, 50%)`) | `var(--main-foreground)` (`#000000`) | `2.5px solid var(--border)`<br>`var(--shadow)` | Aksi utama: "Mulai Kerjakan", "Lanjut (Next)", "Selesai & Kumpulkan", "Simpan Data" |
| **Secondary CTA** | `var(--secondary-background)` (`#FFFFFF`) | `var(--foreground)` (`#000000`) | `2.5px solid var(--border)`<br>`var(--shadow)` | Aksi pendukung: "Sebelumnya (Prev)", "Batal", "Kembali", "Unduh Template" |
| **Warning CTA** | `#D97706` | `#FFFFFF` | `2.5px solid var(--border)`<br>`var(--shadow)` | Status penanda: "Ragu-Ragu (Flag)", "Reset Jawaban" |
| **Destructive CTA** | `#DC2626` | `#FFFFFF` | `2.5px solid var(--border)`<br>`var(--shadow)` | Aksi berbahaya: "Hapus Soal", "Nonaktifkan Pengguna", "Keluarkan dari Kelas" |
| **Icon Action** | `var(--secondary-background)` (`#FFFFFF`) | `var(--foreground)` (`#000000`) | `2px solid var(--border)`<br>`3px 3px 0px var(--border)` | Tombol aksi ringkas di tabel/kartu: edit, hapus, unduh, duplikat (min. 44×44px di mobile) |

---

## 2. Opsi Pilihan Ganda (Multiple Choice Option Rows)

Wadah interaktif horizontal selebar kontainer soal yang dirancang khusus untuk kenyamanan membaca dan kemudahan sentuhan.

### Spesifikasi Visual

- **Struktur Kartu**: Latar belakang `var(--secondary-background)` (`#FFFFFF`), border `2.5px solid var(--border)`, sudut `var(--radius-base)` (`5px`), bayangan `var(--shadow)` (`4px 4px 0px 0px var(--border)`).
- **Badge Label Kunci (A, B, C, D, E)**: Kotak di sisi kiri berukuran minimal 48px × 48px, latar belakang `var(--background)`, border kanan `2.5px solid var(--border)`, font `JetBrains Mono` weight `800`.
- **Area Konten Pilihan**: Menampilkan teks opsi dan/atau gambar pendukung opsi secara proporsional dengan font `Inter` bobot `500`.
- **Keadaan Terpilih (Selected State)**:
    - Latar kartu berubah menjadi `var(--main)` (`hsl(45, 100%, 50%)`).
    - Kartu mengalami translasi mekanis `translate(var(--spacing-boxShadowX), var(--spacing-boxShadowY))` dan bayangan menjadi `none`.
    - Simbol radio di ujung kanan terisi warna solid hitam `var(--border)`.

---

## 3. Jam Hitung Mundur Ujian (Countdown Exam Timer)

Blok informasi waktu dengan angka monospasi besar (`JetBrains Mono`) untuk mencegah pergeseran tata letak tiap detik.

- **Keadaan Normal (Waktu Aman)**:
    - Latar belakang: `var(--secondary-background)` (`#FFFFFF`), border `2.5px solid var(--border)`, bayangan `var(--shadow)`.
    - Teks: `var(--foreground)` (`#000000`), ukuran `22px` (mobile) / `27px` (desktop), weight `800`.
- **Keadaan Kritis (Sisa Waktu < 5 Menit)**:
    - Latar belakang otomatis beralih menjadi merah terang `#DC2626`.
    - Teks beralih menjadi putih `#FFFFFF`.
    - Memicu denyut outline tegas (_hard-blink pulse_) untuk menarik perhatian peserta tanpa mengganggu pandangan soal.

---

## 4. Grid Palet Navigasi Soal (Question Navigation Palette)

Kumpulan sel tombol nomor soal (44px × 44px) yang menunjukkan status pengerjaan secara instan:

```text
[ 01 ]    [ 02 ]    [ 03 ]    [ 04 ]    [ 05 ]
 White     Green     Amber    Yellow     White
(Kosong)  (Jawab)   (Ragu)    (Aktif)   (Kosong)
```

- **Belum Dijawab (Unanswered)**: Latar `var(--secondary-background)` (`#FFFFFF`), teks `var(--foreground)`, border `2px solid var(--border)`.
- **Sudah Dijawab (Answered)**: Latar `#16A34A` (Hijau), teks `#FFFFFF`, border `2px solid var(--border)`.
- **Ragu-Ragu (Flagged)**: Latar `#D97706` (Amber), teks `#FFFFFF`, border `2px solid var(--border)`.
- **Sedang Aktif (Current Active)**: Latar `var(--main)` (`hsl(45, 100%, 50%)`), teks `var(--main-foreground)`, bayangan tegas `3px 3px 0px var(--border)`.

---

## 5. Bidang Formulir (Form Controls)

Semua elemen input mengusung gaya _high-contrast tactile input_:

### A. Input Teks, Password & Textarea

- Latar `var(--secondary-background)` (`#FFFFFF`), border `2.5px solid var(--border)`, sudut `var(--radius-base)` (`5px`), padding `10px 14px`.
- **Focus State**: Bayangan instan muncul `var(--shadow)` (`4px 4px 0px 0px var(--border)`) tanpa cincin blur pudar (_no soft blur glow_).
- **Invalid / Error State**: Border berubah menjadi `#DC2626`, bayangan `4px 4px 0px #DC2626`.

### B. Sakelar Pilihan (Toggle Switch)

Digunakan untuk pengaturan boolean seperti `is_active`, `shuffle_questions`, dan `show_result`:

- Track: Lebar 54px, tinggi 30px, border `2.5px solid var(--border)`, sudut `9999px`.
- Thumb: Lingkaran padat berdiameter 22px, border `2px solid var(--border)`.
- State Aktif: Track terisi `#16A34A` (Hijau), thumb bergeser ke kanan dengan bayangan mekanis.

### C. Select / Dropdown Menu

- Trigger box: Latar `var(--secondary-background)` (`#FFFFFF`), border `2.5px solid var(--border)`, bayangan `var(--shadow)`.
- Dropdown panel: Latar `var(--secondary-background)` (`#FFFFFF`), border `3px solid var(--border)`, bayangan `6px 6px 0px var(--border)`.
- Item menu: Hover state terisi warna `var(--main)` dengan teks `var(--main-foreground)`.

---

## 6. Berkas Lampiran & Uploader (Attachment Integration)

Mengintegrasikan komponen `resources/js/components/ui/attachment.tsx` dan `MediaUploader`:

- **Dropzone Area**: Kotak persegi berpola garis putus-putus tebal (`border: 2.5px dashed var(--border)`), latar belakang `var(--muted)`, ikon awan besar, dan teks ajakan unggah tebal.
- **Attachment Card**: Kartu horizontal dengan border `2px solid var(--border)`, bayangan `var(--shadow)`, thumbnail media atau ikon tipe berkas (`FileText`, `FileSpreadsheet`, dll.), judul tebal, ukuran berkas terformat, serta tombol aksi hapus/unduh berukuran minimal 44px.

---

## 7. Badge & Status Chips

- Teks huruf kapital (_uppercase_) dalam font `JetBrains Mono`, weight `800`, letter spacing `0.05em`.
- Border padat `2px solid var(--border)`, sudut `var(--radius-sm)` (`1px`), bayangan `2px 2px 0px var(--border)`.
- Varian:
    - **Success / Aktif / Terbuka**: Latar `#16A34A`, teks `#FFFFFF`.
    - **Warning / Ragu / Berjalan**: Latar `#D97706`, teks `#FFFFFF`.
    - **Danger / Ditutup / Nonaktif**: Latar `#DC2626`, teks `#FFFFFF`.
    - **Neutral / Draft / Mendatang**: Latar `var(--secondary-background)`, teks `var(--foreground)`.

---

## 8. Dialog Modal & Bottom Sheet

- **Backdrop**: Lapisan hitam pekat semi-transparan `var(--overlay)` (`oklch(0% 0 0 / 0.8)`).
- **Wadah Modal (Desktop)**: Latar `var(--secondary-background)` (`#FFFFFF`), border `3.5px solid var(--border)`, hard shadow `8px 8px 0px var(--border)`, sudut `var(--radius-base)` (`5px`).
- **Header Modal**: Bilah atas berwarna `var(--main)` dengan pembatas garis tebal `3px solid var(--border)`.
- **Bottom Sheet (Mobile)**: Muncul dari tepi bawah layar, dilengkapi _drag handle bar_ tebal di bagian atas, border atas-kiri-kanan `3px solid var(--border)`.

---

## 9. Notifikasi Toast & Status Koneksi (Beacons)

- **Toast Notification (Sonner)**: Kotak pesan mengambang dengan latar belakang putih `var(--secondary-background)` atau warna status, border `2.5px solid var(--border)`, hard shadow `var(--shadow)`.
- **Network Beacon**: Indikator lampu hijau/merah di header. Jika koneksi terputus, muncul bilah pita (_ribbon banner_) statis berwarna merah pekat `#DC2626` di atas layar: `"KONEKSI TERPUTUS — Jawaban Tersimpan di Memori Lokal"` disertai tombol uji ulang koneksi.
- **Auto-Save Pill**: Pill kecil di bawah soal: `"✓ Tersimpan"` (hijau) atau `"⟳ Menyimpan..."` (kuning berkedip).
