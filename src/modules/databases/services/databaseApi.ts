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
            frozen: db.frozen,
            frozenAt: db.frozenAt,
            frozenBy: db.frozenBy,
            frozenReason: db.frozenReason,
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

                return {
                    id: db.id, // Use the resolved ID
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
                    id: view.id,
                    name: view.name,
                    type: view.type?.toUpperCase() || 'TABLE',
                    isDefault: view.isDefault,
                    filters: view.filters || [],
                    sorts: view.sorts || [],
                    groupBy: view.groupBy,
                    visibleProperties: view.visibleProperties || []
                })),
                permissions: db.permissions || [],
                frozen: db.frozen,
                frozenAt: db.frozenAt,
                frozenBy: db.frozenBy,
                frozenReason: db.frozenReason,
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
            id: db.id,
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
                id: view.id,
                name: view.name,
                type: view.type?.toUpperCase() || 'TABLE',
                isDefault: view.isDefault,
                filters: view.filters || [],
                sorts: view.sorts || [],
                groupBy: view.groupBy,
                visibleProperties: view.visibleProperties || []
            })),
            permissions: db.permissions || [],
            frozen: db.frozen,
            frozenAt: db.frozenAt,
            frozenBy: db.frozenBy,
            frozenReason: db.frozenReason,
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

    // Update view
    updateView: async (databaseId: string, viewId: string, viewData: UpdateViewRequest): Promise<Database> => {
        const response = await apiClient.patch<ApiResponse<Database>>(
            `${API_ENDPOINTS.DATABASES.VIEWS(databaseId)}/${viewId}`,
            viewData
        );
        return response.data.data;
    },

    // Delete view
    deleteView: async (databaseId: string, viewId: string): Promise<Database> => {
        const response = await apiClient.delete<ApiResponse<Database>>(
            `${API_ENDPOINTS.DATABASES.VIEWS(databaseId)}/${viewId}`
        );
        return response.data.data;
    },

    // Duplicate view
    duplicateView: async (databaseId: string, viewId: string, data: { name: string }): Promise<Database> => {
        const response = await apiClient.post<ApiResponse<Database>>(
            `${API_ENDPOINTS.DATABASES.VIEWS(databaseId)}/${viewId}/duplicate`,
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

    // Enhanced database features
    toggleFavorite: async (databaseId: string): Promise<Database> => {
        const response = await apiClient.patch<ApiResponse<Database>>(
            API_ENDPOINTS.DATABASES.TOGGLE_FAVORITE(databaseId)
        );
        return response.data.data;
    },

    moveToCategory: async (databaseId: string, categoryId: string | null): Promise<Database> => {
        const response = await apiClient.patch<ApiResponse<Database>>(
            API_ENDPOINTS.DATABASES.MOVE_TO_CATEGORY(databaseId),
            { categoryId }
        );
        return response.data.data;
    },

    duplicateDatabase: async (databaseId: string, name?: string): Promise<Database> => {
        const response = await apiClient.post<ApiResponse<Database>>(
            API_ENDPOINTS.DATABASES.DUPLICATE(databaseId),
            { name }
        );
        return response.data.data;
    },

    exportDatabase: async (databaseId: string, format: 'json' | 'csv' | 'excel' = 'json'): Promise<Blob> => {
        const response = await apiClient.get(
            API_ENDPOINTS.DATABASES.EXPORT(databaseId),
            {
                params: { format },
                responseType: 'blob'
            }
        );
        return response.data;
    },

    importDatabase: async (databaseId: string, file: File, options?: {
        mapping?: Record<string, string>;
        skipFirstRow?: boolean;
    }): Promise<{ imported: number; errors: string[] }> => {
        const formData = new FormData();
        formData.append('file', file);
        if (options?.mapping) {
            formData.append('mapping', JSON.stringify(options.mapping));
        }
        if (options?.skipFirstRow) {
            formData.append('skipFirstRow', 'true');
        }

        const response = await apiClient.post<ApiResponse<{ imported: number; errors: string[] }>>(
            API_ENDPOINTS.DATABASES.IMPORT(databaseId),
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data.data;
    },

    // Duplicate database
    duplicateDatabase: async (databaseId: string, data?: {
        name?: string;
        description?: string;
        includeRecords?: boolean;
        includeViews?: boolean;
        workspaceId?: string;
        categoryId?: string;
    }): Promise<Database> => {
        const response = await apiClient.post<ApiResponse<Database>>(
            `${API_ENDPOINTS.DATABASES.BY_ID(databaseId)}/duplicate`,
            data
        );
        return response.data.data;
    },

    // Property Management APIs
    updatePropertyName: async (databaseId: string, propertyId: string, name: string): Promise<Database> => {
        const response = await apiClient.patch<ApiResponse<Database>>(
            API_ENDPOINTS.DATABASES.UPDATE_PROPERTY_NAME(databaseId, propertyId),
            { name }
        );
        return response.data.data;
    },

    updatePropertyType: async (databaseId: string, propertyId: string, type: string): Promise<Database> => {
        const response = await apiClient.patch<ApiResponse<Database>>(
            API_ENDPOINTS.DATABASES.UPDATE_PROPERTY_TYPE(databaseId, propertyId),
            { type }
        );
        return response.data.data;
    },

    reorderProperty: async (databaseId: string, propertyId: string, newOrder: number): Promise<Database> => {
        const response = await apiClient.patch<ApiResponse<Database>>(
            API_ENDPOINTS.DATABASES.REORDER_PROPERTY(databaseId, propertyId),
            { order: newOrder }
        );
        return response.data.data;
    },

    insertPropertyAt: async (databaseId: string, targetPropertyId: string, position: 'left' | 'right', propertyData: any): Promise<Database> => {
        const response = await apiClient.post<ApiResponse<Database>>(
            API_ENDPOINTS.DATABASES.INSERT_PROPERTY(databaseId, targetPropertyId),
            { position, ...propertyData }
        );
        return response.data.data;
    },

    duplicateProperty: async (databaseId: string, propertyId: string): Promise<Database> => {
        const response = await apiClient.post<ApiResponse<Database>>(
            API_ENDPOINTS.DATABASES.DUPLICATE_PROPERTY(databaseId, propertyId)
        );
        return response.data.data;
    },

    freezeProperty: async (databaseId: string, propertyId: string, frozen: boolean): Promise<Database> => {
        const response = await apiClient.patch<ApiResponse<Database>>(
            API_ENDPOINTS.DATABASES.FREEZE_PROPERTY(databaseId, propertyId),
            { frozen }
        );
        return response.data.data;
    },

    hideProperty: async (databaseId: string, propertyId: string, hidden: boolean): Promise<Database> => {
        const response = await apiClient.patch<ApiResponse<Database>>(
            API_ENDPOINTS.DATABASES.HIDE_PROPERTY(databaseId, propertyId),
            { hidden }
        );
        return response.data.data;
    },

    // Database freeze/unfreeze
    freezeDatabase: async (databaseId: string, frozen: boolean, reason?: string): Promise<Database> => {
        const response = await apiClient.patch<ApiResponse<Database>>(
            API_ENDPOINTS.DATABASES.FREEZE(databaseId),
            { frozen, reason }
        );
        return response.data.data;
    },
};
