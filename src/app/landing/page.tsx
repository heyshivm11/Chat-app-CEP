
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 grid-background">
      <div className="flex flex-col items-center text-center">
        <div className="mb-8">
          <Image
            src="https://picsum.photos/seed/smarthome/400/300"
            alt="Smart Home Illustration"
            width={400}
            height={300}
            className="object-contain"
            data-ai-hint="smart home illustration"
          />
        </div>

        <div className="relative mb-4">
            <div
                className="relative z-10 btn-custom btn-secondary-custom text-4xl"
            >
                HOMELOGY
            </div>
            <div
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[90%] btn-custom btn-tertiary-custom"
            >
                Your smart home system
            </div>
        </div>


        <div className="mt-20 w-full flex flex-col items-center gap-4">
          <Link href="/login" passHref className="w-full max-w-sm">
            <Button className="btn-custom btn-primary-custom">
              Get started
            </Button>
          </Link>
          <Link href="/scripts" passHref>
            <Button variant="link" className="text-black font-semibold text-lg">
              Skip
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
