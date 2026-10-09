# Bank Soal

Fase 2 — Inti CBT _(Prioritas: High)_

Dosen membuat dan merapikan kumpulan soal untuk dipakai pada ujian.

## Spesifikasi

### Tujuan

Menyediakan repositori terpusat bagi dosen untuk membuat, mengelola, mengkategorikan, menduplikat, dan mengelompokkan soal-soal pilihan ganda ke dalam Paket Soal, lengkap dengan dukungan berkas gambar pada soal maupun pilihan jawaban menggunakan `spatie/laravel-medialibrary`, sehingga materi ujian dapat digunakan kembali secara efisien.

### Selesai bila

- Dosen dapat melihat daftar seluruh butir soal miliknya dengan fitur pencarian teks soal dan penyaringan berdasarkan tingkat kesulitan (mudah, sedang, sulit).
- Dosen dapat membuat dan menyunting soal pilihan ganda (single choice), menentukan kunci jawaban yang benar, menambahkan penjelasan/pembahasan, dan mengunggah gambar pada soal serta pada tiap opsi jawaban.
- Dosen dapat menyusun Paket Soal (`question_packages`) untuk satu set ujian, menambahkan atau melepas soal, serta mengatur urutan tampilan soal di dalam paket.
- Dosen dapat menduplikasi soal lama untuk mempercepat pembuatan variasi soal baru tanpa mengetik ulang dari awal.
- Dosen dapat menghapus soal yang tidak terpakai dengan konfirmasi pengamanan jika soal sedang digunakan pada paket atau jadwal ujian aktif.
- Dosen hanya dapat melihat dan mengelola bank soal miliknya sendiri (`teacher_id = auth()->id()`), sedangkan Admin dapat memantau seluruh bank soal.

## Sub-fitur: Daftar Soal

Melihat dan mencari semua soal yang pernah dibuat.

### Tujuan

Mempermudah dosen meninjau dan mencari koleksi soal yang telah dibuat dalam satu tabel/antarmuka yang rapi dan terorganisir.

### Selesai bila

- Halaman menampilkan daftar ringkasan soal milik dosen (potongan teks soal, tipe pilihan ganda, tingkat kesulitan, keberadaan gambar, dan tanggal pembuatan).
- Kolom pencarian mampu memfilter soal berdasarkan kata kunci dalam teks soal secara langsung.
- Tersedia filter berdasarkan tingkat kesulitan (Mudah, Sedang, Sulit).
- Tampil pesan kondisi kosong (empty state) yang ramah bila dosen belum memiliki soal, disertai tombol ajakan untuk mulai membuat soal baru.

## Sub-fitur: Tambah & Edit Soal

Membuat soal pilihan ganda beserta gambar pada soal atau pilihan jawaban.

### Tujuan

Memfasilitasi dosen menyusun butir soal berkualitas tinggi dengan antarmuka formulir yang fleksibel, mendukung gambar ilustrasi pada soal dan opsi jawaban, serta validasi kelengkapan kunci jawaban.

### Selesai bila

- Formulir pembuatan soal memuat isian teks pertanyaan, tingkat kesulitan, pembahasan/penjelasan opsional, dan opsi pilihan jawaban dinamis (A, B, C, D, dst.).
- Tersedia opsi untuk menandai satu jawaban yang benar sebagai kunci jawaban (single choice).
- Dosen dapat mengunggah gambar pada pertanyaan utama dan/atau pada tiap opsi jawaban menggunakan komponen attachment/media dengan pratinjau instan.
- Berkas gambar tersimpan dengan aman via `spatie/laravel-medialibrary` di koleksi media yang sesuai.
- Soal yang disimpan dapat dibuka kembali kapan saja untuk diedit dengan data dan gambar yang terisi utuh.

## Sub-fitur: Paket Soal

Mengelompokkan soal menjadi satu set ujian yang siap dipakai.

### Tujuan

Memudahkan pengorganisasian butir-butir soal menjadi satu kesatuan bundel ujian (Paket Soal) yang siap dihubungkan ke jadwal ujian dan kelas mahasiswa.

### Selesai bila

- Dosen dapat membuat paket soal baru dengan nama paket dan deskripsi tujuan ujian.
- Dosen dapat memilih butir-butir soal dari bank soal miliknya dan memasukkannya ke dalam paket soal yang dibuat.
- Di dalam detail paket soal, dosen dapat mengatur urutan soal (`order` pada `question_package_items`), melihat ringkasan jumlah soal, serta melepas soal dari paket.
- Paket soal yang telah terisi soal siap dipilih saat dosen membuat jadwal ujian baru.

## Sub-fitur: Hapus & Duplikat Soal

Menghapus atau menyalin soal agar bisa dipakai ulang dengan cepat.

### Tujuan

Memberikan fleksibilitas bagi dosen untuk membersihkan bank soal dari butir yang usang dan menduplikasi soal kompleks beserta gambar dan opsi jawabannya secara instan.

### Selesai bila

- Tersedia tombol hapus soal dengan dialog konfirmasi agar tidak terhapus tanpa sengaja.
- Sistem memberikan peringatan atau pencegahan jika soal yang hendak dihapus masih terdaftar dalam jadwal ujian yang sedang aktif.
- Tersedia tombol duplikasi soal; saat diklik, sistem membuat salinan baru lengkap dengan opsi jawaban dan berkas gambar terkait, sehingga dosen tinggal melakukan penyesuaian kecil.

## Task

### 1. Bangun halaman utama Bank Soal dengan pencarian, filter tingkat kesulitan, dan kartu/tabel daftar soal

### 2. Bangun formulir tambah dan edit soal pilihan ganda dengan input opsi jawaban dinamis dan penanda kunci jawaban

### 3. Integrasikan komponen upload gambar pada soal dan opsi jawaban menggunakan media attachment React

### 4. Bangun halaman daftar Paket Soal dengan statistik jumlah butir soal dan aksi kelola

### 5. Bangun antarmuka detail Paket Soal untuk penambahan, pelepasan, dan pengaturan urutan soal (drag/reorder)

### 6. Bangun dialog modal konfirmasi hapus soal dengan validasi dependensi jadwal ujian

### 7. Buat aksi duplikasi soal instan dengan umpan balik visual yang jelas

### 8. Buat skema migrasi tabel questions, question_options, question_packages, dan question_package_items

### 9. Pasang trait InteractsWithMedia pada model Question dan QuestionOption untuk pengelolaan berkas gambar

### 10. Buat FormRequest dan controller CRUD Soal dengan validasi keberadaan minimal satu kunci jawaban yang benar

### 11. Buat FormRequest dan controller CRUD Paket Soal serta sinkronisasi urutan soal di tabel pivot

### 12. Buat endpoint duplikasi soal yang menyalin atribut data beserta berkas lampiran media

### 13. Terapkan authorization policy untuk memastikan dosen hanya mengelola bank soal dan paket soal miliknya sendiri
