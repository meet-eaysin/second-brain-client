import React from 'react';
import {
    type ColumnDef,
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type SortingState,
    useReactTable,
    type VisibilityState,
} from '@tanstack/react-table';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { DataTablePagination } from '@/components/data-table/data-table-pagination';
import { DatabaseTableToolbar } from './database-table-toolbar';
import { ColumnManager, HiddenPropertiesPanel } from './property-visibility';
import {
    useTogglePropertyVisibility,
    useUpdateViewVisibility,
    useShowAllPropertiesInView,
    useHideNonRequiredProperties,
    usePropertyVisibilityState
} from '../hooks/usePropertyVisibility';
import type { DatabaseRecord, DatabaseProperty } from '@/types/database.types';
import { useDatabaseContext } from '../context/database-context';

interface DatabaseDataTableProps {
    columns: ColumnDef<DatabaseRecord, any>[];
    data: DatabaseRecord[];
    properties: DatabaseProperty[];
    onRecordSelect?: (record: DatabaseRecord) => void;
    onRecordEdit?: (record: DatabaseRecord) => void;
    onRecordDelete?: (recordId: string) => void;
    databaseId?: string;
    showPropertyVisibility?: boolean;
}

export function DatabaseDataTable({
    columns,
    data,
    properties,
    onRecordSelect,
    onRecordEdit,
    onRecordDelete,
    databaseId,
    showPropertyVisibility = true,
}: DatabaseDataTableProps) {

    const { currentDatabase, currentView } = useDatabaseContext();
    const [rowSelection, setRowSelection] = React.useState({});
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);

    // Property visibility hooks
    const togglePropertyMutation = useTogglePropertyVisibility();
    const updateViewVisibilityMutation = useUpdateViewVisibility();
    const showAllPropertiesMutation = useShowAllPropertiesInView();
    const hideNonRequiredMutation = useHideNonRequiredProperties();

    // Get property visibility state
    const {
        hiddenProperties,
        hiddenCount,
    } = usePropertyVisibilityState(properties, currentView);

    const dbId = databaseId || currentDatabase?.id;

    // Property visibility handlers
    const handleToggleProperty = (propertyId: string, isVisible: boolean) => {
        if (!dbId) return;
        togglePropertyMutation.mutate({ databaseId: dbId, propertyId, isVisible });
    };

    const handleUpdateViewVisibility = (visibleProperties: string[]) => {
        if (!dbId || !currentView?.id) return;
        updateViewVisibilityMutation.mutate({
            databaseId: dbId,
            viewId: currentView.id,
            visibleProperties
        });
    };

    const handleShowAllProperties = () => {
        if (!dbId || !currentView?.id) return;
        showAllPropertiesMutation.mutate({ databaseId: dbId, viewId: currentView.id });
    };

    const handleHideNonRequired = () => {
        if (!dbId || !currentView?.id) return;
        hideNonRequiredMutation.mutate({ databaseId: dbId, viewId: currentView.id });
    };

    const handleRestoreAllGlobal = () => {
        if (!dbId) return;
        // Restore all globally hidden properties
        hiddenProperties
            .filter(p => p.isVisible === false)
            .forEach(property => {
                togglePropertyMutation.mutate({
                    databaseId: dbId,
                    propertyId: property.id,
                    isVisible: true
                });
            });
    };

    const handleRestoreAllView = () => {
        if (!dbId || !currentView?.id) return;
        // Show all properties that are globally visible but hidden in current view
        const allVisiblePropertyIds = properties
            .filter(p => p.isVisible !== false)
            .map(p => p.id);

        updateViewVisibilityMutation.mutate({
            databaseId: dbId,
            viewId: currentView.id,
            visibleProperties: allVisiblePropertyIds
        });
    };    

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    });

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <DatabaseTableToolbar
                    table={table}
                    properties={properties}
                    currentView={currentView}
                    onRecordEdit={onRecordEdit}
                    onRecordDelete={onRecordDelete}
                    onViewUpdate={() => {
                        // Refresh table when view is updated
                        console.log('View updated, refreshing table...');
                    }}
                />

                {/* Column Manager */}
                {showPropertyVisibility && dbId && (
                    <ColumnManager
                        properties={properties}
                        currentView={currentView}
                        databaseId={dbId}
                        onToggleProperty={handleToggleProperty}
                        onUpdateViewVisibility={handleUpdateViewVisibility}
                        onShowAll={handleShowAllProperties}
                        onHideNonRequired={handleHideNonRequired}
                        isLoading={
                            togglePropertyMutation.isPending ||
                            updateViewVisibilityMutation.isPending ||
                            showAllPropertiesMutation.isPending ||
                            hideNonRequiredMutation.isPending
                        }
                    />
                )}
            </div>

            {/* Hidden Properties Panel */}
            {showPropertyVisibility && dbId && hiddenCount > 0 && (
                <HiddenPropertiesPanel
                    properties={properties}
                    currentView={currentView}
                    onToggleProperty={handleToggleProperty}
                    onRestoreAllGlobal={handleRestoreAllGlobal}
                    onRestoreAllView={handleRestoreAllView}
                    isLoading={
                        togglePropertyMutation.isPending ||
                        updateViewVisibilityMutation.isPending
                    }
                />
            )}

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} colSpan={header.colSpan}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={(e) => {
                                        // Don't trigger row click if clicking on interactive elements
                                        const target = e.target as HTMLElement;
                                        if (
                                            target.closest('button') ||
                                            target.closest('[role="checkbox"]') ||
                                            target.closest('[role="menuitem"]') ||
                                            target.closest('[data-radix-collection-item]') ||
                                            target.closest('[data-radix-dropdown-menu-trigger]') ||
                                            target.closest('[data-radix-dropdown-menu-content]')
                                        ) {
                                            return;
                                        }
                                        // Click to edit - open edit dialog instead of view dialog
                                        onRecordEdit?.(row.original);
                                    }}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No records found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}
