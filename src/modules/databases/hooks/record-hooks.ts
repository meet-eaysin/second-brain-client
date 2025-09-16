import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { recordApi } from '../services/recordApi';
import { DATABASE_KEYS } from '../services/queryKeys';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { ApiResponse } from '@/types/api.types';
import { CreateRecordRequest, UpdateRecordRequest } from '@/types/document.types.ts';

interface CreateRecordParams {
    databaseId: string;
    data: CreateRecordRequest;
}

interface UpdateRecordParams {
    databaseId: string;
    recordId: string;
    data: UpdateRecordRequest;
}

interface DeleteRecordParams {
    databaseId: string;
    recordId: string;
}

export const useRecords = (databaseId: string, filters = {}) => {
    return useQuery({
        queryKey: DATABASE_KEYS.recordsList(databaseId, filters),
        queryFn: () => recordApi.getRecords(databaseId, filters),
        enabled: !!databaseId,
    });
};

export const useCreateRecord = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ databaseId, data }: CreateRecordParams) => {
            return recordApi.createRecord(databaseId, data);
        },
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
        mutationFn: ({ databaseId, recordId, data }: UpdateRecordParams) => {
            return recordApi.updateRecord(databaseId, recordId, data);
        },
        onSuccess: (_, { databaseId }) => {
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
        mutationFn: ({ databaseId, recordId }: DeleteRecordParams) => {
            return recordApi.deleteRecord(databaseId, recordId);
        },
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
