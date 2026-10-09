import type { ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export default function AppLogoIcon({
    className = 'size-6 object-contain',
    alt = 'CBT Logo',
    ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/apple-touch-icon.png"
            alt={alt}
            className={cn('object-contain', className)}
            {...props}
        />
    );
}
