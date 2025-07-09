import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ErrorBoundary } from '../providers/error-boundary.tsx'
import { authRoutes } from '@/modules/auth'
import { linkedinRoutes } from '@/modules/linkedin'
import {
    getAuthParentLink,
    getHomeLink,
    getAppLink,
    getDashboardLink,
    getDataTablesLink,
} from "@/app/router/router-link.ts";
import {
    AuthenticatedLayout,
    DashboardPage,
    DataTablePage,
    HomePage,
    NotFoundPage,
    ProtectedRoute
} from "@/app/router/lazy-components";

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
        path: getAppLink(),
        element: (
            <ProtectedRoute>
                <AuthenticatedLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                path: "social-connect",
                children: linkedinRoutes
            },
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