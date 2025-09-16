
'use client';

import { LoginPage as LoginComponent } from '@/components/login-page';
import { AuthProvider } from '@/hooks/use-auth';

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginComponent />
    </AuthProvider>
  );
}
