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

// Mock data for development
const mockDatabases: Database[] = [
    {
        id: '1',
        name: 'Project Management',
        description: 'Track projects, tasks, and deadlines',
        icon: '📋',
        workspaceId: 'workspace-1',
        ownerId: 'user-1',
        isPublic: false,
        isFavorite: true,
        properties: [],
        views: [],
        permissions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '2',
        name: 'Content Calendar',
        description: 'Plan and organize content creation',
        icon: '📅',
        workspaceId: 'workspace-1',
        ownerId: 'user-1',
        isPublic: true,
        isFavorite: false,
        properties: [],
        views: [],
        permissions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '3',
        name: 'Customer Database',
        description: 'Manage customer information and interactions',
        icon: '👥',
        workspaceId: 'workspace-1',
        ownerId: 'user-2',
        isPublic: false,
        isFavorite: false,
        properties: [],
        views: [],
        permissions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

export const databaseApi = {
    getDatabase: async (databaseId: string): Promise<Database> => {
        try {
            const response = await apiClient.get<ApiResponse<Database>>(
                `${API_ENDPOINTS.DATABASES.DETAIL}/${databaseId}`
            );
            return response.data.data;
        } catch (error) {
            console.warn('Get database API call failed, using mock response:', error);

            // Return mock database
            const mockDatabase: Database = {
                id: databaseId,
                name: 'Mock Database',
                description: 'This is a mock database for development',
                icon: '📊',
                cover: '',
                workspaceId: 'workspace-1',
                ownerId: 'user-1',
                isPublic: false,
                properties: [
                    {
                        id: 'prop-1',
                        name: 'Name',
                        type: 'TEXT',
                        required: true,
                        isVisible: true,
                        order: 0,
                    },
                    {
                        id: 'prop-2',
                        name: 'Number',
                        type: 'NUMBER',
                        required: false,
                        isVisible: true,
                        order: 1,
                    },
                    {
                        id: 'prop-3',
                        name: 'Status',
                        type: 'SELECT',
                        required: false,
                        isVisible: true,
                        order: 2,
                        selectOptions: [
                            { id: 'status-1', name: 'Todo', color: '#e91e63' },
                            { id: 'status-2', name: 'In Progress', color: '#2196f3' },
                            { id: 'status-3', name: 'Done', color: '#4caf50' },
                        ],
                    },
                ],
                views: [
                    {
                        id: 'view-1',
                        name: 'Table View',
                        type: 'TABLE',
                        isDefault: true,
                        filters: [],
                        sorts: [],
                        visibleProperties: ['prop-1', 'prop-2', 'prop-3'],
                    },
                ],
                permissions: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            return mockDatabase;
        }
    },

    getDatabases: async (params = {}): Promise<PaginatedDatabasesResponse> => {
        try {
            const response = await apiClient.get<ApiResponse<PaginatedDatabasesResponse>>(
                API_ENDPOINTS.DATABASES.LIST,
                { params }
            );
            return response.data.data;
        } catch (error) {
            console.warn('Get databases API call failed, using mock response:', error);

            // Return mock databases list
            const mockDatabases: PaginatedDatabasesResponse = {
                databases: [
                    {
                        id: 'db-1',
                        name: 'Projects',
                        description: 'Track all company projects',
                        icon: '🚀',
                        workspaceId: 'workspace-1',
                        ownerId: 'user-1',
                        isPublic: true,
                        properties: [],
                        views: [],
                        permissions: [],
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    },
                    {
                        id: 'db-2',
                        name: 'Team Members',
                        description: 'Employee directory',
                        icon: '👥',
                        workspaceId: 'workspace-1',
                        ownerId: 'user-1',
                        isPublic: false,
                        properties: [],
                        views: [],
                        permissions: [],
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    },
                ],
                total: 2,
                totalPages: 1,
                currentPage: 1,
            };

            return mockDatabases;
        }
    },

    getDatabases: async (params?: DatabaseQueryParams): Promise<PaginatedDatabasesResponse> => {
        try {
            const response = await apiClient.get<ApiResponse<Record<string, unknown>[]>>(
                API_ENDPOINTS.DATABASES.LIST,
                { params }
            );

            const rawDatabases = response.data.data || [];
            const databases = rawDatabases.map((db: Record<string, unknown>): Database => {
                const getString = (value: unknown, fallback = ''): string => {
                    return typeof value === 'string' ? value : fallback;
                };

                const getOptionalString = (value: unknown): string | undefined => {
                    return typeof value === 'string' ? value : undefined;
                };

                const getBoolean = (value: unknown): boolean => {
                    return typeof value === 'boolean' ? value : false;
                };

                const getArray = <T>(value: unknown): T[] => {
                    return Array.isArray(value) ? value : [];
                };

                return {
                    id: getString(db._id) || getString(db.id),
                    name: getString(db.name),
                    description: getOptionalString(db.description),
                    icon: getOptionalString(db.icon),
                    cover: getOptionalString(db.cover),
                    workspaceId: getString(db.workspaceId),
                    ownerId: getString(db.userId) || getString(db.ownerId) || getString(db.createdBy),
                    isPublic: getBoolean(db.isPublic),
                    properties: getArray(db.properties),
                    views: getArray(db.views),
                    permissions: getArray(db.sharedWith) || getArray(db.permissions),
                    createdAt: getString(db.createdAt),
                    updatedAt: getString(db.updatedAt),
                };
            });

            return {
                databases,
                total: databases.length,
                totalPages: 1,
                currentPage: 1,
            };
        } catch (error) {
            console.warn('API call failed, using mock data for development:', error);

            // Return mock data for development
            return {
                databases: mockDatabases,
                total: mockDatabases.length,
                totalPages: 1,
                currentPage: 1,
            };
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
        try {
            const response = await apiClient.get<ApiResponse<Database>>(
                API_ENDPOINTS.DATABASES.BY_ID(id)
            );
            return response.data.data;
        } catch (error) {
            console.warn('Get database by ID API call failed, using mock response:', error);

            // Return mock database
            const mockDatabase = mockDatabases.find(db => db.id === id) || mockDatabases[0];
            return mockDatabase;
        }
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
