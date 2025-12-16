/**
 * Event Bridge
 * Handles event communication between parent window and iframe
 * Provides cleanup function to prevent memory leaks
 */

import { injectFallbackCSS, injectCustomStyles } from '@/utils';

interface EventBridgeConfig {
  iframe: HTMLIFrameElement;
  iframeDoc: Document;
  theme: 'light' | 'dark';
}

const BRIDGED_EVENTS = ['widget-theme-change', 'widget-language-change', 'widget-style-change'];

/**
 * Sets up event bridging between parent window and iframe
 * Returns cleanup function to remove all event listeners
 */
export function setupEventBridge(config: EventBridgeConfig): () => void {
  const cleanupFunctions: Array<() => void> = [];

  BRIDGED_EVENTS.forEach((eventName) => {
    const handler = (event: Event) => {
      config.iframe.contentWindow?.dispatchEvent(
        new CustomEvent(eventName, { detail: (event as CustomEvent).detail })
      );
    };
    window.addEventListener(eventName, handler);
    cleanupFunctions.push(() => window.removeEventListener(eventName, handler));
  });

  const handleStyleChange = (event: Event) => {
    const { styles: newStyles } = (event as CustomEvent).detail;
    injectCustomStyles(newStyles, config.iframeDoc);
  };
  config.iframe.contentWindow?.addEventListener('widget-style-change', handleStyleChange);
  cleanupFunctions.push(() =>
    config.iframe.contentWindow?.removeEventListener('widget-style-change', handleStyleChange)
  );

  const handleThemeChange = (event: Event) => {
    const { theme: newTheme } = (event as CustomEvent).detail;
    injectFallbackCSS(newTheme, config.iframeDoc);

    if (newTheme === 'dark') {
      config.iframeDoc.documentElement.classList.add('dark');
    } else {
      config.iframeDoc.documentElement.classList.remove('dark');
    }
  };
  config.iframe.contentWindow?.addEventListener('widget-theme-change', handleThemeChange);
  cleanupFunctions.push(() =>
    config.iframe.contentWindow?.removeEventListener('widget-theme-change', handleThemeChange)
  );

  return () => {
    cleanupFunctions.forEach((cleanup) => cleanup());
  };
}
