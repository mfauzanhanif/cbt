# Jadwal Ujian

Fase 3 — Jadwal & Nilai _(Prioritas: High)_

Dosen mengatur kapan ujian dibuka, siapa pesertanya, dan berapa lama pengerjaannya.

## Spesifikasi

### Tujuan

Memberikan kontrol penuh kepada dosen untuk merencanakan, menjadwalkan, mengonfigurasi batasan waktu, menetapkan kelas peserta, serta membuka atau menutup pelaksanaan ujian CBT secara fleksibel demi kelancaran evaluasi pembelajaran.

### Selesai bila

- Dosen dapat membuat, menyunting, dan membatalkan jadwal ujian (`exams`) yang mengaitkan satu kelas (`courses`) dengan satu paket soal (`question_packages`).
- Antarmuka daftar jadwal ujian menampilkan nama ujian, nama kelas, rentang tanggal buka/tutup, durasi pengerjaan, dan status ujian (Mendatang, Sedang Berjalan, Ditutup, Selesai).
- Dosen dapat mengonfigurasi pengaturan ujian: acak urutan soal (`shuffle_questions`) dan opsi menampilkan nilai ke mahasiswa (`show_result`).
- Dosen memiliki tombol kendali manual untuk membuka atau menutup akses ujian seketika (`is_active`), melampaui rentang jadwal otomatis jika diperlukan.
- Mahasiswa yang terdaftar sebagai anggota kelas peserta dapat melihat ujian tersebut di daftar ujian aktif sesuai jendela waktu yang ditentukan.
- Dosen hanya dapat melihat dan mengelola jadwal ujian miliknya sendiri (`teacher_id = auth()->id()`).

## Sub-fitur: Buat Jadwal

Menentukan ujian baru dengan nama, kelas, dan paket soalnya.

### Tujuan

Memfasilitasi dosen menginisialisasi jadwal ujian baru dengan memilih paket soal yang telah disusun dan kelas mahasiswa sasaran.

### Selesai bila

- Formulir pembuatan jadwal menyediakan isian nama ujian, pilihan kelas yang diampu dosen, dan pilihan paket soal milik dosen tersebut.
- Dropdown pilihan kelas dan paket soal hanya menampilkan data aktif milik dosen yang sedang login.
- Jadwal yang berhasil disimpan langsung muncul pada daftar jadwal ujian dengan status awal yang terhitung otomatis.

## Sub-fitur: Atur Waktu & Durasi

Mengatur tanggal mulai, batas akhir, dan lama pengerjaan ujian.

### Tujuan

Menetapkan batasan jendela waktu pelaksanaan ujian dan durasi hitung mundur pengerjaan agar proses evaluasi berjalan tertib dan terukur.

### Selesai bila

- Formulir menyediakan isian tanggal & jam mulai (`start_at`), tanggal & jam batas akhir (`end_at`), serta durasi pengerjaan dalam satuan menit (`duration_minutes`).
- Sistem memvalidasi bahwa waktu akhir harus lebih besar daripada waktu mulai (`end_at > start_at`), dan durasi pengerjaan minimal 1 menit serta tidak melebihi rentang jendela buka-tutup.
- Rentang waktu dan durasi diformat dengan jelas dalam waktu lokal Indonesia (WIB/WITA/WIT).

## Sub-fitur: Peserta Ujian

Memilih kelas atau mahasiswa yang berhak mengikuti ujian.

### Tujuan

Menentukan secara tepat mahasiswa yang berhak mengakses dan mengerjakan ujian berdasarkan keanggotaan kelas perkuliahan.

### Selesai bila

- Dosen mengaitkan jadwal ujian ke sebuah kelas perkuliahan (`course_id`).
- Seluruh mahasiswa yang tergabung dalam kelas tersebut (berdasarkan tabel pivot `course_user`) secara otomatis berhak mengikuti ujian.
- Mahasiswa di luar kelas tersebut tidak akan melihat ujian pada dasbor mereka dan dicegah untuk memulai sesi pengerjaan.

## Sub-fitur: Buka & Tutup Ujian

Membuka atau menutup akses ujian secara manual di luar jadwal.

### Tujuan

Memberikan otoritas darurat atau khusus bagi dosen untuk membuka sesi ujian lebih awal atau menutup ujian seketika di luar rentang jadwal yang telah ditentukan.

### Selesai bila

- Setiap baris jadwal ujian dilengkapi tombol sakelar (toggle switch) status buka/tutup manual (`is_active`).
- Saat ujian ditutup secara manual (`is_active = false`), mahasiswa yang belum memulai tidak dapat mengakses ujian, dan mahasiswa yang sedang mengerjakan diberitahu bahwa ujian telah ditutup oleh pengawas.
- Saat ujian dibuka secara manual di luar jadwal, mahasiswa anggota kelas dapat langsung memulai pengerjaan dengan durasi menit yang tetap berlaku.

## Task

### 1. Bangun halaman daftar Jadwal Ujian dosen dengan badge status (Mendatang, Berjalan, Selesai, Ditutup)

### 2. Bangun formulir buat dan ubah jadwal ujian dengan dropdown kelas dan paket soal milik dosen

### 3. Bangun komponen pemilih rentang tanggal waktu (date-time picker) dan input durasi menit

### 4. Buat opsi sakelar pengaturan ujian: acak soal (shuffle_questions) dan tampilkan nilai (show_result)

### 5. Buat tombol sakelar buka/tutup manual (is_active toggle) dengan umpan balik status instan

### 6. Buat skema migrasi tabel exams lengkap dengan kolom start_at, end_at, duration_minutes, is_active, shuffle_questions, dan show_result

### 7. Buat model Exam beserta relasi ke User (teacher), Course, QuestionPackage, dan ExamAttempt

### 8. Buat FormRequest dan controller CRUD Jadwal Ujian dengan validasi rentang waktu logis

### 9. Buat endpoint toggle status buka/tutup manual oleh dosen pemilik ujian

### 10. Buat logic komputasi status jadwal ujian (Mendatang / Berjalan / Selesai / Ditutup) di sisi backend & frontend

### 11. Terapkan authorization policy untuk memastikan dosen hanya dapat mengelola jadwal ujian miliknya sendiri
