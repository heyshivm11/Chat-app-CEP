
"use client";
import React from 'react';
import { useState } from "react";
import type { Script, SubScript } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "./copy-button";
import { AiRefineDialog } from "./ai-refine-dialog";
import { Button } from "./ui/button";
import { PersonStanding } from "@/components/ui/lucide-icons";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ScriptCardProps {
  script: Script;
}

function ScriptCardComponent({ script }: ScriptCardProps) {
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const [humanizeScriptContent, setHumanizeScriptContent] = useState("");

  const rawContent = Array.isArray(script.content)
    ? script.content.map((s) => `${s.title}: ${s.content}`).join("\n\n")
    : script.content;

  const openHumanizeDialog = (content: string) => {
    setHumanizeScriptContent(content);
    setIsAiDialogOpen(true);
  }

  return (
    <>
      <Card
        id={`script-card-${script.id}`}
        className={cn("rounded-lg shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02] bg-card/50 backdrop-blur-sm border-white/20")}>
        <CardHeader className="flex flex-row items-start justify-between pb-4">
          <CardTitle className="text-xl font-bold leading-tight pr-4">{script.title}</CardTitle>
          <div className="flex items-center gap-1 flex-shrink-0">
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
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {Array.isArray(script.content) ? (
            <div className="space-y-4">
              {script.content.map((sub, index) => (
                <SubScriptItem 
                    key={index} 
                    subScript={sub} 
                    onHumanizeClick={() => openHumanizeDialog(sub.content)}
                />
              ))}
            </div>
          ) : (
            <p className="text-foreground/80 whitespace-pre-wrap">{script.content}</p>
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

interface SubScriptItemProps {
    subScript: SubScript;
    onHumanizeClick: () => void;
}

function SubScriptItemComponent({ subScript, onHumanizeClick }: SubScriptItemProps) {
    const { toast } = useToast();

    const handleCopy = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        // Prevent humanize button click from also copying
        if ((e.target as HTMLElement).closest('button')) return;

        navigator.clipboard.writeText(subScript.content);
        toast({ title: "Copied!" });
    }

    return (
        <div 
            className="p-3 rounded-md bg-background/50 relative group/sub-item border transition-colors sub-item-hoverable copy-cursor"
            onClick={handleCopy}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCopy(e as any)}}
        >
            <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                    <h4 className="font-semibold text-primary transition-colors">{subScript.title}</h4>
                    <p className="text-foreground/80 mt-1 whitespace-pre-wrap">{subScript.content}</p>
                </div>
                <div className="flex-shrink-0 opacity-0 group-hover/sub-item:opacity-100 transition-opacity">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent copy when clicking button
                            onHumanizeClick();
                        }}
                        aria-label="Humanize Script"
                        >
                        <PersonStanding className="h-5 w-5 text-primary" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export const SubScriptItem = React.memo(SubScriptItemComponent);
export const ScriptCard = React.memo(ScriptCardComponent);
