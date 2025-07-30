import {type HTMLAttributes} from 'react'
import { IconBrandFacebook, IconBrandGithub, IconBrandGoogle } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { authApi } from '../../services/authApi.ts'
import { useRegister } from '../../hooks/useRegister.ts'
import { toast } from 'sonner'

type SignUpFormProps = HTMLAttributes<HTMLFormElement>



export function SignUpForm({ className, ...props }: SignUpFormProps) {
    const { form, handleRegister, isLoading, error } = useRegister();

    const handleGoogleSignUp = async () => {
        try {
            // Check if Google OAuth is available
            const isAvailable = await authApi.checkGoogleOAuthAvailability();
            if (!isAvailable) {
                toast.error('Google OAuth is not configured on the backend. Please use the registration form or contact your administrator.');
                return;
            }

            const response = await authApi.getGoogleLoginUrl();
            if (response.url) {
                window.location.href = response.url;
            }
        } catch (error: any) {
            console.error('Failed to get Google login URL:', error);
            toast.error(error.message || 'Failed to initiate Google sign-up. Please try again.');
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleRegister)}
                className={cn('grid gap-3', className)}
                {...props}
            >
                <FormField
                    control={form.control}
                    name='username'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder='username' {...field} disabled={isLoading} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder='name@example.com' {...field} disabled={isLoading} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-2">
                    <FormField
                        control={form.control}
                        name='firstName'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input placeholder='John' {...field} disabled={isLoading} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='lastName'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input placeholder='Doe' {...field} disabled={isLoading} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <PasswordInput placeholder='********' {...field} disabled={isLoading} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button className='mt-2' disabled={isLoading}>
                    Create Account
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
                    onClick={handleGoogleSignUp}
                    className="w-full"
                >
                    <IconBrandGoogle className='h-4 w-4 mr-2' />
                    Continue with Google
                </Button>
            </form>
        </Form>
    )
}