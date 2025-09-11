
"use client";

import { useState } from "react";
import { SnakeGame } from "@/components/snake-game";
import { PacmanGame } from "@/components/pacman-game";
import { TicTacToeGame } from "@/components/tic-tac-toe-game";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Game = "snake" | "pacman" | "tic-tac-toe";

export default function FunPage() {
  const [selectedGame, setSelectedGame] = useState<Game>("snake");

  const renderGame = () => {
    switch (selectedGame) {
      case "snake":
        return <SnakeGame />;
      case "pacman":
        return <PacmanGame />;
      case "tic-tac-toe":
        return <TicTacToeGame />;
      default:
        return <SnakeGame />;
    }
  };

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
            <Card className="glass-card w-full max-w-4xl">
                <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                    <Gamepad2 className="h-6 w-6 text-primary" />
                    <CardTitle>Fun Zone</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center gap-2 mb-4">
                        <Button
                            variant={selectedGame === "snake" ? "default" : "outline"}
                            onClick={() => setSelectedGame("snake")}
                        >
                            Snake
                        </Button>
                        <Button
                            variant={selectedGame === "pacman" ? "default" : "outline"}
                            onClick={() => setSelectedGame("pacman")}
                        >
                            Pac-Man
                        </Button>
                        <Button
                            variant={selectedGame === "tic-tac-toe" ? "default" : "outline"}
                            onClick={() => setSelectedGame("tic-tac-toe")}
                        >
                            Tic-Tac-Toe
                        </Button>
                    </div>
                    <div className="pt-4 flex justify-center">
                        {renderGame()}
                    </div>
                </CardContent>
            </Card>
        </main>
    </div>
  );
}
