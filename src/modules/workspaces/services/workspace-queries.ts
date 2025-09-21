import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { workspaceApi } from "./workspace-api";
import type {
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  InviteMemberRequest,
  UpdateMemberRoleRequest,
  TransferOwnershipRequest,
  BulkMemberOperationRequest,
  GetWorkspacesQuery,
  GetWorkspaceMembersQuery,
  SearchWorkspacesQuery,
} from "@/types/workspace.types";
import { toast } from "sonner";
import { useAuthStore } from "@/modules/auth/store/authStore";
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

export const WORKSPACE_KEYS = {
  all: ["workspaces"] as const,
  lists: () => [...WORKSPACE_KEYS.all, "list"] as const,
  list: (params?: GetWorkspacesQuery) =>
    [...WORKSPACE_KEYS.lists(), params] as const,
  details: () => [...WORKSPACE_KEYS.all, "detail"] as const,
  detail: (id: string) => [...WORKSPACE_KEYS.details(), id] as const,
  members: (id: string) => [...WORKSPACE_KEYS.all, "members", id] as const,
  permissions: (id: string) =>
    [...WORKSPACE_KEYS.all, "permissions", id] as const,
  activity: (id: string) => [...WORKSPACE_KEYS.all, "activity", id] as const,
  stats: () => [...WORKSPACE_KEYS.all, "stats"] as const,
  public: () => [...WORKSPACE_KEYS.all, "public"] as const,
  search: (params: SearchWorkspacesQuery) =>
    [...WORKSPACE_KEYS.all, "search", params] as const,
  primary: () => [...WORKSPACE_KEYS.all, "primary"] as const,
};

export const useInitializeModules = (payload: TModuleInitializeRequest) => {
  return useQuery({
    queryKey: WORKSPACE_KEYS.all,
    queryFn: () => workspaceApi.initializeWorkspaceModules(payload),
    staleTime: 5 * 60 * 1000,
    enabled: !payload.isInitialized && !!payload.workspaceId,
  });
};

export const useGetWorkspaces = (params?: GetWorkspacesQuery) => {
  return useQuery({
    queryKey: WORKSPACE_KEYS.list(params),
    queryFn: () => workspaceApi.getWorkspaces(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetModuleDatabaseId = (
  workspaceId: string,
  moduleType: EDatabaseType,
  initialized: boolean = false
) => {
  return useQuery({
    queryKey: WORKSPACE_KEYS.all,
    queryFn: () => workspaceApi.getModuleDatabaseId(moduleType),
    staleTime: 5 * 60 * 1000,
    enabled: !initialized,
  });
};

export const useGetWorkspaceById = (id: string) => {
  return useQuery({
    queryKey: WORKSPACE_KEYS.detail(id),
    queryFn: () => workspaceApi.getWorkspaceById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetPrimaryWorkspace = () => {
  const { isAuthenticated, isInitialized } = useAuthStore();

  return useQuery({
    queryKey: WORKSPACE_KEYS.primary(),
    queryFn: () => workspaceApi.getPrimaryWorkspace(),
    enabled: isAuthenticated && isInitialized,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetWorkspaceStats = (workspaceId: string) => {
  return useQuery({
    queryKey: WORKSPACE_KEYS.stats(),
    queryFn: () => workspaceApi.getWorkspaceStats(workspaceId),
    staleTime: 10 * 60 * 1000, // 10 minutes
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

export const useGetWorkspaceMembers = (
  workspaceId: string,
  params?: GetWorkspaceMembersQuery
) => {
  return useQuery({
    queryKey: WORKSPACE_KEYS.members(workspaceId),
    queryFn: () => workspaceApi.getMembers(workspaceId, params),
    enabled: !!workspaceId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetWorkspacePermissions = (workspaceId: string) => {
  return useQuery({
    queryKey: WORKSPACE_KEYS.permissions(workspaceId),
    queryFn: () => workspaceApi.getWorkspacePermissions(workspaceId),
    enabled: !!workspaceId,
    staleTime: 10 * 60 * 1000,
  });
};

export const useGetWorkspaceActivity = (workspaceId: string) => {
  return useQuery({
    queryKey: WORKSPACE_KEYS.activity(workspaceId),
    queryFn: () => workspaceApi.getWorkspaceActivity(workspaceId),
    enabled: !!workspaceId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkspaceRequest) =>
      workspaceApi.createWorkspace(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKSPACE_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: WORKSPACE_KEYS.stats() });

      toast.success("Workspace created successfully");
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : "Failed to create workspace";
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
      queryClient.invalidateQueries({ queryKey: WORKSPACE_KEYS.lists() });

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
      queryClient.invalidateQueries({ queryKey: WORKSPACE_KEYS.lists() });
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
      queryClient.invalidateQueries({ queryKey: WORKSPACE_KEYS.lists() });
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
    mutationFn: (id: string) => workspaceApi.leaveWorkspace(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: WORKSPACE_KEYS.detail(id) });

      queryClient.invalidateQueries({ queryKey: WORKSPACE_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: WORKSPACE_KEYS.stats() });

      toast.success("Left workspace successfully");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to leave workspace"));
    },
  });
};

export const useInviteMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data }: { data: InviteMemberRequest }) =>
      workspaceApi.inviteMember(data),
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({
        queryKey: WORKSPACE_KEYS.members(workspaceId),
      });

      toast.success("Member invited successfully");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to invite member"));
    },
  });
};

export const useUpdateMemberRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      userId,
      data,
    }: {
      workspaceId: string;
      userId: string;
      data: UpdateMemberRoleRequest;
    }) => workspaceApi.updateMemberRole(workspaceId, userId, data),
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({
        queryKey: WORKSPACE_KEYS.members(workspaceId),
      });

      toast.success("Member role updated successfully");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to update member role"));
    },
  });
};

export const useRemoveMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      userId,
    }: {
      workspaceId: string;
      userId: string;
    }) => workspaceApi.removeMember(workspaceId, userId),
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({
        queryKey: WORKSPACE_KEYS.members(workspaceId),
      });

      toast.success("Member removed successfully");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to remove member"));
    },
  });
};

export const useTransferOwnership = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      data,
    }: {
      workspaceId: string;
      data: TransferOwnershipRequest;
    }) => workspaceApi.transferOwnership(workspaceId, data),
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({
        queryKey: WORKSPACE_KEYS.detail(workspaceId),
      });
      queryClient.invalidateQueries({
        queryKey: WORKSPACE_KEYS.members(workspaceId),
      });
      queryClient.invalidateQueries({ queryKey: WORKSPACE_KEYS.lists() });

      toast.success("Ownership transferred successfully");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to transfer ownership"));
    },
  });
};

export const useBulkMemberOperation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      data,
    }: {
      workspaceId: string;
      data: BulkMemberOperationRequest;
    }) => workspaceApi.bulkMemberOperation(workspaceId, data),
    onSuccess: (_, { workspaceId }) => {
      // Invalidate members list
      queryClient.invalidateQueries({
        queryKey: WORKSPACE_KEYS.members(workspaceId),
      });

      toast.success("Bulk operation completed successfully");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to complete bulk operation"));
    },
  });
};
