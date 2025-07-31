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
export const GoogleCallbackPage = withLazyLoading(() =>
    import('@/modules/auth/pages/google-callback-page')
)
export const AuthNotFoundPage = withLazyLoading(() =>
    import('@/modules/auth/pages/auth-not-found-page')
)
export const AuthErrorPage = withLazyLoading(() =>
    import('@/modules/auth/pages/auth-error-page')
)
export const DashboardPage = withLazyLoading(() =>
    import('@/modules/dashboard')
)
export const DataTablePage = withLazyLoading(() =>
    import('@/modules/data-table')
)
export const DatabaseModule = withLazyLoading(() =>
    import('@/modules/databases')
)
export const UsersPage = withLazyLoading(() =>
    import('@/modules/users').then(module => ({ default: module.UsersPage }))
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
export const ProtectedRoute = withLazyLoading(() =>
    import("@/modules/auth/components/protected-route")
)