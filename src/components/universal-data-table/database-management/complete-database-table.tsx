import React, { useState, useMemo } from 'react';
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
import { 
    Search, X, Plus, ArrowDownUp, ListFilter, MoreHorizontal, 
    Eye, EyeOff, Settings, Table as TableIcon, Kanban, 
    Grid3X3, List, Calendar, Clock, Lock, ChevronDown,
    Edit, Trash2, Copy, Download, Upload, Filter
} from 'lucide-react';
import { DatabaseProvider, useDatabaseManagement } from './database-context';
import { DatabaseHeaderActions } from './database-header-actions';
import { ViewManagement, AddViewDialog } from './view-management';
import { PropertyManagement, AddPropertyDialog } from './property-management';
import { EditableTableCell } from './inline-editing';
import { ActionRenderer, ToolbarActionRenderer } from '../action-system';
import type { ActionConfig, ToolbarActionConfig } from '../action-system';
import type { 
    DatabaseRecord, 
    DatabaseProperty,
    DatabaseView,
    DatabaseFilter,
    DatabaseSort
} from '@/types/database.types';
import { toast } from 'sonner';

const VIEW_TYPE_ICONS = {
    TABLE: TableIcon,
    BOARD: Kanban,
    GALLERY: Grid3X3,
    LIST: List,
    CALENDAR: Calendar,
    TIMELINE: Clock,
} as const;

interface CompleteDatabaseTableProps<T = unknown> {
    // Initial data
    initialData?: T[];
    initialProperties?: DatabaseProperty[];
    initialViews?: DatabaseView[];
    
    // Database metadata
    databaseName?: string;
    databaseIcon?: string;
    databaseDescription?: string;
    databaseId?: string;
    
    // Configuration
    tableType?: 'tasks' | 'projects' | 'goals' | 'notes' | 'people' | 'habits' | 'journal' | 'books' | 'content' | 'finances' | 'mood' | 'custom';
    context?: 'database' | 'second-brain' | 'general';
    
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
    
    // Data transformation
    idField?: string;
    dataTransformer?: (data: T[]) => DatabaseRecord[];
    
    // Styling
    className?: string;
    height?: string | number;
}

function DatabaseTableContent<T = unknown>({
    customActions = [],
    toolbarActions = [],
    onCustomAction,
    onToolbarAction,
    onRecordSelect,
    onRecordEdit,
    onRecordDelete,
    onRecordCreate,
    onRecordUpdate,
    className,
}: Omit<CompleteDatabaseTableProps<T>, 'initialData' | 'initialProperties' | 'initialViews'>) {
    const {
        records,
        properties,
        views,
        currentViewId,
        selectedRecords,
        searchQuery,
        currentFilters,
        currentSorts,
        currentPage,
        pageSize,
        setCurrentView,
        setSearchQuery,
        selectRecord,
        selectRecords,
        selectAllRecords,
        clearSelection,
        toggleRecordSelection,
        addRecord,
        updateRecord,
        deleteRecord,
        deleteRecords,
    } = useDatabaseManagement();

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    // Get current view
    const currentView = useMemo(() => {
        return views.find(view => view.id === currentViewId) || views[0];
    }, [views, currentViewId]);

    // Filter properties based on current view
    const visibleProperties = useMemo(() => {
        if (!currentView?.visibleProperties) {
            return properties.filter(prop => prop.isVisible !== false);
        }
        
        return properties.filter(prop =>
            prop.isVisible !== false &&
            currentView?.visibleProperties?.includes(prop.id)
        );
    }, [properties, currentView]);

    // Generate table columns with inline editing
    const tableColumns = useMemo(() => {
        const cols: ColumnDef<DatabaseRecord>[] = [];

        // Add selection column
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

        // Add property columns with inline editing
        visibleProperties.forEach((property) => {
            cols.push({
                id: property.id,
                accessorKey: `properties.${property.id}`,
                header: property.name,
                size: property.width || 150,
                cell: ({ row }) => (
                    <EditableTableCell
                        record={row.original}
                        property={property}
                        onUpdate={(recordId, propertyId, newValue) => {
                            updateRecord(recordId, {
                                properties: {
                                    ...row.original.properties,
                                    [propertyId]: newValue,
                                },
                            });
                            if (onRecordUpdate) {
                                onRecordUpdate(recordId, propertyId, newValue);
                            }
                        }}
                    />
                ),
                enableSorting: true,
                enableHiding: true,
            });
        });

        // Add actions column
        if (customActions.length > 0) {
            cols.push({
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => (
                    <ActionRenderer
                        actions={customActions}
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
    }, [visibleProperties, customActions, onCustomAction, onRecordUpdate, updateRecord]);

    // Apply filters and search
    const filteredRecords = useMemo(() => {
        let result = [...records];
        
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
        
        return result;
    }, [records, searchQuery, currentView]);

    // React Table instance
    const table = useReactTable({
        data: filteredRecords,
        columns: tableColumns,
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

    // Get selected records for toolbar actions
    const selectedTableRecords = table.getFilteredSelectedRowModel().rows.map(row => row.original);

    // Handle view change
    const handleViewChange = (viewId: string) => {
        setCurrentView(viewId);
    };

    // Handle add new record
    const handleAddRecord = () => {
        const newRecord: Partial<DatabaseRecord> = {
            properties: {},
        };
        
        // Set default values for required properties
        properties.forEach(property => {
            if (property.required) {
                switch (property.type) {
                    case 'TEXT':
                    case 'TITLE':
                        newRecord.properties![property.id] = 'Untitled';
                        break;
                    case 'NUMBER':
                        newRecord.properties![property.id] = 0;
                        break;
                    case 'CHECKBOX':
                        newRecord.properties![property.id] = false;
                        break;
                    case 'DATE':
                        newRecord.properties![property.id] = new Date().toISOString();
                        break;
                    default:
                        newRecord.properties![property.id] = '';
                }
            }
        });
        
        addRecord(newRecord);
        toast.success('New record added');
        
        if (onRecordCreate) {
            onRecordCreate();
        }
    };

    return (
        <div className={`space-y-4 ${className || ''}`}>
            {/* Database Header */}
            <DatabaseHeaderActions />
            
            {/* View Tabs */}
            {views.length > 0 && (
                <div className="border-b">
                    <div className="flex items-center justify-between">
                        <Tabs value={currentViewId || ''} onValueChange={handleViewChange} className="flex-1">
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
                                
                                <AddViewDialog 
                                    trigger={
                                        <Button variant="ghost" size="sm">
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    }
                                />
                            </div>
                        </Tabs>
                    </div>
                </div>
            )}
            
            {/* Toolbar */}
            <div className="flex items-center justify-between py-4 pe-2 border-b bg-background w-full">
                {/* Left side - Search */}
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

                {/* Right side - Actions */}
                <div className="flex items-center gap-2">
                    {/* Column visibility toggle */}
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
                                    const property = properties.find(p => p.id === column.id);
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

                    {/* Toolbar Actions */}
                    {toolbarActions.length > 0 && (
                        <ToolbarActionRenderer
                            actions={toolbarActions}
                            selectedRecords={selectedTableRecords}
                            onActionClick={(actionId, records) => {
                                if (onToolbarAction) {
                                    onToolbarAction(actionId, records as T[]);
                                }
                            }}
                        />
                    )}
                    
                    {/* Add Record Button */}
                    <Button onClick={handleAddRecord} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Record
                    </Button>
                </div>
            </div>

            {/* Table */}
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
                                                    {header.column.getCanSort() && (
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
                                    colSpan={tableColumns.length}
                                    className="h-24 text-center"
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <p>No records found.</p>
                                        <Button onClick={handleAddRecord} size="sm">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add your first record
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Bottom Bar */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{filteredRecords.length} records</span>
                    {selectedTableRecords.length > 0 && (
                        <span>{selectedTableRecords.length} selected</span>
                    )}
                </div>
                
                <div className="flex items-center gap-2">
                    <Button onClick={handleAddRecord} variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        New
                    </Button>
                    <DataTablePagination table={table} />
                </div>
            </div>
        </div>
    );
}

export function CompleteDatabaseTable<T = unknown>(props: CompleteDatabaseTableProps<T>) {
    const {
        initialData = [],
        initialProperties = [],
        initialViews = [],
        databaseName = 'Untitled Database',
        databaseIcon = '🗄️',
        databaseDescription,
        databaseId,
        tableType = 'custom',
        dataTransformer,
        idField = 'id',
        ...restProps
    } = props;

    // Transform initial data to database records
    const transformedData = useMemo(() => {
        if (dataTransformer) {
            return dataTransformer(initialData);
        }
        
        return initialData.map((item: any) => ({
            id: item[idField] || item._id || `record-${Date.now()}-${Math.random()}`,
            properties: Object.fromEntries(
                Object.entries(item).filter(([key]) => key !== idField && key !== '_id')
            ),
            createdAt: item.createdAt || new Date().toISOString(),
            updatedAt: item.updatedAt || new Date().toISOString(),
        }));
    }, [initialData, dataTransformer, idField]);

    return (
        <DatabaseProvider
            initialState={{
                records: transformedData,
                properties: initialProperties,
                views: initialViews,
                currentViewId: initialViews.find(v => v.isDefault)?.id || initialViews[0]?.id,
                databaseName,
                databaseIcon,
                databaseDescription,
                databaseId,
                totalRecords: transformedData.length,
            }}
        >
            <DatabaseTableContent {...restProps} />
        </DatabaseProvider>
    );
}
