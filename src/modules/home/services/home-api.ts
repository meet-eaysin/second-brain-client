import { apiClient } from "@/services/api-client.ts";
import type { ApiResponse } from "@/types/api.types";
import type {
  IDashboardOverview,
  IDashboardStats,
  IDashboardQueryParams,
  IActivityFeedItem,
  IUpcomingTask,
  IRecentNote,
  IGoalProgress,
  IHabitStreak,
  IFinanceSummary,
  IQuickStats,
  IWorkspaceStats,
} from "../types/dashboard.types";
import type { ICalendarEvent } from "@/modules/calendar/types/calendar.types";

export const dashboardApi = {
  // Get dashboard overview
  getDashboardOverview: async (
    params?: IDashboardQueryParams
  ): Promise<IDashboardOverview> => {
    const response = await apiClient.get<ApiResponse<IDashboardOverview>>(
      "/dashboard",
      { params }
    );
    return response.data.data;
  },

  // Get dashboard statistics (detailed)
  getDashboardStats: async (
    params?: IDashboardQueryParams
  ): Promise<IDashboardStats> => {
    const response = await apiClient.get<ApiResponse<IDashboardStats>>(
      "/dashboard/stats",
      { params }
    );
    return response.data.data;
  },

  // Get recent activity feed
  getRecentActivity: async (params?: {
    limit?: number;
  }): Promise<IActivityFeedItem[]> => {
    const response = await apiClient.get<ApiResponse<IActivityFeedItem[]>>(
      "/dashboard/activity",
      { params }
    );
    return response.data.data;
  },

  // Get quick statistics
  getQuickStats: async (): Promise<IQuickStats> => {
    const response = await apiClient.get<ApiResponse<IQuickStats>>(
      "/dashboard/quick-stats"
    );
    return response.data.data;
  },

  // Get upcoming tasks
  getUpcomingTasks: async (params?: {
    limit?: number;
  }): Promise<IUpcomingTask[]> => {
    const response = await apiClient.get<ApiResponse<IUpcomingTask[]>>(
      "/dashboard/upcoming-tasks",
      { params }
    );
    return response.data.data;
  },

  // Get recent notes
  getRecentNotes: async (params?: {
    limit?: number;
  }): Promise<IRecentNote[]> => {
    const response = await apiClient.get<ApiResponse<IRecentNote[]>>(
      "/dashboard/recent-notes",
      { params }
    );
    return response.data.data;
  },

  // Get goal progress
  getGoalProgress: async (): Promise<IGoalProgress[]> => {
    const response = await apiClient.get<ApiResponse<IGoalProgress[]>>(
      "/dashboard/goal-progress"
    );
    return response.data.data;
  },

  // Get habit streaks
  getHabitStreaks: async (): Promise<IHabitStreak[]> => {
    const response = await apiClient.get<ApiResponse<IHabitStreak[]>>(
      "/dashboard/habit-streaks"
    );
    return response.data.data;
  },

  // Get finance summary
  getFinanceSummary: async (params?: {
    period?: string;
  }): Promise<IFinanceSummary> => {
    const response = await apiClient.get<ApiResponse<IFinanceSummary>>(
      "/dashboard/finance-summary",
      { params }
    );
    return response.data.data;
  },

  // Get upcoming events
  getUpcomingEvents: async (params?: {
    limit?: number;
  }): Promise<ICalendarEvent[]> => {
    const response = await apiClient.get<ApiResponse<ICalendarEvent[]>>(
      "/calendar/events/upcoming",
      { params }
    );
    return response.data.data;
  },
};
