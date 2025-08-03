import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Check, X, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { useDatabaseManagement } from './database-context';
import type { DatabaseProperty, DatabaseRecord } from '@/types/database.types';
import { toast } from 'sonner';

interface InlineEditCellProps {
    record: DatabaseRecord;
    property: DatabaseProperty;
    value: unknown;
    onSave: (newValue: unknown) => void;
    onCancel?: () => void;
    className?: string;
}

export function InlineEditCell({ 
    record, 
    property, 
    value, 
    onSave, 
    onCancel,
    className 
}: InlineEditCellProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value);
    const [tempMultiSelect, setTempMultiSelect] = useState<string[]>(
        Array.isArray(value) ? value : value ? [String(value)] : []
    );
    const inputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isEditing) {
            // Focus the input when editing starts
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                    inputRef.current.select();
                } else if (textareaRef.current) {
                    textareaRef.current.focus();
                    textareaRef.current.select();
                }
            }, 0);
        }
    }, [isEditing]);

    const handleSave = () => {
        let finalValue = editValue;
        
        // Handle multi-select
        if (property.type === 'MULTI_SELECT') {
            finalValue = tempMultiSelect;
        }
        
        // Validate required fields
        if (property.required && (!finalValue || finalValue === '')) {
            toast.error(`${property.name} is required`);
            return;
        }
        
        onSave(finalValue);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditValue(value);
        setTempMultiSelect(Array.isArray(value) ? value : value ? [String(value)] : []);
        setIsEditing(false);
        if (onCancel) {
            onCancel();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSave();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            handleCancel();
        }
    };

    const handleDoubleClick = () => {
        if (!isEditing) {
            setIsEditing(true);
        }
    };

    const toggleMultiSelectOption = (optionId: string) => {
        setTempMultiSelect(prev =>
            prev.includes(optionId)
                ? prev.filter(id => id !== optionId)
                : [...prev, optionId]
        );
    };

    // Render display value
    const renderDisplayValue = () => {
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

            case 'EMAIL':
                return (
                    <a 
                        href={`mailto:${value}`} 
                        className="text-blue-600 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {String(value)}
                    </a>
                );

            case 'URL':
                return (
                    <a 
                        href={String(value)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline max-w-[150px] truncate"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {String(value)}
                    </a>
                );

            case 'PHONE':
                return (
                    <a 
                        href={`tel:${value}`} 
                        className="text-blue-600 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {String(value)}
                    </a>
                );

            case 'CHECKBOX':
                return (
                    <Checkbox
                        checked={Boolean(value)}
                        onCheckedChange={(checked) => onSave(checked)}
                        onClick={(e) => e.stopPropagation()}
                    />
                );

            case 'DATE':
                const date = new Date(String(value));
                return isNaN(date.getTime()) ? (
                    <span className="text-muted-foreground">Invalid date</span>
                ) : (
                    <span className="text-sm">
                        {date.toLocaleDateString()}
                    </span>
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

            default:
                return (
                    <div className="max-w-[200px] truncate" title={String(value)}>
                        {String(value)}
                    </div>
                );
        }
    };

    // Render edit input
    const renderEditInput = () => {
        switch (property.type) {
            case 'TEXT':
            case 'TITLE':
            case 'EMAIL':
            case 'URL':
            case 'PHONE':
                return (
                    <div className="flex items-center gap-1">
                        <Input
                            ref={inputRef}
                            value={String(editValue || '')}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onBlur={handleSave}
                            className="h-8 text-sm"
                            type={property.type === 'EMAIL' ? 'email' : property.type === 'URL' ? 'url' : 'text'}
                        />
                    </div>
                );

            case 'NUMBER':
                return (
                    <div className="flex items-center gap-1">
                        <Input
                            ref={inputRef}
                            type="number"
                            value={String(editValue || '')}
                            onChange={(e) => setEditValue(e.target.value ? Number(e.target.value) : '')}
                            onKeyDown={handleKeyDown}
                            onBlur={handleSave}
                            className="h-8 text-sm text-right"
                        />
                    </div>
                );

            case 'DATE':
                return (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="h-8 text-sm justify-start text-left font-normal"
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {editValue ? format(new Date(String(editValue)), 'PPP') : 'Pick a date'}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={editValue ? new Date(String(editValue)) : undefined}
                                onSelect={(date) => {
                                    setEditValue(date?.toISOString());
                                    handleSave();
                                }}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                );

            case 'SELECT':
                return (
                    <Select
                        value={String(editValue || '')}
                        onValueChange={(value) => {
                            setEditValue(value);
                            handleSave();
                        }}
                    >
                        <SelectTrigger className="h-8 text-sm">
                            <SelectValue placeholder="Select option..." />
                        </SelectTrigger>
                        <SelectContent>
                            {property.selectOptions?.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                    <div className="flex items-center gap-2">
                                        <div 
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: option.color }}
                                        />
                                        {option.name}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );

            case 'MULTI_SELECT':
                return (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="h-8 text-sm justify-start"
                            >
                                {tempMultiSelect.length > 0 
                                    ? `${tempMultiSelect.length} selected`
                                    : 'Select options...'
                                }
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-3">
                            <div className="space-y-2">
                                {property.selectOptions?.map((option) => (
                                    <div key={option.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`multi-${option.id}`}
                                            checked={tempMultiSelect.includes(option.id)}
                                            onCheckedChange={() => toggleMultiSelectOption(option.id)}
                                        />
                                        <label
                                            htmlFor={`multi-${option.id}`}
                                            className="flex items-center gap-2 cursor-pointer flex-1"
                                        >
                                            <div 
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: option.color }}
                                            />
                                            <span className="text-sm">{option.name}</span>
                                        </label>
                                    </div>
                                ))}
                                <div className="flex justify-end gap-2 pt-2 border-t">
                                    <Button size="sm" variant="outline" onClick={handleCancel}>
                                        Cancel
                                    </Button>
                                    <Button size="sm" onClick={handleSave}>
                                        Save
                                    </Button>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                );

            default:
                return (
                    <div className="flex items-center gap-1">
                        <Input
                            ref={inputRef}
                            value={String(editValue || '')}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onBlur={handleSave}
                            className="h-8 text-sm"
                        />
                    </div>
                );
        }
    };

    // Don't allow editing for certain types or if frozen
    const canEdit = !['CHECKBOX', 'FORMULA', 'CREATED_TIME', 'LAST_EDITED_TIME'].includes(property.type);

    if (!canEdit) {
        return (
            <div className={className}>
                {renderDisplayValue()}
            </div>
        );
    }

    return (
        <div 
            className={`${className} ${canEdit ? 'cursor-pointer hover:bg-muted/50 rounded px-1' : ''}`}
            onDoubleClick={handleDoubleClick}
            title={canEdit ? 'Double-click to edit' : undefined}
        >
            {isEditing ? renderEditInput() : renderDisplayValue()}
        </div>
    );
}

interface EditableTableCellProps {
    record: DatabaseRecord;
    property: DatabaseProperty;
    onUpdate: (recordId: string, propertyId: string, newValue: unknown) => void;
}

export function EditableTableCell({ record, property, onUpdate }: EditableTableCellProps) {
    const value = record.properties[property.id];

    const handleSave = (newValue: unknown) => {
        onUpdate(record.id, property.id, newValue);
        toast.success(`${property.name} updated`);
    };

    return (
        <InlineEditCell
            record={record}
            property={property}
            value={value}
            onSave={handleSave}
            className="min-h-[32px] flex items-center"
        />
    );
}

// Hook for managing inline editing state
export function useInlineEditing() {
    const [editingCell, setEditingCell] = useState<{ recordId: string; propertyId: string } | null>(null);

    const startEditing = (recordId: string, propertyId: string) => {
        setEditingCell({ recordId, propertyId });
    };

    const stopEditing = () => {
        setEditingCell(null);
    };

    const isEditing = (recordId: string, propertyId: string) => {
        return editingCell?.recordId === recordId && editingCell?.propertyId === propertyId;
    };

    return {
        editingCell,
        startEditing,
        stopEditing,
        isEditing,
    };
}
