import { type ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoadingSpinner } from "@/components/loading-spinner.tsx";
import { useAuth } from "@/modules/auth/hooks/useAuth.ts";
import { useAuthStore } from '../store/authStore';
import {getSignInLink} from "@/app/router/router-link.ts";

interface AuthGuardProps {
    children: ReactNode;
    redirectTo?: string;
    requiredRole?: string;
}

export const AuthGuard = ({
    children,
    redirectTo = getSignInLink(),
    requiredRole
}: AuthGuardProps) => {
    const { isAuthenticated, isLoading, hasToken, user } = useAuth();
    const { setIntendedPath } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Store intended path for post-login redirect
        if (!isAuthenticated && !hasToken) {
            const currentPath = location.pathname + location.search;
            if (currentPath !== redirectTo && currentPath !== '/auth/sign-up') {
                setIntendedPath(currentPath);
            }
        }

        if (!hasToken && !isLoading) {
            navigate(redirectTo, { replace: true });
            return;
        }

        if (hasToken && !isAuthenticated && !isLoading) {
            navigate(redirectTo, { replace: true });
            return;
        }

        // Check role-based access
        if (isAuthenticated && requiredRole && user) {
            const userRole = user.role?.toLowerCase();
            const required = requiredRole.toLowerCase();

            // Simple role hierarchy: user < moderator < admin
            const roleHierarchy = { user: 1, moderator: 2, admin: 3 };
            const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
            const requiredLevel = roleHierarchy[required as keyof typeof roleHierarchy] || 0;

            if (userLevel < requiredLevel) {
                navigate('/unauthorized', { replace: true });
                return;
            }
        }
    }, [isAuthenticated, isLoading, hasToken, navigate, redirectTo, location, setIntendedPath, requiredRole, user]);

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
