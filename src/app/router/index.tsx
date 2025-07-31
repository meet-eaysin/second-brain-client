import { createBrowserRouter, RouterProvider } from 'react-router-dom'
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
} from "@/app/router/router-link.ts";
import {
    AuthenticatedLayout,
    DashboardPage,
    DataTablePage,
    DatabasesPage,
    UsersPage,
    HomePage,
    NotFoundPage,
    ProtectedRoute
} from "@/app/router/lazy-components";

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
                element: <div className="text-center text-gray-600">Welcome to Dashboard</div>,
            },
            {
                path: getDashboardLink().replace('/app/', ''),
                element: <DashboardPage/>,
            },
            {
                path: getDataTablesLink().replace('/app/', ''),
                element: <DataTablePage/>,
            },
            {
                path: getDatabasesLink().replace('/app/', '') + '/*',
                element: <DatabasesPage/>,
            },
            {
                path: getUsersLink().replace('/app/', ''),
                element: <UsersPage/>,
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