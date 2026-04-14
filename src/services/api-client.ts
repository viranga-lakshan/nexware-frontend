import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";
import { authToken } from "@/lib/auth-token";
import { env } from "@/lib/env";
import type { ApiResponse } from "@/types/api";
import type { AuthResponse } from "@/features/auth/types";

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 20000,
  headers: { "Content-Type": "application/json" },
});

let refreshPromise: Promise<string | null> | null = null;

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = authToken.getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse<unknown>>) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !original.url?.includes("/auth/refresh")
    ) {
      original._retry = true;
      refreshPromise ??= refreshAccessToken();
      const token = await refreshPromise.finally(() => {
        refreshPromise = null;
      });
      if (token) {
        original.headers.Authorization = `Bearer ${token}`;
        return apiClient(original);
      }
    }
    const message =
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      error.message ||
      "Request failed";
    if (typeof window !== "undefined") toast.error(message);
    return Promise.reject(error);
  },
);

async function refreshAccessToken() {
  const refreshToken = authToken.getRefreshToken();
  if (!refreshToken) return null;
  try {
    const response = await axios.post<ApiResponse<AuthResponse>>(`${env.apiBaseUrl}/auth/refresh`, {
      refreshToken,
    });
    authToken.setSession(response.data.data);
    return response.data.data.accessToken;
  } catch {
    authToken.clear();
    if (typeof window !== "undefined") window.location.assign("/login");
    return null;
  }
}

export async function unwrap<T>(promise: Promise<{ data: ApiResponse<T> }>) {
  const response = await promise;
  return response.data.data;
}
