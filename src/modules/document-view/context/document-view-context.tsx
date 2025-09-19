import { createContext, ReactNode, useContext, useState } from "react";
import type {
  DocumentFilter,
  DocumentSort,
  IDatabase,
  IDatabaseProperty,
  IProperty,
  IRecord,
  IView,
} from "@/modules/document-view/types";
import {
  EDatabaseType,
  IPropertyQueryParams,
} from "@/modules/document-view/types";
import {
  useGetModuleDatabaseId,
  useInitializeModules,
} from "@/modules/workspaces/services/workspace-queries";
import { useWorkspace } from "@/modules/workspaces/context/workspace-context";
import {
  useDatabase,
  useProperties,
  useRecords,
  useView,
  useViews,
} from "@/modules/document-view/services/database-queries";
import type { Workspace } from "@/types/workspace.types.ts";

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
  | "bulk-edit";

interface DocumentViewContextValue {
  moduleType: EDatabaseType;
  workspace: Workspace;
  dialogOpen: DocumentDialogType | null;

  database: IDatabase | null;
  views: IView[];
  currentView: IView | null;
  properties: IProperty[];
  records: IRecord[];
  currentRecord: IRecord | null;
  currentProperty: IProperty | null;

  isLoadingDatabaseId: boolean;
  isLoadingDatabase: boolean;
  isLoadingViews: boolean;
  isLoadingProperties: boolean;
  isLoadingRecords: boolean;
  isLoadingCurrentView: boolean;

  selectedRecords: Set<string>;
  visibleProperties: IDatabaseProperty[];

  searchQuery: string;
  filters: DocumentFilter[];
  sorts: DocumentSort[];

  handleDialogOpen: (dialog: DocumentDialogType | null) => void;
  handleViewChange: (viewId: string) => void;
  handleCurrentRecordChange: (record: IRecord | null) => void;
  handleCurrentPropertyChange: (property: IProperty | null) => void;
  handleSelectedRecordsChange: (records: Set<string>) => void;
  handleSearchQueryChange: (query: string) => void;
  handleFiltersChange: (filters: DocumentFilter[]) => void;
  handleSortsChange: (sorts: DocumentSort[]) => void;
}

interface DocumentViewProviderProps {
  children: ReactNode;
  moduleType?: EDatabaseType;
  databaseId?: string;
}

const DocumentViewContext = createContext<DocumentViewContextValue | null>(
  null
);

export function DocumentViewProvider({
  children,
  moduleType = EDatabaseType.CUSTOM,
  databaseId,
}: DocumentViewProviderProps) {
  const [dialogOpen, setDialogOpen] = useState<DocumentDialogType | null>(null);

  const [currentRecord, setCurrentRecord] = useState<IRecord | null>(null);
  const [currentProperty, setCurrentProperty] = useState<IProperty | null>(null);
  const [currentViewId, setCurrentViewId] = useState<string>("");

  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(new Set());

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<DocumentFilter[]>([]);
  const [sorts, setSorts] = useState<DocumentSort[]>([]);

  const { currentWorkspace } = useWorkspace();

  const { data: databaseIdResponse, isLoading: isLoadingDatabaseId } =
    useGetModuleDatabaseId(
      currentWorkspace?._id || "",
      moduleType || EDatabaseType.CUSTOM
    );

  let currentDatabaseId = databaseId || databaseIdResponse?.data.databaseId || "";
  const moduleInitializedPayload = {
    workspaceId: currentWorkspace?._id || "",
    moduleTypes: [moduleType || EDatabaseType.CUSTOM],
    createSampleData: false,
    isInitialized: !!databaseId,
  };
  const { data: initialized } = useInitializeModules(moduleInitializedPayload);
  const { data: currentDatabaseIdResponse } = useGetModuleDatabaseId(
    currentWorkspace?._id || "",
    moduleType || EDatabaseType.CUSTOM,
    initialized?.success
  );
  currentDatabaseId = currentDatabaseIdResponse?.data.databaseId || "";

  const { data: database, isLoading: isLoadingDatabase } =
    useDatabase(currentDatabaseId);

  const { data: views = [], isLoading: isLoadingViews } =
    useViews(currentDatabaseId);

  const { data: currentView, isLoading: isLoadingCurrentView } = useView(
    currentDatabaseId,
    currentViewId
  );

  const propertiesQueryParams: IPropertyQueryParams = {
    viewId: currentViewId || "",
    includeHidden: false,
  };

  const { data: properties = [], isLoading: isLoadingProperties } =
    useProperties(databaseId, propertiesQueryParams);

  const recordQueryParams = {
    viewId: currentViewId,
    search: searchQuery,
    page: 1,
    limit: 50,
    isArchived: false,
    isTemplate: false,
  };

  const { data: records, isLoading: isLoadingRecords } = useRecords(
    databaseId || "",
    recordQueryParams
  );

  const visibleProperties = properties.filter((property) => {
        if (
            currentView?.data.settings.visibleProperties &&
            currentView?.data.settings.visibleProperties > 0
        ) {
            return currentView?.data.settings.visibleProperties.includes(property._id);
        }
        return property.isVisible !== false;
    });

  const handleDialogOpen = (dialog: DocumentDialogType | null) =>  setDialogOpen(dialog);
  const handleViewChange = (viewId: string) => setCurrentViewId(viewId);
  const handleCurrentRecordChange = (record: IRecord | null) => setCurrentRecord(record);
  const handleCurrentPropertyChange = (property: IProperty | null) => setCurrentProperty(property);
  const handleSelectedRecordsChange = (records: Set<string>) => setSelectedRecords(records);
  const handleSearchQueryChange = (query: string) => setSearchQuery(query);
  const handleFiltersChange = (newFilters: DocumentFilter[]) => setFilters(newFilters);
  const handleSortsChange = (newSorts: DocumentSort[]) => setSorts(newSorts);

  const contextValue: DocumentViewContextValue = {
    moduleType,
    workspace: currentWorkspace || null,
    dialogOpen,
    database: database || null,
    views,
    currentView: currentView?.data || null,
    properties,
    records,
    currentRecord,
    currentProperty,

    isLoadingDatabaseId,
    isLoadingDatabase,
    isLoadingViews,
    isLoadingProperties,
    isLoadingRecords,
    isLoadingCurrentView,

    selectedRecords,
    visibleProperties,

    searchQuery,
    filters,
    sorts,

    handleDialogOpen,
    handleViewChange,
    handleCurrentRecordChange,
    handleCurrentPropertyChange,
    handleSelectedRecordsChange,
    handleSearchQueryChange,
    handleFiltersChange,
    handleSortsChange,
  };

  return (
    <DocumentViewContext.Provider value={contextValue}>
      {children}
    </DocumentViewContext.Provider>
  );
}

export const useDocumentView = (): DocumentViewContextValue => {
  const context = useContext(DocumentViewContext);
  if (!context)
    throw new Error(
      "useDocumentView must be used within a DocumentViewProvider"
    );

  return context;
};
