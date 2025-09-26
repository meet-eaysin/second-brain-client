import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi, CreateSuperAdminRequest } from "./adminApi";

// Query keys
export const adminQueryKeys = {
  dashboard: ["admin", "dashboard"] as const,
  dashboardStats: () => [...adminQueryKeys.dashboard, "stats"] as const,
  systemHealth: () => [...adminQueryKeys.dashboard, "health"] as const,
  users: ["admin", "users"] as const,
  userStats: () => [...adminQueryKeys.users, "stats"] as const,
  userList: (params?: any) =>
    [...adminQueryKeys.users, "list", params] as const,
  profile: ["admin", "profile"] as const,
  setup: ["admin", "setup"] as const,
  setupStatus: () => [...adminQueryKeys.setup, "status"] as const,
};

// Dashboard hooks
export const useAdminDashboardStats = () => {
  return useQuery({
    queryKey: adminQueryKeys.dashboardStats(),
    queryFn: adminApi.getDashboardStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useSystemHealth = () => {
  return useQuery({
    queryKey: adminQueryKeys.systemHealth(),
    queryFn: adminApi.getSystemHealth,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  });
};

// User management hooks
export const useAdminUserStats = () => {
  return useQuery({
    queryKey: adminQueryKeys.userStats(),
    queryFn: adminApi.getUserStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useAdminUsers = (params?: {
  page?: number;
  limit?: number;
  role?: "user" | "moderator" | "admin" | "super_admin";
  isActive?: boolean;
  search?: string;
}) => {
  return useQuery({
    queryKey: adminQueryKeys.userList(params),
    queryFn: () => adminApi.getUsers(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      role,
    }: {
      userId: string;
      role: "user" | "moderator" | "admin" | "super_admin";
    }) => adminApi.updateUserRole(userId, role),
    onSuccess: () => {
      // Invalidate user-related queries
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.users });
      toast.success("User role updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update user role"
      );
    },
  });
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => adminApi.toggleUserStatus(userId),
    onSuccess: () => {
      // Invalidate user-related queries
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.users });
      toast.success("User status updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update user status"
      );
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => adminApi.deleteUser(userId),
    onSuccess: () => {
      // Invalidate user-related queries
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.users });
      toast.success("User deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete user");
    },
  });
};

export const useCreateSuperAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<CreateSuperAdminRequest, "setupToken">) =>
      adminApi.createSuperAdmin(data),
    onSuccess: () => {
      // Invalidate user-related queries
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.users });
      toast.success("Super admin created successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create super admin"
      );
    },
  });
};

// Setup hooks
export const useSetupStatus = () => {
  return useQuery({
    queryKey: adminQueryKeys.setupStatus(),
    queryFn: adminApi.checkSetupStatus,
    staleTime: 60 * 1000, // 60 seconds
    retry: 0, // No retries to avoid rate limiting
    refetchOnWindowFocus: false,
  });
};

export const useCreateInitialSuperAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSuperAdminRequest) =>
      adminApi.createInitialSuperAdmin(data),
    onSuccess: () => {
      // Invalidate setup status
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.setup });
      toast.success(
        "Super admin account created successfully. Redirecting to login..."
      );
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create super admin account"
      );
    },
  });
};

// Profile hook
export const useCurrentAdminProfile = () => {
  return useQuery({
    queryKey: adminQueryKeys.profile,
    queryFn: adminApi.getCurrentAdminProfile,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};
