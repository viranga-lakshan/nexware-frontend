const trim = (value: string | undefined) => value?.trim();

const isDev = process.env.NODE_ENV === "development";

/** Production backend: https://nexware.me — local override via .env.local */
const DEFAULT_API_BASE_URL = isDev
  ? "http://localhost:8080/api/v1"
  : "https://nexware.me/api/v1";

const DEFAULT_APP_URL = isDev ? "http://localhost:3000" : "https://nexware-frontend.vercel.app";

export const env = {
  apiBaseUrl: trim(process.env.NEXT_PUBLIC_API_BASE_URL) ?? DEFAULT_API_BASE_URL,
  appName: trim(process.env.NEXT_PUBLIC_APP_NAME) ?? "NexWare Distribution Platform",
  appUrl: trim(process.env.NEXT_PUBLIC_APP_URL) ?? DEFAULT_APP_URL,
  wsUrl: trim(process.env.NEXT_PUBLIC_WS_URL),
  realtimeEnabled: trim(process.env.NEXT_PUBLIC_REALTIME_ENABLED)?.toLowerCase() !== "false",
  isProduction: process.env.NODE_ENV === "production",
} as const;

export function isSecureContext(): boolean {
  if (typeof window === "undefined") return env.isProduction;
  return window.location.protocol === "https:";
}
