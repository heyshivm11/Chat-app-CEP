
'use client';

import { LoginPage as LoginComponent } from '@/components/login-page';

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 login-gradient-background">
        <LoginComponent />
    </div>
  );
}
