import type {Workspace} from "@/modules/workspaces/types/workspaces.types";

export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  role: string;
  authProvider: "email" | "google";
  isEmailVerified: boolean;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  workspaces?: Workspace[];
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface ChangePasswordCredentials {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordCredentials {
  email: string;
}

export interface ResetPasswordCredentials {
  resetToken: string;
  newPassword: string;
}
