import React from 'react';
import { Link, LinkProps, useNavigate } from 'react-router-dom';
import { useNavLinkPreloader } from '@/hooks/useRoutePreloader';
import { cn } from '@/lib/utils';

interface OptimizedNavLinkProps extends LinkProps {
    children: React.ReactNode;
    className?: string;
    preload?: boolean;
}

export const OptimizedNavLink: React.FC<OptimizedNavLinkProps> = ({
    to,
    children,
    className,
    preload = true,
    ...props
}) => {
    const { getLinkProps } = useNavLinkPreloader();
    
    const linkProps = preload ? getLinkProps(to.toString()) : {};

    return (
        <Link
            to={to}
            className={cn(
                'transition-colors duration-200 hover:text-primary',
                className
            )}
            {...linkProps}
            {...props}
        >
            {children}
        </Link>
    );
};

// Enhanced button that preloads routes
interface OptimizedNavButtonProps {
    to: string;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    preload?: boolean;
}

export const OptimizedNavButton: React.FC<OptimizedNavButtonProps> = ({
    to,
    children,
    className,
    onClick,
    preload = true,
}) => {
    const { getLinkProps } = useNavLinkPreloader();
    const navigate = useNavigate();

    const linkProps = preload ? getLinkProps(to) : {};

    const handleClick = () => {
        if (onClick) {
            onClick();
        }
        // Navigate using React Router
        navigate(to);
    };

    return (
        <button
            className={cn(
                'transition-colors duration-200 hover:text-primary',
                className
            )}
            onClick={handleClick}
            {...linkProps}
        >
            {children}
        </button>
    );
};
