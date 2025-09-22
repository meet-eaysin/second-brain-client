// Workspace types that match the server API

export enum EWorkspaceType {
  PERSONAL = "personal",
  TEAM = "team",
  ORGANIZATION = "organization",
  PUBLIC = "public",
}

export enum EWorkspaceMemberRole {
  OWNER = "owner",
  ADMIN = "admin",
  EDITOR = "editor",
  COMMENTER = "commenter",
  VIEWER = "viewer",
}

export type WorkspaceRole = EWorkspaceMemberRole;
export type WorkspacePermission = "read" | "write" | "admin";

// Workspace configuration - matches backend IWorkspaceConfig
export interface WorkspaceConfig {
  // Appearance
  theme?: "light" | "dark" | "auto";
  accentColor?: string;

  // Features
  enableAI: boolean;
  enableComments: boolean;
  enableVersioning: boolean;
  enablePublicSharing: boolean;
  enableGuestAccess: boolean;

  // Limits
  maxDatabases?: number;
  maxMembers?: number;
  storageLimit?: number; // in bytes

  // Integrations
  allowedIntegrations?: string[];

  // Security
  requireTwoFactor: boolean;
  allowedEmailDomains?: string[];
  sessionTimeout?: number; // in minutes
}

// Workspace member permissions - matches backend IWorkspaceMemberPermissions
export interface WorkspaceMemberPermissions {
  canCreateDatabases: boolean;
  canManageMembers: boolean;
  canManageSettings: boolean;
  canManageBilling: boolean;
  canExportData: boolean;
  canDeleteWorkspace: boolean;
  canInviteMembers: boolean;
  canRemoveMembers: boolean;
}

// Workspace member - matches backend IWorkspaceMember
export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: WorkspaceRole;

  // Invitation details
  invitedBy?: string;
  invitedAt?: string;
  invitationAcceptedAt?: string;

  // Activity tracking
  joinedAt: string;
  lastActiveAt?: string;

  // Status
  isActive: boolean;

  // Custom permissions (override role defaults)
  customPermissions?: Partial<WorkspaceMemberPermissions>;

  // Metadata
  notes?: string;

  // User info (when populated)
  user?: {
    id: string;
    email: string;
    username: string;
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
  };
}

// Workspace - matches backend IWorkspace
export interface Workspace {
  id: string;
  name: string;
  description?: string;
  type: EWorkspaceType;

  // Appearance
  icon?: {
    type: "emoji" | "icon" | "image";
    value: string;
  };
  cover?: {
    type: "color" | "gradient" | "image";
    value: string;
  };

  // Settings
  config: WorkspaceConfig;
  isPublic: boolean;
  isArchived: boolean;

  // Ownership
  ownerId: string;

  // Statistics
  memberCount: number;
  databaseCount: number;
  recordCount: number;
  storageUsed: number; // in bytes

  // Metadata
  lastActivityAt?: string;

  // Billing (for team/org workspaces)
  planType?: "free" | "pro" | "team" | "enterprise";
  billingEmail?: string;
  subscriptionId?: string;
  subscriptionStatus?: "active" | "past_due" | "canceled" | "unpaid";
  trialEndsAt?: string;

  // Base entity fields
  createdAt: string;
  updatedAt: string;
  isDeleted?: boolean;
  createdBy?: string;
  updatedBy?: string;
}

export interface WorkspaceWithUserInfo extends Workspace {
  members?: WorkspaceMember[];
}

// Request types
export interface CreateWorkspaceRequest {
  name: string;
  description?: string;
  type: EWorkspaceType;
  icon?: {
    type: "emoji" | "icon" | "image";
    value: string;
  };
  cover?: {
    type: "color" | "gradient" | "image";
    value: string;
  };
  config?: Partial<WorkspaceConfig>;
  isPublic?: boolean;
}

export interface UpdateWorkspaceRequest {
  name?: string;
  description?: string;
  icon?: {
    type: "emoji" | "icon" | "image";
    value: string;
  };
  cover?: {
    type: "color" | "gradient" | "image";
    value: string;
  };
  config?: Partial<WorkspaceConfig>;
  isPublic?: boolean;
  isArchived?: boolean;
  ownerId?: string; // For ownership transfer
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
  operation: "remove" | "update_role";
  userIds: string[];
  role?: WorkspaceRole;
}

// Query types
export interface GetWorkspacesQuery {
  search?: string;
  role?: WorkspaceRole;
  isPublic?: boolean;
  tags?: string[];
  sortBy?:
    | "name"
    | "createdAt"
    | "updatedAt"
    | "lastActivityAt"
    | "memberCount"
    | "databaseCount";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface GetWorkspaceMembersQuery {
  role?: WorkspaceRole;
  search?: string;
  sortBy?: "joinedAt" | "role" | "name";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface SearchWorkspacesQuery {
  q?: string;
  includePublic?: boolean;
  tags?: string[];
  limit?: number;
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
  workspaceId: string;
  memberCount: number;
  databaseCount: number;
  recordCount: number;
  storageUsed: number;
  storageLimit: number;
  lastActivity?: string;
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
  type:
    | "workspace_created"
    | "member_added"
    | "member_removed"
    | "database_created"
    | "database_shared"
    | "settings_updated";
  description: string;
  userId: string;
  userName: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
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
  status: "pending" | "accepted" | "declined" | "expired";
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
  details?: Record<string, unknown>;
}
