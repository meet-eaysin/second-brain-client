import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/modules/auth/types/auth.types.ts";
import type { Workspace } from "@/modules/workspaces/types/workspaces.types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  intendedPath: string | null;

  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  workspaceLoading: boolean;
  needsWorkspaceSetup: boolean;
  showWorkspaceSetupWizard: boolean;

  setUser: (user: User) => void;
  updateUser: (user: User) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setIntendedPath: (path: string | null) => void;
  clearError: () => void;
  setInitialized: (initialized: boolean) => void;

  setWorkspaces: (workspaces: Workspace[]) => void;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  setWorkspaceLoading: (loading: boolean) => void;
  setNeedsWorkspaceSetup: (needsSetup: boolean) => void;
  setShowWorkspaceSetupWizard: (show: boolean) => void;
  addWorkspace: (workspace: Workspace) => void;
  updateWorkspace: (id: string, workspace: Workspace) => void;
  removeWorkspace: (id: string) => void;
  completeWorkspaceSetup: (workspace: Workspace) => void;
  skipWorkspaceSetup: () => void;
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

      workspaces: [],
      currentWorkspace: null,
      workspaceLoading: false,
      needsWorkspaceSetup: false,
      showWorkspaceSetupWizard: false,

      setUser: (user) =>
        set((state) => {
          const userWorkspaces = user.workspaces || [];
          const storeWorkspaces = state.workspaces || [];
          const totalWorkspaces = Math.max(
            userWorkspaces.length,
            storeWorkspaces.length
          );
          const hasNoWorkspaces = totalWorkspaces === 0;

          let shouldShowWizard = false;
          if (state.showWorkspaceSetupWizard && hasNoWorkspaces)
            shouldShowWizard = true;

          return {
            user,
            isAuthenticated: true,
            error: null,
            isInitialized: true,
            workspaces:
              userWorkspaces.length > storeWorkspaces.length
                ? userWorkspaces
                : storeWorkspaces,
            needsWorkspaceSetup: hasNoWorkspaces,
            showWorkspaceSetupWizard: shouldShowWizard,
          };
        }),

      updateUser: (user) =>
        set((state) => ({
          ...state,
          user,
        })),

      clearUser: () =>
        set({
          user: null,
          isAuthenticated: false,
          error: null,
          isInitialized: true,
          workspaces: [],
          currentWorkspace: null,
          needsWorkspaceSetup: false,
          showWorkspaceSetupWizard: false,
        }),

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) =>
        set({
          error,
          isInitialized: true,
        }),

      clearError: () => set({ error: null }),
      setIntendedPath: (path) => set({ intendedPath: path }),
      setInitialized: (initialized) => set({ isInitialized: initialized }),
      setWorkspaces: (workspaces) =>
        set({
          workspaces,
          needsWorkspaceSetup: workspaces.length === 0,
          showWorkspaceSetupWizard: workspaces.length === 0,
        }),

      setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),

      setWorkspaceLoading: (loading) => set({ workspaceLoading: loading }),

      setNeedsWorkspaceSetup: (needsSetup) =>
        set({ needsWorkspaceSetup: needsSetup }),

      setShowWorkspaceSetupWizard: (show) =>
        set({ showWorkspaceSetupWizard: show }),

      addWorkspace: (workspace) =>
        set((state) => ({
          workspaces: [...state.workspaces, workspace],
          needsWorkspaceSetup: false,
        })),

      updateWorkspace: (id, workspace) =>
        set((state) => ({
          workspaces: state.workspaces.map((w) =>
            w.id === id ? workspace : w
          ),
          currentWorkspace:
            state.currentWorkspace?._id === id
              ? workspace
              : state.currentWorkspace,
        })),

      removeWorkspace: (id) =>
        set((state) => {
          const filteredWorkspaces = state.workspaces.filter(
            (w) => w.id !== id
          );
          const newCurrentWorkspace =
            state.currentWorkspace?._id === id
              ? filteredWorkspaces.length > 0
                ? filteredWorkspaces[0]
                : null
              : state.currentWorkspace;

          return {
            workspaces: filteredWorkspaces,
            currentWorkspace: newCurrentWorkspace,
            needsWorkspaceSetup: filteredWorkspaces.length === 0,
          };
        }),

      completeWorkspaceSetup: (workspace) =>
        set({
          currentWorkspace: workspace,
          showWorkspaceSetupWizard: false,
          needsWorkspaceSetup: false,
        }),

      skipWorkspaceSetup: () =>
        set(() => {
          return {
            showWorkspaceSetupWizard: false,
            needsWorkspaceSetup: false,
          };
        }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        intendedPath: state.intendedPath,
        currentWorkspace: state.currentWorkspace,
        needsWorkspaceSetup: state.needsWorkspaceSetup,
        showWorkspaceSetupWizard: state.showWorkspaceSetupWizard,
      }),
    }
  )
);
