import { apiClient } from '@/services/apiClient';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import type {
    User,
    UpdateProfileRequest,
    UpdateUserByAdminRequest,
    BulkUpdateUsersRequest,
    UpdateUserRoleRequest,
    UserStatsResponse,
    PaginatedUsersResponse,
    UserQueryParams,
    UserStatsQueryParams,
    BulkUpdateResponse,
} from '@/types/user.types';
import type { ApiResponse } from '@/types/api.types';

export const userApi = {
    // Get all users (Admin/Moderator only)
    getUsers: async (params?: UserQueryParams): Promise<PaginatedUsersResponse> => {
        const response = await apiClient.get<ApiResponse<PaginatedUsersResponse>>(
            API_ENDPOINTS.USERS.LIST,
            { params }
        );
        return response.data.data;
    },

    // Get current user profile
    getUserProfile: async (): Promise<User> => {
        const response = await apiClient.get<ApiResponse<User>>(
            API_ENDPOINTS.USERS.PROFILE
        );
        return response.data.data;
    },

    // Update current user profile
    updateUserProfile: async (data: UpdateProfileRequest): Promise<User> => {
        const response = await apiClient.put<ApiResponse<User>>(
            API_ENDPOINTS.USERS.PROFILE,
            data
        );
        return response.data.data;
    },

    // Delete current user account
    deleteUserAccount: async (): Promise<void> => {
        await apiClient.delete(API_ENDPOINTS.USERS.PROFILE);
    },

    // Get user by ID (Admin/Moderator only)
    getUserById: async (id: string): Promise<User> => {
        const response = await apiClient.get<ApiResponse<User>>(
            API_ENDPOINTS.USERS.BY_ID(id)
        );
        return response.data.data;
    },

    // Update user by ID (Admin only)
    updateUserById: async (id: string, data: UpdateUserByAdminRequest): Promise<User> => {
        const response = await apiClient.put<ApiResponse<User>>(
            API_ENDPOINTS.USERS.UPDATE(id),
            data
        );
        return response.data.data;
    },

    // Delete user by ID (Admin only)
    deleteUserById: async (id: string): Promise<void> => {
        await apiClient.delete(API_ENDPOINTS.USERS.DELETE(id));
    },

    // Toggle user status (Admin only)
    toggleUserStatus: async (id: string): Promise<User> => {
        const response = await apiClient.patch<ApiResponse<User>>(
            API_ENDPOINTS.USERS.STATUS(id)
        );
        return response.data.data;
    },

    // Update user role (Admin only)
    updateUserRole: async (id: string, data: UpdateUserRoleRequest): Promise<User> => {
        const response = await apiClient.patch<ApiResponse<User>>(
            API_ENDPOINTS.USERS.ROLE(id),
            data
        );
        return response.data.data;
    },

    // Get user statistics (Admin only)
    getUserStats: async (params?: UserStatsQueryParams): Promise<UserStatsResponse> => {
        const response = await apiClient.get<ApiResponse<UserStatsResponse>>(
            API_ENDPOINTS.USERS.STATS,
            { params }
        );
        return response.data.data;
    },

    // Bulk update users (Admin only)
    bulkUpdateUsers: async (data: BulkUpdateUsersRequest): Promise<BulkUpdateResponse> => {
        const response = await apiClient.patch<ApiResponse<BulkUpdateResponse>>(
            API_ENDPOINTS.USERS.BULK_UPDATE,
            data
        );
        return response.data.data;
    },
};
