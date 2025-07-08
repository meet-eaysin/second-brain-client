import { AuthNotFoundPage } from './pages/auth-not-found-page.tsx'
import {OtpPage} from "@/modules/auth/pages/otp-page.tsx";
import {SignInPage} from "@/modules/auth/pages/sign-in-page.tsx";
import {SignUpPage} from "@/modules/auth/pages/sign-up-page.tsx";
import {ForgotPasswordPage} from "@/modules/auth/pages/forgot-password-page.tsx";

export const authRoutes = [
    {
        path: "sign-in",
        element: <SignInPage/>,
    },
    {
        path: "sign-up",
        element: <SignUpPage/>,
    },
    {
        path: "change-password",
        element: <div>Change Password</div>
    },
    {
        path: "forgot-password",
        element: <ForgotPasswordPage/>,
    },
    {
        path: "otp",
        element: <OtpPage/>,
    },
    {
        path: '*',
        element: <AuthNotFoundPage/>,
    },
]