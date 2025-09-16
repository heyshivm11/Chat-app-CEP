
"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";

export type Theme = "light" | "dark" | "theme-neutral" | "theme-ocean";
export const themeNames: { [key in Theme]: string } = {
  "light": "Default Light",
  "dark": "Default Dark",
  "theme-neutral": "Neutral",
  "theme-ocean": "Ocean Vibe",
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
    
    // For dark and neutral, we need to handle which class is applied.
    if (theme === 'dark' || theme === 'theme-neutral' || theme === 'theme-ocean') {
        if (theme === 'dark') {
            root.classList.add('dark');
            // Ensure other theme classes are removed
            themeKeys.forEach(t => {
                if (t !== 'dark') root.classList.remove(t);
            });
        } else { // theme is 'theme-neutral' or 'theme-ocean'
             root.classList.add(theme);
             root.classList.remove('dark'); // A neutral theme may not be dark
        }
    } else {
        // It's the light theme
        root.classList.remove(...themeKeys);
    }
    
    // Always add the specific theme class for non-default themes
    if(theme !== 'light' && theme !== 'dark') {
        root.classList.add(theme);
    }


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
