import { apiClient } from "@/services/api-client.ts";
import type {
  ApiResponse,
  AuthResponse,
  RegisterCredentials,
  User,
  ChangePasswordCredentials,
  ForgotPasswordCredentials,
  ResetPasswordCredentials,
  RefreshTokenResponse,
} from "@/modules/auth/types/auth.types.ts";
import { API_ENDPOINTS } from "@/constants/api-endpoints.ts";

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post<
      ApiResponse<{
        user: User;
        accessToken: string;
        refreshToken: string;
      }>
    >(API_ENDPOINTS.AUTH.SIGN_IN, { email, password });
    return response.data.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.SIGN_UP,
      credentials
    );
    return response.data.data;
  },

  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post<ApiResponse<RefreshTokenResponse>>(
      API_ENDPOINTS.AUTH.REFRESH_TOKEN,
      { refreshToken }
    );
    return response.data.data;
  },

  getCurrentUser: (() => {
    let currentRequest: Promise<User> | null = null;

    return async (): Promise<User> => {
      if (currentRequest) return currentRequest;

      currentRequest = apiClient
        .get<ApiResponse<User>>(API_ENDPOINTS.AUTH.ME)
        .then((response) => {
          return response.data.data;
        })
        .finally(() => {
          currentRequest = null;
        });

      return currentRequest;
    };
  })(),

  logout: async () => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  },

  logoutAll: async (): Promise<void> => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT_ALL);
    return response.data;
  },

  changePassword: async (
    credentials: ChangePasswordCredentials
  ): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, credentials);
  },

  forgotPassword: async (
    credentials: ForgotPasswordCredentials
  ): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, credentials);
  },

  resetPassword: async (
    credentials: ResetPasswordCredentials
  ): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, credentials);
  },

  initiateGoogleAuth: async (): Promise<void> => {
    const baseURL =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";
    window.location.href = `${baseURL}${API_ENDPOINTS.AUTH.GOOGLE_AUTH}`;
  },

  getGoogleAuthUrl: async (): Promise<string> => {
    const response = await apiClient.get<ApiResponse<{ url: string }>>(
      `${API_ENDPOINTS.AUTH.GOOGLE_AUTH}?response_type=json`
    );

    const url = response.data.data.url;
    if (!url || !url.includes("accounts.google.com"))
      throw new Error(`Invalid Google OAuth URL: ${url}`);

    return url;
  },

  initiateGoogleAuthPopup: async (): Promise<{
    accessToken: string;
    refreshToken: string;
  }> => {
    try {
      const response = await apiClient.get<ApiResponse<{ url: string }>>(
        `${API_ENDPOINTS.AUTH.GOOGLE_AUTH}?popup=true&response_type=json`
      );

      const googleOAuthUrl = response.data.data.url;

      if (!googleOAuthUrl || !googleOAuthUrl.includes("accounts.google.com")) {
        throw new Error(
          `Invalid Google OAuth URL received from backend. Expected Google URL but got: ${googleOAuthUrl}`
        );
      }

      return new Promise((resolve, reject) => {
        let messageReceived = false;

        const width = 500;
        const height = 600;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        const popup = window.open(
          googleOAuthUrl,
          "google-oauth",
          `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes,status=yes,location=yes,toolbar=no,menubar=no`
        );

        if (!popup) {
          reject(
            new Error("Popup blocked. Please allow popups for this site.")
          );
          return;
        }

        const handleMessage = (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return;

          if (event.data.type === "GOOGLE_AUTH_SUCCESS") {
            messageReceived = true;
            cleanup();

            popup.close();

            resolve({
              accessToken: event.data.accessToken,
              refreshToken: event.data.refreshToken,
            });
          } else if (event.data.type === "GOOGLE_AUTH_ERROR") {
            messageReceived = true;
            cleanup();

            popup.close();

            reject(new Error(event.data.error || "Authentication failed"));
          }
        };

        window.addEventListener("message", handleMessage);

        let popupCheckCount = 0;
        let coopDetected = false;

        const cleanup = () => {
          window.removeEventListener("message", handleMessage);
          if (checkPopup) clearInterval(checkPopup);
          if (timeoutId) clearTimeout(timeoutId);
        };

        const checkPopup = setInterval(() => {
          popupCheckCount++;
          if (popupCheckCount === 2 && !coopDetected) {
            try {
              popup.closed();
            } catch {
              coopDetected = true;
            }
          }

          if (!coopDetected) {
            try {
              if (popup.closed) {
                cleanup();
                if (!messageReceived)
                  reject(new Error("Authentication was cancelled by user"));
                return;
              }
            } catch {
              coopDetected = true;
            }
          }
        }, 1000);

        const timeoutId = setTimeout(() => {
          if (!messageReceived && !popup.closed) {
            cleanup();
            popup.close();

            reject(new Error("Authentication timeout - please try again"));
          }
        }, 10 * 60 * 1000);
      });
    } catch (error) {
      console.error("Failed to get Google OAuth URL:", error);
      throw new Error(
        "Failed to initiate Google authentication. Please try again."
      );
    }
  },

  handleGoogleCallback: async (code: string): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.GOOGLE_AUTH_CALLBACK,
      { code }
    );
    return response.data.data;
  },

  handleTokensFromUrl: (
    searchParams: URLSearchParams
  ): {
    accessToken?: string;
    refreshToken?: string;
    error?: string;
  } => {
    const accessToken =
      searchParams.get("accessToken") || searchParams.get("token") || undefined;
    const refreshToken = searchParams.get("refreshToken") || undefined;
    const error = searchParams.get("error") || undefined;

    return {
      accessToken,
      refreshToken,
      error,
    };
  },

  checkGoogleOAuthAvailability: async (): Promise<boolean> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH.GOOGLE_AUTH);
      return response.status === 200;
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 404) return false;
        if (axiosError.response?.status === 405) return true;
      }
      return true;
    }
  },

  getGoogleLoginUrl: async (): Promise<{ url: string }> => {
    try {
      const response = await apiClient.get<ApiResponse<{ url: string }>>(
        API_ENDPOINTS.AUTH.GOOGLE_GENERATE_URL
      );
      return response.data.data;
    } catch (error) {
      console.error("Failed to get Google OAuth URL:", error);
      throw new Error("Failed to get Google OAuth URL");
    }
  },

  checkApiHealth: async (): Promise<boolean> => {
    try {
      await apiClient.get("/health");
      return true;
    } catch {
      return false;
    }
  },
};
