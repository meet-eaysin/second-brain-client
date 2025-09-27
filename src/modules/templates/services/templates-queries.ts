import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { templatesApi } from "./templates-api.ts";
import type {
  CreateTemplateRequest,
  TemplateSearchParams,
} from "./templates-api.ts";

// Query keys
export const templateKeys = {
  all: ["templates"] as const,
  lists: () => [...templateKeys.all, "list"] as const,
  list: (params: TemplateSearchParams) =>
    [...templateKeys.lists(), params] as const,
  featured: () => [...templateKeys.all, "featured"] as const,
  official: () => [...templateKeys.all, "official"] as const,
  popular: () => [...templateKeys.all, "popular"] as const,
  categories: () => [...templateKeys.all, "categories"] as const,
  types: () => [...templateKeys.all, "types"] as const,
  gallery: () => [...templateKeys.all, "gallery"] as const,
  byCategory: (category: string) =>
    [...templateKeys.all, "category", category] as const,
  byModule: (moduleType: string) =>
    [...templateKeys.all, "module", moduleType] as const,
  details: () => [...templateKeys.all, "detail"] as const,
  detail: (id: string) => [...templateKeys.details(), id] as const,
  userTemplates: () => [...templateKeys.all, "user"] as const,
  userHistory: () => [...templateKeys.all, "user", "history"] as const,
  suggestions: (databaseId: string) =>
    [...templateKeys.all, "suggestions", databaseId] as const,
  analytics: (id: string) => [...templateKeys.all, "analytics", id] as const,
};

// Queries
export const useTemplates = (params?: TemplateSearchParams) => {
  return useQuery({
    queryKey: templateKeys.list(params || {}),
    queryFn: () => templatesApi.getTemplates(params),
  });
};

export const useFeaturedTemplates = () => {
  return useQuery({
    queryKey: templateKeys.featured(),
    queryFn: () => templatesApi.getFeaturedTemplates(),
  });
};

export const useOfficialTemplates = () => {
  return useQuery({
    queryKey: templateKeys.official(),
    queryFn: () => templatesApi.getOfficialTemplates(),
  });
};

export const usePopularTemplates = () => {
  return useQuery({
    queryKey: templateKeys.popular(),
    queryFn: () => templatesApi.getPopularTemplates(),
  });
};

export const useTemplatesByCategory = (category: string) => {
  return useQuery({
    queryKey: templateKeys.byCategory(category),
    queryFn: () => templatesApi.getTemplatesByCategory(category),
    enabled: !!category,
  });
};

export const useTemplatesByModule = (moduleType: string) => {
  return useQuery({
    queryKey: templateKeys.byModule(moduleType),
    queryFn: () => templatesApi.getTemplatesByModule(moduleType),
    enabled: !!moduleType,
  });
};

export const useTemplate = (templateId: string) => {
  return useQuery({
    queryKey: templateKeys.detail(templateId),
    queryFn: () => templatesApi.getTemplate(templateId),
    enabled: !!templateId,
  });
};

export const useTemplateCategories = () => {
  return useQuery({
    queryKey: templateKeys.categories(),
    queryFn: () => templatesApi.getTemplateCategories(),
  });
};

export const useTemplateTypes = () => {
  return useQuery({
    queryKey: templateKeys.types(),
    queryFn: () => templatesApi.getTemplateTypes(),
  });
};

export const useTemplateGallery = () => {
  return useQuery({
    queryKey: templateKeys.gallery(),
    queryFn: () => templatesApi.getTemplateGallery(),
  });
};

export const useUserTemplates = () => {
  return useQuery({
    queryKey: templateKeys.userTemplates(),
    queryFn: () => templatesApi.getUserTemplates(),
  });
};

export const useUserTemplateHistory = (limit?: number) => {
  return useQuery({
    queryKey: templateKeys.userHistory(),
    queryFn: () => templatesApi.getUserTemplateHistory(limit),
  });
};

export const useTemplateSuggestions = (databaseId: string) => {
  return useQuery({
    queryKey: templateKeys.suggestions(databaseId),
    queryFn: () => templatesApi.getTemplateSuggestions(databaseId),
    enabled: !!databaseId,
  });
};

export const useTemplateAnalytics = (templateId: string) => {
  return useQuery({
    queryKey: templateKeys.analytics(templateId),
    queryFn: () => templatesApi.getTemplateAnalytics(templateId),
    enabled: !!templateId,
  });
};

// Mutations
export const useCreateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTemplateRequest) =>
      templatesApi.createTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.all });
    },
  });
};

export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      templateId,
      data,
    }: {
      templateId: string;
      data: Partial<CreateTemplateRequest>;
    }) => templatesApi.updateTemplate(templateId, data),
    onSuccess: (_, { templateId }) => {
      queryClient.invalidateQueries({
        queryKey: templateKeys.detail(templateId),
      });
      queryClient.invalidateQueries({ queryKey: templateKeys.userTemplates() });
    },
  });
};

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (templateId: string) => templatesApi.deleteTemplate(templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.all });
    },
  });
};

export const useApplyDatabaseTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      templateId,
      data,
    }: {
      templateId: string;
      data: {
        workspaceId: string;
        overrides?: { name?: string; description?: string };
      };
    }) => templatesApi.applyDatabaseTemplate(templateId, data),
    onSuccess: () => {
      // Invalidate database queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ["databases"] });
    },
  });
};

export const useRateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      templateId,
      rating,
    }: {
      templateId: string;
      rating: number;
    }) => templatesApi.rateTemplate(templateId, rating),
    onSuccess: (_, { templateId }) => {
      queryClient.invalidateQueries({
        queryKey: templateKeys.detail(templateId),
      });
      queryClient.invalidateQueries({
        queryKey: templateKeys.analytics(templateId),
      });
    },
  });
};

export const useDuplicateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      templateId,
      data,
    }: {
      templateId: string;
      data?: { name?: string; description?: string };
    }) => templatesApi.duplicateTemplate(templateId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.all });
    },
  });
};
