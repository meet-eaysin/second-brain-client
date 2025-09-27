import { withLazyLoading } from "@/app/router/lazy-components/with-lazy-loading.tsx";

// Preload critical auth pages for faster navigation
const signInPageImport = () => import("@/modules/auth/pages/sign-in-page");
const signUpPageImport = () => import("@/modules/auth/pages/sign-up-page");
const homePageImport = () => import("@/modules/home");

// For components with default exports, import directly
export const SignInPage = withLazyLoading(signInPageImport);
export const SignUpPage = withLazyLoading(signUpPageImport);
export const ForgotPasswordPage = withLazyLoading(
  () => import("@/modules/auth/pages/forgot-password-page")
);
export const OtpPage = withLazyLoading(
  () => import("@/modules/auth/pages/otp-page")
);
export const GoogleCallbackPage = withLazyLoading(
  () => import("@/modules/auth/pages/google-callback-page")
);
export const GooglePopupCallbackPage = withLazyLoading(
  () => import("@/modules/auth/pages/google-popup-callback-page")
);
export const AuthNotFoundPage = withLazyLoading(
  () => import("@/modules/auth/pages/auth-not-found-page")
);
export const AuthErrorPage = withLazyLoading(
  () => import("@/modules/auth/pages/auth-error-page")
);
export const HomePage = withLazyLoading(homePageImport);
export const UsersPage = withLazyLoading(
  () => import("@/modules/users/pages/users-page")
);
export const CalendarPage = withLazyLoading(() =>
  import("@/modules/calendar/pages/calendar-page").then((module) => ({
    default: module.default,
  }))
);
export const NotificationsPage = withLazyLoading(
  () => import("@/modules/notifications/pages/notifications-page")
);
export const SettingsPage = withLazyLoading(
  () => import("@/modules/settings/pages/settings-page.tsx")
);
export const ProfileSettingsPage = withLazyLoading(
  () => import("@/modules/settings/pages/profile-settings-page.tsx")
);
export const AccountSettingsPage = withLazyLoading(
  () => import("@/modules/settings/pages/account-page")
);
export const SecuritySettingsPage = withLazyLoading(
  () => import("@/modules/settings/pages/security-settings-page.tsx")
);
export const BillingSettingsPage = withLazyLoading(
  () => import("@/modules/settings/pages/billing-page")
);
export const AppearanceSettingsPage = withLazyLoading(
  () => import("@/modules/settings/pages/appearance-page")
);
export const DisplaySettingsPage = withLazyLoading(
  () => import("@/modules/settings/pages/display-settingsPage.tsx")
);
export const NotificationSettingsPage = withLazyLoading(
  () => import("@/modules/settings/pages/notification-settings-page.tsx")
);
export const WorkspaceSettingsPage = withLazyLoading(
  () => import("@/modules/settings/pages/workspace-settings-page.tsx")
);
export const AuthenticatedLayout = withLazyLoading(
  () => import("@/layout/authenticated-layout")
);
export const NotFoundPage = withLazyLoading(
  () => import("@/components/not-found")
);
export const ProtectedRoute = withLazyLoading(
  () => import("@/modules/auth/components/protected-route")
);
export const PublicRoute = withLazyLoading(
  () => import("@/modules/auth/components/public-route")
);
