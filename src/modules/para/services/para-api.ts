import { apiClient } from "@/services/api-client.ts";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { ApiResponse } from "@/types/api.types";
import {
  type IParaItem,
  type IParaArea,
  type IParaArchive,
  type IParaStats,
  type ICreateParaItemRequest,
  type IUpdateParaItemRequest,
  type IParaQueryParams,
  type IMoveToArchiveRequest,
  type IRestoreFromArchiveRequest,
  type IParaCategorizeRequest,
} from "@/modules/para/types/para.types";
import { EParaStatus, EParaPriority } from "@/modules/para/types/para.types";

// PARA API Service
export const paraApi = {
  // ===== PARA ITEM CRUD OPERATIONS =====

  // Create a new PARA item
  createParaItem: async (
    data: ICreateParaItemRequest
  ): Promise<IParaItem | IParaArea | IParaArchive> => {
    const response = await apiClient.post<ApiResponse<IParaItem>>(
      "/para",
      data
    );
    return response.data.data!;
  },

  // Get PARA items with optional filtering
  getParaItems: async (
    params?: IParaQueryParams
  ): Promise<(IParaItem | IParaArea | IParaArchive)[]> => {
    const response = await apiClient.get<ApiResponse<IParaItem[]>>("/para", {
      params,
    });
    return response.data.data!;
  },

  // Get a single PARA item by ID
  getParaItemById: async (
    id: string
  ): Promise<IParaItem | IParaArea | IParaArchive> => {
    const response = await apiClient.get<ApiResponse<IParaItem>>(`/para/${id}`);
    return response.data.data!;
  },

  // Update a PARA item
  updateParaItem: async (
    id: string,
    data: IUpdateParaItemRequest
  ): Promise<IParaItem | IParaArea | IParaArchive> => {
    const response = await apiClient.put<ApiResponse<IParaItem>>(
      `/para/${id}`,
      data
    );
    return response.data.data!;
  },

  // Delete a PARA item
  deleteParaItem: async (id: string): Promise<void> => {
    await apiClient.delete(`/para/${id}`);
  },

  // Get PARA statistics
  getParaStats: async (params?: IParaQueryParams): Promise<IParaStats> => {
    const response = await apiClient.get<ApiResponse<IParaStats>>(
      API_ENDPOINTS.PARA.STATS,
      { params }
    );
    return response.data.data!;
  },

  // Search PARA items
  searchParaItems: async (
    query: string,
    params?: IParaQueryParams
  ): Promise<IParaItem[]> => {
    const response = await apiClient.get<ApiResponse<IParaItem[]>>(
      "/para/search",
      {
        params: { ...params, query },
      }
    );
    return response.data.data!;
  },

  // ===== PARA CATEGORIES =====

  // Get projects
  getProjects: async (params?: IParaQueryParams): Promise<IParaItem[]> => {
    const response = await apiClient.get<ApiResponse<IParaItem[]>>(
      "/para/categories/projects",
      {
        params,
      }
    );
    return response.data.data!;
  },

  // Get areas
  getAreas: async (params?: IParaQueryParams): Promise<IParaItem[]> => {
    const response = await apiClient.get<ApiResponse<IParaItem[]>>(
      "/para/categories/areas",
      { params }
    );
    return response.data.data!;
  },

  // Get resources
  getResources: async (params?: IParaQueryParams): Promise<IParaItem[]> => {
    const response = await apiClient.get<ApiResponse<IParaItem[]>>(
      "/para/categories/resources",
      {
        params,
      }
    );
    return response.data.data!;
  },

  // Get archive
  getArchive: async (params?: IParaQueryParams): Promise<IParaItem[]> => {
    const response = await apiClient.get<ApiResponse<IParaItem[]>>(
      "/para/categories/archive",
      { params }
    );
    return response.data.data!;
  },

  // ===== PARA ANALYTICS =====

  // Get items by status
  getItemsByStatus: async (
    status: EParaStatus,
    params?: IParaQueryParams
  ): Promise<IParaItem[]> => {
    const response = await apiClient.get<ApiResponse<IParaItem[]>>(
      `/para/status/${status}`,
      { params }
    );
    return response.data.data!;
  },

  // Get items by priority
  getItemsByPriority: async (
    priority: EParaPriority,
    params?: IParaQueryParams
  ): Promise<IParaItem[]> => {
    const response = await apiClient.get<ApiResponse<IParaItem[]>>(
      `/para/priority/${priority}`,
      {
        params,
      }
    );
    return response.data.data!;
  },

  // Get reviews overdue
  getReviewsOverdue: async (
    params?: IParaQueryParams
  ): Promise<IParaItem[]> => {
    const response = await apiClient.get<ApiResponse<IParaItem[]>>(
      "/para/reviews/overdue",
      {
        params,
      }
    );
    return response.data.data!;
  },

  // ===== PARA ACTIONS =====

  // Move items to archive
  moveToArchive: async (
    data: IMoveToArchiveRequest
  ): Promise<{ message: string; archivedCount: number }> => {
    const response = await apiClient.post<
      ApiResponse<{ message: string; archivedCount: number }>
    >("/para/archive", data);
    return response.data.data!;
  },

  // Restore items from archive
  restoreFromArchive: async (
    data: IRestoreFromArchiveRequest
  ): Promise<{ message: string; restoredCount: number }> => {
    const response = await apiClient.post<
      ApiResponse<{ message: string; restoredCount: number }>
    >("/para/restore", data);
    return response.data.data!;
  },

  // Categorize existing items
  categorizeExistingItem: async (
    data: IParaCategorizeRequest
  ): Promise<
    | { message: string; paraItemId: string }
    | { message: string; paraItem: IParaItem | IParaArea | IParaArchive }
  > => {
    const response = await apiClient.post<
      ApiResponse<{ message: string; paraItemId: string }>
    >("/para/categorize", data);
    return response.data.data!;
  },

  // Mark item as reviewed
  markReviewed: async (
    id: string,
    notes?: string
  ): Promise<IParaItem | IParaArea | IParaArchive> => {
    const response = await apiClient.post<ApiResponse<IParaItem>>(
      `/para/${id}/review`,
      {
        notes,
      }
    );
    return response.data.data!;
  },
};
