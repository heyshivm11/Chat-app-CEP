
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 login-gradient-background">
      <div className="flex flex-col items-center text-center text-primary-foreground max-w-sm w-full">
        <h1 className="text-5xl font-bold">SettleUp</h1>
        <p className="text-lg mt-2">Simplify. Split. Settle.</p>
        
        <div className="mt-12 w-full flex flex-col items-center gap-4">
          <Link href="/login" passHref className="w-full">
            <Button className="w-full h-12 bg-gray-900 text-white hover:bg-gray-800 rounded-full font-bold text-lg">
              Sign in
            </Button>
          </Link>
          <Link href="/scripts" passHref>
            <Button variant="link" className="text-primary-foreground/80 font-semibold text-md">
              Forgot your password?
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
