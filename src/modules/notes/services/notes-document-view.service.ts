import { apiClient } from '@/services/api-client';
import type { ApiResponse } from '@/types/api.types';

// Types
export interface NotesView {
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

export interface NotesProperty {
    id: string;
    name: string;
    type: string;
    required: boolean;
    description: string;
    options: Record<string, any>;
}

export interface NotesDatabase {
    id: string;
    name: string;
    description: string;
    icon: string;
    properties: NotesProperty[];
    views: NotesView[];
    metadata: {
        displayName: string;
        displayNamePlural: string;
        description: string;
        icon: string;
    };
}

export interface NotesRecord {
    id: string;
    properties: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}

// API Service
class NotesDocumentViewService {
    private readonly baseUrl = '/document-views/notes';

    // Views
    async getViews(): Promise<NotesView[]> {
        const response = await apiClient.get<ApiResponse<NotesView[]>>(`${this.baseUrl}/views`);
        return response.data.data;
    }

    async getView(viewId: string): Promise<NotesView> {
        const response = await apiClient.get<ApiResponse<NotesView>>(`${this.baseUrl}/views/${viewId}`);
        return response.data.data;
    }

    async createView(viewData: Partial<NotesView>): Promise<NotesView> {
        const response = await apiClient.post<ApiResponse<NotesView>>(`${this.baseUrl}/views`, viewData);
        return response.data.data;
    }

    async updateView(viewId: string, updates: Partial<NotesView>): Promise<NotesView> {
        const response = await apiClient.put<ApiResponse<NotesView>>(`${this.baseUrl}/views/${viewId}`, updates);
        return response.data.data;
    }

    async deleteView(viewId: string): Promise<void> {
        await apiClient.delete(`${this.baseUrl}/views/${viewId}`);
    }

    // Database and Properties
    async getDatabase(): Promise<NotesDatabase> {
        const response = await apiClient.get<ApiResponse<NotesDatabase>>(`${this.baseUrl}/database`);
        return response.data.data;
    }

    async getProperties(): Promise<NotesProperty[]> {
        const response = await apiClient.get<ApiResponse<NotesProperty[]>>(`${this.baseUrl}/properties`);
        return response.data.data;
    }

    async createProperty(propertyData: Partial<NotesProperty>): Promise<NotesProperty> {
        const response = await apiClient.post<ApiResponse<NotesProperty>>(`${this.baseUrl}/properties`, propertyData);
        return response.data.data;
    }

    async updateProperty(propertyId: string, updates: Partial<NotesProperty>): Promise<NotesProperty> {
        const response = await apiClient.put<ApiResponse<NotesProperty>>(`${this.baseUrl}/properties/${propertyId}`, updates);
        return response.data.data;
    }

    async deleteProperty(propertyId: string): Promise<void> {
        await apiClient.delete(`${this.baseUrl}/properties/${propertyId}`);
    }

    // Records
    async getRecords(filters?: Record<string, any>): Promise<{ records: NotesRecord[]; pagination: any }> {
        const params = filters ? { params: filters } : {};
        const response = await apiClient.get<ApiResponse<{ records: NotesRecord[]; pagination: any }>>(`${this.baseUrl}/records`, params);
        return response.data.data;
    }

    async getRecord(recordId: string): Promise<NotesRecord> {
        const response = await apiClient.get<ApiResponse<NotesRecord>>(`${this.baseUrl}/records/${recordId}`);
        return response.data.data;
    }

    async createRecord(recordData: Partial<NotesRecord>): Promise<NotesRecord> {
        const response = await apiClient.post<ApiResponse<NotesRecord>>(`${this.baseUrl}/records`, recordData);
        return response.data.data;
    }

    async updateRecord(recordId: string, updates: Partial<NotesRecord>): Promise<NotesRecord> {
        const response = await apiClient.put<ApiResponse<NotesRecord>>(`${this.baseUrl}/records/${recordId}`, updates);
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
    async getRecordsByView(viewId: string, filters?: Record<string, any>): Promise<{ records: NotesRecord[]; pagination: any }> {
        const params = filters ? { params: filters } : {};
        const response = await apiClient.get<ApiResponse<{ records: NotesRecord[]; pagination: any }>>(`${this.baseUrl}/views/${viewId}/records`, params);
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

    // Helper method for getting notes with filters and sorts applied
    async getNotesWithFiltersAndSorts(params: {
        viewId?: string;
        filters?: Record<string, any>;
        sorts?: Array<{ propertyId: string; direction: 'asc' | 'desc' }>;
        limit?: number;
        offset?: number;
    }): Promise<{ records: NotesRecord[]; pagination: any }> {
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

export const notesDocumentViewService = new NotesDocumentViewService();
