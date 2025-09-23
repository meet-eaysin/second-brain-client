import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "./dashboard-api";
import type { AxiosError } from "axios";
import type { IDashboardOverview } from "@/modules/dashboard/types/dashboard.types";

export const DASHBOARD_KEYS = {
  all: ["dashboard"] as const,
  overview: (params?: Record<string, unknown>) =>
    [...DASHBOARD_KEYS.all, "overview", params] as const,
};

export const useDashboardOverview = (params?: {
  workspaceId?: string;
  includeActivity?: boolean;
  activityLimit?: number;
  upcomingTasksLimit?: number;
  recentNotesLimit?: number;
  period?: string;
}) => {
  return useQuery<IDashboardOverview, AxiosError>({
    queryKey: DASHBOARD_KEYS.overview(params),
    queryFn: () => dashboardApi.getDashboardOverview(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
};
