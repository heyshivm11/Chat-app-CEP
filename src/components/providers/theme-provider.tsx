
"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";

export type Theme = "light" | "dark" | "theme-amethyst" | "theme-sunrise" | "theme-lime";
export const themeNames: { [key in Theme]: string } = {
  "light": "Light",
  "dark": "Dark",
  "theme-amethyst": "Amethyst",
  "theme-sunrise": "Sunrise",
  "theme-lime": "Lime",
};

const themeKeys = Object.keys(themeNames) as Theme[];


type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  cycleTheme: () => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("cep-theme") as Theme | null;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const defaultTheme = (storedTheme || (prefersDark ? 'dark' : 'light')) as Theme;
    
    if (Object.keys(themeNames).includes(defaultTheme)) {
      setTheme(defaultTheme);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(...themeKeys);
    root.classList.add(theme);
    localStorage.setItem("cep-theme", theme);
  }, [theme]);

  const cycleTheme = () => {
    const currentIndex = themeKeys.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
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
