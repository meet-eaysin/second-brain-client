import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Plus,
    Settings,
    Eye,
    EyeOff,
    Lock,
    Unlock,
    Trash2,
    Copy,
    Move,
    Filter,
    SortAsc,
    Table,
    Kanban,
    Calendar,
    SquareChartGantt,
    GalleryHorizontal,
    List,
    MoreHorizontal
} from 'lucide-react';
import { databasesDocumentViewService } from '../services/databases-document-view.service';
import type { DocumentView } from '@/types/document';

interface DatabaseViewManagerProps {
    currentView?: DocumentView;
    onViewChange?: (viewId: string) => void;
    onViewUpdate?: () => void;
}

export function DatabaseViewManager({
    currentView,
    onViewChange,
    onViewUpdate
}: DatabaseViewManagerProps) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isPropertyDialogOpen, setIsPropertyDialogOpen] = useState(false);
    const [newViewName, setNewViewName] = useState('');
    const [newViewType, setNewViewType] = useState<'TABLE' | 'KANBAN' | 'CALENDAR' | 'TIMELINE' | 'GALLERY' | 'LIST'>('TABLE');
    const [newViewDescription, setNewViewDescription] = useState('');

    const handleCreateView = async () => {
        try {
            await databasesDocumentViewService.createDatabasesView({
                name: newViewName,
                type: newViewType,
                description: newViewDescription,
                isDefault: false,
                isPublic: false
            });
            
            setIsCreateDialogOpen(false);
            setNewViewName('');
            setNewViewDescription('');
            onViewUpdate?.();
        } catch (error) {
            console.error('Failed to create view:', error);
        }
    };

    const handleDuplicateView = async (viewId: string) => {
        try {
            await databasesDocumentViewService.duplicateDatabasesView(viewId, `${currentView?.name} (Copy)`);
            onViewUpdate?.();
        } catch (error) {
            console.error('Failed to duplicate view:', error);
        }
    };

    const handleDeleteView = async (viewId: string) => {
        try {
            await databasesDocumentViewService.deleteDatabasesView(viewId);
            onViewUpdate?.();
        } catch (error) {
            console.error('Failed to delete view:', error);
        }
    };

    const getViewIcon = (type: string) => {
        switch (type) {
            case 'TABLE': return <Table className="h-4 w-4" />;
            case 'KANBAN': return <Kanban className="h-4 w-4" />;
            case 'CALENDAR': return <Calendar className="h-4 w-4" />;
            case 'TIMELINE': return <SquareChartGantt className="h-4 w-4" />;
            case 'GALLERY': return <GalleryHorizontal className="h-4 w-4" />;
            case 'LIST': return <List className="h-4 w-4" />;
            default: return <Table className="h-4 w-4" />;
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Database View Management
                    </CardTitle>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                New View
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Database View</DialogTitle>
                                <DialogDescription>
                                    Create a custom view for your database with specific properties and layout.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="view-name">View Name</Label>
                                    <Input
                                        id="view-name"
                                        value={newViewName}
                                        onChange={(e) => setNewViewName(e.target.value)}
                                        placeholder="Enter view name"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="view-type">View Type</Label>
                                    <Select value={newViewType} onValueChange={(value: any) => setNewViewType(value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="TABLE">
                                                <div className="flex items-center gap-2">
                                                    <Table className="h-4 w-4" />
                                                    Table
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="KANBAN">
                                                <div className="flex items-center gap-2">
                                                    <Kanban className="h-4 w-4" />
                                                    Kanban Board
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="CALENDAR">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    Calendar
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="TIMELINE">
                                                <div className="flex items-center gap-2">
                                                    <SquareChartGantt  className="h-4 w-4" />
                                                    Timeline
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="GALLERY">
                                                <div className="flex items-center gap-2">
                                                    <GalleryHorizontal className="h-4 w-4" />
                                                    Gallery
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="LIST">
                                                <div className="flex items-center gap-2">
                                                    <List className="h-4 w-4" />
                                                    List
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="view-description">Description (Optional)</Label>
                                    <Input
                                        id="view-description"
                                        value={newViewDescription}
                                        onChange={(e) => setNewViewDescription(e.target.value)}
                                        placeholder="Describe this view"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleCreateView} disabled={!newViewName.trim()}>
                                    Create View
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                {currentView && (
                    <div className="space-y-4">
                        {/* Current View Info */}
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-3">
                                {getViewIcon(currentView.type)}
                                <div>
                                    <h3 className="font-medium">{currentView.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {currentView.description || `${currentView.type} view`}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {currentView.isDefault && (
                                    <Badge variant="secondary">Default</Badge>
                                )}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>View Actions</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => handleDuplicateView(currentView.id)}>
                                            <Copy className="h-4 w-4 mr-2" />
                                            Duplicate
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setIsPropertyDialogOpen(true)}>
                                            <Settings className="h-4 w-4 mr-2" />
                                            Configure Properties
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem 
                                            onClick={() => handleDeleteView(currentView.id)}
                                            className="text-destructive"
                                            disabled={currentView.isDefault}
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete View
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        <Separator />

                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" size="sm">
                                <Filter className="h-4 w-4 mr-2" />
                                Filters
                            </Button>
                            <Button variant="outline" size="sm">
                                <SortAsc className="h-4 w-4 mr-2" />
                                Sorting
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
