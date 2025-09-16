import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { X, Plus, ArrowUpDown, Filter, SortAsc, SortDesc } from 'lucide-react';

interface FilterCondition {
    propertyId: string;
    operator: string;
    value: any;
    condition?: 'AND' | 'OR';
}

interface SortCondition {
    propertyId: string;
    direction: 'asc' | 'desc';
    order: number;
}

interface PeopleFilterSortManagerProps {
    filters: FilterCondition[];
    sorts: SortCondition[];
    onFiltersChange: (filters: FilterCondition[]) => void;
    onSortsChange: (sorts: SortCondition[]) => void;
    availableProperties: Array<{
        id: string;
        name: string;
        type: string;
        options?: string[];
    }>;
    className?: string;
}

const FILTER_OPERATORS = {
    text: [
        { value: 'equals', label: 'Equals' },
        { value: 'not_equals', label: 'Not equals' },
        { value: 'contains', label: 'Contains' },
        { value: 'not_contains', label: 'Does not contain' },
        { value: 'starts_with', label: 'Starts with' },
        { value: 'ends_with', label: 'Ends with' },
        { value: 'is_empty', label: 'Is empty' },
        { value: 'is_not_empty', label: 'Is not empty' }
    ],
    select: [
        { value: 'equals', label: 'Is' },
        { value: 'not_equals', label: 'Is not' },
        { value: 'in', label: 'Is any of' },
        { value: 'not_in', label: 'Is none of' }
    ],
    date: [
        { value: 'equals', label: 'Is' },
        { value: 'not_equals', label: 'Is not' },
        { value: 'greater_than', label: 'Is after' },
        { value: 'less_than', label: 'Is before' },
        { value: 'on_or_after', label: 'Is on or after' },
        { value: 'on_or_before', label: 'Is on or before' },
        { value: 'between', label: 'Is between' }
    ]
};

export function PeopleFilterSortManager({
    filters,
    sorts,
    onFiltersChange,
    onSortsChange,
    availableProperties,
    className
}: PeopleFilterSortManagerProps) {
    const [activeTab, setActiveTab] = useState<'filters' | 'sorts'>('filters');

    const addFilter = () => {
        const newFilter: FilterCondition = {
            propertyId: availableProperties[0]?.id || '',
            operator: 'equals',
            value: '',
            condition: 'AND'
        };
        onFiltersChange([...filters, newFilter]);
    };

    const updateFilter = (index: number, updates: Partial<FilterCondition>) => {
        const updatedFilters = filters.map((filter, i) => 
            i === index ? { ...filter, ...updates } : filter
        );
        onFiltersChange(updatedFilters);
    };

    const removeFilter = (index: number) => {
        onFiltersChange(filters.filter((_, i) => i !== index));
    };

    const addSort = () => {
        const newSort: SortCondition = {
            propertyId: availableProperties[0]?.id || '',
            direction: 'asc',
            order: sorts.length
        };
        onSortsChange([...sorts, newSort]);
    };

    const updateSort = (index: number, updates: Partial<SortCondition>) => {
        const updatedSorts = sorts.map((sort, i) => 
            i === index ? { ...sort, ...updates } : sort
        );
        onSortsChange(updatedSorts);
    };

    const removeSort = (index: number) => {
        const updatedSorts = sorts
            .filter((_, i) => i !== index)
            .map((sort, i) => ({ ...sort, order: i }));
        onSortsChange(updatedSorts);
    };

    const moveSort = (index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= sorts.length) return;

        const updatedSorts = [...sorts];
        [updatedSorts[index], updatedSorts[newIndex]] = [updatedSorts[newIndex], updatedSorts[index]];
        
        // Update order values
        updatedSorts.forEach((sort, i) => {
            sort.order = i;
        });
        
        onSortsChange(updatedSorts);
    };

    const getPropertyType = (propertyId: string) => {
        return availableProperties.find(p => p.id === propertyId)?.type || 'text';
    };

    const getOperatorsForProperty = (propertyId: string) => {
        const type = getPropertyType(propertyId);
        return FILTER_OPERATORS[type as keyof typeof FILTER_OPERATORS] || FILTER_OPERATORS.text;
    };

    const renderFilterValue = (filter: FilterCondition, index: number) => {
        const property = availableProperties.find(p => p.id === filter.propertyId);
        
        if (filter.operator === 'is_empty' || filter.operator === 'is_not_empty') {
            return null;
        }

        if (property?.type === 'select' && property.options) {
            if (filter.operator === 'in' || filter.operator === 'not_in') {
                return (
                    <div className="space-y-2">
                        <Label>Values</Label>
                        <div className="flex flex-wrap gap-1">
                            {(filter.value || []).map((val: string, i: number) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                    {val}
                                    <X 
                                        className="ml-1 h-3 w-3 cursor-pointer" 
                                        onClick={() => {
                                            const newValues = filter.value.filter((_: any, idx: number) => idx !== i);
                                            updateFilter(index, { value: newValues });
                                        }}
                                    />
                                </Badge>
                            ))}
                        </div>
                        <Select
                            onValueChange={(value) => {
                                const currentValues = filter.value || [];
                                if (!currentValues.includes(value)) {
                                    updateFilter(index, { value: [...currentValues, value] });
                                }
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Add value..." />
                            </SelectTrigger>
                            <SelectContent>
                                {property.options.map(option => (
                                    <SelectItem key={option} value={option}>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                );
            } else {
                return (
                    <div className="space-y-2">
                        <Label>Value</Label>
                        <Select
                            value={filter.value || ''}
                            onValueChange={(value) => updateFilter(index, { value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select value..." />
                            </SelectTrigger>
                            <SelectContent>
                                {property.options.map(option => (
                                    <SelectItem key={option} value={option}>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                );
            }
        }

        if (property?.type === 'date') {
            return (
                <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                        type="date"
                        value={filter.value || ''}
                        onChange={(e) => updateFilter(index, { value: e.target.value })}
                    />
                </div>
            );
        }

        return (
            <div className="space-y-2">
                <Label>Value</Label>
                <Input
                    value={filter.value || ''}
                    onChange={(e) => updateFilter(index, { value: e.target.value })}
                    placeholder="Enter value..."
                />
            </div>
        );
    };

    return (
        <Card className={className}>
            <CardHeader>
                <div className="flex items-center space-x-4">
                    <Button
                        variant={activeTab === 'filters' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveTab('filters')}
                        className="flex items-center space-x-2"
                    >
                        <Filter className="h-4 w-4" />
                        <span>Filters ({filters.length})</span>
                    </Button>
                    <Button
                        variant={activeTab === 'sorts' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveTab('sorts')}
                        className="flex items-center space-x-2"
                    >
                        <ArrowUpDown className="h-4 w-4" />
                        <span>Sorts ({sorts.length})</span>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {activeTab === 'filters' && (
                    <div className="space-y-4">
                        {filters.map((filter, index) => (
                            <Card key={index} className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    {index > 0 && (
                                        <div className="space-y-2">
                                            <Label>Condition</Label>
                                            <Select
                                                value={filter.condition || 'AND'}
                                                onValueChange={(value: 'AND' | 'OR') => 
                                                    updateFilter(index, { condition: value })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="AND">AND</SelectItem>
                                                    <SelectItem value="OR">OR</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                    
                                    <div className="space-y-2">
                                        <Label>Property</Label>
                                        <Select
                                            value={filter.propertyId}
                                            onValueChange={(value) => updateFilter(index, { propertyId: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableProperties.map(prop => (
                                                    <SelectItem key={prop.id} value={prop.id}>
                                                        {prop.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label>Operator</Label>
                                        <Select
                                            value={filter.operator}
                                            onValueChange={(value) => updateFilter(index, { operator: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {getOperatorsForProperty(filter.propertyId).map(op => (
                                                    <SelectItem key={op.value} value={op.value}>
                                                        {op.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    
                                    <div className="flex items-end space-x-2">
                                        <div className="flex-1">
                                            {renderFilterValue(filter, index)}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removeFilter(index)}
                                            className="mb-2"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                        
                        <Button onClick={addFilter} variant="outline" className="w-full">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Filter
                        </Button>
                    </div>
                )}

                {activeTab === 'sorts' && (
                    <div className="space-y-4">
                        {sorts.map((sort, index) => (
                            <Card key={index} className="p-4">
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1 grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Property</Label>
                                            <Select
                                                value={sort.propertyId}
                                                onValueChange={(value) => updateSort(index, { propertyId: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {availableProperties.map(prop => (
                                                        <SelectItem key={prop.id} value={prop.id}>
                                                            {prop.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <Label>Direction</Label>
                                            <Select
                                                value={sort.direction}
                                                onValueChange={(value: 'asc' | 'desc') => 
                                                    updateSort(index, { direction: value })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="asc">
                                                        <div className="flex items-center space-x-2">
                                                            <SortAsc className="h-4 w-4" />
                                                            <span>Ascending</span>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="desc">
                                                        <div className="flex items-center space-x-2">
                                                            <SortDesc className="h-4 w-4" />
                                                            <span>Descending</span>
                                                        </div>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col space-y-1">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => moveSort(index, 'up')}
                                            disabled={index === 0}
                                        >
                                            ↑
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => moveSort(index, 'down')}
                                            disabled={index === sorts.length - 1}
                                        >
                                            ↓
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removeSort(index)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                        
                        <Button onClick={addSort} variant="outline" className="w-full">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Sort
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
