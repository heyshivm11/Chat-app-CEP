
"use client";

import ScriptPage from '@/components/script-page';
import { AppLayout } from '@/components/app-layout';

export default function Page({ params }: { params: { department: string } }) {
  const { department } = params;
  const departmentName = department === 'etg' ? 'ETG' : 'Booking.com';
  
  return (
    <AppLayout>
      <ScriptPage department={department} departmentName={departmentName} />
    </AppLayout>
  );
}
