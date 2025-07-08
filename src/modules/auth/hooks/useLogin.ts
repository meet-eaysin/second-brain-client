import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLoginMutation } from '../services/authQueries.ts';
import type { LoginCredentials } from "@/modules/auth/types/auth.types.ts";
import {useNavigate} from "react-router-dom";
import {getDashboardLink} from "@/app/router/router-link.ts";

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const useLogin = () => {
    const navigate = useNavigate();

    const loginMutation = useLoginMutation({
        onSuccess: () => {
            const intendedPath = localStorage.getItem('intendedPath') || getDashboardLink();
            localStorage.removeItem('intendedPath');

            navigate(intendedPath, { replace: true });
        },
        onError: (error) => {
            console.error('Login failed:', error);
        }
    });

    const form = useForm<LoginCredentials>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const handleLogin = (data: LoginCredentials) => {
        loginMutation.mutate(data);
    };

    return {
        form,
        handleLogin,
        isLoading: loginMutation.isPending,
        error: loginMutation.error,
        mutate: loginMutation.mutate,
    };
};
