import { useEffect, useCallback, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../services/authApi';
import { hasToken, removeTokens } from '../utils/tokenUtils';

export const useAuthInitializer = () => {
    const {
        isInitialized,
        setUser,
        clearUser,
        setLoading,
        setError,
    } = useAuthStore();

    const isInitializingRef = useRef(false);

    const initializeAuth = useCallback(async () => {
        if (isInitializingRef.current || isInitialized || !hasToken()) {
            return;
        }

        isInitializingRef.current = true;
        setLoading(true);

        try {
            const userData = await authApi.getCurrentUser();
            setUser(userData);
        } catch (error: any) {
            if (error?.response?.status === 401) {
                removeTokens();
                clearUser();
            } else {
                setError(error?.message || 'Authentication failed');
            }
        } finally {
            setLoading(false);
            isInitializingRef.current = false;
        }
    }, [isInitialized, setUser, clearUser, setLoading, setError]);

    useEffect(() => {
        initializeAuth();
    }, []);

    return { refetch: initializeAuth };
};

