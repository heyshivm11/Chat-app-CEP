
"use client";

import { SnakeGame } from "@/components/snake-game";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FunPage() {
  return (
    <div className="min-h-screen w-full gradient-background flex flex-col items-center justify-center p-4">
        <header className="absolute top-4 left-4">
            <Link href="/scripts">
              <Button variant="ghost">
                &larr; Back to Scripts
              </Button>
            </Link>
        </header>
        <main className="flex-grow flex items-center justify-center w-full">
            <Card className="glass-card w-full max-w-lg">
                <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                    <Gamepad2 className="h-6 w-6 text-primary" />
                    <CardTitle>Fun Zone: Snake</CardTitle>
                </CardHeader>
                <CardContent>
                    <SnakeGame />
                </CardContent>
            </Card>
        </main>
    </div>
  );
}
