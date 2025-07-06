import {Button} from "@/components/ui/button.tsx";
import {useGoogleAuth} from "@/modules/auth/hooks/useGoogleAuth.ts";

declare global {
    interface Window {
        google: any
    }
}

export const GoogleLoginButton = () => {
    const { handleGoogleLogin, isLoading, error } = useGoogleAuth()

    const handleGoogleResponse = (response: any) => {
        if (response.credential) {
            handleGoogleLogin(response.credential)
        }
    }

    const initializeGoogleLogin = () => {
        if (window.google) {
            window.google.accounts.id.initialize({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                callback: handleGoogleResponse,
            })

            window.google.accounts.id.prompt()
        }
    }

    return (
        <div className="w-full">
            <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={initializeGoogleLogin}
                disabled={isLoading}
            >
                {isLoading ? 'Signing in...' : 'Sign in with Google'}
            </Button>

            {error && (
                <div className="text-red-600 text-sm mt-2">
                    {error.message}
                </div>
            )}
        </div>
    )
}