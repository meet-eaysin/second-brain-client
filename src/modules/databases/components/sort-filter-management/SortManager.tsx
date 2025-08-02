import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
    Plus, 
    Trash2, 
    GripVertical, 
    ArrowUp, 
    ArrowDown,
    SortAsc,
    Type,
    Hash,
    Calendar,
    CheckSquare,
    List,
    Tags
} from 'lucide-react';
import type { DatabaseProperty, DatabaseView } from '@/types/database.types';
import { useDatabaseContext } from '@/modules/databases';
import { useQueryClient } from '@tanstack/react-query';
import { DATABASE_KEYS } from '@/modules/databases/services/queryKeys';

interface SortRule {
    propertyId: string;
    direction: 'asc' | 'desc';
}

interface SortManagerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    properties: DatabaseProperty[];
    currentView: DatabaseView;
    onSave: (sorts: SortRule[]) => Promise<void>;
}

// Property type icons mapping
const PROPERTY_TYPE_ICONS = {
    TEXT: Type,
    NUMBER: Hash,
    DATE: Calendar,
    CHECKBOX: CheckSquare,
    SELECT: List,
    MULTI_SELECT: Tags,
};

export function SortManager({
    open,
    onOpenChange,
    properties,
    currentView,
    onSave,
}: SortManagerProps) {
    const [sorts, setSorts] = useState<SortRule[]>([]);
    const { currentDatabase } = useDatabaseContext();
    const queryClient = useQueryClient();

    // Initialize sorts from current view
    useEffect(() => {
        if (currentView?.sorts) {
            setSorts(currentView.sorts);
        } else {
            setSorts([]);
        }
    }, [currentView]);

    const addSort = () => {
        const availableProperties = properties.filter(
            prop => !sorts.some(sort => sort.propertyId === prop.id)
        );
        
        if (availableProperties.length > 0) {
            setSorts([...sorts, {
                propertyId: availableProperties[0].id,
                direction: 'asc'
            }]);
        }
    };

    const updateSort = (index: number, field: keyof SortRule, value: string) => {
        const newSorts = [...sorts];
        newSorts[index] = { ...newSorts[index], [field]: value };
        setSorts(newSorts);
    };

    const removeSort = (index: number) => {
        setSorts(sorts.filter((_, i) => i !== index));
    };

    const moveSort = (index: number, direction: 'up' | 'down') => {
        const newSorts = [...sorts];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        
        if (targetIndex >= 0 && targetIndex < newSorts.length) {
            [newSorts[index], newSorts[targetIndex]] = [newSorts[targetIndex], newSorts[index]];
            setSorts(newSorts);
        }
    };

    const handleSave = async () => {
        try {
            // Call the onSave callback which should update the view on the server
            await onSave(sorts);
            
            // Invalidate the records query to refetch with new sorting
            if (currentDatabase?.id) {
                queryClient.invalidateQueries({ 
                    queryKey: DATABASE_KEYS.recordsList(currentDatabase.id, {}) 
                });
            }
            
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to save sorts:', error);
            // Keep dialog open on error
        }
    };

    const handleReset = () => {
        setSorts([]);
    };

    const getPropertyIcon = (propertyId: string) => {
        const property = properties.find(p => p.id === propertyId);
        return PROPERTY_TYPE_ICONS[property?.type as keyof typeof PROPERTY_TYPE_ICONS] || Type;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl w-[95vw] max-h-[85vh] overflow-y-auto overflow-x-hidden">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <SortAsc className="h-5 w-5" />
                        Manage Sorting
                    </DialogTitle>
                    <DialogDescription>
                        Configure how records are sorted in this view. Drag to reorder priority.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {sorts.length > 0 ? (
                        <div className="space-y-3">
                            {sorts.map((sort, index) => {
                                const property = properties.find(p => p.id === sort.propertyId);
                                const IconComponent = getPropertyIcon(sort.propertyId);
                                return (
                                    <Card key={index} className="p-3">
                                        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
                                            <div className="flex items-center gap-2 shrink-0">
                                                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                                                <Badge variant="outline" className="text-xs">
                                                    {index + 1}
                                                </Badge>
                                            </div>

                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                <IconComponent className="h-4 w-4 text-muted-foreground shrink-0" />
                                                <Select
                                                    value={sort.propertyId}
                                                    onValueChange={(value) => updateSort(index, 'propertyId', value)}
                                                >
                                                    <SelectTrigger className="w-full min-w-0">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {properties.map((property) => {
                                                            const PropertyIcon = PROPERTY_TYPE_ICONS[property.type] || Type;
                                                            return (
                                                                <SelectItem key={property.id} value={property.id}>
                                                                    <div className="flex items-center gap-2">
                                                                        <PropertyIcon className="h-4 w-4" />
                                                                        <span>{property.name}</span>
                                                                        <Badge variant="secondary" className="text-xs">
                                                                            {property.type}
                                                                        </Badge>
                                                                    </div>
                                                                </SelectItem>
                                                            );
                                                        })}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="w-full xl:w-auto xl:min-w-[140px]">
                                                <Select
                                                    value={sort.direction}
                                                    onValueChange={(value) => updateSort(index, 'direction', value as 'asc' | 'desc')}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="asc">
                                                            <div className="flex items-center gap-2">
                                                                <ArrowUp className="h-4 w-4" />
                                                                Ascending
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="desc">
                                                            <div className="flex items-center gap-2">
                                                                <ArrowDown className="h-4 w-4" />
                                                                Descending
                                                            </div>
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="flex items-center gap-1 shrink-0">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => moveSort(index, 'up')}
                                                    disabled={index === 0}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <ArrowUp className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => moveSort(index, 'down')}
                                                    disabled={index === sorts.length - 1}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <ArrowDown className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeSort(index)}
                                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <SortAsc className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No sorting rules configured</p>
                            <p className="text-sm">Add a rule to sort your records</p>
                        </div>
                    )}

                    {/* Add Sort Button */}
                    <Button
                        onClick={addSort}
                        variant="outline"
                        className="w-full"
                        disabled={sorts.length >= properties.length}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Sort Rule
                    </Button>
                </div>

                <DialogFooter className="flex gap-2">
                    <Button variant="outline" onClick={handleReset} disabled={sorts.length === 0}>
                        Clear All
                    </Button>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>
                        Apply Sorting
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
