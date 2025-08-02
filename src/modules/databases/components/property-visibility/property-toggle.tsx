import React from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { DatabaseProperty } from '@/types/database.types';

interface PropertyToggleProps {
    property: DatabaseProperty;
    isVisible: boolean;
    isGloballyHidden?: boolean;
    isViewHidden?: boolean;
    onToggle: (propertyId: string, isVisible: boolean) => void;
    isLoading?: boolean;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    showType?: boolean;
    className?: string;
}

const PROPERTY_TYPE_ICONS = {
    TEXT: '📝',
    NUMBER: '🔢',
    EMAIL: '📧',
    URL: '🔗',
    PHONE: '📞',
    CHECKBOX: '☑️',
    DATE: '📅',
    SELECT: '📋',
    MULTI_SELECT: '🏷️',
} as const;

export function PropertyToggle({
    property,
    isVisible,
    isGloballyHidden = false,
    isViewHidden = false,
    onToggle,
    isLoading = false,
    size = 'md',
    showLabel = true,
    showType = false,
    className,
}: PropertyToggleProps) {
    const handleToggle = () => {
        if (isLoading) return;
        onToggle(property.id, !isVisible);
    };

    const getTooltipContent = () => {
        if (isGloballyHidden) {
            return (
                <div className="space-y-1">
                    <p className="font-medium">Globally Hidden Property</p>
                    <p className="text-xs text-muted-foreground">
                        This property is hidden from all views. Click to make it visible globally.
                    </p>
                </div>
            );
        }

        if (isViewHidden) {
            return (
                <div className="space-y-1">
                    <p className="font-medium">Hidden in Current View</p>
                    <p className="text-xs text-muted-foreground">
                        This property is hidden in this view only. Click to show it in this view.
                    </p>
                </div>
            );
        }

        if (isVisible) {
            return (
                <div className="space-y-1">
                    <p className="font-medium">Visible Property</p>
                    <p className="text-xs text-muted-foreground">
                        This property is currently visible. Click to hide it.
                    </p>
                </div>
            );
        }

        return (
            <div className="space-y-1">
                <p className="font-medium">Hidden Property</p>
                <p className="text-xs text-muted-foreground">
                    This property is currently hidden. Click to show it.
                </p>
            </div>
        );
    };

    const getButtonSize = () => {
        switch (size) {
            case 'sm':
                return 'h-6 w-6';
            case 'lg':
                return 'h-10 w-10';
            default:
                return 'h-8 w-8';
        }
    };

    const getIconSize = () => {
        switch (size) {
            case 'sm':
                return 'h-3 w-3';
            case 'lg':
                return 'h-5 w-5';
            default:
                return 'h-4 w-4';
        }
    };

    const getStatusColor = () => {
        if (isGloballyHidden) return 'text-red-500 hover:text-red-600';
        if (isViewHidden) return 'text-orange-500 hover:text-orange-600';
        if (isVisible) return 'text-green-500 hover:text-green-600';
        return 'text-muted-foreground hover:text-foreground';
    };

    const renderIcon = () => {
        if (isLoading) {
            return <Loader2 className={cn(getIconSize(), 'animate-spin')} />;
        }

        return isVisible ? (
            <Eye className={getIconSize()} />
        ) : (
            <EyeOff className={getIconSize()} />
        );
    };

    const renderContent = () => {
        if (!showLabel) {
            return (
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                        getButtonSize(),
                        'p-0',
                        getStatusColor(),
                        isLoading && 'cursor-not-allowed',
                        className
                    )}
                    onClick={handleToggle}
                    disabled={isLoading}
                >
                    {renderIcon()}
                </Button>
            );
        }

        return (
            <div className={cn('flex items-center gap-2', className)}>
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                        getButtonSize(),
                        'p-0',
                        getStatusColor(),
                        isLoading && 'cursor-not-allowed'
                    )}
                    onClick={handleToggle}
                    disabled={isLoading}
                >
                    {renderIcon()}
                </Button>

                <div className="flex items-center gap-2 min-w-0 flex-1">
                    {showType && (
                        <span className="text-lg" title={property.type}>
                            {PROPERTY_TYPE_ICONS[property.type] || '📄'}
                        </span>
                    )}
                    
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <span className={cn(
                                'font-medium truncate',
                                !isVisible && 'text-muted-foreground'
                            )}>
                                {property.name}
                            </span>
                            
                            {property.required && (
                                <Badge variant="secondary" className="text-xs px-1 py-0">
                                    Required
                                </Badge>
                            )}
                        </div>
                        
                        {property.description && (
                            <p className="text-xs text-muted-foreground truncate">
                                {property.description}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-1">
                        {isGloballyHidden && (
                            <Badge variant="destructive" className="text-xs px-1 py-0">
                                Hidden
                            </Badge>
                        )}
                        
                        {isViewHidden && (
                            <Badge variant="outline" className="text-xs px-1 py-0">
                                View Hidden
                            </Badge>
                        )}
                        
                        {showType && (
                            <Badge variant="outline" className="text-xs px-1 py-0">
                                {property.type}
                            </Badge>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    {renderContent()}
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                    {getTooltipContent()}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
