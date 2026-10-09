# Hak Akses

Fase 1 — Fondasi: Autentikasi, RBAC & Pengguna _(Prioritas: High)_

Setiap peran hanya bisa membuka menu dan data yang menjadi haknya.

## Spesifikasi

### Tujuan

Menerapkan kontrol akses berbasis peran (RBAC) yang ketat dan menyeluruh menggunakan spatie/laravel-permission, sehingga setiap pengguna (admin, dosen, mahasiswa) hanya dapat melihat menu, mengeksekusi aksi, dan mengakses data yang sah sesuai hak dan tanggung jawabnya.

### Selesai bila

- Saat berhasil login, pengguna secara otomatis diarahkan ke antarmuka utama/dashboard sesuai perannya tanpa opsi untuk memilih atau memanipulasi peran sendiri.
- Menu navigasi, sidebar, dan tombol aksi di sisi frontend (React/Inertia) hanya menampilkan fitur yang diizinkan untuk peran yang sedang aktif.
- Backend memvalidasi setiap permintaan menggunakan middleware, Gates, dan Authorization Policies; upaya membuka halaman atau mengeksekusi API di luar hak akses menghasilkan respon "403 Akses Ditolak" tanpa kebocoran data.
- Akun yang dinonaktifkan (`is_active = false`) oleh admin secara otomatis dicegah mengakses aplikasi dan sesi aktifnya langsung dihentikan.
- Perubahan penugasan peran oleh admin langsung berlaku secara real-time pada otorisasi berikutnya.

## Sub-fitur: Peran Pengguna

Menentukan siapa berperan sebagai admin, dosen, atau mahasiswa.

### Tujuan

Mengklasifikasikan setiap akun pengguna ke dalam salah satu dari tiga peran utama (Admin, Dosen, atau Mahasiswa) sebagai penentu dasar izin akses di seluruh sistem CBT.

### Selesai bila

- Sistem memiliki tiga peran baku:
    - **Admin (Super Admin):** Akses penuh ke seluruh fitur, manajemen pengguna, data kelas, soal, jadwal ujian, dan rekapitulasi nilai.
    - **Dosen:** Hak mengelola soal, paket soal, kelas (beserta anggotanya), jadwal ujian, dan rekapitulasi nilai milik kelasnya sendiri.
    - **Mahasiswa:** Hak mengakses daftar ujian aktif di kelasnya, mengerjakan ujian, dan melihat nilai miliknya sendiri.
- Admin dapat melihat daftar pengguna beserta perannya dan memiliki wewenang untuk mengubah peran seorang pengguna.
- Setiap pengguna memiliki peran yang terpetakan jelas melalui tabel `roles` dan `model_has_roles`.

## Sub-fitur: Batasan Dosen

Dosen hanya mengelola soal, kelas, jadwal ujian, dan nilai miliknya sendiri.

### Tujuan

Mengisolasi data akademik antar dosen sehingga seorang dosen tidak dapat melihat, mengubah, atau menyalahgunakan bank soal, paket soal, jadwal ujian, maupun nilai milik dosen lain.

### Selesai bila

- Dosen hanya melihat daftar soal, paket soal, kelas (`courses`), jadwal ujian (`exams`), dan nilai yang dibuat atau diampu oleh dirinya sendiri (`teacher_id = auth()->id()`).
- Upaya mengakses atau memodifikasi ID data milik dosen lain melalui manipulasi URL atau API request dicegat oleh Policy dan menghasilkan respon 403 Forbidden.
- Setiap pembuatan data baru (soal, paket soal, kelas, jadwal) secara otomatis mengikat ID dosen yang sedang login sebagai pemilik data.

## Sub-fitur: Batasan Mahasiswa

Mahasiswa hanya bisa mengerjakan ujian dan melihat nilainya sendiri.

### Tujuan

Membatasi akses mahasiswa secara ketat agar hanya berfokus pada keikutsertaan ujian dan informasi hasil belajar pribadinya, tanpa akses ke data administratif apa pun.

### Selesai bila

- Mahasiswa hanya melihat daftar ujian dari kelas yang diikutinya (berdasarkan relasi tabel pivot `course_user`) dan yang jadwalnya sedang terbuka.
- Mahasiswa hanya dapat melihat nilai akhir dan rincian jawaban miliknya sendiri; data pengerjaan mahasiswa lain tidak dapat diakses sama sekali.
- Mahasiswa tidak memiliki akses ke menu pembuatan soal, pengaturan kelas, jadwal ujian, maupun rekap nilai dosen; rute-rute tersebut dilindungi di level middleware dan policy.

## Task

### 1. Bangun komponen layout, sidebar, dan navigasi adaptif per peran (Admin, Dosen, Mahasiswa) dengan shadcn/ui

### 2. Bangun halaman Akses Ditolak (403 Forbidden) yang responsif dan informatif

### 3. Buat migrasi, permission seeder, dan konfigurasi paket spatie/laravel-permission

### 4. Buat middleware pemeriksaan peran (role) dan hak akses (permission) pada rute Inertia & API

### 5. Buat middleware pencegahan akses untuk pengguna dengan status akun nonaktif (is_active = false)

### 6. Buat Laravel Authorization Policies untuk Model Course, Question, QuestionPackage, Exam, dan ExamAttempt

### 7. Terapkan query scoping otomatis pada controller dosen (hanya data dengan teacher_id milik dosen yang sedang login)

### 8. Terapkan query scoping otomatis pada data mahasiswa (hanya data ujian dan kelas yang diikuti via course_user)

### 9. Bangun antarmuka bagi Admin untuk melihat dan mengubah peran pengguna

### 10. Implementasikan pengujian otomatis (Feature Test) untuk memverifikasi isolasi data dan pencegahan eskalasi hak akses
