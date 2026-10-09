# Masuk & Daftar Akun

Fase 1 — Fondasi: Autentikasi, RBAC & Pengguna _(Prioritas: High)_

Pengguna membuat akun, memverifikasi email, dan masuk ke aplikasi dengan aman.

## Spesifikasi

### Tujuan

Fitur ini menyediakan fondasi keamanan dan autentikasi terpusat agar setiap pengguna (admin, dosen, dan mahasiswa) memiliki akun pribadi yang terverifikasi, aman, dan dapat mengakses aplikasi sesuai perannya menggunakan Laravel Fortify dan Inertia.js React.

### Selesai bila

- Pengguna baru dapat mendaftar dengan nama, email, dan kata sandi dari halaman Daftar, lalu menerima pesan bahwa tautan verifikasi telah dikirim ke kotak masuk emailnya.
- Pengguna yang belum memverifikasi emailnya tidak dapat mengakses menu utama aplikasi dan otomatis diarahkan ke halaman pemberitahuan verifikasi email dengan opsi kirim ulang tautan.
- Pengguna terverifikasi dapat masuk menggunakan email dan kata sandi dengan opsi "Ingat saya", serta dapat keluar kapan saja melalui tombol Keluar.
- Pengguna yang lupa kata sandi dapat meminta tautan pemulihan melalui email, mengatur ulang kata sandi baru, dan langsung dapat masuk kembali dengan kata sandi tersebut.
- Aksi-aksi sensitif dapat diamankan dengan konfirmasi kata sandi bawaan Laravel Fortify.
- Semua antarmuka responsif di perangkat mobile maupun desktop, menggunakan komponen shadcn/ui dan Tailwind CSS, serta menampilkan pesan dalam bahasa Indonesia.

## Sub-fitur: Daftar Akun

Membuat akun baru dengan email dan kata sandi.

### Tujuan

Memungkinkan calon pengguna membuat akun baru dengan data nama, alamat email yang valid, serta kata sandi terenkripsi agar dapat mulai menggunakan aplikasi CBT.

### Selesai bila

- Halaman Daftar memiliki isian nama lengkap, alamat email, kata sandi, dan konfirmasi kata sandi beserta tombol "Daftar".
- Validasi formulir berjalan dengan baik di sisi klien dan server; memunculkan pesan kesalahan yang ramah (mis. "Email sudah terdaftar", "Konfirmasi kata sandi tidak cocok", "Kata sandi minimal 8 karakter").
- Setelah pendaftaran berhasil, data pengguna tersimpan dengan kata sandi ter-hash (Bcrypt/Argon2id), peran default ditetapkan, dan tautan verifikasi otomatis dikirimkan ke email pendaftar.

## Sub-fitur: Verifikasi Email

Memastikan email benar-benar aktif lewat tautan verifikasi.

### Tujuan

Memastikan bahwa alamat email yang didaftarkan adalah alamat aktif milik pengguna yang sah sebelum pengguna diizinkan mengakses fitur-fitur CBT.

### Selesai bila

- Pengguna menerima email berisi tautan verifikasi yang aman bertanda tangan digital (signed URL); saat tautan diklik, status email berubah menjadi terverifikasi (`email_verified_at` terisi).
- Pengguna yang belum terverifikasi dicegat oleh middleware `verified` dan diarahkan ke halaman pemberitahuan verifikasi yang menyediakan tombol "Kirim Ulang Email Verifikasi".
- Setelah verifikasi berhasil, pengguna langsung dialihkan ke dashboard sesuai perannya.

## Sub-fitur: Login & Logout

Masuk dan keluar dari aplikasi dengan aman.

### Tujuan

Memungkinkan pengguna yang telah terdaftar dan terverifikasi untuk masuk ke sesi aplikasinya secara aman dan keluar kapan saja dengan invalidasi sesi yang bersih.

### Selesai bila

- Halaman Login menyediakan isian email, kata sandi, opsi checkbox "Ingat saya", tautan "Lupa kata sandi?", serta tautan menuju halaman pendaftaran.
- Setelah berhasil login, pengguna otomatis dialihkan ke halaman utama/dashboard sesuai peran spesifiknya (admin, dosen, atau mahasiswa).
- Bila login gagal, muncul pesan kesalahan umum yang aman (mis. "Email atau kata sandi salah") tanpa membocorkan apakah email terdaftar atau tidak.
- Akun yang berstatus nonaktif (`is_active = false`) dicegah masuk dan diberikan pesan pemberitahuan yang jelas.
- Tombol "Keluar" (Logout) tersedia di menu navigasi/profil; saat diklik, sesi dan token CSRF di-regenerate, dan pengguna kembali ke halaman Login.

## Sub-fitur: Lupa Kata Sandi

Memulihkan akun saat kata sandi terlupa.

### Tujuan

Membantu pengguna memulihkan akses ke akun mereka secara mandiri saat melupakan kata sandi melalui tautan reset yang aman via email.

### Selesai bila

- Halaman "Lupa Kata Sandi" memiliki isian email dan tombol kirim; sistem memvalidasi dan mengirimkan tautan reset token ke email tersebut dengan batas masa berlaku (expiration time).
- Tautan di email mengarahkan pengguna ke halaman "Atur Ulang Kata Sandi" dengan isian kata sandi baru dan konfirmasinya.
- Setelah kata sandi baru berhasil disimpan, pengguna dialihkan ke halaman Login dengan notifikasi sukses dan dapat langsung masuk menggunakan kata sandi yang baru.

## Task

### 1. Bangun layout autentikasi responsif dan halaman Daftar Akun dengan shadcn/ui

### 2. Bangun halaman Verifikasi Email (Notice & Sukses) dengan tombol kirim ulang

### 3. Bangun halaman Login dengan opsi "Ingat saya" dan tautan lupa kata sandi

### 4. Bangun halaman Lupa Kata Sandi (Permintaan tautan reset)

### 5. Bangun halaman Atur Ulang Kata Sandi (Reset password form)

### 6. Bangun komponen/modal Konfirmasi Kata Sandi (Password confirmation Fortify)

### 7. Konfigurasi Laravel Fortify (fitur registrasi, reset password, verifikasi email, konfirmasi password)

### 8. Sesuaikan model User dan migrasi basis data (implementasi MustVerifyEmail, kolom phone, kolom is_active)

### 9. Siapkan seeder peran awal (admin, dosen, mahasiswa) menggunakan spatie/laravel-permission

### 10. Implementasikan logika aksi CreateNewUser Fortify dengan validasi ketat dan penetapan peran

### 11. Pasang middleware verifikasi email dan batasi rute aplikasi utama

### 12. Kustomisasi Fortify LoginResponse untuk redirect dinamis berbasis peran pengguna

### 13. Implementasikan alur reset kata sandi dan penanganan token kadaluarsa

### 14. Implementasikan aksi Logout dengan pembersihan sesi dan pengalihan ke halaman Login
