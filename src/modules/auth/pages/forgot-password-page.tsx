import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { authApi } from '../services/authApi';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { getSignInLink } from '@/app/router/router-link';

const forgotPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState(false);
    const [emailSent, setEmailSent] = React.useState(false);

    const form = useForm<ForgotPasswordForm>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = async (data: ForgotPasswordForm) => {
        try {
            setIsLoading(true);
            await authApi.forgotPassword(data);
            setEmailSent(true);
            toast.success('Password reset email sent successfully');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to send reset email');
        } finally {
            setIsLoading(false);
        }
    };

    if (emailSent) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="w-full max-w-md space-y-6">
                    <div className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold">Check Your Email</h1>
                        <p className="text-muted-foreground mt-2">
                            We've sent a password reset link to your email address.
                        </p>
                    </div>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-4 text-center">
                                <p className="text-sm text-muted-foreground">
                                    Didn't receive the email? Check your spam folder or try again.
                                </p>
                                <div className="space-y-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setEmailSent(false)}
                                        className="w-full"
                                    >
                                        Try Again
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        asChild
                                        className="w-full"
                                    >
                                        <Link to={getSignInLink()}>
                                            Back to Sign In
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(getSignInLink())}
                        className="p-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-primary" />
                        <h1 className="text-xl font-semibold">Forgot Password</h1>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Reset Your Password</CardTitle>
                        <CardDescription>
                            Enter your email address and we'll send you a link to reset your password.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email Address</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="Enter your email"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                                </Button>
                            </form>
                        </Form>

                        <div className="mt-4 text-center">
                            <p className="text-sm text-muted-foreground">
                                Remember your password?{' '}
                                <Link
                                    to={getSignInLink()}
                                    className="text-primary hover:underline font-medium"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;