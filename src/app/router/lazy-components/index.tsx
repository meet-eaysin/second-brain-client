import {withLazyLoading} from "@/app/router/lazy-components/with-lazy-loading.tsx";

// For components with default exports, import directly
export const SignInPage = withLazyLoading(() =>
    import('@/modules/auth/pages/sign-in-page')
)
export const SignUpPage = withLazyLoading(() =>
    import('@/modules/auth/pages/sign-up-page')
)
export const ForgotPasswordPage = withLazyLoading(() =>
    import('@/modules/auth/pages/forgot-password-page')
)
export const OtpPage = withLazyLoading(() =>
    import('@/modules/auth/pages/otp-page')
)
export const AuthNotFoundPage = withLazyLoading(() =>
    import('@/modules/auth/pages/auth-not-found-page')
)
export const DashboardPage = withLazyLoading(() =>
    import('@/modules/dashboard')
)
export const DataTablePage = withLazyLoading(() =>
    import('@/modules/data-table')
)
export const LinkedInPage = withLazyLoading(() =>
    import('@/modules/linkedin/pages/social-accounts-page')
)
export const HomePage = withLazyLoading(() =>
    import('@/modules/home')
)
export const AuthenticatedLayout = withLazyLoading(() =>
    import('@/layout/authenticated-layout')
)
export const NotFoundPage = withLazyLoading(() =>
    import('@/components/not-found')
)
export const SocialAccountsPage = withLazyLoading(() =>
    import("@/modules/linkedin/pages/social-accounts-page")
)
export const LinkedInCallbackHandlerPage = withLazyLoading(() => import("@/modules/linkedin/components/linkedIn-callback-handler"))
export const ProtectedRoute = withLazyLoading(() =>
    import("@/modules/auth/components/protected-route")
)