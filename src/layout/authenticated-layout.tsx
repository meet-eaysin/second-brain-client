import { cn } from "@/lib/utils";
import { SearchProvider } from "@/context/search-context";
import { SidebarProvider } from "@/components/ui/sidebar";
import SkipToMain from "@/components/skip-to-main";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/layout/app-sidebar.tsx";
import { PageVisitTracker } from "@/modules/home/components/page-visit-tracker";
import { WorkspaceSetupWizard } from "@/modules/workspaces/components/workspace-setup-wizard";
import { useAuthStore } from "@/modules/auth/store/authStore";
import { useGetOrCreateDefaultWorkspace } from "@/modules/workspaces/services/workspace-queries";
import React from "react";

interface Props {
  children?: React.ReactNode;
}

function AuthenticatedLayout({ children }: Props) {
  const defaultOpen = true; // Always default to open
  const {
    showWorkspaceSetupWizard,
    completeWorkspaceSetup,
    skipWorkspaceSetup,
  } = useAuthStore();
  const getOrCreateDefaultWorkspace = useGetOrCreateDefaultWorkspace();

  const handleWorkspaceComplete = (workspace: { id: string; name: string }) => {
    // Create a minimal workspace object for the store
    const minimalWorkspace = {
      id: workspace.id,
      name: workspace.name,
      type: "personal" as const,
      config: {},
      isPublic: false,
      isArchived: false,
      ownerId: "",
      memberCount: 1,
      databaseCount: 0,
      recordCount: 0,
      storageUsed: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    completeWorkspaceSetup(minimalWorkspace);
  };

  const handleWorkspaceSkip = async () => {
    try {
      // Create default workspace when user skips
      const defaultWorkspace = await getOrCreateDefaultWorkspace.mutateAsync();
      completeWorkspaceSetup(defaultWorkspace);
    } catch (error) {
      console.error("Failed to create default workspace:", error);
      // Still hide the wizard even if creation fails
      skipWorkspaceSetup();
    }
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
        </div>

        <WorkspaceSetupWizard
          open={showWorkspaceSetupWizard}
          onComplete={handleWorkspaceComplete}
          onSkip={handleWorkspaceSkip}
        />
      </SidebarProvider>
    </SearchProvider>
  );
}

export default AuthenticatedLayout;
