/**
 * Document View Configuration Service
 *
 * This service provides a unified interface for fetching document view configurations
 * from the centralized document-view API for any module type. It replaces hardcoded
 * configurations and makes the document-view system fully dynamic.
 *
 * Updated to work with the new centralized document-view backend.
 */

import { apiClient } from '@/services/api-client';
import type { ApiResponse } from '@/types/api.types';
import type { DocumentView } from '@/modules/document-view';

export interfaceModuleConfig {
    moduleType: string;
    documentType: string;
    requiredProperties: string[];
    frozenConfig: {
        viewType: string;
        moduleType: string;
        description: string;
        frozenProperties: Array<{
            propertyId: string;
            reason?: string;
            allowEdit?: boolean;
            allowHide?: boolean;
            allowDelete?: boolean;
        }>;
    };
    defaultProperties: Array<{
        id: string;
        name: string;
        type: string;
        required?: boolean;
        defaultValue?: unknown;
        options?: Array<{ name: string; color?: string; value?: unknown }>;
    }>;
    defaultViews: Array<{
        id: string;
        name: string;
        type: string;
        isDefault?: boolean;
        config?: Record<string, unknown>;
    }>;
    supportedPropertyTypes: string[];
    supportedViewTypes: string[];
    permissions: {
        canCreate: boolean;
        canEdit: boolean;
        canDelete: boolean;
        canShare: boolean;
        canExport: boolean;
        canImport: boolean;
    };
}

export interface DocumentViewService {
    // Configuration
    getModuleConfig(): Promise<ModuleConfig>;
    
    // Views
    getUserViews(): Promise<DocumentView[]>;
    getView(viewId: string): Promise<DocumentView>;
    getDefaultView(): Promise<DocumentView>;
    createView(viewData: any): Promise<DocumentView>;
    updateView(viewId: string, updates: any): Promise<DocumentView>;
    deleteView(viewId: string): Promise<void>;
    duplicateView(viewId: string, newName?: string): Promise<DocumentView>;
    
    // View Properties
    updateViewProperties(viewId: string, properties: any[]): Promise<DocumentView>;
    addProperty(viewId: string, property: any): Promise<DocumentView>;
    removeProperty(viewId: string, propertyId: string): Promise<DocumentView>;
    togglePropertyFreeze(viewId: string, propertyId: string): Promise<DocumentView>;
    reorderProperties(viewId: string, propertyIds: string[]): Promise<DocumentView>;
    
    // View Filters & Sorts
    updateViewFilters(viewId: string, filters: any[]): Promise<DocumentView>;
    updateViewSorts(viewId: string, sorts: any[]): Promise<DocumentView>;
    
    // Records
    getRecords(filters?: any, sorts?: any, pagination?: any): Promise<any>;
    getRecord(recordId: string): Promise<any>;
    createRecord(recordData: any): Promise<any>;
    updateRecord(recordId: string, updates: any): Promise<any>;
    deleteRecord(recordId: string): Promise<void>;
}

/**
 * Document View Service Implementation
 */
class DocumentViewServiceImpl implements DocumentViewService {
    private readonly baseUrl: string;
    private readonly moduleType: string;

    constructor(moduleType: string) {
        this.moduleType = moduleType;
        // Use the new centralized document-view API
        this.baseUrl = `/document-views/${moduleType}`;
    }

    // Configuration
    async getModuleConfig(): Promise<ModuleConfig> {
        const response = await apiClient.get<ApiResponse<ModuleConfig>>(`${this.baseUrl}/config`);
        return response.data.data;
    }

    // Views
    async getUserViews(): Promise<DocumentView[]> {
        const response = await apiClient.get<ApiResponse<DocumentView[]>>(`${this.baseUrl}/views`);
        return response.data.data;
    }

    async getView(viewId: string): Promise<DocumentView> {
        const response = await apiClient.get<ApiResponse<DocumentView>>(`${this.baseUrl}/views/${viewId}`);
        return response.data.data;
    }

    async getDefaultView(): Promise<DocumentView> {
        const response = await apiClient.get<ApiResponse<DocumentView>>(`${this.baseUrl}/views/default`);
        return response.data.data;
    }

    async createView(viewData: any): Promise<DocumentView> {
        const response = await apiClient.post<ApiResponse<DocumentView>>(`${this.baseUrl}/views`, viewData);
        return response.data.data;
    }

    async updateView(viewId: string, updates: any): Promise<DocumentView> {
        const response = await apiClient.patch<ApiResponse<DocumentView>>(`${this.baseUrl}/views/${viewId}`, updates);
        return response.data.data;
    }

    async deleteView(viewId: string): Promise<void> {
        await apiClient.delete(`${this.baseUrl}/views/${viewId}`);
    }

    async duplicateView(viewId: string, newName?: string): Promise<DocumentView> {
        const response = await apiClient.post<ApiResponse<DocumentView>>(
            `${this.baseUrl}/views/${viewId}/duplicate`,
            { name: newName }
        );
        return response.data.data;
    }

    // View Properties
    async updateViewProperties(viewId: string, properties: any[]): Promise<DocumentView> {
        const response = await apiClient.patch<ApiResponse<DocumentView>>(
            `${this.baseUrl}/views/${viewId}/properties`,
            { properties }
        );
        return response.data.data;
    }

    async addProperty(viewId: string, property: any): Promise<DocumentView> {
        const response = await apiClient.post<ApiResponse<DocumentView>>(
            `${this.baseUrl}/views/${viewId}/properties`,
            property
        );
        return response.data.data;
    }

    async removeProperty(viewId: string, propertyId: string): Promise<DocumentView> {
        const response = await apiClient.delete<ApiResponse<DocumentView>>(
            `${this.baseUrl}/views/${viewId}/properties/${propertyId}`
        );
        return response.data.data;
    }

    async togglePropertyFreeze(viewId: string, propertyId: string): Promise<DocumentView> {
        const response = await apiClient.patch<ApiResponse<DocumentView>>(
            `${this.baseUrl}/views/${viewId}/properties/${propertyId}/freeze`
        );
        return response.data.data;
    }

    async reorderProperties(viewId: string, propertyIds: string[]): Promise<DocumentView> {
        const response = await apiClient.patch<ApiResponse<DocumentView>>(
            `${this.baseUrl}/views/${viewId}/properties/reorder`,
            { propertyIds }
        );
        return response.data.data;
    }

    // View Filters & Sorts
    async updateViewFilters(viewId: string, filters: any[]): Promise<DocumentView> {
        const response = await apiClient.patch<ApiResponse<DocumentView>>(
            `${this.baseUrl}/views/${viewId}/filters`,
            { filters }
        );
        return response.data.data;
    }

    async updateViewSorts(viewId: string, sorts: any[]): Promise<DocumentView> {
        const response = await apiClient.patch<ApiResponse<DocumentView>>(
            `${this.baseUrl}/views/${viewId}/sorts`,
            { sorts }
        );
        return response.data.data;
    }

    // Records
    async getRecords(filters?: any, sorts?: any, pagination?: any): Promise<any> {
        const params = new URLSearchParams();
        
        if (filters) params.append('filters', JSON.stringify(filters));
        if (sorts) params.append('sorts', JSON.stringify(sorts));
        if (pagination) {
            if (pagination.page) params.append('page', pagination.page.toString());
            if (pagination.limit) params.append('limit', pagination.limit.toString());
        }

        const response = await apiClient.get<ApiResponse<any>>(
            `${this.baseUrl}/records?${params.toString()}`
        );
        return response.data.data;
    }

    async getRecord(recordId: string): Promise<any> {
        const response = await apiClient.get<ApiResponse<any>>(`${this.baseUrl}/records/${recordId}`);
        return response.data.data;
    }

    async createRecord(recordData: any): Promise<any> {
        const response = await apiClient.post<ApiResponse<any>>(`${this.baseUrl}/records`, recordData);
        return response.data.data;
    }

    async updateRecord(recordId: string, updates: any): Promise<any> {
        const response = await apiClient.patch<ApiResponse<any>>(`${this.baseUrl}/records/${recordId}`, updates);
        return response.data.data;
    }

    async deleteRecord(recordId: string): Promise<void> {
        await apiClient.delete(`${this.baseUrl}/records/${recordId}`);
    }
}

/**
 * Factory function to create a document view service for any module
 */
export function createDocumentViewService(moduleType: string): DocumentViewService {
    return DocumentViewServiceImpl(moduleType);
}

/**
 * Pre-configured services for common modules
 */
export const tasksDocumentViewService = createDocumentViewService('tasks');
export const peopleDocumentViewService = createDocumentViewService('people');
export const companiesDocumentViewService = createDocumentViewService('companies');
export const projectsDocumentViewService = createDocumentViewService('projects');
export const databasesDocumentViewService = createDocumentViewService('databases');