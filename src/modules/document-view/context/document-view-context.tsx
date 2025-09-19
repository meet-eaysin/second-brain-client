import React, { useState, createContext, useContext } from "react";
import type {IDatabase, IProperty, IRecord, IView} from "@/modules/document-view/types";
import {useGetPrimaryWorkspace} from "@/modules/workspaces/services/workspace-queries.ts";
import type {Workspace} from "@/types/workspace.types.ts";

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
  TRecord = IRecord,
  TProperty = IProperty,
  TView = IView,
  TSchema = IDatabase
> {
  workspace: Workspace
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

  // Loading and error states
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

// Create context
const DocumentViewContext = createContext<DocumentViewContextType | null>(null);

interface DocumentViewProviderProps<
  TRecord = IRecord,
  TProperty = IProperty,
  TView = IView,
  TSchema = IDatabase
> {
  children: React.ReactNode;
  initialConfig?: Partial<DocumentSchemaConfig>;
  initialSchema?: TSchema | null;
}

export function DocumentViewProvider<
  TRecord = IRecord,
  TProperty = IProperty,
  TView = IView,
  TSchema = IDatabase
>({
  children,
  initialConfig = {},
  initialSchema = null,
}: DocumentViewProviderProps<TRecord, TProperty, TView, TSchema>) {
  const { data: workspace } = useGetPrimaryWorkspace();
  const [dialogOpen, setDialogOpen] = useState<DocumentDialogType | null>(null);
  const [currentSchema, setCurrentSchema] = useState<TSchema | null>(
    initialSchema
  );
  const [currentRecord, setCurrentRecord] = useState<TRecord | null>(null);
  const [currentProperty, setCurrentProperty] = useState<TProperty | null>(
    null
  );
  const [currentView, setCurrentView] = useState<TView | null>(null);

  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(
    new Set()
  );
  const [visibleProperties, setVisibleProperties] = useState<
    Record<string, boolean>
  >({});

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<DocumentFilter[]>([]);
  const [sorts, setSorts] = useState<DocumentSort[]>([]);

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
    workspace,
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
