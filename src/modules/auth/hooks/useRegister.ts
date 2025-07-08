import { z } from "zod";
import type { RegisterCredentials } from "@/modules/auth/types/auth.types.ts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegisterMutation } from "../services/authQueries.ts";

const registerSchema = z.object({
    username: z.string()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username cannot exceed 30 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    email: z.string().email('Invalid email address'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        ),
    firstName: z.string().max(50, 'First name cannot exceed 50 characters').optional(),
    lastName: z.string().max(50, 'Last name cannot exceed 50 characters').optional(),
});

export const useRegister = () => {
    const registerMutation = useRegisterMutation();

    const form = useForm<RegisterCredentials>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            firstName: '',
            lastName: '',
        },
    });

    const handleRegister = (data: RegisterCredentials) => {
        registerMutation.mutate(data);
    };

    return {
        form,
        handleRegister,
        isLoading: registerMutation.isPending,
        error: registerMutation.error,
    };
};
