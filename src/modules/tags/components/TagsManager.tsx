import React, { useState } from 'react';
import { Plus, Search, Tag, Edit, Trash2, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useGetTags, useDeleteTag } from '../services/tagsQueries';
import { CreateTagDialog } from './CreateTagDialog';
import { EditTagDialog } from './EditTagDialog';
import type { TagWithUsage } from '@/types/tags.types';

export const TagsManager: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState<TagWithUsage | null>(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const { data: tagsResponse, isLoading, error } = useGetTags({
        search: searchQuery || undefined,
        sortBy: 'name',
        sortOrder: 'asc',
    });

    const deleteTagMutation = useDeleteTag();

    const handleDeleteTag = async (tagId: string) => {
        if (window.confirm('Are you sure you want to delete this tag? This action cannot be undone.')) {
            await deleteTagMutation.mutateAsync(tagId);
        }
    };

    const handleEditTag = (tag: TagWithUsage) => {
        setSelectedTag(tag);
        setIsEditDialogOpen(true);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 p-4">
                Failed to load tags. Please try again.
            </div>
        );
    }

    const tags = tagsResponse?.tags || [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Hash className="h-6 w-6" />
                    <h1 className="text-2xl font-bold">Tags</h1>
                    <Badge variant="secondary">{tags.length}</Badge>
                </div>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Tag
                </Button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Tags Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tags.map((tag) => (
                    <Card key={tag.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: tag.color }}
                                    />
                                    <CardTitle className="text-lg">{tag.name}</CardTitle>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEditTag(tag)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteTag(tag.id)}
                                        disabled={deleteTagMutation.isPending}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {tag.description && (
                                <p className="text-sm text-muted-foreground mb-3">
                                    {tag.description}
                                </p>
                            )}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Databases:</span>
                                    <Badge variant="outline">{tag.usedInDatabases}</Badge>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span>Files:</span>
                                    <Badge variant="outline">{tag.usedInFiles}</Badge>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span>Workspaces:</span>
                                    <Badge variant="outline">{tag.usedInWorkspaces}</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {tags.length === 0 && (
                <div className="text-center py-12">
                    <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No tags found</h3>
                    <p className="text-muted-foreground mb-4">
                        {searchQuery ? 'Try adjusting your search terms.' : 'Create your first tag to get started.'}
                    </p>
                    {!searchQuery && (
                        <Button onClick={() => setIsCreateDialogOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Tag
                        </Button>
                    )}
                </div>
            )}

            {/* Dialogs */}
            <CreateTagDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
            />
            
            {selectedTag && (
                <EditTagDialog
                    tag={selectedTag}
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                />
            )}
        </div>
    );
};
