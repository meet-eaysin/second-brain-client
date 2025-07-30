// User Management Types
export type UserRole = 'USER' | 'MODERATOR' | 'ADMIN';
export type AuthProvider = 'LOCAL' | 'GOOGLE';

export interface User {
    id: string;
    email: string;
    username: string;
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
    role: UserRole;
    isActive: boolean;
    authProvider: AuthProvider;
    googleId?: string;
    isEmailVerified: boolean;
    lastLoginAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateProfileRequest {
    firstName?: string;
    lastName?: string;
    username?: string;
    profilePicture?: string;
}

export interface UpdateUserByAdminRequest {
    firstName?: string;
    lastName?: string;
    username?: string;
    profilePicture?: string;
    role?: UserRole;
    isActive?: boolean;
}

export interface BulkUpdateUsersRequest {
    userIds: string[];
    updates: {
        role?: UserRole;
        isActive?: boolean;
    };
}

export interface UpdateUserRoleRequest {
    role: UserRole;
}

// User Statistics
export interface UserStatsResponse {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    usersByRole: {
        USER: number;
        MODERATOR: number;
        ADMIN: number;
    };
    usersByProvider: {
        LOCAL: number;
        GOOGLE: number;
    };
    recentActivity: Array<{
        date: string;
        count: number;
    }>;
}

// Paginated Users Response
export interface PaginatedUsersResponse {
    users: User[];
    total: number;
    totalPages: number;
    currentPage: number;
}

// User Query Parameters
export interface UserQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    role?: UserRole;
    authProvider?: AuthProvider;
    isActive?: boolean;
    sortBy?: 'createdAt' | 'updatedAt' | 'lastLoginAt' | 'email' | 'username';
    sortOrder?: 'asc' | 'desc';
}

// User Stats Query Parameters
export interface UserStatsQueryParams {
    period?: 'day' | 'week' | 'month' | 'year';
    startDate?: string;
    endDate?: string;
}

// Bulk Update Response
export interface BulkUpdateResponse {
    updated: number;
    errors: string[];
}
