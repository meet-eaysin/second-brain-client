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

export const useDatabases = (params?: DatabaseQueryParams) => {
    return useQuery({
        queryKey: DATABASE_KEYS.list(params),
        queryFn: () => databaseApi.getDatabases(params),
        staleTime: 5 * 60 * 1000,
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

export interface UpdateDatabaseParams {
    id: string;
    data: UpdateDatabaseRequest;
}

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
            console.error('❌ Create database error:', error.response?.data);

            // Handle validation errors
            if (error.response?.status === 400 && error.response?.data?.error?.errors) {
                const validationErrors = error.response.data.error.errors;
                const errorMessages = Object.entries(validationErrors).map(([field, message]) => {
                    return `${field}: ${Array.isArray(message) ? message[0] : message}`;
                });
                toast.error(`Validation failed: ${errorMessages.join(', ')}`);
            } else {
                const message = error.response?.data?.error?.message ||
                              error.response?.data?.message ||
                              'Failed to create database';
                toast.error(message);
            }
        },
    });
};

export const useUpdateDatabase = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: UpdateDatabaseParams) => databaseApi.updateDatabase(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.detail(id) });
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.lists() });
            toast.success('Database updated successfully');
        },
        onError: (error: AxiosError<ApiResponse>) => {
            console.error('❌ Update database error:', error.response?.data);

            // Handle validation errors
            if (error.response?.status === 400 && error.response?.data?.error?.errors) {
                const validationErrors = error.response.data.error.errors;
                const errorMessages = Object.entries(validationErrors).map(([field, message]) => {
                    return `${field}: ${Array.isArray(message) ? message[0] : message}`;
                });
                toast.error(`Validation failed: ${errorMessages.join(', ')}`);
            } else {
                const message = error.response?.data?.error?.message ||
                              error.response?.data?.message ||
                              'Failed to update database';
                toast.error(message);
            }
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

export const useFreezeDatabase = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ databaseId, frozen, reason }: { databaseId: string; frozen: boolean; reason?: string }) =>
            databaseApi.freezeDatabase(databaseId, frozen, reason),
        onSuccess: (_, { databaseId, frozen }) => {
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.detail(databaseId) });
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.lists() });
            toast.success(frozen ? 'Database frozen successfully' : 'Database unfrozen successfully');
        },
        onError: (error: AxiosError<ApiResponse>) => {
            const message = error.response?.data?.message || 'Failed to update database freeze status';
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
            // Invalidate database detail to update properties list
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.detail(databaseId) });

            // Invalidate database lists to update any cached database info
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.lists() });

            // Invalidate records list since table structure changed
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.recordsList(databaseId, {}) });

            toast.success('Property deleted successfully');
        },
        onError: (error: AxiosError<ApiResponse>) => {
            const message = error.response?.data?.message || 'Failed to delete property';
            toast.error(message);
        },
    });
};

export const useUpdateView = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ databaseId, viewId, data }: { databaseId: string; viewId: string; data: UpdateViewRequest }) =>
            databaseApi.updateView(databaseId, viewId, data),
        onSuccess: (_, { databaseId }) => {
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.detail(databaseId) });
            toast.success('View updated successfully');
        },
        onError: (error: AxiosError<ApiResponse<any>>) => {
            const errorMessage = error.response?.data?.error?.message || 'Failed to update view';
            toast.error(errorMessage);
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
        onError: (error: AxiosError<ApiResponse<any>>) => {
            const errorMessage = error.response?.data?.error?.message || 'Failed to delete view';
            toast.error(errorMessage);
        },
    });
};

export const useDuplicateView = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ databaseId, viewId, data }: { databaseId: string; viewId: string; data: { name: string } }) =>
            databaseApi.duplicateView(databaseId, viewId, data),
        onSuccess: (_, { databaseId }) => {
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.detail(databaseId) });
            toast.success('View duplicated successfully');
        },
        onError: (error: AxiosError<ApiResponse<any>>) => {
            const errorMessage = error.response?.data?.error?.message || 'Failed to duplicate view';
            toast.error(errorMessage);
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
            // Invalidate all records queries for this database
            queryClient.invalidateQueries({
                queryKey: DATABASE_KEYS.records(databaseId),
                exact: false
            });
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
            queryClient.invalidateQueries({
                queryKey: DATABASE_KEYS.records(databaseId),
                exact: false
            });
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
            queryClient.invalidateQueries({
                queryKey: DATABASE_KEYS.records(databaseId),
                exact: false
            });
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

// Property Management Mutations
export const useUpdatePropertyName = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ databaseId, propertyId, name }: { databaseId: string; propertyId: string; name: string }) =>
            databaseApi.updatePropertyName(databaseId, propertyId, name),
        onSuccess: (_, { databaseId }) => {
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.detail(databaseId) });
            toast.success('Property name updated successfully');
        },
        onError: (error: AxiosError<ApiResponse<any>>) => {
            const errorMessage = error.response?.data?.error?.message || 'Failed to update property name';
            toast.error(errorMessage);
        },
    });
};

export const useUpdatePropertyType = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ databaseId, propertyId, type }: { databaseId: string; propertyId: string; type: string }) =>
            databaseApi.updatePropertyType(databaseId, propertyId, type),
        onSuccess: (_, { databaseId }) => {
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.detail(databaseId) });
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.records(databaseId) });
            toast.success('Property type updated successfully');
        },
        onError: (error: AxiosError<ApiResponse<any>>) => {
            const errorMessage = error.response?.data?.error?.message || 'Failed to update property type';
            toast.error(errorMessage);
        },
    });
};

export const useDuplicateProperty = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ databaseId, propertyId }: { databaseId: string; propertyId: string }) =>
            databaseApi.duplicateProperty(databaseId, propertyId),
        onSuccess: (_, { databaseId }) => {
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.detail(databaseId) });
            toast.success('Property duplicated successfully');
        },
        onError: (error: AxiosError<ApiResponse<any>>) => {
            const errorMessage = error.response?.data?.error?.message || 'Failed to duplicate property';
            toast.error(errorMessage);
        },
    });
};

export const useFreezeProperty = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ databaseId, propertyId, frozen }: { databaseId: string; propertyId: string; frozen: boolean }) =>
            databaseApi.freezeProperty(databaseId, propertyId, frozen),
        onSuccess: (_, { databaseId, frozen }) => {
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.detail(databaseId) });
            toast.success(frozen ? 'Property frozen successfully' : 'Property unfrozen successfully');
        },
        onError: (error: AxiosError<ApiResponse<any>>) => {
            const errorMessage = error.response?.data?.error?.message || 'Failed to update property freeze state';
            toast.error(errorMessage);
        },
    });
};

export const useHideProperty = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ databaseId, propertyId, hidden }: { databaseId: string; propertyId: string; hidden: boolean }) =>
            databaseApi.hideProperty(databaseId, propertyId, hidden),
        onSuccess: (_, { databaseId, hidden }) => {
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.detail(databaseId) });
            toast.success(hidden ? 'Property hidden successfully' : 'Property shown successfully');
        },
        onError: (error: AxiosError<ApiResponse<any>>) => {
            const errorMessage = error.response?.data?.error?.message || 'Failed to update property visibility';
            toast.error(errorMessage);
        },
    });
};
