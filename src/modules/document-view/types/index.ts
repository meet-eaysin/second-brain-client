// Core types for document-view module
// These types are kept consistent with backend but defined independently

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
  defaultValues: Record<string, TPropertyValue>;
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
  properties: IDatabaseProperty[];
  views: IDatabaseView[];
  templates: IDatabaseTemplate[];
  recordCount: number;
  lastActivityAt?: Date;
  allowComments: boolean;
  allowDuplicates: boolean;
  enableVersioning: boolean;
  enableAuditLog: boolean;
  enableAutoTagging: boolean;
  enableSmartSuggestions: boolean;
  syncSettings?: Record<string, unknown>;
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

export interface IDatabaseProperty extends IBaseEntity {
  databaseId: string;
  name: string;
  type: EPropertyType;
  config: IPropertyConfig;
  isSystem: boolean;
  isVisible: boolean;
  required: boolean;
  order: number;
  description?: string;
}

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

export interface IRecord extends IBaseEntity, ISoftDelete {
  databaseId: string;
  properties: Record<string, TPropertyValue>;
  content?: IContentBlock[];
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
}

export interface IRecordQueryOptions {
  databaseId: string;
  viewId?: string;
  search?: string;
  filters?: IViewFilter[];
  sorts?: IViewSort[];
  isTemplate?: boolean;
  isFavorite?: boolean;
  isArchived?: boolean;
  page?: number;
  limit?: number;
}

export interface IRecordListResponse {
  records: IRecord[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
  view?: {
    id: string;
    name: string;
    appliedFilters: IFilterCondition[];
    appliedSorts: ISortConfig[];
  };
}

export interface ICreateRecordRequest {
  properties: Record<string, TPropertyValue>;
  content?: IContentBlock[];
  order?: number;
}

export interface IUpdateRecordRequest {
  properties?: Record<string, TPropertyValue>;
  content?: IContentBlock[];
  order?: number;
  isFavorite?: boolean;
  isArchived?: boolean;
}

export enum EViewType {
  TABLE = "table",
  BOARD = "board",
  LIST = "list",
  CALENDAR = "calendar",
  GALLERY = "gallery",
  TIMELINE = "timeline",
  GANTT = "gantt",
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
  value?: TPropertyValue;
}

export interface ISortConfig {
  propertyId: string;
  direction: "asc" | "desc";
}

export interface IViewFilter {
  propertyId: string;
  operator: EFilterOperator;
  value?: TPropertyValue;
}

export interface IViewSort {
  propertyId: string;
  direction: "asc" | "desc";
}

export interface IViewGroup {
  propertyId: string;
  hideEmpty?: boolean;
  sortGroups?: "asc" | "desc" | "manual";
}

export interface IViewSettings {
  filters: IViewFilter[];
  sorts: IViewSort[];
  groupBy?: IViewGroup;
  visibleProperties: string[];
  hiddenProperties?: string[];
  frozenColumns: string[];
  pageSize: number;
  showFilters?: boolean;
  showSearch?: boolean;
  showToolbar?: boolean;
  kanbanGroupBy?: string;
  [key: string]: unknown;
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

export interface IDatabaseView extends IBaseEntity {
  databaseId: string;
  name: string;
  type: EViewType;
  isDefault: boolean;
  isPublic: boolean;
  config: IViewConfig;
  sorts: IViewSort[];
  filters: IViewFilter[];
  order: number;
  description?: string;
  settings: IViewSettings;
}

export interface ICreateViewRequest {
  name: string;
  type: EViewType;
  description?: string;
  isDefault?: boolean;
  isPublic?: boolean;
  settings: IViewSettings;
}

export interface IUpdateViewRequest {
  name?: string;
  description?: string;
  isDefault?: boolean;
  isPublic?: boolean;
  settings?: Partial<IViewSettings>;
  sorts?: IViewSort[];
  filters?: IViewFilter[];
  order?: number;
}

// Content block types (simplified for frontend use)
export enum BlockType {
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

export interface IRichText {
  type: "text" | "mention";
  text?: { content: string; link?: { url: string } };
  annotations?: { bold?: boolean; italic?: boolean; code?: boolean };
  plain_text: string;
}

export interface IContentBlock {
  id: string;
  type: BlockType;
  content: IRichText[];
  children?: IContentBlock[];
  checked?: boolean;
  language?: string;
  url?: string;
  createdAt: Date;
  createdBy: string;
  lastEditedAt: Date;
  lastEditedBy: string;
}

// Frontend-specific type aliases for backward compatibility
export type IProperty = IDatabaseProperty;
export type IView = IDatabaseView;
export type IDatabaseRecord = IRecord;

// Legacy type aliases for backward compatibility
export type Document = IDatabase;
export type DocumentProperty = IDatabaseProperty;
export type DocumentView = IDatabaseView;
export type DocumentRecord = IDatabaseRecord;
export type DatabaseView = IDatabaseView;
export type DatabaseProperty = IDatabaseProperty;
export type DatabaseRecord = IDatabaseRecord;

// Property type enum for frontend use (uppercase for consistency)
export enum PropertyType {
  TEXT = "TEXT",
  RICH_TEXT = "RICH_TEXT",
  NUMBER = "NUMBER",
  DATE = "DATE",
  CHECKBOX = "CHECKBOX",
  URL = "URL",
  EMAIL = "EMAIL",
  PHONE = "PHONE",
  CURRENCY = "CURRENCY",
  PERCENT = "PERCENT",
  SELECT = "SELECT",
  MULTI_SELECT = "MULTI_SELECT",
  STATUS = "STATUS",
  PRIORITY = "PRIORITY",
  FILE = "FILE",
  RELATION = "RELATION",
  ROLLUP = "ROLLUP",
  CREATED_TIME = "CREATED_TIME",
  CREATED_BY = "CREATED_BY",
  LAST_EDITED_TIME = "LAST_EDITED_TIME",
  LAST_EDITED_BY = "LAST_EDITED_BY",
  MOOD_SCALE = "MOOD_SCALE",
  FREQUENCY = "FREQUENCY",
  CONTENT_TYPE = "CONTENT_TYPE",
  FINANCE_TYPE = "FINANCE_TYPE",
  FINANCE_CATEGORY = "FINANCE_CATEGORY",
  FILES = "FILES",
  LOOKUP = "LOOKUP",
}

export enum ViewType {
  TABLE = "TABLE",
  BOARD = "BOARD",
  LIST = "LIST",
  CALENDAR = "CALENDAR",
  GALLERY = "GALLERY",
  TIMELINE = "TIMELINE",
  GANTT = "GANTT",
}

export interface SelectOption {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface CreateDocumentRequest {
  name: string;
  description?: string;
  icon?: string;
  cover?: string;
  workspaceId?: string;
  isPublic?: boolean;
}

export interface UpdateDocumentRequest {
  name?: string;
  description?: string;
  icon?: string;
  cover?: string;
  isPublic?: boolean;
}

export interface CreatePropertyRequest {
  name: string;
  type: PropertyType;
  description?: string;
  required?: boolean;
  selectOptions?: Omit<SelectOption, "id">[];
  relationConfig?: Record<string, unknown>;
  order?: number;
}

export interface UpdatePropertyRequest {
  name?: string;
  description?: string;
  required?: boolean;
  selectOptions?: SelectOption[];
}

export interface CreateViewRequest {
  name: string;
  type: ViewType;
  isDefault?: boolean;
  settings: IViewSettings;
}

export interface UpdateViewRequest {
  name?: string;
  settings?: Partial<IViewSettings>;
}

export interface DocumentRecord {
  id: string;
  documentViewId: string;
  properties: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface CreateRecordRequest {
  properties: Record<string, unknown>;
}

export interface UpdateRecordRequest {
  properties: Record<string, unknown>;
}

export type PermissionLevel = "read" | "write" | "admin";

export interface DocumentPermission {
  userId: string;
  permission: PermissionLevel;
  grantedAt: string;
}

export interface ShareDocumentRequest {
  userId: string;
  permission: PermissionLevel;
}

export interface PaginatedDocumentResponse {
  documents: IDatabase[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface PaginatedRecordsResponse {
  records: IDatabaseRecord[];
  total: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  groupedData?: Record<string, IDatabaseRecord[]>;
}

export interface DocumentQueryParams {
  workspaceId?: string;
  page?: number;
  limit?: number;
  search?: string;
  ownerId?: string;
  excludeOwnerId?: string;
  isPublic?: boolean;
  sortBy?: "name" | "createdAt" | "updatedAt" | "lastAccessedAt";
  sortOrder?: "asc" | "desc";
}

export interface RecordQueryParams {
  viewId?: string;
  page?: number;
  limit?: number;
  search?: string;
  searchProperties?: string;
  groupBy?: string;
  filters?: string;
  sorts?: string;
}

// Additional types for DocumentViewContext
export interface DocumentFilter {
  propertyId: string;
  operator: EFilterOperator;
  value?: TPropertyValue;
}

export interface DocumentSort {
  propertyId: string;
  direction: "asc" | "desc";
}

export interface DocumentSchemaConfig {
  databaseId?: string;
  viewId?: string;
  pageSize?: number;
  enableSearch?: boolean;
  enableFilters?: boolean;
  enableSorting?: boolean;
  enableBulkActions?: boolean;
}

export type IPropertyQueryParams = {
    viewId: string; includeHidden: boolean
}