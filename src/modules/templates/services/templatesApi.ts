import { apiClient } from "@/services/api-client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { ApiResponse } from "@/types/api.types";

// Types
export interface Template {
  id: string;
  name: string;
  description?: string;
  category: string;
  moduleType: string;
  tags: string[];
  icon?: string;
  color?: string;
  preview?: string;
  access: "public" | "private" | "team" | "organization";
  rating?: number;
  usageCount: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTemplateRequest {
  name: string;
  description?: string;
  category: string;
  moduleType: string;
  tags?: string[];
  icon?: string;
  color?: string;
  preview?: string;
  access?: "public" | "private" | "team" | "organization";
  content: TemplateContent;
}

export interface TemplateSearchParams {
  query?: string;
  category?: string;
  moduleType?: string;
  tags?: string[];
  access?: "public" | "private" | "team" | "organization";
  sortBy?: "name" | "rating" | "usageCount" | "createdAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface ApplyDatabaseTemplateRequest {
  workspaceId: string;
  overrides?: {
    name?: string;
    description?: string;
  };
}

// API Service
export const templatesApi = {
  // Get all templates
  getTemplates: async (params?: TemplateSearchParams) => {
    const response = await apiClient.get<
      ApiResponse<{
        templates: Template[];
        total: number;
        page: number;
        limit: number;
        hasNext: boolean;
        hasPrev: boolean;
      }>
    >(API_ENDPOINTS.TEMPLATES.LIST, { params });
    return response.data;
  },

  // Get featured templates
  getFeaturedTemplates: async () => {
    const response = await apiClient.get<ApiResponse<Template[]>>(
      API_ENDPOINTS.TEMPLATES.FEATURED
    );
    return response.data;
  },

  // Get official templates
  getOfficialTemplates: async () => {
    const response = await apiClient.get<ApiResponse<Template[]>>(
      API_ENDPOINTS.TEMPLATES.OFFICIAL
    );
    return response.data;
  },

  // Get popular templates
  getPopularTemplates: async () => {
    const response = await apiClient.get<ApiResponse<Template[]>>(
      API_ENDPOINTS.TEMPLATES.POPULAR
    );
    return response.data;
  },

  // Get templates by category
  getTemplatesByCategory: async (category: string) => {
    const response = await apiClient.get<ApiResponse<Template[]>>(
      API_ENDPOINTS.TEMPLATES.BY_CATEGORY(category)
    );
    return response.data;
  },

  // Get templates by module
  getTemplatesByModule: async (moduleType: string) => {
    const response = await apiClient.get<ApiResponse<Template[]>>(
      API_ENDPOINTS.TEMPLATES.BY_MODULE(moduleType)
    );
    return response.data;
  },

  // Get template by ID
  getTemplate: async (templateId: string) => {
    const response = await apiClient.get<ApiResponse<Template>>(
      API_ENDPOINTS.TEMPLATES.BY_ID(templateId)
    );
    return response.data;
  },

  // Search templates
  searchTemplates: async (params: TemplateSearchParams) => {
    const response = await apiClient.get<ApiResponse<Template[]>>(
      API_ENDPOINTS.TEMPLATES.SEARCH,
      { params }
    );
    return response.data;
  },

  // Create template
  createTemplate: async (data: CreateTemplateRequest) => {
    const response = await apiClient.post<ApiResponse<Template>>(
      API_ENDPOINTS.TEMPLATES.CREATE,
      data
    );
    return response.data;
  },

  // Update template
  updateTemplate: async (
    templateId: string,
    data: Partial<CreateTemplateRequest>
  ) => {
    const response = await apiClient.put<ApiResponse<Template>>(
      API_ENDPOINTS.TEMPLATES.UPDATE(templateId),
      data
    );
    return response.data;
  },

  // Delete template
  deleteTemplate: async (templateId: string) => {
    const response = await apiClient.delete<ApiResponse<null>>(
      API_ENDPOINTS.TEMPLATES.DELETE(templateId)
    );
    return response.data;
  },

  // Apply template to create database
  applyDatabaseTemplate: async (
    templateId: string,
    data: ApplyDatabaseTemplateRequest
  ) => {
    const response = await apiClient.post<
      ApiResponse<{ databaseId: string; message: string }>
    >(API_ENDPOINTS.TEMPLATES.APPLY_DATABASE(templateId), data);
    return response.data;
  },

  // Rate template
  rateTemplate: async (templateId: string, rating: number) => {
    const response = await apiClient.post<ApiResponse<null>>(
      API_ENDPOINTS.TEMPLATES.RATE(templateId),
      { rating }
    );
    return response.data;
  },

  // Get template analytics
  getTemplateAnalytics: async (templateId: string) => {
    const response = await apiClient.get<
      ApiResponse<{
        usageCount: number;
        rating: number;
        ratingsCount: number;
        recentUsage: Date[];
      }>
    >(API_ENDPOINTS.TEMPLATES.ANALYTICS(templateId));
    return response.data;
  },

  // Get user templates
  getUserTemplates: async () => {
    const response = await apiClient.get<ApiResponse<Template[]>>(
      API_ENDPOINTS.TEMPLATES.USER_TEMPLATES
    );
    return response.data;
  },

  // Get user template history
  getUserTemplateHistory: async (limit?: number) => {
    const response = await apiClient.get<
      ApiResponse<
        {
          templateId: string;
          templateName: string;
          appliedAt: Date;
          result: "success" | "failed";
        }[]
      >
    >(API_ENDPOINTS.TEMPLATES.USER_HISTORY, { params: { limit } });
    return response.data;
  },

  // Get template suggestions for database
  getTemplateSuggestions: async (databaseId: string) => {
    const response = await apiClient.get<ApiResponse<Template[]>>(
      API_ENDPOINTS.TEMPLATES.SUGGESTIONS(databaseId)
    );
    return response.data;
  },

  // Duplicate template
  duplicateTemplate: async (
    templateId: string,
    data?: { name?: string; description?: string }
  ) => {
    const response = await apiClient.post<ApiResponse<Template>>(
      API_ENDPOINTS.TEMPLATES.DUPLICATE(templateId),
      data
    );
    return response.data;
  },

  // Export template
  exportTemplate: async (templateId: string) => {
    const response = await apiClient.get<
      ApiResponse<{
        template: Template;
        exportedAt: Date;
        version: string;
      }>
    >(API_ENDPOINTS.TEMPLATES.EXPORT(templateId));
    return response.data;
  },

  // Import template
  importTemplate: async (data: CreateTemplateRequest) => {
    const response = await apiClient.post<ApiResponse<Template>>(
      API_ENDPOINTS.TEMPLATES.IMPORT,
      data
    );
    return response.data;
  },

  // Get template categories
  getTemplateCategories: async () => {
    const response = await apiClient.get<ApiResponse<string[]>>(
      API_ENDPOINTS.TEMPLATES.CATEGORIES
    );
    return response.data;
  },

  // Get template types
  getTemplateTypes: async () => {
    const response = await apiClient.get<ApiResponse<string[]>>(
      API_ENDPOINTS.TEMPLATES.TYPES
    );
    return response.data;
  },

  // Get template gallery
  getTemplateGallery: async () => {
    const response = await apiClient.get<ApiResponse<Template[]>>(
      API_ENDPOINTS.TEMPLATES.GALLERY
    );
    return response.data;
  },
};
