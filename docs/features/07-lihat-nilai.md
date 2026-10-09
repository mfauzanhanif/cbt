# Lihat Nilai

Fase 3 — Jadwal & Nilai _(Prioritas: Medium)_

Dosen dan mahasiswa melihat hasil ujian beserta rincian jawabannya.

## Spesifikasi

### Tujuan

Menyediakan transparansi dan kemudahan evaluasi hasil belajar bagi mahasiswa dan dosen melalui rekapitulasi nilai otomatis, analisis rincian jawaban per butir soal, serta fitur ekspor berkas rekap nilai untuk kebutuhan pengarsipan akademik.

### Selesai bila

- Mahasiswa dapat melihat daftar nilai ujian yang telah dikerjakan, lengkap dengan skor akhir, status kelulusan, dan waktu pengerjaan (apabila opsi `show_result` telah diizinkan oleh dosen).
- Dosen dapat melihat tabel rekapitulasi nilai seluruh mahasiswa di kelasnya dalam satu antarmuka yang dapat difilter, dicari, dan diurutkan.
- Rincian lembar jawaban setiap mahasiswa dapat dibuka untuk memeriksa jawaban yang dipilih, kunci jawaban yang benar, status benar/salah per butir soal, serta pembahasan soal jika tersedia.
- Dosen dan Admin dapat mengunduh rekapitulasi nilai kelas ke dalam format berkas Excel atau PDF.
- Otorisasi data terjaga ketat: mahasiswa hanya dapat mengakses nilainya sendiri, dosen hanya dapat melihat nilai kelas miliknya, dan admin dapat melihat seluruh data nilai.

## Sub-fitur: Nilai Saya

Mahasiswa melihat nilai dan status kelulusan dari ujian yang dikerjakan.

### Tujuan

Memberikan informasi hasil ujian pribadi kepada mahasiswa secara jelas, akurat, dan tepat waktu sesuai izin publikasi dari dosen pengampu.

### Selesai bila

- Halaman "Nilai Saya" menampilkan kartu/tabel riwayat ujian yang telah diserahkan (`status = submitted` atau `graded`), tanggal penyerahan, dan perolehan skor akhir.
- Jika dosen pengampu belum mengaktifkan opsi tampilkan nilai (`show_result = false`), nilai disembunyikan dan digantikan pesan informatif bahwa hasil ujian masih dalam tahap evaluasi.
- Mahasiswa hanya dapat melihat data nilai miliknya sendiri dan tidak memiliki akses ke data nilai rekan sekelasnya.

## Sub-fitur: Rekap Nilai Kelas

Dosen melihat daftar nilai seluruh mahasiswa di kelasnya dalam satu tabel.

### Tujuan

Memudahkan dosen memantau performa akademik kelas, melihat distribusi nilai mahasiswa, dan mengidentifikasi mahasiswa yang belum atau sudah mengumpulkan ujian.

### Selesai bila

- Tabel menampilkan daftar seluruh mahasiswa di kelas, status pengerjaan (Belum Mengerjakan, Sedang Mengerjakan, Selesai), waktu penyerahan, dan nilai akhir yang diperoleh.
- Dosen dapat memilih jadwal ujian dan kelas yang ingin dilihat, melakukan pencarian nama/NIM mahasiswa, serta mengurutkan data berdasarkan nilai tertinggi atau terendah.
- Tampil kartu statistik ringkasan kelas: nilai rata-rata, nilai tertinggi, nilai terendah, dan tingkat kelulusan.

## Sub-fitur: Detail Jawaban

Melihat rincian jawaban benar dan salah untuk setiap soal.

### Tujuan

Menyajikan tinjauan mendalam terhadap lembar pengerjaan mahasiswa untuk keperluan evaluasi butir soal, koreksi transparansi, dan pemahaman materi pembelajaran.

### Selesai bila

- Tampilan rincian lembar jawaban memuat teks soal, gambar soal/opsi, jawaban yang dipilih mahasiswa, kunci jawaban yang benar, serta indikator visual benar/salah yang tegas.
- Ringkasan evaluasi (jumlah benar, jumlah salah, jumlah butir kosong) ditampilkan pada bagian atas lembar jawaban.
- Dosen dapat membuka rincian jawaban setiap mahasiswa pada kelas ujiannya; mahasiswa hanya dapat membuka rincian jawabannya sendiri jika diizinkan oleh dosen.

## Sub-fitur: Unduh Nilai

Mengekspor rekap nilai ke berkas agar mudah diarsipkan.

### Tujuan

Memfasilitasi dosen dan bagian administrasi akademik mengarsipkan dan mendistribusikan laporan nilai ujian ke dalam format berkas standar (Excel / PDF).

### Selesai bila

- Tersedia tombol "Unduh Nilai" pada halaman rekap nilai kelas yang menghasilkan berkas spreadsheet (.xlsx/.csv) atau dokumen PDF.
- Berkas yang diunduh memuat metadata ujian (nama ujian, mata kuliah/kelas, nama dosen, tanggal ujian) serta daftar nama mahasiswa, NIM/email, dan nilai akhir.
- Tata letak berkas rapi dan langsung dapat dibuka di aplikasi spreadsheet standar.
- Hanya dosen pemilik ujian dan Admin yang memiliki izin untuk mengekspor berkas rekap nilai.

## Task

### 1. Bangun halaman Nilai Saya untuk mahasiswa dengan kartu riwayat ujian, skor akhir, dan status hasil

### 2. Bangun tabel Rekap Nilai Kelas untuk dosen dengan fitur pencarian, filter kelas, dan sorting nilai

### 3. Bangun kartu statistik kelas (rata-rata, nilai tertinggi, nilai terendah, jumlah peserta selesai)

### 4. Bangun halaman/modal Detail Jawaban per butir soal lengkap dengan penanda benar/salah dan pembahasan

### 5. Bangun tombol aksi dan dialog unduh rekap nilai (format Excel / PDF)

### 6. Buat endpoint backend untuk mengambil riwayat nilai mahasiswa dengan filter show_result

### 7. Buat endpoint rekapitulasi nilai kelas untuk dosen dengan kalkulasi agregat statistik kelas

### 8. Buat endpoint peninjauan lembar jawaban (attempt details) dengan otorisasi kepemilikan

### 9. Implementasikan service ekspor berkas nilai menggunakan maatwebsite/excel atau barryvdh/laravel-dompdf

### 10. Terapkan authorization policy untuk memastikan perlindungan privasi nilai antar mahasiswa dan antar dosen
