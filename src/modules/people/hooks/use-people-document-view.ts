import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useDatabase,
  useRecords,
  useViews,
} from "@/modules/database-view/services/database-queries";
import { apiClient } from "@/services/api-client";

// Query Keys
export const PEOPLE_DOCUMENT_VIEW_QUERY_KEYS = {
  database: () => ["people", "database"] as const,
  views: () => ["people", "views"] as const,
  records: () => ["people", "records"] as const,
  record: (recordId: string) => ["people", "records", recordId] as const,
  config: () => ["people", "config"] as const,
};

// Hook for people module configuration
export function usePeopleModuleConfig() {
  return useQuery({
    queryKey: PEOPLE_DOCUMENT_VIEW_QUERY_KEYS.config(),
    queryFn: async () => {
      // Get module config from modules API
      const response = await apiClient.get("/modules/config/people");
      return response.data.module;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for people database
export function usePeopleDatabase() {
  return useDatabase("people");
}

// Hook for people views
export function usePeopleViews() {
  return useViews("people");
}

// Hook for people records
export function usePeopleRecords(filters?: Record<string, unknown>) {
  const recordQueryParams = {
    databaseId: "people",
    page: 1,
    limit: 50,
    isArchived: false,
    isTemplate: false,
    ...filters,
  };

  return useRecords(recordQueryParams);
}

// Hook for updating people records
export function useUpdatePeopleRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      recordId,
      data,
    }: {
      recordId: string;
      data: Record<string, unknown>;
    }) => {
      const response = await apiClient.put(`/people/${recordId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PEOPLE_DOCUMENT_VIEW_QUERY_KEYS.records(),
      });
      // Also invalidate module-specific queries
      queryClient.invalidateQueries({ queryKey: ["people"] });
    },
  });
}

// Hook for deleting people records
export function useDeletePeopleRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recordId: string) => {
      await apiClient.delete(`/people/${recordId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PEOPLE_DOCUMENT_VIEW_QUERY_KEYS.records(),
      });
      // Also invalidate module-specific queries
      queryClient.invalidateQueries({ queryKey: ["people"] });
    },
  });
}

// Hook for creating people records
export function useCreatePeopleRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await apiClient.post("/people", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PEOPLE_DOCUMENT_VIEW_QUERY_KEYS.records(),
      });
      // Also invalidate module-specific queries
      queryClient.invalidateQueries({ queryKey: ["people"] });
    },
  });
}
