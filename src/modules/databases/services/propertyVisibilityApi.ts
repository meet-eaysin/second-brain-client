import { apiClient } from '@/services/api-client';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import type { ApiResponse } from '@/types/api.types';
import type { Database, DatabaseView } from '@/types/database.types';

export interface PropertyVisibilityRequest {
    isVisible: boolean;
}

export interface ViewVisibilityRequest {
    visibleProperties: string[];
}

export const propertyVisibilityApi = {
    // Toggle global property visibility
    togglePropertyVisibility: async (
        databaseId: string, 
        propertyId: string, 
        isVisible: boolean
    ): Promise<Database> => {
        const response = await apiClient.patch<ApiResponse<Database>>(
            API_ENDPOINTS.DATABASES.PROPERTY_VISIBILITY(databaseId, propertyId),
            { isVisible }
        );
        return response.data.data;
    },

    // Update view visible properties
    updateViewVisibility: async (
        databaseId: string,
        viewId: string,
        visibleProperties: string[]
    ): Promise<Database> => {
        const response = await apiClient.put<ApiResponse<Database>>(
            API_ENDPOINTS.DATABASES.VIEW_BY_ID(databaseId, viewId),
            { visibleProperties }
        );
        return response.data.data;
    },

    // Bulk toggle multiple properties
    bulkToggleProperties: async (
        databaseId: string,
        propertyUpdates: Array<{ propertyId: string; isVisible: boolean }>
    ): Promise<Database> => {
        const response = await apiClient.patch<ApiResponse<Database>>(
            `${API_ENDPOINTS.DATABASES.BY_ID(databaseId)}/properties/bulk-visibility`,
            { updates: propertyUpdates }
        );
        return response.data.data;
    },

    // Show all properties in a view
    showAllPropertiesInView: async (
        databaseId: string,
        viewId: string
    ): Promise<Database> => {
        const response = await apiClient.patch<ApiResponse<Database>>(
            `${API_ENDPOINTS.DATABASES.VIEW_BY_ID(databaseId, viewId)}/show-all`,
            {}
        );
        return response.data.data;
    },

    // Hide all non-required properties in a view
    hideNonRequiredPropertiesInView: async (
        databaseId: string,
        viewId: string
    ): Promise<Database> => {
        const response = await apiClient.patch<ApiResponse<Database>>(
            `${API_ENDPOINTS.DATABASES.VIEW_BY_ID(databaseId, viewId)}/hide-non-required`,
            {}
        );
        return response.data.data;
    },

    // Get property visibility statistics
    getVisibilityStats: async (databaseId: string): Promise<{
        totalProperties: number;
        visibleProperties: number;
        hiddenProperties: number;
        viewSpecificHidden: number;
    }> => {
        const response = await apiClient.get<ApiResponse<{
            totalProperties: number;
            visibleProperties: number;
            hiddenProperties: number;
            viewSpecificHidden: number;
        }>>(
            `${API_ENDPOINTS.DATABASES.BY_ID(databaseId)}/visibility-stats`
        );
        return response.data.data;
    }
};
