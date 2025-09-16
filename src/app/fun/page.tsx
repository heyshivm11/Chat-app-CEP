
"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Gamepad2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TicTacToeGame } from "@/components/tic-tac-toe-game";
import { SnakeGame } from "@/components/snake-game";
import { BikeRacingGame } from "@/components/bike-racing-game";
import { cn } from "@/lib/utils";
import { AuthGate } from "@/components/auth-gate";
import { useAuth } from "@/hooks/use-auth";


const gameCardStyles = "flex items-center justify-center p-6 md:p-10";

function FunZonePageContent() {
    const router = useRouter();
    const { user } = useAuth();

    return (
        <div className="flex flex-col h-screen">
            <PageHeader 
                searchTerm=""
                onSearchChange={() => {}}
                category="All"
                onCategoryChange={() => {}}
                department={user?.department || 'frontline'}
                onDepartmentChange={() => {}}
            />
            <main className="flex-1 flex flex-col container mx-auto px-4 md:px-8 py-8">
                <div className="flex items-center gap-3 mb-6">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Go back">
                        <ArrowLeft className="h-8 w-8 text-primary" />
                    </Button>
                    <Gamepad2 className="h-8 w-8 text-primary" />
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">Fun Zone</h1>
                </div>
                
                <Tabs defaultValue="tic-tac-toe" className="w-full flex-1 flex flex-col">
                    <TabsList className="grid w-full grid-cols-3 mx-auto max-w-lg">
                        <TabsTrigger value="tic-tac-toe">Tic-Tac-Toe</TabsTrigger>
                        <TabsTrigger value="snake">Snake</TabsTrigger>
                        <TabsTrigger value="bike-race">Bike Race</TabsTrigger>
                    </TabsList>
                    <div className="flex-1 mt-6">
                        <TabsContent value="tic-tac-toe" className="h-full">
                            <Card className={cn("h-full", gameCardStyles)}>
                                <TicTacToeGame />
                            </Card>
                        </TabsContent>
                        <TabsContent value="snake" className="h-full">
                            <Card className={cn("h-full", gameCardStyles)}>
                                <SnakeGame />
                            </Card>
                        </TabsContent>
                        <TabsContent value="bike-race" className="h-full">
                            <Card className={cn("h-full", gameCardStyles)}>
                                <BikeRacingGame />
                            </Card>
                        </TabsContent>
                    </div>
                </Tabs>
            </main>
             <footer className="container mx-auto px-4 md:px-8 py-4 text-center text-sm text-muted-foreground">
                Made with ❤️ by <a href="https://www.instagram.com/heyshivm/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Shivam</a>
            </footer>
        </div>
    )
}


export default function FunZonePage() {
    return (
        <AuthGate>
            <FunZonePageContent />
        </AuthGate>
    )
}
