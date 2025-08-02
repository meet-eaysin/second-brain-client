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
import { Clock, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { useDatabaseContext } from '../../context/database-context';
import type { DatabaseView, DatabaseProperty, DatabaseRecord } from '@/types/database.types';
import {
    normalizeSelectValue,
    getSelectOptionDisplay,
    getSelectOptionId,
    getSelectOptionColor
} from '@/modules/databases/utils/selectOptionUtils';

interface DatabaseTimelineViewProps {
    view: DatabaseView;
    properties: DatabaseProperty[];
    records: DatabaseRecord[];
    onRecordSelect?: (record: DatabaseRecord) => void;
    onRecordEdit?: (record: DatabaseRecord) => void;
    onRecordDelete?: (recordId: string) => void;
}

export function DatabaseTimelineView({
    view,
    properties,
    records,
    onRecordSelect,
    onRecordEdit,
    onRecordDelete,
}: DatabaseTimelineViewProps) {
    const { setDialogOpen } = useDatabaseContext();
    // Find date properties for timeline display
    const dateProperties = properties.filter(p => p.type === 'DATE');
    const primaryDateProperty = dateProperties[0]; // Use first date property
    const endDateProperty = dateProperties[1]; // Optional end date for ranges

    // Find title property
    const titleProperty = properties.find(p => p.type === 'TEXT') || properties[0];

    // Get other properties to display
    const displayProperties = properties.filter(p => 
        p.id !== primaryDateProperty?.id && 
        p.id !== endDateProperty?.id && 
        p.id !== titleProperty?.id &&
        view.visibleProperties?.includes(p.id)
    ).slice(0, 2);

    // Sort records by date
    const sortedRecords = React.useMemo(() => {
        if (!primaryDateProperty) return records;

        return [...records]
            .filter(record => record.properties[primaryDateProperty.id])
            .sort((a, b) => {
                const dateA = new Date(String(a.properties[primaryDateProperty.id]));
                const dateB = new Date(String(b.properties[primaryDateProperty.id]));
                return dateA.getTime() - dateB.getTime();
            });
    }, [records, primaryDateProperty]);

    // Group records by month/year for better organization
    const groupedRecords = React.useMemo(() => {
        if (!primaryDateProperty) return {};

        const groups: Record<string, DatabaseRecord[]> = {};

        sortedRecords.forEach(record => {
            const dateValue = record.properties[primaryDateProperty.id];
            if (!dateValue) return; // Skip records without date value

            const date = new Date(String(dateValue));
            if (isNaN(date.getTime())) return; // Skip invalid dates

            const groupKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }
            groups[groupKey].push(record);
        });

        return groups;
    }, [sortedRecords, primaryDateProperty]);

    const formatDate = (dateValue: unknown) => {
        const date = new Date(String(dateValue));
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (dateValue: unknown) => {
        const date = new Date(String(dateValue));
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderRecordItem = (record: DatabaseRecord, isLast: boolean) => {
        if (!primaryDateProperty) return null;

        const titleValue = titleProperty ? record.properties[titleProperty.id] : 'Untitled';
        const title = typeof titleValue === 'object' ? getSelectOptionDisplay(titleValue) : String(titleValue || 'Untitled');
        const startDate = record.properties[primaryDateProperty.id];
        const endDate = endDateProperty ? record.properties[endDateProperty.id] : null;

        return (
            <div key={record.id} className="relative flex gap-4 pb-8">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-primary rounded-full border-2 border-background shadow-sm" />
                    {!isLast && <div className="w-px h-full bg-border mt-2" />}
                </div>

                {/* Content */}
                <div className="flex-1 -mt-1">
                    <Card className="group cursor-pointer hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle 
                                        className="text-base font-medium cursor-pointer"
                                        onClick={() => onRecordEdit?.(record)}
                                    >
                                        {title || 'Untitled'}
                                    </CardTitle>
                                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                        <Clock className="h-3 w-3" />
                                        <span>{formatDate(startDate)}</span>
                                        <span>{formatTime(startDate)}</span>
                                        {endDate && (
                                            <>
                                                <span>→</span>
                                                <span>{formatDate(endDate)}</span>
                                                <span>{formatTime(endDate)}</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => onRecordEdit?.(record)}>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                            onClick={() => onRecordDelete?.(record.id)}
                                            className="text-destructive focus:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardHeader>

                        {displayProperties.length > 0 && (
                            <CardContent className="pt-0">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {displayProperties.map(property => {
                                        const value = record.properties[property.id];
                                        if (!value) return null;

                                        return (
                                            <div key={property.id} className="flex flex-col gap-1">
                                                <span className="text-xs text-muted-foreground font-medium">
                                                    {property.name}
                                                </span>
                                                <div className="text-sm">
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
                                                    ) : property.type === 'CHECKBOX' ? (
                                                        <Badge variant={value ? 'default' : 'secondary'} className="text-xs">
                                                            {value ? 'Yes' : 'No'}
                                                        </Badge>
                                                    ) : (
                                                        <span>{String(value)}</span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        )}
                    </Card>
                </div>
            </div>
        );
    };

    if (!primaryDateProperty) {
        return (
            <div className="flex items-center justify-center h-64 text-center">
                <div>
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">
                        Timeline view requires a DATE property
                    </p>
                    <Button variant="outline" onClick={() => setDialogOpen('create-property')}>
                        Add DATE Property
                    </Button>
                </div>
            </div>
        );
    }

    if (sortedRecords.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-center">
                <div>
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">No records to display</p>
                    <p className="text-sm text-muted-foreground">
                        Add some records with dates to see them in timeline view
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {Object.entries(groupedRecords).map(([groupKey, groupRecords]) => (
                <div key={groupKey}>
                    {/* Month/Year Header */}
                    <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 py-2 mb-4">
                        <h3 className="text-lg font-semibold text-muted-foreground">
                            {groupKey}
                        </h3>
                    </div>

                    {/* Timeline Items */}
                    <div className="space-y-0">
                        {groupRecords.map((record, index) => 
                            renderRecordItem(record, index === groupRecords.length - 1)
                        )}
                    </div>
                </div>
            ))}

            {/* Legend */}
            {primaryDateProperty && (
                <div className="text-sm text-muted-foreground border-t pt-4">
                    Showing records based on <strong>{primaryDateProperty.name}</strong> property
                    {endDateProperty && (
                        <span> with duration from <strong>{endDateProperty.name}</strong></span>
                    )}
                </div>
            )}
        </div>
    );
}
