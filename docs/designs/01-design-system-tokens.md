# Design System Tokens

## 1. Filosofi & Karakteristik Desain (Neo-Brutalism Amber)

Sistem desain CBT ini mengusung pendekatan **Neo-Brutalism Amber** yang dirancang khusus untuk lingkungan ujian berbasis komputer (_Computer-Based Testing_). Desain ini mengedepankan ketegasan grafis, kontras tinggi, hierarki visual absolut, dan umpan balik fisik mekanis (_tactile feedback_).

Sistem ini mendukung dua mode tampilan:

1. **Mode Light = Monochromatic**: Palet monokromatik kuning amber hangat (`hsl(48, 96%, 89%)`) dengan kartu putih solid (`oklch(100% 0 0)`), garis hitam pekat (`oklch(0% 0 0)`), dan aksen kuning menyala (`hsl(45, 100%, 50%)`).
2. **Mode Dark = Duotone**: Palet duotone oranye persik (`hsl(28, 100%, 80%)`) yang mempertahankan kontras tinggi dan garis tepi hitam tajam tanpa kehilangan identitas cerah khas Neo-Brutalisme.

### Prinsip Utama (Core Tenets)

1. **Hard Structure**: Setiap elemen dibingkai garis tepi hitam solid padat (`oklch(0% 0 0)` / `#000000`) dengan ketebalan standar 2px hingga 3px tanpa garis samar (_ghost borders_).
2. **Graphic Tactility**: Bayangan jatuh (_drop shadow_) tanpa blur dengan pergeseran sudut tegas (`4px 4px 0px 0px var(--border)`). Elemen interaktif bergeser ke arah bayangan saat di-hover atau ditekan (`hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none`).
3. **Flat Graphic Planes**: Menggunakan warna bidang datar murni tanpa gradien untuk memastikan kecepatan render dan keterbacaan optimal di berbagai jenis layar.
4. **Technical Precision**: Tipografi monospasi `JetBrains Mono` (_tabular figures_) digunakan pada semua data metrik, hitung mundur (_timer_), nomor soal, dan kode token ujian untuk mencegah lonjakan tata letak (_layout jitter_).

---

## 2. Palet Warna (Color Palette Tokens)

### A. Palet Mode Terang (Light Mode — Monochromatic Amber)

```css
:root {
    --background: hsl(48, 96%, 89%);
    --secondary-background: oklch(100% 0 0); /* #FFFFFF */
    --foreground: oklch(0% 0 0); /* #000000 */
    --main-foreground: oklch(0% 0 0);
    --main: hsl(45, 100%, 50%); /* Amber Brand */
    --border: oklch(0% 0 0);
    --ring: oklch(0% 0 0);
    --overlay: oklch(0% 0 0 / 0.8);
    --shadow: 4px 4px 0px 0px var(--border);
    --chart-1: #FFBF00;
    --chart-2: #0099FF;
    --chart-3: #FF7A05;
    --chart-4: #00D696;
    --chart-5: #7A83FF;
    --chart-active-dot: #000;
}
```

### B. Palet Mode Gelap (Dark Mode — Duotone Amber)

```css
.dark {
    --background: hsl(28, 100%, 80%);
    --secondary-background: oklch(100% 0 0); /* #FFFFFF */
    --foreground: oklch(0% 0 0);
    --main-foreground: oklch(0% 0 0);
    --main: hsl(45, 100%, 50%);
    --border: oklch(0% 0 0);
    --ring: oklch(0% 0 0);
    --overlay: oklch(0% 0 0 / 0.8);
    --shadow: 4px 4px 0px 0px var(--border);
    --chart-1: #FFBF00;
    --chart-2: #FF7A05;
    --chart-3: #0099FF;
    --chart-4: #00D696;
    --chart-5: #7A83FF;
    --chart-active-dot: #000;
}
```

### C. Tabel Peran Token Semantik

| Token Semantik | Light Mode (Monochromatic) | Dark Mode (Duotone) | Peran & Penggunaan |
| :--- | :---: | :---: | :--- |
| **`--background`** | `hsl(48, 96%, 89%)` | `hsl(28, 100%, 80%)` | Kanvas latar belakang utama aplikasi. |
| **`--secondary-background`** | `oklch(100% 0 0)` | `oklch(100% 0 0)` | Latar belakang kartu soal, modal, baris opsi, dan kotak input. |
| **`--main` (`--primary`)** | `hsl(45, 100%, 50%)` | `hsl(45, 100%, 50%)` | Kuning amber berenergi untuk tombol CTA utama, indikator aktif, dan aksen sorotan. |
| **`--foreground` (`--border`)** | `oklch(0% 0 0)` | `oklch(0% 0 0)` | Tinta hitam solid untuk teks, border tegas, dan hard shadow. |
| **`--shadow`** | `4px 4px 0px 0px var(--border)` | `4px 4px 0px 0px var(--border)` | Bayangan blok 45 derajat tanpa blur khas Neo-Brutalisme. |
| **`--muted`** | `hsl(48, 80%, 94%)` | `hsl(28, 90%, 90%)` | Aksen bidang inaktif dan hover tabel lembut. |
| **`Success`** | `#16A34A` | `#16A34A` | Hijau solid: Soal terjawab, notifikasi sukses simpan otomatis. |
| **`Warning`** | `#D97706` | `#D97706` | Amber solid: Status soal ragu-ragu (_flagged_). |
| **`Danger`** | `#DC2626` | `#DC2626` | Merah pekat: Batas 5 menit terakhir, hapus data, status terputus. |

---

## 3. Tipografi (Typography Engine)

Sistem tipografi menggunakan **Inter** untuk keterbacaan teks soal dan **JetBrains Mono** untuk angka teknis dan timer ujian.

### Spesifikasi Skala Typografi

| Level / Token | Font Family | Desktop | Mobile | Weight | Line Height | Penggunaan |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **Headline XL** | Inter | 35px | 27px | 800 (`--font-weight-heading`) | 1.2 | Judul halaman auth, skor hasil ujian |
| **Headline LG** | Inter | 27px | 22px | 800 (`--font-weight-heading`) | 1.25 | Judul modul, nama ujian di header |
| **Headline MD** | Inter | 21px | 18px | 800 (`--font-weight-heading`) | 1.3 | Judul kartu, sub-bagian pertanyaan |
| **Body LG (Question Stem)** | Inter | 18px | 16px | 600 (SemiBold) | 1.5 | Teks butir soal ujian (bacaan soal) |
| **Body MD (Option Text)** | Inter | 15px | 15px | 500 (`--font-weight-base`) | 1.45 | Teks opsi pilihan jawaban, label input |
| **Body SM (Caption/Meta)** | Inter | 13px | 12px | 500 (`--font-weight-base`) | 1.4 | Keterangan tambahan, info jadwal |
| **Timer Display** | JetBrains Mono | 27px | 22px | 800 (ExtraBold) | 1.1 | Jam hitung mundur ujian (MM:SS) |
| **Code / Token** | JetBrains Mono | 15px | 14px | 700 (Bold) | 1.2 | Kode kelas, token ujian, NIM/NIP |
| **Badge / Palette Index** | JetBrains Mono | 13px | 12px | 800 (ExtraBold) | 1.0 | Angka tombol navigasi soal (1-100) |

> [!IMPORTANT]
> **Aturan Bobot Teks Neo-Brutalisme**: Bobot minimal untuk teks isi adalah `500` (`--font-weight-base`), sedangkan untuk semua judul dan heading adalah `800` (`--font-weight-heading`).

---

## 4. Sudut & Border (Geometry & Radii)

Untuk mempertahankan karakter neo-brutalisme amber yang kokoh dan modern:

```css
--radius-base: 5px; /* Standar utama: Tombol, kartu opsi, kotak input, modal */
--radius-sm: 1px;   /* Badge kecil, chip status */
--radius-md: 3px;   /* Elemen sedang */
--radius-lg: 5px;   /* Kartu soal besar, drawer panel */
--radius-full: 9999px; /* Khusus lingkaran radio & toggle switch */
```

### Ketebalan Garis Batas (Border Weights)

- **Standard Border (`2px solid var(--border)`)**: Elemen kecil, badge, sel nomor palet soal, input teks standar.
- **Medium Structural Border (`2.5px solid var(--border)`)**: Kartu opsi jawaban, kartu ringkasan, tombol aksi utama.
- **Heavy Frame Border (`3px solid var(--border)`)**: Panel kartu ujian utama, utility header bar, dialog modal konfirmasi.

---

## 5. Elevasi & Interaksi Mekanis (Elevation & Physics)

Tidak ada bayangan Gaussian blur (`box-shadow: 0 4px 6px rgba(0,0,0,0.1)` dilarang keras). Semua kedalaman visual dibuat melalui bayangan blok bersudut 45 derajat (`--shadow: 4px 4px 0px 0px var(--border)`).

### Pola Interaksi Tombol (Button Hover & Click)

```css
/* Keadaan Standar (Default) */
.btn-neo {
    transform: translate(0, 0);
    box-shadow: var(--shadow); /* 4px 4px 0px 0px var(--border) */
    transition: all 0.1s ease;
}

/* Keadaan Hover (Desktop) */
.btn-neo:hover {
    transform: translate(var(--spacing-boxShadowX), var(--spacing-boxShadowY));
    box-shadow: none;
}

/* Keadaan Ditekan (Active / Tap) */
.btn-neo:active {
    transform: translate(3px, 3px);
    box-shadow: 1px 1px 0px 0px var(--border);
}
```
