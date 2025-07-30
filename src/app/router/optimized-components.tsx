import { createLazyComponent, routeConfigs, preloadRoute } from './optimized-lazy-loading';

// Critical components - preload immediately
export const HomePage = createLazyComponent(
    () => import('@/modules/home'),
    routeConfigs.auth
);

// Auth components - quick loading, preloaded
export const SignInPage = createLazyComponent(
    () => import('@/modules/auth/pages/sign-in-page'),
    routeConfigs.auth
);

export const SignUpPage = createLazyComponent(
    () => import('@/modules/auth/pages/sign-up-page'),
    routeConfigs.auth
);

export const ForgotPasswordPage = createLazyComponent(
    () => import('@/modules/auth/pages/forgot-password-page'),
    routeConfigs.auth
);

export const OtpPage = createLazyComponent(
    () => import('@/modules/auth/pages/otp-page'),
    routeConfigs.auth
);

export const GoogleCallbackPage = createLazyComponent(
    () => import('@/modules/auth/pages/google-callback-page'),
    routeConfigs.auth
);

// Layout components - no fallback, preloaded
export const AuthenticatedLayout = createLazyComponent(
    () => import('@/layout/authenticated-layout'),
    routeConfigs.layout
);

export const ProtectedRoute = createLazyComponent(
    () => import('@/modules/auth/components/protected-route'),
    routeConfigs.layout
);

// App pages - quick loading
export const DashboardPage = createLazyComponent(
    () => import('@/modules/dashboard'),
    routeConfigs.app
);

export const DataTablePage = createLazyComponent(
    () => import('@/modules/data-table'),
    routeConfigs.app
);

export const UsersPage = createLazyComponent(
    () => import('@/modules/users').then(module => ({ default: module.UsersPage })),
    routeConfigs.app
);

// Heavy modules - full loading
export const DatabaseModule = createLazyComponent(
    () => import('@/modules/databases'),
    routeConfigs.modules
);

// Error pages - quick loading
export const NotFoundPage = createLazyComponent(
    () => import('@/components/not-found'),
    routeConfigs.app
);

export const AuthNotFoundPage = createLazyComponent(
    () => import('@/modules/auth/pages/auth-not-found-page'),
    routeConfigs.app
);

// Preload critical routes on app start
if (typeof window !== 'undefined') {
    // Preload auth routes (most likely to be visited)
    preloadRoute(() => import('@/modules/auth/pages/sign-in-page'));
    preloadRoute(() => import('@/layout/authenticated-layout'));
    preloadRoute(() => import('@/modules/dashboard'));
}
