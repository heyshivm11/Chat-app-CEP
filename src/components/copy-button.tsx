
"use client";

import { useState } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomCopyButtonProps extends ButtonProps {
  textToCopy: string;
}

export function CopyButton({ textToCopy, className, children, ...props }: CustomCopyButtonProps) {
  const [hasCopied, setHasCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(textToCopy);
    setHasCopied(true);
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  };

  if (children) {
    return (
        <Button
        variant="default"
        onClick={copyToClipboard}
        className={cn("copy-cursor", className)}
        aria-label="Copy details"
        {...props}
        >
        {hasCopied ? <Check className="mr-2 h-4 w-4" /> : children}
        </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={copyToClipboard}
      className={cn("h-7 w-7 copy-cursor hover:bg-primary/10", className)}
      aria-label="Copy script"
      {...props}
    >
      {hasCopied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );
}
