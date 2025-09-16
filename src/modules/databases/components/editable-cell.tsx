import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import type { DatabaseProperty, DatabaseRecord } from '@/types/document.types.ts';
import {
    normalizeSelectValue,
    getSelectOptionDisplay,
    getSelectOptionId,
    getSelectOptionColor
} from '@/modules/document-view/utils/select-option-utils';

interface EditableCellProps {
    property: DatabaseProperty;
    value: any;
    record: DatabaseRecord;
    onSave: (recordId: string, propertyId: string, newValue: any) => void;
    onCancel: () => void;
    isFrozen?: boolean;
}

export function EditableCell({
    property,
    value,
    record,
    onSave,
    onCancel,
    isFrozen = false
}: EditableCellProps) {
    const [editValue, setEditValue] = useState(value);
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleSave = () => {
        onSave(record.id, property.id, editValue);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditValue(value);
        setIsEditing(false);
        onCancel();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    // If frozen, just render the value without editing capability
    if (isFrozen) {
        return renderDisplayValue();
    }

    // If editing, render the appropriate input
    if (isEditing) {
        return renderEditInput();
    }

    // Default display with click to edit
    return (
        <div
            className={`p-1 rounded min-h-[32px] flex items-center ${
                isFrozen ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-muted/50'
            }`}
            onClick={() => {
                if (isFrozen) {
                    toast.error('Database is frozen and cannot be edited');
                    return;
                }
                setIsEditing(true);
            }}
        >
            {renderDisplayValue()}
        </div>
    );

    function renderDisplayValue() {
        if (!value && value !== false && value !== 0) {
            return <span className="text-muted-foreground">-</span>;
        }

        switch (property.type) {
            case 'TEXT':
            case 'EMAIL':
            case 'PHONE':
            case 'URL':
            case 'NUMBER':
                return <span>{value}</span>;

            case 'CHECKBOX':
                return <Checkbox checked={Boolean(value)} disabled />;

            case 'DATE':
                return <span>{value ? format(new Date(value), 'MMM dd, yyyy') : '-'}</span>;

            case 'SELECT': {
                const normalizedValue = normalizeSelectValue(value, false);
                if (typeof normalizedValue === 'object' && normalizedValue !== null) {
                    return (
                        <Badge
                            className="text-white border-0"
                            style={{ backgroundColor: getSelectOptionColor(normalizedValue) }}
                        >
                            {getSelectOptionDisplay(normalizedValue)}
                        </Badge>
                    );
                }
                return <Badge>{getSelectOptionDisplay(normalizedValue, String(value))}</Badge>;
            }

            case 'MULTI_SELECT': {
                if (!Array.isArray(value)) return <span className="text-muted-foreground">-</span>;
                const normalizedValues = normalizeSelectValue(value, true);
                return (
                    <div className="flex flex-wrap gap-1">
                        {normalizedValues.map((option: any, index: number) => {
                            const optionId = getSelectOptionId(option) || index;
                            return (
                                <Badge
                                    key={optionId}
                                    className="text-white border-0"
                                    style={{ backgroundColor: getSelectOptionColor(option) }}
                                >
                                    {getSelectOptionDisplay(option, String(option))}
                                </Badge>
                            );
                        })}
                    </div>
                );
            }

            default:
                return <span>{value}</span>;
        }
    }

    function renderEditInput() {
        switch (property.type) {
            case 'TEXT':
            case 'EMAIL':
            case 'PHONE':
            case 'URL':
                return (
                    <div className="flex items-center gap-1">
                        <Input
                            ref={inputRef}
                            value={editValue || ''}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="h-8"
                        />
                        <Button size="sm" variant="ghost" onClick={handleSave}>
                            <Check className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={handleCancel}>
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                );

            case 'NUMBER':
                return (
                    <div className="flex items-center gap-1">
                        <Input
                            ref={inputRef}
                            type="number"
                            value={editValue || ''}
                            onChange={(e) => setEditValue(Number(e.target.value))}
                            onKeyDown={handleKeyDown}
                            className="h-8"
                        />
                        <Button size="sm" variant="ghost" onClick={handleSave}>
                            <Check className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={handleCancel}>
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                );

            case 'CHECKBOX':
                return (
                    <div className="flex items-center gap-1">
                        <Checkbox
                            checked={Boolean(editValue)}
                            onCheckedChange={(checked) => {
                                setEditValue(Boolean(checked));
                                // Auto-save for checkbox
                                setTimeout(() => {
                                    onSave(record.id, property.id, Boolean(checked));
                                    setIsEditing(false);
                                }, 100);
                            }}
                        />
                    </div>
                );

            case 'DATE':
                return (
                    <div className="flex items-center gap-1">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="h-8 text-left font-normal">
                                    <CalendarIcon className="mr-2 h-3 w-3" />
                                    {editValue ? format(new Date(editValue), 'MMM dd, yyyy') : 'Pick a date'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={editValue ? new Date(editValue) : undefined}
                                    onSelect={(date) => {
                                        setEditValue(date?.toISOString());
                                        if (date) {
                                            setTimeout(() => {
                                                onSave(record.id, property.id, date.toISOString());
                                                setIsEditing(false);
                                            }, 100);
                                        }
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <Button size="sm" variant="ghost" onClick={handleCancel}>
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                );

            case 'SELECT':
                return (
                    <div className="flex items-center gap-1">
                        <Select
                            value={getSelectOptionId(editValue) || ''}
                            onValueChange={(newValue) => {
                                const selectedOption = property.selectOptions?.find(opt => opt.id === newValue);
                                if (selectedOption) {
                                    const normalizedOption = normalizeSelectValue(selectedOption, false);
                                    setEditValue(normalizedOption);
                                    setTimeout(() => {
                                        onSave(record.id, property.id, normalizedOption);
                                        setIsEditing(false);
                                    }, 100);
                                }
                            }}
                        >
                            <SelectTrigger className="h-8">
                                <SelectValue placeholder="Select option" />
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
                        <Button size="sm" variant="ghost" onClick={handleCancel}>
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                );

            default:
                return (
                    <div className="flex items-center gap-1">
                        <Input
                            ref={inputRef}
                            value={editValue || ''}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="h-8"
                        />
                        <Button size="sm" variant="ghost" onClick={handleSave}>
                            <Check className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={handleCancel}>
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                );
        }
    }
}
