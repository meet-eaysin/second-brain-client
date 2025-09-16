import { DynamicDatabaseDetail } from '../pages/database-detail-page';
import type { DatabaseDetailConfig, DatabaseDetailProps } from '../pages/database-detail-page';

// Re-export for easier importing
export { DynamicDatabaseDetail };
export type { DatabaseDetailConfig, DatabaseDetailProps };

// Preset configurations for common use cases
export const DATABASE_VIEW_PRESETS = {
  // Full-featured database view (default)
  FULL: {
    enableViews: true,
    enableSearch: true,
    enableFilters: true,
    enableSorts: true,
    enableGrouping: true,
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canShare: true,
    canFreeze: true,
    canUnfreeze: true,
    canManageViews: true,
    canManageProperties: true,
    showHeader: true,
    showBackButton: true,
    showSearch: true,
    showThemeSwitch: true,
    showProfileDropdown: true,
  } as DatabaseDetailConfig,

  // Read-only view
  READ_ONLY: {
    enableViews: true,
    enableSearch: true,
    enableFilters: true,
    enableSorts: true,
    enableGrouping: false,
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canShare: false,
    canFreeze: false,
    canUnfreeze: false,
    canManageViews: false,
    canManageProperties: false,
    showHeader: true,
    showBackButton: true,
    showSearch: true,
    showThemeSwitch: true,
    showProfileDropdown: true,
  } as DatabaseDetailConfig,

  // Embedded view (no header, minimal controls)
  EMBEDDED: {
    enableViews: true,
    enableSearch: false,
    enableFilters: true,
    enableSorts: true,
    enableGrouping: true,
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canShare: false,
    canFreeze: false,
    canUnfreeze: false,
    canManageViews: false,
    canManageProperties: false,
    showHeader: false,
    showBackButton: false,
    showSearch: false,
    showThemeSwitch: false,
    showProfileDropdown: false,
  } as DatabaseDetailConfig,

  // Simple table view
  TABLE_ONLY: {
    enableViews: false,
    enableSearch: true,
    enableFilters: true,
    enableSorts: true,
    enableGrouping: false,
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canShare: false,
    canFreeze: false,
    canUnfreeze: false,
    canManageViews: false,
    canManageProperties: false,
    showHeader: false,
    showBackButton: false,
    showSearch: false,
    showThemeSwitch: false,
    showProfileDropdown: false,
  } as DatabaseDetailConfig,

  // Frozen/locked view
  FROZEN: {
    enableViews: true,
    enableSearch: true,
    enableFilters: true,
    enableSorts: true,
    enableGrouping: false,
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canShare: true,
    canFreeze: false,
    canUnfreeze: true,
    canManageViews: false,
    canManageProperties: false,
    isFrozen: true,
    showHeader: true,
    showBackButton: true,
    showSearch: true,
    showThemeSwitch: true,
    showProfileDropdown: true,
  } as DatabaseDetailConfig,

  // Dashboard widget
  WIDGET: {
    enableViews: false,
    enableSearch: false,
    enableFilters: false,
    enableSorts: false,
    enableGrouping: false,
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canShare: false,
    canFreeze: false,
    canUnfreeze: false,
    canManageViews: false,
    canManageProperties: false,
    showHeader: false,
    showBackButton: false,
    showSearch: false,
    showThemeSwitch: false,
    showProfileDropdown: false,
  } as DatabaseDetailConfig,
};

// Helper function to merge configs
export function mergeConfig(
  baseConfig: DatabaseDetailConfig, 
  overrides: Partial<DatabaseDetailConfig>
): DatabaseDetailConfig {
  return { ...baseConfig, ...overrides };
}

// Convenience components for common use cases
export function ReadOnlyDatabaseView(props: Omit<DatabaseDetailProps, 'config'> & { config?: Partial<DatabaseDetailConfig> }) {
  return (
    <DynamicDatabaseDetail
      {...props}
      config={mergeConfig(DATABASE_VIEW_PRESETS.READ_ONLY, props.config || {})}
    />
  );
}

export function EmbeddedDatabaseView(props: Omit<DatabaseDetailProps, 'config'> & { config?: Partial<DatabaseDetailConfig> }) {
  return (
    <DynamicDatabaseDetail
      {...props}
      config={mergeConfig(DATABASE_VIEW_PRESETS.EMBEDDED, props.config || {})}
    />
  );
}

export function TableOnlyView(props: Omit<DatabaseDetailProps, 'config'> & { config?: Partial<DatabaseDetailConfig> }) {
  return (
    <DynamicDatabaseDetail
      {...props}
      config={mergeConfig(DATABASE_VIEW_PRESETS.TABLE_ONLY, props.config || {})}
    />
  );
}

export function DatabaseWidget(props: Omit<DatabaseDetailProps, 'config'> & { config?: Partial<DatabaseDetailConfig> }) {
  return (
    <DynamicDatabaseDetail
      {...props}
      config={mergeConfig(DATABASE_VIEW_PRESETS.WIDGET, props.config || {})}
    />
  );
}
