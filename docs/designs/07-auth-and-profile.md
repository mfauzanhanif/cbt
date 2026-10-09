# Auth & Profile Pages

Dokumen ini mendefinisikan desain antarmuka untuk fitur **Masuk & Daftar Akun (Fase 1)** dan **Profil Saya (Fase 4)** dalam estetika **Neo-Brutalism Amber**.

---

## 1. Tata Letak Halaman Autentikasi (Auth Card Layout)

Seluruh alur autentikasi (Login, Register, Lupa Password, Reset Password, Verifikasi Email) menggunakan tata letak kartu terpusat (_centered card layout_) berkarakter grafis kuat di atas kanvas `var(--background)`:

```text
+-------------------------------------------------------------+
|                                                             |
|                    [LOGO CBT]                               |
|              Sistem Ujian Berbasis Komputer                 |
|                                                             |
|     +-------------------------------------------------+     |
|     | HEADER KARTU AMBER (var(--main))                |     |
|     | Masuk ke Akun Anda                              |     |
|     +-------------------------------------------------+     |
|     |                                                 |     |
|     | Alamat Email                                    |     |
|     | [ nama@kampus.ac.id                           ] |     |
|     |                                                 |     |
|     | Kata Sandi                        [Lupa Sandi?] |     |
|     | [ •••••••••••••                               ] |     |
|     |                                                 |     |
|     | [✓] Ingat saya di perangkat ini                 |     |
|     |                                                 |     |
|     | [ MASUK KE APLIKASI ] (Tombol Amber Lebar)      |     |
|     |                                                 |     |
|     | ----------------------------------------------- |     |
|     | Belum punya akun? [Daftar Sekarang]             |     |
|     +-------------------------------------------------+     |
|                                                             |
+-------------------------------------------------------------+
```

### Spesifikasi Kartu Autentikasi

- **Dimensi**: Lebar maksimal `440px` (desktop), di mobile mengambil lebar penuh dengan margin horizontal `16px`.
- **Kotak Kartu**: Latar belakang `var(--secondary-background)` (`#FFFFFF`), border padat `3.5px solid var(--border)`, hard shadow `8px 8px 0px var(--border)`, sudut `var(--radius-base)` (`5px`).
- **Header Kotak**: Bilah atas berwarna `var(--main)` (`hsl(45, 100%, 50%)`) dengan pembatas garis tebal `3px solid var(--border)` yang memuat judul aksi.
- **Tombol Aksi Utama**: Membentang selebar kartu (_full-width CTA_) dengan tinggi minimal `48px`, latar `var(--main)`, dan teks `var(--main-foreground)`.

---

## 2. Halaman-Halaman Alur Autentikasi

### A. Halaman Daftar Akun (Register)

- Isian: Nama Lengkap, Alamat Email Kampus, Kata Sandi, dan Konfirmasi Kata Sandi.
- Indikator kekuatan kata sandi dalam bentuk balok tebal berwarna hijau/kuning/merah.

### B. Halaman Pemberitahuan Verifikasi Email (Email Verification Notice)

- Ditampilkan saat pengguna yang belum terverifikasi mencoba membuka dashboard.
- Memuat ilustrasi amplop surat Neo-Brutalis berukuran besar.
- Pesan penjelasan: `"Kami telah mengirimkan tautan verifikasi ke email Anda. Silakan periksa kotak masuk atau folder spam Anda."`
- Tombol aksi utama: `"Kirim Ulang Email Verifikasi"` (Secondary CTA berlatar putih dengan border tebal).
- Tautan keluar: `"Keluar dari Akun"` untuk beralih akun jika salah memasukkan email.

### C. Halaman Lupa & Atur Ulang Kata Sandi (Password Reset)

- Formulir sederhana berisi kolom email untuk pengiriman token reset.
- Halaman atur ulang memuat isian kata sandi baru dan konfirmasi kata sandi baru.

### D. Modal Konfirmasi Kata Sandi (Fortify Password Confirmation)

- Dialog pop-up yang muncul saat pengguna hendak melakukan tindakan sensitif (seperti mengubah email atau menghapus akun).
- Meminta kata sandi pengguna yang sedang login saat ini sebelum aksi dieksekusi.

---

## 3. Halaman Pengaturan Akun & Profil Saya (Profile Page)

Halaman **Profil Saya (Fase 4)** dirancang dalam bentuk kartu informasi terstruktur dengan tiga bagian utama:

```text
+-------------------------------------------------------------------------------+
| PROFIL SAYA                                                                   |
| Kelola data pribadi, foto profil, dan keamanan akun Anda.                    |
+-------------------------------------------------------------------------------+
| [ FOTO PROFIL ]               | [ INFORMASI PRIBADI ]                         |
| +---------------------------+ | Nama Lengkap                                  |
| |       [AVATAR BESAR]      | | [ Ahmad Fauzan                              ] |
| |        Border 3px         | |                                               |
| +---------------------------+ | Alamat Email (Terverifikasi)                  |
| [ Ganti Foto ] [ Hapus ]    | | [ fauzan@kampus.ac.id                       ] |
|                             | |                                               |
| Role: [MAHASISWA - HIJAU]   | | Nomor Telepon / WhatsApp                      |
| Terdaftar: 10 Jan 2026      | | [ 081234567890                              ] |
|                             | |                                               |
|                             | | [ Simpan Perubahan Profil ]                   |
|                             | +-----------------------------------------------+
|                             | [ KEAMANAN & GANTI KATA SANDI ]                 |
|                             | Kata Sandi Saat Ini                             |
|                             | [ •••••••••••••                               ] |
|                             | Kata Sandi Baru                                 |
|                             | [ •••••••••••••                               ] |
|                             | Konfirmasi Kata Sandi Baru                      |
|                             | [ •••••••••••••                               ] |
|                             | [ Perbarui Kata Sandi ]                         |
+-------------------------------------------------------------------------------+
```

### A. Komponen Foto Profil & Avatar

- Lingkaran atau bujur sangkar berujung tumpul (`radius: var(--radius-base)`) berukuran 120px × 120px dengan border `3px solid var(--border)` dan bayangan `var(--shadow)`.
- **Fallback Inisial**: Jika belum mengunggah foto, menampilkan 2 huruf inisial nama besar dalam font `JetBrains Mono` bobot `800` di atas latar amber `var(--main)`.
- **Uploader Interaktif**: Tombol "Unggah Foto Baru" mendukung pratinjau instan (_instant image crop/preview_) sebelum disimpan ke backend melalui `spatie/laravel-medialibrary`.

### B. Bagian Informasi Pribadi

- Penggantian email memunculkan peringatan kuning tebal: `"Mengubah email akan mewajibkan Anda melakukan verifikasi ulang sebelum akun dapat digunakan kembali."`

### C. Bagian Keamanan & Sandi

- Mewajibkan pengisian kata sandi lama (`current_password`) untuk memastikan keamanan sebelum kata sandi baru disimpan.
