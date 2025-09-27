export interface IAppearanceSettings {
  theme: "light" | "dark" | "system";
  fontSize: "small" | "medium" | "large";
  compactMode: boolean;
  animationsEnabled: boolean;
  highContrast: boolean;
}

export interface INotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  workspaceInvites: boolean;
  databaseShares: boolean;
  mentions: boolean;
  weeklyDigest: boolean;
  notificationFrequency: "immediate" | "hourly" | "daily" | "weekly";
}

export interface IDisplaySettings {
  layoutDensity: "compact" | "comfortable" | "spacious";
  sidebarWidth: number;
  contentWidth: "narrow" | "medium" | "wide" | "full";
  showGridLines: boolean;
  enableAnimations: boolean;
  autoHideSidebar: boolean;
  fullscreenMode: boolean;
  zoomLevel: number;
}

export interface ISecuritySettings {
  twoFactorEnabled: boolean;
  twoFactorMethod: "app" | "sms" | null;
  sessionTimeout: number;
  loginAlerts: boolean;
}

export interface IWorkspaceSettings {
  defaultView: "list" | "board" | "calendar" | "timeline";
  autoSave: boolean;
  showCompleted: boolean;
  timezone: string;
  dateFormat: string;
  timeFormat: "12h" | "24h";
}

export interface ISettings {
  userId: string;
  appearance: IAppearanceSettings;
  notifications: INotificationSettings;
  display: IDisplaySettings;
  security: ISecuritySettings;
  workspace: IWorkspaceSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateSettings {
  appearance?: Partial<IAppearanceSettings>;
  notifications?: Partial<INotificationSettings>;
  display?: Partial<IDisplaySettings>;
  security?: Partial<ISecuritySettings>;
  workspace?: Partial<IWorkspaceSettings>;
}