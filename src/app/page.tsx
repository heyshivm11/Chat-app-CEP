
"use client";

import { AppLayout } from "@/components/app-layout";
import { AuthProvider } from "@/hooks/use-auth";
import ScriptPage from "@/components/script-page";

export default function Home() {
  return (
    <AuthProvider>
        <AppLayout>
            <ScriptPage />
        </AppLayout>
    </AuthProvider>
  );
}
