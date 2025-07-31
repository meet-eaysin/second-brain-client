import { apiClient } from '@/services/api-client.ts';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import type {
    Database,
    CreateDatabaseRequest,
    UpdateDatabaseRequest,
    CreatePropertyRequest,
    UpdatePropertyRequest,
    CreateViewRequest,
    UpdateViewRequest,
    DatabaseRecord,
    CreateRecordRequest,
    UpdateRecordRequest,
    ShareDatabaseRequest,
    PaginatedDatabasesResponse,
    PaginatedRecordsResponse,
    DatabaseQueryParams,
    RecordQueryParams,
} from '@/types/database.types';
import type { ApiResponse } from '@/types/api.types';

export const databaseApi = {
    // Database CRUD
    getDatabases: async (params?: DatabaseQueryParams): Promise<PaginatedDatabasesResponse> => {
        const response = await apiClient.get<ApiResponse<PaginatedDatabasesResponse>>(
            API_ENDPOINTS.DATABASES.LIST,
            { params }
        );
        return response.data.data;
    },

    createDatabase: async (data: CreateDatabaseRequest): Promise<Database> => {
        const response = await apiClient.post<ApiResponse<Database>>(
            API_ENDPOINTS.DATABASES.CREATE,
            data
        );
        return response.data.data;
    },

    getDatabaseById: async (id: string): Promise<Database> => {
        const response = await apiClient.get<ApiResponse<Database>>(
            API_ENDPOINTS.DATABASES.BY_ID(id)
        );
        return response.data.data;
    },

    updateDatabase: async (id: string, data: UpdateDatabaseRequest): Promise<Database> => {
        const response = await apiClient.put<ApiResponse<Database>>(
            API_ENDPOINTS.DATABASES.UPDATE(id),
            data
        );
        return response.data.data;
    },

    deleteDatabase: async (id: string): Promise<void> => {
        await apiClient.delete(API_ENDPOINTS.DATABASES.DELETE(id));
    },

    // Property Management
    addProperty: async (databaseId: string, data: CreatePropertyRequest): Promise<Database> => {
        const response = await apiClient.post<ApiResponse<Database>>(
            API_ENDPOINTS.DATABASES.PROPERTIES(databaseId),
            data
        );
        return response.data.data;
    },

    updateProperty: async (
        databaseId: string,
        propertyId: string,
        data: UpdatePropertyRequest
    ): Promise<Database> => {
        const response = await apiClient.put<ApiResponse<Database>>(
            API_ENDPOINTS.DATABASES.PROPERTY(databaseId, propertyId),
            data
        );
        return response.data.data;
    },

    deleteProperty: async (databaseId: string, propertyId: string): Promise<Database> => {
        const response = await apiClient.delete<ApiResponse<Database>>(
            API_ENDPOINTS.DATABASES.PROPERTY(databaseId, propertyId)
        );
        return response.data.data;
    },

    // View Management
    addView: async (databaseId: string, data: CreateViewRequest): Promise<Database> => {
        const response = await apiClient.post<ApiResponse<Database>>(
            API_ENDPOINTS.DATABASES.VIEWS(databaseId),
            data
        );
        return response.data.data;
    },

    updateView: async (
        databaseId: string,
        viewId: string,
        data: UpdateViewRequest
    ): Promise<Database> => {
        const response = await apiClient.put<ApiResponse<Database>>(
            API_ENDPOINTS.DATABASES.VIEW(databaseId, viewId),
            data
        );
        return response.data.data;
    },

    deleteView: async (databaseId: string, viewId: string): Promise<Database> => {
        const response = await apiClient.delete<ApiResponse<Database>>(
            API_ENDPOINTS.DATABASES.VIEW(databaseId, viewId)
        );
        return response.data.data;
    },

    // Record Management
    getRecords: async (
        databaseId: string,
        params?: RecordQueryParams
    ): Promise<PaginatedRecordsResponse> => {
        const response = await apiClient.get<ApiResponse<PaginatedRecordsResponse>>(
            API_ENDPOINTS.DATABASES.RECORDS(databaseId),
            { params }
        );
        return response.data.data;
    },

    createRecord: async (databaseId: string, data: CreateRecordRequest): Promise<DatabaseRecord> => {
        const response = await apiClient.post<ApiResponse<DatabaseRecord>>(
            API_ENDPOINTS.DATABASES.RECORDS(databaseId),
            data
        );
        return response.data.data;
    },

    getRecordById: async (databaseId: string, recordId: string): Promise<DatabaseRecord> => {
        const response = await apiClient.get<ApiResponse<DatabaseRecord>>(
            API_ENDPOINTS.DATABASES.RECORD(databaseId, recordId)
        );
        return response.data.data;
    },

    updateRecord: async (
        databaseId: string,
        recordId: string,
        data: UpdateRecordRequest
    ): Promise<DatabaseRecord> => {
        const response = await apiClient.put<ApiResponse<DatabaseRecord>>(
            API_ENDPOINTS.DATABASES.RECORD(databaseId, recordId),
            data
        );
        return response.data.data;
    },

    deleteRecord: async (databaseId: string, recordId: string): Promise<void> => {
        await apiClient.delete(API_ENDPOINTS.DATABASES.RECORD(databaseId, recordId));
    },

    // Permission Management
    shareDatabase: async (databaseId: string, data: ShareDatabaseRequest): Promise<Database> => {
        const response = await apiClient.post<ApiResponse<Database>>(
            API_ENDPOINTS.DATABASES.SHARE(databaseId),
            data
        );
        return response.data.data;
    },

    removeDatabaseAccess: async (databaseId: string, userId: string): Promise<Database> => {
        const response = await apiClient.delete<ApiResponse<Database>>(
            API_ENDPOINTS.DATABASES.REMOVE_ACCESS(databaseId, userId)
        );
        return response.data.data;
    },
};
