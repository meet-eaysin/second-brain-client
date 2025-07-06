import { LoginForm } from '../components/LoginForm.tsx'
import { GoogleLoginButton } from '../components/GoogleLoginButton.tsx'

export const RegisterPage = () => {
    return (
        <div className="space-y-4">
            <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">Register</h3>
            </div>
            <LoginForm />
            <GoogleLoginButton />
        </div>
    )
}
