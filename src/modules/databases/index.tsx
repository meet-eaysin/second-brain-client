// Database module exports - no router here to avoid circular dependencies

// Pages
export { DatabasesPage } from './pages/databases-page';

// Components
export { DatabaseCard } from './components/database-card';
export { DocumentDataTable as DatabaseDataTable } from '@/modules/document-view';
export { DatabaseDialogs } from './components/database-dialogs';
export { DatabasePrimaryButtons } from './components/database-primary-buttons';
export { DatabaseQuickActions } from './components/database-quick-actions';
export { DatabaseForm } from './components/database-form';
export { DatabaseTemplates } from './components/database-templates';
export { PropertyForm } from './components/property-form';
// RecordForm moved to document-view module
export { ViewForm } from './components/view-form';
export { PropertyList } from './components/property-list';

// New document-view integration components
export { DatabaseViewManager } from './components/database-view-manager';
export { DatabasePropertyManager } from './components/database-property-manager';

// Hooks
export { useDatabaseById, useDatabases } from './hooks/database-hooks';
export { useCreateProperty, useUpdateProperty, useDeleteProperty, useReorderProperties } from './hooks/property-hooks';
export { useRecords, useCreateRecord, useUpdateRecord, useDeleteRecord } from './hooks/record-hooks';

// Services
export { useCreateDatabase, useUpdateDatabase, useDeleteDatabase } from './services/databaseQueries';
export { databasesDocumentViewService } from './services/databases-document-view.service';

// Routes
export { databaseRoutes } from './router/routes';
// Services
export { databaseApi } from './services/databaseApi';
export * from './services/databaseQueries';

// Context
export { default as DatabaseProvider, useDatabaseContext } from './context/database-context';

// Document-View Providers
export { DatabasesProvider, createDatabaseSchema } from '../document-view/providers/databases-provider';

// Types are exported from the main types directory
export type * from '@/types/document.types.ts';
