
"use client";

import { useAuth } from "@/hooks/use-auth";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    return <main className="flex-grow">{children}</main>
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* PageHeader can be added back here if needed */}
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
}
