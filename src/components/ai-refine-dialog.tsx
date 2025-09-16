
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
import { Loader2, PersonStanding } from "@/components/ui/lucide-icons";
import { getRefinedScript } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { CopyButton } from "./copy-button";


interface AiRefineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  script: string;
}

export function AiRefineDialog({ open, onOpenChange, script }: AiRefineDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [refinedScript, setRefinedScript] = useState<string | null>(null);

  const handleHumanize = async () => {
    setIsLoading(true);
    setRefinedScript(null);
    const result = await getRefinedScript({ script });
    setIsLoading(false);

    if (result.success) {
      setRefinedScript(result.data.refinedScript);
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
      setRefinedScript(null);
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
            
            {refinedScript && (
              <div className="mt-4 space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground">Humanized Script</h3>
                <div className="relative p-4 bg-primary/10 border border-primary/20 rounded-md">
                    <CopyButton textToCopy={refinedScript} className="absolute top-2 right-2"/>
                    <p className="text-sm text-foreground pr-8">{refinedScript}</p>
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
            {refinedScript ? 'Get Another Version' : 'Humanize Script'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
