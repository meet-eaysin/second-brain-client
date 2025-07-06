import { QueryProvider } from './QueryProvider'
import { ErrorBoundary } from './ErrorBoundary'
import type {ReactNode} from "react";

interface AppProvidersProps {
    children: ReactNode
}

export const AppProviders = ({ children }: AppProvidersProps) => {
    return (
        <ErrorBoundary>
            <QueryProvider>
                {children}
            </QueryProvider>
        </ErrorBoundary>
    )
}
