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
import { Checkbox } from '@/components/ui/checkbox';
import { DataTablePagination } from '@/components/data-table/data-table-pagination';
import { ActionRenderer, ToolbarActionRenderer } from './action-system';
import type { ActionConfig, ToolbarActionConfig } from './action-system';
import type { DatabaseRecord, DatabaseProperty } from '@/types/database.types';
import { MoreHorizontal, ArrowUpDown, Eye, EyeOff } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';

interface StandaloneDataTableProps {
    columns: ColumnDef<DatabaseRecord>[];
    data: DatabaseRecord[];
    properties: DatabaseProperty[];
    onRecordSelect?: (record: DatabaseRecord) => void;
    onRecordEdit?: (record: DatabaseRecord) => void;
    onRecordDelete?: (recordId: string) => void;
    onRecordCreate?: () => void;
    customActions?: ActionConfig[];
    toolbarActions?: ToolbarActionConfig[];
    enableRowSelection?: boolean;
    enableBulkActions?: boolean;
    enableColumnVisibility?: boolean;
    enableSorting?: boolean;
    enableFiltering?: boolean;
    enablePagination?: boolean;
    onCustomAction?: (actionId: string, record: DatabaseRecord) => void;
    onToolbarAction?: (actionId: string, records: DatabaseRecord[]) => void;
    className?: string;
}

export function StandaloneDataTable({
    columns,
    data,
    properties,
    onRecordSelect,
    onRecordEdit,
    onRecordDelete,
    onRecordCreate,
    customActions = [],
    toolbarActions = [],
    enableRowSelection = true,
    enableBulkActions = true,
    enableColumnVisibility = true,
    enableSorting = true,
    enableFiltering = true,
    enablePagination = true,
    onCustomAction,
    onToolbarAction,
    className,
}: StandaloneDataTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    // Enhanced columns with actions
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
        cols.push(...columns);

        // Add actions column if there are custom actions
        if (customActions.length > 0) {
            cols.push({
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => (
                    <ActionRenderer
                        actions={customActions}
                        record={row.original}
                        onActionClick={onCustomAction}
                    />
                ),
                enableSorting: false,
                enableHiding: false,
                size: 100,
            });
        }

        return cols;
    }, [columns, customActions, enableRowSelection, onCustomAction]);

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
        <div className={`space-y-4 ${className || ''}`}>
            {/* Toolbar */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
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
                    )}
                </div>

                {/* Toolbar Actions */}
                {toolbarActions.length > 0 && (
                    <ToolbarActionRenderer
                        actions={toolbarActions}
                        selectedRecords={selectedRecords}
                        onActionClick={onToolbarAction}
                    />
                )}
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
                                                    {enableSorting && header.column.getCanSort() && (
                                                        <ArrowUpDown className="ml-2 h-4 w-4" />
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
                                            onRecordSelect(row.original);
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

            {/* Pagination */}
            {enablePagination && <DataTablePagination table={table} />}
        </div>
    );
}
