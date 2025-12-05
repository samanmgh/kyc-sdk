import { useContext } from "react";
import { SDKContext } from "./sdk-context";
import type { SDKContextValue, Theme } from "./provider-types";

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getDefaultContextValue(): SDKContextValue {
  const systemTheme = getSystemTheme();
  if (typeof window !== "undefined") {
    console.warn("[KYC SDK] useSDKConfig must be used within KYCSDKProvider.");
  }
  return {
    config: {},
    theme: systemTheme,
    setTheme: () => console.warn("[KYC SDK] Cannot set theme outside KYCSDKProvider"),
    toggleTheme: () => console.warn("[KYC SDK] Cannot toggle theme outside KYCSDKProvider"),
  };
}

export function useSDKConfig(): SDKContextValue {
  const context = useContext(SDKContext);
  if (!context) return getDefaultContextValue();
  return context;
}

export function useSDKTheme(): Theme {
  const { theme } = useSDKConfig();
  return theme;
}
