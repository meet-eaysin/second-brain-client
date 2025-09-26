import { apiClient } from "@/services/api-client";

// Types for API responses
export interface AdminDashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalDatabases: number;
  totalNotes: number;
  systemHealth: "Good" | "Warning" | "Critical";
  recentActivity: number;
  growthRate: number;
  uptime: number;
}

export interface AdminUserStats {
  total: number;
  active: number;
  admins: number;
  moderators: number;
  users: number;
}

export interface SystemHealthMetrics {
  status: "Good" | "Warning" | "Critical";
  uptime: number;
  lastBackup: string;
  responseTime: number;
  errorRate: number;
}

export interface AdminUser {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: "user" | "moderator" | "admin" | "super_admin";
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface AdminUsersResponse {
  users: AdminUser[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SetupStatusResponse {
  setupNeeded: boolean;
  message: string;
}

export interface CreateSuperAdminRequest {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  setupToken?: string;
}

export interface CreateSuperAdminResponse {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
}

// Admin API functions
export const adminApi = {
  // Setup related
  checkSetupStatus: async (): Promise<SetupStatusResponse> => {
    const response = await apiClient.get("/admin/setup/status");
    return response.data.data;
  },

  createInitialSuperAdmin: async (
    data: CreateSuperAdminRequest
  ): Promise<CreateSuperAdminResponse> => {
    const response = await apiClient.post("/admin/setup/super-admin", data);
    return response.data.data;
  },

  // Dashboard related
  getDashboardStats: async (): Promise<AdminDashboardStats> => {
    const response = await apiClient.get("/admin/dashboard/stats");
    return response.data.data;
  },

  getSystemHealth: async (): Promise<SystemHealthMetrics> => {
    const response = await apiClient.get("/admin/dashboard/health");
    return response.data.data;
  },

  // User management
  getUserStats: async (): Promise<AdminUserStats> => {
    const response = await apiClient.get("/admin/users/stats");
    return response.data.data;
  },

  getUsers: async (params?: {
    page?: number;
    limit?: number;
    role?: "user" | "moderator" | "admin" | "super_admin";
    isActive?: boolean;
    search?: string;
  }): Promise<AdminUsersResponse> => {
    const response = await apiClient.get("/admin/users", { params });
    return response.data.data;
  },

  updateUserRole: async (
    userId: string,
    role: "user" | "moderator" | "admin" | "super_admin"
  ) => {
    const response = await apiClient.patch(`/admin/users/${userId}/role`, {
      role,
    });
    return response.data.data;
  },

  toggleUserStatus: async (userId: string) => {
    const response = await apiClient.patch(`/admin/users/${userId}/status`);
    return response.data.data;
  },

  deleteUser: async (userId: string) => {
    const response = await apiClient.delete(`/admin/users/${userId}`);
    return response.data.data;
  },

  createSuperAdmin: async (
    data: Omit<CreateSuperAdminRequest, "setupToken">
  ): Promise<CreateSuperAdminResponse> => {
    const response = await apiClient.post("/admin/super-admin", data);
    return response.data.data;
  },

  // Profile
  getCurrentAdminProfile: async () => {
    const response = await apiClient.get("/admin/profile");
    return response.data.data;
  },
};
