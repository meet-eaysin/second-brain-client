import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tagsApi } from './tagsApi';
import type {
    Tag,
    TagWithUsage,
    CreateTagRequest,
    UpdateTagRequest,
    TagQueryParams,
} from '@/types/tags.types';
import { toast } from 'sonner';

export const TAG_KEYS = {
    all: ['tags'] as const,
    lists: () => [...TAG_KEYS.all, 'list'] as const,
    list: (params?: TagQueryParams) => [...TAG_KEYS.lists(), params] as const,
    details: () => [...TAG_KEYS.all, 'detail'] as const,
    detail: (id: string) => [...TAG_KEYS.details(), id] as const,
    popular: () => [...TAG_KEYS.all, 'popular'] as const,
    search: (query: string) => [...TAG_KEYS.all, 'search', query] as const,
};

// Query hooks
export const useGetTags = (params?: TagQueryParams) => {
    return useQuery({
        queryKey: TAG_KEYS.list(params),
        queryFn: () => tagsApi.getTags(params),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useGetTagById = (id: string) => {
    return useQuery({
        queryKey: TAG_KEYS.detail(id),
        queryFn: () => tagsApi.getTagById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
};

export const useGetPopularTags = (limit = 10) => {
    return useQuery({
        queryKey: TAG_KEYS.popular(),
        queryFn: () => tagsApi.getPopularTags(limit),
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
};

export const useSearchTags = (query: string) => {
    return useQuery({
        queryKey: TAG_KEYS.search(query),
        queryFn: () => tagsApi.searchTags(query),
        enabled: query.length > 0,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

// Mutation hooks
export const useCreateTag = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateTagRequest) => tagsApi.createTag(data),
        onSuccess: (newTag) => {
            // Invalidate and refetch tags list
            queryClient.invalidateQueries({ queryKey: TAG_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: TAG_KEYS.popular() });
            
            toast.success('Tag created successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to create tag');
        },
    });
};

export const useUpdateTag = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateTagRequest }) =>
            tagsApi.updateTag(id, data),
        onSuccess: (updatedTag, { id }) => {
            // Update the specific tag in cache
            queryClient.setQueryData(TAG_KEYS.detail(id), updatedTag);
            
            // Invalidate lists to reflect changes
            queryClient.invalidateQueries({ queryKey: TAG_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: TAG_KEYS.popular() });
            
            toast.success('Tag updated successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update tag');
        },
    });
};

export const useDeleteTag = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => tagsApi.deleteTag(id),
        onSuccess: (_, id) => {
            // Remove the tag from cache
            queryClient.removeQueries({ queryKey: TAG_KEYS.detail(id) });
            
            // Invalidate lists to reflect changes
            queryClient.invalidateQueries({ queryKey: TAG_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: TAG_KEYS.popular() });
            
            toast.success('Tag deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to delete tag');
        },
    });
};
