import { useContext } from "react";
import { ThemeContext } from "./theme-context";
import type { ThemeContextValue } from "./types";
import { getSystemTheme } from "./utils";

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    const systemTheme = getSystemTheme();
    console.warn("useTheme must be used within ThemeProvider. Falling back to system theme.");

    return {
      theme: "system",
      systemTheme,
      resolvedTheme: systemTheme,
      setTheme: () => console.warn("Cannot set theme outside ThemeProvider"),
      toggleTheme: () => console.warn("Cannot toggle theme outside ThemeProvider"),
    };
  }

  return context;
}
