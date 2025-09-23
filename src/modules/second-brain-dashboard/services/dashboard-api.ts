import { apiClient } from "@/services/api-client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { ApiResponse } from "@/types/api.types";

// Import backend types
import type { IDashboardOverview } from "@/modules/dashboard/types/dashboard.types";

export const dashboardApi = {
  // Get dashboard overview
  getDashboardOverview: async (params?: {
    workspaceId?: string;
    includeActivity?: boolean;
    activityLimit?: number;
    upcomingTasksLimit?: number;
    recentNotesLimit?: number;
    period?: string;
  }): Promise<IDashboardOverview> => {
    const response = await apiClient.get<ApiResponse<IDashboardOverview>>(
      API_ENDPOINTS.DASHBOARD.BASE,
      { params }
    );
    return response.data.data;
  },
};
