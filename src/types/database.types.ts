export interface Database {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    cover?: string;
    workspaceId?: string;
    ownerId: string;
    isPublic: boolean;
    isFavorite?: boolean;
    categoryId?: string;
    tags?: string[];
    properties: DatabaseProperty[];
    views: DatabaseView[];
    permissions: DatabasePermission[];
    createdAt: string;
    updatedAt: string;
}

export interface DatabaseCategory {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    ownerId: string;
    isDefault?: boolean;
    sortOrder?: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateDatabaseRequest {
    name: string;
    description?: string;
    icon?: string;
    cover?: string;
    workspaceId?: string;
    isPublic?: boolean;
}

export interface UpdateDatabaseRequest {
    name?: string;
    description?: string;
    icon?: string;
    cover?: string;
    isPublic?: boolean;
}

export type PropertyType =
    | 'TEXT' 
    | 'NUMBER' 
    | 'SELECT' 
    | 'MULTI_SELECT' 
    | 'DATE' 
    | 'CHECKBOX' 
    | 'URL' 
    | 'EMAIL' 
    | 'PHONE' 
    | 'RELATION' 
    | 'FORMULA' 
    | 'ROLLUP' 
    | 'CREATED_TIME' 
    | 'CREATED_BY' 
    | 'LAST_EDITED_TIME' 
    | 'LAST_EDITED_BY';

export interface SelectOption {
    id: string;
    name: string;
    color: string;
}

export interface RelationConfig {
    relatedDatabaseId: string;
    relationType: 'ONE_TO_ONE' | 'ONE_TO_MANY' | 'MANY_TO_ONE' | 'MANY_TO_MANY';
}

export interface FormulaConfig {
    expression: string;
    returnType: 'TEXT' | 'NUMBER' | 'DATE' | 'CHECKBOX';
}

export interface DatabaseProperty {
    id: string;
    name: string;
    type: PropertyType;
    description?: string;
    required: boolean;
    isVisible: boolean;
    order: number;
    selectOptions?: SelectOption[];
    relationConfig?: RelationConfig;
    formulaConfig?: FormulaConfig;
}

export interface CreatePropertyRequest {
    name: string;
    type: PropertyType;
    description?: string;
    required?: boolean;
    selectOptions?: Omit<SelectOption, 'id'>[];
    relationConfig?: RelationConfig;
    order?: number;
}

export interface UpdatePropertyRequest {
    name?: string;
    description?: string;
    required?: boolean;
    selectOptions?: SelectOption[];
}

export type ViewType = 'TABLE' | 'BOARD' | 'TIMELINE' | 'CALENDAR' | 'GALLERY' | 'LIST';

export interface ViewFilter {
    propertyId: string;
    operator: string;
    value: unknown;
}

export interface ViewSort {
    propertyId: string;
    direction: 'asc' | 'desc';
}

export interface DatabaseView {
    id: string;
    name: string;
    type: ViewType;
    isDefault: boolean;
    filters: ViewFilter[];
    sorts: ViewSort[];
    groupBy?: string;
    visibleProperties: string[];
}

export interface CreateViewRequest {
    name: string;
    type: ViewType;
    isDefault?: boolean;
    filters?: ViewFilter[];
    sorts?: ViewSort[];
    visibleProperties?: string[];
}

export interface UpdateViewRequest {
    name?: string;
    filters?: ViewFilter[];
    sorts?: ViewSort[];
    visibleProperties?: string[];
}

export interface DatabaseRecord {
    id: string;
    databaseId: string;
    properties: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
}

export interface CreateRecordRequest {
    properties: Record<string, unknown>;
}

export interface UpdateRecordRequest {
    properties: Record<string, unknown>;
}

export type PermissionLevel = 'read' | 'write' | 'admin';

export interface DatabasePermission {
    userId: string;
    permission: PermissionLevel;
    grantedAt: string;
}

export interface ShareDatabaseRequest {
    userId: string;
    permission: PermissionLevel;
}

// Response Types
export interface PaginatedDatabasesResponse {
    databases: Database[];
    total: number;
    totalPages: number;
    currentPage: number;
}

export interface PaginatedRecordsResponse {
    records: DatabaseRecord[];
    total: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    groupedData?: Record<string, DatabaseRecord[]>;
}

export interface DatabaseQueryParams {
    workspaceId?: string;
    page?: number;
    limit?: number;
    search?: string;
    ownerId?: string;
    excludeOwnerId?: string;
    isPublic?: boolean;
    sortBy?: 'name' | 'created' | 'updated';
    sortOrder?: 'asc' | 'desc';
}

export interface RecordQueryParams {
    viewId?: string;
    page?: number;
    limit?: number;
    search?: string;
    searchProperties?: string;
    groupBy?: string;
    filters?: string; // JSON string
    sorts?: string; // JSON string
}
