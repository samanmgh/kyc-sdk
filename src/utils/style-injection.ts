import type { StyleConfig } from '../types/widget';

const STYLE_ELEMENT_ID = 'kyc-sdk-custom-styles';

/**
 * Injects custom CSS variables into the document
 * @param styles - StyleConfig object with custom values
 * @param targetDocument - Document to inject styles into (defaults to window.document)
 * @returns Cleanup function to remove injected styles
 */
export function injectCustomStyles(
    styles: StyleConfig,
    targetDocument: Document = document
): () => void {
    // Remove existing custom styles
    const existing = targetDocument.getElementById(STYLE_ELEMENT_ID);
    if (existing) existing.remove();

    // Build CSS variable overrides
    const cssVars: string[] = [];

    if (styles.primary) cssVars.push(`--primary: ${styles.primary}`);
    if (styles.radius) cssVars.push(`--radius: ${styles.radius}`);
    if (styles.background) cssVars.push(`--background: ${styles.background}`);
    if (styles.foreground) cssVars.push(`--foreground: ${styles.foreground}`);
    if (styles.border) cssVars.push(`--border: ${styles.border}`);
    if (styles.secondary) cssVars.push(`--secondary: ${styles.secondary}`);
    if (styles.muted) cssVars.push(`--muted: ${styles.muted}`);
    if (styles.destructive) cssVars.push(`--destructive: ${styles.destructive}`);

    if (cssVars.length === 0) return () => {};

    // Create and inject style element
    const style = targetDocument.createElement('style');
    style.id = STYLE_ELEMENT_ID;
    style.textContent = `:root { ${cssVars.join('; ')}; }`;
    targetDocument.head.appendChild(style);

    // Return cleanup function
    return () => {
        const el = targetDocument.getElementById(STYLE_ELEMENT_ID);
        if (el) el.remove();
    };
}

/**
 * Dispatches a custom event to notify widget of style changes
 * @param styles - StyleConfig object with new values
 */
export function dispatchStyleChange(styles: StyleConfig): void {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('widget-style-change', {
            detail: { styles }
        }));
    }
}
