import React from 'react';
import { ParticleLoader } from './particle-loader.tsx';
import { cn } from '@/lib/utils.ts';

interface FullScreenLoaderProps {
    message?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'default' | 'primary' | 'muted';
    className?: string;
    overlay?: boolean;
}

export const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({
    message = 'Loading...',
    size = 'lg',
    variant = 'default',
    className,
    overlay = true,
}) => {
    return (
        <div
            className={cn(
                'fixed inset-0 z-50 flex flex-col items-center justify-center',
                overlay && 'bg-background/80 backdrop-blur-sm',
                className
            )}
        >
            <ParticleLoader size={size} variant={variant} />
            {message && (
                <p className="mt-4 text-sm text-muted-foreground animate-pulse">
                    {message}
                </p>
            )}
        </div>
    );
};

interface CenteredLoaderProps {
    message?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'default' | 'primary' | 'muted';
    className?: string;
    minHeight?: string;
}

export const CenteredLoader: React.FC<CenteredLoaderProps> = ({
    message = 'Loading...',
    size = 'md',
    variant = 'default',
    className,
    minHeight = 'min-h-64',
}) => {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center',
                minHeight,
                className
            )}
        >
            <ParticleLoader size={size} variant={variant} />
            {message && (
                <p className="mt-4 text-sm text-muted-foreground animate-pulse">
                    {message}
                </p>
            )}
        </div>
    );
};
