import {useAuth} from "@/modules/auth/hooks/useAuth.ts";
import {Navigate, Outlet} from "react-router-dom";
import {getDashboardLink} from "@/app/router/router-link.ts";
import {LoadingSpinner} from "@/components/loading-spinner.tsx";

const PublicRoute = () => {
    const { isAuthenticated, isInitialized, isLoading } = useAuth();

    // Wait for auth initialization before making routing decisions
    if (!isInitialized || isLoading) return <LoadingSpinner/>


    // Only redirect if truly authenticated
    if (isAuthenticated) {
        return <Navigate to={getDashboardLink()} replace />;
    }

    return <Outlet />;
};

export default PublicRoute;