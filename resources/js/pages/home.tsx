import { Head, Link, usePage } from '@inertiajs/react';
import {
    Award,
    CheckCircle2,
    Clock,
    FileSpreadsheet,
    GraduationCap,
    HelpCircle,
    LayoutDashboard,
    LogIn,
    School,
    ShieldAlert,
    ShieldCheck,
    Sparkles,
    UserPlus,
} from 'lucide-react';
import AppearanceToggleTab from '@/components/appearance-tabs';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { dashboard, login, register } from '@/routes';

export default function Home() {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <>
            <Head title="Computer Based Test" />

            <div className="min-h-screen bg-background text-foreground">
                {/* Top Navigation */}
                <header className="sticky top-0 z-40 border-b-2 border-border bg-secondary-background">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-base border-2 border-border bg-main text-main-foreground shadow-xs">
                                <GraduationCap className="size-6 stroke-[2.5]" />
                            </div>
                            <div>
                                <span className="font-heading text-lg tracking-tight">
                                    Computer Based Test
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="hidden sm:block">
                                <AppearanceToggleTab />
                            </div>

                            {user ? (
                                <Button asChild variant="default">
                                    <Link href={dashboard()}>
                                        <LayoutDashboard className="mr-2 size-4" />
                                        Buka Dashboard
                                    </Link>
                                </Button>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Button asChild variant="neutral">
                                        <Link href={login()}>
                                            <LogIn className="mr-1.5 size-4" />
                                            Masuk
                                        </Link>
                                    </Button>
                                    <Button asChild variant="default">
                                        <Link href={register()}>
                                            <UserPlus className="mr-1.5 size-4" />
                                            Daftar
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-16">
                    {/* Hero Section */}
                    <div className="mb-14 rounded-base border-2 border-border bg-main p-8 text-main-foreground shadow-shadow md:p-14">
                        <h1 className="max-w-4xl text-3xl font-heading leading-tight md:text-5xl lg:text-6xl">
                            Sistem Ujian Berbasis Komputer yang Andal, Presisi, dan Anti-Curang.
                        </h1>

                        <p className="mt-6 max-w-2xl text-base font-base leading-relaxed opacity-90 md:text-lg">
                            Platform Computer-Based Testing (CBT) dengan workstation responsif, penyimpanan instan (autosave beacon), bank soal multimedia, serta rekapitulasi nilai otomatis.
                        </p>

                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            {user ? (
                                <Button asChild size="lg" variant="neutral">
                                    <Link href={dashboard()}>
                                        <LayoutDashboard className="mr-2 size-5" />
                                        Masuk ke Dashboard
                                    </Link>
                                </Button>
                            ) : (
                                <>
                                    <Button asChild size="lg" variant="neutral">
                                        <Link href={login()}>
                                            <LogIn className="mr-2 size-5" />
                                            Masuk ke Portal Ujian
                                        </Link>
                                    </Button>
                                    <Button asChild size="lg" variant="noShadow" className="bg-secondary-background text-foreground">
                                        <Link href={register()}>
                                            <UserPlus className="mr-2 size-5" />
                                            Registrasi Peserta
                                        </Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="mb-14">
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
                    </div>

                    {/* Quick Demo Credentials Info for Testing */}
                    <div className="rounded-base border-2 border-border bg-secondary-background p-6 shadow-shadow md:p-8">
                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                            <div>
                                <h3 className="text-lg font-heading md:text-xl">
                                    Akun Akses Uji Coba (Laragon Seeded)
                                </h3>
                                <p className="mt-1 text-sm text-foreground/80">
                                    Gunakan akun demo berikut untuk menguji seluruh alur kerja sesuai role:
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2 text-xs font-mono">
                                    <span className="rounded-base border-2 border-border bg-main/40 px-2.5 py-1">
                                        Admin: admin@fauzanhanif.my.id (pw: password)
                                    </span>
                                    <span className="rounded-base border-2 border-border bg-main/40 px-2.5 py-1">
                                        Dosen: dosen@fauzanhanif.my.id (pw: password)
                                    </span>
                                    <span className="rounded-base border-2 border-border bg-main/40 px-2.5 py-1">
                                        Mahasiswa: mahasiswa@fauzanhanif.my.id (pw: password)
                                    </span>
                                </div>
                            </div>

                            <Button asChild variant="default" size="lg">
                                <Link href={login()}>
                                    <LogIn className="mr-2 size-5" />
                                    Masuk Sekarang
                                </Link>
                            </Button>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t-2 border-border bg-secondary-background py-8">
                    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 text-sm">
                        <div className="font-heading">
                            © 2026 M Fauzan Hanif | All rights reserved.
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
