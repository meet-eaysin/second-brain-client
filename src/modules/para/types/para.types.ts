// PARA Method types based on backend implementation
// PARA = Projects, Areas, Resources, Archive

// Enums matching backend
export enum EParaCategory {
  PROJECTS = "projects",
  AREAS = "areas",
  RESOURCES = "resources",
  ARCHIVE = "archive",
}

export enum EParaStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  COMPLETED = "completed",
  ON_HOLD = "on_hold",
  ARCHIVED = "archived",
}

export enum EParaPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export enum EParaReviewFrequency {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  QUARTERLY = "quarterly",
  YEARLY = "yearly",
  NEVER = "never",
}

// Base PARA item interface matching backend
export interface IParaItem {
  id: string;
  databaseId: string;
  category: EParaCategory;
  title: string;
  description?: string;
  status: EParaStatus;
  priority: EParaPriority;
  linkedProjectIds: string[];
  linkedResourceIds: string[];
  linkedTaskIds: string[];
  linkedNoteIds: string[];
  linkedGoalIds: string[];
  linkedPeopleIds: string[];
  reviewFrequency: EParaReviewFrequency;
  lastReviewedAt?: Date;
  nextReviewDate?: Date;
  tags: string[];
  parentAreaId?: string;
  childAreaIds: string[];
  createdFromCategory?: EParaCategory;
  archivedFromCategory?: EParaCategory;
  archiveReason?: string;
  completionPercentage: number;
  timeSpentMinutes: number;
  isTemplate: boolean;
  isPublic: boolean;
  notificationSettings: {
    reviewReminders: boolean;
    statusUpdates: boolean;
    completionAlerts: boolean;
  };
  customFields: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

// PARA Area interface extending base
export interface IParaArea extends IParaItem {
  category: EParaCategory.AREAS;
  areaType:
    | "personal"
    | "professional"
    | "health"
    | "finance"
    | "learning"
    | "relationships"
    | "other";
  maintenanceLevel: "low" | "medium" | "high";
  standardsOfExcellence: string[];
  currentChallenges: string[];
  keyMetrics: Array<{
    name: string;
    currentValue: number;
    targetValue: number;
    unit: string;
  }>;
  isResponsibilityArea: boolean;
  stakeholders: string[];
  maintenanceActions: Array<{
    id: string;
    action: string;
    frequency: EParaReviewFrequency;
    lastCompleted?: Date;
    nextDue?: Date;
  }>;
}

// PARA Archive interface extending base
export interface IParaArchive extends IParaItem {
  category: EParaCategory.ARCHIVE;
  originalCategory: EParaCategory;
  archivedAt: Date;
  archivedBy: string;
  archiveReason:
    | "completed"
    | "no_longer_relevant"
    | "superseded"
    | "failed"
    | "other";
  archiveNotes?: string;
  retentionPolicy: "permanent" | "temporary";
  deleteAfterDate?: Date;
  originalData: Record<string, any>;
  relatedArchiveIds: string[];
}

// PARA statistics interface matching backend
export interface IParaStats {
  totalItems: number;
  byCategory: Record<EParaCategory, number>;
  byStatus: Record<EParaStatus, number>;
  byPriority: Record<EParaPriority, number>;
  areas: {
    total: number;
    byType: Record<string, number>;
    maintenanceOverdue: number;
    reviewsOverdue: number;
  };
  archives: {
    total: number;
    byOriginalCategory: Record<EParaCategory, number>;
    byArchiveReason: Record<string, number>;
    recentlyArchived: number;
  };
  linkedItems: {
    projects: number;
    resources: number;
    tasks: number;
    notes: number;
    goals: number;
    people: number;
  };
  reviewsOverdue: number;
  reviewsDueThisWeek: number;
  completionRates: {
    projects: number;
    areas: number;
  };
  recentlyCreated: Array<{
    id: string;
    title: string;
    category: EParaCategory;
    createdAt: Date;
  }>;
  recentlyArchived: Array<{
    id: string;
    title: string;
    originalCategory: EParaCategory;
    archivedAt: Date;
  }>;
}

// Request/Response interfaces
export interface ICreateParaItemRequest {
  databaseId: string;
  category: EParaCategory;
  title: string;
  description?: string;
  priority?: EParaPriority;
  linkedProjectIds?: string[];
  linkedResourceIds?: string[];
  linkedTaskIds?: string[];
  linkedNoteIds?: string[];
  linkedGoalIds?: string[];
  linkedPeopleIds?: string[];
  reviewFrequency?: EParaReviewFrequency;
  tags?: string[];
  parentAreaId?: string;
  customFields?: Record<string, any>;
  areaType?:
    | "personal"
    | "professional"
    | "health"
    | "finance"
    | "learning"
    | "relationships"
    | "other";
  maintenanceLevel?: "low" | "medium" | "high";
  standardsOfExcellence?: string[];
  isResponsibilityArea?: boolean;
  stakeholders?: string[];
  originalCategory?: EParaCategory;
  archiveReason?:
    | "completed"
    | "no_longer_relevant"
    | "superseded"
    | "failed"
    | "other";
  archiveNotes?: string;
  retentionPolicy?: "permanent" | "temporary";
  deleteAfterDate?: Date;
  isTemplate?: boolean;
  isPublic?: boolean;
  notificationSettings?: {
    reviewReminders?: boolean;
    statusUpdates?: boolean;
    completionAlerts?: boolean;
  };
}

export interface IUpdateParaItemRequest {
  title?: string;
  description?: string;
  status?: EParaStatus;
  priority?: EParaPriority;
  linkedProjectIds?: string[];
  linkedResourceIds?: string[];
  linkedTaskIds?: string[];
  linkedNoteIds?: string[];
  linkedGoalIds?: string[];
  linkedPeopleIds?: string[];
  reviewFrequency?: EParaReviewFrequency;
  tags?: string[];
  parentAreaId?: string;
  completionPercentage?: number;
  customFields?: Record<string, any>;
  areaType?:
    | "personal"
    | "professional"
    | "health"
    | "finance"
    | "learning"
    | "relationships"
    | "other";
  maintenanceLevel?: "low" | "medium" | "high";
  standardsOfExcellence?: string[];
  currentChallenges?: string[];
  isResponsibilityArea?: boolean;
  stakeholders?: string[];
  isTemplate?: boolean;
  isPublic?: boolean;
  notificationSettings?: {
    reviewReminders?: boolean;
    statusUpdates?: boolean;
    completionAlerts?: boolean;
  };
}

export interface IParaQueryParams {
  databaseId?: string;
  category?: EParaCategory[];
  status?: EParaStatus[];
  priority?: EParaPriority[];
  tags?: string[];
  search?: string;
  parentAreaId?: string;
  linkedProjectId?: string;
  linkedResourceId?: string;
  linkedTaskId?: string;
  linkedNoteId?: string;
  linkedGoalId?: string;
  linkedPersonId?: string;
  reviewOverdue?: boolean;
  maintenanceOverdue?: boolean;
  isTemplate?: boolean;
  isPublic?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
  lastReviewedBefore?: Date;
  sortBy?: "title" | "createdAt" | "updatedAt" | "priority" | "nextReviewDate";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

// Legacy type aliases for backward compatibility
export type ParaProject = IParaItem & { category: EParaCategory.PROJECTS };
export type ParaArea = IParaArea;
export type ParaResource = IParaItem & { category: EParaCategory.RESOURCES };
export type ParaArchiveItem = IParaArchive;
export type ParaStats = IParaStats;
export type ParaFilters = IParaQueryParams;
export type ParaContextValue = {
  items: IParaItem[];
  stats: IParaStats;
  filters: IParaQueryParams;
  isLoading: boolean;
  error: string | null;
  setFilters: (filters: IParaQueryParams) => void;
  refreshData: () => Promise<void>;
};
