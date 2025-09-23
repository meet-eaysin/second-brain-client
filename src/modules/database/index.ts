// Re-export database-view components and types for database management
export {
  DatabaseView,
  DataTable,
  EDatabaseType,
  FilterManager,
  SortManager,
  SearchBar,
  TableToolbar,
  TableHeader,
  EditableCell,
} from "../database-view";

// Re-export database API services
export { databaseApi } from "../database-view/services/database-api";
export {
  useDatabases,
  useCreateDatabase,
  useUpdateDatabase,
  useDeleteDatabase,
} from "../database-view/services/database-queries";

// Database management components
export { CreateDatabaseForm } from "./components/create-database-form";
export { CreateDatabaseDialog } from "./components/create-database-dialog";

// Database pages
export { DatabasesPage } from "./pages/databases-page";
export { DatabaseViewPage } from "./pages/database-view-page";
export { DatabaseFormPage } from "./pages/database-form-page";

// Hooks and utilities
export { useDatabaseSidebar } from "./hooks/useDatabaseSidebar";

// Types
export type {
  TDatabase,
  TDatabaseQueryParams,
  TCreateDatabase,
  TUpdateDatabase,
  TDatabaseStats,
} from "../database-view/types";
