import React from 'react';
import { cn } from '@/lib/utils.ts';
import './particle-loader.css';

interface ParticleLoaderProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    centered?: boolean;
    variant?: 'default' | 'primary' | 'muted';
}

export const ParticleLoader: React.FC<ParticleLoaderProps> = ({
    size = 'md',
    className,
    centered = true,
    variant = 'default'
}) => {
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-11 h-11', // 45px default
        lg: 'w-16 h-16',
        xl: 'w-20 h-20',
    };

    const containerClasses = cn(
        'particle-loader-container',
        sizeClasses[size],
        centered && 'mx-auto',
        variant === 'primary' && 'particle-loader-primary',
        variant === 'muted' && 'particle-loader-muted',
        className
    );

    return (
        <div className={containerClasses}>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
        </div>
    );
};

