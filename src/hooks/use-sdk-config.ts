import type { Theme, ThemeContextValue } from '@/types';

import { useContext } from 'react';
import { ThemeContext } from '@/provider/context';

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getDefaultContextValue(): ThemeContextValue {
  const systemTheme = getSystemTheme();
  if (typeof window !== 'undefined') {
    console.warn('[KYC SDK] useSDKConfig must be used within ThemeProvider.');
  }
  return {
    config: {},
    theme: systemTheme,
    setTheme: () => console.warn('[KYC SDK] Cannot set theme outside ThemeProvider'),
    toggleTheme: () => console.warn('[KYC SDK] Cannot toggle theme outside ThemeProvider'),
  };
}

export function useSDKConfig(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) return getDefaultContextValue();
  return context;
}

export function useSDKTheme(): Theme {
  const { theme } = useSDKConfig();
  return theme;
}
