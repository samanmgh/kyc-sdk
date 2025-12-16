import themeStyles from '@/styles/theme.scss?raw';

import type { StyleConfig } from '@/types';

import { injectFallbackCSS, injectCustomStyles } from '@/utils';

interface StyleSetupConfig {
  theme: 'light' | 'dark';
  styles?: StyleConfig;
  compiledCSS?: string;
}

/**
 * Copies parent document styles to iframe
 */
function copyParentStylesToIframe(iframeDoc: Document): void {
  const parentStyles = document.querySelectorAll('style, link[rel="stylesheet"]');
  parentStyles.forEach((style) => {
    if (style.tagName === 'STYLE') {
      const newStyle = iframeDoc.createElement('style');
      newStyle.textContent = style.textContent;
      iframeDoc.head.appendChild(newStyle);
    } else if (style.tagName === 'LINK') {
      const link = style as HTMLLinkElement;
      const newLink = iframeDoc.createElement('link');
      newLink.rel = 'stylesheet';
      newLink.href = link.href;
      iframeDoc.head.appendChild(newLink);
    }
  });
}

/**
 * Sets up all styles for the iframe document
 */
export function setupIframeStyles(iframeDoc: Document, config: StyleSetupConfig): void {
  // Inject compiled CSS or copy parent styles
  if (config.compiledCSS) {
    const mainStyle = iframeDoc.createElement('style');
    mainStyle.id = 'kyc-sdk-main-styles';
    mainStyle.textContent = config.compiledCSS;
    iframeDoc.head.appendChild(mainStyle);
  } else {
    copyParentStylesToIframe(iframeDoc);
  }

  // Inject theme SCSS styles
  const themeStyle = iframeDoc.createElement('style');
  themeStyle.id = 'kyc-sdk-theme-styles';
  themeStyle.textContent = themeStyles;
  iframeDoc.head.appendChild(themeStyle);

  // Inject fallback CSS for theme
  injectFallbackCSS(config.theme, iframeDoc);

  // Inject custom styles if provided
  if (config.styles) {
    injectCustomStyles(config.styles, iframeDoc);
  }
}
