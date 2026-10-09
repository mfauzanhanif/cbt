import {
    Award,
    Clock,
    FileSpreadsheet,
    HelpCircle,
    School,
    ShieldCheck,
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function PublicFeatures() {
    return (
        <section className="mb-14">
            <div className="mb-8 text-center sm:text-left">
                <h2 className="text-2xl font-heading md:text-3xl">
                    Keunggulan Sistem CBT
                </h2>
                <p className="mt-2 text-sm text-foreground/80 md:text-base">
                    Dirancang khusus untuk menunjang kelancaran evaluasi akademik skala besar.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <div className="mb-2 flex size-12 items-center justify-center rounded-base border-2 border-border bg-main text-main-foreground shadow-xs">
                            <Clock className="size-6" />
                        </div>
                        <CardTitle className="text-xl">
                            Workstation Real-Time
                        </CardTitle>
                        <CardDescription>
                            Ujian daring lancar tanpa hambatan teknis
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm font-base leading-relaxed text-foreground/90">
                            Dilengkapi sistem <strong>autosave beacon</strong> yang merekam setiap pilihan jawaban secara asynchronous di latar belakang, navigasi palet soal cepat, penanda ragu-ragu, dan countdown timer server-side.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="mb-2 flex size-12 items-center justify-center rounded-base border-2 border-border bg-main text-main-foreground shadow-xs">
                            <HelpCircle className="size-6" />
                        </div>
                        <CardTitle className="text-xl">
                            Bank Soal Multimedia
                        </CardTitle>
                        <CardDescription>
                            Penyusunan butir soal fleksibel
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm font-base leading-relaxed text-foreground/90">
                            Dosen dapat membuat soal pilihan ganda dinamis, melampirkan gambar referensi resolusi tinggi, menentukan bobot nilai dan pembahasan, menduplikasi butir soal instan, serta menyusun paket soal terspesialisasi.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="mb-2 flex size-12 items-center justify-center rounded-base border-2 border-border bg-main text-main-foreground shadow-xs">
                            <ShieldCheck className="size-6" />
                        </div>
                        <CardTitle className="text-xl">
                            Keamanan & Anti-Curang
                        </CardTitle>
                        <CardDescription>
                            Integritas pelaksanaan terjaga ketat
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm font-base leading-relaxed text-foreground/90">
                            Pengacakan urutan butir soal per peserta, validasi token satu kali pakai (single attempt), otorisasi berbasis hak akses (RBAC), pembatasan jendela waktu aktif, dan isolasi privasi data antar pengajar.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="mb-2 flex size-12 items-center justify-center rounded-base border-2 border-border bg-main text-main-foreground shadow-xs">
                            <School className="size-6" />
                        </div>
                        <CardTitle className="text-xl">
                            Manajemen Kelas Terintegrasi
                        </CardTitle>
                        <CardDescription>
                            Sinkronisasi peserta mata kuliah
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm font-base leading-relaxed text-foreground/90">
                            Kelola kelas perkuliahan, kode unik kelas, dan anggota mahasiswa dengan mudah. Jadwalkan sesi ujian secara terfokus khusus untuk mahasiswa yang terdaftar di kelas bersangkutan.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="mb-2 flex size-12 items-center justify-center rounded-base border-2 border-border bg-main text-main-foreground shadow-xs">
                            <FileSpreadsheet className="size-6" />
                        </div>
                        <CardTitle className="text-xl">
                            Impor & Ekspor Excel
                        </CardTitle>
                        <CardDescription>
                            Otomasi data skala perguruan tinggi
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm font-base leading-relaxed text-foreground/90">
                            Impor massal ratusan akun mahasiswa dan dosen dari template Excel/CSV dengan validasi ketat, serta unduh rekapitulasi nilai akhir kelas ke file spreadsheet (.xlsx) siap cetak.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="mb-2 flex size-12 items-center justify-center rounded-base border-2 border-border bg-main text-main-foreground shadow-xs">
                            <Award className="size-6" />
                        </div>
                        <CardTitle className="text-xl">
                            Grading & Tinjau Jawaban
                        </CardTitle>
                        <CardDescription>
                            Transparansi evaluasi akademik
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm font-base leading-relaxed text-foreground/90">
                            Perhitungan skor instan setelah pengumpulan ujian. Mahasiswa dapat meninjau lembar jawaban beserta kunci dan pembahasan setelah ujian ditutup resmi oleh dosen pengampu.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
