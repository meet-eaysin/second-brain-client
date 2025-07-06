import {LoginForm} from "@/modules/auth/components/LoginForm.tsx";
import {GoogleLoginButton} from "@/modules/auth/components/GoogleLoginButton.tsx";

export const LoginPage = () => {
    return (
        <div className="space-y-4">
            <LoginForm />
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
                </div>
            </div>
            <GoogleLoginButton />
        </div>
    )
}
