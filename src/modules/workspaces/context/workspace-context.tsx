import React, { createContext, useContext, useState, useEffect } from "react";
import { workspaceApi } from "@/modules/workspaces/services/workspace-api.ts";
import { WorkspaceSetupWizard } from "../components/WorkspaceSetupWizard";
import type {
  Workspace,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
} from "@/types/workspace.types";
import { toast } from "sonner";
import { useAuth } from "@/modules/auth/hooks/useAuth";

interface WorkspaceContextType {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  isLoading: boolean;
  needsSetup: boolean;
  showSetupWizard: boolean;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  refreshWorkspaces: () => Promise<void>;
  createWorkspace: (data: CreateWorkspaceRequest) => Promise<Workspace>;
  updateWorkspace: (
    id: string,
    data: UpdateWorkspaceRequest
  ) => Promise<Workspace>;
  deleteWorkspace: (id: string) => Promise<void>;
  completeSetup: (workspace: Workspace) => void;
  skipSetup: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined
);

interface WorkspaceProviderProps {
  children: React.ReactNode;
}

export function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [showSetupWizard, setShowSetupWizard] = useState(false);

  const { isAuthenticated, isInitialized } = useAuth();

  useEffect(() => {
    if (isAuthenticated && isInitialized) {
      loadWorkspaces();
    } else if (isInitialized && !isAuthenticated) {
      setIsLoading(false);
    }
  }, [isAuthenticated, isInitialized]);

  const loadWorkspaces = async () => {
    try {
      setIsLoading(true);
      const response = await workspaceApi.getWorkspaces();
      const workspacesList = response.data || [];
      setWorkspaces(workspacesList);

      if (workspacesList.length === 0) {
        setNeedsSetup(true);
        setShowSetupWizard(true);
      } else {
        setNeedsSetup(false);
        if (!currentWorkspace) setCurrentWorkspace(workspacesList[0]);
      }
    } catch (error) {
      console.error("Failed to load workspaces:", error);
      toast.error("Failed to load workspaces");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshWorkspaces = async () => await loadWorkspaces();

  const createWorkspace = async (
    data: CreateWorkspaceRequest
  ): Promise<Workspace> => {
    try {
      const newWorkspace = await workspaceApi.createWorkspace(data);
      setWorkspaces((prev) => [...prev, newWorkspace]);
      setCurrentWorkspace(newWorkspace);
      setNeedsSetup(false);
      toast.success("Workspace created successfully");
      return newWorkspace;
    } catch (error: any) {
      console.error("Failed to create workspace:", error);
      const errorMessage =
        error?.response?.data?.error?.message || "Failed to create workspace";
      toast.error(errorMessage);
      throw error;
    }
  };

  const updateWorkspace = async (
    id: string,
    data: UpdateWorkspaceRequest
  ): Promise<Workspace> => {
    try {
      const updatedWorkspace = await workspaceApi.updateWorkspace(id, data);
      setWorkspaces((prev) =>
        prev.map((w) => (w.id === id ? updatedWorkspace : w))
      );

      if (currentWorkspace?.id === id) setCurrentWorkspace(updatedWorkspace);

      toast.success("Workspace updated successfully");
      return updatedWorkspace;
    } catch (error: any) {
      console.error("Failed to update workspace:", error);
      const errorMessage =
        error?.response?.data?.error?.message || "Failed to update workspace";
      toast.error(errorMessage);
      throw error;
    }
  };

  const deleteWorkspace = async (id: string): Promise<void> => {
    try {
      await workspaceApi.deleteWorkspace(id);
      setWorkspaces((prev) => prev.filter((w) => w.id !== id));

      if (currentWorkspace?.id === id) {
        const remainingWorkspaces = workspaces.filter((w) => w.id !== id);
        setCurrentWorkspace(
          remainingWorkspaces.length > 0 ? remainingWorkspaces[0] : null
        );
      }

      toast.success("Workspace deleted successfully");
    } catch (error: any) {
      console.error("Failed to delete workspace:", error);
      const errorMessage =
        error?.response?.data?.error?.message || "Failed to delete workspace";
      toast.error(errorMessage);
      throw error;
    }
  };

  const completeSetup = (workspace: Workspace) => {
    setCurrentWorkspace(workspace);
    setShowSetupWizard(false);
    setNeedsSetup(false);
  };

  const skipSetup = () => {
    setShowSetupWizard(false);
    setNeedsSetup(false);
  };

  const value: WorkspaceContextType = {
    workspaces,
    currentWorkspace,
    isLoading,
    needsSetup,
    showSetupWizard,
    setCurrentWorkspace,
    refreshWorkspaces,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    completeSetup,
    skipSetup,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
      <WorkspaceSetupWizard
        open={showSetupWizard}
        onComplete={completeSetup}
        onSkip={skipSetup}
      />
    </WorkspaceContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
