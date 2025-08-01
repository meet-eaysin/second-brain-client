import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type {ReactNode} from "react";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,                     // Retry once on failure
            refetchOnWindowFocus: false,  // Don't refetch on focus
            refetchOnMount: true,         // Refetch on mount (important for fresh data)
            refetchOnReconnect: true,     // Refetch when reconnected
            refetchInterval: false,       // No automatic intervals
            staleTime: 5 * 60 * 1000,     // 5 minutes stale time
            gcTime: 10 * 60 * 1000,       // 10 minutes garbage collection
            networkMode: 'online',        // Only when online
        },
        mutations: {
            retry: 1,                     // Retry mutations once
            networkMode: 'online',
        },
    },
})

interface QueryProviderProps {
    children: ReactNode
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}
