import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dashboardApi, systemApi } from "./home-api";
import { DASHBOARD_KEYS, SYSTEM_KEYS } from "@/constants/query-keys.ts";
import type { IDashboardQueryParams } from "../types";
import type { IActivityQueryOptions, IAnalyticsQueryParams } from "../types";

// Get dashboard overview
export const useDashboardOverview = (params?: IDashboardQueryParams) => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.overview(params),
    queryFn: () => dashboardApi.getDashboardOverview(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get dashboard statistics (detailed)
export const useDashboardStats = (params?: IDashboardQueryParams) => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.stats(params),
    queryFn: () => dashboardApi.getDashboardStats(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get recent activity feed
export const useRecentActivity = (params?: { limit?: number }) => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.activity(params),
    queryFn: () => dashboardApi.getRecentActivity(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get quick statistics
export const useQuickStats = () => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.quickStats(),
    queryFn: () => dashboardApi.getQuickStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get upcoming tasks
export const useUpcomingTasks = (params?: { limit?: number }) => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.upcomingTasks(params),
    queryFn: () => dashboardApi.getUpcomingTasks(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get recent notes
export const useRecentNotes = (params?: { limit?: number }) => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.recentNotes(params),
    queryFn: () => dashboardApi.getRecentNotes(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get finance summary
export const useFinanceSummary = (params?: { period?: string }) => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.financeSummary(params),
    queryFn: () => dashboardApi.getFinanceSummary(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get upcoming events
export const useUpcomingEvents = (params?: { limit?: number }) => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.upcomingEvents(params),
    queryFn: () => dashboardApi.getUpcomingEvents(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// System Activity Queries
export const useActivities = (params?: IActivityQueryOptions) => {
  return useQuery({
    queryKey: SYSTEM_KEYS.activities(params),
    queryFn: () => systemApi.getActivities(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRecentActivityFeed = (workspaceId: string, limit = 10) => {
  return useQuery({
    queryKey: SYSTEM_KEYS.activityFeed({ workspaceId, limit }),
    queryFn: () => systemApi.getRecentActivityFeed({ limit: Number(limit) }),
    enabled: !!workspaceId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// System Queries
export const useSystemActivityFeed = (workspaceId: string, limit = 10) => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.feed(workspaceId, limit),
    queryFn: () => systemApi.getRecentActivityFeed({ limit: Number(limit) }),
    enabled: !!workspaceId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useUserActivitySummary = () => {
  return useQuery({
    queryKey: SYSTEM_KEYS.activitySummary(),
    queryFn: () => systemApi.getUserActivitySummary(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useActivityAnalytics = (params?: IActivityQueryOptions) => {
  return useQuery({
    queryKey: SYSTEM_KEYS.activityAnalytics(params),
    queryFn: () => systemApi.getActivityAnalytics(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useActivityById = (id: string) => {
  return useQuery({
    queryKey: SYSTEM_KEYS.activityById(id),
    queryFn: () => systemApi.getActivityById(id),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useWorkspaceActivityOverview = () => {
  return useQuery({
    queryKey: SYSTEM_KEYS.workspaceActivityOverview(),
    queryFn: () => systemApi.getWorkspaceActivityOverview(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useActivityHeatmap = (params?: { period?: string }) => {
  return useQuery({
    queryKey: SYSTEM_KEYS.activityHeatmap(params),
    queryFn: () => systemApi.getActivityHeatmap(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// System Analytics Queries
export const useAnalyticsDashboard = (params?: IAnalyticsQueryParams) => {
  return useQuery({
    queryKey: SYSTEM_KEYS.analyticsDashboard(params),
    queryFn: () => systemApi.getAnalyticsDashboard(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAnalyticsSummary = (params?: IAnalyticsQueryParams) => {
  return useQuery({
    queryKey: SYSTEM_KEYS.analyticsSummary(params),
    queryFn: () => systemApi.getAnalyticsSummary(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAnalyticsInsights = (params?: IAnalyticsQueryParams) => {
  return useQuery({
    queryKey: SYSTEM_KEYS.analyticsInsights(params),
    queryFn: () => systemApi.getAnalyticsInsights(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProductivityAnalytics = (params?: IAnalyticsQueryParams) => {
  return useQuery({
    queryKey: SYSTEM_KEYS.productivityAnalytics(params),
    queryFn: () => systemApi.getProductivityAnalytics(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTaskAnalytics = (params?: IAnalyticsQueryParams) => {
  return useQuery({
    queryKey: SYSTEM_KEYS.taskAnalytics(params),
    queryFn: () => systemApi.getTaskAnalytics(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTimeTrackingAnalytics = (params?: IAnalyticsQueryParams) => {
  return useQuery({
    queryKey: SYSTEM_KEYS.timeTrackingAnalytics(params),
    queryFn: () => systemApi.getTimeTrackingAnalytics(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGoalAnalytics = (params?: IAnalyticsQueryParams) => {
  return useQuery({
    queryKey: SYSTEM_KEYS.goalAnalytics(params),
    queryFn: () => systemApi.getGoalAnalytics(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFinanceAnalytics = (params?: IAnalyticsQueryParams) => {
  return useQuery({
    queryKey: SYSTEM_KEYS.financeAnalytics(params),
    queryFn: () => systemApi.getFinanceAnalytics(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useContentAnalytics = (params?: IAnalyticsQueryParams) => {
  return useQuery({
    queryKey: SYSTEM_KEYS.contentAnalytics(params),
    queryFn: () => systemApi.getContentAnalytics(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useWorkspaceAnalytics = (params?: IAnalyticsQueryParams) => {
  return useQuery({
    queryKey: SYSTEM_KEYS.workspaceAnalytics(params),
    queryFn: () => systemApi.getWorkspaceAnalytics(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Record Page Visit Mutation
export const useRecordPageVisit = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { page: string; workspaceId: string }>({
    mutationFn: ({ page, workspaceId }) =>
      systemApi.recordPageVisit(page, workspaceId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...SYSTEM_KEYS.all, "recently-visited"],
      });
    },
  });
};
