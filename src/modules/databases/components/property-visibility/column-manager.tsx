import React, { useState, useMemo } from 'react';
import { Eye, EyeOff, Columns, CheckSquare, Square, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { PropertyToggle } from './property-toggle';
import { usePropertyVisibilityState } from '../../hooks/usePropertyVisibility';
import type { DatabaseProperty, DatabaseView } from '@/types/database.types';

interface ColumnManagerProps {
    properties: DatabaseProperty[];
    currentView?: DatabaseView;
    databaseId: string;
    onToggleProperty: (propertyId: string, isVisible: boolean) => void;
    onUpdateViewVisibility: (visibleProperties: string[]) => void;
    onShowAll: () => void;
    onHideNonRequired: () => void;
    isLoading?: boolean;
    trigger?: React.ReactNode;
}

export function ColumnManager({
    properties,
    currentView,
    databaseId,
    onToggleProperty,
    onUpdateViewVisibility,
    onShowAll,
    onHideNonRequired,
    isLoading = false,
    trigger,
}: ColumnManagerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedProperties, setSelectedProperties] = useState<Set<string>>(new Set());

    const {
        visibleProperties,
        hiddenProperties,
        globallyHiddenProperties,
        viewHiddenProperties,
        visibleCount,
        totalProperties,
    } = usePropertyVisibilityState(properties, currentView);

    // Initialize selected properties when dialog opens
    React.useEffect(() => {
        if (isOpen) {
            const currentlyVisible = new Set(visibleProperties.map(p => p.id));
            setSelectedProperties(currentlyVisible);
        }
    }, [isOpen, visibleProperties]);

    const handlePropertyToggle = (propertyId: string, checked: boolean) => {
        const newSelected = new Set(selectedProperties);
        if (checked) {
            newSelected.add(propertyId);
        } else {
            newSelected.delete(propertyId);
        }
        setSelectedProperties(newSelected);
    };

    const handleSelectAll = () => {
        const allAvailableProperties = properties
            .filter(p => p.isVisible !== false)
            .map(p => p.id);
        setSelectedProperties(new Set(allAvailableProperties));
    };

    const handleSelectNone = () => {
        const requiredProperties = properties
            .filter(p => p.required && p.isVisible !== false)
            .map(p => p.id);
        setSelectedProperties(new Set(requiredProperties));
    };

    const handleReset = () => {
        const currentlyVisible = new Set(visibleProperties.map(p => p.id));
        setSelectedProperties(currentlyVisible);
    };

    const handleSave = () => {
        const newVisibleProperties = Array.from(selectedProperties);
        onUpdateViewVisibility(newVisibleProperties);
        setIsOpen(false);
    };

    const hasChanges = useMemo(() => {
        const currentVisible = new Set(visibleProperties.map(p => p.id));
        if (currentVisible.size !== selectedProperties.size) return true;
        
        for (const id of selectedProperties) {
            if (!currentVisible.has(id)) return true;
        }
        return false;
    }, [visibleProperties, selectedProperties]);

    const renderTrigger = () => {
        if (trigger) return trigger;

        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Columns className="h-4 w-4" />
                            <span className="hidden sm:inline">Columns</span>
                            <Badge variant="secondary" className="ml-1">
                                {visibleCount}/{totalProperties}
                            </Badge>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Manage column visibility</p>
                        <p className="text-xs text-muted-foreground">
                            {visibleCount} of {totalProperties} columns visible
                        </p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    };

    const renderQuickActions = () => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                    Quick Actions
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onShowAll} disabled={isLoading}>
                    <Eye className="mr-2 h-4 w-4" />
                    Show All Properties
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onHideNonRequired} disabled={isLoading}>
                    <EyeOff className="mr-2 h-4 w-4" />
                    Hide Non-Required
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSelectAll}>
                    <CheckSquare className="mr-2 h-4 w-4" />
                    Select All Available
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSelectNone}>
                    <Square className="mr-2 h-4 w-4" />
                    Select Required Only
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );

    const renderPropertyList = (propertyList: DatabaseProperty[], title: string, emptyMessage: string) => {
        if (propertyList.length === 0) {
            return (
                <div className="text-center py-4 text-muted-foreground text-sm">
                    {emptyMessage}
                </div>
            );
        }

        return (
            <div className="space-y-2">
                {propertyList.map((property) => {
                    const isSelected = selectedProperties.has(property.id);
                    const isGloballyHidden = property.isVisible === false;
                    const isViewHidden = !isGloballyHidden && !visibleProperties.find(p => p.id === property.id);

                    return (
                        <div
                            key={property.id}
                            className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50"
                        >
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => handlePropertyToggle(property.id, e.target.checked)}
                                disabled={isGloballyHidden || property.required}
                                className="rounded"
                            />
                            <PropertyToggle
                                property={property}
                                isVisible={isSelected}
                                isGloballyHidden={isGloballyHidden}
                                isViewHidden={isViewHidden}
                                onToggle={(propertyId, visible) => {
                                    if (!isGloballyHidden) {
                                        handlePropertyToggle(propertyId, visible);
                                    } else {
                                        onToggleProperty(propertyId, visible);
                                    }
                                }}
                                showLabel={true}
                                showType={true}
                                className="flex-1"
                            />
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {renderTrigger()}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Columns className="h-5 w-5" />
                        Manage Columns
                    </DialogTitle>
                    <DialogDescription>
                        Control which properties are visible in this view. 
                        Globally hidden properties need to be unhidden first.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-4">
                        <Badge variant="outline">
                            {selectedProperties.size} selected
                        </Badge>
                        <Badge variant="secondary">
                            {totalProperties} total
                        </Badge>
                    </div>
                    {renderQuickActions()}
                </div>

                <ScrollArea className="max-h-[400px] pr-4">
                    <div className="space-y-6">
                        {/* Available Properties */}
                        <div>
                            <h4 className="font-medium mb-3 flex items-center gap-2">
                                <Eye className="h-4 w-4 text-green-500" />
                                Available Properties
                                <Badge variant="outline">{properties.filter(p => p.isVisible !== false).length}</Badge>
                            </h4>
                            {renderPropertyList(
                                properties.filter(p => p.isVisible !== false),
                                "Available Properties",
                                "No properties available"
                            )}
                        </div>

                        {/* Globally Hidden Properties */}
                        {globallyHiddenProperties.length > 0 && (
                            <>
                                <Separator />
                                <div>
                                    <h4 className="font-medium mb-3 flex items-center gap-2">
                                        <EyeOff className="h-4 w-4 text-red-500" />
                                        Globally Hidden Properties
                                        <Badge variant="destructive">{globallyHiddenProperties.length}</Badge>
                                    </h4>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        These properties are hidden from all views. Click the eye icon to make them globally visible.
                                    </p>
                                    {renderPropertyList(
                                        globallyHiddenProperties,
                                        "Globally Hidden Properties",
                                        "No globally hidden properties"
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </ScrollArea>

                <DialogFooter className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={handleReset}
                        disabled={!hasChanges}
                        className="gap-2"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Reset
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!hasChanges || isLoading}
                        className="gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <CheckSquare className="h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
