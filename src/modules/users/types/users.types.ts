export type AuthProvider = "LOCAL" | "GOOGLE";

export enum EUserRole {
  ALL = "ALL",
  USER = "USER",
  MODERATOR = "MODERATOR",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  role: EUserRole;
  isActive: boolean;
  authProvider: AuthProvider;
  googleId?: string;
  isEmailVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfile {
  firstName?: string;
  lastName?: string;
  username?: string;
  profilePicture?: string;
}

export interface UpdateUserByAdmin {
  firstName?: string;
  lastName?: string;
  username?: string;
  profilePicture?: string;
  role?: EUserRole;
  isActive?: boolean;
}

export interface BulkUpdateUsers {
  userIds: string[];
  updates: {
    role?: EUserRole;
    isActive?: boolean;
  };
}

export interface UpdateUserRole {
  role: EUserRole;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: EUserRole;
  authProvider?: AuthProvider;
  isActive?: boolean;
  sortBy?: "createdAt" | "updatedAt" | "lastLoginAt" | "email" | "username";
  sortOrder?: "asc" | "desc";
}

export interface UserStatsQueryParams {
  period?: "day" | "week" | "month" | "year";
  startDate?: string;
  endDate?: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  usersByRole: Record<string, number>;
  usersByStatus: Record<string, number>;
}

export interface BulkUpdate {
  updated: number;
  errors?: string[];
}
