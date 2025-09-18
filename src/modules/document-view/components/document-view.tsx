import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import type { IModuleConfig } from "@/modules/document-view/services/api-service.ts";
import {
  DocumentViewProvider,
  useDocumentView,
} from "@/modules/document-view/context/document-view-context.tsx";
import {
  useDatabase,
  useDeleteRecord,
  useProperties,
  useRecords,
  useUpdateRecord,
  useUpdateView,
  useViews,
} from "@/modules/document-view/services/database-queries.ts";
import {
  EDatabaseType,
  type IDatabase,
  type IDatabaseView,
  type IRecord,
  type IRecordQueryParams,
} from "@/modules/document-view";
import { DatabasePrimaryButtons } from "@/modules/document-view/components/document-primary-buttons.tsx";
import { DocumentViewTabs } from "@/modules/document-view/components/document-view-tabs.tsx";
import { TableToolbar } from "@/modules/document-view";
import { DocumentViewRenderer } from "@/modules/document-view/components/document-view-renderer.tsx";
import { DatabaseDialogs } from "@/modules/document-view/components/document-view-dialogs.tsx";
import { useCurrentWorkspace } from "@/modules/workspaces/context/workspace-context";
import { workspaceApi } from "@/modules/workspaces/services/workspaceApi";
import type { IDatabaseProperty } from "@/modules/document-view/types";

export interface IDocumentViewConfig {
  title?: string;
  icon?: string;
  description?: string;
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canShare?: boolean;
  enableViews?: boolean;
  enableSearch?: boolean;
  enableFilters?: boolean;
  enableSorts?: boolean;
  isFrozen?: boolean;
  defaultViewId?: string;
  dataSourceId?: string;
  dataSourceType?: string;
  disablePropertyManagement?: boolean;
  apiFrozenConfig?: string;
}

export interface DocumentViewProps {
  moduleType?: EDatabaseType | string;
  databaseId?: string;
  workspaceId?: string;
  moduleConfig?: IModuleConfig;
  config?: IDocumentViewConfig;
  onRecordView?: (record: IRecord) => void;
  onRecordEdit?: (record: IRecord) => void;
  onRecordDelete?: (recordId: string) => void;
  onRecordCreate?: () => void;
  onRecordUpdate?: (recordId: string, updates: Record<string, unknown>) => void;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}

// Loading Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

// Error Component
const ErrorMessage = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center h-64">
    <h3 className="text-lg font-medium mb-2">Error</h3>
    <p className="text-muted-foreground text-center">{message}</p>
  </div>
);

// No Workspace Component
const NoWorkspaceMessage = () => (
  <div className="flex flex-col items-center justify-center h-64">
    <h3 className="text-lg font-medium mb-2">No Workspace</h3>
    <p className="text-muted-foreground text-center">
      No workspace available. Please create or select a workspace first.
    </p>
  </div>
);

// No Database Component
const NoDatabaseMessage = () => (
  <div className="flex flex-col items-center justify-center h-64">
    <h3 className="text-lg font-medium mb-2">No Database</h3>
    <p className="text-muted-foreground text-center">
      Database not initialized. Please try refreshing the page.
    </p>
  </div>
);

// No View Component
const NoViewMessage = ({ message }: { message: string }) => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <h3 className="text-lg font-medium mb-2">No View Available</h3>
      <p className="text-muted-foreground">{message}</p>
    </div>
  </div>
);

// Main Content Component
const DocumentContent = ({
  effectiveDatabaseLoading,
  currentView,
  effectiveDatabase,
  effectiveProperties,
  records,
  moduleType,
  typedConfig,
  getNoViewMessage,
  getEffectiveDatabaseId,
  handleRecordSelect,
  handleRecordEdit,
  handleRecordDelete,
  handleRecordCreate,
  handleRecordUpdate,
  handleBulkDelete,
  handleBulkEdit,
  handleAddProperty,
}: {
  effectiveDatabaseLoading: boolean;
  currentView: IDatabaseView | undefined;
  effectiveDatabase: IDatabase | undefined;
  effectiveProperties: IDatabaseProperty[];
  records: IRecord[];
  moduleType: string;
  typedConfig: IDocumentViewConfig;
  getNoViewMessage: () => string;
  getEffectiveDatabaseId: () => string;
  handleRecordSelect: (record: IRecord) => void;
  handleRecordEdit: (record: IRecord) => void;
  handleRecordDelete: (recordId: string) => Promise<void>;
  handleRecordCreate: () => void;
  handleRecordUpdate: (
    recordId: string,
    updates: Record<string, unknown>
  ) => Promise<void>;
  handleBulkDelete: (recordIds: string[]) => Promise<void>;
  handleBulkEdit: (records: IRecord[]) => void;
  handleAddProperty: () => void;
}) => {
  if (effectiveDatabaseLoading) {
    return <LoadingSpinner />;
  }

  if (!currentView) {
    return <NoViewMessage message={getNoViewMessage()} />;
  }

  return (
    <DocumentViewRenderer
      view={currentView}
      properties={effectiveProperties}
      records={records}
      onRecordSelect={handleRecordSelect}
      onRecordEdit={handleRecordEdit}
      onRecordDelete={handleRecordDelete}
      onRecordCreate={handleRecordCreate}
      onRecordUpdate={handleRecordUpdate}
      onBulkDelete={handleBulkDelete}
      onBulkEdit={handleBulkEdit}
      onAddProperty={handleAddProperty}
      databaseId={getEffectiveDatabaseId()}
      moduleType={moduleType}
      isFrozen={effectiveDatabase?.isArchived || typedConfig.isFrozen || false}
      disablePropertyManagement={typedConfig.disablePropertyManagement || false}
      apiFrozenConfig={typedConfig.apiFrozenConfig}
    />
  );
};

function DocumentViewInternal({
  databaseId,
  moduleType = "",
  workspaceId,
  moduleConfig,
  config = {},
  onRecordView,
  onRecordEdit,
  onRecordDelete,
  onRecordCreate,
  onRecordUpdate,
  isLoading = false,
  error = null,
  className,
}: DocumentViewProps) {
  // Ensure config has proper typing
  const typedConfig: IDocumentViewConfig = config || {};
  const [currentViewId, setCurrentViewId] = useState<string | undefined>(
    typedConfig.defaultViewId
  );
  const { searchQuery, setSearchQuery } = useDocumentView();
  const currentWorkspace = useCurrentWorkspace();

  // Helper function to determine if primary workspace query should run
  const shouldFetchPrimaryWorkspace = () => {
    return !workspaceId && !currentWorkspace?._id && !currentWorkspace?.id;
  };

  const { data: primaryWorkspace } = useQuery({
    queryKey: shouldFetchPrimaryWorkspace() ? ["primary-workspace"] : [],
    queryFn: () => workspaceApi.getPrimaryWorkspace(),
    enabled: shouldFetchPrimaryWorkspace(),
  });

  // Helper function to get effective workspace ID
  const getEffectiveWorkspaceId = () => {
    return (
      workspaceId ||
      currentWorkspace?._id ||
      currentWorkspace?.id ||
      primaryWorkspace?._id ||
      primaryWorkspace?.id
    );
  };

  const effectiveWorkspaceId = getEffectiveWorkspaceId();

  const {
    setCurrentSchema,
    setCurrentRecord,
    setCurrentView,
    setDialogOpen,
    setVisibleProperties,
  } = useDocumentView();

  const { data: moduleInfo, isLoading: moduleInfoLoading } = useQuery({
    queryKey:
      moduleType && !databaseId && effectiveWorkspaceId
        ? ["module-info", moduleType, effectiveWorkspaceId]
        : [],
    queryFn: async () => {
      if (!moduleType || !effectiveWorkspaceId || databaseId) return null;

      try {
        // Try to get database ID first (works if module is initialized)
        try {
          const dbIdResponse = await workspaceApi.getModuleDatabaseId(
            effectiveWorkspaceId,
            moduleType
          );
          return {
            isInitialized: true,
            databaseId: dbIdResponse.databaseId,
          };
        } catch {
          // Database ID not found, try to initialize
          try {
            await workspaceApi.initializeWorkspaceModules(
              effectiveWorkspaceId,
              [moduleType],
              false
            );

            // Now get the database ID
            const dbIdResponse = await workspaceApi.getModuleDatabaseId(
              effectiveWorkspaceId,
              moduleType
            );
            return {
              isInitialized: true,
              databaseId: dbIdResponse.databaseId,
            };
          } catch (initError) {
            console.error("Module initialization error:", initError);
            return { isInitialized: false, databaseId: null };
          }
        }
      } catch (error) {
        console.error("Module setup error:", error);
        return { isInitialized: false, databaseId: null };
      }
    },
    enabled: !!moduleType && !databaseId && !!effectiveWorkspaceId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      if (
        error?.status === 404 ||
        error?.status === 401 ||
        error?.status === 403
      ) {
        return false;
      }
      return failureCount < 2;
    },
  });

  const moduleDatabaseId = moduleInfo?.databaseId || null;

  const effectiveDatabaseId = moduleDatabaseId || databaseId;

  const { data: database, isLoading: databaseLoading } = useDatabase(
    effectiveDatabaseId || ""
  );

  const effectiveDatabase = database?.data;
  const effectiveDatabaseLoading = databaseLoading;

  const { data: propertiesResponse, isLoading: propertiesLoading } =
    useProperties(effectiveDatabaseId || "");

  const effectiveProperties = propertiesResponse?.data || [];
  const effectivePropertiesLoading = propertiesLoading;

  const { data: views, isLoading: viewsLoading } = useViews(
    effectiveDatabaseId || ""
  );

  const effectiveViews = views?.data;
  const effectiveViewsLoading = viewsLoading;

  const recordQueryParams: IRecordQueryParams = {
    databaseId: effectiveDatabaseId || "",
    viewId: currentViewId,
    search: searchQuery,
    page: 1,
    limit: 50,
    isArchived: false,
    isTemplate: false,
  };

  const { data: recordsResponse, isLoading: recordsLoading } = useRecords(
    effectiveDatabaseId || "",
    recordQueryParams
  );

  const effectiveRecordsResponse = recordsResponse;
  const effectiveRecordsLoading = recordsLoading;
  const records = effectiveRecordsResponse?.records || [];

  const updateRecordMutation = useUpdateRecord();
  const deleteRecordMutation = useDeleteRecord();
  const updateViewMutation = useUpdateView();

  // Helper function to determine the current view with clear priority
  const getCurrentView = (): IDatabaseView | undefined => {
    if (!effectiveViews) return undefined;

    // Priority 1: View matching currentViewId
    const viewById = effectiveViews.find(
      (v: IDatabaseView) => v.id === currentViewId
    );
    if (viewById) return viewById;

    // Priority 2: View matching config.defaultViewId
    const viewByConfigDefault = effectiveViews.find(
      (v: IDatabaseView) => v.id === typedConfig.defaultViewId
    );
    if (viewByConfigDefault) return viewByConfigDefault;

    // Priority 3: Default view
    const defaultView = effectiveViews.find((v: IDatabaseView) => v.isDefault);
    if (defaultView) return defaultView;

    // Priority 4: First available view
    return effectiveViews[0];
  };

  const currentView = getCurrentView();

  useEffect(() => {
    if (effectiveDatabase && effectiveProperties.length > 0) {
      setCurrentSchema(effectiveDatabase);

      const initialVisibility =
        effectiveProperties.reduce(
          (acc, prop) => ({ ...acc, [prop.id]: true }),
          {}
        ) || {};
      setVisibleProperties(initialVisibility);
    }
  }, [
    effectiveDatabase,
    effectiveProperties,
    setCurrentSchema,
    setVisibleProperties,
  ]);

  useEffect(() => {
    if (effectiveViews && currentViewId) {
      const view = effectiveViews.find(
        (v: IDatabaseView) => v.id === currentViewId
      );
      if (view) setCurrentView(view);
    }
  }, [effectiveViews, currentViewId, setCurrentView]);

  useEffect(() => {
    if (!currentViewId && currentView) setCurrentViewId(currentView.id);
  }, [currentViewId, currentView]);

  // Helper function to determine if we should show loading state
  const shouldShowLoading = (): boolean => {
    // Basic loading states
    if (
      isLoading ||
      effectiveDatabaseLoading ||
      effectiveViewsLoading ||
      effectiveRecordsLoading ||
      effectivePropertiesLoading ||
      moduleInfoLoading
    ) {
      return true;
    }

    // Check if we need workspace but don't have one
    const hasWorkspaceId =
      workspaceId ||
      currentWorkspace?._id ||
      currentWorkspace?.id ||
      primaryWorkspace;
    if (!hasWorkspaceId) {
      return true;
    }

    return false;
  };

  // Early returns for different states
  if (shouldShowLoading()) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!effectiveWorkspaceId) {
    return <NoWorkspaceMessage />;
  }

  if (!effectiveDatabaseId) {
    return <NoDatabaseMessage />;
  }

  const handleViewChange = (viewId: string) => setCurrentViewId(viewId);

  const handleRecordSelect = (record: IRecord) => {
    if (onRecordView) {
      onRecordView(record);
    } else {
      setCurrentRecord(record);
      setDialogOpen("view-record");
    }
  };

  const handleRecordEdit = (record: IRecord) => {
    if (typedConfig.canEdit === false) return;
    if (onRecordEdit) {
      onRecordEdit(record);
    } else {
      setCurrentRecord(record);
      setDialogOpen("edit-record");
    }
  };

  const handleRecordDelete = async (recordId: string) => {
    if (typedConfig.canDelete === false) return;

    if (effectiveDatabase?.isArchived) {
      toast.error("Cannot delete records: Database is archived");
      return;
    }

    if (onRecordDelete) {
      const record = records.find((r: IRecord) => r.id === recordId);
      if (record) onRecordDelete(recordId);
    } else {
      try {
        await deleteRecordMutation.mutateAsync({
          databaseId: effectiveDatabaseId || "",
          recordId,
        });
        toast.success("Record deleted successfully");
      } catch (error: unknown) {
        toast.error(error?.message || "Failed to delete record");
      }
    }
  };

  const handleBulkDelete = async (recordIds: string[]) => {
    if (typedConfig.canDelete === false) return;

    if (effectiveDatabase?.isArchived) {
      toast.error("Cannot delete records: Database is archived");
      return;
    }

    try {
      await Promise.all(
        recordIds.map((id) =>
          deleteRecordMutation.mutateAsync({
            databaseId: effectiveDatabaseId || "",
            recordId: id,
          })
        )
      );
      toast.success(`${recordIds.length} records deleted successfully`);
    } catch (error) {
      toast.error(error.message || "Failed to delete records");
    }
  };

  const handleBulkEdit = (records: IRecord[]) => {
    if (typedConfig.canEdit === false) return;
    setCurrentRecord(records[0]);
    setDialogOpen("bulk-edit");
  };

  const handleAddProperty = () => {
    if (typedConfig.canEdit === false) return;
    setDialogOpen("create-property");
  };

  const handleRecordCreate = () => {
    if (typedConfig.canCreate === false) return;

    if (effectiveDatabase?.isArchived) {
      toast.error("Cannot create records: Database is archived");
      return;
    }

    if (onRecordCreate) {
      onRecordCreate();
    } else {
      setCurrentRecord(null);
      setDialogOpen("create-record");
    }
  };

  const handleRecordUpdate = async (
    recordId: string,
    updates: Record<string, unknown>
  ) => {
    if (typedConfig.canEdit === false) return;

    if (effectiveDatabase?.isArchived) {
      toast.error("Cannot update records: Database is archived");
      return;
    }

    if (onRecordUpdate) {
      onRecordUpdate(recordId, updates);
    } else {
      try {
        await updateRecordMutation.mutateAsync({
          databaseId: effectiveDatabaseId || "",
          recordId,
          data: updates,
        });
        toast.success("Record updated successfully");
      } catch (error) {
        toast.error(error.message || "Failed to update record");
      }
    }
  };

  const handleFiltersChange = async (filters: Record<string, unknown>) => {
    if (currentView?.id) {
      try {
        await updateViewMutation.mutateAsync({
          databaseId: effectiveDatabaseId || "",
          viewId: currentView.id,
          data: { filters },
        });
        toast.success("Filters updated successfully");
      } catch (error) {
        toast.error(error.message || "Failed to update filters");
      }
    }
  };

  const handleSortsChange = async (sorts: Record<string, unknown>) => {
    if (currentView?.id) {
      try {
        await updateViewMutation.mutateAsync({
          databaseId: effectiveDatabaseId || "",
          viewId: currentView.id,
          data: { sorts },
        });
        toast.success("Sorts updated successfully");
      } catch (error: unknown) {
        toast.error(error.message || "Failed to update sorts");
      }
    }
  };

  // Helper functions for cleaner rendering
  const getDisplayTitle = (): string => {
    return (
      typedConfig.title ||
      moduleConfig?.name ||
      effectiveDatabase?.name ||
      "Document View"
    );
  };

  const getDisplayDescription = (): string => {
    if (typedConfig.description) return typedConfig.description;
    if (moduleConfig?.description) return moduleConfig.description;

    const recordCount = records.length;
    const viewCount = effectiveViews?.views?.length || 0;
    return `${recordCount} records • ${viewCount} views`;
  };

  const shouldShowFrozenBadge = (): boolean => {
    return !!(typedConfig.isFrozen || effectiveDatabase?.isArchived);
  };

  const getEffectiveDatabaseId = (): string => {
    return (
      typedConfig.dataSourceId ||
      effectiveDatabaseId ||
      effectiveDatabase?.id ||
      ""
    );
  };

  const getVisiblePropertyIds = (): string[] => {
    return (
      effectiveProperties.filter((p) => p.isVisible).map((p) => p.id) || []
    );
  };

  const getNoViewMessage = (): string => {
    if (!effectiveViews) return "Loading views...";
    return effectiveViews.length === 0
      ? "Create a view to display your data."
      : "Select a view to display your data.";
  };

  return (
    <div className={`flex flex-col ${className || ""}`}>
      <div className="flex-shrink-0 mb-4 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            {getDisplayTitle()}
            {moduleConfig?.icon && (
              <span className="text-lg">{moduleConfig.icon}</span>
            )}
            {shouldShowFrozenBadge() && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                Frozen
              </span>
            )}
          </h2>
          <p className="text-muted-foreground">{getDisplayDescription()}</p>
        </div>
        <DatabasePrimaryButtons />
      </div>

      {typedConfig.enableViews !== false &&
        effectiveViews &&
        effectiveViews.length > 0 && (
          <div className="flex-shrink-0 mb-4">
            <DocumentViewTabs
              views={effectiveViews}
              currentViewId={currentViewId}
              databaseId={effectiveDatabaseId}
              moduleType={moduleType}
              isFrozen={
                effectiveDatabase?.isArchived || typedConfig.isFrozen || false
              }
              onViewChange={handleViewChange}
            />
          </div>
        )}

      {(typedConfig.enableSearch !== false ||
        typedConfig.enableFilters !== false ||
        typedConfig.enableSorts !== false) && (
        <div className="flex-shrink-0 mb-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <TableToolbar
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                properties={effectiveProperties}
                records={records}
                currentView={currentView}
                onFiltersChange={handleFiltersChange}
                onSortsChange={handleSortsChange}
                onUpdateView={async (viewId, data) => {
                  await updateViewMutation.mutateAsync({
                    databaseId: effectiveDatabaseId || "",
                    viewId,
                    data,
                  });
                }}
                visibleProperties={getVisiblePropertyIds()}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto">
        <DocumentContent
          effectiveDatabaseLoading={effectiveDatabaseLoading}
          currentView={currentView}
          effectiveDatabase={effectiveDatabase}
          effectiveProperties={effectiveProperties}
          records={records}
          moduleType={moduleType}
          typedConfig={typedConfig}
          getNoViewMessage={getNoViewMessage}
          getEffectiveDatabaseId={getEffectiveDatabaseId}
          handleRecordSelect={handleRecordSelect}
          handleRecordEdit={handleRecordEdit}
          handleRecordDelete={handleRecordDelete}
          handleRecordCreate={handleRecordCreate}
          handleRecordUpdate={handleRecordUpdate}
          handleBulkDelete={handleBulkDelete}
          handleBulkEdit={handleBulkEdit}
          handleAddProperty={handleAddProperty}
        />
      </div>

      <DatabaseDialogs />
    </div>
  );
}

export function DocumentView(props: DocumentViewProps) {
  return (
    <DocumentViewProvider>
      <DocumentViewInternal {...props} />
    </DocumentViewProvider>
  );
}
