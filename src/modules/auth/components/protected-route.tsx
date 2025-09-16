import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { LoadingSpinner } from '@/components/loading-spinner';
import React from "react";
import {getSignInLink} from "@/app/router/router-link.ts";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading, hasToken, isInitialized } = useAuth();
    const location = useLocation();

    // Show loading while initializing auth or while loading with token
    if (!isInitialized || (isLoading && hasToken)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    // If not authenticated after initialization, redirect to login
    if (!isAuthenticated) {
        localStorage.setItem('intendedPath', location.pathname);
        return <Navigate to={getSignInLink()} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;