import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className="w-full max-w-md">
                <div className="rounded-base border-2 border-border bg-secondary-background p-8 shadow-shadow">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col items-center gap-3 text-center">
                            <Link
                                href={home()}
                                className="flex items-center gap-2 font-heading text-xl text-foreground hover:opacity-90 transition-opacity"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-base border-2 border-border bg-main shadow-xs">
                                    <AppLogoIcon className="size-6 fill-current text-foreground" />
                                </div>
                                <span>Computer Based Test</span>
                            </Link>

                            <br />
                            <div className="space-y-1">
                                <h2 className="text-xl font-heading text-foreground">{title}</h2>
                                {description && (
                                    <p className="text-center text-sm font-base text-foreground/70">
                                        {description}
                                    </p>
                                )}
                            </div>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
