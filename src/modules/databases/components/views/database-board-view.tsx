import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Plus, Edit, Trash2 } from 'lucide-react';
import { useDatabaseContext } from '../../context/database-context';
import type { DatabaseView, DatabaseProperty, DatabaseRecord } from '@/types/database.types';
import {
    normalizeSelectValue,
    getSelectOptionDisplay,
    getSelectOptionId,
    getSelectOptionColor
} from '@/modules/databases/utils/selectOptionUtils';

interface DatabaseBoardViewProps {
    view: DatabaseView;
    properties: DatabaseProperty[];
    records: DatabaseRecord[];
    onRecordSelect?: (record: DatabaseRecord) => void;
    onRecordEdit?: (record: DatabaseRecord) => void;
    onRecordDelete?: (recordId: string) => void;
    onRecordCreate?: (groupValue?: string) => void;
}

export function DatabaseBoardView({
    view,
    properties,
    records,
    onRecordSelect,
    onRecordEdit,
    onRecordDelete,
    onRecordCreate,
}: DatabaseBoardViewProps) {
    const { setDialogOpen } = useDatabaseContext();
    // Find the grouping property (usually a SELECT property)
    const groupingProperty = properties.find(p => 
        p.type === 'SELECT' && view.visibleProperties?.includes(p.id)
    ) || properties.find(p => p.type === 'SELECT');

    // Get all possible groups from the grouping property
    const groups = React.useMemo(() => {
        if (!groupingProperty?.selectOptions) {
            return [{ id: 'ungrouped', name: 'Ungrouped', color: '#gray' }];
        }

        const groups = groupingProperty.selectOptions.map(option => ({
            id: option.id,
            name: option.name,
            color: option.color,
        }));

        // Add ungrouped if board settings allow it
        if (view.boardSettings?.showUngrouped !== false) {
            groups.push({ id: 'ungrouped', name: 'Ungrouped', color: '#gray' });
        }

        return groups;
    }, [groupingProperty, view.boardSettings]);

    // Group records by the grouping property
    const groupedRecords = React.useMemo(() => {
        const grouped: Record<string, DatabaseRecord[]> = {};

        // Initialize all groups
        groups.forEach(group => {
            grouped[group.id] = [];
        });

        // Group records
        records.forEach(record => {
            const groupValue = groupingProperty 
                ? record.properties[groupingProperty.id] 
                : 'ungrouped';
            
            const groupId = groupValue || 'ungrouped';
            
            if (grouped[groupId]) {
                grouped[groupId].push(record);
            } else {
                grouped['ungrouped'].push(record);
            }
        });

        return grouped;
    }, [records, groupingProperty, groups]);

    const renderRecordCard = (record: DatabaseRecord) => {
        // Get the title property (first text property or first property)
        const titleProperty = properties.find(p => p.type === 'TEXT') || properties[0];
        const titleValue = titleProperty ? record.properties[titleProperty.id] : 'Untitled';
        const title = typeof titleValue === 'object' ? getSelectOptionDisplay(titleValue) : String(titleValue || 'Untitled');

        // Get other visible properties
        const visibleProperties = properties.filter(p => 
            p.id !== groupingProperty?.id && 
            p.id !== titleProperty?.id &&
            view.visibleProperties?.includes(p.id)
        ).slice(0, 3); // Show max 3 additional properties

        return (
            <Card
                key={record.id}
                className="mb-3 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onRecordEdit?.(record)}
            >
                <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                        <CardTitle className="text-sm font-medium line-clamp-2">
                            {title || 'Untitled'}
                        </CardTitle>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <MoreHorizontal className="h-3 w-3" />
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
                </CardHeader>
                {visibleProperties.length > 0 && (
                    <CardContent className="pt-0">
                        <div className="space-y-1">
                            {visibleProperties.map(property => {
                                const value = record.properties[property.id];
                                if (!value) return null;

                                return (
                                    <div key={property.id} className="text-xs text-muted-foreground">
                                        <span className="font-medium">{property.name}:</span>{' '}
                                        {property.type === 'SELECT' ? (
                                            <Badge
                                                variant="outline"
                                                className="text-xs text-white border-0"
                                                style={{ backgroundColor: getSelectOptionColor(normalizeSelectValue(value, false)) }}
                                            >
                                                {getSelectOptionDisplay(normalizeSelectValue(value, false))}
                                            </Badge>
                                        ) : property.type === 'MULTI_SELECT' ? (
                                            <div className="flex flex-wrap gap-1">
                                                {normalizeSelectValue(value, true).map((option: unknown, index: number) => (
                                                    <Badge
                                                        key={getSelectOptionId(option) || index}
                                                        variant="outline"
                                                        className="text-xs text-white border-0"
                                                        style={{ backgroundColor: getSelectOptionColor(option) }}
                                                    >
                                                        {getSelectOptionDisplay(option)}
                                                    </Badge>
                                                ))}
                                            </div>
                                        ) : (
                                            <span>{String(value)}</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                )}
            </Card>
        );
    };

    if (!groupingProperty) {
        return (
            <div className="flex items-center justify-center h-64 text-center">
                <div>
                    <p className="text-muted-foreground mb-2">
                        Board view requires a SELECT property for grouping
                    </p>
                    <Button variant="outline" onClick={() => setDialogOpen('create-property')}>
                        Add SELECT Property
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex gap-4 overflow-x-auto pb-4">
            {groups.map(group => (
                <div key={group.id} className="flex-shrink-0 w-80">
                    <div className="bg-muted/50 rounded-lg p-4">
                        {/* Group Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div 
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: group.color }}
                                />
                                <h3 className="font-medium">{group.name}</h3>
                                <Badge variant="secondary" className="text-xs">
                                    {groupedRecords[group.id]?.length || 0}
                                </Badge>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 w-6 p-0"
                                onClick={() => onRecordCreate?.(group.id === 'ungrouped' ? undefined : group.id)}
                            >
                                <Plus className="h-3 w-3" />
                            </Button>
                        </div>

                        {/* Records */}
                        <div className="space-y-2 min-h-[200px]">
                            {groupedRecords[group.id]?.map(renderRecordCard)}
                            
                            {groupedRecords[group.id]?.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground text-sm">
                                    No records in this group
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
