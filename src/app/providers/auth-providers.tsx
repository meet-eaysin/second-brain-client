import { type ReactNode } from 'react';
import { LoadingSpinner } from "@/components/loading-spinner.tsx";
import { useAuth } from "@/modules/auth/hooks/useAuth.ts";

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const { isLoading, hasToken } = useAuth();

    if (hasToken && isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return <>{children}</>;
};
