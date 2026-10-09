# Kelola Pengguna

Fase 1 — Fondasi: Autentikasi, RBAC & Pengguna _(Prioritas: High)_

Admin dan dosen mengatur data mahasiswa, dosen, dan kelas beserta anggotanya.

## Spesifikasi

### Tujuan

Menyediakan satu modul terpusat bagi admin dan dosen untuk mengelola master data akun mahasiswa dan dosen, melakukan impor massal akun dari berkas spreadsheet, serta mengatur kelas perkuliahan beserta mahasiswa anggotanya sebagai basis peserta ujian CBT.

### Selesai bila

- Admin dapat mengelola seluruh daftar pengguna (mahasiswa dan dosen), melakukan pencarian, penyaringan status, menambah akun baru, menyunting data, dan mengaktifkan/menonaktifkan akun.
- Dosen dapat melihat daftar mahasiswa dalam lingkup kelas yang diampunya dan mengelola keanggotaan mahasiswa di kelas tersebut.
- Admin dapat mengimpor data akun massal dari berkas Excel/CSV menggunakan pustaka `maatwebsite/excel` dengan validasi baris dan pelaporan ringkasan hasil yang transparan.
- Admin dan dosen dapat membuat data kelas (`courses`) dengan kode kelas unik dan mengelola mahasiswa anggota kelas (`course_user`).
- Setiap perubahan status atau keanggotaan langsung berdampak pada hak akses dan ketersediaan ujian bagi pengguna yang bersangkutan.

## Sub-fitur: Data Mahasiswa

Menambah, mengubah, dan menonaktifkan akun mahasiswa.

### Tujuan

Memudahkan pengelolaan data akun mahasiswa secara individu maupun berkelompok, memastikan informasi identitas lengkap, dan mengontrol status keaktifan akun.

### Selesai bila

- Tabel daftar mahasiswa dilengkapi pencarian (berdasarkan nama dan email), filter status (aktif/nonaktif), dan paginasi yang cepat.
- Admin dapat menambah akun mahasiswa baru secara manual dengan validasi email unik dan pembuatan kata sandi awal.
- Admin dapat menyunting informasi data mahasiswa dan menonaktifkan akun yang sudah lulus/cuti dengan dialog konfirmasi keamanan.
- Akun mahasiswa yang dinonaktifkan tidak dapat login ke sistem atau mengerjakan ujian.

## Sub-fitur: Data Dosen

Menambah, mengubah, dan menonaktifkan akun dosen.

### Tujuan

Memudahkan admin dalam mengelola akun tenaga pengajar (dosen) yang berwenang membuat soal, kelas, dan menyelenggarakan ujian.

### Selesai bila

- Tabel daftar dosen menampilkan nama, email, nomor telepon/kontak, jumlah kelas yang diampu, dan status keaktifan.
- Admin dapat menambahkan akun dosen baru, memperbarui informasi data dosen, serta mengaktifkan/menonaktifkan akun dosen.
- Dosen yang berstatus aktif memiliki hak akses untuk mengelola bank soal, paket soal, kelas miliknya, dan jadwal ujian.

## Sub-fitur: Impor Data

Memasukkan banyak akun sekaligus dari satu berkas.

### Tujuan

Mempercepat proses inisialisasi dan pendaftaran massal akun mahasiswa maupun dosen tanpa perlu input manual satu per satu.

### Selesai bila

- Tersedia template unduhan berkas (Excel/CSV) dengan format kolom yang telah ditentukan (nama, email, peran, kontak).
- Form upload berkas mendukung drag-and-drop dan validasi tipe berkas spreadsheet.
- Proses impor melakukan validasi integritas data: memvalidasi format email, mendeteksi duplikasi email di basis data, dan mengabaikan atau memperbarui baris sesuai aturan.
- Menampilkan dialog ringkasan hasil impor: jumlah data yang berhasil diimpor, jumlah yang gagal, beserta daftar baris dan rincian pesan kesalahannya.

## Sub-fitur: Kelas & Anggota

Mengatur kelas dan mahasiswa yang tergabung di dalamnya.

### Tujuan

Mengorganisir mahasiswa ke dalam rombongan belajar/kelas (`courses`) yang diampu oleh dosen tertentu sebagai dasar penugasan paket soal dan jadwal ujian.

### Selesai bila

- Dosen atau admin dapat membuat kelas baru dengan nama kelas, kode kelas unik (mis. "IF-301"), dan deskripsi opsional.
- Dosen pengampu dapat mengelola daftar mahasiswa anggota kelas: menambah mahasiswa ke dalam kelas, mencari mahasiswa, dan mengeluarkan mahasiswa dari kelas.
- Seorang mahasiswa dapat tergabung dalam beberapa kelas sekaligus melalui relasi tabel pivot `course_user`.
- Jumlah total anggota kelas ditampilkan di kartu atau tabel kelas untuk kemudahan pemantauan.

## Task

### 1. Bangun halaman utama Kelola Pengguna dengan navigasi tab (Mahasiswa, Dosen, Kelas) menggunakan shadcn/ui

### 2. Bangun komponen tabel data mahasiswa dengan fitur pencarian, filter status, dan paginasi

### 3. Bangun modal/dialog form tambah dan ubah data mahasiswa beserta konfirmasi penonaktifan

### 4. Bangun komponen tabel data dosen beserta form tambah/ubah dan toggle status aktif

### 5. Bangun antarmuka Impor Data massal (unggah berkas Excel/CSV, unduh template, dan dialog ringkasan hasil)

### 6. Bangun halaman daftar kelas (courses) dengan kartu informasi kelas, kode unik, dan jumlah anggota

### 7. Bangun antarmuka kelola anggota kelas (pencarian mahasiswa, checkbox seleksi banyak, tambah/keluarkan anggota)

### 8. Buat skema migrasi tabel courses dan tabel pivot course_user lengkap dengan relasi foreign key

### 9. Buat FormRequest dan controller CRUD Mahasiswa dan Dosen dengan validasi ketat dan penugasan peran

### 10. Buat FormRequest dan controller CRUD Kelas (courses) dengan validasi keunikan kode kelas

### 11. Buat endpoint manajemen anggota kelas (sinkronisasi data pivot course_user)

### 12. Implementasikan service impor Excel/CSV menggunakan maatwebsite/excel dengan chunking dan pelaporan galat

### 13. Terapkan otorisasi policy: dosen hanya mengelola kelas dan mahasiswa di kelas miliknya, admin mengelola secara global
