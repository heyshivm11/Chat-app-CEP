"use client";

import { useTheme } from "@/components/providers/theme-provider";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";

export function ThemeSwitcher() {
  const { cycleTheme } = useTheme();

  return (
    <Button variant="ghost" size="icon" onClick={cycleTheme}>
      <Palette className="h-5 w-5" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
