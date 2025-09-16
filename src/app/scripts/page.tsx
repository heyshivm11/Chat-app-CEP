"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

// This page's purpose is to redirect from /scripts to /scripts/etg
export default function ScriptsRedirectPage() {
  const router = useRouter();
  const { isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
        router.replace('/scripts/etg');
    }
  }, [router, isLoading]);

  return (
    <div className="flex items-center justify-center min-h-screen">
        <p>Redirecting...</p>
    </div>
  ); 
}
