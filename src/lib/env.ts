const trim = (value: string | undefined) => value?.trim();

/** Production API at https://nexware.me — override locally via .env.local */
export const env = {
  apiBaseUrl: trim(process.env.NEXT_PUBLIC_API_BASE_URL) ?? "http://localhost:8080/api/v1",
  appName: trim(process.env.NEXT_PUBLIC_APP_NAME) ?? "NexWare Distribution Platform",
  appUrl: trim(process.env.NEXT_PUBLIC_APP_URL) ?? "http://localhost:3000",
  wsUrl: trim(process.env.NEXT_PUBLIC_WS_URL),
  realtimeEnabled: trim(process.env.NEXT_PUBLIC_REALTIME_ENABLED)?.toLowerCase() !== "false",
  isProduction: process.env.NODE_ENV === "production",
} as const;

export function isSecureContext(): boolean {
  if (typeof window === "undefined") return env.isProduction;
  return window.location.protocol === "https:";
}
