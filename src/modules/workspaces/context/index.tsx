import { createContext, useContext, type ReactNode } from "react";
import {
  useCurrentWorkspace,
  useUserWorkspaces,
} from "../services/workspace-queries";
import type { Workspace } from "@/types/workspace.types";

interface WorkspaceContextValue {
  // Current workspace
  currentWorkspace: Workspace | null;
  isCurrentWorkspaceLoading: boolean;

  userWorkspaces: Workspace[];
  isUserWorkspacesLoading: boolean;

  // Workspace switching
  switchWorkspace: (workspaceId: string) => void;

  // Utility functions
  isWorkspaceOwner: (workspaceId?: string) => boolean;
  canManageWorkspace: (workspaceId?: string) => boolean;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

interface WorkspaceProviderProps {
  children: ReactNode;
}

export function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  // Fetch current workspace
  const { data: currentWorkspaceData, isLoading: isCurrentWorkspaceLoading } =
    useCurrentWorkspace();

  // Fetch user's workspaces
  const { data: userWorkspacesData, isLoading: isUserWorkspacesLoading } =
    useUserWorkspaces();

  const currentWorkspace = currentWorkspaceData?.data || null;
  const userWorkspaces = userWorkspacesData?.data || [];

  // Switch workspace function
  const switchWorkspace = (workspaceId: string) => {
    // In a real implementation, this would update the current workspace context
    // For now, we'll rely on the backend's current workspace endpoint
    console.log("Switching to workspace:", workspaceId);
  };

  // Check if user is owner of workspace
  const isWorkspaceOwner = (workspaceId?: string) => {
    const workspace = workspaceId
      ? userWorkspaces.find((w) => w.id === workspaceId)
      : currentWorkspace;

    if (!workspace) return false;

    // This would need to be enhanced with proper member role checking
    // For now, assume owner if user owns the workspace
    return workspace.ownerId === "current-user-id"; // TODO: Get from auth context
  };

  // Check if user can manage workspace
  const canManageWorkspace = (workspaceId?: string) => {
    const workspace = workspaceId
      ? userWorkspaces.find((w) => w.id === workspaceId)
      : currentWorkspace;

    if (!workspace) return false;

    // Owner can always manage
    if (isWorkspaceOwner(workspaceId)) return true;

    // TODO: Check member roles when member management is implemented
    return false;
  };

  const contextValue: WorkspaceContextValue = {
    currentWorkspace,
    isCurrentWorkspaceLoading,
    userWorkspaces,
    isUserWorkspacesLoading,
    switchWorkspace,
    isWorkspaceOwner,
    canManageWorkspace,
  };

  return (
    <WorkspaceContext.Provider value={contextValue}>
      {children}
    </WorkspaceContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useWorkspace = (): WorkspaceContextValue => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
};
