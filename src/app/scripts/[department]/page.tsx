"use client";

import ScriptPage from '@/components/script-page';
import { AuthGate } from '@/components/auth-gate';

export default function Page({ params: { department } }: { params: { department: string } }) {
  return (
    <AuthGate>
      <ScriptPage department={department} />
    </AuthGate>
  );
}
