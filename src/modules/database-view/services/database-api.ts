import { apiClient } from "@/services/api-client";
import type { ApiResponse } from "@/types/api.types.ts";
import {EDatabaseType} from "@/modules/database-view";
import {
  EPropertyType,
  type TCreateDatabase, type TCreateProperty, type TCreateRecord, type TCreateView,
  type TDatabase,
  type TDatabaseQueryParams, type TProperty,
  type TPropertyQueryParams, type TRecord, type TRecordQueryParams,
  type TUpdateDatabase, type TUpdateProperty, type TUpdateView, type TView
} from "@/modules/database-view/types";

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
  getDatabases: async (params?: TDatabaseQueryParams) => {
    const response = await apiClient.get("/databases", { params });
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
    const response = await apiClient.get(`/databases/${id}`);
    return response.data;
  },

  createDatabase: async (data: TCreateDatabase): Promise<ApiResponse<TDatabase>> => {
    const response = await apiClient.post("/databases", data);
    return response.data;
  },

  updateDatabase: async (id: string, data: TUpdateDatabase): Promise<ApiResponse<TDatabase>> => {
    const response = await apiClient.put(`/databases/${id}`, data);
    return response.data;
  },

  deleteDatabase: async (id: string, permanent = false) => {
    await apiClient.delete(`/databases/${id}`, { params: { permanent } });
  },

  duplicateDatabase: async (id: string, data: { name: string }): Promise<ApiResponse<TDatabase>> => {
    const response = await apiClient.post(`/databases/${id}/duplicate`, data);
    return response.data;
  },

  getProperties: async (
    databaseId: string,
    params: TPropertyQueryParams
  ): Promise<ApiResponse<TProperty[]>> => {
    const response = await apiClient.get(
      `/databases/${databaseId}/properties`,
      params
    );
    return response.data
  },

  getPropertyById: async (databaseId: string, propertyId: string): Promise<ApiResponse<TProperty>> => {
    const response = await apiClient.get(
      `/databases/${databaseId}/properties/${propertyId}`
    );
    return response.data;
  },

  createProperty: async (databaseId: string, data: TCreateProperty): Promise<ApiResponse<TProperty>> => {
    const response = await apiClient.post(
      `/databases/${databaseId}/properties`,
      data
    );
    return response.data;
  },

  updateProperty: async (
    databaseId: string,
    propertyId: string,
    data: TUpdateProperty
  ): Promise<ApiResponse<TProperty>> => {
    const response = await apiClient.put(
      `/databases/${databaseId}/properties/${propertyId}`,
      data
    );
    return response.data;
  },

  reorderProperties: async (
    databaseId: string,
    data: any
  ): Promise<void> => {
    await apiClient.put(`/databases/${databaseId}/properties/reorder`, data);
  },

  deleteProperty: async (databaseId: string, propertyId: string) => {
    await apiClient.delete(`/databases/${databaseId}/properties/${propertyId}`);
  },

  duplicateProperty: async (
    databaseId: string,
    propertyId: string,
    name?: string
  ): Promise<ApiResponse<TProperty>> => {
    const response = await apiClient.post(
      `/databases/${databaseId}/properties/${propertyId}/duplicate`,
      { name }
    );
    return response.data;
  },

  changePropertyType: async (
    databaseId: string,
    propertyId: string,
    type: EPropertyType,
    config?: Record<string, unknown>
  ): Promise<ApiResponse<TProperty>> => {
    const response = await apiClient.put(
      `/databases/${databaseId}/properties/${propertyId}/change-type`,
      { type, config }
    );
    return response.data;
  },

  insertPropertyAfter: async (
    databaseId: string,
    data: {
      afterPropertyId: string;
      name: string;
      type: EPropertyType;
      config?: Record<string, unknown>;
    }
  ): Promise<ApiResponse<TProperty>> => {
    const response = await apiClient.post(
      `/databases/${databaseId}/properties/insert-after`,
      data
    );
    return response.data;
  },

  togglePropertyVisibility: async (databaseId: string, propertyId: string): Promise<ApiResponse<TProperty>> => {
    const response = await apiClient.patch(
      `/databases/${databaseId}/properties/${propertyId}/toggle-visibility`
    );
    return response.data;
  },

  getRecords: async (
      databaseId: string,
      params?: TRecordQueryParams | undefined
  ): Promise<ApiResponse<TRecord[]>> => {
    const response = await apiClient.get(`/databases/${databaseId}/records`, {
      params,
    });
    return response.data;
  },

  getRecordById: async (databaseId: string, recordId: string): Promise<ApiResponse<TRecord>> => {
    const response = await apiClient.get(
      `/databases/${databaseId}/records/${recordId}`
    );
    return response.data;
  },

  createRecord: async (databaseId: string, data: TCreateRecord): Promise<ApiResponse<TRecord>> => {
    const response = await apiClient.post(
      `/databases/${databaseId}/records`,
      data
    );
    return response.data;
  },

  updateRecord: async (
    databaseId: string,
    recordId: string,
    payload: Record<string, any>
  ): Promise<ApiResponse<TRecord>> => {
    const response = await apiClient.put(`/databases/${databaseId}/records/${recordId}`, payload);
    return response.data;
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
    data: TBulkUpdateRecords
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
    data: IBulkDeleteRecords
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
    data?: TDuplicateRecordRequest
  ): Promise<ApiResponse<TRecord>> => {
    const response = await apiClient.post(
      `/databases/${databaseId}/records/${recordId}/duplicate`,
      data
    );
    return response.data;
  },

  // View operations
  getViews: async (databaseId: string, params?: Record<string, unknown>) : Promise<ApiResponse<TView[]>> => {
    const response = await apiClient.get(`/databases/${databaseId}/views`, {
      params,
    });
    return response.data;
  },

  getViewById: async (databaseId: string, viewId: string): Promise<ApiResponse<TView>> => {
    const response = await apiClient.get(
      `/databases/${databaseId}/views/${viewId}`
    );
    return response.data;
  },

  createView: async (databaseId: string, data: TCreateView): Promise<ApiResponse<TView>> => {
    const response = await apiClient.post(
      `/databases/${databaseId}/views`,
      data
    );
    return response.data;
  },

  updateView: async (
    databaseId: string,
    viewId: string,
    data: TUpdateView
  ): Promise<ApiResponse<TView>> => {
    const response = await apiClient.put(
      `/databases/${databaseId}/views/${viewId}`,
      data
    );
    return response.data;
  },

  deleteView: async (databaseId: string, viewId: string) => {
    await apiClient.delete(`/databases/${databaseId}/views/${viewId}`);
  },

  duplicateView: async (
    databaseId: string,
    viewId: string,
    data: { name: string }
  ): Promise<ApiResponse<TView>> => {
    const response = await apiClient.post(
      `/databases/${databaseId}/views/${viewId}/duplicate`,
      data
    );
    return response.data;
  },

  updateViewGrouping: async (
    databaseId: string,
    viewId: string,
    groupBy: { propertyId: string; direction?: "asc" | "desc" }
  ): Promise<ApiResponse<TView>> => {
    const response = await apiClient.patch(
      `/databases/${databaseId}/views/${viewId}/grouping`,
      { groupBy }
    );
    return response.data;
  },

  changeViewType: async (databaseId: string, viewId: string, type: string): Promise<ApiResponse<TView>> => {
    const response = await apiClient.patch(
      `/databases/${databaseId}/views/${viewId}/change-type`,
      { type }
    );
    return response.data;
  },

  updateViewPropertyVisibility: async (
    databaseId: string,
    viewId: string,
    visibleProperties: string[]
  ): Promise<ApiResponse<TView>> => {
    const response = await apiClient.patch(
      `/databases/${databaseId}/views/${viewId}/property-visibility`,
      { visibleProperties }
    );
    return response.data;
  },

  updateViewHiddenProperties: async (
    databaseId: string,
    viewId: string,
    hiddenProperties: string[]
  ): Promise<ApiResponse<TView>> => {
    const response = await apiClient.patch(
      `/databases/${databaseId}/views/${viewId}/hidden-properties`,
      { hiddenProperties }
    );
    return response.data;
  },

  updateViewColumnFreeze: async (
    databaseId: string,
    viewId: string,
    frozenColumns: string[]
  ): Promise<ApiResponse<TView>> => {
    const response = await apiClient.patch(
      `/databases/${databaseId}/views/${viewId}/column-freeze`,
      { frozenColumns }
    );
    return response.data;
  },

  updateViewFilters: async (
    databaseId: string,
    viewId: string,
    filters: Array<{
      propertyId: string;
      operator: string;
      value: unknown;
    }>
  ): Promise<ApiResponse<TView>> => {
    const response = await apiClient.patch(
      `/databases/${databaseId}/views/${viewId}/filters`,
      { filters }
    );
    return response.data;
  },

  updateViewSorts: async (
    databaseId: string,
    viewId: string,
    sorts: Array<{
      propertyId: string;
      direction: "asc" | "desc";
    }>
  ): Promise<ApiResponse<TView>> => {
    const response = await apiClient.patch(
      `/databases/${databaseId}/views/${viewId}/sorts`,
      { sorts }
    );
    return response.data;
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
