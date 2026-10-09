# Mobile-First Guidelines & Ergonomics

## 1. Paradigma Mobile-First (Mobile as Ground Truth)

Sesuai spesifikasi PRD, aplikasi CBT wajib responsif dan dapat dioperasikan secara lancar di perangkat seluler (ponsel pintar), tablet, hingga komputer desktop. Paradigma **Mobile-First** menetapkan bahwa:

1. **Tata Letak Dasar Dirancang untuk Ponsel (< 640px)**: Komponen, navigasi, dan aliran pengerjaan ujian pertama kali dioptimalkan untuk layar sempit berorientasi sentuh, lalu diperluas (_progressive enhancement_) ke tablet dan desktop.
2. **Kemandirian Operasi Satu Jempol (Single-Thumb Ergonomics)**: Aksi-aksi kritis (navigasi soal, penandaan ragu-ragu, pemilihan jawaban, dan pembukaan nomor soal) harus dapat dijangkau oleh satu tangan tanpa perlu menjangkau sudut atas layar.
3. **Pencegahan Salah Tekan (Anti-Mis-tap Guard)**: Menghindari kekeliruan fatal di tengah tekanan ujian dengan menerapkan batas ukuran target sentuh (_touch target_) yang ketat dan jarak pemisah yang aman.

---

## 2. Breakpoint Progresif

```css
/* Mobile Base: 320px - 639px */
/* Kolom tunggal, sticky bottom action dock, bottom sheet untuk palet soal */

@media (min-width: 640px) {
    /* Tablet (sm/md): 640px - 1023px */
    /* Padding lebih lebar, grid 2 kolom untuk kartu ujian & ringkasan */
}

@media (min-width: 1024px) {
    /* Desktop (lg/xl): >= 1024px */
    /* Split layout workstation (70% Canvas Soal, 30% Sidebar Palet Tetap) */
}
```

---

## 3. Ergonomi Sentuh & Target Ukuran (Touch Targets)

Pada layar sentuh, tombol dan opsi jawaban tidak boleh berukuran kecil.

| Elemen Antarmuka                         | Ukuran Minimal |         Rekomendasi CBT          | Alasan Teknis                                                        |
| :--------------------------------------- | :------------: | :------------------------------: | :------------------------------------------------------------------- |
| **Tombol Opsi Jawaban (A, B, C, D)**     |  Tinggi 48px   |      **Tinggi 52px - 60px**      | Memberikan area sentuh lebar dan nyaman saat membaca opsi panjang    |
| **Tombol Navigasi Bawah (Prev / Next)**  |  44px × 44px   | **Tinggi 48px (Lebar adaptif)**  | Mencegah salah sentuh saat transisi cepat antar soal                 |
| **Tombol Ragu-Ragu (Flag)**              |  44px × 44px   |         **Tinggi 48px**          | Memberikan penandaan yang pasti dengan warna amber kontras           |
| **Grid Palet Nomor Soal (Mobile Sheet)** |  40px × 40px   | **44px × 44px (Grid 5-6 kolom)** | Jarak aman antar angka minimal 8px agar jempol tidak menekan 2 angka |
| **Tombol Aksi Baris Kartu / Tabel**      |  36px × 36px   |  **44px × 44px (Icon Button)**   | Memudahkan aksi edit/hapus di layar sentuh ponsel                    |

---

## 4. Rekayasa Viewport Mobile Modern (Viewport Engineering)

Layar peramban mobile (Chrome Android, Safari iOS) memiliki bilah alamat dinamis (_dynamic address bar_) yang sering kali menyebabkan tinggi layar melonjak atau memotong konten jika menggunakan `100vh`.

### A. Penggunaan Dynamic Viewport Height (`dvh`)

```css
/* Container Utama Layar Ujian & Modal Penuh */
.exam-mobile-screen {
    min-height: 100dvh;
    height: 100dvh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
```

### B. Penanganan Safe Area Insets (Notch & Home Indicator)

Perangkat modern memiliki takik (_notch_) kamera di bagian atas dan bilah gestur (_home indicator_) di bagian bawah:

```css
/* Sticky Top Header (Timer & Beacon) */
.mobile-top-header {
    padding-top: calc(0.75rem + env(safe-area-inset-top));
}

/* Persistent Bottom Action Dock */
.mobile-bottom-dock {
    padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));
}
```

---

## 5. Zona Jangkauan Jempol (Thumb Zone Architecture)

Pada layar ponsel, layar terbagi menjadi tiga zona jangkauan tangan:

```
+---------------------------+
|    ZONA SULIT (TOP)       | -> Informasi Pasif: Timer, Nama Ujian, Status Koneksi
| (Hanya untuk display)     |
+---------------------------+
|    ZONA NETRAL (TENGAH)   | -> Area Membaca: Teks Soal, Gambar Stimulus
| (Scroll & View)           |
+---------------------------+
|    ZONA MUDAH (BAWAH)     | -> Interaksi Utama: Pilihan Opsi, Tombol Next/Prev,
| (Natural Thumb Reach)     |    Tombol Ragu-Ragu, Pemicu Palet Nomor Soal
+---------------------------+
```

---

## 6. Pola Transformasi Komponen (Mobile vs Desktop)

| Komponen                     | Tampilan Desktop (≥ 1024px)                                                             | Adaptasi Mobile (< 640px)                                                                                        |
| :--------------------------- | :-------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------- |
| **Palet Nomor Soal**         | Kolom samping kanan (_side rail_) selebar 340px dengan border kiri `3px solid var(--border)`. | **Interactive Bottom Sheet / Drawer** yang dapat ditarik (_swipe-up_) dengan trigger pill di dock bawah.         |
| **Bilah Waktu (Timer)**      | Kotak informasi lengkap dengan nama peserta, token, dan jam ujian di header 68px.       | **Compact Sticky Chip** berlatar putih dengan border tebal `2.5px solid var(--border)` menempel di pojok kanan atas header mobile.   |
| **Tabel Data (Admin/Dosen)** | Tabel multi-kolom lebar (Nama, Email, Kelas, Status, Aksi) dengan garis grid tebal.     | **Stacked Card List**: Baris tabel berubah menjadi kartu bertumpuk dengan badge status dan aksi sentuh langsung. |
| **Form Impor & Upload**      | Area dropzone besar bersebelahan dengan ringkasan instruksi.                            | **Vertical Stack**: Tombol pilih berkas besar diikuti kartu lampiran `Attachment` horizontal bergaya shadcn.     |
| **Filter & Pencarian**       | Formulir filter berjajar mendatar (_inline toolbar_) di atas tabel data.                | **Search Bar Penuh + Filter Drawer Button** yang memunculkan sheet filter dari bawah.                            |

---

## 7. Penanganan Papan Ketik Virtual (Virtual Keyboard Awareness)

Saat mahasiswa atau pengguna mengetik pada input pencarian, kolom jawaban esai, atau token ujian di perangkat ponsel:

1. Elemen sticky dock bawah otomatis diturunkan atau disembunyikan agar tidak menutupi bidang isian aktif.
2. Tambahkan `scroll-padding-bottom: 240px` pada container formulir agar bidang input otomatis terangkat ke atas keyboard virtual.
3. Gunakan `inputmode="numeric"` untuk input token ujian atau durasi menit agar ponsel langsung membuka keypad angka.
