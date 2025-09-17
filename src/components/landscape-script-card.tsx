
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

  return (
    <>
      <Card
        id={`script-card-${script.id}`}
        className={cn("rounded-lg shadow-sm transition-all duration-300 hover:shadow-xl bg-card/50 backdrop-blur-sm border-primary/30")}>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold leading-tight pr-4">{script.title}</CardTitle>
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
            <p>This card only supports sub-scripts.</p>
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

    