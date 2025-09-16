
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, RotateCcw, Notebook, ArrowLeft } from "@/components/ui/lucide-icons";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { AuthGate } from "@/components/auth-gate";
import { useAuth } from "@/hooks/use-auth";

const NOTES_STORAGE_KEY = "cep_my_notes";

function NotesPageContent() {
  const [notes, setNotes] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const savedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(NOTES_STORAGE_KEY, notes);
  }, [notes]);

  const handleCopy = () => {
    navigator.clipboard.writeText(notes);
    toast({
      title: "Copied to clipboard!",
    });
  };

  const handleReset = () => {
    setNotes("");
    toast({
      title: "Notes cleared!",
    });
  };

  return (
    <div 
        className="flex flex-col h-screen"
    >
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
          <Notebook className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight text-foreground">My Notes</h1>
        </div>
        <div className="flex-1 flex flex-col p-4 rounded-lg border-2 border-black bg-background/50 backdrop-blur-lg">
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Start typing your notes here..."
            className="flex-1 w-full p-4 text-lg bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={handleReset} className="border-2 border-black">
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
            <Button onClick={handleCopy} className="btn-custom btn-secondary-custom max-w-fit">
              <Copy className="mr-2 h-4 w-4" /> Copy Notes
            </Button>
          </div>
        </div>
      </main>
      <footer className="container mx-auto px-4 md:px-8 py-4 text-center text-sm text-muted-foreground">
        Made with ❤️ by <a href="https://www.instagram.com/heyshivm/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Shivam</a>
      </footer>
    </div>
  );
}

export default function NotesPage() {
    return (
        <AuthGate>
            <NotesPageContent />
        </AuthGate>
    )
}
