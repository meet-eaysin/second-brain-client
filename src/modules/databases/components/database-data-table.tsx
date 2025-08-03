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
import { Plus, ChevronDown, MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import {
    useTogglePropertyVisibility,
    useUpdateViewVisibility,
    useShowAllPropertiesInView,
    useHideNonRequiredProperties,
    usePropertyVisibilityState
} from '../hooks/usePropertyVisibility';
import type { DatabaseRecord, DatabaseProperty } from '@/types/database.types';
import { useDatabaseContext } from '../context/database-context';

interface CustomAction {
    id: string;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    onClick: (record: DatabaseRecord) => void;
    isVisible?: (record: DatabaseRecord) => boolean;
    isDisabled?: (record: DatabaseRecord) => boolean;
}

interface ToolbarAction {
    id: string;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    onClick: (selectedRecords: DatabaseRecord[]) => void;
    requiresSelection?: boolean;
    isVisible?: (selectedRecords: DatabaseRecord[]) => boolean;
    isDisabled?: (selectedRecords: DatabaseRecord[]) => boolean;
}

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
    // Enhanced features
    customActions?: CustomAction[];
    toolbarActions?: ToolbarAction[];
    enableRowSelection?: boolean;
    enableBulkActions?: boolean;
    coreProperties?: string[]; // Properties that can't have type changed
    context?: 'database' | 'second-brain'; // Context for different behaviors
    secondBrainType?: 'tasks' | 'projects' | 'goals' | 'notes' | 'people' | 'habits' | 'journal' | 'books' | 'content' | 'finances' | 'mood';
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
    customActions = [],
    toolbarActions = [],
    enableRowSelection = false,
    enableBulkActions = false,
    coreProperties = [],
    context = 'database',
    secondBrainType,
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

    // Enhanced columns with selection and actions
    const enhancedColumns = React.useMemo(() => {
        // First, enhance existing columns with special rendering
        const enhancedCols = columns.map(col => {
            // If this is a property column, enhance it with special rendering
            const propertyId = col.id;
            const property = properties.find(p => p.id === propertyId);

            if (property && col.cell) {
                return {
                    ...col,
                    cell: ({ row, getValue }) => {
                        const value = getValue();
                        const record = row.original;

                        // Check if this should use special rendering
                        if (property.name.toLowerCase().includes('progress') ||
                            property.name.toLowerCase().includes('completion') ||
                            property.name.toLowerCase().includes('percent')) {
                            const numValue = typeof value === 'number' ? value : parseFloat(value as string) || 0;
                            return (
                                <div className="flex items-center gap-2">
                                    <Progress value={numValue} className="h-2 flex-1" />
                                    <span className="text-xs text-muted-foreground min-w-[3rem]">{numValue}%</span>
                                </div>
                            );
                        }

                        // Avatar for people/user fields
                        if (property.name.toLowerCase().includes('avatar') ||
                            property.name.toLowerCase().includes('photo') ||
                            property.name.toLowerCase().includes('image') ||
                            (secondBrainType === 'people' && property.name.toLowerCase().includes('name'))) {
                            const avatarUrl = property.name.toLowerCase().includes('avatar') ? value : record.properties.avatar;
                            const displayName = property.name.toLowerCase().includes('name') ? value : record.properties.name || 'Unknown';

                            return (
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={avatarUrl as string} />
                                        <AvatarFallback className="text-xs">
                                            {displayName?.toString().charAt(0)?.toUpperCase() || '?'}
                                        </AvatarFallback>
                                    </Avatar>
                                    {property.name.toLowerCase().includes('name') && (
                                        <span>{displayName}</span>
                                    )}
                                </div>
                            );
                        }

                        // Default rendering - use original cell renderer
                        return typeof col.cell === 'function' ? col.cell({ row, getValue }) : value;
                    }
                };
            }

            return col;
        });

        const cols = [...enhancedCols];

        // Add selection column if enabled
        if (enableRowSelection) {
            cols.unshift({
                id: 'select',
                header: ({ table }) => (
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected()}
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                    />
                ),
                cell: ({ row }) => (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
                ),
                enableSorting: false,
                enableHiding: false,
            });
        }

        // Add actions column if custom actions are provided
        if (customActions.length > 0) {
            cols.push({
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => {
                    const record = row.original;
                    const visibleActions = customActions.filter(action =>
                        !action.isVisible || action.isVisible(record)
                    );

                    if (visibleActions.length === 0) return null;

                    return (
                        <div className="flex items-center gap-1">
                            {visibleActions.slice(0, 2).map((action) => {
                                const Icon = action.icon;
                                return (
                                    <Button
                                        key={action.id}
                                        variant={action.variant || 'ghost'}
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            action.onClick(record);
                                        }}
                                        disabled={action.isDisabled?.(record)}
                                        className="h-8 px-2"
                                    >
                                        {Icon && <Icon className="h-3 w-3" />}
                                        {!Icon && action.label}
                                    </Button>
                                );
                            })}
                            {visibleActions.length > 2 && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <MoreHorizontal className="h-3 w-3" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {visibleActions.slice(2).map((action) => {
                                            const Icon = action.icon;
                                            return (
                                                <DropdownMenuItem
                                                    key={action.id}
                                                    onClick={() => action.onClick(record)}
                                                    disabled={action.isDisabled?.(record)}
                                                >
                                                    {Icon && <Icon className="mr-2 h-4 w-4" />}
                                                    {action.label}
                                                </DropdownMenuItem>
                                            );
                                        })}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    );
                },
                enableSorting: false,
                enableHiding: false,
            });
        }

        return cols;
    }, [columns, enableRowSelection, customActions, properties, secondBrainType]);

    const table = useReactTable({
        data,
        columns: enhancedColumns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
        },
        enableRowSelection: enableRowSelection,
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

    // Get selected records for toolbar actions
    const selectedRecords = table.getFilteredSelectedRowModel().rows.map(row => row.original);



    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
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

                    {/* Custom Toolbar Actions */}
                    {toolbarActions.length > 0 && (
                        <div className="flex items-center gap-2 ml-4">
                            {toolbarActions.map((action) => {
                                const Icon = action.icon;
                                const isVisible = !action.isVisible || action.isVisible(selectedRecords);
                                const isDisabled = action.isDisabled?.(selectedRecords) ||
                                    (action.requiresSelection && selectedRecords.length === 0);

                                if (!isVisible) return null;

                                return (
                                    <Button
                                        key={action.id}
                                        variant={action.variant || 'outline'}
                                        size="sm"
                                        onClick={() => action.onClick(selectedRecords)}
                                        disabled={isDisabled}
                                        className="gap-2"
                                    >
                                        {Icon && <Icon className="h-4 w-4" />}
                                        {action.label}
                                        {action.requiresSelection && selectedRecords.length > 0 && (
                                            <span className="ml-1 text-xs">({selectedRecords.length})</span>
                                        )}
                                    </Button>
                                );
                            })}
                        </div>
                    )}
                </div>

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
