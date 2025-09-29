import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { templatesApi } from "./templates-api.ts";
import { TEMPLATE_KEYS } from "@/constants/query-keys.ts";
import type {
  CreateTemplateRequest,
  TemplateSearchParams,
} from "./templates-api.ts";

// Queries
export const useTemplates = (params?: TemplateSearchParams) => {
  return useQuery({
    queryKey: TEMPLATE_KEYS.list(params || {}),
    queryFn: () => templatesApi.getTemplates(params),
  });
};

export const useFeaturedTemplates = () => {
  return useQuery({
    queryKey: TEMPLATE_KEYS.featured(),
    queryFn: () => templatesApi.getFeaturedTemplates(),
  });
};

export const useOfficialTemplates = () => {
  return useQuery({
    queryKey: TEMPLATE_KEYS.official(),
    queryFn: () => templatesApi.getOfficialTemplates(),
  });
};

export const usePopularTemplates = () => {
  return useQuery({
    queryKey: TEMPLATE_KEYS.popular(),
    queryFn: () => templatesApi.getPopularTemplates(),
  });
};

export const useTemplatesByCategory = (category: string) => {
  return useQuery({
    queryKey: TEMPLATE_KEYS.byCategory(category),
    queryFn: () => templatesApi.getTemplatesByCategory(category),
    enabled: !!category,
  });
};

export const useTemplatesByModule = (moduleType: string) => {
  return useQuery({
    queryKey: TEMPLATE_KEYS.byModule(moduleType),
    queryFn: () => templatesApi.getTemplatesByModule(moduleType),
    enabled: !!moduleType,
  });
};

export const useTemplate = (templateId: string) => {
  return useQuery({
    queryKey: TEMPLATE_KEYS.detail(templateId),
    queryFn: () => templatesApi.getTemplate(templateId),
    enabled: !!templateId,
  });
};

export const useTemplateCategories = () => {
  return useQuery({
    queryKey: TEMPLATE_KEYS.categories(),
    queryFn: () => templatesApi.getTemplateCategories(),
  });
};

export const useTemplateTypes = () => {
  return useQuery({
    queryKey: TEMPLATE_KEYS.types(),
    queryFn: () => templatesApi.getTemplateTypes(),
  });
};

export const useTemplateGallery = () => {
  return useQuery({
    queryKey: TEMPLATE_KEYS.gallery(),
    queryFn: () => templatesApi.getTemplateGallery(),
  });
};

export const useUserTemplates = () => {
  return useQuery({
    queryKey: TEMPLATE_KEYS.userTemplates(),
    queryFn: () => templatesApi.getUserTemplates(),
  });
};

export const useUserTemplateHistory = (limit?: number) => {
  return useQuery({
    queryKey: TEMPLATE_KEYS.userHistory(),
    queryFn: () => templatesApi.getUserTemplateHistory(limit),
  });
};

export const useTemplateSuggestions = (databaseId: string) => {
  return useQuery({
    queryKey: TEMPLATE_KEYS.suggestions(databaseId),
    queryFn: () => templatesApi.getTemplateSuggestions(databaseId),
    enabled: !!databaseId,
  });
};

export const useTemplateAnalytics = (templateId: string) => {
  return useQuery({
    queryKey: TEMPLATE_KEYS.analytics(templateId),
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
      queryClient.invalidateQueries({ queryKey: TEMPLATE_KEYS.all });
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
        queryKey: TEMPLATE_KEYS.detail(templateId),
      });
      queryClient.invalidateQueries({
        queryKey: TEMPLATE_KEYS.userTemplates(),
      });
    },
  });
};

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (templateId: string) => templatesApi.deleteTemplate(templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEMPLATE_KEYS.all });
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
        queryKey: TEMPLATE_KEYS.detail(templateId),
      });
      queryClient.invalidateQueries({
        queryKey: TEMPLATE_KEYS.analytics(templateId),
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
      queryClient.invalidateQueries({ queryKey: TEMPLATE_KEYS.all });
    },
  });
};
