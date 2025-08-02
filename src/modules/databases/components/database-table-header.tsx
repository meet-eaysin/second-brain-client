import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    MoreHorizontal,
    Type,
    Hash,
    Mail,
    Link,
    Phone,
    CheckSquare,
    Calendar,
    List,
    Tags,
    Lock,
    EyeOff,
} from 'lucide-react';
import { PropertyHeaderMenu } from './property-header-menu';
import { useDatabaseContext } from '../context/database-context';
import { databaseApi } from '../services/databaseApi';
import { toast } from 'sonner';
import type { DatabaseProperty, PropertyType } from '@/types/database.types';

interface DatabaseTableHeaderProps {
    property: DatabaseProperty;
    sortDirection?: 'asc' | 'desc' | null;
    isFiltered?: boolean;
    isFrozen?: boolean;
    onPropertyUpdate?: () => void;
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

export function DatabaseTableHeader({
    property,
    sortDirection,
    isFiltered,
    isFrozen,
    onPropertyUpdate,
}: DatabaseTableHeaderProps) {
    const { currentDatabase, setCurrentDatabase, setOpen, setCurrentProperty } = useDatabaseContext();

    const TypeIcon = PROPERTY_TYPE_ICONS[property.type] || Type;

    const handleEditName = async (newName: string) => {
        if (!currentDatabase?.id) return;

        try {
            const updatedDatabase = await databaseApi.updatePropertyName(
                currentDatabase.id,
                property.id,
                newName
            );
            setCurrentDatabase(updatedDatabase);
            onPropertyUpdate?.();
        } catch (error) {
            console.error('Failed to update property name:', error);
            toast.error('Failed to update property name');
        }
    };

    const handleChangeType = async (newType: PropertyType) => {
        if (!currentDatabase?.id) return;

        try {
            const updatedDatabase = await databaseApi.updatePropertyType(
                currentDatabase.id,
                property.id,
                newType
            );
            setCurrentDatabase(updatedDatabase);
            onPropertyUpdate?.();
        } catch (error) {
            console.error('Failed to change property type:', error);
            toast.error('Failed to change property type');
        }
    };

    const handleFilter = (property: DatabaseProperty) => {
        // Open filter dialog or apply filter logic
        toast.info(`Filter by ${property.name} - Feature coming soon`);
    };

    const handleSort = (property: DatabaseProperty, direction: 'asc' | 'desc') => {
        // Apply sort logic
        toast.info(`Sort ${property.name} ${direction} - Feature coming soon`);
    };

    const handleFreeze = async (property: DatabaseProperty) => {
        if (!currentDatabase?.id) return;

        try {
            const updatedDatabase = await databaseApi.freezeProperty(
                currentDatabase.id,
                property.id,
                !isFrozen
            );
            setCurrentDatabase(updatedDatabase);
            onPropertyUpdate?.();
            toast.success(isFrozen ? 'Column unfrozen' : 'Column frozen');
        } catch (error) {
            console.error('Failed to freeze property:', error);
            toast.error('Failed to freeze column');
        }
    };

    const handleHide = async (property: DatabaseProperty) => {
        if (!currentDatabase?.id) return;

        try {
            const updatedDatabase = await databaseApi.hideProperty(
                currentDatabase.id,
                property.id,
                true
            );
            setCurrentDatabase(updatedDatabase);
            onPropertyUpdate?.();
            toast.success('Column hidden');
        } catch (error) {
            console.error('Failed to hide property:', error);
            toast.error('Failed to hide column');
        }
    };

    const handleInsertLeft = (property: DatabaseProperty) => {
        setCurrentProperty(property);
        setOpen('create-property');
        // Additional logic to specify insertion position
        toast.info('Insert property to the left - Opening property form');
    };

    const handleInsertRight = (property: DatabaseProperty) => {
        setCurrentProperty(property);
        setOpen('create-property');
        // Additional logic to specify insertion position
        toast.info('Insert property to the right - Opening property form');
    };

    const handleDuplicate = async (property: DatabaseProperty) => {
        if (!currentDatabase?.id) return;

        try {
            const updatedDatabase = await databaseApi.duplicateProperty(
                currentDatabase.id,
                property.id
            );
            setCurrentDatabase(updatedDatabase);
            onPropertyUpdate?.();
            toast.success(`Property "${property.name}" duplicated`);
        } catch (error) {
            console.error('Failed to duplicate property:', error);
            toast.error('Failed to duplicate property');
        }
    };

    const handleDelete = async (property: DatabaseProperty) => {
        if (!currentDatabase?.id) return;

        try {
            const updatedDatabase = await databaseApi.deleteProperty(
                currentDatabase.id,
                property.id
            );
            setCurrentDatabase(updatedDatabase);
            onPropertyUpdate?.();
        } catch (error) {
            console.error('Failed to delete property:', error);
            toast.error('Failed to delete property');
        }
    };

    const getSortIcon = () => {
        if (sortDirection === 'asc') return <ArrowUp className="h-3 w-3" />;
        if (sortDirection === 'desc') return <ArrowDown className="h-3 w-3" />;
        return <ArrowUpDown className="h-3 w-3 opacity-0 group-hover:opacity-100" />;
    };

    return (
        <PropertyHeaderMenu
            property={property}
            onEditName={handleEditName}
            onChangeType={handleChangeType}
            onFilter={handleFilter}
            onSort={handleSort}
            onFreeze={handleFreeze}
            onHide={handleHide}
            onInsertLeft={handleInsertLeft}
            onInsertRight={handleInsertRight}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
        >
            <div className="flex items-center w-full min-w-0 group cursor-pointer hover:bg-muted/50 rounded px-2 py-1 -mx-2 -my-1">
                <TypeIcon className="h-4 w-4 text-muted-foreground flex-shrink-0 mr-2" />

                <span className="font-medium truncate flex-1" title={property.name}>
                    {property.name}
                </span>

                <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                    {property.required && (
                        <Badge variant="secondary" className="text-xs px-1">
                            Required
                        </Badge>
                    )}
                    {isFiltered && (
                        <Badge variant="outline" className="text-xs px-1">
                            Filtered
                        </Badge>
                    )}
                    {isFrozen && (
                        <Lock className="h-3 w-3 text-blue-500" />
                    )}
                    {!property.isVisible && (
                        <EyeOff className="h-3 w-3 text-muted-foreground" />
                    )}
                </div>

                <div className="flex items-center ml-1 flex-shrink-0">
                    {getSortIcon()}
                    <MoreHorizontal className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </div>
        </PropertyHeaderMenu>
    );
}
