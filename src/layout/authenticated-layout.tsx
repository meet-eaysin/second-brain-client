import { cn } from "@/lib/utils";
import { SearchProvider } from "@/context/search-context";
import { SidebarProvider } from "@/components/ui/sidebar";
import SkipToMain from "@/components/skip-to-main";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/layout/app-sidebar.tsx";
import { PageVisitTracker } from "@/modules/home/components/page-visit-tracker";
import { WorkspaceSetupWizard } from "@/modules/workspaces/components/workspace-setup-wizard";
import { useAuthStore } from "@/modules/auth/store/auth-store.ts";
import { WORKSPACE_DEPENDENT_QUERIES } from "@/modules/workspaces/services/workspace-queries";
import { SetupWrapper } from "@/modules/admin/components/setup-wrapper";
import { useQueryClient } from "@tanstack/react-query";
import { useWorkspace } from "@/modules/workspaces/context";
import { LoadingSpinner } from "@/components/loading-spinner";
import React from "react";
import type { Workspace } from "@/modules/workspaces/types/workspaces.types.ts";

interface Props {
  children?: React.ReactNode;
}

function AuthenticatedLayout({ children }: Props) {
  const defaultOpen = true; // Always default to open
  const {
    showWorkspaceSetupWizard,
    completeWorkspaceSetup,
    addWorkspace,
    setWorkspaces,
    setCurrentWorkspace,
  } = useAuthStore();
  const queryClient = useQueryClient();
  const {
    currentWorkspace: contextCurrentWorkspace,
    userWorkspaces: contextUserWorkspaces,
    isCurrentWorkspaceLoading,
    isUserWorkspacesLoading,
  } = useWorkspace();

  // Sync workspace data to store when loaded
  React.useEffect(() => {
    if (!isUserWorkspacesLoading && contextUserWorkspaces.length > 0) {
      setWorkspaces(contextUserWorkspaces);
      if (contextCurrentWorkspace) {
        setCurrentWorkspace(contextCurrentWorkspace);
      }
    }
  }, [
    contextUserWorkspaces,
    contextCurrentWorkspace,
    isUserWorkspacesLoading,
    setWorkspaces,
    setCurrentWorkspace,
  ]);

  // Determine if wizard should be shown
  const shouldShowWizard =
    !isUserWorkspacesLoading && contextUserWorkspaces.length === 0;

  // Show loading spinner while fetching workspace data
  if (isUserWorkspacesLoading || isCurrentWorkspaceLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const invalidateWorkspaceQueries = () => {
    WORKSPACE_DEPENDENT_QUERIES.forEach((queryKey) => {
      queryClient.invalidateQueries({ queryKey });
    });
  };

  const handleWorkspaceComplete = (workspace: Workspace) => {
    const transformedWorkspace = {
      ...workspace,
      id: workspace._id,
    };
    completeWorkspaceSetup(transformedWorkspace);

    const userWorkspace: Workspace = {
      id: workspace._id,
      _id: workspace._id,
      name: workspace.name,
      description: workspace.description,
      type: workspace.type,
      icon: { type: "emoji", value: "🏢" },
      config: {
        enableAI: true,
        enableComments: true,
        enableVersioning: false,
        enablePublicSharing: true,
        enableGuestAccess: false,
        maxDatabases: 100,
        maxMembers: 10,
        storageLimit: 1073741824,
        allowedIntegrations: [],
        requireTwoFactor: false,
        allowedEmailDomains: [],
        sessionTimeout: 480,
      },
      isPublic: false,
      isArchived: false,
      ownerId: "",
      memberCount: workspace.memberCount,
      databaseCount: workspace.databaseCount,
      recordCount: 0,
      storageUsed: 0,
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt,
    };
    addWorkspace(userWorkspace);

    queryClient.setQueryData(["workspaces", "current"], {
      data: transformedWorkspace,
      success: true,
    });

    queryClient.setQueryData(["workspaces", "user"], (oldData) => {
      if (!oldData) return oldData;
      const currentData = (oldData as { data?: Workspace[] }).data || [];
      return {
        ...oldData,
        data: [...currentData, userWorkspace],
      };
    });

    queryClient.invalidateQueries({ queryKey: ["workspaces", "stats"] });

    invalidateWorkspaceQueries();
  };

  return (
    <SearchProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <SkipToMain />
        <PageVisitTracker />
        <AppSidebar />
        <div
          id="content"
          className={cn(
            "ml-auto w-full max-w-full overflow-x-hidden",
            "peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]",
            "peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]",
            "sm:transition-[width] sm:duration-200 sm:ease-linear",
            "flex h-svh flex-col",
            "group-data-[scroll-locked=1]/body:h-full",
            "has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh"
          )}
        >
          {children ? children : <Outlet />}
          <SetupWrapper />
        </div>

        <WorkspaceSetupWizard
          open={shouldShowWizard || showWorkspaceSetupWizard}
          onComplete={handleWorkspaceComplete}
          size="xl"
        />
      </SidebarProvider>
    </SearchProvider>
  );
}

export default AuthenticatedLayout;
