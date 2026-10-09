import type { LucideIcon } from 'lucide-react';
import { Monitor, Moon, Sun } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import type { Appearance } from '@/hooks/use-appearance';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

export default function AppearanceToggleTab({
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();

    const tabs: { value: Appearance; icon: LucideIcon; label: string }[] = [
        { value: 'light', icon: Sun, label: 'Terang' },
        { value: 'dark', icon: Moon, label: 'Gelap' },
        { value: 'system', icon: Monitor, label: 'Sistem' },
    ];

    return (
        <div
            className={cn(
                'inline-flex gap-2 rounded-base border-2 border-border bg-secondary-background p-1.5 shadow-shadow',
                className,
            )}
            {...props}
        >
            {tabs.map(({ value, icon: Icon, label }) => (
                <button
                    key={value}
                    type="button"
                    onClick={() => updateAppearance(value)}
                    className={cn(
                        'flex items-center rounded-base border-2 px-3.5 py-1.5 text-sm transition-all',
                        appearance === value
                            ? 'border-border bg-main text-main-foreground shadow-shadow font-heading'
                            : 'border-transparent text-foreground hover:border-border hover:bg-background',
                    )}
                >
                    <Icon className="-ml-0.5 mr-1.5 h-4 w-4" />
                    <span>{label}</span>
                </button>
            ))}
        </div>
    );
}
