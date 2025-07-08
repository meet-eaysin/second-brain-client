import ForgotPassword from "@/modules/auth/components/forgot-password";
import {ErrorBoundary} from "@/app/providers/ErrorBoundary.tsx";

export const ForgotPasswordPage = () => {
    return (
        <ErrorBoundary>
                <ForgotPassword />
        </ErrorBoundary>
    )
}
