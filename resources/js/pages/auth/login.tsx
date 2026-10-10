import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Masuk" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Alamat Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Kata Sandi</Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="ml-auto text-sm"
                                            tabIndex={5}
                                        >
                                            Lupa kata sandi?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Kata Sandi"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <Label htmlFor="remember">Ingat Saya</Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 w-full"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Masuk
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Belum punya akun?{' '}
                            <TextLink href={register()} tabIndex={5}>
                                Daftar
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>

            {/* Quick Demo Credentials Info for Testing */}
            <div className="mt-6 rounded-base border-2 border-border bg-secondary-background p-5 shadow-xs">
                <div>
                    <h3 className="text-base font-heading">
                        Akun Akses Uji Coba
                    </h3>
                    <p className="mt-1 text-xs text-foreground/80">
                        Gunakan email demo berikut untuk masuk sesuai role:
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-mono">
                        <span className="rounded-base border-2 border-border bg-main/40 px-2.5 py-1">
                            Admin: admin@fauzanhanif.my.id
                        </span>
                        <span className="rounded-base border-2 border-border bg-main/40 px-2.5 py-1">
                            Dosen: dosen@fauzanhanif.my.id
                        </span>
                        <span className="rounded-base border-2 border-border bg-main/40 px-2.5 py-1">
                            Mahasiswa: mahasiswa@fauzanhanif.my.id
                        </span>
                    </div>
                    <p className="mt-3 text-xs text-foreground/80">
                        Kata sandi untuk semua akun: <code className="font-bold text-foreground font-mono">password</code>
                    </p>
                </div>
            </div>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Masuk ke Akun Anda',
    description: 'Masukkan email dan kata sandi Anda di bawah ini untuk masuk',
};
