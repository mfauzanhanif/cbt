import { Link } from '@inertiajs/react';
import { LayoutDashboard, LogIn, UserPlus } from 'lucide-react';
import AppearanceToggleTab from '@/components/appearance-tabs';
import { Button } from '@/components/ui/button';
import { dashboard, login, register } from '@/routes';
import type { User } from '@/types';

interface PublicNavbarProps {
    user?: User | null;
}

export default function PublicNavbar({ user }: PublicNavbarProps) {
    return (
        <header className="sticky top-0 z-40 border-b-2 border-border bg-secondary-background">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-base border-2 border-border bg-main shadow-xs overflow-hidden">
                        <img
                            src="/apple-touch-icon.png"
                            alt="CBT Logo"
                            className="size-7 object-contain"
                        />
                    </div>
                    <div>
                        <span className="font-heading text-lg font-bold tracking-tight text-foreground">
                            Computer Based Test
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden sm:block">
                        <AppearanceToggleTab />
                    </div>

                    {user ? (
                        <Button asChild variant="default">
                            <Link href={dashboard()}>
                                <LayoutDashboard className="mr-2 size-4" />
                                Buka Dashboard
                            </Link>
                        </Button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button asChild variant="neutral">
                                <Link href={login()}>
                                    <LogIn className="mr-1.5 size-4" />
                                    Masuk
                                </Link>
                            </Button>
                            <Button asChild variant="default">
                                <Link href={register()}>
                                    <UserPlus className="mr-1.5 size-4" />
                                    Daftar
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
