export type TBaseEntity = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy?: string;
};

export type TSoftDelete = {
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: string;
};

export enum EDatabaseType {
  DASHBOARD = "dashboard",
  FINANCE = "finance",
  GOALS = "goals",
  JOURNAL = "journal",
  MOOD_TRACKER = "mood_tracker",
  NOTES = "notes",
  TASKS = "tasks",
  HABITS = "habits",
  PEOPLE = "people",
  RESOURCES = "resources",
  PARA_PROJECTS = "para_projects",
  PARA_AREAS = "para_areas",
  PARA_RESOURCES = "para_resources",
  PARA_ARCHIVE = "para_archive",
  PROJECTS = "projects",
  QUICK_TASKS = "quick_tasks",
  QUICK_NOTES = "quick_notes",
  CONTENT = "content",
  ACTIVITY = "activity",
  ANALYSIS = "analysis",
  NOTIFICATIONS = "notifications",
  CUSTOM = "custom",
}

export type TDatabaseIcon = {
  type: "emoji" | "icon" | "image";
  value: string;
};

export type TDatabaseCover = {
  type: "color" | "gradient" | "image";
  value: string;
};

export type TDatabaseTemplate = {
  id: string;
  name: string;
  description?: string;
  defaultValues: Record<string, TPropertyValue>;
  isDefault?: boolean;
};

export type TDatabase = TBaseEntity & {
  workspaceId: string;
  name: string;
  type: EDatabaseType;
  description?: string;
  icon?: TDatabaseIcon;
  cover?: TDatabaseCover;
  isPublic: boolean;
  isTemplate: boolean;
  isArchived: boolean;
  properties: TProperty[];
  views: TView[];
  templates: TDatabaseTemplate[];
  recordCount: number;
  lastActivityAt?: Date;
  allowComments: boolean;
  allowDuplicates: boolean;
  enableVersioning: boolean;
  enableAuditLog: boolean;
  enableAutoTagging: boolean;
  enableSmartSuggestions: boolean;
  syncSettings?: Record<string, unknown>;
};

export type TDatabaseStats = {
  databaseId: string;
  recordCount: number;
  propertyCount: number;
  viewCount: number;
  templateCount: number;
  lastActivityAt?: Date;
  createdThisWeek: number;
  updatedThisWeek: number;
  topContributors: Array<{
    userId: string;
    recordCount: number;
  }>;
};

export type TDatabaseQueryParams = {
  workspaceId?: string;
  type?: EDatabaseType;
  isPublic?: boolean;
  isTemplate?: boolean;
  isArchived?: boolean;
  search?: string;
  sortBy?:
    | "name"
    | "createdAt"
    | "updatedAt"
    | "lastActivityAt"
    | "recordCount";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
};

export enum EPropertyType {
  TEXT = "text",
  RICH_TEXT = "rich_text",
  NUMBER = "number",
  DATE = "date",
  CHECKBOX = "checkbox",
  URL = "url",
  EMAIL = "email",
  PHONE = "phone",
  CURRENCY = "currency",
  PERCENT = "percent",
  SELECT = "select",
  MULTI_SELECT = "multi_select",
  STATUS = "status",
  PRIORITY = "priority",
  FILE = "file",
  RELATION = "relation",
  ROLLUP = "rollup",
  FORMULA = "formula",
  CREATED_TIME = "created_time",
  LAST_EDITED_TIME = "last_edited_time",
  CREATED_BY = "created_by",
  LAST_EDITED_BY = "last_edited_by",
  MOOD_SCALE = "mood_scale",
  FREQUENCY = "frequency",
  CONTENT_TYPE = "content_type",
  FINANCE_TYPE = "finance_type",
  FINANCE_CATEGORY = "finance_category",
  FILES = "FILES",
  LOOKUP = "LOOKUP",
}

export type TPropertyOption = {
  id: string;
  value: string;
  label: string;
  color?: string;
  description?: string;
};

export type TPropertyConfig = {
  options?: TPropertyOption[];
  format?: "number" | "currency" | "percentage";
  precision?: number;
  includeTime?: boolean;
  relationDatabaseId?: string;
  relationPropertyId?: string;
  rollupPropertyId?: string;
  rollupFunction?:
    | "count"
    | "sum"
    | "average"
    | "min"
    | "max"
    | "latest"
    | "earliest";
  formula?: string;
  allowMultiple?: boolean;
  allowedTypes?: string[];
  maxSize?: number;
  maxLength?: number;
  displayText?: string;
  required?: boolean;
  unique?: boolean;
  defaultValue?: TPropertyValue;
};

export type TProperty = TBaseEntity & {
  databaseId: string;
  name: string;
  type: EPropertyType;
  config: TPropertyConfig;
  isSystem: boolean;
  isVisible: boolean;
  required: boolean;
  order: number;
  description?: string;
};

export type TPrimitiveValue = string | number | boolean | Date | null;
export type TArrayValue =
  | string[]
  | TPropertyOption[]
  | TRelationValue[]
  | TFileValue[];

export type TRelationValue = {
  recordId: string;
  databaseId: string;
  displayValue?: string;
};

export type TFileValue = {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
};

export type TRollupValue = {
  value: TPrimitiveValue;
  computedAt: Date;
};

export type TPropertyValue =
  | TPrimitiveValue
  | TPropertyOption
  | TArrayValue
  | TRollupValue
  | Record<string, unknown>;

export type TRecord = TBaseEntity &
  TSoftDelete & {
    databaseId: string;
    properties: Record<string, TPropertyValue>;
    content?: TContentBlock[];
    order?: number;
    isTemplate: boolean;
    isFavorite: boolean;
    isArchived: boolean;
    lastEditedBy?: string;
    lastEditedAt?: Date;
    commentCount: number;
    version: number;
    autoTags?: string[];
    aiSummary?: string;
    relationsCache?: Record<string, TPropertyValue[]>;
  };

export type TRecordQueryOptions = {
  databaseId: string;
  viewId?: string;
  search?: string;
  filters?: TViewFilter[];
  sorts?: TViewSort[];
  isTemplate?: boolean;
  isFavorite?: boolean;
  isArchived?: boolean;
  page?: number;
  limit?: number;
};

export type TRecordListResponse = {
  records: TRecord[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
  view?: {
    id: string;
    name: string;
    appliedFilters: TFilterCondition[];
    appliedSorts: TSortConfig[];
  };
};

export type TCreateRecord = {
  properties: Record<string, TPropertyValue>;
  content?: TContentBlock[];
  order?: number;
};

export type TUpdateRecord = {
  properties?: Record<string, TPropertyValue>;
  content?: TContentBlock[];
  order?: number;
  isFavorite?: boolean;
  isArchived?: boolean;
};

export enum EViewType {
  TABLE = "TABLE",
  BOARD = "BOARD",
  LIST = "LIST",
  CALENDAR = "CALENDAR",
  GALLERY = "GALLERY",
  TIMELINE = "TIMELINE",
  GANTT = "GANTT",
  CHART='CHART'
}

export enum EFilterOperator {
  EQUALS = "equals",
  NOT_EQUALS = "not_equals",
  CONTAINS = "contains",
  NOT_CONTAINS = "not_contains",
  CONTAINS_ALL = "contains_all",
  STARTS_WITH = "starts_with",
  ENDS_WITH = "ends_with",
  IS_EMPTY = "is_empty",
  IS_NOT_EMPTY = "is_not_empty",
  GREATER_THAN = "greater_than",
  GREATER_THAN_OR_EQUAL = "greater_than_or_equal",
  LESS_THAN = "less_than",
  LESS_THAN_OR_EQUAL = "less_than_or_equal",
  BEFORE = "before",
  AFTER = "after",
  ON_OR_BEFORE = "on_or_before",
  ON_OR_AFTER = "on_or_after",
  IS_TODAY = "is_today",
  IS_YESTERDAY = "is_yesterday",
  IS_TOMORROW = "is_tomorrow",
  IS_THIS_WEEK = "is_this_week",
  IS_LAST_WEEK = "is_last_week",
  IS_NEXT_WEEK = "is_next_week",
  IS_THIS_MONTH = "is_this_month",
  IS_LAST_MONTH = "is_last_month",
  IS_NEXT_MONTH = "is_next_month",
  IS = "is",
  IS_NOT = "is_not",
  IS_ANY_OF = "is_any_of",
  IS_NONE_OF = "is_none_of",
  IS_CHECKED = "is_checked",
  IS_UNCHECKED = "is_unchecked",
  CONTAINS_RELATION = "contains_relation",
  NOT_CONTAINS_RELATION = "not_contains_relation",
}

export type TFilterCondition = {
  id?: string;
  property: string; // Changed from propertyId for backend compatibility
  condition: EFilterOperator; // Changed from operator for backend compatibility
  value?: TPropertyValue;
  operator?: "and" | "or";
};

export type TSortConfig = {
  propertyId: string;
  direction: "asc" | "desc";
};

export type TViewFilter = {
  id?: string;
  property: string;
  condition: EFilterOperator;
  value?: TPropertyValue;
  operator?: "and" | "or";
};

export type TViewSort = {
  propertyId: string;
  direction: "asc" | "desc";
};

export type TViewGroup = {
  propertyId: string;
  hideEmpty?: boolean;
  sortGroups?: "asc" | "desc" | "manual";
};

export type TViewSettings = {
  filters: TViewFilter[];
  sorts: TViewSort[];
  groupBy?: TViewGroup;
  visibleProperties: string[];
  hiddenProperties?: string[];
  frozenColumns: string[];
  pageSize: number;
  showFilters?: boolean;
  showSearch?: boolean;
  showToolbar?: boolean;
  kanbanGroupBy?: string;
  [key: string]: unknown;
};

export type TViewConfig = {
  pageSize?: number;
  columns?: TColumnConfig[];
  group?: TGroupConfig;
  calendar?: TCalendarConfig;
  gallery?: TGalleryConfig;
  timeline?: TTimelineConfig;
};

export type TColumnConfig = {
  propertyId: string;
  width?: number;
  isVisible: boolean;
  order: number;
  isFrozen?: boolean;
};

export type TGroupConfig = {
  propertyId: string;
  hideEmpty?: boolean;
  sortGroups?: "asc" | "desc" | "manual";
};

export type TCalendarConfig = {
  datePropertyId: string;
  endDatePropertyId?: string;
  showWeekends?: boolean;
  defaultView?: "month" | "week" | "day";
};

export type TGalleryConfig = {
  coverPropertyId?: string;
  cardSize?: "small" | "medium" | "large";
  showProperties?: string[];
};

export type TTimelineConfig = {
  startDatePropertyId: string;
  endDatePropertyId?: string;
  groupByPropertyId?: string;
  showDependencies?: boolean;
};

export type TView = TBaseEntity & {
  databaseId: string;
  name: string;
  type: EViewType;
  isDefault: boolean;
  isPublic: boolean;
  config: TViewConfig;
  sorts: TViewSort[];
  filters: TViewFilter[];
  order: number;
  description?: string;
  settings: TViewSettings;
};

export type TCreateView = {
  name: string;
  type: EViewType;
  description?: string;
  isDefault?: boolean;
  isPublic?: boolean;
  settings: TViewSettings;
};

export type TUpdateView = {
  name?: string;
  description?: string;
  isDefault?: boolean;
  isPublic?: boolean;
  settings?: Partial<TViewSettings>;
  sorts?: TViewSort[];
  filters?: TViewFilter[];
  order?: number;
};

export enum EBlockType {
  PARAGRAPH = "paragraph",
  HEADING_1 = "heading_1",
  HEADING_2 = "heading_2",
  HEADING_3 = "heading_3",
  BULLETED_LIST_ITEM = "bulleted_list_item",
  NUMBERED_LIST_ITEM = "numbered_list_item",
  TO_DO = "to_do",
  QUOTE = "quote",
  CODE = "code",
  IMAGE = "image",
  DIVIDER = "divider",
}

export type TSelectOption = {
  id: string;
  name: string;
  color: string;
  description?: string;
};

export type TCreateDatabase = {
  name: string;
  description?: string;
  icon?: string;
  cover?: string;
  workspaceId?: string;
  isPublic?: boolean;
};

export type TUpdateDatabase = {
  name?: string;
  description?: string;
  icon?: string;
  cover?: string;
  isPublic?: boolean;
};

export type TCreateProperty = {
  name: string;
  type: EPropertyType;
  description?: string;
  required?: boolean;
  selectOptions?: Omit<TSelectOption, "id">[];
  relationConfig?: Record<string, unknown>;
  order?: number;
};

export type TUpdateProperty = {
  name?: string;
  description?: string;
  required?: boolean;
  selectOptions?: TSelectOption[];
};

export type TCreateViewInput = {
  name: string;
  type: EViewType;
  isDefault?: boolean;
  settings: TViewSettings;
};

export type TUpdateViewInput = {
  name?: string;
  settings?: Partial<TViewSettings>;
};

export type TCreateRecordInput = {
  properties: Record<string, unknown>;
};

export type TUpdateRecordInput = {
  properties: Record<string, unknown>;
};

export type TBulkUpdateRecords = {
  recordIds: string[];
  updates: {
    properties?: Record<string, TPropertyValue>;
    content?: TContentBlock[];
  };
};

export type TBulkDeleteRecords = {
  recordIds: string[];
  permanent?: boolean;
};

export type TReorderRecords = {
  recordOrders: Array<{
    recordId: string;
    order: number;
  }>;
};

export type TPermissionLevel = "read" | "write" | "admin";

export type TDatabasePermission = {
  userId: string;
  permission: TPermissionLevel;
  grantedAt: string;
};

export type TShareDatabase = {
  userId: string;
  permission: TPermissionLevel;
};

export type TPaginatedDatabase = {
  databases: TDatabase[];
  total: number;
  totalPages: number;
  currentPage: number;
};

export type TPaginatedRecords = {
  records: TRecord[];
  total: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  groupedData?: Record<string, TRecord[]>;
};

export type TRecordQueryParams = {
  viewId?: string;
  page?: number;
  limit?: number;
  search?: string;
  searchProperties?: string;
  groupBy?: string;
  filters?: string;
  sorts?: string;
};

// Database-level filter and sort types
export type TDatabaseFilter = {
  id: string;
  name: string;
  databaseId: string;
  conditions: TFilterCondition[];
  isActive: boolean;
  isDefault: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TDatabaseSort = {
  id: string;
  name: string;
  databaseId: string;
  sorts: TSortConfig[];
  isActive: boolean;
  isDefault: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TDatabaseFilterPreset = {
  id: string;
  name: string;
  databaseId: string;
  filters: TDatabaseFilter[];
  sorts: TDatabaseSort[];
  isPublic: boolean;
  isDefault: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TCreateDatabaseFilter = {
  name: string;
  conditions: TFilterCondition[];
  isActive?: boolean;
  isDefault?: boolean;
};

export type TUpdateDatabaseFilter = {
  name?: string;
  conditions?: TFilterCondition[];
  isActive?: boolean;
  isDefault?: boolean;
};

export type TCreateDatabaseSort = {
  name: string;
  sorts: TSortConfig[];
  isActive?: boolean;
  isDefault?: boolean;
};

export type TUpdateDatabaseSort = {
  name?: string;
  sorts?: TSortConfig[];
  isActive?: boolean;
  isDefault?: boolean;
};

export type TCreateDatabaseFilterPreset = {
  name: string;
  filters: TDatabaseFilter[];
  sorts: TDatabaseSort[];
  isPublic?: boolean;
  isDefault?: boolean;
};

export type TUpdateDatabaseFilterPreset = {
  name?: string;
  filters?: TDatabaseFilter[];
  sorts?: TDatabaseSort[];
  isPublic?: boolean;
  isDefault?: boolean;
};

export type TDatabaseFilterQueryParams = {
  databaseId: string;
  isActive?: boolean;
  isDefault?: boolean;
  search?: string;
  page?: number;
  limit?: number;
};

export type TDatabaseSortQueryParams = {
  databaseId: string;
  isActive?: boolean;
  isDefault?: boolean;
  search?: string;
  page?: number;
  limit?: number;
};

export type TDatabaseFilterPresetQueryParams = {
  databaseId: string;
  isPublic?: boolean;
  isDefault?: boolean;
  search?: string;
  page?: number;
  limit?: number;
};

export type TDatabaseSchemaConfig = {
  databaseId?: string;
  viewId?: string;
  pageSize?: number;
  enableSearch?: boolean;
  enableFilters?: boolean;
  enableSorting?: boolean;
  enableBulkActions?: boolean;
};

export type TPropertyQueryParams = {
  viewId: string;
  includeHidden: boolean;
};

export type TReorderProperties = {
  propertyOrders: Array<{
    propertyId: string;
    order: number;
  }>;
};

// Relation Types
export enum ERelationType {
  ONE_TO_ONE = "one_to_one",
  ONE_TO_MANY = "one_to_many",
  MANY_TO_ONE = "many_to_one",
  MANY_TO_MANY = "many_to_many",
}

export type TRelationConfig = {
  type: ERelationType;
  sourceDatabaseId: string;
  sourcePropertyId: string;
  targetDatabaseId: string;
  targetPropertyId?: string;
  onSourceDelete?: "cascade" | "set_null" | "restrict";
  onTargetDelete?: "cascade" | "set_null" | "restrict";
  displayProperty?: string;
  allowDuplicates?: boolean;
  required?: boolean;
  maxConnections?: number;
};

export type IRelation = {
  id: string;
  name: string;
  description?: string;
  config: TRelationConfig;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy?: string;
};

export type TCreateRelation = {
  name: string;
  description?: string;
  config: TRelationConfig;
};

export type TUpdateRelation = {
  name?: string;
  description?: string;
  config?: Partial<TRelationConfig>;
  isActive?: boolean;
};

export type TRelationConnection = {
  id: string;
  relationId: string;
  sourceRecordId: string;
  targetRecordId: string;
  createdAt: Date;
  createdBy: string;
  properties?: Record<string, TPropertyValue>;
};

export type TCreateRelationConnection = {
  relationId: string;
  sourceRecordId: string;
  targetRecordId: string;
  properties?: Record<string, TPropertyValue>;
};

export type TRelationQueryParams = {
  sourceDatabaseId?: string;
  targetDatabaseId?: string;
  type?: ERelationType;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
};

export type TRelationList = {
  relations: IRelation[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type IRelationConnectionQueryParams = {
  relationId?: string;
  sourceRecordId?: string;
  targetRecordId?: string;
  page?: number;
  limit?: number;
};

export type TRelationConnectionList = {
  connections: TRelationConnection[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
};

// Block Types
export enum EBlockType {
  PARAGRAPH = "paragraph",
  HEADING_1 = "heading_1",
  HEADING_2 = "heading_2",
  HEADING_3 = "heading_3",
  BULLETED_LIST_ITEM = "bulleted_list_item",
  NUMBERED_LIST_ITEM = "numbered_list_item",
  TO_DO = "to_do",
  QUOTE = "quote",
  CODE = "code",
  IMAGE = "image",
  VIDEO = "video",
  FILE = "file",
  DIVIDER = "divider",
  EMBED = "embed",
  BOOKMARK = "bookmark",
  EQUATION = "equation",
  TABLE = "table",
  TABLE_ROW = "table_row",
  CALLOUT = "callout",
  COLUMN_LIST = "column_list",
  COLUMN = "column",
  CHILD_PAGE = "child_page",
  CHILD_DATABASE = "child_database",
  LINK_PREVIEW = "link_preview",
  SYNCED_BLOCK = "synced_block",
  TEMPLATE = "template",
  TABLE_OF_CONTENTS = "table_of_contents",
  BREADCRUMB = "breadcrumb",
  TOGGLE = "toggle",
}

export enum ERichTextType {
  TEXT = "text",
  MENTION = "mention",
  EQUATION = "equation",
}

export type TTextAnnotations = {
  bold?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
  underline?: boolean;
  code?: boolean;
  color?: string;
};

export type TRichText = {
  type: ERichTextType;
  text?: {
    content: string;
    link?: {
      url: string;
    };
  };
  mention?: {
    type: "user" | "page" | "database" | "date";
    user?: { id: string };
    page?: { id: string };
    database?: { id: string };
    date?: { start: string; end?: string };
  };
  equation?: {
    expression: string;
  };
  annotations?: TTextAnnotations;
  plain_text: string;
  href?: string;
};

export type TContentBlock = {
  id: string;
  type: EBlockType;
  content: TRichText[];
  children?: TContentBlock[];
  checked?: boolean;
  language?: string;
  url?: string;
  caption?: TRichText[];
  createdAt: Date;
  createdBy: string;
  lastEditedAt: Date;
  lastEditedBy: string;
};

export interface ICreateBlock {
  type: EBlockType;
  afterBlockId?: string;
  parentId?: string;
  content: Partial<TContentBlock>;
}

export interface IUpdateBlock {
  content?: Partial<TContentBlock>;
  archived?: boolean;
}

export interface IBulkBlockOperation {
  operation: "create" | "update" | "delete" | "move";
  blockId?: string;
  data?:
    | ICreateBlock
    | IUpdateBlock
    | { afterBlockId?: string; parentId?: string };
}

export interface IBlockSearchOptions {
  query?: string;
  types?: EBlockType[];
  createdBy?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  hasChildren?: boolean;
  archived?: boolean;
  limit?: number;
  cursor?: string;
}

export interface IBlockList {
  blocks: TContentBlock[];
  total: number;
  hasMore: boolean;
  nextCursor?: string;
}
