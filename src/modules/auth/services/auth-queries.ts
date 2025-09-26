import type { ApiError } from "@/types/api.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "./auth-api";
import { useAuthStore } from "../store/authStore.ts";
import {
  setToken,
  setRefreshToken,
  hasToken,
  removeTokens,
} from "../utils/tokenUtils.ts";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { useEffect } from "react";
import type { AuthResponse } from "@/modules/auth/types/auth.types.ts";
import {
  getDashboardLink,
  getSignInLink,
  getSignOutLink,
} from "@/app/router/router-link.ts";

export const AUTH_KEYS = {
  user: ["auth", "user"] as const,
  login: ["auth", "login"] as const,
  register: ["auth", "register"] as const,
  googleLogin: ["auth", "google"] as const,
};

interface LoginMutationOptions {
  onSuccess?: (data: AuthResponse) => void;
  onError?: (error: Error) => void;
}

let isUserQueryActive = false;

export const useCurrentUser = () => {
  const { setUser, clearUser } = useAuthStore();

  const { user: existingUser } = useAuthStore();

  const tokenExists = hasToken();
  const shouldFetch = tokenExists && !existingUser && !isUserQueryActive;

  const query = useQuery({
    queryKey: AUTH_KEYS.user,
    queryFn: async () => {
      isUserQueryActive = true;
      try {
        const result = await authApi.getCurrentUser();
        return result;
      } finally {
        isUserQueryActive = false;
      }
    },
    enabled: shouldFetch,
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    retry: 1,
    networkMode: "online",
    notifyOnChangeProps: ["data", "error", "isLoading"],
  });

  useEffect(() => {
    if (query.data && query.isSuccess) setUser(query.data);
  }, [query.data, query.isSuccess, setUser]);

  useEffect(() => {
    if (query.error && query.isError) {
      const error = query.error as AxiosError;
      if (error?.response?.status === 401) {
        removeTokens();
        clearUser();
        isUserQueryActive = false; // Reset flag on error
      }
    }
  }, [query.error, query.isError, clearUser]);

  return query;
};

export const useLoginMutation = (options?: LoginMutationOptions) => {
  const { setUser, setLoading } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data: AuthResponse) => {
      setToken(data.accessToken);
      setRefreshToken(data.refreshToken);

      setUser(data.user);
      queryClient.setQueryData(AUTH_KEYS.user, data.user);

      setLoading(false);
      toast.success("Login successful! Welcome back.");

      if (options?.onSuccess) options.onSuccess(data);
    },
    onError: (error: AxiosError<ApiError>) => {
      setLoading(false);

      if (error.response?.status === 401) {
        toast.error("Invalid email or password. Please try again.");
      } else if (error.response?.status === 429) {
        toast.error(
          "Too many login attempts. Please wait a few minutes before trying again."
        );
      } else if (error.response?.status === 422) {
        const validationErrors = error.response.data?.errors;
        if (validationErrors) {
          const firstError = Object.values(validationErrors)[0];
          toast.error(
            Array.isArray(firstError) ? firstError[0] : "Validation error"
          );
        } else {
          toast.error("Please check your input and try again.");
        }
      } else if (!error.response) {
        toast.error(
          "Network error. Please check your connection and try again."
        );
      } else {
        const message =
          error.response?.data?.message || "Login failed. Please try again.";
        toast.error(message);
      }

      if (options?.onError) options.onError(error as Error);
    },
  });
};

export const useRegisterMutation = () => {
  const queryClient = useQueryClient();
  const { setUser, setLoading, intendedPath, setIntendedPath } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.register,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data: AuthResponse) => {
      setToken(data.accessToken);
      setRefreshToken(data.refreshToken);

      setUser(data.user);
      queryClient.setQueryData(AUTH_KEYS.user, data.user);

      setLoading(false);
      toast.success("Registration successful! Welcome to Second Brain.");

      const targetPath = intendedPath || getDashboardLink();
      setIntendedPath(null); // Clear intended path
      navigate(targetPath, { replace: true });
    },
    onError: (error: AxiosError<ApiError>) => {
      setLoading(false);

      if (error.response?.status === 409) {
        toast.error(
          "An account with this email already exists. Please sign in instead."
        );
      } else if (error.response?.status === 422) {
        const validationErrors = error.response.data?.errors;
        if (validationErrors) {
          const errorMessages = Object.entries(validationErrors).map(
            ([field, messages]) => {
              const messageArray = Array.isArray(messages)
                ? messages
                : [messages];
              return `${field}: ${messageArray[0]}`;
            }
          );
          toast.error(errorMessages[0]);
        } else {
          toast.error("Please check your input and try again.");
        }
      } else if (error.response?.status === 429) {
        toast.error(
          "Too many registration attempts. Please wait a few minutes before trying again."
        );
      } else if (!error.response) {
        toast.error(
          "Network error. Please check your connection and try again."
        );
      } else {
        const message =
          error.response?.data?.message ||
          "Registration failed. Please try again.";
        toast.error(message);
      }
    },
  });
};

export const useGoogleLoginMutation = () => {
  const queryClient = useQueryClient();
  const { setUser, setLoading, intendedPath, setIntendedPath } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.handleGoogleCallback,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data: AuthResponse) => {
      setToken(data.accessToken);
      setRefreshToken(data.refreshToken);

      setUser(data.user);

      queryClient.setQueryData(AUTH_KEYS.user, data.user);

      setLoading(false);
      toast.success("Google login successful! Welcome to Second Brain.");

      const targetPath = intendedPath || getDashboardLink();
      setIntendedPath(null); // Clear intended path
      navigate(targetPath, { replace: true });
    },
    onError: (error: AxiosError<ApiError>) => {
      setLoading(false);
      const message = error.response?.data?.message || "Google login failed";
      toast.error(message);
      navigate(getSignInLink(), { replace: true });
    },
  });
};

export const useGoogleTokenMutation = () => {
  const queryClient = useQueryClient();
  const { setUser, setLoading, intendedPath, setIntendedPath } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({
      accessToken,
      refreshToken,
    }: {
      accessToken: string;
      refreshToken: string;
    }) => {
      setToken(accessToken);
      setRefreshToken(refreshToken);

      return await authApi.getCurrentUser();
    },
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (user) => {
      setUser(user);

      queryClient.setQueryData(AUTH_KEYS.user, user);

      setLoading(false);
      toast.success(
        "Google authentication successful! Welcome to Second Brain."
      );

      const targetPath = intendedPath || getDashboardLink();
      setIntendedPath(null); // Clear intended path
      navigate(targetPath, { replace: true });
    },
    onError: (error: AxiosError<ApiError>) => {
      setLoading(false);
      removeTokens();

      const message = error.response?.data?.message || "Authentication failed";
      toast.error(message);
      navigate(getSignInLink(), { replace: true });
    },
  });
};

export const useLogoutMutation = () => {
  const { clearUser, setLoading } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      removeTokens();
      clearUser();

      queryClient.clear();
      setLoading(false);
      toast.success("Logged out successfully");

      setTimeout(() => {
        window.location.href = getSignInLink();
      }, 100);
    },
    onError: (error: AxiosError<ApiError>) => {
      removeTokens();
      clearUser();
      queryClient.clear();
      setLoading(false);

      setTimeout(() => {
        window.location.href = getSignInLink();
      }, 100);

      const message =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        "Logout failed";
      toast.error(message);
      window.location.href = getSignInLink();
    },
  });
};

export const useLogoutAllMutation = () => {
  const queryClient = useQueryClient();
  const { clearUser, setLoading } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.logoutAll,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      removeTokens();
      clearUser();
      queryClient.clear();
      setLoading(false);

      toast.success("Logged out from all devices successfully");
      navigate(getSignInLink());
    },
    onError: (error: AxiosError<ApiError>) => {
      removeTokens();
      clearUser();
      queryClient.clear();
      setLoading(false);

      const message =
        error.response?.data?.message || "Logout from all devices failed";
      toast.error(message);
      navigate(getSignInLink());
    },
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error.response?.data?.message || "Password change failed";
      toast.error(message);
    },
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      toast.success("Password reset email sent successfully");
    },
    onError: (error: AxiosError<ApiError>) => {
      const message =
        error.response?.data?.message || "Failed to send reset email";
      toast.error(message);
    },
  });
};

export const useResetPasswordMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      toast.success("Password reset successfully");
      navigate(getSignOutLink());
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error.response?.data?.message || "Password reset failed";
      toast.error(message);
    },
  });
};
