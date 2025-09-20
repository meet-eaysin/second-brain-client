import { apiClient } from "@/services/api-client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import {
  EPropertyType,
  type TBulkDeleteRecords,
  type TBulkUpdateRecords,
  type TCreateDatabase,
  type TCreateProperty,
  type TCreateRecord,
  type TCreateView,
  type TDatabaseQueryParams,
  type TPropertyQueryParams,
  type TRecordQueryParams,
  type TReorderRecords,
  type TReorderProperties,
  type TUpdateDatabase,
  type TUpdateProperty,
  type TUpdateView,
  type TRelationQueryParams,
  type IBlockSearchOptions,
  type ICreateBlock,
  type IUpdateBlock,
  type IBulkBlockOperation,
  type TPropertyValue,
  type IRelationConnectionQueryParams,
  type TCreateRelation,
  type TCreateRelationConnection,
  type TUpdateRelation, type TDatabaseSortQueryParams, type TDatabaseFilterQueryParams, type TCreateDatabaseFilter,
  type TUpdateDatabaseFilter, type TUpdateDatabaseSort, type TCreateDatabaseSort, type TDatabaseFilterPresetQueryParams,
  type TCreateDatabaseFilterPreset, type TUpdateDatabaseFilterPreset,
} from "@/modules/database-view/types";

export const databaseApi = {
  // DATABASE
  getDatabases: async (params?: TDatabaseQueryParams) => {
    const response = await apiClient.get(API_ENDPOINTS.DATABASE.GET_ALL, {
      params,
    });
    return response.data;
  },

  getDatabaseById: async (id: string) => {
    const response = await apiClient.get(API_ENDPOINTS.DATABASE.GET_BY_ID(id));
    return response.data;
  },

  createDatabase: async (data: TCreateDatabase) => {
    const response = await apiClient.post(API_ENDPOINTS.DATABASE.CREATE, data);
    return response.data;
  },

  updateDatabase: async (id: string, data: TUpdateDatabase) => {
    const response = await apiClient.put(
      API_ENDPOINTS.DATABASE.UPDATE(id),
      data
    );
    return response.data;
  },

  deleteDatabase: async (id: string, permanent = false) => {
    await apiClient.delete(API_ENDPOINTS.DATABASE.DELETE(id), {
      params: { permanent },
    });
  },

  duplicateDatabase: async (id: string, data: { name: string }) => {
    const response = await apiClient.post(
      API_ENDPOINTS.DATABASE.DUPLICATE(id),
      data
    );
    return response.data;
  },

  getDatabaseStats: async (id: string) => {
    const response = await apiClient.get(API_ENDPOINTS.DATABASE.STATS(id));
    return response.data;
  },

  // PROPERTY
  getProperties: async (databaseId: string, params?: TPropertyQueryParams) => {
    const response = await apiClient.get(
      API_ENDPOINTS.PROPERTY.GET_ALL(databaseId),
      { params }
    );
    return response.data;
  },

  getPropertyById: async (databaseId: string, propertyId: string) => {
    const response = await apiClient.get(
      API_ENDPOINTS.PROPERTY.GET_BY_ID(databaseId, propertyId)
    );
    return response.data;
  },

  createProperty: async (databaseId: string, data: TCreateProperty) => {
    const response = await apiClient.post(
      API_ENDPOINTS.PROPERTY.CREATE(databaseId),
      data
    );
    return response.data;
  },

  updateProperty: async (
    databaseId: string,
    propertyId: string,
    data: TUpdateProperty
  ) => {
    const response = await apiClient.put(
      API_ENDPOINTS.PROPERTY.UPDATE(databaseId, propertyId),
      data
    );
    return response.data;
  },

  reorderProperties: async (databaseId: string, data: TReorderProperties) => {
    await apiClient.put(API_ENDPOINTS.PROPERTY.REORDER(databaseId), data);
  },

  deleteProperty: async (databaseId: string, propertyId: string) => {
    await apiClient.delete(
      API_ENDPOINTS.PROPERTY.DELETE(databaseId, propertyId)
    );
  },

  duplicateProperty: async (
    databaseId: string,
    propertyId: string,
    name?: string
  ) => {
    const response = await apiClient.post(
      API_ENDPOINTS.PROPERTY.DUPLICATE(databaseId, propertyId),
      { name }
    );
    return response.data;
  },

  changePropertyType: async (
    databaseId: string,
    propertyId: string,
    type: EPropertyType,
    config?: Record<string, unknown>
  ) => {
    const response = await apiClient.put(
      API_ENDPOINTS.PROPERTY.CHANGE_TYPE(databaseId, propertyId),
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
  ) => {
    const response = await apiClient.post(
      API_ENDPOINTS.PROPERTY.INSERT_AFTER(databaseId),
      data
    );
    return response.data;
  },

  togglePropertyVisibility: async (databaseId: string, propertyId: string) => {
    const response = await apiClient.patch(
      API_ENDPOINTS.PROPERTY.TOGGLE_VISIBILITY(databaseId, propertyId)
    );
    return response.data;
  },

  // RECORD
  getRecords: async (databaseId: string, params?: TRecordQueryParams) => {
    const response = await apiClient.get(
      API_ENDPOINTS.RECORD.GET_ALL(databaseId),
      { params }
    );
    return response.data;
  },

  getRecordById: async (databaseId: string, recordId: string) => {
    const response = await apiClient.get(
      API_ENDPOINTS.RECORD.GET_BY_ID(databaseId, recordId)
    );
    return response.data;
  },

  createRecord: async (databaseId: string, data: TCreateRecord) => {
    const response = await apiClient.post(
      API_ENDPOINTS.RECORD.CREATE(databaseId),
      data
    );
    return response.data;
  },

  updateRecord: async (
    databaseId: string,
    recordId: string,
    payload: Record<string, TPropertyValue>
  ) => {
    const response = await apiClient.put(
      API_ENDPOINTS.RECORD.UPDATE(databaseId, recordId),
      payload
    );
    return response.data;
  },

  deleteRecord: async (
    databaseId: string,
    recordId: string,
    permanent = false
  ) => {
    await apiClient.delete(API_ENDPOINTS.RECORD.DELETE(databaseId, recordId), {
      params: { permanent },
    });
  },

  bulkUpdateRecords: async (databaseId: string, data: TBulkUpdateRecords) => {
    const response = await apiClient.put(
      API_ENDPOINTS.RECORD.BULK_UPDATE(databaseId),
      data
    );
    return response.data;
  },

  bulkDeleteRecords: async (databaseId: string, data: TBulkDeleteRecords) => {
    const response = await apiClient.delete(
      API_ENDPOINTS.RECORD.BULK_DELETE(databaseId),
      { data }
    );
    return response.data;
  },

  reorderRecords: async (databaseId: string, data: TReorderRecords) => {
    await apiClient.put(API_ENDPOINTS.RECORD.REORDER(databaseId), data);
  },

  duplicateRecord: async (
    databaseId: string,
    recordId: string,
    data?: TCreateRecord
  ) => {
    const response = await apiClient.post(
      API_ENDPOINTS.RECORD.DUPLICATE(databaseId, recordId),
      data
    );
    return response.data;
  },

  // VIEW
  getViews: async (databaseId: string, params?: Record<string, unknown>) => {
    const response = await apiClient.get(
      API_ENDPOINTS.VIEW.GET_ALL(databaseId),
      { params }
    );
    return response.data;
  },

  getViewById: async (databaseId: string, viewId: string) => {
    const response = await apiClient.get(
      API_ENDPOINTS.VIEW.GET_BY_ID(databaseId, viewId)
    );
    return response.data;
  },

  createView: async (databaseId: string, data: TCreateView) => {
    const response = await apiClient.post(
      API_ENDPOINTS.VIEW.CREATE(databaseId),
      data
    );
    return response.data;
  },

  updateView: async (databaseId: string, viewId: string, data: TUpdateView) => {
    const response = await apiClient.put(
      API_ENDPOINTS.VIEW.UPDATE(databaseId, viewId),
      data
    );
    return response.data;
  },

  deleteView: async (databaseId: string, viewId: string) => {
    await apiClient.delete(API_ENDPOINTS.VIEW.DELETE(databaseId, viewId));
  },

  duplicateView: async (
    databaseId: string,
    viewId: string,
    data: { newName?: string }
  ) => {
    const response = await apiClient.post(
      API_ENDPOINTS.VIEW.DUPLICATE(databaseId, viewId),
      data
    );
    return response.data;
  },

  updateViewGrouping: async (
    databaseId: string,
    viewId: string,
    groupBy: { propertyId: string; direction?: "asc" | "desc" }
  ) => {
    const response = await apiClient.patch(
      API_ENDPOINTS.VIEW.UPDATE_GROUPING(databaseId, viewId),
      { groupBy }
    );
    return response.data;
  },

  changeViewType: async (databaseId: string, viewId: string, type: string) => {
    const response = await apiClient.patch(
      API_ENDPOINTS.VIEW.CHANGE_TYPE(databaseId, viewId),
      { type }
    );
    return response.data;
  },

  updateViewPropertyVisibility: async (
    databaseId: string,
    viewId: string,
    visibleProperties: string[]
  ) => {
    const response = await apiClient.patch(
      API_ENDPOINTS.VIEW.UPDATE_PROPERTY_VISIBILITY(databaseId, viewId),
      { visibleProperties }
    );
    return response.data;
  },

  updateViewHiddenProperties: async (
    databaseId: string,
    viewId: string,
    hiddenProperties: string[]
  ) => {
    const response = await apiClient.patch(
      API_ENDPOINTS.VIEW.UPDATE_HIDDEN_PROPERTIES(databaseId, viewId),
      { hiddenProperties }
    );
    return response.data;
  },

  updateViewColumnFreeze: async (
    databaseId: string,
    viewId: string,
    frozenColumns: string[]
  ) => {
    const response = await apiClient.patch(
      API_ENDPOINTS.VIEW.UPDATE_COLUMN_FREEZE(databaseId, viewId),
      { frozenColumns }
    );
    return response.data;
  },

  updateViewFilters: async (
    databaseId: string,
    viewId: string,
    filters: Array<{ propertyId: string; operator: string; value: unknown }>
  ) => {
    const response = await apiClient.patch(
      API_ENDPOINTS.VIEW.UPDATE_FILTERS(databaseId, viewId),
      { filters }
    );
    return response.data;
  },

  updateViewSorts: async (
    databaseId: string,
    viewId: string,
    sorts: Array<{ propertyId: string; direction: "asc" | "desc" }>
  ) => {
    const response = await apiClient.patch(
      API_ENDPOINTS.VIEW.UPDATE_SORTS(databaseId, viewId),
      { sorts }
    );
    return response.data;
  },

  // DATABASE-LEVEL FILTERS AND SORTS
  getDatabaseFilters: async (
    databaseId: string,
    params?: TDatabaseFilterQueryParams
  ) => {
    const response = await apiClient.get(
      API_ENDPOINTS.DATABASE.GET_FILTERS(databaseId),
      {
        params,
      }
    );
    return response.data;
  },

  getDatabaseFilterById: async (databaseId: string, filterId: string) => {
    const response = await apiClient.get(
      API_ENDPOINTS.DATABASE.GET_FILTER_BY_ID(databaseId, filterId)
    );
    return response.data;
  },

  createDatabaseFilter: async (
    databaseId: string,
    data: TCreateDatabaseFilter
  ) => {
    const response = await apiClient.post(
      API_ENDPOINTS.DATABASE.CREATE_FILTER(databaseId),
      data
    );
    return response.data;
  },

  updateDatabaseFilter: async (
    databaseId: string,
    filterId: string,
    data: TUpdateDatabaseFilter
  ) => {
    const response = await apiClient.put(
      API_ENDPOINTS.DATABASE.UPDATE_FILTER(databaseId, filterId),
      data
    );
    return response.data;
  },

  deleteDatabaseFilter: async (databaseId: string, filterId: string) => {
    await apiClient.delete(
      API_ENDPOINTS.DATABASE.DELETE_FILTER(databaseId, filterId)
    );
  },

  duplicateDatabaseFilter: async (
    databaseId: string,
    filterId: string,
    name?: string
  ) => {
    const response = await apiClient.post(
      API_ENDPOINTS.DATABASE.DUPLICATE_FILTER(databaseId, filterId),
      { name }
    );
    return response.data;
  },

  getDatabaseSorts: async (
    databaseId: string,
    params?: TDatabaseSortQueryParams
  ) => {
    const response = await apiClient.get(
      API_ENDPOINTS.DATABASE.GET_SORTS(databaseId),
      {
        params,
      }
    );
    return response.data;
  },

  getDatabaseSortById: async (databaseId: string, sortId: string) => {
    const response = await apiClient.get(
      API_ENDPOINTS.DATABASE.GET_SORT_BY_ID(databaseId, sortId)
    );
    return response.data;
  },

  createDatabaseSort: async (databaseId: string, data: TCreateDatabaseSort) => {
    const response = await apiClient.post(
      API_ENDPOINTS.DATABASE.CREATE_SORT(databaseId),
      data
    );
    return response.data;
  },

  updateDatabaseSort: async (
    databaseId: string,
    sortId: string,
    data: TUpdateDatabaseSort
  ) => {
    const response = await apiClient.put(
      API_ENDPOINTS.DATABASE.UPDATE_SORT(databaseId, sortId),
      data
    );
    return response.data;
  },

  deleteDatabaseSort: async (databaseId: string, sortId: string) => {
    await apiClient.delete(
      API_ENDPOINTS.DATABASE.DELETE_SORT(databaseId, sortId)
    );
  },

  duplicateDatabaseSort: async (
    databaseId: string,
    sortId: string,
    name?: string
  ) => {
    const response = await apiClient.post(
      API_ENDPOINTS.DATABASE.DUPLICATE_SORT(databaseId, sortId),
      { name }
    );
    return response.data;
  },

  getDatabaseFilterPresets: async (
    databaseId: string,
    params?: TDatabaseFilterPresetQueryParams
  ) => {
    const response = await apiClient.get(
      API_ENDPOINTS.DATABASE.GET_FILTER_PRESETS(databaseId),
      {
        params,
      }
    );
    return response.data;
  },

  getDatabaseFilterPresetById: async (databaseId: string, presetId: string) => {
    const response = await apiClient.get(
      API_ENDPOINTS.DATABASE.GET_FILTER_PRESET_BY_ID(databaseId, presetId)
    );
    return response.data;
  },

  createDatabaseFilterPreset: async (
    databaseId: string,
    data: TCreateDatabaseFilterPreset
  ) => {
    const response = await apiClient.post(
      API_ENDPOINTS.DATABASE.CREATE_FILTER_PRESET(databaseId),
      data
    );
    return response.data;
  },

  updateDatabaseFilterPreset: async (
    databaseId: string,
    presetId: string,
    data: TUpdateDatabaseFilterPreset
  ) => {
    const response = await apiClient.put(
      API_ENDPOINTS.DATABASE.UPDATE_FILTER_PRESET(databaseId, presetId),
      data
    );
    return response.data;
  },

  deleteDatabaseFilterPreset: async (databaseId: string, presetId: string) => {
    await apiClient.delete(
      API_ENDPOINTS.DATABASE.DELETE_FILTER_PRESET(databaseId, presetId)
    );
  },

  duplicateDatabaseFilterPreset: async (
    databaseId: string,
    presetId: string,
    name?: string
  ) => {
    const response = await apiClient.post(
      API_ENDPOINTS.DATABASE.DUPLICATE_FILTER_PRESET(databaseId, presetId),
      { name }
    );
    return response.data;
  },

  applyDatabaseFilterPreset: async (databaseId: string, presetId: string) => {
    const response = await apiClient.post(
      API_ENDPOINTS.DATABASE.APPLY_FILTER_PRESET(databaseId, presetId)
    );
    return response.data;
  },

  // RELATION
  getRelations: async (params?: TRelationQueryParams) => {
    const response = await apiClient.get(API_ENDPOINTS.RELATION.GET_ALL, {
      params,
    });
    return response.data;
  },

  getRelation: async (relationId: string) => {
    const response = await apiClient.get(
      API_ENDPOINTS.RELATION.GET_BY_ID(relationId)
    );
    return response.data;
  },

  createRelation: async (data: TCreateRelation) => {
    const response = await apiClient.post(API_ENDPOINTS.RELATION.CREATE, data);
    return response.data;
  },

  updateRelation: async (relationId: string, data: TUpdateRelation) => {
    const response = await apiClient.put(
      API_ENDPOINTS.RELATION.UPDATE(relationId),
      data
    );
    return response.data;
  },

  deleteRelation: async (relationId: string) => {
    await apiClient.delete(API_ENDPOINTS.RELATION.DELETE(relationId));
  },

  getRelationConnections: async (params?: IRelationConnectionQueryParams) => {
    const response = await apiClient.get(API_ENDPOINTS.RELATION.CONNECTIONS, {
      params,
    });
    return response.data;
  },

  createRelationConnection: async (data: TCreateRelationConnection) => {
    const response = await apiClient.post(
      API_ENDPOINTS.RELATION.CREATE_CONNECTION,
      data
    );
    return response.data;
  },

  deleteRelationConnection: async (connectionId: string) => {
    await apiClient.delete(
      API_ENDPOINTS.RELATION.DELETE_CONNECTION(connectionId)
    );
  },

  // BLOCK
  getBlocks: async (
    databaseId: string,
    recordId: string,
    params?: IBlockSearchOptions
  ) => {
    const response = await apiClient.get(
      API_ENDPOINTS.BLOCK.GET_ALL(databaseId, recordId),
      { params }
    );
    return response.data;
  },

  getBlock: async (databaseId: string, recordId: string, blockId: string) => {
    const response = await apiClient.get(
      API_ENDPOINTS.BLOCK.GET_BY_ID(databaseId, recordId, blockId)
    );
    return response.data;
  },

  createBlock: async (
    databaseId: string,
    recordId: string,
    data: ICreateBlock
  ) => {
    const response = await apiClient.post(
      API_ENDPOINTS.BLOCK.CREATE(databaseId, recordId),
      data
    );
    return response.data;
  },

  updateBlock: async (
    databaseId: string,
    recordId: string,
    blockId: string,
    data: IUpdateBlock
  ) => {
    const response = await apiClient.put(
      API_ENDPOINTS.BLOCK.UPDATE(databaseId, recordId, blockId),
      data
    );
    return response.data;
  },

  deleteBlock: async (
    databaseId: string,
    recordId: string,
    blockId: string
  ) => {
    await apiClient.delete(
      API_ENDPOINTS.BLOCK.DELETE(databaseId, recordId, blockId)
    );
  },

  bulkBlockOperations: async (
    databaseId: string,
    recordId: string,
    operations: IBulkBlockOperation[]
  ) => {
    const response = await apiClient.post(
      API_ENDPOINTS.BLOCK.BULK_OPERATIONS(databaseId, recordId),
      { operations }
    );
    return response.data;
  },

  moveBlock: async (
    databaseId: string,
    recordId: string,
    blockId: string,
    data: { afterBlockId?: string; parentId?: string }
  ) => {
    const response = await apiClient.put(
      API_ENDPOINTS.BLOCK.MOVE(databaseId, recordId, blockId),
      data
    );
    return response.data;
  },

  duplicateBlock: async (
    databaseId: string,
    recordId: string,
    blockId: string
  ) => {
    const response = await apiClient.post(
      API_ENDPOINTS.BLOCK.DUPLICATE(databaseId, recordId, blockId)
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
  getDatabaseStats,
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
  // Database-level filter and sort methods
  getDatabaseFilters,
  getDatabaseFilterById,
  createDatabaseFilter,
  updateDatabaseFilter,
  deleteDatabaseFilter,
  duplicateDatabaseFilter,
  getDatabaseSorts,
  getDatabaseSortById,
  createDatabaseSort,
  updateDatabaseSort,
  deleteDatabaseSort,
  duplicateDatabaseSort,
  getDatabaseFilterPresets,
  getDatabaseFilterPresetById,
  createDatabaseFilterPreset,
  updateDatabaseFilterPreset,
  deleteDatabaseFilterPreset,
  duplicateDatabaseFilterPreset,
  applyDatabaseFilterPreset,
  // Relation methods
  getRelations,
  getRelation,
  createRelation,
  updateRelation,
  deleteRelation,
  getRelationConnections,
  createRelationConnection,
  deleteRelationConnection,
  // Block methods
  getBlocks,
  getBlock,
  createBlock,
  updateBlock,
  deleteBlock,
  bulkBlockOperations,
  moveBlock,
  duplicateBlock,
} = databaseApi;
