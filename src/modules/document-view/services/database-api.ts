import { apiClient } from "@/services/api-client.ts";
import type {
  IDatabase,
  IDatabaseListResponse,
  IDatabaseStatsResponse,
  ICreateDatabaseRequest,
  IUpdateDatabaseRequest,
  IPropertyResponse,
  TPropertyListResponse,
  ICreatePropertyRequest,
  IUpdatePropertyRequest,
  IRecordResponse,
  IRecordListResponse,
  ICreateRecordRequest,
  IUpdateRecordRequest,
  IBulkUpdateRecordsRequest,
  IBulkDeleteRecordsRequest,
  IViewResponse,
  TViewListResponse,
  ICreateViewRequest,
  IUpdateViewRequest,
  IRelationResponse,
  TRelationListResponse,
  ICreateRelationRequest,
  IUpdateRelationRequest,
  ICreateRelationConnectionRequest,
  IRelationConnectionResponse,
  TRelationConnectionListResponse,
  IBlockResponse,
  IBlockListResponse,
  ICreateBlockRequest,
  IUpdateBlockRequest,
  IBulkBlockOperation,
  IRecordQueryParams,
  IDatabaseQueryParams,
  IRelationQueryParams,
  IRelationConnectionQueryParams,
  IBlockSearchOptions,
} from "@/modules/document-view/types";
import { API_ENDPOINTS } from "@/constants/api-endpoints.ts";
import type {ApiResponse} from "@/types/api.types.ts";

export const databaseApi = {
  // Database endpoints
  getDatabases: async (
    params?: IDatabaseQueryParams
  ): Promise<IDatabaseListResponse> => {
    const response = await apiClient.get<ApiResponse<IDatabaseListResponse>>(
      API_ENDPOINTS.DATABASE.GET_ALL,
      { params }
    );
    return response.data.data;
  },

  getDatabase: async (id: string): Promise<IDatabase> => {
    const response = await apiClient.get<ApiResponse<IDatabase>>(
      `${API_ENDPOINTS.DATABASE.GET_BY_ID.replace(":id", id)}`
    );
    return response.data.data;
  },

  createDatabase: async (data: ICreateDatabaseRequest): Promise<IDatabase> => {
    const response = await apiClient.post<ApiResponse<IDatabase>>(
      API_ENDPOINTS.DATABASE.CREATE,
      data
    );
    return response.data.data;
  },

  updateDatabase: async (
    id: string,
    data: IUpdateDatabaseRequest
  ): Promise<IDatabase> => {
    const response = await apiClient.put<ApiResponse<IDatabase>>(
      `${API_ENDPOINTS.DATABASE.UPDATE.replace(":id", id)}`,
      data
    );
    return response.data.data;
  },

  deleteDatabase: async (id: string): Promise<void> => {
    await apiClient.delete(
      `${API_ENDPOINTS.DATABASE.DELETE.replace(":id", id)}`
    );
  },

  getDatabaseStats: async (id: string): Promise<IDatabaseStatsResponse> => {
    const response = await apiClient.get<ApiResponse<IDatabaseStatsResponse>>(
      `${API_ENDPOINTS.DATABASE.STATS.replace(":id", id)}`
    );
    return response.data.data;
  },

  duplicateDatabase: async (id: string, name: string): Promise<IDatabase> => {
    const response = await apiClient.post<ApiResponse<IDatabase>>(
      `${API_ENDPOINTS.DATABASE.DUPLICATE.replace(":id", id)}`,
      { name }
    );
    return response.data.data;
  },

  // Property endpoints
  getProperties: async (databaseId: string): Promise<TPropertyListResponse> => {
    const response = await apiClient.get<ApiResponse<TPropertyListResponse>>(
      `${API_ENDPOINTS.PROPERTY.GET_ALL.replace(":databaseId", databaseId)}`
    );
    return response.data.data;
  },

  getProperty: async (
    databaseId: string,
    propertyId: string
  ): Promise<IPropertyResponse> => {
    const response = await apiClient.get<ApiResponse<IPropertyResponse>>(
      `${API_ENDPOINTS.PROPERTY.GET_BY_ID.replace(
        ":databaseId",
        databaseId
      ).replace(":propertyId", propertyId)}`
    );
    return response.data.data;
  },

  createProperty: async (
    databaseId: string,
    data: ICreatePropertyRequest
  ): Promise<IPropertyResponse> => {
    const response = await apiClient.post<ApiResponse<IPropertyResponse>>(
      `${API_ENDPOINTS.PROPERTY.CREATE.replace(":databaseId", databaseId)}`,
      data
    );
    return response.data.data;
  },

  updateProperty: async (
    databaseId: string,
    propertyId: string,
    data: IUpdatePropertyRequest
  ): Promise<IPropertyResponse> => {
    const response = await apiClient.put<ApiResponse<IPropertyResponse>>(
      `${API_ENDPOINTS.PROPERTY.UPDATE.replace(
        ":databaseId",
        databaseId
      ).replace(":propertyId", propertyId)}`,
      data
    );
    return response.data.data;
  },

  deleteProperty: async (
    databaseId: string,
    propertyId: string
  ): Promise<void> => {
    await apiClient.delete(
      `${API_ENDPOINTS.PROPERTY.DELETE.replace(
        ":databaseId",
        databaseId
      ).replace(":propertyId", propertyId)}`
    );
  },

  reorderProperties: async (
    databaseId: string,
    propertyOrders: Array<{ propertyId: string; order: number }>
  ): Promise<void> => {
    await apiClient.put(
      `${API_ENDPOINTS.PROPERTY.REORDER.replace(":databaseId", databaseId)}`,
      { propertyOrders }
    );
  },

  // Record endpoints
  getRecords: async (
    databaseId: string,
    params?: IRecordQueryParams
  ): Promise<IRecordListResponse> => {
    const response = await apiClient.get<ApiResponse<IRecordListResponse>>(
      `${API_ENDPOINTS.RECORD.GET_ALL.replace(":databaseId", databaseId)}`,
      { params }
    );
    return response.data.data;
  },

  getRecord: async (
    databaseId: string,
    recordId: string
  ): Promise<IRecordResponse> => {
    const response = await apiClient.get<ApiResponse<IRecordResponse>>(
      `${API_ENDPOINTS.RECORD.GET_BY_ID.replace(
        ":databaseId",
        databaseId
      ).replace(":recordId", recordId)}`
    );
    return response.data.data;
  },

  createRecord: async (
    databaseId: string,
    data: ICreateRecordRequest
  ): Promise<IRecordResponse> => {
    const response = await apiClient.post<ApiResponse<IRecordResponse>>(
      `${API_ENDPOINTS.RECORD.CREATE.replace(":databaseId", databaseId)}`,
      data
    );
    return response.data.data;
  },

  updateRecord: async (
    databaseId: string,
    recordId: string,
    data: IUpdateRecordRequest
  ): Promise<IRecordResponse> => {
    const response = await apiClient.put<ApiResponse<IRecordResponse>>(
      `${API_ENDPOINTS.RECORD.UPDATE.replace(":databaseId", databaseId).replace(
        ":recordId",
        recordId
      )}`,
      data
    );
    return response.data.data;
  },

  deleteRecord: async (databaseId: string, recordId: string): Promise<void> => {
    await apiClient.delete(
      `${API_ENDPOINTS.RECORD.DELETE.replace(":databaseId", databaseId).replace(
        ":recordId",
        recordId
      )}`
    );
  },

  bulkUpdateRecords: async (
    databaseId: string,
    data: IBulkUpdateRecordsRequest
  ): Promise<void> => {
    await apiClient.post(
      `${API_ENDPOINTS.RECORD.BULK_UPDATE.replace(":databaseId", databaseId)}`,
      data
    );
  },

  bulkDeleteRecords: async (
    databaseId: string,
    data: IBulkDeleteRecordsRequest
  ): Promise<void> => {
    await apiClient.post(
      `${API_ENDPOINTS.RECORD.BULK_DELETE.replace(":databaseId", databaseId)}`,
      data
    );
  },

  duplicateRecord: async (
    databaseId: string,
    recordId: string,
    data: { includeContent?: boolean; newProperties?: Record<string, any> }
  ): Promise<IRecordResponse> => {
    const response = await apiClient.post<ApiResponse<IRecordResponse>>(
      `${API_ENDPOINTS.RECORD.DUPLICATE.replace(
        ":databaseId",
        databaseId
      ).replace(":recordId", recordId)}`,
      data
    );
    return response.data.data;
  },

  // View endpoints
  getViews: async (databaseId: string): Promise<TViewListResponse> => {
    const response = await apiClient.get<ApiResponse<TViewListResponse>>(
      `${API_ENDPOINTS.VIEW.GET_ALL.replace(":databaseId", databaseId)}`
    );
    return response.data.data;
  },

  getView: async (
    databaseId: string,
    viewId: string
  ): Promise<IViewResponse> => {
    const response = await apiClient.get<ApiResponse<IViewResponse>>(
      `${API_ENDPOINTS.VIEW.GET_BY_ID.replace(
        ":databaseId",
        databaseId
      ).replace(":viewId", viewId)}`
    );
    return response.data.data;
  },

  createView: async (
    databaseId: string,
    data: ICreateViewRequest
  ): Promise<IViewResponse> => {
    const response = await apiClient.post<ApiResponse<IViewResponse>>(
      `${API_ENDPOINTS.VIEW.CREATE.replace(":databaseId", databaseId)}`,
      data
    );
    return response.data.data;
  },

  updateView: async (
    databaseId: string,
    viewId: string,
    data: IUpdateViewRequest
  ): Promise<IViewResponse> => {
    const response = await apiClient.put<ApiResponse<IViewResponse>>(
      `${API_ENDPOINTS.VIEW.UPDATE.replace(":databaseId", databaseId).replace(
        ":viewId",
        viewId
      )}`,
      data
    );
    return response.data.data;
  },

  deleteView: async (databaseId: string, viewId: string): Promise<void> => {
    await apiClient.delete(
      `${API_ENDPOINTS.VIEW.DELETE.replace(":databaseId", databaseId).replace(
        ":viewId",
        viewId
      )}`
    );
  },

  // Relation endpoints
  getRelations: async (
    params?: IRelationQueryParams
  ): Promise<TRelationListResponse> => {
    const response = await apiClient.get<ApiResponse<TRelationListResponse>>(
      API_ENDPOINTS.RELATION.GET_ALL,
      { params }
    );
    return response.data.data;
  },

  getRelation: async (relationId: string): Promise<IRelationResponse> => {
    const response = await apiClient.get<ApiResponse<IRelationResponse>>(
      `${API_ENDPOINTS.RELATION.GET_BY_ID.replace(":relationId", relationId)}`
    );
    return response.data.data;
  },

  createRelation: async (
    data: ICreateRelationRequest
  ): Promise<IRelationResponse> => {
    const response = await apiClient.post<ApiResponse<IRelationResponse>>(
      API_ENDPOINTS.RELATION.CREATE,
      data
    );
    return response.data.data;
  },

  updateRelation: async (
    relationId: string,
    data: IUpdateRelationRequest
  ): Promise<IRelationResponse> => {
    const response = await apiClient.put<ApiResponse<IRelationResponse>>(
      `${API_ENDPOINTS.RELATION.UPDATE.replace(":relationId", relationId)}`,
      data
    );
    return response.data.data;
  },

  deleteRelation: async (relationId: string): Promise<void> => {
    await apiClient.delete(
      `${API_ENDPOINTS.RELATION.DELETE.replace(":relationId", relationId)}`
    );
  },

  getRelationConnections: async (
    params?: IRelationConnectionQueryParams
  ): Promise<TRelationConnectionListResponse> => {
    const response = await apiClient.get<
      ApiResponse<TRelationConnectionListResponse>
    >(API_ENDPOINTS.RELATION.CONNECTIONS, { params });
    return response.data.data;
  },

  createRelationConnection: async (
    data: ICreateRelationConnectionRequest
  ): Promise<IRelationConnectionResponse> => {
    const response = await apiClient.post<
      ApiResponse<IRelationConnectionResponse>
    >(API_ENDPOINTS.RELATION.CREATE_CONNECTION, data);
    return response.data.data;
  },

  deleteRelationConnection: async (connectionId: string): Promise<void> => {
    await apiClient.delete(
      `${API_ENDPOINTS.RELATION.DELETE_CONNECTION.replace(
        ":connectionId",
        connectionId
      )}`
    );
  },

  // Block endpoints
  getBlocks: async (
    databaseId: string,
    recordId: string,
    params?: IBlockSearchOptions
  ): Promise<IBlockListResponse> => {
    const response = await apiClient.get<ApiResponse<IBlockListResponse>>(
      `${API_ENDPOINTS.BLOCK.GET_ALL.replace(":databaseId", databaseId).replace(
        ":recordId",
        recordId
      )}`,
      { params }
    );
    return response.data.data;
  },

  getBlock: async (
    databaseId: string,
    recordId: string,
    blockId: string
  ): Promise<IBlockResponse> => {
    const response = await apiClient.get<ApiResponse<IBlockResponse>>(
      `${API_ENDPOINTS.BLOCK.GET_BY_ID.replace(":databaseId", databaseId)
        .replace(":recordId", recordId)
        .replace(":blockId", blockId)}`
    );
    return response.data.data;
  },

  createBlock: async (
    databaseId: string,
    recordId: string,
    data: ICreateBlockRequest
  ): Promise<IBlockResponse> => {
    const response = await apiClient.post<ApiResponse<IBlockResponse>>(
      `${API_ENDPOINTS.BLOCK.CREATE.replace(":databaseId", databaseId).replace(
        ":recordId",
        recordId
      )}`,
      data
    );
    return response.data.data;
  },

  updateBlock: async (
    databaseId: string,
    recordId: string,
    blockId: string,
    data: IUpdateBlockRequest
  ): Promise<IBlockResponse> => {
    const response = await apiClient.put<ApiResponse<IBlockResponse>>(
      `${API_ENDPOINTS.BLOCK.UPDATE.replace(":databaseId", databaseId)
        .replace(":recordId", recordId)
        .replace(":blockId", blockId)}`,
      data
    );
    return response.data.data;
  },

  deleteBlock: async (
    databaseId: string,
    recordId: string,
    blockId: string
  ): Promise<void> => {
    await apiClient.delete(
      `${API_ENDPOINTS.BLOCK.DELETE.replace(":databaseId", databaseId)
        .replace(":recordId", recordId)
        .replace(":blockId", blockId)}`
    );
  },

  bulkBlockOperations: async (
    databaseId: string,
    recordId: string,
    operations: IBulkBlockOperation[]
  ): Promise<void> => {
    await apiClient.post(
      `${API_ENDPOINTS.BLOCK.BULK_OPERATIONS.replace(
        ":databaseId",
        databaseId
      ).replace(":recordId", recordId)}`,
      { operations }
    );
  },

  moveBlock: async (
    databaseId: string,
    recordId: string,
    blockId: string,
    afterBlockId?: string,
    parentId?: string
  ): Promise<void> => {
    await apiClient.put(
      `${API_ENDPOINTS.BLOCK.MOVE.replace(":databaseId", databaseId)
        .replace(":recordId", recordId)
        .replace(":blockId", blockId)}`,
      { afterBlockId, parentId }
    );
  },

  duplicateBlock: async (
    databaseId: string,
    recordId: string,
    blockId: string
  ): Promise<IBlockResponse> => {
    const response = await apiClient.post<ApiResponse<IBlockResponse>>(
      `${API_ENDPOINTS.BLOCK.DUPLICATE.replace(":databaseId", databaseId)
        .replace(":recordId", recordId)
        .replace(":blockId", blockId)}`
    );
    return response.data.data;
  },
};
