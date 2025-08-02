import { apiClient } from '@/services/api-client.ts';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import type { ApiResponse } from '@/types/api.types';

export interface Workspace {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    ownerId: string;
    members: WorkspaceMember[];
    settings: WorkspaceSettings;
    isPersonal: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface WorkspaceMember {
    id: string;
    userId: string;
    workspaceId: string;
    role: 'owner' | 'admin' | 'member' | 'viewer';
    permissions: string[];
    joinedAt: string;
    user: {
        id: string;
        email: string;
        username: string;
        firstName?: string;
        lastName?: string;
        profilePicture?: string;
    };
}

export interface WorkspaceSettings {
    allowMemberInvites: boolean;
    defaultPermissions: string[];
    requireApprovalForJoining: boolean;
    allowPublicDatabases: boolean;
}

export interface CreateWorkspaceRequest {
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    settings?: Partial<WorkspaceSettings>;
}

export interface UpdateWorkspaceRequest {
    name?: string;
    description?: string;
    icon?: string;
    color?: string;
    settings?: Partial<WorkspaceSettings>;
}

export interface InviteMemberRequest {
    email: string;
    role: 'admin' | 'member' | 'viewer';
    permissions?: string[];
    message?: string;
}

export interface UpdateMemberRequest {
    role?: 'admin' | 'member' | 'viewer';
    permissions?: string[];
}

export const workspaceApi = {
    getWorkspaces: async (): Promise<Workspace[]> => {
        const response = await apiClient.get<ApiResponse<{ workspaces: Workspace[] }>>(
            API_ENDPOINTS.WORKSPACES.LIST
        );
        return response.data.data.workspaces;
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

    getMembers: async (workspaceId: string): Promise<WorkspaceMember[]> => {
        const response = await apiClient.get<ApiResponse<{ members: WorkspaceMember[] }>>(
            API_ENDPOINTS.WORKSPACES.MEMBERS(workspaceId)
        );
        return response.data.data.members;
    },

    inviteMember: async (workspaceId: string, data: InviteMemberRequest): Promise<WorkspaceMember> => {
        const response = await apiClient.post<ApiResponse<WorkspaceMember>>(
            API_ENDPOINTS.WORKSPACES.INVITE(workspaceId),
            data
        );
        return response.data.data;
    },

    updateMember: async (
        workspaceId: string, 
        userId: string, 
        data: UpdateMemberRequest
    ): Promise<WorkspaceMember> => {
        const response = await apiClient.put<ApiResponse<WorkspaceMember>>(
            API_ENDPOINTS.WORKSPACES.MEMBER(workspaceId, userId),
            data
        );
        return response.data.data;
    },

    removeMember: async (workspaceId: string, userId: string): Promise<void> => {
        await apiClient.delete(API_ENDPOINTS.WORKSPACES.MEMBER(workspaceId, userId));
    },

    leaveWorkspace: async (workspaceId: string): Promise<void> => {
        await apiClient.post(API_ENDPOINTS.WORKSPACES.LEAVE(workspaceId));
    },
};
