export interface FileItem {
    id: string;
    userId: string;
    originalName: string;
    fileName: string;
    mimeType: string;
    size: number;
    url: string;
    description?: string;
    category?: string;
    tags?: string[];
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface UploadFileRequest {
    description?: string;
    category?: string;
    tags?: string[];
    isPublic?: boolean;
}

export interface BulkUploadRequest {
    description?: string;
    category?: string;
    tags?: string[];
    isPublic?: boolean;
}

export interface FileQueryParams {
    category?: string;
    search?: string;
    mimeType?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

export interface FilesResponse {
    files: FileItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface FileUploadResponse {
    file: FileItem;
}

export interface BulkUploadResponse {
    files: FileItem[];
    failed: Array<{
        filename: string;
        error: string;
    }>;
}

export interface FileDownloadResponse {
    buffer: ArrayBuffer;
    mimeType: string;
    originalName: string;
    size: number;
}
