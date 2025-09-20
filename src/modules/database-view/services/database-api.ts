import { apiClient } from "@/services/api-client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { ApiResponse } from "@/types/api.types.ts";
import {
  EPropertyType, type TBulkDeleteRecords, type TBulkUpdateRecords,
  type TCreateDatabase,
  type TCreateProperty,
  type TCreateRecord,
  type TCreateView,
  type TDatabase,
  type TDatabaseQueryParams,
  type TProperty,
  type TPropertyQueryParams,
  type TRecord,
  type TRecordQueryParams, type TReorderRecords,
  type TUpdateDatabase,
  type TUpdateProperty,
  type TUpdateView,
  type TView,
} from "@/modules/database-view/types";

export const databaseApi = {
  // DATABASE
  getDatabases: async (params?: TDatabaseQueryParams) => {
    const response = await apiClient.get(API_ENDPOINTS.DATABASE.GET_ALL, { params });
    return response.data as {
      databases: TDatabase[];
      total: number;
      page: number;
      limit: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  },

  getDatabaseById: async (id: string): Promise<ApiResponse<TDatabase>> => {
    const response = await apiClient.get(API_ENDPOINTS.DATABASE.GET_BY_ID(id));
    return response.data;
  },

  createDatabase: async (data: TCreateDatabase): Promise<ApiResponse<TDatabase>> => {
    const response = await apiClient.post(API_ENDPOINTS.DATABASE.CREATE, data);
    return response.data;
  },

  updateDatabase: async (id: string, data: TUpdateDatabase): Promise<ApiResponse<TDatabase>> => {
    const response = await apiClient.put(API_ENDPOINTS.DATABASE.UPDATE(id), data);
    return response.data;
  },

  deleteDatabase: async (id: string, permanent = false) => {
    await apiClient.delete(API_ENDPOINTS.DATABASE.DELETE(id), { params: { permanent } });
  },

  duplicateDatabase: async (id: string, data: { name: string }): Promise<ApiResponse<TDatabase>> => {
    const response = await apiClient.post(API_ENDPOINTS.DATABASE.DUPLICATE(id), data);
    return response.data;
  },

  // PROPERTY
  getProperties: async (databaseId: string, params: TPropertyQueryParams) => {
    const response = await apiClient.get(API_ENDPOINTS.PROPERTY.GET_ALL(databaseId), { params });
    return response.data as ApiResponse<TProperty[]>;
  },

  getPropertyById: async (databaseId: string, propertyId: string): Promise<ApiResponse<TProperty>> => {
    const response = await apiClient.get(API_ENDPOINTS.PROPERTY.GET_BY_ID(databaseId, propertyId));
    return response.data;
  },

  createProperty: async (databaseId: string, data: TCreateProperty): Promise<ApiResponse<TProperty>> => {
    const response = await apiClient.post(API_ENDPOINTS.PROPERTY.CREATE(databaseId), data);
    return response.data;
  },

  updateProperty: async (databaseId: string, propertyId: string, data: TUpdateProperty): Promise<ApiResponse<TProperty>> => {
    const response = await apiClient.put(API_ENDPOINTS.PROPERTY.UPDATE(databaseId, propertyId), data);
    return response.data;
  },

  reorderProperties: async (databaseId: string, data: any) => {
    await apiClient.put(API_ENDPOINTS.PROPERTY.REORDER(databaseId), data);
  },

  deleteProperty: async (databaseId: string, propertyId: string) => {
    await apiClient.delete(API_ENDPOINTS.PROPERTY.DELETE(databaseId, propertyId));
  },

  duplicateProperty: async (databaseId: string, propertyId: string, name?: string): Promise<ApiResponse<TProperty>> => {
    const response = await apiClient.post(API_ENDPOINTS.PROPERTY.DUPLICATE(databaseId, propertyId), { name });
    return response.data;
  },

  changePropertyType: async (databaseId: string, propertyId: string, type: EPropertyType, config?: Record<string, unknown>): Promise<ApiResponse<TProperty>> => {
    const response = await apiClient.put(API_ENDPOINTS.PROPERTY.CHANGE_TYPE(databaseId, propertyId), { type, config });
    return response.data;
  },

  insertPropertyAfter: async (databaseId: string, data: { afterPropertyId: string; name: string; type: EPropertyType; config?: Record<string, unknown> }) => {
    const response = await apiClient.post(API_ENDPOINTS.PROPERTY.INSERT_AFTER(databaseId), data);
    return response.data as ApiResponse<TProperty>;
  },

  togglePropertyVisibility: async (databaseId: string, propertyId: string) => {
    const response = await apiClient.patch(API_ENDPOINTS.PROPERTY.TOGGLE_VISIBILITY(databaseId, propertyId));
    return response.data as ApiResponse<TProperty>;
  },

  // RECORD
  getRecords: async (databaseId: string, params?: TRecordQueryParams) => {
    const response = await apiClient.get(API_ENDPOINTS.RECORD.GET_ALL(databaseId), { params });
    return response.data as ApiResponse<TRecord[]>;
  },

  getRecordById: async (databaseId: string, recordId: string) => {
    const response = await apiClient.get(API_ENDPOINTS.RECORD.GET_BY_ID(databaseId, recordId));
    return response.data as ApiResponse<TRecord>;
  },

  createRecord: async (databaseId: string, data: TCreateRecord) => {
    const response = await apiClient.post(API_ENDPOINTS.RECORD.CREATE(databaseId), data);
    return response.data as ApiResponse<TRecord>;
  },

  updateRecord: async (databaseId: string, recordId: string, payload: Record<string, any>) => {
    const response = await apiClient.put(API_ENDPOINTS.RECORD.UPDATE(databaseId, recordId), payload);
    return response.data as ApiResponse<TRecord>;
  },

  deleteRecord: async (databaseId: string, recordId: string, permanent = false) => {
    await apiClient.delete(API_ENDPOINTS.RECORD.DELETE(databaseId, recordId), { params: { permanent } });
  },

  bulkUpdateRecords: async (databaseId: string, data: TBulkUpdateRecords) => {
    const response = await apiClient.put(API_ENDPOINTS.RECORD.BULK_UPDATE(databaseId), data);
    return response.data as { updated: number; failed: number; errors?: string[] };
  },

  bulkDeleteRecords: async (databaseId: string, data: TBulkDeleteRecords) => {
    const response = await apiClient.delete(API_ENDPOINTS.RECORD.BULK_DELETE(databaseId), { data });
    return response.data as { deleted: number; failed: number; errors?: string[] };
  },

  reorderRecords: async (databaseId: string, data: TReorderRecords) => {
    await apiClient.put(API_ENDPOINTS.RECORD.REORDER(databaseId), data);
  },

  duplicateRecord: async (databaseId: string, recordId: string, data?: TCreateRecord) => {
    const response = await apiClient.post(API_ENDPOINTS.RECORD.DUPLICATE(databaseId, recordId), data);
    return response.data as ApiResponse<TRecord>;
  },

  // VIEW
  getViews: async (databaseId: string, params?: Record<string, unknown>) => {
    const response = await apiClient.get(API_ENDPOINTS.VIEW.GET_ALL(databaseId), { params });
    return response.data as ApiResponse<TView[]>;
  },

  getViewById: async (databaseId: string, viewId: string) => {
    const response = await apiClient.get(API_ENDPOINTS.VIEW.GET_BY_ID(databaseId, viewId));
    return response.data as ApiResponse<TView>;
  },

  createView: async (databaseId: string, data: TCreateView) => {
    const response = await apiClient.post(API_ENDPOINTS.VIEW.CREATE(databaseId), data);
    return response.data as ApiResponse<TView>;
  },

  updateView: async (databaseId: string, viewId: string, data: TUpdateView) => {
    const response = await apiClient.put(API_ENDPOINTS.VIEW.UPDATE(databaseId, viewId), data);
    return response.data as ApiResponse<TView>;
  },

  deleteView: async (databaseId: string, viewId: string) => {
    await apiClient.delete(API_ENDPOINTS.VIEW.DELETE(databaseId, viewId));
  },

  duplicateView: async (databaseId: string, viewId: string, data: { name: string }) => {
    const response = await apiClient.post(API_ENDPOINTS.VIEW.DUPLICATE(databaseId, viewId), data);
    return response.data as ApiResponse<TView>;
  },

  updateViewGrouping: async (databaseId: string, viewId: string, groupBy: { propertyId: string; direction?: "asc" | "desc" }) => {
    const response = await apiClient.patch(API_ENDPOINTS.VIEW.UPDATE_GROUPING(databaseId, viewId), { groupBy });
    return response.data as ApiResponse<TView>;
  },

  changeViewType: async (databaseId: string, viewId: string, type: string) => {
    const response = await apiClient.patch(API_ENDPOINTS.VIEW.CHANGE_TYPE(databaseId, viewId), { type });
    return response.data as ApiResponse<TView>;
  },

  updateViewPropertyVisibility: async (databaseId: string, viewId: string, visibleProperties: string[]) => {
    const response = await apiClient.patch(API_ENDPOINTS.VIEW.UPDATE_PROPERTY_VISIBILITY(databaseId, viewId), { visibleProperties });
    return response.data as ApiResponse<TView>;
  },

  updateViewHiddenProperties: async (databaseId: string, viewId: string, hiddenProperties: string[]) => {
    const response = await apiClient.patch(API_ENDPOINTS.VIEW.UPDATE_HIDDEN_PROPERTIES(databaseId, viewId), { hiddenProperties });
    return response.data as ApiResponse<TView>;
  },

  updateViewColumnFreeze: async (databaseId: string, viewId: string, frozenColumns: string[]) => {
    const response = await apiClient.patch(API_ENDPOINTS.VIEW.UPDATE_COLUMN_FREEZE(databaseId, viewId), { frozenColumns });
    return response.data as ApiResponse<TView>;
  },

  updateViewFilters: async (databaseId: string, viewId: string, filters: Array<{ propertyId: string; operator: string; value: unknown }>) => {
    const response = await apiClient.patch(API_ENDPOINTS.VIEW.UPDATE_FILTERS(databaseId, viewId), { filters });
    return response.data as ApiResponse<TView>;
  },

  updateViewSorts: async (databaseId: string, viewId: string, sorts: Array<{ propertyId: string; direction: "asc" | "desc" }>) => {
    const response = await apiClient.patch(API_ENDPOINTS.VIEW.UPDATE_SORTS(databaseId, viewId), { sorts });
    return response.data as ApiResponse<TView>;
  },
};

export const {
  getDatabases,
  createDatabase,
  updateDatabase,
  deleteDatabase,
  duplicateDatabase,
  getProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  reorderProperties,
  duplicateProperty,
  changePropertyType,
  insertPropertyAfter,
  togglePropertyVisibility,
  getRecords,
  createRecord,
  updateRecord,
  deleteRecord,
  bulkUpdateRecords,
  bulkDeleteRecords,
  reorderRecords,
  duplicateRecord,
  getViews,
  createView,
  updateView,
  deleteView,
  duplicateView,
  updateViewGrouping,
  changeViewType,
  updateViewPropertyVisibility,
  updateViewHiddenProperties,
  updateViewColumnFreeze,
  updateViewFilters,
  updateViewSorts,
} = databaseApi;
