import React from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface TooltipWrapperProps {
    children: React.ReactNode;
    content: string;
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
    delayDuration?: number;
    disabled?: boolean;
}

export const TooltipWrapper: React.FC<TooltipWrapperProps> = ({
    children,
    content,
    side = 'top',
    align = 'center',
    delayDuration = 300,
    disabled = false,
}) => {
    if (disabled || !content) {
        return <>{children}</>;
    }

    return (
        <TooltipProvider delayDuration={delayDuration}>
            <Tooltip>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent side={side} align={align}>
                    <p className="text-sm">{content}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
