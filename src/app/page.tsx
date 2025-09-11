import { AuthGate } from '@/components/auth-gate';
import ScriptPage from '@/components/script-page';

export default function Home() {
  return (
    <AuthGate>
      <ScriptPage />
    </AuthGate>
  );
}
