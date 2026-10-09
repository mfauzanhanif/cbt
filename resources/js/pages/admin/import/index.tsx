import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Download, FileSpreadsheet, Upload, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface Failure {
    row: number;
    email: string;
    error: string;
}

interface ImportReport {
    successCount: number;
    skippedCount: number;
    failureCount: number;
    failures: Failure[];
}

interface Props {
    importReport?: ImportReport | null;
}

export default function UserImportIndex({ importReport }: Props) {
    const [fileName, setFileName] = useState<string>('');
    const { data, setData, post, processing, errors } = useForm<{ file: File | null }>({
        file: null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setData('file', selectedFile);
            setFileName(selectedFile.name);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/import', {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Impor Pengguna', href: '/admin/import' }]}>
            <Head title="Impor Data Pengguna" />
            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="font-heading text-2xl font-black uppercase tracking-tight text-[#1C293C]">
                        Impor Data Pengguna Massal
                    </h1>
                    <p className="text-sm font-medium text-slate-600">
                        Unggah berkas spreadsheet Excel (.xlsx) atau CSV untuk mendaftarkan akun Dosen dan Mahasiswa sekaligus.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Upload Card */}
                    <div className="rounded-xl border-[2.5px] border-[#1C293C] bg-white p-6 shadow-[6px_6px_0px_0px_#1C293C]">
                        <h2 className="font-heading text-lg font-black uppercase text-[#1C293C]">
                            Unggah Berkas Spreadsheet
                        </h2>
                        <p className="mt-1 text-xs font-medium text-slate-500">
                            Pastikan format kolom sesuai dengan template standar (nama, email, peran, telepon).
                        </p>

                        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#1C293C] bg-amber-50/40 p-6 text-center hover:bg-amber-50">
                                <FileSpreadsheet className="size-12 text-[#1C293C]" />
                                <label className="mt-4 cursor-pointer rounded-lg border-2 border-[#1C293C] bg-white px-4 py-2 text-xs font-bold uppercase shadow-[2px_2px_0px_0px_#1C293C] hover:bg-slate-50">
                                    Pilih Berkas (.xlsx / .csv)
                                    <input
                                        type="file"
                                        accept=".xlsx,.csv,.xls"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                                {fileName && (
                                    <span className="mt-2 font-mono text-xs font-bold text-slate-700">
                                        Berkas terpilih: {fileName}
                                    </span>
                                )}
                            </div>

                            {errors.file && <p className="text-xs font-bold text-red-600">{errors.file}</p>}

                            <div className="flex items-center justify-between pt-2">
                                <a
                                    href="/admin/import/template"
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 underline hover:text-black"
                                >
                                    <Download className="size-4" />
                                    Unduh Template CSV
                                </a>

                                <button
                                    type="submit"
                                    disabled={!data.file || processing}
                                    className="inline-flex items-center gap-2 rounded-lg border-2 border-[#1C293C] bg-[#FDC800] px-4 py-2 text-sm font-bold uppercase tracking-wider text-[#1C293C] shadow-[3px_3px_0px_0px_#1C293C] transition-all hover:bg-amber-400 disabled:opacity-50"
                                >
                                    <Upload className="size-4" />
                                    {processing ? 'Memproses...' : 'Mulai Impor'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Panduan Format Kolom */}
                    <div className="flex flex-col gap-4 rounded-xl border-[2.5px] border-[#1C293C] bg-amber-50/20 p-6 shadow-[6px_6px_0px_0px_#1C293C]">
                        <h2 className="font-heading text-lg font-black uppercase text-[#1C293C]">
                            Panduan Format Kolom
                        </h2>
                        <div className="space-y-3 text-xs text-slate-700">
                            <div className="rounded-lg border-2 border-[#1C293C] bg-white p-3 font-mono">
                                <p className="font-bold text-[#1C293C]">nama, email, peran, telepon</p>
                                <p className="text-slate-500">Ahmad Rizky, ahmad@kampus.ac.id, mahasiswa, 08123456789</p>
                                <p className="text-slate-500">Dr. Fauzan Hanif, fauzan@kampus.ac.id, dosen, 08129876543</p>
                            </div>
                            <ul className="list-inside list-disc space-y-1 font-medium">
                                <li><strong>peran</strong>: Isi dengan <code className="rounded bg-slate-200 px-1 font-mono">mahasiswa</code> atau <code className="rounded bg-slate-200 px-1 font-mono">dosen</code>.</li>
                                <li>Email harus unik dan belum terdaftar di sistem. Jika email sudah ada, data baris tersebut akan dilewati secara otomatis.</li>
                                <li>Kata sandi awal akun yang diimpor disetel ke <code className="rounded bg-slate-200 px-1 font-mono">password</code>.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Hasil Rekapitulasi Impor */}
                {importReport && (
                    <div className="rounded-xl border-[2.5px] border-[#1C293C] bg-white p-6 shadow-[6px_6px_0px_0px_#1C293C]">
                        <h3 className="font-heading text-lg font-black uppercase text-[#1C293C]">
                            Hasil Rekapitulasi Impor Terakhir
                        </h3>
                        <div className="mt-4 grid grid-cols-3 gap-4">
                            <div className="flex items-center gap-3 rounded-lg border-2 border-[#1C293C] bg-green-50 p-3 shadow-[2px_2px_0px_0px_#1C293C]">
                                <CheckCircle2 className="size-6 text-green-600" />
                                <div>
                                    <p className="text-xl font-black text-green-700">{importReport.successCount}</p>
                                    <p className="text-xs font-bold uppercase text-slate-600">Berhasil Dibuat</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-lg border-2 border-[#1C293C] bg-amber-50 p-3 shadow-[2px_2px_0px_0px_#1C293C]">
                                <AlertTriangle className="size-6 text-amber-600" />
                                <div>
                                    <p className="text-xl font-black text-amber-700">{importReport.skippedCount}</p>
                                    <p className="text-xs font-bold uppercase text-slate-600">Dilewati (Duplikat)</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-lg border-2 border-[#1C293C] bg-red-50 p-3 shadow-[2px_2px_0px_0px_#1C293C]">
                                <AlertCircle className="size-6 text-red-600" />
                                <div>
                                    <p className="text-xl font-black text-red-700">{importReport.failureCount}</p>
                                    <p className="text-xs font-bold uppercase text-slate-600">Galat / Dilewati</p>
                                </div>
                            </div>
                        </div>

                        {importReport.failures.length > 0 && (
                            <div className="mt-6">
                                <h4 className="text-xs font-black uppercase text-slate-700">Rincian Baris Bermasalah:</h4>
                                <div className="mt-2 max-h-60 overflow-y-auto rounded-lg border-2 border-[#1C293C] bg-slate-50 p-2 text-xs font-mono">
                                    {importReport.failures.map((f, i) => (
                                        <div key={i} className="border-b border-slate-200 py-1.5 last:border-b-0">
                                            Baris {f.row} [{f.email}]: <span className="font-bold text-red-700">{f.error}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
