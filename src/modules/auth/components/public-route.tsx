import {useAuth} from "@/modules/auth/hooks/useAuth.ts";
import {Navigate, Outlet} from "react-router-dom";
import {getDashboardLink} from "@/app/router/router-link.ts";

const PublicRoute = () => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to={getDashboardLink()} replace />;
    }

    return <Outlet />;
};

export default PublicRoute;