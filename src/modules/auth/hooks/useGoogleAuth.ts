import { useCallback } from 'react'
import { useGoogleLogin as useGoogleLoginMutation } from '../services/authQueries.ts'

export const useGoogleAuth = () => {
    const googleLoginMutation = useGoogleLoginMutation()

    const handleGoogleLogin = useCallback((token: string) => {
        googleLoginMutation.mutate(token)
    }, [googleLoginMutation])

    return {
        handleGoogleLogin,
        isLoading: googleLoginMutation.isPending,
        error: googleLoginMutation.error,
    }
}
