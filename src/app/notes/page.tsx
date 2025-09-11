
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Notebook, RotateCcw } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/copy-button";

export default function NotesPage() {
  const [roughNotes, setRoughNotes] = useState("");

  return (
    <div className="min-h-screen w-full gradient-background flex flex-col items-center justify-center p-4">
        <header className="absolute top-4 left-4">
            <Link href="/scripts" passHref>
              <Button variant="ghost">
                &larr; Back to Scripts
              </Button>
            </Link>
        </header>
        <main className="flex-grow flex items-center justify-center w-full">
            <Card className="glass-card w-full max-w-4xl h-[70vh] flex flex-col">
                <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                    <Notebook className="h-6 w-6 text-primary" />
                    <CardTitle>Rough Notes</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                    <div className="space-y-4 flex-grow flex flex-col">
                        <Textarea 
                            placeholder="Jot down quick notes here..."
                            className="min-h-[120px] flex-grow text-base"
                            value={roughNotes}
                            onChange={(e) => setRoughNotes(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setRoughNotes("")}>
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Reset
                            </Button>
                            <CopyButton textToCopy={roughNotes}>Copy Notes</CopyButton>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </main>
    </div>
  );
}
