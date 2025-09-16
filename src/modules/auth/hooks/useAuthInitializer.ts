import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useCurrentUser } from "../services/auth-queries";
import { hasToken, removeTokens } from "../utils/tokenUtils";

export const useAuthInitializer = () => {
  const { setUser, clearUser, setLoading, setError, setInitialized } =
    useAuthStore();

  const userQuery = useCurrentUser();

  useEffect(() => {
    if (userQuery.data && userQuery.isSuccess) {
      setUser(userQuery.data);
      setLoading(false);
      setInitialized(true);
    } else if (userQuery.error && userQuery.isError) {
      const error = userQuery.error;
      if (error?.response?.status === 401) {
        removeTokens();
        clearUser();
      } else {
        setError(error?.message || "Authentication failed");
      }
      setLoading(false);
      setInitialized(true);
    } else if (userQuery.isLoading && hasToken()) {
      setLoading(true);
    } else if (!hasToken()) {
      clearUser();
      setLoading(false);
      setInitialized(true);
    }
  }, [
    userQuery.data,
    userQuery.error,
    userQuery.isSuccess,
    userQuery.isError,
    userQuery.isLoading,
    setUser,
    clearUser,
    setLoading,
    setError,
    setInitialized,
  ]);

  return {
    refetch: userQuery.refetch,
    isLoading: userQuery.isLoading,
    error: userQuery.error,
  };
};
