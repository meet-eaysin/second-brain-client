import { useAuthInitializer } from './useAuthInitializer';
import { useAuthState } from './useAuthState';

export const useAuth = () => {
    const authState = useAuthState();
    const { refetch } = useAuthInitializer();

    return {
        ...authState,
        refetch,
    };
};
