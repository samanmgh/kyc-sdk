import type { ReactNode } from "react";

export interface SDKConfig {
  apiKey?: string;
  debug?: boolean;
  baseUrl?: string;
}

export type Theme = "light" | "dark";

export interface KYCSDKProviderProps {
  children: ReactNode;
  config?: SDKConfig;
  theme?: Theme;
  setTheme?: (theme: Theme) => void;
}

export interface SDKContextValue {
  config: SDKConfig;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}
