import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/modules/auth/store/authStore";
import { useCreateWorkspace } from "@/modules/workspaces/services/workspace-queries";
import { WorkspaceForm } from "@/modules/workspaces/components/workspace-form";
import type { CreateWorkspaceRequest } from "@/types/workspace.types";

export function TeamSwitcher() {
  const { isMobile } = useSidebar();
  const {
    currentWorkspace,
    setCurrentWorkspace,
    workspaces,
    isAuthenticated,
    addWorkspace,
  } = useAuthStore();
  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] =
    React.useState(false);

  console.log("current", currentWorkspace);

  // Use React Query hooks for data fetching and mutations
  const createWorkspaceMutation = useCreateWorkspace();

  const hasWorkspaces = workspaces.length > 0;
  const isLoadingWorkspaces = !isAuthenticated;
  console.log("workspaces", workspaces);

  const handleCreateWorkspace = async (data: CreateWorkspaceRequest) => {
    try {
      const createdWorkspace = await createWorkspaceMutation.mutateAsync(data);
      // Convert Workspace to UserWorkspace
      const userWorkspace = {
        id: createdWorkspace.id,
        name: createdWorkspace.name,
        description: createdWorkspace.description,
        type: createdWorkspace.type,
        role: "owner" as const,
        isDefault: workspaces.length === 0, // First workspace is default
        memberCount: createdWorkspace.memberCount,
        databaseCount: createdWorkspace.databaseCount,
        createdAt: createdWorkspace.createdAt,
        updatedAt: createdWorkspace.updatedAt,
      };
      addWorkspace(userWorkspace);
      setCurrentWorkspace(createdWorkspace);
      setIsCreateWorkspaceOpen(false);
    } catch (error) {
      console.error("Failed to create workspace:", error);
    }
  };

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                disabled={isLoadingWorkspaces}
              >
                {hasWorkspaces && currentWorkspace ? (
                  <>
                    <div
                      className="flex aspect-square size-8 items-center justify-center rounded-lg text-white"
                      style={{
                        backgroundColor: "#3b82f6", // Default color since Workspace type doesn't have color
                      }}
                    >
                      <span className="text-lg">
                        {currentWorkspace.icon?.value || "🏢"}
                      </span>
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {currentWorkspace.name}
                      </span>
                      <span className="truncate text-xs">
                        {currentWorkspace.type === "personal"
                          ? "Personal"
                          : "Team Workspace"}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                      <Plus className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        Create Workspace
                      </span>
                      <span className="truncate text-xs">Get started</span>
                    </div>
                  </>
                )}
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              {hasWorkspaces ? (
                <>
                  <DropdownMenuLabel className="text-muted-foreground text-xs">
                    Workspaces
                  </DropdownMenuLabel>
                  {workspaces.map((workspace, index) => (
                    <DropdownMenuItem
                      key={workspace.id}
                      onClick={() => {
                        setCurrentWorkspace(workspace);
                      }}
                      className="gap-2 p-2"
                    >
                      <div
                        className="flex size-6 items-center justify-center rounded-sm text-white text-xs"
                        style={{
                          backgroundColor: "#3b82f6", // Default color
                        }}
                      >
                        🏢
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{workspace.name}</div>
                        {workspace.description && (
                          <div className="text-xs text-muted-foreground truncate">
                            {workspace.description}
                          </div>
                        )}
                      </div>
                      <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="gap-2 p-2"
                    onClick={() => setIsCreateWorkspaceOpen(true)}
                  >
                    <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                      <Plus className="size-4" />
                    </div>
                    <div className="text-muted-foreground font-medium">
                      Create workspace
                    </div>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuLabel className="text-muted-foreground text-xs">
                    Get Started
                  </DropdownMenuLabel>
                  <DropdownMenuItem
                    className="gap-2 p-2"
                    onClick={() => setIsCreateWorkspaceOpen(true)}
                  >
                    <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                      <Plus className="size-4" />
                    </div>
                    <div className="font-medium">
                      Create your first workspace
                    </div>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <WorkspaceForm
        open={isCreateWorkspaceOpen}
        onOpenChange={setIsCreateWorkspaceOpen}
        onSubmit={handleCreateWorkspace}
        mode="create"
        isLoading={createWorkspaceMutation.isPending}
      />
    </>
  );
}
