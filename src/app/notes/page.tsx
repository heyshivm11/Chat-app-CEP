
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Notebook, RotateCcw } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/copy-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function NotesSection({
    notes,
    setNotes,
    placeholder
} : {
    notes: string,
    setNotes: (notes: string) => void;
    placeholder: string;
}) {
    return (
        <div className="space-y-4 flex-grow flex flex-col">
            <Textarea
                placeholder={placeholder}
                className="min-h-[120px] flex-grow text-base"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
            />
            <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setNotes("")}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset
                </Button>
                <CopyButton textToCopy={notes}>Copy Notes</CopyButton>
            </div>
        </div>
    )
}

export default function NotesPage() {
  const [roughNotes1, setRoughNotes1] = useState("");
  const [roughNotes2, setRoughNotes2] = useState("");

  useEffect(() => {
    const savedNotes1 = localStorage.getItem("roughNotes1");
    if (savedNotes1) {
      setRoughNotes1(savedNotes1);
    }
    const savedNotes2 = localStorage.getItem("roughNotes2");
    if (savedNotes2) {
      setRoughNotes2(savedNotes2);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("roughNotes1", roughNotes1);
  }, [roughNotes1]);

  useEffect(() => {
    localStorage.setItem("roughNotes2", roughNotes2);
  }, [roughNotes2]);


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
                    <Tabs defaultValue="customer1" className="w-full flex-grow flex flex-col">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="customer1">Customer 1</TabsTrigger>
                            <TabsTrigger value="customer2">Customer 2</TabsTrigger>
                        </TabsList>
                        <TabsContent value="customer1" className="flex-grow flex flex-col">
                           <div className="pt-4 flex-grow flex flex-col">
                             <NotesSection
                                notes={roughNotes1}
                                setNotes={setRoughNotes1}
                                placeholder="Jot down quick notes for Customer 1 here..."
                             />
                           </div>
                        </TabsContent>
                        <TabsContent value="customer2" className="flex-grow flex flex-col">
                           <div className="pt-4 flex-grow flex flex-col">
                             <NotesSection
                                notes={roughNotes2}
                                setNotes={setRoughNotes2}
                                placeholder="Jot down quick notes for Customer 2 here..."
                             />
                           </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </main>
    </div>
  );
}
