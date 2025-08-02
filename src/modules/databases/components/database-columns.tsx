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
import { DatabaseTableHeader } from './database-table-header';
import {
    MoreHorizontal,
    Edit,
    Copy,
    Trash2,
} from 'lucide-react';
import type { DatabaseRecord, DatabaseProperty } from '@/types/database.types';
import { EditableCell } from './editable-cell';

// Property type icons are now handled by DatabaseTableHeader component

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
const renderCellValue = (property: DatabaseProperty, value: unknown) => {
    if (!value && value !== false && value !== 0) {
        return <span className="text-muted-foreground">-</span>;
    }

    switch (property.type) {
        case 'SELECT': {
            // Handle new API response structure where SELECT returns option object
            if (typeof value === 'object' && value !== null && 'name' in value && 'color' in value) {
                const option = value as { id: string; name: string; color: string };
                return (
                    <Badge
                        className="text-white border-0"
                        style={{ backgroundColor: option.color }}
                    >
                        {option.name}
                    </Badge>
                );
            }

            // Fallback for old API response structure (option ID as string)
            const colorClass = statusColors[value as keyof typeof statusColors] ||
                             priorityColors[value as keyof typeof priorityColors] ||
                             'bg-gray-100 text-gray-800';
            return <Badge className={colorClass}>{value}</Badge>;
        }

        case 'MULTI_SELECT':
            if (!Array.isArray(value)) return <span className="text-muted-foreground">-</span>;
            return (
                <div className="flex flex-wrap gap-1">
                    {value.map((option, index) => {
                        // Handle new API response structure where MULTI_SELECT returns option objects
                        if (typeof option === 'object' && option !== null && 'name' in option && 'color' in option) {
                            const optionObj = option as { id: string; name: string; color: string };
                            return (
                                <Badge
                                    key={optionObj.id || index}
                                    className="text-white border-0"
                                    style={{ backgroundColor: optionObj.color }}
                                >
                                    {optionObj.name}
                                </Badge>
                            );
                        }

                        // Fallback for old API response structure (option ID as string)
                        return (
                            <Badge
                                key={index}
                                className={statusColors[option as keyof typeof statusColors] ||
                                         priorityColors[option as keyof typeof priorityColors] ||
                                         'bg-gray-100 text-gray-800'}
                            >
                                {option}
                            </Badge>
                        );
                    })}
                </div>
            );

        case 'CHECKBOX':
            return <Checkbox checked={value === true || value === 'true'} disabled />;

        case 'DATE':
            return value ? new Date(value).toLocaleDateString() : '-';

        case 'URL':
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

        case 'EMAIL':
            return (
                <a
                    href={`mailto:${value}`}
                    className="text-blue-600 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                >
                    {value}
                </a>
            );

        case 'PHONE':
            return (
                <a
                    href={`tel:${value}`}
                    className="text-blue-600 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                >
                    {value}
                </a>
            );

        case 'RELATION':
            return (
                <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate max-w-xs">{value}</span>
                </div>
            );

        case 'FORMULA':
        case 'ROLLUP':
            return <span className="truncate max-w-xs font-mono text-sm">{String(value)}</span>;

        case 'CREATED_TIME':
        case 'LAST_EDITED_TIME':
            return value ? new Date(value).toLocaleString() : '-';

        case 'CREATED_BY':
        case 'LAST_EDITED_BY':
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
    onDelete?: (recordId: string) => void,
    onUpdateRecord?: (recordId: string, propertyId: string, newValue: any) => void,
    isFrozen?: boolean
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
        columns.push({
            accessorKey: `properties.${property.id}`,
            id: property.id,
            header: ({ column }) => (
                <DatabaseTableHeader
                    property={property}
                    sortDirection={
                        column.getIsSorted() === 'asc' ? 'asc' :
                        column.getIsSorted() === 'desc' ? 'desc' :
                        null
                    }
                    isFiltered={column.getFilterValue() !== undefined}
                    isFrozen={false} // TODO: Get from view state
                    onPropertyUpdate={() => {
                        // Refresh table data if needed
                        console.log('Property updated, refreshing table...');
                    }}
                />
            ),
            cell: ({ row }) => {
                const value = row.original.properties[property.id];

                // Use EditableCell if onUpdateRecord is provided, otherwise use static rendering
                if (onUpdateRecord) {
                    return (
                        <EditableCell
                            property={property}
                            value={value}
                            record={row.original}
                            onSave={onUpdateRecord}
                            onCancel={() => {}}
                            isFrozen={isFrozen}
                        />
                    );
                }

                return renderCellValue(property, value);
            },
            enableSorting: true,
            enableHiding: true,
            filterFn: (row, _id, value) => {
                const cellValue = row.original.properties[property.id];

                if (property.type === 'MULTI_SELECT' && Array.isArray(cellValue)) {
                    return value.some((v: string) => {
                        return cellValue.some((option: string | { id: string; name: string; color: string }) => {
                            // Handle new API response structure (option objects)
                            if (typeof option === 'object' && option !== null && 'id' in option) {
                                return option.id === v || option.name === v;
                            }
                            // Handle old API response structure (option IDs)
                            return option === v;
                        });
                    });
                }

                if (property.type === 'SELECT') {
                    // Handle new API response structure (option object)
                    if (typeof cellValue === 'object' && cellValue !== null && 'id' in cellValue) {
                        return value.includes(cellValue.id) || value.includes(cellValue.name);
                    }
                    // Handle old API response structure (option ID)
                    return value.includes(cellValue);
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
