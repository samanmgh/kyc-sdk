import { useEffect, useState, useMemo, useCallback } from "react";
import { SDKContext } from "./sdk-context";
import { hasParentTheme, injectFallbackCSS } from "./css-detection";
import type { KYCSDKProviderProps, SDKConfig, Theme } from "./provider-types";

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getDocumentTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function KYCSDKProvider({
  children,
  config = {},
  theme: controlledTheme,
  setTheme: controlledSetTheme,
}: KYCSDKProviderProps) {
  const isControlled = controlledTheme !== undefined;

  const [parentHasTheme] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const hasTheme = hasParentTheme();
    if (config.debug) {
      console.log("[KYC SDK] Parent theme detection:", {
        hasParentTheme: hasTheme,
        willInjectFallback: !hasTheme,
      });
    }
    return hasTheme;
  });

  const [internalTheme, setInternalTheme] = useState<Theme>(() => {
    const docTheme = getDocumentTheme();
    if (docTheme === "dark") return "dark";
    return getSystemTheme();
  });

  const theme = isControlled ? controlledTheme : internalTheme;

  useEffect(() => {
    if (parentHasTheme) return;
    const cleanup = injectFallbackCSS(theme);
    if (config.debug) {
      console.log("[KYC SDK] Injected fallback CSS for theme:", theme);
    }
    return cleanup;
  }, [parentHasTheme, theme, config.debug]);

  useEffect(() => {
    if (isControlled) return;
    const observer = new MutationObserver(() => {
      const docTheme = getDocumentTheme();
      setInternalTheme(docTheme);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, [isControlled]);

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

  useEffect(() => {
    if (config.debug) {
      console.log("[KYC SDK] Provider initialized", {
        theme,
        isControlled,
        parentHasTheme,
        config,
      });
    }
  }, [theme, isControlled, parentHasTheme, config]);

  const contextValue = useMemo(
    () => ({
      config: config as SDKConfig,
      theme,
      setTheme,
      toggleTheme,
    }),
    [config, theme, setTheme, toggleTheme]
  );

  return <SDKContext.Provider value={contextValue}>{children}</SDKContext.Provider>;
}

KYCSDKProvider.displayName = "KYCSDKProvider";
