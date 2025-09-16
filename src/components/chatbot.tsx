
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2, MessageCircle, Send, Sparkles } from "@/components/ui/lucide-icons";
import { getChatResponse } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatbotProps {
    showCopyReminder: boolean;
}

export function Chatbot({ showCopyReminder }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const result = await getChatResponse({ message: input });

    setIsLoading(false);

    if (result.success) {
      const assistantMessage: Message = {
        role: "assistant",
        content: result.data.message,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } else {
      toast({
        variant: "destructive",
        title: "Chatbot Error",
        description: result.error,
      });
      // Optionally remove the user's message if the API call fails
      setMessages((prev) => prev.slice(0, prev.length -1));
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 z-50">
        <div className={cn("absolute inset-0 rounded-full", showCopyReminder && "animate-sonar")}></div>
        <Button
          onClick={() => setIsOpen(true)}
          className="relative h-16 w-16 rounded-full shadow-lg"
          aria-label="Open Chatbot"
        >
          <MessageCircle className="h-8 w-8" />
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] md:max-w-[600px] flex flex-col h-[70vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="text-primary h-5 w-5" />
              Sarthi
            </DialogTitle>
            <DialogDescription>
              Your personal AI assistant. Ask Sarthi anything about scripts, customer interactions, or policies.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 p-4 pr-6 -mx-6" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-start gap-3",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                    {message.role === 'assistant' && (
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                    )}
                  <div
                    className={cn(
                      "max-w-xs rounded-lg p-3 text-sm md:max-w-md",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {message.content}
                  </div>
                   {message.role === 'user' && (
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>You</AvatarFallback>
                        </Avatar>
                    )}
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg p-3">
                        <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <DialogFooter className="mt-auto pt-4">
            <div className="relative w-full">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="pr-12 h-12"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

    