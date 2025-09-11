"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MessageSquare, Send, User, Bot } from "lucide-react";
import { getChatResponse } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const chatSchema = z.object({
  query: z.string().min(1, "Message cannot be empty."),
});

type ChatFormValues = z.infer<typeof chatSchema>;

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

export function ChatAssistantDialog() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<ChatFormValues>({
    resolver: zodResolver(chatSchema),
    defaultValues: {
      query: "",
    },
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [messages])

  const onSubmit = async (values: ChatFormValues) => {
    setIsLoading(true);
    const userMessage: Message = { role: 'user', content: values.query };
    setMessages(prev => [...prev, userMessage]);
    form.reset();

    const result = await getChatResponse({ query: values.query });
    setIsLoading(false);

    if (result.success) {
      const assistantMessage: Message = { role: 'assistant', content: result.data.response };
      setMessages(prev => [...prev, assistantMessage]);
    } else {
      toast({
        variant: "destructive",
        title: "Assistant Error",
        description: result.error,
      });
      setMessages(prev => prev.slice(0, -1)); // Remove user message on error
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
        // Optionally reset state when closing
        // setMessages([]);
        // form.reset();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg" size="icon">
          <MessageSquare className="h-7 w-7" />
          <span className="sr-only">Open Chat Assistant</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Chat Assistant</SheetTitle>
          <SheetDescription>
            Paraphrase text, ask questions, and get instant help.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-grow overflow-hidden">
            <ScrollArea className="h-full" ref={scrollAreaRef}>
                <div className="space-y-4 pr-4">
                    {messages.map((message, index) => (
                        <div key={index} className={cn("flex items-start gap-3", message.role === 'user' ? 'justify-end' : 'justify-start')}>
                           {message.role === 'assistant' && <Bot className="h-6 w-6 text-primary flex-shrink-0" />}
                            <div className={cn("p-3 rounded-lg max-w-sm", message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            </div>
                           {message.role === 'user' && <User className="h-6 w-6 text-foreground flex-shrink-0" />}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-start gap-3 justify-start">
                             <Bot className="h-6 w-6 text-primary flex-shrink-0" />
                             <div className="p-3 rounded-lg bg-muted">
                                <Loader2 className="h-5 w-5 animate-spin" />
                             </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
        <SheetFooter className="mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full items-start gap-2">
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Textarea 
                        placeholder="Type your message..." 
                        {...field} 
                        rows={2}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                form.handleSubmit(onSubmit)();
                            }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} size="icon">
                <Send className="h-5 w-5" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </Form>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
