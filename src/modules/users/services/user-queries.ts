import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi } from "./user-api.ts";
import { USER_KEYS } from "@/constants/query-keys.ts";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import type { ApiResponse } from "@/types/api.types";
import type {
  BulkUpdateUsers,
  UpdateProfile,
  UpdateUserByAdmin,
  UpdateUserRole,
  UserQueryParams,
  UserStatsQueryParams,
} from "@/modules/users/types/users.types.ts";

// Get all users
export const useUsers = (params?: UserQueryParams) => {
  return useQuery({
    queryKey: USER_KEYS.list(params),
    queryFn: () => userApi.getUsers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get current user profile
export const useUserProfile = () => {
  return useQuery({
    queryKey: USER_KEYS.profile(),
    queryFn: userApi.getUserProfile,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: USER_KEYS.detail(id),
    queryFn: () => userApi.getUserById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUserStats = (params?: UserStatsQueryParams) => {
  return useQuery({
    queryKey: USER_KEYS.stats(params),
    queryFn: () => userApi.getUserStats(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfile) => userApi.updateUserProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.profile() });
      toast.success("Profile updated successfully");
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      const message =
        error.response?.data?.message || "Failed to update profile";
      toast.error(message);
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.deleteUserAccount,
    onSuccess: () => {
      queryClient.clear();
      toast.success("Account deleted successfully");
      window.location.href = "/";
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      const message =
        error.response?.data?.message || "Failed to delete account";
      toast.error(message);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserByAdmin }) =>
      userApi.updateUserById(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() });
      toast.success("User updated successfully");
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      const message = error.response?.data?.message || "Failed to update user";
      toast.error(message);
    },
  });
};

// Delete user by ID (Admin)
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userApi.deleteUserById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() });
      toast.success("User deleted successfully");
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      const message = error.response?.data?.message || "Failed to delete user";
      toast.error(message);
    },
  });
};

// Toggle user status (Admin)
export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userApi.toggleUserStatus(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() });
      const status = data.data?.isActive ? "activated" : "deactivated";
      toast.success(`User ${status} successfully`);
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      const message =
        error.response?.data?.message || "Failed to update user status";
      toast.error(message);
    },
  });
};

// Update user role (Admin)
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRole }) =>
      userApi.updateUserRole(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() });
      toast.success("User role updated successfully");
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      const message =
        error.response?.data?.message || "Failed to update user role";
      toast.error(message);
    },
  });
};

// Bulk update users (Admin)
export const useBulkUpdateUsers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkUpdateUsers) => userApi.bulkUpdateUsers(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() });
      toast.success(`${result.data?.updated || 0} users updated successfully`);
      if (result.data?.errors && result.data.errors.length > 0) {
        result.data.errors.forEach((error: string) => toast.error(error));
      }
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      const message = error.response?.data?.message || "Failed to update users";
      toast.error(message);
    },
  });
};
