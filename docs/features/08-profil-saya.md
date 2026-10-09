# Profil Saya

Fase 4 _(Prioritas: Low)_

Setiap pengguna mengatur data pribadi dan keamanan akunnya sendiri.

## Spesifikasi

### Tujuan

Menyediakan halaman pengaturan akun mandiri bagi setiap pengguna (Admin, Dosen, dan Mahasiswa) untuk memperbarui data identitas pribadi, mengunggah foto profil, serta mengelola keamanan kata sandi akun tanpa membutuhkan intervensi admin.

### Selesai bila

- Pengguna dapat membuka halaman "Profil Saya" dan melihat data akun terkini (nama lengkap, alamat email terdaftar, nomor kontak/telepon, status peran, dan foto profil).
- Perubahan data diri (nama dan kontak) tersimpan langsung ke basis data dan segera terrefleksi di seluruh antarmuka aplikasi.
- Pengguna dapat mengunggah dan mengganti foto profil dengan pratinjau instan; foto tersimpan menggunakan `spatie/laravel-medialibrary`.
- Pengguna dapat mengubah kata sandi akun dengan memasukkan kata sandi saat ini (`current_password`) untuk konfirmasi keamanan sebelum menyimpan kata sandi baru.
- Jika pengguna mengubah alamat email, sistem secara otomatis menandai email belum terverifikasi dan mengirimkan tautan verifikasi ke email baru.
- Setiap pengguna hanya dapat mengakses dan memodifikasi profil akun miliknya sendiri.

## Sub-fitur: Ubah Data Diri

Memperbarui nama, kontak, dan informasi pribadi lainnya.

### Tujuan

Memungkinkan pengguna memperbarui informasi nama lengkap dan kontak telepon secara berkala agar data identitas pengguna tetap akurat dan relevan.

### Selesai bila

- Formulir profil menampilkan data saat ini pada isian nama lengkap, alamat email, dan nomor telepon/kontak.
- Pengguna dapat menyunting data dan menekan tombol "Simpan Perubahan" dengan umpan balik pesan sukses yang ramah.
- Penggantian email memicu validasi keunikan email di basis data dan mengaktifkan prosedur verifikasi email ulang untuk menjaga validitas akun.

## Sub-fitur: Foto Profil

Mengunggah atau mengganti foto yang tampil di akun.

### Tujuan

Memberikan kemudahan bagi pengguna mempersonalisasi akunnya dengan memasang atau mengganti foto profil yang merepresentasikan identitasnya di aplikasi.

### Selesai bila

- Tersedia tombol unggah foto profil yang mendukung berkas gambar standar (JPG, PNG, WebP) dengan batas ukuran yang wajar (mis. maks 2MB).
- Pengguna dapat melihat pratinjau gambar baru secara langsung sebelum menekan simpan.
- Foto profil yang berhasil diunggah langsung tampil di header aplikasi, avatar komentar/lembar ujian, dan kartu profil.
- Jika pengguna belum memiliki foto profil, sistem menampilkan avatar bawaan dengan inisial nama pengguna.

## Sub-fitur: Ganti Kata Sandi

Mengubah kata sandi dengan konfirmasi sandi lama.

### Tujuan

Meningkatkan keamanan akun pengguna dengan menyediakan mekanisme penggantian kata sandi berkala yang dilindungi verifikasi kata sandi lama.

### Selesai bila

- Formulir ganti kata sandi mewajibkan input kata sandi saat ini (`current_password`), kata sandi baru, dan konfirmasi kata sandi baru.
- Sistem memvalidasi kesesuaian kata sandi lama; jika keliru, muncul pesan kesalahan spesifik dan kata sandi tidak diperbarui.
- Kata sandi baru harus memenuhi standar kekuatan minimal (misal minimal 8 karakter).
- Setelah penggantian berhasil, sesi pengguna tetap terjaga dan sistem menampilkan notifikasi keberhasilan pembaruan kata sandi.

## Task

### 1. Bangun antarmuka halaman Profil Saya responsif dengan layout kartu atau tab informasi akun menggunakan shadcn/ui

### 2. Bangun formulir ubah data diri (nama, email, nomor telepon) lengkap dengan penanganan status tersimpan

### 3. Bangun komponen unggah avatar foto profil dengan pratinjau instan dan tombol hapus foto

### 4. Bangun komponen fallback inisial avatar untuk pengguna yang belum mengunggah foto profil

### 5. Bangun formulir ganti kata sandi dengan validasi kata sandi saat ini dan konfirmasi kata sandi baru

### 6. Daftarkan koleksi media 'avatar' pada model User menggunakan spatie/laravel-medialibrary

### 7. Buat FormRequest dan controller pembaruan data diri pengguna yang sedang login

### 8. Integrasikan aksi pembaruan kata sandi menggunakan Laravel Fortify (UpdateUserPassword)

### 9. Buat alur penanganan verifikasi ulang alamat email saat terjadi perubahan email pengguna

### 10. Buat endpoint unggah, perbarui, dan hapus foto profil via spatie/laravel-medialibrary

### 11. Terapkan otorisasi ketat untuk memastikan pengguna hanya dapat mengubah data profil miliknya sendiri
