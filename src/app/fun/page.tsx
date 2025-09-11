
"use client";

import { SnakeGame } from "@/components/snake-game";
import { DinoRunGame } from "@/components/dino-run-game";
import { TicTacToeGame } from "@/components/tic-tac-toe-game";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
            <Card className="glass-card w-full max-w-2xl">
                <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                    <Gamepad2 className="h-6 w-6 text-primary" />
                    <CardTitle>Fun Zone</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="snake">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="snake">Snake</TabsTrigger>
                            <TabsTrigger value="dino-run">Dino Run</TabsTrigger>
                            <TabsTrigger value="tic-tac-toe">Tic-Tac-Toe</TabsTrigger>
                        </TabsList>
                        <TabsContent value="snake">
                            <div className="pt-4">
                                <SnakeGame />
                            </div>
                        </TabsContent>
                        <TabsContent value="dino-run">
                            <div className="pt-4">
                                <DinoRunGame />
                            </div>
                        </TabsContent>
                        <TabsContent value="tic-tac-toe">
                            <div className="pt-4">
                                <TicTacToeGame />
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </main>
    </div>
  );
}
