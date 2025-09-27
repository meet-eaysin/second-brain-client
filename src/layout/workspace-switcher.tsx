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
import { useAuthStore } from "@/modules/auth/store/auth-store.ts";
import { useWorkspace } from "@/modules/workspaces/context";
import {
  useCreateWorkspace,
  useSwitchWorkspace,
  WORKSPACE_KEYS,
} from "@/modules/workspaces/services/workspace-queries";
import { useQueryClient } from "@tanstack/react-query";
import { WorkspaceForm } from "@/modules/workspaces/components/workspace-form";
import type {
  CreateWorkspaceRequest,
  Workspace,
} from "@/modules/workspaces/types/workspaces.types";

export function TeamSwitcher() {
  const { isMobile } = useSidebar();
  const { currentWorkspace, addWorkspace, setCurrentWorkspace } =
    useAuthStore();
  const { userWorkspaces, isUserWorkspacesLoading } = useWorkspace();
  const queryClient = useQueryClient();

  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] =
    React.useState(false);

  const createWorkspaceMutation = useCreateWorkspace();
  const switchWorkspaceMutation = useSwitchWorkspace();

  const hasWorkspaces = userWorkspaces.length > 0;

  const handleCreateWorkspace = async (data: CreateWorkspaceRequest) => {
    try {
      const response = await createWorkspaceMutation.mutateAsync(data);
      const createdWorkspace = response.data; // Extract the actual workspace from response.data
      const userWorkspace: Workspace = {
        id: createdWorkspace._id,
        _id: createdWorkspace._id,
        name: createdWorkspace.name,
        description: createdWorkspace.description,
        type: createdWorkspace.type,
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
        ownerId: "", // Will be set by backend
        memberCount: createdWorkspace.memberCount,
        databaseCount: createdWorkspace.databaseCount,
        recordCount: 0,
        storageUsed: 0,
        createdAt: createdWorkspace.createdAt,
        updatedAt: createdWorkspace.updatedAt,
      };

      // Transform the workspace to match the Workspace interface (id instead of _id)
      const transformedWorkspace = {
        ...createdWorkspace,
        id: createdWorkspace._id,
      };

      // Add to workspace list and set as current in one operation
      addWorkspace(userWorkspace);
      // Set the newly created workspace as current
      setCurrentWorkspace(transformedWorkspace);

      // Update the React Query cache for current workspace
      queryClient.setQueryData(WORKSPACE_KEYS.current(), {
        data: transformedWorkspace,
        success: true,
      });

      // Update the userWorkspaces query cache to include the new workspace
      queryClient.setQueryData(WORKSPACE_KEYS.userWorkspaces(), (oldData) => {
        if (!oldData) return oldData;
        const currentData = (oldData as { data?: Workspace[] }).data || [];
        return {
          ...oldData,
          data: [...currentData, userWorkspace],
        };
      });

      // Invalidate queries that depend on workspace data
      queryClient.invalidateQueries({ queryKey: WORKSPACE_KEYS.stats() });

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
                disabled={isUserWorkspacesLoading}
              >
                {hasWorkspaces && currentWorkspace ? (
                  <>
                    <div
                      className="flex aspect-square size-8 items-center justify-center rounded-lg text-white"
                      style={{
                        backgroundColor: "#3b82f6",
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
                  {userWorkspaces.map((workspace, index) => (
                    <DropdownMenuItem
                      key={workspace.id}
                      onClick={() =>
                        switchWorkspaceMutation.mutate({
                          workspaceId: workspace.id,
                          workspaces: userWorkspaces,
                        })
                      }
                      className="gap-2 p-2"
                    >
                      <div
                        className="flex size-6 items-center justify-center rounded-sm text-white text-xs"
                        style={{
                          backgroundColor: "#3b82f6",
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
        onCreate={handleCreateWorkspace}
        mode="create"
        isLoading={createWorkspaceMutation.isPending}
      />
    </>
  );
}
