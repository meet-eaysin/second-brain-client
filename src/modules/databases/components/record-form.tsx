import { useEffect } from 'react';
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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Save, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { DatabaseProperty, DatabaseRecord } from '@/types/database.types';

// Define proper types for form data
type PropertyValue = string | number | boolean | Date | string[] | null | undefined;
type RecordFormData = Record<string, PropertyValue>;

interface RecordFormProps {
    record?: DatabaseRecord | null;
    properties: DatabaseProperty[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: RecordFormData) => Promise<void>;
    mode?: 'create' | 'edit';
    isLoading?: boolean;
}

export function RecordForm({
    record,
    properties,
    open,
    onOpenChange,
    onSubmit,
    mode = 'create',
    isLoading = false
}: RecordFormProps) {
    // Create dynamic schema based on properties
    const createSchema = () => {
        const schemaFields: Record<string, z.ZodTypeAny> = {};

        properties.forEach(property => {
            switch (property.type) {
                case 'TEXT':
                case 'EMAIL':
                case 'URL':
                case 'PHONE':
                    schemaFields[property.id] = property.required
                        ? z.string().min(1, `${property.name} is required`)
                        : z.string().optional();
                    break;
                case 'NUMBER':
                    schemaFields[property.id] = property.required
                        ? z.number({ required_error: `${property.name} is required` })
                        : z.number().optional();
                    break;
                case 'CHECKBOX':
                    schemaFields[property.id] = z.boolean().default(false);
                    break;
                case 'DATE':
                    schemaFields[property.id] = property.required
                        ? z.date({ required_error: `${property.name} is required` })
                        : z.date().optional();
                    break;
                case 'SELECT':
                    schemaFields[property.id] = property.required
                        ? z.string().min(1, `${property.name} is required`)
                        : z.string().optional();
                    break;
                case 'MULTI_SELECT':
                    schemaFields[property.id] = z.array(z.string()).default([]);
                    break;
                default:
                    schemaFields[property.id] = z.string().optional();
            }
        });

        return z.object(schemaFields);
    };

    const form = useForm({
        resolver: zodResolver(createSchema()),
        defaultValues: {}
    });

    // Initialize form with record data when editing
    useEffect(() => {
        if (record && mode === 'edit') {
            const formData: RecordFormData = {};
            properties.forEach(property => {
                const value = record.properties[property.id];
                if (value !== undefined) {
                    if (property.type === 'DATE' && typeof value === 'string') {
                        formData[property.id] = new Date(value);
                    } else {
                        formData[property.id] = value;
                    }
                }
            });
            form.reset(formData);
        } else if (mode === 'create') {
            const defaultData: RecordFormData = {};
            properties.forEach(property => {
                switch (property.type) {
                    case 'CHECKBOX':
                        defaultData[property.id] = false;
                        break;
                    case 'MULTI_SELECT':
                        defaultData[property.id] = [];
                        break;
                    default:
                        defaultData[property.id] = '';
                }
            });
            form.reset(defaultData);
        }
    }, [record, mode, properties, form]);

    const handleSubmit = async (data: RecordFormData) => {
        try {
            // Convert dates to ISO strings
            const processedData: RecordFormData = {};
            properties.forEach(property => {
                const value = data[property.id];
                if (property.type === 'DATE' && value instanceof Date) {
                    processedData[property.id] = value.toISOString();
                } else {
                    processedData[property.id] = value;
                }
            });

            await onSubmit(processedData);
        } catch (error) {
            console.error('Failed to submit record:', error);
        }
    };

    const renderField = (property: DatabaseProperty) => {
        switch (property.type) {
            case 'TEXT':
                return (
                    <FormField
                        key={property.id}
                        control={form.control}
                        name={property.id}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {property.name}
                                    {property.required && <span className="text-red-500 ml-1">*</span>}
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder={`Enter ${property.name.toLowerCase()}...`} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                );

            case 'NUMBER':
                return (
                    <FormField
                        key={property.id}
                        control={form.control}
                        name={property.id}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {property.name}
                                    {property.required && <span className="text-red-500 ml-1">*</span>}
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                        type="number" 
                                        placeholder={`Enter ${property.name.toLowerCase()}...`} 
                                        {...field}
                                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                );

            case 'EMAIL':
                return (
                    <FormField
                        key={property.id}
                        control={form.control}
                        name={property.id}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {property.name}
                                    {property.required && <span className="text-red-500 ml-1">*</span>}
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                        type="email" 
                                        placeholder={`Enter ${property.name.toLowerCase()}...`} 
                                        {...field} 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                );

            case 'URL':
                return (
                    <FormField
                        key={property.id}
                        control={form.control}
                        name={property.id}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {property.name}
                                    {property.required && <span className="text-red-500 ml-1">*</span>}
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                        type="url" 
                                        placeholder={`Enter ${property.name.toLowerCase()}...`} 
                                        {...field} 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                );

            case 'PHONE':
                return (
                    <FormField
                        key={property.id}
                        control={form.control}
                        name={property.id}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {property.name}
                                    {property.required && <span className="text-red-500 ml-1">*</span>}
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                        type="tel" 
                                        placeholder={`Enter ${property.name.toLowerCase()}...`} 
                                        {...field} 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                );

            case 'CHECKBOX':
                return (
                    <FormField
                        key={property.id}
                        control={form.control}
                        name={property.id}
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>{property.name}</FormLabel>
                                    {property.description && (
                                        <p className="text-sm text-muted-foreground">
                                            {property.description}
                                        </p>
                                    )}
                                </div>
                            </FormItem>
                        )}
                    />
                );

            case 'DATE':
                return (
                    <FormField
                        key={property.id}
                        control={form.control}
                        name={property.id}
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>
                                    {property.name}
                                    {property.required && <span className="text-red-500 ml-1">*</span>}
                                </FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                );

            case 'SELECT':
                return (
                    <FormField
                        key={property.id}
                        control={form.control}
                        name={property.id}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {property.name}
                                    {property.required && <span className="text-red-500 ml-1">*</span>}
                                </FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder={`Select ${property.name.toLowerCase()}...`} />
                                        </SelectTrigger>
                                    </FormControl>
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
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                );

            case 'MULTI_SELECT':
                return (
                    <FormField
                        key={property.id}
                        control={form.control}
                        name={property.id}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {property.name}
                                    {property.required && <span className="text-red-500 ml-1">*</span>}
                                </FormLabel>
                                <FormControl>
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap gap-2">
                                            {Array.isArray(field.value) && field.value.map((selectedId: string) => {
                                                const option = property.selectOptions?.find(opt => opt.id === selectedId);
                                                return option ? (
                                                    <Badge key={selectedId} variant="secondary" className="flex items-center gap-1">
                                                        <div
                                                            className="w-2 h-2 rounded-full"
                                                            style={{ backgroundColor: option.color }}
                                                        />
                                                        {option.name}
                                                    </Badge>
                                                ) : null;
                                            })}
                                        </div>
                                        <Select
                                            onValueChange={(value: string) => {
                                                const currentValues = Array.isArray(field.value) ? field.value : [];
                                                if (!currentValues.includes(value)) {
                                                    field.onChange([...currentValues, value]);
                                                }
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={`Add ${property.name.toLowerCase()}...`} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {property.selectOptions?.map((option) => (
                                                    <SelectItem
                                                        key={option.id}
                                                        value={option.id}
                                                        disabled={Array.isArray(field.value) && field.value.includes(option.id)}
                                                    >
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
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="overflow-y-auto w-[500px] sm:w-[600px] px-6">
                <SheetHeader className="space-y-4 pb-6">
                    <SheetTitle className="text-xl">
                        {mode === 'create' ? 'Create Record' : 'Edit Record'}
                    </SheetTitle>
                    <SheetDescription>
                        {mode === 'create'
                            ? 'Add a new record to this database.'
                            : 'Modify the record information.'
                        }
                    </SheetDescription>
                </SheetHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 pb-6">
                        {properties.filter(p => p.isVisible !== false).map(renderField)}

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
                                className="flex-1"
                            >
                                {isLoading ? (
                                    <>
                                        <Settings className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        {mode === 'create' ? 'Create Record' : 'Update Record'}
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
