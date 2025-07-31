import {
    SignInPage,
    SignUpPage,
    ForgotPasswordPage,
    OtpPage,
    GoogleCallbackPage,
    AuthNotFoundPage,
    AuthErrorPage
} from '@/app/router/lazy-components'
import type {RouteObject} from "react-router-dom";

export const authRoutes: RouteObject[] = [
    {
        path: "sign-in",
        element: <SignInPage />,
    },
    {
        path: "sign-up",
        element: <SignUpPage />,
    },
    {
        path: "change-password",
        element: <div>Change Password</div>,
    },
    {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
    },
    {
        path: "otp",
        element: <OtpPage />,
    },
    {
        path: "google/callback",
        element: <GoogleCallbackPage />,
    },
    {
        path: "callback",
        element: <GoogleCallbackPage />,
    },
    {
        path: "error",
        element: <AuthErrorPage />,
    },
    {
        path: '*',
        element: <AuthNotFoundPage />,
    },
]
