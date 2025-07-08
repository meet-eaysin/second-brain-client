import {useAuth} from "@/modules/auth/hooks/useAuth.ts";
import {Navigate} from "react-router-dom";
import React from "react";
import {getDashboardLink} from "@/app/router/router-link.ts";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to={getDashboardLink()} replace />;
    }

    return <>{children}</>;
};

export default PublicRoute;