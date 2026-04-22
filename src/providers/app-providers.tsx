"use client";
import { Toaster } from "sonner";
import { AuthProvider } from "./auth-provider";
import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";
export function AppProviders({ children }: { children: React.ReactNode }) { return <ThemeProvider><QueryProvider><AuthProvider>{children}</AuthProvider><Toaster richColors closeButton position="top-right" /></QueryProvider></ThemeProvider>; }
