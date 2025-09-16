import {useAuth} from "@/modules/auth/hooks/useAuth.ts";
import {Navigate, Outlet} from "react-router-dom";
import {getDashboardLink} from "@/app/router/router-link.ts";

const PublicRoute = () => {
    const { isAuthenticated, isInitialized, isLoading } = useAuth();

    // Wait for auth initialization before making routing decisions
    if (!isInitialized || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Only redirect if truly authenticated
    if (isAuthenticated) {
        return <Navigate to={getDashboardLink()} replace />;
    }

    return <Outlet />;
};

export default PublicRoute;