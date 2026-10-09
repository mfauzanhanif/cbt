import { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Plus, Search, Calendar, Clock, ToggleLeft, ToggleRight, Trash2, X, Award } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface ExamItem {
    id: number;
    name: string;
    course: { id: number; name: string; code: string };
    package: { id: number; name: string };
    teacher: { id: number; name: string };
    start_at: string;
    end_at: string;
    duration_minutes: number;
    is_active: boolean;
    attempts_count: number;
}

interface CourseOption {
    id: number;
    name: string;
    code: string;
}

interface PackageOption {
    id: number;
    name: string;
}

interface PaginatedData<T> {
    data: T[];
    total: number;
}

interface Props {
    exams: PaginatedData<ExamItem>;
    courses: CourseOption[];
    packages: PackageOption[];
    filters: { search?: string };
    canCreate: boolean;
}

export default function ExamsIndex({ exams, courses, packages, filters, canCreate }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const form = useForm({
        name: '',
        course_id: courses.length > 0 ? String(courses[0].id) : '',
        package_id: packages.length > 0 ? String(packages[0].id) : '',
        start_at: '',
        end_at: '',
        duration_minutes: 60,
        is_active: true,
        shuffle_questions: false,
        show_result: true,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/exams', { search }, { preserveState: true });
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/exams', {
            onSuccess: () => {
                form.reset();
                setIsCreateOpen(false);
            },
        });
    };

    const handleToggleStatus = (exam: ExamItem) => {
        router.patch(`/exams/${exam.id}/toggle-status`);
    };

    const handleDelete = (exam: ExamItem) => {
        if (confirm(`Yakin ingin menghapus jadwal ujian ${exam.name}?`)) {
            router.delete(`/exams/${exam.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Jadwal Ujian', href: '/exams' }]}>
            <Head title="Jadwal Ujian" />
            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="font-heading text-2xl font-black uppercase tracking-tight text-[#1C293C]">
                            Jadwal Ujian
                        </h1>
                        <p className="text-sm font-medium text-slate-600">
                            Atur sesi ujian kelas, rentang tanggal pengerjaan, dan durasi pengerjaan
                        </p>
                    </div>
                    {canCreate && (
                        <button
                            type="button"
                            onClick={() => setIsCreateOpen(true)}
                            className="inline-flex items-center gap-2 rounded-lg border-2 border-[#1C293C] bg-[#FDC800] px-4 py-2 text-sm font-bold uppercase tracking-wider text-[#1C293C] shadow-[3px_3px_0px_0px_#1C293C] transition-all hover:bg-amber-400 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                        >
                            <Plus className="size-4" />
                            Buat Jadwal Ujian
                        </button>
                    )}
                </div>

                {/* Search Bar */}
                <form
                    onSubmit={handleSearch}
                    className="flex items-center gap-2 rounded-xl border-2 border-[#1C293C] bg-white p-3 shadow-[4px_4px_0px_0px_#1C293C]"
                >
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari nama ujian..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg border-2 border-[#1C293C] py-2 pl-9 pr-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FDC800]"
                        />
                    </div>
                    <button
                        type="submit"
                        className="rounded-lg border-2 border-[#1C293C] bg-slate-900 px-4 py-2 text-sm font-bold text-white shadow-[2px_2px_0px_0px_#1C293C] hover:bg-slate-800"
                    >
                        Cari
                    </button>
                </form>

                {/* Exams List */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {exams.data.length === 0 ? (
                        <div className="col-span-full rounded-xl border-2 border-[#1C293C] bg-white p-8 text-center text-sm font-medium text-slate-500 shadow-[4px_4px_0px_0px_#1C293C]">
                            Belum ada jadwal ujian yang dibuat.
                        </div>
                    ) : (
                        exams.data.map((exam) => (
                            <div
                                key={exam.id}
                                className="flex flex-col justify-between rounded-xl border-[2.5px] border-[#1C293C] bg-white p-5 shadow-[5px_5px_0px_0px_#1C293C]"
                            >
                                <div>
                                    <div className="flex items-start justify-between">
                                        <span className="rounded border-2 border-[#1C293C] bg-amber-100 px-2.5 py-0.5 font-mono text-xs font-black uppercase text-[#1C293C]">
                                            {exam.course.code}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleToggleStatus(exam)}
                                            className={`inline-flex items-center gap-1 rounded border-2 border-[#1C293C] px-2 py-0.5 text-xs font-bold ${
                                                exam.is_active ? 'bg-green-300 text-slate-900' : 'bg-red-200 text-slate-900'
                                            }`}
                                        >
                                            {exam.is_active ? <ToggleRight className="size-4" /> : <ToggleLeft className="size-4" />}
                                            {exam.is_active ? 'Aktif' : 'Tutup'}
                                        </button>
                                    </div>
                                    <h3 className="mt-3 font-heading text-lg font-black text-[#1C293C]">
                                        {exam.name}
                                    </h3>
                                    <p className="mt-1 text-xs font-bold text-slate-600">
                                        Paket Soal: <span className="text-[#1C293C]">{exam.package.name}</span>
                                    </p>
                                    <div className="mt-3 space-y-1.5 text-xs text-slate-600 font-mono">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="size-3.5 text-slate-500" />
                                            <span>Mulai: {new Date(exam.start_at).toLocaleDateString('id-ID')}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="size-3.5 text-slate-500" />
                                            <span>Durasi: {exam.duration_minutes} Menit</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 flex items-center justify-between border-t-2 border-slate-100 pt-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-slate-500">
                                            Peserta: <strong>{exam.attempts_count}</strong>
                                        </span>
                                        <Link
                                            href={`/exams/${exam.id}/grades`}
                                            className="inline-flex items-center gap-1 rounded border-2 border-[#1C293C] bg-[#FDC800] px-2 py-0.5 text-xs font-black text-[#1C293C] shadow-[2px_2px_0px_0px_#1C293C] transition-transform hover:bg-amber-400 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                                        >
                                            <Award className="size-3.5" />
                                            Rekap Nilai
                                        </Link>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(exam)}
                                        className="rounded border border-[#1C293C] p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                                    >
                                        <Trash2 className="size-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Modal Create Exam */}
                {isCreateOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm overflow-y-auto">
                        <div className="my-8 w-full max-w-lg rounded-xl border-[3px] border-[#1C293C] bg-white p-6 shadow-[8px_8px_0px_0px_#1C293C]">
                            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
                                <h2 className="font-heading text-lg font-black uppercase text-[#1C293C]">
                                    Buat Jadwal Ujian Baru
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => setIsCreateOpen(false)}
                                    className="rounded border border-[#1C293C] p-1 hover:bg-slate-100"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>
                            <form onSubmit={handleCreateSubmit} className="mt-4 flex flex-col gap-3">
                                <div>
                                    <label className="text-xs font-bold uppercase text-[#1C293C]">Nama Ujian</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Misal: UTS Pemrograman Web 2026"
                                        value={form.data.name}
                                        onChange={(e) => form.setData('name', e.target.value)}
                                        className="mt-1 w-full rounded-lg border-2 border-[#1C293C] p-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#FDC800]"
                                    />
                                    {form.errors.name && <p className="text-xs text-red-600">{form.errors.name}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-bold uppercase text-[#1C293C]">Kelas Perkuliahan</label>
                                        <select
                                            value={form.data.course_id}
                                            onChange={(e) => form.setData('course_id', e.target.value)}
                                            className="mt-1 w-full rounded-lg border-2 border-[#1C293C] p-2 text-xs font-bold focus:outline-none"
                                        >
                                            {courses.map((c) => (
                                                <option key={c.id} value={c.id}>
                                                    {c.code} - {c.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase text-[#1C293C]">Paket Soal</label>
                                        <select
                                            value={form.data.package_id}
                                            onChange={(e) => form.setData('package_id', e.target.value)}
                                            className="mt-1 w-full rounded-lg border-2 border-[#1C293C] p-2 text-xs font-bold focus:outline-none"
                                        >
                                            {packages.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-bold uppercase text-[#1C293C]">Waktu Mulai Buka</label>
                                        <input
                                            type="datetime-local"
                                            required
                                            value={form.data.start_at}
                                            onChange={(e) => form.setData('start_at', e.target.value)}
                                            className="mt-1 w-full rounded-lg border-2 border-[#1C293C] p-2 text-xs font-mono focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase text-[#1C293C]">Waktu Tutup</label>
                                        <input
                                            type="datetime-local"
                                            required
                                            value={form.data.end_at}
                                            onChange={(e) => form.setData('end_at', e.target.value)}
                                            className="mt-1 w-full rounded-lg border-2 border-[#1C293C] p-2 text-xs font-mono focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase text-[#1C293C]">Durasi Pengerjaan (Menit)</label>
                                    <input
                                        type="number"
                                        min={5}
                                        max={600}
                                        required
                                        value={form.data.duration_minutes}
                                        onChange={(e) => form.setData('duration_minutes', parseInt(e.target.value, 10))}
                                        className="mt-1 w-full rounded-lg border-2 border-[#1C293C] p-2 text-sm font-bold font-mono focus:outline-none"
                                    />
                                </div>

                                <div className="space-y-2 pt-2">
                                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                        <input
                                            type="checkbox"
                                            checked={form.data.shuffle_questions}
                                            onChange={(e) => form.setData('shuffle_questions', e.target.checked)}
                                            className="size-4 rounded border-2 border-[#1C293C]"
                                        />
                                        Acak urutan soal untuk setiap mahasiswa
                                    </label>
                                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                        <input
                                            type="checkbox"
                                            checked={form.data.show_result}
                                            onChange={(e) => form.setData('show_result', e.target.checked)}
                                            className="size-4 rounded border-2 border-[#1C293C]"
                                        />
                                        Tampilkan nilai langsung setelah submit
                                    </label>
                                </div>

                                <div className="mt-4 flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateOpen(false)}
                                        className="rounded-lg border-2 border-[#1C293C] bg-white px-4 py-2 text-sm font-bold shadow-[2px_2px_0px_0px_#1C293C]"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={form.processing}
                                        className="rounded-lg border-2 border-[#1C293C] bg-[#FDC800] px-4 py-2 text-sm font-bold uppercase text-[#1C293C] shadow-[3px_3px_0px_0px_#1C293C] hover:bg-amber-400"
                                    >
                                        Simpan Jadwal
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
