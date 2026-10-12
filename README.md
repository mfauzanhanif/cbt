# 🎓 CBT (Computer Based Test) System

Sistem ujian berbasis komputer modern (**Computer Based Test**) yang dibangun dengan arsitektur monolith tangguh menggunakan **Laravel 13**, **Inertia.js v3**, **React 19**, **Tailwind CSS v4**, dan **TypeScript**. Didesain untuk institusi pendidikan, perguruan tinggi, sekolah, maupun pelatihan profesional.

---

## 🚀 Fitur Utama

### 🔐 1. Autentikasi & Kontrol Akses (RBAC)
- Multi-role berbasis **Spatie Laravel Permission**:
  - **Admin**: Manajemen pengguna (dosen & mahasiswa), import data massal via Excel, konfigurasi sistem.
  - **Dosen / Pengajar**: Pengelolaan mata kuliah, bank soal, paket soal, penjadwalan ujian, dan evaluasi nilai.
  - **Mahasiswa / Peserta**: Mengikuti ujian interaktif, melihat riwayat ujian, dan meninjau hasil serta pembahasan.
- Otentikasi aman via **Laravel Fortify** lengkap dengan dukungan **Passkeys / WebAuthn**, reset kata sandi, dan pembatasan sesi.
- Fitur aktivasi & penonaktifan akun secara instan (*toggle active status*).

### 📚 2. Manajemen Akademik
- Pengelolaan data mata kuliah / kelas.
- Pemetaan dosen pengampu dan pendaftaran mahasiswa ke dalam mata kuliah (*course enrollment*).

### 📝 3. Bank Soal & Paket Soal Terpadu
- Pembuatan butir soal pilihan ganda (*multiple choice*) dengan label opsi fleksibel (A, B, C, D, dsb.).
- Klasifikasi tingkat kesulitan soal (*Mudah*, *Sedang*, *Sulit*).
- Kunci jawaban otomatis dan teks penjelasan/pembahasan lengkap per butir soal.
- Fitur duplikasi butir soal untuk efisiensi pembuatan materi ujian.
- Pengorganisasian soal ke dalam **Paket Soal** (*Question Package*) dengan sinkronisasi urutan soal yang fleksibel.

### ⏱️ 4. Workstation Ujian Interaktif (Mahasiswa)
- Antarmuka workstation ujian bersih, responsif, dan bebas distraksi.
- *Real-time Countdown Timer* tersinkronisasi dengan batas waktu pengerjaan.
- Panel kisi nomor soal (*Question Navigation Matrix*) dengan indikator status:
  - Sudah dijawab
  - Ragu-ragu
  - Belum dijawab
- Fitur penyimpanan jawaban otomatis (*auto-save*) saat memilih opsi.
- Konfirmasi penyerahan ujian aman dan penutupan otomatis saat waktu habis.

### 📊 5. Evaluasi Nilai & Pelaporan
- Penilaian otomatis (*instant scoring*) setelah ujian selesai dikerjakan.
- Rekapitulasi nilai peserta ujian per kelas.
- Ekspor rekap nilai ujian ke format **Excel (.xlsx)** via `maatwebsite/excel`.
- Review lembar jawaban peserta: membandingkan jawaban yang dipilih dengan kunci jawaban serta menampilkan penjelasan soal.

### 📦 6. Import Data Massal
- Import data mahasiswa dan dosen secara massal menggunakan file Excel (.xlsx).
- Tersedia template unduhan Excel resmi langsung dari panel admin.

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| **Backend Framework** | [Laravel 13](https://laravel.com/) (PHP 8.2+) |
| **Frontend Framework** | [React 19](https://react.dev/) |
| **SPA Bridge** | [Inertia.js v3](https://inertiajs.com/) (`@inertiajs/react`) |
| **CSS & UI Engine** | [Tailwind CSS v4](https://tailwindcss.com/) & [Radix UI](https://www.radix-ui.com/) |
| **Type Safety** | [TypeScript 5.9+](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite 8](https://vite.dev/) |
| **Database** | MySQL 8.0+ / MariaDB |
| **Routing Bridge** | [Laravel Wayfinder](https://github.com/laravel/wayfinder) |
| **Testing** | [Pest PHP](https://pestphp.com/) |

---

## 💻 Panduan Instalasi Lokal (Laragon)

Project ini dioptimalkan secara langsung untuk ekosistem **Laragon** di Windows.

### Prasyarat
- **Laragon** (PHP 8.2+, MySQL / MariaDB, Composer terpasang)
- **Node.js** (v20+ disarankan) & **pnpm** (atau npm)
- Laragon root folder: `C:\laragon\www\` atau direktori aktif Anda.

### Langkah-langkah Setup

1. **Clone & Masuk ke Direktori Proyek**
   ```bash
   git clone <repository-url> cbt
   cd cbt
   ```

2. **Pasang Dependensi Backend & Frontend**
   ```bash
   composer install
   pnpm install
   ```
   *Atau jalankan perintah ringkas:*
   ```bash
   make install
   ```

3. **Konfigurasi Environment (`.env`)**
   Salin file konfigurasi contoh:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

   Pastikan konfigurasi koneksi database di `.env` telah disesuaikan dengan Laragon:
   ```env
   APP_NAME="CBT"
   APP_ENV=local
   APP_URL=http://cbt.test

   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=cbt
   DB_USERNAME=root
   DB_PASSWORD=
   ```

4. **Buat Database & Jalankan Migrasi + Seeder**
   Pastikan service MySQL di Laragon sudah berjalan, lalu jalankan:
   ```bash
   php artisan migrate:fresh --seed
   ```
   *Atau cukup gunakan:*
   ```bash
   make fresh
   ```

5. **Buat Symlink Storage Publik**
   ```bash
   php artisan storage:link
   ```

6. **Jalankan Server Pengembangan**
   ```bash
   composer run dev
   ```
   *Atau via Make:*
   ```bash
   make dev
   ```
   Akses aplikasi melalui peramban: `http://cbt.test` (atau `http://localhost:8000`).

---

## 🔑 Akun Demo Bawaan (Default Seeders)

Setelah menjalankan `php artisan migrate:fresh --seed`, gunakan kredensial berikut untuk menguji berbagai hak akses:

| Peran (Role) | Email | Password | Hak Akses Utama |
|---|---|---|---|
| **Admin** | `admin@fauzanhanif.my.id` | `password` | Kelola user, import Excel, pantau sistem |
| **Dosen** | `dosen@fauzanhanif.my.id` | `password` | Kelola mata kuliah, soal, paket, ujian, nilai |
| **Mahasiswa** | `mahasiswa@fauzanhanif.my.id` | `password` | Mengikuti ujian, review hasil, lihat nilai |

---

## ⚡ Perintah Cepat (Makefile Toolkit)

Tersedia automation toolkit via `Makefile` untuk mempercepat alur kerja:

```bash
# === PENGEMBANGAN LOKAL ===
make dev          # Jalankan server lokal (PHP Artisan Serve + Vite HMR)
make build        # Build aset frontend produksi (pnpm run build)
make install      # Pasang dependensi PHP & Node sekaligus
make migrate      # Jalankan database migration
make fresh        # Reset database dan isi seed data lengkap
make seed         # Jalankan seeder database saja
make test         # Jalankan pengujian otomatis Pest
make lint         # Format kode PHP dengan Laravel Pint
make types        # Cek tipe TypeScript (tsc --noEmit)
make clean        # Bersihkan cache Laravel dan file dev sementara

# === DEPLOYMENT CPANEL / PRODUCTION ===
make deploy       # Paketkan aplikasi ke cbt.tar.gz & ekspor cbt.sql
make deploy-cbt   # Optimasi composer (--no-dev), build React, dan arsipkan monolith ke cbt.tar.gz
make deploy-db    # Dump database MySQL ke file cbt.sql
make help         # Tampilkan panduan seluruh target make
```

---

## 🚀 Panduan Deployment ke Shared Hosting (cPanel)

Proyek ini telah dilengkapi pipeline packaging otomatis untuk hosting yang **tidak memiliki akses SSH maupun Node.js**:

1. **Jalankan Perintah Deploy di Lokal:**
   ```bash
   make deploy
   ```
   Perintah ini akan secara otomatis:
   - Menghapus cache dev & file `public/hot`.
   - Melakukan kompilasi aset frontend React & Vite ke `public/build`.
   - Mengoptimalkan autoloader Composer dan menghapus require-dev (`--optimize-autoloader --no-dev`).
   - Mengompresi seluruh project menjadi **`cbt.tar.gz`** di root folder (mengecualikan file dev seperti `node_modules`, `.git`, `tests`, dll).
   - Melakukan mysqldump database lokal ke file **`cbt.sql`** di root folder.
   - Mengembalikan dependensi require-dev lokal Anda secara otomatis.

2. **Unggah ke cPanel:**
   - Masuk ke **cPanel File Manager**.
   - Unggah file `cbt.tar.gz` ke direktori tujuan (misalnya subfolder atau root domain).
   - Ekstrak file `cbt.tar.gz` langsung melalui File Manager cPanel.

3. **Impor Database:**
   - Buat database MySQL baru dan user di cPanel.
   - Buka **phpMyAdmin** di cPanel, pilih database yang baru dibuat, lalu impor file `cbt.sql`.

4. **Konfigurasi `.env` di Server:**
   - Salin `.env.example` menjadi `.env` di hosting.
   - Sesuaikan `APP_URL`, `DB_DATABASE`, `DB_USERNAME`, dan `DB_PASSWORD` sesuai kredensial database cPanel Anda.
   - Set `APP_ENV=production` dan `APP_DEBUG=false`.

5. **Storage Symlink di cPanel:**
   - Jika hosting tidak memiliki SSH, Anda dapat memicu pembuatan symlink storage dengan login sebagai **Admin** lalu mengakses URL:
     `https://domain-anda.com/admin/storage-link`

---

## 📁 Struktur Direktori Utama

```
cbt/
├── app/
│   ├── Enums/                 # Role & Status Enums
│   ├── Http/
│   │   ├── Controllers/       # Controller Mahasiswa, Dosen, Ujian, dsb.
│   │   │   └── Admin/         # Controller Mahasiswa, Dosen, Import untuk Admin
│   │   ├── Middleware/        # Middleware otentikasi & RBAC
│   │   └── Requests/          # Form Requests validasi input
│   ├── Imports/               # Class import data Excel (Maatwebsite)
│   └── Models/                # Model Eloquent (User, Course, Exam, Question, dsb.)
├── database/
│   ├── migrations/            # Skema database relasional
│   └── seeders/               # Data awal (Role, Akun Admin/Dosen/Mahasiswa, Soal Uji Coba)
├── resources/
│   ├── css/                   # Styling global (Tailwind CSS v4)
│   └── js/
│       ├── components/        # Komponen UI (Radix, Button, Dialog, Form, dsb.)
│       ├── layouts/           # Layout utama aplikasi (AppLayout, AuthLayout, WorkstationLayout)
│       ├── pages/             # Halaman antarmuka Inertia React
│       │   ├── admin/         # Panel manajemen Admin
│       │   ├── exams/         # Manajemen Ujian & Rekap Nilai Dosen
│       │   ├── questions/     # Bank Soal & Paket Soal
│       │   └── student/       # Workstation Ujian Mahasiswa & Hasil Nilai
│       └── types/             # Deklarasi antarmuka TypeScript
├── routes/
│   ├── web.php                # Rute aplikasi & RBAC
│   ├── auth.php               # Rute autentikasi Fortify
│   └── settings.php           # Rute pengaturan profil & keamanan
├── Makefile                   # Otomasi pengujian, build, & packaging cPanel
└── vite.config.ts             # Konfigurasi bundling Vite + React + Tailwind
```

---

## 📄 Lisensi

Aplikasi ini dikembangkan di bawah lisensi terbuka [MIT License](LICENSE).
