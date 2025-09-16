"use client";

import { AuthProvider } from "@/hooks/use-auth";
import { ThemeProvider } from "./providers/theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </AuthProvider>
  );
}
