import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import {
    MoreHorizontal,
    Database as DatabaseIcon,
    Eye,
    Edit,
    Share,
    Trash2,
    Lock,
    Globe,
    Clock,
    FileText,
    Heart,
    FolderOpen,
    Tag,
    Copy
} from 'lucide-react';
import type { Database, DatabaseCategory } from '@/types/database.types';
import { useToggleFavorite, useMoveToCategory, useCategories, useTrackAccess } from '../hooks/enhanced-features-hooks';

interface DatabaseCardProps {
    database: Database;
    onView?: (database: Database) => void;
    onEdit?: (database: Database) => void;
    onShare?: (database: Database) => void;
    onDelete?: (databaseId: string) => void;
    onDuplicate?: (database: Database) => void;
    currentUserId?: string;
}

export const DatabaseCard: React.FC<DatabaseCardProps> = ({
    database,
    onView,
    onEdit,
    onShare,
    onDelete,
    onDuplicate,
    currentUserId,
}) => {
    const [categories, setCategories] = useState<DatabaseCategory[]>([]);
    const [setIsLoadingCategories] = useState(false);

    const toggleFavoriteMutation = useToggleFavorite();
    const moveToCategoryMutation = useMoveToCategory();
    const trackAccessMutation = useTrackAccess();
    const { getCategories } = useCategories();

    const isOwner = database.ownerId === currentUserId;
    const permissions = database.permissions || [];
    const canEdit = isOwner || permissions.some(
        p => p.userId === currentUserId && ['write', 'admin'].includes(p.permission)
    );
    const canDelete = isOwner || permissions.some(
        p => p.userId === currentUserId && p.permission === 'admin'
    );

    // Load categories when component mounts
    useEffect(() => {
        const loadCategories = async () => {
            setIsLoadingCategories(true);
            try {
                const categoriesData = await getCategories();
                setCategories(categoriesData);
            } catch (error) {
                console.error('Failed to load categories:', error);
            } finally {
                setIsLoadingCategories(false);
            }
        };

        loadCategories();
    }, [getCategories]);

    const formatRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return 'Today';
        if (diffInDays === 1) return 'Yesterday';
        if (diffInDays < 7) return `${diffInDays}d ago`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;
        if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}mo ago`;
        return `${Math.floor(diffInDays / 365)}y ago`;
    };

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleFavoriteMutation.mutate(database.id);
    };

    const handleMoveToCategory = (categoryId: string | null) => {
        moveToCategoryMutation.mutate({ databaseId: database.id, categoryId });
    };

    const handleView = () => {
        trackAccessMutation.mutate({ databaseId: database.id, action: 'view' });
        onView?.(database);
    };

    const handleEdit = () => {
        trackAccessMutation.mutate({ databaseId: database.id, action: 'edit' });
        onEdit?.(database);
    };

    const handleShare = () => {
        trackAccessMutation.mutate({ databaseId: database.id, action: 'share' });
        onShare?.(database);
    };

    const handleDuplicate = () => {
        onDuplicate?.(database);
    };

    const getVisibilityInfo = () => {
        if (database.isPublic) {
            return {
                icon: Globe,
                label: 'Public',
                variant: 'default' as const,
            };
        }
        
        if (permissions.length > 0) {
            return {
                icon: Share,
                label: `Shared with ${permissions.length}`,
                variant: 'secondary' as const,
            };
        }
        
        return {
            icon: Lock,
            label: 'Private',
            variant: 'outline' as const,
        };
    };

    const visibilityInfo = getVisibilityInfo();
    const VisibilityIcon = visibilityInfo.icon;

    return (
        <Card className="group hover:shadow-md py-0 transition-all duration-200 cursor-pointer border">
            <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                        {/* Icon */}
                        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                            {database.icon ? (
                                <span className="text-lg">{database.icon}</span>
                            ) : (
                                <DatabaseIcon className="w-4 h-4 text-primary" />
                            )}
                        </div>
                        
                        {/* Title and Description */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h3
                                    className="font-semibold text-base truncate cursor-pointer hover:text-primary transition-colors"
                                    onClick={handleView}
                                    title={database.name}
                                >
                                    {database.name}
                                </h3>
                                {database.isFavorite && (
                                    <Heart className="h-4 w-4 fill-current text-red-500 flex-shrink-0" />
                                )}
                            </div>
                            {database.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                    {database.description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions and Menu */}
                    <div className="flex items-center gap-1">
                        {/* Quick Favorite Button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={handleToggleFavorite}
                        >
                            <Heart className={`h-4 w-4 ${database.isFavorite ? 'fill-current text-red-500' : ''}`} />
                        </Button>

                        {/* Actions Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-8 w-8 p-0"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={handleView}>
                                <Eye className="mr-2 h-4 w-4" />
                                Open Database
                            </DropdownMenuItem>
                            {canEdit && (
                                <DropdownMenuItem onClick={handleEdit}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                            )}
                            {(isOwner || canEdit) && (
                                <DropdownMenuItem onClick={handleShare}>
                                    <Share className="mr-2 h-4 w-4" />
                                    Share
                                </DropdownMenuItem>
                            )}

                            <DropdownMenuSeparator />

                            {/* Favorite Toggle */}
                            <DropdownMenuItem onClick={handleToggleFavorite}>
                                {database.isFavorite ? (
                                    <>
                                        <Heart className="mr-2 h-4 w-4 fill-current text-red-500" />
                                        Remove from Favorites
                                    </>
                                ) : (
                                    <>
                                        <Heart className="mr-2 h-4 w-4" />
                                        Add to Favorites
                                    </>
                                )}
                            </DropdownMenuItem>

                            {/* Category Selection */}
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                    <Tag className="mr-2 h-4 w-4" />
                                    Move to Category
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem onClick={() => handleMoveToCategory(null)}>
                                        <FolderOpen className="mr-2 h-4 w-4" />
                                        No Category
                                    </DropdownMenuItem>
                                    {categories.map((category) => (
                                        <DropdownMenuItem
                                            key={category.id}
                                            onClick={() => handleMoveToCategory(category.id)}
                                        >
                                            <span
                                                className="mr-2 text-sm"
                                                style={{ color: category.color }}
                                            >
                                                {category.icon || '📁'}
                                            </span>
                                            {category.name}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>

                            {/* Duplicate Database */}
                            <DropdownMenuItem onClick={handleDuplicate}>
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicate
                            </DropdownMenuItem>

                            {canDelete && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => onDelete?.(database.id)}
                                        className="text-destructive focus:text-destructive"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        <span>{database.properties?.length || 0} fields</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{database.views?.length || 0} views</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-3">
                        {/* Visibility Badge */}
                        <Badge variant={visibilityInfo.variant} className="text-xs">
                            <VisibilityIcon className="w-3 h-3 mr-1" />
                            {visibilityInfo.label}
                        </Badge>
                        
                        {/* Owner Badge */}
                        {isOwner && (
                            <Badge variant="outline" className="text-xs">
                                Owner
                            </Badge>
                        )}
                    </div>

                    {/* Last Updated */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{formatRelativeTime(database.updatedAt)}</span>
                    </div>
                </div>

                {/* Hover Action */}
                <div className="mt-4">
                    <Button 
                        onClick={() => onView?.(database)}
                        className="w-full"
                        size="sm"
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        Open Database
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

// Optional: Compact variant for dense layouts
export const DatabaseCardCompact: React.FC<DatabaseCardProps> = ({
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

    const formatRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        
        if (diffInDays === 0) return 'Today';
        if (diffInDays === 1) return 'Yesterday';
        if (diffInDays < 7) return `${diffInDays}d`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w`;
        return `${Math.floor(diffInDays / 30)}mo`;
    };

    return (
        <Card className="group hover:shadow-md transition-all duration-200 cursor-pointer border">
            <CardContent className="p-4">
                <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                        {database.icon ? (
                            <span className="text-sm">{database.icon}</span>
                        ) : (
                            <DatabaseIcon className="w-4 h-4 text-primary" />
                        )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                            <h3 
                                className="font-medium truncate cursor-pointer hover:text-primary transition-colors"
                                onClick={() => onView?.(database)}
                                title={database.name}
                            >
                                {database.name}
                            </h3>
                            <div className="flex items-center gap-2 shrink-0">
                                {database.isPublic ? (
                                    <Globe className="w-3 h-3 text-green-600" />
                                ) : permissions.length > 0 ? (
                                    <Share className="w-3 h-3 text-blue-600" />
                                ) : (
                                    <Lock className="w-3 h-3 text-muted-foreground" />
                                )}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button 
                                            variant="ghost" 
                                            size="sm"
                                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <MoreHorizontal className="h-3 w-3" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-40">
                                        <DropdownMenuItem onClick={() => onView?.(database)}>
                                            <Eye className="mr-2 h-3 w-3" />
                                            Open
                                        </DropdownMenuItem>
                                        {canEdit && (
                                            <DropdownMenuItem onClick={() => onEdit?.(database)}>
                                                <Edit className="mr-2 h-3 w-3" />
                                                Edit
                                            </DropdownMenuItem>
                                        )}
                                        {(isOwner || canEdit) && (
                                            <DropdownMenuItem onClick={() => onShare?.(database)}>
                                                <Share className="mr-2 h-3 w-3" />
                                                Share
                                            </DropdownMenuItem>
                                        )}
                                        {canDelete && (
                                            <>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem 
                                                    onClick={() => onDelete?.(database.id)}
                                                    className="text-destructive"
                                                >
                                                    <Trash2 className="mr-2 h-3 w-3" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{database.properties?.length || 0} fields • {database.views?.length || 0} views</span>
                            <span>{formatRelativeTime(database.updatedAt)}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};