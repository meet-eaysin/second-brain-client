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

export const paraApi = {
  createParaItem: async (
    data: ICreateParaItemRequest
  ): Promise<IParaItem | IParaArea | IParaArchive> => {
    const response = await apiClient.post<ApiResponse<IParaItem>>(
      "/para",
      data
    );
    return response.data.data!;
  },

  getParaItems: async (
    params?: IParaQueryParams
  ): Promise<(IParaItem | IParaArea | IParaArchive)[]> => {
    const response = await apiClient.get<ApiResponse<IParaItem[]>>("/para", {
      params,
    });
    return response.data.data!;
  },

  getParaItemById: async (
    id: string
  ): Promise<IParaItem | IParaArea | IParaArchive> => {
    const response = await apiClient.get<ApiResponse<IParaItem>>(`/para/${id}`);
    return response.data.data!;
  },

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

  deleteParaItem: async (id: string): Promise<void> => {
    await apiClient.delete(`/para/${id}`);
  },

  getParaStats: async (params?: IParaQueryParams): Promise<IParaStats> => {
    const response = await apiClient.get<ApiResponse<IParaStats>>(
      API_ENDPOINTS.PARA.STATS,
      { params }
    );
    return response.data.data!;
  },

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

  getProjects: async (params?: IParaQueryParams): Promise<IParaItem[]> => {
    const response = await apiClient.get<ApiResponse<IParaItem[]>>(
      "/para/categories/projects",
      {
        params,
      }
    );
    return response.data.data!;
  },

  getAreas: async (params?: IParaQueryParams): Promise<IParaItem[]> => {
    const response = await apiClient.get<ApiResponse<IParaItem[]>>(
      "/para/categories/areas",
      { params }
    );
    return response.data.data!;
  },

  getResources: async (params?: IParaQueryParams): Promise<IParaItem[]> => {
    const response = await apiClient.get<ApiResponse<IParaItem[]>>(
      "/para/categories/resources",
      {
        params,
      }
    );
    return response.data.data!;
  },

  getArchive: async (params?: IParaQueryParams): Promise<IParaItem[]> => {
    const response = await apiClient.get<ApiResponse<IParaItem[]>>(
      "/para/categories/archive",
      { params }
    );
    return response.data.data!;
  },

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

  moveToArchive: async (
    data: IMoveToArchiveRequest
  ): Promise<{ message: string; archivedCount: number }> => {
    const response = await apiClient.post<
      ApiResponse<{ message: string; archivedCount: number }>
    >("/para/archive", data);
    return response.data.data!;
  },

  restoreFromArchive: async (
    data: IRestoreFromArchiveRequest
  ): Promise<{ message: string; restoredCount: number }> => {
    const response = await apiClient.post<
      ApiResponse<{ message: string; restoredCount: number }>
    >("/para/restore", data);
    return response.data.data!;
  },

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
