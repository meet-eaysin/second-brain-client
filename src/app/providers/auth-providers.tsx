import { type ReactNode } from "react";
import { LoadingSpinner } from "@/components/loading-spinner.tsx";
import { useAuth } from "@/modules/auth/hooks/useAuth.ts";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { isLoading, hasToken, isInitialized } = useAuth();

  if (hasToken && !isInitialized && isLoading) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
};
