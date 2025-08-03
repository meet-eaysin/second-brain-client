import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { CalendarDays, User, Mail, Phone, Globe, Star, StarOff } from 'lucide-react';
import type { DatabaseRecord, DatabaseProperty } from '@/types/database.types';

/**
 * Generate standalone columns that don't require DatabaseProvider context
 */
export function generateStandaloneColumns(
    properties: DatabaseProperty[],
    onRecordEdit?: (record: DatabaseRecord) => void,
    onRecordDelete?: (recordId: string) => void,
    onRecordUpdate?: (recordId: string, propertyId: string, newValue: unknown) => void
): ColumnDef<DatabaseRecord>[] {
    return properties
        .filter(property => property.isVisible !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((property) => {
            const column: ColumnDef<DatabaseRecord> = {
                id: property.id,
                accessorKey: `properties.${property.id}`,
                header: property.name,
                size: property.width || getDefaultColumnWidth(property.type),
                cell: ({ row, getValue }) => {
                    const value = getValue();
                    return renderCellValue(property, value, row.original, onRecordUpdate);
                },
                enableSorting: true,
                enableHiding: true,
            };

            return column;
        });
}

/**
 * Render cell value based on property type
 */
function renderCellValue(
    property: DatabaseProperty,
    value: unknown,
    record: DatabaseRecord,
    onRecordUpdate?: (recordId: string, propertyId: string, newValue: unknown) => void
): React.ReactNode {
    if (value === null || value === undefined || value === '') {
        return <span className="text-muted-foreground">—</span>;
    }

    switch (property.type) {
        case 'TEXT':
        case 'TITLE':
            return (
                <div className="max-w-[200px] truncate" title={String(value)}>
                    {String(value)}
                </div>
            );

        case 'NUMBER':
            return (
                <div className="text-right font-mono">
                    {typeof value === 'number' ? value.toLocaleString() : String(value)}
                </div>
            );

        case 'SELECT':
            const selectOption = property.selectOptions?.find(opt => opt.id === value);
            return selectOption ? (
                <Badge 
                    variant="secondary" 
                    style={{ backgroundColor: selectOption.color + '20', color: selectOption.color }}
                >
                    {selectOption.name}
                </Badge>
            ) : (
                <span className="text-muted-foreground">{String(value)}</span>
            );

        case 'MULTI_SELECT':
            const values = Array.isArray(value) ? value : [value];
            return (
                <div className="flex flex-wrap gap-1">
                    {values.slice(0, 3).map((val, index) => {
                        const option = property.selectOptions?.find(opt => opt.id === val);
                        return option ? (
                            <Badge 
                                key={index}
                                variant="outline" 
                                style={{ borderColor: option.color, color: option.color }}
                                className="text-xs"
                            >
                                {option.name}
                            </Badge>
                        ) : (
                            <Badge key={index} variant="outline" className="text-xs">
                                {String(val)}
                            </Badge>
                        );
                    })}
                    {values.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                            +{values.length - 3}
                        </Badge>
                    )}
                </div>
            );

        case 'CHECKBOX':
            return (
                <Checkbox
                    checked={Boolean(value)}
                    onCheckedChange={(checked) => {
                        if (onRecordUpdate) {
                            onRecordUpdate(record.id, property.id, checked);
                        }
                    }}
                />
            );

        case 'DATE':
        case 'CREATED_TIME':
        case 'LAST_EDITED_TIME':
            const date = new Date(String(value));
            return isNaN(date.getTime()) ? (
                <span className="text-muted-foreground">Invalid date</span>
            ) : (
                <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                        {date.toLocaleDateString()}
                    </span>
                </div>
            );

        case 'EMAIL':
            return (
                <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a 
                        href={`mailto:${value}`} 
                        className="text-blue-600 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {String(value)}
                    </a>
                </div>
            );

        case 'PHONE':
            return (
                <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a 
                        href={`tel:${value}`} 
                        className="text-blue-600 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {String(value)}
                    </a>
                </div>
            );

        case 'URL':
            return (
                <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a 
                        href={String(value)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline max-w-[150px] truncate"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {String(value)}
                    </a>
                </div>
            );

        case 'PERSON':
            return (
                <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                        <AvatarImage src="" />
                        <AvatarFallback className="text-xs">
                            <User className="h-3 w-3" />
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{String(value)}</span>
                </div>
            );

        case 'FILES':
            const files = Array.isArray(value) ? value : [value];
            return (
                <div className="text-sm text-muted-foreground">
                    {files.length} file{files.length !== 1 ? 's' : ''}
                </div>
            );

        case 'FORMULA':
        case 'ROLLUP':
            return (
                <div className="font-mono text-sm bg-muted px-2 py-1 rounded">
                    {String(value)}
                </div>
            );

        case 'RELATION':
            const relations = Array.isArray(value) ? value : [value];
            return (
                <div className="text-sm text-muted-foreground">
                    {relations.length} relation{relations.length !== 1 ? 's' : ''}
                </div>
            );

        case 'CREATED_BY':
        case 'LAST_EDITED_BY':
            return (
                <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                        <AvatarImage src="" />
                        <AvatarFallback className="text-xs">
                            {String(value).charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{String(value)}</span>
                </div>
            );

        default:
            return (
                <div className="max-w-[200px] truncate" title={String(value)}>
                    {String(value)}
                </div>
            );
    }
}

/**
 * Get default column width based on property type
 */
function getDefaultColumnWidth(type: string): number {
    switch (type) {
        case 'CHECKBOX':
            return 60;
        case 'NUMBER':
            return 100;
        case 'DATE':
        case 'CREATED_TIME':
        case 'LAST_EDITED_TIME':
            return 140;
        case 'EMAIL':
            return 200;
        case 'PHONE':
            return 140;
        case 'URL':
            return 180;
        case 'SELECT':
            return 120;
        case 'MULTI_SELECT':
            return 160;
        case 'PERSON':
        case 'CREATED_BY':
        case 'LAST_EDITED_BY':
            return 140;
        case 'FILES':
        case 'RELATION':
            return 100;
        case 'FORMULA':
        case 'ROLLUP':
            return 120;
        case 'TEXT':
        case 'TITLE':
        default:
            return 150;
    }
}

/**
 * Create editable cell component
 */
function EditableCell({
    property,
    value,
    record,
    onUpdate,
}: {
    property: DatabaseProperty;
    value: unknown;
    record: DatabaseRecord;
    onUpdate?: (recordId: string, propertyId: string, newValue: unknown) => void;
}) {
    const [isEditing, setIsEditing] = React.useState(false);
    const [editValue, setEditValue] = React.useState(String(value || ''));

    const handleSave = () => {
        if (onUpdate) {
            onUpdate(record.id, property.id, editValue);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditValue(String(value || ''));
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleSave();
                    } else if (e.key === 'Escape') {
                        handleCancel();
                    }
                }}
                autoFocus
                className="h-8"
            />
        );
    }

    return (
        <div
            className="cursor-pointer hover:bg-muted/50 p-1 rounded"
            onClick={() => setIsEditing(true)}
        >
            {renderCellValue(property, value, record, onUpdate)}
        </div>
    );
}
