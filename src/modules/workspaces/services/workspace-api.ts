import { apiClient } from "@/services/api-client.ts";
import type { ApiResponse } from "@/modules/auth/types/auth.types.ts";
import type {
  Workspace,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  GetWorkspacesQuery,
  WorkspaceStatsResponse,
} from "@/types/workspace.types";
import { API_ENDPOINTS } from "@/constants/api-endpoints.ts";
import { EDatabaseType } from "@/modules/database-view";
import type {
  IWorkspaceInitResponse,
  TModuleInitializeRequest,
} from "@/modules/workspaces/types/workspaces.types.ts";

export const workspaceApi = {
  getWorkspaces: async (
    params?: GetWorkspacesQuery
  ): Promise<ApiResponse<Workspace[]>> => {
    const response = await apiClient.get(API_ENDPOINTS.WORKSPACES.LIST, {
      params,
    });
    return response.data;
  },

  createWorkspace: async (data: CreateWorkspaceRequest): Promise<Workspace> => {
    const response = await apiClient.post<ApiResponse<Workspace>>(
      API_ENDPOINTS.WORKSPACES.CREATE,
      data
    );
    return response.data.data;
  },

  getWorkspaceById: async (id: string): Promise<Workspace> => {
    const response = await apiClient.get<ApiResponse<Workspace>>(
      API_ENDPOINTS.WORKSPACES.BY_ID(id)
    );
    return response.data.data;
  },

  updateWorkspace: async (
    id: string,
    data: UpdateWorkspaceRequest
  ): Promise<Workspace> => {
    const response = await apiClient.put<ApiResponse<Workspace>>(
      API_ENDPOINTS.WORKSPACES.UPDATE(id),
      data
    );
    return response.data.data;
  },

  deleteWorkspace: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.WORKSPACES.DELETE(id));
  },

  getPrimaryWorkspace: async (): Promise<ApiResponse<Workspace>> => {
    const response = await apiClient.get(API_ENDPOINTS.WORKSPACES.PRIMARY);
    return response?.data;
  },

  getOrCreateDefaultWorkspace: async (
    userInfo?: Record<string, unknown>
  ): Promise<Workspace> => {
    const response = await apiClient.post<ApiResponse<Workspace>>(
      API_ENDPOINTS.WORKSPACES.DEFAULT,
      userInfo
    );
    return response.data.data;
  },

  getWorkspaceStats: async (id: string): Promise<WorkspaceStatsResponse> => {
    const response = await apiClient.get<ApiResponse<WorkspaceStatsResponse>>(
      API_ENDPOINTS.WORKSPACES.STATS_BY_ID(id)
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
    >(API_ENDPOINTS.WORKSPACES.ACCESS(id));
    return response.data.data;
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
};
