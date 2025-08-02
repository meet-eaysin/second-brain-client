import { apiClient } from '@/services/api-client.ts';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import type {
    FileItem,
    UploadFileRequest,
    BulkUploadRequest,
    FileQueryParams,
    FilesResponse,
    FileUploadResponse,
    BulkUploadResponse,
    FileDownloadResponse,
} from '@/types/files.types';
import type { ApiResponse } from '@/types/api.types';

export const filesApi = {
    // Get all files for the current user
    getFiles: async (params?: FileQueryParams): Promise<FilesResponse> => {
        const response = await apiClient.get<ApiResponse<FilesResponse>>(
            API_ENDPOINTS.FILES.LIST,
            { params }
        );
        return response.data.data;
    },

    // Upload a single file
    uploadFile: async (file: File, data?: UploadFileRequest): Promise<FileUploadResponse> => {
        const formData = new FormData();
        formData.append('file', file);
        
        if (data?.description) formData.append('description', data.description);
        if (data?.category) formData.append('category', data.category);
        if (data?.tags) formData.append('tags', JSON.stringify(data.tags));
        if (data?.isPublic !== undefined) formData.append('isPublic', String(data.isPublic));

        const response = await apiClient.post<ApiResponse<FileUploadResponse>>(
            API_ENDPOINTS.FILES.UPLOAD,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data.data;
    },

    // Upload multiple files
    bulkUploadFiles: async (files: File[], data?: BulkUploadRequest): Promise<BulkUploadResponse> => {
        const formData = new FormData();
        
        files.forEach((file) => {
            formData.append('files', file);
        });
        
        if (data?.description) formData.append('description', data.description);
        if (data?.category) formData.append('category', data.category);
        if (data?.tags) formData.append('tags', JSON.stringify(data.tags));
        if (data?.isPublic !== undefined) formData.append('isPublic', String(data.isPublic));

        const response = await apiClient.post<ApiResponse<BulkUploadResponse>>(
            API_ENDPOINTS.FILES.BULK_UPLOAD,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data.data;
    },

    // Get file by ID
    getFileById: async (id: string): Promise<FileItem> => {
        const response = await apiClient.get<ApiResponse<FileItem>>(
            API_ENDPOINTS.FILES.BY_ID(id)
        );
        return response.data.data;
    },

    // Download file
    downloadFile: async (id: string): Promise<FileDownloadResponse> => {
        const response = await apiClient.get(
            API_ENDPOINTS.FILES.DOWNLOAD(id),
            {
                responseType: 'arraybuffer',
            }
        );
        
        // Extract file info from headers
        const contentType = response.headers['content-type'] || 'application/octet-stream';
        const contentDisposition = response.headers['content-disposition'] || '';
        const filename = contentDisposition.match(/filename="(.+)"/)?.[1] || 'download';
        const contentLength = parseInt(response.headers['content-length'] || '0', 10);

        return {
            buffer: response.data,
            mimeType: contentType,
            originalName: filename,
            size: contentLength,
        };
    },

    // Delete file
    deleteFile: async (id: string): Promise<void> => {
        await apiClient.delete(API_ENDPOINTS.FILES.DELETE(id));
    },

    // Get files by category
    getFilesByCategory: async (category: string, params?: Omit<FileQueryParams, 'category'>): Promise<FilesResponse> => {
        return filesApi.getFiles({ ...params, category });
    },

    // Search files
    searchFiles: async (query: string, params?: Omit<FileQueryParams, 'search'>): Promise<FilesResponse> => {
        return filesApi.getFiles({ ...params, search: query });
    },

    // Get files by type
    getFilesByType: async (mimeType: string, params?: Omit<FileQueryParams, 'mimeType'>): Promise<FilesResponse> => {
        return filesApi.getFiles({ ...params, mimeType });
    },
};
