"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";

export type Theme = "theme-default" | "theme-black-red" | "theme-black-green" | "theme-black-white" | "theme-white-red" | "theme-cyberpunk-glow" | "theme-electric-xtra" | "theme-solaris-flare" | "theme-forest-whisper";
export const themeNames: { [key in Theme]: string } = {
  "theme-default": "Midnight Blue",
  "theme-black-red": "Crimson Night",
  "theme-black-green": "Emerald Dark",
  "theme-black-white": "Monochrome",
  "theme-white-red": "Scarlet Light",
  "theme-cyberpunk-glow": "Cyberpunk Glow",
  "theme-electric-xtra": "Electric Xtra",
  "theme-solaris-flare": "Solaris Flare",
  "theme-forest-whisper": "Forest Whisper",
};

const themeKeys = Object.keys(themeNames) as Theme[];


type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  cycleTheme: () => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("theme-default");

  useEffect(() => {
    const storedTheme = localStorage.getItem("scriptify-theme") as Theme | null;
    if (storedTheme && Object.keys(themeNames).includes(storedTheme)) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.className = ''; 

    if (!theme.startsWith('theme-white')) {
      root.classList.add('dark');
    }
    
    root.classList.add(theme);
    localStorage.setItem("scriptify-theme", theme);
  }, [theme]);

  const cycleTheme = () => {
    const currentIndex = themeKeys.indexOf(theme);
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * themeKeys.length);
    } while (nextIndex === currentIndex);
    setTheme(themeKeys[nextIndex]);
  };

  const value = useMemo(() => ({ theme, setTheme, cycleTheme }), [theme]);

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
