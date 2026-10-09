import * as React from 'react';
import type { MediaItem } from '@/types/media';
import { cn } from '@/lib/utils';
import {
    Attachment,
    AttachmentMedia,
    AttachmentContent,
    AttachmentTitle,
    AttachmentDescription,
    AttachmentActions,
    AttachmentAction,
    AttachmentGroup,
} from '@/components/ui/attachment';
import { MediaImage } from './media-image';
import {
    FileText,
    FileSpreadsheet,
    FileArchive,
    FileAudio,
    FileVideo,
    FileCode,
    File,
    Download,
    Trash2,
    Eye,
} from 'lucide-react';

export function formatBytes(bytes?: number, decimals = 1): string {
    if (!bytes || bytes <= 0) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function getFileIcon(
    mimeType?: string,
    fileName?: string,
): React.ComponentType<{ className?: string }> {
    const ext = fileName?.split('.').pop()?.toLowerCase();

    if (mimeType?.includes('pdf') || ext === 'pdf') {
        return FileText;
    }
    if (
        mimeType?.includes('spreadsheet') ||
        mimeType?.includes('excel') ||
        mimeType?.includes('csv') ||
        ext === 'xls' ||
        ext === 'xlsx' ||
        ext === 'csv'
    ) {
        return FileSpreadsheet;
    }
    if (
        mimeType?.includes('zip') ||
        mimeType?.includes('rar') ||
        mimeType?.includes('tar') ||
        ext === 'zip' ||
        ext === 'rar' ||
        ext === '7z'
    ) {
        return FileArchive;
    }
    if (
        mimeType?.startsWith('audio/') ||
        ext === 'mp3' ||
        ext === 'wav' ||
        ext === 'ogg'
    ) {
        return FileAudio;
    }
    if (
        mimeType?.startsWith('video/') ||
        ext === 'mp4' ||
        ext === 'webm' ||
        ext === 'mov'
    ) {
        return FileVideo;
    }
    if (
        mimeType?.includes('javascript') ||
        mimeType?.includes('typescript') ||
        mimeType?.includes('json') ||
        ext === 'js' ||
        ext === 'ts' ||
        ext === 'tsx' ||
        ext === 'php'
    ) {
        return FileCode;
    }

    return File;
}

export interface MediaAttachmentProps extends React.HTMLAttributes<HTMLDivElement> {
    media: MediaItem;
    state?: 'idle' | 'uploading' | 'processing' | 'error' | 'done';
    size?: 'default' | 'sm' | 'xs';
    orientation?: 'horizontal' | 'vertical';
    conversion?: string;
    showDownload?: boolean;
    showPreview?: boolean;
    showDelete?: boolean;
    onDownload?: (media: MediaItem) => void;
    onPreview?: (media: MediaItem) => void;
    onDelete?: (media: MediaItem) => void;
}

export function MediaAttachment({
    media,
    state = 'done',
    size = 'default',
    orientation = 'horizontal',
    conversion,
    showDownload = true,
    showPreview = true,
    showDelete = false,
    onDownload,
    onPreview,
    onDelete,
    className,
    ...props
}: MediaAttachmentProps): React.JSX.Element {
    const isImage =
        Boolean(media.mime_type?.startsWith('image/')) ||
        Boolean(media.file_name?.match(/\.(jpeg|jpg|png|webp|gif|svg|avif)$/i));

    const Icon = getFileIcon(media.mime_type, media.file_name);
    const mediaUrl = media.url || media.original_url || media.preview_url;

    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDownload) {
            onDownload(media);
        } else if (mediaUrl) {
            const anchor = document.createElement('a');
            anchor.href = mediaUrl;
            anchor.download = media.file_name || media.name;
            anchor.target = '_blank';
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
        }
    };

    const handlePreview = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onPreview) {
            onPreview(media);
        } else if (mediaUrl) {
            window.open(mediaUrl, '_blank', 'noopener,noreferrer');
        }
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete?.(media);
    };

    return (
        <Attachment
            state={state}
            size={size}
            orientation={orientation}
            className={cn('group/media-attachment', className)}
            {...props}
        >
            <AttachmentMedia variant={isImage ? 'image' : 'icon'}>
                {isImage ? (
                    <MediaImage
                        media={media}
                        conversion={conversion}
                        alt={media.name || media.file_name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <Icon className="size-4" />
                )}
            </AttachmentMedia>

            <AttachmentContent>
                <AttachmentTitle title={media.name || media.file_name}>
                    {media.name || media.file_name}
                </AttachmentTitle>
                <AttachmentDescription>
                    {media.size
                        ? formatBytes(media.size)
                        : media.mime_type || 'File'}
                </AttachmentDescription>
            </AttachmentContent>

            <AttachmentActions>
                {showPreview && mediaUrl && (
                    <AttachmentAction
                        title="Lihat file"
                        aria-label="Lihat file"
                        onClick={handlePreview}
                    >
                        <Eye className="size-3.5" />
                    </AttachmentAction>
                )}

                {showDownload && mediaUrl && (
                    <AttachmentAction
                        title="Unduh file"
                        aria-label="Unduh file"
                        onClick={handleDownload}
                    >
                        <Download className="size-3.5" />
                    </AttachmentAction>
                )}

                {showDelete && onDelete && (
                    <AttachmentAction
                        title="Hapus file"
                        aria-label="Hapus file"
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={handleDelete}
                    >
                        <Trash2 className="size-3.5" />
                    </AttachmentAction>
                )}
            </AttachmentActions>
        </Attachment>
    );
}

export interface MediaAttachmentGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    items: MediaItem[];
    size?: 'default' | 'sm' | 'xs';
    orientation?: 'horizontal' | 'vertical';
    conversion?: string;
    showDownload?: boolean;
    showPreview?: boolean;
    showDelete?: boolean;
    onDownload?: (media: MediaItem) => void;
    onPreview?: (media: MediaItem) => void;
    onDelete?: (media: MediaItem) => void;
}

export function MediaAttachmentGroup({
    items,
    size = 'default',
    orientation = 'horizontal',
    conversion,
    showDownload,
    showPreview,
    showDelete,
    onDownload,
    onPreview,
    onDelete,
    className,
    ...props
}: MediaAttachmentGroupProps): React.JSX.Element {
    if (!items || items.length === 0) {
        return <></>;
    }

    return (
        <AttachmentGroup className={cn('gap-2', className)} {...props}>
            {items.map((item) => (
                <MediaAttachment
                    key={item.id}
                    media={item}
                    size={size}
                    orientation={orientation}
                    conversion={conversion}
                    showDownload={showDownload}
                    showPreview={showPreview}
                    showDelete={showDelete}
                    onDownload={onDownload}
                    onPreview={onPreview}
                    onDelete={onDelete}
                />
            ))}
        </AttachmentGroup>
    );
}
