// Base types
export interface IBaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy?: string;
}

export interface ISoftDelete {
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: string;
}

// Database Types
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

export interface IDatabaseIcon {
  type: "emoji" | "icon" | "image";
  value: string;
}

export interface IDatabaseCover {
  type: "color" | "gradient" | "image";
  value: string;
}

export interface IDatabaseTemplate {
  id: string;
  name: string;
  description?: string;
  defaultValues: Record<string, any>;
  isDefault?: boolean;
}

export interface IDatabase extends IBaseEntity {
  workspaceId: string;
  name: string;
  type: EDatabaseType;
  description?: string;
  icon?: IDatabaseIcon;
  cover?: IDatabaseCover;
  isPublic: boolean;
  isTemplate: boolean;
  isArchived: boolean;
  properties: IProperty[];
  views: IView[];
  templates: IDatabaseTemplate[];
  recordCount: number;
  lastActivityAt?: Date;
  allowComments: boolean;
  allowDuplicates: boolean;
  enableVersioning: boolean;
  enableAuditLog: boolean;
  enableAutoTagging: boolean;
  enableSmartSuggestions: boolean;
  syncSettings?: Record<string, any>;
}

export interface IDatabaseStats {
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
}

// Response types
export interface IDatabaseResponse extends IDatabase {}
export interface IDatabaseStatsResponse extends IDatabaseStats {}

export interface IDatabaseListResponse {
  databases: IDatabaseResponse[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Request types
export interface ICreateDatabaseRequest {
  workspaceId: string;
  name: string;
  type: EDatabaseType;
  description?: string;
  icon?: IDatabaseIcon;
  cover?: IDatabaseCover;
  isPublic?: boolean;
  isTemplate?: boolean;
  allowComments?: boolean;
  allowDuplicates?: boolean;
  enableVersioning?: boolean;
  enableAuditLog?: boolean;
  enableAutoTagging?: boolean;
  enableSmartSuggestions?: boolean;
  templateId?: string;
}

export interface IUpdateDatabaseRequest {
  name?: string;
  description?: string;
  icon?: IDatabaseIcon;
  cover?: IDatabaseCover;
  isPublic?: boolean;
  isArchived?: boolean;
  allowComments?: boolean;
  allowDuplicates?: boolean;
  enableVersioning?: boolean;
  enableAuditLog?: boolean;
  enableAutoTagging?: boolean;
  enableSmartSuggestions?: boolean;
  syncSettings?: Record<string, any>;
}

export interface IDatabaseQueryParams {
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
}

// Property Types
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

export interface IPropertyOption {
  id: string;
  value: string;
  label: string;
  color?: string;
  description?: string;
}

export interface IPropertyConfig {
  options?: IPropertyOption[];
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
}

export interface IProperty extends IBaseEntity {
  databaseId: string;
  name: string;
  type: EPropertyType;
  config: IPropertyConfig;
  isSystem: boolean;
  isVisible: boolean;
  order: number;
  description?: string;
}

// Property value types
export type TPrimitiveValue = string | number | boolean | Date | null;
export type TArrayValue =
  | string[]
  | IPropertyOption[]
  | IRelationValue[]
  | IFileValue[];

export interface IRelationValue {
  recordId: string;
  databaseId: string;
  displayValue?: string;
}

export interface IFileValue {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

export interface IRollupValue {
  value: TPrimitiveValue;
  computedAt: Date;
}

export type TPropertyValue =
  | TPrimitiveValue
  | IPropertyOption
  | TArrayValue
  | IRollupValue
  | Record<string, unknown>;

// Response types
export interface IPropertyResponse extends IProperty {}
export type TPropertyListResponse = IPropertyResponse[];

// Request types
export interface ICreatePropertyRequest {
  name: string;
  type: EPropertyType;
  description?: string;
  isRequired?: boolean;
  isVisible?: boolean;
  isFrozen?: boolean;
  order?: number;
  config?: IPropertyConfig;
}

export interface IUpdatePropertyRequest {
  name?: string;
  type?: EPropertyType;
  description?: string;
  isRequired?: boolean;
  isVisible?: boolean;
  isFrozen?: boolean;
  order?: number;
  config?: IPropertyConfig;
}

export interface IReorderPropertiesRequest {
  propertyOrders: Array<{
    propertyId: string;
    order: number;
  }>;
}

// Record Types
export interface IRecord extends IBaseEntity, ISoftDelete {
  databaseId: string;
  properties: Record<string, TPropertyValue>;
  content?: IRecordContent[];
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
  relationsCache?: Record<string, any[]>;
}

// Rich content types
export enum EContentBlockType {
  PARAGRAPH = "paragraph",
  HEADING_1 = "heading_1",
  HEADING_2 = "heading_2",
  HEADING_3 = "heading_3",
  BULLETED_LIST_ITEM = "bulleted_list_item",
  NUMBERED_LIST_ITEM = "numbered_list_item",
  TO_DO = "to_do",
  TOGGLE = "toggle",
  QUOTE = "quote",
  DIVIDER = "divider",
  CODE = "code",
  CALLOUT = "callout",
  IMAGE = "image",
  VIDEO = "video",
  FILE = "file",
  BOOKMARK = "bookmark",
  EMBED = "embed",
  TABLE = "table",
  COLUMN_LIST = "column_list",
  COLUMN = "column",
}

export interface IRichText {
  type: "text" | "mention" | "equation";
  text?: {
    content: string;
    link?: { url: string };
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
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
  plain_text: string;
  href?: string;
}

export interface IRecordContent {
  id: string;
  type: EContentBlockType;
  content: IRichText[];
  children?: IRecordContent[];
  checked?: boolean;
  language?: string;
  caption?: IRichText[];
  url?: string;
  createdAt: Date;
  createdBy: string;
  lastEditedAt: Date;
  lastEditedBy: string;
}

// Response types
export interface IRecordResponse extends IRecord {}
export interface IRecordListResponse {
  records: IRecordResponse[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Request types
export interface ICreateRecordRequest {
  properties: Record<string, TPropertyValue>;
  content?: IRecordContent[];
  order?: number;
}

export interface IUpdateRecordRequest {
  properties?: Record<string, TPropertyValue>;
  content?: IRecordContent[];
  order?: number;
  isFavorite?: boolean;
  isArchived?: boolean;
}

export interface IBulkUpdateRecordsRequest {
  recordIds: string[];
  updates: {
    properties?: Record<string, TPropertyValue>;
    content?: IRecordContent[];
  };
}

export interface IBulkDeleteRecordsRequest {
  recordIds: string[];
  permanent?: boolean;
}

export interface IDuplicateRecordRequest {
  includeContent?: boolean;
  newProperties?: Record<string, TPropertyValue>;
}

export interface IRecordQueryParams {
  databaseId: string;
  viewId?: string;
  search?: string;
  filters?: any;
  sorts?: any;
  isTemplate?: boolean;
  isFavorite?: boolean;
  isArchived?: boolean;
  page?: number;
  limit?: number;
}

// View Types
export enum EViewType {
  TABLE = "table",
  BOARD = "board",
  LIST = "list",
  CALENDAR = "calendar",
  GALLERY = "gallery",
  TIMELINE = "timeline",
  GANTT = "gantt",
}

export interface ISortConfig {
  propertyId: string;
  direction: "asc" | "desc";
}

export enum EFilterOperator {
  EQUALS = "equals",
  NOT_EQUALS = "not_equals",
  CONTAINS = "contains",
  NOT_CONTAINS = "not_contains",
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

export interface IFilterCondition {
  propertyId: string;
  operator: EFilterOperator;
  value?: any;
}

export interface IFilterGroup {
  operator: "and" | "or";
  conditions: (IFilterCondition | IFilterGroup)[];
}

export interface IViewConfig {
  pageSize?: number;
  columns?: IColumnConfig[];
  group?: IGroupConfig;
  calendar?: ICalendarConfig;
  gallery?: IGalleryConfig;
  timeline?: ITimelineConfig;
}

export interface IColumnConfig {
  propertyId: string;
  width?: number;
  isVisible: boolean;
  order: number;
  isFrozen?: boolean;
}

export interface IGroupConfig {
  propertyId: string;
  hideEmpty?: boolean;
  sortGroups?: "asc" | "desc" | "manual";
}

export interface ICalendarConfig {
  datePropertyId: string;
  endDatePropertyId?: string;
  showWeekends?: boolean;
  defaultView?: "month" | "week" | "day";
}

export interface IGalleryConfig {
  coverPropertyId?: string;
  cardSize?: "small" | "medium" | "large";
  showProperties?: string[];
}

export interface ITimelineConfig {
  startDatePropertyId: string;
  endDatePropertyId?: string;
  groupByPropertyId?: string;
  showDependencies?: boolean;
}

export interface IView extends IBaseEntity {
  databaseId: string;
  name: string;
  type: EViewType;
  isDefault: boolean;
  isPublic: boolean;
  config: IViewConfig;
  sorts: ISortConfig[];
  filters: IFilterGroup;
  order: number;
  description?: string;
}

// Response types
export interface IViewResponse extends IView {}
export type TViewListResponse = IViewResponse[];

// Request types
export interface ICreateViewRequest {
  name: string;
  type: EViewType;
  description?: string;
  isDefault?: boolean;
  isPublic?: boolean;
  settings?: Record<string, any>;
}

export interface IUpdateViewRequest {
  name?: string;
  description?: string;
  isDefault?: boolean;
  isPublic?: boolean;
  settings?: Record<string, any>;
  order?: number;
}

// Relation Types
export enum ERelationType {
  ONE_TO_ONE = "one_to_one",
  ONE_TO_MANY = "one_to_many",
  MANY_TO_ONE = "many_to_one",
  MANY_TO_MANY = "many_to_many",
}

export interface IRelationConfig {
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
}

export interface IRelation extends IBaseEntity {
  name: string;
  description?: string;
  config: IRelationConfig;
  isActive: boolean;
}

export interface IRelationConnection {
  id: string;
  relationId: string;
  sourceRecordId: string;
  targetRecordId: string;
  createdAt: Date;
  createdBy: string;
  properties?: Record<string, any>;
}

// Response types
export interface IRelationResponse extends IRelation {}
export interface IRelationConnectionResponse extends IRelationConnection {}
export type TRelationListResponse = IRelationResponse[];
export type TRelationConnectionListResponse = IRelationConnectionResponse[];

// Request types
export interface ICreateRelationRequest {
  name: string;
  description?: string;
  config: IRelationConfig;
}

export interface IUpdateRelationRequest {
  name?: string;
  description?: string;
  config?: Partial<IRelationConfig>;
  isActive?: boolean;
}

export interface ICreateRelationConnectionRequest {
  relationId: string;
  sourceRecordId: string;
  targetRecordId: string;
  properties?: Record<string, any>;
}

export interface IRelationQueryParams {
  sourceDatabaseId?: string;
  targetDatabaseId?: string;
  type?: ERelationType;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface IRelationConnectionQueryParams {
  relationId?: string;
  sourceRecordId?: string;
  targetRecordId?: string;
  page?: number;
  limit?: number;
}

// Block Types
export enum BlockType {
  PARAGRAPH = "paragraph",
  HEADING_1 = "heading_1",
  HEADING_2 = "heading_2",
  HEADING_3 = "heading_3",
  CHILD_PAGE = "child_page",
  CHILD_DATABASE = "child_database",
  BULLETED_LIST_ITEM = "bulleted_list_item",
  NUMBERED_LIST_ITEM = "numbered_list_item",
  TO_DO = "to_do",
  TOGGLE = "toggle",
  QUOTE = "quote",
  DIVIDER = "divider",
  CODE = "code",
  EMBED = "embed",
  IMAGE = "image",
  VIDEO = "video",
  FILE = "file",
  TABLE = "table",
  TABLE_ROW = "table_row",
  CALLOUT = "callout",
  COLUMN_LIST = "column_list",
  COLUMN = "column",
  BOOKMARK = "bookmark",
  EQUATION = "equation",
  BREADCRUMB = "breadcrumb",
  TABLE_OF_CONTENTS = "table_of_contents",
  LINK_PREVIEW = "link_preview",
  SYNCED_BLOCK = "synced_block",
  TEMPLATE = "template",
}

export interface ITextAnnotations {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
  code: boolean;
  color: string;
}

export interface ITextContent {
  type: "text";
  text: {
    content: string;
    link?: {
      url: string;
    };
  };
  annotations: ITextAnnotations;
  plain_text: string;
  href?: string;
}

export interface IMentionContent {
  type: "mention";
  mention: {
    type:
      | "user"
      | "page"
      | "database"
      | "date"
      | "link_mention"
      | "template_mention";
    user?: {
      id: string;
      name?: string;
      avatar_url?: string;
    };
    page?: {
      id: string;
      title?: string;
    };
    database?: {
      id: string;
      name?: string;
    };
    date?: {
      start: string;
      end?: string;
      time_zone?: string;
    };
    link_mention?: {
      url: string;
    };
    template_mention?: {
      type: "template_mention_date" | "template_mention_user";
    };
  };
  annotations: ITextAnnotations;
  plain_text: string;
  href?: string;
}

export interface IEquationContent {
  type: "equation";
  equation: {
    expression: string;
  };
  annotations: ITextAnnotations;
  plain_text: string;
}

export type IRichTextContent =
  | ITextContent
  | IMentionContent
  | IEquationContent;

export interface IFileObject {
  type: "file" | "external";
  file?: {
    url: string;
    expiry_time?: string;
  };
  external?: {
    url: string;
  };
  name?: string;
  caption?: IRichTextContent[];
}

export interface IContentBlock {
  id: string;
  type: BlockType;
  content: IRichTextContent[];
  children?: IContentBlock[];
  checked?: boolean;
  language?: string;
  caption?: IRichTextContent[];
  url?: string;
  createdAt: Date;
  createdBy: string;
  lastEditedAt: Date;
  lastEditedBy: string;
}

// Response types
export interface IBlockResponse extends IContentBlock {}
export interface IBlockListResponse {
  blocks: IBlockResponse[];
  total: number;
  hasMore: boolean;
  nextCursor?: string;
}

// Request types
export interface ICreateBlockRequest {
  type: BlockType;
  afterBlockId?: string;
  parentId?: string;
  content: Partial<IContentBlock>;
}

export interface IUpdateBlockRequest {
  content?: Partial<IContentBlock>;
  archived?: boolean;
}

export interface IMoveBlockRequest {
  afterBlockId?: string;
  parentId?: string;
}

export interface IBulkBlockOperation {
  operation: "create" | "update" | "delete" | "move";
  blockId?: string;
  data?: ICreateBlockRequest | IUpdateBlockRequest | IMoveBlockRequest;
}

export interface IBlockSearchOptions {
  query?: string;
  types?: BlockType[];
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
