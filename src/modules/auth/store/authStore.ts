import type {User} from "@/modules/auth/types/auth.types.ts";
import {create} from "zustand";

interface AuthStore {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
    hasToken: boolean
    error: string | null
    setUser: (user: User | null) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    logout: () => void
    reset: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    isLoading: false,
    isAuthenticated: false,
    hasToken: false,
    error: null,

    setUser: (user) => set({
        user,
        isAuthenticated: !!user
    }),

    setLoading: (loading) => set({
        isLoading: loading
    }),

    setError: (error) => set({
        error
    }),

    logout: () => set({
        user: null,
        isAuthenticated: false,
        hasToken: false
    }),

    reset: () => set({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        hasToken: false,
        error: null
    })
}))
