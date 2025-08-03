import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { 
    Plus, 
    MoreHorizontal, 
    Edit, 
    Copy, 
    Trash2, 
    Settings,
    Table as TableIcon, 
    Kanban, 
    Grid3X3, 
    List, 
    Calendar, 
    Clock,
    Eye,
    EyeOff,
    Star,
    StarOff
} from 'lucide-react';
import { useDatabaseManagement } from './database-context';
import type { DatabaseView, DatabaseProperty } from '@/types/database.types';
import { toast } from 'sonner';

const VIEW_TYPES = [
    { value: 'TABLE', label: 'Table', icon: TableIcon, description: 'Spreadsheet-like rows and columns' },
    { value: 'BOARD', label: 'Board', icon: Kanban, description: 'Kanban-style cards in columns' },
    { value: 'GALLERY', label: 'Gallery', icon: Grid3X3, description: 'Visual cards in a grid' },
    { value: 'LIST', label: 'List', icon: List, description: 'Simple list with key information' },
    { value: 'CALENDAR', label: 'Calendar', icon: Calendar, description: 'Events organized by date' },
    { value: 'TIMELINE', label: 'Timeline', icon: Clock, description: 'Chronological timeline view' },
] as const;

interface AddViewDialogProps {
    trigger?: React.ReactNode;
    onViewAdded?: (view: DatabaseView) => void;
}

export function AddViewDialog({ trigger, onViewAdded }: AddViewDialogProps) {
    const { addView, properties } = useDatabaseManagement();
    const [open, setOpen] = useState(false);
    const [viewName, setViewName] = useState('');
    const [viewType, setViewType] = useState<DatabaseView['type']>('TABLE');
    const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
    const [isDefault, setIsDefault] = useState(false);

    const handleSubmit = () => {
        if (!viewName.trim()) {
            toast.error('Please enter a view name');
            return;
        }

        const newView: Omit<DatabaseView, 'id'> = {
            name: viewName.trim(),
            type: viewType,
            isDefault,
            filters: [],
            sorts: [],
            visibleProperties: selectedProperties.length > 0 ? selectedProperties : undefined,
        };

        addView(newView);
        
        if (onViewAdded) {
            onViewAdded(newView as DatabaseView);
        }

        toast.success(`${viewName} view created successfully`);
        
        // Reset form
        setViewName('');
        setViewType('TABLE');
        setSelectedProperties([]);
        setIsDefault(false);
        setOpen(false);
    };

    const toggleProperty = (propertyId: string) => {
        setSelectedProperties(prev =>
            prev.includes(propertyId)
                ? prev.filter(id => id !== propertyId)
                : [...prev, propertyId]
        );
    };

    const selectedViewType = VIEW_TYPES.find(type => type.value === viewType);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add View
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Create New View</DialogTitle>
                    <DialogDescription>
                        Create a new view to organize and display your data in different ways.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* View Name */}
                    <div className="space-y-2">
                        <Label htmlFor="view-name">View Name</Label>
                        <Input
                            id="view-name"
                            placeholder="Enter view name..."
                            value={viewName}
                            onChange={(e) => setViewName(e.target.value)}
                        />
                    </div>

                    {/* View Type */}
                    <div className="space-y-3">
                        <Label>View Type</Label>
                        <div className="grid grid-cols-2 gap-3">
                            {VIEW_TYPES.map((type) => {
                                const Icon = type.icon;
                                return (
                                    <div
                                        key={type.value}
                                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                            viewType === type.value
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border hover:border-primary/50'
                                        }`}
                                        onClick={() => setViewType(type.value)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className="h-5 w-5" />
                                            <div>
                                                <div className="font-medium">{type.label}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {type.description}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Properties Selection */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label>Visible Properties</Label>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    if (selectedProperties.length === properties.length) {
                                        setSelectedProperties([]);
                                    } else {
                                        setSelectedProperties(properties.map(p => p.id));
                                    }
                                }}
                            >
                                {selectedProperties.length === properties.length ? 'Deselect All' : 'Select All'}
                            </Button>
                        </div>
                        
                        <div className="max-h-48 overflow-y-auto border rounded-md p-3 space-y-2">
                            {properties.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    No properties available. Add some properties first.
                                </p>
                            ) : (
                                properties.map((property) => (
                                    <div key={property.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`property-${property.id}`}
                                            checked={selectedProperties.includes(property.id)}
                                            onCheckedChange={() => toggleProperty(property.id)}
                                        />
                                        <Label
                                            htmlFor={`property-${property.id}`}
                                            className="flex-1 cursor-pointer"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span>{property.name}</span>
                                                <Badge variant="outline" className="text-xs">
                                                    {property.type}
                                                </Badge>
                                            </div>
                                        </Label>
                                    </div>
                                ))
                            )}
                        </div>
                        
                        {selectedProperties.length === 0 && (
                            <p className="text-xs text-muted-foreground">
                                No properties selected. All properties will be visible by default.
                            </p>
                        )}
                    </div>

                    {/* Default View */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="is-default"
                            checked={isDefault}
                            onCheckedChange={(checked) => setIsDefault(!!checked)}
                        />
                        <Label htmlFor="is-default" className="cursor-pointer">
                            Set as default view
                        </Label>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>
                        Create View
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

interface ViewActionsMenuProps {
    view: DatabaseView;
    onEdit?: (view: DatabaseView) => void;
    onDuplicate?: (view: DatabaseView) => void;
    onDelete?: (view: DatabaseView) => void;
}

export function ViewActionsMenu({ view, onEdit, onDuplicate, onDelete }: ViewActionsMenuProps) {
    const { duplicateView, deleteView, updateView } = useDatabaseManagement();

    const handleDuplicate = () => {
        duplicateView(view.id);
        if (onDuplicate) {
            onDuplicate(view);
        }
        toast.success(`${view.name} duplicated successfully`);
    };

    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete the "${view.name}" view?`)) {
            deleteView(view.id);
            if (onDelete) {
                onDelete(view);
            }
            toast.success(`${view.name} view deleted`);
        }
    };

    const toggleDefault = () => {
        updateView(view.id, { isDefault: !view.isDefault });
        toast.success(
            view.isDefault 
                ? `${view.name} is no longer the default view`
                : `${view.name} is now the default view`
        );
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(view)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDuplicate}>
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleDefault}>
                    {view.isDefault ? (
                        <>
                            <StarOff className="mr-2 h-4 w-4" />
                            Remove as Default
                        </>
                    ) : (
                        <>
                            <Star className="mr-2 h-4 w-4" />
                            Set as Default
                        </>
                    )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                    onClick={handleDelete}
                    className="text-destructive focus:text-destructive"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete View
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

interface EditViewDialogProps {
    view: DatabaseView;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onViewUpdated?: (view: DatabaseView) => void;
}

export function EditViewDialog({ view, open, onOpenChange, onViewUpdated }: EditViewDialogProps) {
    const { updateView, properties } = useDatabaseManagement();
    const [viewName, setViewName] = useState(view.name);
    const [viewType, setViewType] = useState<DatabaseView['type']>(view.type);
    const [selectedProperties, setSelectedProperties] = useState<string[]>(
        view.visibleProperties || []
    );
    const [isDefault, setIsDefault] = useState(view.isDefault || false);

    const handleSubmit = () => {
        if (!viewName.trim()) {
            toast.error('Please enter a view name');
            return;
        }

        const updates: Partial<DatabaseView> = {
            name: viewName.trim(),
            type: viewType,
            isDefault,
            visibleProperties: selectedProperties.length > 0 ? selectedProperties : undefined,
        };

        updateView(view.id, updates);
        
        if (onViewUpdated) {
            onViewUpdated({ ...view, ...updates });
        }

        toast.success(`${viewName} view updated successfully`);
        onOpenChange(false);
    };

    const toggleProperty = (propertyId: string) => {
        setSelectedProperties(prev =>
            prev.includes(propertyId)
                ? prev.filter(id => id !== propertyId)
                : [...prev, propertyId]
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit View</DialogTitle>
                    <DialogDescription>
                        Modify the view settings and configuration.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* View Name */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-view-name">View Name</Label>
                        <Input
                            id="edit-view-name"
                            placeholder="Enter view name..."
                            value={viewName}
                            onChange={(e) => setViewName(e.target.value)}
                        />
                    </div>

                    {/* View Type */}
                    <div className="space-y-3">
                        <Label>View Type</Label>
                        <div className="grid grid-cols-2 gap-3">
                            {VIEW_TYPES.map((type) => {
                                const Icon = type.icon;
                                return (
                                    <div
                                        key={type.value}
                                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                            viewType === type.value
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border hover:border-primary/50'
                                        }`}
                                        onClick={() => setViewType(type.value)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className="h-5 w-5" />
                                            <div>
                                                <div className="font-medium">{type.label}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {type.description}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Properties Selection */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label>Visible Properties</Label>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    if (selectedProperties.length === properties.length) {
                                        setSelectedProperties([]);
                                    } else {
                                        setSelectedProperties(properties.map(p => p.id));
                                    }
                                }}
                            >
                                {selectedProperties.length === properties.length ? 'Deselect All' : 'Select All'}
                            </Button>
                        </div>
                        
                        <div className="max-h-48 overflow-y-auto border rounded-md p-3 space-y-2">
                            {properties.map((property) => (
                                <div key={property.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`edit-property-${property.id}`}
                                        checked={selectedProperties.includes(property.id)}
                                        onCheckedChange={() => toggleProperty(property.id)}
                                    />
                                    <Label
                                        htmlFor={`edit-property-${property.id}`}
                                        className="flex-1 cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>{property.name}</span>
                                            <Badge variant="outline" className="text-xs">
                                                {property.type}
                                            </Badge>
                                        </div>
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Default View */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="edit-is-default"
                            checked={isDefault}
                            onCheckedChange={(checked) => setIsDefault(!!checked)}
                        />
                        <Label htmlFor="edit-is-default" className="cursor-pointer">
                            Set as default view
                        </Label>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>
                        Update View
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export function ViewManagement() {
    const { views } = useDatabaseManagement();
    const [editingView, setEditingView] = useState<DatabaseView | null>(null);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Views</h3>
                <AddViewDialog />
            </div>

            <div className="space-y-2">
                {views.map((view) => {
                    const ViewIcon = VIEW_TYPES.find(type => type.value === view.type)?.icon || TableIcon;
                    
                    return (
                        <div
                            key={view.id}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                        >
                            <div className="flex items-center gap-3">
                                <ViewIcon className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{view.name}</span>
                                        {view.isDefault && (
                                            <Badge variant="secondary" className="text-xs">
                                                Default
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {VIEW_TYPES.find(type => type.value === view.type)?.label} view
                                    </div>
                                </div>
                            </div>
                            
                            <ViewActionsMenu
                                view={view}
                                onEdit={setEditingView}
                            />
                        </div>
                    );
                })}

                {views.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        <TableIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No views created yet</p>
                        <p className="text-sm">Create your first view to get started</p>
                    </div>
                )}
            </div>

            {editingView && (
                <EditViewDialog
                    view={editingView}
                    open={!!editingView}
                    onOpenChange={(open) => !open && setEditingView(null)}
                    onViewUpdated={() => setEditingView(null)}
                />
            )}
        </div>
    );
}
