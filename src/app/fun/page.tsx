
"use client";

import { useRef, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock } from "@/components/ui/lucide-icons";
import { useRouter } from "next/navigation";
import { AuthGate } from "@/components/auth-gate";
import { useAuth } from "@/hooks/use-auth";
import { WorldClock } from "@/components/world-clock";


function FunZonePageContent() {
    const router = useRouter();
    const { user } = useAuth();
    const blobRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handlePointerMove = (event: PointerEvent) => {
        const { clientX, clientY } = event;
        if (blobRef.current) {
            blobRef.current.animate({
            left: `${clientX}px`,
            top: `${clientY}px`
            }, { duration: 3000, fill: "forwards" });
        }
        };

        window.addEventListener("pointermove", handlePointerMove);
        return () => {
        window.removeEventListener("pointermove", handlePointerMove);
        };
    }, []);

    return (
        <div 
            className="flex flex-col h-screen relative overflow-hidden"
        >
            <div id="blob" ref={blobRef}></div>
            <div id="blur"></div>
            <div className="relative z-10 flex flex-col h-full">
                <PageHeader 
                    searchTerm=""
                    onSearchChange={() => {}}
                    onSearchSubmit={() => {}}
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
                        <Clock className="h-8 w-8 text-primary" />
                        <h1 className="text-4xl font-bold tracking-tight text-foreground">World Clock</h1>
                    </div>
                    
                    <div className="flex-1 mt-6 flex items-center justify-center">
                       <WorldClock />
                    </div>
                </main>
                 <footer className="container mx-auto px-4 md:px-8 py-4 text-center text-sm text-muted-foreground">
                    Made with ❤️ by <a href="https://www.instagram.com/heyshivm/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Shivam</a>
                </footer>
            </div>
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
