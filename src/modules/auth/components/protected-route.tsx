import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import React from "react";
import {getSignInLink} from "@/app/router/router-link.ts";
import {LoadingSpinner} from "@/components/loading-spinner.tsx";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading, hasToken, isInitialized } = useAuth();
    const location = useLocation();

    if (!isInitialized || (isLoading && hasToken)) return <LoadingSpinner />

    if (!isAuthenticated) {
        localStorage.setItem('intendedPath', location.pathname);
        return <Navigate to={getSignInLink()} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;