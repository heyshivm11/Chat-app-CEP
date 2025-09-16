
"use client";

import type { Script, SubScript } from "@/lib/types";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { CopyButton } from "./copy-button";

interface SearchSuggestionsProps {
  suggestions: Script[];
  onSuggestionClick: (scriptId: string) => void;
  searchTerm: string;
}

function getRawContent(content: string | SubScript[]): string {
    if (Array.isArray(content)) {
        return content.map((s) => `${s.title}: ${s.content}`).join("\n\n");
    }
    return content;
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
            <div 
              className="flex items-center justify-between w-full rounded-md hover:bg-accent"
            >
              <Button
                variant="ghost"
                className="flex-1 justify-start h-auto py-2 px-3 text-left"
                onClick={() => onSuggestionClick(script.id)}
              >
                {script.title}
              </Button>
              <CopyButton
                textToCopy={getRawContent(script.content)}
                variant="ghost"
                size="icon"
                className="h-8 w-8 mr-2"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
