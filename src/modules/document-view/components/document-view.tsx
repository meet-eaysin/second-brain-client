import { useState, useEffect } from "react";
import { DocumentViewTabs } from "./document-view-tabs";
import { DocumentViewRenderer } from "./document-view-renderer";
import { DatabaseDialogs } from "./document-view-dialogs";
import { DatabasePrimaryButtons } from "./document-primary-buttons";
import {
  DocumentViewProvider,
  useDocumentView,
} from "../context/document-view-context";
import { TableToolbar } from "./table-toolbar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStandardModuleApiService } from "../services/dynamic-api-service";
import { toast } from "sonner";
import type { Document } from "@/modules/document-view";
import { DocumentRecord } from "@/types/document";

export interface DocumentViewProps {
  database?: Document;
  records?: DocumentRecord[];
  moduleType?: string;

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

  onRecordView?: (record) => void;
  onRecordEdit?: (record) => void;
  onRecordDelete?: (record) => void;
  onRecordCreate?: () => void;
  onRecordUpdate?: (recordId: string, updates: Record<string, unknown>) => void;

  isLoading?: boolean;
  error?: string | null;

  className?: string;
}

function DocumentViewInternal({
  database,
  records = [],
  moduleType = "",
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

  const queryClient = useQueryClient();
  const apiService = createStandardModuleApiService(moduleType);

  const updateFiltersMutation = useMutation({
    mutationFn: ({ viewId, filters }: { viewId: string; filters }) =>
      apiService.updateViewFilters(viewId, filters),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [moduleType, "views"] });
      queryClient.invalidateQueries({ queryKey: [moduleType, "view"] });
      toast.success("Filters updated successfully");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to update filters");
    },
  });

  const updateSortsMutation = useMutation({
    mutationFn: ({ viewId, sorts }: { viewId: string; sorts }) =>
      apiService.updateViewSorts(viewId, sorts),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [moduleType, "views"] });
      queryClient.invalidateQueries({ queryKey: [moduleType, "view"] });
      toast.success("Sorts updated successfully");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to update sorts");
    },
  });

  const views = database?.views || [];
  const properties = database?.properties || [];
  const currentView =
    views.find((v) => v.id === currentViewId) ||
    views.find((v) => v.id === config.defaultViewId) ||
    views.find((v) => v.isDefault) ||
    views[0];

  useEffect(() => {
    if (database) {
      setCurrentSchema(database);

      const initialVisibility =
        database.properties?.reduce(
          (acc, prop) => ({ ...acc, [prop.id]: true }),
          {}
        ) || {};
      setVisibleProperties(initialVisibility);
    }
  }, [database, setCurrentSchema, setVisibleProperties]);

  useEffect(() => {
    if (database?.views && currentViewId) {
      const view = database.views.find((v) => v.id === currentViewId);
      if (view) setCurrentView(view);
    }
  }, [database?.views, currentViewId, setCurrentView]);

  useEffect(() => {
    if (!currentViewId && currentView) setCurrentViewId(currentView.id);
  }, [currentViewId, currentView]);

  if (isLoading) {
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

  if (!database) {
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

  const handleRecordSelect = (record: DocumentRecord) => {
    if (onRecordView) {
      onRecordView(record);
    } else {
      setCurrentRecord(record);
      setDialogOpen("view-record");
    }
  };

  const handleRecordEdit = (record: DocumentRecord) => {
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

    if (database?.frozen) {
      toast.error("Cannot delete records: Database is frozen");
      return;
    }

    if (onRecordDelete) {
      const record = records.find((r) => r.id === recordId);
      if (record) onRecordDelete(record);
    } else {
      await apiService.deleteRecord(recordId);
      queryClient.invalidateQueries({ queryKey: [moduleType] });
      queryClient.invalidateQueries({ queryKey: ["second-brain"] });
      toast.success("Record deleted successfully");
    }
  };

  const handleBulkDelete = async (recordIds: string[]) => {
    if (config.canDelete === false) return;

    if (database?.frozen) {
      toast.error("Cannot delete records: Database is frozen");
      return;
    }

    try {
      await Promise.all(recordIds.map((id) => apiService.deleteRecord(id)));

      queryClient.invalidateQueries({ queryKey: [moduleType] });
      queryClient.invalidateQueries({ queryKey: ["second-brain"] });

      toast.success(`${recordIds.length} records deleted successfully`);
    } catch (error) {
      toast.error(error?.message || "Failed to delete records");
    }
  };

  const handleBulkEdit = (records: DocumentRecord[]) => {
    if (config.canEdit === false) return;
    setCurrentRecord(records[0]); // Set first record as context
    setDialogOpen("bulk-edit");
  };

  const handleAddProperty = () => {
    if (config.canEdit === false) return;
    setDialogOpen("create-property");
  };

  const handleRecordCreate = (groupValue?: string) => {
    if (config.canCreate === false) return;

    if (database?.frozen) {
      toast.error("Cannot create records: Database is frozen");
      return;
    }

    if (onRecordCreate) {
      onRecordCreate();
    } else {
      if (groupValue) setCurrentRecord({ groupValue });
      setDialogOpen("create-record");
    }
  };

  const handleRecordUpdate = async (
    recordId: string,
    updates: Record<string, unknown>
  ) => {
    if (config.canEdit === false) return;

    if (database?.frozen) {
      toast.error("Cannot update records: Database is frozen");
      return;
    }

    if (onRecordUpdate) {
      onRecordUpdate(recordId, updates);
    } else {
      try {
        await apiService.updateRecord(recordId, updates);

        queryClient.invalidateQueries({ queryKey: [moduleType] });
        queryClient.invalidateQueries({ queryKey: ["second-brain"] });

        toast.success("Record updated successfully");
      } catch (error) {
        toast.error(error?.message || "Failed to update record");
      }
    }
  };

  return (
    <div className={`flex flex-col ${className || ""}`}>
      <div className="flex-shrink-0 mb-4 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            {config.title || database.name}
            {config.isFrozen && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                Frozen
              </span>
            )}
          </h2>
          <p className="text-muted-foreground">
            {config.description ||
              `${records.length} records • ${views.length} views`}
          </p>
        </div>
        <DatabasePrimaryButtons />
      </div>

      {config.enableViews !== false && views.length > 0 && (
        <div className="flex-shrink-0 mb-4">
          <DocumentViewTabs
            views={views}
            currentViewId={currentViewId}
            moduleType={moduleType}
            isFrozen={database?.frozen || config.isFrozen || false}
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
                properties={properties}
                records={records}
                currentView={currentView}
                onFiltersChange={async (filters) => {
                  if (currentView?.id) {
                    await updateFiltersMutation.mutateAsync({
                      viewId: currentView.id,
                      filters,
                    });
                  }
                }}
                onSortsChange={async (sorts) => {
                  if (currentView?.id) {
                    await updateSortsMutation.mutateAsync({
                      viewId: currentView.id,
                      sorts,
                    });
                  }
                }}
                visibleProperties={properties
                  .filter((p) => p.isVisible)
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
            properties={properties}
            records={records}
            onRecordSelect={handleRecordSelect}
            onRecordEdit={handleRecordEdit}
            onRecordDelete={handleRecordDelete}
            onRecordCreate={handleRecordCreate}
            onRecordUpdate={handleRecordUpdate}
            onBulkDelete={handleBulkDelete}
            onBulkEdit={handleBulkEdit}
            onAddProperty={handleAddProperty}
            databaseId={config.dataSourceId || database.id}
            moduleType={moduleType}
            isFrozen={database?.frozen || config.isFrozen || false}
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
                {views.length === 0
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
