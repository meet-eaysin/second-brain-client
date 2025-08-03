// Main component
export { UniversalDataTable } from './universal-data-table';
export type { UniversalDataTableProps } from './universal-data-table';

// Enhanced component (database-like features)
export { EnhancedUniversalDataTable } from './enhanced-universal-data-table';
export type { EnhancedUniversalDataTableProps } from './enhanced-universal-data-table';

// Complete database management system
export * from './database-management';

// Standalone components
export { StandaloneDataTable } from './standalone-data-table';
export { generateStandaloneColumns } from './standalone-columns';

// Data transformers
export {
    transformDataToRecords,
    transformColumnsToProperties,
    transformRecordToData,
    transformRecordsToData,
    transformSecondBrainData,
    transformApiResponseToRecords,
    createPropertiesFromSample,
} from './data-transformers';

// Table configurations
export {
    getTableConfiguration,
    type TableConfiguration,
} from './table-configurations';

// Action system
export {
    ActionRenderer,
    ToolbarActionRenderer,
    type ActionConfig,
    type ToolbarActionConfig,
} from './action-system';

// Re-export types from database module for convenience
export type {
    DatabaseRecord,
    DatabaseProperty,
    CustomAction,
    ToolbarAction,
} from '@/types/database.types';
