
"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";

export type Theme = "theme-settleup";
export const themeNames: { [key in Theme]: string } = {
  "theme-settleup": "SettleUp",
};

const themeKeys = Object.keys(themeNames) as Theme[];


type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  cycleTheme: () => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("theme-settleup");

  useEffect(() => {
    const storedTheme = localStorage.getItem("cep-theme") as Theme | null;
    if (storedTheme && Object.keys(themeNames).includes(storedTheme)) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.className = '';

    if (theme === 'theme-settleup') {
        // default to light theme for settleup
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
       root.classList.add('dark');
    }


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
