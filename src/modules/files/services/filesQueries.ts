import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { filesApi } from './filesApi';
import type {
    FileItem,
    UploadFileRequest,
    BulkUploadRequest,
    FileQueryParams,
} from '@/types/files.types';
import { toast } from 'sonner';

export const FILE_KEYS = {
    all: ['files'] as const,
    lists: () => [...FILE_KEYS.all, 'list'] as const,
    list: (params?: FileQueryParams) => [...FILE_KEYS.lists(), params] as const,
    details: () => [...FILE_KEYS.all, 'detail'] as const,
    detail: (id: string) => [...FILE_KEYS.details(), id] as const,
    byCategory: (category: string) => [...FILE_KEYS.all, 'category', category] as const,
    byType: (mimeType: string) => [...FILE_KEYS.all, 'type', mimeType] as const,
    search: (query: string) => [...FILE_KEYS.all, 'search', query] as const,
};

// Query hooks
export const useGetFiles = (params?: FileQueryParams) => {
    return useQuery({
        queryKey: FILE_KEYS.list(params),
        queryFn: () => filesApi.getFiles(params),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useGetFileById = (id: string) => {
    return useQuery({
        queryKey: FILE_KEYS.detail(id),
        queryFn: () => filesApi.getFileById(id),
        enabled: !!id,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
};

export const useGetFilesByCategory = (category: string, params?: Omit<FileQueryParams, 'category'>) => {
    return useQuery({
        queryKey: FILE_KEYS.byCategory(category),
        queryFn: () => filesApi.getFilesByCategory(category, params),
        enabled: !!category,
        staleTime: 5 * 60 * 1000,
    });
};

export const useGetFilesByType = (mimeType: string, params?: Omit<FileQueryParams, 'mimeType'>) => {
    return useQuery({
        queryKey: FILE_KEYS.byType(mimeType),
        queryFn: () => filesApi.getFilesByType(mimeType, params),
        enabled: !!mimeType,
        staleTime: 5 * 60 * 1000,
    });
};

export const useSearchFiles = (query: string, params?: Omit<FileQueryParams, 'search'>) => {
    return useQuery({
        queryKey: FILE_KEYS.search(query),
        queryFn: () => filesApi.searchFiles(query, params),
        enabled: query.length > 0,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

// Mutation hooks
export const useUploadFile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ file, data }: { file: File; data?: UploadFileRequest }) =>
            filesApi.uploadFile(file, data),
        onSuccess: (response) => {
            // Invalidate and refetch files list
            queryClient.invalidateQueries({ queryKey: FILE_KEYS.lists() });
            
            if (response.file.category) {
                queryClient.invalidateQueries({ 
                    queryKey: FILE_KEYS.byCategory(response.file.category) 
                });
            }
            
            toast.success('File uploaded successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to upload file');
        },
    });
};

export const useBulkUploadFiles = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ files, data }: { files: File[]; data?: BulkUploadRequest }) =>
            filesApi.bulkUploadFiles(files, data),
        onSuccess: (response) => {
            // Invalidate and refetch files list
            queryClient.invalidateQueries({ queryKey: FILE_KEYS.lists() });
            
            if (response.files.length > 0 && response.files[0].category) {
                queryClient.invalidateQueries({ 
                    queryKey: FILE_KEYS.byCategory(response.files[0].category) 
                });
            }
            
            const successCount = response.files.length;
            const failedCount = response.failed.length;
            
            if (failedCount === 0) {
                toast.success(`${successCount} files uploaded successfully`);
            } else {
                toast.warning(`${successCount} files uploaded, ${failedCount} failed`);
            }
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to upload files');
        },
    });
};

export const useDownloadFile = () => {
    return useMutation({
        mutationFn: (id: string) => filesApi.downloadFile(id),
        onSuccess: (response, id) => {
            // Create download link
            const blob = new Blob([response.buffer], { type: response.mimeType });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = response.originalName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success('File downloaded successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to download file');
        },
    });
};

export const useDeleteFile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => filesApi.deleteFile(id),
        onSuccess: (_, id) => {
            // Remove the file from cache
            queryClient.removeQueries({ queryKey: FILE_KEYS.detail(id) });
            
            // Invalidate lists to reflect changes
            queryClient.invalidateQueries({ queryKey: FILE_KEYS.lists() });
            
            toast.success('File deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to delete file');
        },
    });
};
