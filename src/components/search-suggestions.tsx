
"use client";

import type { Script } from "@/lib/types";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

interface SearchSuggestionsProps {
  suggestions: Script[];
  onSuggestionClick: (scriptId: string) => void;
  searchTerm: string;
}

export function SearchSuggestions({ suggestions, onSuggestionClick, searchTerm }: SearchSuggestionsProps) {
  if (!searchTerm || suggestions.length === 0) {
    return null;
  }

  return (
    <Card className="absolute top-full mt-2 w-full max-h-60 overflow-y-auto p-2 z-40">
      <ul>
        {suggestions.map((script) => (
          <li key={script.id}>
            <Button
              variant="ghost"
              className="w-full justify-start h-auto py-2 px-3 text-left"
              onClick={() => onSuggestionClick(script.id)}
            >
              {script.title}
            </Button>
          </li>
        ))}
      </ul>
    </Card>
  );
}
