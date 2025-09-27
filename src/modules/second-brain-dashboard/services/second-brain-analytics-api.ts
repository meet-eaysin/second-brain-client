import { apiClient } from "@/services/api-client.ts";
import type { ApiResponse } from "@/types/api.types";
import type {
  IProductivityAnalytics,
  ITaskAnalytics,
  ITimeTrackingAnalytics,
  IGoalAnalytics,
  IFinanceAnalytics,
  IContentAnalytics,
  IAnalyticsQueryParams,
} from "@/modules/home/types/system.types";

export const secondBrainAnalyticsApi = {
  getProductivityAnalytics: async (
    params?: IAnalyticsQueryParams
  ): Promise<IProductivityAnalytics> => {
    const response = await apiClient.get<ApiResponse<IProductivityAnalytics>>(
      "/system/analytics/productivity",
      { params }
    );
    return response.data.data!;
  },

  getTaskAnalytics: async (
    params?: IAnalyticsQueryParams
  ): Promise<ITaskAnalytics> => {
    const response = await apiClient.get<ApiResponse<ITaskAnalytics>>(
      "/system/analytics/tasks",
      { params }
    );
    return response.data.data!;
  },

  getTimeTrackingAnalytics: async (
    params?: IAnalyticsQueryParams
  ): Promise<ITimeTrackingAnalytics> => {
    const response = await apiClient.get<ApiResponse<ITimeTrackingAnalytics>>(
      "/system/analytics/time-tracking",
      { params }
    );
    return response.data.data!;
  },

  getGoalAnalytics: async (
    params?: IAnalyticsQueryParams
  ): Promise<IGoalAnalytics> => {
    const response = await apiClient.get<ApiResponse<IGoalAnalytics>>(
      "/system/analytics/goals",
      { params }
    );
    return response.data.data!;
  },

  getFinanceAnalytics: async (
    params?: IAnalyticsQueryParams
  ): Promise<IFinanceAnalytics> => {
    const response = await apiClient.get<ApiResponse<IFinanceAnalytics>>(
      "/system/analytics/finance",
      { params }
    );
    return response.data.data!;
  },

  getContentAnalytics: async (
    params?: IAnalyticsQueryParams
  ): Promise<IContentAnalytics> => {
    const response = await apiClient.get<ApiResponse<IContentAnalytics>>(
      "/system/analytics/content",
      { params }
    );
    return response.data.data!;
  },
};
