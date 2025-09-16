import { apiClient } from '@/services/api-client.ts';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import type { ApiResponse } from '@/types/api.types';
import type { Database } from '@/types/document.types.ts';

export interface DatabaseTemplate {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    tags: string[];
    preview: {
        properties: Array<{
            name: string;
            type: string;
            description?: string;
        }>;
        sampleRecords: number;
    };
    isPopular: boolean;
    usageCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateFromTemplateRequest {
    name: string;
    description?: string;
    workspaceId?: string;
    customizations?: {
        includeProperties?: string[];
        excludeProperties?: string[];
        includeSampleData?: boolean;
    };
}

export const templateApi = {
    getTemplates: async (params?: {
        category?: string;
        search?: string;
        popular?: boolean;
        limit?: number;
    }): Promise<DatabaseTemplate[]> => {
        const response = await apiClient.get<ApiResponse<{ templates: DatabaseTemplate[] }>>(
            API_ENDPOINTS.TEMPLATES.LIST,
            { params }
        );
        return response.data.data.templates;
    },

    getTemplateById: async (id: string): Promise<DatabaseTemplate> => {
        const response = await apiClient.get<ApiResponse<DatabaseTemplate>>(
            API_ENDPOINTS.TEMPLATES.BY_ID(id)
        );
        return response.data.data;
    },

    createDatabaseFromTemplate: async (
        templateId: string, 
        data: CreateFromTemplateRequest
    ): Promise<Database> => {
        const response = await apiClient.post<ApiResponse<Database>>(
            API_ENDPOINTS.TEMPLATES.CREATE_FROM(templateId),
            data
        );
        return response.data.data;
    },

    getTemplateCategories: async (): Promise<string[]> => {
        const templates = await templateApi.getTemplates();
        const categories = [...new Set(templates.map(t => t.category))];
        return categories.sort();
    },

    getPopularTemplates: async (limit = 6): Promise<DatabaseTemplate[]> => {
        return templateApi.getTemplates({ popular: true, limit });
    },

    searchTemplates: async (query: string): Promise<DatabaseTemplate[]> => {
        return templateApi.getTemplates({ search: query });
    },
};
