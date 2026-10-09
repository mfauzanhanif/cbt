import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, Award, ArrowLeft, BookOpen } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface Props {
    exam: {
        id: number;
        name: string;
        show_result: boolean;
    };
    attempt: {
        id: number;
        submitted_at: string;
        score: number | null;
        total_questions: number;
        correct_count: number | null;
        incorrect_count: number | null;
        unanswered_count: number | null;
    };
}

export default function ExamSuccess({ exam, attempt }: Props) {
    return (
        <AppLayout breadcrumbs={[
            { title: 'Ujian Saya', href: '/student/exams' },
            { title: 'Bukti Penyerahan', href: `/student/exams/${exam.id}/success` },
        ]}>
            <Head title={`Hasil Ujian: ${exam.name}`} />
            <div className="flex min-h-[80vh] flex-col items-center justify-center p-4">
                <div className="w-full max-w-lg rounded-2xl border-[3px] border-[#1C293C] bg-white p-8 shadow-[8px_8px_0px_0px_#1C293C] text-center">
                    {/* Badge Icon */}
                    <div className="mx-auto mb-4 inline-flex size-20 items-center justify-center rounded-2xl border-[3px] border-[#1C293C] bg-green-300 shadow-[4px_4px_0px_0px_#1C293C]">
                        <CheckCircle2 className="size-10 stroke-[2.5] text-slate-900" />
                    </div>

                    <h1 className="font-heading text-2xl font-black uppercase tracking-tight text-[#1C293C]">
                        Ujian Berhasil Diserahkan!
                    </h1>
                    <p className="mt-1 font-mono text-xs font-bold text-slate-500">
                        Diserahkan pada: {attempt.submitted_at}
                    </p>

                    <div className="my-6 rounded-xl border-2 border-[#1C293C] bg-amber-50/40 p-4">
                        <span className="font-mono text-xs font-bold uppercase text-slate-500">Nama Ujian</span>
                        <h2 className="font-heading text-lg font-black text-[#1C293C]">{exam.name}</h2>
                    </div>

                    {/* Score section if show_result is true */}
                    {exam.show_result && attempt.score !== null ? (
                        <div className="my-6 rounded-2xl border-[3px] border-[#1C293C] bg-[#FDC800] p-6 shadow-[5px_5px_0px_0px_#1C293C]">
                            <div className="flex items-center justify-center gap-2">
                                <Award className="size-6 text-[#1C293C]" />
                                <span className="font-heading text-xs font-black uppercase text-[#1C293C]">
                                    Nilai Akhir Ujian
                                </span>
                            </div>
                            <div className="mt-2 font-mono text-5xl font-black text-[#1C293C]">
                                {attempt.score}
                            </div>
                            <span className="text-xs font-bold text-slate-800">Skala 100 Poin</span>

                            <div className="mt-4 grid grid-cols-3 gap-2 border-t-2 border-[#1C293C] pt-3 text-xs font-mono">
                                <div>
                                    <span className="font-bold text-green-800">Benar</span>
                                    <p className="text-base font-black text-slate-900">{attempt.correct_count}</p>
                                </div>
                                <div>
                                    <span className="font-bold text-red-800">Salah</span>
                                    <p className="text-base font-black text-slate-900">{attempt.incorrect_count}</p>
                                </div>
                                <div>
                                    <span className="font-bold text-slate-700">Kosong</span>
                                    <p className="text-base font-black text-slate-900">{attempt.unanswered_count}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="my-6 rounded-xl border-2 border-[#1C293C] bg-slate-50 p-4 text-xs font-medium text-slate-600">
                            Nilai pengerjaan ujian Anda telah tersimpan dan akan dipublikasikan oleh dosen pengampu setelah seluruh sesi ujian berakhir.
                        </div>
                    )}

                    <div className="mt-6">
                        <Link
                            href="/student/exams"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#1C293C] bg-[#FDC800] py-3 text-sm font-black uppercase tracking-wider text-[#1C293C] shadow-[4px_4px_0px_0px_#1C293C] transition-all hover:bg-amber-400 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                        >
                            <ArrowLeft className="size-4" />
                            Kembali ke Daftar Ujian
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
