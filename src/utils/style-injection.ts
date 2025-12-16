import type { StyleConfig } from '@/types';

const STYLE_ELEMENT_ID = 'kyc-sdk-custom-styles';

/**
 * Generates CSS string with custom style variables
 */
export function generateCustomStylesCSS(styles: StyleConfig): string {
  const cssVars: string[] = [];

  if (styles.primary) cssVars.push(`--primary: ${styles.primary}`);
  if (styles.radius) cssVars.push(`--radius: ${styles.radius}`);
  if (styles.background) cssVars.push(`--background: ${styles.background}`);
  if (styles.foreground) cssVars.push(`--foreground: ${styles.foreground}`);
  if (styles.border) cssVars.push(`--border: ${styles.border}`);
  if (styles.secondary) cssVars.push(`--secondary: ${styles.secondary}`);
  if (styles.muted) cssVars.push(`--muted: ${styles.muted}`);
  if (styles.destructive) cssVars.push(`--destructive: ${styles.destructive}`);

  if (cssVars.length === 0) return '';

  return `:root { ${cssVars.join('; ')}; }`;
}

export function injectCustomStyles(
  styles: StyleConfig,
  targetDocument: Document = document
): () => void {
  const existing = targetDocument.getElementById(STYLE_ELEMENT_ID);
  if (existing) existing.remove();

  const cssContent = generateCustomStylesCSS(styles);
  if (!cssContent) return () => {};

  const style = targetDocument.createElement('style');
  style.id = STYLE_ELEMENT_ID;
  style.textContent = cssContent;
  targetDocument.head.appendChild(style);

  return () => {
    const el = targetDocument.getElementById(STYLE_ELEMENT_ID);
    if (el) el.remove();
  };
}

/**
 * Dispatches a custom event to notify widget of style changes
 */
export function dispatchStyleChange(styles: StyleConfig): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('widget-style-change', {
        detail: { styles },
      })
    );
  }
}
