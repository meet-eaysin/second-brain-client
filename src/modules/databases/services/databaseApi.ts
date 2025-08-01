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

// No more mock data - using real API responses

export const databaseApi = {
    getDatabase: async (databaseId: string): Promise<Database> => {
        const response = await apiClient.get<ApiResponse<any>>(
            API_ENDPOINTS.DATABASES.BY_ID(databaseId)
        );

        const db = response.data.data;

        // Transform the API response to match our interface
        const transformedDatabase: Database = {
            id: db._id || db.id,
            name: db.name,
            description: db.description,
            icon: db.icon,
            cover: db.cover,
            workspaceId: db.workspaceId,
            ownerId: db.userId || db.createdBy,
            isPublic: db.isPublic,
            isFavorite: db.isFavorite,
            categoryId: db.categoryId,
            tags: db.tags || [],
            properties: db.properties || [],
            views: (db.views || []).map((view: any) => ({
                id: view.id || view._id,
                name: view.name,
                type: view.type?.toUpperCase() || 'TABLE',
                isDefault: view.isDefault,
                filters: view.filters || [],
                sorts: view.sorts || [],
                groupBy: view.groupBy,
                visibleProperties: view.visibleProperties || []
            })),
            permissions: db.permissions || [],
            createdAt: db.createdAt,
            updatedAt: db.updatedAt
        };

        return transformedDatabase;
    },

    getDatabases: async (params = {}): Promise<PaginatedDatabasesResponse> => {
        try {
            const response = await apiClient.get<ApiResponse<{ databases: any[] }>>(
                API_ENDPOINTS.DATABASES.LIST,
                { params }
            );

            console.log('✅ Raw API response:', response.data);

            // Map the API response to our expected format
            const apiData = response.data.data;
            const databases = apiData.databases || [];

            console.log('📊 Raw databases from API:', databases);
            console.log('📊 First database raw:', databases[0]);

            // Transform each database to match our interface
            const transformedDatabases: Database[] = databases.map((db: any) => {
                console.log('🔄 Transforming database:', {
                    _id: db._id,
                    id: db.id,
                    name: db.name,
                    userId: db.userId,
                    createdBy: db.createdBy,
                    allKeys: Object.keys(db)
                });

                // The API response shows id field exists, so use it directly
                const actualId = db.id || db._id || db.databaseId;
                console.log('🆔 ID resolution:', {
                    actualId,
                    using: actualId === db.id ? 'id' : actualId === db._id ? '_id' : 'databaseId',
                    originalId: db.id
                });

                return {
                    id: actualId, // Use the resolved ID
                name: db.name,
                description: db.description,
                icon: db.icon,
                cover: db.cover,
                workspaceId: db.workspaceId,
                ownerId: db.userId || db.createdBy, // This should be the user ID, not database ID
                isPublic: db.isPublic,
                isFavorite: db.isFavorite,
                categoryId: db.categoryId,
                tags: db.tags || [],
                properties: db.properties || [],
                views: (db.views || []).map((view: any) => ({
                    id: view._id, // Use _id directly as id for views too
                    name: view.name,
                    type: view.type?.toUpperCase() || 'TABLE',
                    isDefault: view.isDefault,
                    filters: view.filters || [],
                    sorts: view.sorts || [],
                    groupBy: view.groupBy,
                    visibleProperties: view.visibleProperties || []
                })),
                permissions: db.permissions || [],
                createdAt: db.createdAt,
                updatedAt: db.updatedAt
                };
            });

            // Create paginated response
            // Note: Your API doesn't seem to provide pagination metadata yet
            // You may need to update your backend to include total, totalPages, etc.
            const paginatedResponse: PaginatedDatabasesResponse = {
                databases: transformedDatabases,
                total: databases.length, // TODO: Backend should provide this
                totalPages: 1, // TODO: Backend should provide this
                currentPage: params.page || 1,
                hasNextPage: false, // TODO: Backend should provide this
                hasPreviousPage: (params.page || 1) > 1
            };

            console.log('✅ Transformed databases:', paginatedResponse);
            console.log('📊 First transformed database:', transformedDatabases[0]);
            return paginatedResponse;

        } catch (error) {
            console.error('❌ Get databases API call failed:', error);
            throw error; // Re-throw the error instead of returning mock data
        }
    },

    createDatabase: async (data: CreateDatabaseRequest): Promise<Database> => {
        const response = await apiClient.post<ApiResponse<Database>>(
            API_ENDPOINTS.DATABASES.CREATE,
            data
        );
        return response.data.data;
    },

    getDatabaseById: async (id: string): Promise<Database> => {
        const response = await apiClient.get<ApiResponse<any>>(
            API_ENDPOINTS.DATABASES.BY_ID(id)
        );

        const db = response.data.data;

        // Transform the API response to match our interface
        const transformedDatabase: Database = {
            id: db._id, // Use _id directly as id
            name: db.name,
            description: db.description,
            icon: db.icon,
            cover: db.cover,
            workspaceId: db.workspaceId,
            ownerId: db.userId || db.createdBy,
            isPublic: db.isPublic,
            isFavorite: db.isFavorite,
            categoryId: db.categoryId,
            tags: db.tags || [],
            properties: db.properties || [],
            views: (db.views || []).map((view: any) => ({
                id: view._id, // Use _id directly as id for views too
                name: view.name,
                type: view.type?.toUpperCase() || 'TABLE',
                isDefault: view.isDefault,
                filters: view.filters || [],
                sorts: view.sorts || [],
                groupBy: view.groupBy,
                visibleProperties: view.visibleProperties || []
            })),
            permissions: db.permissions || [],
            createdAt: db.createdAt,
            updatedAt: db.updatedAt
        };

        return transformedDatabase;
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
