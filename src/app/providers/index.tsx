import { QueryProvider } from './QueryProvider';
import { ErrorBoundary } from './error-boundary.tsx';
import type { ReactNode } from "react";
import { ThemeProvider } from "@/context/theme-context.tsx";
import { FontProvider } from "@/context/font-context.tsx";
import { AuthProvider } from "@/app/providers/auth-providers.tsx";
import {Toaster} from "@/components/ui/sonner.tsx";

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
                            <Toaster />
                        </AuthProvider>
                    </FontProvider>
                </ThemeProvider>
            </QueryProvider>
        </ErrorBoundary>
    );
};