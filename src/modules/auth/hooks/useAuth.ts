import { useAuthStore } from '../store/authStore';
import { useCurrentUser } from '../services/authQueries';
import { hasToken } from '../utils/tokenUtils';

export const useAuth = () => {
    const {
        user,
        isAuthenticated,
        isLoading: storeLoading,
        error: storeError,
        intendedPath,
        setIntendedPath,
        clearError
    } = useAuthStore();
    const userQuery = useCurrentUser();

    return {
        user,
        isAuthenticated,
        isLoading: storeLoading || userQuery.isLoading,
        hasToken: hasToken(),
        error: storeError || userQuery.error,
        intendedPath,
        setIntendedPath,
        clearError,
        refetch: userQuery.refetch,
    };
};
