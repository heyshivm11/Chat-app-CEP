
"use client";

import { usePathname } from "next/navigation";
import { AuthGate } from "./auth-gate";

const noAuthRequired = ["/login"];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {noAuthRequired.includes(pathname) ? (
          children
        ) : (
          <AuthGate>{children}</AuthGate>
        )}
      </main>
    </div>
  );
}
