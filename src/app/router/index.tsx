import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorBoundary } from "../providers/error-boundary.tsx";
import { authRoutes } from "@/modules/auth";
import { lazy } from "react";
import {
  getAuthParentLink,
  getAppLink,
  getUsersLink,
  getNotificationsLink,
} from "@/app/router/router-link.ts";
import {
  AuthenticatedLayout,
  CalendarPage,
  UsersPage,
  NotificationsPage,
  SettingsPage,
  ProfileSettingsPage,
  AccountSettingsPage,
  SecuritySettingsPage,
  BillingSettingsPage,
  AppearanceSettingsPage,
  DisplaySettingsPage,
  NotificationSettingsPage,
  WorkspaceSettingsPage,
  HomePage,
  NotFoundPage,
  PublicRoute,
  ProtectedRoute,
} from "@/app/router/lazy-components";
import { NotesPage } from "@/modules/notes/pages/notes-page";
import { SecondBrainRoutes } from "@/modules/second-brain/routes/second-brain-routes";
import { DatabaseRoutes } from "@/modules/database/routes/database-routes";
import HelpCenterPage from "@/modules/help-center";
import AdminDashboardPage from "@/modules/admin/pages/admin-dashboard-page";
import AdminUsersPage from "@/modules/admin/pages/admin-users-page";
import SetupPage from "@/modules/admin/pages/setup-page";

const UnauthorizedPage = lazy(
  () => import("@/modules/auth/pages/unauthorized-page")
);

const router = createBrowserRouter([
  {
    path: "/setup",
    element: <SetupPage />,
  },
  {
    path: getAuthParentLink(),
    element: <PublicRoute />,
    children: authRoutes,
  },
  {
    path: "/unauthorized",
    element: (
      <ErrorBoundary>
        <UnauthorizedPage />
      </ErrorBoundary>
    ),
  },

  {
    path: getAppLink(),
    element: (
      <ProtectedRoute>
        <AuthenticatedLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "second-brain/*",
        element: <SecondBrainRoutes />,
      },
      {
        path: "databases/*",
        element: <DatabaseRoutes />,
      },
      {
        path: "notes",
        element: <NotesPage />,
      },
      {
        path: "calendar",
        element: <CalendarPage />,
      },
      {
        path: "archive",
        element: <NotesPage />,
      },
      {
        path: getUsersLink().replace("/app/", ""),
        element: <UsersPage />,
      },
      {
        path: getNotificationsLink().replace("/app/", ""),
        element: <NotificationsPage />,
      },
      {
        path: "/app/help-center",
        element: (
          <ErrorBoundary>
            <HelpCenterPage />
          </ErrorBoundary>
        ),
      },
      {
        path: "settings",
        children: [
          {
            index: true,
            element: <SettingsPage />,
          },
          {
            path: "profile",
            element: <ProfileSettingsPage />,
          },
          {
            path: "account",
            element: <AccountSettingsPage />,
          },
          {
            path: "security",
            element: <SecuritySettingsPage />,
          },
          {
            path: "billing",
            element: <BillingSettingsPage />,
          },
          {
            path: "appearance",
            element: <AppearanceSettingsPage />,
          },
          {
            path: "display",
            element: <DisplaySettingsPage />,
          },
          {
            path: "notifications",
            element: <NotificationSettingsPage />,
          },
          {
            path: "workspace",
            element: <WorkspaceSettingsPage />,
          },
        ],
      },
      {
        path: "admin",
        element: <ProtectedRoute requiredRole="super_admin" />,
        children: [
          {
            index: true,
            element: <AdminDashboardPage />,
          },
          {
            path: "users",
            element: <AdminUsersPage />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: (
      <ErrorBoundary>
        <NotFoundPage />
      </ErrorBoundary>
    ),
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
