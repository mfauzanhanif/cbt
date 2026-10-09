import * as React from 'react';
import type { MediaItem } from '@/types/media';
import { cn } from '@/lib/utils';
import { MediaPlaceholderSvg } from './media-placeholder-svg';
import { resolveMediaUrl } from './media-image';
import { ImageOff } from 'lucide-react';

export interface MediaResponsiveImageProps extends Omit<
    React.ImgHTMLAttributes<HTMLImageElement>,
    'src' | 'srcSet'
> {
    media?: MediaItem | null;
    conversion?: string;
    src?: string;
    srcSet?: string;
    placeholder?: string;
    width?: number;
    height?: number;
    autoSizes?: boolean;
    fallback?: React.ReactNode;
}

export const MediaResponsiveImage = React.forwardRef<
    HTMLImageElement,
    MediaResponsiveImageProps
>(function MediaResponsiveImage(
    {
        media,
        conversion,
        src: customSrc,
        srcSet: customSrcSet,
        placeholder: customPlaceholder,
        width: customWidth,
        height: customHeight,
        autoSizes = true,
        alt,
        loading = 'lazy',
        fallback,
        className,
        onLoad,
        onError,
        sizes: customSizes,
        ...props
    },
    ref,
): React.JSX.Element {
    const [isLoaded, setIsLoaded] = React.useState<boolean>(false);
    const [hasError, setHasError] = React.useState<boolean>(false);
    const [computedSizes, setComputedSizes] = React.useState<string>(
        customSizes || '1px',
    );
    const imgRef = React.useRef<HTMLImageElement | null>(null);

    // Resolve main image src
    const src = customSrc || resolveMediaUrl(media, conversion);

    // Resolve srcset from props or media model
    const resolvedSrcSet =
        customSrcSet ||
        media?.srcset ||
        (conversion &&
            media?.responsive_images?.[conversion]?.urls?.join(', ')) ||
        undefined;

    // Resolve placeholder (tiny SVG base64)
    const placeholder =
        customPlaceholder ||
        media?.placeholder ||
        (conversion
            ? media?.responsive_images?.[conversion]?.base64svg
            : undefined);

    // Width & Height
    const width = customWidth || media?.width;
    const height = customHeight || media?.height;

    const altText = alt ?? (media ? media.name || media.file_name : '');

    // Dynamic size calculation matching Spatie's Blade behavior
    const updateSizes = React.useCallback(() => {
        if (!autoSizes || customSizes || !imgRef.current) {
            return;
        }

        const clientWidth = imgRef.current.getBoundingClientRect().width;
        if (
            clientWidth > 0 &&
            typeof window !== 'undefined' &&
            window.innerWidth > 0
        ) {
            const vw = Math.ceil((clientWidth / window.innerWidth) * 100);
            setComputedSizes(`${vw}vw`);
        }
    }, [autoSizes, customSizes]);

    React.useEffect(() => {
        updateSizes();
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', updateSizes);
            return () => window.removeEventListener('resize', updateSizes);
        }
    }, [updateSizes]);

    const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        updateSizes();
        setIsLoaded(true);
        onLoad?.(e);
    };

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
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
                    'flex items-center justify-center overflow-hidden rounded-md bg-muted text-muted-foreground',
                    className,
                )}
                style={{
                    width: width ? `${width}px` : undefined,
                    aspectRatio:
                        width && height ? `${width} / ${height}` : undefined,
                }}
                role="img"
                aria-label={altText || 'Gambar tidak tersedia'}
            >
                <ImageOff className="size-6 opacity-40" />
            </div>
        );
    }

    return (
        <div
            className={cn('relative overflow-hidden', className)}
            style={{
                aspectRatio:
                    width && height ? `${width} / ${height}` : undefined,
            }}
        >
            {/* Blurred Tiny Placeholder SVG if available */}
            {placeholder && !isLoaded && (
                <div className="absolute inset-0 z-0 h-full w-full overflow-hidden">
                    <MediaPlaceholderSvg
                        width={width}
                        height={height}
                        tinyImageBase64={placeholder}
                        className="h-full w-full"
                    />
                </div>
            )}

            {/* Main responsive image */}
            <img
                ref={(node) => {
                    imgRef.current = node;
                    if (typeof ref === 'function') {
                        ref(node);
                    } else if (ref) {
                        (
                            ref as React.MutableRefObject<HTMLImageElement | null>
                        ).current = node;
                    }
                }}
                src={src}
                srcSet={resolvedSrcSet}
                sizes={customSizes || computedSizes}
                width={width}
                height={height}
                alt={altText}
                loading={loading}
                onLoad={handleLoad}
                onError={handleError}
                className={cn(
                    'relative z-10 h-auto max-w-full object-cover transition-opacity duration-300',
                    placeholder && !isLoaded ? 'opacity-0' : 'opacity-100',
                    className,
                )}
                {...props}
            />
        </div>
    );
});

MediaResponsiveImage.displayName = 'MediaResponsiveImage';
