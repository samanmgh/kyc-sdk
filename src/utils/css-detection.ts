const REQUIRED_CSS_VARS = [
  '--background',
  '--foreground',
  '--primary',
  '--primary-foreground',
  '--secondary',
  '--muted',
  '--border',
  '--ring',
] as const;

function isCSSVarDefined(varName: string): boolean {
  if (typeof window === 'undefined') return false;
  const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return value !== '';
}

export function hasParentTheme(): boolean {
  if (typeof window === 'undefined') return false;
  return REQUIRED_CSS_VARS.every(isCSSVarDefined);
}

export function getMissingCSSVars(): string[] {
  if (typeof window === 'undefined') return [...REQUIRED_CSS_VARS];
  return REQUIRED_CSS_VARS.filter((v) => !isCSSVarDefined(v));
}

export const DEFAULT_LIGHT_VARS: Record<string, string> = {
  '--background': '#ffffff',
  '--foreground': 'oklch(0.2 0 0)',
  '--card': 'oklch(1 0 0)',
  '--card-foreground': 'oklch(0.2 0 0)',
  '--popover': 'oklch(1 0 0)',
  '--popover-foreground': 'oklch(0.2 0 0)',
  '--primary': 'oklch(0.55 0.22 264)',
  '--primary-foreground': 'oklch(1 0 0)',
  '--secondary': 'oklch(0.97 0 0)',
  '--secondary-foreground': 'oklch(0.2 0 0)',
  '--muted': 'oklch(0.97 0 0)',
  '--muted-foreground': 'oklch(0.5 0.02 264)',
  '--accent': 'oklch(0.97 0 0)',
  '--accent-foreground': 'oklch(0.2 0 0)',
  '--destructive': 'oklch(0.577 0.245 27.325)',
  '--destructive-foreground': 'oklch(1 0 0)',
  '--border': 'oklch(0.9 0 0)',
  '--input': 'oklch(0.9 0 0)',
  '--ring': 'oklch(0.55 0.22 264)',
  '--radius': '0.625rem',
};

export const DEFAULT_DARK_VARS: Record<string, string> = {
  '--background': '#000000',
  '--foreground': 'oklch(0.97 0 0)',
  '--card': 'oklch(0.25 0 0)',
  '--card-foreground': 'oklch(0.97 0 0)',
  '--popover': 'oklch(0.25 0 0)',
  '--popover-foreground': 'oklch(0.97 0 0)',
  '--primary': 'oklch(0.55 0.22 264)',
  '--primary-foreground': 'oklch(1 0 0)',
  '--secondary': 'oklch(0.3 0 0)',
  '--secondary-foreground': 'oklch(0.97 0 0)',
  '--muted': 'oklch(0.3 0 0)',
  '--muted-foreground': 'oklch(0.65 0.02 264)',
  '--accent': 'oklch(0.35 0 0)',
  '--accent-foreground': 'oklch(0.97 0 0)',
  '--destructive': 'oklch(0.577 0.245 27.325)',
  '--destructive-foreground': 'oklch(0.97 0 0)',
  '--border': 'oklch(0.32 0 0)',
  '--input': 'oklch(0.35 0 0)',
  '--ring': 'oklch(0.55 0.22 264)',
  '--radius': '0.625rem',
};

/**
 * Generates CSS string with fallback variables for the given theme
 * @param theme - 'light' or 'dark'
 * @returns CSS string with :root variables
 */
export function generateFallbackCSS(theme: 'light' | 'dark'): string {
  const vars = theme === 'dark' ? DEFAULT_DARK_VARS : DEFAULT_LIGHT_VARS;
  return `:root { ${Object.entries(vars)
    .map(([k, v]) => `${k}: ${v};`)
    .join(' ')} }`;
}

export function injectFallbackCSS(
  theme: 'light' | 'dark',
  targetDocument: Document = document
): () => void {
  if (typeof window === 'undefined') return () => {};

  const styleId = 'kyc-sdk-fallback-vars';

  const existing = targetDocument.getElementById(styleId);
  if (existing) existing.remove();

  const style = targetDocument.createElement('style');
  style.id = styleId;
  style.textContent = generateFallbackCSS(theme);

  targetDocument.head.appendChild(style);

  return () => {
    const el = targetDocument.getElementById(styleId);
    if (el) el.remove();
  };
}
