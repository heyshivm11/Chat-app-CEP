
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

const getRawContent = (content: string | SubScript[]): string => {
    if (typeof content === 'string') {
        return content;
    }
    return content.map(sub => `${sub.title}: ${sub.content}`).join('\n\n');
};


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
              <div className="flex justify-between items-center w-full">
                <span className="flex-1 truncate pr-2">{script.title}</span>
                <CopyButton
                    textToCopy={getRawContent(script.content)}
                    onClick={(e) => e.stopPropagation()}
                />
              </div>
            </Button>
          </li>
        ))}
      </ul>
    </Card>
  );
}
