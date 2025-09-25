import { apiClient } from "@/services/api-client";
import type {
  IFAQ,
  IGuide,
  IContactRequest,
  IHelpSearchResult,
} from "@/types/help-center";

export const helpCenterApi = {
  // Get all FAQs
  getFAQs: async (category?: string): Promise<IFAQ[]> => {
    const response = await apiClient.get(`/help/faqs`, {
      params: category ? { category } : undefined,
    });
    return response.data.data;
  },

  // Get a specific FAQ
  getFAQById: async (id: string): Promise<IFAQ> => {
    const response = await apiClient.get(`/help/faqs/${id}`);
    return response.data.data;
  },

  // Get all guides
  getGuides: async (category?: string): Promise<IGuide[]> => {
    const response = await apiClient.get(`/help/guides`, {
      params: category ? { category } : undefined,
    });
    return response.data.data;
  },

  // Get a specific guide
  getGuideById: async (id: string): Promise<IGuide> => {
    const response = await apiClient.get(`/help/guides/${id}`);
    return response.data.data;
  },

  // Search help content
  searchHelp: async (
    query: string,
    category?: string
  ): Promise<IHelpSearchResult> => {
    const response = await apiClient.get(`/help/search`, {
      params: { q: query, category },
    });
    return response.data.data;
  },

  // Submit contact request
  submitContactRequest: async (
    request: IContactRequest
  ): Promise<{ success: boolean; ticketId?: string }> => {
    const response = await apiClient.post(`/help/contact`, request);
    return response.data.data;
  },

  // Get help categories
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
