export interface ResponsiveImageItem {
    urls?: string[];
    base64svg?: string;
}

export interface MediaItem {
    id?: number | string;
    name?: string;
    file_name?: string;
    mime_type?: string;
    size?: number;
    url?: string;
    original_url?: string;
    preview_url?: string;
    srcset?: string;
    placeholder?: string;
    width?: number;
    height?: number;
    conversions?: Record<string, string>;
    responsive_images?: Record<string, ResponsiveImageItem>;
    custom_properties?: Record<string, unknown>;
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown;
}
