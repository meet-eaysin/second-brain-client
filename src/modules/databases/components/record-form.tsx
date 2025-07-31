import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from '@/components/ui/sheet';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, X, Brain, Sparkles, Save } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { DatabaseRecord, DatabaseProperty } from '@/types/database.types';

interface RecordFormProps {
    record?: DatabaseRecord | null;
    properties: DatabaseProperty[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: Record<string, unknown>) => Promise<void>;
    mode?: 'create' | 'edit';
    isLoading?: boolean;
}

// Create dynamic schema based on properties
const createFormSchema = (properties: DatabaseProperty[]) => {
    const schemaFields: Record<string, z.ZodTypeAny> = {};

    properties.forEach((property) => {
        let fieldSchema: z.ZodTypeAny;

        switch (property.type) {
            case 'TEXT':
            case 'PHONE':
                fieldSchema = z.string();
                break;
            case 'URL':
                fieldSchema = z.string().url('Please enter a valid URL');
                break;
            case 'EMAIL':
                fieldSchema = z.string().email('Please enter a valid email address');
                break;
            case 'NUMBER':
                fieldSchema = z.number().or(z.string().transform(val => val === '' ? undefined : Number(val)));
                break;
            case 'CHECKBOX':
                fieldSchema = z.boolean();
                break;
            case 'DATE':
                fieldSchema = z.date().optional().or(z.string().optional());
                break;
            case 'SELECT':
                fieldSchema = z.string();
                break;
            case 'MULTI_SELECT':
                fieldSchema = z.array(z.string());
                break;
            default:
                fieldSchema = z.string();
        }

        if (property.required) {
            if (fieldSchema instanceof z.ZodString) {
                fieldSchema = fieldSchema.min(1, `${property.name} is required`);
            } else if (!(fieldSchema instanceof z.ZodBoolean)) {
                fieldSchema = fieldSchema.refine(val => val !== undefined && val !== null, {
                    message: `${property.name} is required`
                });
            }
        } else {
            fieldSchema = fieldSchema.optional();
        }

        schemaFields[property.id] = fieldSchema;
    });

    return z.object(schemaFields);
};

export function RecordForm({
                               record,
                               properties,
                               open,
                               onOpenChange,
                               onSubmit,
                               mode = 'create',
                               isLoading = false
                           }: RecordFormProps) {
    const [multiSelectValues, setMultiSelectValues] = useState<Record<string, string[]>>({});

    const formSchema = createFormSchema(properties);
    type FormData = z.infer<typeof formSchema>;

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {},
    });

    // Initialize form with record data when editing
    useEffect(() => {
        if (record && mode === 'edit') {
            const formData: Record<string, unknown> = {};
            const multiSelectData: Record<string, string[]> = {};

            properties.forEach((property) => {
                const value = record.properties[property.id];

                if (property.type === 'MULTI_SELECT' && Array.isArray(value)) {
                    multiSelectData[property.id] = value as string[];
                    formData[property.id] = value;
                } else if (property.type === 'DATE' && value) {
                    formData[property.id] = new Date(value as string);
                } else if (property.type === 'CHECKBOX') {
                    formData[property.id] = Boolean(value);
                } else if (property.type === 'NUMBER') {
                    formData[property.id] = value ? Number(value) : undefined;
                } else {
                    formData[property.id] = value;
                }
            });

            setMultiSelectValues(multiSelectData);
            form.reset(formData as FormData);
        } else if (mode === 'create') {
            const defaultValues: Record<string, unknown> = {};
            properties.forEach((property) => {
                if (property.type === 'CHECKBOX') {
                    defaultValues[property.id] = false;
                } else if (property.type === 'MULTI_SELECT') {
                    defaultValues[property.id] = [];
                }
            });
            form.reset(defaultValues as FormData);
            setMultiSelectValues({});
        }
    }, [record, mode, properties, form]);

    const handleSubmit = async (data: FormData) => {
        try {
            const processedData: Record<string, unknown> = {};

            properties.forEach((property) => {
                const value = data[property.id];

                if (property.type === 'DATE' && value instanceof Date) {
                    processedData[property.id] = value.toISOString();
                } else if (property.type === 'NUMBER' && typeof value === 'string') {
                    processedData[property.id] = value === '' ? null : Number(value);
                } else {
                    processedData[property.id] = value;
                }
            });

            await onSubmit(processedData);
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to submit record:', error);
        }
    };

    const handleMultiSelectChange = (propertyId: string, optionId: string) => {
        const currentValues = multiSelectValues[propertyId] || [];
        const newValues = currentValues.includes(optionId)
            ? currentValues.filter(id => id !== optionId)
            : [...currentValues, optionId];

        setMultiSelectValues(prev => ({
            ...prev,
            [propertyId]: newValues
        }));

        form.setValue(propertyId as keyof FormData, newValues as FormData[keyof FormData]);
    };

    const removeMultiSelectValue = (propertyId: string, optionId: string) => {
        const newValues = (multiSelectValues[propertyId] || []).filter(id => id !== optionId);
        setMultiSelectValues(prev => ({
            ...prev,
            [propertyId]: newValues
        }));
        form.setValue(propertyId as keyof FormData, newValues as FormData[keyof FormData]);
    };

    const renderFormField = (property: DatabaseProperty) => {
        const getOptionColor = (optionId: string) => {
            const option = property.selectOptions?.find(opt => opt.id === optionId);
            return option?.color || 'hsl(var(--muted))';
        };

        const getOptionName = (optionId: string) => {
            const option = property.selectOptions?.find(opt => opt.id === optionId);
            return option?.name || optionId;
        };

        switch (property.type) {
            case 'TEXT':
                return (
                    <FormControl>
                        <Textarea
                            placeholder={`Enter ${property.name.toLowerCase()}...`}
                            className="min-h-[100px] resize-none"
                            {...form.register(property.id as keyof FormData)}
                        />
                    </FormControl>
                );

            case 'NUMBER':
                return (
                    <FormControl>
                        <Input
                            type="number"
                            placeholder={`Enter ${property.name.toLowerCase()}...`}
                            className="font-mono"
                            {...form.register(property.id as keyof FormData)}
                        />
                    </FormControl>
                );

            case 'EMAIL':
                return (
                    <FormControl>
                        <Input
                            type="email"
                            placeholder={`Enter ${property.name.toLowerCase()}...`}
                            {...form.register(property.id as keyof FormData)}
                        />
                    </FormControl>
                );

            case 'URL':
                return (
                    <FormControl>
                        <Input
                            type="url"
                            placeholder={`https://example.com`}
                            {...form.register(property.id as keyof FormData)}
                        />
                    </FormControl>
                );

            case 'PHONE':
                return (
                    <FormControl>
                        <Input
                            type="tel"
                            placeholder={`+1 (555) 123-4567`}
                            {...form.register(property.id as keyof FormData)}
                        />
                    </FormControl>
                );

            case 'CHECKBOX':
                return (
                    <FormControl>
                        <div className="flex items-center space-x-3 p-3 rounded-lg border bg-muted/30">
                            <Checkbox
                                checked={form.watch(property.id as keyof FormData) as boolean}
                                onCheckedChange={(checked) =>
                                    form.setValue(property.id as keyof FormData, checked as FormData[keyof FormData])
                                }
                                className="border-2"
                            />
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {property.name}
                            </label>
                        </div>
                    </FormControl>
                );

            case 'DATE':
                return (
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full pl-3 text-left font-normal hover:bg-muted/50",
                                        !form.watch(property.id as keyof FormData) && "text-muted-foreground"
                                    )}
                                >
                                    {form.watch(property.id as keyof FormData) ? (
                                        format(form.watch(property.id as keyof FormData) as Date, "PPP")
                                    ) : (
                                        <span>Select a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={form.watch(property.id as keyof FormData) as Date}
                                onSelect={(date: Date | undefined) =>
                                    form.setValue(property.id as keyof FormData, date as FormData[keyof FormData])
                                }
                                disabled={(date: Date) =>
                                    date > new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                );

            case 'SELECT':
                return (
                    <Select
                        value={form.watch(property.id as keyof FormData) as string}
                        onValueChange={(value) =>
                            form.setValue(property.id as keyof FormData, value as FormData[keyof FormData])
                        }
                    >
                        <FormControl>
                            <SelectTrigger className="hover:bg-muted/50">
                                <SelectValue placeholder={`Choose ${property.name.toLowerCase()}...`} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {property.selectOptions?.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full border"
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
                    <div className="space-y-3">
                        <Select
                            onValueChange={(value) => handleMultiSelectChange(property.id, value)}
                        >
                            <FormControl>
                                <SelectTrigger className="hover:bg-muted/50">
                                    <SelectValue placeholder={`Add ${property.name.toLowerCase()}...`} />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {property.selectOptions?.map((option) => (
                                    <SelectItem
                                        key={option.id}
                                        value={option.id}
                                        disabled={(multiSelectValues[property.id] || []).includes(option.id)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full border"
                                                style={{ backgroundColor: option.color }}
                                            />
                                            {option.name}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {multiSelectValues[property.id] && multiSelectValues[property.id].length > 0 && (
                            <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-muted/30 border">
                                {multiSelectValues[property.id].map((optionId) => (
                                    <Badge
                                        key={optionId}
                                        variant="secondary"
                                        className="flex items-center gap-1.5 px-2.5 py-1 hover:bg-muted"
                                        style={{
                                            backgroundColor: getOptionColor(optionId),
                                            color: 'var(--foreground)'
                                        }}
                                    >
                                        {getOptionName(optionId)}
                                        <X
                                            className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors"
                                            onClick={() => removeMultiSelectValue(property.id, optionId)}
                                        />
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                );

            default:
                return (
                    <FormControl>
                        <Input
                            placeholder={`Enter ${property.name.toLowerCase()}...`}
                            {...form.register(property.id as keyof FormData)}
                        />
                    </FormControl>
                );
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="overflow-y-auto w-[400px] sm:w-[600px] bg-gradient-to-b from-background to-muted/30">
                <SheetHeader className="space-y-4 pb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600">
                            <Brain className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <SheetTitle className="text-xl">
                                {mode === 'create' ? 'Capture New Knowledge' : 'Update Knowledge'}
                            </SheetTitle>
                            <SheetDescription className="text-muted-foreground">
                                {mode === 'create'
                                    ? 'Add a new record to expand your second brain.'
                                    : 'Refine and update your stored knowledge.'
                                }
                            </SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 pb-6">
                        {properties
                            .filter(prop => prop.isVisible)
                            .sort((a, b) => a.order - b.order)
                            .map((property) => (
                                <FormField
                                    key={property.id}
                                    control={form.control}
                                    name={property.id as keyof FormData}
                                    render={() => (
                                        <FormItem className="space-y-3">
                                            <FormLabel className="flex items-center justify-between">
                                                <span className="flex items-center gap-2 font-medium">
                                                    {property.name}
                                                    {property.required && (
                                                        <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                                                            Required
                                                        </Badge>
                                                    )}
                                                </span>
                                                <span className="text-xs text-muted-foreground capitalize">
                                                    {property.type.toLowerCase().replace('_', ' ')}
                                                </span>
                                            </FormLabel>
                                            {renderFormField(property)}
                                            {property.description && (
                                                <FormDescription className="text-sm text-muted-foreground">
                                                    {property.description}
                                                </FormDescription>
                                            )}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}

                        <SheetFooter className="flex gap-3 pt-6 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isLoading}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                            >
                                {isLoading ? (
                                    <>
                                        <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        {mode === 'create' ? 'Capture Knowledge' : 'Update Knowledge'}
                                    </>
                                )}
                            </Button>
                        </SheetFooter>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    );
}
