import { useAuthStore } from "../store/auth-store.ts";
import { hasToken } from "../utils/tokenUtils";

export const useAuthState = () => {
  const authStore = useAuthStore();

  return {
    ...authStore,
    hasToken: hasToken(),
  };
};
