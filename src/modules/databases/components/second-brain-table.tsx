import React from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    flexRender,
    type ColumnDef,
    type SortingState,
    type ColumnFiltersState,
    type VisibilityState,
    type RowSelectionState,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Search, ChevronDown } from 'lucide-react';
import { getSecondBrainConfig } from '../utils/second-brain-configs';
import type { DatabaseRecord, DatabaseProperty } from '@/types/database.types';

interface SecondBrainTableProps {
    type: 'tasks' | 'projects' | 'goals' | 'notes' | 'people' | 'habits' | 'journal' | 'books' | 'content' | 'finances' | 'mood';
    data: DatabaseRecord[];
    columns: ColumnDef<DatabaseRecord, any>[];
    properties?: DatabaseProperty[];
    onRecordEdit?: (record: DatabaseRecord) => void;
    onRecordDelete?: (recordId: string) => void;
    onRecordCreate?: () => void;
    onRecordSelect?: (record: DatabaseRecord) => void;
    databaseId?: string;
    showPropertyVisibility?: boolean;
    enableRowSelection?: boolean;
    enableBulkActions?: boolean;
    customActions?: any[];
    toolbarActions?: any[];
    // Custom action handlers
    onCustomAction?: (actionId: string, record: DatabaseRecord) => void;
    onToolbarAction?: (actionId: string, records: DatabaseRecord[]) => void;
}

export function SecondBrainTable({
    type,
    data,
    columns,
    properties,
    onRecordEdit,
    onRecordDelete,
    onRecordCreate,
    onRecordSelect,
    enableRowSelection = true,
    enableBulkActions = true,
    customActions: customActionsProp,
    toolbarActions: toolbarActionsProp,
    onCustomAction,
    onToolbarAction,
}: SecondBrainTableProps) {

    // Get the configuration for this Second Brain type
    const config = getSecondBrainConfig(type);

    // Use provided properties or generate defaults
    const tableProperties = properties || config.defaultProperties;

    // Table state
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
    const [globalFilter, setGlobalFilter] = React.useState('');

    // Enhance custom actions with handlers
    const customActions = (customActionsProp || config.customActions).map(action => ({
        ...action,
        onClick: (record: DatabaseRecord) => {
            if (onCustomAction) {
                onCustomAction(action.id, record);
            } else {
                // Default handlers based on action type
                switch (action.id) {
                    case 'edit':
                        onRecordEdit?.(record);
                        break;
                    case 'delete':
                        onRecordDelete?.(record.id);
                        break;
                    case 'complete':
                        console.log('Complete task:', record);
                        break;
                    case 'call':
                        if (record.properties.phone) {
                            window.open(`tel:${record.properties.phone}`);
                        }
                        break;
                    case 'email':
                        if (record.properties.email) {
                            window.open(`mailto:${record.properties.email}`);
                        }
                        break;
                    case 'schedule':
                        console.log('Schedule meeting with:', record);
                        break;
                    default:
                        action.onClick?.(record);
                }
            }
        }
    }));

    // Enhance toolbar actions with handlers
    const toolbarActions = (toolbarActionsProp || config.toolbarActions).map(action => ({
        ...action,
        onClick: (records: DatabaseRecord[]) => {
            if (onToolbarAction) {
                onToolbarAction(action.id, records);
            } else {
                // Default handlers based on action type
                switch (action.id) {
                    case 'bulk-delete':
                        records.forEach(record => onRecordDelete?.(record.id));
                        break;
                    case 'bulk-complete':
                        console.log('Bulk complete tasks:', records);
                        break;
                    case 'bulk-assign':
                        console.log('Bulk assign tasks:', records);
                        break;
                    case 'bulk-email':
                        const emails = records
                            .map(r => r.properties.email)
                            .filter(Boolean)
                            .join(',');
                        if (emails) {
                            window.open(`mailto:${emails}`);
                        }
                        break;
                    case 'export-contacts':
                        console.log('Export contacts:', records);
                        break;
                    default:
                        action.onClick?.(records);
                }
            }
        }
    }));

    // Enhanced columns with selection and actions
    const enhancedColumns = React.useMemo(() => {
        const cols = [...columns];

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
                                        className="h-8 px-3 gap-1.5 text-xs font-medium"
                                    >
                                        {Icon && <Icon className="h-3.5 w-3.5" />}
                                        <span className="hidden sm:inline">{action.label}</span>
                                        {!Icon && <span>{action.label}</span>}
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
    }, [columns, enableRowSelection, customActions]);

    const table = useReactTable({
        data,
        columns: enhancedColumns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            globalFilter,
        },
        enableRowSelection: enableRowSelection,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onGlobalFilterChange: setGlobalFilter,
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
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    {/* Search */}
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search..."
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="pl-10 h-10"
                        />
                    </div>

                    {/* Custom Toolbar Actions */}
                    {toolbarActions.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
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
                                        className="gap-2 h-10 px-4"
                                    >
                                        {Icon && <Icon className="h-4 w-4" />}
                                        <span className="hidden sm:inline">{action.label}</span>
                                        {action.requiresSelection && selectedRecords.length > 0 && (
                                            <Badge variant="secondary" className="ml-1 text-xs">
                                                {selectedRecords.length}
                                            </Badge>
                                        )}
                                    </Button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Column visibility */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2 h-10 px-4">
                            <span className="hidden sm:inline">Columns</span>
                            <span className="sm:hidden">Cols</span>
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuItem
                                        key={column.id}
                                        className="capitalize"
                                        onClick={() => column.toggleVisibility(!column.getIsVisible())}
                                    >
                                        <Checkbox
                                            checked={column.getIsVisible()}
                                            className="mr-2"
                                        />
                                        {column.id}
                                    </DropdownMenuItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Table */}
            <div className="rounded-lg border bg-card shadow-sm">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="border-b bg-muted/50">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="h-12 px-4 text-left align-middle font-semibold text-muted-foreground">
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
                                    data-state={row.getIsSelected() && "selected"}
                                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                                    onClick={() => onRecordSelect?.(row.original)}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="px-4 py-3">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={enhancedColumns.length} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-2">
                                        <div className="text-muted-foreground">No results found</div>
                                        <div className="text-sm text-muted-foreground">Try adjusting your search or filters</div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="text-sm text-muted-foreground">
                    {enableRowSelection && table.getFilteredSelectedRowModel().rows.length > 0 ? (
                        <>
                            {table.getFilteredSelectedRowModel().rows.length} of{" "}
                            {table.getFilteredRowModel().rows.length} row(s) selected
                        </>
                    ) : (
                        <>
                            Showing {table.getRowModel().rows.length} of{" "}
                            {table.getFilteredRowModel().rows.length} result(s)
                        </>
                    )}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="h-9 px-3"
                    >
                        Previous
                    </Button>
                    <div className="flex items-center space-x-1">
                        <span className="text-sm text-muted-foreground">
                            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                        </span>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="h-9 px-3"
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}

// Helper function to create default columns for Second Brain types
export function createSecondBrainColumns(type: string, properties: DatabaseProperty[]): ColumnDef<DatabaseRecord, any>[] {
    return properties.map((property) => ({
        id: property.id,
        accessorKey: `properties.${property.id}`,
        header: property.name,
        cell: ({ getValue }) => {
            const value = getValue();
            
            // Handle different property types
            switch (property.type) {
                case 'SELECT':
                    if (property.selectOptions && value) {
                        const option = property.selectOptions.find(opt => opt.id === value || opt.name === value);
                        return option ? (
                            <span 
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${option.color}-100 text-${option.color}-800`}
                            >
                                {option.name}
                            </span>
                        ) : value;
                    }
                    return value;
                    
                case 'MULTI_SELECT':
                    if (Array.isArray(value)) {
                        return (
                            <div className="flex flex-wrap gap-1">
                                {value.slice(0, 3).map((item, index) => (
                                    <span 
                                        key={index}
                                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                    >
                                        {item}
                                    </span>
                                ))}
                                {value.length > 3 && (
                                    <span className="text-xs text-muted-foreground">
                                        +{value.length - 3} more
                                    </span>
                                )}
                            </div>
                        );
                    }
                    return value;
                    
                case 'DATE':
                    return value ? new Date(value).toLocaleDateString() : '';
                    
                case 'CHECKBOX':
                    return value ? '✓' : '';
                    
                case 'URL':
                    return value ? (
                        <a 
                            href={value} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {value}
                        </a>
                    ) : '';
                    
                case 'EMAIL':
                    return value ? (
                        <a 
                            href={`mailto:${value}`}
                            className="text-blue-600 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {value}
                        </a>
                    ) : '';
                    
                case 'PHONE':
                    return value ? (
                        <a 
                            href={`tel:${value}`}
                            className="text-blue-600 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {value}
                        </a>
                    ) : '';
                    
                default:
                    return value?.toString() || '';
            }
        },
        enableSorting: true,
        enableHiding: true,
    }));
}
