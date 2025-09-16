
"use client";

import { useTheme } from "@/components/providers/theme-provider";
import { Button } from "@/components/ui/button";
import { Palette } from "@/components/ui/lucide-icons";

export function ThemeSwitcher() {
  const { cycleTheme } = useTheme();

  return (
    <Button variant="ghost" size="icon" onClick={cycleTheme}>
        <Palette className="h-6 w-6" />
        <span className="sr-only">Cycle Theme</span>
    </Button>
  );
}
