import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { 
    Search, Filter, X, Calendar as CalendarIcon, 
    Tag, User, Target, CheckSquare, BookOpen,
    SlidersHorizontal, Save, RotateCcw
} from 'lucide-react';
import { format } from 'date-fns';

export interface FilterConfig {
    id: string;
    label: string;
    type: 'text' | 'select' | 'multiselect' | 'date' | 'daterange' | 'boolean' | 'number';
    options?: { value: string; label: string; icon?: React.ComponentType }[];
    placeholder?: string;
    icon?: React.ComponentType;
}

export interface FilterValue {
    [key: string]: any;
}

export interface SavedFilter {
    id: string;
    name: string;
    filters: FilterValue;
    isDefault?: boolean;
}

interface EnhancedFilterManagerProps {
    configs: FilterConfig[];
    values: FilterValue;
    onChange: (values: FilterValue) => void;
    onSave?: (filter: SavedFilter) => void;
    savedFilters?: SavedFilter[];
    onLoadSaved?: (filter: SavedFilter) => void;
    onDeleteSaved?: (filterId: string) => void;
    className?: string;
}

export function EnhancedFilterManager({
    configs,
    values,
    onChange,
    onSave,
    savedFilters = [],
    onLoadSaved,
    onDeleteSaved,
    className = ''
}: EnhancedFilterManagerProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [saveDialogOpen, setSaveDialogOpen] = useState(false);
    const [filterName, setFilterName] = useState('');

    const updateFilter = useCallback((key: string, value: any) => {
        onChange({ ...values, [key]: value });
    }, [values, onChange]);

    const clearFilter = useCallback((key: string) => {
        const newValues = { ...values };
        delete newValues[key];
        onChange(newValues);
    }, [values, onChange]);

    const clearAllFilters = useCallback(() => {
        onChange({});
    }, [onChange]);

    const saveCurrentFilter = useCallback(() => {
        if (!filterName.trim() || !onSave) return;
        
        const filter: SavedFilter = {
            id: Date.now().toString(),
            name: filterName.trim(),
            filters: values
        };
        
        onSave(filter);
        setFilterName('');
        setSaveDialogOpen(false);
    }, [filterName, values, onSave]);

    const activeFilterCount = Object.keys(values).filter(key => 
        values[key] !== undefined && values[key] !== '' && values[key] !== null
    ).length;

    const renderFilterInput = (config: FilterConfig) => {
        const value = values[config.id];
        const IconComponent = config.icon;

        switch (config.type) {
            case 'text':
                return (
                    <div className="relative">
                        {IconComponent && (
                            <IconComponent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        )}
                        <Input
                            placeholder={config.placeholder || `Filter by ${config.label.toLowerCase()}`}
                            value={value || ''}
                            onChange={(e) => updateFilter(config.id, e.target.value)}
                            className={IconComponent ? 'pl-10' : ''}
                        />
                        {value && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                                onClick={() => clearFilter(config.id)}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        )}
                    </div>
                );

            case 'select':
                return (
                    <Select value={value || ''} onValueChange={(val) => updateFilter(config.id, val)}>
                        <SelectTrigger>
                            <SelectValue placeholder={config.placeholder || `Select ${config.label.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">All {config.label}</SelectItem>
                            {config.options?.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    <div className="flex items-center gap-2">
                                        {option.icon && <option.icon className="h-4 w-4" />}
                                        {option.label}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );

            case 'multiselect':
                const selectedValues = Array.isArray(value) ? value : [];
                return (
                    <div className="space-y-2">
                        <Select onValueChange={(val) => {
                            if (!selectedValues.includes(val)) {
                                updateFilter(config.id, [...selectedValues, val]);
                            }
                        }}>
                            <SelectTrigger>
                                <SelectValue placeholder={config.placeholder || `Select ${config.label.toLowerCase()}`} />
                            </SelectTrigger>
                            <SelectContent>
                                {config.options?.map((option) => (
                                    <SelectItem 
                                        key={option.value} 
                                        value={option.value}
                                        disabled={selectedValues.includes(option.value)}
                                    >
                                        <div className="flex items-center gap-2">
                                            {option.icon && <option.icon className="h-4 w-4" />}
                                            {option.label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {selectedValues.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {selectedValues.map((val) => {
                                    const option = config.options?.find(opt => opt.value === val);
                                    return (
                                        <Badge key={val} variant="secondary" className="gap-1">
                                            {option?.icon && <option.icon className="h-3 w-3" />}
                                            {option?.label || val}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-3 w-3 p-0 hover:bg-transparent"
                                                onClick={() => {
                                                    updateFilter(config.id, selectedValues.filter(v => v !== val));
                                                }}
                                            >
                                                <X className="h-2 w-2" />
                                            </Button>
                                        </Badge>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );

            case 'date':
                return (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {value ? format(new Date(value), 'PPP') : config.placeholder || 'Pick a date'}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={value ? new Date(value) : undefined}
                                onSelect={(date) => updateFilter(config.id, date?.toISOString())}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                );

            case 'daterange':
                const [startDate, endDate] = Array.isArray(value) ? value : [null, null];
                return (
                    <div className="flex gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="justify-start text-left font-normal flex-1">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {startDate ? format(new Date(startDate), 'MMM dd') : 'Start date'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={startDate ? new Date(startDate) : undefined}
                                    onSelect={(date) => updateFilter(config.id, [date?.toISOString(), endDate])}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="justify-start text-left font-normal flex-1">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {endDate ? format(new Date(endDate), 'MMM dd') : 'End date'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={endDate ? new Date(endDate) : undefined}
                                    onSelect={(date) => updateFilter(config.id, [startDate, date?.toISOString()])}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                );

            case 'boolean':
                return (
                    <Select value={value?.toString() || ''} onValueChange={(val) => updateFilter(config.id, val === 'true')}>
                        <SelectTrigger>
                            <SelectValue placeholder={config.placeholder || `Filter by ${config.label.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">All</SelectItem>
                            <SelectItem value="true">Yes</SelectItem>
                            <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                    </Select>
                );

            case 'number':
                return (
                    <Input
                        type="number"
                        placeholder={config.placeholder || `Filter by ${config.label.toLowerCase()}`}
                        value={value || ''}
                        onChange={(e) => updateFilter(config.id, e.target.value ? Number(e.target.value) : undefined)}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <Card className={className}>
            <CardContent className="p-4">
                {/* Quick Filters Row */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1">
                        {renderFilterInput(configs.find(c => c.id === 'search') || configs[0])}
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="gap-2"
                    >
                        <Filter className="h-4 w-4" />
                        Filters
                        {activeFilterCount > 0 && (
                            <Badge variant="secondary" className="ml-1">
                                {activeFilterCount}
                            </Badge>
                        )}
                    </Button>
                    {activeFilterCount > 0 && (
                        <Button variant="ghost" onClick={clearAllFilters} className="gap-2">
                            <RotateCcw className="h-4 w-4" />
                            Clear
                        </Button>
                    )}
                </div>

                {/* Expanded Filters */}
                {isExpanded && (
                    <div className="space-y-4 border-t pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {configs.filter(c => c.id !== 'search').map((config) => (
                                <div key={config.id} className="space-y-2">
                                    <label className="text-sm font-medium">{config.label}</label>
                                    {renderFilterInput(config)}
                                </div>
                            ))}
                        </div>

                        {/* Saved Filters */}
                        {savedFilters.length > 0 && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Saved Filters</label>
                                <div className="flex flex-wrap gap-2">
                                    {savedFilters.map((filter) => (
                                        <Badge
                                            key={filter.id}
                                            variant="outline"
                                            className="cursor-pointer hover:bg-muted gap-2"
                                            onClick={() => onLoadSaved?.(filter)}
                                        >
                                            {filter.name}
                                            {filter.isDefault && <span className="text-xs">(default)</span>}
                                            {onDeleteSaved && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-3 w-3 p-0 hover:bg-transparent"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDeleteSaved(filter.id);
                                                    }}
                                                >
                                                    <X className="h-2 w-2" />
                                                </Button>
                                            )}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Save Filter */}
                        {onSave && activeFilterCount > 0 && (
                            <div className="flex items-center gap-2">
                                <Input
                                    placeholder="Filter name"
                                    value={filterName}
                                    onChange={(e) => setFilterName(e.target.value)}
                                    className="flex-1"
                                />
                                <Button
                                    onClick={saveCurrentFilter}
                                    disabled={!filterName.trim()}
                                    className="gap-2"
                                >
                                    <Save className="h-4 w-4" />
                                    Save Filter
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
