import * as React from 'react';
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
import { formatBytes, getFileIcon } from './media-attachment';
import { UploadCloud, X } from 'lucide-react';

export interface PendingFile {
    id: string;
    file: File;
    previewUrl?: string;
    progress?: number;
    error?: string;
}

export interface MediaUploaderProps {
    value?: File[];
    onChange?: (files: File[]) => void;
    accept?: string;
    multiple?: boolean;
    maxSizeInMb?: number;
    disabled?: boolean;
    className?: string;
    dropzoneText?: string;
    dropzoneSubtext?: string;
}

export function MediaUploader({
    value = [],
    onChange,
    accept,
    multiple = false,
    maxSizeInMb = 10,
    disabled = false,
    className,
    dropzoneText = 'Tarik & lepas file di sini, atau klik untuk memilih',
    dropzoneSubtext,
}: MediaUploaderProps): React.JSX.Element {
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const [dragActive, setDragActive] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    const handleFiles = (newFiles: FileList | null) => {
        if (!newFiles || newFiles.length === 0 || disabled) return;
        setErrorMessage(null);

        const validFiles: File[] = [];
        const maxBytes = maxSizeInMb * 1024 * 1024;

        for (let i = 0; i < newFiles.length; i++) {
            const f = newFiles[i];
            if (f.size > maxBytes) {
                setErrorMessage(
                    `Ukuran file "${f.name}" melebihi batas maksimal ${maxSizeInMb}MB.`,
                );
                continue;
            }
            validFiles.push(f);
            if (!multiple) break;
        }

        if (validFiles.length > 0) {
            const updated = multiple ? [...value, ...validFiles] : validFiles;
            onChange?.(updated);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer?.files) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) {
            setDragActive(true);
        }
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    const handleRemove = (index: number) => {
        const updated = value.filter((_, i) => i !== index);
        onChange?.(updated);
    };

    return (
        <div className={cn('space-y-3', className)}>
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !disabled && inputRef.current?.click()}
                className={cn(
                    'relative flex flex-col items-center justify-center rounded-md border-[2.5px] border-dashed border-border bg-card p-6 text-center shadow-[2px_2px_0px_var(--color-border,#1c293c)] transition-all',
                    'cursor-pointer hover:bg-muted/40 hover:shadow-[3px_3px_0px_var(--color-border,#1c293c)]',
                    dragActive &&
                        'border-primary bg-primary/10 shadow-[4px_4px_0px_var(--color-primary,#fdc800)]',
                    disabled && 'pointer-events-none opacity-60',
                )}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    disabled={disabled}
                    onChange={(e) => handleFiles(e.target.files)}
                    className="hidden"
                />

                <div className="mb-3 flex size-12 items-center justify-center rounded-md border-2 border-border bg-primary text-primary-foreground shadow-[2px_2px_0px_var(--color-border,#1c293c)]">
                    <UploadCloud className="size-5" />
                </div>

                <p className="text-sm font-bold text-foreground">
                    {dropzoneText}
                </p>
                <p className="mt-1 text-xs font-medium text-muted-foreground">
                    {dropzoneSubtext ||
                        `Maksimal ${maxSizeInMb} MB ${accept ? `(${accept})` : ''}`}
                </p>
            </div>

            {errorMessage && (
                <p className="text-xs font-bold text-destructive">
                    {errorMessage}
                </p>
            )}

            {value.length > 0 && (
                <AttachmentGroup className="gap-2">
                    {value.map((file, idx) => {
                        const isImage = file.type.startsWith('image/');
                        const Icon = getFileIcon(file.type, file.name);

                        return (
                            <Attachment
                                key={`${file.name}-${idx}`}
                                state="done"
                                size="default"
                            >
                                <AttachmentMedia
                                    variant={isImage ? 'image' : 'icon'}
                                >
                                    {isImage ? (
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={file.name}
                                            className="h-full w-full object-cover"
                                            onLoad={(e) =>
                                                URL.revokeObjectURL(
                                                    e.currentTarget.src,
                                                )
                                            }
                                        />
                                    ) : (
                                        <Icon className="size-4" />
                                    )}
                                </AttachmentMedia>

                                <AttachmentContent>
                                    <AttachmentTitle title={file.name}>
                                        {file.name}
                                    </AttachmentTitle>
                                    <AttachmentDescription>
                                        {formatBytes(file.size)}
                                    </AttachmentDescription>
                                </AttachmentContent>

                                <AttachmentActions>
                                    <AttachmentAction
                                        title="Hapus"
                                        aria-label="Hapus"
                                        variant="ghost"
                                        className="text-destructive hover:bg-destructive/10"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemove(idx);
                                        }}
                                    >
                                        <X className="size-3.5" />
                                    </AttachmentAction>
                                </AttachmentActions>
                            </Attachment>
                        );
                    })}
                </AttachmentGroup>
            )}
        </div>
    );
}
