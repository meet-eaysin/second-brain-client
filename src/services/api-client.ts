import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import {
  getToken,
  removeTokens,
  setToken,
  setRefreshToken,
  getRefreshToken,
} from "@/modules/auth/utils/tokenUtils.ts";
import { useAuthStore } from "@/modules/auth/store/auth-store.ts";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const currentWorkspace = useAuthStore.getState().currentWorkspace;
      if (currentWorkspace?._id) {
        config.headers["workspace-id"] = currentWorkspace._id;
      }
    } catch (error) {
      console.warn("Failed to read workspace from store:", error);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    if (import.meta.env.DEV && error.config?.url?.includes("/databases")) {
      console.error("❌ Database API Error:", {
        method: error.config.method,
        url: error.config.url,
        status: error.response?.status,
        data: error.response?.data,
        requestData: error.config.data,
      });
    }
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const response = await axios.post(
            `${API_BASE_URL}/auth/refresh-token`,
            {
              refreshToken,
            }
          );

          const { accessToken, refreshToken: newRefreshToken } =
            response.data.data;
          setToken(accessToken);
          if (newRefreshToken) {
            setRefreshToken(newRefreshToken);
          }

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError: unknown) {
          console.error("Token refresh failed:", refreshError);

          removeTokens();
          useAuthStore.getState().clearUser();
          useAuthStore
            .getState()
            .setError("Session expired. Please sign in again.");

          const currentPath = window.location.pathname;
          if (!currentPath.startsWith("/auth")) {
            setTimeout(() => {
              window.location.href = "/auth/sign-in";
            }, 100);
          }

          return Promise.reject(refreshError);
        }
      } else {
        removeTokens();
        useAuthStore.getState().clearUser();
        useAuthStore.getState().setError("Please sign in to continue.");

        const currentPath = window.location.pathname;
        if (!currentPath.startsWith("/auth"))
          window.location.href = "/auth/sign-in";
      }
    }

    if (error.response?.status === 403) {
      useAuthStore
        .getState()
        .setError("You do not have permission to access this resource.");
    }

    if (!error.response) {
      useAuthStore
        .getState()
        .setError("Network error. Please check your connection.");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
