import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from "@/modules/auth/types/auth.types.ts";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  intendedPath: string | null;

  // Actions
  setUser: (user: User) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setIntendedPath: (path: string | null) => void;
  clearError: () => void;
  setInitialized: (initialized: boolean) => void; // ✅ New action
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,
      error: null,
      intendedPath: null,

      setUser: (user) => set({
        user,
        isAuthenticated: true,
        error: null,
        isInitialized: true
      }),

      clearUser: () => set({
        user: null,
        isAuthenticated: false,
        error: null,
        isInitialized: true
      }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({
        error,
        isInitialized: true
      }),

      clearError: () => set({ error: null }),

      setIntendedPath: (path) => set({ intendedPath: path }),

      setInitialized: (initialized) => set({ isInitialized: initialized }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        // Only persist intendedPath, not auth state or user data
        intendedPath: state.intendedPath
      }),
    }
  )
);