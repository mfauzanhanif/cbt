import { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Plus, Search, Users, ArrowRight, X } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface Course {
    id: number;
    name: string;
    code: string;
    description: string | null;
    teacher: { id: number; name: string; email: string };
    students_count: number;
}

interface Teacher {
    id: number;
    name: string;
}

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
}

interface Props {
    courses: PaginatedData<Course>;
    teachers: Teacher[];
    filters: { search?: string };
    canCreate: boolean;
}

export default function CoursesIndex({ courses, teachers, filters, canCreate }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const form = useForm({
        name: '',
        code: '',
        description: '',
        teacher_id: teachers.length > 0 ? String(teachers[0].id) : '',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/courses', { search }, { preserveState: true });
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/courses', {
            onSuccess: () => {
                form.reset();
                setIsCreateOpen(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Kelas Perkuliahan', href: '/courses' }]}>
            <Head title="Kelas Perkuliahan" />
            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="font-heading text-2xl font-black uppercase tracking-tight text-[#1C293C]">
                            Kelas Perkuliahan
                        </h1>
                        <p className="text-sm font-medium text-slate-600">
                            Kelola ruang kelas, pembagian jadwal ujian, dan anggota mahasiswa
                        </p>
                    </div>
                    {canCreate && (
                        <button
                            type="button"
                            onClick={() => setIsCreateOpen(true)}
                            className="inline-flex items-center gap-2 rounded-lg border-2 border-[#1C293C] bg-[#FDC800] px-4 py-2 text-sm font-bold uppercase tracking-wider text-[#1C293C] shadow-[3px_3px_0px_0px_#1C293C] transition-all hover:bg-amber-400 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                        >
                            <Plus className="size-4" />
                            Buat Kelas Baru
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
                            placeholder="Cari nama kelas atau kode mata kuliah..."
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

                {/* Courses Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {courses.data.length === 0 ? (
                        <div className="col-span-full rounded-xl border-2 border-[#1C293C] bg-white p-8 text-center text-sm font-medium text-slate-500 shadow-[4px_4px_0px_0px_#1C293C]">
                            Belum ada kelas perkuliahan yang terdaftar.
                        </div>
                    ) : (
                        courses.data.map((course) => (
                            <div
                                key={course.id}
                                className="flex flex-col justify-between rounded-xl border-[2.5px] border-[#1C293C] bg-white p-5 shadow-[5px_5px_0px_0px_#1C293C] transition-transform hover:-translate-y-1"
                            >
                                <div>
                                    <div className="flex items-start justify-between">
                                        <span className="rounded border-2 border-[#1C293C] bg-amber-100 px-2 py-0.5 font-mono text-xs font-black uppercase text-[#1C293C] shadow-[1.5px_1.5px_0px_0px_#1C293C]">
                                            {course.code}
                                        </span>
                                        <div className="inline-flex items-center gap-1 font-bold text-slate-700">
                                            <Users className="size-4" />
                                            <span className="text-xs">{course.students_count} Mahasiswa</span>
                                        </div>
                                    </div>
                                    <h3 className="mt-3 font-heading text-lg font-black text-[#1C293C] line-clamp-2">
                                        {course.name}
                                    </h3>
                                    <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                                        {course.description || 'Tidak ada deskripsi mata kuliah.'}
                                    </p>
                                    <p className="mt-3 text-xs font-bold text-slate-500">
                                        Dosen: <span className="text-[#1C293C]">{course.teacher.name}</span>
                                    </p>
                                </div>

                                <div className="mt-5 border-t-2 border-slate-100 pt-3">
                                    <Link
                                        href={`/courses/${course.id}`}
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-[#1C293C] bg-slate-50 py-2 text-xs font-black uppercase tracking-wider text-[#1C293C] shadow-[2px_2px_0px_0px_#1C293C] transition-all hover:bg-[#FDC800] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                                    >
                                        Kelola Anggota
                                        <ArrowRight className="size-3.5" />
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Modal Create Course */}
                {isCreateOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-md rounded-xl border-[3px] border-[#1C293C] bg-white p-6 shadow-[8px_8px_0px_0px_#1C293C]">
                            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
                                <h2 className="font-heading text-lg font-black uppercase text-[#1C293C]">
                                    Buat Kelas Baru
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
                                    <label className="text-xs font-bold uppercase text-[#1C293C]">Kode Kelas / Matkul</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Misal: IF-301, PWL-202"
                                        value={form.data.code}
                                        onChange={(e) => form.setData('code', e.target.value)}
                                        className="mt-1 w-full rounded-lg border-2 border-[#1C293C] p-2 font-mono text-sm uppercase font-bold focus:outline-none focus:ring-2 focus:ring-[#FDC800]"
                                    />
                                    {form.errors.code && <p className="text-xs text-red-600">{form.errors.code}</p>}
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-[#1C293C]">Nama Mata Kuliah</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Misal: Pemrograman Web Lanjut"
                                        value={form.data.name}
                                        onChange={(e) => form.setData('name', e.target.value)}
                                        className="mt-1 w-full rounded-lg border-2 border-[#1C293C] p-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FDC800]"
                                    />
                                    {form.errors.name && <p className="text-xs text-red-600">{form.errors.name}</p>}
                                </div>
                                {teachers.length > 0 && (
                                    <div>
                                        <label className="text-xs font-bold uppercase text-[#1C293C]">Dosen Pengampu</label>
                                        <select
                                            value={form.data.teacher_id}
                                            onChange={(e) => form.setData('teacher_id', e.target.value)}
                                            className="mt-1 w-full rounded-lg border-2 border-[#1C293C] p-2 text-sm font-bold focus:outline-none"
                                        >
                                            {teachers.map((t) => (
                                                <option key={t.id} value={t.id}>
                                                    {t.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                <div>
                                    <label className="text-xs font-bold uppercase text-[#1C293C]">Deskripsi (Opsional)</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Ringkasan materi atau tujuan kelas..."
                                        value={form.data.description}
                                        onChange={(e) => form.setData('description', e.target.value)}
                                        className="mt-1 w-full rounded-lg border-2 border-[#1C293C] p-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FDC800]"
                                    />
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
                                        Buat Kelas
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
