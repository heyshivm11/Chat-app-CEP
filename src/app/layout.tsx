
"use client";

import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { ChatAssistantDialog } from '@/components/chat-assistant-dialog';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const planeStyle = {
    transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) rotate(45deg)`,
  };

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
      <body className="font-body antialiased gradient-background">
        {isMounted && (
          <Send 
            className={cn(
              "pointer-events-none fixed top-0 left-0 z-50 h-6 w-6 text-primary transition-transform duration-200 ease-out",
              mousePosition.x === -100 ? 'opacity-0' : 'opacity-100'
            )} 
            style={planeStyle}
          />
        )}
        <AuthProvider>
          <ThemeProvider>
            <div className="flex flex-col min-h-screen">
              <main className="flex-grow">{children}</main>
            </div>
            <Toaster />
            <ChatAssistantDialog />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
