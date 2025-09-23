import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "./home-api";
import type { IDashboardQueryParams } from "../types/dashboard.types";

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
