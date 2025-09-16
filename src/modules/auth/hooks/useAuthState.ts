import { useAuthStore } from "../store/authStore";
import { hasToken } from "../utils/tokenUtils";

export const useAuthState = () => {
  const authStore = useAuthStore();

  return {
    ...authStore,
    hasToken: hasToken(),
  };
};
