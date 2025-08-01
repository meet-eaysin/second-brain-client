import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, Grid, Columns, List, Table as TableIcon, Clock } from 'lucide-react';
import { DatabaseDataTable } from './database-data-table';
import { DatabaseEmptyState } from './database-empty-state';
import { useDatabaseContext } from '../context/database-context';
import type { Database, DatabaseView, DatabaseRecord, DatabaseProperty } from '@/types/database.types';
import { getDatabaseColumns } from './database-columns';

interface DatabaseViewRendererProps {
    database: Database;
    currentView: DatabaseView;
    records: DatabaseRecord[];
    isLoading?: boolean;
    onRecordEdit?: (record: DatabaseRecord) => void;
    onRecordDelete?: (recordId: string) => void;
}

export function DatabaseViewRenderer({
    database,
    currentView,
    records,
    isLoading,
    onRecordEdit,
    onRecordDelete,
}: DatabaseViewRendererProps) {
    const { setOpen } = useDatabaseContext();

    // Get visible properties based on current view
    const getVisibleProperties = (): DatabaseProperty[] => {
        if (!currentView.visibleProperties || currentView.visibleProperties.length === 0) {
            return database.properties;
        }
        return database.properties.filter(p => currentView.visibleProperties.includes(p.id));
    };

    const visibleProperties = getVisibleProperties();

    // Show empty state if no records
    if (!records || records.length === 0) {
        return (
            <DatabaseEmptyState
                viewType={currentView.type}
                onAddRecord={() => setOpen('create-record')}
                databaseName={database.name}
            />
        );
    }

    // Get view icon
    function getViewIcon(viewType: string, className = "h-6 w-6") {
        const iconProps = { className };
        switch (viewType) {
            case 'TABLE': return <TableIcon {...iconProps} />;
            case 'BOARD': return <Columns {...iconProps} />;
            case 'LIST': return <List {...iconProps} />;
            case 'GALLERY': return <Grid {...iconProps} />;
            case 'CALENDAR': return <Calendar {...iconProps} />;
            case 'TIMELINE': return <Clock {...iconProps} />;
            default: return <TableIcon {...iconProps} />;
        }
    }

    // Render property value
    const renderPropertyValue = (property: DatabaseProperty, value: any) => {
        if (!value && value !== 0 && value !== false) return '-';

        switch (property.type) {
            case 'TEXT':
            case 'EMAIL':
            case 'PHONE':
                return <span className="truncate">{value}</span>;
            case 'NUMBER':
                return <span className="font-mono">{value}</span>;
            case 'CHECKBOX':
                return (
                    <div className="flex items-center">
                        <input type="checkbox" checked={!!value} readOnly className="rounded" />
                    </div>
                );
            case 'SELECT':
                const option = property.selectOptions?.find(opt => opt.id === value);
                return option ? (
                    <Badge style={{ backgroundColor: option.color, color: 'white' }}>
                        {option.name}
                    </Badge>
                ) : '-';
            case 'MULTI_SELECT':
                return (
                    <div className="flex flex-wrap gap-1">
                        {Array.isArray(value) ? value.map((optionId: string) => {
                            const option = property.selectOptions?.find(opt => opt.id === optionId);
                            return option ? (
                                <Badge key={optionId} style={{ backgroundColor: option.color, color: 'white' }}>
                                    {option.name}
                                </Badge>
                            ) : null;
                        }) : '-'}
                    </div>
                );
            case 'DATE':
                return value ? new Date(value).toLocaleDateString() : '-';
            case 'URL':
                return value ? (
                    <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate">
                        {value}
                    </a>
                ) : '-';
            default:
                return <span className="truncate">{value}</span>;
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }



    // Render different view types
    switch (currentView.type) {
        case 'TABLE':
            const columns = getDatabaseColumns(visibleProperties, onRecordEdit, onRecordDelete);
            return (
                <DatabaseDataTable
                    columns={columns}
                    data={records}
                    properties={visibleProperties}
                    onRecordEdit={onRecordEdit}
                    onRecordDelete={onRecordDelete}
                />
            );

        case 'BOARD':
            return <BoardView 
                records={records} 
                properties={visibleProperties} 
                renderPropertyValue={renderPropertyValue}
                onRecordEdit={onRecordEdit}
            />;

        case 'GALLERY':
            return <GalleryView 
                records={records} 
                properties={visibleProperties} 
                renderPropertyValue={renderPropertyValue}
                onRecordEdit={onRecordEdit}
            />;

        case 'LIST':
            return <ListView 
                records={records} 
                properties={visibleProperties} 
                renderPropertyValue={renderPropertyValue}
                onRecordEdit={onRecordEdit}
            />;

        case 'CALENDAR':
            return <CalendarView 
                records={records} 
                properties={visibleProperties} 
                renderPropertyValue={renderPropertyValue}
                onRecordEdit={onRecordEdit}
            />;

        case 'TIMELINE':
            return <TimelineView 
                records={records} 
                properties={visibleProperties} 
                renderPropertyValue={renderPropertyValue}
                onRecordEdit={onRecordEdit}
            />;

        default:
            return <EmptyState viewType={currentView.type} />;
    }
}

// Board View Component
function BoardView({ records, properties, renderPropertyValue, onRecordEdit }: any) {
    // Group records by a select property (first select property found)
    const groupByProperty = properties.find((p: DatabaseProperty) => p.type === 'SELECT');
    
    if (!groupByProperty) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">Board view requires at least one Select property to group by.</p>
            </div>
        );
    }

    const groups = groupByProperty.selectOptions || [];
    const ungroupedRecords = records.filter((record: DatabaseRecord) => 
        !record.properties[groupByProperty.id]
    );

    return (
        <div className="flex gap-6 overflow-x-auto pb-4">
            {groups.map((group) => (
                <div key={group.id} className="flex-shrink-0 w-80">
                    <div className="flex items-center gap-2 mb-4">
                        <Badge style={{ backgroundColor: group.color, color: 'white' }}>
                            {group.name}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                            {records.filter((r: DatabaseRecord) => r.properties[groupByProperty.id] === group.id).length}
                        </span>
                    </div>
                    <div className="space-y-3">
                        {records
                            .filter((record: DatabaseRecord) => record.properties[groupByProperty.id] === group.id)
                            .map((record: DatabaseRecord) => (
                                <Card key={record.id} className="cursor-pointer hover:shadow-md transition-shadow"
                                      onClick={() => onRecordEdit?.(record)}>
                                    <CardContent className="p-4">
                                        {properties.slice(0, 3).map((property: DatabaseProperty) => (
                                            <div key={property.id} className="mb-2 last:mb-0">
                                                <div className="text-xs text-muted-foreground mb-1">{property.name}</div>
                                                <div className="text-sm">
                                                    {renderPropertyValue(property, record.properties[property.id])}
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            ))}
                    </div>
                </div>
            ))}
            
            {ungroupedRecords.length > 0 && (
                <div className="flex-shrink-0 w-80">
                    <div className="flex items-center gap-2 mb-4">
                        <Badge variant="outline">No {groupByProperty.name}</Badge>
                        <span className="text-sm text-muted-foreground">{ungroupedRecords.length}</span>
                    </div>
                    <div className="space-y-3">
                        {ungroupedRecords.map((record: DatabaseRecord) => (
                            <Card key={record.id} className="cursor-pointer hover:shadow-md transition-shadow"
                                  onClick={() => onRecordEdit?.(record)}>
                                <CardContent className="p-4">
                                    {properties.slice(0, 3).map((property: DatabaseProperty) => (
                                        <div key={property.id} className="mb-2 last:mb-0">
                                            <div className="text-xs text-muted-foreground mb-1">{property.name}</div>
                                            <div className="text-sm">
                                                {renderPropertyValue(property, record.properties[property.id])}
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// Gallery View Component
function GalleryView({ records, properties, renderPropertyValue, onRecordEdit }: any) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {records.map((record: DatabaseRecord) => (
                <Card key={record.id} className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => onRecordEdit?.(record)}>
                    <CardContent className="p-4">
                        {properties.slice(0, 4).map((property: DatabaseProperty) => (
                            <div key={property.id} className="mb-3 last:mb-0">
                                <div className="text-xs text-muted-foreground mb-1">{property.name}</div>
                                <div className="text-sm">
                                    {renderPropertyValue(property, record.properties[property.id])}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

// List View Component  
function ListView({ records, properties, renderPropertyValue, onRecordEdit }: any) {
    return (
        <div className="space-y-2">
            {records.map((record: DatabaseRecord) => (
                <Card key={record.id} className="cursor-pointer hover:shadow-sm transition-shadow"
                      onClick={() => onRecordEdit?.(record)}>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {properties.slice(0, 3).map((property: DatabaseProperty) => (
                                    <div key={property.id}>
                                        <div className="text-xs text-muted-foreground mb-1">{property.name}</div>
                                        <div className="text-sm">
                                            {renderPropertyValue(property, record.properties[property.id])}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

// Calendar View Component (placeholder)
function CalendarView({ records }: any) {
    return (
        <div className="text-center py-16">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Calendar View</h3>
            <p className="text-muted-foreground">Calendar view coming soon...</p>
            <p className="text-sm text-muted-foreground mt-2">{records.length} records available</p>
        </div>
    );
}

// Timeline View Component (placeholder)
function TimelineView({ records }: any) {
    return (
        <div className="text-center py-16">
            <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Timeline View</h3>
            <p className="text-muted-foreground">Timeline view coming soon...</p>
            <p className="text-sm text-muted-foreground mt-2">{records.length} records available</p>
        </div>
    );
}
