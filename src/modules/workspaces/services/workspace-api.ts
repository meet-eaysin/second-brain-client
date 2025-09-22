import { apiClient } from "@/services/api-client.ts";
import type { ApiResponse } from "@/types/api.types.ts";
import type {
  Workspace,
  ICreateWorkspaceRequest,
  IUpdateWorkspaceRequest,
  IWorkspaceStats,
} from "@/types/workspace.types";
import { API_ENDPOINTS } from "@/constants/api-endpoints.ts";
import { EDatabaseType } from "@/modules/database-view";
import type {
  IWorkspaceInitResponse,
  TModuleInitializeRequest,
} from "@/modules/workspaces/types/workspaces.types.ts";

export const workspaceApi = {
  // Get user's workspaces
  getUserWorkspaces: async (): Promise<ApiResponse<Workspace[]>> => {
    const response = await apiClient.get(API_ENDPOINTS.WORKSPACES.BASE);
    return response.data;
  },

  // Create workspace
  createWorkspace: async (
    data: ICreateWorkspaceRequest
  ): Promise<Workspace> => {
    const response = await apiClient.post<ApiResponse<Workspace>>(
      API_ENDPOINTS.WORKSPACES.BASE,
      data
    );
    return response.data.data;
  },

  // Get workspace by ID (current workspace)
  getCurrentWorkspace: async (): Promise<Workspace> => {
    const response = await apiClient.get<ApiResponse<Workspace>>(
      API_ENDPOINTS.WORKSPACES.CURRENT
    );
    return response.data.data;
  },

  // Update current workspace
  updateCurrentWorkspace: async (
    data: IUpdateWorkspaceRequest
  ): Promise<Workspace> => {
    const response = await apiClient.put<ApiResponse<Workspace>>(
      API_ENDPOINTS.WORKSPACES.CURRENT,
      data
    );
    return response.data.data;
  },

  // Delete current workspace
  deleteCurrentWorkspace: async (): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.WORKSPACES.CURRENT);
  },

  // Get workspace statistics
  getCurrentWorkspaceStats: async (): Promise<IWorkspaceStats> => {
    const response = await apiClient.get<ApiResponse<IWorkspaceStats>>(
      API_ENDPOINTS.WORKSPACES.CURRENT_STATS
    );
    return response.data.data;
  },

  // Check workspace access
  checkCurrentWorkspaceAccess: async (): Promise<{
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
    >(API_ENDPOINTS.WORKSPACES.CURRENT_ACCESS);
    return response.data.data;
  },

  // Get primary workspace
  getPrimaryWorkspace: async (): Promise<Workspace> => {
    const response = await apiClient.get<ApiResponse<Workspace>>(
      API_ENDPOINTS.WORKSPACES.PRIMARY
    );
    return response.data.data;
  },

  // Get or create default workspace
  getOrCreateDefaultWorkspace: async (
    userInfo?: Record<string, unknown>
  ): Promise<Workspace> => {
    const response = await apiClient.post<ApiResponse<Workspace>>(
      API_ENDPOINTS.WORKSPACES.DEFAULT,
      userInfo
    );
    return response.data.data;
  },

  // Module initialization
  getModuleDatabaseId: async (
    moduleType: EDatabaseType
  ): Promise<ApiResponse<{ databaseId: string }>> => {
    const response = await apiClient.get(
      API_ENDPOINTS.MODULES.WORKSPACE_DATABASE_ID(moduleType)
    );
    return response.data;
  },

  initializeWorkspaceModules: async ({
    moduleTypes,
    createSampleData,
  }: TModuleInitializeRequest): Promise<
    ApiResponse<IWorkspaceInitResponse>
  > => {
    const response = await apiClient.post(API_ENDPOINTS.MODULES.INITIALIZE, {
      modules: moduleTypes,
      createSampleData,
    });

    return response.data;
  },
};
