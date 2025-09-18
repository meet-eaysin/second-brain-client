import { apiClient } from "@/services/api-client";
import type {
  IDatabase,
  ICreateDatabase,
  IUpdateDatabase,
  ICreatePropertyRequest,
  IUpdatePropertyRequest,
  ICreateRecordRequest,
  IUpdateRecordRequest,
  IBulkUpdateRecordsRequest,
  IBulkDeleteRecordsRequest,
  ICreateViewRequest,
  IUpdateViewRequest,
  IRecordListResponse,
  EPropertyType,
  IPropertyListResponse,
  IDatabaseProperty,
  IReorderPropertiesRequest,
  IRecordQueryOptions,
  IDatabaseRecord,
  IReorderRecordsRequest,
  IDuplicateRecordRequest,
  IViewListResponse,
  IDatabaseView,
} from "../types";

// Client-side module configuration type (matches backend)
export interface IModuleConfig {
  readonly id: EDatabaseType;
  readonly name: string;
  readonly description: string;
  readonly icon: string;
  readonly color: string;
  readonly category: string;
  readonly isCore: boolean;
  readonly dependencies: readonly EDatabaseType[];
  readonly defaultProperties: readonly unknown[];
  readonly defaultViews: readonly unknown[];
  readonly defaultRelations: readonly unknown[];
  readonly templates: readonly unknown[];
}

export const databaseApi = {
  getDatabases: async (params?: Record<string, unknown>) => {
    const response = await apiClient.get("/databases", { params });
    return response.data as {
      databases: IDatabase[];
      total: number;
      page: number;
      limit: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  },

  getDatabaseById: async (id: string) => {
    const response = await apiClient.get(`/databases/${id}`);
    return response.data as IDatabase;
  },

  createDatabase: async (data: ICreateDatabase) => {
    const response = await apiClient.post("/databases", data);
    return response.data as IDatabase;
  },

  updateDatabase: async (id: string, data: IUpdateDatabase) => {
    const response = await apiClient.put(`/databases/${id}`, data);
    return response.data as IDatabase;
  },

  deleteDatabase: async (id: string, permanent = false) => {
    await apiClient.delete(`/databases/${id}`, { params: { permanent } });
  },

  duplicateDatabase: async (id: string, data: { name: string }) => {
    const response = await apiClient.post(`/databases/${id}/duplicate`, data);
    return response.data as IDatabase;
  },

  getProperties: async (databaseId: string, includeHidden = false) => {
    const response = await apiClient.get(
      `/databases/${databaseId}/properties`,
      {
        params: { includeHidden },
      }
    );
    return response.data as IPropertyListResponse;
  },

  getPropertyById: async (databaseId: string, propertyId: string) => {
    const response = await apiClient.get(
      `/databases/${databaseId}/properties/${propertyId}`
    );
    return response.data as IDatabaseProperty;
  },

  createProperty: async (databaseId: string, data: ICreatePropertyRequest) => {
    const response = await apiClient.post(
      `/databases/${databaseId}/properties`,
      data
    );
    return response.data as IDatabaseProperty;
  },

  updateProperty: async (
    databaseId: string,
    propertyId: string,
    data: IUpdatePropertyRequest
  ) => {
    const response = await apiClient.put(
      `/databases/${databaseId}/properties/${propertyId}`,
      data
    );
    return response.data as IDatabaseProperty;
  },

  reorderProperties: async (
    databaseId: string,
    data: IReorderPropertiesRequest
  ) => {
    await apiClient.put(`/databases/${databaseId}/properties/reorder`, data);
  },

  deleteProperty: async (databaseId: string, propertyId: string) => {
    await apiClient.delete(`/databases/${databaseId}/properties/${propertyId}`);
  },

  duplicateProperty: async (
    databaseId: string,
    propertyId: string,
    name?: string
  ) => {
    const response = await apiClient.post(
      `/databases/${databaseId}/properties/${propertyId}/duplicate`,
      { name }
    );
    return response.data as IDatabaseProperty;
  },

  changePropertyType: async (
    databaseId: string,
    propertyId: string,
    type: EPropertyType,
    config?: Record<string, unknown>
  ) => {
    const response = await apiClient.put(
      `/databases/${databaseId}/properties/${propertyId}/change-type`,
      { type, config }
    );
    return response.data as IDatabaseProperty;
  },

  insertPropertyAfter: async (
    databaseId: string,
    data: {
      afterPropertyId: string;
      name: string;
      type: EPropertyType;
      config?: Record<string, unknown>;
    }
  ) => {
    const response = await apiClient.post(
      `/databases/${databaseId}/properties/insert-after`,
      data
    );
    return response.data as IDatabaseProperty;
  },

  togglePropertyVisibility: async (databaseId: string, propertyId: string) => {
    const response = await apiClient.patch(
      `/databases/${databaseId}/properties/${propertyId}/toggle-visibility`
    );
    return response.data as IDatabaseProperty;
  },

  // Record operations
  getRecords: async (databaseId: string, params?: IRecordQueryOptions) => {
    const response = await apiClient.get(`/databases/${databaseId}/records`, {
      params,
    });
    return response.data as IRecordListResponse;
  },

  getRecordById: async (databaseId: string, recordId: string) => {
    const response = await apiClient.get(
      `/databases/${databaseId}/records/${recordId}`
    );
    return response.data as IDatabaseRecord;
  },

  createRecord: async (databaseId: string, data: ICreateRecordRequest) => {
    const response = await apiClient.post(
      `/databases/${databaseId}/records`,
      data
    );
    return response.data as IDatabaseRecord;
  },

  updateRecord: async (
    databaseId: string,
    recordId: string,
    data: IUpdateRecordRequest
  ) => {
    const response = await apiClient.put(
      `/databases/${databaseId}/records/${recordId}`,
      data
    );
    return response.data as IDatabaseRecord;
  },

  deleteRecord: async (
    databaseId: string,
    recordId: string,
    permanent = false
  ) => {
    await apiClient.delete(`/databases/${databaseId}/records/${recordId}`, {
      params: { permanent },
    });
  },

  bulkUpdateRecords: async (
    databaseId: string,
    data: IBulkUpdateRecordsRequest
  ) => {
    const response = await apiClient.put(
      `/databases/${databaseId}/records/bulk-update`,
      data
    );
    return response.data as {
      updated: number;
      failed: number;
      errors?: string[];
    };
  },

  bulkDeleteRecords: async (
    databaseId: string,
    data: IBulkDeleteRecordsRequest
  ) => {
    const response = await apiClient.delete(
      `/databases/${databaseId}/records/bulk-delete`,
      { data }
    );
    return response.data as {
      deleted: number;
      failed: number;
      errors?: string[];
    };
  },

  reorderRecords: async (databaseId: string, data: IReorderRecordsRequest) => {
    await apiClient.put(`/databases/${databaseId}/records/reorder`, data);
  },

  duplicateRecord: async (
    databaseId: string,
    recordId: string,
    data?: IDuplicateRecordRequest
  ) => {
    const response = await apiClient.post(
      `/databases/${databaseId}/records/${recordId}/duplicate`,
      data
    );
    return response.data as IDatabaseRecord;
  },

  // View operations
  getViews: async (databaseId: string, params?: Record<string, unknown>) => {
    const response = await apiClient.get(`/databases/${databaseId}/views`, {
      params,
    });
    return response.data as IViewListResponse;
  },

  getViewById: async (databaseId: string, viewId: string) => {
    const response = await apiClient.get(
      `/databases/${databaseId}/views/${viewId}`
    );
    return response.data as IDatabaseView;
  },

  createView: async (databaseId: string, data: ICreateViewRequest) => {
    const response = await apiClient.post(
      `/databases/${databaseId}/views`,
      data
    );
    return response.data as IDatabaseView;
  },

  updateView: async (
    databaseId: string,
    viewId: string,
    data: IUpdateViewRequest
  ) => {
    const response = await apiClient.put(
      `/databases/${databaseId}/views/${viewId}`,
      data
    );
    return response.data as IDatabaseView;
  },

  deleteView: async (databaseId: string, viewId: string) => {
    await apiClient.delete(`/databases/${databaseId}/views/${viewId}`);
  },

  duplicateView: async (
    databaseId: string,
    viewId: string,
    data: { name: string }
  ) => {
    const response = await apiClient.post(
      `/databases/${databaseId}/views/${viewId}/duplicate`,
      data
    );
    return response.data as IDatabaseView;
  },

  updateViewGrouping: async (
    databaseId: string,
    viewId: string,
    groupBy: { propertyId: string; direction?: "asc" | "desc" }
  ) => {
    const response = await apiClient.patch(
      `/databases/${databaseId}/views/${viewId}/grouping`,
      { groupBy }
    );
    return response.data as IDatabaseView;
  },

  changeViewType: async (databaseId: string, viewId: string, type: string) => {
    const response = await apiClient.patch(
      `/databases/${databaseId}/views/${viewId}/change-type`,
      { type }
    );
    return response.data as IDatabaseView;
  },

  updateViewPropertyVisibility: async (
    databaseId: string,
    viewId: string,
    visibleProperties: string[]
  ) => {
    const response = await apiClient.patch(
      `/databases/${databaseId}/views/${viewId}/property-visibility`,
      { visibleProperties }
    );
    return response.data as IDatabaseView;
  },

  updateViewColumnFreeze: async (
    databaseId: string,
    viewId: string,
    frozenColumns: string[]
  ) => {
    const response = await apiClient.patch(
      `/databases/${databaseId}/views/${viewId}/column-freeze`,
      { frozenColumns }
    );
    return response.data as IDatabaseView;
  },

  updateViewFilters: async (
    databaseId: string,
    viewId: string,
    filters: Array<{
      propertyId: string;
      operator: string;
      value: unknown;
    }>
  ) => {
    const response = await apiClient.patch(
      `/databases/${databaseId}/views/${viewId}/filters`,
      { filters }
    );
    return response.data as IDatabaseView;
  },

  updateViewSorts: async (
    databaseId: string,
    viewId: string,
    sorts: Array<{
      propertyId: string;
      direction: "asc" | "desc";
    }>
  ) => {
    const response = await apiClient.patch(
      `/databases/${databaseId}/views/${viewId}/sorts`,
      { sorts }
    );
    return response.data as IDatabaseView;
  },
};

// Legacy support - keep the old API for backward compatibility
export const databaseApiService = databaseApi;
export default databaseApi;
