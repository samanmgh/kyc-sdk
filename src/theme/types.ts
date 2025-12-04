export type Theme = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

export interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  systemTheme: ResolvedTheme
  resolvedTheme: ResolvedTheme
  toggleTheme: () => void
}
