import React from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, LucideIcon } from 'lucide-react';
import type { DatabaseRecord } from '@/types/database.types';

export interface ActionConfig {
    id: string;
    label: string;
    icon?: LucideIcon;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    onClick: (record: DatabaseRecord) => void | Promise<void>;
    isVisible?: (record: DatabaseRecord) => boolean;
    isDisabled?: (record: DatabaseRecord) => boolean;
    isDestructive?: boolean;
    requiresConfirmation?: boolean;
    confirmationMessage?: string;
    tooltip?: string;
    badge?: {
        text: string;
        variant?: 'default' | 'secondary' | 'destructive' | 'outline';
    };
    group?: string; // For grouping actions in dropdown
}

export interface ToolbarActionConfig {
    id: string;
    label: string;
    icon?: LucideIcon;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    onClick: (records: DatabaseRecord[]) => void | Promise<void>;
    requiresSelection?: boolean;
    isVisible?: (records: DatabaseRecord[]) => boolean;
    isDisabled?: (records: DatabaseRecord[]) => boolean;
    isDestructive?: boolean;
    requiresConfirmation?: boolean;
    confirmationMessage?: string;
    tooltip?: string;
    badge?: {
        text: string;
        variant?: 'default' | 'secondary' | 'destructive' | 'outline';
    };
    position?: 'left' | 'right'; // Position in toolbar
}

interface ActionRendererProps {
    actions: ActionConfig[];
    record: DatabaseRecord;
    maxVisibleActions?: number;
    onActionClick?: (actionId: string, record: DatabaseRecord) => void;
}

export function ActionRenderer({
    actions,
    record,
    maxVisibleActions = 2,
    onActionClick,
}: ActionRendererProps) {
    // Filter visible actions
    const visibleActions = actions.filter(action => 
        !action.isVisible || action.isVisible(record)
    );

    if (visibleActions.length === 0) {
        return null;
    }

    // Split actions into primary (visible) and secondary (in dropdown)
    const primaryActions = visibleActions.slice(0, maxVisibleActions);
    const secondaryActions = visibleActions.slice(maxVisibleActions);

    const handleActionClick = async (action: ActionConfig) => {
        try {
            if (action.requiresConfirmation) {
                const confirmed = window.confirm(
                    action.confirmationMessage || `Are you sure you want to ${action.label.toLowerCase()}?`
                );
                if (!confirmed) return;
            }

            await action.onClick(record);
            
            if (onActionClick) {
                onActionClick(action.id, record);
            }
        } catch (error) {
            console.error(`Error executing action ${action.id}:`, error);
        }
    };

    return (
        <div className="flex items-center gap-1">
            {/* Primary actions */}
            {primaryActions.map((action) => {
                const Icon = action.icon;
                const isDisabled = action.isDisabled?.(record) || false;
                
                return (
                    <Button
                        key={action.id}
                        variant={action.variant || 'ghost'}
                        size={action.size || 'sm'}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleActionClick(action);
                        }}
                        disabled={isDisabled}
                        title={action.tooltip}
                        className={action.isDestructive ? 'text-destructive hover:text-destructive' : ''}
                    >
                        {Icon && <Icon className="h-4 w-4" />}
                        {action.size !== 'icon' && (
                            <>
                                {Icon && <span className="ml-1">{action.label}</span>}
                                {!Icon && action.label}
                            </>
                        )}
                        {action.badge && (
                            <Badge 
                                variant={action.badge.variant || 'secondary'} 
                                className="ml-1"
                            >
                                {action.badge.text}
                            </Badge>
                        )}
                    </Button>
                );
            })}

            {/* Secondary actions in dropdown */}
            {secondaryActions.length > 0 && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {renderDropdownActions(secondaryActions, record, handleActionClick)}
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    );
}

function renderDropdownActions(
    actions: ActionConfig[], 
    record: DatabaseRecord, 
    handleActionClick: (action: ActionConfig) => void
) {
    // Group actions if they have groups
    const groupedActions = actions.reduce((groups, action) => {
        const group = action.group || 'default';
        if (!groups[group]) {
            groups[group] = [];
        }
        groups[group].push(action);
        return groups;
    }, {} as Record<string, ActionConfig[]>);

    const groupNames = Object.keys(groupedActions);
    
    return groupNames.map((groupName, groupIndex) => (
        <React.Fragment key={groupName}>
            {groupIndex > 0 && <DropdownMenuSeparator />}
            {groupedActions[groupName].map((action) => {
                const Icon = action.icon;
                const isDisabled = action.isDisabled?.(record) || false;
                
                return (
                    <DropdownMenuItem
                        key={action.id}
                        onClick={() => handleActionClick(action)}
                        disabled={isDisabled}
                        className={action.isDestructive ? 'text-destructive focus:text-destructive' : ''}
                    >
                        {Icon && <Icon className="mr-2 h-4 w-4" />}
                        {action.label}
                        {action.badge && (
                            <Badge 
                                variant={action.badge.variant || 'secondary'} 
                                className="ml-auto"
                            >
                                {action.badge.text}
                            </Badge>
                        )}
                    </DropdownMenuItem>
                );
            })}
        </React.Fragment>
    ));
}

interface ToolbarActionRendererProps {
    actions: ToolbarActionConfig[];
    selectedRecords: DatabaseRecord[];
    onActionClick?: (actionId: string, records: DatabaseRecord[]) => void;
}

export function ToolbarActionRenderer({
    actions,
    selectedRecords,
    onActionClick,
}: ToolbarActionRendererProps) {
    // Filter visible actions
    const visibleActions = actions.filter(action => 
        !action.isVisible || action.isVisible(selectedRecords)
    );

    // Split actions by position
    const leftActions = visibleActions.filter(action => action.position !== 'right');
    const rightActions = visibleActions.filter(action => action.position === 'right');

    const handleActionClick = async (action: ToolbarActionConfig) => {
        try {
            if (action.requiresSelection && selectedRecords.length === 0) {
                return;
            }

            if (action.requiresConfirmation) {
                const confirmed = window.confirm(
                    action.confirmationMessage || `Are you sure you want to ${action.label.toLowerCase()}?`
                );
                if (!confirmed) return;
            }

            await action.onClick(selectedRecords);
            
            if (onActionClick) {
                onActionClick(action.id, selectedRecords);
            }
        } catch (error) {
            console.error(`Error executing toolbar action ${action.id}:`, error);
        }
    };

    const renderAction = (action: ToolbarActionConfig) => {
        const Icon = action.icon;
        const isDisabled = action.isDisabled?.(selectedRecords) || 
                          (action.requiresSelection && selectedRecords.length === 0);
        
        return (
            <Button
                key={action.id}
                variant={action.variant || 'outline'}
                size={action.size || 'sm'}
                onClick={() => handleActionClick(action)}
                disabled={isDisabled}
                title={action.tooltip}
                className={action.isDestructive ? 'text-destructive hover:text-destructive' : ''}
            >
                {Icon && <Icon className="h-4 w-4" />}
                {action.size !== 'icon' && (
                    <>
                        {Icon && <span className="ml-1">{action.label}</span>}
                        {!Icon && action.label}
                    </>
                )}
                {action.badge && (
                    <Badge 
                        variant={action.badge.variant || 'secondary'} 
                        className="ml-1"
                    >
                        {action.badge.text}
                    </Badge>
                )}
            </Button>
        );
    };

    return (
        <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
                {leftActions.map(renderAction)}
            </div>
            <div className="flex items-center gap-2">
                {rightActions.map(renderAction)}
            </div>
        </div>
    );
}

// Export types for external use
export type { ActionConfig as CustomAction, ToolbarActionConfig as ToolbarAction };
