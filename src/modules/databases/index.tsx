import { createBrowserRouter, RouterProvider, Routes, Route, Outlet } from 'react-router-dom';
import DatabaseProvider from './context/database-context';
import { DatabasesPage } from './pages/databases-page';
import DatabaseDetailPage from './pages/database-detail-page';

// Database Layout Component that provides context
function DatabaseLayout() {
    return (
        <DatabaseProvider>
            <Outlet />
        </DatabaseProvider>
    );
}

// Create standalone database router using createBrowserRouter
// This is for when the database module is used as a standalone app
export const databaseRouter = createBrowserRouter([
    {
        path: '/',
        element: <DatabaseLayout />,
        children: [
            {
                index: true,
                element: <DatabasesPage />,
            },
            {
                path: ':id',
                element: <DatabaseDetailPage />,
            },
        ],
    },
]);

// Standalone Database App Component using createBrowserRouter
export function StandaloneDatabaseApp() {
    return <RouterProvider router={databaseRouter} />;
}

// Main Database Module Component for integration with main app router
// This uses Routes/Route for nested routing within the main app
export default function DatabaseModule() {
    return (
        <DatabaseProvider>
            <Routes>
                <Route index element={<DatabasesPage />} />
                <Route path=":id" element={<DatabaseDetailPage />} />
            </Routes>
        </DatabaseProvider>
    );
}

// Pages
export { DatabasesPage } from './pages/databases-page';
export { default as DatabaseDetailPage } from './pages/database-detail-page';
export { default as DatabaseDemoPage } from './pages/database-demo-page';

// Components
export { DatabaseCard } from './components/database-card';
export { DatabaseDataTable } from './components/database-data-table';
export { DatabaseDialogs } from './components/database-dialogs';
export { DatabasePrimaryButtons } from './components/database-primary-buttons';
export { DatabaseForm } from './components/database-form';
export { PropertyForm } from './components/property-form';
export { RecordForm } from './components/record-form';
export { ViewForm } from './components/view-form';

// Services
export { databaseApi } from './services/databaseApi';
export * from './services/databaseQueries';

// Context
export { default as DatabaseProvider, useDatabase } from './context/database-context';

// Types are exported from the main types directory
export type * from '@/types/database.types';
