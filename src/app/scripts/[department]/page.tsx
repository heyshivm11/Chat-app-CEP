import ScriptPage from '@/components/script-page';
import { AuthGate } from '@/components/auth-gate';

export default function Page({ params }: { params: { department: string } }) {
  // This is now a Server Component, so it can safely access params.
  return (
    <AuthGate>
      <ScriptPage department={params.department} />
    </AuthGate>
  );
}
