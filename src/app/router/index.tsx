import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { ErrorBoundary } from '../providers/error-boundary.tsx'
import { authRoutes } from '@/modules/auth'
import { lazy } from 'react'
import {
    getAuthParentLink,
    getHomeLink,
    getAppLink,
    getDashboardLink,
    getDataTablesLink,
    getDatabasesLink,
    getUsersLink,
    getDatabaseTemplatesLink,
    getDatabaseImportLink,
    getDatabaseCategoriesLink,
    getTagsLink,
    getFilesLink,
    getNotificationsLink,
    getSettingsLink,
} from "@/app/router/router-link.ts";
import {
    AuthenticatedLayout,
    DashboardPage,
    DataTablePage,
    DatabasesPage,
    DatabaseDetailPage,
    DatabaseTemplatesPage,
    DatabaseImportPage,
    DatabaseCategoriesPage,
    UsersPage,
    TagsPage,
    FilesPage,
    NotificationsPage,
    SettingsPage,
    ProfileSettingsPage,
    SecuritySettingsPage,
    BillingSettingsPage,
    AppearanceSettingsPage,
    NotificationSettingsPage,
    WorkspaceSettingsPage,
    HomePage,
    NotFoundPage,
    ProtectedRoute,
    PublicRoute
} from "@/app/router/lazy-components";
import AIAssistantPage from '@/modules/ai-assistant/pages/ai-assistant-page';
import KnowledgeGraphPage from '@/modules/second-brain/pages/knowledge-graph-page';
import NotesPage from '@/modules/second-brain/pages/notes-page';
import SearchPage from '@/modules/second-brain/pages/search-page';
import { DatabaseProvider } from '@/modules/databases';
import { SecondBrainRoutes } from '@/modules/second-brain/routes/second-brain-routes';

const UnauthorizedPage = lazy(() => import('@/modules/auth/pages/unauthorized-page'));

const router = createBrowserRouter([
    {
        path: getHomeLink(),
        element: (
          <ErrorBoundary>
              <HomePage />
          </ErrorBoundary>
        ),
    },
    {
        path: getAuthParentLink(),
        element: <PublicRoute />,
        children: authRoutes
    },
    {
        path: '/unauthorized',
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
                element: <Navigate to={getDashboardLink()} replace />,
            },
            {
                path: getDashboardLink().replace('/app/', ''),
                element: <DashboardPage/>,
            },
            {
                path: 'second-brain/*',
                element: <SecondBrainRoutes />,
            },
            {
                path: 'ai-assistant',
                element: <AIAssistantPage/>,
            },
            {
                path: 'knowledge-graph',
                element: <KnowledgeGraphPage />,
            },
            {
                path: 'notes',
                element: <NotesPage />,
            },
            {
                path: 'ideas',
                element: <NotesPage />,
            },
            {
                path: 'capture',
                element: <NotesPage />,
            },
            {
                path: 'collections',
                element: <NotesPage />,
            },
            {
                path: 'favorites',
                element: <NotesPage />,
            },
            {
                path: 'recent',
                element: <NotesPage />,
            },
            {
                path: 'search',
                element: <SearchPage />,
            },
            {
                path: 'templates',
                element: <NotesPage />,
            },
            {
                path: 'calendar',
                element: <NotesPage />,
            },
            {
                path: 'tags',
                element: <TagsPage />,
            },
            {
                path: 'archive',
                element: <NotesPage />,
            },
            {
                path: getDataTablesLink().replace('/app/', ''),
                element: <DataTablePage/>,
            },
            {
                path: getDatabasesLink().replace('/app/', ''),
                element: <DatabasesPage/>,
            },
            {
                path: 'databases/:id',
                element: (
                    <ErrorBoundary>
                        <DatabaseProvider>
                            <DatabaseDetailPage/>
                        </DatabaseProvider>
                    </ErrorBoundary>
                ),
            },
            {
                path: getDatabaseTemplatesLink().replace('/app/', ''),
                element: <DatabaseTemplatesPage/>,
            },
            {
                path: getDatabaseImportLink().replace('/app/', ''),
                element: <DatabaseImportPage/>,
            },
            {
                path: getDatabaseCategoriesLink().replace('/app/', ''),
                element: <DatabaseCategoriesPage/>,
            },
            {
                path: getUsersLink().replace('/app/', ''),
                element: <UsersPage/>,
            },
            {
                path: getFilesLink().replace('/app/', ''),
                element: <FilesPage/>,
            },
            {
                path: getNotificationsLink().replace('/app/', ''),
                element: <NotificationsPage/>,
            },
            {
                path: 'settings',
                children: [
                    {
                        index: true,
                        element: <SettingsPage/>,
                    },
                    {
                        path: 'profile',
                        element: <ProfileSettingsPage/>,
                    },
                    {
                        path: 'security',
                        element: <SecuritySettingsPage/>,
                    },
                    {
                        path: 'billing',
                        element: <BillingSettingsPage/>,
                    },
                    {
                        path: 'appearance',
                        element: <AppearanceSettingsPage/>,
                    },
                    {
                        path: 'notifications',
                        element: <NotificationSettingsPage/>,
                    },
                    {
                        path: 'workspace',
                        element: <WorkspaceSettingsPage/>,
                    },
                ],
            },
        ],
    },
    {
        path: '*',
        element: (
          <ErrorBoundary>
              <NotFoundPage/>
          </ErrorBoundary>
        ),
    },
])

export const AppRouter = () => {
    return <RouterProvider router={router} />
}