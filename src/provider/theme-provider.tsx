import { useEffect, useState, useMemo, useCallback } from "react";
import { ThemeContext } from "./context";
import { injectFallbackCSS } from "../utils";
import type { KYCSDKProviderProps, SDKConfig, Theme } from "../types";

interface ThemeProviderProps extends KYCSDKProviderProps {
  initialTheme?: Theme;
}

export function ThemeProvider({
  children,
  config = {},
  initialTheme = "dark",
  theme: controlledTheme,
  setTheme: controlledSetTheme,
}: ThemeProviderProps) {
  const isControlled = controlledTheme !== undefined;

  const [internalTheme, setInternalTheme] = useState<Theme>(initialTheme);

  const theme = isControlled ? controlledTheme : internalTheme;

  // Inject CSS variables whenever theme changes
  useEffect(() => {
    const cleanup = injectFallbackCSS(theme);
    if (config.debug) {
      console.log("[KYC SDK] Injected CSS for theme:", theme);
    }
    return cleanup;
  }, [theme, config.debug]);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      if (isControlled && controlledSetTheme) {
        controlledSetTheme(newTheme);
      } else {
        setInternalTheme(newTheme);
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(newTheme);
      }
    },
    [isControlled, controlledSetTheme]
  );

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  // Listen for theme change events from SDK
  useEffect(() => {
    const handleThemeChange = (event: Event) => {
      const { theme: newTheme } = (event as CustomEvent).detail;
      setTheme(newTheme);
    };
    window.addEventListener("widget-theme-change", handleThemeChange);
    return () => window.removeEventListener("widget-theme-change", handleThemeChange);
  }, [setTheme]);

  useEffect(() => {
    if (config.debug) {
      console.log("[KYC SDK] Provider initialized", {
        theme,
        isControlled,
        config,
      });
    }
  }, [theme, isControlled, config]);

  const contextValue = useMemo(
    () => ({
      config: config as SDKConfig,
      theme,
      setTheme,
      toggleTheme,
    }),
    [config, theme, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}

ThemeProvider.displayName = "ThemeProvider";
