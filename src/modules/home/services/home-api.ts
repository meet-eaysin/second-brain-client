import { apiClient } from "@/services/api-client.ts";
import type { ApiResponse } from "@/types/api.types";
import type {
  IDashboardOverview,
  IDashboardStats,
  IDashboardQueryParams,
  IActivityFeedItem,
  IUpcomingTask,
  IRecentNote,
  IFinanceSummary,
  IQuickStats, ILearnContent, IRecentlyVisitedItem,
} from "../types";
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
import type {CalendarEvent} from "@/modules/calendar";

export const dashboardApi = {
  getDashboardOverview: async (
    params?: IDashboardQueryParams
  ): Promise<ApiResponse<IDashboardOverview>> => {
    const response = await apiClient.get<ApiResponse<IDashboardOverview>>(
      "/dashboard",
      { params }
    );
    return response.data!;
  },

  getDashboardStats: async (
    params?: IDashboardQueryParams
  ): Promise<ApiResponse<IDashboardStats>> => {
    const response = await apiClient.get<ApiResponse<IDashboardStats>>(
      "/dashboard/stats",
      { params }
    );
    return response.data!;
  },

  getRecentActivity: async (params?: {
    limit?: number;
  }): Promise<ApiResponse<IActivityFeedItem[]>> => {
    const response = await apiClient.get<ApiResponse<IActivityFeedItem[]>>(
      "/dashboard/activity",
      { params }
    );
    return response.data;
  },

  getQuickStats: async (): Promise<ApiResponse<IQuickStats>> => {
    const response = await apiClient.get<ApiResponse<IQuickStats>>(
      "/dashboard/quick-stats"
    );
    return response.data;
  },

  // Get upcoming tasks
  getUpcomingTasks: async (params?: {
    limit?: number;
  }): Promise<ApiResponse<IUpcomingTask[]>> => {
    const response = await apiClient.get<ApiResponse<IUpcomingTask[]>>(
      "/dashboard/upcoming-tasks",
      { params }
    );
    return response.data;
  },

  // Get recent notes
  getRecentNotes: async (params?: {
    limit?: number;
  }): Promise<ApiResponse<IRecentNote[]>> => {
    const response = await apiClient.get<ApiResponse<IRecentNote[]>>(
      "/dashboard/recent-notes",
      { params }
    );
    return response.data;
  },

  getFinanceSummary: async (params?: {
    period?: string;
  }): Promise<ApiResponse<IFinanceSummary>> => {
    const response = await apiClient.get<ApiResponse<IFinanceSummary>>(
      "/dashboard/finance-summary",
      { params }
    );
    return response.data;
  },

  // Get upcoming events
  getUpcomingEvents: async (params?: {
    limit?: number;
  }): Promise<ApiResponse<CalendarEvent[]>> => {
    const response = await apiClient.get<ApiResponse<CalendarEvent[]>>(
      "/calendar/events/upcoming",
      { params }
    );
    return response.data;
  },

  getLearnContent: async (): Promise<ApiResponse<ILearnContent[]>> => {
    const response = await apiClient.get<ApiResponse<ILearnContent[]>>(
      "/dashboard/learn-content"
    );
    return response.data;
  },
};

export const systemApi = {
  getActivities: async (
    params?: IActivityQueryOptions
  ): Promise<ApiResponse<IActivity[]>> => {
    const response = await apiClient.get<ApiResponse<IActivity[]>>(
      "/system/activity",
      { params }
    );
    return response.data;
  },

  getRecentActivityFeed: async (params?: {
    limit?: number;
  }): Promise<ApiResponse<IActivity[]>> => {
    const response = await apiClient.get<ApiResponse<IActivity[]>>(
      "/system/activity/feed",
      { params }
    );
    return response.data;
  },

  getUserActivitySummary: async (): Promise<ApiResponse<IActivitySummary>> => {
    const response = await apiClient.get<ApiResponse<IActivitySummary>>(
      "/system/activity/summary"
    );
    return response.data;
  },

  getActivityAnalytics: async (
    params?: IActivityQueryOptions
  ): Promise<ApiResponse<IActivityAnalytics>> => {
    const response = await apiClient.get<ApiResponse<IActivityAnalytics>>(
      "/system/activity/analytics",
      { params }
    );
    return response.data;
  },

  getActivityById: async (id: string): Promise<ApiResponse<IActivity>> => {
    const response = await apiClient.get<ApiResponse<IActivity>>(
      `/system/activity/${id}`
    );
    return response.data;
  },

  getWorkspaceActivityOverview: async (): Promise<ApiResponse<unknown>> => {
    const response = await apiClient.get<ApiResponse<unknown>>(
      "/system/activity/workspace/overview"
    );
    return response.data;
  },

  generateAuditTrail: async (params?: unknown): Promise<ApiResponse<IAuditTrail>> => {
    const response = await apiClient.get<ApiResponse<IAuditTrail>>(
      "/system/activity/audit",
      { params }
    );
    return response.data;
  },

  getSecurityEvents: async (params?: unknown): Promise<ApiResponse<ISecurityEvent[]>> => {
    const response = await apiClient.get<ApiResponse<ISecurityEvent[]>>(
      "/system/activity/security",
      { params }
    );
    return response.data;
  },

  getComplianceReport: async (params?: {
    period?: string;
  }): Promise<ApiResponse<IComplianceReport>> => {
    const response = await apiClient.get<ApiResponse<IComplianceReport>>(
      "/system/activity/compliance",
      { params }
    );
    return response.data;
  },

  exportAuditData: async (params?: unknown): Promise<ApiResponse<unknown>> => {
    const response = await apiClient.get<ApiResponse<unknown>>(
      "/system/activity/export",
      { params }
    );
    return response.data;
  },

  getActivityHeatmap: async (params?: {
    period?: string;
  }): Promise<ApiResponse<IActivityHeatmap>> => {
    const response = await apiClient.get<ApiResponse<IActivityHeatmap>>(
      "/system/activity/heatmap",
      { params }
    );
    return response.data;
  },

  // Analytics APIs
  getAnalyticsDashboard: async (
    params?: IAnalyticsQueryParams
  ): Promise<ApiResponse<IAnalyticsDashboard>> => {
    const response = await apiClient.get<ApiResponse<IAnalyticsDashboard>>(
      "/system/analytics/dashboard",
      { params }
    );
    return response.data;
  },

  getAnalyticsSummary: async (
    params?: IAnalyticsQueryParams
  ): Promise<ApiResponse<IAnalyticsSummary>> => {
    const response = await apiClient.get<ApiResponse<IAnalyticsSummary>>(
      "/system/analytics/summary",
      { params }
    );
    return response.data;
  },

  getAnalyticsInsights: async (
    params?: IAnalyticsQueryParams
  ): Promise<ApiResponse<IAnalyticsInsights>> => {
    const response = await apiClient.get<ApiResponse<IAnalyticsInsights>>(
      "/system/analytics/insights",
      { params }
    );
    return response.data;
  },

  getProductivityAnalytics: async (
    params?: IAnalyticsQueryParams
  ): Promise<ApiResponse<IProductivityAnalytics>> => {
    const response = await apiClient.get<ApiResponse<IProductivityAnalytics>>(
      "/system/analytics/productivity",
      { params }
    );
    return response.data;
  },

  getTaskAnalytics: async (
    params?: IAnalyticsQueryParams
  ): Promise<ApiResponse<ITaskAnalytics>> => {
    const response = await apiClient.get<ApiResponse<ITaskAnalytics>>(
      "/system/analytics/tasks",
      { params }
    );
    return response.data;
  },

  getTimeTrackingAnalytics: async (
    params?: IAnalyticsQueryParams
  ): Promise<ApiResponse<ITimeTrackingAnalytics>> => {
    const response = await apiClient.get<ApiResponse<ITimeTrackingAnalytics>>(
      "/system/analytics/time-tracking",
      { params }
    );
    return response.data;
  },

  getGoalAnalytics: async (
    params?: IAnalyticsQueryParams
  ): Promise<ApiResponse<IGoalAnalytics>> => {
    const response = await apiClient.get<ApiResponse<IGoalAnalytics>>(
      "/system/analytics/goals",
      { params }
    );
    return response.data;
  },

  getFinanceAnalytics: async (
    params?: IAnalyticsQueryParams
  ): Promise<ApiResponse<IFinanceAnalytics>> => {
    const response = await apiClient.get<ApiResponse<IFinanceAnalytics>>(
      "/system/analytics/finance",
      { params }
    );
    return response.data;
  },

  getContentAnalytics: async (
    params?: IAnalyticsQueryParams
  ): Promise<ApiResponse<IContentAnalytics>> => {
    const response = await apiClient.get<ApiResponse<IContentAnalytics>>(
      "/system/analytics/content",
      { params }
    );
    return response.data;
  },

  getWorkspaceAnalytics: async (
    params?: IAnalyticsQueryParams
  ): Promise<ApiResponse<IWorkspaceAnalytics>> => {
    const response = await apiClient.get<ApiResponse<IWorkspaceAnalytics>>(
      "/system/analytics/workspace",
      { params }
    );
    return response.data;
  },

  exportAnalytics: async (
    params?: IAnalyticsQueryParams & { format?: string }
  ): Promise<unknown> => {
    const response = await apiClient.get<ApiResponse<unknown>>(
      "/system/analytics/export",
      { params }
    );
    return response.data.data;
  },


  recordPageVisit: async (page: string, workspaceId: string): Promise<void> => {
    await apiClient.post<ApiResponse<void>>("/system/activity/page-visit", {
      page,
      workspaceId,
    });
  },

  getRecentlyVisited: async (limit = 15): Promise<IRecentlyVisitedItem[]> => {
    const response = await apiClient.get<ApiResponse<IRecentlyVisitedItem[]>>(
      "/system/activity/recently-visited",
      {
        params: { limit },
      }
    );
    return response.data.data || [];
  },
};
