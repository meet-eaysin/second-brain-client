import { createContext, type ReactNode, useContext, useState } from "react";
import { toast } from "sonner";
import {
  EDatabaseType,
  type TDatabase,
  type TFilterCondition,
  type TProperty,
  type TPropertyQueryParams,
  type TRecord,
  type TSortConfig,
  type TView,
} from "@/modules/database-view/types";
import {
  useDeleteRecord,
  useDuplicateRecord,
} from "../services/database-queries";
import { useAuthStore } from "@/modules/auth/store/authStore";
import {
  useDatabase,
  useProperties,
  useRecords,
  useView,
  useViews,
  useDatabaseByModuleType,
} from "@/modules/database-view/services/database-queries";
import type { Workspace } from "@/types/workspace.types.ts";

export type DatabaseDialogType =
  | "create-database"
  | "edit-database"
  | "create-property"
  | "edit-property"
  | "create-record"
  | "edit-record"
  | "view-record"
  | "create-view"
  | "edit-view"
  | "share-database"
  | "delete-database"
  | "manage-sorts"
  | "manage-filters"
  | "import-data"
  | "export-data"
  | "configure-frozen"
  | "bulk-edit"
  | "bulk-delete";

interface DatabaseViewContextValue {
  moduleType: EDatabaseType;
  workspace: Workspace | null;
  dialogOpen: DatabaseDialogType | null;

  database: TDatabase | null;
  views: TView[];
  currentView: TView | null;
  properties: TProperty[];
  records: TRecord[] | undefined;
  currentRecord: TRecord | null;
  currentProperty: TProperty | null;

  isDatabaseIdLoading: boolean;
  isDatabaseLoading: boolean;
  isViewsLoading: boolean;
  isPropertiesLoading: boolean;
  isRecordsLoading: boolean;
  isCurrentViewLoading: boolean;
  isDatabasesByTypeLoading: boolean;

  selectedRecords: Set<string>;
  visibleProperties: TProperty[];

  searchQuery: string;
  filters: TFilterCondition[];
  sorts: TSortConfig[];

  onDialogOpen: (dialog: DatabaseDialogType | null) => void;
  onViewChange: (viewId: string) => void;
  onRecordChange: (record: TRecord | null) => void;
  onPropertyChange: (property: TProperty | null) => void;
  onSelectedRecordsChange: (records: Set<string>) => void;
  onSearchQueryChange: (query: string) => void;
  onFiltersChange: (filters: TFilterCondition[]) => void;
  onSortsChange: (sorts: TSortConfig[]) => void;

  onBulkEdit: () => void;
  onBulkDelete: () => void;
  onRecordEdit: (record: TRecord) => void;
  onRecordDelete: (recordId: string) => void;
  onRecordDuplicate: (recordId: string) => void;
  onRecordCreate: () => void;
  onAddProperty: () => void;
}

interface DatabaseViewProviderProps {
  children: ReactNode;
  moduleType?: EDatabaseType;
  databaseId?: string;
}

const DatabaseViewContext = createContext<DatabaseViewContextValue | null>(
  null
);

export function DatabaseViewProvider({
  children,
  moduleType = EDatabaseType.CUSTOM,
  databaseId,
}: DatabaseViewProviderProps) {
  const [dialogOpen, setDialogOpen] = useState<DatabaseDialogType | null>(null);
  const [currentRecord, setCurrentRecord] = useState<TRecord | null>(null);
  const [currentProperty, setCurrentProperty] = useState<TProperty | null>(
    null
  );
  const [currentViewId, setCurrentViewId] = useState<string>("");
  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(
    new Set()
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<TFilterCondition[]>([]);
  const [sorts, setSorts] = useState<TSortConfig[]>([]);

  const { currentWorkspace } = useAuthStore();

  const deleteRecordMutation = useDeleteRecord();
  const duplicateRecordMutation = useDuplicateRecord();

  const { data: databasesByType, isLoading: isDatabasesByTypeLoading } = useDatabaseByModuleType(moduleType);
  const currentDatabaseId = databaseId || databasesByType?.data[0]?.id || "";

  const { data: database, isLoading: isDatabaseLoading } = useDatabase(currentDatabaseId);
  const { data: viewsResponse, isLoading: isViewsLoading } = useViews(currentDatabaseId);

  const defaultViewId = viewsResponse?.data?.find((view) => view?.isDefault)?.id || "";
  const effectiveViewId = currentViewId || defaultViewId || "";

  const { data: currentViewResponse, isLoading: isCurrentViewLoading } = useView(currentDatabaseId, effectiveViewId);

  const propertiesQueryParams: TPropertyQueryParams = {
    viewId: effectiveViewId,
    includeHidden: false,
  };
  const { data: properties, isLoading: isPropertiesLoading } = useProperties(currentDatabaseId, propertiesQueryParams);

  const recordQueryParams = {
    viewId: effectiveViewId,
    search: searchQuery,
    page: 1,
    limit: 50,
    isArchived: false,
    isTemplate: false,
  };

  const { data: records, isLoading: isRecordsLoading } = useRecords(
    currentDatabaseId,
    recordQueryParams
  );

  const visibleProperties =
    properties?.data?.filter((property: TProperty) => {
      if (
        currentViewResponse?.data?.settings?.visibleProperties &&
        currentViewResponse?.data.settings?.visibleProperties?.length > 0
      ) {
        return currentViewResponse?.data?.settings?.visibleProperties?.includes(property?.id);
      }
      return property?.isVisible ?? false;
    }) || [];

  const onDialogOpen = (dialog: DatabaseDialogType | null) => setDialogOpen(dialog);
  const onViewChange = (viewId: string) => setCurrentViewId(viewId);
  const onRecordChange = (record: TRecord | null) => setCurrentRecord(record);
  const onPropertyChange = (property: TProperty | null) => setCurrentProperty(property);
  const onSelectedRecordsChange = (records: Set<string>) => setSelectedRecords(records);
  const onSearchQueryChange = (query: string) => setSearchQuery(query);
  const onFiltersChange = (newFilters: TFilterCondition[]) => setFilters(newFilters);
  const onSortsChange = (newSorts: TSortConfig[]) => setSorts(newSorts);

  const onBulkEdit = () => onDialogOpen("bulk-edit");
  const onBulkDelete = () => onDialogOpen("bulk-delete");

  const onRecordEdit = (record: TRecord) => {
    onRecordChange(record);
    onDialogOpen("edit-record");
  };

  const onRecordDelete = (recordId: string) => {
    if (currentDatabaseId && !isDatabasesByTypeLoading) {
      deleteRecordMutation.mutate(
        {
          databaseId: currentDatabaseId,
          recordId,
        },
        {
          onError: () => {
            toast.error("Failed to delete record. Please try again.");
          },
        }
      );
    } else {
      toast.error("Database not available. Please wait for it to load.");
    }
  };

  const onRecordDuplicate = (recordId: string) => {
    if (currentDatabaseId && !isDatabasesByTypeLoading) {
      duplicateRecordMutation.mutate(
        {
          databaseId: currentDatabaseId,
          recordId,
        },
        {
          onError: () => {
            toast.error("Failed to duplicate record. Please try again.");
          },
        }
      );
    } else {
      toast.error("Database not available. Please wait for it to load.");
    }
  };

  const onRecordCreate = () => onDialogOpen("create-record");
  const onAddProperty = () => onDialogOpen("create-property");

  const contextValue: DatabaseViewContextValue = {
    moduleType,
    workspace: currentWorkspace,
    dialogOpen,
    database: database?.data || null,
    views: viewsResponse?.data || [],
    currentView: currentViewResponse?.data || null,
    properties: properties?.data || [],
    records: records?.data || undefined,
    currentRecord,
    currentProperty,

    isDatabaseIdLoading: isDatabasesByTypeLoading,
    isDatabaseLoading,
    isViewsLoading,
    isPropertiesLoading,
    isRecordsLoading,
    isCurrentViewLoading,
    isDatabasesByTypeLoading,

    selectedRecords,
    visibleProperties,

    searchQuery,
    filters,
    sorts,

    onDialogOpen,
    onViewChange,
    onRecordChange,
    onPropertyChange,
    onSelectedRecordsChange,
    onSearchQueryChange,
    onFiltersChange,
    onSortsChange,

    // CRUD operations
    onBulkEdit,
    onBulkDelete,
    onRecordEdit,
    onRecordDelete,
    onRecordDuplicate,
    onRecordCreate,
    onAddProperty,
  };

  return (
    <DatabaseViewContext.Provider value={contextValue}>
      {children}
    </DatabaseViewContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useDatabaseView = (): DatabaseViewContextValue => {
  const context = useContext(DatabaseViewContext);
  if (!context)
    throw new Error(
      "useDatabaseView must be used within a DatabaseViewProvider"
    );

  return context;
};
