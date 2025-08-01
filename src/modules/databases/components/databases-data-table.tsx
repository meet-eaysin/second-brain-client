import React from 'react';
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
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
import { DatabasesTableToolbar } from './databases-table-toolbar';
import { Database } from '@/types/database.types';

interface DatabasesDataTableProps {
    columns: ColumnDef<Database>[];
    data: Database[];
    searchQuery: string;
    onSearchChange: (value: string) => void;
    filterOwner: 'all' | 'mine' | 'shared';
    onFilterOwnerChange: (value: 'all' | 'mine' | 'shared') => void;
    filterPublic: 'all' | 'public' | 'private';
    onFilterPublicChange: (value: 'all' | 'public' | 'private') => void;
    sortBy: 'name' | 'createdAt' | 'updatedAt' | 'lastAccessedAt';
    onSortByChange: (value: 'name' | 'createdAt' | 'updatedAt' | 'lastAccessedAt') => void;
    sortOrder: 'asc' | 'desc';
    onSortOrderChange: (value: 'asc' | 'desc') => void;
    onCreateDatabase: () => void;
    onRowClick?: (database: Database) => void;
}

export function DatabasesDataTable({
    columns,
    data,
    searchQuery,
    onSearchChange,
    filterOwner,
    onFilterOwnerChange,
    filterPublic,
    onFilterPublicChange,
    sortBy,
    onSortByChange,
    sortOrder,
    onSortOrderChange,
    onCreateDatabase,
    onRowClick,
}: DatabasesDataTableProps) {
    const [rowSelection, setRowSelection] = React.useState({});
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);

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
            <DatabasesTableToolbar
                table={table}
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
                filterOwner={filterOwner}
                onFilterOwnerChange={onFilterOwnerChange}
                filterPublic={filterPublic}
                onFilterPublicChange={onFilterPublicChange}
                sortBy={sortBy}
                onSortByChange={onSortByChange}
                sortOrder={sortOrder}
                onSortOrderChange={onSortOrderChange}
                onCreateDatabase={onCreateDatabase}
            />
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
                                            target.closest('[data-radix-collection-item]')
                                        ) {
                                            return;
                                        }
                                        onRowClick?.(row.original);
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
                                    No databases found.
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
