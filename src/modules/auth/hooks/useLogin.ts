import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useLogin as useLoginMutation } from '../services/authQueries.ts'
import type {LoginCredentials} from "@/modules/auth";

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const useLogin = () => {
    const loginMutation = useLoginMutation()

    const form = useForm<LoginCredentials>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const handleLogin = (data: LoginCredentials) => {
        loginMutation.mutate(data)
    }

    return {
        form,
        handleLogin,
        isLoading: loginMutation.isPending,
        error: loginMutation.error,
    }
}
