import { apiClient } from '@/services/api-client';
import type { ApiResponse } from '@/types/api.types';

// Types
export interface ProjectView {
    id: string;
    name: string;
    type: 'TABLE' | 'BOARD' | 'GALLERY' | 'CALENDAR';
    isDefault: boolean;
    isSystemView: boolean;
    filters: any[];
    sorts: any[];
    visibleProperties: string[];
    groupBy?: string;
    config: Record<string, any>;
}

export interface ProjectProperty {
    id: string;
    name: string;
    type: string;
    required: boolean;
    description: string;
    options: Record<string, any>;
}

export interface ProjectDatabase {
    id: string;
    name: string;
    description: string;
    icon: string;
    properties: ProjectProperty[];
    views: ProjectView[];
    metadata: {
        displayName: string;
        displayNamePlural: string;
        description: string;
        icon: string;
    };
}

export interface ProjectRecord {
    id: string;
    properties: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}

// API Service
class ProjectDocumentViewService {
    private readonly baseUrl = '/document-views/projects';

    // Views
    async getViews(): Promise<ProjectView[]> {
        const response = await apiClient.get<ApiResponse<ProjectView[]>>(`${this.baseUrl}/views`);
        return response.data.data;
    }

    async getView(viewId: string): Promise<ProjectView> {
        const response = await apiClient.get<ApiResponse<ProjectView>>(`${this.baseUrl}/views/${viewId}`);
        return response.data.data;
    }

    async createView(viewData: Partial<ProjectView>): Promise<ProjectView> {
        const response = await apiClient.post<ApiResponse<ProjectView>>(`${this.baseUrl}/views`, viewData);
        return response.data.data;
    }

    async updateView(viewId: string, updates: Partial<ProjectView>): Promise<ProjectView> {
        const response = await apiClient.put<ApiResponse<ProjectView>>(`${this.baseUrl}/views/${viewId}`, updates);
        return response.data.data;
    }

    async deleteView(viewId: string): Promise<void> {
        await apiClient.delete(`${this.baseUrl}/views/${viewId}`);
    }

    // Database and Properties
    async getDatabase(): Promise<ProjectDatabase> {
        const response = await apiClient.get<ApiResponse<ProjectDatabase>>(`${this.baseUrl}/database`);
        return response.data.data;
    }

    async getProperties(): Promise<ProjectProperty[]> {
        const response = await apiClient.get<ApiResponse<ProjectProperty[]>>(`${this.baseUrl}/properties`);
        return response.data.data;
    }

    async createProperty(propertyData: Partial<ProjectProperty>): Promise<ProjectProperty> {
        const response = await apiClient.post<ApiResponse<ProjectProperty>>(`${this.baseUrl}/properties`, propertyData);
        return response.data.data;
    }

    async updateProperty(propertyId: string, updates: Partial<ProjectProperty>): Promise<ProjectProperty> {
        const response = await apiClient.put<ApiResponse<ProjectProperty>>(`${this.baseUrl}/properties/${propertyId}`, updates);
        return response.data.data;
    }

    async deleteProperty(propertyId: string): Promise<void> {
        await apiClient.delete(`${this.baseUrl}/properties/${propertyId}`);
    }

    // Records
    async getRecords(filters?: Record<string, any>): Promise<{ records: ProjectRecord[]; pagination: any }> {
        const params = filters ? { params: filters } : {};
        const response = await apiClient.get<ApiResponse<{ records: ProjectRecord[]; pagination: any }>>(`${this.baseUrl}/records`, params);
        return response.data.data;
    }

    async getRecord(recordId: string): Promise<ProjectRecord> {
        const response = await apiClient.get<ApiResponse<ProjectRecord>>(`${this.baseUrl}/records/${recordId}`);
        return response.data.data;
    }

    async createRecord(recordData: Partial<ProjectRecord>): Promise<ProjectRecord> {
        const response = await apiClient.post<ApiResponse<ProjectRecord>>(`${this.baseUrl}/records`, recordData);
        return response.data.data;
    }

    async updateRecord(recordId: string, updates: Partial<ProjectRecord>): Promise<ProjectRecord> {
        const response = await apiClient.put<ApiResponse<ProjectRecord>>(`${this.baseUrl}/records/${recordId}`, updates);
        return response.data.data;
    }

    async deleteRecord(recordId: string): Promise<void> {
        await apiClient.delete(`${this.baseUrl}/records/${recordId}`);
    }

    // Bulk operations
    async bulkUpdateRecords(recordIds: string[], updates: Record<string, any>): Promise<any[]> {
        const response = await apiClient.patch<ApiResponse<any[]>>(`${this.baseUrl}/records/bulk`, {
            recordIds,
            updates
        });
        return response.data.data;
    }

    async bulkDeleteRecords(recordIds: string[]): Promise<void> {
        await apiClient.delete(`${this.baseUrl}/records/bulk`, {
            data: { recordIds }
        });
    }

    // View-specific records
    async getRecordsByView(viewId: string, filters?: Record<string, any>): Promise<{ records: ProjectRecord[]; pagination: any }> {
        const params = filters ? { params: filters } : {};
        const response = await apiClient.get<ApiResponse<{ records: ProjectRecord[]; pagination: any }>>(`${this.baseUrl}/views/${viewId}/records`, params);
        return response.data.data;
    }

    // Configuration
    async getConfig(): Promise<any> {
        const response = await apiClient.get<ApiResponse<any>>(`${this.baseUrl}/config`);
        return response.data.data;
    }

    async getFrozenConfig(): Promise<any> {
        const response = await apiClient.get<ApiResponse<any>>(`${this.baseUrl}/frozen-config`);
        return response.data.data;
    }

    // Helper method for getting projects with filters and sorts applied
    async getProjectWithFiltersAndSorts(params: {
        viewId?: string;
        filters?: Record<string, any>;
        sorts?: Array<{ propertyId: string; direction: 'asc' | 'desc' }>;
        limit?: number;
        offset?: number;
    }): Promise<{ records: ProjectRecord[]; pagination: any }> {
        if (params.viewId) {
            return this.getRecordsByView(params.viewId, {
                filters: params.filters,
                sorts: params.sorts,
                limit: params.limit,
                offset: params.offset
            });
        } else {
            return this.getRecords({
                filters: params.filters,
                sorts: params.sorts,
                limit: params.limit,
                offset: params.offset
            });
        }
    }
}

export const projectsDocumentViewService = new ProjectDocumentViewService();