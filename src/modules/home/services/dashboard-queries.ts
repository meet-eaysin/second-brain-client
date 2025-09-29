import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "./dashboard-api";
import { DASHBOARD_KEYS } from "@/constants/query-keys.ts";
import type { IDashboardQueryParams } from "../types";

// Dashboard Queries
export const useDashboardOverview = (params?: IDashboardQueryParams) => {
  return useQuery({
    queryKey: [...DASHBOARD_KEYS.overview(), params],
    queryFn: () => dashboardApi.getDashboardOverview(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useDashboardStats = (params?: IDashboardQueryParams) => {
  return useQuery({
    queryKey: [...DASHBOARD_KEYS.stats(), params],
    queryFn: () => dashboardApi.getDashboardStats(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useRecentActivity = (limit = 20) => {
  return useQuery({
    queryKey: [...DASHBOARD_KEYS.activity(), limit],
    queryFn: () => dashboardApi.getRecentActivity(limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useQuickStats = () => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.quickStats(),
    queryFn: () => dashboardApi.getQuickStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpcomingTasks = (limit = 10) => {
  return useQuery({
    queryKey: [...DASHBOARD_KEYS.upcomingTasks(), limit],
    queryFn: () => dashboardApi.getUpcomingTasks(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRecentNotes = (limit = 10) => {
  return useQuery({
    queryKey: [...DASHBOARD_KEYS.recentNotes(), limit],
    queryFn: () => dashboardApi.getRecentNotes(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGoalProgress = () => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.goalProgress(),
    queryFn: () => dashboardApi.getGoalProgress(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useHabitStreaks = () => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.habitStreaks(),
    queryFn: () => dashboardApi.getHabitStreaks(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFinanceSummary = (period = "month") => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.financeSummary(period),
    queryFn: () => dashboardApi.getFinanceSummary(period),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useRecentlyVisited = (limit = 8) => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.recentlyVisited(limit),
    queryFn: () => dashboardApi.getRecentlyVisited(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
