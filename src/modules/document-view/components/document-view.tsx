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
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Document } from "@/modules/document-view";
import { type DocumentRecord } from "@/types/document";
import {
    useDatabase,
    useRecords,
    useViews,
    useUpdateRecord,
    useDeleteRecord,
    useUpdateView,
} from "@/modules/document-view/services/database-queries";
import type {IRecordQueryParams, IRecordResponse, IViewResponse} from "@/modules/document-view/types";

export interface DocumentViewProps {
    databaseId?: string;
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

    onRecordView?: (record: Record<string, string>) => void;
    onRecordEdit?: (record: Record<string, string>) => void;
    onRecordDelete?: (record: Record<string, string>) => void;
    onRecordCreate?: () => void;
    onRecordUpdate?: (recordId: string, updates: Record<string, unknown>) => void;

    isLoading?: boolean;
    error?: string | null;

    className?: string;
}

function DocumentViewInternal({
                                  databaseId,
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

    // Fetch database data
    const { data: database, isLoading: databaseLoading } = useDatabase(
        databaseId || ""
    );

    // Fetch views
    const { data: views, isLoading: viewsLoading } = useViews(
        databaseId || ""
    );

    // Prepare record query params
    const recordQueryParams: IRecordQueryParams = {
        databaseId: databaseId || "",
        viewId: currentViewId,
        search: searchQuery,
        page: 1,
        limit: 50,
        isArchived: false,
        isTemplate: false
    };

    // Fetch records
    const { data: recordsResponse, isLoading: recordsLoading } = useRecords(
        recordQueryParams
    );
    const records = recordsResponse?.records || [];

    // Mutations
    const updateRecordMutation = useUpdateRecord();
    const deleteRecordMutation = useDeleteRecord();
    const updateViewMutation = useUpdateView();

    const currentView =
        views?.find((v: IViewResponse) => v.id === currentViewId) ||
        views?.find((v: IViewResponse) => v.id === config.defaultViewId) ||
        views?.find((v: IViewResponse) => v.isDefault) ||
        views?.[0];

    useEffect(() => {
        if (database) {
            setCurrentSchema(database as unknown as Document);

            const initialVisibility =
                database.properties?.reduce(
                    (acc, prop) => ({ ...acc, [prop.id]: true }),
                    {}
                ) || {};
            setVisibleProperties(initialVisibility);
        }
    }, [database, setCurrentSchema, setVisibleProperties]);

    useEffect(() => {
        if (views && currentViewId) {
            const view = views.find((v: IViewResponse) => v.id === currentViewId);
            if (view) setCurrentView(view);
        }
    }, [views, currentViewId, setCurrentView]);

    useEffect(() => {
        if (!currentViewId && currentView) setCurrentViewId(currentView.id);
    }, [currentViewId, currentView]);

    if (isLoading || databaseLoading || viewsLoading || recordsLoading) {
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

        if (database?.isArchived) {
            toast.error("Cannot delete records: Database is archived");
            return;
        }

        if (onRecordDelete) {
            const record = records.find((r: IRecordResponse) => r.id === recordId);
            if (record) onRecordDelete(record as unknown as Record<string, string>);
        } else {
            try {
                await deleteRecordMutation.mutateAsync({
                    databaseId: databaseId || "",
                    recordId
                });
                toast.success("Record deleted successfully");
            } catch (error) {
                toast.error(error.message || "Failed to delete record");
            }
        }
    };

    const handleBulkDelete = async (recordIds: string[]) => {
        if (config.canDelete === false) return;

        if (database?.isArchived) {
            toast.error("Cannot delete records: Database is archived");
            return;
        }

        try {
            await Promise.all(
                recordIds.map((id) =>
                    deleteRecordMutation.mutateAsync({
                        databaseId: databaseId || "",
                        recordId: id
                    })
                )
            );
            toast.success(`${recordIds.length} records deleted successfully`);
        } catch (error) {
            toast.error(error.message || "Failed to delete records");
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

        if (database?.isArchived) {
            toast.error("Cannot create records: Database is archived");
            return;
        }

        if (onRecordCreate) {
            onRecordCreate();
        } else {
            if (groupValue) setCurrentRecord({ groupValue } as DocumentRecord);
            setDialogOpen("create-record");
        }
    };

    const handleRecordUpdate = async (
        recordId: string,
        updates: Record<string, unknown>
    ) => {
        if (config.canEdit === false) return;

        if (database?.isArchived) {
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
                    data: updates as any
                });
                toast.success("Record updated successfully");
            } catch (error) {
                toast.error(error.message || "Failed to update record");
            }
        }
    };

    const handleFiltersChange = async (filters: any) => {
        if (currentView?.id) {
            try {
                await updateViewMutation.mutateAsync({
                    databaseId: databaseId || "",
                    viewId: currentView.id,
                    data: { filters }
                });
                toast.success("Filters updated successfully");
            } catch (error) {
                toast.error(error.message || "Failed to update filters");
            }
        }
    };

    const handleSortsChange = async (sorts: any) => {
        if (currentView?.id) {
            try {
                await updateViewMutation.mutateAsync({
                    databaseId: databaseId || "",
                    viewId: currentView.id,
                    data: { sorts }
                });
                toast.success("Sorts updated successfully");
            } catch (error) {
                toast.error(error.message || "Failed to update sorts");
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
                            `${records.length} records • ${views?.length || 0} views`}
                    </p>
                </div>
                <DatabasePrimaryButtons />
            </div>

            {config.enableViews !== false && views && views.length > 0 && (
                <div className="flex-shrink-0 mb-4">
                    <DocumentViewTabs
                        views={views}
                        currentViewId={currentViewId}
                        moduleType={moduleType}
                        isFrozen={database?.isArchived || config.isFrozen || false}
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
                                properties={database.properties || []}
                                records={records}
                                currentView={currentView}
                                onFiltersChange={handleFiltersChange}
                                onSortsChange={handleSortsChange}
                                visibleProperties={database.properties
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
                        properties={database.properties || []}
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
                        isFrozen={database?.isArchived || config.isFrozen || false}
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
                                {views?.length === 0
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