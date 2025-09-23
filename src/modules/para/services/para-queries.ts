import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paraApi } from "./para-api";
import type {
  IParaItem,
  IParaStats,
  ICreateParaItemRequest,
  IUpdateParaItemRequest,
  IParaQueryParams,
  IMoveToArchiveRequest,
  IRestoreFromArchiveRequest,
  ICategorizeExistingItemRequest,
  EParaCategory,
  EParaStatus,
  EParaPriority,
} from "../types/para.types";

// Query Keys
export const PARA_KEYS = {
  all: ["para"] as const,
  items: (params?: IParaQueryParams) =>
    [...PARA_KEYS.all, "items", params] as const,
  item: (id: string) => [...PARA_KEYS.all, "item", id] as const,
  stats: (params?: IParaQueryParams) =>
    [...PARA_KEYS.all, "stats", params] as const,
  search: (query: string, params?: IParaQueryParams) =>
    [...PARA_KEYS.all, "search", query, params] as const,
  categories: {
    projects: (params?: IParaQueryParams) =>
      [...PARA_KEYS.all, "categories", "projects", params] as const,
    areas: (params?: IParaQueryParams) =>
      [...PARA_KEYS.all, "categories", "areas", params] as const,
    resources: (params?: IParaQueryParams) =>
      [...PARA_KEYS.all, "categories", "resources", params] as const,
    archive: (params?: IParaQueryParams) =>
      [...PARA_KEYS.all, "categories", "archive", params] as const,
  },
  analytics: {
    byStatus: (status: EParaStatus, params?: IParaQueryParams) =>
      [...PARA_KEYS.all, "analytics", "status", status, params] as const,
    byPriority: (priority: EParaPriority, params?: IParaQueryParams) =>
      [...PARA_KEYS.all, "analytics", "priority", priority, params] as const,
    reviewsOverdue: (params?: IParaQueryParams) =>
      [...PARA_KEYS.all, "analytics", "reviews-overdue", params] as const,
  },
};

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
    mutationFn: (data: ICategorizeExistingItemRequest) =>
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
