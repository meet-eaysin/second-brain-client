import { apiClient } from "@/services/api-client.ts";
import type { ApiResponse } from "@/types/api.types";
import type {
  Workspace,
  WorkspaceWithUserInfo,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  GetWorkspacesQuery,
  WorkspaceStatsResponse,
} from "@/types/workspace.types";
import {EDatabaseType} from "@/modules/database-view";
import type {IWorkspaceInitResponse, TModuleInitializeRequest} from "@/modules/workspaces/types/workspaces.types.ts";

export const workspaceApi = {
  getWorkspaces: async (
    params?: GetWorkspacesQuery
  ): Promise<ApiResponse<Workspace[]>> => {
    const response = await apiClient.get(
      "/workspaces",
      { params }
    );
    return response.data;
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

  getPrimaryWorkspace: async (): Promise<ApiResponse<Workspace>> => {
    const response = await apiClient.get(
      "/workspaces/primary"
    );

    return response?.data;
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

  getModuleDatabaseId: async (
    workspaceId: string,
    moduleType: EDatabaseType
  ): Promise<ApiResponse<{ databaseId: string }>> => {
    const response = await apiClient.get(
      `/modules/workspace/${workspaceId}/${moduleType}/database-id`
    );
    return response.data;
  },

  initializeWorkspaceModules: async ({ workspaceId, moduleTypes, createSampleData }: TModuleInitializeRequest): Promise<ApiResponse<IWorkspaceInitResponse>> => {
    const response = await apiClient.post(`/modules/workspace/${workspaceId}/initialize`, {
      moduleTypes,
      createSampleData,
    });

    return response.data
  },
};
