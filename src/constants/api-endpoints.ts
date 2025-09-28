export const API_ENDPOINTS = {
  AUTH: {
    SIGN_IN: "/auth/sign-in",
    SIGN_UP: "/auth/sign-up",
    LOGOUT: "/auth/logout",
    LOGOUT_ALL: "/auth/logout-all",
    ME: "/auth/me",
    REFRESH_TOKEN: "/auth/refresh-token",
    CHANGE_PASSWORD: "/auth/change-password",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    GOOGLE_AUTH: "/auth/google",
    GOOGLE_AUTH_CALLBACK: "/auth/google/callback",
    GOOGLE_GENERATE_URL: "/auth/google/generate-url",
  },
  USERS: {
    LIST: "/users",
    PROFILE: "/users/profile",
    STATS: "/users/stats",
    BULK_UPDATE: "/users/bulk-update",
    BY_ID: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    STATUS: (id: string) => `/users/${id}/status`,
    ROLE: (id: string) => `/users/${id}/role`,
  },
  DASHBOARD: {
    BASE: "/dashboard",
    STATS: "/dashboard/stats",
    ANALYTICS: "/dashboard/analytics",
    ACTIVITY: "/dashboard/activity",
    TASKS: "/dashboard/tasks",
    NOTIFICATIONS: "/dashboard/notifications",
    LAYOUTS: "/dashboard/layouts",
    PREFERENCES: "/dashboard/preferences",
    QUICK_ACTIONS: "/dashboard/quick-actions",
  },
  ANALYTICS: {
    DASHBOARD: "/analytics/dashboard",
    DATABASE: (id: string) => `/analytics/databases/${id}`,
    USAGE: "/analytics/usage",
    EVENTS: "/analytics/events",
    ACTIVITY: "/analytics/activity",
  },
  SEARCH: {
    GLOBAL: "/search/global",
    DATABASES: "/search/databases",
    RECORDS: "/search/records",
    SUGGESTIONS: "/search/suggestions",
    HISTORY: "/search/history",
    SAVED: "/search/saved",
    ADVANCED: "/search/advanced",
  },
  PROFILE: {
    GET: "/profile",
    UPDATE: "/profile",
  },
  CATEGORIES: {
    LIST: "/categories",
    CREATE: "/categories",
    BY_ID: (id: string) => `/categories/${id}`,
    UPDATE: (id: string) => `/categories/${id}`,
    DELETE: (id: string) => `/categories/${id}`,
    REORDER: "/categories/reorder",
  },
  WORKSPACES: {
    BASE: "/workspaces",
    LIST: "/workspaces",
    CREATE: "/workspaces",
    CURRENT: "/workspaces/current",
    BY_ID: (id: string) => `/workspaces/${id}`,
    UPDATE: "/workspaces/current",
    DELETE: "/workspaces/current",
    CURRENT_STATS: "/workspaces/current/stats",
    CURRENT_ACCESS: "/workspaces/current/access",
    DUPLICATE: "/workspaces/current/duplicate",
    LEAVE: "/workspaces/current/leave",
    PERMISSIONS: "/workspaces/current/permissions",
    ACTIVITY: "/workspaces/current/activity",
    STATS: "/workspaces/stats",
    PUBLIC: "/workspaces/public",
    SEARCH: "/workspaces/search",
    MEMBERS: "/workspaces/current/members",
    MEMBER: (id: string, userId: string) =>
      `/workspaces/${id}/members/${userId}`,
    INVITE: "/workspaces/current/members",
    MEMBER_ROLE: (userId: string) =>
      `/workspaces/current/members/${userId}/role`,
    TRANSFER_OWNERSHIP: "/workspaces/current/transfer-ownership",
    BULK_MEMBER_OPERATION: "/workspaces/current/members/bulk",
    // Added missing endpoints from workspace service
    PRIMARY: "/workspaces/primary",
    DEFAULT: "/workspaces/default",
    STATS_BY_ID: (id: string) => `/workspaces/${id}/stats`,
    ACCESS: (id: string) => `/workspaces/${id}/access`,
  },
  SYSTEM: {
    HEALTH: "/health",
    INFO: "/",
    API_STATUS: "/api",
  },
  TAGS: {
    LIST: "/tags",
    CREATE: "/tags",
    BY_ID: (id: string) => `/tags/${id}`,
    UPDATE: (id: string) => `/tags/${id}`,
    DELETE: (id: string) => `/tags/${id}`,
  },
  FILES: {
    LIST: "/files",
    UPLOAD: "/files/upload",
    BULK_UPLOAD: "/files/bulk-upload",
    BY_ID: (id: string) => `/files/${id}`,
    DOWNLOAD: (id: string) => `/files/${id}/download`,
    DELETE: (id: string) => `/files/${id}`,
  },
  NOTIFICATIONS: {
    LIST: "/system/notifications",
    BY_ID: (id: string) => `/system/notifications/${id}`,
    MARK_READ: (id: string) => `/system/notifications/${id}/read`,
    MARK_ALL_READ: "/system/notifications/all/read",
    DELETE: (id: string) => `/system/notifications/${id}`,
    STATS: "/system/notifications/stats",
    UNREAD_COUNT: "/system/notifications/unread-count",
    RECENT: "/system/notifications/recent",
    BULK_READ: "/system/notifications/bulk/read",
    BULK_DELETE: "/system/notifications/bulk",
    MENTION: "/system/notifications/mention",
    DUE_TASK: "/system/notifications/due-task",
    DEVICES_REGISTER: "/system/notifications/devices/register",
    DEVICES_UNREGISTER: "/system/notifications/devices/unregister",
    DEVICES: "/system/notifications/devices",
  },
  DATABASE: {
    GET_ALL: "/databases",
    CREATE: "/databases",
    GET_BY_ID: (id: string) => `/databases/${id}`,
    UPDATE: (id: string) => `/databases/${id}`,
    DELETE: (id: string) => `/databases/${id}`,
    STATS: (id: string) => `/databases/${id}/stats`,
    DUPLICATE: (id: string) => `/databases/${id}/duplicate`,
    EXPORT: (id: string) => `/databases/${id}/export`,
    IMPORT: "/databases/import",
    RESTORE: (id: string) => `/databases/${id}/restore`,
    ARCHIVE: (id: string) => `/databases/${id}/archive`,
    UNARCHIVE: (id: string) => `/databases/${id}/unarchive`,
    BULK_UPDATE: "/databases/bulk-update",
    BULK_DELETE: "/databases/bulk-delete",
    TEMPLATES: (id: string) => `/databases/${id}/templates`,
    CREATE_TEMPLATE: (id: string) => `/databases/${id}/templates`,
    UPDATE_TEMPLATE: (id: string, templateId: string) =>
      `/databases/${id}/templates/${templateId}`,
    DELETE_TEMPLATE: (id: string, templateId: string) =>
      `/databases/${id}/templates/${templateId}`,
    // Database-level filters
    GET_FILTERS: (databaseId: string) => `/databases/${databaseId}/filters`,
    CREATE_FILTER: (databaseId: string) => `/databases/${databaseId}/filters`,
    GET_FILTER_BY_ID: (databaseId: string, filterId: string) =>
      `/databases/${databaseId}/filters/${filterId}`,
    UPDATE_FILTER: (databaseId: string, filterId: string) =>
      `/databases/${databaseId}/filters/${filterId}`,
    DELETE_FILTER: (databaseId: string, filterId: string) =>
      `/databases/${databaseId}/filters/${filterId}`,
    DUPLICATE_FILTER: (databaseId: string, filterId: string) =>
      `/databases/${databaseId}/filters/${filterId}/duplicate`,
    // Database-level sorts
    GET_SORTS: (databaseId: string) => `/databases/${databaseId}/sorts`,
    CREATE_SORT: (databaseId: string) => `/databases/${databaseId}/sorts`,
    GET_SORT_BY_ID: (databaseId: string, sortId: string) =>
      `/databases/${databaseId}/sorts/${sortId}`,
    UPDATE_SORT: (databaseId: string, sortId: string) =>
      `/databases/${databaseId}/sorts/${sortId}`,
    DELETE_SORT: (databaseId: string, sortId: string) =>
      `/databases/${databaseId}/sorts/${sortId}`,
    DUPLICATE_SORT: (databaseId: string, sortId: string) =>
      `/databases/${databaseId}/sorts/${sortId}/duplicate`,
    // Database-level filter presets
    GET_FILTER_PRESETS: (databaseId: string) =>
      `/databases/${databaseId}/filter-presets`,
    CREATE_FILTER_PRESET: (databaseId: string) =>
      `/databases/${databaseId}/filter-presets`,
    GET_FILTER_PRESET_BY_ID: (databaseId: string, presetId: string) =>
      `/databases/${databaseId}/filter-presets/${presetId}`,
    UPDATE_FILTER_PRESET: (databaseId: string, presetId: string) =>
      `/databases/${databaseId}/filter-presets/${presetId}`,
    DELETE_FILTER_PRESET: (databaseId: string, presetId: string) =>
      `/databases/${databaseId}/filter-presets/${presetId}`,
    DUPLICATE_FILTER_PRESET: (databaseId: string, presetId: string) =>
      `/databases/${databaseId}/filter-presets/${presetId}/duplicate`,
    APPLY_FILTER_PRESET: (databaseId: string, presetId: string) =>
      `/databases/${databaseId}/filter-presets/${presetId}/apply`,
  },
  PROPERTY: {
    GET_ALL: (databaseId: string) => `/databases/${databaseId}/properties`,
    CREATE: (databaseId: string) => `/databases/${databaseId}/properties`,
    GET_BY_ID: (databaseId: string, propertyId: string) =>
      `/databases/${databaseId}/properties/${propertyId}`,
    UPDATE: (databaseId: string, propertyId: string) =>
      `/databases/${databaseId}/properties/${propertyId}`,
    DELETE: (databaseId: string, propertyId: string) =>
      `/databases/${databaseId}/properties/${propertyId}`,
    REORDER: (databaseId: string) =>
      `/databases/${databaseId}/properties/reorder`,
    VALIDATE: (databaseId: string, propertyId: string) =>
      `/databases/${databaseId}/properties/${propertyId}/validate`,
    DUPLICATE: (databaseId: string, propertyId: string) =>
      `/databases/${databaseId}/properties/${propertyId}/duplicate`,
    CHANGE_TYPE: (databaseId: string, propertyId: string) =>
      `/databases/${databaseId}/properties/${propertyId}/change-type`,
    INSERT_AFTER: (databaseId: string) =>
      `/databases/${databaseId}/properties/insert-after`,
    CALCULATIONS: (databaseId: string, propertyId: string) =>
      `/databases/${databaseId}/properties/${propertyId}/calculations`,
    TOGGLE_VISIBILITY: (databaseId: string, propertyId: string) =>
      `/databases/${databaseId}/properties/${propertyId}/toggle-visibility`,
  },
  RECORD: {
    GET_ALL: (databaseId: string) => `/databases/${databaseId}/records`,
    CREATE: (databaseId: string) => `/databases/${databaseId}/records`,
    GET_BY_ID: (databaseId: string, recordId: string) =>
      `/databases/${databaseId}/records/${recordId}`,
    UPDATE: (databaseId: string, recordId: string) =>
      `/databases/${databaseId}/records/${recordId}`,
    DELETE: (databaseId: string, recordId: string) =>
      `/databases/${databaseId}/records/${recordId}`,
    BULK_UPDATE: (databaseId: string) =>
      `/databases/${databaseId}/records/bulk-update`,
    BULK_DELETE: (databaseId: string) =>
      `/databases/${databaseId}/records/bulk-delete`,
    REORDER: (databaseId: string) => `/databases/${databaseId}/records/reorder`,
    DUPLICATE: (databaseId: string, recordId: string) =>
      `/databases/${databaseId}/records/${recordId}/duplicate`,
  },
  VIEW: {
    GET_ALL: (databaseId: string) => `/databases/${databaseId}/views`,
    CREATE: (databaseId: string) => `/databases/${databaseId}/views`,
    GET_BY_ID: (databaseId: string, viewId: string) =>
      `/databases/${databaseId}/views/${viewId}`,
    UPDATE: (databaseId: string, viewId: string) =>
      `/databases/${databaseId}/views/${viewId}`,
    DELETE: (databaseId: string, viewId: string) =>
      `/databases/${databaseId}/views/${viewId}`,
    DUPLICATE: (databaseId: string, viewId: string) =>
      `/databases/${databaseId}/views/${viewId}/duplicate`,
    UPDATE_GROUPING: (databaseId: string, viewId: string) =>
      `/databases/${databaseId}/views/${viewId}/grouping`,
    CHANGE_TYPE: (databaseId: string, viewId: string) =>
      `/databases/${databaseId}/views/${viewId}/change-type`,
    UPDATE_PROPERTY_VISIBILITY: (databaseId: string, viewId: string) =>
      `/databases/${databaseId}/views/${viewId}/property-visibility`,
    UPDATE_HIDDEN_PROPERTIES: (databaseId: string, viewId: string) =>
      `/databases/${databaseId}/views/${viewId}/hidden-properties`,
    UPDATE_COLUMN_FREEZE: (databaseId: string, viewId: string) =>
      `/databases/${databaseId}/views/${viewId}/column-freeze`,
    UPDATE_FILTERS: (databaseId: string, viewId: string) =>
      `/databases/${databaseId}/views/${viewId}/filters`,
    UPDATE_SORTS: (databaseId: string, viewId: string) =>
      `/databases/${databaseId}/views/${viewId}/sorts`,
  },
  RELATION: {
    GET_ALL: "/relations",
    CREATE: "/relations",
    GET_BY_ID: (relationId: string) => `/relations/${relationId}`,
    UPDATE: (relationId: string) => `/relations/${relationId}`,
    DELETE: (relationId: string) => `/relations/${relationId}`,
    CONNECTIONS: "/relations/connections",
    CREATE_CONNECTION: "/relations/connections",
    DELETE_CONNECTION: (connectionId: string) =>
      `/relations/connections/${connectionId}`,
    VALIDATE: "/relations/validate",
    STATS: (relationId: string) => `/relations/${relationId}/stats`,
  },
  BLOCK: {
    GET_ALL: (databaseId: string, recordId: string) =>
      `/databases/${databaseId}/records/${recordId}/blocks`,
    CREATE: (databaseId: string, recordId: string) =>
      `/databases/${databaseId}/records/${recordId}/blocks`,
    GET_BY_ID: (databaseId: string, recordId: string, blockId: string) =>
      `/databases/${databaseId}/records/${recordId}/blocks/${blockId}`,
    UPDATE: (databaseId: string, recordId: string, blockId: string) =>
      `/databases/${databaseId}/records/${recordId}/blocks/${blockId}`,
    DELETE: (databaseId: string, recordId: string, blockId: string) =>
      `/databases/${databaseId}/records/${recordId}/blocks/${blockId}`,
    BULK_OPERATIONS: (databaseId: string, recordId: string) =>
      `/databases/${databaseId}/records/${recordId}/blocks/bulk`,
    MOVE: (databaseId: string, recordId: string, blockId: string) =>
      `/databases/${databaseId}/records/${recordId}/blocks/${blockId}/move`,
    DUPLICATE: (databaseId: string, recordId: string, blockId: string) =>
      `/databases/${databaseId}/records/${recordId}/blocks/${blockId}/duplicate`,
    ARCHIVE: (databaseId: string, recordId: string, blockId: string) =>
      `/databases/${databaseId}/records/${recordId}/blocks/${blockId}/archive`,
    RESTORE: (databaseId: string, recordId: string, blockId: string) =>
      `/databases/${databaseId}/records/${recordId}/blocks/${blockId}/restore`,
    BULK_UPDATE: (databaseId: string, recordId: string) =>
      `/databases/${databaseId}/records/${recordId}/blocks/bulk-update`,
    SEARCH: (databaseId: string, recordId: string) =>
      `/databases/${databaseId}/records/${recordId}/blocks/search`,
  },
  MODULES: {
    AVAILABLE: "/modules/available",
    CORE: "/modules/core",
    BY_CATEGORY: "/modules/category",
    CONFIG: (moduleId: string) => `/modules/config/${moduleId}`,
    AVAILABILITY: (moduleId: string) => `/modules/availability/${moduleId}`,
    DEPENDENCIES: (moduleId: string) => `/modules/dependencies/${moduleId}`,
    VALIDATE: "/modules/validate",
    WORKSPACE_OVERVIEW: "/modules/workspace",
    WORKSPACE_INITIALIZED: "/modules/workspace/initialized",
    WORKSPACE_RECOMMENDATIONS: "/modules/workspace/recommendations",
    WORKSPACE_VALIDATE: "/modules/workspace/validate",
    WORKSPACE_STATUS: (moduleId: string) =>
      `/modules/workspace/${moduleId}/status`,
    WORKSPACE_DATABASE_ID: (moduleId: string) =>
      `/modules/workspace/${moduleId}/database-id`,
    WORKSPACE_DETAILS: (moduleId: string) =>
      `/modules/workspace/${moduleId}/details`,
    INITIALIZE: "/modules/workspace/initialize",
    INITIALIZE_CORE: "/modules/workspace/initialize/core",
    INITIALIZE_SPECIFIC: "/modules/workspace/initialize/specific",
  },
  CROSS_MODULE: {
    INITIALIZE_RELATIONS: "/cross-module/relations/initialize",
    CONNECT: "/cross-module/relations/connect",
    DISCONNECT: "/cross-module/relations/disconnect",
    BULK_CONNECT: "/cross-module/relations/bulk-connect",
    RELATED_RECORDS: (recordId: string) =>
      `/cross-module/relations/records/${recordId}/related`,
    RECORD_NETWORK: (recordId: string) =>
      `/cross-module/relations/records/${recordId}/network`,
    RECORD_TIMELINE: (recordId: string) =>
      `/cross-module/relations/records/${recordId}/timeline`,
    RECORD_SUGGESTIONS: (recordId: string) =>
      `/cross-module/relations/records/${recordId}/suggestions`,
    MODULE_STATS: (moduleType: string) =>
      `/cross-module/relations/modules/${moduleType}/stats`,
    INSIGHTS: "/cross-module/relations/insights",
    HEALTH_CHECK: "/cross-module/relations/health-check",
  },
  RELATION_ANALYTICS: {
    ANALYTICS: "/analytics/relations",
    PRODUCTIVITY: "/analytics/productivity",
    DASHBOARD: "/analytics/dashboard",
    RECOMMENDATIONS: "/analytics/recommendations",
    TRENDS: "/analytics/trends",
    IMPACT: "/analytics/impact",
    HEALTH: "/analytics/health",
  },
  TEMPLATES: {
    LIST: "/templates",
    FEATURED: "/templates/featured",
    OFFICIAL: "/templates/official",
    POPULAR: "/templates/popular",
    CATEGORIES: "/templates/categories",
    TYPES: "/templates/types",
    GALLERY: "/templates/gallery",
    SEARCH: "/templates/search",
    BY_CATEGORY: (category: string) => `/templates/category/${category}`,
    BY_MODULE: (moduleType: string) => `/templates/module/${moduleType}`,
    BY_ID: (templateId: string) => `/templates/${templateId}`,
    CREATE: "/templates",
    UPDATE: (templateId: string) => `/templates/${templateId}`,
    DELETE: (templateId: string) => `/templates/${templateId}`,
    APPLY_ROW: (templateId: string) => `/templates/${templateId}/apply/row`,
    APPLY_DATABASE: (templateId: string) =>
      `/templates/${templateId}/apply/database`,
    APPLY_WORKSPACE: (templateId: string) =>
      `/templates/${templateId}/apply/workspace`,
    RATE: (templateId: string) => `/templates/${templateId}/rate`,
    ANALYTICS: (templateId: string) => `/templates/${templateId}/analytics`,
    USER_TEMPLATES: "/templates/user/my-templates",
    USER_HISTORY: "/templates/user/history",
    SUGGESTIONS: (databaseId: string) => `/templates/suggestions/${databaseId}`,
    DUPLICATE: (templateId: string) => `/templates/${templateId}/duplicate`,
    EXPORT: (templateId: string) => `/templates/${templateId}/export`,
    IMPORT: "/templates/import",
    INITIALIZE_PREDEFINED: "/templates/admin/initialize-predefined",
  },
  TEMPLATE_BUILDER: {
    FROM_RECORD: (recordId: string) =>
      `/template-builder/from-record/${recordId}`,
    FROM_DATABASE: (databaseId: string) =>
      `/template-builder/from-database/${databaseId}`,
    FROM_WORKSPACE: (workspaceId: string) =>
      `/template-builder/from-workspace/${workspaceId}`,
    GENERATE_FROM_PROMPT: "/template-builder/generate-from-prompt",
    ANALYZE_DATABASE: (databaseId: string) =>
      `/template-builder/analyze-database/${databaseId}`,
    VALIDATE: "/template-builder/validate",
    PREVIEW: "/template-builder/preview",
    SUGGESTIONS: "/template-builder/suggestions",
    WIZARD_STEPS: (templateType: string) =>
      `/template-builder/wizard-steps/${templateType}`,
    ANALYTICS: "/template-builder/analytics",
  },
  SETTINGS: {
    BASE: "/settings",
    APPEARANCE: "/settings/appearance",
    NOTIFICATIONS: "/settings/notifications",
    DISPLAY: "/settings/display",
    SECURITY: "/settings/security",
    WORKSPACE: "/settings/workspace",
    RESET: "/settings/reset",
  },
  CALENDAR: {
    LIST: "/calendar",
    CREATE: "/calendar",
    BY_ID: (id: string) => `/calendar/${id}`,
    UPDATE: (id: string) => `/calendar/${id}`,
    DELETE: (id: string) => `/calendar/${id}`,

    // Events
    EVENTS: "/calendar/events",
    EVENT_BY_ID: (id: string) => `/calendar/events/${id}`,
    EVENTS_UPCOMING: "/calendar/events/upcoming",
    EVENTS_TODAY: "/calendar/events/today",
    EVENTS_SEARCH: "/calendar/events/search",
    EVENTS_BY_ENTITY: (entityType: string, entityId: string) =>
      `/calendar/events/entity/${entityType}/${entityId}`,

    // Views and stats
    CONFIG: "/calendar/config",
    PREFERENCES: "/calendar/preferences",
    VIEW_CALENDAR: "/calendar/view/calendar",
    VIEW_BUSY_TIMES: "/calendar/view/busy-times",
    STATS: "/calendar/stats",
    SYNC_TIME_RELATED: "/calendar/sync/time-related",

    // External connections
    CONNECTIONS_PROVIDERS: "/calendar/connections/providers",
    CONNECTIONS: "/calendar/connections",
    CONNECTION_BY_ID: (id: string) => `/calendar/connections/${id}`,
    CONNECTION_SYNC: (id: string) => `/calendar/connections/${id}/sync`,
    CONNECTION_TEST: (id: string) => `/calendar/connections/${id}/test`,
    CONNECTION_RESET_ERRORS: (id: string) =>
      `/calendar/connections/${id}/reset-errors`,
    CONNECTION_LOGS: (id: string) => `/calendar/connections/${id}/logs`,
    CONNECTIONS_STATS: "/calendar/connections/stats",
  },
  PARA: {
    // CRUD operations
    LIST: "/para",
    CREATE: "/para",
    BY_ID: (id: string) => `/para/${id}`,
    UPDATE: (id: string) => `/para/${id}`,
    DELETE: (id: string) => `/para/${id}`,

    // Statistics and analytics
    STATS: "/para/stats",

    // Category endpoints
    CATEGORIES: {
      PROJECTS: "/para/categories/projects",
      AREAS: "/para/categories/areas",
      RESOURCES: "/para/categories/resources",
      ARCHIVE: "/para/categories/archive",
    },

    // Analytics endpoints
    STATUS: (status: string) => `/para/status/${status}`,
    PRIORITY: (priority: string) => `/para/priority/${priority}`,
    REVIEWS_OVERDUE: "/para/reviews/overdue",
    SEARCH: "/para/search",

    // Actions
    ARCHIVE: "/para/archive",
    RESTORE: "/para/restore",
    CATEGORIZE: "/para/categorize",
    REVIEW: (id: string) => `/para/${id}/review`,
  },
} as const;
