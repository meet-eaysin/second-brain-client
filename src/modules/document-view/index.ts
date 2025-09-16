export { DocumentView } from "./components/document-view";
export type { DocumentViewProps } from "./components/document-view";
export { DocumentDataTable } from "./components/document-data-table";

export { FilterManager } from "./components/filter-manager";
export { SortManager } from "./components/sort-manager";
export { SearchBar } from "./components/search-bar";
export { TableToolbar } from "./components/table-toolbar";
export { DocumentTableHeader } from "./components/document-table-header";
export { EditableCell } from "./components/editable-cell";

export interface Document {
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
  properties: DocumentProperty[];
  views: DocumentView[];
  permissions: DocumentPermission[];
  frozen?: boolean;
  frozenAt?: string;
  frozenBy?: string;
  frozenReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentCategory {
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

export interface CreateDocumentRequest {
  name: string;
  description?: string;
  icon?: string;
  cover?: string;
  workspaceId?: string;
  isPublic?: boolean;
}

export interface UpdateDocumentRequest {
  name?: string;
  description?: string;
  icon?: string;
  cover?: string;
  isPublic?: boolean;
}

export type PropertyType =
  | "TEXT"
  | "NUMBER"
  | "SELECT"
  | "MULTI_SELECT"
  | "DATE"
  | "CHECKBOX"
  | "URL"
  | "EMAIL"
  | "PHONE"
  | "RELATION"
  | "FORMULA"
  | "ROLLUP"
  | "CREATED_TIME"
  | "CREATED_BY"
  | "LAST_EDITED_TIME"
  | "LAST_EDITED_BY";

export interface SelectOption {
  id: string;
  name: string;
  color: string;
}

export interface RelationConfig {
  relatedDocumentId: string;
  relationType: "ONE_TO_ONE" | "ONE_TO_MANY" | "MANY_TO_ONE" | "MANY_TO_MANY";
}

export interface FormulaConfig {
  expression: string;
  returnType: "TEXT" | "NUMBER" | "DATE" | "CHECKBOX";
}

export interface DocumentProperty {
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
  selectOptions?: Omit<SelectOption, "id">[];
  relationConfig?: RelationConfig;
  order?: number;
}

export interface UpdatePropertyRequest {
  name?: string;
  description?: string;
  required?: boolean;
  selectOptions?: SelectOption[];
}

export type ViewType =
  | "TABLE"
  | "KANBAN"
  | "TIMELINE"
  | "CALENDAR"
  | "GALLERY"
  | "LIST";

export interface ViewFilter {
  propertyId: string;
  operator: string;
  value: unknown;
}

export interface ViewSort {
  propertyId: string;
  direction: "asc" | "desc";
}

export interface DocumentView {
  id: string;
  name: string;
  type: ViewType;
  description?: string;
  isDefault: boolean;
  filters: ViewFilter[];
  sorts: ViewSort[];
  groupBy?: string;
  visibleProperties: string[];
  customProperties?: DocumentProperty[];
  frozen?: boolean;
  frozenAt?: string;
  frozenBy?: string;
  frozenReason?: string;
  config?: {
    rowHeight?: "compact" | "medium" | "tall";
    pageSize?: number;
    showFilters?: boolean;
    showSearch?: boolean;
    showToolbar?: boolean;
    kanbanGroupBy?: string;
    [key: string]: any;
  };
}

export interface CreateViewRequest {
  name: string;
  type: ViewType;
  isDefault?: boolean;
  filters?: ViewFilter[];
  sorts?: ViewSort[];
  visibleProperties?: string[];
  config?: {
    rowHeight?: "compact" | "medium" | "tall";
    pageSize?: number;
    showFilters?: boolean;
    showSearch?: boolean;
    showToolbar?: boolean;
    kanbanGroupBy?: string;
    [key: string]: any;
  };
}

export interface UpdateViewRequest {
  name?: string;
  filters?: ViewFilter[];
  sorts?: ViewSort[];
  visibleProperties?: string[];
  config?: {
    rowHeight?: "compact" | "medium" | "tall";
    pageSize?: number;
    showFilters?: boolean;
    showSearch?: boolean;
    showToolbar?: boolean;
    kanbanGroupBy?: string;
    [key: string]: any;
  };
}

export interface DocumentRecord {
  id: string;
  documentViewId: string;
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

export type PermissionLevel = "read" | "write" | "admin";

export interface DocumentPermission {
  userId: string;
  permission: PermissionLevel;
  grantedAt: string;
}

export interface ShareDcoumentRequest {
  userId: string;
  permission: PermissionLevel;
}

// Response Types
export interface PaginatedDocumentResponse {
  documents: Document[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface PaginatedRecordsResponse {
  records: DocumentRecord[];
  total: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  groupedData?: Record<string, DocumentRecord[]>;
}

export interface DocumentQueryParams {
  workspaceId?: string;
  page?: number;
  limit?: number;
  search?: string;
  ownerId?: string;
  excludeOwnerId?: string;
  isPublic?: boolean;
  sortBy?: "name" | "createdAt" | "updatedAt" | "lastAccessedAt";
  sortOrder?: "asc" | "desc";
}

export interface RecordQueryParams {
  viewId?: string;
  page?: number;
  limit?: number;
  search?: string;
  searchProperties?: string;
  groupBy?: string;
  filters?: string;
  sorts?: string;
}
