import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { LoadingSpinner } from '@/components/loading-spinner';
import React from "react";
import {getSignInLink} from "@/app/router/router-link.ts";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading, hasToken } = useAuth();
    const location = useLocation();

    if (isLoading && hasToken) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!isAuthenticated) {
        localStorage.setItem('intendedPath', location.pathname);
        return <Navigate to={getSignInLink()} />;
    }

    return <>{children}</>;
};