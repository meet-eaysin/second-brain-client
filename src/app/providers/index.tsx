import { QueryProvider } from './QueryProvider';
import { ErrorBoundary } from './ErrorBoundary';
import type { ReactNode } from "react";
import { ThemeProvider } from "@/context/theme-context.tsx";
import { FontProvider } from "@/context/font-context.tsx";
import { AuthProvider } from "@/app/providers/auth-providers.tsx";

interface AppProvidersProps {
    children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
    return (
        <ErrorBoundary>
            <QueryProvider>
                <ThemeProvider>
                    <FontProvider>
                        <AuthProvider>
                            {children}
                        </AuthProvider>
                    </FontProvider>
                </ThemeProvider>
            </QueryProvider>
        </ErrorBoundary>
    );
};