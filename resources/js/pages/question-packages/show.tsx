import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { ArrowUp, ArrowDown, Trash2, PlusCircle, Check } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface QuestionItem {
    id: number;
    text: string;
    difficulty?: string | null;
    pivot?: { order: number };
}

interface QuestionPackage {
    id: number;
    name: string;
    description: string | null;
    questions: QuestionItem[];
}

interface Props {
    package: QuestionPackage;
    availableQuestions: QuestionItem[];
}

export default function QuestionPackageShow({ package: pkg, availableQuestions }: Props) {
    const [currentQuestions, setCurrentQuestions] = useState<QuestionItem[]>(pkg.questions || []);
    const [selectedQuestionId, setSelectedQuestionId] = useState<string>('');

    const handleAddQuestion = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedQuestionId) return;

        const qToAdd = availableQuestions.find((q) => q.id === parseInt(selectedQuestionId, 10));
        if (!qToAdd) return;

        const updated = [...currentQuestions, qToAdd];
        setCurrentQuestions(updated);
        saveSync(updated);
        setSelectedQuestionId('');
    };

    const handleRemoveQuestion = (id: number) => {
        const updated = currentQuestions.filter((q) => q.id !== id);
        setCurrentQuestions(updated);
        saveSync(updated);
    };

    const handleMove = (index: number, direction: 'up' | 'down') => {
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === currentQuestions.length - 1)
        ) {
            return;
        }

        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        const next = [...currentQuestions];
        const temp = next[index];
        next[index] = next[targetIndex];
        next[targetIndex] = temp;

        setCurrentQuestions(next);
        saveSync(next);
    };

    const saveSync = (itemsList: QuestionItem[]) => {
        const payload = {
            items: itemsList.map((q, i) => ({
                question_id: q.id,
                order: i + 1,
            })),
        };

        router.post(`/question-packages/${pkg.id}/sync-questions`, payload, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Paket Soal', href: '/question-packages' },
            { title: pkg.name, href: `/question-packages/${pkg.id}` },
        ]}>
            <Head title={`Paket Soal: ${pkg.name}`} />
            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Header Card */}
                <div className="rounded-xl border-[2.5px] border-[#1C293C] bg-white p-6 shadow-[6px_6px_0px_0px_#1C293C]">
                    <span className="rounded border-2 border-[#1C293C] bg-[#FDC800] px-2.5 py-0.5 font-mono text-xs font-black uppercase text-[#1C293C]">
                        PAKET SOAL #{pkg.id}
                    </span>
                    <h1 className="mt-2 font-heading text-2xl font-black uppercase tracking-tight text-[#1C293C]">
                        {pkg.name}
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        {pkg.description || 'Tidak ada petunjuk khusus untuk paket soal ini.'}
                    </p>
                    <p className="mt-3 text-xs font-bold text-slate-500">
                        Total Soal: <span className="text-[#1C293C] font-black">{currentQuestions.length} Butir</span>
                    </p>
                </div>

                {/* Add Question to Package */}
                {availableQuestions.length > 0 && (
                    <div className="flex flex-col gap-3 rounded-xl border-2 border-[#1C293C] bg-amber-50/40 p-4 shadow-[4px_4px_0px_0px_#1C293C] sm:flex-row sm:items-center">
                        <div className="flex-1">
                            <label className="text-xs font-black uppercase text-[#1C293C]">
                                Tambahkan Soal dari Bank Soal ke Paket Ini
                            </label>
                            <select
                                value={selectedQuestionId}
                                onChange={(e) => setSelectedQuestionId(e.target.value)}
                                className="mt-1 w-full rounded-lg border-2 border-[#1C293C] bg-white p-2 text-sm font-bold text-[#1C293C] focus:outline-none"
                            >
                                <option value="">-- Pilih Butir Soal --</option>
                                {availableQuestions.map((q) => (
                                    <option key={q.id} value={q.id}>
                                        #{q.id} - {q.text.substring(0, 80)}... ({q.difficulty || 'sedang'})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="button"
                            onClick={handleAddQuestion}
                            disabled={!selectedQuestionId}
                            className="inline-flex items-center justify-center gap-2 self-end rounded-lg border-2 border-[#1C293C] bg-[#FDC800] px-4 py-2 text-xs font-black uppercase tracking-wider text-[#1C293C] shadow-[3px_3px_0px_0px_#1C293C] hover:bg-amber-400 disabled:opacity-50"
                        >
                            <PlusCircle className="size-4" />
                            Masukkan ke Paket
                        </button>
                    </div>
                )}

                {/* Question Items in Package */}
                <div className="overflow-hidden rounded-xl border-[2.5px] border-[#1C293C] bg-white shadow-[6px_6px_0px_0px_#1C293C]">
                    <div className="border-b-[2.5px] border-[#1C293C] bg-[#FDC800] p-4">
                        <h2 className="font-heading text-base font-black uppercase tracking-wider text-[#1C293C]">
                            Urutan Butir Soal ({currentQuestions.length})
                        </h2>
                    </div>

                    <div className="divide-y-2 divide-[#1C293C]">
                        {currentQuestions.length === 0 ? (
                            <div className="p-8 text-center text-sm font-medium text-slate-500">
                                Paket soal ini belum memiliki butir soal. Silakan pilih dari bank soal di atas.
                            </div>
                        ) : (
                            currentQuestions.map((q, idx) => (
                                <div
                                    key={q.id}
                                    className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-amber-50/30"
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border-2 border-[#1C293C] bg-slate-900 font-mono text-xs font-black text-white">
                                            {idx + 1}
                                        </span>
                                        <div>
                                            <p className="text-sm font-bold text-[#1C293C]">{q.text}</p>
                                            <span className="mt-1 inline-block rounded border border-[#1C293C] bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-slate-600">
                                                {q.difficulty || 'Sedang'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        <button
                                            type="button"
                                            disabled={idx === 0}
                                            onClick={() => handleMove(idx, 'up')}
                                            className="rounded border-2 border-[#1C293C] bg-white p-1.5 shadow-[2px_2px_0px_0px_#1C293C] hover:bg-slate-50 disabled:opacity-30"
                                            title="Geser ke Atas"
                                        >
                                            <ArrowUp className="size-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            disabled={idx === currentQuestions.length - 1}
                                            onClick={() => handleMove(idx, 'down')}
                                            className="rounded border-2 border-[#1C293C] bg-white p-1.5 shadow-[2px_2px_0px_0px_#1C293C] hover:bg-slate-50 disabled:opacity-30"
                                            title="Geser ke Bawah"
                                        >
                                            <ArrowDown className="size-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveQuestion(q.id)}
                                            className="rounded border-2 border-[#1C293C] bg-red-100 p-1.5 text-red-700 shadow-[2px_2px_0px_0px_#1C293C] hover:bg-red-200"
                                            title="Lepas dari Paket"
                                        >
                                            <Trash2 className="size-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
