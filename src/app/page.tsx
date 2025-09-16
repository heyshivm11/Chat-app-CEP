
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace('/scripts/etg');
      } else {
        router.replace('/login');
      }
    }
  }, [router, user, isLoading]);

  return (
    <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
    </div>
  ); 
}
