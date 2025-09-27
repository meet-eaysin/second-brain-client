import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authApi } from "../services/auth-api";
import {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useLogoutAllMutation,
  useGoogleTokenMutation,
  useCurrentUser,
} from "../services/auth-queries.ts";
import { useAuthStore } from "../store/auth-store.ts";
import { hasToken, removeTokens } from "../utils/tokenUtils";
import { getSignInLink } from "@/app/router/router-link";
import type {
  LoginCredentials,
  RegisterCredentials,
} from "../types/auth.types";

export const useAuthService = () => {
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    setIntendedPath,
    clearError,
    setLoading,
  } = useAuthStore();

  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const logoutMutation = useLogoutMutation();
  const logoutAllMutation = useLogoutAllMutation();
  const googleTokenMutation = useGoogleTokenMutation();
  const currentUserQuery = useCurrentUser();

  const login = async (credentials: LoginCredentials) => {
    try {
      clearError();
      await loginMutation.mutateAsync(credentials);
    } catch (error: unknown) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (userData: RegisterCredentials) => {
    try {
      clearError();
      await registerMutation.mutateAsync(userData);
    } catch (error: unknown) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      clearError();
      setLoading(true);

      const currentPath = window.location.pathname;
      if (currentPath !== getSignInLink() && currentPath !== "/auth/sign-up") {
        setIntendedPath(currentPath);
      }

      const isAvailable = await authApi.checkGoogleOAuthAvailability();
      if (!isAvailable) {
        throw new Error(
          "Google OAuth is not configured. Please use email/password login or contact your administrator."
        );
      }

      const { accessToken, refreshToken } =
        await authApi.initiateGoogleAuthPopup();

      await handleGoogleTokens(accessToken, refreshToken);
    } catch (error: unknown) {
      setLoading(false);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to initiate Google login. Please try again.";
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleGoogleTokens = async (
    accessToken: string,
    refreshToken: string
  ) => {
    await googleTokenMutation.mutateAsync({ accessToken, refreshToken });
  };

  // Logout current session
  const logout = async () => await logoutMutation.mutateAsync();

  // Logout all devices
  const logoutAll = async () => await logoutAllMutation.mutateAsync();

  const refreshToken = async () => {
    try {
      await currentUserQuery.refetch();
      return true;
    } catch (error: unknown) {
      console.error("Token refresh failed:", error);
      return false;
    }
  };

  // Check current authentication status
  const checkAuth = () => {
    const tokenExists = hasToken();
    return {
      hasToken: tokenExists,
      isAuthenticated,
      user,
      isLoading: isLoading || currentUserQuery.isLoading,
      error: error || currentUserQuery.error,
    };
  };

  const clearAuthAndRedirect = (redirectPath?: string) => {
    removeTokens();
    useAuthStore.getState().clearUser();
    navigate(redirectPath || getSignInLink(), { replace: true });
  };

  return {
    // State
    user,
    isAuthenticated,
    isLoading:
      isLoading ||
      loginMutation.isPending ||
      registerMutation.isPending ||
      logoutMutation.isPending ||
      logoutAllMutation.isPending ||
      googleTokenMutation.isPending,
    error,
    hasToken: hasToken(),

    // Actions
    login,
    register,
    loginWithGoogle,
    handleGoogleTokens,
    logout,
    logoutAll,
    refreshToken,
    checkAuth,
    clearAuthAndRedirect,

    // Utilities
    setIntendedPath,
    clearError,

    // Mutation states for granular loading control
    loginLoading: loginMutation.isPending,
    registerLoading: registerMutation.isPending,
    logoutLoading: logoutMutation.isPending,
    logoutAllLoading: logoutAllMutation.isPending,
    googleTokenLoading: googleTokenMutation.isPending,
  };
};
