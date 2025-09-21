import {
  createContext,
  type ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
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
  useGetModuleDatabaseId,
  useInitializeModules,
} from "@/modules/workspaces/services/workspace-queries";
import {
  useDeleteRecord,
  useDuplicateRecord,
} from "../services/database-queries";
import { useWorkspace } from "@/modules/workspaces/context/workspace-context";
import {
  useDatabase,
  useProperties,
  useRecords,
  useView,
  useViews,
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

  const { currentWorkspace } = useWorkspace();

  const deleteRecordMutation = useDeleteRecord();
  const duplicateRecordMutation = useDuplicateRecord();

  let currentDatabaseId = databaseId || "";

  const { data: databaseIdResponse, isLoading: isDatabaseIdLoading } =
    useGetModuleDatabaseId(
      currentWorkspace?._id || "",
      moduleType || EDatabaseType.CUSTOM,
      !currentDatabaseId
    );

  if (!currentDatabaseId && databaseIdResponse?.data.databaseId) {
    currentDatabaseId = databaseIdResponse.data.databaseId;
  }

  const needsInitialization = !currentDatabaseId && !isDatabaseIdLoading;

  const initializePayload = needsInitialization
    ? {
        workspaceId: currentWorkspace?._id || "",
        moduleTypes: [moduleType || EDatabaseType.CUSTOM],
        createSampleData: false,
        isInitialized: false,
      }
    : {
        workspaceId: "",
        moduleTypes: [],
        createSampleData: false,
        isInitialized: true,
      };

  const { data: initialized } = useInitializeModules(initializePayload);

  const { data: postInitDatabaseIdResponse } = useGetModuleDatabaseId(
    currentWorkspace?._id || "",
    moduleType || EDatabaseType.CUSTOM,
    initialized?.success
  );

  if (!currentDatabaseId && postInitDatabaseIdResponse?.data.databaseId) {
    currentDatabaseId = postInitDatabaseIdResponse.data.databaseId;
  }

  const { data: database, isLoading: isDatabaseLoading } =
    useDatabase(currentDatabaseId);

  const { data: viewsResponse, isLoading: isViewsLoading } =
    useViews(currentDatabaseId);

  const { data: currentViewResponse, isLoading: isCurrentViewLoading } =
    useView(currentDatabaseId, currentViewId);

  const propertiesQueryParams: TPropertyQueryParams = {
    viewId: currentViewId || "",
    includeHidden: false,
  };

  const { data: properties = [], isLoading: isPropertiesLoading } =
    useProperties(databaseId || "", propertiesQueryParams);

  const recordQueryParams = {
    viewId: currentViewId,
    search: searchQuery,
    page: 1,
    limit: 50,
    isArchived: false,
    isTemplate: false,
  };

  const { data: records, isLoading: isRecordsLoading } = useRecords(
    databaseId || "",
    recordQueryParams
  );

  useEffect(() => {
    if (currentViewResponse?.data?.filters) {
      setFilters(currentViewResponse.data.filters);
    } else {
      setFilters([]);
    }
  }, [currentViewResponse?.data?.filters]);

  useEffect(() => {
    if (currentViewResponse?.data?.sorts) {
      setSorts(currentViewResponse.data.sorts);
    } else {
      setSorts([]);
    }
  }, [currentViewResponse?.data?.sorts]);

  const visibleProperties = properties.filter((property: TProperty) => {
    if (
      currentViewResponse?.data?.settings.visibleProperties &&
      currentViewResponse.data.settings.visibleProperties.length > 0
    ) {
      return currentViewResponse.data.settings.visibleProperties.includes(
        property.id
      );
    }
    return property.isVisible;
  });

  const onDialogOpen = (dialog: DatabaseDialogType | null) =>
    setDialogOpen(dialog);
  const onViewChange = (viewId: string) => setCurrentViewId(viewId);
  const onRecordChange = (record: TRecord | null) => setCurrentRecord(record);
  const onPropertyChange = (property: TProperty | null) =>
    setCurrentProperty(property);
  const onSelectedRecordsChange = (records: Set<string>) =>
    setSelectedRecords(records);
  const onSearchQueryChange = (query: string) => setSearchQuery(query);
  const onFiltersChange = (newFilters: TFilterCondition[]) =>
    setFilters(newFilters);
  const onSortsChange = (newSorts: TSortConfig[]) => setSorts(newSorts);

  const onBulkEdit = () => onDialogOpen("bulk-edit");
  const onBulkDelete = () => onDialogOpen("bulk-delete");

  const onRecordEdit = (record: TRecord) => {
    onRecordChange(record);
    onDialogOpen("edit-record");
  };

  const onRecordDelete = (recordId: string) => {
    if (currentDatabaseId) {
      deleteRecordMutation.mutate({
        databaseId: currentDatabaseId,
        recordId,
      });
    }
  };

  const onRecordDuplicate = (recordId: string) => {
    if (currentDatabaseId) {
      duplicateRecordMutation.mutate({
        databaseId: currentDatabaseId,
        recordId,
      });
    }
  };

  const onRecordCreate = () => onDialogOpen("create-record");
  const onAddProperty = () => onDialogOpen("create-property");

  const contextValue: DatabaseViewContextValue = {
    moduleType,
    workspace: currentWorkspace,
    dialogOpen,
    database: database || null,
    views: viewsResponse?.data || [],
    currentView: currentViewResponse?.data || null,
    properties,
    records: records?.data,
    currentRecord,
    currentProperty,

    isDatabaseIdLoading,
    isDatabaseLoading,
    isViewsLoading,
    isPropertiesLoading,
    isRecordsLoading,
    isCurrentViewLoading,

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
