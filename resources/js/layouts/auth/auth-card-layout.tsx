import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { home } from '@/routes';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className="flex w-full max-w-md flex-col gap-6">
                <Link
                    href={home()}
                    className="flex items-center gap-2 self-center font-heading text-xl text-foreground hover:opacity-90 transition-opacity"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-base border-2 border-border bg-main shadow-xs">
                        <AppLogoIcon className="size-6 fill-current text-foreground" />
                    </div>
                    <span>CBT Kampus</span>
                </Link>

                <div className="flex flex-col gap-6">
                    <Card className="rounded-base border-2 border-border bg-secondary-background shadow-shadow">
                        <CardHeader className="px-8 pt-8 pb-0 text-center">
                            <CardTitle className="text-xl font-heading">{title}</CardTitle>
                            <CardDescription className="font-base">{description}</CardDescription>
                        </CardHeader>
                        <CardContent className="px-8 py-8">
                            {children}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
