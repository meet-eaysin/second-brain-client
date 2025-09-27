import { apiClient } from "@/services/api-client.ts";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { ApiResponse } from "@/types/api.types";
import type {
  BulkUpdate,
  BulkUpdateUsers,
  UpdateProfile,
  UpdateUserByAdmin,
  UpdateUserRole,
  User,
  UserQueryParams,
  UserStats,
  UserStatsQueryParams
} from "@/modules/users/types/users.types.ts";

export const userApi = {
  getUsers: async (
    params?: UserQueryParams
  ): Promise<ApiResponse<User[]>> => {
    const response = await apiClient.get<ApiResponse<User[]>>(
      API_ENDPOINTS.USERS.LIST,
      { params }
    );
    return response.data;
  },

  // Get current user profile
  getUserProfile: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>(
      API_ENDPOINTS.USERS.PROFILE
    );
    return response.data;
  },

  // Update current user profile
  updateUserProfile: async (
    data: UpdateProfile
  ): Promise<ApiResponse<User>> => {
    const response = await apiClient.put<ApiResponse<User>>(
      API_ENDPOINTS.USERS.PROFILE,
      data
    );
    return response.data;
  },

  // Delete current user account
  deleteUserAccount: async (): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.USERS.PROFILE);
  },

  // Get user by ID (Admin/Moderator only)
  getUserById: async (id: string): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>(
      API_ENDPOINTS.USERS.BY_ID(id)
    );
    return response.data;
  },

  // Update user by ID (Admin only)
  updateUserById: async (
    id: string,
    data: UpdateUserByAdmin
  ): Promise<ApiResponse<User>> => {
    const response = await apiClient.put<ApiResponse<User>>(
      API_ENDPOINTS.USERS.UPDATE(id),
      data
    );
    return response.data;
  },

  // Delete user by ID (Admin only)
  deleteUserById: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.USERS.DELETE(id));
  },

  // Toggle user status (Admin only)
  toggleUserStatus: async (id: string): Promise<ApiResponse<User>> => {
    const response = await apiClient.patch<ApiResponse<User>>(
      API_ENDPOINTS.USERS.STATUS(id)
    );
    return response.data;
  },

  // Update user role (Admin only)
  updateUserRole: async (
    id: string,
    data: UpdateUserRole
  ): Promise<ApiResponse<User>> => {
    const response = await apiClient.patch<ApiResponse<User>>(
      API_ENDPOINTS.USERS.ROLE(id),
      data
    );
    return response.data;
  },

  // Get user statistics (Admin only)
  getUserStats: async (
    params?: UserStatsQueryParams
  ): Promise<ApiResponse<UserStats>> => {
    const response = await apiClient.get<ApiResponse<UserStats>>(
      API_ENDPOINTS.USERS.STATS,
      { params }
    );
    return response.data;
  },

  // Bulk update users (Admin only)
  bulkUpdateUsers: async (
    data: BulkUpdateUsers
  ): Promise<ApiResponse<BulkUpdate>> => {
    const response = await apiClient.patch<ApiResponse<BulkUpdate>>(
      API_ENDPOINTS.USERS.BULK_UPDATE,
      data
    );
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>(
      API_ENDPOINTS.USERS.PROFILE
    );
    return response.data;
  },

  updateProfile: async (
    data: UpdateProfile
  ): Promise<ApiResponse<User>> => {
    const response = await apiClient.put<ApiResponse<User>>(
      API_ENDPOINTS.USERS.PROFILE,
      data
    );
    return response.data;
  },

  deleteAccount: async (): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.USERS.PROFILE);
  },

  // Avatar management
  uploadAvatar: async (file: File): Promise<ApiResponse<User>> => {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await apiClient.post<ApiResponse<User>>(
      `${API_ENDPOINTS.USERS.PROFILE}/avatar`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  deleteAvatar: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.delete<ApiResponse<User>>(
      `${API_ENDPOINTS.USERS.PROFILE}/avatar`
    );
    return response.data;
  },




  updateUser: async (
    id: string,
    data: Partial<User>
  ): Promise<ApiResponse<User>> => {
    const response = await apiClient.put<ApiResponse<User>>(
      API_ENDPOINTS.USERS.UPDATE(id),
      data
    );
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.USERS.DELETE(id));
  },




};
