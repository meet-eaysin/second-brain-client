import { apiClient } from "@/services/api-client";
import type { ApiResponse } from "@/types/api.types";

export interface ISystemActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  userId: string;
  userName?: string;
  timestamp: Date;
  entityId?: string;
  entityType?: string;
  metadata?: Record<string, any>;
}

export const systemApi = {
  // Get recent system activity feed
  getRecentActivityFeed: async (
    workspaceId: string,
    limit = 10
  ): Promise<ISystemActivity[]> => {
    const response = await apiClient.get<ApiResponse<ISystemActivity[]>>(
      "/system/activity/feed",
      {
        params: { workspaceId, limit },
      }
    );
    return response.data.data || [];
  },

  // Record page visit
  recordPageVisit: async (page: string, workspaceId: string): Promise<void> => {
    await apiClient.post<ApiResponse<void>>("/system/activity/page-visit", {
      page,
      workspaceId,
    });
  },
};
