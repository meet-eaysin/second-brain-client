import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/password-input';
import { toast } from 'sonner';
import { authApi } from '../services/authApi';
import { KeyRound } from 'lucide-react';
import { getSignInLink } from '@/app/router/router-link';

const resetPasswordSchema = z.object({
    newPassword: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
    confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState(false);
    const resetToken = searchParams.get('token');

    const form = useForm<ResetPasswordForm>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            newPassword: '',
            confirmPassword: '',
        },
    });

    React.useEffect(() => {
        if (!resetToken) {
            toast.error('Invalid reset link');
            navigate(getSignInLink());
        }
    }, [resetToken, navigate]);

    const onSubmit = async (data: ResetPasswordForm) => {
        if (!resetToken) return;

        try {
            setIsLoading(true);
            await authApi.resetPassword({
                resetToken,
                newPassword: data.newPassword,
            });
            toast.success('Password reset successfully. You can now sign in with your new password.');
            navigate(getSignInLink());
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    if (!resetToken) {
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-6">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                            <KeyRound className="h-6 w-6 text-primary" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold">Reset Your Password</h1>
                    <p className="text-muted-foreground mt-2">
                        Enter your new password below
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Create New Password</CardTitle>
                        <CardDescription>
                            Choose a strong password that you haven't used before.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="newPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>New Password</FormLabel>
                                            <FormControl>
                                                <PasswordInput
                                                    placeholder="Enter new password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm Password</FormLabel>
                                            <FormControl>
                                                <PasswordInput
                                                    placeholder="Confirm new password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? 'Resetting Password...' : 'Reset Password'}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ResetPasswordPage;