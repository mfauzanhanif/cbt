import * as React from 'react';
import { cn } from '@/lib/utils';

export interface MediaPlaceholderSvgProps extends React.SVGProps<SVGSVGElement> {
    width?: number | string;
    height?: number | string;
    tinyImageBase64?: string;
    blur?: boolean;
}

export function MediaPlaceholderSvg({
    width = 100,
    height = 100,
    tinyImageBase64,
    blur = true,
    className,
    ...props
}: MediaPlaceholderSvgProps): React.JSX.Element {
    const numWidth =
        typeof width === 'string' ? parseInt(width, 10) || 100 : width;
    const numHeight =
        typeof height === 'string' ? parseInt(height, 10) || 100 : height;

    return (
        <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox={`0 0 ${numWidth} ${numHeight}`}
            preserveAspectRatio="none"
            className={cn(
                'h-full w-full object-cover',
                blur && 'scale-105 blur-sm filter',
                className,
            )}
            aria-hidden="true"
            {...props}
        >
            {tinyImageBase64 && (
                <image
                    width={numWidth}
                    height={numHeight}
                    href={tinyImageBase64}
                    xlinkHref={tinyImageBase64}
                />
            )}
        </svg>
    );
}
