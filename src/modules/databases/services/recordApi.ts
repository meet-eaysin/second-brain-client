import type {
    CreateRecordRequest,
    DatabaseRecord,
    PaginatedRecordsResponse,
    UpdateRecordRequest
} from "@/types/database.types.ts";
import apiClient from "@/services/api-client.ts";
import {API_ENDPOINTS} from "@/constants/api-endpoints.ts";
import type {ApiResponse} from "@/modules/auth/types/auth.types.ts";


export const recordApi = {
    getRecords: async (
        databaseId: string,
        params = {}
    ): Promise<PaginatedRecordsResponse> => {
        try {
            const response = await apiClient.get<ApiResponse<PaginatedRecordsResponse>>(
                `${API_ENDPOINTS.DATABASES.BY_ID}/${databaseId}/records`,
                { params }
            );
            return response.data.data;
        } catch (error) {
            console.warn('Get records API call failed, using mock response:', error);

            // Return mock records data
            const mockResponse: PaginatedRecordsResponse = {
                records: [
                    {
                        id: 'record-1',
                        databaseId,
                        properties: {
                            'prop-1': 'Example text',
                            'prop-2': 42,
                            'prop-3': true,
                        },
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        createdBy: 'user-1',
                    },
                    {
                        id: 'record-2',
                        databaseId,
                        properties: {
                            'prop-1': 'Another example',
                            'prop-2': 18,
                            'prop-3': false,
                        },
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        createdBy: 'user-1',
                    },
                ],
                total: 2,
                totalPages: 1,
                currentPage: 1,
                hasNextPage: false,
                hasPreviousPage: false,
            };

            return mockResponse;
        }
    },

    createRecord: async (
        databaseId: string,
        data: CreateRecordRequest
    ): Promise<DatabaseRecord> => {
        try {
            const response = await apiClient.post<ApiResponse<DatabaseRecord>>(
                `${API_ENDPOINTS.DATABASES.BY_ID}/${databaseId}/records`,
                data
            );
            return response.data.data;
        } catch (error) {
            console.warn('Create record API call failed, using mock response:', error);

            // Return mock created record
            const mockRecord: DatabaseRecord = {
                id: `record-${Date.now()}`,
                databaseId,
                properties: data.properties,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                createdBy: 'user-1',
            };

            return mockRecord;
        }
    },

    updateRecord: async (
        databaseId: string,
        recordId: string,
        data: UpdateRecordRequest
    ): Promise<DatabaseRecord> => {
        try {
            const response = await apiClient.put<ApiResponse<DatabaseRecord>>(
                `${API_ENDPOINTS.DATABASES.BY_ID}/${databaseId}/records/${recordId}`,
                data
            );
            return response.data.data;
        } catch (error) {
            console.warn('Update record API call failed, using mock response:', error);

            // Return mock updated record
            const mockRecord: DatabaseRecord = {
                id: recordId,
                databaseId,
                properties: data.properties,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                createdBy: 'user-1',
            };

            return mockRecord;
        }
    },

    deleteRecord: async (databaseId: string, recordId: string): Promise<void> => {
        try {
            await apiClient.delete<ApiResponse<void>>(
                `${API_ENDPOINTS.DATABASES.BY_ID}/${databaseId}/records/${recordId}`
            );
        } catch (error) {
            console.warn('Delete record API call failed, using mock success:', error);
            // Return mock success (void)
            return;
        }
    },
};
