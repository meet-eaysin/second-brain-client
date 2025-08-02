import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { 
    Plus, 
    Trash2, 
    Filter,
    Type,
    Hash,
    Calendar,
    CheckSquare,
    ListFilter,
    List,
    Tags,
    Mail,
    Link,
    Phone
} from 'lucide-react';
import type { DatabaseProperty, DatabaseView } from '@/types/database.types';
import { useDatabaseContext } from '@/modules/databases';
import { useQueryClient } from '@tanstack/react-query';
import { DATABASE_KEYS } from '@/modules/databases/services/queryKeys';

interface FilterRule {
    propertyId: string;
    operator: string;
    value: any;
}

interface FilterManagerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    properties: DatabaseProperty[];
    currentView: DatabaseView;
    onSave: (filters: FilterRule[]) => void;
}

const PROPERTY_TYPE_ICONS = {
    TEXT: Type,
    NUMBER: Hash,
    EMAIL: Mail,
    URL: Link,
    PHONE: Phone,
    DATE: Calendar,
    CHECKBOX: CheckSquare,
    SELECT: List,
    MULTI_SELECT: Tags,
} as const;

const FILTER_OPERATORS = {
    TEXT: [
        { value: 'contains', label: 'Contains' },
        { value: 'not_contains', label: 'Does not contain' },
        { value: 'equals', label: 'Equals' },
        { value: 'not_equals', label: 'Does not equal' },
        { value: 'starts_with', label: 'Starts with' },
        { value: 'ends_with', label: 'Ends with' },
        { value: 'is_empty', label: 'Is empty' },
        { value: 'is_not_empty', label: 'Is not empty' },
    ],
    NUMBER: [
        { value: 'equals', label: 'Equals' },
        { value: 'not_equals', label: 'Does not equal' },
        { value: 'greater_than', label: 'Greater than' },
        { value: 'less_than', label: 'Less than' },
        { value: 'greater_than_or_equal', label: 'Greater than or equal' },
        { value: 'less_than_or_equal', label: 'Less than or equal' },
        { value: 'is_empty', label: 'Is empty' },
        { value: 'is_not_empty', label: 'Is not empty' },
    ],
    DATE: [
        { value: 'equals', label: 'Is' },
        { value: 'not_equals', label: 'Is not' },
        { value: 'before', label: 'Before' },
        { value: 'after', label: 'After' },
        { value: 'on_or_before', label: 'On or before' },
        { value: 'on_or_after', label: 'On or after' },
        { value: 'is_empty', label: 'Is empty' },
        { value: 'is_not_empty', label: 'Is not empty' },
    ],
    CHECKBOX: [
        { value: 'checked', label: 'Is checked' },
        { value: 'unchecked', label: 'Is unchecked' },
    ],
    SELECT: [
        { value: 'equals', label: 'Is' },
        { value: 'not_equals', label: 'Is not' },
        { value: 'is_empty', label: 'Is empty' },
        { value: 'is_not_empty', label: 'Is not empty' },
    ],
    MULTI_SELECT: [
        { value: 'contains', label: 'Contains' },
        { value: 'not_contains', label: 'Does not contain' },
        { value: 'contains_all', label: 'Contains all' },
        { value: 'is_empty', label: 'Is empty' },
        { value: 'is_not_empty', label: 'Is not empty' },
    ],
};

export function FilterManager({
    open,
    onOpenChange,
    properties,
    currentView,
    onSave,
}: FilterManagerProps) {
    const [filters, setFilters] = useState<FilterRule[]>([]);
    const { currentDatabase } = useDatabaseContext();
    const queryClient = useQueryClient();

    // Initialize filters from current view
    useEffect(() => {
        if (open && currentView?.filters) {
            setFilters(currentView.filters.map(filter => ({
                propertyId: filter.propertyId,
                operator: filter.operator,
                value: filter.value
            })));
        }
    }, [open, currentView?.filters]);

    const addFilter = () => {
        if (properties.length > 0) {
            const firstProperty = properties[0];
            const operators = FILTER_OPERATORS[firstProperty.type] || FILTER_OPERATORS.TEXT;
            
            setFilters([...filters, {
                propertyId: firstProperty.id,
                operator: operators[0].value,
                value: ''
            }]);
        }
    };

    const removeFilter = (index: number) => {
        setFilters(filters.filter((_, i) => i !== index));
    };

    const updateFilter = (index: number, field: keyof FilterRule, value: any) => {
        const newFilters = [...filters];
        newFilters[index] = { ...newFilters[index], [field]: value };
        
        // Reset operator and value when property changes
        if (field === 'propertyId') {
            const property = properties.find(p => p.id === value);
            if (property) {
                const operators = FILTER_OPERATORS[property.type] || FILTER_OPERATORS.TEXT;
                newFilters[index].operator = operators[0].value;
                newFilters[index].value = '';
            }
        }
        
        setFilters(newFilters);
    };

    const handleSave = async () => {
        try {
            // Call the onSave callback which should update the view on the server
            await onSave(filters);

            // Invalidate the records query to refetch with new filtering
            if (currentDatabase?.id) {
                queryClient.invalidateQueries({
                    queryKey: DATABASE_KEYS.recordsList(currentDatabase.id, {})
                });
            }

            onOpenChange(false);
        } catch (error) {
            console.error('Failed to save filters:', error);
            // Keep dialog open on error
        }
    };

    const handleReset = () => {
        setFilters([]);
    };

    const getProperty = (propertyId: string) => {
        return properties.find(p => p.id === propertyId);
    };

    const getOperators = (propertyType: string) => {
        return FILTER_OPERATORS[propertyType] || FILTER_OPERATORS.TEXT;
    };

    const renderValueInput = (filter: FilterRule, index: number) => {
        const property = getProperty(filter.propertyId);
        if (!property) return null;

        // No value input needed for these operators
        if (['is_empty', 'is_not_empty', 'checked', 'unchecked'].includes(filter.operator)) {
            return null;
        }

        switch (property.type) {
            case 'SELECT':
                return (
                    <Select
                        value={filter.value}
                        onValueChange={(value) => updateFilter(index, 'value', value)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select option..." />
                        </SelectTrigger>
                        <SelectContent>
                            {property.selectOptions?.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                    {option.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );

            case 'MULTI_SELECT':
                return (
                    <div className="w-48 space-y-2">
                        {property.selectOptions?.map((option) => (
                            <div key={option.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`${index}-${option.id}`}
                                    checked={Array.isArray(filter.value) && filter.value.includes(option.id)}
                                    onCheckedChange={(checked) => {
                                        const currentValues = Array.isArray(filter.value) ? filter.value : [];
                                        const newValues = checked
                                            ? [...currentValues, option.id]
                                            : currentValues.filter(id => id !== option.id);
                                        updateFilter(index, 'value', newValues);
                                    }}
                                />
                                <label htmlFor={`${index}-${option.id}`} className="text-sm">
                                    {option.name}
                                </label>
                            </div>
                        ))}
                    </div>
                );

            case 'NUMBER':
                return (
                    <Input
                        type="number"
                        value={filter.value}
                        onChange={(e) => updateFilter(index, 'value', e.target.value)}
                        placeholder="Enter number..."
                        className="w-full"
                    />
                );

            case 'DATE':
                return (
                    <Input
                        type="date"
                        value={filter.value}
                        onChange={(e) => updateFilter(index, 'value', e.target.value)}
                        className="w-full"
                    />
                );

            default:
                return (
                    <Input
                        value={filter.value}
                        onChange={(e) => updateFilter(index, 'value', e.target.value)}
                        placeholder="Enter value..."
                        className="w-full"
                    />
                );
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl w-[95vw] max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ListFilter className="h-5 w-5" />
                        Manage Filters
                    </DialogTitle>
                    <DialogDescription>
                        Configure filters to show only the records that match your criteria.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Current Filters */}
                    {filters.length > 0 ? (
                        <div className="space-y-3">
                            <h4 className="text-sm font-medium">Filter Rules</h4>
                            {filters.map((filter, index) => {
                                const property = getProperty(filter.propertyId);
                                const IconComponent = property ? PROPERTY_TYPE_ICONS[property.type] || Type : Type;
                                const operators = property ? getOperators(property.type) : [];

                                return (
                                    <Card key={index} className="p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-xs">
                                                    {index + 1}
                                                </Badge>
                                                <IconComponent className="h-4 w-4 text-muted-foreground" />
                                            </div>

                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 flex-1 min-w-0">
                                                <Select
                                                    value={filter.propertyId}
                                                    onValueChange={(value) => updateFilter(index, 'propertyId', value)}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {properties.map((property) => {
                                                            const PropertyIcon = PROPERTY_TYPE_ICONS[property.type] || Type;
                                                            return (
                                                                <SelectItem key={property.id} value={property.id}>
                                                                    <div className="flex items-center gap-2">
                                                                        <PropertyIcon className="h-4 w-4" />
                                                                        {property.name}
                                                                    </div>
                                                                </SelectItem>
                                                            );
                                                        })}
                                                    </SelectContent>
                                                </Select>

                                                <Select
                                                    value={filter.operator}
                                                    onValueChange={(value) => updateFilter(index, 'operator', value)}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {operators.map((operator) => (
                                                            <SelectItem key={operator.value} value={operator.value}>
                                                                {operator.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>

                                                {renderValueInput(filter, index)}
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeFilter(index)}
                                                className="h-8 w-8 p-0 text-destructive hover:text-destructive ml-auto"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <Card className="p-6 text-center">
                            <div className="text-muted-foreground">
                                <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p>No filters configured</p>
                                <p className="text-sm">Add a filter to narrow down your records</p>
                            </div>
                        </Card>
                    )}

                    {/* Add Filter Button */}
                    <Button
                        variant="outline"
                        onClick={addFilter}
                        className="w-full"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Filter Rule
                    </Button>
                </div>

                <DialogFooter className="flex items-center justify-between">
                    <Button variant="outline" onClick={handleReset}>
                        Clear All
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>
                            Apply Filters
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
