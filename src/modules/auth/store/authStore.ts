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
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
);