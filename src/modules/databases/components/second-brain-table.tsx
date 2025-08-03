import React from 'react';
import { UniversalDataTable } from '@/components/universal-data-table';
import { Badge } from '@/components/ui/badge';
import type { ColumnDef } from '@tanstack/react-table';
import type { DatabaseRecord, DatabaseProperty } from '@/types/database.types';
import type { ActionConfig, ToolbarActionConfig } from '@/components/universal-data-table/action-system';
import { getSecondBrainConfig } from '../utils/second-brain-configs';

interface SecondBrainTableProps {
    type: 'tasks' | 'projects' | 'goals' | 'notes' | 'people' | 'habits' | 'journal' | 'books' | 'content' | 'finances' | 'mood';
    data: DatabaseRecord[];
    columns: ColumnDef<DatabaseRecord>[];
    properties?: DatabaseProperty[];
    onRecordEdit?: (record: DatabaseRecord) => void;
    onRecordDelete?: (recordId: string) => void;
    onRecordCreate?: () => void;
    onRecordSelect?: (record: DatabaseRecord) => void;
    databaseId?: string;
    showPropertyVisibility?: boolean;
    enableRowSelection?: boolean;
    enableBulkActions?: boolean;
    customActions?: ActionConfig[];
    toolbarActions?: ToolbarActionConfig[];
    // Custom action handlers
    onCustomAction?: (actionId: string, record: DatabaseRecord) => void;
    onToolbarAction?: (actionId: string, records: DatabaseRecord[]) => void;
}

export function SecondBrainTable({
    type,
    data,
    columns,
    properties,
    onRecordEdit,
    onRecordDelete,
    onRecordCreate,
    onRecordSelect,
    enableRowSelection = true,
    enableBulkActions = true,
    customActions: customActionsProp,
    toolbarActions: toolbarActionsProp,
    onCustomAction,
    onToolbarAction,
}: SecondBrainTableProps) {

    // Get the configuration for this Second Brain type
    const config = getSecondBrainConfig(type);

    // Use provided properties or generate defaults
    const tableProperties = properties || config.defaultProperties;

    // Enhance custom actions with handlers
    const customActions: ActionConfig[] = (customActionsProp || config.customActions).map(action => ({
        ...action,
        onClick: (record: DatabaseRecord) => {
            if (onCustomAction) {
                onCustomAction(action.id, record);
            } else {
                // Default handlers based on action type
                switch (action.id) {
                    case 'edit':
                        onRecordEdit?.(record);
                        break;
                    case 'delete':
                        onRecordDelete?.(record.id);
                        break;
                    case 'complete':
                        console.log('Complete task:', record);
                        break;
                    case 'call':
                        if (record.properties.phone) {
                            window.open(`tel:${record.properties.phone}`);
                        }
                        break;
                    case 'email':
                        if (record.properties.email) {
                            window.open(`mailto:${record.properties.email}`);
                        }
                        break;
                    case 'schedule':
                        console.log('Schedule meeting with:', record);
                        break;
                    default:
                        if (action.onClick) {
                            action.onClick(record);
                        }
                }
            }
        }
    }));

    // Enhance toolbar actions with handlers
    const toolbarActions: ToolbarActionConfig[] = (toolbarActionsProp || config.toolbarActions).map(action => ({
        ...action,
        onClick: (records: DatabaseRecord[]) => {
            if (onToolbarAction) {
                onToolbarAction(action.id, records);
            } else {
                // Default handlers based on action type
                switch (action.id) {
                    case 'bulk-delete':
                        records.forEach(record => onRecordDelete?.(record.id));
                        break;
                    case 'bulk-complete':
                        console.log('Bulk complete tasks:', records);
                        break;
                    case 'bulk-assign':
                        console.log('Bulk assign tasks:', records);
                        break;
                    case 'bulk-email': {
                        const emails = records
                            .map(r => r.properties.email)
                            .filter(Boolean)
                            .join(',');
                        if (emails) {
                            window.open(`mailto:${emails}`);
                        }
                        break;
                    }
                    case 'export-contacts':
                        console.log('Export contacts:', records);
                        break;
                    default:
                        if (action.onClick) {
                            action.onClick(records);
                        }
                }
            }
        }
    }));

    return (
        <UniversalDataTable<DatabaseRecord>
            data={data}
            columns={columns}
            tableType={type}
            context="second-brain"
            properties={tableProperties}
            customActions={customActions}
            toolbarActions={toolbarActions}
            onRecordSelect={onRecordSelect}
            onRecordEdit={onRecordEdit}
            onRecordDelete={onRecordDelete}
            onRecordCreate={onRecordCreate}
            onCustomAction={onCustomAction}
            onToolbarAction={onToolbarAction}
            enableRowSelection={enableRowSelection}
            enableBulkActions={enableBulkActions}
            enableColumnVisibility={true}
            enableSorting={true}
            enableFiltering={true}
            enablePagination={true}
        />
    );
}

// Helper function to create default columns for Second Brain types
export function createSecondBrainColumns(type: string, properties: DatabaseProperty[]): ColumnDef<DatabaseRecord>[] {
    return properties.map((property) => ({
        id: property.id,
        accessorKey: `properties.${property.id}`,
        header: property.name,
        cell: ({ getValue }) => {
            const value = getValue();
            
            // Handle different property types
            switch (property.type) {
                case 'SELECT':
                    if (property.selectOptions && value) {
                        const option = property.selectOptions.find(opt => opt.id === value || opt.name === value);
                        return option ? (
                            <Badge variant="outline" style={{ backgroundColor: `${option.color}20`, color: option.color }}>
                                {option.name}
                            </Badge>
                        ) : String(value);
                    }
                    return String(value || '');
                    
                case 'MULTI_SELECT':
                    if (Array.isArray(value)) {
                        return (
                            <div className="flex flex-wrap gap-1">
                                {value.slice(0, 3).map((item, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                        {String(item)}
                                    </Badge>
                                ))}
                                {value.length > 3 && (
                                    <span className="text-xs text-muted-foreground">
                                        +{value.length - 3} more
                                    </span>
                                )}
                            </div>
                        );
                    }
                    return String(value || '');
                    
                case 'DATE':
                    return value ? new Date(String(value)).toLocaleDateString() : '';
                    
                case 'CHECKBOX':
                    return value ? '✓' : '';
                    
                case 'URL':
                    return value ? (
                        <a 
                            href={String(value)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {String(value)}
                        </a>
                    ) : '';
                    
                case 'EMAIL':
                    return value ? (
                        <a 
                            href={`mailto:${value}`}
                            className="text-blue-600 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {String(value)}
                        </a>
                    ) : '';
                    
                case 'PHONE':
                    return value ? (
                        <a 
                            href={`tel:${value}`}
                            className="text-blue-600 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {String(value)}
                        </a>
                    ) : '';
                    
                default:
                    return String(value || '');
            }
        },
        enableSorting: true,
        enableHiding: true,
    }));
}
