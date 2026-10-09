import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Search, Copy, Trash2, X, Image as ImageIcon, CheckCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface Option {
    id?: number;
    label: string;
    text: string;
    is_correct: boolean;
    image_url?: string | null;
}

interface Question {
    id: number;
    text: string;
    explanation: string | null;
    difficulty: string | null;
    image_url: string | null;
    packages_count: number;
    created_at: string;
    options: Option[];
}

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
}

interface Props {
    questions: PaginatedData<Question>;
    filters: { search?: string; difficulty?: string };
}

export default function QuestionsIndex({ questions, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [difficulty, setDifficulty] = useState(filters.difficulty || '');
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const form = useForm<{
        text: string;
        difficulty: string;
        explanation: string;
        image: File | null;
        options: { label: string; text: string; is_correct: boolean }[];
    }>({
        text: '',
        difficulty: 'sedang',
        explanation: '',
        image: null,
        options: [
            { label: 'A', text: '', is_correct: true },
            { label: 'B', text: '', is_correct: false },
            { label: 'C', text: '', is_correct: false },
            { label: 'D', text: '', is_correct: false },
        ],
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/questions', { search, difficulty }, { preserveState: true });
    };

    const handleOptionTextChange = (index: number, val: string) => {
        const next = [...form.data.options];
        next[index].text = val;
        form.setData('options', next);
    };

    const handleOptionCorrectChange = (index: number) => {
        const next = form.data.options.map((opt, i) => ({
            ...opt,
            is_correct: i === index,
        }));
        form.setData('options', next);
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/questions', {
            forceFormData: true,
            onSuccess: () => {
                form.reset();
                setIsCreateOpen(false);
            },
        });
    };

    const handleDuplicate = (q: Question) => {
        router.post(`/questions/${q.id}/duplicate`);
    };

    const handleDelete = (q: Question) => {
        if (confirm('Yakin ingin menghapus butir soal ini?')) {
            router.delete(`/questions/${q.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Bank Soal', href: '/questions' }]}>
            <Head title="Bank Soal" />
            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="font-heading text-2xl font-black uppercase tracking-tight text-[#1C293C]">
                            Bank Soal Ujian
                        </h1>
                        <p className="text-sm font-medium text-slate-600">
                            Kelola butir soal pilihan ganda, kunci jawaban, dan stimulus gambar
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsCreateOpen(true)}
                        className="inline-flex items-center gap-2 rounded-lg border-2 border-[#1C293C] bg-[#FDC800] px-4 py-2 text-sm font-bold uppercase tracking-wider text-[#1C293C] shadow-[3px_3px_0px_0px_#1C293C] transition-all hover:bg-amber-400 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                    >
                        <Plus className="size-4" />
                        Tambah Soal Baru
                    </button>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col gap-3 rounded-xl border-2 border-[#1C293C] bg-white p-4 shadow-[4px_4px_0px_0px_#1C293C] sm:flex-row sm:items-center sm:justify-between">
                    <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari isi pertanyaan..."
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

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase text-slate-500">Kesulitan:</span>
                        <select
                            value={difficulty}
                            onChange={(e) => {
                                setDifficulty(e.target.value);
                                router.get('/questions', { search, difficulty: e.target.value }, { preserveState: true });
                            }}
                            className="rounded-lg border-2 border-[#1C293C] bg-white px-3 py-2 text-sm font-bold text-[#1C293C] focus:outline-none"
                        >
                            <option value="">Semua</option>
                            <option value="mudah">Mudah</option>
                            <option value="sedang">Sedang</option>
                            <option value="sulit">Sulit</option>
                        </select>
                    </div>
                </div>

                {/* Questions List */}
                <div className="flex flex-col gap-4">
                    {questions.data.length === 0 ? (
                        <div className="rounded-xl border-2 border-[#1C293C] bg-white p-8 text-center text-sm font-medium text-slate-500 shadow-[4px_4px_0px_0px_#1C293C]">
                            Belum ada soal dalam bank soal Anda.
                        </div>
                    ) : (
                        questions.data.map((q, index) => (
                            <div
                                key={q.id}
                                className="rounded-xl border-[2.5px] border-[#1C293C] bg-white p-5 shadow-[5px_5px_0px_0px_#1C293C]"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="rounded border-2 border-[#1C293C] bg-[#FDC800] px-2 py-0.5 font-mono text-xs font-black uppercase text-[#1C293C]">
                                            SOAL #{q.id}
                                        </span>
                                        <span className="rounded border border-[#1C293C] bg-slate-100 px-2 py-0.5 text-xs font-bold uppercase text-slate-700">
                                            {q.difficulty || 'Sedang'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => handleDuplicate(q)}
                                            className="inline-flex items-center gap-1 rounded border-2 border-[#1C293C] bg-white px-2.5 py-1 text-xs font-bold shadow-[2px_2px_0px_0px_#1C293C] hover:bg-slate-50"
                                            title="Duplikasi Butir Soal"
                                        >
                                            <Copy className="size-3.5" />
                                            Duplikat
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(q)}
                                            className="rounded border-2 border-[#1C293C] bg-red-100 p-1 text-red-700 shadow-[2px_2px_0px_0px_#1C293C] hover:bg-red-200"
                                            title="Hapus Soal"
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>
                                </div>

                                <p className="mt-3 text-sm font-semibold text-[#1C293C]">{q.text}</p>

                                {q.image_url && (
                                    <div className="mt-3">
                                        <img
                                            src={q.image_url}
                                            alt="Stimulus Soal"
                                            className="max-h-48 rounded-lg border-2 border-[#1C293C] object-contain shadow-[2px_2px_0px_0px_#1C293C]"
                                        />
                                    </div>
                                )}

                                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                                    {q.options.map((opt) => (
                                        <div
                                            key={opt.id || opt.label}
                                            className={`flex items-start gap-2 rounded-lg border-2 p-2.5 text-xs font-medium ${
                                                opt.is_correct
                                                    ? 'border-green-600 bg-green-50 text-green-900 shadow-[2px_2px_0px_0px_#16A34A]'
                                                    : 'border-[#1C293C] bg-slate-50 text-slate-800'
                                            }`}
                                        >
                                            <span
                                                className={`flex size-5 shrink-0 items-center justify-center rounded border font-mono font-bold ${
                                                    opt.is_correct
                                                        ? 'border-green-600 bg-green-600 text-white'
                                                        : 'border-[#1C293C] bg-white text-[#1C293C]'
                                                }`}
                                            >
                                                {opt.label}
                                            </span>
                                            <span className="flex-1">{opt.text}</span>
                                            {opt.is_correct && <CheckCircle className="size-4 text-green-600 shrink-0" />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Modal Create Question */}
                {isCreateOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm overflow-y-auto">
                        <div className="my-8 w-full max-w-xl rounded-xl border-[3px] border-[#1C293C] bg-white p-6 shadow-[8px_8px_0px_0px_#1C293C]">
                            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
                                <h2 className="font-heading text-lg font-black uppercase text-[#1C293C]">
                                    Tambah Butir Soal Baru
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => setIsCreateOpen(false)}
                                    className="rounded border border-[#1C293C] p-1 hover:bg-slate-100"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>
                            <form onSubmit={handleCreateSubmit} className="mt-4 flex flex-col gap-4">
                                <div>
                                    <label className="text-xs font-bold uppercase text-[#1C293C]">Pertanyaan Utama</label>
                                    <textarea
                                        rows={3}
                                        required
                                        placeholder="Tuliskan butir soal di sini..."
                                        value={form.data.text}
                                        onChange={(e) => form.setData('text', e.target.value)}
                                        className="mt-1 w-full rounded-lg border-2 border-[#1C293C] p-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FDC800]"
                                    />
                                    {form.errors.text && <p className="text-xs text-red-600">{form.errors.text}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-bold uppercase text-[#1C293C]">Tingkat Kesulitan</label>
                                        <select
                                            value={form.data.difficulty}
                                            onChange={(e) => form.setData('difficulty', e.target.value)}
                                            className="mt-1 w-full rounded-lg border-2 border-[#1C293C] p-2 text-sm font-bold focus:outline-none"
                                        >
                                            <option value="mudah">Mudah</option>
                                            <option value="sedang">Sedang</option>
                                            <option value="sulit">Sulit</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase text-[#1C293C]">Unggah Gambar (Opsional)</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => form.setData('image', e.target.files?.[0] || null)}
                                            className="mt-1 w-full text-xs"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase text-[#1C293C]">
                                        Pilihan Jawaban (Pilih radio untuk jawaban benar):
                                    </label>
                                    <div className="mt-2 space-y-2">
                                        {form.data.options.map((opt, i) => (
                                            <div key={opt.label} className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="correct_option"
                                                    checked={opt.is_correct}
                                                    onChange={() => handleOptionCorrectChange(i)}
                                                    className="size-4 text-[#FDC800] focus:ring-0"
                                                />
                                                <span className="flex size-7 shrink-0 items-center justify-center rounded border-2 border-[#1C293C] bg-amber-100 font-mono font-bold text-xs">
                                                    {opt.label}
                                                </span>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder={`Isi pilihan jawaban ${opt.label}...`}
                                                    value={opt.text}
                                                    onChange={(e) => handleOptionTextChange(i, e.target.value)}
                                                    className="flex-1 rounded-lg border-2 border-[#1C293C] p-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#FDC800]"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase text-[#1C293C]">Pembahasan / Penjelasan (Opsional)</label>
                                    <textarea
                                        rows={2}
                                        placeholder="Penjelasan kenapa jawaban tersebut benar..."
                                        value={form.data.explanation}
                                        onChange={(e) => form.setData('explanation', e.target.value)}
                                        className="mt-1 w-full rounded-lg border-2 border-[#1C293C] p-2 text-xs font-medium focus:outline-none"
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
                                        Simpan Soal
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
