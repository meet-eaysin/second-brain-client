import React from 'react';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
    Settings2,
    Lock,
    Unlock,
    Type,
    Hash,
    Mail,
    Link,
    Phone,
    CheckSquare,
    Calendar,
    List,
    Tags,
    Eye,
    EyeOff,
} from 'lucide-react';
import { toast } from 'sonner';
import { useDatabaseContext } from '../context/database-context';
import { useUpdateView, useHideProperty, useFreezeProperty } from '../services/databaseQueries';
import type { Table } from '@tanstack/react-table';
import type { DatabaseProperty, DatabaseView } from '@/types/document.types.ts';

interface DatabaseViewOptionsProps<TData> {
    table: Table<TData>;
    properties: DatabaseProperty[];
    currentView: DatabaseView;
    onViewUpdate?: () => void;
}

const PROPERTY_TYPE_ICONS = {
    TEXT: Type,
    NUMBER: Hash,
    EMAIL: Mail,
    URL: Link,
    PHONE: Phone,
    CHECKBOX: CheckSquare,
    DATE: Calendar,
    SELECT: List,
    MULTI_SELECT: Tags,
} as const;

export function DatabaseViewOptions<TData>({
    table,
    properties,
    currentView,
    onViewUpdate,
}: DatabaseViewOptionsProps<TData>) {
    const { currentDatabase, currentView: contextCurrentView, setCurrentDatabase } = useDatabaseContext();


    
    // Mutation hooks
    const updateViewMutation = useUpdateView();
    const hidePropertyMutation = useHideProperty();
    const freezePropertyMutation = useFreezeProperty();

    // Get property visibility state from current view
    const getPropertyVisibility = (propertyId: string) => {
        const property = properties.find(p => p.id === propertyId);
        if (!property) return false;

        // Check if property is hidden globally
        if (property.hidden) return false;

        // Check if property is visible in current view
        if (currentView?.visibleProperties && currentView.visibleProperties.length > 0) {
            return currentView.visibleProperties?.includes(propertyId) || false;
        }

        // Default to property's isVisible setting
        return property.isVisible !== false;
    };

    // Check if property is globally hidden
    const isGloballyHidden = (propertyId: string) => {
        const property = properties.find(p => p.id === propertyId);
        return property?.hidden === true;
    };



    // Handle property visibility toggle
    const handlePropertyVisibilityToggle = async (propertyId: string, visible: boolean) => {
        const activeView = currentView || contextCurrentView;
        if (!currentDatabase?.id || !activeView?.id) {
            console.error('Missing database or view for property visibility toggle');
            toast.error('Database or view not found');
            return;
        }

        try {
            // Update view's visible properties
            const currentVisibleProperties = activeView?.visibleProperties || [];
            const updatedVisibleProperties = visible
                ? [...currentVisibleProperties.filter(id => id !== propertyId), propertyId] // Remove duplicates and add
                : currentVisibleProperties.filter(id => id !== propertyId); // Remove from list

            // Call API to update view using mutation hook
            const updatedDatabase = await updateViewMutation.mutateAsync({
                databaseId: currentDatabase.id,
                viewId: activeView.id,
                data: {
                    ...activeView,
                    visibleProperties: updatedVisibleProperties
                }
            });

            // Update local state
            setCurrentDatabase(updatedDatabase);

            // Toggle table column visibility
            const column = table.getColumn(propertyId);
            if (column) {
                column.toggleVisibility(visible);
            }

            onViewUpdate?.();
        } catch (error) {
            console.error('Failed to update property visibility:', error);
            // Error handling is done by the mutation hook
        }
    };

    // Handle global property hide/show
    const handleGlobalPropertyToggle = async (propertyId: string, hidden: boolean) => {
        if (!currentDatabase?.id) {
            toast.error('Database not found');
            return;
        }

        try {
            const updatedDatabase = await hidePropertyMutation.mutateAsync({
                databaseId: currentDatabase.id,
                propertyId,
                hidden
            });

            setCurrentDatabase(updatedDatabase);

            // Toggle table column visibility
            const column = table.getColumn(propertyId);
            if (column) {
                column.toggleVisibility(!hidden);
            }

            onViewUpdate?.();
        } catch (error) {
            console.error('Failed to update global property visibility:', error);
            // Error handling is done by the mutation hook
        }
    };

    // Handle property freeze toggle
    const handlePropertyFreezeToggle = async (propertyId: string, frozen: boolean) => {
        if (!currentDatabase?.id) {
            toast.error('Database not found');
            return;
        }

        try {
            const updatedDatabase = await freezePropertyMutation.mutateAsync({
                databaseId: currentDatabase.id,
                propertyId,
                frozen
            });

            setCurrentDatabase(updatedDatabase);
            onViewUpdate?.();
        } catch (error) {
            console.error('Failed to update property freeze state:', error);
            // Error handling is done by the mutation hook
        }
    };

    // Separate properties into visible and hidden
    // Sort properties: visible first, then hidden, but keep all in one list
    const sortedProperties = [...properties].sort((a, b) => {
        const aVisible = getPropertyVisibility(a.id);
        const bVisible = getPropertyVisibility(b.id);

        // Visible properties first
        if (aVisible && !bVisible) return -1;
        if (!aVisible && bVisible) return 1;

        // Within same visibility, sort by name
        return a.name.localeCompare(b.name);
    });

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto hidden h-8 lg:flex"
                >
                    <Settings2 className="mr-2 h-4 w-4" />
                    View Options
                    <Badge variant="secondary" className="ml-2 text-xs">
                        {sortedProperties.filter(p => getPropertyVisibility(p.id)).length}
                    </Badge>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[280px]">
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Column Visibility</span>
                    <Badge variant="outline" className="text-xs">
                        {sortedProperties.filter(p => getPropertyVisibility(p.id)).length} of {properties.length} visible
                    </Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* All Properties */}
                {sortedProperties.map((property) => {
                    const TypeIcon = PROPERTY_TYPE_ICONS[property.type] || Type;
                    const isVisible = getPropertyVisibility(property.id);
                    const isGloballyHiddenProp = isGloballyHidden(property.id);
                    const VisibilityIcon = isVisible ? Eye : EyeOff;

                    return (
                        <DropdownMenuCheckboxItem
                            key={property.id}
                            checked={isVisible}
                            onCheckedChange={(checked) =>
                                handlePropertyVisibilityToggle(property.id, !!checked)
                            }
                            className="flex items-center gap-2"
                            disabled={isGloballyHiddenProp}
                        >
                            <div className="flex items-center gap-2 flex-1">
                                <TypeIcon className="h-3 w-3 text-muted-foreground" />
                                <span className="flex-1 truncate">{property.name}</span>
                                <div className="flex items-center gap-1">
                                    {property.required && (
                                        <Badge variant="secondary" className="text-xs px-1">
                                            Required
                                        </Badge>
                                    )}
                                    {isGloballyHiddenProp && (
                                        <Badge variant="destructive" className="text-xs px-1">
                                            Hidden
                                        </Badge>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-5 w-5 p-0"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handlePropertyFreezeToggle(property.id, !property.frozen);
                                        }}
                                        title={property.frozen ? 'Unfreeze property' : 'Freeze property'}
                                    >
                                        {property.frozen ? (
                                            <Lock className="h-3 w-3 text-blue-500" />
                                        ) : (
                                            <Unlock className="h-3 w-3 text-muted-foreground hover:text-blue-500" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </DropdownMenuCheckboxItem>
                    );
                })}

                {properties.length === 0 && (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                        No properties available
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
