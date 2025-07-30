import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from "@/modules/auth/types/auth.types.ts";

interface AuthState {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
    isAuthenticated: boolean;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,

            setUser: (user) => set({
                user,
                isAuthenticated: true
            }),

            clearUser: () => set({
                user: null,
                isAuthenticated: false
            }),
        }),
        {
            name: 'auth-storage',
            // Only persist authentication state, not user data
            // User data is kept in memory only and fetched fresh from API
            partialize: (state) => ({
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
);