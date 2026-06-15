import { env } from "@/lib/env";

/** Backend WebSocket is optional; disabled when URL is unset or flag is false. */
export function isRealtimeEnabled(): boolean {
  if (!env.realtimeEnabled) return false;
  const wsUrl = env.wsUrl;
  if (!wsUrl || wsUrl === "disabled") return false;
  return true;
}

export function getWebSocketUrl(): string | undefined {
  return isRealtimeEnabled() ? env.wsUrl : undefined;
}
