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
import { toast } from 'sonner';
import {useDatabaseContext} from "@/modules/databases";

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
    const { setOpen, searchQuery, setSearchQuery } = useDatabaseContext();
    const isFiltered = table.getState().columnFilters.length > 0;
    const selectedRows = table.getFilteredSelectedRowModel().rows;

    // Get select and multiselect properties for filtering
    const selectProperties = properties.filter(
        (property) => property.type === 'SELECT' || property.type === 'MULTI_SELECT'
    );

    const handleBulkEdit = () => {
        if (selectedRows.length > 0 && onRecordEdit) {
            // Edit first selected record
            const firstRecord = selectedRows[0].original as DatabaseRecord;
            onRecordEdit(firstRecord);
        }
    };

    const handleBulkCopy = () => {
        if (selectedRows.length > 0) {
            // Copy selected records data to clipboard
            const recordsData = selectedRows.map(row => row.original);
            const jsonData = JSON.stringify(recordsData, null, 2);
            navigator.clipboard.writeText(jsonData);
            toast.success(`Copied ${selectedRows.length} record(s) to clipboard`);
        }
    };

    const handleSort = (direction: 'asc' | 'desc') => {
        // Get the first visible column for sorting
        const firstColumn = table.getVisibleLeafColumns()[0];
        if (firstColumn) {
            firstColumn.toggleSorting(direction === 'desc');
        }
    };

    const toggleFilters = () => {
        // Toggle column filters visibility
        const hasFilters = table.getState().columnFilters.length > 0;
        if (hasFilters) {
            table.resetColumnFilters();
        }
        // Note: Filter visibility toggle would need additional state management
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
                                label: option.name,
                                value: option.id,
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
                {/* Sorting controls */}
                <div className="flex items-center space-x-1">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSort('asc')}
                        className="h-8 px-2"
                    >
                        <SortAsc className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSort('desc')}
                        className="h-8 px-2"
                    >
                        <SortDesc className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleFilters}
                        className="h-8 px-2"
                    >
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>

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
                            disabled={!onRecordEdit}
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleBulkCopy}
                        >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
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
