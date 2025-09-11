
"use client";

import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/use-auth';
import { AppLayout } from '@/components/app-layout';
import { PageLoaderProvider } from '@/components/providers/page-loader-provider';
import { PageLoader } from '@/components/page-loader';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <title>CEP Scripts</title>
        <meta name="description" content="Your smart library for customer service chat scripts." />
      </head>
      <body className="font-body antialiased">
        <PageLoaderProvider>
          <AuthProvider>
            <ThemeProvider>
                  {children}
              <Toaster />
              <PageLoader />
            </ThemeProvider>
          </AuthProvider>
        </PageLoaderProvider>
      </body>
    </html>
  );
}
