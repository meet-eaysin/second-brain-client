import React, { useState, useMemo, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { DataTablePagination } from '@/components/data-table/data-table-pagination';
import { generateStandaloneColumns } from './standalone-columns';
import { transformDataToRecords, transformColumnsToProperties } from './data-transformers';
import { getTableConfiguration } from './table-configurations';
import { ActionRenderer, ToolbarActionRenderer } from './action-system';
import type { ActionConfig, ToolbarActionConfig } from './action-system';
import type { 
    DatabaseRecord, 
    DatabaseProperty,
    DatabaseView,
    DatabaseFilter,
    DatabaseSort
} from '@/types/database.types';
import { 
    Search, X, Plus, ArrowDownUp, ListFilter, MoreHorizontal, 
    Eye, EyeOff, Settings, Table as TableIcon, Kanban, 
    Grid3X3, List, Calendar, Clock, Lock, ChevronDown,
    Edit, Trash2, Copy, Download, Upload
} from 'lucide-react';
import { toast } from 'sonner';

export interface EnhancedUniversalDataTableProps<T = unknown> {
    // Data and structure
    data: T[];
    columns?: ColumnDef<T>[];
    
    // Table configuration
    tableType?: 'tasks' | 'projects' | 'goals' | 'notes' | 'people' | 'habits' | 'journal' | 'books' | 'content' | 'finances' | 'mood' | 'custom';
    context?: 'database' | 'second-brain' | 'general';
    
    // Properties (for database-style tables)
    properties?: DatabaseProperty[];
    
    // Views support
    views?: DatabaseView[];
    currentViewId?: string;
    onViewChange?: (viewId: string) => void;
    
    // Event handlers
    onRecordSelect?: (record: T) => void;
    onRecordEdit?: (record: T) => void;
    onRecordDelete?: (recordId: string) => void;
    onRecordCreate?: () => void;
    onRecordUpdate?: (recordId: string, propertyId: string, newValue: unknown) => void;
    
    // Custom actions
    customActions?: ActionConfig[];
    toolbarActions?: ToolbarActionConfig[];
    onCustomAction?: (actionId: string, record: T) => void;
    onToolbarAction?: (actionId: string, records: T[]) => void;
    
    // Table features
    enableRowSelection?: boolean;
    enableBulkActions?: boolean;
    enableColumnVisibility?: boolean;
    enableSorting?: boolean;
    enableFiltering?: boolean;
    enablePagination?: boolean;
    enableSearch?: boolean;
    enableViews?: boolean;
    
    // Database-specific
    databaseId?: string;
    databaseName?: string;
    databaseIcon?: string;
    isFrozen?: boolean;
    
    // Styling and behavior
    className?: string;
    height?: string | number;
    
    // Data transformation
    idField?: string;
    dataTransformer?: (data: T[]) => DatabaseRecord[];
    propertyTransformer?: (columns: ColumnDef<T>[]) => DatabaseProperty[];
    
    // Filters and sorts
    filters?: DatabaseFilter[];
    sorts?: DatabaseSort[];
    onFiltersChange?: (filters: DatabaseFilter[]) => void;
    onSortsChange?: (sorts: DatabaseSort[]) => void;
}

const VIEW_TYPE_ICONS = {
    TABLE: TableIcon,
    BOARD: Kanban,
    GALLERY: Grid3X3,
    LIST: List,
    CALENDAR: Calendar,
    TIMELINE: Clock,
} as const;

const VIEW_TYPE_LABELS = {
    TABLE: 'Table',
    BOARD: 'Board',
    GALLERY: 'Gallery',
    LIST: 'List',
    CALENDAR: 'Calendar',
    TIMELINE: 'Timeline',
} as const;

export function EnhancedUniversalDataTable<T = unknown>({
    data,
    columns,
    tableType = 'custom',
    context = 'general',
    properties: providedProperties,
    views,
    currentViewId,
    onViewChange,
    onRecordSelect,
    onRecordEdit,
    onRecordDelete,
    onRecordCreate,
    onRecordUpdate,
    customActions: providedCustomActions,
    toolbarActions: providedToolbarActions,
    onCustomAction,
    onToolbarAction,
    enableRowSelection = true,
    enableBulkActions = true,
    enableColumnVisibility = true,
    enableSorting = true,
    enableFiltering = true,
    enablePagination = true,
    enableSearch = true,
    enableViews = true,
    databaseId,
    databaseName,
    databaseIcon,
    isFrozen = false,
    className,
    height,
    idField = 'id',
    dataTransformer,
    propertyTransformer,
    filters = [],
    sorts = [],
    onFiltersChange,
    onSortsChange,
}: EnhancedUniversalDataTableProps<T>) {
    
    // State management
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [activeViewId, setActiveViewId] = useState(currentViewId || views?.[0]?.id);
    
    // Get table configuration based on type
    const tableConfig = useMemo(() => {
        return getTableConfiguration(tableType);
    }, [tableType]);
    
    // Get current view
    const currentView = useMemo(() => {
        return views?.find(view => view.id === activeViewId);
    }, [views, activeViewId]);
    
    // Transform data to database records format
    const transformedData = useMemo(() => {
        if (dataTransformer) {
            return dataTransformer(data);
        }
        return transformDataToRecords(data, idField);
    }, [data, dataTransformer, idField]);
    
    // Transform columns to database properties format
    const transformedProperties = useMemo(() => {
        if (providedProperties) {
            return providedProperties;
        }
        
        if (propertyTransformer && columns) {
            return propertyTransformer(columns);
        }
        
        if (columns) {
            return transformColumnsToProperties(columns);
        }
        
        // Use default properties from table configuration
        return tableConfig.defaultProperties || [];
    }, [providedProperties, columns, propertyTransformer, tableConfig]);
    
    // Filter properties based on current view
    const visibleProperties = useMemo(() => {
        if (!currentView?.visibleProperties) {
            return transformedProperties.filter(prop => prop.isVisible !== false);
        }
        
        return transformedProperties.filter(prop =>
            prop.isVisible !== false &&
            currentView?.visibleProperties?.includes(prop.id)
        );
    }, [transformedProperties, currentView]);
    
    // Generate columns
    const standaloneColumns = useMemo(() => {
        return generateStandaloneColumns(
            visibleProperties,
            onRecordEdit ? (record: DatabaseRecord) => onRecordEdit(record as T) : undefined,
            onRecordDelete,
            onRecordUpdate
        );
    }, [visibleProperties, onRecordEdit, onRecordDelete, onRecordUpdate]);
    
    // Enhanced columns with selection and actions
    const enhancedColumns = useMemo(() => {
        const cols: ColumnDef<DatabaseRecord>[] = [];

        // Add selection column if enabled
        if (enableRowSelection) {
            cols.push({
                id: 'select',
                header: ({ table }) => (
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() && 'indeterminate')
                        }
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
                size: 40,
            });
        }

        // Add data columns
        cols.push(...standaloneColumns);

        // Add actions column if there are custom actions
        const mergedCustomActions = [
            ...(tableConfig.customActions || []),
            ...(providedCustomActions || [])
        ];
        
        if (mergedCustomActions.length > 0) {
            cols.push({
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => (
                    <ActionRenderer
                        actions={mergedCustomActions}
                        record={row.original}
                        onActionClick={(actionId, record) => {
                            if (onCustomAction) {
                                onCustomAction(actionId, record as T);
                            }
                        }}
                    />
                ),
                enableSorting: false,
                enableHiding: false,
                size: 100,
            });
        }

        return cols;
    }, [standaloneColumns, enableRowSelection, tableConfig.customActions, providedCustomActions, onCustomAction]);
    
    // Apply filters and sorts to data
    const filteredAndSortedData = useMemo(() => {
        let result = [...transformedData];
        
        // Apply search filter
        if (searchQuery) {
            result = result.filter(record => {
                return Object.values(record.properties).some(value => 
                    String(value).toLowerCase().includes(searchQuery.toLowerCase())
                );
            });
        }
        
        // Apply view filters
        if (currentView?.filters && currentView.filters.length > 0) {
            result = result.filter(record => {
                return currentView.filters!.every(filter => {
                    const value = record.properties[filter.propertyId];
                    
                    switch (filter.operator) {
                        case 'equals':
                            return value === filter.value;
                        case 'not_equals':
                            return value !== filter.value;
                        case 'contains':
                            return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
                        case 'starts_with':
                            return String(value).toLowerCase().startsWith(String(filter.value).toLowerCase());
                        case 'ends_with':
                            return String(value).toLowerCase().endsWith(String(filter.value).toLowerCase());
                        case 'is_empty':
                            return !value || value === '';
                        case 'is_not_empty':
                            return value && value !== '';
                        case 'greater_than':
                            return Number(value) > Number(filter.value);
                        case 'less_than':
                            return Number(value) < Number(filter.value);
                        default:
                            return true;
                    }
                });
            });
        }
        
        // Apply view sorts
        if (currentView?.sorts && currentView.sorts.length > 0) {
            result.sort((a, b) => {
                for (const sort of currentView.sorts!) {
                    const aValue = a.properties[sort.propertyId];
                    const bValue = b.properties[sort.propertyId];
                    
                    let comparison = 0;
                    
                    if (aValue < bValue) comparison = -1;
                    else if (aValue > bValue) comparison = 1;
                    
                    if (comparison !== 0) {
                        return sort.direction === 'desc' ? -comparison : comparison;
                    }
                }
                return 0;
            });
        }
        
        return result;
    }, [transformedData, searchQuery, currentView]);
    
    // React Table instance
    const table = useReactTable({
        data: filteredAndSortedData,
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
    
    // Merge toolbar actions
    const mergedToolbarActions = useMemo(() => {
        const configActions = tableConfig.toolbarActions || [];
        const providedActions = providedToolbarActions || [];
        return [...configActions, ...providedActions];
    }, [tableConfig.toolbarActions, providedToolbarActions]);
    
    // Handle view change
    const handleViewChange = (viewId: string) => {
        setActiveViewId(viewId);
        if (onViewChange) {
            onViewChange(viewId);
        }
    };
    
    // Handle toolbar action clicks
    const handleToolbarAction = (actionId: string, records: DatabaseRecord[]) => {
        if (onToolbarAction) {
            onToolbarAction(actionId, records as T[]);
        }
    };

    // Render view content based on current view type
    const renderViewContent = () => {
        const viewType = currentView?.type || 'TABLE';

        switch (viewType) {
            case 'TABLE':
                return renderTableView();
            case 'BOARD':
                return renderBoardView();
            case 'GALLERY':
                return renderGalleryView();
            case 'LIST':
                return renderListView();
            case 'CALENDAR':
                return renderCalendarView();
            case 'TIMELINE':
                return renderTimelineView();
            default:
                return renderTableView(); // Default to table view
        }
    };

    // Render table view
    const renderTableView = () => (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id} style={{ width: header.getSize() }}>
                                        {header.isPlaceholder ? null : (
                                            <div
                                                className={
                                                    header.column.getCanSort()
                                                        ? 'cursor-pointer select-none flex items-center space-x-2'
                                                        : ''
                                                }
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                                {enableSorting && header.column.getCanSort() && (
                                                    <ArrowDownUp className="ml-2 h-4 w-4" />
                                                )}
                                            </div>
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
                                className={onRecordSelect ? 'cursor-pointer' : ''}
                                onClick={() => {
                                    if (onRecordSelect && !row.getIsSelected()) {
                                        onRecordSelect(row.original as T);
                                    }
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
                                colSpan={enhancedColumns.length}
                                className="h-24 text-center"
                            >
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );

    // Render board view (Kanban)
    const renderBoardView = () => (
        <div className="flex gap-4 overflow-x-auto pb-4">
            <div className="flex-shrink-0 w-80 bg-muted/50 rounded-lg p-4">
                <h3 className="font-medium mb-4">To Do</h3>
                <div className="space-y-2">
                    {filteredAndSortedData
                        .filter(record => record.properties.status === 'todo')
                        .map(record => (
                            <div key={record.id} className="bg-background p-3 rounded border shadow-sm">
                                <div className="font-medium">{record.properties.title || record.properties.name}</div>
                                {record.properties.description && (
                                    <div className="text-sm text-muted-foreground mt-1">
                                        {record.properties.description}
                                    </div>
                                )}
                            </div>
                        ))}
                </div>
            </div>
            <div className="flex-shrink-0 w-80 bg-muted/50 rounded-lg p-4">
                <h3 className="font-medium mb-4">In Progress</h3>
                <div className="space-y-2">
                    {filteredAndSortedData
                        .filter(record => record.properties.status === 'in-progress')
                        .map(record => (
                            <div key={record.id} className="bg-background p-3 rounded border shadow-sm">
                                <div className="font-medium">{record.properties.title || record.properties.name}</div>
                                {record.properties.description && (
                                    <div className="text-sm text-muted-foreground mt-1">
                                        {record.properties.description}
                                    </div>
                                )}
                            </div>
                        ))}
                </div>
            </div>
            <div className="flex-shrink-0 w-80 bg-muted/50 rounded-lg p-4">
                <h3 className="font-medium mb-4">Completed</h3>
                <div className="space-y-2">
                    {filteredAndSortedData
                        .filter(record => record.properties.status === 'completed')
                        .map(record => (
                            <div key={record.id} className="bg-background p-3 rounded border shadow-sm">
                                <div className="font-medium">{record.properties.title || record.properties.name}</div>
                                {record.properties.description && (
                                    <div className="text-sm text-muted-foreground mt-1">
                                        {record.properties.description}
                                    </div>
                                )}
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );

    // Render gallery view
    const renderGalleryView = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAndSortedData.map(record => (
                <div key={record.id} className="bg-background border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="aspect-square bg-muted rounded-md mb-3 flex items-center justify-center">
                        <span className="text-4xl">{record.properties.icon || '📄'}</span>
                    </div>
                    <div className="font-medium">{record.properties.title || record.properties.name}</div>
                    {record.properties.description && (
                        <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {record.properties.description}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );

    // Render list view
    const renderListView = () => (
        <div className="space-y-2">
            {filteredAndSortedData.map(record => (
                <div key={record.id} className="flex items-center gap-3 p-3 bg-background border rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex-shrink-0">
                        <span className="text-2xl">{record.properties.icon || '📄'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-medium">{record.properties.title || record.properties.name}</div>
                        {record.properties.description && (
                            <div className="text-sm text-muted-foreground truncate">
                                {record.properties.description}
                            </div>
                        )}
                    </div>
                    <div className="flex-shrink-0">
                        {record.properties.status && (
                            <Badge variant="outline">{record.properties.status}</Badge>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );

    // Render calendar view
    const renderCalendarView = () => (
        <div className="bg-background border rounded-lg p-4">
            <div className="text-center text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Calendar View</h3>
                <p>Calendar view is coming soon. This will show records organized by date.</p>
            </div>
        </div>
    );

    // Render timeline view
    const renderTimelineView = () => (
        <div className="bg-background border rounded-lg p-4">
            <div className="text-center text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Timeline View</h3>
                <p>Timeline view is coming soon. This will show records in chronological order.</p>
            </div>
        </div>
    );

    return (
        <div className={`space-y-4 ${className || ''}`} style={{ height }}>
            {/* Database Header */}
            {(databaseName || enableViews) && (
                <div className="flex flex-wrap items-center justify-between space-y-2 gap-x-4">
                    {databaseName && (
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                                {databaseIcon} {databaseName}
                                {isFrozen && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                                        <Lock className="h-3 w-3" />
                                        Frozen
                                    </span>
                                )}
                            </h2>
                            <p className="text-muted-foreground">
                                {filteredAndSortedData.length} records • {views?.length || 0} views
                            </p>
                        </div>
                    )}
                </div>
            )}
            
            {/* View Tabs */}
            {enableViews && views && views.length > 0 && (
                <div className="border-b">
                    <div className="flex items-center justify-between">
                        <Tabs value={activeViewId} onValueChange={handleViewChange} className="flex-1">
                            <div className="flex items-center justify-between py-2">
                                <TabsList className="h-9">
                                    {views.map((view) => {
                                        const Icon = VIEW_TYPE_ICONS[view.type] || TableIcon;
                                        return (
                                            <TabsTrigger
                                                key={view.id}
                                                value={view.id}
                                                className="flex items-center gap-2 text-sm"
                                            >
                                                <Icon className="h-3 w-3" />
                                                {view.name}
                                                {view.isDefault && (
                                                    <Badge variant="secondary" className="text-xs px-1 ml-1">
                                                        Default
                                                    </Badge>
                                                )}
                                            </TabsTrigger>
                                        );
                                    })}
                                </TabsList>
                            </div>
                        </Tabs>
                    </div>
                </div>
            )}
            
            {/* Toolbar */}
            <div className="flex items-center justify-between py-4 pe-2 border-b bg-background w-full">
                {/* Left side - Search */}
                {enableSearch && (
                    <div className="relative flex-shrink-0">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search records..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8 h-9 w-[200px] lg:w-[300px]"
                        />
                        {searchQuery && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSearchQuery('')}
                                className="absolute right-1 top-1 h-7 w-7 p-0 hover:bg-muted"
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        )}
                    </div>
                )}

                {/* Right side - Actions */}
                <div className="flex items-center gap-2">
                    {/* Column visibility toggle */}
                    {enableColumnVisibility && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Eye className="mr-2 h-4 w-4" />
                                    Columns
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[200px]">
                                {table
                                    .getAllColumns()
                                    .filter(
                                        (column) =>
                                            typeof column.accessorFn !== 'undefined' && column.getCanHide()
                                    )
                                    .map((column) => {
                                        const property = transformedProperties.find(p => p.id === column.id);
                                        return (
                                            <DropdownMenuCheckboxItem
                                                key={column.id}
                                                className="capitalize"
                                                checked={column.getIsVisible()}
                                                onCheckedChange={(value) =>
                                                    column.toggleVisibility(!!value)
                                                }
                                            >
                                                {property?.name || column.id}
                                            </DropdownMenuCheckboxItem>
                                        );
                                    })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {/* Toolbar Actions */}
                    {mergedToolbarActions.length > 0 && (
                        <ToolbarActionRenderer
                            actions={mergedToolbarActions}
                            selectedRecords={selectedRecords}
                            onActionClick={handleToolbarAction}
                        />
                    )}
                </div>
            </div>

            {/* View Content */}
            <div className="flex-1 overflow-auto">
                {renderViewContent()}
            </div>

            {/* Pagination */}
            {enablePagination && <DataTablePagination table={table} />}
        </div>
    );
}
