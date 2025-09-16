
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";
import { getRefinedScript } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { CopyButton } from "./copy-button";

const refineSchema = z.object({
  context: z.string().max(500, "Context cannot exceed 500 characters."),
  sentiment: z.string().max(50, "Sentiment cannot exceed 50 characters."),
});

type RefineFormValues = z.infer<typeof refineSchema>;

interface AiRefineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  script: string;
}

export function AiRefineDialog({ open, onOpenChange, script }: AiRefineDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [refinedScript, setRefinedScript] = useState<string | null>(null);

  const form = useForm<RefineFormValues>({
    resolver: zodResolver(refineSchema),
    defaultValues: {
      context: "",
      sentiment: "",
    },
  });

  const onSubmit = async (values: RefineFormValues) => {
    setIsLoading(true);
    setRefinedScript(null);
    const result = await getRefinedScript({
      script,
      context: values.context,
      sentiment: values.sentiment,
    });
    setIsLoading(false);

    if (result.success) {
      setRefinedScript(result.data.refinedScript);
    } else {
      toast({
        variant: "destructive",
        title: "Refinement Failed",
        description: result.error,
      });
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset();
      setRefinedScript(null);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="text-primary h-5 w-5" />
            AI Script Refinement
          </DialogTitle>
          <DialogDescription>
            Refine the script based on chat context and customer sentiment.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground">Original Script</h3>
                <p className="text-sm p-3 bg-background/50 rounded-md max-h-24 overflow-y-auto">{script}</p>
            </div>
            <FormField
              control={form.control}
              name="context"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chat Context (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Customer is asking for a refund for a delayed flight." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sentiment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Sentiment (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Frustrated, Anxious" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Refine Script
              </Button>
            </DialogFooter>
          </form>
        </Form>
        {refinedScript && (
          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">Refined Script</h3>
            <div className="relative p-4 bg-primary/10 border border-primary/20 rounded-md">
                <CopyButton textToCopy={refinedScript} className="absolute top-2 right-2"/>
                <p className="text-sm text-foreground pr-8">{refinedScript}</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
