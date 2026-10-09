# Dashboard & App Shell

Dokumen ini mendefinisikan arsitektur kerangka aplikasi (_App Shell_), navigasi sidebar, bilah atas (_topbar_), dan tata letak dasbor untuk ketiga peran pengguna: **Admin**, **Dosen**, dan **Mahasiswa** dalam estetika **Neo-Brutalism Amber**.

---

## 1. Arsitektur Kerangka Aplikasi (App Shell)

Kerangka utama aplikasi menggunakan tata letak terpadu yang adaptif di atas latar belakang `var(--background)`:

```text
+-------------------------------------------------------------------------------+
| [Logo CBT]  | Breadcrumbs: Kelola Pengguna > Mahasiswa  | [Peran] [Avatar ▼]  | -> Topbar (64px)
+-------------+-------------------------------------------+---------------------+
| [SIDEBAR]   |                                                                 |
| ● Dashboard | [ KARTU STATISTIK 1 ] [ KARTU STATISTIK 2 ] [ KARTU STATISTIK 3 ]|
| ● Pengguna  |                                                                 |
| ● Kelas     | +-------------------------------------------------------------+ |
| ● Bank Soal | | AREA KONTEN UTAMA (Tabel Data / Formulir / Kartu Ujian)     | |
| ● Jadwal    | |                                                             | |
| ● Nilai     | |                                                             | |
|             | +-------------------------------------------------------------+ |
| [Keluar]    |                                                                 |
+-------------+-----------------------------------------------------------------+
```

### A. Bilah Atas (Topbar Header)

- Tinggi tetap: `64px`. Latar belakang: `var(--secondary-background)` (`#FFFFFF`), border bawah `2.5px solid var(--border)`.
- **Sisi Kiri**:
    - Tombol hamburger menu (khusus mobile) untuk membuka sheet sidebar navigasi.
    - Logo CBT bergaya Neo-Brutalis dengan bingkai garis hitam tegas dan warna aksen amber `var(--main)`.
    - Jejak navigasi (_breadcrumbs_) dengan pemisah tanda panah tegas (`>`) dalam font `JetBrains Mono`.
- **Sisi Kanan**:
    - Mode Switcher: Tab beralih antara **Monochromatic (Light)** dan **Duotone (Dark)**.
    - Badge Peran Pengguna: Tag monospasi bertuliskan `[ADMIN]`, `[DOSEN]`, atau `[MAHASISWA]`.
    - Menu Profil Dropdown: Avatar berbingkai `2px solid var(--border)` yang dapat diklik untuk membuka tautan "Profil Saya" dan tombol "Keluar".

### B. Bilah Sisi (Sidebar Navigation)

- **Tampilan Desktop (≥ 1024px)**:
    - Kolom tetap selebar 260px di sisi kiri dengan border kanan `2.5px solid var(--border)`.
    - Item menu memiliki tinggi `44px`, sudut `var(--radius-base)` (`5px`), dan ikon dari `lucide-react`.
    - **Menu Aktif**: Latar belakang terisi penuh `var(--main)` (`hsl(45, 100%, 50%)`), teks `var(--main-foreground)`, border `2px solid var(--border)`, bayangan `var(--shadow)`.
- **Tampilan Mobile (< 1024px)**:
    - Sidebar disembunyikan dan diakses via **Off-Canvas Sheet** yang meluncur dari kiri layar saat tombol hamburger ditekan.

---

## 2. Pembeda Visual Antar Peran (Role-Based Visual Cues)

Untuk memastikan pengguna selalu sadar akan batas wewenang mereka, setiap dasbor peran memiliki aksen warna dan kartu metrik yang spesifik:

### A. Dasbor Admin (Super Admin)

- **Warna Aksen Dominan**: Amber Brand (`var(--main)`) & Chart Violet (`#7A83FF`).
- **Kartu Metrik Utama**:
    1. Total Mahasiswa Aktif.
    2. Total Dosen Pengajar.
    3. Total Kelas Aktif.
    4. Total Jadwal Ujian Berjalan.
- **Aksi Cepat (Quick Action Bar)**: Tombol pintas "Tambah Pengguna", "Impor Akun Massal", "Buat Kelas Baru".

### B. Dasbor Dosen (Teacher)

- **Warna Aksen Dominan**: Amber Brand (`var(--main)`) & Success Green (`#16A34A`).
- **Kartu Metrik Utama**:
    1. Kelas yang Diampu.
    2. Bank Soal Saya (Total Butir Soal).
    3. Paket Soal Siap Pakai.
    4. Ujian Sedang Berlangsung.
- **Aksi Cepat**: Tombol pintas "Buat Soal Baru", "Susun Paket Soal", "Buat Jadwal Ujian".

### C. Dasbor Mahasiswa (Student)

- **Warna Aksen Dominan**: Amber Brand (`var(--main)`) & Leaf Green (`#16A34A`).
- **Fokus Tampilan**: Tidak dipenuhi metrik administratif; berfokus langsung pada **Kartu Ujian Aktif Hari Ini**.
- **Hero Card Ujian Terdekat**: Kartu berukuran besar dengan border `3px solid var(--border)`, bayangan `6px 6px 0px var(--border)`, memuat nama mata kuliah, durasi pengerjaan, batas waktu penutupan, dan tombol berukuran besar **"Mulai Kerjakan Ujian"** (`var(--main)`).
- **Daftar Riwayat Ujian Terakhir**: Menampilkan skor dan status kelulusan untuk ujian yang nilainya sudah dirilis oleh dosen.

---

## 3. Kartu Statistik & Metrik (Metric Cards)

Kartu statistik dasbor dirancang dengan gaya balok timbul khas Neo-Brutalisme:

```css
.metric-card {
    background-color: var(--secondary-background);
    border: 2.5px solid var(--border);
    border-radius: var(--radius-base);
    box-shadow: var(--shadow);
    padding: 18px 20px;
}
```

- Bagian atas kartu memuat label metrik berhuruf kapital dalam font `Inter` bobot `700`.
- Angka nilai metrik ditampilkan sangat besar (`32px`) dalam font `JetBrains Mono` bobot `800`.
- Sudut kanan atas dilengkapi ikon tematik dalam lingkaran berbingkai garis hitam tebal.

---

## 4. Layar Akses Ditolak (403 Forbidden Screen)

Bila seorang pengguna mencoba membuka URL atau data yang bukan haknya (mis. mahasiswa membuka menu pembuatan soal):

- Kotak peringatan terpusat di tengah layar:
    - Latar belakang: `var(--secondary-background)` (`#FFFFFF`), border `3.5px solid var(--border)`, bayangan `8px 8px 0px var(--border)`, sudut `var(--radius-base)`.
    - Header kartu: Berwarna merah pekat `#DC2626` dengan teks tebal `"AKSES DITOLAK (403)"`.
    - Ilustrasi grafis atau ikon gembok besar berpola Neo-Brutalis.
    - Teks penjelasan ramah: `"Maaf, Anda tidak memiliki izin untuk mengakses halaman atau data ini."`
    - Tombol CTA utama: `"Kembali ke Halaman Utama"` (`var(--main)` / amber).
