import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Circle, CheckCircle } from 'lucide-react';
import type { DatabaseView, DatabaseProperty, DatabaseRecord } from '@/types/database.types';
import {
    normalizeSelectValue,
    getSelectOptionDisplay,
    getSelectOptionId,
    getSelectOptionColor
} from '@/modules/databases/utils/selectOptionUtils';

interface DatabaseListViewProps {
    view: DatabaseView;
    properties: DatabaseProperty[];
    records: DatabaseRecord[];
    onRecordSelect?: (record: DatabaseRecord) => void;
    onRecordEdit?: (record: DatabaseRecord) => void;
    onRecordDelete?: (recordId: string) => void;
    onRecordUpdate?: (recordId: string, updates: Record<string, unknown>) => void;
}

export function DatabaseListView({
    view,
    properties,
    records,
    onRecordSelect,
    onRecordEdit,
    onRecordDelete,
    onRecordUpdate,
}: DatabaseListViewProps) {
    // Filter properties based on view's visible properties for display
    const visibleProperties = properties.filter(property => {
        if (property.hidden) return false;
        if (view?.visibleProperties && view.visibleProperties.length > 0) {
            return view.visibleProperties.includes(property.id);
        }
        return property.isVisible !== false;
    });

    // Find title property
    const titleProperty = visibleProperties.find(p => p.type === 'TEXT') || visibleProperties[0];
    
    // Find checkbox property for task-like behavior
    const checkboxProperty = visibleProperties.find(p => p.type === 'CHECKBOX');
    
    // Get other properties to display
    const displayProperties = visibleProperties.filter(p => 
        p.id !== titleProperty?.id && 
        p.id !== checkboxProperty?.id
    ).slice(0, 4); // Show max 4 additional properties

    const handleCheckboxChange = (record: DatabaseRecord, checked: boolean) => {
        if (checkboxProperty && onRecordUpdate) {
            onRecordUpdate(record.id, {
                [checkboxProperty.id]: checked
            });
        }
    };

    const renderPropertyValue = (property: DatabaseProperty, value: unknown) => {
        if (!value && value !== false) return null;

        switch (property.type) {
            case 'SELECT':
                const normalizedValue = normalizeSelectValue(value, false);
                return (
                    <Badge
                        variant="outline"
                        className="text-xs text-white border-0"
                        style={{ backgroundColor: getSelectOptionColor(normalizedValue) }}
                    >
                        <div
                            className="w-2 h-2 rounded-full mr-1"
                            style={{ backgroundColor: getSelectOptionColor(normalizedValue) }}
                        />
                        {getSelectOptionDisplay(normalizedValue)}
                    </Badge>
                );

            case 'MULTI_SELECT':
                if (!Array.isArray(value)) return null;
                const normalizedValues = normalizeSelectValue(value, true);
                return (
                    <div className="flex flex-wrap gap-1">
                        {normalizedValues.slice(0, 2).map((option: unknown, index: number) => (
                            <Badge
                                key={getSelectOptionId(option) || index}
                                variant="outline"
                                className="text-xs text-white border-0"
                                style={{ backgroundColor: getSelectOptionColor(option) }}
                            >
                                <div
                                    className="w-2 h-2 rounded-full mr-1"
                                    style={{ backgroundColor: getSelectOptionColor(option) }}
                                />
                                {getSelectOptionDisplay(option)}
                            </Badge>
                        ))}
                        {normalizedValues.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                                +{normalizedValues.length - 2}
                            </Badge>
                        )}
                    </div>
                );
            
            case 'CHECKBOX':
                return value ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                    <Circle className="h-4 w-4 text-muted-foreground" />
                );
            
            case 'DATE':
                return (
                    <span className="text-sm text-muted-foreground">
                        {new Date(String(value)).toLocaleDateString()}
                    </span>
                );
            
            case 'NUMBER':
                return (
                    <span className="text-sm font-mono">
                        {Number(value).toLocaleString()}
                    </span>
                );
            
            case 'EMAIL':
                return (
                    <a 
                        href={`mailto:${value}`} 
                        className="text-sm text-blue-600 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {value}
                    </a>
                );
            
            case 'URL':
                return (
                    <a 
                        href={String(value)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {String(value).length > 30 ? `${String(value).substring(0, 30)}...` : value}
                    </a>
                );
            
            default:
                return (
                    <span className="text-sm">
                        {String(value).length > 50 ? `${String(value).substring(0, 50)}...` : value}
                    </span>
                );
        }
    };

    const renderRecordItem = (record: DatabaseRecord) => {
        const titleValue = titleProperty ? record.properties[titleProperty.id] : 'Untitled';
        const title = typeof titleValue === 'object' ? getSelectOptionDisplay(titleValue) : String(titleValue || 'Untitled');
        const isChecked = checkboxProperty ? Boolean(record.properties[checkboxProperty.id]) : false;

        return (
            <Card
                key={record.id}
                className="group cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-transparent hover:border-l-primary"
                onClick={() => onRecordEdit?.(record)}
            >
                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                        {/* Checkbox if available */}
                        {checkboxProperty && (
                            <Checkbox
                                checked={isChecked}
                                onCheckedChange={(checked) => handleCheckboxChange(record, Boolean(checked))}
                                onClick={(e) => e.stopPropagation()}
                                className="flex-shrink-0"
                            />
                        )}

                        {/* Main content */}
                        <div className="flex-1 min-w-0">
                            {/* Title */}
                            <div className="flex items-center justify-between mb-2">
                                <h3 className={`font-medium truncate ${isChecked ? 'line-through text-muted-foreground' : ''}`}>
                                    {title || 'Untitled'}
                                </h3>
                                
                                {/* Actions */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={(e) => {
                                            e.stopPropagation();
                                            onRecordEdit?.(record);
                                        }}>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onRecordDelete?.(record.id);
                                            }}
                                            className="text-destructive focus:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Properties */}
                            {displayProperties.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                                    {displayProperties.map(property => {
                                        const value = record.properties[property.id];
                                        const renderedValue = renderPropertyValue(property, value);
                                        
                                        if (!renderedValue) return null;

                                        return (
                                            <div key={property.id} className="flex flex-col gap-1">
                                                <span className="text-xs text-muted-foreground font-medium">
                                                    {property.name}
                                                </span>
                                                {renderedValue}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="space-y-3">
            {records.map(renderRecordItem)}
            
            {/* Empty State */}
            {records.length === 0 && (
                <div className="flex items-center justify-center h-64 text-center">
                    <div>
                        <Circle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-2">No records to display</p>
                        <p className="text-sm text-muted-foreground">
                            Add some records to see them in list view
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
