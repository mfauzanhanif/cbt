import { Link } from '@inertiajs/react';
import { LayoutDashboard, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dashboard, login, register } from '@/routes';
import type { User } from '@/types';

interface PublicHeroProps {
    user?: User | null;
}

export default function PublicHero({ user }: PublicHeroProps) {
    return (
        <section className="mb-14 rounded-base border-2 border-border bg-main p-8 text-main-foreground shadow-shadow md:p-14">
            <h1 className="max-w-4xl text-3xl font-heading leading-tight md:text-5xl lg:text-6xl">
                Sistem Ujian Berbasis Komputer yang Andal, Presisi, dan Anti-Curang.
            </h1>

            <p className="mt-6 max-w-2xl text-base font-base leading-relaxed opacity-90 md:text-lg">
                Platform Computer-Based Testing (CBT) dengan workstation responsif, penyimpanan instan (autosave beacon), bank soal multimedia, serta rekapitulasi nilai otomatis.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
                {user ? (
                    <Button asChild size="lg" variant="neutral">
                        <Link href={dashboard()}>
                            <LayoutDashboard className="mr-2 size-5" />
                            Masuk ke Dashboard
                        </Link>
                    </Button>
                ) : (
                    <>
                        <Button asChild size="lg" variant="neutral">
                            <Link href={login()}>
                                <LogIn className="mr-2 size-5" />
                                Masuk ke Portal Ujian
                            </Link>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="noShadow"
                            className="bg-secondary-background text-foreground"
                        >
                            <Link href={register()}>
                                <UserPlus className="mr-2 size-5" />
                                Registrasi Peserta
                            </Link>
                        </Button>
                    </>
                )}
            </div>
        </section>
    );
}
