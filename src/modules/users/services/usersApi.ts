import type { ApiResponse } from "@/types/api.types";
import { apiClient } from "@/services/api-client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "moderator" | "user";
  status: "active" | "inactive" | "suspended";
  isActive: boolean;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
}

export interface GetUsersQuery {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface UsersListResponse {
  users: User[];
  total: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  usersByRole: Record<string, number>;
  usersByStatus: Record<string, number>;
}

export const usersApi = {
  // Profile management
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>(
      API_ENDPOINTS.USERS.PROFILE
    );
    return response.data;
  },

  updateProfile: async (
    data: UpdateProfileRequest
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

  // Admin/Moderator functions
  getUsers: async (
    params?: GetUsersQuery
  ): Promise<ApiResponse<UsersListResponse>> => {
    const response = await apiClient.get<ApiResponse<UsersListResponse>>(
      API_ENDPOINTS.USERS.LIST,
      { params }
    );
    return response.data;
  },

  getUserById: async (id: string): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>(
      API_ENDPOINTS.USERS.BY_ID(id)
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

  toggleUserStatus: async (id: string): Promise<ApiResponse<User>> => {
    const response = await apiClient.patch<ApiResponse<User>>(
      API_ENDPOINTS.USERS.STATUS(id)
    );
    return response.data;
  },

  updateUserRole: async (
    id: string,
    role: string
  ): Promise<ApiResponse<User>> => {
    const response = await apiClient.patch<ApiResponse<User>>(
      API_ENDPOINTS.USERS.ROLE(id),
      { role }
    );
    return response.data;
  },

  // Bulk operations
  bulkUpdateUsers: async (
    userIds: string[],
    updates: Partial<User>
  ): Promise<void> => {
    await apiClient.patch(API_ENDPOINTS.USERS.BULK_UPDATE, {
      userIds,
      updates,
    });
  },

  // Statistics
  getUserStats: async (): Promise<ApiResponse<UserStats>> => {
    const response = await apiClient.get<ApiResponse<UserStats>>(
      API_ENDPOINTS.USERS.STATS
    );
    return response.data;
  },
};
