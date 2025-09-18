import { apiClient } from "@/services/api-client.ts";
import type { ApiResponse } from "@/types/api.types";
import type {
  Workspace,
  WorkspaceWithUserInfo,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  GetWorkspacesQuery,
  WorkspaceListResponse,
  WorkspaceStatsResponse,
} from "@/types/workspace.types";

export const workspaceApi = {
  // Basic workspace operations
  getWorkspaces: async (
    params?: GetWorkspacesQuery
  ): Promise<WorkspaceListResponse> => {
    const response = await apiClient.get<ApiResponse<WorkspaceListResponse>>(
      "/workspaces",
      { params }
    );
    return response.data.data;
  },

  createWorkspace: async (data: CreateWorkspaceRequest): Promise<Workspace> => {
    const response = await apiClient.post<ApiResponse<Workspace>>(
      "/workspaces",
      data
    );
    return response.data.data;
  },

  getWorkspaceById: async (id: string): Promise<WorkspaceWithUserInfo> => {
    const response = await apiClient.get<ApiResponse<WorkspaceWithUserInfo>>(
      `/workspaces/${id}`
    );
    return response.data.data;
  },

  updateWorkspace: async (
    id: string,
    data: UpdateWorkspaceRequest
  ): Promise<Workspace> => {
    const response = await apiClient.put<ApiResponse<Workspace>>(
      `/workspaces/${id}`,
      data
    );
    return response.data.data;
  },

  deleteWorkspace: async (id: string): Promise<void> => {
    await apiClient.delete(`/workspaces/${id}`);
  },

  // Primary workspace operations
  getPrimaryWorkspace: async (): Promise<Workspace> => {
    const response = await apiClient.get<ApiResponse<Workspace>>(
      "/workspaces/primary"
    );
    return response.data.data;
  },

  getOrCreateDefaultWorkspace: async (
    userInfo?: Record<string, unknown>
  ): Promise<Workspace> => {
    const response = await apiClient.post<ApiResponse<Workspace>>(
      "/workspaces/default",
      userInfo
    );
    return response.data.data;
  },

  // Workspace stats and access
  getWorkspaceStats: async (id: string): Promise<WorkspaceStatsResponse> => {
    const response = await apiClient.get<ApiResponse<WorkspaceStatsResponse>>(
      `/workspaces/${id}/stats`
    );
    return response.data.data;
  },

  checkWorkspaceAccess: async (
    id: string
  ): Promise<{
    hasAccess: boolean;
    canManage: boolean;
    canManageMembers: boolean;
  }> => {
    const response = await apiClient.get<
      ApiResponse<{
        hasAccess: boolean;
        canManage: boolean;
        canManageMembers: boolean;
      }>
    >(`/workspaces/${id}/access`);
    return response.data.data;
  },
};
