import { useAuthStore } from '../store/authStore'
import { useCurrentUser } from '../services/authQueries.ts'
import { getToken } from '../utils/tokenUtils'

export const useAuth = () => {
    const authState = useAuthStore()
    const token = getToken()

    // Fetch user data if token exists but user is not set
    const { isLoading: isUserLoading } = useCurrentUser()

    const isLoading = authState.isLoading || isUserLoading
    const isAuthenticated = !!authState.user || !!token

    return {
        ...authState,
        isLoading,
        isAuthenticated,
        hasToken: !!token,
    }
}
