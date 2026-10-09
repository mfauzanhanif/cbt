import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Camera, Check, CheckCircle2, Shield, Trash2, Upload, User as UserIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import type { Auth } from '@/types';

type PageProps = {
    auth: Auth;
};

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<PageProps>().props;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [avatarPreview, setAvatarPreview] = useState<string | null>(auth.user.avatar || null);

    const form = useForm<{
        _method: string;
        name: string;
        email: string;
        phone: string;
        avatar: File | null;
        remove_avatar: boolean;
    }>({
        _method: 'patch',
        name: auth.user.name || '',
        email: auth.user.email || '',
        phone: (auth.user.phone as string) || '',
        avatar: null,
        remove_avatar: false,
    });

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setData((data) => ({
                ...data,
                avatar: file,
                remove_avatar: false,
            }));
            const reader = new FileReader();
            reader.onload = (uploadEvent) => {
                setAvatarPreview(uploadEvent.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveAvatar = () => {
        form.setData((data) => ({
            ...data,
            avatar: null,
            remove_avatar: true,
        }));
        setAvatarPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/settings/profile', {
            preserveScroll: true,
        });
    };

    const initials = auth.user.name
        ? auth.user.name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()
        : 'U';

    const roles = auth.user.roles || [];

    return (
        <>
            <Head title="Profil Saya" />

            <h1 className="sr-only">Pengaturan Profil</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Profil Saya"
                    description="Perbarui informasi data diri, kontak, dan foto profil akun Anda"
                />

                {/* Role Badge Card */}
                <div className="flex items-center gap-3 rounded-xl border-2 border-[#1C293C] bg-[#F0F3FF] p-4 shadow-[3px_3px_0px_0px_#1C293C]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-[#1C293C] bg-white text-[#432DD7]">
                        <Shield className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Peran Akun</div>
                        <div className="flex gap-1.5 mt-0.5">
                            {roles.length > 0 ? (
                                roles.map((r) => (
                                    <span
                                        key={r}
                                        className="inline-block rounded border-2 border-[#1C293C] bg-[#FDC800] px-2 py-0.5 text-xs font-black uppercase text-[#1C293C]"
                                    >
                                        {r}
                                    </span>
                                ))
                            ) : (
                                <span className="text-xs font-bold text-slate-600">Pengguna Terdaftar</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Form Update Profile */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Avatar Upload Area */}
                    <div className="rounded-xl border-2 border-[#1C293C] bg-white p-5 shadow-[4px_4px_0px_0px_#1C293C]">
                        <Label className="font-heading font-black uppercase text-[#1C293C]">Foto Profil</Label>
                        <p className="mt-0.5 text-xs text-slate-500">Mendukung format JPG, PNG, atau WebP (Maks. 2MB)</p>

                        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                            {avatarPreview ? (
                                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 border-[#1C293C] shadow-[3px_3px_0px_0px_#1C293C]">
                                    <img
                                        src={avatarPreview}
                                        alt={auth.user.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border-2 border-[#1C293C] bg-[#FDC800] font-mono text-2xl font-black text-[#1C293C] shadow-[3px_3px_0px_0px_#1C293C]">
                                    {initials}
                                </div>
                            )}

                            <div className="flex flex-wrap items-center gap-2">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-[#1C293C] font-bold shadow-[2px_2px_0px_0px_#1C293C] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                                >
                                    <Upload className="mr-1.5 h-4 w-4" />
                                    Unggah Foto Baru
                                </Button>

                                {avatarPreview && (
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={handleRemoveAvatar}
                                        className="border-2 border-[#1C293C] font-bold shadow-[2px_2px_0px_0px_#1C293C] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                                    >
                                        <Trash2 className="mr-1.5 h-4 w-4" />
                                        Hapus Foto
                                    </Button>
                                )}
                            </div>
                        </div>
                        {form.errors.avatar && <InputError className="mt-2" message={form.errors.avatar} />}
                    </div>

                    {/* Inputs */}
                    <div className="space-y-4 rounded-xl border-2 border-[#1C293C] bg-white p-5 shadow-[4px_4px_0px_0px_#1C293C]">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="font-bold text-[#1C293C]">
                                Nama Lengkap
                            </Label>
                            <Input
                                id="name"
                                className="border-2 border-[#1C293C] text-sm font-semibold focus:bg-amber-50/50"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                required
                                autoComplete="name"
                                placeholder="Nama lengkap Anda"
                            />
                            <InputError message={form.errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email" className="font-bold text-[#1C293C]">
                                Alamat Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                className="border-2 border-[#1C293C] text-sm font-semibold focus:bg-amber-50/50"
                                value={form.data.email}
                                onChange={(e) => form.setData('email', e.target.value)}
                                required
                                autoComplete="username"
                                placeholder="email@kampus.ac.id"
                            />
                            <InputError message={form.errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="phone" className="font-bold text-[#1C293C]">
                                Nomor Telepon / Kontak
                            </Label>
                            <Input
                                id="phone"
                                type="tel"
                                className="border-2 border-[#1C293C] font-mono text-sm font-semibold focus:bg-amber-50/50"
                                value={form.data.phone}
                                onChange={(e) => form.setData('phone', e.target.value)}
                                placeholder="Misal: 081234567890"
                            />
                            <InputError message={form.errors.phone} />
                        </div>

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div className="rounded-lg border-2 border-amber-400 bg-amber-50 p-3 text-xs text-amber-900">
                                <p>
                                    Alamat email Anda belum diverifikasi.{' '}
                                    <Link
                                        href={send()}
                                        as="button"
                                        className="font-bold underline hover:text-amber-950"
                                    >
                                        Klik di sini untuk mengirim ulang tautan verifikasi.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 font-bold text-emerald-700">
                                        Tautan verifikasi baru telah dikirimkan ke alamat email Anda.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="pt-2">
                            <Button
                                type="submit"
                                disabled={form.processing}
                                className="border-2 border-[#1C293C] bg-[#FDC800] font-heading font-black uppercase text-[#1C293C] shadow-[3px_3px_0px_0px_#1C293C] hover:bg-amber-400 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                            >
                                Simpan Perubahan Profil
                            </Button>
                        </div>
                    </div>
                </form>
            </div>

            <DeleteUser />
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Profil Saya',
            href: edit(),
        },
    ],
};
