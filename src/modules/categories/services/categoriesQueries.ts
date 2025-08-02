import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { categoriesApi } from './categoriesApi';
import type {
    Category,
    CreateCategoryRequest,
    UpdateCategoryRequest,
    ReorderCategoriesRequest,
} from './categoriesApi';
import { toast } from 'sonner';

export const CATEGORY_KEYS = {
    all: ['categories'] as const,
    lists: () => [...CATEGORY_KEYS.all, 'list'] as const,
    list: () => [...CATEGORY_KEYS.lists()] as const,
    details: () => [...CATEGORY_KEYS.all, 'detail'] as const,
    detail: (id: string) => [...CATEGORY_KEYS.details(), id] as const,
    withCounts: () => [...CATEGORY_KEYS.all, 'withCounts'] as const,
};

// Query hooks
export const useGetCategories = () => {
    return useQuery({
        queryKey: CATEGORY_KEYS.list(),
        queryFn: () => categoriesApi.getCategories(),
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
};

export const useGetCategoryById = (id: string) => {
    return useQuery({
        queryKey: CATEGORY_KEYS.detail(id),
        queryFn: () => categoriesApi.getCategoryById(id),
        enabled: !!id,
        staleTime: 10 * 60 * 1000,
    });
};

export const useGetCategoriesWithCounts = () => {
    return useQuery({
        queryKey: CATEGORY_KEYS.withCounts(),
        queryFn: () => categoriesApi.getCategoriesWithCounts(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Mutation hooks
export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCategoryRequest) => categoriesApi.createCategory(data),
        onSuccess: (newCategory) => {
            // Invalidate and refetch categories list
            queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.withCounts() });
            
            toast.success('Category created successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to create category');
        },
    });
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateCategoryRequest }) =>
            categoriesApi.updateCategory(id, data),
        onSuccess: (updatedCategory, { id }) => {
            // Update the specific category in cache
            queryClient.setQueryData(CATEGORY_KEYS.detail(id), updatedCategory);
            
            // Invalidate lists to reflect changes
            queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.withCounts() });
            
            toast.success('Category updated successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update category');
        },
    });
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => categoriesApi.deleteCategory(id),
        onSuccess: (_, id) => {
            // Remove the category from cache
            queryClient.removeQueries({ queryKey: CATEGORY_KEYS.detail(id) });
            
            // Invalidate lists to reflect changes
            queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.withCounts() });
            
            toast.success('Category deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to delete category');
        },
    });
};

export const useReorderCategories = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ReorderCategoriesRequest) => categoriesApi.reorderCategories(data),
        onSuccess: (reorderedCategories) => {
            // Update the categories list in cache
            queryClient.setQueryData(CATEGORY_KEYS.list(), {
                categories: reorderedCategories,
                total: reorderedCategories.length,
            });
            
            // Invalidate withCounts to reflect new order
            queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.withCounts() });
            
            toast.success('Categories reordered successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to reorder categories');
        },
    });
};
