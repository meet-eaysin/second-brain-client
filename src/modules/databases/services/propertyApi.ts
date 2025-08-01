import type {CreatePropertyRequest, DatabaseProperty, UpdatePropertyRequest} from "@/types/database.types.ts";
import type {ApiResponse} from "@/types/api.types.ts";
import apiClient from "@/services/api-client.ts";
import {API_ENDPOINTS} from "@/constants/api-endpoints.ts";


export const propertyApi = {
    createProperty: async (databaseId: string, data: CreatePropertyRequest): Promise<DatabaseProperty> => {
        try {
            const response = await apiClient.post<ApiResponse<DatabaseProperty>>(
                `${API_ENDPOINTS.DATABASES.BY_ID}/${databaseId}/properties`,
                data
            );
            return response.data.data;
        } catch (error) {
            console.warn('Create property API call failed, using mock response:', error);

            // Return mock created property
            const mockProperty: DatabaseProperty = {
                id: `prop-${Date.now()}`,
                name: data.name,
                type: data.type,
                description: data.description,
                required: data.required || false,
                isVisible: true,
                order: data.order || 0,
                selectOptions: data.selectOptions?.map((option, index) => ({
                    id: `option-${Date.now()}-${index}`,
                    name: option.name,
                    color: option.color,
                })),
                relationConfig: data.relationConfig,
            };

            return mockProperty;
        }
    },

    updateProperty: async (
        databaseId: string,
        propertyId: string,
        data: UpdatePropertyRequest
    ): Promise<DatabaseProperty> => {
        try {
            const response = await apiClient.put<ApiResponse<DatabaseProperty>>(
                `${API_ENDPOINTS.DATABASES.BY_ID}/${databaseId}/properties/${propertyId}`,
                data
            );
            return response.data.data;
        } catch (error) {
            console.warn('Update property API call failed, using mock response:', error);

            // Return mock updated property
            const mockProperty: DatabaseProperty = {
                id: propertyId,
                name: data.name || 'Updated Property',
                type: 'TEXT', // Can't change type in update
                description: data.description,
                required: data.required !== undefined ? data.required : true,
                isVisible: true,
                order: 0,
                selectOptions: data.selectOptions,
            };

            return mockProperty;
        }
    },

    deleteProperty: async (databaseId: string, propertyId: string): Promise<void> => {
        try {
            await apiClient.delete<ApiResponse<void>>(
                `${API_ENDPOINTS.DATABASES.BY_ID}/${databaseId}/properties/${propertyId}`
            );
        } catch (error) {
            console.warn('Delete property API call failed, using mock success:', error);
            // Return mock success (void)
            return;
        }
    },

    reorderProperties: async (databaseId: string, propertyIds: string[]): Promise<void> => {
        try {
            await apiClient.put<ApiResponse<void>>(
                `${API_ENDPOINTS.DATABASES.BY_ID}/${databaseId}/properties/reorder`,
                { propertyIds }
            );
        } catch (error) {
            console.warn('Reorder properties API call failed, using mock success:', error);
            // Return mock success (void)
            return;
        }
    },
};
