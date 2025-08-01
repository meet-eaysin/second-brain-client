
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { X, Plus } from 'lucide-react';
import type {PropertyType} from "@/types/database.types.ts";

const propertyFormSchema = z.object({
    name: z.string().min(1, 'Property name is required'),
    type: z.string() as z.ZodType<PropertyType>,
    description: z.string().optional(),
    required: z.boolean(),
    selectOptions: z.array(
        z.object({
            name: z.string(),
            color: z.string(),
        })
    ).optional(),
});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;

interface PropertyFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: PropertyFormValues) => void;
    propertyId?: string;
    initialData?: Partial<PropertyFormValues>;
    databaseId: string;
}

const propertyTypes: { label: string; value: PropertyType; description: string }[] = [
    { label: 'Text', value: 'TEXT', description: 'Plain text, paragraph text, etc.' },
    { label: 'Number', value: 'NUMBER', description: 'Numbers, including decimals' },
    { label: 'Select', value: 'SELECT', description: 'Select one option from a list' },
    { label: 'Multi-select', value: 'MULTI_SELECT', description: 'Select multiple options from a list' },
    { label: 'Date', value: 'DATE', description: 'Date and time values' },
    { label: 'Checkbox', value: 'CHECKBOX', description: 'Yes/no values' },
    { label: 'URL', value: 'URL', description: 'Web links' },
    { label: 'Email', value: 'EMAIL', description: 'Email addresses' },
    { label: 'Phone', value: 'PHONE', description: 'Phone numbers' },
    { label: 'Created time', value: 'CREATED_TIME', description: 'When this entry was created' },
    { label: 'Created by', value: 'CREATED_BY', description: 'Who created this entry' },
    { label: 'Last edited time', value: 'LAST_EDITED_TIME', description: 'When this entry was last modified' },
    { label: 'Last edited by', value: 'LAST_EDITED_BY', description: 'Who last modified this entry' },
];

const defaultColors = [
    '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3',
    '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a',
    '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722',
];

export function PropertyForm({ 
    open, 
    onOpenChange, 
    onSubmit, 
    propertyId, 
    initialData,
}: PropertyFormProps) {
    const form = useForm<PropertyFormValues>({
        resolver: zodResolver(propertyFormSchema),
        defaultValues: {
            name: '',
            type: 'TEXT' as PropertyType,
            description: '',
            required: false,
            selectOptions: [],
        },
    });

    const watchedType = form.watch('type');
    const watchedSelectOptions = form.watch('selectOptions') || [];

    const handleSubmit = (values: PropertyFormValues) => {
        onSubmit(values);
        onOpenChange(false);
        form.reset();
    };

    React.useEffect(() => {
        if (open && initialData) {
            form.reset({
                name: initialData.name || '',
                type: initialData.type || 'TEXT',
                description: initialData.description || '',
                required: initialData.required || false,
                selectOptions: initialData.selectOptions || [],
            });
        } else if (open) {
            form.reset({
                name: '',
                type: 'TEXT' as PropertyType,
                description: '',
                required: false,
                selectOptions: [],
            });
        }
    }, [open, initialData, form]);

    const addSelectOption = () => {
        const currentOptions = form.getValues('selectOptions') || [];
        const color = defaultColors[currentOptions.length % defaultColors.length];
        form.setValue('selectOptions', [
            ...currentOptions,
            { name: `Option ${currentOptions.length + 1}`, color },
        ]);
    };

    const removeSelectOption = (index: number) => {
        const currentOptions = form.getValues('selectOptions') || [];
        form.setValue(
            'selectOptions',
            currentOptions.filter((_, i) => i !== index)
        );
    };

    const updateOptionName = (index: number, name: string) => {
        const currentOptions = [...(form.getValues('selectOptions') || [])];
        currentOptions[index] = { ...currentOptions[index], name };
        form.setValue('selectOptions', currentOptions);
    };

    const updateOptionColor = (index: number, color: string) => {
        const currentOptions = [...(form.getValues('selectOptions') || [])];
        currentOptions[index] = { ...currentOptions[index], color };
        form.setValue('selectOptions', currentOptions);
    };

    const isSelectType = watchedType === 'SELECT' || watchedType === 'MULTI_SELECT';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {propertyId ? 'Edit Property' : 'Add New Property'}
                    </DialogTitle>
                    <DialogDescription>
                        {propertyId
                            ? 'Update this property configuration.'
                            : 'Configure a new property for your database.'}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Property Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter property name..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Property Type</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select property type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {propertyTypes.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    <div className="flex flex-col">
                                                        <span>{type.label}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {type.description}
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter property description..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="required"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                    <div className="space-y-0.5">
                                        <FormLabel>Required Field</FormLabel>
                                        <p className="text-sm text-muted-foreground">
                                            Make this property mandatory for all records
                                        </p>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {isSelectType && (
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-medium">Select Options</h3>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addSelectOption}
                                    >
                                        <Plus className="h-4 w-4 mr-1" />
                                        Add Option
                                    </Button>
                                </div>

                                {watchedSelectOptions.length === 0 ? (
                                    <Card className="p-4 text-center text-sm text-muted-foreground">
                                        No options defined. Click "Add Option" to create some.
                                    </Card>
                                ) : (
                                    <div className="space-y-2">
                                        {watchedSelectOptions.map((option, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-2 border rounded-md p-2"
                                            >
                                                <div
                                                    className="h-4 w-4 rounded-full"
                                                    style={{ backgroundColor: option.color }}
                                                />
                                                <Input
                                                    value={option.name}
                                                    onChange={(e) => updateOptionName(index, e.target.value)}
                                                    className="flex-1"
                                                    placeholder="Option name"
                                                />
                                                <Input
                                                    type="color"
                                                    value={option.color}
                                                    onChange={(e) => updateOptionColor(index, e.target.value)}
                                                    className="w-12 p-1 h-8"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeSelectOption(index)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                {propertyId ? 'Update Property' : 'Add Property'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
