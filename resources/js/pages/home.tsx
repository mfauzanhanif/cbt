import { Head, usePage } from '@inertiajs/react';
import PublicDemoCredentials from '@/components/public-demo-credentials';
import PublicFeatures from '@/components/public-features';
import PublicFooter from '@/components/public-footer';
import PublicHero from '@/components/public-hero';
import PublicNavbar from '@/components/public-navbar';
import type { User } from '@/types';

export default function Home() {
    const { auth } = usePage<{ auth?: { user?: User } }>().props;
    const user = auth?.user ?? null;

    return (
        <>
            <Head title="Computer Based Test" />

            <div className="min-h-screen bg-background text-foreground">
                <PublicNavbar user={user} />
                <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-16">
                    <PublicHero user={user} />
                    <PublicFeatures />
                    <PublicDemoCredentials />
                </main>
                <PublicFooter />
            </div>
        </>
    );
}
