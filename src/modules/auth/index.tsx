import {
    SignInPage,
    SignUpPage,
    ForgotPasswordPage,
    OtpPage,
    AuthNotFoundPage
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
        element: <div>Change Password</div>, // Consider making this a lazy component too
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
        path: '*',
        element: <AuthNotFoundPage />,
    },
]
