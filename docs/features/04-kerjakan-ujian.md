# Kerjakan Ujian

Fase 2 — Inti CBT _(Prioritas: High)_

Mahasiswa mengerjakan ujian pilihan ganda langsung di layar dengan gambar dan waktu berjalan.

## Spesifikasi

### Tujuan

Menyediakan antarmuka pengerjaan ujian berbasis komputer (CBT) bagi mahasiswa yang responsif, bebas distraksi, mendukung gambar pada soal maupun opsi jawaban, dilengkapi hitung mundur durasi (timer), serta mekanisme penyimpanan jawaban otomatis (auto-save) yang andal demi memastikan tidak ada data jawaban yang hilang saat terjadi kendala koneksi.

### Selesai bila

- Mahasiswa hanya dapat melihat dan mengerjakan ujian yang memang ditujukan untuk kelas yang diikutinya dan jadwal ujiannya sedang aktif (`is_active = true` dan berada dalam rentang `start_at` hingga `end_at`).
- Layar pengerjaan menampilkan soal pilihan ganda (single choice) dengan teks yang jelas, mendukung tampilan gambar pada soal maupun pada tiap opsi jawaban secara proporsional di perangkat ponsel dan komputer.
- Terdapat panel navigasi nomor soal yang interaktif dengan indikator visual status soal (sudah dijawab, belum dijawab, dan soal yang sedang dibuka).
- Sisa waktu pengerjaan ditampilkan secara real-time; jika waktu habis, sistem otomatis mengumpulkan jawaban terakhir yang tersimpan dan mengunci ujian.
- Jawaban otomatis tersimpan ke server setiap kali mahasiswa memilih opsi jawaban tanpa perlu menekan tombol simpan manual.
- Mahasiswa dapat mengonfirmasi pengumpulan jawaban dan menerima halaman konfirmasi penyerahan ujian selesai; setelah dikumpulkan, pengerjaan dikunci permanen.

## Sub-fitur: Daftar Ujian Aktif

Melihat ujian yang sedang dibuka beserta durasi dan batas waktunya.

### Tujuan

Memberikan gambaran yang jelas kepada mahasiswa mengenai seluruh ujian yang sedang terbuka, jadwal pelaksanaan, durasi pengerjaan, dan status pengerjaan saat ini.

### Selesai bila

- Halaman menampilkan kartu/daftar ujian yang sedang aktif untuk kelas-kelas yang diikuti mahasiswa.
- Setiap kartu ujian memuat informasi nama ujian, nama mata kuliah/kelas, durasi pengerjaan (menit), dan rentang batas waktu buka-tutup.
- Ujian yang belum dimulai menampilkan tombol "Mulai Kerjakan"; ujian yang sedang berjalan menampilkan "Lanjutkan Ujian"; ujian yang sudah dikumpulkan menampilkan status "Selesai" tanpa tombol mulai.
- Tampil pesan status kosong yang informatif apabila tidak ada ujian yang sedang aktif.

## Sub-fitur: Layar Soal

Menampilkan soal pilihan ganda lengkap dengan gambar pada soal maupun jawaban.

### Tujuan

Menyajikan soal ujian dan pilihan jawaban dalam antarmuka yang bersih, mudah dibaca, dan mendukung konten multimedia (gambar pada soal dan pilihan jawaban).

### Selesai bila

- Layar menampilkan isi teks soal lengkap dengan gambar soal (jika tersedia), serta pilihan jawaban (A, B, C, D, dst.) yang masing-masing dapat memuat teks dan gambar.
- Mahasiswa dapat memilih satu opsi jawaban dengan mudah; opsi terpilih terlihat kontras dan jelas.
- Navigasi antar-soal dapat dilakukan melalui tombol "Sebelumnya", "Berikutnya", atau dengan langsung mengklik nomor soal pada grid navigasi.
- Jika fitur acak soal (`shuffle_questions`) diaktifkan pada jadwal ujian, urutan soal atau pilihan jawaban diacak secara konsisten untuk mahasiswa tersebut.

## Sub-fitur: Timer & Simpan Otomatis

Menghitung sisa waktu dan menyimpan jawaban otomatis agar tidak hilang.

### Tujuan

Memastikan durasi ujian terkontrol secara presisi dan seluruh progres jawaban mahasiswa tersimpan secara aman di basis data secara berkala tanpa intervensi manual.

### Selesai bila

- Timer hitung mundur berjalan terus-menerus berdasarkan selisih waktu mulai (`started_at`) dan durasi ujian (`duration_minutes`), disinkronkan dengan jam server.
- Memberikan peringatan visual halus saat sisa waktu pengerjaan tersisa sedikit (misal kurang dari 5 menit).
- Setiap kali mahasiswa mengubah pilihan jawaban, jawaban dikirimkan ke server secara asynchronous (auto-save) dan disimpan ke tabel `exam_answers`.
- Tampil indikator status penyimpanan (mis. "Menyimpan...", "Tersimpan") untuk memberikan rasa aman kepada mahasiswa.
- Bila waktu ujian habis, aplikasi otomatis mengirimkan jawaban akhir dan menghentikan ujian (auto-submit).

## Sub-fitur: Kumpulkan Jawaban

Mengirim seluruh jawaban dan menampilkan konfirmasi ujian selesai.

### Tujuan

Memungkinkan mahasiswa menyelesaikan dan menyerahkan ujian secara sadar dengan konfirmasi kelengkapan jawaban, serta mencatat status akhir pengerjaan di sistem.

### Selesai bila

- Tersedia tombol "Kumpulkan Jawaban" yang memunculkan dialog modal konfirmasi.
- Modal konfirmasi merangkum status pengerjaan: jumlah soal yang sudah dijawab dan jumlah soal yang masih kosong/belum dijawab.
- Setelah mahasiswa mengonfirmasi pengumpulan, status pengerjaan pada `exam_attempts` berubah menjadi `submitted` lengkap dengan timestamp `submitted_at`.
- Mahasiswa diarahkan ke halaman penyelesaian ujian dan tidak dapat lagi kembali ke layar soal atau mengubah jawaban yang sudah diserahkan.

## Task

### 1. Bangun antarmuka Daftar Ujian Aktif mahasiswa dengan kartu ujian, jadwal, durasi, dan status

### 2. Bangun tata letak layar pengerjaan soal CBT yang fokus, bebas distraksi, dan ramah pengguna

### 3. Bangun komponen navigasi grid nomor soal dengan penanda status (terjawab, kosong, aktif)

### 4. Integrasikan penampil gambar pada soal dan opsi jawaban menggunakan komponen media responsif React

### 5. Bangun komponen Timer hitung mundur yang tersinkronisasi dengan server dan dilengkapi notifikasi waktu menipis

### 6. Implementasikan mekanisme auto-save jawaban ke endpoint server dengan status indikator penyimpanan

### 7. Bangun dialog modal konfirmasi pengumpulan ujian dengan rekapitulasi soal belum terjawab

### 8. Bangun halaman konfirmasi penyelesaian ujian (Submission Success page)

### 9. Buat skema migrasi tabel exam_attempts dan exam_answers lengkap dengan relasi foreign key dan indeks

### 10. Buat endpoint untuk memulai atau melanjutkan pengerjaan ujian (Start/Resume Attempt) dengan validasi jendela waktu

### 11. Buat endpoint auto-save jawaban mahasiswa per soal ke tabel exam_answers

### 12. Buat endpoint finalisasi ujian (submit attempt) yang mengunci pengerjaan dan menghitung skor otomatis

### 13. Buat proteksi keamanan backend untuk memastikan mahasiswa tidak dapat mengerjakan ujian di luar kelasnya atau yang sudah selesai
