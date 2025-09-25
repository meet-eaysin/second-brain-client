import { apiClient } from "@/services/api-client.ts";
import type { ApiResponse } from "@/types/api.types.ts";
import type {
  Workspace,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  WorkspaceStatsResponse,
  GetWorkspacesQuery,
  SearchWorkspacesQuery,
  GetWorkspaceMembersQuery,
  InviteMemberRequest,
  UpdateMemberRoleRequest,
  TransferOwnershipRequest,
  BulkMemberOperationRequest,
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
  createWorkspace: async (data: CreateWorkspaceRequest): Promise<Workspace> => {
    const response = await apiClient.post<ApiResponse<Workspace>>(
      API_ENDPOINTS.WORKSPACES.BASE,
      data
    );
    return response.data.data!;
  },

  // Get workspace by ID (current workspace)
  getCurrentWorkspace: async (): Promise<ApiResponse<Workspace>> => {
    const response = await apiClient.get<ApiResponse<Workspace>>(
      API_ENDPOINTS.WORKSPACES.CURRENT
    );
    return response.data;
  },

  // Update current workspace
  updateCurrentWorkspace: async (
    data: UpdateWorkspaceRequest
  ): Promise<Workspace> => {
    const response = await apiClient.put<ApiResponse<Workspace>>(
      API_ENDPOINTS.WORKSPACES.CURRENT,
      data
    );
    return response.data.data!;
  },

  // Delete current workspace
  deleteCurrentWorkspace: async (): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.WORKSPACES.CURRENT);
  },

  // Get workspace statistics
  getCurrentWorkspaceStats: async (): Promise<WorkspaceStatsResponse> => {
    const response = await apiClient.get<ApiResponse<WorkspaceStatsResponse>>(
      API_ENDPOINTS.WORKSPACES.CURRENT_STATS
    );
    return response.data.data!;
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
    return response.data.data!;
  },

  // Get primary workspace
  getPrimaryWorkspace: async (): Promise<Workspace> => {
    const response = await apiClient.get<ApiResponse<Workspace>>(
      API_ENDPOINTS.WORKSPACES.PRIMARY
    );
    return response.data.data!;
  },

  // Get or create default workspace
  getOrCreateDefaultWorkspace: async (
    userInfo?: Record<string, unknown>
  ): Promise<Workspace> => {
    const response = await apiClient.post<ApiResponse<Workspace>>(
      API_ENDPOINTS.WORKSPACES.DEFAULT,
      userInfo
    );
    return response.data.data!;
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

  // Update workspace by ID
  updateWorkspace: async (
    id: string,
    data: UpdateWorkspaceRequest
  ): Promise<Workspace> => {
    const response = await apiClient.put<ApiResponse<Workspace>>(
      API_ENDPOINTS.WORKSPACES.BY_ID(id),
      data
    );
    return response.data.data!;
  },

  // Delete workspace by ID
  deleteWorkspace: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.WORKSPACES.BY_ID(id));
  },

  // Duplicate workspace
  duplicateWorkspace: async (
    _id: string,
    name?: string
  ): Promise<Workspace> => {
    const response = await apiClient.post<ApiResponse<Workspace>>(
      API_ENDPOINTS.WORKSPACES.DUPLICATE,
      { name }
    );
    return response.data.data!;
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

  // Get workspace members
  getMembers: async (
    _workspaceId: string,
    params?: GetWorkspaceMembersQuery
  ): Promise<ApiResponse<unknown[]>> => {
    const response = await apiClient.get(API_ENDPOINTS.WORKSPACES.MEMBERS, {
      params,
    });
    return response.data;
  },

  // Get workspace permissions
  getWorkspacePermissions: async (): Promise<ApiResponse<unknown>> => {
    const response = await apiClient.get(API_ENDPOINTS.WORKSPACES.PERMISSIONS);
    return response.data;
  },

  // Get workspace activity
  getWorkspaceActivity: async (): Promise<ApiResponse<unknown[]>> => {
    const response = await apiClient.get(API_ENDPOINTS.WORKSPACES.ACTIVITY);
    return response.data;
  },

  // Invite member
  inviteMember: async (
    data: InviteMemberRequest
  ): Promise<ApiResponse<unknown>> => {
    const response = await apiClient.post(
      API_ENDPOINTS.WORKSPACES.INVITE,
      data
    );
    return response.data;
  },

  // Update member role
  updateMemberRole: async (
    _workspaceId: string,
    userId: string,
    data: UpdateMemberRoleRequest
  ): Promise<ApiResponse<unknown>> => {
    const response = await apiClient.put(
      API_ENDPOINTS.WORKSPACES.MEMBER_ROLE(userId),
      data
    );
    return response.data;
  },

  // Remove member
  removeMember: async (_workspaceId: string, userId: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.WORKSPACES.MEMBER_ROLE(userId));
  },

  // Transfer ownership
  transferOwnership: async (
    _workspaceId: string,
    data: TransferOwnershipRequest
  ): Promise<ApiResponse<unknown>> => {
    const response = await apiClient.post(
      API_ENDPOINTS.WORKSPACES.TRANSFER_OWNERSHIP,
      data
    );
    return response.data;
  },

  // Bulk member operation
  bulkMemberOperation: async (
    _workspaceId: string,
    data: BulkMemberOperationRequest
  ): Promise<ApiResponse<unknown>> => {
    const response = await apiClient.post(
      API_ENDPOINTS.WORKSPACES.BULK_MEMBER_OPERATION,
      data
    );
    return response.data;
  },
};
