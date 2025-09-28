import { apiClient } from "@/services/api-client.ts";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
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
  type IParaCategorizeRequest,
  EParaReviewFrequency,
} from "@/modules/para/types/para.types";
import {
  EParaCategory,
  EParaStatus,
  EParaPriority,
} from "@/modules/para/types/para.types";

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

// PARA API Service
export const paraApi = {
  // ===== PARA ITEM CRUD OPERATIONS =====

  // Create a new PARA item
  createParaItem: async (
    data: ICreateParaItemRequest
  ): Promise<IParaItem | IParaArea | IParaArchive> => {
    const response = await apiClient.post<ApiResponse<IParaItem>>(
      "/para",
      data
    );
    return response.data.data;
  },

  // Get PARA items with optional filtering
  getParaItems: async (
    params?: IParaQueryParams
  ): Promise<(IParaItem | IParaArea | IParaArchive)[]> => {
    const response = await apiClient.get<ApiResponse<IParaItem[]>>("/para", {
      params,
    });
    return response.data.data;
  },

  // Get a single PARA item by ID
  getParaItemById: async (
    id: string
  ): Promise<IParaItem | IParaArea | IParaArchive> => {
    return apiCallWithFallback(
      () =>
        apiClient
          .get<ApiResponse<IParaItem>>(`/para/${id}`)
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
          .put<ApiResponse<IParaItem>>(`/para/${id}`, data)
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
          .delete<ApiResponse<void>>(`/para/${id}`)
          .then((res) => res.data.data),
      undefined
    );
  },

  // Get PARA statistics
  getParaStats: async (params?: IParaQueryParams): Promise<IParaStats> => {
    const response = await apiClient.get<ApiResponse<IParaStats>>(
      API_ENDPOINTS.PARA.STATS,
      { params }
    );
    return response.data.data;
  },

  // Search PARA items
  searchParaItems: async (
    query: string,
    params?: IParaQueryParams
  ): Promise<IParaItem[]> => {
    return apiCallWithFallback(
      () =>
        apiClient
          .get<ApiResponse<IParaItem[]>>("/para/search", {
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
          .get<ApiResponse<IParaItem[]>>("/para/categories/projects", {
            params,
          })
          .then((res) => res.data.data),
      mockParaItems.filter((item) => item.category === EParaCategory.PROJECTS)
    );
  },

  // Get areas
  getAreas: async (params?: IParaQueryParams): Promise<IParaItem[]> => {
    return apiCallWithFallback(
      () =>
        apiClient
          .get<ApiResponse<IParaItem[]>>("/para/categories/areas", { params })
          .then((res) => res.data.data),
      mockParaItems.filter((item) => item.category === EParaCategory.AREAS)
    );
  },

  // Get resources
  getResources: async (params?: IParaQueryParams): Promise<IParaItem[]> => {
    return apiCallWithFallback(
      () =>
        apiClient
          .get<ApiResponse<IParaItem[]>>("/para/categories/resources", {
            params,
          })
          .then((res) => res.data.data),
      mockParaItems.filter((item) => item.category === EParaCategory.RESOURCES)
    );
  },

  // Get archive
  getArchive: async (params?: IParaQueryParams): Promise<IParaItem[]> => {
    return apiCallWithFallback(
      () =>
        apiClient
          .get<ApiResponse<IParaItem[]>>("/para/categories/archive", { params })
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
          .get<ApiResponse<IParaItem[]>>(`/para/status/${status}`, { params })
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
          .get<ApiResponse<IParaItem[]>>(`/para/priority/${priority}`, {
            params,
          })
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
          .get<ApiResponse<IParaItem[]>>("/para/reviews/overdue", {
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
            "/para/archive",
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
            "/para/restore",
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
            "/para/categorize",
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
          .post<ApiResponse<IParaItem>>(`/para/${id}/review`, {
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
