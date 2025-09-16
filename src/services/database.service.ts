import { api } from '@/lib/api';
import type { DocumentView } from '@/modules/document-view';
import { DocumentRecord } from '@/types/document';

// Database interface
export interface Database {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    workspaceId: string;
    createdBy: string;
    isPublic: boolean;
    permissions: string[];
    properties: any[];
    views: DocumentView[];
    recordCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateDatabaseRequest {
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    categoryId?: string;
    isPublic?: boolean;
    template?: string;
}

export interface UpdateDatabaseRequest {
    name?: string;
    description?: string;
    icon?: string;
    color?: string;
    categoryId?: string;
    isPublic?: boolean;
}

export interface CreateRecordRequest {
    properties: Record<string, any>;
}

export interface UpdateRecordRequest {
    properties: Record<string, any>;
}

export interface DatabaseQuery {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    isPublic?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface RecordQuery {
    page?: number;
    limit?: number;
    search?: string;
    filters?: Array<{
        propertyId: string;
        operator: string;
        value: any;
    }>;
    sorts?: Array<{
        propertyId: string;
        direction: 'asc' | 'desc';
    }>;
    viewId?: string;
}

class DatabaseService {
    // Database CRUD operations
    async createDatabase(data: CreateDatabaseRequest): Promise<Database> {
        const response = await api.post('/databases', data);
        return response.data.data;
    }

    async getDatabases(query: DatabaseQuery = {}): Promise<{
        databases: Database[];
        total: number;
        page: number;
        totalPages: number;
    }> {
        const response = await api.get('/databases', { params: query });
        return response.data.data;
    }

    async getDatabase(databaseId: string): Promise<Database> {
        const response = await api.get(`/databases/${databaseId}`);
        return response.data.data;
    }

    async updateDatabase(databaseId: string, data: UpdateDatabaseRequest): Promise<Database> {
        const response = await api.put(`/databases/${databaseId}`, data);
        return response.data.data;
    }

    async deleteDatabase(databaseId: string): Promise<void> {
        await api.delete(`/databases/${databaseId}`);
    }

    async duplicateDatabase(databaseId: string, name?: string): Promise<Database> {
        const response = await api.post(`/databases/${databaseId}/duplicate`, { name });
        return response.data.data;
    }

    // Record operations
    async createRecord(databaseId: string, data: CreateRecordRequest): Promise<DocumentRecord> {
        const response = await api.post(`/databases/${databaseId}/records`, data);
        return response.data.data;
    }

    async getRecords(databaseId: string, query: RecordQuery = {}): Promise<{
        records: DocumentRecord[];
        total: number;
        page: number;
        totalPages: number;
    }> {
        const response = await api.get(`/databases/${databaseId}/records`, { params: query });
        return response.data.data;
    }

    async getRecord(databaseId: string, recordId: string): Promise<DocumentRecord> {
        const response = await api.get(`/databases/${databaseId}/records/${recordId}`);
        return response.data.data;
    }

    async updateRecord(
        databaseId: string,
        recordId: string,
        data: UpdateRecordRequest
    ): Promise<DocumentRecord> {
        const response = await api.put(`/databases/${databaseId}/records/${recordId}`, data);
        return response.data.data;
    }

    async deleteRecord(databaseId: string, recordId: string): Promise<void> {
        await api.delete(`/databases/${databaseId}/records/${recordId}`);
    }

    async duplicateRecord(databaseId: string, recordId: string): Promise<DocumentRecord> {
        const response = await api.post(`/databases/${databaseId}/records/${recordId}/duplicate`);
        return response.data.data;
    }

    // View operations
    async createView(databaseId: string, data: {
        name: string;
        type: string;
        config?: any;
    }): Promise<DocumentView> {
        const response = await api.post(`/databases/${databaseId}/views`, data);
        return response.data.data;
    }

    async getViews(databaseId: string): Promise<DocumentView[]> {
        const response = await api.get(`/databases/${databaseId}/views`);
        return response.data.data;
    }

    async getView(databaseId: string, viewId: string): Promise<DocumentView> {
        const response = await api.get(`/databases/${databaseId}/views/${viewId}`);
        return response.data.data;
    }

    async updateView(databaseId: string, viewId: string, data: any): Promise<DocumentView> {
        const response = await api.patch(`/databases/${databaseId}/views/${viewId}`, data);
        return response.data.data;
    }

    async deleteView(databaseId: string, viewId: string): Promise<void> {
        await api.delete(`/databases/${databaseId}/views/${viewId}`);
    }

    async duplicateView(databaseId: string, viewId: string, name?: string): Promise<DocumentView> {
        const response = await api.post(`/databases/${databaseId}/views/${viewId}/duplicate`, { name });
        return response.data.data;
    }

    // Sharing and permissions
    async shareDatabase(databaseId: string, data: {
        email: string;
        permission: 'view' | 'edit' | 'admin';
    }): Promise<void> {
        await api.post(`/databases/${databaseId}/share`, data);
    }

    async updateDatabasePermission(
        databaseId: string,
        userId: string,
        permission: 'view' | 'edit' | 'admin'
    ): Promise<void> {
        await api.patch(`/databases/${databaseId}/share/${userId}`, { permission });
    }

    async removeDatabaseAccess(databaseId: string, userId: string): Promise<void> {
        await api.delete(`/databases/${databaseId}/share/${userId}`);
    }

    async getDatabasePermissions(databaseId: string): Promise<Array<{
        userId: string;
        email: string;
        name: string;
        permission: string;
        addedAt: string;
    }>> {
        const response = await api.get(`/databases/${databaseId}/permissions`);
        return response.data.data;
    }

    // Database freeze/unfreeze
    async freezeDatabase(databaseId: string, frozen: boolean): Promise<Database> {
        const response = await api.patch(`/databases/${databaseId}/freeze`, { frozen });
        return response.data.data;
    }

    // Bulk operations
    async bulkCreateRecords(
        databaseId: string,
        records: CreateRecordRequest[]
    ): Promise<DocumentRecord[]> {
        const response = await api.post(`/databases/${databaseId}/records/bulk`, { records });
        return response.data.data;
    }

    async bulkUpdateRecords(
        databaseId: string,
        updates: Array<{
            recordId: string;
            properties: Record<string, any>;
        }>
    ): Promise<DocumentRecord[]> {
        const response = await api.put(`/databases/${databaseId}/records/bulk`, { updates });
        return response.data.data;
    }

    async bulkDeleteRecords(databaseId: string, recordIds: string[]): Promise<void> {
        await api.delete(`/databases/${databaseId}/records/bulk`, { data: { recordIds } });
    }

    // Export/Import
    async exportDatabase(databaseId: string, format: 'csv' | 'json' | 'xlsx' = 'csv'): Promise<Blob> {
        const response = await api.get(`/databases/${databaseId}/export`, {
            params: { format },
            responseType: 'blob',
        });
        return response.data;
    }

    async importRecords(
        databaseId: string,
        file: File,
        options: {
            skipFirstRow?: boolean;
            mapping?: Record<string, string>;
        } = {}
    ): Promise<{
        imported: number;
        errors: string[];
    }> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('options', JSON.stringify(options));

        const response = await api.post(`/databases/${databaseId}/import`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    }

    // Statistics and analytics
    async getDatabaseStats(databaseId: string): Promise<{
        totalRecords: number;
        totalProperties: number;
        totalViews: number;
        recentActivity: Array<{
            type: string;
            description: string;
            timestamp: string;
            userId: string;
        }>;
        propertyUsage: Array<{
            propertyId: string;
            name: string;
            type: string;
            filledCount: number;
            emptyCount: number;
        }>;
    }> {
        const response = await api.get(`/databases/${databaseId}/stats`);
        return response.data.data;
    }

    // Search and filtering
    async searchRecords(
        databaseId: string,
        query: string,
        options: {
            limit?: number;
            properties?: string[];
        } = {}
    ): Promise<DocumentRecord[]> {
        const response = await api.get(`/databases/${databaseId}/search`, {
            params: { q: query, ...options },
        });
        return response.data.data;
    }

    // Templates
    async getDatabaseTemplates(): Promise<Array<{
        id: string;
        name: string;
        description: string;
        category: string;
        preview: string;
        properties: any[];
    }>> {
        const response = await api.get('/databases/templates');
        return response.data.data;
    }

    async createDatabaseFromTemplate(templateId: string, name: string): Promise<Database> {
        const response = await api.post('/databases/from-template', { templateId, name });
        return response.data.data;
    }

    // Utility methods
    formatDatabaseSize(recordCount: number): string {
        if (recordCount < 1000) return `${recordCount} records`;
        if (recordCount < 1000000) return `${(recordCount / 1000).toFixed(1)}K records`;
        return `${(recordCount / 1000000).toFixed(1)}M records`;
    }

    validateDatabaseName(name: string): { valid: boolean; error?: string } {
        if (!name || name.trim().length === 0) {
            return { valid: false, error: 'Database name is required' };
        }
        if (name.length > 100) {
            return { valid: false, error: 'Database name must be less than 100 characters' };
        }
        return { valid: true };
    }

    generateDatabaseColor(): string {
        const colors = [
            '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
            '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}

export const databaseService = new DatabaseService();
