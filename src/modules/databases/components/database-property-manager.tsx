import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
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
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from '@hello-pangea/dnd';
import {
    Plus,
    GripVertical,
    Eye,
    EyeOff,
    Lock,
    Unlock,
    Trash2,
    Settings,
    AlertCircle
} from 'lucide-react';
import { databasesDocumentViewService } from '../services/databases-document-view.service';
import { DATABASE_FROZEN_PROPERTIES } from '@/modules/document-view/providers/databases-provider';
import type { DocumentProperty } from '@/types/document';

interface DatabasePropertyManagerProps {
    viewId: string;
    properties: DocumentProperty[];
    onPropertiesUpdate?: () => void;
}

export function DatabasePropertyManager({
    viewId,
    properties,
    onPropertiesUpdate
}: DatabasePropertyManagerProps) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newPropertyName, setNewPropertyName] = useState('');
    const [newPropertyType, setNewPropertyType] = useState('TEXT');
    const [newPropertyDescription, setNewPropertyDescription] = useState('');

    const handleAddProperty = async () => {
        try {
            await databasesDocumentViewService.addDatabaseProperty(viewId, {
                name: newPropertyName,
                type: newPropertyType,
                description: newPropertyDescription,
                required: false,
                order: properties.length
            });
            
            setIsAddDialogOpen(false);
            setNewPropertyName('');
            setNewPropertyDescription('');
            onPropertiesUpdate?.();
        } catch (error) {
            console.error('Failed to add property:', error);
        }
    };

    const handleToggleVisibility = async (propertyId: string, visible: boolean) => {
        try {
            const property = properties.find(p => p.id === propertyId);
            if (!property) return;

            await databasesDocumentViewService.updateDatabasesViewProperties(viewId, [{
                propertyId,
                order: property.order,
                visible: !visible,
                frozen: property.frozen,
                width: property.width
            }]);
            
            onPropertiesUpdate?.();
        } catch (error) {
            console.error('Failed to toggle visibility:', error);
        }
    };

    const handleToggleFreeze = async (propertyId: string, frozen: boolean) => {
        try {
            // Check if property can be frozen/unfrozen
            const frozenConfig = DATABASE_FROZEN_PROPERTIES[propertyId as keyof typeof DATABASE_FROZEN_PROPERTIES];
            if (frozenConfig && frozenConfig.frozen && !frozen) {
                // Cannot unfreeze a property that's frozen by configuration
                return;
            }

            await databasesDocumentViewService.toggleDatabasePropertyFreeze(viewId, propertyId, !frozen);
            onPropertiesUpdate?.();
        } catch (error) {
            console.error('Failed to toggle freeze:', error);
        }
    };

    const handleRemoveProperty = async (propertyId: string) => {
        try {
            // Check if property is removable
            const frozenConfig = DATABASE_FROZEN_PROPERTIES[propertyId as keyof typeof DATABASE_FROZEN_PROPERTIES];
            if (frozenConfig && !frozenConfig.removable) {
                return;
            }

            await databasesDocumentViewService.removeDatabaseProperty(viewId, propertyId);
            onPropertiesUpdate?.();
        } catch (error) {
            console.error('Failed to remove property:', error);
        }
    };

    const handleDragEnd = async (result: DropResult) => {
        if (!result.destination) return;

        const reorderedProperties = Array.from(properties);
        const [reorderedItem] = reorderedProperties.splice(result.source.index, 1);
        reorderedProperties.splice(result.destination.index, 0, reorderedItem);

        const propertyOrder = reorderedProperties.map((prop, index) => ({
            propertyId: prop.id,
            order: index
        }));

        try {
            await databasesDocumentViewService.reorderDatabaseProperties(viewId, propertyOrder);
            onPropertiesUpdate?.();
        } catch (error) {
            console.error('Failed to reorder properties:', error);
        }
    };

    const isPropertyRemovable = (propertyId: string) => {
        const frozenConfig = DATABASE_FROZEN_PROPERTIES[propertyId as keyof typeof DATABASE_FROZEN_PROPERTIES];
        return !frozenConfig || frozenConfig.removable;
    };

    const isPropertyFreezable = (propertyId: string) => {
        const frozenConfig = DATABASE_FROZEN_PROPERTIES[propertyId as keyof typeof DATABASE_FROZEN_PROPERTIES];
        return !frozenConfig || !frozenConfig.frozen;
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Database Property Management
                    </CardTitle>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Property
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Property</DialogTitle>
                                <DialogDescription>
                                    Add a custom property to your database view.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="property-name">Property Name</Label>
                                    <Input
                                        id="property-name"
                                        value={newPropertyName}
                                        onChange={(e) => setNewPropertyName(e.target.value)}
                                        placeholder="Enter property name"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="property-type">Property Type</Label>
                                    <Select value={newPropertyType} onValueChange={setNewPropertyType}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="TEXT">Text</SelectItem>
                                            <SelectItem value="TEXTAREA">Long Text</SelectItem>
                                            <SelectItem value="NUMBER">Number</SelectItem>
                                            <SelectItem value="DATE">Date</SelectItem>
                                            <SelectItem value="SELECT">Select</SelectItem>
                                            <SelectItem value="MULTI_SELECT">Multi-Select</SelectItem>
                                            <SelectItem value="CHECKBOX">Checkbox</SelectItem>
                                            <SelectItem value="PERSON">Person</SelectItem>
                                            <SelectItem value="RELATION">Relation</SelectItem>
                                            <SelectItem value="URL">URL</SelectItem>
                                            <SelectItem value="ICON">Icon</SelectItem>
                                            <SelectItem value="IMAGE">Image</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="property-description">Description (Optional)</Label>
                                    <Input
                                        id="property-description"
                                        value={newPropertyDescription}
                                        onChange={(e) => setNewPropertyDescription(e.target.value)}
                                        placeholder="Describe this property"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAddProperty} disabled={!newPropertyName.trim()}>
                                    Add Property
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="properties">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                {properties.map((property, index) => (
                                    <Draggable key={property.id} draggableId={property.id} index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className={`flex items-center justify-between p-3 border rounded-lg ${
                                                    snapshot.isDragging ? 'bg-muted' : 'bg-background'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div {...provided.dragHandleProps}>
                                                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium">{property.name}</span>
                                                            {property.required && (
                                                                <Badge variant="secondary" className="text-xs">
                                                                    Required
                                                                </Badge>
                                                            )}
                                                            {property.frozen && (
                                                                <Badge variant="outline" className="text-xs">
                                                                    <Lock className="h-3 w-3 mr-1" />
                                                                    Frozen
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">
                                                            {property.type} • Order: {property.order}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleToggleVisibility(property.id, property.isVisible)}
                                                    >
                                                        {property.isVisible ? (
                                                            <Eye className="h-4 w-4" />
                                                        ) : (
                                                            <EyeOff className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleToggleFreeze(property.id, property.frozen)}
                                                        disabled={!isPropertyFreezable(property.id)}
                                                    >
                                                        {property.frozen ? (
                                                            <Unlock className="h-4 w-4" />
                                                        ) : (
                                                            <Lock className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleRemoveProperty(property.id)}
                                                        disabled={!isPropertyRemovable(property.id)}
                                                        className="text-destructive hover:text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                
                {properties.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                        <p>No properties configured</p>
                        <p className="text-sm">Add properties to customize your database view</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
