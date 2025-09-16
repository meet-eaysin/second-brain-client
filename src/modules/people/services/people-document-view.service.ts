/**
 * People Document View Service
 * 
 * Service for managing people (CRM) document views, properties, and records.
 * This service provides a specialized interface for people management while
 * using the document view service underneath.
 */

import { apiClient } from '@/services/api-client';
import type { DocumentView } from '@/modules/document-view';
import { normalizePropertiesFromAPI } from '@/modules/document-view/utils/select-option-utils';

// People-specific interfaces
export interface PeopleViewConfig {
    moduleType: 'people';
    documentType: 'PEOPLE';

    // Database metadata
    database: {
        id: string;
        name: string;
        displayName: string;
        displayNamePlural: string;
        description: string;
        icon: string;
        entityKey: string;
        collection: string;
    };

    // Backend-controlled properties (cannot be removed/disabled)
    requiredProperties: string[];
    
    // Detailed frozen property configuration
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
    
    // Default configuration
    defaultProperties: any[];
    defaultViews: any[];
    
    // Supported property types for people
    supportedPropertyTypes: string[];
    
    // Supported view types for people
    supportedViewTypes: string[];
    
    // Permissions
    permissions: {
        canCreate: boolean;
        canEdit: boolean;
        canDelete: boolean;
        canShare: boolean;
        canExport: boolean;
        canImport: boolean;
    };
}

export interface PersonRecord {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    status?: 'lead' | 'prospect' | 'customer' | 'inactive';
    relationship?: 'friend' | 'colleague' | 'client' | 'vendor' | 'other';
    tags?: string[];
    lastContacted?: string;
    nextContactDate?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    [key: string]: any; // Allow additional custom properties
}

export interface PersonProperty {
    id: string;
    name: string;
    type: string;
    order: number;
    width?: number;
    isVisible: boolean;
    frozen: boolean;
    required: boolean;
    options?: Array<{ value: string; label: string; color?: string }>;
}

export interface PersonView extends DocumentView {
    // People-specific view extensions can go here
}

class PeopleDocumentViewService {
    private readonly baseUrl = '/document-views/people';
    private readonly databaseId = 'people-main-db';

    // Get people-specific view configuration from backend
    async getPeopleViewConfig(): Promise<PeopleViewConfig> {
        const response = await apiClient.get(`${this.baseUrl}/config`);
        return response.data.data;
    }

    // Get default people properties from backend
    async getDefaultPeopleProperties(): Promise<any[]> {
        const response = await apiClient.get(`${this.baseUrl}/properties/default`);
        return response.data.data;
    }

    // Get default people views from backend
    async getDefaultPeopleViews(): Promise<any[]> {
        const response = await apiClient.get(`${this.baseUrl}/views/defaults`);
        return response.data.data;
    }

    // Get people frozen configuration from backend
    async getPeopleFrozenConfig(): Promise<any> {
        const response = await apiClient.get(`${this.baseUrl}/config/frozen`);
        return response.data.data;
    }

    // Get user's customized views for people
    async getUserPeopleViews(): Promise<DocumentView[]> {
        const response = await apiClient.get(`${this.baseUrl}/views`);
        const views = response.data.data;

        // Normalize selectOptions in customProperties for all views
        return views.map((view: DocumentView) => {
            if (view.customProperties) {
                view.customProperties = normalizePropertiesFromAPI(view.customProperties);
            }
            return view;
        });
    }

    // Get specific people view
    async getPeopleView(viewId: string): Promise<DocumentView> {
        const response = await apiClient.get(`${this.baseUrl}/views/${viewId}`);
        const view = response.data.data;

        // Normalize selectOptions in customProperties
        if (view.customProperties) {
            view.customProperties = normalizePropertiesFromAPI(view.customProperties);
        }

        return view;
    }

    // Get default people view
    async getDefaultPeopleView(): Promise<DocumentView> {
        const response = await apiClient.get(`${this.baseUrl}/views/default`);
        const view = response.data.data;

        // Normalize selectOptions in customProperties
        if (view.customProperties) {
            view.customProperties = normalizePropertiesFromAPI(view.customProperties);
        }

        return view;
    }

    // Create new people view
    async createPeopleView(viewData: Partial<DocumentView>): Promise<DocumentView> {
        const response = await apiClient.post(`${this.baseUrl}/views`, {
            ...viewData,
            databaseId: this.databaseId
        });
        return response.data.data;
    }

    // Update people view
    async updatePeopleView(viewId: string, updates: Partial<DocumentView>): Promise<DocumentView> {
        const response = await apiClient.patch(`${this.baseUrl}/views/${viewId}`, updates);
        return response.data.data;
    }

    // Delete people view
    async deletePeopleView(viewId: string): Promise<void> {
        await apiClient.delete(`${this.baseUrl}/views/${viewId}`);
    }

    // Duplicate people view
    async duplicatePeopleView(viewId: string, newName?: string): Promise<DocumentView> {
        const response = await apiClient.post(`${this.baseUrl}/views/${viewId}/duplicate`, {
            name: newName
        });
        return response.data.data;
    }

    // Update view properties
    async updatePeopleViewProperties(
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
        const response = await apiClient.patch(`${this.baseUrl}/views/${viewId}/properties`, {
            properties
        });
        return response.data.data;
    }

    // Update view filters
    async updatePeopleViewFilters(viewId: string, filters: any[]): Promise<DocumentView> {
        const response = await apiClient.patch(`${this.baseUrl}/views/${viewId}/filters`, {
            filters
        });
        return response.data.data;
    }

    // Update view sorts
    async updatePeopleViewSorts(viewId: string, sorts: any[]): Promise<DocumentView> {
        const response = await apiClient.patch(`${this.baseUrl}/views/${viewId}/sorts`, {
            sorts
        });
        return response.data.data;
    }

    // People record operations with enhanced filtering and sorting
    async getPeople(filters?: any, sorts?: any, pagination?: any, viewId?: string): Promise<{
        people: PersonRecord[];
        pagination?: any;
        appliedFilters?: any;
        appliedSort?: any;
        viewId?: string | null;
    }> {
        const params = new URLSearchParams();

        // Add filters
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    if (Array.isArray(value)) {
                        value.forEach(v => params.append(key, String(v)));
                    } else {
                        params.append(key, String(value));
                    }
                }
            });
        }

        // Add sorts
        if (sorts) {
            if (Array.isArray(sorts)) {
                params.append('sorts', JSON.stringify(sorts));
            } else if (typeof sorts === 'object') {
                // Convert object to array format
                const sortArray = Object.entries(sorts).map(([propertyId, direction]) => ({
                    propertyId,
                    direction: direction === -1 ? 'desc' : 'asc',
                    order: 0
                }));
                params.append('sorts', JSON.stringify(sortArray));
            }
        }

        // Add pagination
        if (pagination) {
            if (pagination.page) params.append('page', pagination.page.toString());
            if (pagination.limit) params.append('limit', pagination.limit.toString());
        }

        // Add view ID if provided
        if (viewId) {
            params.append('viewId', viewId);
        }

        const response = await apiClient.get(`${this.baseUrl}/records?${params.toString()}`);
        return response.data.data;
    }

    // Enhanced method for getting people with specific filters and sorts
    async getPeopleWithFiltersAndSorts(options: {
        filters?: Record<string, any>;
        sorts?: Array<{ propertyId: string; direction: 'asc' | 'desc'; order?: number }>;
        pagination?: { page?: number; limit?: number };
        viewId?: string;
        search?: string;
        relationship?: string[];
        tags?: string[];
        company?: string;
        needsContact?: boolean;
        status?: string[];
    } = {}): Promise<{
        people: PersonRecord[];
        pagination?: any;
        appliedFilters?: any;
        appliedSort?: any;
        viewId?: string | null;
    }> {
        const { filters = {}, sorts, pagination, viewId, ...directFilters } = options;

        // Merge direct filters with filters object
        const mergedFilters = { ...filters, ...directFilters };

        return this.getPeople(mergedFilters, sorts, pagination, viewId);
    }

    async getPerson(personId: string): Promise<PersonRecord> {
        const response = await apiClient.get(`${this.baseUrl}/records/${personId}`);
        return response.data.data;
    }

    async createPerson(personData: Partial<PersonRecord>): Promise<PersonRecord> {
        const response = await apiClient.post(`${this.baseUrl}/records`, personData);
        return response.data.data;
    }

    async updatePerson(personId: string, updates: Partial<PersonRecord>): Promise<PersonRecord> {
        const response = await apiClient.patch(`${this.baseUrl}/records/${personId}`, updates);
        return response.data.data;
    }

    async deletePerson(personId: string): Promise<void> {
        await apiClient.delete(`${this.baseUrl}/records/${personId}`);
    }

    // Property Management
    async addPeopleProperty(viewId: string, property: {
        name: string;
        type: string;
        description?: string;
        required?: boolean;
        order?: number;
        selectOptions?: Array<{ name: string; color: string }>;
    }): Promise<any> {
        const response = await apiClient.post(`${this.baseUrl}/views/${viewId}/properties`, {
            property
        });
        const view = response.data.data;

        // Normalize selectOptions in customProperties
        if (view.customProperties) {
            view.customProperties = normalizePropertiesFromAPI(view.customProperties);
        }

        return view;
    }

    // Validate property updates against backend rules
    private validatePropertyUpdates(
        properties: Array<{
            propertyId: string;
            order: number;
            width?: number;
            visible?: boolean;
            frozen?: boolean;
            displayConfig?: any;
        }>,
        config: PeopleViewConfig
    ): Array<{
        propertyId: string;
        order: number;
        width?: number;
        visible?: boolean;
        frozen?: boolean;
        displayConfig?: any;
    }> {
        return properties.map(prop => {
            const isRequired = config.requiredProperties.includes(prop.propertyId);
            const frozenProp = config.frozenConfig.frozenProperties.find(fp => fp.propertyId === prop.propertyId);
            
            if (isRequired || frozenProp) {
                // Enforce backend rules for required/frozen properties
                return {
                    ...prop,
                    visible: isRequired ? true : prop.visible, // Required properties must be visible
                    frozen: frozenProp ? !frozenProp.allowHide : prop.frozen, // Respect frozen state
                };
            }
            
            // Allow full customization for non-required properties
            return prop;
        });
    }

    // Helper method to get people with CRM-specific filters
    async getPeopleWithCRMFilters(options: {
        status?: string[];
        relationship?: string[];
        tags?: string[];
        company?: string;
        needsContact?: boolean;
        search?: string;
        page?: number;
        limit?: number;
    } = {}): Promise<PersonRecord[]> {
        const filters: any = {};
        
        if (options.status?.length) filters.status = options.status;
        if (options.relationship?.length) filters.relationship = options.relationship;
        if (options.tags?.length) filters.tags = options.tags;
        if (options.company) filters.company = options.company;
        if (options.search) filters.search = options.search;
        if (options.needsContact) filters.contactOverdue = true;

        const pagination = {
            page: options.page || 1,
            limit: options.limit || 50
        };

        return this.getPeople(filters, undefined, pagination);
    }

    // Helper method to get people who need contact
    async getPeopleNeedingContact(): Promise<PersonRecord[]> {
        return this.getPeopleWithCRMFilters({ needsContact: true });
    }

    // Helper method to get people by status
    async getPeopleByStatus(status: string): Promise<PersonRecord[]> {
        return this.getPeopleWithCRMFilters({ status: [status] });
    }

    // Helper method to get people by relationship
    async getPeopleByRelationship(relationship: string): Promise<PersonRecord[]> {
        return this.getPeopleWithCRMFilters({ relationship: [relationship] });
    }
}

// Export singleton instance
export const peopleDocumentViewService = new PeopleDocumentViewService();
