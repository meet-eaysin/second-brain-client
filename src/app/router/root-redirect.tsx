import { Navigate } from "react-router-dom";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { getAppLink, getSignInLink } from "@/app/router/router-link";
import { LoadingSpinner } from "@/components/loading-spinner";

export const RootRedirect = () => {
  const { isAuthenticated, isInitialized, isLoading } = useAuth();

  // Wait for auth initialization before making routing decisions
  if (!isInitialized || isLoading) {
    return <LoadingSpinner />;
  }

  // If authenticated, redirect to app
  if (isAuthenticated) {
    return <Navigate to={getAppLink()} replace />;
  }

  // If not authenticated, redirect to sign-in
  return <Navigate to={getSignInLink()} replace />;
};