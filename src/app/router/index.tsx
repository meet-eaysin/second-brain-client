import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ErrorBoundary } from '../providers/ErrorBoundary'
import { authRoutes } from '@/modules/auth'
import { AuthenticatedLayout } from '@/layout/AuthenticatedLayout.tsx'
import Dashboard from "@/modules/dashboard";
import {ProtectedRoute} from "@/modules/auth/components/protected-route.tsx";
import {getAuthParentLink, getHomeLink} from "@/app/router/router-link.ts";
import DataTablePage from "@/modules/data-table";
import {HomePage} from "@/modules/home";

const router = createBrowserRouter([
    {
        path: getHomeLink(),
        element: (
            <ErrorBoundary>
                <HomePage />
            </ErrorBoundary>
        ),
    },
    // Auth routes (public)
    {
        path: getAuthParentLink(),
        children: [
            ...authRoutes
        ]
    },
    {
        path: "/app",
        element: (
            <ErrorBoundary>
                <ProtectedRoute>
                    <AuthenticatedLayout />
                </ProtectedRoute>
            </ErrorBoundary>
        ),
        children: [
            {
                index: true,
                element: <div className="text-center text-gray-600">Welcome to Dashboard</div>,
            },
            {
                path: "dashboard",
                element: <Dashboard/>,
            },
            {
                path: "data-tables",
                element: <DataTablePage/>,
            },
        ],
    },
    {
        path: '*',
        element: (
            <ErrorBoundary>
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900">404 - Page Not Found</h1>
                        <p className="text-gray-600 mt-2">The page you're looking for doesn't exist.</p>
                    </div>
                </div>
            </ErrorBoundary>
        ),
    },
])

export const AppRouter = () => {
    return <RouterProvider router={router} />
}