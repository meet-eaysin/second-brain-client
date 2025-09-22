export type ViewType =
  | "TABLE"
  | "BOARD"
  | "GANTT"
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

export interface DocumentRecord {
  id: string;
  documentId: string;
  properties: Record<string, any>;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentProperty {
  id: string;
  name: string;
  type: string;
  required?: boolean;
  options?: any[];
  defaultValue?: any;
}

export interface DocumentView {
  id: string;
  name: string;
  type: ViewType;
  description?: string;
  filters: ViewFilter[];
  sorts: ViewSort[];
  properties?: string[];
  isDefault: boolean;
  visibleProperties: string[];
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
