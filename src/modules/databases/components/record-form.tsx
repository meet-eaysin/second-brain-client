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
import { Badge } from '@/components/ui/badge';
import {
    Type,
    Hash,
    Calendar,
    CheckSquare,
    Link,
    Mail,
    Phone,
    List,
    Tags,
    Plus,
    X,
    Settings,
    Save
} from 'lucide-react';
import type { DatabaseProperty, PropertyType, SelectOption } from '@/types/database.types';

interface PropertyFormProps {
    property?: DatabaseProperty | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: Partial<DatabaseProperty>) => Promise<void>;
    mode?: 'create' | 'edit';
    isLoading?: boolean;
}

// Property form schema
const propertyFormSchema = z.object({
    name: z.string().min(1, 'Property name is required'),
    type: z.enum(['TEXT', 'NUMBER', 'EMAIL', 'URL', 'PHONE', 'CHECKBOX', 'DATE', 'SELECT', 'MULTI_SELECT']),
    description: z.string().optional(),
    required: z.boolean().default(false),
    isVisible: z.boolean().default(true),
    selectOptions: z.array(z.object({
        id: z.string(),
        name: z.string(),
        color: z.string()
    })).optional()
});

type PropertyFormData = z.infer<typeof propertyFormSchema>;

// Property type options with icons and descriptions
const PROPERTY_TYPES = [
    {
        value: 'TEXT' as PropertyType,
        label: 'Text',
        icon: Type,
        description: 'Plain text content'
    },
    {
        value: 'NUMBER' as PropertyType,
        label: 'Number',
        icon: Hash,
        description: 'Numeric values'
    },
    {
        value: 'EMAIL' as PropertyType,
        label: 'Email',
        icon: Mail,
        description: 'Email addresses'
    },
    {
        value: 'URL' as PropertyType,
        label: 'URL',
        icon: Link,
        description: 'Web links'
    },
    {
        value: 'PHONE' as PropertyType,
        label: 'Phone',
        icon: Phone,
        description: 'Phone numbers'
    },
    {
        value: 'CHECKBOX' as PropertyType,
        label: 'Checkbox',
        icon: CheckSquare,
        description: 'True/false values'
    },
    {
        value: 'DATE' as PropertyType,
        label: 'Date',
        icon: Calendar,
        description: 'Date values'
    },
    {
        value: 'SELECT' as PropertyType,
        label: 'Select',
        icon: List,
        description: 'Single choice from options'
    },
    {
        value: 'MULTI_SELECT' as PropertyType,
        label: 'Multi-select',
        icon: Tags,
        description: 'Multiple choices from options'
    }
];

// Predefined colors for select options
const OPTION_COLORS = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
    '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
    '#ec4899', '#f43f5e', '#64748b', '#6b7280', '#374151'
];

// Property name suggestions based on type
const PROPERTY_SUGGESTIONS = {
    TEXT: ['Title', 'Description', 'Notes', 'Summary', 'Content', 'Comments'],
    NUMBER: ['Price', 'Quantity', 'Score', 'Rating', 'Count', 'Amount'],
    EMAIL: ['Email', 'Contact Email', 'Work Email', 'Personal Email'],
    URL: ['Website', 'Link', 'Reference', 'Source', 'Documentation'],
    PHONE: ['Phone', 'Mobile', 'Work Phone', 'Contact Number'],
    CHECKBOX: ['Completed', 'Active', 'Published', 'Verified', 'Approved'],
    DATE: ['Due Date', 'Created Date', 'Start Date', 'End Date', 'Deadline'],
    SELECT: ['Status', 'Priority', 'Category', 'Type', 'Stage'],
    MULTI_SELECT: ['Tags', 'Labels', 'Categories', 'Skills', 'Technologies']
};

export function PropertyForm({
    property,
    open,
    onOpenChange,
    onSubmit,
    mode = 'create',
    isLoading = false
}: PropertyFormProps) {
    const [selectOptions, setSelectOptions] = useState<SelectOption[]>([]);
    const [newOptionName, setNewOptionName] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const form = useForm<PropertyFormData>({
        resolver: zodResolver(propertyFormSchema),
        defaultValues: {
            name: '',
            type: 'TEXT',
            description: '',
            required: false,
            isVisible: true,
            selectOptions: []
        },
    });

    // Initialize form with property data when editing
    useEffect(() => {
        if (property && mode === 'edit') {
            form.reset({
                name: property.name,
                type: property.type,
                description: property.description || '',
                required: property.required || false,
                isVisible: property.isVisible !== false,
                selectOptions: property.selectOptions || []
            });
            setSelectOptions(property.selectOptions || []);
        } else if (mode === 'create') {
            form.reset({
                name: '',
                type: 'TEXT',
                description: '',
                required: false,
                isVisible: true,
                selectOptions: []
            });
            setSelectOptions([]);
        }
    }, [property, mode, form]);

    const selectedType = form.watch('type');

    const handleSubmit = async (data: PropertyFormData) => {
        try {
            const propertyData: Partial<DatabaseProperty> = {
                name: data.name,
                type: data.type,
                description: data.description,
                required: data.required,
                isVisible: data.isVisible,
                selectOptions: ['SELECT', 'MULTI_SELECT'].includes(data.type) ? selectOptions : undefined
            };

            await onSubmit(propertyData);
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to submit property:', error);
        }
    };

    const addSelectOption = () => {
        if (newOptionName.trim()) {
            const newOption: SelectOption = {
                id: `option_${Date.now()}`,
                name: newOptionName.trim(),
                color: OPTION_COLORS[selectOptions.length % OPTION_COLORS.length]
            };
            setSelectOptions(prev => [...prev, newOption]);
            setNewOptionName('');
        }
    };

    const removeSelectOption = (optionId: string) => {
        setSelectOptions(prev => prev.filter(option => option.id !== optionId));
    };

    const updateOptionColor = (optionId: string, color: string) => {
        setSelectOptions(prev =>
            prev.map(option =>
                option.id === optionId ? { ...option, color } : option
            )
        );
    };

    const renderSelectOptionsEditor = () => {
        if (!['SELECT', 'MULTI_SELECT'].includes(selectedType)) return null;

        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Options</label>
                    <Badge variant="outline" className="text-xs">
                        {selectOptions.length} option{selectOptions.length !== 1 ? 's' : ''}
                    </Badge>
                </div>

                {/* Add new option */}
                <div className="flex gap-2">
                    <Input
                        placeholder="Add option..."
                        value={newOptionName}
                        onChange={(e) => setNewOptionName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                addSelectOption();
                            }
                        }}
                        className="flex-1"
                    />
                    <Button
                        type="button"
                        onClick={addSelectOption}
                        disabled={!newOptionName.trim()}
                        size="sm"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>

                {/* Existing options */}
                {selectOptions.length > 0 && (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {selectOptions.map((option) => (
                            <div key={option.id} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                                <div className="flex items-center gap-2 flex-1">
                                    <div
                                        className="w-4 h-4 rounded-full border cursor-pointer"
                                        style={{ backgroundColor: option.color }}
                                        onClick={() => {
                                            const newColor = OPTION_COLORS[Math.floor(Math.random() * OPTION_COLORS.length)];
                                            updateOptionColor(option.id, newColor);
                                        }}
                                    />
                                    <span className="text-sm font-medium">{option.name}</span>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeSelectOption(option.id)}
                                    className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="overflow-y-auto w-[500px] sm:w-[700px] lg:w-[800px] px-6">
                <SheetHeader className="space-y-4 pb-3 px-2">
                        <div>
                            <SheetTitle className="text-xl">
                                {mode === 'create' ? 'Create Property' : 'Edit Property'}
                            </SheetTitle>
                            <SheetDescription className="text-muted-foreground">
                                {mode === 'create'
                                    ? 'Add a new property to structure your database.'
                                    : 'Modify the property configuration.'
                                }
                            </SheetDescription>
                    </div>
                </SheetHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 pb-6 px-1">
                        {/* Property Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Property Name</FormLabel>
                                    <FormControl>
                                        <div className="space-y-3">
                                            <Input
                                                placeholder="Enter property name..."
                                                {...field}
                                                onFocus={() => setShowSuggestions(true)}
                                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                            />
                                            {showSuggestions && selectedType && PROPERTY_SUGGESTIONS[selectedType] && (
                                                <div className="flex flex-wrap gap-2">
                                                    {PROPERTY_SUGGESTIONS[selectedType].map((suggestion) => (
                                                        <Button
                                                            key={suggestion}
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-7 text-xs"
                                                            onClick={() => {
                                                                field.onChange(suggestion);
                                                                setShowSuggestions(false);
                                                            }}
                                                        >
                                                            {suggestion}
                                                        </Button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Property Type */}
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Property Type</FormLabel>
                                    <FormControl>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                                            {PROPERTY_TYPES.map((type) => {
                                                const Icon = type.icon;
                                                const isSelected = field.value === type.value;
                                                return (
                                                    <div
                                                        key={type.value}
                                                        className={`
                                                            relative cursor-pointer rounded-md border p-2 transition-all hover:border-primary/50
                                                            ${isSelected
                                                                ? 'border-primary bg-primary/5 shadow-sm'
                                                                : 'border-muted hover:bg-muted/50'
                                                            }
                                                        `}
                                                        onClick={() => field.onChange(type.value)}
                                                    >
                                                        <div className="flex flex-col items-center text-center space-y-1">
                                                            <Icon className={`h-4 w-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                                                            <div className={`text-xs font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                                                                {type.label}
                                                            </div>
                                                        </div>
                                                        {isSelected && (
                                                            <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary" />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Property Description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe what this property is for..."
                                            className="resize-none"
                                            rows={3}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Property Options */}
                        <div className="flex gap-4">
                            <FormField
                                control={form.control}
                                name="required"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Required</FormLabel>
                                            <FormDescription>
                                                This property must have a value
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="isVisible"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Visible</FormLabel>
                                            <FormDescription>
                                                Show this property in forms
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Select Options Editor */}
                        {renderSelectOptionsEditor()}

                        <SheetFooter className="flex gap-3 pt-6 border-t px-1">
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
                                        {mode === 'create' ? 'Create Property' : 'Update Property'}
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

// Export with both names for backward compatibility
export { PropertyForm as RecordForm };
