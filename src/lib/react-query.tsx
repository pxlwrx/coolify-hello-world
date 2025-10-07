"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface ReactQueryProviderProps {
  children: React.ReactNode;
}

/**
 * Creates and configures a new QueryClient instance with optimized default settings
 * for the system info application
 */
const createQueryClient = (): QueryClient => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000, // 30 seconds
        gcTime: 5 * 60 * 1000, // 5 minutes
        retry: (failureCount: number, error: Error) => {
          // Don't retry on 4xx errors
          if (error && "status" in error) {
            const status = (error as any).status;
            if (status >= 400 && status < 500) {
              return false;
            }
          }
          return failureCount < 3;
        },
        retryDelay: (attemptIndex: number) =>
          Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: false,
      },
    },
  });
};

let browserQueryClient: QueryClient | undefined = undefined;

/**
 * Gets or creates a QueryClient instance
 * Ensures we don't create multiple clients in the browser
 */
const getQueryClient = (): QueryClient => {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return createQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    if (!browserQueryClient) {
      browserQueryClient = createQueryClient();
    }
    return browserQueryClient;
  }
};

/**
 * React Query provider component that wraps the application with QueryClientProvider
 * Provides React Query functionality to all child components
 */
export const ReactQueryProvider: React.FC<ReactQueryProviderProps> = ({
  children,
}) => {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
