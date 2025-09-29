import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoriesApi } from "./categories-api.ts";
import { CATEGORY_KEYS } from "@/constants/query-keys.ts";
import type {
  CreateCategoryRequest,
  UpdateCategoryRequest,
  ReorderCategoriesRequest,
} from "./categories-api.ts";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import type { ApiError } from "@/types/api.types.ts";

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
    mutationFn: (data: CreateCategoryRequest) =>
      categoriesApi.createCategory(data),
    onSuccess: () => {
      // Invalidate and refetch categories list
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.withCounts() });

      toast.success("Category created successfully");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(
        error?.response?.data?.message || "Failed to create category"
      );
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

      toast.success("Category updated successfully");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(
        error?.response?.data?.message || "Failed to update category"
      );
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

      toast.success("Category deleted successfully");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete category"
      );
    },
  });
};

export const useReorderCategories = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReorderCategoriesRequest) =>
      categoriesApi.reorderCategories(data),
    onSuccess: (reorderedCategories) => {
      // Update the categories list in cache
      queryClient.setQueryData(CATEGORY_KEYS.list(), {
        categories: reorderedCategories,
        total: reorderedCategories?.meta?.total,
      });

      // Invalidate withCounts to reflect new order
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.withCounts() });

      toast.success("Categories reordered successfully");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(
        error?.response?.data?.message || "Failed to reorder categories"
      );
    },
  });
};
