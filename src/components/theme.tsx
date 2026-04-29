import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";
type AccentTheme = 
  | "theme1" 
  | "theme2" 
  | "theme3" 
  | "theme4" 
  | "theme5" 
  | "theme6" 
  | "theme7" 
  | "theme8" 
  | "theme9" 
  | "theme10";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultAccentTheme?: AccentTheme;
  storageKey?: string;
  accentStorageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  accentTheme: AccentTheme;
  setTheme: (theme: Theme) => void;
  setAccentTheme: (theme: AccentTheme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  accentTheme: "theme1",
  setTheme: () => null,
  setAccentTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light",
  defaultAccentTheme = "theme1",
  storageKey = "vite-ui-theme",
  accentStorageKey = "vite-ui-accent-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  const [accentTheme, setAccentTheme] = useState<AccentTheme>(
    () => (localStorage.getItem(accentStorageKey) as AccentTheme) || defaultAccentTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute("data-theme", accentTheme);
  }, [accentTheme]);

  const value = {
    theme,
    accentTheme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    setAccentTheme: (theme: AccentTheme) => {
      localStorage.setItem(accentStorageKey, theme);
      setAccentTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
