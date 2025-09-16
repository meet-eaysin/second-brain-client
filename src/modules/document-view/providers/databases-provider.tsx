import React from 'react';
import { DocumentViewProvider, DocumentRecord, DocumentProperty, DocumentView, DocumentSchema } from '../context/document-view-context';

// Database-specific frozen property configuration
export const DATABASE_FROZEN_PROPERTIES = {
    name: {
        frozen: true,
        removable: false,
        required: true,
        order: 0,
        width: 300,
        type: 'TEXT' as const
    },
    description: {
        frozen: false,
        removable: false,
        required: false,
        order: 1,
        width: 250,
        type: 'TEXTAREA' as const
    },
    icon: {
        frozen: false,
        removable: false,
        required: false,
        order: 2,
        width: 80,
        type: 'ICON' as const
    },
    createdAt: {
        frozen: false,
        removable: false,
        required: false,
        order: 3,
        width: 150,
        type: 'DATE' as const
    },
    updatedAt: {
        frozen: false,
        removable: false,
        required: false,
        order: 4,
        width: 150,
        type: 'DATE' as const
    }
};

// Database record type
export interface DatabaseRecord extends DocumentRecord {
    name: string;
    description?: string;
    icon?: string;
    cover?: string;
    userId: string;
    workspaceId?: string;
    isPublic: boolean;
    isFavorite: boolean;
    categoryId?: string;
    tags: string[];
    lastAccessedAt: Date;
    accessCount: number;
    frozen: boolean;
    frozenAt?: Date;
    frozenBy?: string;
    createdBy: string;
    lastEditedBy: string;
    createdAt: Date;
    updatedAt: Date;
}

// Database property type
export interface DatabaseProperty extends DocumentProperty {
    type: 'TEXT' | 'TEXTAREA' | 'ICON' | 'IMAGE' | 'PERSON' | 'RELATION' | 'CHECKBOX' | 'SELECT' | 'MULTI_SELECT' | 'DATE' | 'NUMBER';
}

// Database view type
export interface DatabaseView extends DocumentView {
    type: 'TABLE' | 'KANBAN' | 'CALENDAR' | 'GALLERY' | 'TIMELINE' | 'LIST';
}

// Database schema type
export interface DatabaseSchema extends DocumentSchema<DatabaseRecord, DatabaseProperty, DatabaseView> {
    config: {
        moduleType: 'DATABASES';
        documentType: 'DATABASES';
        frozenConfig: typeof DATABASE_FROZEN_PROPERTIES;
    };
}

// Default database properties
const DEFAULT_DATABASE_PROPERTIES: DatabaseProperty[] = [
    {
        id: 'name',
        name: 'Name',
        type: 'TEXT',
        required: true,
        isVisible: true,
        order: 0,
        frozen: true,
        width: 300,
        description: 'Database name (required, frozen)',
    },
    {
        id: 'description',
        name: 'Description',
        type: 'TEXTAREA',
        required: false,
        isVisible: true,
        order: 1,
        frozen: false,
        width: 250,
        description: 'Database description',
    },
    {
        id: 'icon',
        name: 'Icon',
        type: 'ICON',
        required: false,
        isVisible: true,
        order: 2,
        frozen: false,
        width: 80,
        description: 'Database icon',
    },
    {
        id: 'isFavorite',
        name: 'Favorite',
        type: 'CHECKBOX',
        required: false,
        isVisible: true,
        order: 3,
        frozen: false,
        width: 100,
        description: 'Mark as favorite',
    },
    {
        id: 'isPublic',
        name: 'Public',
        type: 'CHECKBOX',
        required: false,
        isVisible: false,
        order: 4,
        frozen: false,
        width: 100,
        description: 'Public access',
    },
    {
        id: 'categoryId',
        name: 'Category',
        type: 'SELECT',
        required: false,
        isVisible: false,
        order: 5,
        frozen: false,
        width: 150,
        description: 'Database category',
        config: {
            options: [
                { id: 'personal', name: 'Personal', color: '#3B82F6' },
                { id: 'work', name: 'Work', color: '#10B981' },
                { id: 'project', name: 'Project', color: '#F59E0B' },
                { id: 'archive', name: 'Archive', color: '#6B7280' },
            ],
        },
    },
    {
        id: 'tags',
        name: 'Tags',
        type: 'MULTI_SELECT',
        required: false,
        isVisible: false,
        order: 6,
        frozen: false,
        width: 200,
        description: 'Database tags',
    },
    {
        id: 'lastAccessedAt',
        name: 'Last Accessed',
        type: 'DATE',
        required: false,
        isVisible: true,
        order: 7,
        frozen: false,
        width: 150,
        description: 'Last access time',
    },
    {
        id: 'accessCount',
        name: 'Access Count',
        type: 'NUMBER',
        required: false,
        isVisible: false,
        order: 8,
        frozen: false,
        width: 120,
        description: 'Number of times accessed',
    },
    {
        id: 'createdAt',
        name: 'Created',
        type: 'DATE',
        required: false,
        isVisible: true,
        order: 9,
        frozen: false,
        width: 150,
        description: 'Creation date',
    },
    {
        id: 'updatedAt',
        name: 'Updated',
        type: 'DATE',
        required: false,
        isVisible: false,
        order: 10,
        frozen: false,
        width: 150,
        description: 'Last update date',
    },
];

// Default database views
const DEFAULT_DATABASE_VIEWS: DatabaseView[] = [
    {
        id: 'all-databases',
        name: 'All Databases',
        type: 'TABLE',
        isDefault: true,
        filters: [],
        sorts: [{ propertyId: 'updatedAt', direction: 'desc' }],
        groupBy: null,
        config: {
            showRecordCount: true,
            enableSearch: true,
            enableFilters: true,
            enableSorts: true,
        },
    },
    {
        id: 'favorites',
        name: 'Favorites',
        type: 'TABLE',
        isDefault: false,
        filters: [{ propertyId: 'isFavorite', operator: 'equals', value: true }],
        sorts: [{ propertyId: 'lastAccessedAt', direction: 'desc' }],
        groupBy: null,
        config: {
            showRecordCount: true,
            enableSearch: true,
            enableFilters: true,
            enableSorts: true,
        },
    },
    {
        id: 'recent',
        name: 'Recently Accessed',
        type: 'TABLE',
        isDefault: false,
        filters: [],
        sorts: [{ propertyId: 'lastAccessedAt', direction: 'desc' }],
        groupBy: null,
        config: {
            showRecordCount: true,
            enableSearch: true,
            enableFilters: true,
            enableSorts: true,
        },
    },
    {
        id: 'by-category',
        name: 'By Category',
        type: 'KANBAN',
        isDefault: false,
        filters: [],
        sorts: [{ propertyId: 'name', direction: 'asc' }],
        groupBy: 'categoryId',
        config: {
            showRecordCount: true,
            enableSearch: true,
            enableFilters: true,
            enableSorts: true,
            kanbanConfig: {
                groupByProperty: 'categoryId',
                showUngrouped: true,
            },
        },
    },
];

// Create database schema with frozen properties
export const createDatabaseSchema = (): DatabaseSchema => ({
    id: 'databases-main-db',
    name: 'Databases',
    description: 'Comprehensive database management with document-view integration',
    icon: '🗄️',
    properties: DEFAULT_DATABASE_PROPERTIES,
    views: DEFAULT_DATABASE_VIEWS,
    config: {
        moduleType: 'DATABASES',
        documentType: 'DATABASES',
        frozenConfig: DATABASE_FROZEN_PROPERTIES,
        permissions: {
            canCreate: true,
            canEdit: true,
            canDelete: true,
            canShare: true,
            canExport: true,
            canImport: true,
        },
        ui: {
            defaultView: 'table',
            enableViews: true,
            enableSearch: true,
            enableFilters: true,
            enableSorts: true,
            enableGrouping: true,
            showRecordCount: true,
            compactMode: false,
        },
        data: {
            pageSize: 50,
            enablePagination: true,
            enableVirtualization: false,
            cacheResults: true,
        },
        integrations: {
            enableExternalSync: false,
            supportedProviders: ['NOTION', 'AIRTABLE', 'GOOGLE_SHEETS', 'CSV', 'JSON'],
        },
    },
});

// Database provider props
interface DatabasesProviderProps {
    children: React.ReactNode;
    initialSchema?: DatabaseSchema;
    enableIntegrations?: boolean;
    compactMode?: boolean;
    enableTimeTracking?: boolean;
}

export function DatabasesProvider({
    children,
    initialSchema,
    enableIntegrations = false,
    compactMode = false,
    enableTimeTracking = false,
}: DatabasesProviderProps) {
    const defaultConfig = {
        moduleType: 'DATABASES' as const,
        documentType: 'DATABASES' as const,
        frozenConfig: DATABASE_FROZEN_PROPERTIES,
        enableIntegrations,
        compactMode,
        enableTimeTracking,
    };

    const schema = initialSchema || createDatabaseSchema();

    return (
        <DocumentViewProvider
            schema={schema}
            config={defaultConfig}
        >
            {children}
        </DocumentViewProvider>
    );
}
