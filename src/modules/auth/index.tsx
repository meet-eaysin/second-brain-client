
import { AuthNotFound } from './components/AuthNotFound'
import {ErrorBoundary} from "@/app/providers/ErrorBoundary.tsx";
import {AuthLayout} from "@/modules/auth/components/AuthLayout.tsx";
import {LoginPage} from "@/modules/auth/pages/login-page.tsx";
import {RegisterPage} from "@/modules/auth/pages/RegisterPage.tsx";
import {ForgotPasswordPage} from "@/modules/auth/pages/ForgotPasswordPage.tsx";

export const authRoutes = [
    {
        path: 'login',
        element: (
            <ErrorBoundary>
                <AuthLayout title="Sign in to your account">
                    <LoginPage />
                </AuthLayout>
            </ErrorBoundary>
        ),
    },
    {
        path: 'register',
        element: (
            <ErrorBoundary>
                <AuthLayout title="Create your account">
                    <RegisterPage />
                </AuthLayout>
            </ErrorBoundary>
        ),
    },
    {
        path: 'forgot-password',
        element: (
            <ErrorBoundary>
                <AuthLayout title="Reset your password">
                    <ForgotPasswordPage />
                </AuthLayout>
            </ErrorBoundary>
        ),
    },
    {
        path: '*',
        element: (
            <ErrorBoundary>
                <AuthLayout title="Page Not Found">
                    <AuthNotFound />
                </AuthLayout>
            </ErrorBoundary>
        ),
    },
]
