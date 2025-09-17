import { apiClient } from "@/services/api-client";
import type {
  IDatabase,
  IRecord,
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
  IPropertyResponse,
  IViewResponse,
  EPropertyType,
  EDatabaseType,
  IPropertyListResponse,
  IDatabaseProperty,
  IReorderPropertiesRequest,
  IRecordQueryOptions,
  IRecordQueryParams,
  IDatabaseRecord,
  IReorderRecordsRequest,
  IDuplicateRecordRequest,
  IViewListResponse,
  IDatabaseView,
} from "../types";

// Client-side module configuration type (independent of backend)
export interface IModuleConfig {
  id: string;
  name: string;
  type: EDatabaseType;
  description?: string;
  icon?: string;
  color?: string;
  isEnabled: boolean;
  settings: Record<string, unknown>;
  permissions: {
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canShare: boolean;
    canExport: boolean;
  };
  features: {
    enableViews: boolean;
    enableSearch: boolean;
    enableFilters: boolean;
    enableSorts: boolean;
    enableComments: boolean;
    enableVersioning: boolean;
    enableAuditLog: boolean;
  };
  frozenProperties?: string[];
  requiredProperties?: string[];
  defaultViewType?: string;
  customFields?: Record<string, unknown>;
}

// Base API functions for databases
export const databaseApi = {
  // Database operations
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

  // Property operations
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

// Module-specific API functions
export const moduleApi = {
  // Module-specific database operations
  getModuleDatabase: async (moduleType: EDatabaseType) => {
    const response = await apiClient.get(`/modules/${moduleType}/database`);
    return response.data as IDatabase;
  },

  getModuleViews: async (moduleType: EDatabaseType) => {
    const response = await apiClient.get(`/modules/${moduleType}/views`);
    return response.data as IViewResponse[];
  },

  getModuleRecords: async (
    moduleType: EDatabaseType,
    params?: IRecordQueryParams
  ) => {
    const response = await apiClient.get(`/modules/${moduleType}/records`, {
      params,
    });
    return response.data as IRecordListResponse;
  },

  getDefaultView: async (moduleType: EDatabaseType) => {
    const response = await apiClient.get(
      `/modules/${moduleType}/views/default`
    );
    return response.data as IViewResponse;
  },

  // Module-specific property operations
  addProperty: async (
    moduleType: EDatabaseType,
    viewId: string,
    data: ICreatePropertyRequest
  ) => {
    const response = await apiClient.post(
      `/modules/${moduleType}/views/${viewId}/properties`,
      data
    );
    return response.data as IPropertyResponse;
  },

  updateProperty: async (
    moduleType: EDatabaseType,
    propertyId: string,
    data: IUpdatePropertyRequest
  ) => {
    const response = await apiClient.put(
      `/modules/${moduleType}/properties/${propertyId}`,
      data
    );
    return response.data as IPropertyResponse;
  },

  deleteProperty: async (moduleType: EDatabaseType, propertyId: string) => {
    await apiClient.delete(`/modules/${moduleType}/properties/${propertyId}`);
  },

  freezeProperty: async (
    moduleType: EDatabaseType,
    propertyId: string,
    data: { frozen: boolean }
  ) => {
    const response = await apiClient.patch(
      `/modules/${moduleType}/properties/${propertyId}/freeze`,
      data
    );
    return response.data as IPropertyResponse;
  },

  updatePropertyType: async (
    moduleType: EDatabaseType,
    propertyId: string,
    data: { type: EPropertyType }
  ) => {
    const response = await apiClient.patch(
      `/modules/${moduleType}/properties/${propertyId}/type`,
      data
    );
    return response.data as IPropertyResponse;
  },

  insertProperty: async (
    moduleType: EDatabaseType,
    propertyId: string,
    data: {
      position: "left" | "right";
      name: string;
      type: EPropertyType;
    }
  ) => {
    const response = await apiClient.post(
      `/modules/${moduleType}/properties/${propertyId}/insert`,
      data
    );
    return response.data as IPropertyResponse;
  },

  // Module-specific record operations
  createRecord: async (
    moduleType: EDatabaseType,
    data: ICreateRecordRequest
  ) => {
    const response = await apiClient.post(
      `/modules/${moduleType}/records`,
      data
    );
    return response.data as IRecord;
  },

  updateRecord: async (
    moduleType: EDatabaseType,
    recordId: string,
    data: IUpdateRecordRequest
  ) => {
    const response = await apiClient.put(
      `/modules/${moduleType}/records/${recordId}`,
      data
    );
    return response.data as IRecord;
  },

  deleteRecord: async (moduleType: EDatabaseType, recordId: string) => {
    await apiClient.delete(`/modules/${moduleType}/records/${recordId}`);
  },

  // Module-specific view operations
  createView: async (moduleType: EDatabaseType, data: ICreateViewRequest) => {
    const response = await apiClient.post(`/modules/${moduleType}/views`, data);
    return response.data as IViewResponse;
  },

  updateView: async (
    moduleType: EDatabaseType,
    viewId: string,
    data: IUpdateViewRequest
  ) => {
    const response = await apiClient.put(
      `/modules/${moduleType}/views/${viewId}`,
      data
    );
    return response.data as IViewResponse;
  },

  deleteView: async (moduleType: EDatabaseType, viewId: string) => {
    await apiClient.delete(`/modules/${moduleType}/views/${viewId}`);
  },

  duplicateView: async (
    moduleType: EDatabaseType,
    viewId: string,
    newName: string
  ) => {
    const response = await apiClient.post(
      `/modules/${moduleType}/views/${viewId}/duplicate`,
      { newName }
    );
    return response.data as IViewResponse;
  },

  // Module configuration
  getModuleConfig: async (moduleType: EDatabaseType) => {
    const response = await apiClient.get(`/modules/config/${moduleType}`);
    return response.data as IModuleConfig;
  },

  updateModuleConfig: async (
    moduleType: EDatabaseType,
    config: Partial<IModuleConfig>
  ) => {
    const response = await apiClient.put(
      `/modules/config/${moduleType}`,
      config
    );
    return response.data as IModuleConfig;
  },
};

export const createModuleApi = (moduleType: EDatabaseType) => ({
  getDatabase: () => moduleApi.getModuleDatabase(moduleType),
  getViews: () => moduleApi.getModuleViews(moduleType),
  getRecords: (params?: IRecordQueryParams) =>
    moduleApi.getModuleRecords(moduleType, params),
  getDefaultView: () => moduleApi.getDefaultView(moduleType),

  addProperty: (viewId: string, data: ICreatePropertyRequest) =>
    moduleApi.addProperty(moduleType, viewId, data),
  updateProperty: (propertyId: string, data: IUpdatePropertyRequest) =>
    moduleApi.updateProperty(moduleType, propertyId, data),
  deleteProperty: (propertyId: string) =>
    moduleApi.deleteProperty(moduleType, propertyId),
  freezeProperty: (propertyId: string, data: { frozen: boolean }) =>
    moduleApi.freezeProperty(moduleType, propertyId, data),
  updatePropertyType: (propertyId: string, data: { type: EPropertyType }) =>
    moduleApi.updatePropertyType(moduleType, propertyId, data),
  insertProperty: (
    propertyId: string,
    data: { position: "left" | "right"; name: string; type: EPropertyType }
  ) => moduleApi.insertProperty(moduleType, propertyId, data),

  createRecord: (data: ICreateRecordRequest) =>
    moduleApi.createRecord(moduleType, data),
  updateRecord: (recordId: string, data: IUpdateRecordRequest) =>
    moduleApi.updateRecord(moduleType, recordId, data),
  deleteRecord: (recordId: string) =>
    moduleApi.deleteRecord(moduleType, recordId),

  createView: (data: ICreateViewRequest) =>
    moduleApi.createView(moduleType, data),
  updateView: (viewId: string, data: IUpdateViewRequest) =>
    moduleApi.updateView(moduleType, viewId, data),
  deleteView: (viewId: string) => moduleApi.deleteView(moduleType, viewId),
  duplicateView: (viewId: string, newName: string) =>
    moduleApi.duplicateView(moduleType, viewId, newName),

  getConfig: () => moduleApi.getModuleConfig(moduleType),
  updateConfig: (config: Partial<IModuleConfig>) =>
    moduleApi.updateModuleConfig(moduleType, config),
});

// Legacy support - keep the old API for backward compatibility
export const databaseApiService = databaseApi;
export default databaseApi;
