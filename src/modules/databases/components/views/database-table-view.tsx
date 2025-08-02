import React from 'react';
import { DatabaseDataTable } from '../database-data-table';
import { generateDatabaseColumns } from '../database-columns';
import { useUpdateRecord } from '../../services/databaseQueries';
import { toast } from 'sonner';
import type { DatabaseView, DatabaseProperty, DatabaseRecord } from '@/types/database.types';

interface DatabaseTableViewProps {
    view: DatabaseView;
    properties: DatabaseProperty[];
    records: DatabaseRecord[];
    onRecordSelect?: (record: DatabaseRecord) => void;
    onRecordEdit?: (record: DatabaseRecord) => void;
    onRecordDelete?: (recordId: string) => void;
    onRecordCreate?: () => void;
    databaseId?: string;
    isFrozen?: boolean;
}

export function DatabaseTableView({
    view,
    properties,
    records,
    onRecordSelect,
    onRecordEdit,
    onRecordDelete,
    onRecordCreate,
    databaseId,
    isFrozen = false,
}: DatabaseTableViewProps) {
    const updateRecordMutation = useUpdateRecord();
    // Filter properties based on view's visible properties
    const visibleProperties = properties.filter(property => {
        if (property.hidden) return false;
        if (view?.visibleProperties && view.visibleProperties.length > 0) {
            return view.visibleProperties?.includes(property.id) || false;
        }
        return property.isVisible !== false;
    });

    // Handle record updates
    const handleUpdateRecord = (recordId: string, propertyId: string, newValue: any) => {
        if (!databaseId) return;

        if (isFrozen) {
            toast.error('Database is frozen and cannot be edited');
            return;
        }

        updateRecordMutation.mutate({
            databaseId,
            recordId,
            data: {
                [propertyId]: newValue
            }
        });
    };

    // Generate columns for the table
    const columns = generateDatabaseColumns(
        visibleProperties,
        onRecordEdit,
        onRecordDelete,
        handleUpdateRecord,
        isFrozen
    );

    // Apply view filters and sorts to records
    const filteredRecords = React.useMemo(() => {
        // Safety check for records
        if (!records || !Array.isArray(records)) {
            return [];
        }

        let result = [...records];

        // Apply filters
        if (view.filters && view.filters.length > 0) {
            result = result.filter(record => {
                return view.filters!.every(filter => {
                    const value = record.properties[filter.propertyId];
                    
                    switch (filter.operator) {
                        case 'equals':
                            return value === filter.value;
                        case 'not_equals':
                            return value !== filter.value;
                        case 'contains':
                            return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
                        case 'starts_with':
                            return String(value).toLowerCase().startsWith(String(filter.value).toLowerCase());
                        case 'ends_with':
                            return String(value).toLowerCase().endsWith(String(filter.value).toLowerCase());
                        case 'is_empty':
                            return !value || value === '';
                        case 'is_not_empty':
                            return value && value !== '';
                        case 'greater_than':
                            return Number(value) > Number(filter.value);
                        case 'less_than':
                            return Number(value) < Number(filter.value);
                        default:
                            return true;
                    }
                });
            });
        }

        // Apply sorts
        if (view.sorts && view.sorts.length > 0) {
            result.sort((a, b) => {
                for (const sort of view.sorts!) {
                    const aValue = a.properties[sort.propertyId];
                    const bValue = b.properties[sort.propertyId];
                    
                    let comparison = 0;
                    
                    if (aValue < bValue) comparison = -1;
                    else if (aValue > bValue) comparison = 1;
                    
                    if (comparison !== 0) {
                        return sort.direction === 'desc' ? -comparison : comparison;
                    }
                }
                return 0;
            });
        }

        return result;
    }, [records, view.filters, view.sorts]);

    return (
        <div className="space-y-4">
            <DatabaseDataTable
                columns={columns}
                data={filteredRecords}
                properties={properties} // Pass all properties, not just visible ones
                onRecordSelect={onRecordSelect}
                onRecordEdit={onRecordEdit}
                onRecordDelete={onRecordDelete}
                onRecordCreate={onRecordCreate}
                databaseId={databaseId}
                showPropertyVisibility={true}
            />
        </div>
    );
}
