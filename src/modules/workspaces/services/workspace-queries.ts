import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { workspaceApi } from "./workspace-api";
import type { ApiResponse } from "@/types/api.types";
import type {
  UpdateWorkspaceRequest,
  GetWorkspacesQuery,
  SearchWorkspacesQuery,
  CreateWorkspaceRequest,
  Workspace,
} from "@/modules/workspaces/types/workspaces.types";
import { toast } from "sonner";
import { useAuthStore } from "@/modules/auth/store/auth-store.ts";
import { EDatabaseType } from "@/modules/database-view";
import type { TModuleInitializeRequest } from "@/modules/workspaces/types/workspaces.types.ts";

// Helper function to extract error message from unknown error
const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (error instanceof Error && "response" in error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    return axiosError.response?.data?.message || defaultMessage;
  }
  return defaultMessage;
};

// Query keys that should be invalidated when switching workspaces
export const WORKSPACE_DEPENDENT_QUERIES = [
  ["databases"],
  ["tasks"],
  ["notes"],
  ["projects"],
  ["calendar"],
  ["dashboard"],
  ["analytics"],
  ["second-brain"],
  ["people-database-view"],
  ["people-views"],
  ["notes-database-view"],
  ["notes-with-view"],
  ["recently-visited"],
  ["files"],
  ["templates"],
  ["system"],
] as const;

export const WORKSPACE_KEYS = {
  all: ["workspaces"] as const,
  userWorkspaces: () => [...WORKSPACE_KEYS.all, "user"] as const,
  current: () => [...WORKSPACE_KEYS.all, "current"] as const,
  primary: () => [...WORKSPACE_KEYS.all, "primary"] as const,
  stats: () => [...WORKSPACE_KEYS.all, "stats"] as const,
  access: () => [...WORKSPACE_KEYS.all, "access"] as const,
  modules: () => [...WORKSPACE_KEYS.all, "modules"] as const,
  lists: () => [...WORKSPACE_KEYS.all, "lists"] as const,
  detail: (id: string) => [...WORKSPACE_KEYS.all, "detail", id] as const,
  public: () => [...WORKSPACE_KEYS.all, "public"] as const,
  search: (params: SearchWorkspacesQuery) =>
    [...WORKSPACE_KEYS.all, "search", params] as const,
  members: (workspaceId: string) =>
    [...WORKSPACE_KEYS.all, "members", workspaceId] as const,
  permissions: (workspaceId: string) =>
    [...WORKSPACE_KEYS.all, "permissions", workspaceId] as const,
  activity: (workspaceId: string) =>
    [...WORKSPACE_KEYS.all, "activity", workspaceId] as const,
};

// Get user's workspaces
export const useUserWorkspaces = () => {
  const { isAuthenticated } = useAuthStore();

  const query = useQuery({
    queryKey: WORKSPACE_KEYS.userWorkspaces(),
    queryFn: () => workspaceApi.getUserWorkspaces(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Always refetch to ensure we have the latest workspace data
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Transform API response to match UserWorkspace interface (convert _id to id)
  const transformedData = useMemo(() => {
    if (!query.data?.data) return query.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformedWorkspaces = query.data.data.map((workspace: any) => ({
      ...workspace,
      id: workspace._id,
    }));
    return {
      ...query.data,
      data: transformedWorkspaces,
    };
  }, [query.data]);

  return {
    ...query,
    data: transformedData,
  };
};

// Get current workspace
export const useCurrentWorkspace = () => {
  const { isAuthenticated, currentWorkspace } = useAuthStore();

  return useQuery<ApiResponse<Workspace>, Error>({
    queryKey: WORKSPACE_KEYS.current(),
    queryFn: () => workspaceApi.getCurrentWorkspace(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Always refetch to ensure we have the latest workspace data
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    // Use initial data from store if available
    initialData: currentWorkspace
      ? {
          data: currentWorkspace,
          success: true,
          message: "",
          timestamp: new Date().toISOString(),
        }
      : undefined,
  });
};

// Get primary workspace
export const usePrimaryWorkspace = () => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: WORKSPACE_KEYS.primary(),
    queryFn: () => workspaceApi.getPrimaryWorkspace(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get or create default workspace
export const useGetOrCreateDefaultWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userInfo?: Record<string, unknown>) =>
      workspaceApi.getOrCreateDefaultWorkspace(userInfo),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: WORKSPACE_KEYS.userWorkspaces(),
      });
    },
  });
};

// Get current workspace stats
export const useCurrentWorkspaceStats = () => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: WORKSPACE_KEYS.stats(),
    queryFn: () => workspaceApi.getCurrentWorkspaceStats(),
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Check current workspace access
export const useCurrentWorkspaceAccess = () => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: WORKSPACE_KEYS.access(),
    queryFn: () => workspaceApi.checkCurrentWorkspaceAccess(),
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Initialize workspace modules
export const useInitializeWorkspaceModules = (
  payload: TModuleInitializeRequest
) => {
  return useQuery({
    queryKey: [...WORKSPACE_KEYS.modules(), payload],
    queryFn: () => workspaceApi.initializeWorkspaceModules(payload),
    staleTime: 5 * 60 * 1000,
    enabled: !payload.isInitialized && !!payload.workspaceId,
  });
};

// Get module database ID
export const useModuleDatabaseId = (
  moduleType: EDatabaseType,
  initialized: boolean = false
) => {
  return useQuery({
    queryKey: [...WORKSPACE_KEYS.modules(), moduleType],
    queryFn: () => workspaceApi.getModuleDatabaseId(moduleType),
    staleTime: 5 * 60 * 1000,
    enabled: !initialized,
  });
};

// Mutations

// Update current workspace
export const useUpdateCurrentWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateWorkspaceRequest) =>
      workspaceApi.updateCurrentWorkspace(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKSPACE_KEYS.current() });
      queryClient.invalidateQueries({
        queryKey: WORKSPACE_KEYS.userWorkspaces(),
      });
      toast.success("Workspace updated successfully");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to update workspace"));
    },
  });
};

// Delete current workspace
export const useDeleteCurrentWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => workspaceApi.deleteCurrentWorkspace(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: WORKSPACE_KEYS.userWorkspaces(),
      });
      queryClient.removeQueries({ queryKey: WORKSPACE_KEYS.current() });
      toast.success("Workspace deleted successfully");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to delete workspace"));
    },
  });
};

export const useGetPublicWorkspaces = (params?: GetWorkspacesQuery) => {
  return useQuery({
    queryKey: WORKSPACE_KEYS.public(),
    queryFn: () => workspaceApi.getPublicWorkspaces(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useSearchWorkspaces = (params: SearchWorkspacesQuery) => {
  return useQuery({
    queryKey: WORKSPACE_KEYS.search(params),
    queryFn: () => workspaceApi.searchWorkspaces(params),
    enabled: !!params.q && params.q.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateWorkspace = () => {
  return useMutation({
    mutationFn: async (data: CreateWorkspaceRequest) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/workspaces`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
            body: JSON.stringify(data),
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to create workspace");
        }

        return response.json();
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Workspace created successfully");
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Failed to create workspace";
      toast.error(message);
    },
  });
};

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWorkspaceRequest }) =>
      workspaceApi.updateWorkspace(id, data),
    onSuccess: (updatedWorkspace, { id }) => {
      // Update the specific workspace in cache
      queryClient.setQueryData(WORKSPACE_KEYS.detail(id), updatedWorkspace);

      // Invalidate lists to reflect changes
      queryClient.invalidateQueries({
        queryKey: WORKSPACE_KEYS.userWorkspaces(),
      });

      toast.success("Workspace updated successfully");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to update workspace"));
    },
  });
};

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => workspaceApi.deleteWorkspace(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: WORKSPACE_KEYS.detail(id) });

      // Invalidate lists to reflect changes
      queryClient.invalidateQueries({
        queryKey: WORKSPACE_KEYS.userWorkspaces(),
      });
      queryClient.invalidateQueries({ queryKey: WORKSPACE_KEYS.stats() });

      toast.success("Workspace deleted successfully");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to delete workspace"));
    },
  });
};

export const useDuplicateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name?: string }) =>
      workspaceApi.duplicateWorkspace(id, name),
    onSuccess: () => {
      // Invalidate and refetch workspaces list
      queryClient.invalidateQueries({
        queryKey: WORKSPACE_KEYS.userWorkspaces(),
      });
      queryClient.invalidateQueries({ queryKey: WORKSPACE_KEYS.stats() });

      toast.success("Workspace duplicated successfully");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to duplicate workspace"));
    },
  });
};

export const useLeaveWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => workspaceApi.leaveWorkspace(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: WORKSPACE_KEYS.userWorkspaces(),
      });
      queryClient.invalidateQueries({ queryKey: WORKSPACE_KEYS.stats() });

      toast.success("Left workspace successfully");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to leave workspace"));
    },
  });
};

// Switch current workspace
export const useSwitchWorkspace = () => {
  const { setCurrentWorkspace } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      workspaceId,
    }: {
      workspaceId: string;
      workspaces?: Workspace[];
    }) => {
      // Call the API to switch workspace on server
      const response = await workspaceApi.switchCurrentWorkspace(workspaceId);
      return response.data;
    },
    onSuccess: (workspace) => {
      // Update the current workspace in the auth store
      setCurrentWorkspace(workspace);

      // Update the React Query cache for current workspace
      queryClient.setQueryData(WORKSPACE_KEYS.current(), {
        data: workspace,
        success: true,
      });

      // Invalidate all workspace-dependent queries to ensure fresh data
      WORKSPACE_DEPENDENT_QUERIES.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });

      toast.success(`Switched to ${workspace.name}`);
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to switch workspace"));
    },
  });
};
