import { Head, router } from '@inertiajs/react';
import { Calendar, Clock, PlayCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface ExamItem {
    id: number;
    name: string;
    course_name: string;
    course_code: string;
    teacher_name: string;
    start_at: string;
    end_at: string;
    duration_minutes: number;
    status: 'ready' | 'in_progress' | 'completed' | 'upcoming' | 'expired';
    attempt?: {
        id: number;
        status: string;
        started_at: string;
        score: number | null;
    } | null;
}

interface Props {
    exams: ExamItem[];
}

export default function StudentExamsIndex({ exams }: Props) {
    const handleStartOrResume = (exam: ExamItem) => {
        router.post(`/student/exams/${exam.id}/start`);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Ujian Saya', href: '/student/exams' }]}>
            <Head title="Ujian Saya" />
            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="font-heading text-2xl font-black uppercase tracking-tight text-[#1C293C]">
                        Jadwal Ujian Saya
                    </h1>
                    <p className="text-sm font-medium text-slate-600">
                        Daftar ujian aktif dan evaluasi perkuliahan untuk kelas yang Anda ikuti
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {exams.length === 0 ? (
                        <div className="col-span-full rounded-xl border-2 border-[#1C293C] bg-white p-8 text-center text-sm font-medium text-slate-500 shadow-[4px_4px_0px_0px_#1C293C]">
                            Tidak ada jadwal ujian aktif untuk kelas Anda saat ini.
                        </div>
                    ) : (
                        exams.map((exam) => (
                            <div
                                key={exam.id}
                                className={`flex flex-col justify-between rounded-xl border-[2.5px] border-[#1C293C] bg-white p-5 shadow-[5px_5px_0px_0px_#1C293C] transition-transform hover:-translate-y-1 ${
                                    exam.status === 'ready' || exam.status === 'in_progress'
                                        ? 'border-amber-500'
                                        : ''
                                }`}
                            >
                                <div>
                                    <div className="flex items-start justify-between">
                                        <span className="rounded border-2 border-[#1C293C] bg-[#FDC800] px-2.5 py-0.5 font-mono text-xs font-black uppercase text-[#1C293C] shadow-[1.5px_1.5px_0px_0px_#1C293C]">
                                            {exam.course_code}
                                        </span>
                                        {exam.status === 'completed' && (
                                            <span className="inline-flex items-center gap-1 rounded border-2 border-[#1C293C] bg-green-200 px-2 py-0.5 text-xs font-black text-slate-900">
                                                <CheckCircle2 className="size-3.5" />
                                                Selesai
                                            </span>
                                        )}
                                        {exam.status === 'in_progress' && (
                                            <span className="inline-flex items-center gap-1 rounded border-2 border-[#1C293C] bg-amber-200 px-2 py-0.5 text-xs font-black text-slate-900 animate-pulse">
                                                Sedang Berjalan
                                            </span>
                                        )}
                                        {exam.status === 'upcoming' && (
                                            <span className="rounded border border-[#1C293C] bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
                                                Belum Buka
                                            </span>
                                        )}
                                        {exam.status === 'expired' && (
                                            <span className="rounded border border-[#1C293C] bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">
                                                Berakhir
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="mt-3 font-heading text-lg font-black text-[#1C293C]">
                                        {exam.name}
                                    </h3>
                                    <p className="mt-0.5 text-xs font-medium text-slate-600">
                                        {exam.course_name} • Dosen: {exam.teacher_name}
                                    </p>

                                    <div className="mt-4 space-y-1.5 rounded-lg border-2 border-[#1C293C] bg-amber-50/30 p-3 font-mono text-xs text-slate-700">
                                        <div className="flex items-center gap-2">
                                            <Clock className="size-3.5 text-slate-500" />
                                            <span>Durasi: <strong>{exam.duration_minutes} Menit</strong></span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="size-3.5 text-slate-500" />
                                            <span>Batas: {exam.end_at}</span>
                                        </div>
                                    </div>

                                    {exam.attempt?.score !== null && exam.attempt?.score !== undefined && (
                                        <div className="mt-3 rounded-lg border-2 border-green-600 bg-green-50 p-2.5 text-center font-mono">
                                            <span className="text-xs font-bold uppercase text-green-800">Skor Ujian: </span>
                                            <span className="text-lg font-black text-green-900">{exam.attempt.score} / 100</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-5 border-t-2 border-slate-100 pt-3">
                                    {(exam.status === 'ready' || exam.status === 'in_progress') && (
                                        <button
                                            type="button"
                                            onClick={() => handleStartOrResume(exam)}
                                            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-[#1C293C] bg-[#FDC800] py-2.5 text-xs font-black uppercase tracking-wider text-[#1C293C] shadow-[3px_3px_0px_0px_#1C293C] transition-all hover:bg-amber-400 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                                        >
                                            <PlayCircle className="size-4" />
                                            {exam.status === 'in_progress' ? 'Lanjutkan Ujian' : 'Mulai Kerjakan Ujian'}
                                        </button>
                                    )}
                                    {exam.status === 'completed' && (
                                        <a
                                            href={`/student/exams/${exam.id}/success`}
                                            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-[#1C293C] bg-slate-100 py-2 text-xs font-bold uppercase text-[#1C293C] shadow-[2px_2px_0px_0px_#1C293C] hover:bg-slate-200"
                                        >
                                            Lihat Bukti Penyerahan
                                        </a>
                                    )}
                                    {exam.status === 'upcoming' && (
                                        <button
                                            disabled
                                            className="w-full rounded-lg border-2 border-[#1C293C] bg-slate-100 py-2 text-xs font-bold text-slate-400 opacity-60"
                                        >
                                            Ujian Belum Dimulai
                                        </button>
                                    )}
                                    {exam.status === 'expired' && (
                                        <button
                                            disabled
                                            className="w-full rounded-lg border-2 border-[#1C293C] bg-slate-100 py-2 text-xs font-bold text-slate-400 opacity-60"
                                        >
                                            Waktu Akses Berakhir
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
