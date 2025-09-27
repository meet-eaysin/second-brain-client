import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import React from "react";
import { getSignInLink } from "@/app/router/router-link.ts";
import { LoadingSpinner } from "@/components/loading-spinner.tsx";
import { useAuthStore } from "@/modules/auth/store/auth-store.ts";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, hasToken, isInitialized } = useAuth();
  const { user } = useAuthStore();
  const location = useLocation();

  if (!isInitialized || (isLoading && hasToken)) return <LoadingSpinner />;

  if (!isAuthenticated) {
    localStorage.setItem("intendedPath", location.pathname);
    return <Navigate to={getSignInLink()} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
