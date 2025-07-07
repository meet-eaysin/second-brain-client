import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ErrorBoundary } from '../providers/ErrorBoundary'
import { authRoutes } from '@/modules/auth'
import { AuthenticatedLayout } from '@/layout/AuthenticatedLayout.tsx'
import Dashboard from "@/modules/dashboard";
// import { AuthGuard } from '@/modules/auth/components/AuthGuard'

const router = createBrowserRouter([
    {
        path: '/auth',
        children: [
            ...authRoutes
        ]
    },
    {
        path: '/',
        element: (
            <ErrorBoundary>
                {/*<AuthGuard>*/}
                    <AuthenticatedLayout />
                {/*</AuthGuard>*/}
            </ErrorBoundary>
        ),
        children: [
            {
                path: '',
                element: <div className="text-center text-gray-600">Welcome to Dashboard</div>,
            },
            {
                path: 'dashboard',
                element: <Dashboard/>,
            },
            {
                path: 'users',
                element: <div className="text-xl font-semibold text-gray-900">Users Management</div>,
            },
            {
                path: 'settings',
                element: <div className="text-xl font-semibold text-gray-900">Settings</div>,
            },
            {
                path: 'reports',
                element: <div className="text-xl font-semibent text-gray-900">Reports</div>,
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
