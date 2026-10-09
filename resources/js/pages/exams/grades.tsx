import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Award, CheckCircle2, Clock, Download, Eye, HelpCircle, Search, Users } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';

interface StudentGradeRow {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    status: 'completed' | 'in_progress' | 'not_started';
    attempt_id: number | null;
    submitted_at: string | null;
    score: number | null;
}

interface ExamMeta {
    id: number;
    name: string;
    course_id: number;
    course_name: string;
    course_code: string;
    teacher_name: string;
    start_at: string;
    end_at: string;
    duration_minutes: number;
    total_questions: number;
    show_result: boolean;
}

interface Stats {
    total_enrolled: number;
    completed_count: number;
    in_progress_count: number;
    not_started_count: number;
    average_score: number | null;
    highest_score: number | null;
    lowest_score: number | null;
}

interface Props {
    exam: ExamMeta;
    students: StudentGradeRow[];
    stats: Stats;
    filters: {
        search: string;
        sort: string;
    };
}

export default function ExamGrades({ exam, students, stats, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [sort, setSort] = useState(filters.sort || 'name');

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(`/exams/${exam.id}/grades`, { search, sort }, { preserveState: true });
    };

    const handleSortChange = (newSort: string) => {
        setSort(newSort);
        router.get(`/exams/${exam.id}/grades`, { search, sort: newSort }, { preserveState: true });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Jadwal Ujian', href: '/exams' },
                { title: `Rekap Nilai - ${exam.name}`, href: '#' },
            ]}
        >
            <Head title={`Rekap Nilai - ${exam.name}`} />
            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Back Link */}
                <div>
                    <Link
                        href="/exams"
                        className="inline-flex items-center gap-2 rounded-lg border-2 border-[#1C293C] bg-white px-3 py-1.5 text-xs font-bold text-[#1C293C] shadow-[2px_2px_0px_0px_#1C293C] transition-transform hover:bg-slate-50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Jadwal Ujian
                    </Link>
                </div>

                {/* Exam Header Banner */}
                <div className="rounded-xl border-2 border-[#1C293C] bg-white p-5 shadow-[4px_4px_0px_0px_#1C293C]">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <div className="inline-block rounded-md border-2 border-[#1C293C] bg-[#432DD7] px-2 py-0.5 text-xs font-bold text-white">
                                {exam.course_code} • {exam.course_name}
                            </div>
                            <h1 className="mt-1 font-heading text-xl font-black text-[#1C293C] sm:text-2xl">
                                Rekap Nilai: {exam.name}
                            </h1>
                            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs font-medium text-slate-600">
                                <span>Dosen: <strong>{exam.teacher_name}</strong></span>
                                <span>•</span>
                                <span>Total Soal: <strong>{exam.total_questions} butir</strong></span>
                                <span>•</span>
                                <span>Durasi: <strong>{exam.duration_minutes} menit</strong></span>
                            </div>
                        </div>

                        <div>
                            <a
                                href={`/exams/${exam.id}/grades/export`}
                                className="inline-flex items-center gap-2 rounded-xl border-2 border-[#1C293C] bg-[#16A34A] px-4 py-2.5 font-heading text-sm font-black uppercase tracking-wider text-white shadow-[4px_4px_0px_0px_#1C293C] transition-transform hover:bg-[#15803D] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                            >
                                <Download className="h-4 w-4" />
                                Unduh Excel (XLSX)
                            </a>
                        </div>
                    </div>
                </div>

                {/* Class Aggregate Metrics */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-xl border-2 border-[#1C293C] bg-white p-4 shadow-[4px_4px_0px_0px_#1C293C]">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Peserta</div>
                        <div className="mt-1 font-mono text-2xl font-black text-[#1C293C]">
                            {stats.completed_count} <span className="text-sm font-semibold text-slate-500">/ {stats.total_enrolled}</span>
                        </div>
                    </div>

                    <div className="rounded-xl border-2 border-[#1C293C] bg-white p-4 shadow-[4px_4px_0px_0px_#1C293C]">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Rata-rata Kelas</div>
                        <div className="mt-1 font-mono text-2xl font-black text-[#432DD7]">
                            {stats.average_score !== null ? stats.average_score : '-'}
                        </div>
                    </div>

                    <div className="rounded-xl border-2 border-[#1C293C] bg-white p-4 shadow-[4px_4px_0px_0px_#1C293C]">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Nilai Tertinggi</div>
                        <div className="mt-1 font-mono text-2xl font-black text-emerald-600">
                            {stats.highest_score !== null ? stats.highest_score : '-'}
                        </div>
                    </div>

                    <div className="rounded-xl border-2 border-[#1C293C] bg-white p-4 shadow-[4px_4px_0px_0px_#1C293C]">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Nilai Terendah</div>
                        <div className="mt-1 font-mono text-2xl font-black text-rose-600">
                            {stats.lowest_score !== null ? stats.lowest_score : '-'}
                        </div>
                    </div>
                </div>

                {/* Filters & Table */}
                <div className="rounded-xl border-2 border-[#1C293C] bg-white shadow-[4px_4px_0px_0px_#1C293C]">
                    <div className="flex flex-col justify-between gap-4 border-b-2 border-[#1C293C] p-4 sm:flex-row sm:items-center">
                        <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:max-w-xs">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari nama mahasiswa atau email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-lg border-2 border-[#1C293C] py-2 pl-9 pr-3 text-sm font-medium focus:bg-amber-50/50 focus:outline-none"
                            />
                        </form>

                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase text-slate-600">Urutkan:</span>
                            <select
                                value={sort}
                                onChange={(e) => handleSortChange(e.target.value)}
                                className="rounded-lg border-2 border-[#1C293C] bg-white px-3 py-2 text-xs font-bold text-[#1C293C] focus:outline-none"
                            >
                                <option value="name">Nama Mahasiswa (A-Z)</option>
                                <option value="score_desc">Nilai Tertinggi</option>
                                <option value="score_asc">Nilai Terendah</option>
                            </select>
                        </div>
                    </div>

                    {students.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-sm font-medium text-slate-500">Tidak ada mahasiswa yang ditemukan.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b-2 border-[#1C293C] bg-slate-100 text-xs font-bold uppercase text-slate-700">
                                    <tr>
                                        <th className="p-4">No</th>
                                        <th className="p-4">Nama Mahasiswa</th>
                                        <th className="p-4">Email / Kontak</th>
                                        <th className="p-4">Status Pengerjaan</th>
                                        <th className="p-4">Waktu Selesai</th>
                                        <th className="p-4">Nilai Akhir</th>
                                        <th className="p-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y-2 divide-slate-100 font-medium">
                                    {students.map((student, idx) => (
                                        <tr key={student.id} className="hover:bg-slate-50">
                                            <td className="p-4 font-mono font-bold text-slate-500">{idx + 1}</td>
                                            <td className="p-4 font-bold text-[#1C293C]">{student.name}</td>
                                            <td className="p-4 text-xs text-slate-600">
                                                <div>{student.email}</div>
                                                {student.phone && <div className="text-slate-400">{student.phone}</div>}
                                            </td>
                                            <td className="p-4">
                                                {student.status === 'completed' && (
                                                    <span className="inline-flex items-center gap-1 rounded-md border border-emerald-600 bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        Selesai
                                                    </span>
                                                )}
                                                {student.status === 'in_progress' && (
                                                    <span className="inline-flex items-center gap-1 rounded-md border border-amber-600 bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
                                                        <Clock className="h-3 w-3" />
                                                        Sedang Mengerjakan
                                                    </span>
                                                )}
                                                {student.status === 'not_started' && (
                                                    <span className="inline-flex items-center gap-1 rounded-md border border-slate-400 bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
                                                        <HelpCircle className="h-3 w-3" />
                                                        Belum Mulai
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-xs text-slate-600">
                                                {student.submitted_at || '-'}
                                            </td>
                                            <td className="p-4">
                                                {student.score !== null ? (
                                                    <div className="inline-flex items-center rounded-lg border-2 border-[#1C293C] bg-[#FDC800] px-3 py-1 font-mono text-base font-black text-[#1C293C] shadow-[2px_2px_0px_0px_#1C293C]">
                                                        {student.score}
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400">-</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-right">
                                                {student.attempt_id ? (
                                                    <Link
                                                        href={`/exams/${exam.id}/grades/${student.attempt_id}/review`}
                                                        className="inline-flex items-center gap-1.5 rounded-lg border-2 border-[#1C293C] bg-white px-3 py-1.5 text-xs font-bold text-[#1C293C] shadow-[2px_2px_0px_0px_#1C293C] transition-transform hover:bg-slate-50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                                                    >
                                                        <Eye className="h-3.5 w-3.5" />
                                                        Tinjau Jawaban
                                                    </Link>
                                                ) : (
                                                    <span className="text-xs text-slate-400">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
