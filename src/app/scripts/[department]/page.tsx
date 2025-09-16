
"use client";

import ScriptPage from '@/components/script-page';
import { AuthGate } from '@/components/auth-gate';

export default function Page({ params }: { params: { department: string } }) {
  const { department } = params;
  return (
    <AuthGate>
      <ScriptPage department={department} />
    </AuthGate>
  );
}
