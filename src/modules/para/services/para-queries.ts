import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paraApi } from "./para-api";
import { PARA_KEYS } from "@/constants/query-keys.ts";
import type {
  ICreateParaItemRequest,
  IUpdateParaItemRequest,
  IParaQueryParams,
  IMoveToArchiveRequest,
  IRestoreFromArchiveRequest,
  IParaCategorizeRequest,
  EParaStatus,
  EParaPriority,
} from "@/modules/para/types/para.types";

// ===== QUERIES =====

// Get all PARA items
export const useParaItems = (params?: IParaQueryParams) => {
  return useQuery({
    queryKey: PARA_KEYS.items(params),
    queryFn: () => paraApi.getParaItems(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single PARA item
export const useParaItem = (id: string) => {
  return useQuery({
    queryKey: PARA_KEYS.item(id),
    queryFn: () => paraApi.getParaItemById(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id,
  });
};

// Get PARA statistics
export const useParaStats = (params?: IParaQueryParams) => {
  return useQuery({
    queryKey: PARA_KEYS.stats(params),
    queryFn: () => paraApi.getParaStats(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Search PARA items
export const useParaSearch = (query: string, params?: IParaQueryParams) => {
  return useQuery({
    queryKey: PARA_KEYS.search(query, params),
    queryFn: () => paraApi.searchParaItems(query, params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!query,
  });
};

// Get projects
export const useParaProjects = (params?: IParaQueryParams) => {
  return useQuery({
    queryKey: PARA_KEYS.categories.projects(params),
    queryFn: () => paraApi.getProjects(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get areas
export const useParaAreas = (params?: IParaQueryParams) => {
  return useQuery({
    queryKey: PARA_KEYS.categories.areas(params),
    queryFn: () => paraApi.getAreas(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get resources
export const useParaResources = (params?: IParaQueryParams) => {
  return useQuery({
    queryKey: PARA_KEYS.categories.resources(params),
    queryFn: () => paraApi.getResources(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get archive
export const useParaArchive = (params?: IParaQueryParams) => {
  return useQuery({
    queryKey: PARA_KEYS.categories.archive(params),
    queryFn: () => paraApi.getArchive(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get items by status
export const useParaItemsByStatus = (
  status: EParaStatus,
  params?: IParaQueryParams
) => {
  return useQuery({
    queryKey: PARA_KEYS.analytics.byStatus(status, params),
    queryFn: () => paraApi.getItemsByStatus(status, params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get items by priority
export const useParaItemsByPriority = (
  priority: EParaPriority,
  params?: IParaQueryParams
) => {
  return useQuery({
    queryKey: PARA_KEYS.analytics.byPriority(priority, params),
    queryFn: () => paraApi.getItemsByPriority(priority, params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get reviews overdue
export const useParaReviewsOverdue = (params?: IParaQueryParams) => {
  return useQuery({
    queryKey: PARA_KEYS.analytics.reviewsOverdue(params),
    queryFn: () => paraApi.getReviewsOverdue(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// ===== MUTATIONS =====

// Create PARA item
export const useCreateParaItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateParaItemRequest) => paraApi.createParaItem(data),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: PARA_KEYS.all });
    },
  });
};

// Update PARA item
export const useUpdateParaItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateParaItemRequest }) =>
      paraApi.updateParaItem(id, data),
    onSuccess: (updatedItem) => {
      // Update the specific item in cache
      queryClient.setQueryData(PARA_KEYS.item(updatedItem.id), updatedItem);
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: PARA_KEYS.items() });
      queryClient.invalidateQueries({ queryKey: PARA_KEYS.stats() });
    },
  });
};

// Delete PARA item
export const useDeleteParaItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => paraApi.deleteParaItem(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: PARA_KEYS.item(deletedId) });
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: PARA_KEYS.all });
    },
  });
};

// Move to archive
export const useMoveToArchive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IMoveToArchiveRequest) => paraApi.moveToArchive(data),
    onSuccess: () => {
      // Invalidate all PARA queries since items moved categories
      queryClient.invalidateQueries({ queryKey: PARA_KEYS.all });
    },
  });
};

// Restore from archive
export const useRestoreFromArchive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IRestoreFromArchiveRequest) =>
      paraApi.restoreFromArchive(data),
    onSuccess: () => {
      // Invalidate all PARA queries since items moved categories
      queryClient.invalidateQueries({ queryKey: PARA_KEYS.all });
    },
  });
};

// Categorize existing item
export const useCategorizeExistingItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IParaCategorizeRequest) =>
      paraApi.categorizeExistingItem(data),
    onSuccess: () => {
      // Invalidate all PARA queries
      queryClient.invalidateQueries({ queryKey: PARA_KEYS.all });
    },
  });
};

// Mark as reviewed
export const useMarkReviewed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      paraApi.markReviewed(id, notes),
    onSuccess: (updatedItem) => {
      // Update the specific item in cache
      queryClient.setQueryData(PARA_KEYS.item(updatedItem.id), updatedItem);
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: PARA_KEYS.items() });
    },
  });
};
