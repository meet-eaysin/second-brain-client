import { useQuery } from "@tanstack/react-query";
import { systemApi } from "./system-api";

// Query Keys
export const SYSTEM_KEYS = {
  all: ["system"] as const,
  activity: () => [...SYSTEM_KEYS.all, "activity"] as const,
  feed: (workspaceId: string, limit: number) =>
    [...SYSTEM_KEYS.activity(), "feed", workspaceId, limit] as const,
};

// System Queries
export const useSystemActivityFeed = (workspaceId: string, limit = 10) => {
  return useQuery({
    queryKey: SYSTEM_KEYS.feed(workspaceId, limit),
    queryFn: () => systemApi.getRecentActivityFeed(workspaceId, limit),
    enabled: !!workspaceId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
