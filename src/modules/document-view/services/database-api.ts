import { databaseApiService } from "./api-service";
import type {
  ICreateDatabase,
  IUpdateDatabase,
  ICreatePropertyRequest,
  IUpdatePropertyRequest,
  IReorderPropertiesRequest,
  ICreateRecordRequest,
  IUpdateRecordRequest,
  IBulkUpdateRecordsRequest,
  IBulkDeleteRecordsRequest,
  IReorderRecordsRequest,
  IDuplicateRecordRequest,
  ICreateViewRequest,
  IUpdateViewRequest,
  IRecordQueryOptions,
  EPropertyType,
} from "../types";

// Re-export the API service for backward compatibility
export const databaseApi = {
  // Database operations
  getDatabases: (params?: Record<string, unknown>) =>
    databaseApiService.getDatabases(params),
  getDatabase: (id: string) => databaseApiService.getDatabaseById(id),
  createDatabase: (data: ICreateDatabase) =>
    databaseApiService.createDatabase(data),
  updateDatabase: (id: string, data: IUpdateDatabase) =>
    databaseApiService.updateDatabase(id, data),
  deleteDatabase: (id: string, permanent = false) =>
    databaseApiService.deleteDatabase(id, permanent),
  duplicateDatabase: (id: string, data: { name: string }) =>
    databaseApiService.duplicateDatabase(id, data.name),

  // Property operations
  getProperties: (databaseId: string, includeHidden = false) =>
    databaseApiService
      .getProperties(databaseId, includeHidden)
      .then((res) => res.properties),
  getProperty: (databaseId: string, propertyId: string) =>
    databaseApiService.getPropertyById(databaseId, propertyId),
  createProperty: (databaseId: string, data: ICreatePropertyRequest) =>
    databaseApiService.createProperty(databaseId, data),
  updateProperty: (
    databaseId: string,
    propertyId: string,
    data: IUpdatePropertyRequest
  ) => databaseApiService.updateProperty(databaseId, propertyId, data),
  deleteProperty: (databaseId: string, propertyId: string) =>
    databaseApiService.deleteProperty(databaseId, propertyId),
  reorderProperties: (databaseId: string, data: IReorderPropertiesRequest) =>
    databaseApiService.reorderProperties(databaseId, data),
  duplicateProperty: (databaseId: string, propertyId: string, name?: string) =>
    databaseApiService.duplicateProperty(databaseId, propertyId, name),
  changePropertyType: (
    databaseId: string,
    propertyId: string,
    newType: EPropertyType,
    config?: Record<string, unknown>
  ) =>
    databaseApiService.changePropertyType(
      databaseId,
      propertyId,
      newType,
      config
    ),
  insertPropertyAfter: (
    databaseId: string,
    data: {
      afterPropertyId: string;
      name: string;
      type: EPropertyType;
      config?: Record<string, unknown>;
    }
  ) => databaseApiService.insertPropertyAfter(databaseId, data),
  togglePropertyVisibility: (databaseId: string, propertyId: string) =>
    databaseApiService.togglePropertyVisibility(databaseId, propertyId),

  // Record operations
  getRecords: (databaseId: string, params?: IRecordQueryOptions) =>
    databaseApiService.getRecords(databaseId, params).then((res) => ({
      records: res.records,
      total: res.total,
      page: res.page,
      limit: res.limit,
      hasNext: res.hasNext,
      hasPrev: res.hasPrev,
    })),
  getRecord: (databaseId: string, recordId: string) =>
    databaseApiService.getRecordById(databaseId, recordId),
  createRecord: (databaseId: string, data: ICreateRecordRequest) =>
    databaseApiService.createRecord(databaseId, data),
  updateRecord: (
    databaseId: string,
    recordId: string,
    data: IUpdateRecordRequest
  ) => databaseApiService.updateRecord(databaseId, recordId, data),
  deleteRecord: (databaseId: string, recordId: string, permanent = false) =>
    databaseApiService.deleteRecord(databaseId, recordId, permanent),
  bulkUpdateRecords: (databaseId: string, data: IBulkUpdateRecordsRequest) =>
    databaseApiService.bulkUpdateRecords(databaseId, data),
  bulkDeleteRecords: (databaseId: string, data: IBulkDeleteRecordsRequest) =>
    databaseApiService.bulkDeleteRecords(databaseId, data),
  reorderRecords: (databaseId: string, data: IReorderRecordsRequest) =>
    databaseApiService.reorderRecords(databaseId, data),
  duplicateRecord: (
    databaseId: string,
    recordId: string,
    data?: IDuplicateRecordRequest
  ) => databaseApiService.duplicateRecord(databaseId, recordId, data),

  // View operations
  getViews: (databaseId: string, params?: Record<string, unknown>) =>
    databaseApiService.getViews(databaseId, params),
  getView: (databaseId: string, viewId: string) =>
    databaseApiService.getViewById(databaseId, viewId),
  createView: (databaseId: string, data: ICreateViewRequest) =>
    databaseApiService.createView(databaseId, data),
  updateView: (databaseId: string, viewId: string, data: IUpdateViewRequest) =>
    databaseApiService.updateView(databaseId, viewId, data),
  deleteView: (databaseId: string, viewId: string) =>
    databaseApiService.deleteView(databaseId, viewId),
  duplicateView: (databaseId: string, viewId: string, name?: string) =>
    databaseApiService.duplicateView(databaseId, viewId, { name }),
  updateViewGrouping: (
    databaseId: string,
    viewId: string,
    groupBy: { propertyId: string; direction?: "asc" | "desc" }
  ) => databaseApiService.updateViewGrouping(databaseId, viewId, groupBy),
  changeViewType: (databaseId: string, viewId: string, newType: string) =>
    databaseApiService.changeViewType(databaseId, viewId, newType),
  updateViewPropertyVisibility: (
    databaseId: string,
    viewId: string,
    visibleProperties: string[]
  ) =>
    databaseApiService.updateViewPropertyVisibility(
      databaseId,
      viewId,
      visibleProperties
    ),
  updateViewColumnFreeze: (
    databaseId: string,
    viewId: string,
    frozenColumns: string[]
  ) =>
    databaseApiService.updateViewColumnFreeze(
      databaseId,
      viewId,
      frozenColumns
    ),
  updateViewFilters: (
    databaseId: string,
    viewId: string,
    filters: Array<{
      propertyId: string;
      operator: string;
      value: unknown;
    }>
  ) => databaseApiService.updateViewFilters(databaseId, viewId, filters),
  updateViewSorts: (
    databaseId: string,
    viewId: string,
    sorts: Array<{
      propertyId: string;
      direction: "asc" | "desc";
    }>
  ) => databaseApiService.updateViewSorts(databaseId, viewId, sorts),
};

// Export individual functions for direct use
export const {
  getDatabases,
  getDatabase,
  createDatabase,
  updateDatabase,
  deleteDatabase,
  duplicateDatabase,
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  reorderProperties,
  duplicateProperty,
  changePropertyType,
  insertPropertyAfter,
  togglePropertyVisibility,
  getRecords,
  getRecord,
  createRecord,
  updateRecord,
  deleteRecord,
  bulkUpdateRecords,
  bulkDeleteRecords,
  reorderRecords,
  duplicateRecord,
  getViews,
  getView,
  createView,
  updateView,
  deleteView,
  duplicateView,
  updateViewGrouping,
  changeViewType,
  updateViewPropertyVisibility,
  updateViewColumnFreeze,
  updateViewFilters,
  updateViewSorts,
} = databaseApi;
