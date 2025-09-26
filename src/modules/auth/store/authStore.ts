import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, UserWorkspace } from "@/modules/auth/types/auth.types.ts";
import type { Workspace } from "@/types/workspace.types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  intendedPath: string | null;

  // Workspace state
  workspaces: UserWorkspace[];
  currentWorkspace: Workspace | null;
  workspaceLoading: boolean;
  needsWorkspaceSetup: boolean;
  showWorkspaceSetupWizard: boolean;

  // Actions
  setUser: (user: User) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setIntendedPath: (path: string | null) => void;
  clearError: () => void;
  setInitialized: (initialized: boolean) => void;

  // Workspace actions
  setWorkspaces: (workspaces: Workspace[]) => void;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  setWorkspaceLoading: (loading: boolean) => void;
  setNeedsWorkspaceSetup: (needsSetup: boolean) => void;
  setShowWorkspaceSetupWizard: (show: boolean) => void;
  addWorkspace: (workspace: UserWorkspace) => void;
  updateWorkspace: (id: string, workspace: Workspace) => void;
  removeWorkspace: (id: string) => void;
  completeWorkspaceSetup: (workspace: Workspace) => void;
  skipWorkspaceSetup: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, _get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,
      error: null,
      intendedPath: null,

      // Workspace state
      workspaces: [],
      currentWorkspace: null,
      workspaceLoading: false,
      needsWorkspaceSetup: false,
      showWorkspaceSetupWizard: false,

      setUser: (user) =>
        set((state) => ({
          user,
          isAuthenticated: true,
          error: null,
          isInitialized: true,
          workspaces: user.workspaces || [],
          needsWorkspaceSetup: (user.workspaces || []).length === 0,
          showWorkspaceSetupWizard: (user.workspaces || []).length === 0,
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

      // Workspace actions
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
            state.currentWorkspace?.id === id
              ? workspace
              : state.currentWorkspace,
        })),

      removeWorkspace: (id) =>
        set((state) => {
          const filteredWorkspaces = state.workspaces.filter(
            (w) => w.id !== id
          );
          const newCurrentWorkspace =
            state.currentWorkspace?.id === id
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
        set((state) => {
          // If user skips and has no workspaces, we should create a default one
          // This will be handled by the component that calls this function
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
      }),
    }
  )
);
