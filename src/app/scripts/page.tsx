
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

// This page's purpose is to redirect from /scripts to /scripts/frontline
export default function ScriptsRedirectPage() {
  const router = useRouter();
  const { isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading) {
        const targetDepartment = user?.department || 'frontline';
        router.replace(`/scripts/${targetDepartment}`);
    }
  }, [router, isLoading, user]);

  return (
    <div className="flex items-center justify-center min-h-screen">
        <p>Redirecting...</p>
    </div>
  ); 
}
