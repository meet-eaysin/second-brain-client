import React from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import {
    MoreHorizontal,
    Edit,
    Copy,
    Trash2,
    Calendar,
    Hash,
    Type,
    CheckSquare,
    Users,
    Link as LinkIcon,
    Tag,
    Mail,
    Phone,
} from 'lucide-react';
import type { DatabaseRecord, DatabaseProperty } from '@/types/database.types';

// Property type icons
const propertyTypeIcons = {
    text: Type,
    number: Hash,
    select: Tag,
    multiselect: Tag,
    date: Calendar,
    checkbox: CheckSquare,
    person: Users,
    url: LinkIcon,
    email: Mail,
    phone: Phone,
};

// Status and priority colors
const statusColors = {
    'Todo': 'bg-gray-100 text-gray-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    'Done': 'bg-green-100 text-green-800',
    'Canceled': 'bg-red-100 text-red-800',
    'Planning': 'bg-yellow-100 text-yellow-800',
    'Active': 'bg-blue-100 text-blue-800',
    'On Hold': 'bg-orange-100 text-orange-800',
    'Completed': 'bg-green-100 text-green-800',
};

const priorityColors = {
    'Low': 'bg-green-100 text-green-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'High': 'bg-red-100 text-red-800',
    'Urgent': 'bg-red-100 text-red-800',
};

// Utility function to render cell value based on property type
const renderCellValue = (property: DatabaseProperty, value: any) => {
    if (!value && value !== false && value !== 0) {
        return <span className="text-muted-foreground">-</span>;
    }

    switch (property.type) {
        case 'select':
            const colorClass = statusColors[value as keyof typeof statusColors] || 
                             priorityColors[value as keyof typeof priorityColors] || 
                             'bg-gray-100 text-gray-800';
            return <Badge className={colorClass}>{value}</Badge>;

        case 'multiselect':
            if (!Array.isArray(value)) return <span className="text-muted-foreground">-</span>;
            return (
                <div className="flex flex-wrap gap-1">
                    {value.map((option, index) => (
                        <Badge 
                            key={index} 
                            className={statusColors[option as keyof typeof statusColors] || 
                                     priorityColors[option as keyof typeof priorityColors] || 
                                     'bg-gray-100 text-gray-800'}
                        >
                            {option}
                        </Badge>
                    ))}
                </div>
            );

        case 'checkbox':
            return <Checkbox checked={value === true || value === 'true'} disabled />;

        case 'date':
            return value ? new Date(value).toLocaleDateString() : '-';

        case 'url':
            return (
                <a 
                    href={value} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:underline truncate max-w-xs"
                    onClick={(e) => e.stopPropagation()}
                >
                    {value}
                </a>
            );

        case 'email':
            return (
                <a 
                    href={`mailto:${value}`} 
                    className="text-blue-600 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                >
                    {value}
                </a>
            );

        case 'phone':
            return (
                <a 
                    href={`tel:${value}`} 
                    className="text-blue-600 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                >
                    {value}
                </a>
            );

        case 'person':
            return (
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                        {String(value).charAt(0).toUpperCase()}
                    </div>
                    <span className="truncate max-w-xs">{value}</span>
                </div>
            );

        default:
            return <span className="truncate max-w-xs" title={String(value)}>{String(value)}</span>;
    }
};

// Generate columns based on database properties
export const generateDatabaseColumns = (
    properties: DatabaseProperty[],
    onEdit?: (record: DatabaseRecord) => void,
    onDelete?: (recordId: string) => void
): ColumnDef<DatabaseRecord>[] => {
    const columns: ColumnDef<DatabaseRecord>[] = [
        // Selection column
        {
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
                    onClick={(e) => e.stopPropagation()}
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
    ];

    // Add property columns
    properties.forEach((property) => {
        const PropertyIcon = propertyTypeIcons[property.type as keyof typeof propertyTypeIcons] || Type;
        
        columns.push({
            accessorKey: `properties.${property.id}`,
            id: property.id,
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={property.name}>
                    <div className="flex items-center gap-2">
                        <PropertyIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{property.name}</span>
                        {property.required && <span className="text-red-500">*</span>}
                    </div>
                </DataTableColumnHeader>
            ),
            cell: ({ row }) => {
                const value = row.original.properties[property.id];
                return renderCellValue(property, value);
            },
            enableSorting: true,
            enableHiding: true,
            filterFn: (row, id, value) => {
                const cellValue = row.original.properties[property.id];
                if (property.type === 'multiselect' && Array.isArray(cellValue)) {
                    return value.some((v: string) => cellValue.includes(v));
                }
                return value.includes(cellValue);
            },
        });
    });

    // Actions column
    columns.push({
        id: 'actions',
        cell: ({ row }) => {
            const record = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit?.(record);
                            }}
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit record
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={(e) => {
                                e.stopPropagation();
                                // Handle duplicate
                                console.log('Duplicate record:', record);
                            }}
                        >
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete?.(record.id);
                            }}
                            className="text-red-600"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
        enableSorting: false,
        enableHiding: false,
    });

    return columns;
};
