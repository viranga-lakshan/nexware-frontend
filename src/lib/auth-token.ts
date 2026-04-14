import type { AuthResponse } from "@/features/auth/types";
import { isSecureContext } from "@/lib/env";

const ACCESS_KEY = "nexware.accessToken";
const REFRESH_KEY = "nexware.refreshToken";
const isBrowser = typeof window !== "undefined";

function accessCookie(session: AuthResponse): string {
  const secure = isSecureContext() ? "; Secure" : "";
  return `nexware_access_token=${session.accessToken}; path=/; max-age=${session.expiresIn}; SameSite=Lax${secure}`;
}

export const authToken = {
  getAccessToken: () => (isBrowser ? localStorage.getItem(ACCESS_KEY) : null),
  getRefreshToken: () => (isBrowser ? localStorage.getItem(REFRESH_KEY) : null),
  setSession: (session: AuthResponse) => {
    if (!isBrowser) return;
    localStorage.setItem(ACCESS_KEY, session.accessToken);
    localStorage.setItem(REFRESH_KEY, session.refreshToken);
    document.cookie = accessCookie(session);
  },
  clear: () => {
    if (!isBrowser) return;
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    const secure = isSecureContext() ? "; Secure" : "";
    document.cookie = `nexware_access_token=; path=/; max-age=0; SameSite=Lax${secure}`;
  },
};
