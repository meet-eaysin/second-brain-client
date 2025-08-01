import { useEffect, useCallback, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { useCurrentUser } from '../services/authQueries';
import { hasToken, removeTokens } from '../utils/tokenUtils';

export const useAuthInitializer = () => {
    const {
        isInitialized,
        setUser,
        clearUser,
        setLoading,
        setError,
    } = useAuthStore();

    // Use React Query instead of direct API call
    const userQuery = useCurrentUser();
    const isInitializingRef = useRef(false);

    // Handle React Query results
    useEffect(() => {
        if (userQuery.data && userQuery.isSuccess) {
            console.log('🔄 useAuthInitializer: Setting user from React Query');
            setUser(userQuery.data);
            setLoading(false);
        } else if (userQuery.error && userQuery.isError) {
            console.log('❌ useAuthInitializer: Error from React Query');
            const error = userQuery.error as any;
            if (error?.response?.status === 401) {
                removeTokens();
                clearUser();
            } else {
                setError(error?.message || 'Authentication failed');
            }
            setLoading(false);
        } else if (userQuery.isLoading) {
            setLoading(true);
        }
    }, [userQuery.data, userQuery.error, userQuery.isSuccess, userQuery.isError, userQuery.isLoading, setUser, clearUser, setLoading, setError]);

    return {
        refetch: userQuery.refetch,
        isLoading: userQuery.isLoading,
        error: userQuery.error
    };
};

