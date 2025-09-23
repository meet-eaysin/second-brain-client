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
import type {
  IActivity,
  IActivityQueryOptions,
  IActivityAnalytics,
  IActivitySummary,
  IAuditTrail,
  ISecurityEvent,
  IComplianceReport,
  IActivityHeatmap,
  IAnalyticsDashboard,
  IAnalyticsSummary,
  IAnalyticsInsights,
  IProductivityAnalytics,
  ITaskAnalytics,
  ITimeTrackingAnalytics,
  IGoalAnalytics,
  IFinanceAnalytics,
  IContentAnalytics,
  IWorkspaceAnalytics,
  IAnalyticsQueryParams,
} from "../types/system.types";

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

export const systemApi = {
  // Activity APIs
  getActivities: async (
    params?: IActivityQueryOptions
  ): Promise<IActivity[]> => {
    const response = await apiClient.get<ApiResponse<IActivity[]>>(
      "/system/activity",
      { params }
    );
    return response.data.data;
  },

  getRecentActivityFeed: async (params?: {
    limit?: number;
  }): Promise<IActivity[]> => {
    const response = await apiClient.get<ApiResponse<IActivity[]>>(
      "/system/activity/feed",
      { params }
    );
    return response.data.data;
  },

  getUserActivitySummary: async (): Promise<IActivitySummary> => {
    const response = await apiClient.get<ApiResponse<IActivitySummary>>(
      "/system/activity/summary"
    );
    return response.data.data;
  },

  getActivityAnalytics: async (
    params?: IActivityQueryOptions
  ): Promise<IActivityAnalytics> => {
    const response = await apiClient.get<ApiResponse<IActivityAnalytics>>(
      "/system/activity/analytics",
      { params }
    );
    return response.data.data;
  },

  getActivityById: async (id: string): Promise<IActivity> => {
    const response = await apiClient.get<ApiResponse<IActivity>>(
      `/system/activity/${id}`
    );
    return response.data.data;
  },

  getWorkspaceActivityOverview: async (): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>(
      "/system/activity/workspace/overview"
    );
    return response.data.data;
  },

  generateAuditTrail: async (params?: any): Promise<IAuditTrail> => {
    const response = await apiClient.get<ApiResponse<IAuditTrail>>(
      "/system/activity/audit",
      { params }
    );
    return response.data.data;
  },

  getSecurityEvents: async (params?: any): Promise<ISecurityEvent[]> => {
    const response = await apiClient.get<ApiResponse<ISecurityEvent[]>>(
      "/system/activity/security",
      { params }
    );
    return response.data.data;
  },

  getComplianceReport: async (params?: {
    period?: string;
  }): Promise<IComplianceReport> => {
    const response = await apiClient.get<ApiResponse<IComplianceReport>>(
      "/system/activity/compliance",
      { params }
    );
    return response.data.data;
  },

  exportAuditData: async (params?: any): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>(
      "/system/activity/export",
      { params }
    );
    return response.data.data;
  },

  getActivityHeatmap: async (params?: {
    period?: string;
  }): Promise<IActivityHeatmap> => {
    const response = await apiClient.get<ApiResponse<IActivityHeatmap>>(
      "/system/activity/heatmap",
      { params }
    );
    return response.data.data;
  },

  // Analytics APIs
  getAnalyticsDashboard: async (
    params?: IAnalyticsQueryParams
  ): Promise<IAnalyticsDashboard> => {
    const response = await apiClient.get<ApiResponse<IAnalyticsDashboard>>(
      "/system/analytics/dashboard",
      { params }
    );
    return response.data.data;
  },

  getAnalyticsSummary: async (
    params?: IAnalyticsQueryParams
  ): Promise<IAnalyticsSummary> => {
    const response = await apiClient.get<ApiResponse<IAnalyticsSummary>>(
      "/system/analytics/summary",
      { params }
    );
    return response.data.data;
  },

  getAnalyticsInsights: async (
    params?: IAnalyticsQueryParams
  ): Promise<IAnalyticsInsights> => {
    const response = await apiClient.get<ApiResponse<IAnalyticsInsights>>(
      "/system/analytics/insights",
      { params }
    );
    return response.data.data;
  },

  getProductivityAnalytics: async (
    params?: IAnalyticsQueryParams
  ): Promise<IProductivityAnalytics> => {
    const response = await apiClient.get<ApiResponse<IProductivityAnalytics>>(
      "/system/analytics/productivity",
      { params }
    );
    return response.data.data;
  },

  getTaskAnalytics: async (
    params?: IAnalyticsQueryParams
  ): Promise<ITaskAnalytics> => {
    const response = await apiClient.get<ApiResponse<ITaskAnalytics>>(
      "/system/analytics/tasks",
      { params }
    );
    return response.data.data;
  },

  getTimeTrackingAnalytics: async (
    params?: IAnalyticsQueryParams
  ): Promise<ITimeTrackingAnalytics> => {
    const response = await apiClient.get<ApiResponse<ITimeTrackingAnalytics>>(
      "/system/analytics/time-tracking",
      { params }
    );
    return response.data.data;
  },

  getGoalAnalytics: async (
    params?: IAnalyticsQueryParams
  ): Promise<IGoalAnalytics> => {
    const response = await apiClient.get<ApiResponse<IGoalAnalytics>>(
      "/system/analytics/goals",
      { params }
    );
    return response.data.data;
  },

  getFinanceAnalytics: async (
    params?: IAnalyticsQueryParams
  ): Promise<IFinanceAnalytics> => {
    const response = await apiClient.get<ApiResponse<IFinanceAnalytics>>(
      "/system/analytics/finance",
      { params }
    );
    return response.data.data;
  },

  getContentAnalytics: async (
    params?: IAnalyticsQueryParams
  ): Promise<IContentAnalytics> => {
    const response = await apiClient.get<ApiResponse<IContentAnalytics>>(
      "/system/analytics/content",
      { params }
    );
    return response.data.data;
  },

  getWorkspaceAnalytics: async (
    params?: IAnalyticsQueryParams
  ): Promise<IWorkspaceAnalytics> => {
    const response = await apiClient.get<ApiResponse<IWorkspaceAnalytics>>(
      "/system/analytics/workspace",
      { params }
    );
    return response.data.data;
  },

  exportAnalytics: async (
    params?: IAnalyticsQueryParams & { format?: string }
  ): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>(
      "/system/analytics/export",
      { params }
    );
    return response.data.data;
  },
};
