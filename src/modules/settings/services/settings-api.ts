import { apiClient } from "@/services/api-client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { ApiResponse } from "@/types/api.types";
import type {
  ISettings,
  IAppearanceSettings,
  INotificationSettings,
  IDisplaySettings,
  ISecuritySettings,
  IWorkspaceSettings,
} from "../types/settings.types.ts";

export const settingsApi = {
  getSettings: async (): Promise<ApiResponse<ISettings>> => {
    const response = await apiClient.get<ApiResponse<ISettings>>(
      API_ENDPOINTS.SETTINGS.BASE
    );
    return response.data;
  },

  updateSettings: async (
    settings: Partial<ISettings>
  ): Promise<ApiResponse<ISettings>> => {
    const response = await apiClient.put<ApiResponse<ISettings>>(
      API_ENDPOINTS.SETTINGS.BASE,
      settings
    );
    return response.data;
  },

  updateAppearance: async (
    appearance: Partial<IAppearanceSettings>
  ): Promise<ApiResponse<ISettings>> => {
    const response = await apiClient.put<ApiResponse<ISettings>>(
      API_ENDPOINTS.SETTINGS.APPEARANCE,
      appearance
    );
    return response.data;
  },

  updateNotifications: async (
    notifications: Partial<INotificationSettings>
  ): Promise<ApiResponse<ISettings>> => {
    const response = await apiClient.put<ApiResponse<ISettings>>(
      API_ENDPOINTS.SETTINGS.NOTIFICATIONS,
      notifications
    );
    return response.data;
  },

  updateDisplay: async (
    display: Partial<IDisplaySettings>
  ): Promise<ApiResponse<ISettings>> => {
    const response = await apiClient.put<ApiResponse<ISettings>>(
      API_ENDPOINTS.SETTINGS.DISPLAY,
      display
    );
    return response.data;
  },

  updateSecurity: async (
    security: Partial<ISecuritySettings>
  ): Promise<ApiResponse<ISettings>> => {
    const response = await apiClient.put<ApiResponse<ISettings>>(
      API_ENDPOINTS.SETTINGS.SECURITY,
      security
    );
    return response.data;
  },

  updateWorkspace: async (
    workspace: Partial<IWorkspaceSettings>
  ): Promise<ApiResponse<ISettings>> => {
    const response = await apiClient.put<ApiResponse<ISettings>>(
      API_ENDPOINTS.SETTINGS.WORKSPACE,
      workspace
    );
    return response.data;
  },

  getAppearance: async (): Promise<ApiResponse<IAppearanceSettings>> => {
    const response = await apiClient.get<ApiResponse<IAppearanceSettings>>(
      API_ENDPOINTS.SETTINGS.APPEARANCE
    );
    return response.data;
  },

  getNotifications: async (): Promise<ApiResponse<INotificationSettings>> => {
    const response = await apiClient.get<ApiResponse<INotificationSettings>>(
      API_ENDPOINTS.SETTINGS.NOTIFICATIONS
    );
    return response.data;
  },

  getDisplay: async (): Promise<ApiResponse<IDisplaySettings>> => {
    const response = await apiClient.get<ApiResponse<IDisplaySettings>>(
      API_ENDPOINTS.SETTINGS.DISPLAY
    );
    return response.data;
  },

  getSecurity: async (): Promise<ApiResponse<ISecuritySettings>> => {
    const response = await apiClient.get<ApiResponse<ISecuritySettings>>(
      API_ENDPOINTS.SETTINGS.SECURITY
    );
    return response.data;
  },

  getWorkspace: async (): Promise<ApiResponse<IWorkspaceSettings>> => {
    const response = await apiClient.get<ApiResponse<IWorkspaceSettings>>(
      API_ENDPOINTS.SETTINGS.WORKSPACE
    );
    return response.data;
  },

  resetSettings: async (
    category?:
      | "appearance"
      | "notifications"
      | "display"
      | "security"
      | "workspace"
      | "all"
  ): Promise<ApiResponse<ISettings>> => {
    const response = await apiClient.post<ApiResponse<ISettings>>(
      API_ENDPOINTS.SETTINGS.RESET,
      { category }
    );
    return response.data;
  },

  deleteSettings: async (): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.SETTINGS.BASE);
  },
};
