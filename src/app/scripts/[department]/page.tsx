"use client";

import ScriptPage from '@/components/script-page';

export default function Page({ params }: { params: { department: string } }) {
  const { department } = params;
  
  return (
      <ScriptPage department={department} />
  );
}
