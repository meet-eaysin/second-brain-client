import React, { useMemo } from 'react';
import { StandaloneDataTable } from './standalone-data-table';
import { generateStandaloneColumns } from './standalone-columns';
import { transformDataToRecords, transformColumnsToProperties } from './data-transformers';
import { getTableConfiguration } from './table-configurations';
import type { ActionConfig, ToolbarActionConfig } from './action-system';
import type {
    DatabaseRecord,
    DatabaseProperty
} from '@/types/database.types';
import type { ColumnDef } from '@tanstack/react-table';

export interface UniversalDataTableProps<T = unknown> {
    // Data and structure
    data: T[];
    columns?: ColumnDef<T>[];
    
    // Table configuration
    tableType?: 'tasks' | 'projects' | 'goals' | 'notes' | 'people' | 'habits' | 'journal' | 'books' | 'content' | 'finances' | 'mood' | 'custom';
    context?: 'database' | 'second-brain' | 'general';
    
    // Properties (for database-style tables)
    properties?: DatabaseProperty[];
    
    // Event handlers
    onRecordSelect?: (record: T) => void;
    onRecordEdit?: (record: T) => void;
    onRecordDelete?: (recordId: string) => void;
    onRecordCreate?: () => void;
    onRecordUpdate?: (recordId: string, propertyId: string, newValue: unknown) => void;

    // Custom actions
    customActions?: ActionConfig<T>[];
    toolbarActions?: ToolbarActionConfig<T>[];
    onCustomAction?: (actionId: string, record: T) => void;
    onToolbarAction?: (actionId: string, records: T[]) => void;
    
    // Table features
    enableRowSelection?: boolean;
    enableBulkActions?: boolean;
    enableColumnVisibility?: boolean;
    enableSorting?: boolean;
    enableFiltering?: boolean;
    enablePagination?: boolean;
    
    // Database-specific
    databaseId?: string;
    viewId?: string;
    isFrozen?: boolean;
    
    // Styling and behavior
    className?: string;
    height?: string | number;
    
    // Data transformation
    idField?: string; // Field to use as record ID (default: 'id')
    dataTransformer?: (data: T[]) => DatabaseRecord[];
    propertyTransformer?: (columns: ColumnDef<T>[]) => DatabaseProperty[];
}

export function UniversalDataTable<T = unknown>({
    data,
    columns,
    tableType = 'custom',
    context = 'general',
    properties: providedProperties,
    onRecordSelect,
    onRecordEdit,
    onRecordDelete,
    onRecordCreate,
    onRecordUpdate,
    customActions: providedCustomActions,
    toolbarActions: providedToolbarActions,
    onCustomAction,
    onToolbarAction,
    enableRowSelection = true,
    enableBulkActions = true,
    enableColumnVisibility = true,
    enableSorting = true,
    enableFiltering = true,
    enablePagination = true,
    databaseId,
    viewId,
    isFrozen = false,
    className,
    height,
    idField = 'id',
    dataTransformer,
    propertyTransformer,
}: UniversalDataTableProps<T>) {
    
    // Get table configuration based on type
    const tableConfig = useMemo(() => {
        return getTableConfiguration(tableType);
    }, [tableType]);
    
    // Transform data to database records format
    const transformedData = useMemo(() => {
        if (dataTransformer) {
            return dataTransformer(data);
        }
        return transformDataToRecords(data, idField);
    }, [data, dataTransformer, idField]);
    
    // Transform columns to database properties format
    const transformedProperties = useMemo(() => {
        if (providedProperties) {
            return providedProperties;
        }
        
        if (propertyTransformer && columns) {
            return propertyTransformer(columns);
        }
        
        if (columns) {
            return transformColumnsToProperties(columns);
        }
        
        // Use default properties from table configuration
        return tableConfig.defaultProperties || [];
    }, [providedProperties, columns, propertyTransformer, tableConfig]);
    
    // Generate standalone columns
    const standaloneColumns = useMemo(() => {
        return generateStandaloneColumns(
            transformedProperties,
            onRecordEdit ? (record: DatabaseRecord) => onRecordEdit(record as T) : undefined,
            onRecordDelete,
            onRecordUpdate
        );
    }, [transformedProperties, onRecordEdit, onRecordDelete, onRecordUpdate]);
    
    // Convert custom actions to work with DatabaseRecord
    const convertedCustomActions = useMemo(() => {
        if (!providedCustomActions) return [];
        
        return providedCustomActions.map(action => ({
            ...action,
            onClick: (record: DatabaseRecord) => {
                // Convert DatabaseRecord back to original type T
                const originalRecord = {
                    id: record.id,
                    ...record.properties
                } as T;
                action.onClick(originalRecord);
            },
            isVisible: action.isVisible ? (record: DatabaseRecord) => {
                const originalRecord = {
                    id: record.id,
                    ...record.properties
                } as T;
                return action.isVisible!(originalRecord);
            } : undefined,
            isDisabled: action.isDisabled ? (record: DatabaseRecord) => {
                const originalRecord = {
                    id: record.id,
                    ...record.properties
                } as T;
                return action.isDisabled!(originalRecord);
            } : undefined,
        })) as ActionConfig<DatabaseRecord>[];
    }, [providedCustomActions]);

    // Convert toolbar actions to work with DatabaseRecord
    const convertedToolbarActions = useMemo(() => {
        if (!providedToolbarActions) return [];
        
        return providedToolbarActions.map(action => ({
            ...action,
            onClick: (records: DatabaseRecord[]) => {
                // Convert DatabaseRecords back to original type T
                const originalRecords = records.map(record => ({
                    id: record.id,
                    ...record.properties
                }) as T);
                action.onClick(originalRecords);
            },
            isVisible: action.isVisible ? (records: DatabaseRecord[]) => {
                const originalRecords = records.map(record => ({
                    id: record.id,
                    ...record.properties
                }) as T);
                return action.isVisible!(originalRecords);
            } : undefined,
            isDisabled: action.isDisabled ? (records: DatabaseRecord[]) => {
                const originalRecords = records.map(record => ({
                    id: record.id,
                    ...record.properties
                }) as T);
                return action.isDisabled!(originalRecords);
            } : undefined,
        })) as ToolbarActionConfig<DatabaseRecord>[];
    }, [providedToolbarActions]);
    
    // Merge custom actions with table configuration actions
    const mergedCustomActions = useMemo(() => {
        const configActions = tableConfig.customActions || [];
        return [...configActions, ...convertedCustomActions];
    }, [tableConfig.customActions, convertedCustomActions]);
    
    // Merge toolbar actions with table configuration actions
    const mergedToolbarActions = useMemo(() => {
        const configActions = tableConfig.toolbarActions || [];
        return [...configActions, ...convertedToolbarActions];
    }, [tableConfig.toolbarActions, convertedToolbarActions]);
    
    // Handle custom action clicks
    const handleCustomAction = (actionId: string, record: DatabaseRecord) => {
        if (onCustomAction) {
            const originalRecord = {
                id: record.id,
                ...record.properties
            } as T;
            onCustomAction(actionId, originalRecord);
        }
    };
    
    // Handle toolbar action clicks
    const handleToolbarAction = (actionId: string, records: DatabaseRecord[]) => {
        if (onToolbarAction) {
            const originalRecords = records.map(record => ({
                id: record.id,
                ...record.properties
            }) as T);
            onToolbarAction(actionId, originalRecords);
        }
    };
    
    return (
        <StandaloneDataTable
            columns={standaloneColumns}
            data={transformedData}
            properties={transformedProperties}
            onRecordSelect={onRecordSelect ? (record: DatabaseRecord) => onRecordSelect(record as T) : undefined}
            onRecordEdit={onRecordEdit ? (record: DatabaseRecord) => onRecordEdit(record as T) : undefined}
            onRecordDelete={onRecordDelete}
            onRecordCreate={onRecordCreate}
            customActions={mergedCustomActions}
            toolbarActions={mergedToolbarActions}
            enableRowSelection={enableRowSelection}
            enableBulkActions={enableBulkActions}
            enableColumnVisibility={enableColumnVisibility}
            enableSorting={enableSorting}
            enableFiltering={enableFiltering}
            enablePagination={enablePagination}
            onCustomAction={handleCustomAction}
            onToolbarAction={handleToolbarAction}
            className={className}
        />
    );
}

// Export types for external use
export type { CustomAction, ToolbarAction, DatabaseRecord, DatabaseProperty };
