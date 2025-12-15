import type { ReactNode } from "react";

export interface SDKConfig {
  apiKey?: string;
  debug?: boolean;
  baseUrl?: string;
}

export type Theme = "light" | "dark";

export type Language = 'en' | 'de';

export interface Translation {
    [key: string]: string | Translation;
}

export interface KYCSDKProviderProps {
  children: ReactNode;
  config?: SDKConfig;
  theme?: Theme;
  setTheme?: (theme: Theme) => void;
}

export interface ThemeContextValue {
  config: SDKConfig;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export interface LanguageContextValue {
    dictionary: Translation;
    language: Language;
    changeLanguage: (lang: Language) => void;
}