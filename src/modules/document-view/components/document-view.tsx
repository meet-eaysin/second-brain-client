import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { useCurrentWorkspace } from "@/modules/workspaces/context/workspace-context";
import { workspaceApi } from "@/modules/workspaces/services/workspaceApi";
import { apiClient } from "@/services/api-client";

export interface DocumentViewProps {
  moduleType?: EDatabaseType | string;
  databaseId?: string;
  workspaceId?: string;
  moduleConfig?: IModuleConfig;
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
  onRecordView?: (record: IRecord) => void;
  onRecordEdit?: (record: IRecord) => void;
  onRecordDelete?: (recordId: string) => void;
  onRecordCreate?: () => void;
  onRecordUpdate?: (recordId: string, updates: Record<string, unknown>) => void;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}

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
  const [currentViewId, setCurrentViewId] = useState<string | undefined>(
    config.defaultViewId
  );
  const { searchQuery, setSearchQuery } = useDocumentView();
  const currentWorkspace = useCurrentWorkspace();
  const queryClient = useQueryClient();

  const { data: primaryWorkspace } = useQuery({
    queryKey:
      !workspaceId && !currentWorkspace?.id ? ["primary-workspace"] : [],
    queryFn: () => workspaceApi.getPrimaryWorkspace(),
    enabled: !workspaceId && !currentWorkspace?.id,
  });

  const effectiveWorkspaceId =
    workspaceId ||
    currentWorkspace?._id ||
    currentWorkspace?.id ||
    primaryWorkspace?._id ||
    primaryWorkspace?.id;

  const {
    setCurrentSchema,
    setCurrentRecord,
    setCurrentView,
    setDialogOpen,
    setVisibleProperties,
  } = useDocumentView();

  const { data: moduleStatus, isLoading: moduleStatusLoading } = useQuery({
    queryKey:
      moduleType && !databaseId && effectiveWorkspaceId
        ? ["module-status", moduleType, effectiveWorkspaceId]
        : [],
    queryFn: async () => {
      if (!moduleType || !effectiveWorkspaceId || databaseId) return null;

      try {
        const response = await apiClient.get(
          `/modules/workspace/${effectiveWorkspaceId}/${moduleType}/status`
        );
        return response.data;
      } catch {
        return { isInitialized: false };
      }
    },
    enabled: !!moduleType && !databaseId && !!effectiveWorkspaceId,
  });

  const { data: moduleDatabaseId, isLoading: moduleDatabaseIdLoading } =
    useQuery({
      queryKey:
        moduleType &&
        !databaseId &&
        effectiveWorkspaceId &&
        moduleStatus?.isInitialized
          ? ["module-database-id", moduleType, effectiveWorkspaceId]
          : [],
      queryFn: async () => {
        if (
          !moduleType ||
          !effectiveWorkspaceId ||
          !moduleStatus?.isInitialized
        )
          return null;

        const response = await apiClient.get(
          `/modules/workspace/${effectiveWorkspaceId}/${moduleType}/database-id`
        );
        return response.data.databaseId;
      },
      enabled:
        !!moduleType &&
        !databaseId &&
        !!effectiveWorkspaceId &&
        moduleStatus?.isInitialized,
    });

  const initializeModuleMutation = useMutation({
    mutationFn: async () => {
      if (!moduleType || !effectiveWorkspaceId)
        throw new Error("Module type or workspace not available");

      const response = await apiClient.post(
        `/modules/workspace/${effectiveWorkspaceId}/initialize`,
        {
          modules: [moduleType],
          createSampleData: false,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["module-status", moduleType, effectiveWorkspaceId],
      });
      toast.success("Module initialized successfully");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to initialize module");
    },
  });

  useEffect(() => {
    if (
      moduleType &&
      !databaseId &&
      effectiveWorkspaceId &&
      moduleStatus &&
      !moduleStatus.isInitialized &&
      !moduleStatusLoading
    ) {
      initializeModuleMutation.mutate();
    }
  }, [
    moduleType,
    databaseId,
    effectiveWorkspaceId,
    moduleStatus,
    moduleStatusLoading,
  ]);

  const effectiveDatabaseId = moduleDatabaseId || databaseId;

  const { data: database, isLoading: databaseLoading } = useDatabase(
    effectiveDatabaseId || ""
  );

  const effectiveDatabase = database;
  const effectiveDatabaseLoading = databaseLoading;

  const { data: views, isLoading: viewsLoading } = useViews(
    effectiveDatabaseId || ""
  );

  const effectiveViews = views;
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
    effectiveRecordsLoading ||
    moduleStatusLoading ||
    moduleDatabaseIdLoading ||
    initializeModuleMutation.isPending ||
    (!workspaceId &&
      !currentWorkspace?._id &&
      !currentWorkspace?.id &&
      !primaryWorkspace)
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

  // If we don't have a workspaceId, show no workspace message
  if (!effectiveWorkspaceId) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h3 className="text-lg font-medium mb-2">No Workspace</h3>
        <p className="text-muted-foreground text-center">
          No workspace available. Please create or select a workspace first.
        </p>
      </div>
    );
  }

  // If we don't have a databaseId, show no database message
  if (!effectiveDatabaseId) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h3 className="text-lg font-medium mb-2">No Database</h3>
        <p className="text-muted-foreground text-center">
          Database not initialized. Please try refreshing the page.
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
    if (config.canDelete === false) return;

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
    if (config.canEdit === false) return;
    setCurrentRecord(records[0]);
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
              databaseId={effectiveDatabaseId}
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
                properties={effectiveDatabase?.properties || []}
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
                visibleProperties={effectiveDatabase?.properties
                  ?.filter((p) => p.isVisible)
                  .map((p) => p.id)}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto">
        {effectiveDatabaseLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : currentView ? (
          <DocumentViewRenderer
            view={currentView}
            properties={effectiveDatabase?.properties || []}
            records={records}
            onRecordSelect={handleRecordSelect}
            onRecordEdit={handleRecordEdit}
            onRecordDelete={handleRecordDelete}
            onRecordCreate={handleRecordCreate}
            onRecordUpdate={handleRecordUpdate}
            onBulkDelete={handleBulkDelete}
            onBulkEdit={handleBulkEdit}
            onAddProperty={handleAddProperty}
            databaseId={
              config.dataSourceId ||
              effectiveDatabaseId ||
              effectiveDatabase?.id
            }
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
