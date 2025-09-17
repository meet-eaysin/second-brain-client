import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useDatabase,
  useRecords,
  useViews,
} from "@/modules/document-view/services/database-queries";
import { createModuleApi } from "@/modules/document-view/services/api-service";
import { EDatabaseType } from "@/modules/document-view";

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
  const apiService = createModuleApi(EDatabaseType.PEOPLE);

  return useQuery({
    queryKey: PEOPLE_DOCUMENT_VIEW_QUERY_KEYS.config(),
    queryFn: () => apiService.getConfig(),
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
  const apiService = createModuleApi(EDatabaseType.PEOPLE);

  return useMutation({
    mutationFn: async ({
      recordId,
      data,
    }: {
      recordId: string;
      data: Record<string, unknown>;
    }) => {
      return await apiService.updateRecord(recordId, data);
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
  const apiService = createModuleApi(EDatabaseType.PEOPLE);

  return useMutation({
    mutationFn: async (recordId: string) => {
      return await apiService.deleteRecord(recordId);
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
  const apiService = createModuleApi(EDatabaseType.PEOPLE);

  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      return await apiService.createRecord(data);
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
