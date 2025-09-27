import { apiClient } from "@/services/api-client.ts";
import type { ApiResponse } from "@/types/api.types";
import {
  type IParaItem,
  type IParaArea,
  type IParaArchive,
  type IParaStats,
  type ICreateParaItemRequest,
  type IUpdateParaItemRequest,
  type IParaQueryParams,
  type IMoveToArchiveRequest,
  type IRestoreFromArchiveRequest,
  type IParaCategorizeRequest, EParaReviewFrequency,
} from "@/modules/para/types/para.types";
import { EParaCategory, EParaStatus, EParaPriority } from "@/modules/para/types/para.types";

const mockParaItems: (IParaItem | IParaArea)[] = [
  {
    id: "1",
    databaseId: "db1",
    category: EParaCategory.PROJECTS,
    title: "Website Redesign",
    description: "Complete redesign of company website",
    status: EParaStatus.ACTIVE,
    priority: EParaPriority.HIGH,
    linkedProjectIds: [],
    linkedResourceIds: [],
    linkedTaskIds: [],
    linkedNoteIds: [],
    linkedGoalIds: [],
    linkedPeopleIds: [],
    reviewFrequency: EParaReviewFrequency.WEEKLY,
    tags: ["web", "design"],
    childAreaIds: [],
    completionPercentage: 65,
    timeSpentMinutes: 1200,
    isTemplate: false,
    isPublic: false,
    notificationSettings: {
      reviewReminders: true,
      statusUpdates: true,
      completionAlerts: true,
    },
    customFields: {},
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "user1",
    updatedBy: "user1",
  },
  {
    id: "2",
    databaseId: "db1",
    category: EParaCategory.AREAS,
    title: "Professional Development",
    description: "Ongoing professional growth and learning",
    status: EParaStatus.ACTIVE,
    priority: EParaPriority.MEDIUM,
    linkedProjectIds: [],
    linkedResourceIds: [],
    linkedTaskIds: [],
    linkedNoteIds: [],
    linkedGoalIds: [],
    linkedPeopleIds: [],
    reviewFrequency: "quarterly",
    tags: ["career", "learning"],
    parentAreaId: undefined,
    childAreaIds: [],
    completionPercentage: 0,
    timeSpentMinutes: 0,
    isTemplate: false,
    isPublic: false,
    notificationSettings: {
      reviewReminders: true,
      statusUpdates: true,
      completionAlerts: true,
    },
    customFields: {},
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "user1",
    updatedBy: "user1",
    areaType: "professional",
    maintenanceLevel: "medium",
    standardsOfExcellence: [
      "Stay updated with industry trends",
      "Complete 2 courses per quarter",
    ],
    currentChallenges: [],
    keyMetrics: [],
    isResponsibilityArea: true,
    stakeholders: [],
    maintenanceActions: [],
  } as IParaArea,
];

const mockParaStats: IParaStats = {
  totalItems: 24,
  byCategory: {
    [EParaCategory.PROJECTS]: 8,
    [EParaCategory.AREAS]: 6,
    [EParaCategory.RESOURCES]: 7,
    [EParaCategory.ARCHIVE]: 3,
  },
  byStatus: {
    [EParaStatus.ACTIVE]: {
      [EParaCategory.PROJECTS]: 6,
      [EParaCategory.AREAS]: 5,
      [EParaCategory.RESOURCES]: 5,
      [EParaCategory.ARCHIVE]: 0,
    },
    [EParaStatus.INACTIVE]: {
      [EParaCategory.PROJECTS]: 1,
      [EParaCategory.AREAS]: 1,
      [EParaCategory.RESOURCES]: 0,
      [EParaCategory.ARCHIVE]: 0,
    },
    [EParaStatus.COMPLETED]: {
      [EParaCategory.PROJECTS]: 1,
      [EParaCategory.AREAS]: 0,
      [EParaCategory.RESOURCES]: 1,
      [EParaCategory.ARCHIVE]: 0,
    },
    [EParaStatus.ON_HOLD]: {
      [EParaCategory.PROJECTS]: 0,
      [EParaCategory.AREAS]: 0,
      [EParaCategory.RESOURCES]: 1,
      [EParaCategory.ARCHIVE]: 0,
    },
    [EParaStatus.ARCHIVED]: {
      [EParaCategory.PROJECTS]: 0,
      [EParaCategory.AREAS]: 0,
      [EParaCategory.RESOURCES]: 0,
      [EParaCategory.ARCHIVE]: 1,
    },
  },
  byPriority: {
    [EParaPriority.LOW]: 5,
    [EParaPriority.MEDIUM]: 12,
    [EParaPriority.HIGH]: 6,
    [EParaPriority.CRITICAL]: 1,
  },
  areas: {
    total: 6,
    byType: {
      professional: 3,
      personal: 2,
      health: 1,
    },
    maintenanceOverdue: 2,
    reviewsOverdue: 1,
  },
  archives: {
    total: 3,
    byOriginalCategory: {
      [EParaCategory.PROJECTS]: 1,
      [EParaCategory.AREAS]: 1,
      [EParaCategory.RESOURCES]: 1,
      [EParaCategory.ARCHIVE]: 0,
    },
    byArchiveReason: {
      completed: 2,
      no_longer_relevant: 1,
    },
    recentlyArchived: 1,
  },
  linkedItems: {
    projects: 12,
    resources: 8,
    tasks: 15,
    notes: 6,
    goals: 4,
    people: 3,
  },
  reviewsOverdue: 3,
  reviewsDueThisWeek: 5,
  completionRates: {
    projects: 75,
    areas: 60,
  },
  recentlyCreated: [
    {
      id: "recent1",
      title: "Mobile App Development",
      category: EParaCategory.PROJECTS,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: "recent2",
      title: "Health & Fitness Tracking",
      category: EParaCategory.AREAS,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  ],
  recentlyArchived: [
    {
      id: "archived1",
      title: "Old Marketing Campaign",
      originalCategory: EParaCategory.PROJECTS,
      archivedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  ],
};

// Helper function to handle API calls with fallback to mock data
const apiCallWithFallback = async (
  apiCall: () => Promise<any>,
  fallbackData: any
) => {
  try {
    const response = await apiCall();
    return response;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("🔄 PARA API call failed, using mock data:", error);
      console.warn(
        "📍 This suggests the server endpoint may not be implemented yet"
      );
      return fallbackData;
    }
    throw error;
  }
};

// PARA API Service
export const paraApi = {
  // ===== PARA ITEM CRUD OPERATIONS =====

  // Create a new PARA item
  createParaItem: async (
    data: ICreateParaItemRequest
  ): Promise<IParaItem | IParaArea | IParaArchive> => {
    return apiCallWithFallback(
      () =>
        apiClient
          .post<ApiResponse<IParaItem>>("/second-brain/para", data)
          .then((res) => res.data.data),
      {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "user1",
        updatedBy: "user1",
      }
    );
  },

  // Get PARA items with optional filtering
  getParaItems: async (
    params?: IParaQueryParams
  ): Promise<(IParaItem | IParaArea | IParaArchive)[]> => {
    return apiCallWithFallback(
      () =>
        apiClient
          .get<ApiResponse<IParaItem[]>>("/second-brain/para", { params })
          .then((res) => res.data.data),
      mockParaItems
    );
  },

  // Get a single PARA item by ID
  getParaItemById: async (
    id: string
  ): Promise<IParaItem | IParaArea | IParaArchive> => {
    return apiCallWithFallback(
      () =>
        apiClient
          .get<ApiResponse<IParaItem>>(`/second-brain/para/${id}`)
          .then((res) => res.data.data),
      mockParaItems.find((item) => item.id === id) || mockParaItems[0]
    );
  },

  // Update a PARA item
  updateParaItem: async (
    id: string,
    data: IUpdateParaItemRequest
  ): Promise<IParaItem | IParaArea | IParaArchive> => {
    return apiCallWithFallback(
      () =>
        apiClient
          .put<ApiResponse<IParaItem>>(`/second-brain/para/${id}`, data)
          .then((res) => res.data.data),
      {
        ...mockParaItems.find((item) => item.id === id),
        ...data,
        updatedAt: new Date(),
        updatedBy: "user1",
      }
    );
  },

  // Delete a PARA item
  deleteParaItem: async (id: string): Promise<void> => {
    return apiCallWithFallback(
      () =>
        apiClient
          .delete<ApiResponse<void>>(`/second-brain/para/${id}`)
          .then((res) => res.data.data),
      undefined
    );
  },

  // Get PARA statistics
  getParaStats: async (params?: IParaQueryParams): Promise<IParaStats> => {
    return apiCallWithFallback(
      () =>
        apiClient
          .get<ApiResponse<IParaStats>>("/second-brain/para/stats", { params })
          .then((res) => res.data.data),
      mockParaStats
    );
  },

  // Search PARA items
  searchParaItems: async (
    query: string,
    params?: IParaQueryParams
  ): Promise<IParaItem[]> => {
    return apiCallWithFallback(
      () =>
        apiClient
          .get<ApiResponse<IParaItem[]>>("/second-brain/para/search", {
            params: { ...params, query },
          })
          .then((res) => res.data.data),
      mockParaItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description?.toLowerCase().includes(query.toLowerCase())
      )
    );
  },

  // ===== PARA CATEGORIES =====

  // Get projects
  getProjects: async (params?: IParaQueryParams): Promise<IParaItem[]> => {
    return apiCallWithFallback(
      () =>
        apiClient
          .get<ApiResponse<IParaItem[]>>(
            "/second-brain/para/categories/projects",
            { params }
          )
          .then((res) => res.data.data),
      mockParaItems.filter((item) => item.category === EParaCategory.PROJECTS)
    );
  },

  // Get areas
  getAreas: async (params?: IParaQueryParams): Promise<IParaItem[]> => {
    return apiCallWithFallback(
      () =>
        apiClient
          .get<ApiResponse<IParaItem[]>>(
            "/second-brain/para/categories/areas",
            { params }
          )
          .then((res) => res.data.data),
      mockParaItems.filter((item) => item.category === EParaCategory.AREAS)
    );
  },

  // Get resources
  getResources: async (params?: IParaQueryParams): Promise<IParaItem[]> => {
    return apiCallWithFallback(
      () =>
        apiClient
          .get<ApiResponse<IParaItem[]>>(
            "/second-brain/para/categories/resources",
            { params }
          )
          .then((res) => res.data.data),
      mockParaItems.filter((item) => item.category === EParaCategory.RESOURCES)
    );
  },

  // Get archive
  getArchive: async (params?: IParaQueryParams): Promise<IParaItem[]> => {
    return apiCallWithFallback(
      () =>
        apiClient
          .get<ApiResponse<IParaItem[]>>(
            "/second-brain/para/categories/archive",
            { params }
          )
          .then((res) => res.data.data),
      mockParaItems.filter((item) => item.category === EParaCategory.ARCHIVE)
    );
  },

  // ===== PARA ANALYTICS =====

  // Get items by status
  getItemsByStatus: async (
    status: EParaStatus,
    params?: IParaQueryParams
  ): Promise<IParaItem[]> => {
    return apiCallWithFallback(
      () =>
        apiClient
          .get<ApiResponse<IParaItem[]>>(
            `/second-brain/para/status/${status}`,
            { params }
          )
          .then((res) => res.data.data),
      mockParaItems.filter((item) => item.status === status)
    );
  },

  // Get items by priority
  getItemsByPriority: async (
    priority: EParaPriority,
    params?: IParaQueryParams
  ): Promise<IParaItem[]> => {
    return apiCallWithFallback(
      () =>
        apiClient
          .get<ApiResponse<IParaItem[]>>(
            `/second-brain/para/priority/${priority}`,
            { params }
          )
          .then((res) => res.data.data),
      mockParaItems.filter((item) => item.priority === priority)
    );
  },

  // Get reviews overdue
  getReviewsOverdue: async (
    params?: IParaQueryParams
  ): Promise<IParaItem[]> => {
    return apiCallWithFallback(
      () =>
        apiClient
          .get<ApiResponse<IParaItem[]>>("/second-brain/para/reviews/overdue", {
            params,
          })
          .then((res) => res.data.data),
      []
    );
  },

  // ===== PARA ACTIONS =====

  // Move items to archive
  moveToArchive: async (
    data: IMoveToArchiveRequest
  ): Promise<{ message: string; archivedCount: number }> => {
    return apiCallWithFallback(
      () =>
        apiClient
          .post<ApiResponse<{ message: string; archivedCount: number }>>(
            "/second-brain/para/archive",
            data
          )
          .then((res) => res.data.data),
      {
        message: "Items moved to archive successfully",
        archivedCount: data.itemIds.length,
      }
    );
  },

  // Restore items from archive
  restoreFromArchive: async (
    data: IRestoreFromArchiveRequest
  ): Promise<{ message: string; restoredCount: number }> => {
    return apiCallWithFallback(
      () =>
        apiClient
          .post<ApiResponse<{ message: string; restoredCount: number }>>(
            "/second-brain/para/restore",
            data
          )
          .then((res) => res.data.data),
      {
        message: "Items restored from archive successfully",
        restoredCount: data.itemIds.length,
      }
    );
  },

  // Categorize existing items
  categorizeExistingItem: async (
    data: IParaCategorizeRequest
  ): Promise<
    | { message: string; paraItemId: string }
    | { message: string; paraItem: IParaItem | IParaArea | IParaArchive }
  > => {
    return apiCallWithFallback(
      () =>
        apiClient
          .post<ApiResponse<{ message: string; paraItemId: string }>>(
            "/second-brain/para/categorize",
            data
          )
          .then((res) => res.data.data),
      {
        message: "Item categorized successfully",
        paraItemId: Date.now().toString(),
      }
    );
  },

  // Mark item as reviewed
  markReviewed: async (
    id: string,
    notes?: string
  ): Promise<IParaItem | IParaArea | IParaArchive> => {
    return apiCallWithFallback(
      () =>
        apiClient
          .post<ApiResponse<IParaItem>>(`/second-brain/para/${id}/review`, {
            notes,
          })
          .then((res) => res.data.data),
      {
        ...mockParaItems.find((item) => item.id === id),
        lastReviewedAt: new Date(),
        updatedAt: new Date(),
      }
    );
  },
};
