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

// LinkedIn routes (nested under /app)
export const getSocialConnectParentLink = () => "/app/social-connect";
export const getLinkedinLink = () => "/app/social-connect/linkedin";
export const getLinkedinCallbackLink = () => "/app/social-connect/linkedin/callback";

// Public routes
export const getHomeLink = () => "/";

// Protected routes (authenticated)
export const getAppLink = () => "/app";
export const getDashboardLink = () => "/app/dashboard";
export const getDataTablesLink = () => "/app/data-tables";

// User Management routes
export const getUsersLink = () => "/app/users";
export const getUserLink = (id: string) => `/app/users/${id}`;

// Content Management routes
export const getTagsLink = () => "/app/tags";
export const getFilesLink = () => "/app/files";
export const getNotificationsLink = () => "/app/notifications";
export const getSettingsLink = () => "/app/settings";

// Database routes
export const getDatabasesLink = () => "/app/databases";
export const getDatabaseLink = (id: string) => `/app/databases/${id}`;
export const getCreateDatabaseLink = () => "/app/databases/new";
export const getDatabaseTemplatesLink = () => "/app/databases/templates";
export const getDatabaseImportLink = () => "/app/databases/import";
export const getDatabaseCategoriesLink = () => "/app/databases/categories";

// Admin routes
export const getAdminLink = () => "/app/admin";
export const getAdminUsersLink = () => "/app/admin/users";
export const getAdminStatsLink = () => "/app/admin/stats";

// Social routes
export const getSocialLink = () => "/social";