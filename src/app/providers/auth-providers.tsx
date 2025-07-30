import { type ReactNode } from 'react';
import { FullScreenLoader } from "@/components/loader/full-screen-loader.tsx";
import { useAuth } from "@/modules/auth/hooks/useAuth.ts";

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const { isLoading, hasToken } = useAuth();

    if (hasToken && isLoading) {
        return (
            <FullScreenLoader
                message="Authenticating..."
                size="lg"
                variant="primary"
            />
        );
    }

    return <>{children}</>;
};
