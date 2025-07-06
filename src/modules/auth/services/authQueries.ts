import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi } from './authApi.ts'
import { useAuthStore } from '../store/authStore.ts'
import { removeToken, setToken } from '../utils/tokenUtils.ts'

export const AUTH_KEYS = {
    user: ['auth', 'user'] as const,
    login: ['auth', 'login'] as const,
    register: ['auth', 'register'] as const,
    googleLogin: ['auth', 'google'] as const,
}

export const useCurrentUser = () => {
    const { setUser, setLoading, setError } = useAuthStore()

    return useQuery({
        queryKey: AUTH_KEYS.user,
        queryFn: authApi.getCurrentUser,
        enabled: !!localStorage.getItem('token'),
        onSuccess: (data) => {
            setUser(data.user)
            setLoading(false)
        },
        onError: (error: any) => {
            setError(error.message)
            setUser(null)
            removeToken()
        },
        retry: false,
    })
}

export const useLogin = () => {
    const queryClient = useQueryClient()
    const { setUser, setLoading, setError } = useAuthStore()

    return useMutation({
        mutationFn: authApi.login,
        onMutate: () => {
            setLoading(true)
            setError(null)
        },
        onSuccess: (data) => {
            setToken(data.token)
            setUser(data.user)
            queryClient.setQueryData(AUTH_KEYS.user, { user: data.user })
            setLoading(false)
        },
        onError: (error: any) => {
            setError(error.message)
            setLoading(false)
        },
    })
}

export const useRegister = () => {
    const queryClient = useQueryClient()
    const { setUser, setLoading, setError } = useAuthStore()

    return useMutation({
        mutationFn: authApi.register,
        onMutate: () => {
            setLoading(true)
            setError(null)
        },
        onSuccess: (data) => {
            setToken(data.token)
            setUser(data.user)
            queryClient.setQueryData(AUTH_KEYS.user, { user: data.user })
            setLoading(false)
        },
        onError: (error: any) => {
            setError(error.message)
            setLoading(false)
        },
    })
}

export const useGoogleLogin = () => {
    const queryClient = useQueryClient()
    const { setUser, setLoading, setError } = useAuthStore()

    return useMutation({
        mutationFn: authApi.googleLogin,
        onMutate: () => {
            setLoading(true)
            setError(null)
        },
        onSuccess: (data) => {
            setToken(data.token)
            setUser(data.user)
            queryClient.setQueryData(AUTH_KEYS.user, { user: data.user })
            setLoading(false)
        },
        onError: (error: any) => {
            setError(error.message)
            setLoading(false)
        },
    })
}

export const useLogout = () => {
    const queryClient = useQueryClient()
    const { logout } = useAuthStore()

    return useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            removeToken()
            logout()
            queryClient.clear()
        },
    })
}
