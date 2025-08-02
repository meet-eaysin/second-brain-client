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

import { DatabaseViewOptions } from './database-view-options';
import { SortManager, FilterManager } from './sort-filter-management';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
    Plus,
    Search,
    ArrowDownUp,
    ListFilter,
    MoreHorizontal,
    Edit,
    Trash2,
    Copy,
    Download,
    Upload,
    X,
    Settings,
} from 'lucide-react';
import type { DatabaseRecord, DatabaseProperty, DatabaseView } from '@/types/database.types';
import { toast } from 'sonner';
import {useDatabaseContext} from "@/modules/databases";

interface DatabaseTableToolbarProps<TData> {
    table: Table<TData>;
    properties: DatabaseProperty[];
    currentView: DatabaseView;
    onRecordEdit?: (record: DatabaseRecord) => void;
    onRecordDelete?: (recordId: string) => void;
    onViewUpdate?: () => void;
}

export function DatabaseTableToolbar<TData>({
    table,
    properties,
    currentView,
    onRecordEdit,
    onRecordDelete,
    onViewUpdate,
}: DatabaseTableToolbarProps<TData>) {
    const { dialogOpen, setDialogOpen, searchQuery, setSearchQuery } = useDatabaseContext();
    const isFiltered = table.getState().columnFilters.length > 0;
    const selectedRows = table.getFilteredSelectedRowModel().rows;



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

    const handleBulkDelete = () => {
        if (selectedRows.length > 0) {
            // Handle bulk delete
            selectedRows.forEach((row) => {
                onRecordDelete?.((row.original).id);
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
        <TooltipProvider>
            <div className="flex items-center justify-between py-4 pe-2 border-b bg-background w-full">
                {/* Left side - Search bar ONLY */}
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

                {/* Right side - ALL other controls (Sort, Filter, Actions, View Options) */}
                <div className="flex items-center space-x-2 flex-shrink-0">
                    {/* Sort & Filter Controls */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDialogOpen('manage-sorts')}
                                disabled={!currentView}
                                className="h-8 w-8 p-0"
                            >
                                <ArrowDownUp className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Manage sorting rules</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDialogOpen('manage-filters')}
                                disabled={!currentView}
                                className="h-8 w-8 p-0"
                            >
                                <ListFilter className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Manage filter rules</p>
                        </TooltipContent>
                    </Tooltip>

                    {/* Clear filters */}
                    {isFiltered && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    onClick={() => table.resetColumnFilters()}
                                    className="h-8 w-8 p-0"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Clear all filters</p>
                            </TooltipContent>
                        </Tooltip>
                    )}
                    {/* Bulk actions for selected rows */}
                    {selectedRows.length > 0 && (
                        <>
                            <span className="text-sm text-muted-foreground font-medium">
                                {selectedRows.length} selected
                            </span>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleBulkEdit}
                                        disabled={!onRecordEdit}
                                        className="h-8 w-8 p-0"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Edit selected records</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleBulkCopy}
                                        className="h-8 w-8 p-0"
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Copy selected records</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleBulkDelete}
                                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Delete selected records</p>
                                </TooltipContent>
                            </Tooltip>
                        </>
                    )}

                    {/* Action buttons */}
                    <DropdownMenu>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>More actions</p>
                            </TooltipContent>
                        </Tooltip>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem onClick={handleExport} className={"px-4"}>
                                <Download className="h-4 w-4 mr-2" />
                                Export data
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem onClick={handleImport} className={"px-4"}>
                                <Upload className="h-4 w-4 mr-2" />
                                Import data
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem onClick={() => setDialogOpen('create-property')} className={"px-4"}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add property
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem onClick={() => setDialogOpen('create-view')} className={"px-4"}>
                                <Settings className="h-4 w-4 mr-2" />
                                Manage views
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* DatabaseViewOptions - part of the right side group */}
                    <DatabaseViewOptions
                        table={table}
                        properties={properties}
                        currentView={currentView}
                        onViewUpdate={onViewUpdate}
                    />
                </div>

            {/* Sort & Filter Management Dialogs */}
            {currentView && (
                <>
                    <SortManager
                        open={dialogOpen === 'manage-sorts'}
                        onOpenChange={(isOpen) => setDialogOpen(isOpen ? 'manage-sorts' : null)}
                        properties={properties}
                        currentView={currentView}
                        onSave={async (sorts) => {
                            try {
                                if (currentView && onViewUpdate) {
                                    const updatedView = {
                                        ...currentView,
                                        sorts: sorts
                                    };
                                    await onViewUpdate(updatedView);
                                    toast.success('Sorting updated');
                                }
                            } catch (error) {
                                console.error('Failed to update sorting:', error);
                                toast.error('Failed to update sorting');
                                throw error; // Re-throw to keep dialog open
                            }
                        }}
                    />

                    <FilterManager
                        open={dialogOpen === 'manage-filters'}
                        onOpenChange={(isOpen) => {
                            if (!isOpen) {
                                setDialogOpen(null);
                            }
                        }}
                        properties={properties}
                        currentView={currentView}
                        onSave={async (filters) => {
                            try {
                                if (currentView && onViewUpdate) {
                                    const updatedView = {
                                        ...currentView,
                                        filters: filters
                                    };
                                    await onViewUpdate(updatedView);
                                    toast.success('Filters updated');
                                }
                            } catch (error) {
                                console.error('Failed to update filters:', error);
                                toast.error('Failed to update filters');
                                throw error; // Re-throw to keep dialog open
                            }
                        }}
                    />
                </>
            )}


            </div>
        </TooltipProvider>
    );
}
