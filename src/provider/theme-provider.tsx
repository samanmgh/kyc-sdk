import type { Theme, SDKConfig, KYCSDKProviderProps } from '@/types';

import { injectFallbackCSS } from '@/utils';
import { useMemo, useState, useEffect, useCallback } from 'react';

import { ThemeContext } from './context';

interface ThemeProviderProps extends KYCSDKProviderProps {
  initialTheme?: Theme;
}

export function ThemeProvider({
  children,
  config = {},
  initialTheme = 'dark',
  theme: controlledTheme,
  setTheme: controlledSetTheme,
}: ThemeProviderProps) {
  const isControlled = controlledTheme !== undefined;

  const [internalTheme, setInternalTheme] = useState<Theme>(initialTheme);

  const theme = isControlled ? controlledTheme : internalTheme;

  useEffect(() => {
    const cleanup = injectFallbackCSS(theme);
    if (config.debug) {
      console.log('[KYC SDK] Injected CSS for theme:', theme);
    }
    return cleanup;
  }, [theme, config.debug]);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      if (isControlled && controlledSetTheme) {
        controlledSetTheme(newTheme);
      } else {
        setInternalTheme(newTheme);
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(newTheme);
      }
    },
    [isControlled, controlledSetTheme]
  );

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  useEffect(() => {
    const handleThemeChange = (event: Event) => {
      const { theme: newTheme } = (event as CustomEvent).detail;
      setTheme(newTheme);
    };
    window.addEventListener('widget-theme-change', handleThemeChange);
    return () => window.removeEventListener('widget-theme-change', handleThemeChange);
  }, [setTheme]);

  useEffect(() => {
    if (config.debug) {
      console.log('[KYC SDK] Provider initialized', {
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

ThemeProvider.displayName = 'ThemeProvider';
