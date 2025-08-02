import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTableViewOptions } from '@/components/data-table/data-table-view-options';
import { Table } from "@tanstack/react-table";
import {
    Search,
    X,
    SortAsc,
    SortDesc,
    MoreHorizontal,
    Plus
} from "lucide-react";
import { Database } from '@/types/database.types';

interface DatabasesTableToolbarProps {
    table: Table<Database>;
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
}

export function DatabasesTableToolbar({
    table,
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
}: DatabasesTableToolbarProps) {
    const isFiltered = table.getState().columnFilters.length > 0 || 
                      searchQuery !== '' || 
                      filterOwner !== 'all' || 
                      filterPublic !== 'all';

    const handleClearFilters = () => {
        table.resetColumnFilters();
        onSearchChange('');
        onFilterOwnerChange('all');
        onFilterPublicChange('all');
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
                {/* Search Input */}
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search databases..."
                        value={searchQuery}
                        onChange={(event) => onSearchChange(event.target.value)}
                        className="h-8 w-[150px] lg:w-[250px] pl-8"
                    />
                </div>

                <div className="flex gap-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 w-[140px] justify-between">
                                <span className="flex items-center gap-2">
                                    {sortOrder === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />}
                                    {sortBy === 'name' ? 'Name' :
                                     sortBy === 'createdAt' ? 'Created' :
                                     sortBy === 'updatedAt' ? 'Updated' :
                                     'Last Accessed'}
                                </span>
                                <MoreHorizontal className="h-3 w-3" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48">
                            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem
                                checked={sortBy === 'name'}
                                onCheckedChange={(checked) => checked && onSortByChange('name')}
                            >
                                Name
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={sortBy === 'createdAt'}
                                onCheckedChange={(checked) => checked && onSortByChange('createdAt')}
                            >
                                Created Date
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={sortBy === 'updatedAt'}
                                onCheckedChange={(checked) => checked && onSortByChange('updatedAt')}
                            >
                                Updated Date
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={sortBy === 'lastAccessedAt'}
                                onCheckedChange={(checked) => checked && onSortByChange('lastAccessedAt')}
                            >
                                Last Accessed
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem
                                checked={sortOrder === 'asc'}
                                onCheckedChange={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
                            >
                                Ascending
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Clear Filters */}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={handleClearFilters}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Right side controls */}
            <div className="flex items-center space-x-2">
                {/* Column visibility */}
                <DataTableViewOptions table={table} />

                {/* Create Database Button */}
                <Button onClick={onCreateDatabase} size="sm" className="h-8">
                    <Plus className="mr-2 h-4 w-4" />
                    New Database
                </Button>
            </div>
        </div>
    );
}
