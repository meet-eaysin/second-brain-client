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
  useRecords,
  useUpdateRecord,
  useUpdateView,
  useViews,
} from "@/modules/document-view/services/database-queries.ts";
import { createModuleApi } from "@/modules/document-view/services/api-service.ts";
import {
  EDatabaseType,
  type IDatabaseView,
  type IRecord,
  type IRecordQueryParams,
} from "@/modules/document-view";
import { DatabasePrimaryButtons } from "@/modules/document-view/components/document-primary-buttons.tsx";
import { DocumentViewTabs } from "@/modules/document-view/components/document-view-tabs.tsx";
import { TableToolbar } from "@/modules/document-view";
import { DocumentViewRenderer } from "@/modules/document-view/components/document-view-renderer.tsx";
import { DatabaseDialogs } from "@/modules/document-view/components/document-view-dialogs.tsx";

export interface DocumentViewProps {
  // Module identification
  moduleType?: EDatabaseType | string;
  databaseId?: string;

  // Module configuration (from backend)
  moduleConfig?: IModuleConfig;

  // UI Configuration
  config?: {
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
  };

  // Event handlers
  onRecordView?: (record: IRecord) => void;
  onRecordEdit?: (record: IRecord) => void;
  onRecordDelete?: (recordId: string) => void;
  onRecordCreate?: () => void;
  onRecordUpdate?: (recordId: string, updates: Record<string, unknown>) => void;

  // State
  isLoading?: boolean;
  error?: string | null;

  // Styling
  className?: string;
}

function DocumentViewInternal({
  databaseId,
  moduleType = "",
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
  const [currentViewId, setCurrentViewId] = useState<string | undefined>(
    config.defaultViewId
  );
  const { searchQuery, setSearchQuery } = useDocumentView();

  const {
    setCurrentSchema,
    setCurrentRecord,
    setCurrentView,
    setDialogOpen,
    setVisibleProperties,
  } = useDocumentView();

  // Fetch database data
  const { data: database, isLoading: databaseLoading } = useDatabase(
    databaseId || ""
  );

  // Fetch module database if needed
  const { data: moduleDatabase, isLoading: moduleDatabaseLoading } = useQuery({
    queryKey: moduleType && !databaseId ? ["module-database", moduleType] : [],
    queryFn: () => {
      if (moduleType && typeof moduleType === "string") {
        const apiService = createModuleApi(moduleType as EDatabaseType);
        return apiService.getDatabase();
      }
      return null;
    },
    enabled: !!moduleType && !databaseId && typeof moduleType === "string",
  });

  // Use module database if available, otherwise use regular database
  const effectiveDatabase = moduleDatabase || database;
  const effectiveDatabaseLoading = moduleDatabaseLoading || databaseLoading;

  // Fetch views
  const { data: views, isLoading: viewsLoading } = useViews(databaseId || "");

  // Fetch module views if needed
  const { data: moduleViews, isLoading: moduleViewsLoading } = useQuery({
    queryKey: moduleType && !databaseId ? ["module-views", moduleType] : [],
    queryFn: () => {
      if (moduleType && typeof moduleType === "string") {
        const apiService = createModuleApi(moduleType as EDatabaseType);
        return apiService.getViews();
      }
      return null;
    },
    enabled: !!moduleType && !databaseId && typeof moduleType === "string",
  });

  // Use module views if available, otherwise use regular views
  const effectiveViews = moduleViews ? { views: moduleViews } : views;
  const effectiveViewsLoading = moduleViewsLoading || viewsLoading;

  // Prepare record query params
  const recordQueryParams: IRecordQueryParams = {
    databaseId: databaseId || "",
    viewId: currentViewId,
    search: searchQuery,
    page: 1,
    limit: 50,
    isArchived: false,
    isTemplate: false,
  };

  // Fetch records
  const { data: recordsResponse, isLoading: recordsLoading } = useRecords(
    databaseId || "",
    recordQueryParams
  );

  // Fetch module records if needed
  const { data: moduleRecordsResponse, isLoading: moduleRecordsLoading } =
    useQuery({
      queryKey:
        moduleType && !databaseId
          ? ["module-records", moduleType, recordQueryParams]
          : [],
      queryFn: () => {
        if (moduleType && typeof moduleType === "string") {
          const apiService = createModuleApi(moduleType as EDatabaseType);
          return apiService.getRecords(recordQueryParams);
        }
        return null;
      },
      enabled: !!moduleType && !databaseId && typeof moduleType === "string",
    });

  // Use module records if available, otherwise use regular records
  const effectiveRecordsResponse = moduleRecordsResponse || recordsResponse;
  const effectiveRecordsLoading = moduleRecordsLoading || recordsLoading;
  const records = effectiveRecordsResponse?.records || [];

  // Mutations
  const updateRecordMutation = useUpdateRecord();
  const deleteRecordMutation = useDeleteRecord();
  const updateViewMutation = useUpdateView();

  const currentView =
    effectiveViews?.views?.find((v: IDatabaseView) => v.id === currentViewId) ||
    effectiveViews?.views?.find(
      (v: IDatabaseView) => v.id === config.defaultViewId
    ) ||
    effectiveViews?.views?.find((v: IDatabaseView) => v.isDefault) ||
    effectiveViews?.views?.[0];

  useEffect(() => {
    if (effectiveDatabase) {
      setCurrentSchema(effectiveDatabase);

      const initialVisibility =
        effectiveDatabase.properties?.reduce(
          (acc, prop) => ({ ...acc, [prop.id]: true }),
          {}
        ) || {};
      setVisibleProperties(initialVisibility);
    }
  }, [effectiveDatabase, setCurrentSchema, setVisibleProperties]);

  useEffect(() => {
    if (effectiveViews?.views && currentViewId) {
      const view = effectiveViews.views.find(
        (v: IDatabaseView) => v.id === currentViewId
      );
      if (view) setCurrentView(view);
    }
  }, [effectiveViews, currentViewId, setCurrentView]);

  useEffect(() => {
    if (!currentViewId && currentView) setCurrentViewId(currentView.id);
  }, [currentViewId, currentView]);

  if (
    isLoading ||
    effectiveDatabaseLoading ||
    effectiveViewsLoading ||
    effectiveRecordsLoading
  ) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h3 className="text-lg font-medium mb-2">Error</h3>
        <p className="text-muted-foreground text-center">{error}</p>
      </div>
    );
  }

  if (!effectiveDatabase) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h3 className="text-lg font-medium mb-2">No Data</h3>
        <p className="text-muted-foreground text-center">
          No database data available
        </p>
      </div>
    );
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
    if (config.canEdit === false) return;
    if (onRecordEdit) {
      onRecordEdit(record);
    } else {
      setCurrentRecord(record);
      setDialogOpen("edit-record");
    }
  };

  const handleRecordDelete = async (recordId: string) => {
    if (config.canDelete === false) return;

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
          databaseId: databaseId || "",
          recordId,
        });
        toast.success("Record deleted successfully");
      } catch (error: unknown) {
        toast.error(error?.message || "Failed to delete record");
      }
    }
  };

  const handleBulkDelete = async (recordIds: string[]) => {
    if (config.canDelete === false) return;

    if (effectiveDatabase?.isArchived) {
      toast.error("Cannot delete records: Database is archived");
      return;
    }

    try {
      await Promise.all(
        recordIds.map((id) =>
          deleteRecordMutation.mutateAsync({
            databaseId: databaseId || "",
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
    if (config.canEdit === false) return;
    setCurrentRecord(records[0]); // Set first record as context
    setDialogOpen("bulk-edit");
  };

  const handleAddProperty = () => {
    if (config.canEdit === false) return;
    setDialogOpen("create-property");
  };

  const handleRecordCreate = () => {
    if (config.canCreate === false) return;

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
    if (config.canEdit === false) return;

    if (effectiveDatabase?.isArchived) {
      toast.error("Cannot update records: Database is archived");
      return;
    }

    if (onRecordUpdate) {
      onRecordUpdate(recordId, updates);
    } else {
      try {
        await updateRecordMutation.mutateAsync({
          databaseId: databaseId || "",
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
          databaseId: databaseId || "",
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
          databaseId: databaseId || "",
          viewId: currentView.id,
          data: { sorts },
        });
        toast.success("Sorts updated successfully");
      } catch (error: unknown) {
        toast.error(error.message || "Failed to update sorts");
      }
    }
  };

  return (
    <div className={`flex flex-col ${className || ""}`}>
      <div className="flex-shrink-0 mb-4 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            {config.title ||
              moduleConfig?.name ||
              effectiveDatabase?.name ||
              "Document View"}
            {moduleConfig?.icon && (
              <span className="text-lg">{moduleConfig.icon}</span>
            )}
            {(config.isFrozen || effectiveDatabase?.isArchived) && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                Frozen
              </span>
            )}
          </h2>
          <p className="text-muted-foreground">
            {config.description ||
              moduleConfig?.description ||
              `${records.length} records • ${
                effectiveViews?.views?.length || 0
              } views`}
          </p>
        </div>
        <DatabasePrimaryButtons />
      </div>

      {config.enableViews !== false &&
        effectiveViews?.views &&
        effectiveViews.views.length > 0 && (
          <div className="flex-shrink-0 mb-4">
            <DocumentViewTabs
              views={effectiveViews.views}
              currentViewId={currentViewId}
              databaseId={databaseId}
              moduleType={moduleType}
              isFrozen={
                effectiveDatabase?.isArchived || config.isFrozen || false
              }
              onViewChange={handleViewChange}
            />
          </div>
        )}

      {(config.enableSearch !== false ||
        config.enableFilters !== false ||
        config.enableSorts !== false) && (
        <div className="flex-shrink-0 mb-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <TableToolbar
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                properties={effectiveDatabase.properties || []}
                records={records}
                currentView={currentView}
                onFiltersChange={handleFiltersChange}
                onSortsChange={handleSortsChange}
                onUpdateView={async (viewId, data) => {
                  await updateViewMutation.mutateAsync({
                    databaseId: databaseId || "",
                    viewId,
                    data,
                  });
                }}
                visibleProperties={effectiveDatabase.properties
                  ?.filter((p) => p.isVisible)
                  .map((p) => p.id)}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto">
        {currentView ? (
          <DocumentViewRenderer
            view={currentView}
            properties={effectiveDatabase.properties || []}
            records={records}
            onRecordSelect={handleRecordSelect}
            onRecordEdit={handleRecordEdit}
            onRecordDelete={handleRecordDelete}
            onRecordCreate={handleRecordCreate}
            onRecordUpdate={handleRecordUpdate}
            onBulkDelete={handleBulkDelete}
            onBulkEdit={handleBulkEdit}
            onAddProperty={handleAddProperty}
            databaseId={config.dataSourceId || effectiveDatabase.id}
            moduleType={moduleType}
            isFrozen={effectiveDatabase?.isArchived || config.isFrozen || false}
            disablePropertyManagement={
              config.disablePropertyManagement || false
            }
            apiFrozenConfig={config.apiFrozenConfig}
          />
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">No View Available</h3>
              <p className="text-muted-foreground">
                {effectiveViews?.views?.length === 0
                  ? "Create a view to display your data."
                  : "Select a view to display your data."}
              </p>
            </div>
          </div>
        )}
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
