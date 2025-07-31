// Database module exports - no router here to avoid circular dependencies

// Pages
export { DatabasesPage } from './pages/databases-page';

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
