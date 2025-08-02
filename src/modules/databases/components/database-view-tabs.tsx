import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Tabs,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ConfirmDialog } from '@/components/confirm-dialog';
import {
    Table,
    Kanban,
    Grid3X3,
    List,
    Calendar,
    Clock,
    Plus,
    MoreHorizontal,
    Edit,
    Copy,
    Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useDatabaseContext } from '../context/database-context';
import { useDeleteView, useDuplicateView } from '../services/databaseQueries';
import type { DatabaseView, DatabaseProperty, DatabaseRecord } from '@/types/database.types';

interface DatabaseViewTabsProps {
    views: DatabaseView[];
    properties: DatabaseProperty[];
    records: DatabaseRecord[];
    currentViewId?: string;
    onViewChange: (viewId: string) => void;
    onViewUpdate?: () => void;
}

const VIEW_TYPE_ICONS = {
    TABLE: Table,
    BOARD: Kanban,
    GALLERY: Grid3X3,
    LIST: List,
    CALENDAR: Calendar,
    TIMELINE: Clock,
} as const;

const VIEW_TYPE_LABELS = {
    TABLE: 'Table',
    BOARD: 'Board',
    GALLERY: 'Gallery',
    LIST: 'List',
    CALENDAR: 'Calendar',
    TIMELINE: 'Timeline',
} as const;

export function DatabaseViewTabs({
    views,
    properties,
    records,
    currentViewId,
    onViewChange,
    onViewUpdate,
}: DatabaseViewTabsProps) {
    const { currentDatabase, setDialogOpen, setCurrentView } = useDatabaseContext();
    const deleteViewMutation = useDeleteView();
    const duplicateViewMutation = useDuplicateView();

    // Confirmation dialog state
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [viewToDelete, setViewToDelete] = useState<DatabaseView | null>(null);

    // Get current view or default to first view
    const activeViewId = currentViewId || views.find(v => v.isDefault)?.id || views[0]?.id;
    const activeView = views.find(v => v.id === activeViewId) || views[0];

    const handleViewChange = (viewId: string) => {
        onViewChange(viewId);
    };

    const handleAddView = () => {
        setDialogOpen('create-view');
    };

    const handleEditView = (view: DatabaseView) => {
        setCurrentView(view);
        setDialogOpen('edit-view');
    };

    const handleDuplicateView = async (view: DatabaseView) => {
        if (!currentDatabase?.id) return;

        try {
            await duplicateViewMutation.mutateAsync({
                databaseId: currentDatabase.id,
                viewId: view.id,
                data: {
                    name: `${view.name} Copy`,
                }
            });
            onViewUpdate?.();
        } catch (error) {
            console.error('Failed to duplicate view:', error);
        }
    };

    const handleDeleteView = (view: DatabaseView) => {
        if (!currentDatabase?.id) return;
        if (views.length <= 1) {
            toast.error('Cannot delete the last view');
            return;
        }
        if (view.isDefault) {
            toast.error('Cannot delete the default view');
            return;
        }

        // Show confirmation dialog
        setViewToDelete(view);
        setDeleteConfirmOpen(true);
    };

    const confirmDeleteView = async () => {
        if (!currentDatabase?.id || !viewToDelete) return;

        try {
            await deleteViewMutation.mutateAsync({
                databaseId: currentDatabase.id,
                viewId: viewToDelete.id,
            });
            onViewUpdate?.();

            // Switch to default view if current view was deleted
            if (viewToDelete.id === activeViewId) {
                const defaultView = views.find(v => v.isDefault) || views[0];
                if (defaultView && defaultView.id !== viewToDelete.id) {
                    handleViewChange(defaultView.id);
                }
            }
        } catch (error) {
            console.error('Failed to delete view:', error);
        } finally {
            setViewToDelete(null);
        }
    };

    if (!views.length) {
        return (
            <div className="flex items-center justify-between border-b">
                <div className="flex items-center gap-2 p-4">
                    <span className="text-sm text-muted-foreground">No views available</span>
                </div>
                <Button onClick={handleAddView} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add View
                </Button>
            </div>
        );
    }

    return (
        <>
            <div className="border-b">
                <div className="flex items-center justify-between">
                    <Tabs value={activeViewId} onValueChange={handleViewChange} className="flex-1">
                    <div className="flex items-center justify-between py-2">
                        <TabsList className="h-9">
                            {views.map((view) => {
                                const Icon = VIEW_TYPE_ICONS[view.type] || Table;
                                return (
                                    <TabsTrigger
                                        key={view.id}
                                        value={view.id}
                                        className="flex items-center gap-2 text-sm"
                                    >
                                        <Icon className="h-3 w-3" />
                                        {view.name}
                                        {view.isDefault && (
                                            <Badge variant="secondary" className="text-xs px-1 ml-1">
                                                Default
                                            </Badge>
                                        )}
                                    </TabsTrigger>
                                );
                            })}
                        </TabsList>

                        <div className="flex items-center gap-2">
                            {/* View Actions */}
                            {activeView && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>View Actions</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => handleEditView(activeView)}>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit View
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDuplicateView(activeView)}>
                                            <Copy className="h-4 w-4 mr-2" />
                                            Duplicate View
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem 
                                            onClick={() => handleDeleteView(activeView)}
                                            disabled={activeView.isDefault || views.length <= 1}
                                            className="text-destructive focus:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete View
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}

                            {/* Add View Button */}
                            <Button onClick={handleAddView} size="sm" variant="outline">
                                <Plus className="h-4 w-4 mr-2" />
                                Add View
                            </Button>
                        </div>
                    </div>
                </Tabs>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
                title="Delete View"
                desc={`Are you sure you want to delete the view "${viewToDelete?.name}"? This action cannot be undone.`}
                confirmText="Delete"
                destructive={true}
                handleConfirm={confirmDeleteView}
            />
        </>
    );
}
