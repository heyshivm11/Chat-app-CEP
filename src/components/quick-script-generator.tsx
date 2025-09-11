"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { getQuickScript } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { CopyButton } from "./copy-button";

const generatorSchema = z.object({
  prompt: z.string().min(10, "Prompt must be at least 10 characters.").max(200, "Prompt cannot exceed 200 characters."),
});

type GeneratorFormValues = z.infer<typeof generatorSchema>;

export function QuickScriptGenerator() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);

  const form = useForm<GeneratorFormValues>({
    resolver: zodResolver(generatorSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const onSubmit = async (values: GeneratorFormValues) => {
    setIsLoading(true);
    setGeneratedScript(null);
    const result = await getQuickScript({
      prompt: values.prompt,
    });
    setIsLoading(false);

    if (result.success) {
      setGeneratedScript(result.data.script);
    } else {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: result.error,
      });
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center gap-2">
            <Wand2 className="text-primary h-6 w-6" />
            <CardTitle>Quick Script Generator</CardTitle>
        </div>
        <CardDescription>Generate a script on the fly with AI.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="e.g., Write a friendly closing for a happy customer named John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Generate
                </Button>
            </div>
          </form>
        </Form>
        {generatedScript && (
          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">Generated Script</h3>
            <div className="relative p-4 bg-primary/10 border border-primary/20 rounded-md">
                <CopyButton textToCopy={generatedScript} className="absolute top-2 right-2"/>
                <p className="text-sm text-foreground pr-8">{generatedScript}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
