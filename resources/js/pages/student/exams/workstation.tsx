import { useState, useEffect, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    Clock,
    ChevronLeft,
    ChevronRight,
    Flag,
    CheckCircle,
    AlertCircle,
    Send,
    Menu,
    X,
    Wifi,
    Check,
} from 'lucide-react';

interface Option {
    id: number;
    label: string;
    text: string;
    image_url?: string | null;
}

interface Question {
    index: number;
    id: number;
    text: string;
    difficulty?: string | null;
    image_url?: string | null;
    options: Option[];
}

interface SavedAnswer {
    selected_option_id: number | null;
    is_flagged: boolean;
    answered_at?: string;
}

interface Props {
    exam: {
        id: number;
        name: string;
        duration_minutes: number;
    };
    attempt: {
        id: number;
        started_at: string;
        remaining_seconds: number;
    };
    questions: Question[];
    initialAnswers: Record<number, SavedAnswer>;
}

export default function ExamWorkstation({ exam, attempt, questions, initialAnswers }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, SavedAnswer>>(initialAnswers || {});
    const [timeLeft, setTimeLeft] = useState<number>(attempt.remaining_seconds);
    const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
    const [isMobilePaletteOpen, setIsMobilePaletteOpen] = useState(false);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

    const activeQuestion = questions[currentIndex] || questions[0];

    // Countdown Timer logic
    useEffect(() => {
        if (timeLeft <= 0) {
            handleAutoSubmit();
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    handleAutoSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft]);

    const handleAutoSubmit = () => {
        router.post(`/student/exams/${exam.id}/submit`);
    };

    // Format remaining time hh:mm:ss
    const formatTime = (seconds: number): string => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    // Select Answer
    const handleSelectOption = async (optionId: number) => {
        const currentAns = answers[activeQuestion.id] || { selected_option_id: null, is_flagged: false };
        const newAns: SavedAnswer = {
            ...currentAns,
            selected_option_id: optionId,
        };

        setAnswers((prev) => ({
            ...prev,
            [activeQuestion.id]: newAns,
        }));

        await triggerSave(activeQuestion.id, newAns);
    };

    // Toggle Flag Ragu-ragu
    const handleToggleFlag = async () => {
        const currentAns = answers[activeQuestion.id] || { selected_option_id: null, is_flagged: false };
        const newAns: SavedAnswer = {
            ...currentAns,
            is_flagged: !currentAns.is_flagged,
        };

        setAnswers((prev) => ({
            ...prev,
            [activeQuestion.id]: newAns,
        }));

        await triggerSave(activeQuestion.id, newAns);
    };

    // Asynchronous Auto-save
    const triggerSave = async (questionId: number, answerData: SavedAnswer) => {
        setSaveStatus('saving');
        try {
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;
            const res = await fetch(`/student/exams/${exam.id}/save-answer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                body: JSON.stringify({
                    question_id: questionId,
                    selected_option_id: answerData.selected_option_id,
                    is_flagged: answerData.is_flagged,
                }),
            });

            if (res.ok) {
                setSaveStatus('saved');
            } else {
                setSaveStatus('error');
            }
        } catch {
            setSaveStatus('error');
        }
    };

    // Navigation
    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        }
    };

    // Stats calculation
    const totalQuestions = questions.length;
    const answeredCount = Object.values(answers).filter((a) => a.selected_option_id !== null).length;
    const flaggedCount = Object.values(answers).filter((a) => a.is_flagged).length;
    const unansweredCount = totalQuestions - answeredCount;

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-[#FBFBF9] text-[#1C293C] select-none">
            <Head title={`Pengerjaan Ujian: ${exam.name}`} />

            {/* 1. Sticky Top Header (54px) */}
            <header className="flex h-14 shrink-0 items-center justify-between border-b-[2.5px] border-[#1C293C] bg-white px-4 shadow-[0_2px_0_0_#1C293C]">
                <div className="flex items-center gap-2 overflow-hidden">
                    <span className="rounded border-2 border-[#1C293C] bg-[#FDC800] px-2 py-0.5 font-mono text-xs font-black uppercase text-[#1C293C]">
                        CBT
                    </span>
                    <h1 className="truncate font-heading text-sm font-black uppercase text-[#1C293C]">
                        {exam.name}
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <div
                        className={`flex items-center gap-1.5 rounded-lg border-2 border-[#1C293C] px-2.5 py-1 font-mono text-sm font-black shadow-[2px_2px_0px_0px_#1C293C] ${
                            timeLeft < 300
                                ? 'bg-red-400 text-slate-900 animate-pulse'
                                : 'bg-[#FDC800] text-slate-900'
                        }`}
                    >
                        <Clock className="size-4" />
                        <span>{formatTime(timeLeft)}</span>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsMobilePaletteOpen(true)}
                        className="rounded-lg border-2 border-[#1C293C] bg-white p-1.5 shadow-[2px_2px_0px_0px_#1C293C] lg:hidden"
                        title="Buka Palet Soal"
                    >
                        <Menu className="size-5" />
                    </button>
                </div>
            </header>

            {/* 2. Status Sync Bar (28px) */}
            <div className="flex h-7 shrink-0 items-center justify-between border-b border-[#1C293C] bg-slate-900 px-4 text-[11px] font-bold text-white">
                <div className="flex items-center gap-1.5">
                    <Wifi className="size-3 text-green-400" />
                    <span>Mode Ujian Terhubung</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                    {saveStatus === 'saving' && (
                        <span className="text-amber-300 animate-pulse">● Menyimpan ke server...</span>
                    )}
                    {saveStatus === 'saved' && (
                        <span className="text-green-400">✓ Jawaban Tersimpan Otomatis</span>
                    )}
                    {saveStatus === 'error' && (
                        <span className="text-red-400">⚠ Gagal menyimpan, coba lagi</span>
                    )}
                </div>
            </div>

            {/* Main Area: Split Screen on Desktop (Canvas + Rail) */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left: Question Canvas (~72% on lg) */}
                <main className="flex flex-1 flex-col overflow-y-auto p-4 md:p-6 lg:p-8">
                    {activeQuestion && (
                        <div className="mx-auto w-full max-w-3xl flex-1">
                            {/* Question Meta Header */}
                            <div className="flex items-center justify-between pb-3">
                                <div className="flex items-center gap-2">
                                    <span className="rounded-lg border-[2.5px] border-[#1C293C] bg-[#FDC800] px-3 py-1 font-heading text-sm font-black uppercase text-[#1C293C] shadow-[2.5px_2.5px_0px_0px_#1C293C]">
                                        SOAL NO. {currentIndex + 1}
                                    </span>
                                    <span className="rounded border-2 border-[#1C293C] bg-white px-2 py-0.5 text-xs font-bold uppercase text-slate-700">
                                        Bobot: 1 Poin
                                    </span>
                                </div>
                                {answers[activeQuestion.id]?.is_flagged && (
                                    <span className="inline-flex items-center gap-1 rounded border-2 border-[#1C293C] bg-amber-400 px-2 py-0.5 text-xs font-black uppercase text-[#1C293C]">
                                        <Flag className="size-3.5 fill-current" />
                                        Ragu-Ragu
                                    </span>
                                )}
                            </div>

                            {/* Question Body */}
                            <div className="mt-3 rounded-xl border-[2.5px] border-[#1C293C] bg-white p-5 shadow-[5px_5px_0px_0px_#1C293C]">
                                <p className="text-base font-semibold leading-relaxed text-[#1C293C]">
                                    {activeQuestion.text}
                                </p>

                                {activeQuestion.image_url && (
                                    <div className="mt-4">
                                        <img
                                            src={activeQuestion.image_url}
                                            alt={`Stimulus Soal No. ${currentIndex + 1}`}
                                            className="max-h-72 rounded-lg border-2 border-[#1C293C] object-contain shadow-[3px_3px_0px_0px_#1C293C]"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Options List */}
                            <div className="mt-5 space-y-3">
                                {activeQuestion.options.map((opt) => {
                                    const isSelected = answers[activeQuestion.id]?.selected_option_id === opt.id;
                                    return (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            onClick={() => handleSelectOption(opt.id)}
                                            className={`flex min-h-[52px] w-full items-center gap-3 rounded-xl border-[2.5px] border-[#1C293C] p-3.5 text-left transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
                                                isSelected
                                                    ? 'bg-[#FDC800] shadow-[4px_4px_0px_0px_#1C293C]'
                                                    : 'bg-white shadow-[3px_3px_0px_0px_#1C293C] hover:bg-amber-50/50'
                                            }`}
                                        >
                                            <span
                                                className={`flex size-8 shrink-0 items-center justify-center rounded-lg border-2 border-[#1C293C] font-mono font-black text-sm ${
                                                    isSelected ? 'bg-slate-900 text-white' : 'bg-amber-100 text-[#1C293C]'
                                                }`}
                                            >
                                                {opt.label}
                                            </span>
                                            <span className="flex-1 text-sm font-semibold text-[#1C293C]">
                                                {opt.text}
                                            </span>
                                            {isSelected && (
                                                <div className="flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-[#1C293C] bg-white">
                                                    <Check className="size-4 stroke-[3] text-slate-900" />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </main>

                {/* Right: Fixed Side Rail Navigation on Desktop (≥ 1024px) */}
                <aside className="hidden w-80 shrink-0 flex-col border-l-[3px] border-[#1C293C] bg-white p-5 lg:flex shadow-[-4px_0_0_0_#1C293C]">
                    <div className="border-b-2 border-slate-900 pb-3">
                        <h2 className="font-heading text-sm font-black uppercase text-[#1C293C]">
                            Palet Navigasi Soal
                        </h2>
                        <div className="mt-2 flex items-center justify-between text-xs font-mono font-bold text-slate-600">
                            <span>Terjawab: <strong className="text-green-700">{answeredCount}</strong></span>
                            <span>Ragu: <strong className="text-amber-700">{flaggedCount}</strong></span>
                            <span>Kosong: <strong>{unansweredCount}</strong></span>
                        </div>
                    </div>

                    {/* Question Grid */}
                    <div className="mt-4 flex-1 overflow-y-auto">
                        <div className="grid grid-cols-5 gap-2.5">
                            {questions.map((q, idx) => {
                                const ans = answers[q.id];
                                const isCurrent = idx === currentIndex;
                                const isAnswered = ans && ans.selected_option_id !== null;
                                const isFlagged = ans && ans.is_flagged;

                                let bgClass = 'bg-white text-[#1C293C]';
                                if (isFlagged) {
                                    bgClass = 'bg-amber-400 text-[#1C293C]';
                                } else if (isAnswered) {
                                    bgClass = 'bg-green-400 text-slate-900';
                                }

                                return (
                                    <button
                                        key={q.id}
                                        type="button"
                                        onClick={() => setCurrentIndex(idx)}
                                        className={`flex size-11 items-center justify-center rounded-lg border-2 border-[#1C293C] font-mono text-xs font-black shadow-[2px_2px_0px_0px_#1C293C] transition-all hover:-translate-y-0.5 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${bgClass} ${
                                            isCurrent ? 'ring-4 ring-[#FDC800] ring-offset-1' : ''
                                        }`}
                                    >
                                        {idx + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="border-t-2 border-slate-900 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsSubmitModalOpen(true)}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-[2.5px] border-[#1C293C] bg-[#FDC800] py-3 font-heading text-sm font-black uppercase tracking-wider text-[#1C293C] shadow-[4px_4px_0px_0px_#1C293C] transition-all hover:bg-amber-400 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                        >
                            <Send className="size-4" />
                            Kumpulkan Jawaban
                        </button>
                    </div>
                </aside>
            </div>

            {/* 3. Persistent Bottom Action Dock */}
            <footer className="flex h-16 shrink-0 items-center justify-between border-t-[3px] border-[#1C293C] bg-white px-4 shadow-[0_-4px_0_0_rgba(0,0,0,0.05)]">
                <button
                    type="button"
                    disabled={currentIndex === 0}
                    onClick={handlePrev}
                    className="inline-flex items-center gap-1.5 rounded-lg border-2 border-[#1C293C] bg-white px-3.5 py-2 text-xs font-bold uppercase shadow-[2.5px_2.5px_0px_0px_#1C293C] hover:bg-slate-50 disabled:opacity-40"
                >
                    <ChevronLeft className="size-4" />
                    Sebelumnya
                </button>

                <button
                    type="button"
                    onClick={handleToggleFlag}
                    className={`inline-flex items-center gap-1.5 rounded-lg border-2 border-[#1C293C] px-3.5 py-2 text-xs font-black uppercase shadow-[2.5px_2.5px_0px_0px_#1C293C] transition-all active:translate-x-[1px] active:translate-y-[1px] ${
                        answers[activeQuestion?.id]?.is_flagged
                            ? 'bg-amber-400 text-[#1C293C]'
                            : 'bg-white text-slate-700 hover:bg-amber-50'
                    }`}
                >
                    <Flag className="size-4" />
                    Ragu-Ragu
                </button>

                {currentIndex < questions.length - 1 ? (
                    <button
                        type="button"
                        onClick={handleNext}
                        className="inline-flex items-center gap-1.5 rounded-lg border-2 border-[#1C293C] bg-[#FDC800] px-4 py-2 text-xs font-black uppercase tracking-wider text-[#1C293C] shadow-[2.5px_2.5px_0px_0px_#1C293C] hover:bg-amber-400"
                    >
                        Selanjutnya
                        <ChevronRight className="size-4" />
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={() => setIsSubmitModalOpen(true)}
                        className="inline-flex items-center gap-1.5 rounded-lg border-2 border-[#1C293C] bg-green-400 px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-900 shadow-[2.5px_2.5px_0px_0px_#1C293C] hover:bg-green-300"
                    >
                        Selesai
                        <Send className="size-3.5" />
                    </button>
                )}
            </footer>

            {/* Mobile Bottom Sheet Question Palette */}
            {isMobilePaletteOpen && (
                <div className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm lg:hidden">
                    <div className="flex max-h-[80vh] w-full flex-col rounded-t-2xl border-t-[3px] border-[#1C293C] bg-white p-5 shadow-[0_-8px_0_0_#1C293C]">
                        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
                            <div>
                                <h3 className="font-heading text-base font-black uppercase text-[#1C293C]">
                                    Palet Nomor Soal
                                </h3>
                                <p className="text-xs font-mono font-bold text-slate-600">
                                    {answeredCount} Terjawab • {flaggedCount} Ragu • {unansweredCount} Kosong
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsMobilePaletteOpen(false)}
                                className="rounded border-2 border-[#1C293C] p-1.5 hover:bg-slate-100"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        <div className="my-4 overflow-y-auto">
                            <div className="grid grid-cols-5 gap-2.5">
                                {questions.map((q, idx) => {
                                    const ans = answers[q.id];
                                    const isCurrent = idx === currentIndex;
                                    const isAnswered = ans && ans.selected_option_id !== null;
                                    const isFlagged = ans && ans.is_flagged;

                                    let bgClass = 'bg-white text-[#1C293C]';
                                    if (isFlagged) {
                                        bgClass = 'bg-amber-400 text-[#1C293C]';
                                    } else if (isAnswered) {
                                        bgClass = 'bg-green-400 text-slate-900';
                                    }

                                    return (
                                        <button
                                            key={q.id}
                                            type="button"
                                            onClick={() => {
                                                setCurrentIndex(idx);
                                                setIsMobilePaletteOpen(false);
                                            }}
                                            className={`flex size-11 items-center justify-center rounded-lg border-2 border-[#1C293C] font-mono text-xs font-black shadow-[2px_2px_0px_0px_#1C293C] ${bgClass} ${
                                                isCurrent ? 'ring-4 ring-[#FDC800]' : ''
                                            }`}
                                        >
                                            {idx + 1}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="border-t-2 border-slate-900 pt-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsMobilePaletteOpen(false);
                                    setIsSubmitModalOpen(true);
                                }}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#1C293C] bg-[#FDC800] py-3 text-sm font-black uppercase text-[#1C293C] shadow-[3px_3px_0px_0px_#1C293C]"
                            >
                                <Send className="size-4" />
                                Kumpulkan Jawaban Ujian
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Penyerahan Ujian */}
            {isSubmitModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl border-[3px] border-[#1C293C] bg-white p-6 shadow-[8px_8px_0px_0px_#1C293C]">
                        <h2 className="font-heading text-xl font-black uppercase tracking-tight text-[#1C293C]">
                            Kumpulkan Jawaban Ujian?
                        </h2>
                        <p className="mt-2 text-xs font-medium text-slate-600">
                            Setelah diserahkan, pengerjaan ujian akan dikunci permanen dan tidak dapat diubah kembali.
                        </p>

                        <div className="my-4 grid grid-cols-3 gap-2 text-center font-mono">
                            <div className="rounded-lg border-2 border-[#1C293C] bg-green-50 p-2.5">
                                <span className="text-xl font-black text-green-700">{answeredCount}</span>
                                <p className="text-[10px] font-bold uppercase text-slate-600">Terjawab</p>
                            </div>
                            <div className="rounded-lg border-2 border-[#1C293C] bg-amber-50 p-2.5">
                                <span className="text-xl font-black text-amber-700">{flaggedCount}</span>
                                <p className="text-[10px] font-bold uppercase text-slate-600">Ragu-Ragu</p>
                            </div>
                            <div className="rounded-lg border-2 border-[#1C293C] bg-red-50 p-2.5">
                                <span className="text-xl font-black text-red-700">{unansweredCount}</span>
                                <p className="text-[10px] font-bold uppercase text-slate-600">Kosong</p>
                            </div>
                        </div>

                        {unansweredCount > 0 && (
                            <div className="mb-4 flex items-center gap-2 rounded-lg border-2 border-amber-600 bg-amber-50 p-2.5 text-xs font-bold text-amber-900">
                                <AlertCircle className="size-4 shrink-0 text-amber-600" />
                                <span>Peringatan: Masih terdapat {unansweredCount} butir soal yang belum dijawab.</span>
                            </div>
                        )}

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsSubmitModalOpen(false)}
                                className="flex-1 rounded-xl border-2 border-[#1C293C] bg-white py-2.5 text-xs font-black uppercase text-[#1C293C] shadow-[2px_2px_0px_0px_#1C293C]"
                            >
                                Periksa Lagi
                            </button>
                            <button
                                type="button"
                                onClick={() => router.post(`/student/exams/${exam.id}/submit`)}
                                className="flex-1 rounded-xl border-2 border-[#1C293C] bg-[#FDC800] py-2.5 text-xs font-black uppercase text-[#1C293C] shadow-[3px_3px_0px_0px_#1C293C] hover:bg-amber-400"
                            >
                                Ya, Kumpulkan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
