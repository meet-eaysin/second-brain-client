import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
    MoreHorizontal, 
    Database as DatabaseIcon, 
    Users, 
    Eye, 
    Edit, 
    Share, 
    Trash2,
    Lock,
    Globe
} from 'lucide-react';
import type { Database } from '@/types/database.types';

interface DatabaseCardProps {
    database: Database;
    onView?: (database: Database) => void;
    onEdit?: (database: Database) => void;
    onShare?: (database: Database) => void;
    onDelete?: (databaseId: string) => void;
    currentUserId?: string;
}

export const DatabaseCard: React.FC<DatabaseCardProps> = ({
    database,
    onView,
    onEdit,
    onShare,
    onDelete,
    currentUserId,
}) => {
    const isOwner = database.ownerId === currentUserId;
    const permissions = database.permissions || [];
    const canEdit = isOwner || permissions.some(
        p => p.userId === currentUserId && ['write', 'admin'].includes(p.permission)
    );
    const canDelete = isOwner || permissions.some(
        p => p.userId === currentUserId && p.permission === 'admin'
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getPermissionLevel = () => {
        if (isOwner) return 'Owner';
        const permission = database.permissions.find(p => p.userId === currentUserId);
        return permission ? permission.permission.charAt(0).toUpperCase() + permission.permission.slice(1) : 'Read';
    };

    return (
        <Card className="group hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            {database.icon ? (
                                <span className="text-lg">{database.icon}</span>
                            ) : (
                                <DatabaseIcon className="h-5 w-5 text-primary" />
                            )}
                        </div>
                        <div>
                            <CardTitle className="text-lg">{database.name}</CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                                <Badge variant={database.isPublic ? 'default' : 'secondary'} className="text-xs">
                                    {database.isPublic ? (
                                        <>
                                            <Globe className="mr-1 h-3 w-3" />
                                            Public
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="mr-1 h-3 w-3" />
                                            Private
                                        </>
                                    )}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                    {getPermissionLevel()}
                                </Badge>
                            </div>
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => onView?.(database)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Database
                            </DropdownMenuItem>
                            {canEdit && (
                                <DropdownMenuItem onClick={() => onEdit?.(database)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Database
                                </DropdownMenuItem>
                            )}
                            {(isOwner || canEdit) && (
                                <DropdownMenuItem onClick={() => onShare?.(database)}>
                                    <Share className="mr-2 h-4 w-4" />
                                    Share Database
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            {canDelete && (
                                <DropdownMenuItem 
                                    onClick={() => onDelete?.(database.id)}
                                    className="text-destructive"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Database
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent>
                {database.description && (
                    <CardDescription className="mb-4 line-clamp-2">
                        {database.description}
                    </CardDescription>
                )}
                
                <div className="space-y-3">
                    {/* Properties and Views Info */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                            <span>{database.properties.length} properties</span>
                            <span>{database.views.length} views</span>
                        </div>
                        {database.permissions.length > 0 && (
                            <div className="flex items-center space-x-1">
                                <Users className="h-3 w-3" />
                                <span>{database.permissions.length + 1}</span>
                            </div>
                        )}
                    </div>

                    {/* Shared Users */}
                    {database.permissions.length > 0 && (
                        <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">Shared with:</span>
                            <div className="flex -space-x-1">
                                {database.permissions.slice(0, 3).map((permission) => (
                                    <Avatar key={permission.userId} className="h-6 w-6 border-2 border-background">
                                        <AvatarFallback className="text-xs">
                                            {permission.userId.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                ))}
                                {database.permissions.length > 3 && (
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                                        +{database.permissions.length - 3}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-xs text-muted-foreground">
                            Updated {formatDate(database.updatedAt)}
                        </span>
                        <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => onView?.(database)}
                        >
                            Open
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
