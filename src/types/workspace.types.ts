// Workspace types that match the server API

export type WorkspaceRole = 'owner' | 'admin' | 'editor' | 'viewer';
export type WorkspacePermission = 'read' | 'write' | 'admin';

export interface WorkspaceMember {
    userId: string;
    role: WorkspaceRole;
    joinedAt: string;
    invitedBy: string;
}

export interface Workspace {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    cover?: string;
    
    // Ownership and permissions
    ownerId: string;
    members: WorkspaceMember[];
    
    // Settings
    isPublic: boolean;
    allowMemberInvites: boolean;
    defaultDatabasePermission: WorkspacePermission;
    
    // Organization
    color?: string;
    tags?: string[];
    
    // Statistics
    databaseCount?: number;
    memberCount?: number;
    lastActivityAt?: string;
    
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    lastEditedBy: string;
}

export interface WorkspaceWithUserInfo extends Workspace {
    members: (WorkspaceMember & {
        user: {
            id: string;
            email: string;
            username: string;
            firstName?: string;
            lastName?: string;
            profilePicture?: string;
        };
    })[];
}

// Request types
export interface CreateWorkspaceRequest {
    name: string;
    description?: string;
    icon?: string;
    cover?: string;
    isPublic?: boolean;
    allowMemberInvites?: boolean;
    defaultDatabasePermission?: WorkspacePermission;
    color?: string;
    tags?: string[];
}

export interface UpdateWorkspaceRequest {
    name?: string;
    description?: string;
    icon?: string;
    cover?: string;
    isPublic?: boolean;
    allowMemberInvites?: boolean;
    defaultDatabasePermission?: WorkspacePermission;
    color?: string;
    tags?: string[];
}

export interface InviteMemberRequest {
    email?: string;
    userId?: string;
    role: WorkspaceRole;
    message?: string;
}

export interface UpdateMemberRoleRequest {
    role: WorkspaceRole;
}

export interface TransferOwnershipRequest {
    newOwnerId: string;
}

export interface BulkMemberOperationRequest {
    operation: 'remove' | 'update_role';
    userIds: string[];
    role?: WorkspaceRole;
}

// Query types
export interface GetWorkspacesQuery {
    search?: string;
    role?: WorkspaceRole;
    isPublic?: boolean;
    tags?: string[];
    sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'lastActivityAt' | 'memberCount' | 'databaseCount';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

export interface GetWorkspaceMembersQuery {
    role?: WorkspaceRole;
    search?: string;
    sortBy?: 'joinedAt' | 'role' | 'name';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

export interface SearchWorkspacesQuery {
    q?: string;
    includePublic?: boolean;
    tags?: string[];
    limit?: number;
}

// Response types
export interface WorkspaceListResponse {
    workspaces: Workspace[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface WorkspaceMembersResponse {
    members: (WorkspaceMember & {
        user: {
            id: string;
            email: string;
            username: string;
            firstName?: string;
            lastName?: string;
            profilePicture?: string;
        };
    })[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface WorkspaceStatsResponse {
    totalWorkspaces: number;
    ownedWorkspaces: number;
    memberWorkspaces: number;
    totalDatabases: number;
    totalMembers: number;
    recentActivity: WorkspaceActivity[];
}

export interface WorkspacePermissions {
    canEdit: boolean;
    canDelete: boolean;
    canManageMembers: boolean;
    canCreateDatabases: boolean;
    canManageSettings: boolean;
    canTransferOwnership: boolean;
    canLeave: boolean;
}

export interface WorkspaceActivity {
    id: string;
    type: 'workspace_created' | 'member_added' | 'member_removed' | 'database_created' | 'database_shared' | 'settings_updated';
    description: string;
    userId: string;
    userName: string;
    timestamp: string;
    metadata?: Record<string, any>;
}

// Settings types
export interface WorkspaceSettings {
    general: {
        name: string;
        description?: string;
        icon?: string;
        cover?: string;
        color?: string;
        tags?: string[];
    };
    privacy: {
        isPublic: boolean;
        allowMemberInvites: boolean;
        defaultDatabasePermission: WorkspacePermission;
    };
    advanced: {
        allowGuestAccess?: boolean;
        requireTwoFactor?: boolean;
        dataRetentionDays?: number;
    };
}

// Invitation types
export interface WorkspaceInvitation {
    id: string;
    workspaceId: string;
    workspaceName: string;
    inviterName: string;
    inviterEmail: string;
    inviteeEmail: string;
    role: WorkspaceRole;
    message?: string;
    status: 'pending' | 'accepted' | 'declined' | 'expired';
    expiresAt: string;
    createdAt: string;
}

export interface CreateInvitationRequest {
    emails: string[];
    role: WorkspaceRole;
    message?: string;
    expiresInDays?: number;
}

// Error types
export interface WorkspaceError {
    code: string;
    message: string;
    details?: Record<string, any>;
}
