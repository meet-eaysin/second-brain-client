// Database module exports - no router here to avoid circular dependencies

// Pages
export { DatabasesPage } from './pages/databases-page';

// Components
export { DatabaseCard } from './components/database-card';
export { DatabaseDataTable } from './components/database-data-table';
export { DatabaseDialogs } from './components/database-dialogs';
export { DatabasePrimaryButtons } from './components/database-primary-buttons';
export { DatabaseQuickActions } from './components/database-quick-actions';
export { DatabaseForm } from './components/database-form';
export { DatabaseTemplates } from './components/database-templates';
export { PropertyForm } from './components/property-form';
export { RecordForm } from './components/record-form';
export { ViewForm } from './components/view-form';
export { PropertyList } from './components/property-list';

// Hooks
export { useDatabaseById, useDatabases } from './hooks/database-hooks';
export { useCreateProperty, useUpdateProperty, useDeleteProperty, useReorderProperties } from './hooks/property-hooks';
export { useRecords, useCreateRecord, useUpdateRecord, useDeleteRecord } from './hooks/record-hooks';

// Services
export { useCreateDatabase, useUpdateDatabase, useDeleteDatabase } from './services/databaseQueries';

// Routes
export { databaseRoutes } from './router/routes';
// Services
export { databaseApi } from './services/databaseApi';
export * from './services/databaseQueries';

// Context
export { default as DatabaseProvider, useDatabaseContext } from './context/database-context';

// Types are exported from the main types directory
export type * from '@/types/database.types';
