import React from 'react';
import { ParticleLoader } from './loader/particle-loader.tsx';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'default' | 'primary' | 'muted';
    className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    variant = 'default',
    className
}) => {
    return (
        <div className="flex justify-center items-center">
            <ParticleLoader size={size} variant={variant} className={className} />
        </div>
    );
};
