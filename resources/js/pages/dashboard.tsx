import { Head, Link, usePage } from '@inertiajs/react';
import {
    Award,
    BookOpen,
    CalendarCheck,
    CheckCircle2,
    Clock,
    FileSpreadsheet,
    FileText,
    FolderKanban,
    GraduationCap,
    HelpCircle,
    LayoutDashboard,
    School,
    ShieldCheck,
    Sparkles,
    Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { dashboard } from '@/routes';

interface DashboardStats {
    totalStudents?: number;
    totalTeachers?: number;
    totalCourses?: number;
    totalExams?: number;
    taughtCourses?: number;
    totalQuestions?: number;
    totalPackages?: number;
    activeExams?: number;
    enrolledCourses?: number;
    availableExams?: number;
}

type PageProps = {
    stats: DashboardStats;
};

export default function Dashboard() {
    const { auth, stats } = usePage<PageProps>().props;
    const user = auth.user;
    const roles = user.roles || [];
    const isAdmin = roles.includes('admin');
    const isDosen = roles.includes('dosen');
    const isMahasiswa = roles.includes('mahasiswa');

    return (
        <>
            <Head title="Dashboard - CBT" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Hero / Welcome Banner */}
                <div className="relative overflow-hidden rounded-base border-2 border-border bg-main p-6 text-main-foreground shadow-shadow md:p-8">
                    <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-secondary-background px-3 py-1 text-xs font-heading text-foreground shadow-xs">
                                <Sparkles className="size-3.5 fill-main text-foreground" />
                                <span>
                                    {isAdmin
                                        ? 'Hak Akses: Administrator'
                                        : isDosen
                                          ? 'Hak Akses: Dosen Pengajar'
                                          : 'Hak Akses: Mahasiswa'}
                                </span>
                            </div>
                            <h1 className="text-2xl font-heading tracking-tight md:text-3xl">
                                Selamat Datang, {user.name}!
                            </h1>
                            <p className="max-w-2xl text-sm font-base opacity-90 md:text-base">
                                {isAdmin &&
                                    'Pusat kendali operasional ujian komputer kampus. Kelola pengguna, pantau kelas, dan impor master data secara terpusat.'}
                                {isDosen &&
                                    'Kelola bank soal mata kuliah, susun paket evaluasi berkas ujian, dan pantau rekapitulasi nilai mahasiswa Anda.'}
                                {isMahasiswa &&
                                    'Portal ujian resmi berbasis komputer. Akses workstation evaluasi tepat waktu dan pantau riwayat hasil kelulusan.'}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {isAdmin && (
                                <Button asChild variant="neutral">
                                    <Link href="/admin/import">
                                        <FileSpreadsheet className="mr-2 size-4" />
                                        Impor Spreadsheet
                                    </Link>
                                </Button>
                            )}
                            {isDosen && (
                                <Button asChild variant="neutral">
                                    <Link href="/questions">
                                        <HelpCircle className="mr-2 size-4" />
                                        Bank Soal
                                    </Link>
                                </Button>
                            )}
                            {isMahasiswa && (
                                <Button asChild variant="neutral">
                                    <Link href="/student/exams">
                                        <Clock className="mr-2 size-4" />
                                        Mulai Ujian
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {isAdmin && (
                        <>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-heading">
                                        Total Mahasiswa
                                    </CardTitle>
                                    <Users className="size-5 text-foreground/70" />
                                </CardHeader>
                                <CardContent>
                                    <div className="font-mono text-3xl font-heading">
                                        {stats.totalStudents ?? 0}
                                    </div>
                                    <CardDescription className="mt-1">
                                        Terdaftar dalam sistem
                                    </CardDescription>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-heading">
                                        Total Dosen
                                    </CardTitle>
                                    <GraduationCap className="size-5 text-foreground/70" />
                                </CardHeader>
                                <CardContent>
                                    <div className="font-mono text-3xl font-heading">
                                        {stats.totalTeachers ?? 0}
                                    </div>
                                    <CardDescription className="mt-1">
                                        Pengampu aktif
                                    </CardDescription>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-heading">
                                        Total Kelas Kuliah
                                    </CardTitle>
                                    <School className="size-5 text-foreground/70" />
                                </CardHeader>
                                <CardContent>
                                    <div className="font-mono text-3xl font-heading">
                                        {stats.totalCourses ?? 0}
                                    </div>
                                    <CardDescription className="mt-1">
                                        Kelas perkuliahan
                                    </CardDescription>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-heading">
                                        Jadwal Ujian
                                    </CardTitle>
                                    <CalendarCheck className="size-5 text-foreground/70" />
                                </CardHeader>
                                <CardContent>
                                    <div className="font-mono text-3xl font-heading">
                                        {stats.totalExams ?? 0}
                                    </div>
                                    <CardDescription className="mt-1">
                                        Sesi ujian dibuat
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {isDosen && (
                        <>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-heading">
                                        Kelas Diampu
                                    </CardTitle>
                                    <School className="size-5 text-foreground/70" />
                                </CardHeader>
                                <CardContent>
                                    <div className="font-mono text-3xl font-heading">
                                        {stats.taughtCourses ?? 0}
                                    </div>
                                    <CardDescription className="mt-1">
                                        Kelas aktif Anda
                                    </CardDescription>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-heading">
                                        Butir Bank Soal
                                    </CardTitle>
                                    <HelpCircle className="size-5 text-foreground/70" />
                                </CardHeader>
                                <CardContent>
                                    <div className="font-mono text-3xl font-heading">
                                        {stats.totalQuestions ?? 0}
                                    </div>
                                    <CardDescription className="mt-1">
                                        Pertanyaan siap uji
                                    </CardDescription>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-heading">
                                        Paket Soal
                                    </CardTitle>
                                    <FolderKanban className="size-5 text-foreground/70" />
                                </CardHeader>
                                <CardContent>
                                    <div className="font-mono text-3xl font-heading">
                                        {stats.totalPackages ?? 0}
                                    </div>
                                    <CardDescription className="mt-1">
                                        Paket tersusun
                                    </CardDescription>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-heading">
                                        Ujian Aktif
                                    </CardTitle>
                                    <Clock className="size-5 text-foreground/70" />
                                </CardHeader>
                                <CardContent>
                                    <div className="font-mono text-3xl font-heading">
                                        {stats.activeExams ?? 0}
                                    </div>
                                    <CardDescription className="mt-1">
                                        Sedang dijadwalkan
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {isMahasiswa && (
                        <>
                            <Card className="sm:col-span-1 lg:col-span-2">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-heading">
                                        Kelas Kuliah Diikuti
                                    </CardTitle>
                                    <BookOpen className="size-5 text-foreground/70" />
                                </CardHeader>
                                <CardContent>
                                    <div className="font-mono text-3xl font-heading">
                                        {stats.enrolledCourses ?? 0}
                                    </div>
                                    <CardDescription className="mt-1">
                                        Mata kuliah aktif semester ini
                                    </CardDescription>
                                </CardContent>
                            </Card>

                            <Card className="sm:col-span-1 lg:col-span-2">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-heading">
                                        Ujian Terjadwal Aktif
                                    </CardTitle>
                                    <Clock className="size-5 text-foreground/70" />
                                </CardHeader>
                                <CardContent>
                                    <div className="font-mono text-3xl font-heading">
                                        {stats.availableExams ?? 0}
                                    </div>
                                    <CardDescription className="mt-1">
                                        Sesi ujian yang siap dikerjakan
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>

                {/* Quick Shortcuts & System Status */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Role Actions Card */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Pintasan Navigasi Cepat
                            </CardTitle>
                            <CardDescription>
                                Akses modul utama sistem Computer-Based Testing
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-3 sm:grid-cols-2">
                            {isAdmin && (
                                <>
                                    <Link
                                        href="/admin/students"
                                        className="flex items-center gap-3 rounded-base border-2 border-border bg-background p-3 transition-all hover:translate-x-1 hover:bg-main/30"
                                    >
                                        <Users className="size-5" />
                                        <div>
                                            <div className="font-heading text-sm">
                                                Kelola Mahasiswa
                                            </div>
                                            <div className="text-xs text-foreground/70">
                                                Akun, status aktif, kata sandi
                                            </div>
                                        </div>
                                    </Link>
                                    <Link
                                        href="/admin/teachers"
                                        className="flex items-center gap-3 rounded-base border-2 border-border bg-background p-3 transition-all hover:translate-x-1 hover:bg-main/30"
                                    >
                                        <GraduationCap className="size-5" />
                                        <div>
                                            <div className="font-heading text-sm">
                                                Kelola Dosen
                                            </div>
                                            <div className="text-xs text-foreground/70">
                                                Dosen pengampu & penugasan
                                            </div>
                                        </div>
                                    </Link>
                                    <Link
                                        href="/courses"
                                        className="flex items-center gap-3 rounded-base border-2 border-border bg-background p-3 transition-all hover:translate-x-1 hover:bg-main/30"
                                    >
                                        <School className="size-5" />
                                        <div>
                                            <div className="font-heading text-sm">
                                                Daftar Kelas & Anggota
                                            </div>
                                            <div className="text-xs text-foreground/70">
                                                Sinkronisasi peserta perkuliahan
                                            </div>
                                        </div>
                                    </Link>
                                    <Link
                                        href="/admin/import"
                                        className="flex items-center gap-3 rounded-base border-2 border-border bg-background p-3 transition-all hover:translate-x-1 hover:bg-main/30"
                                    >
                                        <FileSpreadsheet className="size-5" />
                                        <div>
                                            <div className="font-heading text-sm">
                                                Impor Data Massal
                                            </div>
                                            <div className="text-xs text-foreground/70">
                                                Upload file Excel / XLSX
                                            </div>
                                        </div>
                                    </Link>
                                </>
                            )}

                            {isDosen && (
                                <>
                                    <Link
                                        href="/questions"
                                        className="flex items-center gap-3 rounded-base border-2 border-border bg-background p-3 transition-all hover:translate-x-1 hover:bg-main/30"
                                    >
                                        <HelpCircle className="size-5" />
                                        <div>
                                            <div className="font-heading text-sm">
                                                Bank Soal
                                            </div>
                                            <div className="text-xs text-foreground/70">
                                                Buat butir soal bergambar
                                            </div>
                                        </div>
                                    </Link>
                                    <Link
                                        href="/question-packages"
                                        className="flex items-center gap-3 rounded-base border-2 border-border bg-background p-3 transition-all hover:translate-x-1 hover:bg-main/30"
                                    >
                                        <FolderKanban className="size-5" />
                                        <div>
                                            <div className="font-heading text-sm">
                                                Paket Soal
                                            </div>
                                            <div className="text-xs text-foreground/70">
                                                Susun bundel soal ujian
                                            </div>
                                        </div>
                                    </Link>
                                    <Link
                                        href="/exams"
                                        className="flex items-center gap-3 rounded-base border-2 border-border bg-background p-3 transition-all hover:translate-x-1 hover:bg-main/30"
                                    >
                                        <Clock className="size-5" />
                                        <div>
                                            <div className="font-heading text-sm">
                                                Jadwal & Workstation
                                            </div>
                                            <div className="text-xs text-foreground/70">
                                                Buka ujian & pantau peserta
                                            </div>
                                        </div>
                                    </Link>
                                    <Link
                                        href="/courses"
                                        className="flex items-center gap-3 rounded-base border-2 border-border bg-background p-3 transition-all hover:translate-x-1 hover:bg-main/30"
                                    >
                                        <School className="size-5" />
                                        <div>
                                            <div className="font-heading text-sm">
                                                Kelas Saya
                                            </div>
                                            <div className="text-xs text-foreground/70">
                                                Daftar mahasiswa & peserta
                                            </div>
                                        </div>
                                    </Link>
                                </>
                            )}

                            {isMahasiswa && (
                                <>
                                    <Link
                                        href="/student/exams"
                                        className="flex items-center gap-3 rounded-base border-2 border-border bg-background p-3 transition-all hover:translate-x-1 hover:bg-main/30"
                                    >
                                        <Clock className="size-5" />
                                        <div>
                                            <div className="font-heading text-sm">
                                                Ruang Ujian Saya
                                            </div>
                                            <div className="text-xs text-foreground/70">
                                                Masuk sesi ujian berlangsung
                                            </div>
                                        </div>
                                    </Link>
                                    <Link
                                        href="/student/grades"
                                        className="flex items-center gap-3 rounded-base border-2 border-border bg-background p-3 transition-all hover:translate-x-1 hover:bg-main/30"
                                    >
                                        <Award className="size-5" />
                                        <div>
                                            <div className="font-heading text-sm">
                                                Rekapitulasi Nilai
                                            </div>
                                            <div className="text-xs text-foreground/70">
                                                Hasil evaluasi & tinjau jawaban
                                            </div>
                                        </div>
                                    </Link>
                                    <Link
                                        href="/courses"
                                        className="flex items-center gap-3 rounded-base border-2 border-border bg-background p-3 transition-all hover:translate-x-1 hover:bg-main/30 sm:col-span-2"
                                    >
                                        <School className="size-5" />
                                        <div>
                                            <div className="font-heading text-sm">
                                                Kelas Perkuliahan
                                            </div>
                                            <div className="text-xs text-foreground/70">
                                                Daftar kelas yang terdaftar
                                            </div>
                                        </div>
                                    </Link>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Security & System Readiness Info */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="size-5 text-emerald-600" />
                                <CardTitle className="text-lg">
                                    Integritas Sistem
                                </CardTitle>
                            </div>
                            <CardDescription>
                                Perlindungan & keandalan sesi ujian
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-start gap-2 text-xs font-base">
                                <CheckCircle2 className="mt-0.5 size-4 text-emerald-600 shrink-0" />
                                <span>
                                    <strong>Autosave Beacon:</strong> Jawaban
                                    mahasiswa tersimpan otomatis di setiap butir.
                                </span>
                            </div>
                            <div className="flex items-start gap-2 text-xs font-base">
                                <CheckCircle2 className="mt-0.5 size-4 text-emerald-600 shrink-0" />
                                <span>
                                    <strong>Isolasi Data:</strong> Dosen hanya
                                    dapat mengakses bank soal dan kelas miliknya.
                                </span>
                            </div>
                            <div className="flex items-start gap-2 text-xs font-base">
                                <CheckCircle2 className="mt-0.5 size-4 text-emerald-600 shrink-0" />
                                <span>
                                    <strong>Anti-Curang:</strong> Acak soal
                                    otomatis dan batasan waktu server-side.
                                </span>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t-2 border-border pt-4">
                            <div className="w-full text-center text-xs font-mono text-foreground/70">
                                CBT Engine v1.0 • Laragon Production Ready
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
