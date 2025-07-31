import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from "@/modules/auth/types/auth.types.ts";

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    intendedPath: string | null;

    // Actions
    setUser: (user: User) => void;
    clearUser: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setIntendedPath: (path: string | null) => void;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            intendedPath: null,

            setUser: (user) => set({
                user,
                isAuthenticated: true,
                error: null
            }),

            clearUser: () => set({
                user: null,
                isAuthenticated: false,
                error: null
            }),

            setLoading: (loading) => set({ isLoading: loading }),

            setError: (error) => set({ error }),

            clearError: () => set({ error: null }),

            setIntendedPath: (path) => set({ intendedPath: path }),
        }),
        {
            name: 'auth-storage',
            // Only persist authentication state and intended path
            // User data is kept in memory only and fetched fresh from API
            partialize: (state) => ({
                isAuthenticated: state.isAuthenticated,
                intendedPath: state.intendedPath
            }),
        }
    )
);