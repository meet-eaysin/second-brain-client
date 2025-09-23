import { apiClient } from "@/services/api-client";
import type { ApiResponse } from "@/types/api.types";
import type {
  IDashboardOverview,
  IDashboardStats,
  IDashboardQueryParams,
} from "../types/dashboard.types";

export const dashboardApi = {
  // Get dashboard overview
  getDashboardOverview: async (
    params?: IDashboardQueryParams
  ): Promise<IDashboardOverview> => {
    const response = await apiClient.get<ApiResponse<IDashboardOverview>>(
      "/dashboard",
      {
        params,
      }
    );
    return response.data.data!;
  },

  // Get dashboard statistics (with trends and insights)
  getDashboardStats: async (
    params?: IDashboardQueryParams
  ): Promise<IDashboardStats> => {
    const response = await apiClient.get<ApiResponse<IDashboardStats>>(
      "/dashboard/stats",
      {
        params,
      }
    );
    return response.data.data!;
  },

  // Get recent activity feed
  getRecentActivity: async (limit = 20): Promise<any[]> => {
    const response = await apiClient.get<ApiResponse<any[]>>(
      "/dashboard/activity",
      {
        params: { limit },
      }
    );
    return response.data.data || [];
  },

  // Get quick statistics
  getQuickStats: async (): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>(
      "/dashboard/quick-stats"
    );
    return response.data.data!;
  },

  // Get upcoming tasks
  getUpcomingTasks: async (limit = 10): Promise<any[]> => {
    const response = await apiClient.get<ApiResponse<any[]>>(
      "/dashboard/upcoming-tasks",
      {
        params: { limit },
      }
    );
    return response.data.data || [];
  },

  // Get recent notes
  getRecentNotes: async (limit = 10): Promise<any[]> => {
    const response = await apiClient.get<ApiResponse<any[]>>(
      "/dashboard/recent-notes",
      {
        params: { limit },
      }
    );
    return response.data.data || [];
  },

  // Get goal progress
  getGoalProgress: async (): Promise<any[]> => {
    const response = await apiClient.get<ApiResponse<any[]>>(
      "/dashboard/goal-progress"
    );
    return response.data.data || [];
  },

  // Get habit streaks
  getHabitStreaks: async (): Promise<any[]> => {
    const response = await apiClient.get<ApiResponse<any[]>>(
      "/dashboard/habit-streaks"
    );
    return response.data.data || [];
  },

  // Get finance summary
  getFinanceSummary: async (period = "month"): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>(
      "/dashboard/finance-summary",
      {
        params: { period },
      }
    );
    return response.data.data!;
  },
};
