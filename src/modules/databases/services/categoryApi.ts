import type { ApiResponse } from '@/types/api.types';
import type { DatabaseCategory } from '@/types/database.types';
import apiClient from "@/services/api-client.ts";

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
        const response = await apiClient.get<ApiResponse<DatabaseCategory[]>>('/categories');
        return response.data.data || [];
    },

    createCategory: async (data: CreateCategoryRequest): Promise<DatabaseCategory> => {
        const response = await apiClient.post<ApiResponse<DatabaseCategory>>('/categories', data);
        return response.data.data;
    },

    updateCategory: async (data: UpdateCategoryRequest): Promise<DatabaseCategory> => {
        const { id, ...updateData } = data;
        const response = await apiClient.put<ApiResponse<DatabaseCategory>>(`/categories/${id}`, updateData);
        return response.data.data;
    },

    deleteCategory: async (categoryId: string): Promise<void> => {
        await apiClient.delete(`/categories/${categoryId}`);
    },

    reorderCategories: async (categoryIds: string[]): Promise<void> => {
        await apiClient.put('/categories/reorder', { categoryIds });
    },
};
