
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export function AuthGate({ children }: { children?: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user && pathname !== '/login' && pathname !== '/landing') {
        router.push('/landing');
      } else if (user && (pathname === '/login' || pathname === '/landing')) {
        router.push('/');
      }
    }
  }, [user, loading, router, pathname]);
  
  if (loading || (!user && (pathname !== '/login' && pathname !== '/landing'))) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // This case should ideally not be hit if routing logic is correct,
    // as login page has its own layout. But as a fallback:
    return <>{children}</>;
  }

  return <>{children}</>;
}
