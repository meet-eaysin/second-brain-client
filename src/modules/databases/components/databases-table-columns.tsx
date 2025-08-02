import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
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
    Eye,
    Edit,
    Share,
    Trash2,
    Users,
    Globe,
    Lock,
    Calendar,
    Clock,
} from 'lucide-react';
import { Database as DatabaseType } from '@/types/database.types';

interface DatabasesTableColumnsProps {
    onView?: (database: DatabaseType) => void;
    onEdit?: (database: DatabaseType) => void;
    onShare?: (database: DatabaseType) => void;
    onDelete?: (databaseId: string) => void;
    currentUserId?: string;
}

export function getDatabasesTableColumns({
    onView,
    onEdit,
    onShare,
    onDelete,
    currentUserId,
}: DatabasesTableColumnsProps): ColumnDef<DatabaseType>[] {
    return [
        {
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
        },

        // Database name and info
        {
            accessorKey: 'name',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Database" />
            ),
            cell: ({ row }) => {
                const database = row.original;
                return (
                    <div className="flex items-center space-x-3 min-w-0">
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-foreground truncate">
                                    {database.name}
                                </p>
                                {database.isPublic && (
                                    <Globe className="h-3 w-3 text-muted-foreground" />
                                )}
                                {!database.isPublic && (
                                    <Lock className="h-3 w-3 text-muted-foreground" />
                                )}
                            </div>
                            {database.description && (
                                <p className="text-xs text-muted-foreground truncate">
                                    {database.description}
                                </p>
                            )}
                        </div>
                    </div>
                );
            },
            enableSorting: true,
            enableHiding: false,
        },

        // Owner
        {
            accessorKey: 'owner',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Owner" />
            ),
            cell: ({ row }) => {
                const database = row.original;
                const isOwner = database.ownerId === currentUserId;
                
                return (
                    <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                                {database.owner?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                            <p className="text-sm font-medium truncate">
                                {isOwner ? 'You' : (database.owner?.name || 'Unknown')}
                            </p>
                        </div>
                    </div>
                );
            },
            enableSorting: true,
            enableHiding: true,
        },

        // Records count
        {
            accessorKey: 'recordsCount',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Records" />
            ),
            cell: ({ row }) => {
                const database = row.original;
                const count = database.recordsCount || 0;
                return (
                    <div className="flex items-center space-x-1">
                        <span className="text-sm font-mono">{count.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">records</span>
                    </div>
                );
            },
            enableSorting: true,
            enableHiding: true,
        },

        // Collaborators
        {
            accessorKey: 'collaborators',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Collaborators" />
            ),
            cell: ({ row }) => {
                const database = row.original;
                const collaboratorCount = database.permissions?.length || 0;
                
                return (
                    <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{collaboratorCount}</span>
                    </div>
                );
            },
            enableSorting: true,
            enableHiding: true,
        },

        // Status/Visibility
        {
            accessorKey: 'isPublic',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Visibility" />
            ),
            cell: ({ row }) => {
                const database = row.original;
                return (
                    <Badge variant={database.isPublic ? 'default' : 'secondary'}>
                        {database.isPublic ? (
                            <>
                                <Globe className="h-3 w-3 mr-1" />
                                Public
                            </>
                        ) : (
                            <>
                                <Lock className="h-3 w-3 mr-1" />
                                Private
                            </>
                        )}
                    </Badge>
                );
            },
            enableSorting: true,
            enableHiding: true,
        },

        // Last updated
        {
            accessorKey: 'updatedAt',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Updated" />
            ),
            cell: ({ row }) => {
                const database = row.original;
                const date = database.updatedAt ? new Date(database.updatedAt) : null;
                
                return (
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                            {date ? date.toLocaleDateString() : 'Unknown'}
                        </span>
                    </div>
                );
            },
            enableSorting: true,
            enableHiding: true,
        },

        // Created date
        {
            accessorKey: 'createdAt',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Created" />
            ),
            cell: ({ row }) => {
                const database = row.original;
                const date = database.createdAt ? new Date(database.createdAt) : null;
                
                return (
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>
                            {date ? date.toLocaleDateString() : 'Unknown'}
                        </span>
                    </div>
                );
            },
            enableSorting: true,
            enableHiding: true,
        },

        // Actions
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const database = row.original;
                const isOwner = database.ownerId === currentUserId;
                const permissions = database.permissions || [];
                const canEdit = isOwner || permissions.some(
                    p => p.userId === currentUserId && ['write', 'admin'].includes(p.permission)
                );
                const canDelete = isOwner || permissions.some(
                    p => p.userId === currentUserId && p.permission === 'admin'
                );

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
                            <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                console.log('View button clicked for database:', database);
                                onView?.(database);
                            }}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Database
                            </DropdownMenuItem>
                            {canEdit && (
                                <DropdownMenuItem onClick={() => onEdit?.(database)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => onShare?.(database)}>
                                <Share className="mr-2 h-4 w-4" />
                                Share
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {canDelete && (
                                <DropdownMenuItem
                                    onClick={() => onDelete?.(database.id)}
                                    className="text-destructive"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
            enableSorting: false,
            enableHiding: false,
            size: 60,
        },
    ];
}
