import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, UserPlus, Trash2, Users } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface UserItem {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    is_active?: boolean;
}

interface Course {
    id: number;
    name: string;
    code: string;
    description: string | null;
    teacher: { id: number; name: string; email: string };
}

interface PaginatedData<T> {
    data: T[];
    total: number;
}

interface Props {
    course: Course;
    students: PaginatedData<UserItem>;
    availableStudents: UserItem[];
    canManageMembers: boolean;
}

export default function CourseShow({ course, students, availableStudents, canManageMembers }: Props) {
    const [selectedStudentId, setSelectedStudentId] = useState<string>('');

    const handleAddStudent = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStudentId) return;

        router.post(`/courses/${course.id}/students`, {
            student_ids: [parseInt(selectedStudentId, 10)],
        }, {
            onSuccess: () => setSelectedStudentId(''),
        });
    };

    const handleRemoveStudent = (student: UserItem) => {
        if (confirm(`Keluarkan ${student.name} dari kelas ${course.code}?`)) {
            router.delete(`/courses/${course.id}/students/${student.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Kelas Perkuliahan', href: '/courses' },
            { title: course.code, href: `/courses/${course.id}` },
        ]}>
            <Head title={`Kelas ${course.code} - ${course.name}`} />
            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Course Header Banner */}
                <div className="rounded-xl border-[2.5px] border-[#1C293C] bg-white p-6 shadow-[6px_6px_0px_0px_#1C293C]">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="rounded border-2 border-[#1C293C] bg-[#FDC800] px-2.5 py-0.5 font-mono text-xs font-black uppercase text-[#1C293C]">
                                    {course.code}
                                </span>
                                <span className="text-xs font-bold text-slate-500">
                                    Dosen Pengampu: <strong className="text-slate-900">{course.teacher.name}</strong>
                                </span>
                            </div>
                            <h1 className="mt-2 font-heading text-2xl font-black uppercase tracking-tight text-[#1C293C]">
                                {course.name}
                            </h1>
                            <p className="mt-1 text-sm text-slate-600">
                                {course.description || 'Tidak ada deskripsi mata kuliah.'}
                            </p>
                        </div>

                        <div className="inline-flex items-center gap-2 rounded-lg border-2 border-[#1C293C] bg-indigo-50 px-4 py-2 font-bold text-indigo-900 shadow-[2px_2px_0px_0px_#1C293C]">
                            <Users className="size-5" />
                            <span>{students.total} Anggota Mahasiswa</span>
                        </div>
                    </div>
                </div>

                {/* Add Member Bar */}
                {canManageMembers && availableStudents.length > 0 && (
                    <div className="flex flex-col gap-3 rounded-xl border-2 border-[#1C293C] bg-amber-50/40 p-4 shadow-[4px_4px_0px_0px_#1C293C] sm:flex-row sm:items-center">
                        <div className="flex-1">
                            <label className="text-xs font-black uppercase text-[#1C293C]">
                                Tambahkan Mahasiswa ke Kelas Ini
                            </label>
                            <select
                                value={selectedStudentId}
                                onChange={(e) => setSelectedStudentId(e.target.value)}
                                className="mt-1 w-full rounded-lg border-2 border-[#1C293C] bg-white p-2 text-sm font-bold text-[#1C293C] focus:outline-none"
                            >
                                <option value="">-- Pilih Mahasiswa Terdaftar --</option>
                                {availableStudents.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name} ({s.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="button"
                            onClick={handleAddStudent}
                            disabled={!selectedStudentId}
                            className="inline-flex items-center justify-center gap-2 self-end rounded-lg border-2 border-[#1C293C] bg-[#FDC800] px-4 py-2 text-xs font-black uppercase tracking-wider text-[#1C293C] shadow-[3px_3px_0px_0px_#1C293C] hover:bg-amber-400 disabled:opacity-50"
                        >
                            <UserPlus className="size-4" />
                            Tambahkan
                        </button>
                    </div>
                )}

                {/* Members List Table */}
                <div className="overflow-hidden rounded-xl border-[2.5px] border-[#1C293C] bg-white shadow-[6px_6px_0px_0px_#1C293C]">
                    <div className="border-b-[2.5px] border-[#1C293C] bg-[#FDC800] p-4">
                        <h2 className="font-heading text-base font-black uppercase tracking-wider text-[#1C293C]">
                            Daftar Mahasiswa Terdaftar ({students.total})
                        </h2>
                    </div>

                    <table className="w-full text-left text-sm text-[#1C293C]">
                        <thead className="border-b-2 border-[#1C293C] bg-slate-50 text-xs font-black uppercase">
                            <tr>
                                <th className="p-3.5">Nama Mahasiswa</th>
                                <th className="p-3.5">Email</th>
                                <th className="p-3.5">Telepon</th>
                                {canManageMembers && <th className="p-3.5 text-right">Aksi</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-[#1C293C]">
                            {students.data.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-sm font-medium text-slate-500">
                                        Belum ada mahasiswa yang ditambahkan ke kelas ini.
                                    </td>
                                </tr>
                            ) : (
                                students.data.map((student) => (
                                    <tr key={student.id} className="hover:bg-slate-50">
                                        <td className="p-3.5 font-bold">{student.name}</td>
                                        <td className="p-3.5 font-mono text-xs text-slate-600">{student.email}</td>
                                        <td className="p-3.5 font-mono text-xs">{student.phone || '-'}</td>
                                        {canManageMembers && (
                                            <td className="p-3.5 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveStudent(student)}
                                                    className="rounded border-2 border-[#1C293C] bg-red-100 p-1.5 text-red-700 shadow-[2px_2px_0px_0px_#1C293C] hover:bg-red-200"
                                                    title="Keluarkan dari kelas"
                                                >
                                                    <Trash2 className="size-4" />
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
