import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorBoundary } from "../providers/error-boundary.tsx";
import { authRoutes } from "@/modules/auth";
import { lazy } from "react";
import {
  getAuthParentLink,
  getHomeLink,
  getAppLink,
  getDataTablesLink,
  getUsersLink,
  getNotificationsLink,
} from "@/app/router/router-link.ts";
import {
  AuthenticatedLayout,
  CalendarPage,
  LandingPage,
  DataTablePage,
  UsersPage,
  TagsPage,
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
import AIAssistantPage from "@/modules/ai-assistant/pages/ai-assistant-page";
import { KnowledgeGraphPage } from "@/modules/knowledge-graph/pages/knowledge-graph-page";
import NotesPage from "@/modules/notes/pages/notes-page";
import SearchPage from "@/modules/search/pages/search-page";
import { SecondBrainRoutes } from "@/modules/second-brain/routes/second-brain-routes";
import { DatabaseRoutes } from "@/modules/database/routes/database-routes";

const UnauthorizedPage = lazy(
  () => import("@/modules/auth/pages/unauthorized-page")
);

const router = createBrowserRouter([
  {
    path: getHomeLink(),
    element: (
      <ErrorBoundary>
        <LandingPage />
      </ErrorBoundary>
    ),
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
        path: "ai-assistant",
        element: <AIAssistantPage />,
      },
      {
        path: "knowledge-graph",
        element: <KnowledgeGraphPage />,
      },
      {
        path: "notes",
        element: <NotesPage />,
      },
      {
        path: "ideas",
        element: <NotesPage />,
      },
      {
        path: "capture",
        element: <NotesPage />,
      },
      {
        path: "collections",
        element: <NotesPage />,
      },
      {
        path: "favorites",
        element: <NotesPage />,
      },
      {
        path: "recent",
        element: <NotesPage />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "templates",
        element: <NotesPage />,
      },
      {
        path: "calendar",
        element: <CalendarPage />,
      },
      {
        path: "tags",
        element: <TagsPage />,
      },
      {
        path: "archive",
        element: <NotesPage />,
      },
      {
        path: getDataTablesLink().replace("/app/", ""),
        element: <DataTablePage />,
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
