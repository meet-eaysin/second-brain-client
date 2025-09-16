import { DocumentView } from '@/types/document';
import { apiClient } from './api-client';
import { DocumentRecord } from '@/modules/document-view';

export interface CreateViewRequest {
    name: string;
    type: 'TABLE' | 'KANBAN' | 'CALENDAR' | 'GALLERY' | 'TIMELINE' | 'LIST';
    description?: string;
    isDefault?: boolean;
    isPublic?: boolean;
    config?: any;
    properties?: Array<{
        propertyId: string;
        order: number;
        width?: number;
        visible?: boolean;
        frozen?: boolean;
        displayConfig?: any;
    }>;
    filters?: Array<{
        propertyId: string;
        operator: string;
        value: any;
        logic?: 'AND' | 'OR';
        order?: number;
    }>;
    sorts?: Array<{
        propertyId: string;
        direction: 'ASC' | 'DESC';
        order: number;
    }>;
}

export interface UpdateViewRequest extends Partial<CreateViewRequest> {
    id: string;
}

export interface MoveCardRequest {
    cardId: string;
    sourceColumnId: string;
    targetColumnId: string;
    newOrder: number;
    updateRecord?: boolean;
}

export interface KanbanData {
    view: DocumentView;
    columns: Array<{
        id: string;
        title: string;
        order: number;
        color?: string;
        limit?: number;
        cards: Array<{
            id: string;
            order: number;
            record: DocumentRecord;
        }>;
    }>;
}

class DocumentViewService {
    async createView(documentId: string, data: CreateViewRequest): Promise<DocumentView> {
        const response = await apiClient.post(`/api/document-views/databases/${documentId}/views`, data);
        return response.data;
    }

    async getViewsByDocument(documentId: string): Promise<DocumentView[]> {
        const response = await apiClient.get(`/api/document-views/databases/${documentId}/views`);
        return response.data;
    }

    async getView(viewId: string): Promise<DocumentView> {
        const response = await apiClient.get(`/api/document-views/${viewId}`);
        return response.data;
    }

    async updateView(data: UpdateViewRequest): Promise<DocumentView> {
        const { id, ...updateData } = data;
        const response = await apiClient.put(`/api/document-views/${id}`, updateData);
        return response.data;
    }

    async deleteView(viewId: string): Promise<void> {
        await apiClient.delete(`/api/document-views/${viewId}`);
    }

    async duplicateView(viewId: string, name?: string): Promise<DocumentView> {
        const response = await apiClient.post(`/api/document-views/${viewId}/duplicate`, { name });
        return response.data;
    }

    // Property Configuration
    async updateViewProperties(
        viewId: string,
        properties: Array<{
            propertyId: string;
            order: number;
            width?: number;
            visible?: boolean;
            frozen?: boolean;
            displayConfig?: any;
        }>
    ): Promise<DocumentView> {
        const response = await apiClient.put(`/api/document-views/${viewId}/properties`, properties);
        return response.data;
    }

    // Filter Management
    async updateViewFilters(
        viewId: string,
        filters: Array<{
            propertyId: string;
            operator: string;
            value: any;
            logic?: 'AND' | 'OR';
            order?: number;
        }>
    ): Promise<DocumentView> {
        const response = await apiClient.put(`/api/document-views/${viewId}/filters`, filters);
        return response.data;
    }

    // Sort Management
    async updateViewSorts(
        viewId: string,
        sorts: Array<{
            propertyId: string;
            direction: 'ASC' | 'DESC';
            order: number;
        }>
    ): Promise<DocumentView> {
        const response = await apiClient.put(`/api/document-views/${viewId}/sorts`, sorts);
        return response.data;
    }

    // View Configuration
    async updateViewConfig(viewId: string, config: any): Promise<DocumentView> {
        const response = await apiClient.put(`/api/document-views/${viewId}/config`, config);
        return response.data;
    }

    // Kanban-specific methods
    async getKanbanData(viewId: string): Promise<KanbanData> {
        const response = await apiClient.get(`/api/kanban/${viewId}`);
        return response.data;
    }

    async moveKanbanCard(data: MoveCardRequest): Promise<void> {
        await apiClient.post('/api/kanban/move-card', data);
    }

    async createKanbanColumn(
        viewId: string,
        data: {
            title: string;
            description?: string;
            color?: string;
            limit?: number;
            filterValue?: any;
        }
    ): Promise<any> {
        const response = await apiClient.post(`/api/kanban/${viewId}/columns`, data);
        return response.data;
    }

    async updateKanbanColumn(
        columnId: string,
        data: {
            title?: string;
            description?: string;
            color?: string;
            limit?: number;
            order?: number;
        }
    ): Promise<any> {
        const response = await apiClient.put(`/api/kanban/columns/${columnId}`, data);
        return response.data;
    }

    async deleteKanbanColumn(columnId: string): Promise<void> {
        await apiClient.delete(`/api/kanban/columns/${columnId}`);
    }

    async reorderKanbanColumns(
        viewId: string,
        columnOrders: Array<{ id: string; order: number }>
    ): Promise<void> {
        await apiClient.put(`/api/kanban/${viewId}/reorder-columns`, { columnOrders });
    }

    // Utility methods for view management
    async saveViewState(viewId: string, state: {
        filters?: any[];
        sorts?: any[];
        properties?: any[];
        config?: any;
    }): Promise<void> {
        // Save the current view state (filters, sorts, column widths, etc.)
        const updates: any = {};
        
        if (state.filters !== undefined) {
            updates.filters = state.filters;
        }
        
        if (state.sorts !== undefined) {
            updates.sorts = state.sorts;
        }
        
        if (state.properties !== undefined) {
            updates.properties = state.properties;
        }
        
        if (state.config !== undefined) {
            updates.config = state.config;
        }

        await this.updateView({ id: viewId, ...updates });
    }

    async resetViewToDefault(viewId: string): Promise<DocumentView> {
        // Reset view to its default state
        const view = await this.getView(viewId);
        
        // Create a new view with default settings based on the database properties
        const resetData: UpdateViewRequest = {
            id: viewId,
            filters: [],
            sorts: [],
            config: {
                ...view.config,
                // Reset to default config values
                rowHeight: 'medium',
                pageSize: 50,
                showFilters: true,
                showSearch: true,
                showToolbar: true,
            },
        };

        return this.updateView(resetData);
    }

    // Template and preset management
    async createViewFromTemplate(
        databaseId: string,
        templateId: string,
        name: string
    ): Promise<DocumentView> {
        const response = await apiClient.post(`/api/document-views/databases/${databaseId}/views/from-template`, {
            templateId,
            name,
        });
        return response.data;
    }

    async saveViewAsTemplate(
        viewId: string,
        templateName: string,
        description?: string
    ): Promise<any> {
        const response = await apiClient.post(`/api/document-views/${viewId}/save-as-template`, {
            name: templateName,
            description,
        });
        return response.data;
    }

    // Bulk operations
    async bulkUpdateRecords(
        viewId: string,
        recordIds: string[],
        updates: Record<string, any>
    ): Promise<void> {
        await apiClient.post(`/api/document-views/${viewId}/bulk-update`, {
            recordIds,
            updates,
        });
    }

    async exportView(
        viewId: string,
        format: 'csv' | 'json' | 'xlsx' = 'csv'
    ): Promise<Blob> {
        const response = await apiClient.get(`/api/document-views/${viewId}/export`, {
            params: { format },
            responseType: 'blob',
        });
        return response.data;
    }
}

export const documentViewService = new DocumentViewService();
