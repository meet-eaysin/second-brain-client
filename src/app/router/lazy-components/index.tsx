import {withLazyLoading} from "@/app/router/lazy-components/with-lazy-loading.tsx";

// Preload critical auth pages for faster navigation
const signInPageImport = () => import('@/modules/auth/pages/sign-in-page');
const signUpPageImport = () => import('@/modules/auth/pages/sign-up-page');
const dashboardPageImport = () => import('@/modules/dashboard');

// For components with default exports, import directly
export const SignInPage = withLazyLoading(signInPageImport)
export const SignUpPage = withLazyLoading(signUpPageImport)
export const ForgotPasswordPage = withLazyLoading(() =>
    import('@/modules/auth/pages/forgot-password-page')
)
export const OtpPage = withLazyLoading(() =>
    import('@/modules/auth/pages/otp-page')
)
export const GoogleCallbackPage = withLazyLoading(() =>
    import('@/modules/auth/pages/google-callback-page')
)
export const GooglePopupCallbackPage = withLazyLoading(() =>
    import('@/modules/auth/pages/google-popup-callback-page')
)
export const AuthNotFoundPage = withLazyLoading(() =>
    import('@/modules/auth/pages/auth-not-found-page')
)
export const AuthErrorPage = withLazyLoading(() =>
    import('@/modules/auth/pages/auth-error-page')
)
export const DashboardPage = withLazyLoading(dashboardPageImport)
export const DataTablePage = withLazyLoading(() =>
    import('@/modules/data-table')
)
export const DatabasesPage = withLazyLoading(() =>
    import('@/modules/databases/pages/databases-page')
)
export const DatabaseDetailPage = withLazyLoading(() =>
    import('@/modules/databases/pages/database-detail-page')
)
export const DatabaseTemplatesPage = withLazyLoading(() =>
    import('@/modules/databases/pages/database-templates-page')
)
export const DatabaseImportPage = withLazyLoading(() =>
    import('@/modules/databases/pages/database-import-page')
)
export const DatabaseCategoriesPage = withLazyLoading(() =>
    import('@/modules/databases/pages/database-categories-page')
)
export const UsersPage = withLazyLoading(() =>
    import('@/modules/users/pages/users-page')
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
export const PublicRoute = withLazyLoading(() =>
    import("@/modules/auth/components/public-route")
)