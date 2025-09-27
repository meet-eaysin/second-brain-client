import { apiClient } from '@/services/api-client.ts';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import type { ApiResponse } from '@/types/api.types';

export interface Category {
    id: string;
    name: string;
    description?: string;
    color?: string;
    icon?: string;
    order: number;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCategoryRequest {
    name: string;
    description?: string;
    color?: string;
    icon?: string;
    order?: number;
}

export interface UpdateCategoryRequest {
    name?: string;
    description?: string;
    color?: string;
    icon?: string;
    order?: number;
}

export interface ReorderCategoriesRequest {
    categoryIds: string[];
}

export interface CategoriesResponse {
    categories: Category[];
    total: number;
}

export const categoriesApi = {
    // Get all categories for the current user
    getCategories: async (): Promise<ApiResponse<CategoriesResponse>> => {
        const response = await apiClient.get<ApiResponse<CategoriesResponse>>(
            API_ENDPOINTS.CATEGORIES.LIST
        );
        return response.data;
    },

    createCategory: async (data: CreateCategoryRequest): Promise<ApiResponse<Category>> => {
        const response = await apiClient.post<ApiResponse<Category>>(
            API_ENDPOINTS.CATEGORIES.CREATE,
            data
        );
        return response.data;
    },

    // Get category by ID
    getCategoryById: async (id: string): Promise<ApiResponse<Category>> => {
        const response = await apiClient.get<ApiResponse<Category>>(
            API_ENDPOINTS.CATEGORIES.BY_ID(id)
        );
        return response.data;
    },

    // Update category
    updateCategory: async (id: string, data: UpdateCategoryRequest): Promise<ApiResponse<Category>> => {
        const response = await apiClient.put<ApiResponse<Category>>(
            API_ENDPOINTS.CATEGORIES.UPDATE(id),
            data
        );
        return response.data;
    },

    // Delete category
    deleteCategory: async (id: string): Promise<void> => {
        await apiClient.delete(API_ENDPOINTS.CATEGORIES.DELETE(id));
    },

    // Reorder categories
    reorderCategories: async (data: ReorderCategoriesRequest): Promise<ApiResponse<Category[]>> => {
        const response = await apiClient.put<ApiResponse<Category[]>>(
            API_ENDPOINTS.CATEGORIES.REORDER,
            data
        );
        return response.data;
    },

    getCategoriesWithCounts: async (): Promise<CategoriesResponse | undefined> => {
        const response = await categoriesApi.getCategories();
        // Note: The server should ideally provide database counts
        // For now, we'll return categories without counts
        return response?.data;
    },
};
