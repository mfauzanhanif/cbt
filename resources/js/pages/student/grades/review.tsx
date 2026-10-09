import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Award, CheckCircle2, FileText, HelpCircle, Lightbulb, User, XCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface OptionItem {
    id: number;
    label: string;
    text: string;
    is_correct: boolean;
    image_url: string | null;
}

interface QuestionItem {
    number: number;
    id: number;
    text: string;
    explanation: string | null;
    difficulty: string | null;
    image_url: string | null;
    selected_option_id: number | null;
    is_correct: boolean | null;
    is_unanswered: boolean;
    options: OptionItem[];
}

interface AttemptData {
    id: number;
    student_name?: string;
    student_email?: string;
    started_at: string;
    submitted_at: string | null;
    score: number | null;
}

interface ExamData {
    id: number;
    name: string;
    course_name: string;
    course_code: string;
    teacher_name: string;
    duration_minutes: number;
    show_result: boolean;
}

interface Scorecard {
    score: number | null;
    total_questions: number;
    correct_count: number;
    incorrect_count: number;
    unanswered_count: number;
}

interface Props {
    attempt: AttemptData;
    exam: ExamData;
    questions: QuestionItem[];
    scorecard: Scorecard;
    isTeacherView: boolean;
}

export default function GradeReview({ attempt, exam, questions, scorecard, isTeacherView }: Props) {
    const backHref = isTeacherView ? `/exams/${exam.id}/grades` : '/student/grades';
    const backLabel = isTeacherView ? 'Kembali ke Rekap Nilai' : 'Kembali ke Nilai Saya';

    return (
        <AppLayout
            breadcrumbs={[
                { title: isTeacherView ? 'Rekap Nilai' : 'Nilai Saya', href: backHref },
                { title: 'Tinjau Lembar Jawaban', href: '#' },
            ]}
        >
            <Head title={`Tinjau Lembar - ${exam.name}`} />
            <div className="mx-auto flex max-w-4xl flex-col gap-6 p-4 md:p-6">
                {/* Back Action & Title */}
                <div>
                    <Link
                        href={backHref}
                        className="inline-flex items-center gap-2 rounded-lg border-2 border-[#1C293C] bg-white px-3 py-1.5 text-xs font-bold text-[#1C293C] shadow-[2px_2px_0px_0px_#1C293C] transition-transform hover:bg-slate-50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {backLabel}
                    </Link>
                </div>

                {/* Exam & Candidate Header */}
                <div className="rounded-xl border-2 border-[#1C293C] bg-white p-5 shadow-[4px_4px_0px_0px_#1C293C]">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <div className="inline-block rounded-md border-2 border-[#1C293C] bg-[#432DD7] px-2 py-0.5 text-xs font-bold text-white">
                                {exam.course_code} • {exam.course_name}
                            </div>
                            <h1 className="mt-1 font-heading text-xl font-black text-[#1C293C] sm:text-2xl">
                                {exam.name}
                            </h1>
                            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                                <span>Dosen: <strong>{exam.teacher_name}</strong></span>
                                <span>•</span>
                                <span>Diserahkan: <strong>{attempt.submitted_at || '-'}</strong></span>
                            </div>
                        </div>

                        {isTeacherView && attempt.student_name && (
                            <div className="flex items-center gap-3 rounded-lg border-2 border-[#1C293C] bg-[#F0F3FF] p-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-[#1C293C] bg-white font-bold text-[#1C293C]">
                                    <User className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-500">Mahasiswa Peserta</div>
                                    <div className="font-bold text-[#1C293C]">{attempt.student_name}</div>
                                    <div className="text-xs text-slate-500">{attempt.student_email}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Scorecard Summary */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-xl border-2 border-[#1C293C] bg-[#FDC800] p-4 text-[#1C293C] shadow-[4px_4px_0px_0px_#1C293C]">
                        <div className="text-xs font-bold uppercase tracking-wider">Skor Akhir</div>
                        <div className="mt-1 font-mono text-3xl font-black">{scorecard.score ?? 0}</div>
                    </div>

                    <div className="rounded-xl border-2 border-[#1C293C] bg-emerald-500 p-4 text-white shadow-[4px_4px_0px_0px_#1C293C]">
                        <div className="text-xs font-bold uppercase tracking-wider">Jawaban Benar</div>
                        <div className="mt-1 font-mono text-3xl font-black">{scorecard.correct_count}</div>
                    </div>

                    <div className="rounded-xl border-2 border-[#1C293C] bg-rose-500 p-4 text-white shadow-[4px_4px_0px_0px_#1C293C]">
                        <div className="text-xs font-bold uppercase tracking-wider">Jawaban Salah</div>
                        <div className="mt-1 font-mono text-3xl font-black">{scorecard.incorrect_count}</div>
                    </div>

                    <div className="rounded-xl border-2 border-[#1C293C] bg-slate-200 p-4 text-[#1C293C] shadow-[4px_4px_0px_0px_#1C293C]">
                        <div className="text-xs font-bold uppercase tracking-wider">Tidak Dijawab</div>
                        <div className="mt-1 font-mono text-3xl font-black">{scorecard.unanswered_count}</div>
                    </div>
                </div>

                {/* Questions Review List */}
                <div className="flex flex-col gap-5">
                    {questions.map((q) => {
                        let statusBadge = (
                            <span className="inline-flex items-center gap-1 rounded-full border border-slate-400 bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                                <HelpCircle className="h-3 w-3" />
                                Tidak Dijawab
                            </span>
                        );

                        if (q.is_correct === true) {
                            statusBadge = (
                                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-600 bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Benar
                                </span>
                            );
                        } else if (q.is_correct === false && !q.is_unanswered) {
                            statusBadge = (
                                <span className="inline-flex items-center gap-1 rounded-full border border-rose-600 bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800">
                                    <XCircle className="h-3 w-3" />
                                    Salah
                                </span>
                            );
                        }

                        return (
                            <div
                                key={q.id}
                                className="rounded-xl border-2 border-[#1C293C] bg-white p-5 shadow-[4px_4px_0px_0px_#1C293C]"
                            >
                                {/* Question Top Bar */}
                                <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="flex h-7 w-7 items-center justify-center rounded-md border-2 border-[#1C293C] bg-[#FDC800] font-mono text-xs font-black text-[#1C293C]">
                                            {q.number}
                                        </span>
                                        {q.difficulty && (
                                            <span className="rounded border border-slate-300 bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                                {q.difficulty}
                                            </span>
                                        )}
                                    </div>
                                    <div>{statusBadge}</div>
                                </div>

                                {/* Question Content */}
                                <div className="mt-4">
                                    <p className="text-base font-semibold leading-relaxed text-[#1C293C]">{q.text}</p>
                                    {q.image_url && (
                                        <div className="mt-3">
                                            <img
                                                src={q.image_url}
                                                alt={`Ilustrasi Soal ${q.number}`}
                                                className="max-h-72 rounded-lg border-2 border-[#1C293C] object-contain shadow-[2px_2px_0px_0px_#1C293C]"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Options */}
                                <div className="mt-4 flex flex-col gap-2.5">
                                    {q.options.map((opt) => {
                                        const isSelected = q.selected_option_id === opt.id;
                                        const isKey = opt.is_correct;

                                        let optionBorder = 'border-2 border-slate-200 bg-slate-50 text-slate-700';
                                        let tagBadge = null;

                                        if (isKey && isSelected) {
                                            // Correct pick
                                            optionBorder = 'border-2 border-emerald-600 bg-emerald-50 text-emerald-950 shadow-[2px_2px_0px_0px_#16A34A]';
                                            tagBadge = (
                                                <span className="ml-auto inline-flex items-center gap-1 rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-black uppercase text-white">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    Kunci Jawaban & Pilihan Anda
                                                </span>
                                            );
                                        } else if (isKey) {
                                            // Correct key, not picked
                                            optionBorder = 'border-2 border-emerald-600 bg-emerald-50 text-emerald-950 shadow-[2px_2px_0px_0px_#16A34A]';
                                            tagBadge = (
                                                <span className="ml-auto inline-flex items-center gap-1 rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-black uppercase text-white">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    Kunci Jawaban Benar
                                                </span>
                                            );
                                        } else if (isSelected) {
                                            // Student's wrong pick
                                            optionBorder = 'border-2 border-rose-600 bg-rose-50 text-rose-950 shadow-[2px_2px_0px_0px_#DC2626]';
                                            tagBadge = (
                                                <span className="ml-auto inline-flex items-center gap-1 rounded bg-rose-600 px-2 py-0.5 text-[10px] font-black uppercase text-white">
                                                    <XCircle className="h-3 w-3" />
                                                    Pilihan Anda (Salah)
                                                </span>
                                            );
                                        }

                                        return (
                                            <div
                                                key={opt.id}
                                                className={`flex items-start gap-3 rounded-lg p-3 ${optionBorder}`}
                                            >
                                                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded border-2 border-[#1C293C] bg-white font-mono text-xs font-black text-[#1C293C]">
                                                    {opt.label}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium">{opt.text}</div>
                                                    {opt.image_url && (
                                                        <img
                                                            src={opt.image_url}
                                                            alt={`Opsi ${opt.label}`}
                                                            className="mt-2 max-h-32 rounded border border-slate-300 object-contain"
                                                        />
                                                    )}
                                                </div>
                                                {tagBadge}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Explanation / Pembahasan */}
                                {q.explanation && (
                                    <div className="mt-4 flex items-start gap-3 rounded-lg border-2 border-[#432DD7] bg-[#F0F3FF] p-3.5 text-[#1C293C]">
                                        <Lightbulb className="h-5 w-5 shrink-0 text-[#432DD7]" />
                                        <div className="text-xs">
                                            <strong className="font-heading font-black uppercase text-[#432DD7]">
                                                Pembahasan:
                                            </strong>{' '}
                                            <span className="font-medium text-slate-800">{q.explanation}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}
