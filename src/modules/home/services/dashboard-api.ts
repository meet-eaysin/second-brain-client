import { apiClient } from "@/services/api-client";
import type { ApiResponse } from "@/types/api.types";
import type {
  IDashboardOverview,
  IDashboardStats,
  IDashboardQueryParams,
  IRecentlyVisitedItem,
} from "../types";

export const dashboardApi = {
  // Get dashboard overview
  getDashboardOverview: async (
    params?: IDashboardQueryParams
  ): Promise<ApiResponse<IDashboardOverview>> => {
    const response = await apiClient.get<ApiResponse<IDashboardOverview>>(
      "/dashboard",
      {
        params,
      }
    );
    return response.data!;
  },

  // Get dashboard statistics (with trends and insights)
  getDashboardStats: async (
    params?: IDashboardQueryParams
  ): Promise<ApiResponse<IDashboardStats>> => {
    const response = await apiClient.get<ApiResponse<IDashboardStats>>(
      "/dashboard/stats",
      {
        params,
      }
    );
    return response.data!;
  },

  getRecentActivity: async (limit = 20): Promise<ApiResponse<unknown>> => {
    const response = await apiClient.get<ApiResponse<unknown[]>>(
      "/dashboard/activity",
      {
        params: { limit },
      }
    );
    return response.data || [];
  },

  // Get quick statistics
  getQuickStats: async (): Promise<ApiResponse<unknown>> => {
    const response = await apiClient.get<ApiResponse<unknown>>(
      "/dashboard/quick-stats"
    );
    return response.data!;
  },

  // Get upcoming tasks
  getUpcomingTasks: async (limit = 10): Promise<ApiResponse<unknown[]>> => {
    const response = await apiClient.get<ApiResponse<unknown[]>>(
      "/dashboard/upcoming-tasks",
      {
        params: { limit },
      }
    );
    return response.data!;
  },

  // Get recent notes
  getRecentNotes: async (limit = 10): Promise<ApiResponse<unknown[]>> => {
    const response = await apiClient.get<ApiResponse<unknown[]>>(
      "/dashboard/recent-notes",
      {
        params: { limit },
      }
    );
    return response.data!;
  },

  // Get goal progress
  getGoalProgress: async (): Promise<ApiResponse<unknown[]>> => {
    const response = await apiClient.get<ApiResponse<unknown[]>>(
      "/dashboard/goal-progress"
    );
    return response.data!;
  },

  // Get habit streaks
  getHabitStreaks: async (): Promise<ApiResponse<unknown[]>> => {
    const response = await apiClient.get<ApiResponse<unknown[]>>(
      "/dashboard/habit-streaks"
    );
    return response.data!;
  },

  // Get finance summary
  getFinanceSummary: async (period = "month"): Promise<ApiResponse<unknown>> => {
    const response = await apiClient.get<ApiResponse<unknown>>(
      "/dashboard/finance-summary",
      {
        params: { period },
      }
    );
    return response.data!;
  },

  // Get recently visited items
  getRecentlyVisited: async (limit = 8): Promise<IRecentlyVisitedItem[]> => {
    const response = await apiClient.get<ApiResponse<IRecentlyVisitedItem[]>>(
      "/dashboard/recently-visited",
      {
        params: { limit },
      }
    );
    return response.data.data || [];
  },
};
