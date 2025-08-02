import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { DatabaseTableHeader } from './database-table-header';
import { useDatabaseContext } from '../context/database-context';
import type { DatabaseProperty, DatabaseRecord } from '@/types/database.types';

interface DatabaseTableExampleProps {
    records: DatabaseRecord[];
    onRecordClick?: (record: DatabaseRecord) => void;
}

export function DatabaseTableExample({ records, onRecordClick }: DatabaseTableExampleProps) {
    const { currentDatabase } = useDatabaseContext();

    if (!currentDatabase?.properties?.length) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                No properties defined. Add a property to get started.
            </div>
        );
    }

    const visibleProperties = currentDatabase.properties.filter(prop => prop.isVisible !== false);

    const renderCellValue = (property: DatabaseProperty, record: DatabaseRecord) => {
        const value = record.properties[property.id];
        
        if (value === null || value === undefined) {
            return <span className="text-muted-foreground">—</span>;
        }

        switch (property.type) {
            case 'CHECKBOX':
                return value ? '✓' : '—';
            case 'DATE':
                return new Date(value as string).toLocaleDateString();
            case 'EMAIL':
                return <a href={`mailto:${value}`} className="text-blue-600 hover:underline">{value}</a>;
            case 'URL':
                return <a href={value as string} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{value}</a>;
            case 'SELECT':
                const option = property.selectOptions?.find(opt => opt.id === value);
                return option ? (
                    <div className="flex items-center gap-2">
                        <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: option.color }}
                        />
                        {option.name}
                    </div>
                ) : value;
            case 'MULTI_SELECT':
                const selectedOptions = Array.isArray(value) 
                    ? value.map(id => property.selectOptions?.find(opt => opt.id === id)).filter(Boolean)
                    : [];
                return (
                    <div className="flex flex-wrap gap-1">
                        {selectedOptions.map((option) => (
                            <div key={option?.id} className="flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs">
                                <div 
                                    className="w-2 h-2 rounded-full" 
                                    style={{ backgroundColor: option?.color }}
                                />
                                {option?.name}
                            </div>
                        ))}
                    </div>
                );
            default:
                return String(value);
        }
    };

    return (
        <div className="border rounded-lg overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        {visibleProperties.map((property) => (
                            <TableHead 
                                key={property.id} 
                                className="bg-muted/50 border-r last:border-r-0 min-w-[150px]"
                            >
                                <DatabaseTableHeader
                                    property={property}
                                    sortDirection={null} // TODO: Get from view state
                                    isFiltered={false} // TODO: Get from view state
                                    isFrozen={false} // TODO: Get from view state
                                    onPropertyUpdate={() => {
                                        // Refresh table data if needed
                                        console.log('Property updated, refreshing table...');
                                    }}
                                />
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {records.length === 0 ? (
                        <TableRow>
                            <TableCell 
                                colSpan={visibleProperties.length} 
                                className="text-center py-8 text-muted-foreground"
                            >
                                No records found. Add a record to get started.
                            </TableCell>
                        </TableRow>
                    ) : (
                        records.map((record) => (
                            <TableRow 
                                key={record.id}
                                className="hover:bg-muted/50 cursor-pointer"
                                onClick={() => onRecordClick?.(record)}
                            >
                                {visibleProperties.map((property) => (
                                    <TableCell 
                                        key={property.id} 
                                        className="border-r last:border-r-0 max-w-[200px] truncate"
                                    >
                                        {renderCellValue(property, record)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

// Usage Example:
/*
import { DatabaseTableExample } from './database-table-example';

function DatabaseDetailPage() {
    const { records } = useDatabaseRecords(databaseId);
    
    return (
        <div className="space-y-4">
            <DatabaseTableExample 
                records={records}
                onRecordClick={(record) => {
                    // Handle record click
                    console.log('Record clicked:', record);
                }}
            />
        </div>
    );
}
*/
