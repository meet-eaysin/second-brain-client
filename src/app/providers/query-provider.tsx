import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { ReactNode } from "react";
import { toast } from "sonner";
import type { AxiosError } from "axios";

type QueryError = Error | AxiosError;

const isAxiosError = (error: QueryError): error is AxiosError => {
  return (error as AxiosError).response !== undefined;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (
          isAxiosError(error) &&
          error.response?.status &&
          error.response.status >= 400 &&
          error.response.status < 500
        ) {
          return false;
        }
        return failureCount < 1;
      },
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchInterval: false,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      networkMode: "online",
    },
    mutations: {
      retry: (failureCount, error) => {
        if (
          isAxiosError(error) &&
          error.response?.status &&
          error.response.status >= 400 &&
          error.response.status < 500
        ) {
          return false;
        }
        return failureCount < 1;
      },
      networkMode: "online",
      onError: (error) => {
        if (!navigator.onLine) {
          toast.error("You're offline. Please check your internet connection.");
        } else if (isAxiosError(error)) {
          if (error.response?.status && error.response.status >= 500) {
            toast.error("Server error. Please try again later.");
          } else if (error.response?.status && error.response.status === 401) {
            toast.error("Session expired. Please log in again.");
          } else if (error.code === "NETWORK_ERROR" || !error.response) {
            toast.error("Network error. Please check your connection.");
          }
        } else {
          toast.error("Network error. Please check your connection.");
        }
      },
    },
  },
});

export const QueryProvider = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
