import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type {ReactNode} from "react";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,                 // Completely disable retries
            refetchOnWindowFocus: false,  // Never refetch on focus
            refetchOnMount: false,        // Never refetch on mount
            refetchOnReconnect: false,    // Never refetch on reconnect
            refetchInterval: false,       // No automatic intervals
            staleTime: Infinity,          // Never consider data stale
            gcTime: Infinity,             // Never garbage collect
            networkMode: 'online',        // Only when online
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
