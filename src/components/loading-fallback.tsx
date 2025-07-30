import React from 'react';
import { CenteredLoader } from './loader/full-screen-loader.tsx';

interface LoadingFallbackProps {
    message?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'default' | 'primary' | 'muted';
    minHeight?: string;
}

export const LoadingFallback: React.FC<LoadingFallbackProps> = ({
    message = 'Loading...',
    size = 'md',
    variant = 'default',
    minHeight = 'min-h-[400px]'
}) => (
    <CenteredLoader
        message={message}
        size={size}
        variant={variant}
        minHeight={minHeight}
    />
);