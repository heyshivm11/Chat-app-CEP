
"use client";

import { useState } from "react";
import type { Script, SubScript } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "./copy-button";
import { AiRefineDialog } from "./ai-refine-dialog";
import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ScriptCardProps {
  script: Script;
}

export function ScriptCard({ script }: ScriptCardProps) {
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const rawContent = Array.isArray(script.content)
    ? script.content.map((s) => `${s.title}: ${s.content}`).join("\n\n")
    : script.content;

  return (
    <>
      <Card
        id={`script-card-${script.id}`}
        className={cn("rounded-lg shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02]")}>
        <CardHeader className="flex flex-row items-start justify-between pb-4">
          <CardTitle className="text-xl font-bold leading-tight pr-4">{script.title}</CardTitle>
          <div className="flex items-center gap-1 flex-shrink-0">
            <CopyButton textToCopy={rawContent} />
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setIsAiDialogOpen(true)}
              aria-label="Refine with AI"
            >
              <Sparkles className="h-5 w-5 text-primary" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {Array.isArray(script.content) ? (
            <div className="space-y-4">
              {script.content.map((sub, index) => (
                <SubScriptItem key={index} subScript={sub} />
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
        script={rawContent}
      />
    </>
  );
}

function SubScriptItem({ subScript }: { subScript: SubScript }) {
    const { toast } = useToast();

    const handleCopy = () => {
        navigator.clipboard.writeText(subScript.content);
        toast({ title: "Copied!" });
    }

    return (
        <div 
            className="p-3 rounded-md bg-background/50 relative group/sub-item border transition-colors sub-item-hoverable copy-cursor"
            onClick={handleCopy}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCopy()}}
        >
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h4 className="font-semibold text-primary transition-colors">{subScript.title}</h4>
                    <p className="text-foreground/80 mt-1 whitespace-pre-wrap">{subScript.content}</p>
                </div>
            </div>
        </div>
    )
}
