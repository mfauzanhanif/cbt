import { Head, Link } from '@inertiajs/react';
import { Award, BookOpen, Calendar, CheckCircle2, Clock, Eye, HelpCircle, XCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface AttemptItem {
    id: number;
    exam_id: number;
    exam_name: string;
    course_name: string;
    course_code: string;
    teacher_name: string;
    submitted_at: string | null;
    duration_minutes: number;
    show_result: boolean;
    score: number | null;
    total_questions: number;
    correct_count: number | null;
    incorrect_count: number | null;
    unanswered_count: number | null;
}

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Stats {
    total_completed: number;
    average_score: number | null;
    highest_score: number | null;
}

interface Props {
    attempts: PaginatedData<AttemptItem>;
    stats: Stats;
}

export default function StudentGradesIndex({ attempts, stats }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Nilai Saya', href: '/student/grades' }]}>
            <Head title="Nilai Saya" />
            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="font-heading text-2xl font-black uppercase tracking-tight text-[#1C293C]">
                        Nilai & Riwayat Ujian
                    </h1>
                    <p className="text-sm font-medium text-slate-600">
                        Pantau capaian hasil evaluasi belajar dan tinjau kembali lembar jawaban ujian Anda
                    </p>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="flex items-center gap-4 rounded-xl border-2 border-[#1C293C] bg-white p-4 shadow-[4px_4px_0px_0px_#1C293C]">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-[#1C293C] bg-[#FDC800] text-[#1C293C]">
                            <BookOpen className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Ujian Selesai</div>
                            <div className="font-mono text-2xl font-black text-[#1C293C]">{stats.total_completed}</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-xl border-2 border-[#1C293C] bg-white p-4 shadow-[4px_4px_0px_0px_#1C293C]">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-[#1C293C] bg-[#432DD7] text-white">
                            <Award className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Rata-rata Nilai</div>
                            <div className="font-mono text-2xl font-black text-[#1C293C]">
                                {stats.average_score !== null ? stats.average_score : '-'}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-xl border-2 border-[#1C293C] bg-white p-4 shadow-[4px_4px_0px_0px_#1C293C]">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-[#1C293C] bg-emerald-500 text-white">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Nilai Tertinggi</div>
                            <div className="font-mono text-2xl font-black text-[#1C293C]">
                                {stats.highest_score !== null ? stats.highest_score : '-'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table or Cards */}
                <div className="rounded-xl border-2 border-[#1C293C] bg-white shadow-[4px_4px_0px_0px_#1C293C]">
                    <div className="border-b-2 border-[#1C293C] bg-[#F0F3FF] p-4">
                        <h2 className="font-heading font-black uppercase text-[#1C293C]">Daftar Riwayat Ujian</h2>
                    </div>

                    {attempts.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-[#1C293C] bg-[#FDC800]/20 text-[#1C293C] shadow-[4px_4px_0px_0px_#1C293C]">
                                <Award className="h-8 w-8" />
                            </div>
                            <h3 className="mt-4 font-heading text-lg font-bold text-[#1C293C]">Belum Ada Riwayat Ujian</h3>
                            <p className="mt-1 text-sm text-slate-600">
                                Ujian yang telah Anda selesaikan dan kumpulkan akan muncul di halaman ini.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b-2 border-[#1C293C] bg-slate-100 text-xs font-bold uppercase text-slate-700">
                                    <tr>
                                        <th className="p-4">Ujian & Kelas</th>
                                        <th className="p-4">Dosen Pengampu</th>
                                        <th className="p-4">Waktu Penyerahan</th>
                                        <th className="p-4">Rincian Jawaban</th>
                                        <th className="p-4">Skor Akhir</th>
                                        <th className="p-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y-2 divide-slate-100 font-medium">
                                    {attempts.data.map((attempt) => (
                                        <tr key={attempt.id} className="hover:bg-slate-50">
                                            <td className="p-4">
                                                <div className="font-bold text-[#1C293C]">{attempt.exam_name}</div>
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <span className="font-mono font-bold text-[#432DD7]">
                                                        {attempt.course_code}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{attempt.course_name}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-slate-700">{attempt.teacher_name}</td>
                                            <td className="p-4 text-slate-600">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="h-4 w-4 text-slate-400" />
                                                    <span>{attempt.submitted_at || '-'}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                {attempt.show_result ? (
                                                    <div className="flex items-center gap-2 text-xs font-bold">
                                                        <span className="flex items-center gap-1 text-emerald-700" title="Benar">
                                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                                            {attempt.correct_count}
                                                        </span>
                                                        <span className="flex items-center gap-1 text-rose-700" title="Salah">
                                                            <XCircle className="h-3.5 w-3.5" />
                                                            {attempt.incorrect_count}
                                                        </span>
                                                        <span className="flex items-center gap-1 text-slate-500" title="Kosong">
                                                            <HelpCircle className="h-3.5 w-3.5" />
                                                            {attempt.unanswered_count}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs italic text-slate-500">
                                                        Belum Dipublikasikan
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                {attempt.show_result ? (
                                                    <div className="inline-flex items-center rounded-lg border-2 border-[#1C293C] bg-[#FDC800] px-3 py-1 font-mono text-base font-black text-[#1C293C] shadow-[2px_2px_0px_0px_#1C293C]">
                                                        {attempt.score}
                                                    </div>
                                                ) : (
                                                    <span className="inline-flex rounded-md border border-amber-300 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800">
                                                        Evaluasi Berjalan
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-right">
                                                {attempt.show_result ? (
                                                    <Link
                                                        href={`/student/grades/${attempt.id}/review`}
                                                        className="inline-flex items-center gap-1.5 rounded-lg border-2 border-[#1C293C] bg-white px-3 py-1.5 text-xs font-bold text-[#1C293C] shadow-[2px_2px_0px_0px_#1C293C] transition-transform hover:bg-slate-50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                                                    >
                                                        <Eye className="h-3.5 w-3.5" />
                                                        Tinjau Lembar
                                                    </Link>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        disabled
                                                        className="cursor-not-allowed rounded-lg border border-slate-300 bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-400"
                                                    >
                                                        Terkunci
                                                    </button>
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
