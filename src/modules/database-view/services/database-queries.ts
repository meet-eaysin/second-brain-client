import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { databaseApi } from "./database-api";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import type { ApiError, ApiResponse } from "@/types/api.types.ts";
import {
  type TBulkDeleteRecords,
  type TBulkUpdateRecords,
  type TCreateDatabase,
  type TCreateView,
  type TDatabase,
  type TDatabaseQueryParams,
  type TDatabaseStats,
  type TProperty,
  type TPropertyQueryParams,
  type TRecord,
  type TRecordQueryParams,
  type TReorderProperties,
  type TUpdateDatabase,
  type TUpdateProperty,
  type TView,
  // Database-level filter and sort types
  type TDatabaseFilter,
  type TDatabaseSort,
  type TDatabaseFilterPreset,
  type TCreateDatabaseFilter,
  type TUpdateDatabaseFilter,
  type TCreateDatabaseSort,
  type TUpdateDatabaseSort,
  type TCreateDatabaseFilterPreset,
  type TUpdateDatabaseFilterPreset,
  type TDatabaseFilterQueryParams,
  type TDatabaseSortQueryParams,
  type TDatabaseFilterPresetQueryParams,
  // Relation types
  type TRelationQueryParams,
  type TRelationList,
  type IRelation,
  type IRelationConnectionQueryParams,
  type TRelationConnectionList,
  // Block types
  type IBlockSearchOptions,
  type IBlockList,
  type ICreateBlock,
  type IUpdateBlock,
  type IBulkBlockOperation,
  type TUpdateView,
  type EPropertyType,
  type TPropertyValue,
  type TCreateRecord,
  type TCreateProperty,
  type TCreateRelation,
  type TUpdateRelation,
  type TRelationConnection,
  type TCreateRelationConnection,
  type TContentBlock,
  EDatabaseType,
} from "@/modules/database-view/types";

export const DATABASE_KEYS = {
  all: ["databases"] as const,
  lists: () => [...DATABASE_KEYS.all, "list"] as const,
  list: (filters: TDatabaseQueryParams) =>
    [...DATABASE_KEYS.lists(), filters] as const,
  details: () => [...DATABASE_KEYS.all, "detail"] as const,
  detail: (id: string) => [...DATABASE_KEYS.details(), id] as const,
  stats: (id: string) => [...DATABASE_KEYS.detail(id), "stats"] as const,

  properties: (databaseId: string) =>
    [...DATABASE_KEYS.detail(databaseId), "properties"] as const,
  property: (databaseId: string, propertyId: string) =>
    [...DATABASE_KEYS.properties(databaseId), propertyId] as const,

  records: (databaseId: string) =>
    [...DATABASE_KEYS.detail(databaseId), "records"] as const,
  record: (databaseId: string, recordId: string) =>
    [...DATABASE_KEYS.records(databaseId), recordId] as const,

  views: (databaseId: string) =>
    [...DATABASE_KEYS.detail(databaseId), "views"] as const,
  view: (databaseId: string, viewId: string) =>
    [...DATABASE_KEYS.views(databaseId), viewId] as const,

  relations: ["relations"] as const,
  relation: (id: string) => [...DATABASE_KEYS.relations, id] as const,
  relationConnections: (relationId: string) =>
    [...DATABASE_KEYS.relation(relationId), "connections"] as const,

  blocks: (databaseId: string, recordId: string) =>
    [...DATABASE_KEYS.record(databaseId, recordId), "blocks"] as const,
  block: (databaseId: string, recordId: string, blockId: string) =>
    [...DATABASE_KEYS.blocks(databaseId, recordId), blockId] as const,
};

export const useDatabases = (params?: TDatabaseQueryParams) => {
  return useQuery<
    ApiResponse<TDatabase[]>,
    AxiosError
  >({
    queryKey: DATABASE_KEYS.list(params || {}),
    queryFn: () => databaseApi.getDatabases(params),
  });
};

export const useDatabaseByModuleType = (moduleType: EDatabaseType) => {
  return useQuery<ApiResponse<TDatabase[]>, AxiosError>({
    queryKey: DATABASE_KEYS.list({ type: moduleType }),
    queryFn: () => databaseApi.getDatabases({ type: moduleType }),
  });
};

export const useDatabase = (id: string) => {
  return useQuery<ApiResponse<TDatabase>, AxiosError>({
    queryKey: DATABASE_KEYS.detail(id),
    queryFn: () => databaseApi.getDatabaseById(id),
    enabled: !!id,
  });
};

export const useDatabaseStats = (id: string) => {
  return useQuery<TDatabaseStats, AxiosError>({
    queryKey: DATABASE_KEYS.stats(id),
    queryFn: () => databaseApi.getDatabaseStats(id),
    enabled: !!id,
  });
};

export const useCreateDatabase = () => {
  const queryClient = useQueryClient();

  return useMutation<
    TDatabase,
    AxiosError<ApiError>,
    { data: TCreateDatabase }
  >({
    mutationFn: ({ data }) => databaseApi.createDatabase(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.lists() });
      toast.success("Database created successfully");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.message || "Failed to create database");
    },
  });
};

export const useUpdateDatabase = () => {
  const queryClient = useQueryClient();

  return useMutation<
    TDatabase,
    AxiosError<ApiError>,
    { id: string; data: TUpdateDatabase }
  >({
    mutationFn: ({ id, data }) => databaseApi.updateDatabase(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: DATABASE_KEYS.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.lists() });
      toast.success("Database updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update database");
    },
  });
};

export const useDeleteDatabase = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ApiError>, { id: string }>({
    mutationFn: ({ id }) => databaseApi.deleteDatabase(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.lists() });
      queryClient.removeQueries({
        queryKey: DATABASE_KEYS.detail(variables.id),
      });
      toast.success("Database deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete database");
    },
  });
};

export const useDuplicateDatabase = () => {
  const queryClient = useQueryClient();

  return useMutation<
    TDatabase,
    AxiosError<ApiError>,
    { id: string; name: string }
  >({
    mutationFn: ({ id, name }) => databaseApi.duplicateDatabase(id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.lists() });
      toast.success("Database duplicated successfully");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(
        error.response?.data?.message || "Failed to duplicate database"
      );
    },
  });
};

// Property hooks
export const useProperties = (
  databaseId: string,
  params?: TPropertyQueryParams
) => {
  return useQuery<ApiResponse<TProperty[]>, AxiosError>({
    queryKey: [...DATABASE_KEYS.properties(databaseId), params?.viewId],
    queryFn: async () => {
      const response = await databaseApi.getProperties(databaseId, params);
      return response;
    },
    enabled: !!databaseId,
  });
};

export const useProperty = (databaseId: string, propertyId: string) => {
  return useQuery<TProperty, AxiosError>({
    queryKey: DATABASE_KEYS.property(databaseId, propertyId),
    queryFn: () => databaseApi.getPropertyById(databaseId, propertyId),
    enabled: !!databaseId && !!propertyId,
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation<
    TProperty,
    AxiosError<ApiError>,
    { databaseId: string; data: TCreateProperty }
  >({
    mutationFn: ({ databaseId, data }) =>
      databaseApi.createProperty(databaseId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: DATABASE_KEYS.properties(variables.databaseId),
      });
      // Invalidate view queries since visibleProperties may have been updated
      queryClient.invalidateQueries({
        queryKey: DATABASE_KEYS.views(variables.databaseId),
      });
      toast.success("Property created successfully");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.message || "Failed to create property");
    },
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation<
    TProperty,
    AxiosError<ApiError>,
    { databaseId: string; propertyId: string; data: TUpdateProperty }
  >({
    mutationFn: ({ databaseId, propertyId, data }) =>
      databaseApi.updateProperty(databaseId, propertyId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: DATABASE_KEYS.properties(variables.databaseId),
      });
      queryClient.invalidateQueries({
        queryKey: DATABASE_KEYS.property(
          variables.databaseId,
          variables.propertyId
        ),
      });
      toast.success("Property updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update property");
    },
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<ApiError>,
    { databaseId: string; propertyId: string }
  >({
    mutationFn: ({ databaseId, propertyId }) =>
      databaseApi.deleteProperty(databaseId, propertyId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: DATABASE_KEYS.properties(variables.databaseId),
      });
      queryClient.removeQueries({
        queryKey: DATABASE_KEYS.property(
          variables.databaseId,
          variables.propertyId
        ),
      });
      toast.success("Property deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete property");
    },
  });
};

export const useDuplicateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation<
    TProperty,
    AxiosError<ApiError>,
    { databaseId: string; propertyId: string; name?: string }
  >({
    mutationFn: ({ databaseId, propertyId, name }) =>
      databaseApi.duplicateProperty(databaseId, propertyId, name),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: DATABASE_KEYS.properties(variables.databaseId),
      });
      toast.success("Property duplicated successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to duplicate property"
      );
    },
  });
};

export const useChangePropertyType = () => {
  const queryClient = useQueryClient();

  return useMutation<
    TProperty,
    AxiosError<ApiError>,
    {
      databaseId: string;
      propertyId: string;
      type: EPropertyType;
      config?: Record<string, unknown>;
    }
  >({
    mutationFn: ({ databaseId, propertyId, type, config }) =>
      databaseApi.changePropertyType(databaseId, propertyId, type, config),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: DATABASE_KEYS.properties(variables.databaseId),
      });
      queryClient.invalidateQueries({
        queryKey: DATABASE_KEYS.property(
          variables.databaseId,
          variables.propertyId
        ),
      });
      toast.success("Property type changed successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to change property type"
      );
    },
  });
};

export const useReorderProperties = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<ApiError>,
    {
      databaseId: string;
      data: TReorderProperties;
    }
  >({
    mutationFn: ({ databaseId, data }) =>
      databaseApi.reorderProperties(databaseId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: DATABASE_KEYS.properties(variables.databaseId),
      });
      toast.success("Properties reordered successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to reorder properties"
      );
    },
  });
};

export const useRecords = (databaseId: string, params?: TRecordQueryParams) => {
  return useQuery({
    queryKey: [...DATABASE_KEYS.records(databaseId), params],
    queryFn: async () => await databaseApi.getRecords(databaseId, params),
    enabled: !!databaseId && !!params?.viewId,
  });
};

export const useRecord = (databaseId: string, recordId: string) => {
  return useQuery<ApiResponse<TRecord>, AxiosError>({
    queryKey: DATABASE_KEYS.record(databaseId, recordId),
    queryFn: () => databaseApi.getRecordById(databaseId, recordId),
    enabled: !!databaseId && !!recordId,
  });
};

export const useCreateRecord = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<TRecord>,
    AxiosError<ApiError>,
    { databaseId: string; data: TCreateRecord }
  >({
    mutationFn: ({ databaseId, data }) =>
      databaseApi.createRecord(databaseId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: DATABASE_KEYS.records(variables.databaseId),
      });
      toast.success("Record created successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create record");
    },
  });
};

export const useUpdateRecord = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<TRecord>,
    AxiosError<ApiError>,
    {
      databaseId: string;
      recordId: string;
      payload: Record<string, TPropertyValue>;
    }
  >({
    mutationFn: ({ databaseId, recordId, payload }) =>
      databaseApi.updateRecord(databaseId, recordId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey as string[];
          return (
            queryKey[0] === "databases" &&
            queryKey[1] === "detail" &&
            queryKey[2] === variables.databaseId &&
            queryKey[3] === "records"
          );
        },
      });
      queryClient.invalidateQueries({
        queryKey: DATABASE_KEYS.record(
          variables.databaseId,
          variables.recordId
        ),
      });
      toast.success("Record updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update record");
    },
  });
};

export const useDeleteRecord = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<ApiError>,
    { databaseId: string; recordId: string }
  >({
    mutationFn: ({ databaseId, recordId }) =>
      databaseApi.deleteRecord(databaseId, recordId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: DATABASE_KEYS.records(variables.databaseId),
      });
      queryClient.removeQueries({
        queryKey: DATABASE_KEYS.record(
          variables.databaseId,
          variables.recordId
        ),
      });
      toast.success("Record deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete record");
    },
  });
};

export const useBulkUpdateRecords = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<ApiError>,
    { databaseId: string; data: TBulkUpdateRecords }
  >({
    mutationFn: ({ databaseId, data }) =>
      databaseApi.bulkUpdateRecords(databaseId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: DATABASE_KEYS.records(variables.databaseId),
      });
      toast.success("Records updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update records");
    },
  });
};

export const useBulkDeleteRecords = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<ApiError>,
    { databaseId: string; data: TBulkDeleteRecords }
  >({
    mutationFn: ({ databaseId, data }) =>
      databaseApi.bulkDeleteRecords(databaseId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: DATABASE_KEYS.records(variables.databaseId),
      });
      toast.success("Records deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete records");
    },
  });
};

export const useDuplicateRecord = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<TRecord>,
    AxiosError<ApiError>,
    {
      databaseId: string;
      recordId: string;
      data?: TCreateRecord;
    }
  >({
    mutationFn: ({ databaseId, recordId, data }) =>
      databaseApi.duplicateRecord(databaseId, recordId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: DATABASE_KEYS.records(variables.databaseId),
      });
      toast.success("Record duplicated successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to duplicate record"
      );
    },
  });
};

// View hooks
export const useViews = (databaseId: string) => {
  return useQuery<ApiResponse<TView[]>, AxiosError>({
    queryKey: DATABASE_KEYS.views(databaseId),
    queryFn: () => databaseApi.getViews(databaseId),
    enabled: !!databaseId,
  });
};

export const useView = (databaseId: string, viewId: string) => {
  return useQuery<ApiResponse<TView>, AxiosError>({
    queryKey: DATABASE_KEYS.view(databaseId, viewId),
    queryFn: () => databaseApi.getViewById(databaseId, viewId),
    enabled: !!databaseId && !!viewId,
  });
};

export const useCreateView = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<TView>,
    AxiosError<ApiError>,
    { databaseId: string; data: TCreateView }
  >({
    mutationFn: ({ databaseId, data }) =>
      databaseApi.createView(databaseId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: DATABASE_KEYS.views(variables.databaseId),
      });
      toast.success("View created successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create view");
    },
  });
};

export const useUpdateView = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<TView>,
    AxiosError<ApiError>,
    { databaseId: string; viewId: string; data: TUpdateView }
  >({
    mutationFn: ({ databaseId, viewId, data }) =>
      databaseApi.updateView(databaseId, viewId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: DATABASE_KEYS.views(variables.databaseId),
      });
      queryClient.invalidateQueries({
        queryKey: DATABASE_KEYS.view(variables.databaseId, variables.viewId),
      });
      toast.success("View updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update view");
    },
  });
};

export const useUpdateViewFilters = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<TView>,
    AxiosError<ApiError>,
    {
      databaseId: string;
      viewId: string;
      filters: Array<{
        property: string;
        condition: string;
        value?: unknown;
        operator?: string;
      }>;
    }
  >({
    mutationFn: ({ databaseId, viewId, filters }) =>
      databaseApi.updateViewFilters(databaseId, viewId, filters),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: DATABASE_KEYS.views(variables.databaseId),
      });
      queryClient.invalidateQueries({
        queryKey: DATABASE_KEYS.view(variables.databaseId, variables.viewId),
      });
      // Only invalidate records for the current view, not all records for the database
      queryClient.invalidateQueries({
        queryKey: DATABASE_KEYS.records(variables.databaseId),
      });
      toast.success("View filters updated successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update view filters"
      );
    },
  });
};

export const useUpdateViewSorts = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<TView>,
    AxiosError<ApiError>,
    {
      databaseId: string;
      viewId: string;
      sorts: Array<{ propertyId: string; direction: "asc" | "desc" }>;
    }
  >({
    mutationFn: ({ databaseId, viewId, sorts }) =>
      databaseApi.updateViewSorts(databaseId, viewId, sorts),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: DATABASE_KEYS.views(variables.databaseId),
      });
      queryClient.invalidateQueries({
        queryKey: DATABASE_KEYS.view(variables.databaseId, variables.viewId),
      });
      queryClient.invalidateQueries({
        queryKey: DATABASE_KEYS.records(variables.databaseId),
      });
      toast.success("View sorts updated successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update view sorts"
      );
    },
  });
};

export const useDeleteView = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<ApiError>,
    { databaseId: string; viewId: string }
  >({
    mutationFn: ({ databaseId, viewId }) =>
      databaseApi.deleteView(databaseId, viewId),
    onSuccess: (_, variables) => {
      // Invalidate views list to trigger automatic view switching in context
      queryClient.invalidateQueries({
        queryKey: DATABASE_KEYS.views(variables.databaseId),
      });

      // Remove the deleted view from cache
      queryClient.removeQueries({
        queryKey: DATABASE_KEYS.view(variables.databaseId, variables.viewId),
      });

      toast.success("View deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete view");
    },
  });
};

export const useDuplicateView = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<TView>,
    AxiosError<ApiError>,
    { databaseId: string; viewId: string; newName?: string }
  >({
    mutationFn: ({ databaseId, viewId, newName }) =>
      databaseApi.duplicateView(databaseId, viewId, { newName }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: DATABASE_KEYS.views(variables.databaseId),
      });
      toast.success("View duplicated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to duplicate view");
    },
  });
};

// Relation hooks
export const useRelations = (params?: TRelationQueryParams) => {
  return useQuery<ApiResponse<TRelationList>, AxiosError>({
    queryKey: [...DATABASE_KEYS.relations, params],
    queryFn: () => databaseApi.getRelations(params),
  });
};

export const useRelation = (relationId: string) => {
  return useQuery<ApiResponse<IRelation>, AxiosError>({
    queryKey: DATABASE_KEYS.relation(relationId),
    queryFn: () => databaseApi.getRelation(relationId),
    enabled: !!relationId,
  });
};

export const useCreateRelation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<IRelation>,
    AxiosError<ApiError>,
    { data: TCreateRelation }
  >({
    mutationFn: ({ data }) => databaseApi.createRelation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.relations });
      toast.success("Relation created successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create relation");
    },
  });
};

export const useUpdateRelation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IRelation,
    AxiosError<ApiError>,
    { relationId: string; data: TUpdateRelation }
  >({
    mutationFn: ({ relationId, data }) =>
      databaseApi.updateRelation(relationId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.relations });
      queryClient.invalidateQueries({
        queryKey: DATABASE_KEYS.relation(variables.relationId),
      });
      toast.success("Relation updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update relation");
    },
  });
};

export const useDeleteRelation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ApiError>, { id: string }>({
    mutationFn: ({ id }) => databaseApi.deleteRelation(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.relations });
      queryClient.removeQueries({
        queryKey: DATABASE_KEYS.relation(variables.id),
      });
      toast.success("Relation deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete relation");
    },
  });
};

export const useRelationConnections = (
  params?: IRelationConnectionQueryParams
) => {
  return useQuery<TRelationConnectionList, AxiosError>({
    queryKey: [...DATABASE_KEYS.relations, "connections", params],
    queryFn: () => databaseApi.getRelationConnections(params),
  });
};

export const useCreateRelationConnection = () => {
  const queryClient = useQueryClient();

  return useMutation<
    TRelationConnection,
    AxiosError<ApiError>,
    { data: TCreateRelationConnection }
  >({
    mutationFn: ({ data }) => databaseApi.createRelationConnection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...DATABASE_KEYS.relations, "connections"],
      });
      toast.success("Relation connection created successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to create relation connection"
      );
    },
  });
};

export const useDeleteRelationConnection = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ApiError>, { id: string }>({
    mutationFn: ({ id }) => databaseApi.deleteRelationConnection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...DATABASE_KEYS.relations, "connections"],
      });
      toast.success("Relation connection deleted successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to delete relation connection"
      );
    },
  });
};

// Block hooks
export const useBlocks = (
  databaseId: string,
  recordId: string,
  params?: IBlockSearchOptions
) => {
  return useQuery<IBlockList, AxiosError>({
    queryKey: [...DATABASE_KEYS.blocks(databaseId, recordId), params],
    queryFn: () => databaseApi.getBlocks(databaseId, recordId, params),
    enabled: !!databaseId && !!recordId,
  });
};

export const useBlock = (
  databaseId: string,
  recordId: string,
  blockId: string
) => {
  return useQuery<TContentBlock, AxiosError>({
    queryKey: DATABASE_KEYS.block(databaseId, recordId, blockId),
    queryFn: () => databaseApi.getBlock(databaseId, recordId, blockId),
    enabled: !!databaseId && !!recordId && !!blockId,
  });
};

export const useCreateBlock = () => {
  const queryClient = useQueryClient();

  return useMutation<
    TContentBlock,
    AxiosError<ApiError>,
    { databaseId: string; recordId: string; data: ICreateBlock }
  >({
    mutationFn: ({ databaseId, recordId, data }) =>
      databaseApi.createBlock(databaseId, recordId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: DATABASE_KEYS.blocks(
          variables.databaseId,
          variables.recordId
        ),
      });
      toast.success("Block created successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create block");
    },
  });
};

export const useUpdateBlock = () => {
  const queryClient = useQueryClient();

  return useMutation<
    TContentBlock,
    AxiosError<ApiError>,
    {
      databaseId: string;
      recordId: string;
      blockId: string;
      data: IUpdateBlock;
    }
  >({
    mutationFn: ({ databaseId, recordId, blockId, data }) =>
      databaseApi.updateBlock(databaseId, recordId, blockId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: DATABASE_KEYS.blocks(
          variables.databaseId,
          variables.recordId
        ),
      });
      queryClient.invalidateQueries({
        queryKey: DATABASE_KEYS.block(
          variables.databaseId,
          variables.recordId,
          variables.blockId
        ),
      });
      toast.success("Block updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update block");
    },
  });
};

export const useDeleteBlock = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<ApiError>,
    { databaseId: string; recordId: string; blockId: string }
  >({
    mutationFn: ({ databaseId, recordId, blockId }) =>
      databaseApi.deleteBlock(databaseId, recordId, blockId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: DATABASE_KEYS.blocks(
          variables.databaseId,
          variables.recordId
        ),
      });
      queryClient.removeQueries({
        queryKey: DATABASE_KEYS.block(
          variables.databaseId,
          variables.recordId,
          variables.blockId
        ),
      });
      toast.success("Block deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete block");
    },
  });
};

export const useBulkBlockOperations = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<ApiError>,
    { databaseId: string; recordId: string; operations: IBulkBlockOperation[] }
  >({
    mutationFn: ({ databaseId, recordId, operations }) =>
      databaseApi.bulkBlockOperations(databaseId, recordId, operations),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: DATABASE_KEYS.blocks(
          variables.databaseId,
          variables.recordId
        ),
      });
      toast.success("Block operations completed successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to perform block operations"
      );
    },
  });
};

export const useMoveBlock = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<ApiError>,
    {
      databaseId: string;
      recordId: string;
      blockId: string;
      afterBlockId?: string;
      parentId?: string;
    }
  >({
    mutationFn: ({ databaseId, recordId, blockId, afterBlockId, parentId }) =>
      databaseApi.moveBlock(databaseId, recordId, blockId, {
        afterBlockId,
        parentId,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: DATABASE_KEYS.blocks(
          variables.databaseId,
          variables.recordId
        ),
      });
      toast.success("Block moved successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to move block");
    },
  });
};

export const useDuplicateBlock = () => {
  const queryClient = useQueryClient();

  return useMutation<
    TContentBlock,
    AxiosError<ApiError>,
    { databaseId: string; recordId: string; blockId: string }
  >({
    mutationFn: ({ databaseId, recordId, blockId }) =>
      databaseApi.duplicateBlock(databaseId, recordId, blockId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: DATABASE_KEYS.blocks(
          variables.databaseId,
          variables.recordId
        ),
      });
      toast.success("Block duplicated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to duplicate block");
    },
  });
};

// Database-level filter and sort hooks
export const useDatabaseFilters = (
  databaseId: string,
  params?: TDatabaseFilterQueryParams
) => {
  return useQuery<TDatabaseFilter[], AxiosError>({
    queryKey: [...DATABASE_KEYS.detail(databaseId), "filters", params],
    queryFn: () => databaseApi.getDatabaseFilters(databaseId, params),
    enabled: !!databaseId,
  });
};

export const useDatabaseFilter = (databaseId: string, filterId: string) => {
  return useQuery<TDatabaseFilter, AxiosError>({
    queryKey: [...DATABASE_KEYS.detail(databaseId), "filters", filterId],
    queryFn: () => databaseApi.getDatabaseFilterById(databaseId, filterId),
    enabled: !!databaseId && !!filterId,
  });
};

export const useCreateDatabaseFilter = () => {
  const queryClient = useQueryClient();

  return useMutation<
    TDatabaseFilter,
    AxiosError<ApiError>,
    { databaseId: string; data: TCreateDatabaseFilter }
  >({
    mutationFn: ({ databaseId, data }) =>
      databaseApi.createDatabaseFilter(databaseId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...DATABASE_KEYS.detail(variables.databaseId), "filters"],
      });
      toast.success("Database filter created successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to create database filter"
      );
    },
  });
};

export const useUpdateDatabaseFilter = () => {
  const queryClient = useQueryClient();

  return useMutation<
    TDatabaseFilter,
    AxiosError<ApiError>,
    { databaseId: string; filterId: string; data: TUpdateDatabaseFilter }
  >({
    mutationFn: ({ databaseId, filterId, data }) =>
      databaseApi.updateDatabaseFilter(databaseId, filterId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...DATABASE_KEYS.detail(variables.databaseId), "filters"],
      });
      queryClient.invalidateQueries({
        queryKey: [
          ...DATABASE_KEYS.detail(variables.databaseId),
          "filters",
          variables.filterId,
        ],
      });
      toast.success("Database filter updated successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update database filter"
      );
    },
  });
};

export const useDeleteDatabaseFilter = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<ApiError>,
    { databaseId: string; filterId: string }
  >({
    mutationFn: ({ databaseId, filterId }) =>
      databaseApi.deleteDatabaseFilter(databaseId, filterId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...DATABASE_KEYS.detail(variables.databaseId), "filters"],
      });
      queryClient.removeQueries({
        queryKey: [
          ...DATABASE_KEYS.detail(variables.databaseId),
          "filters",
          variables.filterId,
        ],
      });
      toast.success("Database filter deleted successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to delete database filter"
      );
    },
  });
};

export const useDuplicateDatabaseFilter = () => {
  const queryClient = useQueryClient();

  return useMutation<
    TDatabaseFilter,
    AxiosError<ApiError>,
    { databaseId: string; filterId: string; name?: string }
  >({
    mutationFn: ({ databaseId, filterId, name }) =>
      databaseApi.duplicateDatabaseFilter(databaseId, filterId, name),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...DATABASE_KEYS.detail(variables.databaseId), "filters"],
      });
      toast.success("Database filter duplicated successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to duplicate database filter"
      );
    },
  });
};

export const useDatabaseSorts = (
  databaseId: string,
  params?: TDatabaseSortQueryParams
) => {
  return useQuery<ApiResponse<TDatabaseSort[]>, AxiosError>({
    queryKey: [...DATABASE_KEYS.detail(databaseId), "sorts", params],
    queryFn: () => databaseApi.getDatabaseSorts(databaseId, params),
    enabled: !!databaseId,
  });
};

export const useDatabaseSort = (databaseId: string, sortId: string) => {
  return useQuery<ApiResponse<TDatabaseSort>, AxiosError>({
    queryKey: [...DATABASE_KEYS.detail(databaseId), "sorts", sortId],
    queryFn: () => databaseApi.getDatabaseSortById(databaseId, sortId),
    enabled: !!databaseId && !!sortId,
  });
};

export const useCreateDatabaseSort = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<TDatabaseSort>,
    AxiosError<ApiError>,
    { databaseId: string; data: TCreateDatabaseSort }
  >({
    mutationFn: ({ databaseId, data }) =>
      databaseApi.createDatabaseSort(databaseId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...DATABASE_KEYS.detail(variables.databaseId), "sorts"],
      });
      toast.success("Database sort created successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to create database sort"
      );
    },
  });
};

export const useUpdateDatabaseSort = () => {
  const queryClient = useQueryClient();

  return useMutation<
    TDatabaseSort,
    AxiosError<ApiError>,
    { databaseId: string; sortId: string; data: TUpdateDatabaseSort }
  >({
    mutationFn: ({ databaseId, sortId, data }) =>
      databaseApi.updateDatabaseSort(databaseId, sortId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...DATABASE_KEYS.detail(variables.databaseId), "sorts"],
      });
      queryClient.invalidateQueries({
        queryKey: [
          ...DATABASE_KEYS.detail(variables.databaseId),
          "sorts",
          variables.sortId,
        ],
      });
      toast.success("Database sort updated successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update database sort"
      );
    },
  });
};

export const useDeleteDatabaseSort = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<ApiError>,
    { databaseId: string; sortId: string }
  >({
    mutationFn: ({ databaseId, sortId }) =>
      databaseApi.deleteDatabaseSort(databaseId, sortId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...DATABASE_KEYS.detail(variables.databaseId), "sorts"],
      });
      queryClient.removeQueries({
        queryKey: [
          ...DATABASE_KEYS.detail(variables.databaseId),
          "sorts",
          variables.sortId,
        ],
      });
      toast.success("Database sort deleted successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to delete database sort"
      );
    },
  });
};

export const useDuplicateDatabaseSort = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<TDatabaseSort>,
    AxiosError<ApiError>,
    { databaseId: string; sortId: string; name?: string }
  >({
    mutationFn: ({ databaseId, sortId, name }) =>
      databaseApi.duplicateDatabaseSort(databaseId, sortId, name),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...DATABASE_KEYS.detail(variables.databaseId), "sorts"],
      });
      toast.success("Database sort duplicated successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to duplicate database sort"
      );
    },
  });
};

export const useDatabaseFilterPresets = (
  databaseId: string,
  params?: TDatabaseFilterPresetQueryParams
) => {
  return useQuery<ApiResponse<TDatabaseFilterPreset[]>, AxiosError>({
    queryKey: [...DATABASE_KEYS.detail(databaseId), "filter-presets", params],
    queryFn: () => databaseApi.getDatabaseFilterPresets(databaseId, params),
    enabled: !!databaseId,
  });
};

export const useDatabaseFilterPreset = (
  databaseId: string,
  presetId: string
) => {
  return useQuery<ApiResponse<TDatabaseFilterPreset>, AxiosError>({
    queryKey: [...DATABASE_KEYS.detail(databaseId), "filter-presets", presetId],
    queryFn: () =>
      databaseApi.getDatabaseFilterPresetById(databaseId, presetId),
    enabled: !!databaseId && !!presetId,
  });
};

export const useCreateDatabaseFilterPreset = () => {
  const queryClient = useQueryClient();

  return useMutation<
    TDatabaseFilterPreset,
    AxiosError<ApiError>,
    { databaseId: string; data: TCreateDatabaseFilterPreset }
  >({
    mutationFn: ({ databaseId, data }) =>
      databaseApi.createDatabaseFilterPreset(databaseId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          ...DATABASE_KEYS.detail(variables.databaseId),
          "filter-presets",
        ],
      });
      toast.success("Database filter preset created successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to create database filter preset"
      );
    },
  });
};

export const useUpdateDatabaseFilterPreset = () => {
  const queryClient = useQueryClient();

  return useMutation<
    TDatabaseFilterPreset,
    AxiosError<ApiError>,
    { databaseId: string; presetId: string; data: TUpdateDatabaseFilterPreset }
  >({
    mutationFn: ({ databaseId, presetId, data }) =>
      databaseApi.updateDatabaseFilterPreset(databaseId, presetId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          ...DATABASE_KEYS.detail(variables.databaseId),
          "filter-presets",
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          ...DATABASE_KEYS.detail(variables.databaseId),
          "filter-presets",
          variables.presetId,
        ],
      });
      toast.success("Database filter preset updated successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to update database filter preset"
      );
    },
  });
};

export const useDeleteDatabaseFilterPreset = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<ApiError>,
    { databaseId: string; presetId: string }
  >({
    mutationFn: ({ databaseId, presetId }) =>
      databaseApi.deleteDatabaseFilterPreset(databaseId, presetId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          ...DATABASE_KEYS.detail(variables.databaseId),
          "filter-presets",
        ],
      });
      queryClient.removeQueries({
        queryKey: [
          ...DATABASE_KEYS.detail(variables.databaseId),
          "filter-presets",
          variables.presetId,
        ],
      });
      toast.success("Database filter preset deleted successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete database filter preset"
      );
    },
  });
};

export const useDuplicateDatabaseFilterPreset = () => {
  const queryClient = useQueryClient();

  return useMutation<
    TDatabaseFilterPreset,
    AxiosError<ApiError>,
    { databaseId: string; presetId: string; name?: string }
  >({
    mutationFn: ({ databaseId, presetId, name }) =>
      databaseApi.duplicateDatabaseFilterPreset(databaseId, presetId, name),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          ...DATABASE_KEYS.detail(variables.databaseId),
          "filter-presets",
        ],
      });
      toast.success("Database filter preset duplicated successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to duplicate database filter preset"
      );
    },
  });
};

export const useApplyDatabaseFilterPreset = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<ApiError>,
    { databaseId: string; presetId: string }
  >({
    mutationFn: ({ databaseId, presetId }) =>
      databaseApi.applyDatabaseFilterPreset(databaseId, presetId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: DATABASE_KEYS.records(variables.databaseId),
      });
      toast.success("Database filter preset applied successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to apply database filter preset"
      );
    },
  });
};
