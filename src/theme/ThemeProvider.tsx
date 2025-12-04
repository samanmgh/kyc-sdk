import { useEffect, useState, useMemo, useCallback } from "react";
import type { Theme, ResolvedTheme, ThemeProviderProps } from "./types";
import { getSystemTheme, getStoredTheme, setStoredTheme, resolveTheme } from "./utils";

import { ThemeContext } from "./theme-context";

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "kyc-sdk-theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    return getStoredTheme(storageKey) || defaultTheme;
  });

  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme);

  const resolvedTheme = useMemo(() => resolveTheme(theme, systemTheme), [theme, systemTheme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      setStoredTheme(newTheme, storageKey);
    },
    [storageKey]
  );

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      systemTheme,
      resolvedTheme,
      toggleTheme,
    }),
    [theme, setTheme, systemTheme, resolvedTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
