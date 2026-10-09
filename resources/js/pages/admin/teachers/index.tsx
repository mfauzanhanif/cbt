import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Search, UserCheck, UserX, Edit, X } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface Teacher {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    is_active: boolean;
    taught_courses_count: number;
}

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    teachers: PaginatedData<Teacher>;
    filters: {
        search?: string;
        status?: string;
    };
}

export default function TeachersIndex({ teachers, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

    const createForm = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        is_active: true,
    });

    const editForm = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        is_active: true,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/teachers', { search, status }, { preserveState: true });
    };

    const handleFilterStatus = (newStatus: string) => {
        setStatus(newStatus);
        router.get('/admin/teachers', { search, status: newStatus }, { preserveState: true });
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/admin/teachers', {
            onSuccess: () => {
                createForm.reset();
                setIsCreateOpen(false);
            },
        });
    };

    const handleOpenEdit = (teacher: Teacher) => {
        setEditingTeacher(teacher);
        editForm.setData({
            name: teacher.name,
            email: teacher.email,
            phone: teacher.phone || '',
            password: '',
            is_active: teacher.is_active,
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTeacher) return;
        editForm.put(`/admin/teachers/${editingTeacher.id}`, {
            onSuccess: () => {
                setEditingTeacher(null);
            },
        });
    };

    const handleToggleStatus = (teacher: Teacher) => {
        if (confirm(`Yakin ingin mengubah status akun dosen ${teacher.name}?`)) {
            router.patch(`/admin/teachers/${teacher.id}/toggle-status`);
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Data Dosen', href: '/admin/teachers' }]}>
            <Head title="Data Dosen" />
            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="font-heading text-2xl font-black uppercase tracking-tight text-[#1C293C]">
                            Data Dosen Pengajar
                        </h1>
                        <p className="text-sm font-medium text-slate-600">
                            Kelola akun dosen pembuat soal dan jadwal ujian ({teachers.total} total)
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsCreateOpen(true)}
                        className="inline-flex items-center gap-2 rounded-lg border-2 border-[#1C293C] bg-[#FDC800] px-4 py-2 text-sm font-bold uppercase tracking-wider text-[#1C293C] shadow-[3px_3px_0px_0px_#1C293C] transition-all hover:bg-amber-400 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                    >
                        <Plus className="size-4" />
                        Tambah Dosen
                    </button>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col gap-3 rounded-xl border-2 border-[#1C293C] bg-white p-4 shadow-[4px_4px_0px_0px_#1C293C] md:flex-row md:items-center md:justify-between">
                    <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari nama, email, atau telepon..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-lg border-2 border-[#1C293C] py-2 pl-9 pr-3 text-sm font-medium text-[#1C293C] focus:outline-none focus:ring-2 focus:ring-[#FDC800]"
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
                        <span className="text-xs font-bold uppercase text-slate-500">Status:</span>
                        <select
                            value={status}
                            onChange={(e) => handleFilterStatus(e.target.value)}
                            className="rounded-lg border-2 border-[#1C293C] bg-white px-3 py-2 text-sm font-bold text-[#1C293C] focus:outline-none"
                        >
                            <option value="">Semua</option>
                            <option value="active">Aktif</option>
                            <option value="0">Nonaktif</option>
                        </select>
                    </div>
                </div>

                {/* Desktop Table */}
                <div className="hidden overflow-hidden rounded-xl border-[2.5px] border-[#1C293C] bg-white shadow-[6px_6px_0px_0px_#1C293C] md:block">
                    <table className="w-full text-left text-sm text-[#1C293C]">
                        <thead className="border-b-[2.5px] border-[#1C293C] bg-[#FDC800] text-xs font-black uppercase tracking-wider">
                            <tr>
                                <th className="p-3.5">Nama Dosen</th>
                                <th className="p-3.5">Email</th>
                                <th className="p-3.5">Telepon</th>
                                <th className="p-3.5 text-center">Kelas Diampu</th>
                                <th className="p-3.5 text-center">Status</th>
                                <th className="p-3.5 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-[#1C293C]">
                            {teachers.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-sm font-medium text-slate-500">
                                        Tidak ada data dosen yang ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                teachers.data.map((teacher) => (
                                    <tr key={teacher.id} className="transition-colors hover:bg-amber-50/50">
                                        <td className="p-3.5 font-bold">{teacher.name}</td>
                                        <td className="p-3.5 font-mono text-xs text-slate-600">{teacher.email}</td>
                                        <td className="p-3.5 font-mono text-xs">{teacher.phone || '-'}</td>
                                        <td className="p-3.5 text-center font-bold">
                                            <span className="rounded border-2 border-[#1C293C] bg-amber-50 px-2 py-0.5 text-xs font-black text-amber-800">
                                                {teacher.taught_courses_count} Kelas
                                            </span>
                                        </td>
                                        <td className="p-3.5 text-center">
                                            <span
                                                className={`inline-block rounded-md border-2 border-[#1C293C] px-2.5 py-0.5 text-xs font-black uppercase shadow-[2px_2px_0px_0px_#1C293C] ${
                                                    teacher.is_active ? 'bg-green-400 text-slate-900' : 'bg-red-400 text-slate-900'
                                                }`}
                                            >
                                                {teacher.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="p-3.5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenEdit(teacher)}
                                                    className="rounded border-2 border-[#1C293C] bg-white p-1.5 shadow-[2px_2px_0px_0px_#1C293C] hover:bg-slate-100"
                                                    title="Ubah Data"
                                                >
                                                    <Edit className="size-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleStatus(teacher)}
                                                    className={`rounded border-2 border-[#1C293C] p-1.5 shadow-[2px_2px_0px_0px_#1C293C] ${
                                                        teacher.is_active
                                                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    }`}
                                                    title={teacher.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                                >
                                                    {teacher.is_active ? <UserX className="size-4" /> : <UserCheck className="size-4" />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card Stack */}
                <div className="flex flex-col gap-3 md:hidden">
                    {teachers.data.map((teacher) => (
                        <div
                            key={teacher.id}
                            className="rounded-xl border-2 border-[#1C293C] bg-white p-4 shadow-[4px_4px_0px_0px_#1C293C]"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-bold text-[#1C293C]">{teacher.name}</h3>
                                    <p className="font-mono text-xs text-slate-500">{teacher.email}</p>
                                </div>
                                <span
                                    className={`rounded border-2 border-[#1C293C] px-2 py-0.5 text-xs font-black uppercase ${
                                        teacher.is_active ? 'bg-green-300' : 'bg-red-300'
                                    }`}
                                >
                                    {teacher.is_active ? 'Aktif' : 'Nonaktif'}
                                </span>
                            </div>
                            <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3 text-xs">
                                <span className="font-medium text-slate-600">
                                    Kelas Diampu: <strong>{teacher.taught_courses_count}</strong>
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleOpenEdit(teacher)}
                                        className="rounded border-2 border-[#1C293C] bg-white px-2.5 py-1 font-bold shadow-[2px_2px_0px_0px_#1C293C]"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleToggleStatus(teacher)}
                                        className={`rounded border-2 border-[#1C293C] px-2.5 py-1 font-bold shadow-[2px_2px_0px_0px_#1C293C] ${
                                            teacher.is_active ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'
                                        }`}
                                    >
                                        {teacher.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal Create Teacher */}
                {isCreateOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-md rounded-xl border-[3px] border-[#1C293C] bg-white p-6 shadow-[8px_8px_0px_0px_#1C293C]">
                            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
                                <h2 className="font-heading text-lg font-black uppercase text-[#1C293C]">
                                    Tambah Dosen Baru
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => setIsCreateOpen(false)}
                                    className="rounded border border-[#1C293C] p-1 hover:bg-slate-100"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>
                            <form onSubmit={handleCreateSubmit} className="mt-4 flex flex-col gap-3">
                                <div>
                                    <label className="text-xs font-bold uppercase text-[#1C293C]">Nama Lengkap & Gelar</label>
                                    <input
                                        type="text"
                                        required
                                        value={createForm.data.name}
                                        onChange={(e) => createForm.setData('name', e.target.value)}
                                        className="mt-1 w-full rounded-lg border-2 border-[#1C293C] p-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FDC800]"
                                    />
                                    {createForm.errors.name && <p className="text-xs text-red-600">{createForm.errors.name}</p>}
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-[#1C293C]">Email Kampus</label>
                                    <input
                                        type="email"
                                        required
                                        value={createForm.data.email}
                                        onChange={(e) => createForm.setData('email', e.target.value)}
                                        className="mt-1 w-full rounded-lg border-2 border-[#1C293C] p-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FDC800]"
                                    />
                                    {createForm.errors.email && <p className="text-xs text-red-600">{createForm.errors.email}</p>}
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-[#1C293C]">No. Telepon / WhatsApp</label>
                                    <input
                                        type="text"
                                        value={createForm.data.phone}
                                        onChange={(e) => createForm.setData('phone', e.target.value)}
                                        className="mt-1 w-full rounded-lg border-2 border-[#1C293C] p-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FDC800]"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-[#1C293C]">
                                        Kata Sandi (Default: password)
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Kosongkan jika default"
                                        value={createForm.data.password}
                                        onChange={(e) => createForm.setData('password', e.target.value)}
                                        className="mt-1 w-full rounded-lg border-2 border-[#1C293C] p-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FDC800]"
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
                                        disabled={createForm.processing}
                                        className="rounded-lg border-2 border-[#1C293C] bg-[#FDC800] px-4 py-2 text-sm font-bold uppercase text-[#1C293C] shadow-[3px_3px_0px_0px_#1C293C] hover:bg-amber-400"
                                    >
                                        Simpan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal Edit Teacher */}
                {editingTeacher && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-md rounded-xl border-[3px] border-[#1C293C] bg-white p-6 shadow-[8px_8px_0px_0px_#1C293C]">
                            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
                                <h2 className="font-heading text-lg font-black uppercase text-[#1C293C]">
                                    Ubah Data Dosen
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => setEditingTeacher(null)}
                                    className="rounded border border-[#1C293C] p-1 hover:bg-slate-100"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>
                            <form onSubmit={handleEditSubmit} className="mt-4 flex flex-col gap-3">
                                <div>
                                    <label className="text-xs font-bold uppercase text-[#1C293C]">Nama Lengkap & Gelar</label>
                                    <input
                                        type="text"
                                        required
                                        value={editForm.data.name}
                                        onChange={(e) => editForm.setData('name', e.target.value)}
                                        className="mt-1 w-full rounded-lg border-2 border-[#1C293C] p-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FDC800]"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-[#1C293C]">Email Kampus</label>
                                    <input
                                        type="email"
                                        required
                                        value={editForm.data.email}
                                        onChange={(e) => editForm.setData('email', e.target.value)}
                                        className="mt-1 w-full rounded-lg border-2 border-[#1C293C] p-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FDC800]"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-[#1C293C]">No. Telepon / WhatsApp</label>
                                    <input
                                        type="text"
                                        value={editForm.data.phone}
                                        onChange={(e) => editForm.setData('phone', e.target.value)}
                                        className="mt-1 w-full rounded-lg border-2 border-[#1C293C] p-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FDC800]"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-[#1C293C]">
                                        Ganti Kata Sandi (Opsional)
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Kosongkan jika tidak diubah"
                                        value={editForm.data.password}
                                        onChange={(e) => editForm.setData('password', e.target.value)}
                                        className="mt-1 w-full rounded-lg border-2 border-[#1C293C] p-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FDC800]"
                                    />
                                </div>
                                <div className="mt-4 flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setEditingTeacher(null)}
                                        className="rounded-lg border-2 border-[#1C293C] bg-white px-4 py-2 text-sm font-bold shadow-[2px_2px_0px_0px_#1C293C]"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={editForm.processing}
                                        className="rounded-lg border-2 border-[#1C293C] bg-[#FDC800] px-4 py-2 text-sm font-bold uppercase text-[#1C293C] shadow-[3px_3px_0px_0px_#1C293C] hover:bg-amber-400"
                                    >
                                        Simpan Perubahan
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
