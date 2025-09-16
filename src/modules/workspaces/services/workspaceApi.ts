import { apiClient } from '@/services/api-client.ts';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import type { ApiResponse } from '@/types/api.types';
import type {
    Workspace,
    WorkspaceWithUserInfo,
    CreateWorkspaceRequest,
    UpdateWorkspaceRequest,
    InviteMemberRequest,
    UpdateMemberRoleRequest,
    TransferOwnershipRequest,
    BulkMemberOperationRequest,
    GetWorkspacesQuery,
    GetWorkspaceMembersQuery,
    SearchWorkspacesQuery,
    WorkspaceListResponse,
    WorkspaceMembersResponse,
    WorkspaceStatsResponse,
    WorkspacePermissions,
    WorkspaceActivity,
} from '@/types/workspace.types';

export const workspaceApi = {
    // Basic workspace operations
    getWorkspaces: async (params?: GetWorkspacesQuery): Promise<WorkspaceListResponse> => {
        const response = await apiClient.get<ApiResponse<WorkspaceListResponse>>(
            API_ENDPOINTS.WORKSPACES.LIST,
            { params }
        );
        return response.data.data;
    },

    createWorkspace: async (data: CreateWorkspaceRequest): Promise<Workspace> => {
        const response = await apiClient.post<ApiResponse<Workspace>>(
            API_ENDPOINTS.WORKSPACES.CREATE,
            data
        );
        return response.data.data;
    },

    getWorkspaceById: async (id: string): Promise<WorkspaceWithUserInfo> => {
        const response = await apiClient.get<ApiResponse<WorkspaceWithUserInfo>>(
            API_ENDPOINTS.WORKSPACES.BY_ID(id)
        );
        return response.data.data;
    },

    updateWorkspace: async (id: string, data: UpdateWorkspaceRequest): Promise<Workspace> => {
        const response = await apiClient.put<ApiResponse<Workspace>>(
            API_ENDPOINTS.WORKSPACES.UPDATE(id),
            data
        );
        return response.data.data;
    },

    deleteWorkspace: async (id: string): Promise<void> => {
        await apiClient.delete(API_ENDPOINTS.WORKSPACES.DELETE(id));
    },

    duplicateWorkspace: async (id: string, name?: string): Promise<Workspace> => {
        const response = await apiClient.post<ApiResponse<Workspace>>(
            API_ENDPOINTS.WORKSPACES.DUPLICATE(id),
            { name }
        );
        return response.data.data;
    },

    leaveWorkspace: async (id: string): Promise<void> => {
        await apiClient.post(API_ENDPOINTS.WORKSPACES.LEAVE(id));
    },

    // Workspace stats and search
    getWorkspaceStats: async (): Promise<WorkspaceStatsResponse> => {
        const response = await apiClient.get<ApiResponse<WorkspaceStatsResponse>>(
            API_ENDPOINTS.WORKSPACES.STATS
        );
        return response.data.data;
    },

    getPublicWorkspaces: async (params?: GetWorkspacesQuery): Promise<WorkspaceListResponse> => {
        const response = await apiClient.get<ApiResponse<WorkspaceListResponse>>(
            API_ENDPOINTS.WORKSPACES.PUBLIC,
            { params }
        );
        return response.data.data;
    },

    searchWorkspaces: async (params: SearchWorkspacesQuery): Promise<WorkspaceListResponse> => {
        const response = await apiClient.get<ApiResponse<WorkspaceListResponse>>(
            API_ENDPOINTS.WORKSPACES.SEARCH,
            { params }
        );
        return response.data.data;
    },

    // Permissions and activity
    getWorkspacePermissions: async (id: string): Promise<WorkspacePermissions> => {
        const response = await apiClient.get<ApiResponse<WorkspacePermissions>>(
            API_ENDPOINTS.WORKSPACES.PERMISSIONS(id)
        );
        return response.data.data;
    },

    getWorkspaceActivity: async (id: string): Promise<WorkspaceActivity[]> => {
        const response = await apiClient.get<ApiResponse<{ activities: WorkspaceActivity[] }>>(
            API_ENDPOINTS.WORKSPACES.ACTIVITY(id)
        );
        return response.data.data.activities;
    },

    // Member management
    getMembers: async (workspaceId: string, params?: GetWorkspaceMembersQuery): Promise<WorkspaceMembersResponse> => {
        const response = await apiClient.get<ApiResponse<WorkspaceMembersResponse>>(
            API_ENDPOINTS.WORKSPACES.MEMBERS(workspaceId),
            { params }
        );
        return response.data.data;
    },

    inviteMember: async (workspaceId: string, data: InviteMemberRequest): Promise<void> => {
        await apiClient.post(
            API_ENDPOINTS.WORKSPACES.INVITE(workspaceId),
            data
        );
    },

    updateMemberRole: async (
        workspaceId: string,
        userId: string,
        data: UpdateMemberRoleRequest
    ): Promise<void> => {
        await apiClient.put(
            API_ENDPOINTS.WORKSPACES.MEMBER_ROLE(workspaceId, userId),
            data
        );
    },

    removeMember: async (workspaceId: string, userId: string): Promise<void> => {
        await apiClient.delete(API_ENDPOINTS.WORKSPACES.MEMBER(workspaceId, userId));
    },

    transferOwnership: async (workspaceId: string, data: TransferOwnershipRequest): Promise<void> => {
        await apiClient.post(
            API_ENDPOINTS.WORKSPACES.TRANSFER_OWNERSHIP(workspaceId),
            data
        );
    },

    bulkMemberOperation: async (workspaceId: string, data: BulkMemberOperationRequest): Promise<void> => {
        await apiClient.post(
            API_ENDPOINTS.WORKSPACES.BULK_MEMBER_OPERATION(workspaceId),
            data
        );
    },
};
