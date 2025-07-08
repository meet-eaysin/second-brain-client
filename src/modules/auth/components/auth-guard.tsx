import { type ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from "@/components/loading-spinner.tsx";
import { useAuth } from "@/modules/auth/hooks/useAuth.ts";
import {getSignInLink} from "@/app/router/router-link.ts";

interface AuthGuardProps {
    children: ReactNode;
    redirectTo?: string;
}

export const AuthGuard = ({ children, redirectTo = getSignInLink() }: AuthGuardProps) => {
    const { isAuthenticated, isLoading, hasToken } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!hasToken && !isLoading) {
            navigate(redirectTo);
            return;
        }

        if (hasToken && !isAuthenticated && !isLoading) {
            navigate(redirectTo);
        }
    }, [isAuthenticated, isLoading, hasToken, navigate, redirectTo]);

    if (hasToken && isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
};
