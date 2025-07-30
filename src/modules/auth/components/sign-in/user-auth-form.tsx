import type {HTMLAttributes} from "react";
import {useLogin} from "@/modules/auth/hooks/useLogin.ts";
import {authApi} from "@/modules/auth/services/authApi.ts";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {PasswordInput} from "@/components/password-input.tsx";
import {Link} from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";
import {IconBrandGoogle} from "@tabler/icons-react";
import {cn} from "@/lib/utils.ts";
import { toast } from 'sonner';

type UserAuthFormProps = HTMLAttributes<HTMLFormElement>

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
    const { form, handleLogin, isLoading, error } = useLogin()

    const handleGoogleLogin = async () => {
        try {
            // Check if Google OAuth is available
            const isAvailable = await authApi.checkGoogleOAuthAvailability();
            if (!isAvailable) {
                toast.error('Google OAuth is not configured on the backend. Please use email/password login or contact your administrator.');
                return;
            }

            const response = await authApi.getGoogleLoginUrl();
            if (response.url) {
                window.location.href = response.url;
            }
        } catch (error: any) {
            console.error('Failed to get Google login URL:', error);
            toast.error(error.message || 'Failed to initiate Google login. Please try again.');
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleLogin)}
                className={cn('grid gap-3', className)}
                {...props}
            >
                <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='name@example.com'
                                    {...field}
                                    disabled={isLoading}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                        <FormItem className='relative'>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <PasswordInput
                                    placeholder='********'
                                    {...field}
                                    disabled={isLoading}
                                />
                            </FormControl>
                            <FormMessage />
                            <Link
                                to='/auth/forgot-password'
                                className='text-muted-foreground absolute -top-0.5 right-0 text-sm font-medium hover:opacity-75'
                            >
                                Forgot password?
                            </Link>
                        </FormItem>
                    )}
                />

                {error && (
                    <div className="text-sm text-red-600">
                        {error.message}
                    </div>
                )}

                <Button className='mt-2' disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>

                <div className='relative my-2'>
                    <div className='absolute inset-0 flex items-center'>
                        <span className='w-full border-t' />
                    </div>
                    <div className='relative flex justify-center text-xs uppercase'>
                        <span className='bg-background text-muted-foreground px-2'>
                            Or continue with
                        </span>
                    </div>
                </div>

                <Button
                    variant='outline'
                    type='button'
                    disabled={isLoading}
                    onClick={handleGoogleLogin}
                    className="w-full"
                >
                    <IconBrandGoogle className='h-4 w-4 mr-2' />
                    Continue with Google
                </Button>
            </form>
        </Form>
    )
}
