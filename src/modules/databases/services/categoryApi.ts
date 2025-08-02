import { apiClient } from '@/services/api-client.ts';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import type { ApiResponse } from '@/types/api.types';
import type { DatabaseCategory } from '@/types/database.types';

export interface CreateCategoryRequest {
    name: string;
    description?: string;
    icon?: string;
    color?: string;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
    id: string;
}

export const categoryApi = {
    getCategories: async (): Promise<DatabaseCategory[]> => {
        const response = await apiClient.get<ApiResponse<{ categories: DatabaseCategory[] }>>(
            API_ENDPOINTS.CATEGORIES.LIST
        );
        return response.data.data.categories || [];
    },

    createCategory: async (data: CreateCategoryRequest): Promise<DatabaseCategory> => {
        const response = await apiClient.post<ApiResponse<DatabaseCategory>>(
            API_ENDPOINTS.CATEGORIES.CREATE,
            data
        );
        return response.data.data;
    },

    getCategoryById: async (id: string): Promise<DatabaseCategory> => {
        const response = await apiClient.get<ApiResponse<DatabaseCategory>>(
            API_ENDPOINTS.CATEGORIES.BY_ID(id)
        );
        return response.data.data;
    },

    updateCategory: async (data: UpdateCategoryRequest): Promise<DatabaseCategory> => {
        const { id, ...updateData } = data;
        const response = await apiClient.put<ApiResponse<DatabaseCategory>>(
            API_ENDPOINTS.CATEGORIES.UPDATE(id),
            updateData
        );
        return response.data.data;
    },

    deleteCategory: async (categoryId: string): Promise<void> => {
        await apiClient.delete(API_ENDPOINTS.CATEGORIES.DELETE(categoryId));
    },

    reorderCategories: async (categoryIds: string[]): Promise<DatabaseCategory[]> => {
        const response = await apiClient.patch<ApiResponse<{ categories: DatabaseCategory[] }>>(
            API_ENDPOINTS.CATEGORIES.REORDER,
            { categoryIds }
        );
        return response.data.data.categories;
    },
};
