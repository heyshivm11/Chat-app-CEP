
"use client";
import React from 'react';
import { useState } from "react";
import type { Script, SubScript } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AiRefineDialog } from "./ai-refine-dialog";
import { Button } from "./ui/button";
import { PersonStanding } from "@/components/ui/lucide-icons";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { SubScriptItem } from './script-card';

interface LandscapeScriptCardProps {
  script: Script;
}

export function LandscapeScriptCard({ script }: LandscapeScriptCardProps) {
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const [humanizeScriptContent, setHumanizeScriptContent] = useState("");
  const { toast } = useToast();

  const openHumanizeDialog = (content: string) => {
    setHumanizeScriptContent(content);
    setIsAiDialogOpen(true);
  }

  const rawContent = Array.isArray(script.content)
    ? script.content.map((s) => `${s.title}: ${s.content}`).join("\n\n")
    : script.content;

  const handleCopy = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // Prevent copy if a button inside was clicked
    if ((e.target as HTMLElement).closest('button')) return;

    if (typeof rawContent === 'string') {
        navigator.clipboard.writeText(rawContent);
        toast({ title: "Copied!" });
    }
  };


  return (
    <>
      <Card
        id={`script-card-${script.id}`}
        className={cn("rounded-lg shadow-sm transition-all duration-300 hover:shadow-xl bg-card/50 backdrop-blur-sm border-primary/30")}>
        <CardHeader className="flex flex-row items-start justify-between pb-4">
          <CardTitle className="text-xl font-bold leading-tight pr-4">{script.title}</CardTitle>
          {!Array.isArray(script.content) && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => openHumanizeDialog(rawContent)}
                aria-label="Humanize Script"
              >
                <PersonStanding className="h-5 w-5 text-primary" />
              </Button>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          {Array.isArray(script.content) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {script.content.map((sub, index) => (
                <SubScriptItem 
                    key={index} 
                    subScript={sub} 
                    onHumanizeClick={() => openHumanizeDialog(sub.content)}
                />
              ))}
            </div>
          ) : (
             <div 
              className="p-3 rounded-md bg-background/50 relative group/sub-item border transition-colors sub-item-hoverable copy-cursor"
              onClick={handleCopy}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCopy(e as any)}}
            >
              <p className="text-foreground/80 whitespace-pre-wrap">{script.content}</p>
            </div>
          )}
        </CardContent>
      </Card>
      <AiRefineDialog
        open={isAiDialogOpen}
        onOpenChange={setIsAiDialogOpen}
        script={humanizeScriptContent}
      />
    </>
  );
}

    
