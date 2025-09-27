import { apiClient } from "@/services/api-client";
import type {
  IFAQ,
  IGuide,
  IContactRequest,
  IHelpSearchResult,
} from "@/modules/help-center/types/help-center.ts";

export const helpCenterApi = {
  getFAQs: async (category?: string): Promise<IFAQ[]> => {
    const response = await apiClient.get(`/help/faqs`, {
      params: category ? { category } : undefined,
    });
    return response.data.data;
  },

  getFAQById: async (id: string): Promise<IFAQ> => {
    const response = await apiClient.get(`/help/faqs/${id}`);
    return response.data.data;
  },

  getGuides: async (category?: string): Promise<IGuide[]> => {
    const response = await apiClient.get(`/help/guides`, {
      params: category ? { category } : undefined,
    });
    return response.data.data;
  },

  getGuideById: async (id: string): Promise<IGuide> => {
    const response = await apiClient.get(`/help/guides/${id}`);
    return response.data.data;
  },

  searchHelp: async (
    query: string,
    category?: string
  ): Promise<IHelpSearchResult> => {
    const response = await apiClient.get(`/help/search`, {
      params: { q: query, category },
    });
    return response.data.data;
  },

  submitContactRequest: async (
    request: IContactRequest
  ): Promise<{ success: boolean; ticketId?: string }> => {
    const response = await apiClient.post(`/help/contact`, request);
    return response.data.data;
  },

  getHelpCategories: async (): Promise<
    Array<{ id: string; name: string; count: number }>
  > => {
    const response = await apiClient.get(`/help/categories`);
    return response.data.data;
  },

  // Get help overview
  getHelpOverview: async (): Promise<{
    totalFAQs: number;
    totalGuides: number;
    totalCategories: number;
    popularTopics: Array<{ id: string; name: string; count: number }>;
  }> => {
    const response = await apiClient.get(`/help/overview`);
    return response.data.data;
  },
};
