
'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

export function AuthGate({ children }: { children?: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    // You can replace this with a loading spinner
    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Loading...</p>
        </div>
    );
  }

  // If user is logged in and tries to access login page, redirect to home
  if (user && pathname === '/login') {
    router.push('/scripts/etg');
    return null;
  }

  return <>{children}</>;
}
