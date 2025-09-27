import { apiClient } from "@/services/api-client";
import type { ApiResponse } from "@/types/api.types";
import type {
  Workspace,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  WorkspaceStatsResponse,
  GetWorkspacesQuery,
  SearchWorkspacesQuery,
} from "@/modules/workspaces/types/workspaces.types";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import { EDatabaseType } from "@/modules/database-view";
import type {
  IWorkspaceInitResponse,
  TModuleInitializeRequest,
} from "@/modules/workspaces/types/workspaces.types";

export const workspaceApi = {
  getUserWorkspaces: async (): Promise<ApiResponse<Workspace[]>> => {
    const response = await apiClient.get(API_ENDPOINTS.WORKSPACES.BASE);
    return response.data;
  },

  createWorkspace: async (data: CreateWorkspaceRequest): Promise<Workspace> => {
    const response = await apiClient.post<ApiResponse<Workspace>>(
      API_ENDPOINTS.WORKSPACES.BASE,
      data
    );
    return response.data.data!;
  },

  getCurrentWorkspace: async (): Promise<ApiResponse<Workspace>> => {
    const response = await apiClient.get<ApiResponse<Workspace>>(
      API_ENDPOINTS.WORKSPACES.CURRENT
    );
    return response.data;
  },

  updateCurrentWorkspace: async (
    data: UpdateWorkspaceRequest
  ): Promise<Workspace> => {
    const response = await apiClient.put<ApiResponse<Workspace>>(
      API_ENDPOINTS.WORKSPACES.CURRENT,
      data
    );
    return response.data.data!;
  },

  deleteCurrentWorkspace: async (): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.WORKSPACES.CURRENT);
  },

  getCurrentWorkspaceStats: async (): Promise<WorkspaceStatsResponse> => {
    const response = await apiClient.get<ApiResponse<WorkspaceStatsResponse>>(
      API_ENDPOINTS.WORKSPACES.CURRENT_STATS
    );
    return response.data.data!;
  },

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
    return response.data.data!;
  },

  getPrimaryWorkspace: async (): Promise<Workspace> => {
    const response = await apiClient.get<ApiResponse<Workspace>>(
      API_ENDPOINTS.WORKSPACES.PRIMARY
    );
    return response.data.data!;
  },

  getOrCreateDefaultWorkspace: async (
    userInfo?: Record<string, unknown>
  ): Promise<Workspace> => {
    const response = await apiClient.post<ApiResponse<Workspace>>(
      API_ENDPOINTS.WORKSPACES.DEFAULT,
      userInfo
    );
    return response.data.data!;
  },

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

  updateWorkspace: async (
    id: string,
    data: UpdateWorkspaceRequest
  ): Promise<ApiResponse<Workspace>> => {
    const response = await apiClient.put<ApiResponse<Workspace>>(
      API_ENDPOINTS.WORKSPACES.BY_ID(id),
      data
    );
    return response.data!;
  },

  // Delete workspace by ID
  deleteWorkspace: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.WORKSPACES.BY_ID(id));
  },

  // Duplicate workspace
  duplicateWorkspace: async (
    _id: string,
    name?: string
  ): Promise<ApiResponse<Workspace>> => {
    const response = await apiClient.post<ApiResponse<Workspace>>(
      API_ENDPOINTS.WORKSPACES.DUPLICATE,
      { name }
    );
    return response.data!;
  },

  // Leave workspace
  leaveWorkspace: async (): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.WORKSPACES.LEAVE);
  },

  // Get public workspaces
  getPublicWorkspaces: async (
    params?: GetWorkspacesQuery
  ): Promise<ApiResponse<Workspace[]>> => {
    const response = await apiClient.get(API_ENDPOINTS.WORKSPACES.PUBLIC, {
      params,
    });
    return response.data;
  },

  // Search workspaces
  searchWorkspaces: async (
    params: SearchWorkspacesQuery
  ): Promise<ApiResponse<Workspace[]>> => {
    const response = await apiClient.get(API_ENDPOINTS.WORKSPACES.SEARCH, {
      params,
    });
    return response.data;
  },
};
