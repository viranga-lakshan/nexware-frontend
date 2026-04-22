"use client";
import { createContext, useContext, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/features/auth/api/auth-api";
import { authToken } from "@/lib/auth-token";
import { useSessionStore } from "@/store/session-store";
import type { RoleName } from "@/types/domain";
const AuthContext = createContext<{ isAuthenticated: boolean; isLoading: boolean; hasRole: (roles: RoleName[]) => boolean } | null>(null);
export function AuthProvider({ children }: { children: React.ReactNode }) { const { user, setUser, clearUser } = useSessionStore(); const hasToken = Boolean(authToken.getAccessToken()); const me = useQuery({ queryKey: ["auth", "me"], queryFn: authApi.me, enabled: hasToken, retry: false }); useEffect(() => { if (me.data) setUser(me.data); if (me.isError) clearUser(); }, [me.data, me.isError, setUser, clearUser]); return <AuthContext.Provider value={{ isAuthenticated: Boolean(user || hasToken), isLoading: me.isLoading, hasRole: (roles) => Boolean(user?.roles?.some((role) => roles.includes(role as RoleName))) }}>{children}</AuthContext.Provider>; }
export function useAuth() { const ctx = useContext(AuthContext); if (!ctx) throw new Error("useAuth must be used within AuthProvider"); return ctx; }
