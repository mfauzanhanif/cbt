---
name: Neo-Brutalist CBT
colors:
    # Light Mode (Monochromatic: Amber)
    background: 'hsl(48, 96%, 89%)'
    secondary-background: 'oklch(100% 0 0)' # #FFFFFF
    foreground: 'oklch(0% 0 0)' # #000000
    main-foreground: 'oklch(0% 0 0)'
    main: 'hsl(45, 100%, 50%)'
    border: 'oklch(0% 0 0)'
    ring: 'oklch(0% 0 0)'
    overlay: 'oklch(0% 0 0 / 0.8)'
    shadow: '4px 4px 0px 0px var(--border)'
    chart-1: '#FFBF00'
    chart-2: '#0099FF'
    chart-3: '#FF7A05'
    chart-4: '#00D696'
    chart-5: '#7A83FF'
    chart-active-dot: '#000000'
    # Dark Mode (Duotone: Amber)
    dark-background: 'hsl(28, 100%, 80%)'
    dark-secondary-background: 'oklch(100% 0 0)' # #FFFFFF
    dark-foreground: 'oklch(0% 0 0)'
    dark-main-foreground: 'oklch(0% 0 0)'
    dark-main: 'hsl(45, 100%, 50%)'
    dark-border: 'oklch(0% 0 0)'
    dark-ring: 'oklch(0% 0 0)'
    dark-overlay: 'oklch(0% 0 0 / 0.8)'
    dark-shadow: '4px 4px 0px 0px var(--border)'
    dark-chart-1: '#FFBF00'
    dark-chart-2: '#FF7A05'
    dark-chart-3: '#0099FF'
    dark-chart-4: '#00D696'
    dark-chart-5: '#7A83FF'
    dark-chart-active-dot: '#000000'
    # Semantic UI Tokens
    primary: 'var(--main)'
    primary-foreground: 'var(--main-foreground)'
    secondary: 'var(--secondary-background)'
    secondary-foreground: 'var(--foreground)'
    success: '#16A34A'
    success-foreground: '#FFFFFF'
    warning: '#D97706'
    warning-foreground: '#FFFFFF'
    danger: '#DC2626'
    danger-foreground: '#FFFFFF'
typography:
    font-sans: "'Inter', ui-sans-serif, system-ui, sans-serif"
    font-mono: "'JetBrains Mono', ui-monospace, monospace"
    font-weight-base: 500
    font-weight-heading: 800
    headline-xl: 35px
    headline-lg: 27px
    headline-md: 21px
    body-lg: 18px
    body-md: 15px
    body-sm: 13px
    timer: 27px
rounded:
    base: '5px'
    sm: '1px'
    md: '3px'
    lg: '5px'
    full: '9999px'
shadows:
    flat: 'none'
    shadow: '4px 4px 0px 0px var(--border)'
    reverse-shadow: '-4px -4px 0px 0px var(--border)'
    boxShadowX: '4px'
    boxShadowY: '4px'
    reverseBoxShadowX: '-4px'
    reverseBoxShadowY: '-4px'
borders:
    sm: '2px solid var(--border)'
    md: '2.5px solid var(--border)'
    lg: '3px solid var(--border)'
---

# Master Design System — Functional Neo-Brutalism for CBT

Sistem desain ini menetapkan standar arsitektur antarmuka, tata letak, dan interaksi untuk seluruh ekosistem **Computer-Based Testing (CBT)**. Mengadopsi prinsip estetika **Neo-Brutalism Amber**, sistem ini menggunakan dua tema terkalibrasi:

- **Mode Light = Monochromatic (Amber Monokromatik)**: Menggunakan latar belakang kanvas kuning hangat berenergi (`hsl(48, 96%, 89%)`).
- **Mode Dark = Duotone (Amber Duotone)**: Menggunakan latar belakang kanvas oranye persik hangat (`hsl(28, 100%, 80%)`).

Desain ini memprioritaskan ketegasan hierarki visual, kontras tinggi, keterbacaan instan, dan ergonomi **Mobile-First** di bawah tekanan kognitif tinggi ujian akademik.

---

## 1. Filosofi & Pilar Gaya (Brand & Core Style Tenets)

Menolak antarmuka korporat yang hambar dan blur halus, desain ini memperlakukan sistem ujian sebagai **instrumen fisik yang kokoh, berwibawa, dan dapat diandalkan**:

1. **Hard Structure (Batas Padat)**: Setiap elemen dibingkai garis tepi hitam pekat murni (`oklch(0% 0 0)` / `#000000`). Tidak ada garis samar (_ghost borders_) atau pemisah transparan.
2. **Graphic Tactility (Sentuhan Mekanis)**: Bayangan blok 45 derajat tanpa blur (`--shadow: 4px 4px 0px 0px var(--border)`). Tombol dan opsi mensimulasikan pergerakan mekanis tombol fisik saat ditekan (`hover:translate(4px, 4px) hover:shadow-none` atau `active:translate(3px, 3px)`).
3. **Flat Graphic Planes (Bidang Warna Murni)**: Permukaan menggunakan warna solid murni tanpa gradasi untuk memaksimalkan kontras dan performa rendering di seluruh perangkat.
4. **Technical Precision (Presisi Monospasi)**: Seluruh metrik operasional (timer ujian, nomor soal, token mahasiswa, skor) wajib menggunakan font monospasi `JetBrains Mono` bertipe _tabular figures_ agar tata letak tidak bergetar (_no layout jitter_).

---

## 2. Paradigma Mode Tampilan: Monochromatic & Duotone

| Aspek Mode | Mode Light (Monochromatic) | Mode Dark (Duotone) |
| :--- | :--- | :--- |
| **Karakter** | Bersih, cerah, bernuansa amber kuning monokromatik | Hangat, dramatis, kontras tinggi amber-peach duotone |
| **Background Kanvas** | `hsl(48, 96%, 89%)` | `hsl(28, 100%, 80%)` |
| **Secondary Background (Card/Field)** | `oklch(100% 0 0)` (Putih Murni) | `oklch(100% 0 0)` (Putih Murni) |
| **Aksen Utama (`--main`)** | `hsl(45, 100%, 50%)` (Kuning Amber) | `hsl(45, 100%, 50%)` (Kuning Amber) |
| **Teks & Garis (`--foreground` / `--border`)** | `oklch(0% 0 0)` (Hitam Solid) | `oklch(0% 0 0)` (Hitam Solid) |
| **Bayangan (`--shadow`)** | `4px 4px 0px 0px var(--border)` | `4px 4px 0px 0px var(--border)` |
| **Chart 1-5** | `#FFBF00`, `#0099FF`, `#FF7A05`, `#00D696`, `#7A83FF` | `#FFBF00`, `#FF7A05`, `#0099FF`, `#00D696`, `#7A83FF` |

---

## 3. Paradigma Mobile-First (Mobile-First Architecture)

Sesuai kebutuhan [PRD.md](file:///g:/Fauzan/Laragon/www/cbt/docs/PRD.md), antarmuka dirancang dari layar ponsel sebagai basis utama (_ground truth_), kemudian diperluas secara elegan ke tablet dan desktop:

- **Target Sentuh Aman (Touch Targets)**: Tombol aksi, opsi jawaban, dan sel nomor soal wajib memiliki target sentuh minimal **44px × 44px** (ideal 48px–52px) dengan jarak aman antar elemen minimal 8px untuk mencegah salah tekan (_mis-tap_).
- **Zona Jangkauan Jempol (Thumb Zone)**: Aksi-aksi berfrekuensi tinggi (Next, Prev, Ragu-ragu, Submit, dan Pemicu Palet Soal) ditempatkan pada **Persistent Bottom Action Dock** di bagian bawah layar.
- **Modern Viewport Units (`100dvh`)**: Seluruh tata letak layar penuh menggunakan unit _dynamic viewport height_ (`100dvh`) dan memperhitungkan `env(safe-area-inset-bottom)` serta `env(safe-area-inset-top)` untuk menjamin kompatibilitas dengan notch dan home indicator peramban ponsel modern.
- **Transformasi Responsif (Table-to-Card)**: Tabel data multi-kolom di desktop secara otomatis bertransformasi menjadi daftar kartu bertumpuk (_Stacked Card List_) di layar ponsel (< 768px).
- **Interactive Bottom Sheet**: Palet nomor soal di mobile disajikan sebagai laci bawah (_bottom sheet_) yang dapat ditarik (_swipe-up_) dengan _drag handle_ yang nyaman.

---

## 4. Palet Warna & Token (Color System)

| Token | Nilai CSS | Peran & Penggunaan |
| :--- | :---: | :--- |
| **Background (Light)** | `hsl(48, 96%, 89%)` | Kanvas kuning amber monokromatik ramah mata untuk sesi ujian terang. |
| **Background (Dark)** | `hsl(28, 100%, 80%)` | Kanvas oranye peach duotone kaya energi untuk mode kontras hangat. |
| **Secondary Background** | `oklch(100% 0 0)` | Putih solid. Digunakan untuk kartu soal, modal dialog, opsi pilihan, dan input formulir. |
| **Main / Primary** | `hsl(45, 100%, 50%)` | Kuning amber berenergi tinggi untuk CTA utama, nomor soal aktif, header sorotan. |
| **Foreground / Border** | `oklch(0% 0 0)` | Tinta hitam pekat untuk teks, ikon, border tebal, dan hard drop shadow. |
| **Success (Answered)** | `#16A34A` | Hijau saturasi tinggi. Menandakan soal yang sudah dijawab, notifikasi sukses simpan otomatis (_auto-save_). |
| **Warning (Ragu-Ragu)** | `#D97706` | Amber pekat. Dikhususkan secara eksklusif untuk status soal **Ragu-Ragu (Flagged)**. |
| **Danger (Urgent)** | `#DC2626` | Merah pekat. Menandakan batas 5 menit terakhir ujian, tombol pembatalan, dan status gagal/terputus. |
| **Overlay** | `oklch(0% 0 0 / 0.8)` | Lapisan peredup modal dialog hitam pekat 80%. |

---

## 5. Tipografi & Skala Teks

- **Teks Naratif & Konten Soal**: Menggunakan **Inter** dengan bobot minimal `500` (Medium / `--font-weight-base`) untuk teks isi dan `800` (ExtraBold / `--font-weight-heading`) untuk judul tebal. Tidak menggunakan bobot tipis 300/400.
- **Data Metrik & Hitung Mundur**: Menggunakan **JetBrains Mono** dengan bobot `700` atau `800` untuk timer ujian, nomor soal, token mahasiswa, dan badge status.

---

## 6. Indeks Modul Desain Terperinci (`docs/designs/`)

Untuk detail spesifikasi teknis dan implementasi per modul, silakan merujuk pada dokumen terpisah di dalam direktori [docs/designs/](file:///g:/Fauzan/Laragon/www/cbt/docs/designs/):

1. **[01-design-system-tokens.md](file:///g:/Fauzan/Laragon/www/cbt/docs/designs/01-design-system-tokens.md)**:
    - Nilai token CSS Tailwind v4 lengkap, palet Monochromatic vs Duotone, radius `5px`, bayangan blok `4px`, dan fisika interaksi tombol.
2. **[02-mobile-first-guidelines.md](file:///g:/Fauzan/Laragon/www/cbt/docs/designs/02-mobile-first-guidelines.md)**:
    - Standar ergonomi sentuh, batas ukuran target sentuh 44px–52px, diagram zona jangkauan jempol (_Thumb Zone_), rekayasa `100dvh` & `safe-area-insets`, penanganan keyboard virtual ponsel.
3. **[03-core-components.md](file:///g:/Fauzan/Laragon/www/cbt/docs/designs/03-core-components.md)**:
    - Katalog komponen Neo-Brutalist terintegrasi dengan shadcn/ui: Tombol (Primary, Secondary, Warning, Destructive), Opsi Pilihan Ganda, Countdown Timer, Grid Palet Nomor Soal, Form Controls, Uploader Lampiran Berkas, Badge, Modal, dan Toast Alert.
4. **[04-exam-workstation.md](file:///g:/Fauzan/Laragon/www/cbt/docs/designs/04-exam-workstation.md)**:
    - Arsitektur antarmuka **Kerjakan Ujian (Fase 2)** untuk mobile dan desktop: Sticky header dengan jam monospasi, Question Canvas, Persistent Bottom Dock, Interactive Bottom Sheet Palet Nomor Soal, peringatan waktu 5 menit, dan dialog konfirmasi.
5. **[05-dashboard-and-app-shell.md](file:///g:/Fauzan/Laragon/www/cbt/docs/designs/05-dashboard-and-app-shell.md)**:
    - Kerangka utama aplikasi (_App Shell_): Bilah atas (Topbar), Sidebar desktop vs Sheet mobile, pembeda visual warna aksen per peran, kartu metrik balok timbul, dan layar 403 Akses Ditolak.
6. **[06-data-management-and-tables.md](file:///g:/Fauzan/Laragon/www/cbt/docs/designs/06-data-management-and-tables.md)**:
    - Pola transformasi responsif Tabel Desktop ke Tumpukan Kartu Mobile (_Table-to-Card Pattern_) untuk modul Kelola Pengguna, Bank Soal, Jadwal Ujian, dan Rekap Nilai, dilengkapi paginasi taktil dan drag-and-drop reorder.
7. **[07-auth-and-profile.md](file:///g:/Fauzan/Laragon/www/cbt/docs/designs/07-auth-and-profile.md)**:
    - Kartu autentikasi terpusat berkarakter grafis kuat (Login, Register, Lupa Password, Reset Password, Verifikasi Email, Konfirmasi Password) serta halaman pengaturan Profil Saya.
