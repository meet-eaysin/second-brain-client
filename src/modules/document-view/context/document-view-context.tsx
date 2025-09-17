import React, { useState, createContext, useContext } from "react";
import type { ViewFrozenConfig } from "../components/document-columns";

export interface DocumentRecord<T = Record<string, unknown>> {
  id: string;
  properties: T;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  [key: string]: unknown; // Allow additional fields
}

export interface DocumentProperty {
  id: string;
  name: string;
  type: string;
  description?: string;
  required?: boolean;
  isVisible?: boolean;
  order?: number;
  config?: Record<string, unknown>; // Property-specific configuration
  [key: string]: unknown; // Allow additional fields
}

export interface DocumentView {
  id: string;
  name: string;
  type: string;
  isDefault?: boolean;
  filters?: Array<DocumentFilter>;
  sorts?: Array<DocumentSort>;
  groupBy?: string;
  visibleProperties?: string[];
  customProperties?: DocumentProperty[]; // Custom properties added to this view
  config?: Record<string, unknown>; // View-specific configuration
  [key: string]: unknown; // Allow additional fields
}

export interface DocumentFilter {
  propertyId: string;
  operator: string;
  value: unknown;
  enabled?: boolean;
}

export interface DocumentSort {
  propertyId: string;
  direction: "asc" | "desc";
  enabled?: boolean;
}

export interface DocumentSchema<
  TRecord = DocumentRecord,
  TProperty = DocumentProperty,
  TView = DocumentView
> {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  properties: TProperty[];
  views: TView[];
  records?: TRecord[];
  config?: DocumentSchemaConfig;
  [key: string]: unknown; // Allow additional fields
}

export interface DocumentSchemaConfig {
  // Module identification
  moduleType?: string; // 'CRM', 'TASKS', 'INVENTORY', etc.
  documentType?: string; // 'PEOPLE', 'COMPANIES', 'PROJECTS', etc.

  // Frozen property configuration
  frozenConfig?: ViewFrozenConfig;

  // Permissions and capabilities
  permissions?: {
    canCreate?: boolean;
    canEdit?: boolean;
    canDelete?: boolean;
    canShare?: boolean;
    canExport?: boolean;
    canImport?: boolean;
  };

  // UI configuration
  ui?: {
    defaultView?: string;
    enableViews?: boolean;
    enableSearch?: boolean;
    enableFilters?: boolean;
    enableSorts?: boolean;
    enableGrouping?: boolean;
    showRecordCount?: boolean;
    compactMode?: boolean;
  };

  // Data configuration
  data?: {
    pageSize?: number;
    maxRecords?: number;
    enablePagination?: boolean;
    enableVirtualization?: boolean;
    cacheResults?: boolean;
  };

  // Integration configuration
  integrations?: {
    enableExternalSync?: boolean;
    webhookUrl?: string;
    apiEndpoints?: Record<string, string>;
  };
}

export type DocumentDialogType =
  | "create-document"
  | "edit-document"
  | "create-property"
  | "edit-property"
  | "create-record"
  | "edit-record"
  | "view-record"
  | "create-view"
  | "edit-view"
  | "share-document"
  | "delete-document"
  | "manage-sorts"
  | "manage-filters"
  | "import-data"
  | "export-data"
  | "configure-frozen"
  | string; // Allow custom dialog types

interface DocumentViewContextType<
  TRecord = DocumentRecord,
  TProperty = DocumentProperty,
  TView = DocumentView,
  TSchema = DocumentSchema<TRecord, TProperty, TView>
> {
  // Dialog state
  dialogOpen: DocumentDialogType | null;
  setDialogOpen: (dialog: DocumentDialogType | null) => void;

  // Current items
  currentSchema: TSchema | null;
  setCurrentSchema: React.Dispatch<React.SetStateAction<TSchema | null>>;
  currentRecord: TRecord | null;
  setCurrentRecord: React.Dispatch<React.SetStateAction<TRecord | null>>;
  currentProperty: TProperty | null;
  setCurrentProperty: React.Dispatch<React.SetStateAction<TProperty | null>>;
  currentView: TView | null;
  setCurrentView: React.Dispatch<React.SetStateAction<TView | null>>;

  // View state
  selectedRecords: Set<string>;
  setSelectedRecords: React.Dispatch<React.SetStateAction<Set<string>>>;
  visibleProperties: Record<string, boolean>;
  setVisibleProperties: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;

  // Search and filters
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  filters: DocumentFilter[];
  setFilters: React.Dispatch<React.SetStateAction<DocumentFilter[]>>;
  sorts: DocumentSort[];
  setSorts: React.Dispatch<React.SetStateAction<DocumentSort[]>>;

  // Configuration
  config: DocumentSchemaConfig;
  setConfig: React.Dispatch<React.SetStateAction<DocumentSchemaConfig>>;

  // Loading and error states
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

// Create context
const DocumentViewContext = createContext<DocumentViewContextType | null>(null);

interface DocumentViewProviderProps<
  TRecord = DocumentRecord,
  TProperty = DocumentProperty,
  TView = DocumentView,
  TSchema = DocumentSchema<TRecord, TProperty, TView>
> {
  children: React.ReactNode;
  initialConfig?: Partial<DocumentSchemaConfig>;
  initialSchema?: TSchema | null;
}

export function DocumentViewProvider<
  TRecord = DocumentRecord,
  TProperty = DocumentProperty,
  TView = DocumentView,
  TSchema = DocumentSchema<TRecord, TProperty, TView>
>({
  children,
  initialConfig = {},
  initialSchema = null,
}: DocumentViewProviderProps<TRecord, TProperty, TView, TSchema>) {
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState<DocumentDialogType | null>(null);

  // Current items
  const [currentSchema, setCurrentSchema] = useState<TSchema | null>(
    initialSchema
  );
  const [currentRecord, setCurrentRecord] = useState<TRecord | null>(null);
  const [currentProperty, setCurrentProperty] = useState<TProperty | null>(
    null
  );
  const [currentView, setCurrentView] = useState<TView | null>(null);

  // View state
  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(
    new Set()
  );
  const [visibleProperties, setVisibleProperties] = useState<
    Record<string, boolean>
  >({});

  // Search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<DocumentFilter[]>([]);
  const [sorts, setSorts] = useState<DocumentSort[]>([]);

  // Configuration with defaults
  const [config, setConfig] = useState<DocumentSchemaConfig>({
    permissions: {
      canCreate: true,
      canEdit: true,
      canDelete: true,
      canShare: false,
      canExport: true,
      canImport: true,
    },
    ui: {
      enableViews: true,
      enableSearch: true,
      enableFilters: true,
      enableSorts: true,
      enableGrouping: false,
      showRecordCount: true,
      compactMode: false,
    },
    data: {
      pageSize: 50,
      enablePagination: true,
      enableVirtualization: false,
      cacheResults: true,
    },
    ...initialConfig,
  });

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const value: DocumentViewContextType<TRecord, TProperty, TView, TSchema> = {
    // Dialog state
    dialogOpen,
    setDialogOpen,

    // Current items
    currentSchema,
    setCurrentSchema,
    currentRecord,
    setCurrentRecord,
    currentProperty,
    setCurrentProperty,
    currentView,
    setCurrentView,

    // View state
    selectedRecords,
    setSelectedRecords,
    visibleProperties,
    setVisibleProperties,

    // Search and filters
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    sorts,
    setSorts,

    // Configuration
    config,
    setConfig,

    // Loading and error states
    isLoading,
    setIsLoading,
    error,
    setError,
  };

  return (
    <DocumentViewContext.Provider value={value}>
      {children}
    </DocumentViewContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useDocumentView = () => {
  const documentViewContext = useContext(DocumentViewContext);

  if (!documentViewContext) {
    throw new Error(
      "useDocumentView has to be used within <DocumentViewProvider>"
    );
  }

  return documentViewContext;
};
