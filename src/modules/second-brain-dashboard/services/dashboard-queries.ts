import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "./dashboard-api";
import { DASHBOARD_KEYS } from "@/constants/query-keys.ts";
import type { AxiosError } from "axios";
import type { IDashboardOverview } from "@/modules/dashboard/types/dashboard.types";
import type { IDashboardQueryParams } from "@/modules/home/types";

export const useDashboardOverview = (params?: IDashboardQueryParams) => {
  return useQuery<IDashboardOverview, AxiosError>({
    queryKey: DASHBOARD_KEYS.overview(params),
    queryFn: () => dashboardApi.getDashboardOverview(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
};
