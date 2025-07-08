// Auth routes (public)
export const getAuthParentLink = () => "/auth";
export const getSignInLink = () => "/auth/sign-in";
export const getSignUpLink = () => "/auth/sign-up";
export const getSignOutLink = () => "/auth/sign-out";
export const getSignOutAllLink = () => "/auth/sign-out-all";
export const getForgotPasswordLink = () => "/auth/forgot-password";
export const getOtpLink = () => "/auth/otp";
export const getResetPasswordLink = () => "/auth/reset-password";
export const getVerifyEmailLink = () => "/auth/verify-email";
export const getChangePasswordLink = () => "/auth/change-password";

// Public routes
export const getHomeLink = () => "/"; // Landing page

// Protected routes (authenticated)
export const getAppLink = () => "/app"; // Main app entry
export const getDashboardLink = () => "/app/dashboard";
export const getDataTablesLink = () => "/app/data-tables";