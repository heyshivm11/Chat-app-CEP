
"use client";

import ScriptPage from '@/components/script-page';
import { AuthGate } from '@/components/auth-gate';

export default function Page({ params }: { params: { department: string } }) {
  const { department } = params;
  const departmentName = department === 'etg' ? 'ETG' : 'Booking.com';
  
  return (
    <AuthGate>
      <ScriptPage department={department} departmentName={departmentName} />
    </AuthGate>
  );
}
