import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {databaseApi} from "./database-api";
import {toast} from "sonner";
import type {AxiosError} from "axios";

import type {ApiError} from "@/types/api.types.ts";
import type {
  TCreateDocumentRequest, TCreateRecord,
  TDatabase,
  TDatabaseQueryParams, TRecord, TRecordQueryParams,
  TUpdateDocumentRequest, TUpdateViewRequest, TView
} from "@/modules/database-view/types";

export const DATABASE_KEYS = {
  all: ["databases"] as const,
  lists: () => [...DATABASE_KEYS.all, "list"] as const,
  list: (filters: IDatabaseQueryParams) =>
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
  return useQuery<TDatabase[], AxiosError>({
    queryKey: DATABASE_KEYS.list(params || {}),
    queryFn: () => databaseApi.getDatabases(params),
  });
};

export const useDatabase = (id: string) => {
  return useQuery<TDatabase, AxiosError>({
    queryKey: DATABASE_KEYS.detail(id),
    queryFn: () => databaseApi.getDatabaseById(id),
    enabled: !!id,
  });
};

export const useDatabaseStats = (id: string) => {
  return useQuery<IDatabaseStats, AxiosError>({
    queryKey: DATABASE_KEYS.stats(id),
    queryFn: () => databaseApi.getDatabaseStats(id),
    enabled: !!id,
  });
};

export const useCreateDatabase = () => {
  const queryClient = useQueryClient();

  return useMutation<TDatabase, AxiosError<ApiError>, TCreateDocumentRequest>({
    mutationFn: databaseApi.createDatabase,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: DATABASE_KEYS.lists()});
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
    { id: string; data: TUpdateDocumentRequest }
  >({
    mutationFn: ({id, data}) => databaseApi.updateDatabase(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: DATABASE_KEYS.detail(variables.id),
      });
      queryClient.invalidateQueries({queryKey: DATABASE_KEYS.lists()});
      toast.success("Database updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update database");
    },
  });
};

export const useDeleteDatabase = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ApiError>, string>({
    mutationFn: databaseApi.deleteDatabase,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({queryKey: DATABASE_KEYS.lists()});
      queryClient.removeQueries({queryKey: DATABASE_KEYS.detail(id)});
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
    IDatabase,
    AxiosError<ApiError>,
    { id: string; name: string }
  >({
    mutationFn: ({id, name}) => databaseApi.duplicateDatabase(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: DATABASE_KEYS.lists()});
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
export const useProperties = (databaseId?: string, params?: IPropertyQueryParams) => {
  return useQuery<IPropertyListResponse, AxiosError>({
    queryKey: [...DATABASE_KEYS.properties(databaseId), params?.viewId],
    queryFn: () => databaseApi.getProperties(databaseId, params),
    enabled: !!databaseId,
  });
};

export const useProperty = (databaseId: string, propertyId: string) => {
  return useQuery<IDatabaseProperty, AxiosError>({
    queryKey: DATABASE_KEYS.property(databaseId, propertyId),
    queryFn: () => databaseApi.getProperty(databaseId, propertyId),
    enabled: !!databaseId && !!propertyId,
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IDatabaseProperty,
    AxiosError<ApiError>,
    { databaseId: string; data: ICreatePropertyRequest }
  >({
    mutationFn: ({databaseId, data}) =>
      databaseApi.createProperty(databaseId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: DATABASE_KEYS.properties(variables.databaseId),
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
    IDatabaseProperty,
    AxiosError<ApiError>,
    { databaseId: string; propertyId: string; data: IUpdatePropertyRequest }
  >({
    mutationFn: ({databaseId, propertyId, data}) =>
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
    mutationFn: ({databaseId, propertyId}) =>
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

export const useReorderProperties = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<ApiError>,
    {
      databaseId: string;
      data: IReorderPropertiesRequest;
    }
  >({
    mutationFn: ({databaseId, data}) =>
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

export const useRecords = (
  databaseId: string,
  params?: TRecordQueryParams
) => {
  return useQuery({
    queryKey: [...DATABASE_KEYS.records(databaseId), params],
    queryFn: () => databaseApi.getRecords(databaseId, params),
    enabled: !!databaseId,
  });
};

export const useRecord = (databaseId: string, recordId: string) => {
  return useQuery<TRecord, AxiosError>({
    queryKey: DATABASE_KEYS.record(databaseId, recordId),
    queryFn: () => databaseApi.getRecordById(databaseId, recordId),
    enabled: !!databaseId && !!recordId,
  });
};

export const useCreateRecord = () => {
  const queryClient = useQueryClient();

  return useMutation<
    TRecord,
    AxiosError<ApiError>,
    { databaseId: string; data: TCreateRecord }
  >({
    mutationFn: ({databaseId, data}) =>
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

  return useMutation({
    mutationFn: (databaseId: string, recordId: string, payload: Record<string, any>) => databaseApi.updateRecord(databaseId, recordId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: DATABASE_KEYS.records(variables.databaseId),
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
    mutationFn: ({databaseId, recordId}) =>
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
    { databaseId: string; data: IBulkUpdateRecordsRequest }
  >({
    mutationFn: ({databaseId, data}) =>
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
    { databaseId: string; data: IBulkDeleteRecordsRequest }
  >({
    mutationFn: ({databaseId, data}) =>
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
    IDatabaseRecord,
    AxiosError<ApiError>,
    {
      databaseId: string;
      recordId: string;
      data?: IDuplicateRecordRequest;
    }
  >({
    mutationFn: ({databaseId, recordId, data}) =>
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
  return useQuery<IViewListResponse, AxiosError>({
    queryKey: DATABASE_KEYS.views(databaseId),
    queryFn: () => databaseApi.getViews(databaseId),
    enabled: !!databaseId,
  });
};

export const useView = (databaseId: string, viewId: string) => {
  return useQuery({
    queryKey: DATABASE_KEYS.view(databaseId, viewId),
    queryFn: () => databaseApi.getViewById(databaseId, viewId),
    enabled: !!databaseId && !!viewId,
  });
};

export const useCreateView = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IDatabaseView,
    AxiosError<ApiError>,
    { databaseId: string; data: ICreateViewRequest }
  >({
    mutationFn: ({databaseId, data}) =>
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
    TView,
    AxiosError<ApiError>,
    { databaseId: string; viewId: string; data: TUpdateViewRequest }
  >({
    mutationFn: ({databaseId, viewId, data}) =>
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

export const useDeleteView = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<ApiError>,
    { databaseId: string; viewId: string }
  >({
    mutationFn: ({databaseId, viewId}) =>
      databaseApi.deleteView(databaseId, viewId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: DATABASE_KEYS.views(variables.databaseId),
      });
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
    IDatabaseView,
    AxiosError<ApiError>,
    { databaseId: string; viewId: string; newName?: string }
  >({
    mutationFn: ({databaseId, viewId, newName}) =>
      databaseApi.duplicateView(databaseId, viewId, newName),
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
export const useRelations = (params?: IRelationQueryParams) => {
  return useQuery<TRelationList, AxiosError>({
    queryKey: [...DATABASE_KEYS.relations, params],
    queryFn: () => databaseApi.getRelations(params),
  });
};

export const useRelation = (relationId: string) => {
  return useQuery<IRelation, AxiosError>({
    queryKey: DATABASE_KEYS.relation(relationId),
    queryFn: () => databaseApi.getRelation(relationId),
    enabled: !!relationId,
  });
};

export const useCreateRelation = () => {
  const queryClient = useQueryClient();

  return useMutation<IRelation, AxiosError<ApiError>, ICreateRelation>({
    mutationFn: databaseApi.createRelation,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: DATABASE_KEYS.relations});
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
    { relationId: string; data: IUpdateRelation }
  >({
    mutationFn: ({relationId, data}) =>
      databaseApi.updateRelation(relationId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: DATABASE_KEYS.relations});
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

  return useMutation<void, AxiosError<ApiError>, string>({
    mutationFn: databaseApi.deleteRelation,
    onSuccess: (_, relationId) => {
      queryClient.invalidateQueries({queryKey: DATABASE_KEYS.relations});
      queryClient.removeQueries({
        queryKey: DATABASE_KEYS.relation(relationId),
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
    IRelationConnection,
    AxiosError<ApiError>,
    ICreateRelationConnection
  >({
    mutationFn: databaseApi.createRelationConnection,
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

  return useMutation<void, AxiosError<ApiError>, string>({
    mutationFn: databaseApi.deleteRelationConnection,
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
  return useQuery<IContentBlock, AxiosError>({
    queryKey: DATABASE_KEYS.block(databaseId, recordId, blockId),
    queryFn: () => databaseApi.getBlock(databaseId, recordId, blockId),
    enabled: !!databaseId && !!recordId && !!blockId,
  });
};

export const useCreateBlock = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IContentBlock,
    AxiosError<ApiError>,
    { databaseId: string; recordId: string; data: ICreateBlock }
  >({
    mutationFn: ({databaseId, recordId, data}) =>
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
    IContentBlock,
    AxiosError<ApiError>,
    {
      databaseId: string;
      recordId: string;
      blockId: string;
      data: IUpdateBlock;
    }
  >({
    mutationFn: ({databaseId, recordId, blockId, data}) =>
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
    mutationFn: ({databaseId, recordId, blockId}) =>
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
    mutationFn: ({databaseId, recordId, operations}) =>
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
    mutationFn: ({databaseId, recordId, blockId, afterBlockId, parentId}) =>
      databaseApi.moveBlock(
        databaseId,
        recordId,
        blockId,
        afterBlockId,
        parentId
      ),
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
    IContentBlock,
    AxiosError<ApiError>,
    { databaseId: string; recordId: string; blockId: string }
  >({
    mutationFn: ({databaseId, recordId, blockId}) =>
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
