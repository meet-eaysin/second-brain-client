import { useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyApi } from '../services/propertyApi';
import { DATABASE_KEYS } from '../services/queryKeys';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { ApiResponse } from '@/types/api.types';
import { CreatePropertyRequest, UpdatePropertyRequest } from '@/types/document.types.ts';

interface CreatePropertyParams {
    databaseId: string;
    data: CreatePropertyRequest;
}

interface UpdatePropertyParams {
    databaseId: string;
    propertyId: string;
    data: UpdatePropertyRequest;
}

interface DeletePropertyParams {
    databaseId: string;
    propertyId: string;
}

interface ReorderPropertiesParams {
    databaseId: string;
    propertyIds: string[];
}

export const useCreateProperty = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ databaseId, data }: CreatePropertyParams) => {
            return propertyApi.createProperty(databaseId, data);
        },
        onSuccess: (_, { databaseId }) => {
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.detail(databaseId) });
            toast.success('Property created successfully');
        },
        onError: (error: AxiosError<ApiResponse>) => {
            const message = error.response?.data?.message || 'Failed to create property';
            toast.error(message);
        },
    });
};

export const useUpdateProperty = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ databaseId, propertyId, data }: UpdatePropertyParams) => {
            return propertyApi.updateProperty(databaseId, propertyId, data);
        },
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
        mutationFn: ({ databaseId, propertyId }: DeletePropertyParams) => {
            return propertyApi.deleteProperty(databaseId, propertyId);
        },
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

export const useReorderProperties = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ databaseId, propertyIds }: ReorderPropertiesParams) => {
            return propertyApi.reorderProperties(databaseId, propertyIds);
        },
        onSuccess: (_, { databaseId }) => {
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.detail(databaseId) });
        },
        onError: (error: AxiosError<ApiResponse>) => {
            const message = error.response?.data?.message || 'Failed to reorder properties';
            toast.error(message);
        },
    });
};
