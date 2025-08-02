import React, { useState } from 'react';
import { ChevronDown, ChevronRight, EyeOff, Eye, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { PropertyToggle } from './property-toggle';
import { usePropertyVisibilityState } from '../../hooks/usePropertyVisibility';
import type { DatabaseProperty, DatabaseView } from '@/types/database.types';

interface HiddenPropertiesPanelProps {
    properties: DatabaseProperty[];
    currentView?: DatabaseView;
    onToggleProperty: (propertyId: string, isVisible: boolean) => void;
    onRestoreAllGlobal: () => void;
    onRestoreAllView: () => void;
    isLoading?: boolean;
    className?: string;
}

export function HiddenPropertiesPanel({
    properties,
    currentView,
    onToggleProperty,
    onRestoreAllGlobal,
    onRestoreAllView,
    isLoading = false,
    className,
}: HiddenPropertiesPanelProps) {
    const [isGlobalExpanded, setIsGlobalExpanded] = useState(false);
    const [isViewExpanded, setIsViewExpanded] = useState(false);

    const {
        globallyHiddenProperties,
        viewHiddenProperties,
        hiddenCount,
    } = usePropertyVisibilityState(properties, currentView);

    // Don't render if no hidden properties
    if (hiddenCount === 0) {
        return null;
    }

    const renderPropertyList = (
        propertyList: DatabaseProperty[],
        isGloballyHidden: boolean,
        emptyMessage: string
    ) => {
        if (propertyList.length === 0) {
            return (
                <div className="text-center py-4 text-muted-foreground text-sm">
                    {emptyMessage}
                </div>
            );
        }

        return (
            <div className="space-y-2">
                {propertyList.map((property) => (
                    <div
                        key={property.id}
                        className="flex items-center gap-2 p-2 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                        <PropertyToggle
                            property={property}
                            isVisible={false}
                            isGloballyHidden={isGloballyHidden}
                            isViewHidden={!isGloballyHidden}
                            onToggle={onToggleProperty}
                            isLoading={isLoading}
                            showLabel={true}
                            showType={true}
                            className="flex-1"
                        />
                        
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                                        onClick={() => onToggleProperty(property.id, true)}
                                        disabled={isLoading}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>
                                        {isGloballyHidden 
                                            ? 'Make visible globally' 
                                            : 'Show in current view'
                                        }
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                ))}
            </div>
        );
    };

    const renderSection = (
        title: string,
        count: number,
        isExpanded: boolean,
        onToggleExpanded: (expanded: boolean) => void,
        onRestoreAll: () => void,
        children: React.ReactNode,
        description: string,
        badgeVariant: "destructive" | "outline" = "outline"
    ) => (
        <Collapsible open={isExpanded} onOpenChange={onToggleExpanded}>
            <div className="flex items-center justify-between">
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 p-0 h-auto">
                        {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                        ) : (
                            <ChevronRight className="h-4 w-4" />
                        )}
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{title}</span>
                        <Badge variant={badgeVariant} className="ml-2">
                            {count}
                        </Badge>
                    </Button>
                </CollapsibleTrigger>
                
                {count > 0 && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                    onClick={onRestoreAll}
                                    disabled={isLoading}
                                >
                                    <RotateCcw className="h-3 w-3" />
                                    Restore All
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Restore all {title.toLowerCase()}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>
            
            <CollapsibleContent className="mt-3">
                <p className="text-sm text-muted-foreground mb-3">
                    {description}
                </p>
                {children}
            </CollapsibleContent>
        </Collapsible>
    );

    return (
        <div className={`space-y-4 p-4 border rounded-lg bg-muted/20 ${className}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-medium">Hidden Properties</h3>
                    <Badge variant="outline">{hiddenCount} hidden</Badge>
                </div>
                
                <TooltipProvider>
                    <Tooltip>
                        <TooltipContent>
                            <div className="space-y-1">
                                <p className="font-medium">Hidden Properties</p>
                                <p className="text-xs text-muted-foreground">
                                    Properties that are not currently visible in this view
                                </p>
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <div className="space-y-4">
                {/* Globally Hidden Properties */}
                {globallyHiddenProperties.length > 0 && (
                    <>
                        {renderSection(
                            "Globally Hidden Properties",
                            globallyHiddenProperties.length,
                            isGlobalExpanded,
                            setIsGlobalExpanded,
                            onRestoreAllGlobal,
                            renderPropertyList(
                                globallyHiddenProperties,
                                true,
                                "No globally hidden properties"
                            ),
                            "These properties are hidden from all views. Making them visible will show them globally.",
                            "destructive"
                        )}
                        
                        {viewHiddenProperties.length > 0 && <Separator />}
                    </>
                )}

                {/* View Hidden Properties */}
                {viewHiddenProperties.length > 0 && (
                    renderSection(
                        "Hidden in Current View",
                        viewHiddenProperties.length,
                        isViewExpanded,
                        setIsViewExpanded,
                        onRestoreAllView,
                        renderPropertyList(
                            viewHiddenProperties,
                            false,
                            "No properties hidden in current view"
                        ),
                        "These properties are hidden only in this view. They remain visible in other views.",
                        "outline"
                    )
                )}
            </div>

            {/* Help Text */}
            <div className="mt-4 p-3 bg-muted/50 rounded-md">
                <p className="text-xs text-muted-foreground">
                    <strong>Tip:</strong> Use the eye icons to quickly restore individual properties, 
                    or use "Restore All" buttons to show multiple properties at once.
                </p>
            </div>
        </div>
    );
}
