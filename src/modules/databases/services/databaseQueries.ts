import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { databaseApi } from './databaseApi';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api.types';
import type {
    DatabaseQueryParams,
    RecordQueryParams,
    CreateDatabaseRequest,
    UpdateDatabaseRequest,
    CreatePropertyRequest,
    UpdatePropertyRequest,
    CreateViewRequest,
    UpdateViewRequest,
    CreateRecordRequest,
    UpdateRecordRequest,
    ShareDatabaseRequest,
} from '@/types/database.types';

export const DATABASE_KEYS = {
    all: ['databases'] as const,
    lists: () => [...DATABASE_KEYS.all, 'list'] as const,
    list: (params?: DatabaseQueryParams) => [...DATABASE_KEYS.lists(), params] as const,
    details: () => [...DATABASE_KEYS.all, 'detail'] as const,
    detail: (id: string) => [...DATABASE_KEYS.details(), id] as const,
    records: (databaseId: string) => [...DATABASE_KEYS.all, 'records', databaseId] as const,
    recordsList: (databaseId: string, params?: RecordQueryParams) => 
        [...DATABASE_KEYS.records(databaseId), 'list', params] as const,
    record: (databaseId: string, recordId: string) => 
        [...DATABASE_KEYS.records(databaseId), 'detail', recordId] as const,
};

// Database Queries
export const useDatabases = (params?: DatabaseQueryParams) => {
    return useQuery({
        queryKey: DATABASE_KEYS.list(params),
        queryFn: () => databaseApi.getDatabases(params),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useDatabase = (id: string) => {
    return useQuery({
        queryKey: DATABASE_KEYS.detail(id),
        queryFn: () => databaseApi.getDatabaseById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
};

// Database Mutations
export const useCreateDatabase = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateDatabaseRequest) => databaseApi.createDatabase(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.lists() });
            toast.success('Database created successfully');
        },
        onError: (error: AxiosError<ApiResponse>) => {
            const message = error.response?.data?.message || 'Failed to create database';
            toast.error(message);
        },
    });
};

export const useUpdateDatabase = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateDatabaseRequest }) =>
            databaseApi.updateDatabase(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.detail(id) });
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.lists() });
            toast.success('Database updated successfully');
        },
        onError: (error: AxiosError<ApiResponse>) => {
            const message = error.response?.data?.message || 'Failed to update database';
            toast.error(message);
        },
    });
};

export const useDeleteDatabase = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => databaseApi.deleteDatabase(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.lists() });
            toast.success('Database deleted successfully');
        },
        onError: (error: AxiosError<ApiResponse>) => {
            const message = error.response?.data?.message || 'Failed to delete database';
            toast.error(message);
        },
    });
};

// Property Mutations
export const useAddProperty = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ databaseId, data }: { databaseId: string; data: CreatePropertyRequest }) =>
            databaseApi.addProperty(databaseId, data),
        onSuccess: (_, { databaseId }) => {
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.detail(databaseId) });
            toast.success('Property added successfully');
        },
        onError: (error: AxiosError<ApiResponse>) => {
            const message = error.response?.data?.message || 'Failed to add property';
            toast.error(message);
        },
    });
};

export const useUpdateProperty = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ 
            databaseId, 
            propertyId, 
            data 
        }: { 
            databaseId: string; 
            propertyId: string; 
            data: UpdatePropertyRequest 
        }) => databaseApi.updateProperty(databaseId, propertyId, data),
        onSuccess: (_, { databaseId }) => {
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.detail(databaseId) });
            toast.success('Property updated successfully');
        },
        onError: (error: AxiosError<ApiResponse>) => {
            const message = error.response?.data?.message || 'Failed to update property';
            toast.error(message);
        },
    });
};

export const useDeleteProperty = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ databaseId, propertyId }: { databaseId: string; propertyId: string }) =>
            databaseApi.deleteProperty(databaseId, propertyId),
        onSuccess: (_, { databaseId }) => {
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.detail(databaseId) });
            toast.success('Property deleted successfully');
        },
        onError: (error: AxiosError<ApiResponse>) => {
            const message = error.response?.data?.message || 'Failed to delete property';
            toast.error(message);
        },
    });
};

// View Mutations
export const useAddView = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ databaseId, data }: { databaseId: string; data: CreateViewRequest }) =>
            databaseApi.addView(databaseId, data),
        onSuccess: (_, { databaseId }) => {
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.detail(databaseId) });
            toast.success('View added successfully');
        },
        onError: (error: AxiosError<ApiResponse>) => {
            const message = error.response?.data?.message || 'Failed to add view';
            toast.error(message);
        },
    });
};

export const useUpdateView = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ 
            databaseId, 
            viewId, 
            data 
        }: { 
            databaseId: string; 
            viewId: string; 
            data: UpdateViewRequest 
        }) => databaseApi.updateView(databaseId, viewId, data),
        onSuccess: (_, { databaseId }) => {
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.detail(databaseId) });
            toast.success('View updated successfully');
        },
        onError: (error: AxiosError<ApiResponse>) => {
            const message = error.response?.data?.message || 'Failed to update view';
            toast.error(message);
        },
    });
};

export const useDeleteView = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ databaseId, viewId }: { databaseId: string; viewId: string }) =>
            databaseApi.deleteView(databaseId, viewId),
        onSuccess: (_, { databaseId }) => {
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.detail(databaseId) });
            toast.success('View deleted successfully');
        },
        onError: (error: AxiosError<ApiResponse>) => {
            const message = error.response?.data?.message || 'Failed to delete view';
            toast.error(message);
        },
    });
};

// Record Queries and Mutations
export const useRecords = (databaseId: string, params?: RecordQueryParams) => {
    return useQuery({
        queryKey: DATABASE_KEYS.recordsList(databaseId, params),
        queryFn: () => databaseApi.getRecords(databaseId, params),
        enabled: !!databaseId,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

export const useRecord = (databaseId: string, recordId: string) => {
    return useQuery({
        queryKey: DATABASE_KEYS.record(databaseId, recordId),
        queryFn: () => databaseApi.getRecordById(databaseId, recordId),
        enabled: !!databaseId && !!recordId,
        staleTime: 2 * 60 * 1000,
    });
};

export const useCreateRecord = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ databaseId, data }: { databaseId: string; data: CreateRecordRequest }) =>
            databaseApi.createRecord(databaseId, data),
        onSuccess: (_, { databaseId }) => {
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.records(databaseId) });
            toast.success('Record created successfully');
        },
        onError: (error: AxiosError<ApiResponse>) => {
            const message = error.response?.data?.message || 'Failed to create record';
            toast.error(message);
        },
    });
};

export const useUpdateRecord = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ 
            databaseId, 
            recordId, 
            data 
        }: { 
            databaseId: string; 
            recordId: string; 
            data: UpdateRecordRequest 
        }) => databaseApi.updateRecord(databaseId, recordId, data),
        onSuccess: (_, { databaseId, recordId }) => {
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.record(databaseId, recordId) });
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.records(databaseId) });
            toast.success('Record updated successfully');
        },
        onError: (error: AxiosError<ApiResponse>) => {
            const message = error.response?.data?.message || 'Failed to update record';
            toast.error(message);
        },
    });
};

export const useDeleteRecord = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ databaseId, recordId }: { databaseId: string; recordId: string }) =>
            databaseApi.deleteRecord(databaseId, recordId),
        onSuccess: (_, { databaseId }) => {
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.records(databaseId) });
            toast.success('Record deleted successfully');
        },
        onError: (error: AxiosError<ApiResponse>) => {
            const message = error.response?.data?.message || 'Failed to delete record';
            toast.error(message);
        },
    });
};

// Permission Mutations
export const useShareDatabase = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ databaseId, data }: { databaseId: string; data: ShareDatabaseRequest }) =>
            databaseApi.shareDatabase(databaseId, data),
        onSuccess: (_, { databaseId }) => {
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.detail(databaseId) });
            toast.success('Database shared successfully');
        },
        onError: (error: AxiosError<ApiResponse>) => {
            const message = error.response?.data?.message || 'Failed to share database';
            toast.error(message);
        },
    });
};

export const useRemoveDatabaseAccess = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ databaseId, userId }: { databaseId: string; userId: string }) =>
            databaseApi.removeDatabaseAccess(databaseId, userId),
        onSuccess: (_, { databaseId }) => {
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.detail(databaseId) });
            toast.success('Access removed successfully');
        },
        onError: (error: AxiosError<ApiResponse>) => {
            const message = error.response?.data?.message || 'Failed to remove access';
            toast.error(message);
        },
    });
};
