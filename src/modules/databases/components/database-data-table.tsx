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
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTablePagination } from '@/components/data-table/data-table-pagination';
import { DatabaseTableToolbar } from './database-table-toolbar';
import { ColumnManager, HiddenPropertiesPanel } from './property-visibility';
import { Plus, ChevronDown } from 'lucide-react';
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
    onRecordCreate?: () => void;
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
    onRecordCreate,
    databaseId,
    showPropertyVisibility = true,
}: DatabaseDataTableProps) {

    const { currentDatabase, currentView } = useDatabaseContext();
    const [rowSelection, setRowSelection] = React.useState({});
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnStats, setColumnStats] = React.useState<Record<string, string>>({});

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

    // Calculate statistics for a column
    const calculateColumnStats = (columnId: string, statType: string) => {
        const columnData = data.map(row => row.properties[columnId]).filter(val => val !== null && val !== undefined);

        switch (statType) {
            case 'count-all':
                return data.length.toString();
            case 'count-values':
                return columnData.length.toString();
            case 'count-unique':
                return new Set(columnData).size.toString();
            case 'count-empty':
                return (data.length - columnData.length).toString();
            case 'count-not-empty':
                return columnData.length.toString();
            case 'percent-empty':
                return data.length > 0 ? `${Math.round(((data.length - columnData.length) / data.length) * 100)}%` : '0%';
            case 'percent-not-empty':
                return data.length > 0 ? `${Math.round((columnData.length / data.length) * 100)}%` : '0%';
            default:
                return '';
        }
    };

    const handleStatSelection = (columnId: string, statType: string) => {
        const result = calculateColumnStats(columnId, statType);
        setColumnStats(prev => ({ ...prev, [columnId]: `${statType}: ${result}` }));
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
                {/* {showPropertyVisibility && dbId && (
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
                )} */}
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

                        {/* Add New Record Row - Notion Style */}
                        {onRecordCreate && (
                            <TableRow className="hover:bg-muted/50 border-t-2">
                                <TableCell
                                    colSpan={columns.length}
                                    className="text-center py-2 cursor-pointer text-muted-foreground hover:text-foreground"
                                    onClick={onRecordCreate}
                                >
                                    <div className="flex items-center justify-start gap-2">
                                        <Plus className="h-4 w-4" />
                                        <span>New Record</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>

                    {/* Column Statistics Footer - Notion Style with Hover */}
                    <tfoot>
                        <tr>
                            {table.getHeaderGroups()[0]?.headers.map((header) => (
                                <td key={header.id} className="border-t p-1 group">
                                    <div className="relative">
                                        {/* Show selected stat value if exists */}
                                        {columnStats[header.id] ? (
                                            <div className="flex items-center justify-between h-6 px-2 text-xs text-muted-foreground">
                                                <span>{columnStats[header.id]}</span>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <ChevronDown className="h-3 w-3" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="start" className="w-48">
                                                        <DropdownMenuItem onClick={() => handleStatSelection(header.id, 'count-all')}>
                                                            Count all
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleStatSelection(header.id, 'count-values')}>
                                                            Count values
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleStatSelection(header.id, 'count-unique')}>
                                                            Count unique values
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleStatSelection(header.id, 'count-empty')}>
                                                            Count empty
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleStatSelection(header.id, 'count-not-empty')}>
                                                            Count not empty
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleStatSelection(header.id, 'percent-empty')}>
                                                            Percent empty
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleStatSelection(header.id, 'percent-not-empty')}>
                                                            Percent not empty
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => setColumnStats(prev => ({ ...prev, [header.id]: '' }))}
                                                            className="text-destructive"
                                                        >
                                                            Clear
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        ) : (
                                            /* Hidden dropdown that appears on hover */
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-full opacity-0 group-hover:opacity-100 transition-opacity text-xs text-muted-foreground hover:text-foreground"
                                                    >
                                                        Count <ChevronDown className="h-3 w-3" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="start" className="w-48">
                                                    <DropdownMenuItem onClick={() => handleStatSelection(header.id, 'count-all')}>
                                                        Count all
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatSelection(header.id, 'count-values')}>
                                                        Count values
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatSelection(header.id, 'count-unique')}>
                                                        Count unique values
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatSelection(header.id, 'count-empty')}>
                                                        Count empty
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatSelection(header.id, 'count-not-empty')}>
                                                        Count not empty
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatSelection(header.id, 'percent-empty')}>
                                                        Percent empty
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatSelection(header.id, 'percent-not-empty')}>
                                                        Percent not empty
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </div>
                                </td>
                            ))}
                        </tr>
                    </tfoot>
                </Table>
            </div>

            <DataTablePagination table={table} />
        </div>
    );
}
