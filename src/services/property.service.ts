import { api } from '@/lib/api';
import type { DocumentProperty, PropertyType } from '@/modules/document-view';

export interface CreatePropertyRequest {
    name: string;
    type: PropertyType;
    description?: string;
    required?: boolean;
    order?: number;
    config?: any;
    selectOptions?: Array<{
        name: string;
        color: string;
    }>;
}

export interface UpdatePropertyRequest {
    name?: string;
    description?: string;
    required?: boolean;
    config?: any;
    selectOptions?: Array<{
        id?: string;
        name: string;
        color: string;
    }>;
}

export interface PropertyNameUpdateRequest {
    name: string;
}

export interface PropertyTypeUpdateRequest {
    type: PropertyType;
    config?: any;
}

export interface PropertyOrderUpdateRequest {
    order: number;
}

export interface PropertyInsertRequest {
    position: 'left' | 'right';
    name: string;
    type: PropertyType;
    config?: any;
}

export interface PropertyDuplicateRequest {
    name?: string;
}

export interface PropertyFreezeRequest {
    frozen: boolean;
}

export interface PropertyVisibilityRequest {
    visible: boolean;
}

class PropertyService {
    // Basic CRUD operations
    async createProperty(databaseId: string, data: CreatePropertyRequest): Promise<DocumentProperty> {
        const response = await api.post(`/databases/${databaseId}/properties`, data);
        return response.data.data;
    }

    async updateProperty(
        databaseId: string,
        propertyId: string,
        data: UpdatePropertyRequest
    ): Promise<DocumentProperty> {
        const response = await api.put(`/databases/${databaseId}/properties/${propertyId}`, data);
        return response.data.data;
    }

    async deleteProperty(databaseId: string, propertyId: string): Promise<void> {
        await api.delete(`/databases/${databaseId}/properties/${propertyId}`);
    }

    async getProperty(databaseId: string, propertyId: string): Promise<DocumentProperty> {
        const response = await api.get(`/databases/${databaseId}/properties/${propertyId}`);
        return response.data.data;
    }

    async getProperties(databaseId: string): Promise<DocumentProperty[]> {
        const response = await api.get(`/databases/${databaseId}/properties`);
        return response.data.data;
    }

    // Specialized property operations
    async updatePropertyName(
        databaseId: string,
        propertyId: string,
        data: PropertyNameUpdateRequest
    ): Promise<DocumentProperty> {
        const response = await api.patch(`/databases/${databaseId}/properties/${propertyId}/name`, data);
        return response.data.data;
    }

    async updatePropertyType(
        databaseId: string,
        propertyId: string,
        data: PropertyTypeUpdateRequest
    ): Promise<DocumentProperty> {
        const response = await api.patch(`/databases/${databaseId}/properties/${propertyId}/type`, data);
        return response.data.data;
    }

    async updatePropertyOrder(
        databaseId: string,
        propertyId: string,
        data: PropertyOrderUpdateRequest
    ): Promise<DocumentProperty> {
        const response = await api.patch(`/databases/${databaseId}/properties/${propertyId}/order`, data);
        return response.data.data;
    }

    async insertProperty(
        databaseId: string,
        propertyId: string,
        data: PropertyInsertRequest
    ): Promise<DocumentProperty> {
        const response = await api.post(`/databases/${databaseId}/properties/${propertyId}/insert`, data);
        return response.data.data;
    }

    async duplicateProperty(
        databaseId: string,
        propertyId: string,
        data: PropertyDuplicateRequest = {}
    ): Promise<DocumentProperty> {
        const response = await api.post(`/databases/${databaseId}/properties/${propertyId}/duplicate`, data);
        return response.data.data;
    }

    async updatePropertyFreeze(
        databaseId: string,
        propertyId: string,
        data: PropertyFreezeRequest
    ): Promise<DocumentProperty> {
        const response = await api.patch(`/databases/${databaseId}/properties/${propertyId}/freeze`, data);
        return response.data.data;
    }

    async updatePropertyVisibility(
        databaseId: string,
        propertyId: string,
        data: PropertyVisibilityRequest
    ): Promise<DocumentProperty> {
        const response = await api.patch(`/databases/${databaseId}/properties/${propertyId}/visibility`, data);
        return response.data.data;
    }

    async reorderProperties(databaseId: string, propertyIds: string[]): Promise<void> {
        await api.put(`/databases/${databaseId}/properties/reorder`, { propertyIds });
    }

    // Utility methods
    async getPropertyTypes(): Promise<Array<{ value: PropertyType; label: string; icon: string }>> {
        const response = await api.get('/universal-table/property-types');
        return response.data.data;
    }

    async getFilterOperators(propertyType?: PropertyType): Promise<Array<{ value: string; label: string }>> {
        const params = propertyType ? { propertyType } : {};
        const response = await api.get('/universal-table/filter-operators', { params });
        return response.data.data;
    }

    // Batch operations
    async batchUpdateProperties(
        databaseId: string,
        updates: Array<{
            propertyId: string;
            data: UpdatePropertyRequest;
        }>
    ): Promise<DocumentProperty[]> {
        const promises = updates.map(({ propertyId, data }) =>
            this.updateProperty(databaseId, propertyId, data)
        );
        return Promise.all(promises);
    }

    async batchDeleteProperties(databaseId: string, propertyIds: string[]): Promise<void> {
        const promises = propertyIds.map(propertyId =>
            this.deleteProperty(databaseId, propertyId)
        );
        await Promise.all(promises);
    }

    // Property validation
    validatePropertyName(name: string): { valid: boolean; error?: string } {
        if (!name || name.trim().length === 0) {
            return { valid: false, error: 'Property name is required' };
        }
        if (name.length > 100) {
            return { valid: false, error: 'Property name must be less than 100 characters' };
        }
        if (!/^[a-zA-Z0-9\s\-_]+$/.test(name)) {
            return { valid: false, error: 'Property name contains invalid characters' };
        }
        return { valid: true };
    }

    validatePropertyType(type: PropertyType): { valid: boolean; error?: string } {
        const validTypes: PropertyType[] = [
            'TEXT', 'NUMBER', 'SELECT', 'MULTI_SELECT', 'DATE', 'CHECKBOX',
            'URL', 'EMAIL', 'PHONE', 'RELATION', 'FORMULA',
            'ROLLUP', 'CREATED_TIME', 'LAST_EDITED_TIME', 'CREATED_BY', 'LAST_EDITED_BY'
        ];
        
        if (!validTypes.includes(type)) {
            return { valid: false, error: 'Invalid property type' };
        }
        return { valid: true };
    }

    // Property type conversion helpers
    canConvertPropertyType(fromType: PropertyType, toType: PropertyType): boolean {
        // Define conversion rules
        const conversionRules: Record<PropertyType, PropertyType[]> = {
            'TEXT': ['NUMBER', 'SELECT', 'MULTI_SELECT', 'URL', 'EMAIL', 'PHONE'],
            'NUMBER': ['TEXT', 'SELECT'],
            'SELECT': ['TEXT', 'MULTI_SELECT'],
            'MULTI_SELECT': ['TEXT', 'SELECT'],
            'DATE': ['TEXT'],
            'CHECKBOX': ['TEXT', 'SELECT'],
            'URL': ['TEXT'],
            'EMAIL': ['TEXT'],
            'PHONE': ['TEXT'],
            // 'PERSON': ['TEXT'], // Removed
            'RELATION': ['TEXT'],
            'FORMULA': [],
            'ROLLUP': [],
            'CREATED_TIME': [],
            'LAST_EDITED_TIME': [],
            'CREATED_BY': [],
            'LAST_EDITED_BY': []
        };

        return conversionRules[fromType]?.includes(toType) || false;
    }

    getPropertyTypeIcon(type: PropertyType): string {
        const iconMap: Record<PropertyType, string> = {
            'TEXT': 'Type',
            'NUMBER': 'Hash',
            'SELECT': 'List',
            'MULTI_SELECT': 'Tags',
            'DATE': 'Calendar',
            'CHECKBOX': 'CheckSquare',
            'URL': 'Link',
            'EMAIL': 'Mail',
            'PHONE': 'Phone',
            // 'PERSON': 'User', // Removed
            'RELATION': 'Link2',
            'FORMULA': 'Calculator',
            'ROLLUP': 'TrendingUp',
            'CREATED_TIME': 'Clock',
            'LAST_EDITED_TIME': 'Clock',
            'CREATED_BY': 'User',
            'LAST_EDITED_BY': 'User'
        };

        return iconMap[type] || 'Type';
    }

    getPropertyTypeLabel(type: PropertyType): string {
        const labelMap: Record<PropertyType, string> = {
            'TEXT': 'Text',
            'NUMBER': 'Number',
            'SELECT': 'Select',
            'MULTI_SELECT': 'Multi-select',
            'DATE': 'Date',
            'CHECKBOX': 'Checkbox',
            'URL': 'URL',
            'EMAIL': 'Email',
            'PHONE': 'Phone',
            // 'PERSON': 'Person', // Removed
            'RELATION': 'Relation',
            'FORMULA': 'Formula',
            'ROLLUP': 'Rollup',
            'CREATED_TIME': 'Created time',
            'LAST_EDITED_TIME': 'Last edited time',
            'CREATED_BY': 'Created by',
            'LAST_EDITED_BY': 'Last edited by'
        };

        return labelMap[type] || type;
    }
}

export const propertyService = new PropertyService();
