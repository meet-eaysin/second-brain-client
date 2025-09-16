/**
 * Books Document View Service
 *
 * Service for managing books document views, properties, and records.
 * This service provides a specialized interface for books management while
 * using the document view service underneath.
 */

import { apiClient } from '@/services/api-client';
import { transformPropertyToServer } from '@/modules/document-view/utils/property-transform';
import type {
    BookRecord,
    BookRecordsResponse,
    CreateBookRecordRequest,
    UpdateBookRecordRequest
} from '../types/books.types';
import type {
    DocumentView,
    DocumentProperty
} from '@/types/document';
import type {
    DocumentViewConfigApiResponse,
    ViewsApiResponse,
    PropertiesApiResponse,
    ViewApiData,
    PropertyApiData
} from '../types/books-api.types';

const BOOKS_DOCUMENT_VIEW_BASE_URL = '/second-brain/books/document-view';

export class BooksDocumentViewService {
    // Configuration
    static async getConfig(): Promise<DocumentViewConfigApiResponse['data']> {
        const response = await apiClient.get<DocumentViewConfigApiResponse>(`${BOOKS_DOCUMENT_VIEW_BASE_URL}/config`);
        return response.data.data; // Server returns { success, message, data, timestamp }
    }

    static async getFrozenConfig(): Promise<unknown> {
        const response = await apiClient.get(`${BOOKS_DOCUMENT_VIEW_BASE_URL}/config/frozen`);
        return response.data.data;
    }

    // Views Management
    static async getViews(): Promise<ViewApiData[]> {
        const response = await apiClient.get<ViewsApiResponse>(`${BOOKS_DOCUMENT_VIEW_BASE_URL}/views`);
        return response.data.data;
    }

    static async getDefaultView(): Promise<ViewApiData | undefined> {
        // Note: Server doesn't have /views/default endpoint, so we'll get the default from views list
        const views = await this.getViews();
        return views.find((view) => view.isDefault) || views[0];
    }

    static async getView(viewId: string): Promise<DocumentView> {
        const response = await apiClient.get<DocumentView>(`${BOOKS_DOCUMENT_VIEW_BASE_URL}/views/${viewId}`);
        return response.data;
    }

    static async createView(data: Partial<DocumentView>): Promise<DocumentView> {
        const response = await apiClient.post<DocumentView>(`${BOOKS_DOCUMENT_VIEW_BASE_URL}/views`, data);
        return response.data;
    }

    static async updateView(viewId: string, data: Partial<DocumentView>): Promise<DocumentView> {
        const response = await apiClient.put<DocumentView>(`${BOOKS_DOCUMENT_VIEW_BASE_URL}/views/${viewId}`, data);
        return response.data;
    }

    static async deleteView(viewId: string): Promise<{ message: string }> {
        const response = await apiClient.delete<{ message: string }>(`${BOOKS_DOCUMENT_VIEW_BASE_URL}/views/${viewId}`);
        return response.data;
    }

    static async duplicateView(viewId: string, data: { name: string }): Promise<DocumentView> {
        const response = await apiClient.post<DocumentView>(`${BOOKS_DOCUMENT_VIEW_BASE_URL}/views/${viewId}/duplicate`, data);
        return response.data;
    }

    // Properties Management
    static async getProperties(): Promise<PropertyApiData[]> {
        const response = await apiClient.get<PropertiesApiResponse>(`${BOOKS_DOCUMENT_VIEW_BASE_URL}/properties`);
        return response.data.data;
    }

    static async addProperty(data: Partial<DocumentProperty>): Promise<DocumentProperty> {
        // Transform client format to server format before sending
        const serverData = transformPropertyToServer(data);

        // Debug logging to see transformation
        console.log('🔧 Property Transformation Debug:', {
            clientData: data,
            serverData: serverData,
            clientSelectOptions: data?.selectOptions,
            serverOptions: serverData.options
        });

        const response = await apiClient.post<DocumentProperty>(`${BOOKS_DOCUMENT_VIEW_BASE_URL}/properties`, serverData);
        return response.data;
    }

    static async updateProperty(propertyId: string, data: Partial<DocumentProperty>): Promise<DocumentProperty> {
        // Transform client format to server format before sending
        const serverData = transformPropertyToServer(data);
        const response = await apiClient.put<DocumentProperty>(`${BOOKS_DOCUMENT_VIEW_BASE_URL}/properties/${propertyId}`, serverData);
        return response.data;
    }

    static async deleteProperty(propertyId: string): Promise<{ message: string }> {
        const response = await apiClient.delete<{ message: string }>(`${BOOKS_DOCUMENT_VIEW_BASE_URL}/properties/${propertyId}`);
        return response.data;
    }

    // Records Management (Books as Records)
    static async getRecords(options = {}): Promise<BookRecordsResponse> {
        const params = new URLSearchParams();

        if (options.viewId) params.append('viewId', options.viewId);
        if (options.page) params.append('page', options.page.toString());
        if (options.limit) params.append('limit', options.limit.toString());
        if (options.search) params.append('search', options.search);

        if (options.filters) {
            Object.entries(options.filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    if (Array.isArray(value)) {
                        value.forEach(v => params.append(`filters[${key}]`, v.toString()));
                    } else {
                        params.append(`filters[${key}]`, value.toString());
                    }
                }
            });
        }

        if (options.sorts) {
            options.sorts.forEach((sort, index) => {
                params.append(`sorts[${index}][field]`, sort.field);
                params.append(`sorts[${index}][direction]`, sort.direction);
            });
        }

        const queryString = params.toString();
        const url = queryString ? `${BOOKS_DOCUMENT_VIEW_BASE_URL}/records?${queryString}` : `${BOOKS_DOCUMENT_VIEW_BASE_URL}/records`;

        const response = await apiClient.get<BookRecordsResponse>(url);
        return response.data;
    }

    static async getRecord(recordId: string): Promise<BookRecord> {
        const response = await apiClient.get<BookRecord>(`${BOOKS_DOCUMENT_VIEW_BASE_URL}/records/${recordId}`);
        return response.data;
    }

    static async createRecord(data: CreateBookRecordRequest): Promise<BookRecord> {
        const response = await apiClient.post<BookRecord>(`${BOOKS_DOCUMENT_VIEW_BASE_URL}/records`, data);
        return response.data;
    }

    static async updateRecord(recordId: string, data: UpdateBookRecordRequest): Promise<BookRecord> {
        const response = await apiClient.put<BookRecord>(`${BOOKS_DOCUMENT_VIEW_BASE_URL}/records/${recordId}`, data);
        return response.data;
    }

    static async deleteRecord(recordId: string): Promise<{ message: string }> {
        const response = await apiClient.delete<{ message: string }>(`${BOOKS_DOCUMENT_VIEW_BASE_URL}/records/${recordId}`);
        return response.data;
    }

    // Bulk Operations
    static async bulkUpdateRecords(recordIds: string[], updates: UpdateBookRecordRequest): Promise<{ modifiedCount: number }> {
        const response = await apiClient.patch<{ modifiedCount: number }>(`${BOOKS_DOCUMENT_VIEW_BASE_URL}/records/bulk`, {
            recordIds,
            updates
        });
        return response.data;
    }

    static async bulkDeleteRecords(recordIds: string[]): Promise<{ deletedCount: number }> {
        const response = await apiClient.delete<{ deletedCount: number }>(`${BOOKS_DOCUMENT_VIEW_BASE_URL}/records/bulk`, {
            data: { recordIds }
        });
        return response.data;
    }
}

export default BooksDocumentViewService;
