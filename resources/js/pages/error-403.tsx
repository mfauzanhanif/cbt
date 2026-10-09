import { Head, Link } from '@inertiajs/react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function Error403() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#FBFBF9] p-4 text-[#1C293C]">
            <Head title="403 - Akses Ditolak" />
            <div className="w-full max-w-md rounded-xl border-[3px] border-[#1C293C] bg-white p-6 shadow-[6px_6px_0px_0px_#1C293C]">
                <div className="mb-4 inline-flex items-center justify-center rounded-lg border-2 border-[#1C293C] bg-red-100 p-3 text-red-600 shadow-[3px_3px_0px_0px_#1C293C]">
                    <ShieldAlert className="size-8" />
                </div>
                <h1 className="text-2xl font-black uppercase tracking-tight">403 — Akses Ditolak</h1>
                <p className="mt-2 text-sm font-medium text-slate-600">
                    Anda tidak memiliki wewenang atau hak akses yang cukup untuk membuka halaman ini.
                </p>
                <div className="mt-6">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-[#1C293C] bg-[#FDC800] px-4 py-2.5 font-bold uppercase tracking-wider text-[#1C293C] shadow-[3px_3px_0px_0px_#1C293C] transition-all hover:bg-amber-400 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                    >
                        <ArrowLeft className="size-4" />
                        Kembali ke Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
