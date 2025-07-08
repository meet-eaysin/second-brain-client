import { useAuthStore } from '../store/authStore';
import { useCurrentUser } from '../services/authQueries';
import { hasToken } from '../utils/tokenUtils';

export const useAuth = () => {
    const { user, isAuthenticated } = useAuthStore();
    const userQuery = useCurrentUser();

    return {
        user,
        isAuthenticated,
        isLoading: userQuery.isLoading,
        hasToken: hasToken(),
        error: userQuery.error,
        refetch: userQuery.refetch,
    };
};
