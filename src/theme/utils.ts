export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "kyc-sdk-theme";

export function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getStoredTheme(storageKey = STORAGE_KEY): Theme | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(storageKey) as Theme | null;
  } catch {
    return null;
  }
}

export function setStoredTheme(theme: Theme, storageKey = STORAGE_KEY): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKey, theme);
  } catch (error) {
    console.warn("Failed to save theme preference:", error);
  }
}

export function resolveTheme(theme: Theme, systemTheme: ResolvedTheme): ResolvedTheme {
  return theme === "system" ? systemTheme : theme;
}
