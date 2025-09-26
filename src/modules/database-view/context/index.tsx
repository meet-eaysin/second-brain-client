import {
  createContext,
  type ReactNode,
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react";
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
  useCreateRecord,
  useDeleteRecord,
  useDuplicateRecord,
  useUpdateViewFilters,
  useInitializeSpecificModules,
} from "../services/database-queries";
import { useQueryClient } from "@tanstack/react-query";
import { DATABASE_KEYS } from "../services/database-queries";
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
  allProperties: TProperty[];
  records: TRecord[] | undefined;
  currentRecord: TRecord | null;
  currentProperty: TProperty | null;

  isDatabaseIdLoading: boolean;
  isInitializing: boolean;
  isDatabaseLoading: boolean;
  isViewsLoading: boolean;
  isPropertiesLoading: boolean;
  isAllPropertiesLoading: boolean;
  isRecordsLoading: boolean;
  isInitialLoading: boolean;
  isCurrentViewLoading: boolean;
  isLoadingMore: boolean;
  hasMoreRecords: boolean;

  selectedRecords: Set<string>;
  visibleProperties: TProperty[];

  searchQuery: string;
  filters: TFilterCondition[];
  tempFilters: TFilterCondition[];
  setTempFilters: (filters: TFilterCondition[]) => void;
  tempSorts: TSortConfig[];
  setTempSorts: (sorts: TSortConfig[]) => void;
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
  onLoadMoreRecords: () => void;
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
  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(
    new Set()
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [currentViewId, setCurrentViewId] = useState<string>("");
  const [currentOffset, setCurrentOffset] = useState(0);
  const [accumulatedRecords, setAccumulatedRecords] = useState<TRecord[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [sorts, setSorts] = useState<TSortConfig[]>([]);

  const { currentWorkspace } = useAuthStore();
  const queryClient = useQueryClient();

  const createRecordMutation = useCreateRecord();
  const deleteRecordMutation = useDeleteRecord();
  const duplicateRecordMutation = useDuplicateRecord();
  const updateViewFiltersMutation = useUpdateViewFilters();
  const initializeModulesMutation = useInitializeSpecificModules();

  // Custom hook for sophisticated database retrieval
  const useDatabaseWithInitialization = (
    moduleType: EDatabaseType,
    providedDatabaseId?: string
  ) => {
    const [resolvedDatabaseId, setResolvedDatabaseId] = useState<string | null>(
      null
    );

    const { data: databasesByType, isLoading: isDatabasesByTypeLoading } =
      useDatabaseByModuleType(moduleType);

    // Step 1: If databaseId is provided by parent, use it directly
    useEffect(() => {
      if (providedDatabaseId) {
        setResolvedDatabaseId(providedDatabaseId);
        return;
      }

      // Step 2: If not provided, try to find database by moduleType
      if (databasesByType?.data && databasesByType.data.length > 0) {
        setResolvedDatabaseId(databasesByType.data[0].id);
        return;
      }

      // Step 3: If no database found, initialize the module
      if (
        !isDatabasesByTypeLoading &&
        databasesByType?.data &&
        databasesByType.data.length === 0
      ) {
        // Initialize the module using React Query mutation
        initializeModulesMutation.mutate({
          modules: [moduleType],
          createSampleData: false,
        });
      }
    }, [providedDatabaseId, databasesByType, moduleType, currentWorkspace?.id]);

    // Step 4: After initialization, get the database ID from the refetched data
    useEffect(() => {
      if (
        !providedDatabaseId &&
        databasesByType?.data &&
        databasesByType.data.length > 0
      ) {
        setResolvedDatabaseId(databasesByType.data[0].id);
      }
    }, [providedDatabaseId, databasesByType]);

    return {
      databaseId: resolvedDatabaseId,
      isLoading:
        isDatabasesByTypeLoading || initializeModulesMutation.isPending,
      isInitializing: initializeModulesMutation.isPending,
    };
  };

  const {
    databaseId: currentDatabaseId,
    isLoading: isDatabaseIdLoading,
    isInitializing,
  } = useDatabaseWithInitialization(moduleType, databaseId);

  const { data: database, isLoading: isDatabaseLoading } = useDatabase(
    currentDatabaseId || ""
  );
  const { data: viewsResponse, isLoading: isViewsLoading } = useViews(
    currentDatabaseId || ""
  );

  const defaultViewId =
    viewsResponse?.data?.find((view) => view?.isDefault)?.id || "";
  const effectiveViewId = currentViewId || defaultViewId || "";

  // Reset currentViewId if the selected view no longer exists
  useEffect(() => {
    if (viewsResponse?.data && currentViewId) {
      const viewExists = viewsResponse.data.some(
        (view) => view.id === currentViewId
      );
      if (!viewExists) {
        setCurrentViewId("");
      }
    }
  }, [viewsResponse?.data, currentViewId]);

  const { data: currentViewResponse, isLoading: isCurrentViewLoading } =
    useView(currentDatabaseId, effectiveViewId);

  // Derive filters from current view settings
  const filters = useMemo(() => {
    return currentViewResponse?.data?.settings?.filters || [];
  }, [currentViewResponse?.data?.settings?.filters]);

  // Derive temp filters and sorts from view settings
  const tempFilters = useMemo(() => {
    return currentViewResponse?.data?.settings?.filters || [];
  }, [currentViewResponse?.data?.settings?.filters]);

  const tempSorts = useMemo(() => {
    return (
      currentViewResponse?.data?.settings?.sorts?.map((sort) => ({
        propertyId: sort.property,
        direction:
          sort.direction === "ascending"
            ? "asc"
            : sort.direction === "descending"
            ? "desc"
            : "asc",
      })) || []
    );
  }, [currentViewResponse?.data?.settings?.sorts]);

  const propertiesQueryParams: TPropertyQueryParams = {
    viewId: effectiveViewId,
    includeHidden: false,
  };
  const { data: propertiesResponse, isLoading: isPropertiesLoading } =
    useProperties(currentDatabaseId, propertiesQueryParams);

  // Query for all properties (not filtered by view) for column visibility menu
  const allPropertiesQueryParams: TPropertyQueryParams = {
    includeHidden: true,
  };
  const { data: allPropertiesResponse, isLoading: isAllPropertiesLoading } =
    useProperties(currentDatabaseId, allPropertiesQueryParams);

  // Records query with offset/limit for Load More pagination
  // Use higher limit for board/kanban views that need to show all records
  const isBoardView =
    currentViewResponse?.data?.type === "board" ||
    currentViewResponse?.data?.type === "kanban";
  const recordLimit = isBoardView ? 1000 : 10;

  const recordQueryParams = {
    viewId: effectiveViewId,
    search: searchQuery,
    offset: currentOffset,
    limit: recordLimit,
    isArchived: false,
    isTemplate: false,
  };

  const { data: recordsResponse, isLoading: isRecordsLoading } = useRecords(
    currentDatabaseId,
    recordQueryParams
  );

  // Track initial loading vs Load More loading
  const isInitialLoading = isRecordsLoading && currentOffset === 0;

  // Reset pagination when database or view changes
  useEffect(() => {
    setCurrentOffset(0);
    setAccumulatedRecords([]);
    setIsLoadingMore(false);
    // Invalidate records query to ensure fresh data on navigation
    queryClient.invalidateQueries({
      queryKey: DATABASE_KEYS.records(currentDatabaseId),
    });
  }, [currentDatabaseId, effectiveViewId, queryClient]);

  // Update accumulated records when new data arrives
  useEffect(() => {
    if (recordsResponse?.data) {
      if (currentOffset === 0) {
        // First load or reset
        setAccumulatedRecords(recordsResponse.data);
      } else {
        // Append for Load More
        setAccumulatedRecords((prev) => [...prev, ...recordsResponse.data]);
      }
    }
  }, [recordsResponse?.data, currentOffset]);

  // Derive hasMoreRecords from current query response
  const hasMoreRecords = useMemo(() => {
    return recordsResponse?.data
      ? recordsResponse.data.length === recordLimit
      : false;
  }, [recordsResponse?.data, recordLimit]);

  const loadMoreRecords = async () => {
    if (isLoadingMore || !hasMoreRecords) return;

    setIsLoadingMore(true);
    setCurrentOffset((prev) => prev + 10);
    setIsLoadingMore(false);
  };

  const visibleProperties =
    propertiesResponse?.data?.filter((property: TProperty) => {
      if (
        currentViewResponse?.data?.settings?.visibleProperties &&
        currentViewResponse?.data.settings?.visibleProperties?.length > 0
      ) {
        return currentViewResponse?.data?.settings?.visibleProperties?.includes(
          property?.id
        );
      }
      return property?.isVisible ?? true;
    }) || [];

  const onDialogOpen = (dialog: DatabaseDialogType | null) =>
    setDialogOpen(dialog);
  const onViewChange = (viewId: string) => setCurrentViewId(viewId);
  const onRecordChange = (record: TRecord | null) => setCurrentRecord(record);
  const onPropertyChange = (property: TProperty | null) =>
    setCurrentProperty(property);
  const onSelectedRecordsChange = (records: Set<string>) =>
    setSelectedRecords(records);
  const onSearchQueryChange = (query: string) => setSearchQuery(query);
  const onFiltersChange = async (newFilters: TFilterCondition[]) => {
    if (currentDatabaseId && currentViewId) {
      try {
        await updateViewFiltersMutation.mutateAsync({
          databaseId: currentDatabaseId,
          viewId: currentViewId,
          filters: newFilters,
        });
        // Filters will be updated when view is refetched
      } catch (error) {
        console.error("Failed to update filters:", error);
      }
    }
  };
  const onSortsChange = (newSorts: TSortConfig[]) => setSorts(newSorts);

  const onBulkEdit = () => onDialogOpen("bulk-edit");
  const onBulkDelete = () => onDialogOpen("bulk-delete");

  const onRecordEdit = (record: TRecord) => {
    onRecordChange(record);
    onDialogOpen("edit-record");
  };

  const onRecordDelete = (recordId: string) => {
    if (currentDatabaseId) {
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
    if (currentDatabaseId) {
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

  const onRecordCreate = () => {
    if (currentDatabaseId) {
      createRecordMutation.mutate(
        {
          databaseId: currentDatabaseId,
          data: { properties: {} },
        },
        {
          onError: () => {
            toast.error("Failed to create record. Please try again.");
          },
        }
      );
    } else {
      toast.error("Database not available. Please wait for it to load.");
    }
  };
  const onAddProperty = () => onDialogOpen("create-property");

  const contextValue: DatabaseViewContextValue = {
    moduleType,
    workspace: currentWorkspace,
    dialogOpen,
    database: database?.data || null,
    views: viewsResponse?.data || [],
    currentView: currentViewResponse?.data || null,
    properties: propertiesResponse?.data || [],
    allProperties: allPropertiesResponse?.data || [],
    records: accumulatedRecords,
    currentRecord,
    currentProperty,

    isDatabaseIdLoading,
    isInitializing,
    isDatabaseLoading,
    isViewsLoading,
    isPropertiesLoading,
    isAllPropertiesLoading,
    isRecordsLoading,
    isInitialLoading,
    isCurrentViewLoading,
    isLoadingMore,
    hasMoreRecords,

    selectedRecords,
    visibleProperties,

    searchQuery,
    filters,
    tempFilters,
    setTempFilters: () => {}, // Placeholder - not used in current implementation
    tempSorts,
    setTempSorts: () => {}, // Placeholder - not used in current implementation
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
    onLoadMoreRecords: loadMoreRecords,
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
