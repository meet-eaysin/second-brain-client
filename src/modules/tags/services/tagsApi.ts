import { apiClient } from '@/services/api-client.ts';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import type {
    Tag,
    TagWithUsage,
    CreateTagRequest,
    UpdateTagRequest,
    TagQueryParams,
    TagsResponse,
} from '@/types/tags.types';
import type { ApiResponse } from '@/types/api.types';

export const tagsApi = {
    // Get all tags for the current user
    getTags: async (params?: TagQueryParams): Promise<TagsResponse> => {
        const response = await apiClient.get<ApiResponse<TagsResponse>>(
            API_ENDPOINTS.TAGS.LIST,
            { params }
        );
        return response.data.data;
    },

    // Create a new tag
    createTag: async (data: CreateTagRequest): Promise<Tag> => {
        const response = await apiClient.post<ApiResponse<Tag>>(
            API_ENDPOINTS.TAGS.CREATE,
            data
        );
        return response.data.data;
    },

    // Get tag by ID
    getTagById: async (id: string): Promise<TagWithUsage> => {
        const response = await apiClient.get<ApiResponse<TagWithUsage>>(
            API_ENDPOINTS.TAGS.BY_ID(id)
        );
        return response.data.data;
    },

    // Update tag
    updateTag: async (id: string, data: UpdateTagRequest): Promise<Tag> => {
        const response = await apiClient.put<ApiResponse<Tag>>(
            API_ENDPOINTS.TAGS.UPDATE(id),
            data
        );
        return response.data.data;
    },

    // Delete tag
    deleteTag: async (id: string): Promise<void> => {
        await apiClient.delete(API_ENDPOINTS.TAGS.DELETE(id));
    },

    // Get popular tags (most used)
    getPopularTags: async (limit = 10): Promise<TagWithUsage[]> => {
        const response = await tagsApi.getTags({
            sortBy: 'usageCount',
            sortOrder: 'desc',
            limit,
        });
        return response.tags;
    },

    // Search tags by name
    searchTags: async (query: string): Promise<TagWithUsage[]> => {
        const response = await tagsApi.getTags({
            search: query,
            limit: 20,
        });
        return response.tags;
    },
};
