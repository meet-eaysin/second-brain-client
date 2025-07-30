import React from 'react';
import { type Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTableFacetedFilter } from '@/components/data-table/data-table-faceted-filter';
import { DataTableViewOptions } from '@/components/data-table/data-table-view-options';
import {
    Plus,
    Search,
    Filter,
    SortAsc,
    SortDesc,
    MoreHorizontal,
    Edit,
    Trash2,
    Copy,
    Download,
    Upload,
    X,
    Settings,
} from 'lucide-react';
import type { DatabaseRecord, DatabaseProperty } from '@/types/database.types';
import { useDatabase } from '../context/database-context';

interface DatabaseTableToolbarProps<TData> {
    table: Table<TData>;
    properties: DatabaseProperty[];
    onRecordEdit?: (record: DatabaseRecord) => void;
    onRecordDelete?: (recordId: string) => void;
}

export function DatabaseTableToolbar<TData>({
    table,
    properties,
    onRecordEdit,
    onRecordDelete,
}: DatabaseTableToolbarProps<TData>) {
    const { setOpen, searchQuery, setSearchQuery } = useDatabase();
    const isFiltered = table.getState().columnFilters.length > 0;
    const selectedRows = table.getFilteredSelectedRowModel().rows;

    // Get select and multiselect properties for filtering
    const selectProperties = properties.filter(
        (property) => property.type === 'select' || property.type === 'multiselect'
    );

    const handleBulkEdit = () => {
        if (selectedRows.length > 0) {
            // Handle bulk edit
            console.log('Bulk edit:', selectedRows);
        }
    };

    const handleBulkDelete = () => {
        if (selectedRows.length > 0) {
            // Handle bulk delete
            selectedRows.forEach((row) => {
                onRecordDelete?.((row.original as any).id);
            });
            table.resetRowSelection();
        }
    };

    const handleExport = () => {
        // Handle export
        console.log('Export data');
    };

    const handleImport = () => {
        // Handle import
        console.log('Import data');
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search records..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 h-9 w-[200px] lg:w-[300px]"
                    />
                </div>

                {/* Filters */}
                {selectProperties.map((property) => (
                    <DataTableFacetedFilter
                        key={property.id}
                        column={table.getColumn(property.id)}
                        title={property.name}
                        options={
                            property.selectOptions?.map((option) => ({
                                label: option,
                                value: option,
                            })) || []
                        }
                    />
                ))}

                {/* Clear filters */}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>

            <div className="flex items-center space-x-2">
                {/* Bulk actions for selected rows */}
                {selectedRows.length > 0 && (
                    <div className="flex items-center space-x-2 mr-4">
                        <span className="text-sm text-muted-foreground">
                            {selectedRows.length} selected
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleBulkEdit}
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleBulkDelete}
                            className="text-destructive hover:text-destructive"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                )}

                {/* Action buttons */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem onClick={handleExport}>
                            <Download className="h-4 w-4 mr-2" />
                            Export data
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem onClick={handleImport}>
                            <Upload className="h-4 w-4 mr-2" />
                            Import data
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem onClick={() => setOpen('create-property')}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add property
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem onClick={() => setOpen('create-view')}>
                            <Settings className="h-4 w-4 mr-2" />
                            Manage views
                        </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* View options */}
                <DataTableViewOptions table={table} />

                {/* Add record button */}
                <Button
                    size="sm"
                    onClick={() => setOpen('create-record')}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add record
                </Button>
            </div>
        </div>
    );
}
