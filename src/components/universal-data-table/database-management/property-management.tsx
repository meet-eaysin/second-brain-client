import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { 
    Plus, 
    MoreHorizontal, 
    Edit, 
    Trash2, 
    Eye,
    EyeOff,
    GripVertical,
    Type,
    Hash,
    Mail,
    Link,
    Phone,
    CheckSquare,
    Calendar,
    Users,
    Tag,
    Tags,
    FileText,
    Calculator,
    User
} from 'lucide-react';
import { useDatabaseManagement } from './database-context';
import type { DatabaseProperty } from '@/types/database.types';
import { toast } from 'sonner';

const PROPERTY_TYPES = [
    { value: 'TEXT', label: 'Text', icon: Type, description: 'Single line of text' },
    { value: 'TITLE', label: 'Title', icon: Type, description: 'Main title field' },
    { value: 'NUMBER', label: 'Number', icon: Hash, description: 'Numeric values' },
    { value: 'EMAIL', label: 'Email', icon: Mail, description: 'Email addresses' },
    { value: 'URL', label: 'URL', icon: Link, description: 'Web links' },
    { value: 'PHONE', label: 'Phone', icon: Phone, description: 'Phone numbers' },
    { value: 'CHECKBOX', label: 'Checkbox', icon: CheckSquare, description: 'True/false values' },
    { value: 'DATE', label: 'Date', icon: Calendar, description: 'Date picker' },
    { value: 'SELECT', label: 'Select', icon: Tag, description: 'Single choice from options' },
    { value: 'MULTI_SELECT', label: 'Multi-select', icon: Tags, description: 'Multiple choices' },
    { value: 'PERSON', label: 'Person', icon: User, description: 'User references' },
    { value: 'FILES', label: 'Files', icon: FileText, description: 'File attachments' },
    { value: 'FORMULA', label: 'Formula', icon: Calculator, description: 'Calculated values' },
    { value: 'RELATION', label: 'Relation', icon: Users, description: 'Links to other records' },
] as const;

interface AddPropertyDialogProps {
    trigger?: React.ReactNode;
    onPropertyAdded?: (property: DatabaseProperty) => void;
}

export function AddPropertyDialog({ trigger, onPropertyAdded }: AddPropertyDialogProps) {
    const { addProperty } = useDatabaseManagement();
    const [open, setOpen] = useState(false);
    const [propertyName, setPropertyName] = useState('');
    const [propertyType, setPropertyType] = useState<DatabaseProperty['type']>('TEXT');
    const [description, setDescription] = useState('');
    const [isRequired, setIsRequired] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [selectOptions, setSelectOptions] = useState<Array<{ id: string; name: string; color: string }>>([]);
    const [newOptionName, setNewOptionName] = useState('');

    const selectedPropertyType = PROPERTY_TYPES.find(type => type.value === propertyType);

    const handleSubmit = () => {
        if (!propertyName.trim()) {
            toast.error('Please enter a property name');
            return;
        }

        const newProperty: Omit<DatabaseProperty, 'id'> = {
            name: propertyName.trim(),
            type: propertyType,
            description: description.trim() || undefined,
            required: isRequired,
            isVisible,
            selectOptions: (propertyType === 'SELECT' || propertyType === 'MULTI_SELECT') 
                ? selectOptions 
                : undefined,
        };

        addProperty(newProperty);
        
        if (onPropertyAdded) {
            onPropertyAdded(newProperty as DatabaseProperty);
        }

        toast.success(`${propertyName} property created successfully`);
        
        // Reset form
        setPropertyName('');
        setPropertyType('TEXT');
        setDescription('');
        setIsRequired(false);
        setIsVisible(true);
        setSelectOptions([]);
        setNewOptionName('');
        setOpen(false);
    };

    const addSelectOption = () => {
        if (!newOptionName.trim()) return;
        
        const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#f97316'];
        const newOption = {
            id: `option-${Date.now()}`,
            name: newOptionName.trim(),
            color: colors[selectOptions.length % colors.length],
        };
        
        setSelectOptions([...selectOptions, newOption]);
        setNewOptionName('');
    };

    const removeSelectOption = (optionId: string) => {
        setSelectOptions(selectOptions.filter(option => option.id !== optionId));
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Property
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Property</DialogTitle>
                    <DialogDescription>
                        Add a new property to organize and structure your data.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Property Name */}
                    <div className="space-y-2">
                        <Label htmlFor="property-name">Property Name</Label>
                        <Input
                            id="property-name"
                            placeholder="Enter property name..."
                            value={propertyName}
                            onChange={(e) => setPropertyName(e.target.value)}
                        />
                    </div>

                    {/* Property Type */}
                    <div className="space-y-3">
                        <Label>Property Type</Label>
                        <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                            {PROPERTY_TYPES.map((type) => {
                                const Icon = type.icon;
                                return (
                                    <div
                                        key={type.value}
                                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                            propertyType === type.value
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border hover:border-primary/50'
                                        }`}
                                        onClick={() => setPropertyType(type.value)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Icon className="h-4 w-4" />
                                            <div>
                                                <div className="font-medium text-sm">{type.label}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {type.description}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Select Options (for SELECT and MULTI_SELECT types) */}
                    {(propertyType === 'SELECT' || propertyType === 'MULTI_SELECT') && (
                        <div className="space-y-3">
                            <Label>Options</Label>
                            
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
                                />
                                <Button onClick={addSelectOption} disabled={!newOptionName.trim()}>
                                    Add
                                </Button>
                            </div>
                            
                            {/* Options list */}
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                                {selectOptions.map((option) => (
                                    <div key={option.id} className="flex items-center justify-between p-2 border rounded">
                                        <div className="flex items-center gap-2">
                                            <div 
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: option.color }}
                                            />
                                            <span className="text-sm">{option.name}</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeSelectOption(option.id)}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            
                            {selectOptions.length === 0 && (
                                <p className="text-xs text-muted-foreground">
                                    Add options for users to choose from
                                </p>
                            )}
                        </div>
                    )}

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="property-description">Description (Optional)</Label>
                        <Textarea
                            id="property-description"
                            placeholder="Describe what this property is for..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={2}
                        />
                    </div>

                    {/* Property Settings */}
                    <div className="space-y-4">
                        <Label>Settings</Label>
                        
                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="is-required">Required</Label>
                                <p className="text-xs text-muted-foreground">
                                    This property must have a value
                                </p>
                            </div>
                            <Switch
                                id="is-required"
                                checked={isRequired}
                                onCheckedChange={setIsRequired}
                            />
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="is-visible">Visible</Label>
                                <p className="text-xs text-muted-foreground">
                                    Show this property in views
                                </p>
                            </div>
                            <Switch
                                id="is-visible"
                                checked={isVisible}
                                onCheckedChange={setIsVisible}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>
                        Create Property
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

interface PropertyActionsMenuProps {
    property: DatabaseProperty;
    onEdit?: (property: DatabaseProperty) => void;
    onDelete?: (property: DatabaseProperty) => void;
}

export function PropertyActionsMenu({ property, onEdit, onDelete }: PropertyActionsMenuProps) {
    const { deleteProperty, togglePropertyVisibility } = useDatabaseManagement();

    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete the "${property.name}" property? This will remove all data in this property from all records.`)) {
            deleteProperty(property.id);
            if (onDelete) {
                onDelete(property);
            }
            toast.success(`${property.name} property deleted`);
        }
    };

    const handleToggleVisibility = () => {
        const newVisibility = !property.isVisible;
        togglePropertyVisibility(property.id, newVisibility);
        toast.success(
            newVisibility 
                ? `${property.name} is now visible`
                : `${property.name} is now hidden`
        );
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(property)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Property
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleToggleVisibility}>
                    {property.isVisible ? (
                        <>
                            <EyeOff className="mr-2 h-4 w-4" />
                            Hide Property
                        </>
                    ) : (
                        <>
                            <Eye className="mr-2 h-4 w-4" />
                            Show Property
                        </>
                    )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                    onClick={handleDelete}
                    className="text-destructive focus:text-destructive"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Property
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

interface EditPropertyDialogProps {
    property: DatabaseProperty;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onPropertyUpdated?: (property: DatabaseProperty) => void;
}

export function EditPropertyDialog({ property, open, onOpenChange, onPropertyUpdated }: EditPropertyDialogProps) {
    const { updateProperty } = useDatabaseManagement();
    const [propertyName, setPropertyName] = useState(property.name);
    const [description, setDescription] = useState(property.description || '');
    const [isRequired, setIsRequired] = useState(property.required || false);
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);
    const [selectOptions, setSelectOptions] = useState(property.selectOptions || []);
    const [newOptionName, setNewOptionName] = useState('');

    const handleSubmit = () => {
        if (!propertyName.trim()) {
            toast.error('Please enter a property name');
            return;
        }

        const updates: Partial<DatabaseProperty> = {
            name: propertyName.trim(),
            description: description.trim() || undefined,
            required: isRequired,
            isVisible,
            selectOptions: (property.type === 'SELECT' || property.type === 'MULTI_SELECT') 
                ? selectOptions 
                : undefined,
        };

        updateProperty(property.id, updates);
        
        if (onPropertyUpdated) {
            onPropertyUpdated({ ...property, ...updates });
        }

        toast.success(`${propertyName} property updated successfully`);
        onOpenChange(false);
    };

    const addSelectOption = () => {
        if (!newOptionName.trim()) return;
        
        const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#f97316'];
        const newOption = {
            id: `option-${Date.now()}`,
            name: newOptionName.trim(),
            color: colors[selectOptions.length % colors.length],
        };
        
        setSelectOptions([...selectOptions, newOption]);
        setNewOptionName('');
    };

    const removeSelectOption = (optionId: string) => {
        setSelectOptions(selectOptions.filter(option => option.id !== optionId));
    };

    const selectedPropertyType = PROPERTY_TYPES.find(type => type.value === property.type);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Property</DialogTitle>
                    <DialogDescription>
                        Modify the property settings and configuration.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Property Type (Read-only) */}
                    <div className="space-y-2">
                        <Label>Property Type</Label>
                        <div className="p-3 border rounded-lg bg-muted/50">
                            <div className="flex items-center gap-2">
                                {selectedPropertyType && <selectedPropertyType.icon className="h-4 w-4" />}
                                <div>
                                    <div className="font-medium text-sm">{selectedPropertyType?.label}</div>
                                    <div className="text-xs text-muted-foreground">
                                        Property type cannot be changed after creation
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Property Name */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-property-name">Property Name</Label>
                        <Input
                            id="edit-property-name"
                            placeholder="Enter property name..."
                            value={propertyName}
                            onChange={(e) => setPropertyName(e.target.value)}
                        />
                    </div>

                    {/* Select Options (for SELECT and MULTI_SELECT types) */}
                    {(property.type === 'SELECT' || property.type === 'MULTI_SELECT') && (
                        <div className="space-y-3">
                            <Label>Options</Label>
                            
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
                                />
                                <Button onClick={addSelectOption} disabled={!newOptionName.trim()}>
                                    Add
                                </Button>
                            </div>
                            
                            {/* Options list */}
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                                {selectOptions.map((option) => (
                                    <div key={option.id} className="flex items-center justify-between p-2 border rounded">
                                        <div className="flex items-center gap-2">
                                            <div 
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: option.color }}
                                            />
                                            <span className="text-sm">{option.name}</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeSelectOption(option.id)}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-property-description">Description (Optional)</Label>
                        <Textarea
                            id="edit-property-description"
                            placeholder="Describe what this property is for..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={2}
                        />
                    </div>

                    {/* Property Settings */}
                    <div className="space-y-4">
                        <Label>Settings</Label>
                        
                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="edit-is-required">Required</Label>
                                <p className="text-xs text-muted-foreground">
                                    This property must have a value
                                </p>
                            </div>
                            <Switch
                                id="edit-is-required"
                                checked={isRequired}
                                onCheckedChange={setIsRequired}
                            />
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="edit-is-visible">Visible</Label>
                                <p className="text-xs text-muted-foreground">
                                    Show this property in views
                                </p>
                            </div>
                            <Switch
                                id="edit-is-visible"
                                checked={isVisible}
                                onCheckedChange={setIsVisible}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>
                        Update Property
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export function PropertyManagement() {
    const { properties } = useDatabaseManagement();
    const [editingProperty, setEditingProperty] = useState<DatabaseProperty | null>(null);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Properties</h3>
                <AddPropertyDialog />
            </div>

            <div className="space-y-2">
                {properties.map((property) => {
                    const PropertyIcon = PROPERTY_TYPES.find(type => type.value === property.type)?.icon || Type;
                    
                    return (
                        <div
                            key={property.id}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                        >
                            <div className="flex items-center gap-3">
                                <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                                <PropertyIcon className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{property.name}</span>
                                        <Badge variant="outline" className="text-xs">
                                            {property.type}
                                        </Badge>
                                        {property.required && (
                                            <Badge variant="destructive" className="text-xs">
                                                Required
                                            </Badge>
                                        )}
                                        {property.isVisible === false && (
                                            <Badge variant="secondary" className="text-xs">
                                                Hidden
                                            </Badge>
                                        )}
                                    </div>
                                    {property.description && (
                                        <div className="text-sm text-muted-foreground">
                                            {property.description}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <PropertyActionsMenu
                                property={property}
                                onEdit={setEditingProperty}
                            />
                        </div>
                    );
                })}

                {properties.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        <Type className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No properties created yet</p>
                        <p className="text-sm">Add properties to structure your data</p>
                    </div>
                )}
            </div>

            {editingProperty && (
                <EditPropertyDialog
                    property={editingProperty}
                    open={!!editingProperty}
                    onOpenChange={(open) => !open && setEditingProperty(null)}
                    onPropertyUpdated={() => setEditingProperty(null)}
                />
            )}
        </div>
    );
}
