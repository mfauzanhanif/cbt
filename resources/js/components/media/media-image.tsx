import * as React from 'react';
import type { MediaItem } from '@/types/media';
import { cn } from '@/lib/utils';
import { ImageOff } from 'lucide-react';

export interface MediaImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    media?: MediaItem | string | null;
    conversion?: string;
    fallback?: React.ReactNode;
}

export function resolveMediaUrl(
    media?: MediaItem | string | null,
    conversion?: string,
): string {
    if (!media) {
        return '';
    }

    if (typeof media === 'string') {
        return media;
    }

    if (conversion && media.conversions?.[conversion]) {
        return media.conversions[conversion];
    }

    return media.url || media.original_url || media.preview_url || '';
}

export const MediaImage = React.forwardRef<HTMLImageElement, MediaImageProps>(
    function MediaImage(
        {
            media,
            conversion,
            alt,
            fallback,
            className,
            loading = 'lazy',
            onError,
            ...props
        },
        ref,
    ): React.JSX.Element {
        const [hasError, setHasError] = React.useState<boolean>(false);
        const src = resolveMediaUrl(media, conversion);

        const altText =
            alt ??
            (typeof media === 'object' && media !== null
                ? media.name || media.file_name
                : '');

        const handleError = (
            e: React.SyntheticEvent<HTMLImageElement, Event>,
        ) => {
            setHasError(true);
            onError?.(e);
        };

        if (!src || hasError) {
            if (fallback) {
                return <>{fallback}</>;
            }

            return (
                <div
                    className={cn(
                        'flex items-center justify-center rounded-md bg-muted text-muted-foreground',
                        className,
                    )}
                    role="img"
                    aria-label={altText || 'Gambar tidak tersedia'}
                >
                    <ImageOff className="size-6 opacity-40" />
                </div>
            );
        }

        return (
            <img
                ref={ref}
                src={src}
                alt={altText}
                loading={loading}
                onError={handleError}
                className={cn('h-auto max-w-full object-cover', className)}
                {...props}
            />
        );
    },
);

MediaImage.displayName = 'MediaImage';
