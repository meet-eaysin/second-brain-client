import { useQuery } from "@tanstack/react-query";
import { dashboardApi, systemApi } from "./home-api";
import type { IDashboardQueryParams } from "../types";
import type { IActivityQueryOptions, IAnalyticsQueryParams } from "../types";

export const DASHBOARD_KEYS = {
  all: ["dashboard"] as const,
  overview: (params?: IDashboardQueryParams) =>
    [...DASHBOARD_KEYS.all, "overview", params] as const,
  stats: (params?: IDashboardQueryParams) =>
    [...DASHBOARD_KEYS.all, "stats", params] as const,
  activity: (params?: { limit?: number }) =>
    [...DASHBOARD_KEYS.all, "activity", params] as const,
  quickStats: () => [...DASHBOARD_KEYS.all, "quick-stats"] as const,
  upcomingTasks: (params?: { limit?: number }) =>
    [...DASHBOARD_KEYS.all, "upcoming-tasks", params] as const,
  recentNotes: (params?: { limit?: number }) =>
    [...DASHBOARD_KEYS.all, "recent-notes", params] as const,
  goalProgress: () => [...DASHBOARD_KEYS.all, "goal-progress"] as const,
  habitStreaks: () => [...DASHBOARD_KEYS.all, "habit-streaks"] as const,
  financeSummary: (params?: { period?: string }) =>
    [...DASHBOARD_KEYS.all, "finance-summary", params] as const,
  upcomingEvents: (params?: { limit?: number }) =>
    [...DASHBOARD_KEYS.all, "upcoming-events", params] as const,
};

export const SYSTEM_KEYS = {
  all: ["system"] as const,
  activities: (params?: IActivityQueryOptions) =>
    [...SYSTEM_KEYS.all, "activities", params] as const,
  activityFeed: (params?: { limit?: number }) =>
    [...SYSTEM_KEYS.all, "activity-feed", params] as const,
  activitySummary: () => [...SYSTEM_KEYS.all, "activity-summary"] as const,
  activityAnalytics: (params?: IActivityQueryOptions) =>
    [...SYSTEM_KEYS.all, "activity-analytics", params] as const,
  activityById: (id: string) => [...SYSTEM_KEYS.all, "activity", id] as const,
  workspaceActivityOverview: () =>
    [...SYSTEM_KEYS.all, "workspace-activity-overview"] as const,
  auditTrail: (params?: Record<string, unknown>) =>
    [...SYSTEM_KEYS.all, "audit-trail", params] as const,
  securityEvents: (params?: Record<string, unknown>) =>
    [...SYSTEM_KEYS.all, "security-events", params] as const,
  complianceReport: (params?: { period?: string }) =>
    [...SYSTEM_KEYS.all, "compliance-report", params] as const,
  activityHeatmap: (params?: { period?: string }) =>
    [...SYSTEM_KEYS.all, "activity-heatmap", params] as const,
  analyticsDashboard: (params?: IAnalyticsQueryParams) =>
    [...SYSTEM_KEYS.all, "analytics-dashboard", params] as const,
  analyticsSummary: (params?: IAnalyticsQueryParams) =>
    [...SYSTEM_KEYS.all, "analytics-summary", params] as const,
  analyticsInsights: (params?: IAnalyticsQueryParams) =>
    [...SYSTEM_KEYS.all, "analytics-insights", params] as const,
  productivityAnalytics: (params?: IAnalyticsQueryParams) =>
    [...SYSTEM_KEYS.all, "productivity-analytics", params] as const,
  taskAnalytics: (params?: IAnalyticsQueryParams) =>
    [...SYSTEM_KEYS.all, "task-analytics", params] as const,
  timeTrackingAnalytics: (params?: IAnalyticsQueryParams) =>
    [...SYSTEM_KEYS.all, "time-tracking-analytics", params] as const,
  goalAnalytics: (params?: IAnalyticsQueryParams) =>
    [...SYSTEM_KEYS.all, "goal-analytics", params] as const,
  financeAnalytics: (params?: IAnalyticsQueryParams) =>
    [...SYSTEM_KEYS.all, "finance-analytics", params] as const,
  contentAnalytics: (params?: IAnalyticsQueryParams) =>
    [...SYSTEM_KEYS.all, "content-analytics", params] as const,
  workspaceAnalytics: (params?: IAnalyticsQueryParams) =>
    [...SYSTEM_KEYS.all, "workspace-analytics", params] as const,
};

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

// Get goal progress
export const useGoalProgress = () => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.goalProgress(),
    queryFn: () => dashboardApi.getGoalProgress(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get habit streaks
export const useHabitStreaks = () => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.habitStreaks(),
    queryFn: () => dashboardApi.getHabitStreaks(),
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
    queryFn: () => systemApi.getRecentActivityFeed({ workspaceId, limit }),
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
