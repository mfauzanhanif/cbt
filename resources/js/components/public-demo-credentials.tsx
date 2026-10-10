import { Link } from '@inertiajs/react';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { login } from '@/routes';

export default function PublicDemoCredentials() {
    return (
        <section className="rounded-base border-2 border-border bg-secondary-background p-6 shadow-shadow md:p-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
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

                <Button asChild variant="default" size="lg">
                    <Link href={login()}>
                        <LogIn className="mr-2 size-5" />
                        Masuk Sekarang
                    </Link>
                </Button>
            </div>
        </section>
    );
}
