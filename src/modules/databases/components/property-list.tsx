import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { PropertyForm } from './property-form';
import { useCreateProperty, useUpdateProperty, useDeleteProperty, useReorderProperties } from '../hooks/property-hooks';
import { toast } from 'sonner';
import { Edit, Trash2, GripVertical, MoreHorizontal, Plus } from 'lucide-react';
import type {DatabaseProperty, PropertyType, UpdatePropertyRequest} from "@/types/database.types.ts";

interface PropertyListProps {
    databaseId: string;
    properties: DatabaseProperty[];
}

type PropertyFormData = {
    name: string;
    type: PropertyType;
    description?: string;
    required: boolean;
    selectOptions?: { name: string; color: string }[];
};

const propertyTypeLabels: Record<PropertyType, string> = {
    TEXT: 'Text',
    NUMBER: 'Number',
    SELECT: 'Select',
    MULTI_SELECT: 'Multi-select',
    DATE: 'Date',
    CHECKBOX: 'Checkbox',
    URL: 'URL',
    EMAIL: 'Email',
    PHONE: 'Phone',
    RELATION: 'Relation',
    FORMULA: 'Formula',
    ROLLUP: 'Rollup',
    CREATED_TIME: 'Created time',
    CREATED_BY: 'Created by',
    LAST_EDITED_TIME: 'Last edited time',
    LAST_EDITED_BY: 'Last edited by',
};

export function PropertyList({ databaseId, properties }: PropertyListProps) {
    const [isPropertyFormOpen, setIsPropertyFormOpen] = React.useState(false);
    const [editingProperty, setEditingProperty] = React.useState<DatabaseProperty | null>(null);

    const createPropertyMutation = useCreateProperty();
    const updatePropertyMutation = useUpdateProperty();
    const deletePropertyMutation = useDeleteProperty();
    const reorderPropertiesMutation = useReorderProperties();

    const handleCreateProperty = async (data: PropertyFormData) => {
        try {
            await createPropertyMutation.mutateAsync({
                databaseId,
                data: {
                    ...data,
                    order: properties.length,
                },
            });
            toast.success('Property added successfully');
        } catch (error) {
            console.error('Error creating property:', error);
            toast.error('Failed to add property');
        }
    };

    const handleUpdateProperty = async (data: PropertyFormData) => {
        if (!editingProperty) return;

        try {
            // Transform selectOptions to include IDs for existing options
            const transformedData: UpdatePropertyRequest = {
                name: data.name,
                description: data.description,
                required: data.required,
                selectOptions: data.selectOptions?.map((option, index) => {
                    // If editing existing property, try to preserve existing option IDs
                    const existingOption = editingProperty.selectOptions?.[index];
                    return {
                        id: existingOption?.id || `option-${Date.now()}-${index}`,
                        name: option.name,
                        color: option.color,
                    };
                }),
            };

            await updatePropertyMutation.mutateAsync({
                databaseId,
                propertyId: editingProperty.id,
                data: transformedData,
            });
            toast.success('Property updated successfully');
            setEditingProperty(null);
        } catch (error) {
            console.error('Error updating property:', error);
            toast.error('Failed to update property');
        }
    };

    const handleDeleteProperty = async (propertyId: string) => {
        try {
            await deletePropertyMutation.mutateAsync({
                databaseId,
                propertyId,
            });
            toast.success('Property deleted successfully');
        } catch (error) {
            console.error('Error deleting property:', error);
            toast.error('Failed to delete property');
        }
    };

    const handleDragEnd = (result: any) => {
        if (!result.destination) return;

        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;

        if (sourceIndex === destinationIndex) return;

        const propertyIds = properties.map(p => p.id);
        const [removed] = propertyIds.splice(sourceIndex, 1);
        propertyIds.splice(destinationIndex, 0, removed);

        reorderPropertiesMutation.mutate({
            databaseId,
            propertyIds,
        });
    };

    const handleEditProperty = (property: DatabaseProperty) => {
        setEditingProperty(property);
        setIsPropertyFormOpen(true);
    };

    const handlePropertyFormClose = () => {
        setIsPropertyFormOpen(false);
        setEditingProperty(null);
    };

    const sortedProperties = [...properties].sort((a, b) => a.order - b.order);

    return (
        <>
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Database Properties</CardTitle>
                            <CardDescription>
                                Configure the properties (columns) for your database
                            </CardDescription>
                        </div>
                        <Button onClick={() => setIsPropertyFormOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Property
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {properties.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground mb-4">
                                No properties defined yet. Add your first property to get started.
                            </p>
                            <Button onClick={() => setIsPropertyFormOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Property
                            </Button>
                        </div>
                    ) : (
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="properties">
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="space-y-2"
                                    >
                                        {sortedProperties.map((property, index) => (
                                            <Draggable
                                                key={property.id}
                                                draggableId={property.id}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        className="flex items-center justify-between p-3 border rounded-md bg-card hover:bg-accent/5 transition-colors"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                {...provided.dragHandleProps}
                                                                className="cursor-grab text-muted-foreground hover:text-foreground"
                                                            >
                                                                <GripVertical className="h-5 w-5" />
                                                            </div>

                                                            <div className="flex flex-col">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-medium">{property.name}</span>
                                                                    {property.required && (
                                                                        <Badge variant="outline" className="text-xs">
                                                                            Required
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Badge variant="secondary" className="text-xs">
                                                                        {propertyTypeLabels[property.type] || property.type}
                                                                    </Badge>
                                                                    {property.description && (
                                                                        <span className="text-xs text-muted-foreground truncate max-w-[300px]">
                                                                            {property.description}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onClick={() => handleEditProperty(property)}>
                                                                    <Edit className="h-4 w-4 mr-2" />
                                                                    Edit Property
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    className="text-destructive"
                                                                    onClick={() => handleDeleteProperty(property.id)}
                                                                >
                                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                                    Delete Property
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    )}
                </CardContent>
            </Card>

            <PropertyForm
                open={isPropertyFormOpen}
                onOpenChange={handlePropertyFormClose}
                onSubmit={editingProperty ? handleUpdateProperty : handleCreateProperty}
                propertyId={editingProperty?.id}
                initialData={editingProperty ? {
                    name: editingProperty.name,
                    type: editingProperty.type,
                    description: editingProperty.description,
                    required: editingProperty.required,
                    selectOptions: editingProperty.selectOptions?.map(option => ({
                        name: option.name,
                        color: option.color,
                    })) || [],
                } : undefined}
                databaseId={databaseId}
            />
        </>
    );
}
