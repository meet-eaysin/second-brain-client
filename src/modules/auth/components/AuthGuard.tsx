import {type ReactNode, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import {LoadingSpinner} from "@/components/LoadingSpinner.tsx";
import {useAuth} from "@/modules/auth/hooks/useAuth.ts";

interface AuthGuardProps {
    children: ReactNode
    redirectTo?: string
}

export const AuthGuard = ({ children, redirectTo = '/auth/login' }: AuthGuardProps) => {
    const { isAuthenticated, isLoading } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate(redirectTo)
        }
    }, [isAuthenticated, isLoading, navigate, redirectTo])

    if (isLoading) {
        return <LoadingSpinner />
    }

    if (!isAuthenticated) {
        return null
    }

    return <>{children}</>
}
