import React from 'react';
import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

const DatabaseListPage = lazy(() => import('../pages/database-list-page'));
const DataTablePage = lazy(() => import('../components/data-table-page'));

export const databaseRoutes: RouteObject[] = [
    {
        path: '/app/databases',
        element: <DatabaseListPage />,
    },
    {
        path: '/app/data-tables',
        element: <DatabaseListPage />,
    },
    {
        path: '/app/data-tables/:databaseId',
        element: <DataTablePage />,
    },
];
