import { QueryProvider } from './QueryProvider'
import { ErrorBoundary } from './ErrorBoundary'
import type {ReactNode} from "react";
import {ThemeProvider} from "@/context/theme-context.tsx";
import {FontProvider} from "@/context/font-context.tsx";

interface AppProvidersProps {
    children: ReactNode
}

export const AppProviders = ({ children }: AppProvidersProps) => {
    return (
        <ErrorBoundary>
            <QueryProvider>
                <ThemeProvider>
                    <FontProvider >
                        {children}
                    </FontProvider>
                </ThemeProvider>
            </QueryProvider>
        </ErrorBoundary>
    )
}
