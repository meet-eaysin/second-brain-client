import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "./user-api.ts";
import { useAuthStore } from "@/modules/auth/store/auth-store.ts";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import type { ApiError } from "@/types/api.types";
import type { User } from "@/modules/auth/types/auth.types";
import type {UpdateProfile} from "@/modules/users/types/users.types.ts";

export const PROFILE_KEYS = {
  all: ["profile"] as const,
  update: () => [...PROFILE_KEYS.all, "update"] as const,
  avatar: () => [...PROFILE_KEYS.all, "avatar"] as const,
};

// Update user profile mutation
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: UpdateProfile) => userApi.updateUserProfile(data),
    onSuccess: (response) => {
      if (response.data) {
        // Map the API response to the auth User type
        const authUser: User = {
          ...response.data,
          authProvider:
            response.data.authProvider === "LOCAL" ? "email" : "google",
        };
        updateUser(authUser);
        queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
        toast.success("Profile updated successfully");
      }
    },
    onError: (error: AxiosError<ApiError>) => {
      const message =
        error.response?.data?.message ||
        "Failed to update profile. Please try again.";
      toast.error(message);
    },
  });
};

// Upload avatar mutation
export const useUploadAvatar = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();

  return useMutation({
    mutationFn: (file: File) => userApi.uploadAvatar(file),
    onSuccess: (response) => {
      if (response.data) {
        const authUser: User = {
          id: response.data.id,
          email: response.data.email,
          username: response.data.firstName || "",
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          role: response.data.role,
          authProvider: "email",
          isEmailVerified: true,
          avatar: response.data.profilePicture,
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
        };
        updateUser(authUser);
        queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
        toast.success("Profile picture updated successfully");
      }
    },
    onError: (error: AxiosError<ApiError>) => {
      const message =
        error.response?.data?.message ||
        "Failed to upload avatar. Please try again.";
      toast.error(message);
    },
  });
};

export const useDeleteAvatar = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();

  return useMutation({
    mutationFn: () => userApi.deleteAvatar(),
    onSuccess: (response) => {
      if (response.data) {
        const authUser: User = {
          id: response.data.id,
          email: response.data.email,
          username: response.data.firstName || "",
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          role: response.data.role,
          authProvider: "email",
          isEmailVerified: true,
          avatar: response.data.profilePicture,
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
        };
        updateUser(authUser);
        queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
        toast.success("Profile picture removed successfully");
      }
    },
    onError: (error: AxiosError<ApiError>) => {
      const message =
        error.response?.data?.message ||
        "Failed to remove avatar. Please try again.";
      toast.error(message);
    },
  });
};
