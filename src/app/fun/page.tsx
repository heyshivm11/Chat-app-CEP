import { SnakeGame } from '@/components/snake-game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function FunZonePage() {
  return (
    <div className="min-h-screen w-full gradient-background flex flex-col">
      <header className="sticky top-0 z-10 w-full bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
            <Button asChild variant="ghost">
                <Link href="/scripts">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Scripts
                </Link>
            </Button>
            <h1 className="text-2xl font-bold text-primary">Fun Zone</h1>
            <div className="w-24"></div>
        </div>
      </header>
      <main className="container mx-auto px-4 md:px-8 py-8 flex-grow flex justify-center items-center">
        <Card className="w-full max-w-lg glass-card">
          <CardHeader>
            <CardTitle className="text-center">Snake Game</CardTitle>
          </CardHeader>
          <CardContent>
            <SnakeGame />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
