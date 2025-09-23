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
} from "../../../types/settings.types";

export const settingsApi = {
  // Get all user settings
  getSettings: async (): Promise<ISettings> => {
    const response = await apiClient.get<ApiResponse<ISettings>>(
      API_ENDPOINTS.SETTINGS.BASE
    );
    return response.data.data;
  },

  // Update all settings
  updateSettings: async (settings: Partial<ISettings>): Promise<ISettings> => {
    const response = await apiClient.put<ApiResponse<ISettings>>(
      API_ENDPOINTS.SETTINGS.BASE,
      settings
    );
    return response.data.data;
  },

  // Update appearance settings
  updateAppearance: async (
    appearance: Partial<IAppearanceSettings>
  ): Promise<ISettings> => {
    const response = await apiClient.put<ApiResponse<ISettings>>(
      API_ENDPOINTS.SETTINGS.APPEARANCE,
      appearance
    );
    return response.data.data;
  },

  // Update notification settings
  updateNotifications: async (
    notifications: Partial<INotificationSettings>
  ): Promise<ISettings> => {
    const response = await apiClient.put<ApiResponse<ISettings>>(
      API_ENDPOINTS.SETTINGS.NOTIFICATIONS,
      notifications
    );
    return response.data.data;
  },

  // Update display settings
  updateDisplay: async (
    display: Partial<IDisplaySettings>
  ): Promise<ISettings> => {
    const response = await apiClient.put<ApiResponse<ISettings>>(
      API_ENDPOINTS.SETTINGS.DISPLAY,
      display
    );
    return response.data.data;
  },

  // Update security settings
  updateSecurity: async (
    security: Partial<ISecuritySettings>
  ): Promise<ISettings> => {
    const response = await apiClient.put<ApiResponse<ISettings>>(
      API_ENDPOINTS.SETTINGS.SECURITY,
      security
    );
    return response.data.data;
  },

  // Update workspace settings
  updateWorkspace: async (
    workspace: Partial<IWorkspaceSettings>
  ): Promise<ISettings> => {
    const response = await apiClient.put<ApiResponse<ISettings>>(
      API_ENDPOINTS.SETTINGS.WORKSPACE,
      workspace
    );
    return response.data.data;
  },

  // Get appearance settings only
  getAppearance: async (): Promise<IAppearanceSettings> => {
    const response = await apiClient.get<ApiResponse<IAppearanceSettings>>(
      API_ENDPOINTS.SETTINGS.APPEARANCE
    );
    return response.data.data;
  },

  // Get notification settings only
  getNotifications: async (): Promise<INotificationSettings> => {
    const response = await apiClient.get<ApiResponse<INotificationSettings>>(
      API_ENDPOINTS.SETTINGS.NOTIFICATIONS
    );
    return response.data.data;
  },

  // Get display settings only
  getDisplay: async (): Promise<IDisplaySettings> => {
    const response = await apiClient.get<ApiResponse<IDisplaySettings>>(
      API_ENDPOINTS.SETTINGS.DISPLAY
    );
    return response.data.data;
  },

  // Get security settings only
  getSecurity: async (): Promise<ISecuritySettings> => {
    const response = await apiClient.get<ApiResponse<ISecuritySettings>>(
      API_ENDPOINTS.SETTINGS.SECURITY
    );
    return response.data.data;
  },

  // Get workspace settings only
  getWorkspace: async (): Promise<IWorkspaceSettings> => {
    const response = await apiClient.get<ApiResponse<IWorkspaceSettings>>(
      API_ENDPOINTS.SETTINGS.WORKSPACE
    );
    return response.data.data;
  },

  // Reset settings
  resetSettings: async (
    category?:
      | "appearance"
      | "notifications"
      | "display"
      | "security"
      | "workspace"
      | "all"
  ): Promise<ISettings> => {
    const response = await apiClient.post<ApiResponse<ISettings>>(
      API_ENDPOINTS.SETTINGS.RESET,
      { category }
    );
    return response.data.data;
  },

  // Delete settings (for account deletion)
  deleteSettings: async (): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.SETTINGS.BASE);
  },
};
