import { useQuery } from "@tanstack/react-query";
import { secondBrainAnalyticsApi } from "./second-brain-analytics-api";
import { SECOND_BRAIN_ANALYTICS_KEYS } from "@/constants/query-keys.ts";
import type { IAnalyticsQueryParams } from "../../home/types/system.types";

// Productivity Analytics
export const useProductivityAnalytics = (params?: IAnalyticsQueryParams) => {
  return useQuery({
    queryKey: SECOND_BRAIN_ANALYTICS_KEYS.productivity(params),
    queryFn: () => secondBrainAnalyticsApi.getProductivityAnalytics(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Task Analytics
export const useTaskAnalytics = (params?: IAnalyticsQueryParams) => {
  return useQuery({
    queryKey: SECOND_BRAIN_ANALYTICS_KEYS.tasks(params),
    queryFn: () => secondBrainAnalyticsApi.getTaskAnalytics(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Time Tracking Analytics
export const useTimeTrackingAnalytics = (params?: IAnalyticsQueryParams) => {
  return useQuery({
    queryKey: SECOND_BRAIN_ANALYTICS_KEYS.timeTracking(params),
    queryFn: () => secondBrainAnalyticsApi.getTimeTrackingAnalytics(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Goal Analytics
export const useGoalAnalytics = (params?: IAnalyticsQueryParams) => {
  return useQuery({
    queryKey: SECOND_BRAIN_ANALYTICS_KEYS.goals(params),
    queryFn: () => secondBrainAnalyticsApi.getGoalAnalytics(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Finance Analytics
export const useFinanceAnalytics = (params?: IAnalyticsQueryParams) => {
  return useQuery({
    queryKey: SECOND_BRAIN_ANALYTICS_KEYS.finance(params),
    queryFn: () => secondBrainAnalyticsApi.getFinanceAnalytics(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Content Analytics
export const useContentAnalytics = (params?: IAnalyticsQueryParams) => {
  return useQuery({
    queryKey: SECOND_BRAIN_ANALYTICS_KEYS.content(params),
    queryFn: () => secondBrainAnalyticsApi.getContentAnalytics(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
