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


export interface WorkspaceStatsResponse {
  workspaceId: string;
  memberCount: number;
  databaseCount: number;
  recordCount: number;
  storageUsed: number;
  storageLimit: number;
  lastActivity?: string;
}

