import { apiClient } from '@/lib/api-client';
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
    // Get all categories for current user
    getCategories: async (): Promise<DatabaseCategory[]> => {
        const response = await apiClient.get<ApiResponse<DatabaseCategory[]>>('/categories');
        return response.data.data || [];
    },

    // Create new category
    createCategory: async (data: CreateCategoryRequest): Promise<DatabaseCategory> => {
        const response = await apiClient.post<ApiResponse<DatabaseCategory>>('/categories', data);
        return response.data.data;
    },

    // Update category
    updateCategory: async (data: UpdateCategoryRequest): Promise<DatabaseCategory> => {
        const { id, ...updateData } = data;
        const response = await apiClient.put<ApiResponse<DatabaseCategory>>(`/categories/${id}`, updateData);
        return response.data.data;
    },

    // Delete category
    deleteCategory: async (categoryId: string): Promise<void> => {
        await apiClient.delete(`/categories/${categoryId}`);
    },

    // Reorder categories
    reorderCategories: async (categoryIds: string[]): Promise<void> => {
        await apiClient.put('/categories/reorder', { categoryIds });
    },
};
