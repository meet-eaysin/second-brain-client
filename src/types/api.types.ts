/**
 * Comprehensive API Type Definitions
 *
 * This file contains all the proper TypeScript types to replace 'any' types
 * throughout the codebase for better type safety.
 */

// Core API Response Types
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: PaginationMeta;
  timestamp: string;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
  path?: string;
  method?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  filter?: Record<string, unknown>;
}

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  archivedAt?: string;
}

export interface SelectOption {
  value: string;
  label: string;
  color?: string;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Database and Property Types
export interface DatabaseProperty {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'checkbox' | 'url' | 'email' | 'phone' | 'rich_text';
  required: boolean;
  order: number;
  width?: number;
  isVisible: boolean;
  frozen: boolean;
  options?: PropertyOption[];
  defaultValue?: string | number | boolean;
  validation?: PropertyValidation;
}

export interface PropertyOption {
  value: string;
  label: string;
  color?: string;
}

export interface PropertyValidation {
  min?: number;
  max?: number;
  pattern?: string;
  required?: boolean;
}

export interface PermissionConfig {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canShare: boolean;
  canExport: boolean;
  canImport: boolean;
}

// Filter and Sort Types
export interface FilterConfig {
  propertyId: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'starts_with' | 'ends_with' | 'is_empty' | 'is_not_empty' | 'greater_than' | 'less_than' | 'greater_than_or_equal' | 'less_than_or_equal';
  value: string | number | boolean | string[];
  condition?: 'and' | 'or';
}

export interface SortConfig {
  propertyId: string;
  direction: 'asc' | 'desc';
  order: number;
}

export interface ViewConfig {
  filters?: FilterConfig[];
  sorts?: SortConfig[];
  groupBy?: string;
  visibleProperties?: string[];
  hiddenProperties?: string[];
}

// Record Types
export interface RecordData extends BaseEntity {
  [key: string]: unknown;
}

// Books Module Types
export interface BookRecord extends BaseEntity {
  title: string;
  author?: string;
  isbn?: string;
  genre?: string[];
  status: 'want_to_read' | 'reading' | 'completed' | 'paused' | 'abandoned';
  rating?: number;
  pages?: number;
  currentPage?: number;
  dateStarted?: string;
  dateCompleted?: string;
  notes?: string;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high';
  area?: string;
  source?: string;
  format?: 'physical' | 'ebook' | 'audiobook';
  isFavorite?: boolean;
  review?: string;
}

export interface BooksResponse {
  books: BookRecord[];
  pagination: PaginationMeta;
}

export interface ReadingGoalProgress {
  year: number;
  target: number;
  completed: number;
  progress: number;
  booksRead: BookRecord[];
  remainingBooks: number;
  averageBooksPerMonth: number;
  projectedCompletion: string;
}

// Import/Export Types
export interface ImportResult {
  importedCount: number;
  skippedCount?: number;
  errors?: ImportError[];
}

export interface ImportError {
  row: number;
  field?: string;
  message: string;
  data?: Record<string, unknown>;
}

// Bulk Operation Types
export interface BulkUpdateRequest<T = Record<string, unknown>> {
  recordIds: string[];
  updates: Partial<T>;
}

export interface BulkDeleteRequest {
  recordIds: string[];
  permanent?: boolean;
}

export interface BulkResult {
  modifiedCount?: number;
  deletedCount?: number;
  errors?: BulkError[];
}

export interface BulkError {
  recordId: string;
  message: string;
  field?: string;
}

// Statistics and Analytics Types
export interface ModuleStats {
  totalRecords: number;
  activeRecords: number;
  archivedRecords: number;
  recentActivity: number;
  categoryBreakdown: CategoryStat[];
  statusBreakdown: StatusStat[];
}

export interface CategoryStat {
  category: string;
  count: number;
  percentage: number;
}

export interface StatusStat {
  status: string;
  count: number;
  percentage: number;
}

export interface AnalyticsTrend {
  period: string;
  value: number;
  change?: number;
  changePercentage?: number;
}

export interface ModuleAnalytics {
  trends: AnalyticsTrend[];
  summary: {
    currentPeriod: number;
    previousPeriod: number;
    growth: number;
    growthPercentage: number;
  };
  topCategories: CategoryStat[];
  recentActivity: ActivityStat[];
}

export interface ActivityStat {
  date: string;
  action: 'created' | 'updated' | 'deleted' | 'archived';
  count: number;
}
