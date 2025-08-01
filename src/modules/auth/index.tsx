import { type RouteObject } from "react-router-dom";
import { ForgotPasswordPage } from "./pages/forgot-password-page.tsx";
import ChangePasswordPage from "./pages/change-password-page.tsx";
import ResetPasswordPage from "./pages/reset-password-page.tsx";
import {
    AuthErrorPage, AuthNotFoundPage,
    GoogleCallbackPage,
    GooglePopupCallbackPage,
    OtpPage,
    SignInPage,
    SignUpPage
} from "@/app/router/lazy-components";

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
        element: <ChangePasswordPage />,
    },
    {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
    },
    {
        path: "reset-password",
        element: <ResetPasswordPage />,
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
        path: "google/popup-callback",
        element: <GooglePopupCallbackPage />,
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

export { useAuth } from "./hooks/useAuth.ts";
export { useAuthService } from "./hooks/useAuthService.ts";
export { AuthGuard } from "./components/auth-guard.tsx";
export type { User, AuthResponse } from "./types/auth.types.ts";