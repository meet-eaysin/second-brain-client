import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  DocumentViewProvider,
  useDocumentView,
} from "@/modules/document-view/context/document-view-context.tsx";
import {
  useDatabase,
  useDeleteRecord,
  useModuleConfig,
  useProperties,
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
import { DocumentViewTabs } from "@/modules/document-view/components/document-view-tabs";
import { TableToolbar } from "@/modules/document-view";
import { DocumentViewRenderer } from "@/modules/document-view/components/document-view-renderer";
import { DatabaseDialogs } from "@/modules/document-view/components/document-view-dialogs";
import { NoDataMessage } from "@/components/no-data-message.tsx";

import type {
  IDatabase,
  IDatabaseProperty,
  IProperty,
  IViewFilter,
  IViewSort,
} from "@/modules/document-view/types";
import type { AxiosError } from "axios";
import type { ApiError } from "@/types/api.types";
import { workspaceApi } from "@/modules/workspaces/services/workspace-api";
import { useWorkspace } from "@/modules/workspaces/context/workspace-context.tsx";
import {
    HeaderSkeleton,
    TableSkeleton,
    TabsSkeleton,
    ToolbarSkeleton
} from "@/modules/document-view/components/skeleton";

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
  moduleType: EDatabaseType;
  databaseId?: string;
  className?: string;
}

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
  isPropertiesLoading,
  isRecordsLoading,
}: {
  effectiveDatabaseLoading: boolean;
  currentView: IDatabaseView | undefined;
  effectiveDatabase: IDatabase | undefined;
  effectiveProperties: IDatabaseProperty[];
  records: IRecord[];
  moduleType: EDatabaseType;
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
  isPropertiesLoading: boolean;
  isRecordsLoading: boolean;
}) => {
  if (effectiveDatabaseLoading) return <TableSkeleton />;
  if (!currentView)
    return (
      <NoDataMessage title="No View Available" message={getNoViewMessage()} />
    );

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
      isPropertiesLoading={isPropertiesLoading}
      isRecordsLoading={isRecordsLoading}
    />
  );
};

function DocumentViewInternal({
  databaseId,
  moduleType,
  className,
}: DocumentViewProps) {
  const { data: config } = useModuleConfig(moduleType);
  console.log("## CONFIG", config);
  const typedConfig: IDocumentViewConfig = config?.data || {};
  const [currentViewId, setCurrentViewId] = useState<string | undefined>(
    typedConfig.defaultViewId
  );

  const { currentWorkspace } = useWorkspace();
  const { searchQuery, setSearchQuery } = useDocumentView();

  const workspaceId = currentWorkspace?._id;

  const {
    setCurrentSchema,
    setCurrentRecord,
    setCurrentView,
    setDialogOpen,
    setVisibleProperties,
  } = useDocumentView();

  const { data: moduleInfo } = useQuery({
    queryKey:
      moduleType && !databaseId && workspaceId
        ? ["module-info", moduleType, workspaceId]
        : [],
    queryFn: async () => {
      if (!moduleType || !workspaceId || databaseId) return null;

      try {
        try {
          const dbIdResponse = await workspaceApi.getModuleDatabaseId(
            workspaceId,
            moduleType
          );
          return {
            isInitialized: true,
            databaseId: dbIdResponse.databaseId,
          };
        } catch {
          try {
            await workspaceApi.initializeWorkspaceModules(
              workspaceId,
              [moduleType],
              false
            );

            const dbIdResponse = await workspaceApi.getModuleDatabaseId(
              workspaceId,
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
    enabled: !!moduleType && !databaseId && !!workspaceId,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: AxiosError<ApiError>) => {
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

  const effectiveDatabase = database;
  const effectiveDatabaseLoading = databaseLoading;

  const { data: propertiesResponse, isLoading: propertiesLoading } =
    useProperties(effectiveDatabaseId || "");

  const effectiveProperties = propertiesResponse || [];
  const effectivePropertiesLoading = propertiesLoading;

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

  const getCurrentView = (): IDatabaseView | undefined => {
    if (!effectiveViews || effectiveViews.length === 0) return undefined;

    const viewById = effectiveViews.find(
      (v: IDatabaseView) => v.id === currentViewId
    );
    if (viewById) return viewById;

    const viewByConfigDefault = effectiveViews.find(
      (v: IDatabaseView) => v.id === typedConfig.defaultViewId
    );
    if (viewByConfigDefault) return viewByConfigDefault;

    const defaultView = effectiveViews.find((v: IDatabaseView) => v.isDefault);
    if (defaultView) return defaultView;

    return effectiveViews[0];
  };

  const currentView = getCurrentView();

  useEffect(() => {
    if (effectiveDatabase && effectiveProperties.length > 0) {
      setCurrentSchema(effectiveDatabase);

      const initialVisibility =
        effectiveProperties.reduce(
          (acc: Record<string, boolean>, prop: IDatabaseProperty) => ({
            ...acc,
            [prop.id]: true,
          }),
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
      const view = effectiveViews?.find(
        (v: IDatabaseView) => v.id === currentViewId
      );
      if (view) setCurrentView(view);
    }
  }, [effectiveViews, currentViewId, setCurrentView]);

  useEffect(() => {
    if (!currentViewId && currentView) setCurrentViewId(currentView.id);
  }, [currentViewId, currentView]);

  if (!workspaceId)
    return (
      <NoDataMessage
        title="No Workspace"
        message="No workspace available. Please create or select a workspace first."
      />
    );
  if (!effectiveDatabaseId)
    return (
      <NoDataMessage
        title="No Database"
        message="Database not initialized. Please try refreshing the page."
      />
    );

  const handleViewChange = (viewId: string) => setCurrentViewId(viewId);

  const handleRecordSelect = (record: IRecord) => {
    setCurrentRecord(record);
    setDialogOpen("view-record");
  };

  const handleRecordEdit = (record: IRecord) => {
    if (typedConfig.canEdit === false) return;
    setCurrentRecord(record);
    setDialogOpen("edit-record");
  };

  const handleRecordDelete = async (recordId: string) => {
    if (typedConfig.canDelete === false) return;

    if (effectiveDatabase?.isArchived) {
      toast.error("Cannot delete records: Database is archived");
      return;
    }

    try {
      await deleteRecordMutation.mutateAsync({
        databaseId: effectiveDatabaseId || "",
        recordId,
      });
      toast.success("Record deleted successfully");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete record"
      );
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
    setCurrentRecord(records?.[0]);
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

    setCurrentRecord(null);
    setDialogOpen("create-record");
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
  };

  const handleFiltersChange = async (filters: IViewFilter[]) => {
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

  const handleSortsChange = async (sorts: IViewSort[]) => {
    if (currentView?.id) {
      try {
        await updateViewMutation.mutateAsync({
          databaseId: effectiveDatabaseId || "",
          viewId: currentView.id,
          data: { sorts },
        });
        toast.success("Sorts updated successfully");
      } catch (error) {
        toast.error(error.message || "Failed to update sorts");
      }
    }
  };

  const getDisplayTitle = (): string => {
    return typedConfig.title || effectiveDatabase?.name || "Document View";
  };

  const getDisplayDescription = (): string => {
    if (typedConfig.description) return typedConfig.description;

    const recordCount = records.length;
    const viewCount = effectiveViews?.length || 0;
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
      effectiveProperties
        .filter((p: IProperty) => p.isVisible)
        .map((p: IProperty) => p.id) || []
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
      {effectiveDatabaseLoading ? (
        <HeaderSkeleton />
      ) : (
        <div className="flex-shrink-0 mb-4 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              {getDisplayTitle()}
              {typedConfig?.icon && (
                <span className="text-lg">{typedConfig.icon}</span>
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
      )}

      {typedConfig.enableViews !== false && (
        <div className="flex-shrink-0 mb-4">
          {effectiveViewsLoading ? (
            <TabsSkeleton />
          ) : (
            effectiveViews &&
            effectiveViews.length > 0 && (
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
            )
          )}
        </div>
      )}

      {(typedConfig.enableSearch !== false ||
        typedConfig.enableFilters !== false ||
        typedConfig.enableSorts !== false) && (
        <div className="flex-shrink-0 mb-4">
          {effectivePropertiesLoading ? (
            <ToolbarSkeleton />
          ) : (
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <TableToolbar
                  moduleType={moduleType}
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
          )}
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
          isPropertiesLoading={effectivePropertiesLoading}
          isRecordsLoading={effectiveRecordsLoading}
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
