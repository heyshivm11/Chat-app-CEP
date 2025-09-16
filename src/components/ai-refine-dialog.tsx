
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, PersonStanding, Sparkles } from "@/components/ui/lucide-icons";
import { getRefinedScript } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { CopyButton } from "./copy-button";
import type { RefineScriptOutput } from "@/app/ai-schemas";


interface AiRefineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  script: string;
}

export function AiRefineDialog({ open, onOpenChange, script }: AiRefineDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [refinedResult, setRefinedResult] = useState<RefineScriptOutput | null>(null);

  const handleHumanize = async () => {
    setIsLoading(true);
    setRefinedResult(null);
    const result = await getRefinedScript({ script });
    setIsLoading(false);

    if (result.success) {
      setRefinedResult(result.data);
    } else {
      toast({
        variant: "destructive",
        title: "Humanize Failed",
        description: result.error,
      });
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setRefinedResult(null);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PersonStanding className="text-primary h-5 w-5" />
            Humanize Script
          </DialogTitle>
          <DialogDescription>
            Get a more natural-sounding, conversational version of the script. Each time you click, you'll get a new variation.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
            <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground">Original Script</h3>
                <p className="text-sm p-3 bg-background/50 rounded-md max-h-24 overflow-y-auto">{script}</p>
            </div>
            
            {refinedResult && (
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-muted-foreground">Humanized Script</h3>
                    <div className="relative p-4 bg-primary/10 border border-primary/20 rounded-md">
                        <CopyButton textToCopy={refinedResult.refinedScript} className="absolute top-2 right-2"/>
                        <p className="text-sm text-foreground pr-8">{refinedResult.refinedScript}</p>
                    </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Refinement Reason
                  </h3>
                  <p className="text-xs p-3 bg-accent/50 rounded-md text-muted-foreground">{refinedResult.refinementReason}</p>
                </div>
              </div>
            )}
        </div>

        <DialogFooter>
          <Button onClick={handleHumanize} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <PersonStanding className="mr-2 h-4 w-4" />
            )}
            {refinedResult ? 'Get Another Version' : 'Humanize Script'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
