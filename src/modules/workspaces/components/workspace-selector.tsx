import React, { useState } from "react";
import { Check, ChevronsUpDown, Plus, Settings, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { useWorkspace } from "../context";
import { useCreateWorkspace } from "../services/workspace-queries";
import { WorkspaceForm } from "./workspace-form";
import type {
  CreateWorkspaceRequest,
  Workspace,
} from "@/modules/workspaces/types/workspaces.types";
import { cn } from "@/lib/utils";

export const WorkspaceSelector: React.FC = () => {
  const {
    userWorkspaces,
    currentWorkspace,
    switchWorkspace,
    isWorkspaceOwner,
  } = useWorkspace();
  const [open, setOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const createWorkspaceMutation = useCreateWorkspace();

  const handleWorkspaceSelect = (workspace: Workspace) => {
    switchWorkspace(workspace.id);
    setOpen(false);
  };

  const handleCreateWorkspace = async (data: CreateWorkspaceRequest) => {
    await createWorkspaceMutation.mutateAsync(data);
    setShowCreateForm(false);
  };

  const getRoleColor = (workspace: Workspace) => {
    const isOwner = isWorkspaceOwner(workspace.id);

    if (isOwner) {
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    }

    // TODO: Add proper role checking when member management is implemented
    return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  };

  const getUserRole = (workspace: Workspace) => {
    return isWorkspaceOwner(workspace.id) ? "owner" : "member";
  };

  const renderIcon = (icon: Workspace["icon"]) => {
    if (typeof icon === "string") {
      return icon;
    }
    if (icon && typeof icon === "object") {
      return icon.value;
    }
    return "🏢";
  };

  return (
    <>
      <TooltipWrapper content="Switch between workspaces or create a new one">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              <div className="flex items-center space-x-2 min-w-0">
                {currentWorkspace ? (
                  <>
                    <span className="text-lg">
                      {renderIcon(currentWorkspace.icon)}
                    </span>
                    <span className="truncate">{currentWorkspace.name}</span>
                    <Badge
                      variant="secondary"
                      className={cn("text-xs", getRoleColor(currentWorkspace))}
                    >
                      {getUserRole(currentWorkspace)}
                    </Badge>
                  </>
                ) : (
                  <span className="text-muted-foreground">
                    Select workspace...
                  </span>
                )}
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0">
            <Command>
              <CommandInput placeholder="Search workspaces..." />
              <CommandList>
                <CommandEmpty>No workspaces found.</CommandEmpty>
                <CommandGroup heading="Your Workspaces">
                  {userWorkspaces.map((workspace) => (
                    <CommandItem
                      key={workspace.id}
                      value={workspace.name}
                      onSelect={() => handleWorkspaceSelect(workspace)}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">
                          {renderIcon(workspace.icon)}
                        </span>
                        <div className="flex flex-col">
                          <span className="font-medium">{workspace.name}</span>
                          {workspace.description && (
                            <span className="text-xs text-muted-foreground truncate">
                              {workspace.description}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="secondary"
                          className={cn("text-xs", getRoleColor(workspace))}
                        >
                          {getUserRole(workspace)}
                        </Badge>
                        {workspace.memberCount && (
                          <TooltipWrapper
                            content={`${workspace.memberCount} members`}
                          >
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <Users className="h-3 w-3" />
                              <span>{workspace.memberCount}</span>
                            </div>
                          </TooltipWrapper>
                        )}
                        {currentWorkspace?.id === workspace.id && (
                          <Check className="h-4 w-4" />
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      setShowCreateForm(true);
                      setOpen(false);
                    }}
                    className="flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create new workspace</span>
                  </CommandItem>
                  {currentWorkspace && (
                    <CommandItem
                      onSelect={() => {
                        // Navigate to workspace settings
                        setOpen(false);
                      }}
                      className="flex items-center space-x-2"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Workspace settings</span>
                    </CommandItem>
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </TooltipWrapper>

      <WorkspaceForm
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
        onCreate={handleCreateWorkspace}
        mode="create"
      />
    </>
  );
};
